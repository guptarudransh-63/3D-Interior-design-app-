# SpaceCraft — 3D Interior Design Showcase & Client Proposal Management Platform

> An architectural interior design platform uniting interactive 3D spatial exploration, physical material customization, persistent design configurations in MongoDB, and versioned proposal collaboration between clients and interior designers.

---

## 📌 Submission Overview & Evaluator Links

| Deliverable | Details / Links |
| :--- | :--- |
| **GitHub Repository** | [https://github.com/guptarudransh-63/3D-Interior-design-app-](https://github.com/guptarudransh-63/3D-Interior-design-app-) (Public) |
| **Live Deployed App** | https://3dinteriordesignapp-aeidjepz0-rudransh17.vercel.app/ (e.g. Vercel / Render / Netlify) |
| **Production Build** | Verified and generated in `client/dist/` (`npm run build` / `npm run preview`) |
| **Video Demonstration** | https://drive.google.com/drive/folders/1U5TUJqoNnq-4SIAD8SfCyfA2po8zyNjm?usp=sharing (YouTube / Loom / Google Drive — access set to **"Anyone with link"**) |
| **Pre-loaded Demo Accounts** | **1-Click Persona Switcher** built directly into the navbar, or manual login (see Section 6) |
| **Security Audit** | Clean — zero API keys, secrets, or sensitive credentials tracked in Git |

---

## 1. Product Overview

- **Product Name:** SpaceCraft
- **Product Type:** 3D Interior Design Concept Showcase and Client Proposal Management Platform
- **Target Users:**
  1. **Clients / Homeowners:** Individuals redesigning living salons, suites, kitchens, or executive studies who want to explore 3D concepts, test material pairings, save personalized configurations, and submit structured requirements.
  2. **Interior Designers:** Architects and designers who review spatial requirements, examine client material selections, calculate itemized cost schedules, and author versioned proposals.
  3. **Administrators:** Platform supervisors who manage room concepts, monitor live database metrics, and govern user roles.

### Problem Statement
Clients frequently struggle to articulate their spatial preferences, budget parameters, and material expectations. Designers receive fragmented briefs across chat and email, leading to misaligned expectations. Moreover, standard proposal tools simply overwrite previous quotes, destroying the historical audit trail of client change requests.

### Solution
SpaceCraft provides an integrated architectural ecosystem:
1. **Explore & Interact:** Real-time Three.js 3D room showcase with multi-angle camera views and lighting presets.
2. **Material Customization:** Instant PBR material swaps (flooring, walls, joinery, accents) reflected directly in the 3D scene.
3. **Database Persistence:** Client configurations are saved to MongoDB with verified user ownership.
4. **Project Brief Submission:** Structured requirements including room dimensions, budget range, and timeline linked directly to saved 3D designs.
5. **Sequential Proposal Versioning:** Designers publish immutable proposal versions (`v1`, `v2`...). Earlier versions are strictly preserved. Clients submit structured revision requests and formally accept specific version contracts.

---

## 2. Core User Journey

$$\text{Explore 3D Concepts} \longrightarrow \text{Customize Materials} \longrightarrow \text{Save to MongoDB} \longrightarrow \text{Submit Brief} \longrightarrow \text{Designer Proposal v1} \longrightarrow \text{Revision Request} \longrightarrow \text{Revised Proposal v2} \longrightarrow \text{Accept Version 2}$$

---

## 3. Technology Stack

### Frontend (`client/`)
- **Framework:** React 18 with Vite
- **3D Graphics & Spatial Canvas:** Three.js, React Three Fiber (`@react-three/fiber`), Drei (`@react-three/drei`)
- **Styling & Design System:** Tailwind CSS with an architectural editorial palette (warm ivory `#FAF8F5`, charcoal `#1C1917`, natural oak `#8C6D46`, walnut `#4A3425`, muted sage `#8E9A8B`, and terracotta accents `#B8654D`)
- **Icons & Transitions:** Lucide React, Framer Motion, Canvas Confetti
- **Routing & State:** React Router DOM v6, React Context (`AuthContext` with 1-click persona switcher)

### Backend (`server/`)
- **Runtime & Server:** Node.js (v20+ / v26) with Express.js (ES Modules)
- **Database & ODM:** MongoDB with Mongoose (indexes, relational references, cascading population)
- **Authentication:** JWT (JSON Web Tokens) with 30-day persistence and bcrypt password hashing
- **Security & Reliability:** Express Rate Limiting, CORS, centralized error handling, and server-side cost calculation

---

## 4. Architecture & Database Models

```text
final project/
├── client/                     # React 18 + Vite + Three.js Frontend
│   ├── src/
│   │   ├── components/3d/      # Three.js 3D Scene, Canvas, and 2D Fallback
│   │   ├── components/common/  # Navbar, Footer, StatusBadges
│   │   ├── context/            # AuthContext & 1-Click Demo Persona Switcher
│   │   ├── pages/              # Catalog, Studio, Saved Designs, Dashboards
│   │   └── services/           # Unified API Service Layer
│   └── package.json
├── server/                     # Express.js REST API Backend
│   ├── src/
│   │   ├── config/             # MongoDB connection configuration
│   │   ├── controllers/        # Auth, Concepts, Designs, Projects, Proposals, Admin
│   │   ├── middleware/         # JWT Auth, Role Guards, Error Handlers, Rate Limiters
│   │   ├── models/             # Mongoose Schemas (User, Project, Proposal, Version...)
│   │   ├── routes/             # RESTful API route declarations
│   │   └── scripts/            # Seed script & automated test runner
│   └── package.json
├── package.json                # Root workspace configuration with concurrently
└── README.md
```

### Mongoose Database Models
1. **`User`**: Name, email, hashed password, role (`client`, `designer`, `admin`), status (`active`, `suspended`).
2. **`RoomConcept`**: Slug, room type, design style, cover image, dimensions, budget range, 3D scene config, published flag.
3. **`MaterialOption`**: Category (`flooring`, `walls`, `cabinetry`, `accent`), hex code, texture type, roughness, metalness, cost modifier.
4. **`SavedDesign`**: Owner reference, room concept reference, selected material IDs, custom dimensions, calculated estimate, notes.
5. **`Project`**: Client owner, assigned designer, title, room type, dimensions, budget range, timeline, status machine (`Submitted` $\to$ `Under Review` $\to$ `Proposal Ready` $\to$ `Revision Requested` $\to$ `Accepted`).
6. **`Proposal`**: Master proposal record linking project, client, designer, current version number, and accepted version.
7. **`ProposalVersion`**: **Immutable published proposal snapshot**. Contains version number, scope of work checklist, itemized cost line items, server-calculated total cost, timeline, and client decision audit.
8. **`RevisionRequest`**: Pinned to a specific proposal version with client feedback notes and target focus areas.
9. **`ProjectActivity`**: Audit trail logging every milestone in the project lifecycle.

---

## 5. Main Engineering Highlights

### A. Real Persistent Saved Design Selections
- In the 3D studio, clients can test any material combination.
- Clicking **"Save Configuration"** writes a persistent record to MongoDB.
- Strict client isolation ensures other clients cannot view or alter private designs (verified with 403 Forbidden checks).
- Clients can edit notes, fork/duplicate configurations, or directly attach their design to a project brief.

### B. Immutable Sequential Proposal Versioning
- Designers author proposals with itemized line items across 7 categories (Materials, Furniture, Lighting, Labour, Installation, Permits, Other).
- The server validates line totals and calculates the official estimate:
  $$\text{Total} = \sum (\text{Quantity} \times \text{Unit Cost})$$
- Publishing creates an immutable `ProposalVersion` (Version 1).
- When a client requests changes, Version 1 remains intact. The designer publishes Version 2 with a revision summary.
- The client can compare versions side-by-side and accept or decline a **specific version number**.

### C. 3D Spatial Canvas with Fallback Mode
- Parametric architectural room geometry rendered in Three.js (walls, floor, panoramic architectural picture window, sofa, credenza, coffee table, lighting).
- Live PBR material reactivity: changing a material updates color, roughness, and metalness on the 3D meshes immediately.
- 4 Camera angle presets: Hero Perspective, Floorplan (Top-Down), Isometric, and Furniture Detail.
- **Graceful WebGL Fallback:** If WebGL is unavailable or on low-power devices, displays high-res architectural renders while preserving full material customization, cost estimation, and saved design functionality.

---

## 6. Pre-Configured Demo Accounts

For 3–5 minute video presentations and evaluator review, the platform includes a **1-Click Demo Persona Switcher** in the top navigation bar. You can also sign in manually with these pre-seeded accounts:

| Role | Name | Email | Password | Pre-loaded Data |
| :--- | :--- | :--- | :--- | :--- |
| **Client** | Marcus Sterling | `client@spacecraft.com` | `Client@12345` | Has saved designs and an active penthouse project with multi-version proposal history |
| **Designer** | Julian Vance | `designer@spacecraft.com` | `Designer@12345` | Assigned to Marcus's project; author of Version 1 and Version 2 proposals |
| **Admin** | Elena Rostova | `admin@spacecraft.com` | `Admin@12345` | Full platform telemetry access, concept catalog CRUD, and user role management |
| **Client 2** | Sarah Jenkins | `sarah@spacecraft.com` | `Client@12345` | Isolated client account for multi-tenant ownership verification |

---

## 7. Local Installation & Setup

### Prerequisites
- Node.js (v18+ recommended)
- MongoDB running locally on `mongodb://127.0.0.1:27017` or a MongoDB Atlas URI

### 1. Clone & Install
```bash
# From the repository root:
npm install

# Install server packages
npm --prefix server install

# Install client packages
npm --prefix client install
```

### 2. Configure Environment Variables
Create `server/.env` (pre-configured for local development):
```env
PORT=5001
MONGODB_URI=mongodb://127.0.0.1:27017/spacecraft
JWT_SECRET=spacecraft_super_secret_jwt_key_2026_interior_design
CLIENT_URL=http://localhost:5173
NODE_ENV=development
```

### 3. Seed Database with Rich Catalog Data
Populate demo users, 16 materials, 6 room concepts, a saved design, and a complete multi-version proposal history:
```bash
npm run seed
```

### 4. Run Development Servers
Start both backend (port 5001) and frontend (port 5173) simultaneously:
```bash
npm run dev
```
Open **[http://localhost:5173](http://localhost:5173)** in your browser.

---

## 8. Verification & Testing

SpaceCraft includes a dedicated automated test suite verifying all 7 core workflows:
```bash
npm test
```

### Automated Verification Output:
```text
[TEST]: Test server started on http://127.0.0.1:5099
[TEST]: --- 1. Testing System Health & API Availability ---
  ✓ PASS: GET /api/health returned healthy
[TEST]: --- 2. Testing Authentication & JWT Generation ---
  ✓ PASS: Client login successful with JWT
  ✓ PASS: Designer login successful
  ✓ PASS: Admin login successful
  ✓ PASS: Second client (Sarah) login successful
[TEST]: --- 3. Testing Room Concepts & Materials Catalog ---
  ✓ PASS: Retrieved 6 published room concepts
  ✓ PASS: Retrieved 16 material options
[TEST]: --- 4. Testing Persistent Saved Designs & Client Isolation ---
  ✓ PASS: Client created new persistent saved design
  ✓ PASS: Client isolation verified: Sarah rejected from accessing Marcus design (403 Forbidden)
[TEST]: --- 5. Testing Project Brief Submission & Ownership ---
  ✓ PASS: Project brief submitted successfully with status "Submitted"
[TEST]: --- 6. Testing Proposal Versioning & Immutability ---
  ✓ PASS: Designer published Proposal Version 1 ($15,000 computed total)
  ✓ PASS: Client successfully submitted revision request against Version 1
  ✓ PASS: Designer published Proposal Version 2 (Sequential number: 2)
  ✓ PASS: Proposal Immutability Verified: Version 1 ($15,000) and Version 2 ($13,000) both preserved intact
  ✓ PASS: Client accepted Proposal Version 2; Project marked "Accepted"
[TEST]: --- 7. Testing Admin Dashboard Metrics ---
  ✓ PASS: Admin dashboard returned real live counts
ALL 7 BACKEND WORKFLOW TESTS PASSED SUCCESSFULLY! ✓
```

### Frontend Production Build:
```bash
npm run build
# Compiles React 18, Three.js, R3F, and Tailwind CSS bundle cleanly with zero errors
```

---

## 9. API Endpoints Reference

### Authentication
- `POST /api/auth/register` — Register a new client or designer
- `POST /api/auth/login` — Authenticate and receive JWT token
- `GET /api/auth/me` — Retrieve current authenticated profile

### Room Concepts & Materials
- `GET /api/room-concepts` — Filter concepts by roomType, designStyle, search query, or budget sort
- `GET /api/room-concepts/:slug` — Full concept with available materials and 3D camera config
- `POST /api/room-concepts` — Create concept (Admin only)
- `PATCH /api/room-concepts/:id` — Update concept (Admin only)
- `GET /api/material-options` — Material catalog (flooring, walls, joinery, accent)

### Saved Designs (Client)
- `GET /api/designs` — List client's saved design configurations
- `POST /api/designs` — Persist custom 3D configuration to MongoDB
- `GET /api/designs/:id` — Get single saved design (Owner or staff only)
- `PATCH /api/designs/:id` — Update design name, notes, or materials (Owner only)
- `POST /api/designs/:id/duplicate` — Fork configuration into a new record
- `DELETE /api/designs/:id` — Remove saved configuration (Owner only)

### Project Briefs & Proposals
- `POST /api/projects` — Submit structured project brief and budget
- `GET /api/projects` — View accessible projects (Client sees own; Designer sees assigned/queue; Admin sees all)
- `GET /api/projects/:id` — Full project details with proposal and activity timeline
- `POST /api/projects/:id/proposals` — Author initial proposal (Version 1)
- `GET /api/proposals/:id/versions` — Retrieve immutable version history (v1, v2...)
- `POST /api/proposals/:id/versions` — Publish revised proposal version
- `POST /api/proposals/:id/versions/:versionId/revision-requests` — Client requests changes on specific version
- `POST /api/proposals/:id/versions/:versionId/accept` — Client formally accepts specific proposal version
- `POST /api/proposals/:id/versions/:versionId/decline` — Client declines specific proposal version

### Administration
- `GET /api/admin/dashboard` — Live database telemetry (counts of concepts, projects, users)
- `GET /api/admin/users` — List platform users
- `PATCH /api/admin/users/:id` — Change role or suspend/activate user

---

## 10. Suggested 3–5 Minute Demo Script

1. **Introduction (30s):**
   - Present SpaceCraft as an architectural interior design platform solving communication breakdowns between clients and designers.
2. **Concept Exploration & 3D Customizer (60s):**
   - Browse catalog to open *"Aura Minimalist Living Salon"*.
   - Rotate camera with OrbitControls and switch between *Hero View*, *Top-Down Plan*, and *Isometric*.
   - Use the material customizer to swap French Oak for Terrazzo and Mineral Sage for Alabaster. Note the live PBR mesh updates.
   - Click *"Save Configuration to MongoDB"* and show the saved design in *My Saved Designs*.
3. **Project Brief Submission (45s):**
   - Click *"Submit Brief"*, attaching the saved design with $20,000–$35,000 budget and dimensions.
   - Project appears in *Client Workspace* with status *"Submitted"*.
4. **Designer Workspace & Proposal Authoring (60s):**
   - Switch persona to **Designer (Julian)** using the 1-click switcher.
   - Open project brief, view requirements and attached 3D design.
   - Show proposal authoring with itemized cost line items and server-validated totals.
5. **Revision Request & Sequential Immutability (60s):**
   - Switch to **Client (Marcus)**. Review Version 1 and click *"Request Changes"*.
   - Switch back to **Designer (Julian)** to publish Version 2 with revised wide-plank oak flooring and updated total.
   - Switch to **Client (Marcus)** to compare Version 1 vs Version 2 side-by-side.
   - Click *"Accept Version 2"* (confetti celebration, status becomes *"Accepted"*).
6. **Admin Dashboard (30s):**
   - Switch to **Admin (Elena)** to show live MongoDB telemetry, concept management, and user role governance.

---

## 11. Known Limitations & Future Horizons
- The current 3D viewer is focused on material customization, camera perspectives, and architectural lighting rather than full CAD drag-and-drop geometry placement (an intentional scope decision).
- Direct file uploads use secure image URLs or Cloudinary when configured in production; local uploads fallback gracefully to URL references.

---

## 12. Deployment Guide (Vercel Frontend + Render Backend)

SpaceCraft is fully configured for a dual-cloud deployment (React + Vite on Vercel, Express + Node on Render, MongoDB Atlas database):

### 1. Backend Deployment on Render (Web Service)
1. In the [Render Dashboard](https://dashboard.render.com), click **New +** $\to$ **Web Service**.
2. Connect your GitHub repository: `guptarudransh-63/3D-Interior-design-app-`.
3. Configure settings:
   - **Name:** `spacecraft-backend` (or any unique name)
   - **Region:** Closest to your MongoDB Atlas cluster (e.g. Frankfurt, Oregon, Singapore)
   - **Branch:** `main`
   - **Root Directory:** `server` *(or leave blank / `./` — both root and server package.json contain the start script)*
   - **Runtime:** `Node`
   - **Build Command:** `npm install`
   - **Start Command:** `node src/server.js` *(or `npm start`)*
4. Configure **Environment Variables** in Render:
   - `PORT`: `5001` *(Render dynamically provides its own PORT; this fallback is safe)*
   - `NODE_ENV`: `production`
   - `MONGODB_URI`: `mongodb+srv://<username>:<password>@cluster0.mongodb.net/spacecraft?retryWrites=true&w=majority`
   - `JWT_SECRET`: A long secure secret key (e.g. `spacecraft_production_jwt_key_2026`)
   - `CLIENT_URL`: `https://<your-vercel-app>.vercel.app,http://localhost:5173` *(All `*.vercel.app` domains are also automatically allowed by CORS)*
5. Click **Create Web Service**.
   - Render will build and start the service.
   - You can verify backend health at: `https://<your-backend-name>.onrender.com/api/health`.

### 2. Frontend Deployment on Vercel
1. In the [Vercel Dashboard](https://vercel.com), click **Add New...** $\to$ **Project**.
2. Import your GitHub repository: `guptarudransh-63/3D-Interior-design-app-`.
3. Configure settings:
   - **Framework Preset:** `Vite`
   - **Root Directory:** `client` *(Click "Edit" and choose `client`)*
   - **Build Command:** `npm run build` *(runs `vite build`)*
   - **Output Directory:** `dist`
4. Configure **Environment Variables** in Vercel:
   - `VITE_API_URL`: `https://<your-backend-name>.onrender.com` *(Your live Render backend URL)*
5. Click **Deploy**.
   - Vercel installs all dependencies (including Vite) and builds the production bundle cleanly.
   - Client-side routing is handled without 404s via `client/vercel.json`.

### 3. Alternative: Zero-Config Monorepo on Vercel
If you also want a backup full-stack serverless deployment on Vercel alone:
- **Root Directory:** `./`
- Vercel runs `api/index.js` as an edge serverless API and `client/dist` as the frontend.

### 4. Database Seeding (MongoDB Atlas)
To populate the 6 3D room concepts, 16 physical materials, and pre-seeded evaluator demo accounts (`Client`, `Designer`, `Admin`) into your MongoDB Atlas cluster, run this command once from your local terminal:
```bash
MONGODB_URI="<your-mongodb-atlas-uri>" npm run seed
```

---

## 13. Pre-Submission Quality & Security Checklist

- [x] **Clean Working Tree:** All recent features (multi-room 3D scenes, camera controls, versioning) committed.
- [x] **Production Build Verified:** `npm run build` builds without errors.
- [x] **Zero Secrets in Repository:** Real `.env` files are in `.gitignore`. Only `.env.example` with placeholders is tracked.
- [x] **Automated Tests:** Comprehensive 7-workflow integration test script included (`npm test`).
- [x] **Documentation Complete:** Architecture diagrams, API catalog, model schemas, and demo script provided.
- [x] **Pre-seeded Accounts:** 1-Click demo persona switcher eliminates friction for evaluators.
