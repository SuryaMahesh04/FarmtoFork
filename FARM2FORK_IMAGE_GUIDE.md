# FARM2FORK PROJECT REPORT — IMAGE GENERATION GUIDE (UPDATED)

**Document:** Farm2Fork: A Cryptographically Secured Agricultural Supply Chain Management System with QR-Based Consumer Traceability

**Last Updated:** April 2025 — Revised to match condensed 50–65 page report structure

**Purpose of This Document:**
This guide provides:
1. The exact AI image generation prompt for each figure listed in the report's "List of Figures."
2. The **precise updated location** in the condensed report where the generated image must be inserted.
3. A caption to write below each image once inserted.

> **Note on What Changed:** The main report was condensed from ~100 pages to ~50–65 pages. Several chapters were merged and renumbered. **The images/diagrams themselves have NOT changed** — they still depict the same system, same architecture, and same data. Only the **insertion locations** have changed. This updated guide reflects the new chapter and section numbers.

**Total Figures Required:** 10 (condensed from 15; 5 figures from the original guide have been removed as their sections were merged away)

**How to use this guide:**
- Use the prompts below with any AI image generator (e.g., DALL-E, Midjourney, Adobe Firefly, Stable Diffusion).
- For diagram-style figures (flowcharts, architecture diagrams, ERDs), tools like **Lucidchart**, **draw.io**, **Figma**, or **Canva** are strongly recommended over AI image generators, as they produce cleaner technical output.
- After generating each image, insert it into the report at the location described.
- Write the caption exactly as shown below each figure entry.
- Recommended image format: PNG, minimum 1200 × 800 pixels, white background.

---

## ✅ FIGURES THAT ARE STILL REQUIRED (Updated Placements)

---

## FIGURE 1.1

**Figure Title:** Farm2Fork Ecosystem — Six Roles and Consumer Portal

**⚠ Placement Updated:**
- Chapter: **Chapter 1 — Introduction**
- Section: **Section 1.1 — Overview and Background**
- Insert after the paragraph ending *"...making it practically accessible to agricultural cooperatives, government food safety agencies, and NGOs working with smallholder farming communities."*
- Insert immediately before the heading **"## 1.2 Problem Statement"**

**Caption to Write Below the Image:**
> *Figure 1.1: Farm2Fork Platform Ecosystem — Showing the interconnection of the six stakeholder roles (Farmer, Transporter, Driver, Distributor, Retailer, Administrator) and the public Consumer Portal through a central secure platform.*

**Recommended Tool:** Canva, Figma, or draw.io

**AI Image Generation Prompt:**
```
A clean, professional infographic diagram on a white background showing the Farm2Fork agricultural supply chain management platform ecosystem. At the center, place a circular logo or hub labeled "Farm2Fork Platform". Connected to this central hub via arrows, arrange six role icons around the edges: (1) Top-left: a farmer icon labeled "Farmer" with a field in background, (2) Top-right: a truck icon labeled "Transporter", (3) Right: a driver steering wheel icon labeled "Driver", (4) Bottom-right: a warehouse icon labeled "Distributor", (5) Bottom-left: a shop icon labeled "Retailer", (6) Left: a shield/settings icon labeled "Administrator". Below the central hub, a separate outward-pointing arrow leads to a smartphone icon labeled "Consumer Portal (Public — QR Scan)". The visual style should be flat design, green and white color scheme with dark teal accents. Professional and academic. No handwriting or artistic style. Clean iconography similar to a BPMN or enterprise software diagram.
```

---

## FIGURE 4.1

**Figure Title:** End-to-End Cryptographic Supply Chain Flow

**⚠ Placement Updated:**
- Chapter: **Chapter 4 — Proposed System**
- Section: **Section 4.2 — Cryptographic Security Architecture**
- Insert after the opening sentence *"The cryptographic security architecture implements three layers of data protection:"* and immediately before the **"Layer 1 — Field-Level AES-256-GCM Encryption"** bold subheading.

**Caption to Write Below the Image:**
> *Figure 4.1: End-to-End Cryptographic Supply Chain Flow — From farmer batch creation (AES-256-GCM encryption + HMAC-SHA256 signing) through transport and distribution, to the consumer QR scan and tamper status display.*

**Recommended Tool:** draw.io or Lucidchart

