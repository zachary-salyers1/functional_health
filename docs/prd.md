# Product Requirements Document (PRD)
# Functional Health Lab Analysis App

**Document Version:** 1.0  
**Last Updated:** November 10, 2025  
**Product Owner:** Zach Salyers  
**Target Launch:** Q1 2026 (8-week MVP)

---

## Executive Summary

### Product Vision
Transform raw lab data into actionable, research-backed health optimization protocols. Bridge the gap between expensive lab testing (Function Health, Quest, LabCorp) and meaningful behavior change.

### The Problem
- 75% of Americans get annual bloodwork (~250M people)
- Function Health has 100K+ users paying $499/year for comprehensive testing
- Current solutions provide lab results but minimal actionable guidance
- Traditional doctors only flag clinical abnormalities, missing functional optimization opportunities
- Users sit on $500+ worth of lab data with no clear 30-90 day action plan

### The Solution
A web-based SaaS platform that:
1. Accepts lab uploads (PDF, manual entry, or API integration)
2. Analyzes biomarkers against functional optimal ranges (not just clinical)
3. Generates personalized 30-90 day protocols with specific interventions
4. Backs every recommendation with peer-reviewed research (PubMed citations)
5. Tracks progress over multiple lab uploads
6. Provides implementation details (dosages, timing, brands, meal plans)

### Success Metrics (12 months post-launch)
- **Primary:** 500 paying customers ($200K+ ARR)
- **Revenue:** $29/month subscription or $47/upload
- **Retention:** 60%+ monthly retention for subscribers
- **NPS:** 50+ (product-market fit indicator)
- **Time to Value:** <10 minutes from upload to protocol delivery

---

## Market Analysis

### Target Market
**Primary (MVP):**
- Function Health users (100K+, proven $499/year payment willingness)
- Health-conscious individuals with recent lab work (25-55 years old)
- Biohackers and health optimizers (quantified self movement)
- FitCoach AI customers (existing audience for quick validation)

**Secondary (Post-MVP):**
- Fitness coaches and personal trainers (white-label opportunity)
- Functional medicine practitioners (practice management tool)
- Corporate wellness programs (B2B offering)

### Market Size
- Total Addressable Market (TAM): 250M Americans with annual labs
- Serviceable Addressable Market (SAM): 50M health-conscious individuals
- Serviceable Obtainable Market (SOM): 100K users in first 3 years
- Market Growth: mHealth apps growing 15% annually ($40B+ market)

### Competitive Landscape

| Competitor | Strengths | Weaknesses | Our Advantage |
|------------|-----------|------------|---------------|
| Function Health | Comprehensive testing, 100K users | Generic insights, no protocols, $499/year | We provide protocols, work with ANY labs, lower cost |
| InsideTracker | Good insights, athlete focus | Expensive ($149-599), limited biomarkers | More comprehensive, better pricing, research citations |
| WellnessVerge | Lab interpretation | Surface-level recommendations | Deep protocols with research backing |
| ChatGPT/Claude | Free, accessible | Generic advice, no personalization, no research citations | Structured protocols, personalized, research-backed |
| Traditional Doctors | Medical authority | Only flag clinical issues, no optimization focus | Functional ranges, optimization protocols |

### Competitive Moat
1. **Research Database:** Curated PubMed studies linking biomarkers → interventions → outcomes
2. **Functional Ranges:** Optimization targets beyond clinical "normal"
3. **Protocol Depth:** Specific implementation details (dosages, timing, brands)
4. **Platform Agnostic:** Works with any lab source (Quest, LabCorp, Function, doctor)
5. **Founder Expertise:** Applied physiology degree + fitness coaching background

---

## User Personas

### Persona 1: "Optimizer Emily"
**Demographics:**
- Age: 32, Female
- Income: $85K
- Occupation: Tech professional
- Location: Urban (SF, NYC, Austin)

**Behavior:**
- Already uses Function Health ($499/year)
- Tracks sleep with Oura Ring, workouts with Apple Watch
- Takes 5-10 supplements daily
- Reads health blogs and listens to podcasts (Huberman Lab, Peter Attia)

**Goals:**
- Optimize biomarkers for longevity and performance
- Understand what her $500 lab investment means
- Get specific action items, not generic advice
- See measurable improvements over time

**Pain Points:**
- Function Health tells her vitamin D is "low" but not what to do
- Doctor says labs are "fine" but doesn't optimize
- Too much conflicting information online
- Wants research-backed recommendations

**Jobs to be Done:**
- "Help me turn my lab results into a clear 90-day plan"
- "Show me the research behind recommendations so I can trust them"
- "Track my progress over multiple lab tests"

---

### Persona 2: "Concerned Carlos"
**Demographics:**
- Age: 45, Male
- Income: $120K
- Occupation: Business owner
- Location: Suburban

**Behavior:**
- Gets annual physical with standard lab panel
- Prediabetic (fasting glucose 105 mg/dL)
- Overweight (BMI 29), sedentary job
- Doctor said "watch your diet" but no specifics
- Motivated to avoid diabetes like his father

**Goals:**
- Reverse prediabetes without medication
- Lose 20-30 lbs
- Get specific dietary and lifestyle changes
- Understand what supplements actually work

**Pain Points:**
- Doctor's advice too generic ("eat less, move more")
- Doesn't know where to start
- Tried low-carb but not sure if it's working
- Confused by supplement marketing

