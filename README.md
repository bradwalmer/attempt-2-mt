# Overlooked Tax Finder (AI 101 midterm)

**Audience:** everyday U.S. filers who know the common deductions (standard deduction, mortgage interest).
**Need:** discover lesser-known deductions and credits worth investigating, with plain-English reasons and official links.
**Not:** a tax calculator, tax advice, or a complete list.

## Pages
| Page | Purpose |
|---|---|
| `index.html` | Overview and how it works |
| `find.html` | Six-step questionnaire (filing status, income sources, income range, family, education, savings/health) |
| `results.html` | Profile summary plus "Strong match" and "Worth checking" results with IRS and US Code links |
| `library.html` | All 13 provisions regardless of answers |
| `about.html` | Methodology, privacy, limitations, sources, AI disclosure |

## Run
Open `index.html` in a browser (no server or install needed). Run tests: `node test.js` (Node 16+).
Files: `data.js` (questions and provisions), `matcher.js` (rule engine), `site.js` (shared nav and card renderer), `style.css`.

## Privacy
Ranges only, no names/SSNs/addresses. Answers live in `sessionStorage` for the tab and are never transmitted.

## Known limitations
- 13 provisions; not exhaustive. Income bands are coarse and ignore phase-outs by filing status, so results mean "worth checking," not "eligible."
- Dollar thresholds intentionally omitted; they change yearly.
- Summaries and links must be verified against IRS.gov and uscode.house.gov (each shows "not yet verified" until `lastVerified` is set).
- No live AI API. AI helped write code and draft summaries.

## Issue / PR plan (do this yourself)
**Issue:** "Add category filter to the Library page." Acceptance: dropdown (All, Business, Education, Family, Health, Retirement) filters `library.html`; add one test or documented manual check.
Take a before screenshot, implement on a branch, take an after screenshot, open a PR referencing the issue, merge.

## AI Use Note (edit to match what really happened)
- **Tool:** Claude (Anthropic), chat interface.
- **Purpose:** brainstorm scope, generate initial multi-page code, rules, tests and README draft.
- **Representative prompts:** [paste your actual prompts]
- **My changes:** [e.g., verified each IRS/USC link and summary, edited rules, added category filter]
- **Verification:** [what you checked, when, against which pages; paste test output]
- **Limitations:** AI can state wrong rules or thresholds; I treated its summaries as drafts until checked against official sources.
