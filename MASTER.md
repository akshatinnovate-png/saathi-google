# Saathi on Google: master document

### A companion for India's elders, and paid care work for the women who already look after them

*Google Cloud Startup Buildathon India 2026 · existing startup with a new product idea*

**In one line:** Saathi is an AI companion used by 200 elders that keeps them safe, independent and close to family in their own language, and with Saathi Didis it turns the care women already give into paid work near home. Built on Gemini, Google Cloud and Firebase.

## Contents

1. Riya and Kamala
2. What Saathi is
3. The problem, in human terms
4. A day with Saathi
5. The new product: Saathi Didis
6. Why Google
7. How it works, without the jargon
8. Every feature, at a glance
9. Trust and safety
10. Market and business
11. Traction
12. The founder
13. Real users and validation
14. The plan
15. Every feature, in full
16. Saathi Didis, in full
17. Proof to attach
18. Every Google product, in plain words
19. How it works, step by step
20. Application answers, ready to paste
21. Pitch deck and demo
22. Closing

---

## 1. Riya and Kamala

It is 6:40 in the morning in Toronto and 5:10 in the evening in Pune.

Riya is twenty-three. She is studying architecture on the other side of the world, and every evening, before her first class, she does the same thing: she opens her phone and wonders whether her grandmother took her blood pressure tablet.

Her grandmother is Kamala Deshpande. Everyone calls her Aaji. She is seventy-nine, she lives alone in the flat in Deccan where Riya grew up, and she speaks Marathi. Her memory is not what it was. Some mornings she asks what day it is twice. She has three tablets, a white one after breakfast, a small one at lunch and one at night, and she is not always sure which is which. Riya's father Anand lives in Bengaluru and calls when he can. Meera, the neighbour across the landing, looks in most days.

Last winter, a man called Aaji and said he was from the bank. Her account would be blocked, he said, unless she updated her KYC. He was kind and patient and he asked for the number that had just come on her phone.

She nearly read it out.

This is not a rare story. It is the story of millions of Indian families: parents who stayed and children who left, love stretched across time zones, and the daily worry that something small (a missed tablet, a fall, a clever voice on the phone) could become something terrible while nobody was there.

**Saathi** (साथी, "companion") was built for Kamala and Riya.

---

## 2. What Saathi is

Saathi is an AI companion that lives in the elder's home and a circle that connects everyone who loves her.

**For Aaji**, Saathi is a gentle voice that speaks Marathi. It tells her the day and what comes next. It knows her tablets by colour and purpose and stops her from taking one twice. It asks how she is, really listens, and quietly tells the family when she sounds low. It reads her family's messages to her in her own language and sends hers back in theirs. When she tells a story about her childhood, it saves it in a memory book, translated for grandchildren who no longer read Marathi. When the doorbell rings, it tells her who is there. When a stranger on the phone asks for a code, it tells her calmly not to share it, and tells her family.

**For Riya, Anand and Meera**, Saathi is one shared picture of Aaji's day: tablets taken, how she sounded, who is taking her to the doctor on Tuesday, whether she needs a refill. When Aaji asks for help, the family is alerted first, then the neighbour if nobody answers, then emergency guidance for everyone, until someone is on the way.

Saathi is not a medical device and it does not diagnose. It is the companion and the circle that a family would build if they could be there every day.

### Saathi today

Saathi is not an idea. It is a working product with real users.

- **200 elders use Saathi today.**
- **An elder home-care organisation has accepted Saathi** for the elders in its care. *(Name, date and scope: see section 17.)*
- It runs on a tablet by the elder's chair, on Android phones, on Windows (with an installer a family can use), and works with AI assistants through an open standard (MCP).
- Families already sign in with **Google** and send Saathi's letters and invites from their own **Gmail**.
- Its security has been reviewed in the open: its permission rules are mathematically proven, family messages are end-to-end encrypted, and the project holds the OpenSSF Best Practices **Silver** badge.

**Saathi on Google** is the same product, with every feature, on Gemini and Google Cloud, plus the one thing Saathi has never done before: create work.

---

## 3. The problem, in human terms

### Elders are living longer, and more of them are alone

India has roughly 150 million people over sixty, and the number is expected to more than double by 2050 (UNFPA, *India Ageing Report 2023*). Families are smaller, children move to other cities and other countries, and more elders, most of them women, live on their own.

What goes wrong is rarely dramatic at first:

- **Tablets** are missed or taken twice.
- **Days** blur together.
- **Loneliness** goes unspoken because nobody wants to be a burden.
- **Scams** find people who are trusting, polite and alone. "Digital arrest" calls and fake KYC messages have become common enough for the Prime Minister to warn the country about them.
- **Families far away** find out late.

### The people who do the caring are women, and most are never paid

Behind every elder who is managing is usually a woman: a daughter, a daughter-in-law, a neighbour, a granddaughter on a video call, an ayah, a retired nurse down the road. India's Time Use Survey shows women carrying most of the country's unpaid care work.

So there are two problems sitting side by side:

1. Families need **trusted, local, regular care** for their elders, especially when they live far away.
2. Women in every neighbourhood **already have the skills and the trust**, but no way to turn that care into income, a schedule and a reputation.

Saathi already solves the first. **Saathi Didis**, the new product we will build at this buildathon, solves the second with the same engine.

---

## 4. A day with Saathi

**7:30 am.** The tablet by Aaji's chair lights up. *"शुभ प्रभात आजी. आज बुधवार आहे."* (Good morning, Aaji, it's Wednesday.) It reminds her that the white tablet is after breakfast. She says she has taken it, and Saathi records it, so it won't let her take it twice.

**8:15 am.** Before the tablet, she hears Riya's voice, recorded last week: *"Aaji, tablet time! Love you."* That's Family Voice. It is a real recording, never an imitation.

**10:00 am.** Saathi calls her ordinary phone, as it does every day. It asks how she is feeling. She says her knee hurts and she didn't sleep well. Saathi records it as a check-in and notes that she sounded low.

**11:20 am.** A man calls about a "parcel with drugs in your name". He says he is from the CBI and she must stay on a video call. Aaji tells Saathi. Saathi tells her, in Marathi, that real police never do this, and the family is alerted immediately. On her computer, if he asks her to install AnyDesk, Saathi's helper Sahay closes it, shows her why it was a scam, and blocks remote access until the family decides.

**1:00 pm.** Riya, waking up in Toronto, sees one card: *Aaji took her morning tablet, sounded low, and someone tried a "digital arrest" scam; Sahay stopped it.* She calls her grandmother.

**3:30 pm.** The doorbell rings. Saathi tells Aaji it is Meera, and the family app quietly notes that someone came by. If the house is silent all morning (no door, no tablet, no check-in), the family hears about that too.

