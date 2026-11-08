# Changelog

## [1.1.0] - 2026-11-08

Five new features, each built on Google and each tested.

### Saathi Scan
- The family photographs a prescription or a strip of tablets. **Gemini** reads it, including Indian dosing notes such as "1-0-1", OD, BD, TDS, HS, before food and after food, and fills in the tablet list for the family to check before anything is saved.
- Saathi warns about a tablet she already takes under another name, and about a short, careful list of well-known risky pairs (warfarin with painkillers, two painkillers together, and others). It never says a combination is safe.

### Saathi Haq (her rights)
- From her year of birth, pension and cards, Saathi lists what she is entitled to: the yearly pension life certificate (Jeevan Pramaan, from 1 October for those 80 and over), Ayushman Vay Vandana at 70, the national old-age pension, and Maharashtra's Shravanbal scheme.
- The family is reminded weekly while the life certificate is due, and can book a Didi to help with it.
- **"What does this letter say?"**: Aaji photographs an official letter or message; Gemini explains it plainly in her language and says when it looks like a scam, which goes to Scam Shield.

### Saathi Raksha (fall and stillness checks)
- The Android app notices a likely fall from the phone's motion sensor (a free fall, an impact, then stillness) and, if the family turns it on, long stillness during the day.
- Aaji is asked "Are you all right?" on her screen and in a notification. If she does not answer in 45 seconds, or asks for help, the help escalation starts, with her location when shared.

### Saathi Sangat (circles)
- A ready Saathi Didi can host a small circle (3 to 10 elders) on **Google Meet**, in their language, at a set time, for a monthly fee paid to her by UPI.
- Families find circles in Aaji's city and language and join. Aaji gets a reminder ten minutes before and joins with one button; the family hears she attended. Gemini suggests topics for the host.

### Doctor Notes
- With the doctor's consent, the family or the escorting Didi records the advice at the end of a visit. Gemini listens and writes a short summary: what changed, tablets to start or stop, tests, warning signs and the next visit.
- Aaji hears it in her language and the family reads it in theirs. One tap applies the tablet changes and the next appointment. Notes are kept with her other health records under the sealed health-data plan.

### Underneath
- Gemini now reads photos and audio directly and answers in JSON mode.
- Photo and audio uploads have their own size limits and an hourly rate limit, separate from the 1 MB JSON limit.
- New accessibility scenarios for the family cards and the Raksha check.

## [1.0.0] - 2026-11-08

**Saathi on Google 1.0.0 is Saathi 1.4.0 (with Sahay) plus Saathi Didis, rebuilt on Google.** Every feature of Saathi 1.4.0 carries over: Scam Guard with Sahay on Windows and Android, the Scam Shield Network, Saathi Insight and the doctor report, Family Voice, Living Legacy, Saathi Calls, the assistant that acts, passkeys, end-to-end encrypted private messages and the audit log.

### On Google
- **Gemini** is Saathi's brain: the voice companion, the family assistant and the Didi briefings, through the Gemini API (free key) or **Vertex AI** with the service account. Saathi's MCP tools are turned into Gemini function calls, and thought signatures are kept across turns.
- **Firestore** stores every household, booking and Didi. **Cloud Translation**, **Natural Language** and **Text-to-Speech** handle languages, mood and voice (with real Marathi, Tamil and Bengali voices). **Pub/Sub** carries care events and **Cloud Storage** keeps voice notes behind short-lived signed links.
- **Firebase Authentication** handles email and password accounts, next to Google sign-in.
- **Cloud Run** in one command: `npm run deploy` enables the APIs; creates Firestore, a private bucket, the Pub/Sub topic and a least-privilege service account; reads secrets from **Secret Manager**; and deploys.
- **Cloud Logging**: metrics are structured log lines.
- The egress allowlist now covers Google services only, plus the Cloud Run metadata server when running on Cloud Run.
- Without a key the Ring webhook used a shared default secret; it now gets a private one derived from the session secret.

### Saathi Didis
- **Paid care work for women in the elder's own neighbourhood.** A Didi signs up in English, Hindi or Marathi with her skills, her own fees and her UPI ID. A partner code from her SHG or NGO verifies her, and three short lessons make her ready.
- **Google Maps (Routes API)** matches families with Didis by real travel time (within 40 minutes, nearest first), and falls back to the same city if Maps is unavailable.
- The family books from the care view. The Didi accepts, reads a Gemini-written briefing in her language (only what the family shares), checks in and leaves a note. The elder and the family are told at each step, and the note reaches the family in English.
- The family pays the Didi directly with a UPI link and rates the visit; she sees her visits, earnings and rating.

### For the elder
- **Gemini Live**: "Talk live with Saathi" on the elder's screen. Aaji just talks, in Marathi, Hindi or English, and can interrupt. Saathi's tools (tablets, messages, help) work mid-conversation, and she is asked before anything is sent. The browser gets a single-use, 30-minute token; the API key never leaves the server.

### Didi safety and growth
- **Phone sign-in** with Firebase Authentication: no email needed.
- **SOS** during every visit: the whole family circle gets a critical alert (and a phone notification), and she gets one-tap calls to 112 and her safety contact.
- **Overdue visits**: if she has not checked out long after the usual time, the family is asked to check and she gets a notification.
- **She rates families too**, and can stop seeing a family's requests.
- **Spoken visit notes**: she records in Marathi; Speech-to-Text writes it down; the family reads it in English.
- **Her Saathi card**: a profile card made with Gemini image generation (or a clean fallback), to share on WhatsApp.
- **Notifications** for new requests near her (Firebase Cloud Messaging).

### For the family
- **Phone notifications** for help alerts, missed tablets, Didi visits and SOS, even when the app is closed.

### Underneath
- **Cloud Workflows** runs help escalations (family, then neighbour, then emergency guidance), calling Saathi back with a Google-signed token that only Saathi's own service account can produce.
- **Impact dashboard** (`/impact.html`): live totals with no personal details; every care event also streams to **BigQuery** through a Pub/Sub subscription.
- `npm run deploy -- --demo` publishes a public demo for judges.