**AI Image Generation Prompt:**
```
A professional technical flowchart on a white background showing an end-to-end cryptographic agricultural supply chain flow. Show a left-to-right horizontal flow with the following sequential stages as labeled boxes connected by arrows: (1) "Farmer Creates Batch" box with a padlock icon inside indicating AES-256-GCM encryption, (2) "HMAC-SHA256 Signs Record" box with a fingerprint/signature icon, (3) "MongoDB Stores Encrypted Batch" box with a database cylinder icon, (4) "QR Code Generated" box with a QR code icon, (5) "Transporter Accepts" box, (6) "Driver Delivers" box, (7) "Distributor Receives" box, (8) "Retailer Lists Product" box, (9) "Consumer Scans QR" box with a smartphone icon, (10) "Tamper Status Verified" box split into green "Verified" and red "Compromised" paths. Each box should show an automatic "Journey Array Updated" side arrow pointing to a vertical timeline strip on the side. Color scheme: dark teal and green on white. Professional academic diagram style. Labels are readable at 1200px width.
```

---

## FIGURE 4.2

**Figure Title:** AES-256-GCM Encryption with HMAC Signature Layer

**⚠ Placement Updated:**
- Chapter: **Chapter 4 — Proposed System**
- Section: **Section 4.2 — Cryptographic Security Architecture**
- Insert after the **"Layer 2 — HMAC-SHA256 Document Signing"** description block (after the sentence ending *"...stored as `documentSignature` on the batch record."*)
- Insert immediately before the **"Layer 3 — Chain-Linking for Sequential Integrity"** bold subheading.

**Caption to Write Below the Image:**
> *Figure 4.2: AES-256-GCM Field-Level Encryption combined with HMAC-SHA256 Document Signing — illustrating the two-layer cryptographic security model applied to each batch record.*

**Recommended Tool:** draw.io or PowerPoint

**AI Image Generation Prompt:**
```
A clean two-layer technical diagram on a white background illustrating how Farm2Fork applies AES-256-GCM encryption and HMAC-SHA256 signing to a database record. At the top, show a "Plaintext Batch Record" box with readable fields: crop, quantity, price, notes, farmerId, harvestDate. Draw a downward arrow to Layer 1: show three fields (quantity, price, notes) being encrypted with individual padlock icons and labeled "AES-256-GCM Encrypted — stored as { ciphertext, IV, authTag }". The other fields (crop, farmerId, harvestDate) remain visible and labeled "Plaintext Fields". Draw a second downward arrow to Layer 2: show all fields (both encrypted and plaintext) feeding into an HMAC function box labeled "HMAC-SHA256 with MASTER_KEY" which outputs a single "documentSignature" value shown as a long hex string. An additional "previousRecordHash" arrow from the previous batch feeds into the HMAC box from the left. At the bottom, show a "MongoDB Document Stored" box containing the final structure. Color: green and teal on white. Clean, flat, academic technical style.
```

---

## FIGURE 6.1

**Figure Title:** Three-Tier System Architecture with Cryptographic Layer

**⚠ Placement Updated:**
- Chapter: **Chapter 6 — System Architecture**
- Section: **Section 6.1 — Multi-Tier Architecture**
- Insert after the opening paragraph ending *"...it operates as an in-process library within the Node.js server — never exposed to the client."*
- Insert immediately before the **"Presentation Tier:"** bold subheading.

**Caption to Write Below the Image:**
> *Figure 6.1: Farm2Fork Three-Tier System Architecture with Cryptographic Service Layer — Presentation Tier (React.js), Application Tier (Express.js + Cryptographic Engine), and Data Tier (MongoDB Atlas).*

**Recommended Tool:** draw.io or Lucidchart

**AI Image Generation Prompt:**
```
A professional three-tier web architecture diagram on a white background, drawn as three horizontal layers stacked vertically. TOP LAYER (labeled "Tier 1 — Presentation Tier"): show a React.js logo with icons representing six role dashboards (Farmer, Transporter, Driver, Distributor, Retailer, Admin) and a Public QR Trace Portal. MIDDLE LAYER (labeled "Tier 2 — Application Tier"): show an Express.js server box containing: JWT Authentication Middleware, RBAC Authorization Middleware, Rate Limiter, Route Controllers, and inside a highlighted box with a lock icon labeled "Cryptographic Service Layer" containing AES-256-GCM and HMAC-SHA256 functions. BOTTOM LAYER (labeled "Tier 3 — Data Tier"): show a MongoDB Atlas database cylinder with icons for the five collections: users, batches, shipments, vehicles, notifications. Between each tier, show bidirectional HTTPS arrows. The Cryptographic Service Layer should be visually distinguished from the rest of the Application Tier with a different background shade. Color scheme: dark teal, green, white. Clean professional technical diagram. No decorative elements.
```

