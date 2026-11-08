# Changelog

## [2.0.0] - 2026-11-08

Saathi, rebuilt on Google, with Saathi Didis.

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

Everything from Saathi 1.4 carries over: Scam Guard, the Scam Shield Network, Saathi Insight, Family Voice, Living Legacy, Saathi Calls, the assistant that acts, passkeys and the audit log.
