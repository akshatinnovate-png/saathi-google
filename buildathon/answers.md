### Provide one sentence summary of your new product/project
(241/1024)

Saathi is a Gemini-powered companion that keeps India's elders who live alone safe, independent and close to family in their own language, and Saathi Didis turns the care that neighbourhood women already give into paid, verified, local work.

### What is the main problem that you are solving?
(703/1024)

India has over 150 million people above 60, and more of them, mostly women, now live alone while their children work in other cities or abroad. Tablets get missed or taken twice, falls go unnoticed, loneliness goes unspoken, and scammers target them with fake KYC and "digital arrest" calls. Pension life certificates and official letters are missed or misread. Families far away find out late and have no shared view of the day. Today's apps are in English and built for the young. At the same time, the women who do most elder care (daughters, neighbours, ayahs, retired nurses) are rarely paid, and a family in Toronto has no trusted way to find someone two lanes from Aaji's home for a doctor visit.

### Who would be a typical user/customer?
(494/1024)

Three people around one elder. Kamala, 79, lives alone in Pune, speaks Marathi and uses an old tablet or phone. Her family, a granddaughter in Toronto and a son in Bengaluru, use the family app and are the paying customers. Sunita, a woman from a self-help group in Kamala's neighbourhood, wants flexible paid work and becomes a Saathi Didi. We also serve home-care organisations that schedule and brief their own caregivers, and later employers whose staff have ageing parents in other cities.

### What is your solution to this problem?
(935/1024)

Saathi gives the elder a companion that speaks her language: tablets by colour with no double doses, check-ins, help that escalates (family, then neighbour, then emergency) until someone responds, scam warnings, family messages translated both ways, fall checks on Android, and letters explained aloud. The family gets one shared view in their language, a needs-attention list where every item has one button, prescriptions read from a photo, doctor visits summarised, and one-tap recommended protection with Undo. Saathi Didis lets families book a verified woman nearby, matched by real travel time, for an escort, visit or refill. Gemini writes her briefing in her language, she checks in, can raise an SOS, leaves a translated note, and is paid straight to her UPI. Didis can also host Google Meet circles (Saathi Sangat). Nothing leaves the house without a yes, private messages are end-to-end encrypted, and safety is always free.

### What is the potential business model?
(747/1024)

Freemium, with safety always free. 1) Families: a low monthly Family plan for daily phone calls, Saathi Insight and the doctor report, and reminders in a family member's voice. 2) Saathi Didis: a small booking fee per visit, or a monthly care plan paid by the family. The Didi sets her own fee and keeps all of it, paid directly to her UPI. 3) Home-care organisations: a per-caregiver subscription to schedule, brief and verify their staff; our first partner has already accepted Saathi. 4) Later: insurers and employers offering elder-care benefits to staff with parents in other cities, and CSR programmes funding Didi livelihoods through SHGs. Diaspora families, who pay in dollars or pounds for parents in India, are the highest-value segment.

### Who will be your primary competitor(s) and how is your solution different?
(911/1024)

Elder-care service companies such as Emoha and Samarth, senior communities such as Khyaal, generic voice assistants (Alexa, Google Assistant), and home-service marketplaces. They are either services staffed by an agency with a markup, communities for active seniors, or assistants that answer questions without knowing her tablets or her family. Saathi is different in four ways: 1) It acts. It counts doses, escalates help until someone comes, stops scams, and reads prescriptions and letters, in Marathi or Hindi. 2) It connects the whole family across countries in one shared, translated view. 3) Saathi Didis are neighbourhood women paid directly by UPI, who keep their whole fee, verified by their SHG and briefed by Gemini, rather than agency staff. 4) Trust: safety is free, there are no ads, end-to-end encrypted messages, passkeys, and permission rules proven in CI. It runs on any old tablet or phone.

### What will be your primary and secondary target countries?
(386/1024)

Primary: India, starting in Pune and Maharashtra (Marathi and Hindi), then other metros and tier-2 cities as we add Tamil, Bengali and more Indian languages. Secondary: Indian diaspora families in Canada, the United States, the United Kingdom and the UAE, who pay for care for parents living in India. Later, other South Asian countries where the same languages and care patterns apply.

### How are you planning to use AI for this solution?
(880/1024)

AI understands people; tested code makes the decisions. Gemini understands the elder in Marathi, Hindi or English and picks Saathi's tools (tablets, help, messages) through function calling; code checks permissions, prevents double doses and runs escalations, and nothing is sent without her yes. Gemini Live lets her just talk and interrupt. Gemini's vision reads prescriptions ("1-0-1", BD, HS), tablet strips and official letters and explains them in her language. It summarises doctor visits (with consent) and writes each Didi's briefing in her language. Gemma runs on her phone and checks incoming texts and WhatsApp messages for scams, so the messages never leave it; she is warned in her language and the family hears only the kind of scam. Nano Banana makes each Didi's profile card. Cloud Translation, Speech-to-Text and Text-to-Speech carry everything across languages.

### Please describe how you are planning to leverage the selected Google AI models
(872/1024)

Gemini API (gemini-2.5-flash, Vertex AI or AI Studio key): Saathi's MCP tools become Gemini function declarations, with thought signatures kept across turns, for the elder's companion and the family assistant. Multimodal input with JSON output reads prescriptions, strips and letters and turns doctor-visit audio into changes the family confirms. It also writes Didi briefings in Marathi or Hindi. Gemini Live (gemini-live-2.5-flash): real-time speech she can interrupt; the browser gets a single-use token and tools run mid-conversation with confirmation. Gemma (Gemma 3 1B, on device via MediaPipe LLM Inference): the Android app checks each unclear text or WhatsApp message for scams on the phone itself, after a fast rules check; the model is verified by SHA-256. Nano Banana (gemini-2.5-flash-image): each Didi's profile card. Every output passes through tested code.

### How do you intend to deploy and scale your product on Google Cloud?
(976/1024)

One command (npm run deploy) enables the APIs and creates Firestore, a private Cloud Storage bucket, a Pub/Sub topic, a BigQuery dataset fed by a Pub/Sub subscription, the Cloud Workflows escalation and a least-privilege service account. It reads keys from Secret Manager and deploys a container to Cloud Run in asia-south1. Cloud Run keeps one warm instance with CPU always on for reminders, and autoscales on demand with stateless containers, scaling out as households grow. Firestore holds every household, booking and Didi with transactions. Cloud Workflows runs each help escalation step by step and survives restarts. Pub/Sub streams care events into BigQuery for the impact dashboard and Looker Studio. Gemini runs on Vertex AI with the service account. Firebase Authentication and Cloud Messaging handle sign-in and alerts; the Maps Routes API matches Didis. Cloud Logging provides metrics and alerts. Next steps are more regions and higher instance limits as we grow.

ALL UNDER 1024
