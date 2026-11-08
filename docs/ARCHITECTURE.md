# Saathi architecture (Google)

## Layers

```
src/
  domain/        what Saathi does: orientation, tablets, check-ins, escalation, messages, stories, doorbell signals
  didis/         Saathi Didis: sign-up, lessons, matching, bookings, briefings, visits, UPI payment, earnings
  mcp/           the MCP surface: tools, resources, templates, prompts, subscriptions, logging
  auth/          per-tool scopes for household device keys and static tokens
  http/          Express: Streamable HTTP, doorbell webhook, family, Didi and voice-screen APIs, SSE
  escalation/    one escalation flow definition and the interpreter that runs it
  google/        an adapter per Google capability: Gemini, Firestore, Translation, Natural Language,
                 Text-to-Speech, Pub/Sub, Cloud Storage, Maps, Firebase Authentication, Cloud Logging
  local/         the same capabilities offline, so the tests and the demo need no cloud account
  agent/         Saathi's voice and family assistants: MCP client + Gemini, or an offline planner
  ring/          webhook signing and verification, and the simulated doorbell
core/            the Rust permission rules, compiled to WebAssembly and proven with Kani and TLA+
evals/           multilingual safety and routing evals
```

The domain never imports a cloud SDK. `src/services.js` picks an adapter for each capability from config flags, so every Google service can be switched on independently and the tests run fully offline.

## A fall, end to end

```mermaid
sequenceDiagram
  autonumber
  participant Aaji
  participant Voice as Saathi voice (Gemini + MCP)
  participant Run as Saathi on Cloud Run
  participant FS as Firestore
  participant PS as Pub/Sub
  participant Riya as Riya's phone
  participant Door as Doorbell (Ring or Nest)

  Aaji->>Voice: "मदत करा, मी पडले" (help, I fell)
  Voice->>Run: tools/call ask_family_for_help
  Run->>FS: open alert in the last 10 minutes? (retry safety)
  Run->>FS: put alert
  Run->>PS: HelpRequested {escalation}
  Run-->>Voice: "I'm calling your family now..."
  Run->>FS: stage = family-notified
  Run-->>Riya: email (Gmail) and an alert in the family app
  Run->>Run: wait familyWait
  Run->>FS: acknowledged?
  alt Riya taps "I'm on it"
    Riya->>Run: acknowledge alert
    Run->>FS: acknowledged = true, stage = resolved
  else nobody answers
    Run-->>Riya: neighbour alerted
    Door->>Run: ding (HMAC-signed webhook)
    Run->>FS: acknowledged by front-door
    Run-->>Aaji: "Someone is at your door, it may be Meera"
  end
```

The escalation runs inside the service, which keeps one instance warm with CPU always allocated (`--min-instances=1 --no-cpu-throttling`), and every step is written to Firestore, so the family app shows exactly where it is.

## A Didi visit, end to end

```mermaid
sequenceDiagram
  participant Anand as Anand (family app)
  participant Run as Saathi on Cloud Run
  participant Maps as Google Maps (Routes API)
  participant Sunita as Sunita (Didi app)
  participant Gemini
  participant Aaji
  Anand->>Run: who can help near Aaji?
  Run->>Maps: travel time from each ready Didi to Aaji's home
  Run-->>Anand: Didis within 40 minutes, nearest first, with rating and fee
  Anand->>Run: book Sunita, Thursday 11:00, doctor escort, share tablets
  Sunita->>Run: accept
  Run-->>Aaji: "Sunita will take you to the doctor on Thursday" (in Marathi)
  Sunita->>Run: briefing
  Run->>Gemini: rewrite these facts warmly in Marathi, add nothing
  Run-->>Sunita: address, doctor, tablets, how to help, emergency number
  Sunita->>Run: check in / check out with a visit note
  Run-->>Anand: "Sunita visited Aaji" + note in English, Pay with UPI
```

## Elicitation: nothing leaves the house by accident

```mermaid
sequenceDiagram
  participant Aaji
  participant Device as Saathi voice screen
  participant MCP as Saathi MCP
  Aaji->>Device: "Tell Riya I'm proud of her"
  Device->>MCP: tools/call send_message_to_family
  MCP->>Device: elicitation/create "Shall I send this to Riya?"
  Device->>Aaji: speaks the question, shows big Yes / No
  Aaji->>Device: "हो, पाठवा" (yes, send it)
  Device->>MCP: {action: accept, content: {send: true}}
  MCP->>MCP: translate per recipient (Cloud Translation)
  MCP-->>Device: "I've sent it to Riya."
```

## Why each Google service is there

| Service | Job | Why this and not something simpler |
|---|---|---|
| Cloud Run | The whole service: web apps, MCP, webhooks, sweeps | One container, scales out, HTTPS by default; one warm instance keeps reminders and escalations running |
| Gemini (API or Vertex AI) | Understanding Aaji, planning tool calls, the family assistant, Didi briefings | Function calling over the same MCP tools; Hindi and Marathi understood natively |
| Firestore | All household and Didi state | Serverless, transactional updates, Google-managed encryption |
| Cloud Translation | Every message, story, check-in and visit note | Auto-detects Marathi vs Hindi |
| Natural Language | Check-in sentiment | Languages it does not cover go through Translation first |
| Text-to-Speech | Replies and reminders read aloud | Real Marathi, Hindi, Tamil and Bengali voices; slower speech for hearing loss |
| Pub/Sub | The care-event stream | Every event (help, doses, Didi arrivals) can feed analytics or other services without touching Saathi |
| Cloud Storage | Voice notes, Family Voice, narrations | Private bucket, short-lived V4 signed links |
| Maps (Routes API) | Matching Didis by real travel time | "Nearest" means 12 minutes by scooter, not the same city name |
| Firebase Authentication | Email and password accounts | Managed password storage and verification emails; Google sign-in works alongside |
| Secret Manager | Keys and secrets | Never in code or in plain environment variables |
| Cloud Logging | Structured logs and metrics | Log-based metrics and alerts for failed escalations |

## What stays on the family's own computer

Sahay (Windows and Android) watches for scams and helps with technology on the elder's own device, and reports to Saathi only through a direct connection from that computer. The Windows install keeps its key in the computer's TPM through the Rust key broker; the hosted Cloud Run service relies on Firestore's encryption and Secret Manager instead.
