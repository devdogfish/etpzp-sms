# ETPZP SMS - Flash SMS Management System

A production-grade SMS management system built as a final high school project, now serving ETPZP, a Portuguese technical school where it replaced costly third-party services. Constructed with Next.js 15, TypeScript, and PostgreSQL, the application handles scheduled messaging, bulk SMS sending, contact and message history management, multi-language support, and administrative analytics. Authentication flows through Active Directory, while SMS delivery operates via GatewayAPI. Additional information lives on my [website](https://www.luigigirke.com/project/etpzp-sms), with comprehensive documentation available in [English](https://www.luigigirke.com/etpzp_sms/report.pdf) and [Portuguese](https://www.luigigirke.com/etpzp_sms/relat%C3%B3rio.pdf).

**Public Demo:** https://etpzp-sms-three.vercel.app/en (API functionality disabled for demo)

## 🏗️ Technical Architecture

### Infrastructure & Deployment
- **Containerization:** Docker multi-container setup (`Dockerfile`, `docker-compose.yaml`) with Alpine Linux base images achieving 80%+ size reduction through multi-stage builds
- **Database:** PostgreSQL with connection pooling, automated seeding via `/lib/db/seed.sql`, health checks and volume persistence
- **Web Server:** Nginx reverse proxy (`nginx.conf`) with SSL/TLS termination using self-signed certificates (Let's Encrypt in production)
- **DNS:** No-IP dynamic DNS for consistent external access despite dynamic IP addressing
- **Environment Management:** Separate configs for dev/prod (`.env`, `.env.docker`)

### Authentication & Authorization
- **Active Directory Integration:** LDAP queries via `activedirectory2` package (`/lib/auth/activedirectory/`)
- **Session Management:** iron-session with encrypted cookies (`/lib/auth/sessions.ts`, `/lib/auth/config.ts`)
- **Role-Based Access:** User/Admin roles enforced through middleware (`/middleware.ts`)
- **Security:** Server-side validation on all routes, session verification for API endpoints

### Application Architecture
- **Framework:** Next.js 15 App Router with React Server Components
- **Server Actions:** Type-safe mutations in `/lib/actions/` (message creation, contact management, user settings)
- **Database Layer:** Centralized connection pooling in `/lib/db/index.ts`, organized queries by domain
- **State Management:** React Context API for client state (`/contexts/`), custom hooks in `/hooks/`
- **Internationalization:** i18next with server/client rendering support, managed via i18nexus platform (`/app/i18n.js`, `/locales/`)

### Key File Structure
```
/app/[locale]/                    # Dynamic locale routing
  ├── (root)/                     # Main app layout group
  │   ├── (message-layout)/       # Message-related pages (sent, scheduled, drafts)
  │   └── (other)/                # Settings, new message, contacts
  ├── dashboard/                  # Admin analytics (charts, user stats)
  └── login/                      # Authentication page

/lib/
  ├── actions/                    # Server actions for mutations
  ├── auth/                       # Authentication logic and AD integration
  ├── db/                         # Database queries and schema
  ├── form.schemas.ts             # Zod validation schemas
  └── utils.ts                    # Shared utility functions

/components/
  ├── ui/                         # ShadCN component library
  ├── modals/                     # Dialogs for contacts, scheduling
  ├── admin-dashboard/            # Analytics charts and tables
  └── shared/                     # Reusable components (search, inputs, etc.)

/contexts/                        # React Context providers
/hooks/                           # Custom React hooks
```

### Data Flow
1. **Authentication:** AD server → `authenticate()` → iron-session cookie → middleware validation
2. **Message Sending:** Form submission → Zod validation → server action → GatewayAPI → PostgreSQL → revalidation
3. **Real-time Updates:** Server actions → database mutations → `revalidatePath()` → UI refresh

### External Integrations
- **GatewayAPI REST API:** SMS delivery, scheduling, cancellation, and statistics retrieval
- **Active Directory:** User authentication and group membership validation
- **i18nexus:** Translation management with automated pull on build

## 🔧 Core Features

### Message Management
- **Compose & Send:** Multi-recipient support with phone validation (libphonenumber-js), scheduling up to years in advance
- **Draft System:** Auto-save with debouncing (2s delay), URL-based draft persistence, session recovery
- **Contact Integration:** Inline contact suggestions, recipient autocomplete, create contacts from recipients
- **Message Types:** Instant send, scheduled delivery, drafts, failed messages with error details

### Contact Management
- **CRUD Operations:** Create/edit/delete contacts with phone validation and duplicate detection
- **Search & Filter:** Real-time client-side search, contact info modals
- **Message Integration:** Click-to-message contacts, recipient-to-contact conversion

### Admin Dashboard (`/app/[locale]/dashboard/`)
- **Analytics Charts:** ReCharts area chart (messages/cost over time), pie chart (recipients by country)
- **User Rankings:** Top senders table with message counts
- **Date Filtering:** Dynamic date range selection with query params
- **Access Control:** Admin-only route with programmatic redirects

### User Settings (`/app/[locale]/(root)/(other)/settings/`)
- **Profile:** Display name, profile color picker
- **Appearance:** Theme (light/dark), primary color, layout mode (Modern/Simple)
- **Language:** English, Portuguese, German with instant switching
- **Persistence:** LocalStorage for client preferences, synced to database for logout persistance

## 📊 Database Schema

Four main tables with relational integrity:
- **user:** Authentication, settings, timestamps
- **message:** Content, status, API errors, costs
- **recipient:** Phone numbers with ordering index
- **contact:** User-specific contact book

Key design decisions:
- Single `message` table with `status` field instead of separate tables per type
- Many-to-many relationship handled through `recipient` junction table
- Soft deletes via `in_trash` bool for message recovery

## 🚀 Development Workflow

### Local Development
```bash
bun install                   # Install dependencies
bun dev                       # Start dev server with i18n pull
psql                          # Access PostgreSQL shell
\i /path/to/lib/db/seed.sql   # Seed database in the `psql` shell
```

### Production Deployment
```bash
docker-compose up --build    # Build and start containers
nginx                        # Start Nginx (if not running)
nginx -s reload              # Reload Nginx config
```

### Key Commands
- `tsc --noEmit` - TypeScript type checking
- `i18nexus pull` - Sync translations
- `docker exec -it <container> /bin/sh` - Container debugging
- `docker exec -it <postgres_container> psql -U <user> -d <db>` - Database access
