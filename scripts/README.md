# Research Database Seeding Scripts

Automated pipeline to seed the research database with high-quality studies from PubMed, analyzed by Claude AI.

## 🚀 Quick Start

### Prerequisites

1. **Claude API Key** - Get one from [Anthropic Console](https://console.anthropic.com/)
2. Add to your `.env` file:
   ```bash
   ANTHROPIC_API_KEY=your_api_key_here
   ```

### Run the Pipeline

```bash
npm run seed:research
```

## 📋 What It Does

The pipeline performs 4 phases:

### Phase 1: PubMed Search
- Queries PubMed API with pre-defined searches for biomarkers/interventions
- Fetches study metadata and abstracts
- ~50 studies fetched (deduplicated)

### Phase 2: Claude Analysis
- Sends each abstract to Claude API
- Extracts structured data:
  - Study type (RCT, meta-analysis, etc.)
  - Quality score (1-10)
  - Sample size and duration
  - Key findings
  - Relevant biomarkers and interventions
- Filters for quality (≥6/10)

### Phase 3: Output Generation
- Generates SQL migration file
- Creates JSON for review
- Creates Markdown summary

### Phase 4: Summary Stats
- Shows distribution by study type, quality, biomarkers, interventions

## 📁 Output Files

All outputs saved to `scripts/output/`:

| File | Description |
|------|-------------|
| `{timestamp}_seed_research_studies.sql` | SQL migration to insert studies |
| `studies-analyzed.json` | Structured JSON of all analyzed studies |
| `studies-summary.md` | Human-readable summary with details |
| `articles-raw.json` | Raw PubMed data (for debugging) |

## 🎯 Research Queries

Current queries target (see `lib/research-queries.ts`):

- **Glucose/Metabolic:** Berberine, low-carb diet, exercise, omega-3
- **Vitamin D:** Supplementation, immune function
- **Thyroid:** Selenium, iodine
- **Inflammation:** Lifestyle interventions, CRP
- **Cholesterol:** Natural alternatives
- **Hormones:** Testosterone, cortisol
- **B Vitamins:** B12 supplementation

Total: ~50 studies expected

## ⚙️ Configuration

### Customize Queries

Edit `lib/research-queries.ts` to add new queries:

```typescript
{
  id: 'my-query',
  description: 'My custom research query',
  query: '(keyword1 OR keyword2) AND biomarker',
  maxResults: 5,
  startYear: 2015,
  studyTypes: ['Randomized Controlled Trial'],
  biomarkerNames: ['Biomarker Name'],
  interventionNames: ['Intervention Name']
}
```

### Adjust Quality Threshold

In `seed-research.ts`, change:
```typescript
const MIN_QUALITY_SCORE = 6; // Only studies ≥6/10
```

### Rate Limiting

- PubMed: 1 second between queries (NCBI guidelines)
- Claude: 1.5 seconds between analyses (default)

Adjust in `seed-research.ts`:
```typescript
const analyzedStudies = await analyzeStudies(uniqueArticles, 1500); // milliseconds
```

## 💰 Cost Estimate

**Claude API (Haiku model):**
- ~$0.50-1.00 per study analyzed
- Initial run (50 studies): ~$25-50
- Ongoing updates (20 studies/month): ~$10-20/month

**PubMed API:**
- Free (no API key needed)

## 🔄 Continuous Updates

To keep research fresh, run periodically:

1. **Manual:** Run `npm run seed:research` monthly
2. **Automated:** Set up GitHub Action (future)
3. **Admin Tool:** Build into app (future - see PRD Option B)

## 📝 Review Process

After running the script:

1. **Review Summary:**
   ```bash
   cat scripts/output/studies-summary.md
   ```

2. **Check Quality Distribution:**
   - Aim for most studies 7-10/10
   - Investigate any scores <6

3. **Verify SQL:**
   ```bash
   cat scripts/output/*_seed_research_studies.sql
   ```

4. **Apply Migration:**
   ```bash
   # Copy to migrations folder
   cp scripts/output/*_seed_research_studies.sql supabase/migrations/

   # Run migration (if using local Supabase)
   supabase db push

   # Or apply directly via SQL editor in Supabase dashboard
   ```

## 🔍 Architecture

```
scripts/
├── seed-research.ts          # Main orchestration script
├── lib/
│   ├── pubmed-client.ts      # PubMed API wrapper
│   ├── claude-analyzer.ts    # Claude AI analysis
│   ├── research-queries.ts   # Pre-defined queries
│   └── sql-generator.ts      # SQL generation utilities
├── output/                   # Generated files (gitignored)
└── README.md                 # This file
```

## 🐛 Troubleshooting

### "ANTHROPIC_API_KEY environment variable not set"
Add your Claude API key to `.env` file in project root.

### PubMed returns 0 results
- Check query syntax in `research-queries.ts`
- Try broader search terms
- Check internet connection

### Claude API errors
- Verify API key is valid
- Check rate limits (tier dependent)
- Try reducing `maxResults` in queries

### SQL errors when applying migration
- Check for duplicate PMIDs in database
- The migration uses `ON CONFLICT DO UPDATE` to handle duplicates
- Review SQL syntax if custom modifications were made

## 🚧 Future Enhancements

- [ ] Automated weekly runs via GitHub Actions
- [ ] Admin UI for reviewing/approving studies
- [ ] Link studies to specific protocol rules
- [ ] Add more biomarker/intervention queries
- [ ] Support for full-text analysis (not just abstracts)
- [ ] Quality scoring refinement based on citations

## 📚 Resources

- [PubMed E-utilities API](https://www.ncbi.nlm.nih.gov/books/NBK25501/)
- [Anthropic Claude API](https://docs.anthropic.com/)
- [Research Studies Schema](../supabase/migrations/20251110000000_initial_schema.sql)

## 🤝 Contributing

To add new research queries:

1. Edit `lib/research-queries.ts`
2. Add query to `CORE_RESEARCH_QUERIES`
3. Run `npm run seed:research`
4. Review output and adjust as needed

## 📄 License

Internal tool for Functional Health Lab Analysis app.