**4:00 pm.** Sunita, a Saathi Didi who lives two lanes away, arrives for her booked visit. Anand booked her from Bengaluru to take Aaji to the memory clinic on Thursday. Before she knocks, Sunita's phone already shows what she needs: the three tablets, the doctor, the address, and that Aaji's knee hurts today.

**7:00 pm.** Aaji tells Saathi about the mango tree in Satara where she and her brother climbed every summer. Saathi saves it in her memory book and translates it, so her grandson in Bengaluru, who reads English, can hear it in her own voice.

**Sunday.** Every family member receives a short letter about Aaji's week in their own language. Once a month, Saathi Insight gathers four weeks into a one-page report for her doctor. It shows patterns, never a diagnosis.

---

## 5. The new product: Saathi Didis

**Saathi Didis turns the care women already give into paid, respected, local work.**

### Who a Didi is
A woman in the elder's neighbourhood: a homemaker with time in the afternoons, a retired nurse, an ASHA-trained worker, a member of a self-help group, a caregiver already working with our home-care partner. Didi means "elder sister", which is exactly the relationship.

### What she does
- Escorts elders to doctor visits (Saathi already lets families claim visits; now a Didi can take one).
- Visits for company, a walk, a check that everything is all right.
- Picks up medicine refills when Saathi warns that supply is running low.
- Responds as the nearby person in Saathi's help escalation, when the family is far away.
- Helps with the phone, the forms and the bank, with Saathi watching for scams.

### What Saathi gives her
- **Bookings** from families, matched by distance and trust.
- **A briefing before each visit**: tablets, doctor, address, today's mood, what to watch for. Saathi already knows all of this.
- **A verified profile** with reviews from families.
- **Training in her own language**, by voice, at her own pace: how to help someone stand safely, what a missed dose means, how to spot a scam call.
- **Payments** straight to her UPI account, and a monthly earnings summary she can show a bank for credit.
- **Safety**: families are verified, visits are logged, and she can raise an alert from the visit.

### Why families trust it
The family already uses Saathi. They see the Didi's visit in the same timeline as the tablets and check-ins. Every visit leaves a short note. Nothing about Aaji's private check-ins is shared with a Didi beyond what the family allows.

### Why it is a business
- **Families pay per visit or per monthly plan.** Saathi keeps a small commission, and the Didi keeps most of the fee.
- **Home-care organisations** use Saathi to schedule and brief their own caregivers. Our first partner already cares for elders using Saathi.
- **Later:** insurers and employers who offer elder-care benefits to employees with parents in other cities.

### Why it matters
Every family that books a Didi creates income for a woman within walking distance. The work is local, flexible, dignified and in demand, and it grows with an ageing country.


---

## 6. Why Google

Saathi's whole idea is that technology should reach people who were never designed for: an elder who speaks Marathi and cannot read small text, a granddaughter in another time zone, a woman whose skills have never had a market. That is the promise of making AI helpful for everyone, and Google is the company that has made that its mission.

**Gemini understands people the way Saathi needs to.**
- Aaji speaks in Marathi, mixes in Hindi, and says "my white tablet" instead of "Amlodipine 5 mg".
- Gemini understands her, plans what to do, and explains it back simply.
- With Gemini Live she can just talk, interrupt and be understood.

**Google speaks India's languages.** Speech-to-Text, Text-to-Speech and Translation cover the languages Saathi's families speak, so every family member reads Aaji's messages in their own language, and she hears theirs in hers.

**Android is how India reaches the internet.** The elder's screen, the family app and the Didi app run on the Android phones people already own, including inexpensive ones.

**Google cares about the same harms we do.**
- Scam protection for Indian users is a Google priority, and Saathi's Scam Shield shares the same goal: protect the people scammers target most.
- AI for economic opportunity is a Google priority, and Saathi Didis turns AI into income for women.

**Google Cloud lets a small team run something serious.** Escalations that must never be lost, family data that must stay private, and a daily phone call to every elder are all built on managed Google services. A small team can run them safely and grow them from 200 elders to 200,000.


---

## 7. How it works, without the jargon

**Saathi listens and understands.** When Aaji speaks to her tablet or answers Saathi's daily call, Google's speech recognition turns her Marathi into words and Gemini understands what she means. Gemini decides which of Saathi's abilities to use: tell the day, check the tablets, record a check-in, send a message, ask for help.

**Saathi does the careful parts with ordinary, checkable code.** Gemini is good at understanding people. It is not the right place to count tablets, decide who may see what, or move money. Those parts are plain software that can be tested and proven. This is how Saathi stays both friendly and trustworthy.

**The family circle stays in sync.** Everything Aaji's family needs (tablets, mood, visits, alerts, stories) is kept in Firestore. Riya, Anand and Meera see it update live in the family app, and alerts arrive by email. Phone notifications even when the app is closed (Firebase Cloud Messaging) are next on the plan.

**Help is never lost.** When Aaji asks for help, Saathi's escalation runs on Cloud Run: family first, then the neighbour, then emergency guidance, with every step written to Firestore. It keeps going until someone says "I'm on it". Moving it to Cloud Workflows, so it survives even a server restart, is on the plan.

**Saathi calls, every day.** At the time the family chooses, Saathi phones Aaji's ordinary phone and talks with her in Marathi. If she does not answer twice, the family is told.

**Didis are found nearby.** Google Maps (the Routes API) works out how long each Didi takes to reach Aaji's home, and the family sees the nearest first: "12 minutes away", not just "same city".

**Private things stay private.**
- Family messages can be end-to-end encrypted.
- On a family's own computer, health records are sealed with a key kept in the computer's security chip. On Google Cloud, Firestore encrypts everything, and keys of the family's own (Cloud KMS) are next.
- Every family's data is kept apart from every other family's.
- Saathi never sells data and never shows ads.


---

## 8. Every feature, at a glance

The full list, feature by feature, is in section 15.


| For Aaji | For the family | For the Didi |
|---|---|---|
| A voice that speaks her language | One shared view of her day | Bookings near home |
| "What day is it?" without embarrassment | Alerts that escalate until someone answers | A briefing before every visit |
| Tablets by colour and purpose; no double doses | Messages translated both ways | Training by voice in her language |
| "Who is this person?" memory help | Doctor visits and who is taking her | UPI payments and an earnings record |
| Daily check-ins and a daily phone call | Refill warnings | Reviews and a verified profile |
| Help in one sentence | A weekly letter in their language | Safety during visits |
| Scam warnings and Scam Guard on her PC | Insight and a doctor report | |
| The doorbell, announced (Ring or Google Nest) | Family Voice reminders | |
| Her stories, saved and narrated | Living Legacy: her stories as a book | |
| Where she keeps her glasses | A Medical ID card for emergencies | |
| "Are you all right?" after a fall (Raksha) | Prescriptions read from a photo (Scan) | Hosting a paid circle on Meet (Sangat) |
| Circles on Google Meet in her language (Sangat) | Her rights and pension reminders (Haq) | Recording the doctor's advice on an escort (Doctor Notes) |
| "What does this letter say?" (Haq) | The doctor's advice, summarised (Doctor Notes) | |