---

## FIGURE 6.2

**Figure Title:** Batch Creation and Encryption Sequence

**⚠ Placement Updated:**
- Chapter: **Chapter 6 — System Architecture**
- Section: **Section 6.2 — Data Security Layer and Supply Chain Data Flow**
- Insert after the batch creation pipeline code block (ending with *"→ Return batchId, _id, documentSignature to frontend"*)
- Insert immediately before the **"Supply Chain Data Flow:"** bold subheading.

**Caption to Write Below the Image:**
> *Figure 6.2: Batch Creation and Encryption Sequence — Stepwise flow from the farmer submitting the batch creation form through field encryption, HMAC signing, chain-linking, and final MongoDB document storage.*

**Recommended Tool:** draw.io or SequenceDiagram.org

**AI Image Generation Prompt:**
```
A UML-style sequence diagram on a white background with four participants shown as vertical lifelines: "Farmer Browser", "Express API Controller", "cryptoEngine.js", "MongoDB Atlas". Show the following sequence of messages between them: (1) Farmer Browser → Express API: POST /api/farmer/batches {crop, quantity, price, notes}. (2) Express API → cryptoEngine: encrypt(quantity) → returns {ciphertext, IV, authTag}. (3) Express API → cryptoEngine: encrypt(price) → returns {ciphertext, IV, authTag}. (4) Express API → cryptoEngine: encrypt(notes) → returns {ciphertext, IV, authTag}. (5) Express API → MongoDB: findOne().sort({createdAt:-1}) → returns previousRecordHash. (6) Express API → cryptoEngine: signPayload({batchId, farmerId, crop, quantityCipher, previousRecordHash, timestamp}) → returns HMAC-SHA256 documentSignature. (7) Express API → MongoDB: batch.save() → returns saved batch _id. (8) Express API → Farmer Browser: 201 Created {batchId, _id, documentSignature}. Label each return arrow in grey. Style: clean UML sequence diagram with pastel blue lifeline boxes and grey activation bars. White background. Text readable at 1200px.
```

---

## FIGURE 6.3

**Figure Title:** Supply Chain Journey Sync Flow

**⚠ Placement Updated:**
- Chapter: **Chapter 6 — System Architecture**
- Section: **Section 6.2 — Data Security Layer and Supply Chain Data Flow**
- Insert after the **"Step 7 — Consumer Scan (any time after Step 2)"** paragraph and the sentence ending *"...without reissuing or modifying the QR itself."*
- Insert immediately before the heading **"## 6.3 QR Traceability and Deployment Architecture"**

**Caption to Write Below the Image:**
> *Figure 6.3: Supply Chain Journey Sync Flow — Every stakeholder action automatically appends a timestamped entry to the Batch journey array via atomic MongoDB $push operations, creating a continuously growing supply chain ledger.*

**Recommended Tool:** draw.io or Lucidchart

**AI Image Generation Prompt:**
```
A horizontal timeline flow diagram on a white background showing how a Batch document's journey array grows over time. At the top, show a horizontal timeline arrow labeled "Batch Lifecycle Timeline". Below the arrow, at regular intervals, show events as vertical drops to a "Journey Array" box at the bottom. Each event is a labeled circle or milestone on the timeline: Event 1: "Farmer Creates Batch" (farmer icon, green dot) — adds Journey Entry: {stage: 'Harvested', actorRole: 'farmer'}. Event 2: "Transporter Assigns Driver" (truck icon) — adds Journey Entry: {stage: 'assigned', actorRole: 'transporter'}. Event 3: "Driver at Pickup" (steering wheel icon) — adds Journey Entry: {stage: 'At Pickup Location', actorRole: 'driver'}. Event 4: "Driver Picks Up" — adds Journey Entry: {stage: 'Picked Up'}. Event 5: "In Transit" — adds Journey Entry: {stage: 'In Transit'}. Event 6: "Delivered" — adds Journey Entry: {stage: 'Delivered to Distributor'}. At the bottom right, show the final journey array as a vertical list of all 6 entries stacked chronologically. Each entry shows: stage, timestamp, actorRole. Show the MongoDB $push operation as a small icon on each event drop. Color: green, teal, white. Professional clean diagram.
```

