# Prioritized SEO Action Plan
**Domain:** `https://majestic-essence.com`  
**Framework:** Claude SEO v2.4.1 Falsifiable Action Plan  

---

## Phase 1: Completed Critical Fixes (Implemented)

| Issue | Category | Severity | Action Taken | Verification Method |
|---|---|:---:|---|---|
| **WWW vs. Non-WWW Redirection** | Technical | **Critical** | Configured Apache 301 redirection in `.htaccess` to force all traffic to canonical non-www `https://majestic-essence.com`. | Request `http://www...` and `https://www...` via `curl -I` and observe single 301 hop to non-www. |
| **Missing Image Alt Attributes** | Image SEO | **High** | Added keyword-rich, authentic botanical alt descriptions to all 106 images across all 18 site templates. | Automated DOM scan confirmed `0` images missing or with empty alt attributes. |
| **Duplicate Internal Anchor Texts** | SXO / Links | **Medium** | Differentiated bottom legal strip anchors from column nav anchors on `index.html` (`Privacy & Cookie Policy`, `Terms & Conditions`, `Shipping Guidelines`, `Help & FAQ`). | Verified distinct anchor texts with `parse_html.py`. |
| **Missing Image Sitemap Entries** | Image SEO | **Medium** | Populated `sitemap.xml` with Google Image Sitemap XML `<image:image>` records for all flagship products and collections. | Validated XML syntax with `sitemap_discovery.py`. |
| **Homepage WebSite Schema Gap** | Schema | **Medium** | Added `WebSite` structured data with `alternateName` and `@graph` entity binding to `Organization` in `index.html`. | Validated with Google Rich Results Test schema guidelines. |
| **llms.txt Markdown Format** | GEO / AEO | **Medium** | Converted bare URLs in `llms.txt` to standard Markdown links `[Title](URL)` per Lighthouse agentic rules. | Ran `agentic_check.py` against standard rules. |

---

## Phase 2: High-Impact Ongoing Recommendations (Weeks 2–4)

### 1. Google Search Console & Indexing API Integration
- **Action:** Add Search Console property verification for `https://majestic-essence.com/` (Domain property or URL prefix).
- **Leading Indicator:** Inspect URL status in GSC; verify sitemap fetch date.
- **Falsifiability Check:** Run `/seo google gsc https://majestic-essence.com` once Tier 1 OAuth/Service Account credentials are provided. If zero crawl errors and 18 submitted pages indexed within 7–14 days, the gate is satisfied.

### 2. Google Merchant Center Product Feed Sync
- **Action:** Connect Bukanu Blend and the 5 Single Spices to Google Merchant Center Free Product Listings via automated feed or schema extraction.
- **Leading Indicator:** Merchant Center recognizes active `Product` and `Offer` schema with `availability: InStock`.
- **Falsifiability Check:** Free listings tab in Merchant Center shows 6 approved product items with green status.

### 3. Progressive Image Delivery (AVIF Enhancements)
- **Action:** While all images now use modern WebP with explicit dimensions, evaluate generating next-generation AVIF images for the heaviest culinary cards (>150KB) using `<picture>` markup.
- **Leading Indicator:** Total page payload decreases by another 15–25% on mobile 4G networks.
- **Falsifiability Check:** Test with `/seo images` and verify Byte efficiency.

---

## Phase 3: Content Expansion & Authority Building (Month 2)

### 1. Spice Chronicles Blog Cluster Strategy
- **Action:** Publish 3 authoritative botanical terroir articles linking into dedicated product chapters:
  - *"The Chemistry of Bukanu: Understanding Slow-Roasted Carminative Herbs"* -> Links to `/bukanu`
  - *"Why Sun-Curing Preserves Volatiles in Nagaur Kasuri Methi"* -> Links to `/kasuri-methi`
  - *"Thymol Potency in Saurashtra Ajwain vs. Industrial Seed"* -> Links to `/ajwain`
- **Leading Indicator:** Organic impressions in Google Search Console for long-tail Ayurvedic and culinary queries.
- **Falsifiability Check:** Articles rank in top 20 for target primary keywords within 60 days of publication.
