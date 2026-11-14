# Changelog

## [1.4.2] - 2026-11-14

### Set up email and AI from the Start menu
- A new **"Set up email and AI"** shortcut in the Windows Start menu (also `saathi.exe --setup`) asks for a Gmail address and app password (or another email provider) and a Gemini API key. Keys are typed hidden and saved only on this computer.
- When it finishes, Saathi stops so the next start uses the new settings: invites, help alerts and "Forgot password?" emails then reach real inboxes, and Gemini powers the assistants.

## [1.4.1] - 2026-11-11

### Windows installer fixes
- Installing over an older Saathi no longer stops with "Access is denied": the installer now closes every running Saathi process, including its own Node.js, before replacing files.
- The "Where is my key" shortcut no longer has a question mark in its name, which Windows does not allow and which made setup fail at "Creating shortcuts".

## [1.4.0] - 2026-11-11

### Forgot your password?
- **"Forgot password?" on the login page.** Type your email and Saathi sends a link to choose a new password. The link works once, for 30 minutes; asking again replaces the old link.
- Choosing a new password signs you out on every other device, and both the request and the change are written to the security history. Two-step sign-in still applies when you log in again.
- Saathi never says whether an email has an account, and only a hash of each link is stored. Demo and Google-only accounts are not reset this way; accounts on Firebase Authentication get Firebase's own reset email.
- If this Saathi has no email service set up, the reset link is printed in the server's terminal, so the person running it can still help.

## [1.3.0] - 2026-11-10

### Scam Shield: Gemma on her phone
- The Saathi Android app checks incoming texts and WhatsApp messages for scams on her phone. A fast rules check runs first; when a message is unclear, **Gemma runs on the phone itself** (MediaPipe LLM Inference) to decide.
- When a message looks like a scam (a fake KYC or bank message, an OTP request, a "digital arrest" threat, a prize, job or investment offer, or someone pretending to be family on a new number), she gets a warning in her language and her Saathi screen says it aloud.
- The family is told only the kind of scam and whether a text or WhatsApp message carried it. **The message itself never leaves her phone.**
- Real bank messages, and OTPs that say not to share them, are left alone.
- The model downloads once, over Wi-Fi, only on phones with enough memory, from this Saathi or any https address, and is checked against its SHA-256 before use. Without a model, the rules check still works.
- Scam Shield is part of the one-tap recommended protection, and has its own card in Care, Safety.

## [1.2.0] - 2026-11-10

The family app is easier to find your way around, and setting up takes one tap.

### Getting around
- **Labelled navigation** with five places: Home, Care, Messages, Memories and More. On a phone it is a fixed bar of five tabs.
- **Care is split into tabs** (Today, Health, Safety, Help and benefits, Extras), and the app remembers the last one you used.
- **Search everything** with the Search button, `/` or Ctrl+K: any page, card or action. `g` then a letter jumps between pages, and `?` lists the shortcuts.
- **Links to a card**, such as `/family.html#care/haq`, open the right tab and highlight the card.
- **More** gathers the assistant, the house map, their screen, the reports, invites, devices, settings and security as labelled tiles.

### Home
- **Quick actions**: send a message, scan a prescription, book a Didi, record doctor notes, share today's summary.
- **Needs attention**: calls for help, tablets not confirmed, tablets running low, visits nobody is taking her to, and benefit deadlines, most urgent first, each with one button that deals with it.
- **Finish setting up**: a checklist with a progress ring, each step one tap away.
- **Today**: tablets, routine and visits in one timeline.

### One-tap protection
- **Recommended protection** shows exactly what will change (fall checks and scam warnings), turns it on in one tap, and offers Undo. It never turns on sharing, only the owner can use it, and each change is written to the security history.
- The device pairing link can be shared in one tap; the six-digit code is never in the link.

### Polish
- One style for every field, switches for on and off settings, and the Raksha switches save themselves.
- Loading placeholders, clearer empty states, a notice when you are offline, and a Display menu with large text, high contrast and less motion.
- Saathi can be installed to the home screen, with shortcuts to Messages, Care, Scan and Didis.

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