---

## FIGURE 8.1

**Figure Title:** Entity Relationship Diagram (ERD) — MongoDB Collections

**⚠ Placement Updated:**
- Chapter: **Chapter 8 — System Design and Implementation**
- Section: **Section 8.1 — Database Schema Design**
- Insert after the **"Supporting Collections:"** bullet list (after the Notifications bullet ending *"...`isRead` (Boolean, default false)."*)
- Insert immediately before the heading **"## 8.2 Cryptographic Engine Implementation"**

**Caption to Write Below the Image:**
> *Figure 8.1: Entity Relationship Diagram (ERD) showing the five MongoDB collections in Farm2Fork — Users, Batches, Shipments, Vehicles, and Notifications — and their reference relationships.*

**Recommended Tool:** draw.io or dbdiagram.io (highly recommended)

**AI Image Generation Prompt:**
```
A clean Entity Relationship Diagram (ERD) on a white background showing five MongoDB collection entities connected by reference relationships. Each entity is shown as a rounded rectangle box. ENTITY 1 "users" collection: fields listed inside — _id (ObjectId, PK), name, email, password (bcrypt hash), role (farmer/transporter/driver/distributor/retailer/admin), isVerified, profile (nested object), createdAt. ENTITY 2 "batches" collection: fields — _id (ObjectId, PK), batchId, farmerId (FK → users._id), crop, cropHash, quantity (encrypted object), pricePerUnit (encrypted object), notes (encrypted object), qualityScore, harvestDate, documentSignature, previousRecordHash, journey (embedded array), status, createdAt. ENTITY 3 "shipments" collection: fields — _id (ObjectId, PK), shipmentId, batchId (FK → batches._id), farmerId (FK → users._id), transporterId (FK → users._id), driverId (FK → users._id), distributorId (FK → users._id), status, trackingUpdates (array). ENTITY 4 "vehicles" collection: fields — _id (ObjectId, PK), vehicleNumber, type, capacity, transporterId (FK → users._id), driverId (FK → users._id), isAvailable. ENTITY 5 "notifications" collection: fields — _id (ObjectId, PK), userId (FK → users._id), type, title, message, relatedBatchId (FK → batches._id), relatedShipmentId (FK → shipments._id), isRead, createdAt. Connect entities with labeled crow's-foot notation arrows: users 1→N batches (farmerId), users 1→N shipments (farmerId, transporterId, driverId each), batches 1→1 shipments (batchId), users 1→N notifications (userId). White background. Professional ERD style. Color: light blue entity headers with white body.
```

---

## FIGURE 8.2

**Figure Title:** Batch Lifecycle State Machine

**⚠ Placement Updated:**
- Chapter: **Chapter 8 — System Design and Implementation**
- Section: **Section 8.3 — Batch Management, Journey Sync, and Dashboards**
- Insert after the **"Batch Creation Controller Flow"** numbered steps list (after step 8: *"Response includes `batchId`, `_id`, `documentSignature`..."*)
- Insert immediately before the **"Journey Sync — Driver Assignment:"** bold subheading.

**Caption to Write Below the Image:**
> *Figure 8.2: Batch Lifecycle State Machine — showing the valid status transitions of a batch from creation through the supply chain to final retail sale, with the triggering actor and event for each transition.*

**Recommended Tool:** draw.io (state machine diagram)

**AI Image Generation Prompt:**
```
A UML state machine diagram on a white background showing the lifecycle states of a Farm2Fork batch record. Show five rounded rectangle states connected by labeled directed arrows indicating transitions: STATE 1 (initial state, filled black circle entry arrow): "active" — the batch has been created and signed. TRANSITION from "active" to STATE 2: "shipped" — triggered by "Farmer creates Shipment Request + Transporter accepts". STATE 2: "shipped" — the batch is assigned to a transporter and driver. TRANSITION from "shipped" to STATE 3: "in-transit" — triggered by "Driver updates status to picked_up or in-transit". STATE 3: "in-transit" — the batch is physically moving. TRANSITION from "in-transit" to STATE 4: "delivered" — triggered by "Driver updates status to delivered". STATE 4: "delivered" — batch received at distributor. TRANSITION from "delivered" to STATE 5: "sold" — triggered by "Retailer lists product as available for sale". STATE 5: "sold" — final state (double circle or thick border). On each transition arrow, also show the Journey Array entry that gets appended (shown as small text label in italics). Color: green states, dark teal arrows. White background. Clean UML style.
```

