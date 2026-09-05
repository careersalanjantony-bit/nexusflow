# Alan Joy — Personal Website & Blog

Personal site and technical blog for a software engineer working Linux server
administration and L2/L3 managed hosting support. Hand-built, no dependencies,
no build step, no trackers.

**Live:** https://careersalanjantony-bit.github.io/nexusflow/

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

## Wiring up the contact form

The form has no backend yet — it validates input, then opens the visitor's mail
client pre-filled. To receive submissions properly, sign up with a form service
(Formspree, Web3Forms, Basin) and add its endpoint as the form `action` in
`contact.html`:

```html
<form class="card" id="contact-form" action="https://formspree.io/f/YOUR_ID" method="POST" ...>
```

`assets/js/main.js` detects the `action` attribute and skips the mailto fallback
automatically — validation still runs first. Remove the `.form-note` paragraph
once it's live.

## Running locally

```bash
python3 -m http.server 8000    # then open http://localhost:8000
```

## Deployment

GitHub Pages serves this repository from `main`. Push to `main` and it
publishes. All internal links are relative, so the site also works from a
subdirectory or a different domain without changes.
