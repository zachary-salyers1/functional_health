# Functional Health Lab Analysis App

Transform your lab results into actionable, research-backed health optimization protocols.

## Overview

This SaaS platform analyzes blood work using functional (optimal) ranges—not just clinical ranges—and generates personalized 30-90 day protocols with specific interventions backed by peer-reviewed research.

## Tech Stack

- **Frontend:** Next.js 14+ (App Router), TypeScript, Tailwind CSS
- **Backend:** Next.js API Routes
- **Database:** PostgreSQL (Supabase)
- **Authentication:** Supabase Auth
- **File Storage:** Supabase Storage
- **Payments:** Stripe
- **OCR:** Tesseract.js (client-side) or AWS Textract (server-side)
- **Hosting:** Vercel

## Project Structure

```
functional_health/
├── app/                    # Next.js app directory
│   ├── (auth)/            # Auth routes (login, signup)
│   ├── dashboard/         # User dashboard
│   ├── upload/            # Lab upload flow
│   ├── protocol/          # Protocol view/management
│   ├── api/               # API routes
│   └── page.tsx           # Landing page
├── components/            # React components
│   ├── ui/               # Reusable UI components
│   ├── lab/              # Lab upload components
│   ├── protocol/         # Protocol display components
│   └── auth/             # Auth components
├── lib/                   # Utility functions and business logic
│   ├── db/               # Database queries
│   ├── ocr/              # OCR processing
│   ├── protocol/         # Protocol generation logic
│   └── utils/            # Helper functions
├── types/                 # TypeScript type definitions
├── docs/                  # Documentation (PRD, schema, research)
└── public/               # Static assets
```

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL 15+ (or Supabase account)
- Stripe account (for payments)

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd functional_health
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.local.example .env.local
# Edit .env.local with your credentials
```

4. Set up the database:
```bash
# If using local PostgreSQL, run the schema from docs/schema.md
# If using Supabase, use the Supabase dashboard to run the schema
```

5. Run the development server:
```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000)

## Development Roadmap

### Phase 1: Foundation (Weeks 1-2)
- [x] Project setup
- [x] Database schema
- [x] TypeScript types
- [x] Basic routing structure
- [ ] Supabase setup
- [ ] Authentication

### Phase 2: Core Features (Weeks 3-5)
- [ ] Lab upload (PDF + manual entry)
- [ ] OCR processing
- [ ] Biomarker analysis
- [ ] Protocol generation engine
- [ ] PDF export

### Phase 3: Payments & Polish (Weeks 6-7)
- [ ] Stripe integration
- [ ] User dashboard
- [ ] Progress tracking
- [ ] Email notifications

### Phase 4: Launch Prep (Week 8)
- [ ] Testing
- [ ] Performance optimization
- [ ] SEO
- [ ] Deploy to Vercel

## Key Features

### MVP (P0)
- User authentication
- Lab upload (PDF OCR + manual entry)
- Support for 20 core biomarkers
- Functional range comparison
- Protocol generation (3-5 interventions per issue)
- Research citations (PubMed links)
- PDF protocol export
- Stripe payments ($47/upload or $29/month)

### Future Enhancements (P1)
- Progress tracking over time
- More biomarkers (expand to 40+)
- AI-enhanced protocol personalization
- Lab result trends/charts
- Mobile app
- Practitioner accounts

## Documentation

- **PRD:** See [docs/prd.md](docs/prd.md)
- **Database Schema:** See [docs/schema.md](docs/schema.md)
- **Research Structure:** See [docs/research_structure.md](docs/research_structure.md)
- **Biomarker Examples:** See [docs/biomarkers.md](docs/biomarkers.md)

## Contributing

This is a private project. For questions or issues, contact the development team.

## License

Proprietary - All rights reserved