---

## FIGURE 9.1

**Figure Title:** Defense-in-Depth Security Architecture Layers

**⚠ Placement Updated:**
- Chapter: **Chapter 9 — Security and Authentication**
- Section: **Section 9.1 — Security Architecture and Cryptographic Controls**
- Insert after the four-layer numbered list (ending *"...`MASTER_KEY` never in source code — `.gitignore` excludes `.env`"*)
- Insert immediately before the sentence starting **"No single layer is relied upon exclusively..."**

**Caption to Write Below the Image:**
> *Figure 9.1: Farm2Fork Defense-in-Depth Security Architecture — Four concentric security layers from network-level TLS to application-level JWT/RBAC to data-level AES-256-GCM encryption and HMAC signing.*

**Recommended Tool:** draw.io or PowerPoint (concentric circles / onion diagram)

**AI Image Generation Prompt:**
```
A concentric circles (onion) security architecture diagram on a white background representing Farm2Fork's defense-in-depth security layers. From outermost to innermost circle: OUTER RING (Layer 1 — light grey): labeled "Network Security" — description text inside: "TLS 1.2 / 1.3 (HTTPS) — All traffic encrypted in transit — HTTP to HTTPS redirect enforced". SECOND RING (Layer 2 — light blue): labeled "Application Security" — description: "JWT Authentication — bcrypt password hashing — RBAC authorization — Rate limiting (100 req/15 min/IP) — express-validator input sanitization". THIRD RING (Layer 3 — light green): labeled "Data Security" — description: "AES-256-GCM field-level encryption — HMAC-SHA256 document signing — Chain-linked tamper detection — Blind index for encrypted search". INNERMOST CIRCLE (Layer 4 — dark green): labeled "Operational Security" — description: "Environment variables only — .gitignore excludes .env — MASTER_KEY never in source code". At the center: a small padlock icon labeled "Protected Batch Data". The rings should have distinct colors getting more saturated toward the center. White background. Clean, professional infographic style without 3D effects.
```

---

## FIGURE 10.1

**Figure Title:** Test Coverage Summary — Pass/Fail Distribution

**⚠ Placement Updated:**
- Chapter: **Chapter 10 — Testing and Validation**
- Section: **Section 10.3 — Test Results Summary** *(previously Section 10.6 — now renumbered)*
- Insert after **"Table 10.2: Overall Test Results Summary"** table
- Insert immediately before the **"Performance Metrics:"** bold subheading.

**Caption to Write Below the Image:**
> *Figure 10.1: Test Coverage Summary — Pass/Fail distribution across the five testing categories, showing 115 tests passed and 1 failed (subsequently resolved) out of 116 total tests, achieving a 99.1% overall pass rate.*

**Recommended Tool:** Microsoft Excel chart, Google Sheets chart, or Recharts exported as image

**AI Image Generation Prompt:**
```
A professional data visualization dashboard on a white background showing two charts side by side for the Farm2Fork testing results. LEFT CHART: A horizontal grouped bar chart titled "Tests by Category" with the following data rows from top to bottom: "Backend Unit Tests": 52 passed (green bar), 0 failed. "Frontend Unit Tests": 19 passed (green bar), 0 failed. "API Integration Tests": 31 passed (green bar), 1 failed (small red bar segment). "Tamper Detection Tests": 8 passed (green bar), 0 failed. "User Acceptance Tests": 5 passed (green bar), 0 failed. Show a legend: green = Passed, red = Failed. X-axis labeled "Number of Tests" from 0 to 55. RIGHT CHART: A donut chart titled "Overall Pass Rate" showing 115 out of 116 tests as a large green arc labeled "115 Passed (99.1%)" and a tiny red arc labeled "1 Failed (0.9%)". In the center of the donut: "99.1% Pass Rate" in bold green text. Professional, clean chart styling. White background. Academic report quality.
```

---

## ❌ FIGURES REMOVED FROM THIS VERSION

The following 5 figures from the original image guide are **no longer required** in the condensed report. Their placement sections were merged into other chapters and these figures would no longer have a natural place to be inserted:

