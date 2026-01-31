# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Faces Agency model registration application - a React SPA for talent agency candidate registration (Lebanon-based). Candidates submit detailed profile information via a multi-step form, and admins review applications through a dashboard.

## Commands

```bash
npm run dev       # Start Vite dev server (port 8080)
npm run build     # Production build
npm run build:dev # Development build with sourcemaps
npm run lint      # ESLint check
npm run preview   # Preview production build
```

## Tech Stack

- **Framework**: React 18 + TypeScript + Vite
- **UI**: shadcn/ui components (Radix primitives) + Tailwind CSS
- **Database**: Supabase (PostgreSQL) with auto-generated types
- **State**: React Query for server state, useState for local
- **Forms**: React Hook Form + Zod validation
- **Routing**: React Router DOM v6

## Architecture

### Directory Structure

```
/src
├── /pages              # Route components (Index, AdminLogin, AdminDashboard)
├── /components
│   ├── /registration   # Multi-step form orchestration
│   │   ├── RegistrationForm.tsx  # Main form controller
│   │   └── /steps/     # 9 form step components
│   └── /ui             # shadcn/ui components
├── /integrations/supabase
│   ├── client.ts       # Supabase client init
│   └── types.ts        # Auto-generated DB types
├── /lib
│   ├── formValidation.ts   # Zod schemas
│   └── submitApplication.ts
├── /data
│   └── lebanese-locations.ts  # Governorate/district/area hierarchy
└── /hooks              # Custom hooks (use-toast, use-mobile)
```

### Routes

- `/` - Registration form with animated welcome
- `/admin-login` - Admin authentication
- `/admin` - Dashboard (protected, admin role required)

### Database Schema

Main table: `applications` - stores all candidate data (personal info, measurements, talents, languages, photos)

Role system: `user_roles` table with `has_role(_user_id, _role)` function for access control

### Key Patterns

- **Form validation**: Zod schemas in `/lib/formValidation.ts` with step-specific validation
- **Multi-step form**: State managed in `RegistrationForm.tsx`, each step is a separate component
- **Admin access**: JWT auth via Supabase, role checked against `user_roles` table
- **Location data**: Hierarchical Lebanese locations (governorates → districts → areas)

## Environment Variables

```
VITE_SUPABASE_URL
VITE_SUPABASE_PUBLISHABLE_KEY
VITE_SUPABASE_PROJECT_ID
```

## Path Alias

`@/*` resolves to `./src/*` (configured in vite.config.ts and tsconfig)

## Data Strategy: HubSpot as Central CRM

### Core Principle

HubSpot serves as the single source of truth for all customer and candidate data. No customer information should live exclusively on the website, in spreadsheets, or within messaging platforms.

### Requirements

1. **Website Data Capture**: Every piece of data collected through the registration form must be captured, properly structured, and stored as HubSpot contact properties. The website is a data collection point, not a data store.

2. **Historical Data Migration**: All existing customer data from Excel spreadsheets must be cleaned, standardized, and imported into HubSpot. This migration must avoid duplicates and ensure no data is lost.

3. **WhatsApp Integration**: All customer communications via WhatsApp must be integrated with HubSpot, making conversations trackable and linked to the corresponding contact records.

### Technical Standards

- **Real-time or near-real-time syncing** between data sources and HubSpot
- **Clean, well-defined data schemas** with consistent property naming
- **Clear documentation** so future automations, workflows, and reporting can be built without rework
- **Reliable and scalable** architecture that can grow with the business

### Guiding Rule

HubSpot is the authoritative database. All other systems feed into it or read from it.

### Implementation Status

#### Website -> HubSpot Sync (IMPLEMENTED)

- **File**: `src/lib/hubspot.ts` - HubSpot API integration service
- **Integration Point**: `src/lib/submitApplication.ts` - Syncs on form submission
- **Behavior**: When a user submits the registration form:
  1. Data is saved to Supabase (primary storage)
  2. Data is synced to HubSpot asynchronously (non-blocking)
  3. If contact exists (matched by phone), it updates; otherwise creates new
- **Properties Schema**: See `docs/hubspot-properties-schema.md` for complete mapping

#### Excel Import (IMPLEMENTED)

- **Script**: `scripts/excel-to-hubspot.ts`
- **Usage**:
  ```bash
  # Dry run - validate and clean data
  npm run import:excel -- --file=data.xlsx --dry-run

  # Actual import
  HUBSPOT_ACCESS_TOKEN=xxx npm run import:excel -- --file=data.xlsx --import
  ```
- **Features**:
  - Automatic data cleaning (phone numbers, dates, names)
  - Deduplication by phone number
  - Batch import (100 contacts per API call)
  - Generates cleaned Excel file for review

#### WhatsApp Integration (DEFERRED)

- To be implemented later
- Will use Twilio or Meta WhatsApp Cloud API
- Will log conversations to HubSpot contact timeline

### HubSpot Setup Required

1. **Create HubSpot Private App**:
   - Go to Settings > Integrations > Private Apps
   - Create app with scopes: `crm.objects.contacts.read`, `crm.objects.contacts.write`
   - Copy access token

2. **Add Environment Variable**:
   ```
   VITE_HUBSPOT_ACCESS_TOKEN=your_token_here
   ```

3. **Create Custom Properties**:
   - Follow the schema in `docs/hubspot-properties-schema.md`
   - All properties use `faces_` prefix
   - Create property group: "Faces Agency"

### Data Flow

```
[Website Form] --> [Supabase] --> [HubSpot]
                       |              ^
                       v              |
              [Admin Dashboard]       |
                                      |
[Excel Files] ---(import script)------+
```
