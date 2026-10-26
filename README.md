# Aether — Certified Commercial Drone Pilots for Industry

> High-performance flight operations marketplace connecting FAA Part 107 certified commercial drone pilots with enterprise clients across infrastructure, precision agriculture, energy, surveying, and construction.

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Key Features & User Portals](#-key-features--user-portals)
- [Tech Stack](#-tech-stack)
- [Project Architecture & Directory Structure](#-project-architecture--directory-structure)
- [Prerequisites](#-prerequisites)
- [Installation & Getting Started](#-installation--getting-started)
- [Environment Variables Configuration](#-environment-variables-configuration)
- [Database Seeding & Demo Accounts](#-database-seeding--demo-accounts)
- [Available NPM Scripts](#-available-npm-scripts)
- [API Architecture & Routes](#-api-architecture--routes)
- [Troubleshooting & Common Questions](#-troubleshooting--common-questions)
- [License](#-license)

---

## 🚀 Overview

**Aether** is an enterprise drone flight marketplace built with **Next.js 14 App Router**, **TypeScript**, **MongoDB (Mongoose)**, and **Supabase Auth**. It streamlines mission scoping, pilot credential verification, proposal bidding, milestone advancement, and client payouts.

The platform provides dedicated role-based portals for **Pilots**, **Hiring Companies**, and **System Administrators**, backed by server-side authorization guards, audit logs, and notification flows.

---

## 🌟 Key Features & User Portals

### 1. 🧑‍✈️ Commercial Drone Pilot Portal (`/pilot/*`)
- **Pilot Profile & Fleet Registry**: Showcase years of flight experience, specialized equipment (e.g. RTK drones, thermal sensors, LiDAR payloads), skillsets, hourly rates, and flight radius.
- **License & Certificate Verification**: Securely upload aviation credentials (such as FAA Part 107 Commercial Remote Pilot licenses) for regulatory admin verification.
- **Job Discovery & Bidding**: Search and filter open enterprise flight missions by industry classification, location, budget, and required hardware; submit tailored flight proposals with competitive bids.
- **Mission Progression & Tracking**: Advance mission statuses from dispatch to data deliverable upload.
- **Earnings & Reviews**: Track completed contracts, payout histories, client satisfaction ratings, and verified reviews.

### 2. 🏢 Enterprise Hiring Company Portal (`/company/*`)
- **Mission Creation & Scoping**: Post detailed industrial flight operations specifying required aviation certifications, sensor equipment, flight dates, duration, location, and budgets.
- **Proposal Review & Candidate Screening**: Review incoming pilot bids, match scores, verified ratings, and flight portfolios.
- **One-Click Pilot Assignment**: Accept winning proposals, assign verified pilots, and automatically notify operators.
- **Project Lifecycle Management**: Monitor project milestones in real-time, inspect deliverable packages, and leave verified ratings.

### 3. 🛡️ Platform Administration Portal (`/admin/*`)
- **Aviation Compliance Audit**: Inspect uploaded pilot license documents, verify credential numbers, and approve or reject submissions with formal audit timestamps.
- **Verified Badge Issuance**: Pilots with approved licenses receive the green **✓ VERIFIED PILOT** credential badge unlocking compliance-restricted industrial contracts.
- **System-Wide Auditing**: Monitor all registered users, active projects, applications, and platform activity.

### 4. 🎨 Design System & UI/UX
- Built using **Tailwind CSS**, curated dark/light color themes, Bento-grid layouts, Lucide enterprise iconography, and responsive design for desktop, tablet, and mobile browsers.

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: Next.js 14 (App Router)
- **Library**: React 18
- **Language**: TypeScript (Strict Mode)
- **Styling**: Tailwind CSS, Class Variance Authority (CVA), `clsx`, `tailwind-merge`
- **Theme Support**: `next-themes` (Dark & Light mode support)
- **Icons**: `lucide-react`
- **Charts & Visualizations**: `recharts`
- **Forms & Validation**: `react-hook-form`, `zod`

### Backend & API
- **Runtime**: Node.js
- **API Architecture**: Next.js 14 Serverless Route Handlers (`app/api/*`)
- **Authentication**: Supabase Auth via `@supabase/ssr` (cookie-based session handling)
- **Authorization**: Role-based access control (RBAC) via `middleware.ts` & server-side helpers in `lib/permissions.ts`
- **Database & ODM**: MongoDB Atlas with Mongoose 8 (includes automatic fallback to in-memory MongoDB for offline environments)
- **Transactional Email**: Nodemailer (supporting Gmail SMTP and custom SMTP relays)
- **Media & File Storage**: Cloudinary integration for documents, licenses, and flight imagery

---

## 📂 Project Architecture & Directory Structure

```text
drone_pilots_project/
├── app/                              # Next.js 14 App Router
│   ├── (auth)/
│   │   ├── login/                    # Login page (Supabase Auth + MongoDB sync)
│   │   ├── register/                 # Role-based onboarding (Pilot / Company)
│   │   ├── forgot-password/          # Password recovery request page
│   │   └── reset-password/           # Password update page
│   ├── admin/                        # System Administrator views
│   │   ├── certifications/           # License audit and verification queue
│   │   ├── companies/                # Enterprise client roster
│   │   ├── dashboard/                # Platform health & metrics
│   │   ├── jobs/                     # Mission oversight
│   │   ├── pilots/                   # Pilot roster audit
│   │   └── users/                    # User account management
│   ├── company/                      # Enterprise Client views
│   │   ├── applications/             # Review candidate proposals
│   │   ├── dashboard/                # Active projects & operations overview
│   │   ├── jobs/                     # Company project management
│   │   ├── post-job/                 # Mission creation form
│   │   └── profile/                  # Company organizational profile
│   ├── pilot/                        # Commercial Pilot views
│   │   ├── active-jobs/              # Assigned flight missions
│   │   ├── applications/             # Sent bids & proposal status
│   │   ├── certification/            # Part 107 upload & verification status
│   │   ├── dashboard/                # Pilot analytics, earnings & quick actions
│   │   ├── jobs/                     # Mission discovery board
│   │   └── profile/                  # Drone gear, skills & operational areas
│   ├── jobs/                         # Public flight marketplace & job details
│   ├── pilots/                       # Public directory of verified operators
│   ├── api/                          # Serverless REST endpoints
│   │   ├── admin/                    # Admin management endpoints
│   │   ├── applications/             # Proposal submission & status updates
│   │   ├── auth/                     # login, register, logout, session, password
│   │   ├── certifications/           # Verification & rejection actions
│   │   ├── companies/                # Company profiles & data
│   │   ├── jobs/                     # Job creation, filtering, and assignment
│   │   ├── notifications/            # In-app real-time alerts
│   │   ├── payments/                 # Payout & transaction logs
│   │   ├── pilots/                   # Pilot profiles & fleet listings
│   │   └── upload/                   # Cloudinary file upload handler
│   ├── layout.tsx                    # Root layout & providers
│   ├── page.tsx                      # Landing homepage
│   └── globals.css                   # Global CSS styles & design tokens
├── components/                       # Reusable React components
│   ├── auth/                         # Auth shells & input wrappers
│   ├── brand/                        # Official Aether Logo & wordmarks
│   ├── layout/                       # Navbar, DashboardSidebar, Footer, ThemeToggle
│   ├── notifications/                # Notification bell & dropdown
│   ├── shared/                       # AuthProvider, StatusBadge, StarRating, EmptyState
│   └── ui/                           # Primitives (button, card, input, badge, alert, etc.)
├── lib/                              # Core backend utilities & integrations
│   ├── supabase/                     # Supabase SSR client utilities (browser & server)
│   ├── auth.ts                       # Auth configuration constants
│   ├── cloudinary.ts                 # Media & document upload helpers
│   ├── mailer.ts                     # Nodemailer SMTP transporter & HTML templates
│   ├── mongodb.ts                    # MongoDB connection manager with resilient fallback
│   ├── permissions.ts                # Server-side auth, role guards (requireRole)
│   ├── supabase.ts                   # Supabase client singleton
│   ├── supabase-admin.ts             # Privileged server-side Supabase admin client
│   ├── utils.ts                      # Formatting helpers (currency, date, cn)
│   └── validations.ts                # Zod schemas for request validation
├── models/                           # Mongoose Schemas & Data Models
│   ├── Application.ts                # Job proposal & bid records
│   ├── Certification.ts              # Pilot license uploads & approval status
│   ├── CompanyProfile.ts             # Company metadata & contact information
│   ├── Job.ts                        # Flight project details & assigned pilot
│   ├── Notification.ts               # In-app alert messages
│   ├── PasswordResetToken.ts         # Secure password recovery tokens
│   ├── Payment.ts                    # Escrow, payments & earnings
│   ├── PilotProfile.ts               # Equipment, experience, service areas & rate
│   ├── Review.ts                     # Rating stars & feedback comments
│   └── User.ts                       # Core account identity & role (PILOT/COMPANY/ADMIN)
├── scripts/                          # Automation scripts
│   ├── seed.ts                       # Database seeding script with realistic dummy data
│   └── test-db.ts                    # MongoDB connection verification utility
├── middleware.ts                     # Next.js route protection & session refresh
├── .env.example                      # Environment variables reference template
├── .env.local                        # Local environment variables (do not commit)
├── package.json                      # Dependencies and project scripts
├── tailwind.config.ts                # Tailwind styling tokens & themes
└── tsconfig.json                     # TypeScript configuration
```

---

## ⚙️ Prerequisites

Before running the application, ensure you have the following installed:
- **Node.js**: `v18.17.0` or later (Node.js `v20+` recommended)
- **Package Manager**: `npm` (comes with Node), `pnpm`, or `yarn`
- **MongoDB Database**: A free [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) cluster (or local MongoDB running on `mongodb://127.0.0.1:27017`)
- **Supabase Account**: A free [Supabase](https://supabase.com) project for authentication

---

## 📥 Installation & Getting Started

### 1. Clone or Open the Repository
```bash
git clone https://github.com/samidhamandage/drone_pilots_project.git
cd drone_pilots_project
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure Environment Variables
Copy the `.env.example` template to `.env.local`:
```bash
cp .env.example .env.local
```
*(On Windows PowerShell: `Copy-Item .env.example .env.local`)*

Open `.env.local` and add your database and API credentials (see [Environment Variables Configuration](#-environment-variables-configuration) below).

### 4. (Optional) Seed the Database with Realistic Demo Data
To populate the database with ready-to-test pilots, industrial jobs, applications, and admin accounts:
```bash
npm run seed
```

### 5. Launch the Development Server
```bash
npm run dev
```
Open **[http://localhost:3000](http://localhost:3000)** in your browser to view the application.

---

## 🔑 Environment Variables Configuration

Create a `.env.local` file in the root directory with the following variables:

```ini
# ==============================================================================
# Database Configuration (MongoDB)
# ==============================================================================
# Your MongoDB Atlas connection URI or local instance
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.example.mongodb.net/drone_marketplace?retryWrites=true&w=majority

# ==============================================================================
# Authentication (Supabase Auth)
# ==============================================================================
# Obtained from your Supabase Dashboard -> Project Settings -> API
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your_supabase_publishable_anon_key

# Supabase Service Role Secret Key (Server-only, do not share)
SUPABASE_SECRET_KEY=your_supabase_service_role_secret_key

# Application Host URL
NEXTAUTH_URL=http://localhost:3000

# ==============================================================================
# Transactional Email / SMTP (Nodemailer)
# ==============================================================================
# Used for password reset emails and system alerts
SMTP_HOST=smtp.gmail.com
SMTP_PORT=465
SMTP_SECURE=true
SMTP_USER=your_email@gmail.com
# Google App Password (16 characters generated under Google Account Security)
SMTP_PASS=abcd efgh ijkl mnop
SMTP_FROM_NAME="Certified Drone Pilots"
SMTP_FROM_EMAIL=your_email@gmail.com

# ==============================================================================
# Media & Document Uploads (Cloudinary)
# ==============================================================================
# Used for pilot certificate licenses and drone flight deliverables
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

# ==============================================================================
# Optional Integrations
# ==============================================================================
# Optional Google Maps API Key for mission map visualizers
NEXT_PUBLIC_MAPS_API_KEY=
```

> [!IMPORTANT]
> **MongoDB Atlas IP Whitelist**: In your MongoDB Atlas dashboard, navigate to **Security &rarr; Network Access** and ensure your IP address is whitelisted (or add `0.0.0.0/0` for development). If your IP is blocked, the application automatically falls back to an in-memory database to prevent crashes.

---

## 👥 Database Seeding & Demo Accounts

For rapid testing, the project includes pre-configured demo accounts. You can sign in using the **"One-Click Demo Accounts"** buttons on the `/login` page or enter the credentials manually:

| Role | Email | Password | Access Level |
| :--- | :--- | :--- | :--- |
| **System Admin** | `admin@example.com` | `admin123` | License audit, user management, system metrics |
| **Commercial Pilot** | `pilot@example.com` | `pilot123` | Bid on jobs, upload Part 107 license, view active flights |
| **Enterprise Company** | `company@example.com` | `company123` | Post missions, hire pilots, inspect deliverables |

To re-seed fresh test data at any time:
```bash
npm run seed
```

---

## 📜 Available NPM Scripts

| Command | Description |
| :--- | :--- |
| `npm run dev` | Starts the Next.js development server with hot-reloading at `localhost:3000` |
| `npm run build` | Compiles the production build, executes TypeScript type checks, and optimizes pages |
| `npm run start` | Launches the built production Next.js server |
| `npm run seed` | Executes the database seed script to populate realistic drone marketplace data |
| `npm run test:db` | Tests the direct connection to MongoDB Atlas and verifies collection access |

---

## 🔌 API Architecture & Routes

All API endpoints are implemented as serverless Route Handlers in `app/api`:

### 🔐 Authentication (`/api/auth/*`)
- `POST /api/auth/register` &mdash; Create pilot or company account (provisions Supabase Auth & MongoDB document).
- `POST /api/auth/login` &mdash; Authenticate via Supabase Auth with automatic MongoDB password sync for existing accounts.
- `POST /api/auth/logout` &mdash; Terminate session and clear authentication cookies.
- `GET /api/auth/session` &mdash; Retrieve currently authenticated user, profile details, and verification badge.
- `POST /api/auth/forgot-password` &mdash; Generate secure reset token and dispatch styled HTML email.
- `POST /api/auth/reset-password` &mdash; Validate token and update user password across databases.

### 🚁 Flight Projects (`/api/jobs/*`)
- `GET /api/jobs` &mdash; Filter and search open jobs by industry, budget, city, or status.
- `POST /api/jobs` &mdash; Post a new industrial drone project (Company only).
- `GET /api/jobs/:id` &mdash; Retrieve complete mission specifications, location, and assigned pilot.
- `PUT /api/jobs/:id` &mdash; Update mission milestone (e.g. `IN_PROGRESS`, `COMPLETED`).
- `DELETE /api/jobs/:id` &mdash; Cancel or remove project.

### 📄 Proposals & Applications (`/api/applications/*`)
- `GET /api/applications` &mdash; Query applications by job or pilot.
- `POST /api/applications` &mdash; Submit flight proposal with pricing and availability (Pilot only).
- `PUT /api/applications/:id` &mdash; Accept (`PILOT_SELECTED`), shortlist, or reject proposals.

### 🛡️ Certifications & Admin (`/api/certifications/*`, `/api/admin/*`)
- `GET /api/certifications` &mdash; View pending or verified pilot licenses.
- `PUT /api/certifications/:id/verify` &mdash; Admin approval granting the **✓ VERIFIED PILOT** credential.
- `PUT /api/certifications/:id/reject` &mdash; Reject license with formal audit reason.
- `GET /api/admin/dashboard` &mdash; Platform metrics, active contracts, and volume analytics.

---

## ❓ Troubleshooting & Common Questions

### 1. New users are not appearing in MongoDB Atlas
- **Cause**: Your current IP address is not whitelisted in MongoDB Atlas Network Access. To protect your app from crashing, `lib/mongodb.ts` falls back to an in-memory database in RAM.
- **Fix**: Open MongoDB Atlas &rarr; **Security** &rarr; **Network Access** &rarr; Click **Add IP Address** &rarr; Select **Allow Access from Anywhere (`0.0.0.0/0`)** &rarr; Click **Confirm**.

### 2. Supabase Auth returns network error / paused
- **Cause**: Supabase projects on the free tier automatically pause after 7 days of inactivity.
- **Fix**: Go to your [Supabase Dashboard](https://supabase.com/dashboard) and click **Restore Project** or **Resume** to reactivate the database and auth routing.

### 3. Password reset email is not sending
- **Cause**: Missing or incorrect Gmail App Password in `SMTP_PASS`.
- **Fix**: Make sure 2-Step Verification is enabled on your Google Account, visit [Google App Passwords](https://myaccount.google.com/apppasswords), generate a 16-character App Password for "Mail", and paste it into `SMTP_PASS` in `.env.local`.

---

## 📄 License

This project is licensed under the [ISC License](LICENSE).
Built for industrial commercial drone flight operations.