| Original Figure | Why Removed |
|:---|:---|
| **Figure 4.3** — QR Code to Consumer Trace Architecture | Section 4.3 was condensed into prose; the concept is now covered by Figure 6.3 |
| **Figure 6.2 (original)** — Cryptographic Data Security Layer Encrypt/Verify Pipeline | Section 6.3 was merged into Section 6.2; replaced by the updated Figure 6.2 (Sequence Diagram) |
| **Figure 6.5 (original)** — Consumer QR Scan to Trace Timeline UI Wireframe | Section 6.5 was merged into Section 6.3; this is now covered by the Results Chapter screenshots |
| **Figure 8.2 (original)** — Encrypt-Sign-Store Data Flow Diagram | Section 8.2 was shortened; the concept is already covered by Figure 4.2 |
| **Figure 8.4 (original)** — Journey Array Append Sequence Diagram | Section 8.5 was merged into Section 8.3; the concept is covered by Figure 6.3 |

---

## UPDATED PLACEMENT SUMMARY TABLE

Quick reference for all **10 required figures** in the condensed report:

| Figure No. | Figure Title | Insert After | In Section |
|:---:|:---|:---|:---|
| 1.1 | Farm2Fork Ecosystem — Six Roles and Consumer Portal | Paragraph ending "...NGOs working with smallholder farming communities." | Ch 1 — Sec 1.1 Overview and Background |
| 4.1 | End-to-End Cryptographic Supply Chain Flow | Opening sentence of Section 4.2 (before "Layer 1" subheading) | Ch 4 — Sec 4.2 Cryptographic Security Architecture |
| 4.2 | AES-256-GCM Encryption with HMAC Signature Layer | After Layer 2 description (before "Layer 3" subheading) | Ch 4 — Sec 4.2 Cryptographic Security Architecture |
| 6.1 | Three-Tier System Architecture with Cryptographic Layer | Opening paragraph of Section 6.1 (before "Presentation Tier" subheading) | Ch 6 — Sec 6.1 Multi-Tier Architecture |
| 6.2 | Batch Creation and Encryption Sequence | After batch creation pipeline code block (before "Supply Chain Data Flow" subheading) | Ch 6 — Sec 6.2 Data Security Layer and Supply Chain Data Flow |
| 6.3 | Supply Chain Journey Sync Flow | After Step 7 description (before heading "6.3 QR Traceability") | Ch 6 — Sec 6.2 Data Security Layer and Supply Chain Data Flow |
| 8.1 | Entity Relationship Diagram (ERD) — MongoDB Collections | After Supporting Collections bullet list (before Section 8.2 heading) | Ch 8 — Sec 8.1 Database Schema Design |
| 8.2 | Batch Lifecycle State Machine | After Batch Creation Controller Steps 1–8 (before "Journey Sync — Driver Assignment" subheading) | Ch 8 — Sec 8.3 Batch Management, Journey Sync, and Dashboards |
| 9.1 | Defense-in-Depth Security Architecture Layers | After the 4-layer numbered list (before "No single layer is relied upon..." sentence) | Ch 9 — Sec 9.1 Security Architecture and Cryptographic Controls |
| 10.1 | Test Coverage Summary — Pass/Fail Distribution | After Table 10.2 Overall Test Results Summary (before "Performance Metrics" subheading) | Ch 10 — Sec 10.3 Test Results Summary |

---

## NOTES ON IMAGE GENERATION

**For Diagram Figures (Recommended: draw.io / Lucidchart):**
Figures 1.1, 4.1, 6.1, 6.3, 8.1, 8.2, 9.1 are best created using diagram tools rather than AI image generators. draw.io (diagrams.net) is free and exports clean PNG images.

**For Technical Architecture Diagrams (Recommended: draw.io or PowerPoint):**
Figures 4.2, 6.2 involve layered architectural concepts that work well in both draw.io and AI image generators.

**For Data Visualizations (Recommended: Excel / Google Sheets):**
Figure 10.1 is best created in Excel or Google Sheets using the data from Table 10.2, then exported as a PNG.

**Image Insertion Format in the Markdown Document:**
```markdown
![Figure X.X — Title here](./images/figure_X_X.png)

*Figure X.X: [Your caption text here]*
```

Create a folder called `images` in the same directory as the report file and save all generated figures there using the naming convention: `figure_1_1.png`, `figure_4_1.png`, `figure_4_2.png`, `figure_6_1.png`, `figure_6_2.png`, `figure_6_3.png`, `figure_8_1.png`, `figure_8_2.png`, `figure_9_1.png`, `figure_10_1.png`.

---

*End of Farm2Fork Image Generation Guide (Updated)*

*Total figures required: 10 | 5 figures removed (sections merged) | All placement locations updated for condensed report*
