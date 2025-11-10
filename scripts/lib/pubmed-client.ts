/**
 * PubMed API Client
 * Uses NCBI E-utilities API (free, no API key required for reasonable use)
 * Documentation: https://www.ncbi.nlm.nih.gov/books/NBK25501/
 */

export interface PubMedSearchParams {
  query: string;
  maxResults?: number;
  startYear?: number;
  endYear?: number;
  studyTypes?: string[];
}

export interface PubMedArticle {
  pmid: string;
  title: string;
  authors: string[];
  journal: string;
  publicationDate: string;
  abstract: string;
  doi?: string;
  publicationYear: number;
}

const PUBMED_BASE_URL = 'https://eutils.ncbi.nlm.nih.gov/entrez/eutils';
const TOOL_NAME = 'functional_health_research_seeder';
const EMAIL = 'dev@functionalhealth.com'; // NCBI requests this for tracking

/**
 * Search PubMed for articles matching query
 */
export async function searchPubMed(params: PubMedSearchParams): Promise<string[]> {
  const {
    query,
    maxResults = 10,
    startYear,
    endYear,
    studyTypes = []
  } = params;

  // Build query with filters
  let searchQuery = query;

  // Add date range
  if (startYear || endYear) {
    const minDate = startYear ? `${startYear}/01/01` : '1900/01/01';
    const maxDate = endYear ? `${endYear}/12/31` : '2025/12/31';
    searchQuery += ` AND ${minDate}:${maxDate}[pdat]`;
  }

  // Add study type filters
  if (studyTypes.length > 0) {
    const typeFilters = studyTypes.map(type => `"${type}"[Publication Type]`).join(' OR ');
    searchQuery += ` AND (${typeFilters})`;
  }

  // Add quality filters
  searchQuery += ' AND (hasabstract[text] AND english[lang])';

  const searchUrl = new URL(`${PUBMED_BASE_URL}/esearch.fcgi`);
  searchUrl.searchParams.set('db', 'pubmed');
  searchUrl.searchParams.set('term', searchQuery);
  searchUrl.searchParams.set('retmax', maxResults.toString());
  searchUrl.searchParams.set('retmode', 'json');
  searchUrl.searchParams.set('sort', 'relevance');
  searchUrl.searchParams.set('tool', TOOL_NAME);
  searchUrl.searchParams.set('email', EMAIL);

  console.log(`🔍 Searching PubMed: ${query.substring(0, 60)}...`);

  try {
    const response = await fetch(searchUrl.toString());
    const data = await response.json();

    const pmids = data.esearchresult?.idlist || [];
    console.log(`   Found ${pmids.length} articles`);

    return pmids;
  } catch (error) {
    console.error('Error searching PubMed:', error);
    throw error;
  }
}

/**
 * Fetch article details for given PMIDs
 */
export async function fetchArticleDetails(pmids: string[]): Promise<PubMedArticle[]> {
  if (pmids.length === 0) return [];

  const fetchUrl = new URL(`${PUBMED_BASE_URL}/efetch.fcgi`);
  fetchUrl.searchParams.set('db', 'pubmed');
  fetchUrl.searchParams.set('id', pmids.join(','));
  fetchUrl.searchParams.set('retmode', 'xml');
  fetchUrl.searchParams.set('tool', TOOL_NAME);
  fetchUrl.searchParams.set('email', EMAIL);

  console.log(`📥 Fetching details for ${pmids.length} articles...`);

  try {
    const response = await fetch(fetchUrl.toString());
    const xmlText = await response.text();

    // Parse XML to extract article data
    const articles = parseArticlesFromXML(xmlText);
    console.log(`   Successfully parsed ${articles.length} articles`);

    return articles;
  } catch (error) {
    console.error('Error fetching article details:', error);
    throw error;
  }
}

/**
 * Parse PubMed XML response into structured article objects
 */
function parseArticlesFromXML(xml: string): PubMedArticle[] {
  const articles: PubMedArticle[] = [];

  // Simple XML parsing (using regex - for production, consider using a proper XML parser)
  const articleMatches = xml.matchAll(/<PubmedArticle>(.*?)<\/PubmedArticle>/gs);

  for (const match of articleMatches) {
    const articleXml = match[1];

    try {
      // Extract PMID
      const pmidMatch = articleXml.match(/<PMID[^>]*>(\d+)<\/PMID>/);
      const pmid = pmidMatch ? pmidMatch[1] : '';

      // Extract title
      const titleMatch = articleXml.match(/<ArticleTitle>(.*?)<\/ArticleTitle>/s);
      const title = titleMatch ? cleanXmlText(titleMatch[1]) : '';

      // Extract authors
      const authors: string[] = [];
      const authorMatches = articleXml.matchAll(/<Author[^>]*>.*?<LastName>(.*?)<\/LastName>.*?<ForeName>(.*?)<\/ForeName>.*?<\/Author>/gs);
      for (const authorMatch of authorMatches) {
        authors.push(`${authorMatch[2]} ${authorMatch[1]}`);
      }

      // Extract journal
      const journalMatch = articleXml.match(/<Title>(.*?)<\/Title>/);
      const journal = journalMatch ? cleanXmlText(journalMatch[1]) : '';

      // Extract publication date
      const yearMatch = articleXml.match(/<PubDate>.*?<Year>(\d{4})<\/Year>/s);
      const monthMatch = articleXml.match(/<PubDate>.*?<Month>([^<]+)<\/Month>/s);
      const year = yearMatch ? yearMatch[1] : '';
      const month = monthMatch ? monthMatch[1] : '01';
      const publicationDate = `${year}-${month.padStart(2, '0')}-01`;

      // Extract abstract
      const abstractMatch = articleXml.match(/<AbstractText[^>]*>(.*?)<\/AbstractText>/s);
      const abstract = abstractMatch ? cleanXmlText(abstractMatch[1]) : '';

      // Extract DOI
      const doiMatch = articleXml.match(/<ArticleId IdType="doi">([^<]+)<\/ArticleId>/);
      const doi = doiMatch ? doiMatch[1] : undefined;

      if (pmid && title && abstract) {
        articles.push({
          pmid,
          title,
          authors: authors.slice(0, 10), // Limit to first 10 authors
          journal,
          publicationDate,
          abstract,
          doi,
          publicationYear: parseInt(year) || 0
        });
      }
    } catch (error) {
      console.error('Error parsing article:', error);
    }
  }

  return articles;
}

/**
 * Clean XML text by removing HTML tags and decoding entities
 */
function cleanXmlText(text: string): string {
  return text
    .replace(/<[^>]+>/g, '') // Remove HTML tags
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#(\d+);/g, (match, dec) => String.fromCharCode(dec))
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Main function to search and fetch articles in one call
 */
export async function searchAndFetchArticles(params: PubMedSearchParams): Promise<PubMedArticle[]> {
  const pmids = await searchPubMed(params);

  if (pmids.length === 0) {
    console.log('   ⚠️  No articles found');
    return [];
  }

  // Add delay to be respectful to NCBI servers
  await new Promise(resolve => setTimeout(resolve, 500));

  const articles = await fetchArticleDetails(pmids);
  return articles;
}
