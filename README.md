# Alan Joy — Personal Website & Blog

Personal site and technical blog for a software engineer working Linux server
administration and L2/L3 managed hosting support. Hand-built, no dependencies,
no build step, no trackers.

**Live:** https://alanjoy.site/

---

## Content status

All biographical content on the site now comes from `Alan_Joy_CV_2026.pdf`:

| Section | Source |
|---|---|
| Role, employer, dates | CV — Bobcares, Aug 2024 → present |
| Experience length | CV — 2 years |
| Education | CV — B.Tech CSE, St. Joseph's CET Palai, 7.5 CGPA |
| Certifications | CV — IBM Cybersecurity ×2, RHEL Fundamentals, Business Analysis; AWS CLF-C02 and SAA-C03 in progress |
| Technical skills | CV — verbatim skill categories |
| Projects / incidents | CV — real production work |
| Contact details | CV — alanjoy905@gmail.com, +91 62825 70219, Kochi |
| Headline stats | CV — 2 years, L2/L3, 176 GB largest DB migrated, load 45–80 resolved |

The six blog articles are original technical writing, accurate to the domain but
not drawn from the CV.

**Testimonials were removed.** The site previously carried three fabricated
quotes; there is no testimonials section now. If you get real quotes, that's the
place to add them back.

## Structure

```
index.html            Home — hero, stats, about, skills, projects, latest posts
about.html            Bio, experience timeline, education, certifications, toolbox
services.html         What I do, engagement process, ways I can help, FAQ
projects.html         Filterable portfolio — 9 real engagements, 8 categories
blog.html             Article index with live search + tag filter
contact.html          Contact form with validation + contact details
404.html              Terminal-themed not-found page

posts/                Six full technical articles
assets/css/main.css   Single stylesheet, numbered sections, design tokens at top
assets/js/main.js     Vanilla JS, one isolated module per feature
robots.txt            Crawler rules
sitemap.xml           All 13 pages
legacy-template/      The original TemplateMo "NexusFlow" template, kept for reference
```

## Features

- **Responsive** — verified with no horizontal overflow from 320px to 1400px
- **Animated hero** with typewriter role cycling and a terminal status card
- **Scroll reveal** and animated stat counters (IntersectionObserver)
- **Filterable projects**; **searchable blog** with tag filters
- **Copy-to-clipboard** on every code block
- **Client-side form validation** with inline field errors
- **SEO** — per-page meta, Open Graph + Twitter cards, canonical URLs,
  `Person` and `BlogPosting` JSON-LD, sitemap, robots.txt
- **Accessible** — skip link, ARIA on interactive controls, keyboard-operable
  drawer (Escape closes), visible focus rings, semantic landmarks
- **Degrades gracefully** — `<noscript>` fallback makes all content visible
  without JS; each JS module is isolated so one failure can't blank the page
- **Respects `prefers-reduced-motion`**; includes a print stylesheet

## Editing

No build step. Edit the HTML directly and refresh.

**Design tokens** — colours, fonts, spacing and radii are CSS custom properties
at the top of `assets/css/main.css`. Change `--cyan`, `--violet` and `--green`
to re-theme the whole site.

**To add a blog post:** copy a file from `posts/`, replace the article body,
update the `<title>`, meta description and the JSON-LD block at the bottom, then
add a card to `blog.html` (give it `data-tags` so search and filtering pick it
up) and a `<url>` entry to `sitemap.xml`.

## Finishing the contact form

The form posts to [Web3Forms](https://web3forms.com). One value is missing:

1. Go to https://web3forms.com, enter `alanjoy905@gmail.com`, and they email you an
   access key (no account needed).
2. In `contact.html`, replace the placeholder:

   ```html
   <input type="hidden" name="access_key" value="PASTE-YOUR-WEB3FORMS-ACCESS-KEY-HERE">
   ```

3. Commit and push. That's it.

Until the key is in, the form validates and then falls back to opening the
visitor's mail client, so it is never silently broken. The yellow setup note on
the page removes itself automatically once a real key is present.

**How it behaves once wired up:** submits in the background via `fetch`, shows an
inline success message, and resets — the visitor never leaves the page. If the
request fails or Web3Forms rejects it, it falls back to mailto rather than
stranding them.

**Spam:** a hidden `botcheck` honeypot field is included; Web3Forms discards any
submission where it is filled in. Free tier is 250 submissions/month.

**Note:** the access key is a public, client-side value by design — it only
permits sending to your own verified address. It is not a secret.

## Asset caching

`main.css` and `main.js` are referenced with a `?v=YYYYMMDD` query string:

```html
<link rel="stylesheet" href="assets/css/main.css?v=20260905">
<script src="assets/js/main.js?v=20260905"></script>
```

**Bump that date on every page whenever you change the CSS or JS**, otherwise
returning visitors keep running the copy their browser already cached. This
caused a real bug once: a stale `main.js` did not intercept the contact form
submit, so visitors were bounced to Web3Forms' own success page instead of
staying on the site.

```bash
# bump everywhere at once
grep -rl 'main\.\(css\|js\)?v=' --include='*.html' . \
  | xargs sed -i 's/?v=[0-9]\{8\}/?v=20260906/g'
```

## Running locally

```bash
python3 -m http.server 8000    # then open http://localhost:8000
```

## Deployment

GitHub Pages serves this repository from `main`. Push to `main` and it
publishes. All internal links are relative, so the site also works from a
subdirectory or a different domain without changes.