---

## 9. Trust and safety

Elders are the people most easily hurt by careless technology, so Saathi is built on a few promises:

- **Nothing important happens without a person saying yes.** Messages ask before sending. The family assistant shows a card before changing a medicine. Sahay shows a Safety Pause and waits for the family.
- **Saathi never pretends.** If an order, a call or a message did not go through, it says so.
- **Safety is never behind a paywall.** Help alerts, scam protection and medicine reminders are free, always. The elder never sees a price or an advertisement.
- **Privacy by design.**
  - Private messages are end-to-end encrypted.
  - Health records are sealed.
  - Each household is separate.
  - Private check-ins are counted but never quoted.
  - Scam patterns are shared only as anonymous kinds, never words or names.
- **Proven, not promised.** Saathi's permission rules are checked by mathematical proofs and attacked by automated tests on every change, in the open.

---

## 10. Market and business

**Who pays**
1. **Families** with elders living alone, especially when children live in other cities or abroad, through a monthly plan with daily calls, Insight and Family Voice. Saathi Free keeps every safety feature.
2. **Families booking Saathi Didis**, per visit or monthly; the Didi keeps most of the fee.
3. **Home-care organisations** that schedule and brief their caregivers through Saathi. Our first partner has already accepted Saathi.
4. **Later:** insurers and employers offering elder-care support.

**Why now**
- An ageing population.
- Families spread across cities and countries.
- Scams aimed squarely at elders.
- And, for the first time, AI that can speak to an elder in Marathi and understand the answer.

---

## 11. Traction

- **200 elders** use Saathi today.
- **An elder home-care organisation has accepted Saathi** for its elders.
- **Open and verifiable:** the code, the security reviews and the release history are public. Release 1.4.0 shipped with Scam Guard, Insight, Family Voice, Living Legacy and daily calls.

*Details and proof: see section 17.*

---

## 12. The founder

**Akshat Sarkar** built Saathi for the elders in his own life and the grandchildren who worry about them. Along the way he built:
- **Sahay**, an AI helper that uses a Windows computer for people who can't, and stops scams on the screen as they happen.
- **A security core with mathematical proofs**, so families can trust Saathi with what matters most.
- **Saathi's first 200 users** and its first care partner.

He wants Saathi to do for every Aaji what it does for one, and to create work for the women who make that care possible.

---

---

## 13. Real users and validation

### What is true today
- **200 elders use Saathi.**
- **An elder home-care organisation has accepted Saathi** for the elders in its care.
- Families use the family app, the elder's screen, voice notes, translated messages and help alerts; the most recent release added Scam Guard, Insight, Family Voice, Living Legacy and the daily call.

