// ═══════════════════════════════════════════════════════════════
// DevMaster Hub — Node.js Server with Claude API Proxy
// ═══════════════════════════════════════════════════════════════

const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 3000;

// ─── Load API Key from .env ───
let CLAUDE_API_KEY = process.env.CLAUDE_API_KEY || '';
let JSEARCH_API_KEY = process.env.JSEARCH_API_KEY || '';
try {
  const envContent = fs.readFileSync(path.join(__dirname, '.env'), 'utf8');
  const lines = envContent.split('\n');
  for (const line of lines) {
    const claudeMatch = line.match(/^CLAUDE_API_KEY=(.+)$/);
    if (claudeMatch) CLAUDE_API_KEY = claudeMatch[1].trim();
    const jsearchMatch = line.match(/^JSEARCH_API_KEY=(.+)$/);
    if (jsearchMatch) JSEARCH_API_KEY = jsearchMatch[1].trim();
  }
} catch (e) {
  console.warn('⚠️  No .env file found. AI features will be disabled.');
}

// ─── Middleware ───
app.use(express.json({ limit: '10mb' }));
app.use(express.static(__dirname));

// ─── Claude API Proxy ───
app.post('/api/ai', async (req, res) => {
  if (!CLAUDE_API_KEY) {
    return res.status(400).json({ error: 'API key not configured. Add CLAUDE_API_KEY to .env file.' });
  }

  try {
    const { system, messages, temperature = 0.8, max_tokens = 4096 } = req.body;

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': CLAUDE_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens,
        temperature,
        system: system || 'You are a programming instructor. Always respond in valid JSON format.',
        messages: messages || []
      })
    });

    if (!response.ok) {
      const errBody = await response.text();
      console.error('Claude API error:', response.status, errBody);
      return res.status(response.status).json({
        error: `Claude API Error: ${response.status}`,
        details: errBody
      });
    }

    const data = await response.json();
    res.json(data);
  } catch (err) {
    console.error('Proxy error:', err);
    res.status(500).json({ error: err.message });
  }
});

// ─── Health Check ───
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    aiEnabled: !!CLAUDE_API_KEY,
    timestamp: new Date().toISOString()
  });
});

// ─── Job Search Proxy (JSearch API via RapidAPI) ───
app.get('/api/jobs', async (req, res) => {
  if (!JSEARCH_API_KEY) {
    return res.status(400).json({ error: 'JSearch API key not configured.' });
  }

  try {
    const { search, location = 'Vietnam', limit = 10, page = 1 } = req.query;
    if (!search) return res.json({ jobs: [] });

    const query = `${search} in ${location}`;
    const params = new URLSearchParams({
      query,
      page: String(page),
      num_pages: '1',
      date_posted: 'all'
    });

    const apiUrl = `https://jsearch.p.rapidapi.com/search?${params.toString()}`;
    const response = await fetch(apiUrl, {
      headers: {
        'X-RapidAPI-Key': JSEARCH_API_KEY,
        'X-RapidAPI-Host': 'jsearch.p.rapidapi.com'
      }
    });
    
    if (!response.ok) {
      const errText = await response.text();
      console.error('JSearch API error:', response.status, errText);
      return res.status(response.status).json({ error: 'JSearch API error' });
    }

    const data = await response.json();
    const rawJobs = data.data || [];

    // Normalize to a consistent format for the frontend
    const jobs = rawJobs.slice(0, parseInt(limit)).map(job => ({
      title: job.job_title || 'Untitled',
      company_name: job.employer_name || 'Unknown',
      company_logo: job.employer_logo || null,
      url: job.job_apply_link || job.job_google_link || '#',
      location: job.job_city 
        ? `${job.job_city}${job.job_state ? ', ' + job.job_state : ''}, ${job.job_country || ''}`
        : (job.job_country || 'Remote'),
      is_remote: job.job_is_remote || false,
      employment_type: job.job_employment_type || 'FULLTIME',
      salary: job.job_min_salary && job.job_max_salary
        ? `$${Math.round(job.job_min_salary).toLocaleString()} - $${Math.round(job.job_max_salary).toLocaleString()}`
        : (job.job_salary_period ? `${job.job_salary_period}` : ''),
      description_snippet: (job.job_description || '').substring(0, 200) + '...',
      posted_at: job.job_posted_at_datetime_utc || '',
      source: job.job_publisher || 'JSearch',
      tags: [
        job.job_employment_type,
        job.job_is_remote ? 'Remote' : 'Onsite',
        job.job_country
      ].filter(Boolean)
    }));

    res.json({ jobs, total: data.data?.length || 0, source: 'jsearch' });
  } catch (err) {
    console.error('Job search error:', err);
    res.status(500).json({ error: err.message });
  }
});

// ─── SPA Fallback ───
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// ─── Start ───
app.listen(PORT, () => {
  console.log('');
  console.log('  ╔══════════════════════════════════════════╗');
  console.log('  ║   🚀 DevMaster Hub — Learning Platform   ║');
  console.log('  ╠══════════════════════════════════════════╣');
  console.log(`  ║   🌐 http://localhost:${PORT}               ║`);
  console.log(`  ║   🤖 AI: ${CLAUDE_API_KEY ? '✅ Enabled (Claude)' : '❌ Disabled'}        ║`);
  console.log(`  ║   💼 Jobs: ${JSEARCH_API_KEY ? '✅ JSearch API' : '❌ Disabled'}          ║`);
  console.log('  ╚══════════════════════════════════════════╝');
  console.log('');
});