**Jobs to be Done:**
- "Help me understand what my elevated glucose really means"
- "Give me a specific plan I can follow"
- "Show me evidence these interventions work"

---

### Persona 3: "Coach Sarah"
**Demographics:**
- Age: 38, Female
- Income: $60K
- Occupation: Fitness coach/nutritionist
- Location: Suburban

**Behavior:**
- Works with 15-25 clients
- Many clients ask about supplements and lab work
- Wants to add value beyond training and meal plans
- Not licensed to interpret labs but wants to help
- Already uses FitCoach AI

**Goals:**
- Differentiate from other coaches
- Provide more comprehensive service
- Increase client retention and satisfaction
- Generate additional revenue stream

**Pain Points:**
- Clients bring lab results but Sarah can't officially interpret
- Refers to functional medicine docs (clients often don't go)
- Leaves money on the table by not addressing labs
- Wants professional tool to recommend protocols

**Jobs to be Done:**
- "Help my clients make sense of their lab work"
- "Give me a tool I can white-label for my coaching business"
- "Provide protocols I can confidently recommend"

---

## Product Requirements

### MVP Scope (8-Week Build)

**Must Have (P0):**
1. User authentication and account management
2. Lab upload via PDF (with OCR) or manual entry
3. Support for 20 core biomarkers (metabolic, thyroid, vitamins)
4. Functional optimal range comparison (color-coded results)
5. Personalized protocol generation (3-5 interventions per issue)
6. Research citations (PubMed links) for all recommendations
7. PDF protocol export
8. Payment processing (Stripe: $47/upload or $29/month)
9. Email delivery of protocols

**Should Have (P1 - Post-MVP):**
1. Progress tracking across multiple uploads
2. Biomarker trends and visualizations
3. Supplement interaction checker
4. Mobile-responsive design optimization
5. In-app protocol status tracking (started/completed)

**Could Have (P2 - Future):**
1. Direct lab ordering integration (Quest, LabCorp)
2. Automated lab data import (API integrations)
3. Mobile apps (iOS/Android)
4. White-label version for coaches
5. Community features (forums, success stories)
6. AI chat for protocol questions

**Won't Have (Out of Scope):**
1. Medical diagnosis or treatment
2. HIPAA compliance (not covered entity initially)
3. Prescription recommendations
4. Telemedicine consultations
5. Lab sample collection

---

## Functional Requirements

### 1. User Authentication & Onboarding

**FR-1.1: User Registration**
- Email + password authentication
- Google OAuth integration
- Email verification required
- Terms of Service and Privacy Policy acceptance
- Clear medical disclaimers during signup

**FR-1.2: Onboarding Flow**
- Welcome screen explaining how it works
- Quick tour of features (skip option)
- Prompt to upload first lab or start manual entry
- Optional: demographic info (age, sex, activity level) for context

**FR-1.3: Account Management**
- Profile editing (name, email, password)
- Subscription management (upgrade, downgrade, cancel)
- Payment method management
- Data export (download all protocols and lab data)
- Account deletion

---

### 2. Lab Data Capture

**FR-2.1: PDF Upload**
- Drag-and-drop or file picker
- Support PDF files up to 10MB
- OCR processing using Tesseract or AWS Textract
- Extract: biomarker name, value, unit, reference range
- Show confidence score for OCR results
- Allow manual correction of extracted data

**FR-2.2: Manual Entry**
- Form with 20 core biomarkers (expandable to 50+)
- Auto-complete biomarker names
- Unit conversion (mg/dL ↔ mmol/L, etc.)
- Optional fields: lab date, lab source (Quest, LabCorp, Function Health)
- Save partial entries as drafts
- Duplicate previous entry for easier re-entry

**FR-2.3: Data Validation**
- Flag values outside biologically plausible ranges (potential entry error)
- Warn if units don't match expected units for biomarker
- Require value and unit for each biomarker
- Optional: reference range from user's lab (for context)

**FR-2.4: Lab History**
- List all previous lab uploads
- Filter by date, lab source
- View raw lab data
- Re-generate protocol from historical data
- Delete old lab uploads

---

### 3. Biomarker Analysis

**FR-3.1: Optimal Range Comparison**
- Display each biomarker with value
- Color-coded status:
  - Green: Optimal
  - Yellow: Suboptimal
  - Orange: Concerning
  - Red: Clinical abnormality
- Show both clinical reference range and functional optimal range
- Explain difference between clinical and functional ranges

**FR-3.2: Condition Assignment**
- Automatically assign condition based on value
- Conditions: Optimal, Suboptimal, Concerning, Clinical
- Display condition name and description
- Show priority score (1-10, urgency of addressing)

**FR-3.3: Results Dashboard**
- Visual summary of all biomarkers
- Percentage breakdown (X% optimal, Y% suboptimal, Z% concerning)
- Highlight top 3-5 priority issues
- Overall health score (calculated metric)
- Comparison to previous uploads (if available)

---

### 4. Protocol Generation

**FR-4.1: Protocol Logic**
- Identify all suboptimal/concerning markers
- Prioritize by severity and impact
- Select 2-3 primary interventions per marker
- Select 1-2 secondary interventions per marker
- Deduplicate (if same intervention applies to multiple markers)
- Generate focused protocol (max 8-10 total interventions)

**FR-4.2: Intervention Details**
- Intervention name and type (dietary, supplement, lifestyle, exercise)
- "What to do" - specific implementation steps
- Dosage/frequency/timing (for supplements)
- Brand recommendations (for supplements)
- Expected outcome and timeline
- Difficulty level (easy, moderate, advanced)
- Estimated cost (free, low, medium, high)
- Contraindications and warnings

**FR-4.3: Research Citations**
- 2-5 PubMed studies per intervention
- Study title, authors, journal, year
- Study type (RCT, meta-analysis, etc.)
- Key findings (1-2 sentence summary)
- Direct link to PubMed
- Quality score (1-10) displayed

**FR-4.4: Protocol Organization**
- Group interventions by type:
  1. Dietary Changes (highest impact, free)
  2. Lifestyle Modifications (free, sustainable)
  3. Exercise Interventions (free, broad benefits)
  4. Supplement Recommendations (targeted, research-backed)
  5. Optional Testing (for validation)
- Prioritize within each group (most important first)
- Estimated timeline for full protocol (typically 90 days)

**FR-4.5: Protocol Customization**
- Allow user to mark interventions as "started" or "skipped"
- Add personal notes to interventions
- Generate custom shopping list from selected supplements
- Adjust protocol based on dietary restrictions (vegan, gluten-free, etc.)

---

### 5. Protocol Delivery

**FR-5.1: In-App Protocol View**
- Clean, readable format
- Collapsible sections (expand/collapse interventions)
- Print-friendly view
- Share via link (with privacy controls)
- Mobile-responsive design

**FR-5.2: PDF Export**
- Professional, branded PDF report
- Sections:
  - Executive Summary (key findings, top priorities)
  - Biomarker Overview (visual dashboard)
  - Detailed Protocol (interventions with research)
  - Resources (shopping list, apps, retesting guidance)
  - Disclaimers and legal
- Download or email PDF
- Watermarked with user name and date

**FR-5.3: Email Delivery**
- Automated email upon protocol generation
- Subject: "Your Personalized Health Protocol is Ready"
- Body: Summary + link to view full protocol
- PDF attached (optional)
- Follow-up emails (optional):
  - Day 7: "How's your protocol going?"
  - Day 30: "Time for a progress check"
  - Day 90: "Ready to retest?"

---

### 6. Progress Tracking

**FR-6.1: Multi-Upload Comparison**
- Upload multiple labs over time
- Chart biomarker trends (line graphs)
- Highlight improvements and regressions
- Show protocol adherence impact
- Celebrate wins (biomarkers moving to optimal)

**FR-6.2: Protocol Tracking**
- Mark interventions as started/completed/skipped
- Add notes on each intervention ("took berberine for 60 days, felt great")
- Track supplement purchases (optional integration with Amazon)
- Reminder system for retesting

**FR-6.3: Insights**
- "Your glucose improved by 15 mg/dL in 8 weeks"
- "4 of 5 biomarkers moved to optimal range"
- "Interventions you completed: low-carb diet, berberine, resistance training"
- Suggest protocol adjustments based on progress

---

### 7. Payment & Subscription

**FR-7.1: Pricing Tiers**

**Option 1: Per-Upload Pricing**
- $47 per lab analysis + protocol
- One-time payment via Stripe
- No ongoing commitment
- Additional uploads: $47 each

**Option 2: Monthly Subscription**
- $29/month or $297/year (2 months free)
- Unlimited lab uploads
- Progress tracking and trend analysis
- Priority email support
- Cancel anytime

**Option 3: Hybrid (Recommended)**
- $47 for first analysis (no subscription required)
- Upsell to $19/month for:
  - Unlimited additional uploads
  - Progress tracking
  - Protocol updates as new research emerges
  - Early access to new features

**FR-7.2: Payment Processing**
- Stripe integration
- Support credit/debit cards
- Save payment method for subscriptions
- Automated billing for subscriptions
- Grace period for failed payments (7 days)
- Clear cancellation process

**FR-7.3: Billing Management**
- View billing history
- Download invoices
- Update payment method
- Change subscription tier
- Cancellation (immediate or end of period)

---

### 8. Admin & Content Management

**FR-8.1: Admin Dashboard**
- User management (view, suspend, delete)
- Lab upload monitoring (success rate, OCR accuracy)
- Protocol generation analytics (most common conditions)
- Revenue metrics (MRR, churn, ARPU)
- Support ticket management

**FR-8.2: Biomarker Management**
- Add new biomarkers
- Edit optimal ranges
- Update descriptions and "why it matters"
- Deactivate outdated biomarkers

**FR-8.3: Research Database Management**
- Add new studies (title, authors, PubMed ID, findings)
- Update intervention protocols
- Edit protocol rules (condition → intervention mapping)
- Version control for protocol changes

**FR-8.4: Content Updates**
- Edit FAQ and help articles
- Update legal disclaimers
- Modify email templates
- Manage blog content (if applicable)

---

## Non-Functional Requirements

### Performance
- **Page Load:** <2 seconds for all pages
- **Protocol Generation:** <30 seconds from upload to protocol
- **OCR Processing:** <60 seconds for typical lab PDF (2-3 pages)
- **API Response Time:** <500ms for 95th percentile
- **Database Queries:** <100ms for complex queries

### Scalability
- **Users:** Support 10K concurrent users (MVP), scale to 100K+
- **Lab Uploads:** Handle 1,000 uploads per day
- **Storage:** Support 100GB+ of lab PDFs and data
- **Database:** PostgreSQL optimized for read-heavy workload

### Security
- **Authentication:** Secure password hashing (bcrypt)
- **Data Encryption:** TLS 1.3 for all traffic, AES-256 for data at rest
- **PII Protection:** Lab data encrypted, minimal PII collection
- **Payment Security:** PCI compliance via Stripe (no card storage)
- **Access Control:** Role-based permissions (user, admin)

### Reliability
- **Uptime:** 99.5% uptime SLA
- **Data Backup:** Daily automated backups, 30-day retention
- **Error Handling:** Graceful degradation, user-friendly error messages
- **Monitoring:** Real-time alerts for downtime, errors, performance issues

### Usability
- **Accessibility:** WCAG 2.1 AA compliance
- **Mobile:** Responsive design, usable on phones and tablets
- **Browser Support:** Chrome, Firefox, Safari, Edge (latest 2 versions)
- **Learning Curve:** New users can upload labs and view protocol in <10 minutes
- **Help:** In-app tooltips, FAQ, email support

### Legal & Compliance
- **Medical Disclaimer:** Prominent on every page: "Not medical advice, consult physician"
- **Terms of Service:** Clear liability limitations, user responsibilities
- **Privacy Policy:** GDPR-compliant (if serving EU users), transparent data usage
- **Attorney Review:** Legal review of disclaimers, ToS, protocol language ($1-2K)
- **No HIPAA:** Not a covered entity initially (not handling PHI for treatment/payment)

---

## User Flows

### Flow 1: First-Time User - Upload Lab and Get Protocol

1. **Landing Page**
   - User clicks "Get Started" CTA
   - Sees value proposition: "Turn your lab results into actionable protocols in 10 minutes"

2. **Sign Up**
   - Email + password or Google OAuth
   - Accept terms and medical disclaimers
   - Email verification sent

3. **Onboarding**
   - Welcome screen: "Let's analyze your labs"
   - Choice: Upload PDF or Enter Manually

4. **Upload Lab (PDF Path)**
   - Drag-and-drop PDF
   - Processing spinner (OCR running)
   - Review extracted data (20 biomarkers)
   - Correct any OCR errors
   - Add lab date and source

5. **Payment**
   - "Your protocol is ready! $47 one-time or $29/month subscription"
   - Enter payment info (Stripe)
   - Process payment

6. **Protocol Generated**
   - Success message: "Your protocol is ready!"
   - View protocol in-app
   - Download PDF option
   - Email sent with link and PDF

7. **Next Steps**
   - Prompt to start interventions
   - Suggest setting retest reminder (90 days)
   - Offer subscription upsell ($19/month for tracking)

**Time:** 8-12 minutes from landing to protocol

---

### Flow 2: Returning User - Upload Second Lab and Compare

1. **Login**
   - Email + password or Google OAuth

2. **Dashboard**
   - View previous lab from 90 days ago
   - See active protocol and progress
   - Click "Upload New Lab"

3. **Upload Second Lab**
   - Same upload process (PDF or manual)
   - OCR and data extraction

4. **Comparison View**
   - Side-by-side: Old vs New values
   - Visual: Green arrows (improved), red arrows (worsened)
   - Insights: "Your glucose improved by 18 mg/dL!"

5. **Updated Protocol**
   - Adjusted based on new results
   - Removed interventions for resolved issues
   - Added new recommendations for any new issues
   - Maintained interventions for ongoing concerns

6. **Celebrate Wins**
   - Congratulations modal for biomarkers that moved to optimal
   - Share success option (social media, optional)

**Time:** 5-8 minutes (faster, user familiar with system)

---

### Flow 3: Coach - White Label Setup (Post-MVP)

1. **Coach Sign Up**
   - Special signup link for coaches
   - Fill out business info
   - Select white-label plan ($97/month)

2. **Branding Setup**
   - Upload logo
   - Choose brand colors
   - Customize email templates
   - Set custom domain (labs.sarahsfitness.com)

3. **Client Onboarding**
   - Generate unique invite links for clients
   - Clients sign up under coach's branded platform
   - Coach dashboard shows all client protocols

4. **Client Lab Upload**
   - Client uploads lab (same flow as individual users)
   - Protocol auto-generated with coach's branding
   - Coach receives notification

5. **Coach Review**
   - Coach reviews protocol
   - Can add personalized notes
   - Approve and send to client

6. **Client Receives Protocol**
   - Branded email from coach
   - PDF with coach's branding
   - In-app messaging with coach (optional)

---

## Information Architecture

### Site Map

```
Public Pages:
├── Home (Landing Page)
├── How It Works
├── Pricing
├── About
├── Blog (optional, for SEO)
├── FAQ
├── Login
└── Sign Up

Authenticated (User) Pages:
├── Dashboard (overview of all labs)
├── Upload Lab
│   ├── PDF Upload
│   └── Manual Entry
├── Lab History
│   └── Individual Lab View
│       ├── Biomarker Results
│       ├── Protocol View
│       └── Edit Lab Data
├── Progress Tracking (post-MVP)
│   ├── Trends
│   └── Comparisons
├── Account Settings
│   ├── Profile
│   ├── Subscription
│   ├── Billing
│   └── Privacy
└── Help & Support

Admin Pages:
├── Admin Dashboard
├── User Management
├── Biomarker Database
├── Research Database
├── Protocol Rules
├── Analytics
└── Support Tickets
```

---

## UI/UX Requirements

### Design Principles
1. **Trust & Credibility:** Clean, professional design. Medical-grade feel.
2. **Simplicity:** Minimal clicks to value. No overwhelming users with data.
3. **Transparency:** Always show research backing. No black box.
4. **Actionability:** Every insight must have clear next steps.
5. **Progressive Disclosure:** Show summary first, details on demand.

### Visual Design
- **Color Palette:**
  - Primary: Deep blue (trust, medical)
  - Secondary: Green (health, optimization)
  - Accents: Yellow/Orange (caution), Red (concerning)
  - Neutral: Grays for text and backgrounds
  
- **Typography:**
  - Headers: Modern sans-serif (Inter, Poppins)
  - Body: Readable sans-serif (Inter, system fonts)
  - Monospace: For biomarker values and data

- **Iconography:**
  - Line icons (Heroicons, Feather Icons)
  - Consistent style throughout
  - Medical/health theme where appropriate

### Key Screens (Wireframe Descriptions)

**1. Dashboard (Post-Login)**
- Top: Welcome message, overall health score
- Main: Grid of biomarker categories with status indicators
  - Metabolic: 2 of 4 optimal (yellow)
  - Thyroid: 3 of 3 optimal (green)
  - Vitamins: 1 of 3 concerning (orange)
- CTA: "Upload New Lab" button (prominent)
- Secondary: View previous labs, track progress

**2. Lab Upload (PDF)**
- Large drop zone: "Drag PDF here or click to browse"
- Processing state: Animated spinner, "Analyzing your lab..."
- Review state: Table of extracted biomarkers
  - Columns: Biomarker, Value, Unit, Status
  - Editable fields (in case OCR error)
  - Add more biomarkers button
- Bottom: "Generate Protocol" button

**3. Protocol View**
- Top: Executive summary card
  - Your health score: 7/10
  - Top 3 priorities: Glucose, Vitamin D, Thyroid
  - Quick start: 3 most important interventions
- Main: Expandable sections by category
  - Dietary Interventions (2)
  - Supplement Recommendations (3)
  - Lifestyle Changes (2)
- Each intervention card:
  - Title and type badge
  - "What to do" (collapsed by default)
  - Expected outcome
  - Research studies (expandable)
- Bottom: Download PDF, Email to me, Share link

**4. Intervention Detail (Expanded)**
- Full implementation details
- Dosage, timing, brand recommendations
- Expected timeline and outcomes
- Research studies (3-5):
  - Study title and authors
  - Key findings (2-3 sentences)
  - PubMed link
- Related biomarkers (this helps 3 of your markers)
- Mark as Started/Completed/Skipped

**5. Progress Tracking (Post-MVP)**
- Timeline view of all lab uploads
- Select two dates to compare
- Chart for each biomarker (line graph over time)
- Annotations: "Started low-carb diet" (user can add)
- Insights: "Your glucose improved 20% in 90 days"

---

## Technical Architecture

### Technology Stack

**Frontend:**
- Framework: Next.js 14+ (React 18+)
- Language: TypeScript
- Styling: Tailwind CSS
- State Management: React Context + Zustand
- Forms: React Hook Form + Zod validation
- Charts: Recharts or Chart.js
- PDF Generation: jsPDF or react-pdf

**Backend:**
- Runtime: Node.js 20+
- API: Next.js API routes or Express.js
- Language: TypeScript
- Authentication: NextAuth.js or Auth0
- Payment: Stripe SDK

**Database:**
- Primary: PostgreSQL 15+
- ORM: Prisma or Drizzle
- Caching: Redis (for session management, protocol caching)
- Search: PostgreSQL full-text search (initially)

**File Processing:**
- OCR: Tesseract.js (client-side) or AWS Textract (server-side)
- PDF Storage: AWS S3 or Cloudflare R2
- Image Optimization: Next.js Image Optimization

**AI/ML (Optional):**
- LLM: Claude API or OpenAI API (for enhanced protocol generation)
- Vector DB: Pinecone or Supabase Vector (for research similarity search)

**Infrastructure:**
- Hosting: Vercel (frontend + API routes)
- Database: Supabase or Railway (PostgreSQL)
- Storage: AWS S3 or Cloudflare R2
- CDN: Vercel Edge Network or Cloudflare
- Monitoring: Sentry (errors), Vercel Analytics (performance)
- Email: SendGrid or Resend

**DevOps:**
- Version Control: Git + GitHub
- CI/CD: GitHub Actions or Vercel
- Testing: Jest (unit), Playwright (e2e)
- Linting: ESLint + Prettier

---

### System Architecture Diagram

```
┌─────────────────────────────────────────────────────────┐
│                     USER BROWSER                        │
│  (Next.js Frontend - Vercel Edge)                       │
└────────────┬────────────────────────────────────────────┘
             │
             │ HTTPS
             │
┌────────────▼────────────────────────────────────────────┐
│              NEXT.JS API ROUTES (Vercel)                │
│  - Auth endpoints                                       │
│  - Lab upload & OCR                                     │
│  - Protocol generation                                  │
│  - Payment processing                                   │
└─────────┬──────────┬──────────┬────────────┬───────────┘
          │          │          │            │
          │          │          │            │
┌─────────▼──┐  ┌───▼─────┐  ┌─▼──────┐  ┌─▼─────────┐
│ PostgreSQL │  │  Redis  │  │   S3   │  │  Stripe   │
│  (Supabase)│  │ (Cache) │  │ (PDFs) │  │ (Payment) │
│            │  │         │  │        │  │           │
│ - Users    │  │ Session │  │ Lab    │  │ Checkout  │
│ - Labs     │  │ Proto   │  │ PDFs   │  │ Webhooks  │
│ - Biomark  │  │ Cache   │  │ User   │  │ Invoices  │
│ - Research │  │         │  │ Proto  │  │           │
│ - Protocol │  │         │  │ PDFs   │  │           │
└────────────┘  └─────────┘  └────────┘  └───────────┘
      │
      │
┌─────▼──────────────────────────────────────────────┐
│         EXTERNAL SERVICES                          │
│  - AWS Textract (OCR)                             │
│  - SendGrid (Email)                               │
│  - Sentry (Error Monitoring)                      │
│  - Vercel Analytics                               │
└────────────────────────────────────────────────────┘
```

---

### API Endpoints

**Authentication:**
- POST `/api/auth/signup` - Create new user account
- POST `/api/auth/login` - User login
- POST `/api/auth/logout` - User logout
- GET `/api/auth/session` - Get current session
- POST `/api/auth/forgot-password` - Password reset request
- POST `/api/auth/reset-password` - Complete password reset

**Lab Management:**
- POST `/api/labs/upload` - Upload lab PDF
- POST `/api/labs/manual` - Manual lab entry
- GET `/api/labs` - List user's labs
- GET `/api/labs/:id` - Get specific lab
- PUT `/api/labs/:id` - Update lab data
- DELETE `/api/labs/:id` - Delete lab

**OCR Processing:**
- POST `/api/ocr/process` - Process PDF with OCR
- GET `/api/ocr/status/:jobId` - Check OCR job status

**Biomarkers:**
- GET `/api/biomarkers` - List all supported biomarkers
- GET `/api/biomarkers/:id` - Get biomarker details

**Protocol Generation:**
- POST `/api/protocols/generate` - Generate protocol from lab
- GET `/api/protocols/:id` - Get protocol details
- PUT `/api/protocols/:id/interventions/:interventionId` - Update intervention status
- GET `/api/protocols/:id/pdf` - Download protocol PDF

**Progress Tracking:**
- GET `/api/progress/:userId` - Get user progress data
- GET `/api/progress/compare?lab1=:id1&lab2=:id2` - Compare two labs

**Payment:**
- POST `/api/payments/create-checkout` - Create Stripe checkout
- POST `/api/payments/webhook` - Stripe webhook handler
- GET `/api/subscriptions` - Get user subscription
- POST `/api/subscriptions/cancel` - Cancel subscription

**Admin:**
- GET `/api/admin/users` - List all users
- GET `/api/admin/analytics` - Dashboard analytics
- POST `/api/admin/biomarkers` - Add new biomarker
- PUT `/api/admin/biomarkers/:id` - Update biomarker
- POST `/api/admin/research` - Add research study
- PUT `/api/admin/research/:id` - Update research study

---

### Data Models (Summary - see database schema for full details)

**Core Entities:**
- Users
- Lab Uploads
- Biomarker Results
- Biomarkers (reference data)
- Biomarker Conditions (reference data)
- Interventions (reference data)
- Research Studies (reference data)
- Protocol Rules (reference data)
- Generated Protocols
- Protocol Recommendations

**Relationships:**
- User HAS MANY Lab Uploads
- Lab Upload HAS MANY Biomarker Results
- Biomarker Result BELONGS TO Biomarker
- Biomarker Result HAS ONE Biomarker Condition (assigned based on value)
- Biomarker Condition HAS MANY Protocol Rules
- Protocol Rule REFERENCES Intervention
- Protocol Rule REFERENCES Research Studies (many-to-many)
- Generated Protocol BELONGS TO User and Lab Upload
- Generated Protocol HAS MANY Protocol Recommendations

---

## Implementation Plan

### Phase 1: Foundation (Weeks 1-2)

**Week 1: Setup & Auth**
- Set up Next.js project with TypeScript
- Configure Tailwind CSS
- Set up PostgreSQL database (Supabase)
- Implement authentication (NextAuth.js)
- Create landing page and marketing site
- Set up Stripe account and test mode

**Week 2: Database & Data Entry**
- Create full database schema (see separate file)
- Seed database with 20 core biomarkers
- Build manual lab entry form
- Implement PDF upload (no OCR yet, manual review)
- Create lab history view

**Deliverable:** Users can sign up and manually enter lab data

---

### Phase 2: Core Logic (Weeks 3-4)

**Week 3: Research Database**
- Curate 25-30 research studies (focus: glucose, vitamin D, thyroid)
- Create intervention library (30-40 interventions)
- Define protocol rules (condition → intervention mapping)
- Build protocol generation algorithm
- Test with sample lab data

**Week 4: Protocol Generation**
- Implement protocol generation API
- Create protocol view UI
- Build intervention detail cards
- Add research study display with PubMed links
- Protocol PDF generation

**Deliverable:** Complete end-to-end: lab entry → protocol generation → protocol view

---

### Phase 3: Polish & Payment (Weeks 5-6)

**Week 5: UI/UX Polish**
- Design and implement dashboard
- Biomarker results visualization (color-coded)
- Protocol download and email delivery
- Mobile responsive design
- Error handling and loading states

**Week 6: Payment Integration**
- Stripe checkout integration
- Subscription management
- Payment webhook handling
- Email sequences (welcome, protocol ready)
- Terms, privacy policy, disclaimers

**Deliverable:** Full user flow from signup → upload → payment → protocol

---

### Phase 4: Testing & Launch (Weeks 7-8)

**Week 7: OCR & Testing**
- Implement OCR (Tesseract.js or AWS Textract)
- Manual OCR accuracy testing with real lab PDFs
- End-to-end testing (happy path + edge cases)
- Performance optimization
- Security audit

**Week 8: Beta Launch**
- Soft launch to FitCoach AI users (50-100 users)
- Collect feedback
- Fix critical bugs
- Set up monitoring and analytics
- Prepare marketing materials
- Public launch announcement

**Deliverable:** MVP live and accepting paying customers

---

### Post-MVP Roadmap (Months 2-6)

**Month 2: Progress Tracking**
- Multi-upload comparison
- Biomarker trend charts
- Protocol status tracking
- Retest reminders

**Month 3: Enhanced Features**
- More biomarkers (expand to 50+)
- Supplement interaction checker
- Enhanced PDF reports
- Customer success emails

**Month 4: Marketing & Growth**
- Content marketing (blog posts on biomarker optimization)
- YouTube content (analyzing lab results)
- Partnership with Function Health community
- Affiliate program for coaches

**Month 5: White Label (Coach Version)**
- Multi-tenant architecture
- Custom branding
- Coach dashboard
- Client management
- Pricing: $97/month for coaches

**Month 6: Advanced Features**
- Direct lab ordering (Quest/LabCorp integration)
- Mobile app development
- AI chat for protocol questions
- Community features

---

## Success Metrics & KPIs

### Product Metrics

**Acquisition:**
- Website visitors per month
- Signup conversion rate (target: 3-5%)
- Time to signup (target: <2 minutes)
- Source of signups (organic, paid, referral)

**Activation:**
- % of users who upload first lab (target: 80%+)
- Time to first protocol (target: <15 minutes)
- Protocol generation success rate (target: 95%+)
- OCR accuracy (target: 90%+)

**Revenue:**
- Monthly Recurring Revenue (MRR)
- Average Revenue Per User (ARPU)
- Customer Acquisition Cost (CAC)
- Lifetime Value (LTV)
- LTV:CAC ratio (target: 3:1+)

**Retention:**
- Monthly retention rate (target: 60%+)
- Churn rate (target: <10% monthly)
- Reactivation rate (users who come back)
- Second lab upload rate (target: 40%+ within 90 days)

**Engagement:**
- Protocols generated per user
- Average interventions marked as "started"
- PDF downloads per protocol
- Time spent in app per session

**Satisfaction:**
- Net Promoter Score (NPS) - target: 50+
- Customer support tickets per user
- Average rating (if we add reviews)
- Testimonial collection rate

---

### Business Metrics

**12-Month Targets:**
- 500 paying customers
- $15K MRR ($180K ARR)
- 60% monthly retention
- 3:1 LTV:CAC ratio
- NPS >50

**24-Month Targets:**
- 2,500 paying customers
- $75K MRR ($900K ARR)
- 70% monthly retention
- 5:1 LTV:CAC ratio
- NPS >60
- 50+ white-label coach clients ($4,850/month)

---

## Risk Analysis & Mitigation

### Risk 1: OCR Accuracy
**Risk:** Low OCR accuracy leads to incorrect biomarker values and bad protocols.

**Impact:** High - could give dangerous recommendations

**Mitigation:**
- Always show confidence scores
- Require user review and confirmation before protocol generation
- Manual entry as fallback
- Test with 100+ real lab PDFs before launch
- Iterate on OCR prompts and processing

---

### Risk 2: Medical/Legal Liability
**Risk:** User follows protocol, has adverse reaction, sues.

**Impact:** Critical - could shut down business

**Mitigation:**
- Prominent disclaimers on every page: "Not medical advice"
- Terms of Service with liability limitations
- Always recommend physician consultation
- No diagnosis or treatment language (only "optimization")
- Legal review before launch ($1-2K)
- General liability insurance (optional, ~$1K/year)

---

### Risk 3: Research Quality
**Risk:** Interventions based on poor quality or outdated research.

**Impact:** High - damages credibility and trust

**Mitigation:**
- Prioritize meta-analyses and RCTs
- Quality score for each study (displayed to users)
- Regular research updates (quarterly review)
- Conservative recommendations (suggest, don't prescribe)
- Transparent about limitations and caveats

---

### Risk 4: Competition
**Risk:** Function Health or InsideTracker add protocol generation.

**Impact:** Medium - first-mover advantage lost

**Mitigation:**
- Move fast (8-week MVP, beat them to market)
- Build research database moat (hard to replicate)
- Focus on depth over breadth (better protocols, not just insights)
- Platform agnostic (works with any lab, not locked to one source)
- Build community and brand loyalty early

---

### Risk 5: Low Conversion/Retention
**Risk:** Users sign up but don't upload labs or don't return.

**Impact:** High - no revenue if users don't convert

**Mitigation:**
- Optimize onboarding flow (minimize friction)
- Offer free sample protocol (demo mode with example data)
- Email sequences to drive engagement
- Social proof (testimonials, case studies)
- Retest reminders to bring users back
- Lower price for second upload ($29 vs $47) to incentivize return

---

## Go-to-Market Strategy

### Pre-Launch (Weeks 1-6 of development)

**Build Audience:**
- Create landing page with email capture
- Post in Function Health subreddit (valuable content, not spam)
- Share "What Function Health results really mean" articles on Twitter/LinkedIn
- Build email list (target: 200-300 pre-launch emails)

**Content Creation:**
- Write 5-10 blog posts on biomarker optimization
- Create "How to interpret your labs" YouTube video
- Design infographics on functional vs clinical ranges

**Partnership Outreach:**
- Reach out to 10 health/fitness influencers for beta access
- Connect with functional medicine practitioners
- Engage in relevant Facebook groups and forums

---

### Launch (Week 8)

**Channels:**
1. **FitCoach AI Users (Warm Audience)**
   - Email blast: "New tool to optimize your labs"
   - Offer: $29 launch pricing (normally $47)
   - Target: 50 early adopters

2. **Social Media**
   - Twitter/X: Thread on "What your labs really mean"
   - LinkedIn: Article on health optimization
   - Instagram: Visual comparison of clinical vs functional ranges

3. **Reddit**
   - r/FunctionHealth (careful, value-first approach)
   - r/Biohackers
   - r/QuantifiedSelf
   - Provide free value before promoting product

4. **ProductHunt**
   - Prepare launch for Week 9
   - Gather "Hunter" and supporters in advance
   - Create compelling demo video

---

### Growth (Months 2-6)

**SEO Content Marketing:**
- Blog posts: "How to Lower Your Fasting Glucose Naturally"
- Target keywords: "function health results", "how to interpret labs", "[biomarker] optimization"
- Build backlinks through guest posts and partnerships

**YouTube:**
- "I analyzed my Function Health results and here's what I learned"
- "How to optimize [specific biomarker] according to research"
- Case studies: "This protocol lowered my glucose 20 points in 8 weeks"

**Partnerships:**
- Affiliate program: 20% commission for coaches/influencers
- Integration with fitness apps (Fitbit, Apple Health)
- Guest appearances on health podcasts

**Paid Advertising (if needed):**
- Facebook/Instagram ads targeting health-conscious 25-55 year olds
- Google Ads: Target "function health results", "lab interpretation"
- YouTube pre-roll for health/fitness channels
- Budget: $1-2K/month, optimize for CAC <$50

**Referral Program:**
- Give $10 credit for each referred friend who uploads lab
- Referred friend gets $10 off first upload
- Track viral coefficient (target: >1.0)

---

## Open Questions & Decisions Needed

1. **Pricing Strategy:** Per-upload ($47) vs subscription ($29/mo) vs hybrid? 
   - Recommendation: Start hybrid, test conversion rates

2. **OCR Solution:** Client-side (Tesseract.js, free) vs server-side (AWS Textract, $1.50/1000 pages)?
   - Recommendation: Start Tesseract.js, upgrade if accuracy issues

3. **AI Integration:** Use Claude/GPT API for protocol generation or pure rule-based?
   - Recommendation: Rule-based for MVP (predictable, lower cost), AI for enhancement later

4. **HIPAA Compliance:** Pursue HIPAA compliance from day 1 or wait?
   - Recommendation: Not initially (not a covered entity), add if enterprise sales emerge

5. **White Label:** Build for MVP or Phase 2?
   - Recommendation: Phase 2 (Month 5), validate individual user demand first

6. **Direct Lab Ordering:** Partner with Quest/LabCorp for ordering or stay platform agnostic?
   - Recommendation: Phase 3 (Month 6+), focus on protocol quality first

---

## Appendix

### A. Glossary

- **Biomarker:** Measurable indicator of health status (e.g., fasting glucose, vitamin D)
- **Clinical Range:** Lab reference range for "normal" values
- **Functional Range:** Optimal range for health and performance (often stricter than clinical)
- **OCR:** Optical Character Recognition - extracting text from images/PDFs
- **Protocol:** Personalized plan with specific interventions to optimize biomarkers
- **Intervention:** Actionable recommendation (diet, supplement, lifestyle change)
- **PubMed:** Database of biomedical research papers (pubmed.ncbi.nlm.nih.gov)

### B. Competitor Deep Dive

[Would include detailed competitive analysis if this were full document]

### C. User Research Summary

[Would include findings from user interviews if conducted]

### D. Legal Disclaimer Template

[Would include attorney-reviewed disclaimer text]

---

## Document History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | Nov 10, 2025 | Zach Salyers | Initial PRD creation |

---

## Approval & Sign-off

**Product Owner:** Zach Salyers  
**Technical Lead:** TBD  
**Design Lead:** TBD  
**Legal Review:** TBD (required before launch)

---

*This PRD is a living document and will be updated as the product evolves.*