### What we learned from them (fill in from real conversations)
| Question | What users told us |
|---|---|
| What do families worry about most? | *[two or three real quotes]* |
| Which feature do elders use most? | *[from usage]* |
| What did the home-care partner say when accepting? | *[their words]* |
| Who would become the first Didis? | *[the partner's caregivers; number]* |
| Would families pay for a nearby escort? | *[answers from at least ten families]* |

### How we will validate Saathi Didis before the buildathon
1. **Talk to ten families** whose elders use Saathi: would they book a nearby Didi for doctor visits, and at what price?
2. **Talk to five caregivers** at the partner organisation: would they take bookings through Saathi, and what do they need to feel safe?
3. **One real escort booking** done by hand (WhatsApp and a spreadsheet) to learn the steps the app must do.
4. **Record a short video** of one elder using Saathi and one caregiver describing the idea, with consent.

---

## 14. The plan

### Before the buildathon (now to 19 November)
| When | What |
|---|---|
| By 13 November | Submit the application (section 20), this document and the deck (section 21) |
| 8-13 November | Gather proof (section 17); interviews with families and caregivers (section 13) |
| By 18 November | Selection results; set up the Google Cloud and Firebase projects and credits; try prompts in Google AI Studio |
| Before 20 November | Prepare only what the rules allow: documents, designs, demo data, accounts. Confirm with the organisers what may be built in advance |

### Already built (in this repository)
Saathi Didis already works end to end, on Google:
- A Didi signs up in Marathi, Hindi or English, sets her own fee for each kind of help, and adds her UPI ID. A partner code from her self-help group or NGO verifies her, and three short lessons make her ready.
- Families find Didis by real travel time (Google Maps Routes API) and book one from the family app.
- The Didi accepts, and Aaji hears who is coming. Gemini writes the visit briefing in the Didi's language from Saathi's records, using only what the family chose to share.
- She checks in (Aaji is told), writes a visit note in her language, and the family reads it in English (Cloud Translation).
- The family pays her directly with a UPI link and rates the visit; she sees her visits, earnings and rating.
- All of Saathi runs on Google: Gemini (API or Vertex AI), Firestore, Cloud Translation, Natural Language, Text-to-Speech, Pub/Sub, Cloud Storage, Maps and Firebase Authentication, deployed to Cloud Run with one command.

### Also built already
- **Gemini Live** for Aaji, by voice, in Marathi, with Saathi's tools working mid-conversation.
- **Didi safety**: SOS with one-tap calls to 112 and her safety contact, overdue-visit checks, and Didis rating families.
- **Phone-number sign-in** for Didis, **spoken visit notes** (Speech-to-Text), **phone notifications** (Firebase Cloud Messaging) and a **Didi profile card** made with Gemini image generation.
- **Help escalations on Cloud Workflows**, and a live **impact dashboard** backed by BigQuery.
- **Saathi Scan**: Gemini reads a prescription or tablet strip, understands Indian dosing notes, and warns about duplicates and risky pairs before the family saves it.
- **Saathi Haq**: her pension life certificate, Ayushman Vay Vandana and other schemes, with reminders; and "What does this letter say?" for Aaji, with scams flagged.
- **Saathi Raksha**: fall and stillness checks on Android; no answer in 45 seconds starts the help escalation with her location.
- **Saathi Sangat**: Google Meet circles hosted by a Didi, a new monthly income for her and company for Aaji.
- **Doctor Notes**: with consent, the doctor's advice recorded, summarised by Gemini, heard by Aaji in her language and applied in one tap.

### At the City Buildathon (20-21 November): grow it with real Didis
**Day 1:** onboard the partner's first caregivers as Didis on their own phones; record their lessons by voice with Gemini Live; tune briefings and translations on real visits.
**Day 2:** run real bookings end to end; show the impact dashboard filling up live; add Cloud KMS keys of the family's own and Gemini Nano scam detection on Android.

### Regional Showcase (23, 25, 27 November)
Bring numbers from the first real bookings with the partner's caregivers, and the family and caregiver quotes.

### Grand Finale (2 December)
Show the full loop on stage, plus Saathi's existing features running on Google: Gemini Live for the elder, the daily call, Scam Guard and Insight.

### After the buildathon
| When | Goal |
|---|---|
| First 3 months | Saathi Didis pilot with the partner's caregivers; first paid bookings; all of Saathi running on Google |
| 6 months | Open Didi sign-up in the partner's city; 1,000 elders; Tamil and Bengali |
| 12 months | Three cities; partnerships with more home-care organisations and with employers offering elder-care support |

---

## 15. Every feature, in full

Each feature below says **what it does for people** and **the Google products behind it**. Features 1 to 31 are in Saathi today; 32 to 39 are Saathi Didis, the new product, which already works end to end.

**What runs on Google today, and what comes next.** "On Google" below is the full design. In the code today, Saathi runs on **Cloud Run** with **Gemini** (Gemini API or Vertex AI), **Gemini Live**, **Gemini image generation**, **Firestore**, **Cloud Translation**, **Natural Language**, **Text-to-Speech**, **Speech-to-Text**, **Pub/Sub**, **BigQuery**, **Cloud Workflows**, **Cloud Storage**, **Google Maps (Routes API)**, **Firebase Authentication** (including phone sign-in), **Firebase Cloud Messaging**, **Google sign-in**, the **Gmail API**, **Secret Manager** and **Cloud Logging**. Gemini Nano, Cloud KMS, Lyria, Dialogflow CX and Remote Config are the next steps.

Kamala ("Aaji") is the elder, Riya her granddaughter in Toronto, Anand her son in Bengaluru, Meera the neighbour, and Sunita a Saathi Didi.

---

### A. For the elder

#### 1. A companion that speaks her language
- **For people:** Aaji talks in Marathi, mixes in Hindi, and is understood. Answers are short, warm and slow when she needs them to be.
- **On Google:** **Gemini Live** for natural conversation; **Gemini** (through Vertex AI) for understanding and planning; **Speech-to-Text (Chirp)** and **Text-to-Speech** for Indian languages. It runs on an **Android tablet** by her chair, or any Android phone.

#### 2. "What day is it?"
- **For people:** The day, the date, where she is and what comes next in her routine, asked as often as she likes, never with "you already asked".
- **On Google:** Gemini answers from her routine in **Firestore**; how often she asks becomes a gentle signal in Insight (feature 21).

#### 3. "Who is this person?"
- **For people:** "Who is Maya?" "My granddaughter?" Saathi explains, with the person's last message and next plan. A memory aid, never a test.
- **On Google:** Gemini over the circle in Firestore; names in Marathi, Hindi or English.

#### 4. Tablets by colour and purpose
- **For people:** "The white one for blood pressure, after breakfast." Saathi knows which are taken, due, missed or upcoming.
- **On Google:** Medicines in Firestore; Gemini describes them in her language; reminders by **Cloud Scheduler**.

#### 5. "I took it": no double doses
- **For people:** When she says she has taken a tablet, Saathi records it, and if she tries to take it again, it gently says it was already taken.
- **On Google:** Deterministic rules on **Cloud Run**; records in Firestore.

#### 6. Proactive tablet reminders
- **For people:** At the right time, the tablet by her chair reminds her, in her language.
- **On Google:** Cloud Scheduler, **Pub/Sub** and **Firebase Cloud Messaging** to her device.

#### 7. Family Voice
- **For people:** Before a reminder, she hears a grandchild's real recorded voice: *"Aaji, tablet time! Love you."* Recordings only, never an imitation.
- **On Google:** Clips in **Cloud Storage**, played by the Android app with the reminder.

#### 8. Daily check-ins
- **For people:** "How are you feeling today?" She answers in her own words. If she sounds low or lonely, the family gets a gentle nudge (unless she asks to keep it private). Words of danger always start the help escalation.
- **On Google:** Gemini and the **Natural Language API** read how she feels; a safety screen in code catches danger words in every language.

#### 9. Ask for help in one sentence
- **For people:** "I fell." "I'm dizzy." "Call someone." Family first, then the neighbour or the nearest Didi, then emergency guidance for everyone, until someone says "I'm on it".
- **On Google:** **Cloud Workflows** runs the escalation reliably; **Pub/Sub** and **Eventarc** carry events; FCM, **Gmail API** and SMS reach people.

#### 10. Scam warnings
- **For people:** When she mentions a call asking for an OTP, a PIN, a KYC update, money, an app install or a "digital arrest", Saathi calmly tells her not to share or pay anything and alerts the family once.
- **On Google:** Gemini plus a scam screen in code (English, Hindi, Marathi, Hinglish); **Model Armor** guards the AI against manipulation.

#### 11. Scam Guard on her computer (with Sahay)
- **For people:** If a scammer gets her to open AnyDesk next to her bank page, or shows a fake "virus" page, Sahay closes it, shows a calm Safety Pause explaining why it was a scam, and tells the family. It sends a screenshot with private numbers blacked out. Remote access stays blocked until the family decides.
- **On Google:** **Gemini** explains the scam in her language; incidents go to Firestore and the family by FCM; on Android phones, **Gemini Nano** can recognise scam screens on the device itself.

#### 12. Scam Shield Network
- **For people:** When a new kind of scam appears ("fake electricity bill calls in Pune"), every Saathi home that opted in warns its elder ahead of time. Only the *kind* of scam is shared, never names, numbers or words.
- **On Google:** A reviewed feed delivered with **Firebase Remote Config**; regional patterns in **BigQuery**; awareness posters in regional languages with **Nano Banana**.

#### 13. Messages from family, in her language
- **For people:** Riya writes in English and Aaji hears it in Marathi. Aaji answers in Marathi and Riya reads English. She is asked before anything is sent.
- **On Google:** **Cloud Translation** and Gemini for warmth and names ("Aaji", "beta"); Text-to-Speech reads them aloud.

#### 14. Voice notes and private messages
- **For people:** The family can send their actual voice. Private messages are end-to-end encrypted, so only family devices can read them.
- **On Google:** Media in Cloud Storage with signed links; encryption keys stay on family devices.

#### 15. Her memory book
- **For people:** She tells a story; Saathi saves it, translates it into every family language and narrates it, so grandchildren who don't read Marathi can hear it.
- **On Google:** Gemini and Cloud Translation; Text-to-Speech narration; stories in Firestore and Cloud Storage.

#### 16. Where are my glasses?
- **For people:** "Where is my tablet box?" Saathi answers from the house map the family built.
- **On Google:** House map in Firestore; the family walks the house with **ARCore** on an Android phone to draw the rooms.

#### 17. The doorbell, announced
- **For people:** When someone rings, Saathi tells her who it is; the family app notes visits. A silent house all morning (no door, no tablet, no check-in) quietly alerts the family.
- **On Google:** **Ring doorbells stay supported** (many families already own one). **Google Nest Doorbell** joins through the **Google Home APIs**, and any doorbell can use a simple Saathi doorbell link.

#### 18. Accessibility
- **For people:** Large text, high contrast, slower speech, simple screens, everything by voice.
- **On Google:** Android accessibility, Text-to-Speech speaking rates, and the same screens tested for accessibility on every change.

#### 19. Medical ID card
- **For people:** One printable page for a paramedic: conditions, medicines, allergies, who to call, the language she speaks.
- **On Google:** Generated from Firestore; exportable to **Google Docs** or PDF.

---

### B. For the family

#### 20. One shared picture of her day
- **For people:** Tablets, mood, visits, alerts and stories, live on every family phone, each person in their own language.
- **On Google:** A **Firebase**-backed family app (Android and web), with **Firebase Authentication** (Google sign-in, phone, passkeys) and **Firebase Hosting**.

#### 21. Saathi Insight and the doctor report
- **For people:** A weekly look at tablets taken, how she sounded, how often she asked the day, front-door activity and help requests, compared only with her own usual week. Changes worth mentioning are listed plainly; it never diagnoses. Once a month, a one-page report for her doctor.
- **On Google:** **BigQuery** for the weekly trends, Gemini to write it plainly, **Looker Studio** and Google Docs for the report.

#### 22. Doctor visits and escorts
- **For people:** Upcoming visits, where and with whom, and who in the family (or which Didi) is taking her.
- **On Google:** Firestore; **Google Calendar API** puts visits in family calendars; **Google Maps** for directions and timing.

#### 23. Refills before they run out
- **For people:** Saathi counts tablets left and warns the family a few days early. One tap records a refill. A Didi can pick it up.
- **On Google:** Rules on Cloud Run; FCM notifications.

#### 24. The weekly family letter
- **For people:** Every Sunday, a short letter about her week, in each person's language. Private check-ins are counted, never quoted.
- **On Google:** Gemini writes it; Cloud Translation localises it; **Gmail API** sends it from the family's own Gmail.

#### 25. A family assistant that does things
- **For people:** Riya types "Her doctor added Metformin twice a day with food" and the assistant prepares the change on a card. Nothing changes until she taps Confirm. It can also book a visit, record a refill, message Aaji or acknowledge an alert.
- **On Google:** **Gemini** with tools, built with the **Agent Development Kit (ADK)**; every action checked by Saathi's permission rules and written to an audit log.

#### 26. Tech help, handed to Sahay
- **For people:** Aaji asks, "Mai WhatsApp pe group kaise banaungi?" and Saathi replies with one line, "I've asked Sahay to do it for you", while Sahay does it on her computer and explains each step.
- **On Google:** Gemini plans the steps; Sahay acts on Windows today and on Android with Gemini Nano; progress reaches the family by FCM.

#### 27. Saathi Calls: a daily phone call
- **For people:** Every day at the family's chosen time, Saathi calls her ordinary phone in her language: tablets, how she feels, family messages. If she doesn't answer twice, the family is told. The family gets a summary.
- **On Google:** **Conversational Agents (Dialogflow CX)** with a telephony gateway for the call; Gemini for the conversation; Speech-to-Text and Text-to-Speech in Indian languages.

#### 28. Living Legacy
- **For people:** Her memory book becomes an illustrated family book, with every story as a chapter in each family language and her narration. Print it, or save it as a PDF or an audiobook.
- **On Google:** **Nano Banana** illustrates each chapter; **Lyria** adds a gentle music bed under the narrated audiobook; Text-to-Speech and Cloud Storage.

#### 29. Easy device setup
- **For people:** Type a six-digit code on the elder's tablet; the family approves it on their phone. No passwords for Aaji.
- **On Google:** Firebase Authentication with device approval; **App Check** to make sure only real Saathi apps connect.

#### 30. Security the family can see
- **For people:** Two-step sign-in, passkeys, recovery codes, a log of who did what, device approval.
- **On Google:** Firebase Authentication (passkeys, multi-factor); audit log in Firestore; keys in **Cloud KMS**; secrets in **Secret Manager**.

#### 31. Plans that never nag
- **For people:** Saathi Free keeps every safety feature. Family plans add daily calls, Insight and Family Voice. The elder never sees a price.
- **On Google:** Billing through **Google Play** on Android and UPI on the web; entitlements in Firestore.

---

### C. For Saathi Didis (new)

#### 32. Sign up and get verified
- **For people:** A woman nearby signs up with her phone number, languages, areas and the care she offers; documents are verified; she sets her hours.
- **On Google:** Firebase Authentication (phone), **Document AI** to read ID documents, Firestore profile.

#### 33. Training in her language
- **For people:** Short voice lessons in Marathi, Hindi or English: helping someone stand safely, what a missed dose means, spotting a scam call, what to do in an emergency. She can ask questions out loud.
- **On Google:** **Gemini Live** as a patient voice tutor; lessons written with Gemini and checked by people.

#### 34. Bookings near home
- **For people:** Families book visits, escorts or refills; Saathi offers each booking to verified Didis nearby.
- **On Google:** **Google Maps Platform** (distance, routes, timing); Firestore bookings; FCM offers.

#### 35. A briefing before every visit
- **For people:** Before she knocks, she knows the tablets, the doctor, the address, today's mood and anything to watch for, only as much as the family allows.
- **On Google:** Gemini writes the briefing from Saathi's records, in her language.

#### 36. The visit, on the family's timeline
- **For people:** She checks in at the door and checks out at the end. She leaves a voice note in her language, and the family reads it in theirs.
- **On Google:** Firestore timeline; Speech-to-Text and Cloud Translation for the note; **Maps** to confirm arrival.

#### 37. Getting paid, building credit
- **For people:** Payment to her UPI account after each visit; a monthly earnings summary she can show a bank.
- **On Google:** UPI payments (Google Pay); earnings in **BigQuery** and **Looker Studio**.

#### 38. Her own small business
- **For people:** A verified profile, family reviews, and a shareable card she can post on WhatsApp to find more families.
- **On Google:** **Nano Banana** makes the profile card and flyer in her language.

#### 39. Safe for her too
- **For people:** Verified families, visits logged, an alert button during visits, and support if anything goes wrong.
- **On Google:** FCM alerts; Workflows escalation; Firestore records.

---

### D. Underneath everything

| What | Google product |
|---|---|
| Understanding and planning | Gemini (Vertex AI), Gemini Live, Gemini Nano on device, Gemma for low-cost tasks |
| Agents | Agent Development Kit (ADK), Vertex AI Agent Engine, Agent Skills, Model Armor |
| Language and voice | Speech-to-Text (Chirp), Text-to-Speech, Cloud Translation, Natural Language API |
| Images and music | Nano Banana, Lyria |
| Apps and accounts | Android, Firebase (Authentication, Firestore, Cloud Messaging, Hosting, App Check, Remote Config, Crashlytics) |
| Backend | Cloud Run, Cloud Workflows, Pub/Sub, Eventarc, Cloud Scheduler, Cloud Storage |
| Insight | BigQuery, Looker Studio |
| Places and calendars | Google Maps Platform, Google Calendar API |
| Home | Google Home APIs (Nest Doorbell), ARCore; Ring kept as an integration |
| Documents and mail | Document AI, Google Docs, Gmail API |
| Phone calls | Conversational Agents (Dialogflow CX) with a telephony gateway |
| Security | Cloud KMS, Secret Manager, App Check, Identity-Aware Proxy for staff tools |
| Building | Google AI Studio, Antigravity, Cloud Build, Artifact Registry |
| Watching it run | Cloud Logging, Cloud Monitoring, Cloud Trace |

---

## 16. Saathi Didis, in full

**Paid, respected care work for women in every neighbourhood, connected to the families who need it.**

### The idea in one paragraph

Across India, the people who look after elders are women: daughters, daughters-in-law, neighbours, retired nurses, ayahs. Almost all of that care is unpaid or informal. Meanwhile, families living far away need someone trusted and nearby who can take their mother to the doctor, check that she is all right, or pick up her tablets. Saathi already knows each elder's tablets, doctors, routines and moods. **Saathi Didis connects those families with verified women nearby, briefs each woman before every visit, pays her, and helps her grow a small business of her own.**

### Sunita's story

Sunita is forty-four and lives two lanes from Aaji. She looked after her mother-in-law for six years and knows how to help someone stand without hurting their back, how to talk to a frightened person, and how to read a prescription. Her children are in school until three. She has never been paid for any of it.

With Saathi Didis:
1. She signs up with her phone number and chooses Marathi.
2. She takes three short voice lessons with Saathi's tutor, asking questions out loud as she goes.
3. A family nearby books her to take Aaji to the memory clinic on Thursday.
4. Before she leaves home, her phone tells her: the clinic, the time, Aaji's three tablets, that Aaji's knee hurt this week, and that Aaji likes to talk about her garden.
5. She checks in at the door. The family in Bengaluru and Toronto see it.
6. After the visit she records a voice note in Marathi; Riya reads it in English.
7. She is paid to her UPI account the same day.
8. At the end of the month, she has a record of 22 visits, four family reviews, and an earnings summary she can take to a bank.

### Who becomes a Didi

- Homemakers with free hours
- Retired nurses and ward attendants
- ASHA-trained and anganwadi-trained women
- Members of self-help groups
- Caregivers already employed by our home-care partner (who can use Saathi to schedule and brief their visits)

### What families can book

| Booking | What happens |
|---|---|
| **Doctor escort** | The Didi takes the elder to the visit, waits, comes back, and leaves a note. Saathi already lets a family member "claim" a visit; now a Didi can claim it too. |
| **Company visit** | An hour of conversation, a walk, help with small things. |
| **Refill run** | When Saathi warns that a tablet will run out, a Didi picks it up. |
| **Nearby responder** | During a help alert, if the family does not answer, the nearest available Didi is asked to look in before emergency guidance goes out. |
| **Help with the phone** | Bills, forms, the bank app, with Saathi watching for scams. |

### What Saathi gives each Didi

1. **Bookings near home**, matched by distance, language and reviews.
2. **A briefing before every visit**, written in her language from Saathi's records, sharing only what the family allows.
3. **Training by voice**, at her own pace, with a tutor she can interrupt and ask.
4. **Payments** to her UPI account and a **monthly earnings record**.
5. **A verified profile** with reviews, and a **shareable card** for WhatsApp.
6. **Safety**: verified families, logged visits, and an alert button.

### Trust and safety

**For families**
- Every Didi's identity is verified.
- Training is required before her first booking.
- Visits are checked in and out.
- Every visit leaves a note.
- Families rate each visit.
- A Didi never sees private check-ins, private messages or anything the family has not shared.

**For Didis**
- Families are verified.
- Visits are logged.
- A one-tap alert during a visit reaches Saathi support and her own emergency contact.
- She can decline any booking.

**For elders**
- The elder is introduced to her Didi by the family, through Saathi, in her own language.
- Saathi tells the elder who is coming and when, just as it announces the doorbell.

### The money

- **Families** pay per visit or choose a monthly plan (for example, four escorts and four company visits).
- **The Didi keeps most of the fee**; Saathi keeps a small commission to run the service.
- **Home-care organisations** pay to use Saathi for scheduling, briefing and reporting across their caregivers.
- **Later:** insurers and employers offering elder-care support to employees whose parents live alone.

*Exact prices will be set with our first partner and the first Didis; we will not publish numbers we have not tested.*

### The impact we will measure

- Number of women earning through Saathi, and their monthly earnings
- Visits completed, and families' ratings
- Elders' missed doses and quiet days, before and after regular visits
- Help alerts answered by a nearby Didi before emergency guidance was needed

### Built with Google

| Need | Google product |
|---|---|
| Sign-up with a phone number | Firebase Authentication |
| Reading ID documents for verification | Document AI |
| Voice training she can talk to | Gemini Live |
| Matching by distance, routes and arrival time | Google Maps Platform |
| Bookings, visits and notes, live for families | Cloud Firestore, Firebase Cloud Messaging |
| The visit briefing, in her language | Gemini, Cloud Translation |
| Her voice note, read by the family in theirs | Speech-to-Text, Cloud Translation |
| Profile card and WhatsApp flyer | Nano Banana |
| Earnings record | BigQuery, Looker Studio |
| Payments | UPI (Google Pay) |
| The app on her phone | Android, built with Google AI Studio and Antigravity |

### Starting with our partner

Our first home-care partner already uses Saathi for its elders. Its caregivers will be the **first Saathi Didis**: we will onboard them, measure their visits and earnings, and open sign-up to women in the same neighbourhoods once the training, verification and payments are proven.

---

## 17. Proof to attach

Judges ask for evidence. Before submitting, gather:
- [ ] **Usage:** the number of elders and families active in the last 30 days (from Saathi's records), screenshots of the dashboard.
- [ ] **The home-care partner:** name, city, the date they accepted, the number of elders and caregivers, and their acceptance in writing (email or letter).
- [ ] **Quotes:** two families and one caregiver, with permission to use their first names.
- [ ] **A short video:** one elder using Saathi (with consent), under a minute.
- [ ] **Didi interest:** names (or count) of caregivers willing to try bookings.
- [ ] **Links:** the public Saathi repository and its latest release.

Only include numbers you can show. A smaller true number is stronger than a larger one a judge cannot verify.

---

## 18. Every Google product, in plain words

### Why Google

Saathi exists to make technology work for people it was never designed for: an elder who speaks Marathi, a granddaughter in another time zone, a woman whose care work has never been paid. Making AI helpful for everyone, in their own language, on the phone they already own, is Google's stated mission and Saathi's whole reason to exist.

Four reasons this is the right home:

1. **Gemini understands real people.** Elders mix languages, forget words and describe tablets by colour. Gemini understands that, plans the right action and explains it simply. Gemini Live lets an elder simply talk.
2. **Google speaks India's languages.** Speech, translation and voice in the languages Saathi's families speak, so love does not get lost in translation.
3. **Android is how India gets online.** The elder's screen, the family app and the Didi app all run on Android, including inexpensive phones.
4. **Shared priorities.** Protecting people from scams and using AI to create economic opportunity are both things Google has committed to in India. Saathi does both, for the people most at risk and the women most often unpaid.

### Every Google product, in plain words

#### Gemini family
| Product | What it does in Saathi |
|---|---|
| **Gemini** (Vertex AI) | Understands what the elder or family wants, chooses what to do, and explains it warmly; writes visit briefings, weekly letters and Insight summaries. |
| **Gemini Live** | Natural voice conversation for the elder, and a patient voice tutor for Didis. |
| **Gemini Nano** | Recognises scam screens on Android phones without sending anything off the device. |
| **Gemma** | Runs simpler, high-volume tasks at low cost, and privately where needed. |
| **Nano Banana** | Illustrates Living Legacy chapters; makes Didi profile cards and scam-awareness posters in regional languages. |
| **Lyria** | A gentle music bed under narrated Living Legacy audiobooks. |

#### Building agents
| Product | What it does |
|---|---|
| **Agent Development Kit (ADK)** | Builds Saathi's agents: the elder's companion, the family assistant and the Didi briefing writer, each with only the tools it needs. |
| **Vertex AI Agent Engine** | Runs those agents reliably. |
| **Agent Skills** | Packages Saathi's abilities (tablets, visits, messages) so agents use them consistently. |
| **Model Armor** | Stops tricks hidden in messages or scam texts from steering the AI. |
| **Google AI Studio** and **Antigravity** | Where we design prompts and build the product. |

#### Voice and language
| Product | What it does |
|---|---|
| **Speech-to-Text (Chirp)** | Turns the elder's speech, and Didis' voice notes, into words, in Indian languages. |
| **Text-to-Speech** | Speaks to the elder slowly and clearly in her language; narrates stories. |
| **Cloud Translation** | Every family member reads and hears in their own language. |
| **Natural Language API** | Helps sense how the elder feels in check-ins. |
| **Conversational Agents (Dialogflow CX)** | The daily phone call to the elder's ordinary phone. |

#### Apps, accounts and data
| Product | What it does |
|---|---|
| **Android** | The elder's screen, the family app and the Didi app. |
| **Firebase Authentication** | Sign-in with Google, a phone number or a passkey; two-step sign-in. |
| **Cloud Firestore** | The family's shared, live picture of the elder's day; bookings and visits. |
| **Firebase Cloud Messaging** | Alerts and reminders that arrive even when the app is closed. |
| **Firebase Hosting, App Check, Remote Config, Crashlytics** | The web app, protection against fake apps, safe rollout of scam warnings, and crash reports. |

#### The backbone
| Product | What it does |
|---|---|
| **Cloud Run** | Saathi's server: the careful rules that decide who may see and do what. |
| **Cloud Workflows** | Runs help escalations step by step until someone responds. |
| **Pub/Sub** and **Eventarc** | Carry events (a tablet taken, a help request) to everything that needs to know. |
| **Cloud Scheduler** | Reminders, daily calls, the weekly letter. |
| **Cloud Storage** | Voice notes, stories and photos, behind signed, expiring links. |
| **Cloud KMS** and **Secret Manager** | Keep the keys that seal health records, and the service secrets. |
| **BigQuery** and **Looker Studio** | Insight trends, the doctor report, Didi earnings. |
| **Cloud Logging, Monitoring and Trace** | Show us that alerts are delivered and calls are made, every day. |

#### Places, home and documents
| Product | What it does |
|---|---|
| **Google Maps Platform** | Finds Didis nearby; directions and timing for doctor visits. |
| **Google Calendar API** | Puts doctor visits in family calendars. |
| **Google Home APIs** | Google Nest Doorbell support (Ring stays supported). |
| **ARCore** | Families walk the house with a phone to draw the rooms. |
| **Document AI** | Reads Didi ID documents for verification. |
| **Google Docs** and **Gmail API** | The Medical ID card and doctor report as documents; weekly letters from the family's own Gmail. |
| **Google Play** and **UPI (Google Pay)** | Family plans and Didi payments. |

### What we will not do

- No advertising, no selling of data, no training of AI on families' private records.
- The elder never sees a price.
- Safety features are free, always.

---

## 19. How it works, step by step

### Five pieces

1. **Aaji's screen.** An Android tablet by her chair (or her own phone). She talks; it answers in Marathi. Big text, slow speech, nothing to learn.
2. **The family app.** On Riya's, Anand's and Meera's phones: Aaji's day, alerts, messages, visits, her stories.
3. **The Didi app.** On Sunita's phone: bookings, briefings, training, earnings.
4. **Saathi's brain.** Gemini, which understands what people say and decides what to do.
5. **Saathi's backbone.** Google Cloud, which does the careful parts (rules, records, alerts) and never forgets.

### What happens when Aaji says "I took my tablet"

1. Her tablet hears her and Google's speech recognition writes down her Marathi.
2. Gemini understands that she means the white blood-pressure tablet.
3. Saathi's rules check: was it due? Was it already taken today? (This part is ordinary, tested code, not AI.)
4. It is recorded in the family's shared record, and Riya's app shows it a moment later.
5. Saathi tells Aaji, in Marathi, that it's noted, and if she tries again later, that she already took it.

### What happens when Aaji asks for help

1. She says "I fell" or presses Help.
2. Saathi starts an escalation that Google Cloud keeps running even if a server restarts.
3. The family is alerted on their phones, by email and by message.
4. If nobody says "I'm on it", the neighbour, or the nearest Saathi Didi, is asked to look in.
5. If nobody responds, everyone receives emergency guidance with Aaji's address and the right emergency number.
6. The moment anyone says "I'm on it", Saathi tells Aaji, in Marathi, that someone is coming.

### What happens when a scammer calls

1. Aaji mentions the call, or Sahay sees AnyDesk open next to her bank page.
2. Saathi tells her calmly not to share or pay anything, and why.
3. On her computer, Sahay closes the remote-control app or the fake page and shows a Safety Pause.
4. The family is told immediately, with a screenshot that has the private numbers blacked out.
5. Remote access stays blocked until the family decides.

### What happens when Riya books a Didi

1. Riya chooses "Doctor escort, Thursday 11:00".
2. Saathi finds verified Didis nearby, using Google Maps.
3. Sunita accepts. Aaji is told who is coming.
4. Before the visit, Gemini writes Sunita a briefing in Marathi from Saathi's records, sharing only what the family allows.
5. Sunita checks in, takes Aaji, checks out, and leaves a voice note. Riya reads it in English.
6. Sunita is paid to her UPI account.

### Where the AI stops and ordinary code starts

| Gemini does | Ordinary, tested code does |
|---|---|
| Understanding what people say, in any mix of languages | Deciding who may see or do what |
| Choosing which ability to use | Counting tablets and stopping double doses |
| Explaining things warmly and simply | Running the help escalation |
| Writing letters, briefings and summaries | Sending payments |
| Recognising a scam story | Blocking remote access during a hold |

That split is why Saathi can be friendly and still be trusted with an elder's safety.

### Privacy, simply

- Each family's information is kept apart from every other family's.
- Private messages are encrypted so that only family devices can read them.
- Health records are sealed with keys held in Google Cloud's key service.
- A Didi sees only what the family chooses to share for that visit.
- Scam patterns are shared only as anonymous kinds of scam.
- No ads, no selling data, no training AI on family records.

---

## 20. Application answers, ready to paste

**Startup / product name:** Saathi (साथी, "companion")

**One-line description:** An AI companion used by 200 elders that keeps them safe, independent and close to family in their own language, and now creates paid care work for women nearby, built on Gemini and Google Cloud.

**Problem:** India's elders increasingly live alone while their children live in other cities or abroad. Tablets are missed or doubled, days blur, loneliness goes unspoken, and scammers target them. The women who do most of the caring (daughters, neighbours, nurses, ayahs) are rarely paid for it.

**Solution:** Saathi gives the elder a companion that speaks her language (reminders, check-ins, help, scam warnings, translated family messages, a memory book) and gives the family one shared view and alerts that escalate until someone responds. Saathi Didis, our new product, lets families book verified women nearby for doctor escorts, visits and refills, with a briefing from Saathi before every visit, payments to her UPI account and training in her language.

**Target users:** Elders living alone and their families in India and abroad; women in the same neighbourhoods who want paid, flexible care work; home-care organisations.

**Traction:** 200 elders use Saathi today; an elder home-care organisation has accepted Saathi for its elders.

**Use of Google AI and Google Cloud:** Gemini and Gemini Live for conversation in Indian languages; Gemini Nano for on-device scam detection; Nano Banana and Lyria for Living Legacy and Didi profile cards; ADK and Vertex AI Agent Engine for Saathi's agents; Speech-to-Text, Text-to-Speech and Translation; Firebase (Authentication, Firestore, Cloud Messaging, Hosting, App Check, Remote Config); Cloud Run, Workflows, Pub/Sub, Scheduler, Storage, KMS; BigQuery and Looker Studio; Google Maps Platform; Google Home APIs; Calendar, Docs and Gmail APIs; Conversational Agents for the daily phone call.

**Technical architecture:** Android apps for the elder, the family and the Didi, on Firebase. Gemini understands and plans; tested code on Cloud Run decides permissions, counts tablets, runs escalations and payments. Workflows keeps help alerts running until someone responds. Each family's data is isolated; private messages are end-to-end encrypted; health records are sealed with keys in Cloud KMS.

**Business model:** Family plans (daily calls, Insight, Family Voice) with all safety features free; per-visit or monthly Didi bookings with a small commission; home-care organisations pay for scheduling and briefing their caregivers.

**Why us:** We built Saathi and shipped it to 200 elders, including security with mathematically proven permission rules and an agent that stops scams on the screen. We know the elders, the families and now the caregivers.

**What we will build at the buildathon:** Saathi Didis on Google, from sign-up and training to booking, the visit briefing, check-in, the translated visit note and payment.

---

## 21. Pitch deck and demo

### Deck (12 slides)
1. **Riya and Kamala**: one photo-like illustration, one sentence: *"She nearly read out the OTP."*
2. **The problem**: elders alone, families far away, scams, unpaid women carers.
3. **Saathi**: a companion that speaks her language, and a circle that never misses an alert.
4. **200 elders and a care partner**: the proof.
5. **A day with Saathi**: five moments (tablet, check-in, scam stopped, doorbell, story).
6. **The new product: Saathi Didis**: Sunita's story.
7. **Live demo**.
8. **Why Google**: Gemini understands real people; India's languages; Android; shared priorities.
9. **How it works**: AI understands, tested code decides, Google Cloud never forgets.
10. **Trust**: no ads, safety free, nothing important without a yes, proven permission rules.
11. **Business and impact**: family plans, Didi bookings, partners; women earning, elders safer.
12. **Ask**: credits, mentors and introductions to home-care networks and employers.

### Demo (three minutes)
1. **(30 s) Aaji's screen:** she asks the day in Marathi; Saathi answers; Riya's recorded voice plays before the tablet reminder.
2. **(30 s) A scam:** a "CBI officer" story; Saathi warns her calmly; the family's phones light up.
3. **(60 s) Saathi Didis:** Riya books Sunita for Thursday's clinic visit; Sunita's phone shows the Marathi briefing; she checks in.
4. **(40 s) The note:** Sunita's Marathi voice note appears for Riya in English: *"Aaji was cheerful. The doctor changed the night tablet."* Riya confirms the change in Saathi with one tap.
5. **(20 s) Sunita's earnings** for the month, and her shareable profile card.

Rehearse twice with the real devices; keep a recorded backup of every step.

---

## Closing

Riya will always worry; that is what love does across time zones. But she should not have to wonder whether her grandmother took her tablet, whether the voice on the phone was a scammer, or whether anyone looked in today.

Kamala should not have to choose between her independence and her safety.

And Sunita, two lanes away, who has cared for her own mother and her husband's, should be able to earn a living from the care she already knows how to give.

**Saathi on Google brings the three of them together.**
