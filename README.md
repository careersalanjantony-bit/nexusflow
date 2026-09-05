# Alan Joy — Personal Website & Blog

A hand-built, dependency-free personal site and technical blog for a Linux server
administrator. Dark "terminal" aesthetic, fully responsive, no build step, no trackers.

**Live:** https://careersalanjantony-bit.github.io/nexusflow/

---

## ⚠️ Read this first — content you should verify

I did not have access to your LinkedIn profile (it's blocked from the build
environment), so **the professional details below were written from your headline and
are placeholders**. Everything reads plausibly, but please check each one against your
actual history before sharing the site:

| What | Where | Status |
|---|---|---|
| Job titles, employers, dates | `about.html` → "Professional experience" | **Invented — replace** |
| Degree and institution | `about.html` → Education card | **Invented — replace** |
| Certifications list | `about.html` → Certifications card | **Invented — replace** |
| Headline stats (5+ yrs, 1200+ servers, 500+ migrations, 99.99%) | `index.html` → `data-count` attributes | **Invented — replace** |
| Skill bar percentages | `index.html` → `data-pct` attributes | **Invented — replace** |
| The 9 projects | `projects.html` | **Invented — replace** |
| Testimonials (3 quotes) | `index.html` → Testimonials | **Invented — remove or replace with real ones** |
| "Languages: English, Malayalam" | `index.html`, `about.html` | **Guessed — verify** |
| Email `careers.alanjantony@gmail.com` | everywhere | From your git history — verify |
| LinkedIn / GitHub URLs | everywhere | From your message — verified |
| The 6 blog articles | `posts/` | Written by Claude — accurate technical content, but publish under your name only if you're happy to stand behind it |

> Fabricated testimonials are the one item worth deleting rather than editing if you
> don't have real quotes yet — they're the easiest thing for a reader to check.

---

## Structure

```
index.html            Home — hero, stats, about, services, skills, projects,
                      testimonials, latest posts, CTA
about.html            Full bio, experience timeline, education, certifications, toolbox
services.html         Service lines, engagement process, models, FAQ
projects.html         Filterable portfolio (9 entries, 6 categories)
blog.html             Article index with live search + tag filter
contact.html          Contact form with validation + contact details
404.html              Terminal-themed not-found page

posts/                Six full technical articles
  zero-downtime-cpanel-migration.html
  linux-server-hardening-checklist.html
  diagnosing-high-server-load.html
  email-deliverability-spf-dkim-dmarc.html
  detecting-a-compromised-server.html
  mysql-slow-query-triage.html

assets/css/main.css   Single stylesheet, organised in 28 numbered sections
assets/js/main.js     Vanilla JS, one function per feature, no dependencies
robots.txt            Crawler rules
sitemap.xml           All 13 pages
legacy-template/      The original TemplateMo "NexusFlow" template, kept for reference
```

## Features

- **Responsive** — verified with no horizontal overflow from 320px to 1400px
- **Animated hero** with typewriter role cycling and a live-looking terminal card
- **Scroll reveal**, animated stat counters and skill bars (IntersectionObserver)
- **Filterable projects** by category; **searchable blog** with tag filters
- **Copy-to-clipboard** on every code block
- **Client-side form validation** with inline field errors
- **SEO** — per-page meta descriptions, Open Graph + Twitter cards, canonical URLs,
  `Person` and `BlogPosting` JSON-LD, sitemap, robots.txt
- **Accessible** — skip link, ARIA on interactive controls, keyboard-operable drawer
  (Escape closes), visible focus rings, semantic landmarks
- **Degrades gracefully** — a `<noscript>` block makes all content visible without JS;
  each JS module is isolated so one failure can't blank the page
- **Respects `prefers-reduced-motion`** — all animation disabled when requested
- **Print stylesheet** — chrome stripped, readable on paper

## Editing

No build step. Edit the HTML directly and refresh.

**To change your name, links or email everywhere:**
```bash
grep -rl 'careers.alanjantony@gmail.com' --include='*.html' . | xargs sed -i 's/old@email/new@email/g'
```

**Design tokens** — colours, fonts, spacing and radii are all CSS custom properties at
the top of `assets/css/main.css` (section 1). Change `--cyan`, `--violet` and `--green`
to re-theme the whole site.

**To add a blog post:** copy an existing file from `posts/`, replace the article body,
update the `<title>`, meta description and JSON-LD block at the bottom, then add a card
to `blog.html` (give it `data-tags` so search and filtering pick it up) and a `<url>`
entry to `sitemap.xml`.

## Wiring up the contact form

The form currently has no backend — it validates input, then opens the visitor's mail
client pre-filled. To receive submissions properly, sign up with a form service
(Formspree, Web3Forms, Basin) and add its endpoint as the form `action` in
`contact.html`:

```html
<form class="card" id="contact-form" action="https://formspree.io/f/YOUR_ID" method="POST" ...>
```

`assets/js/main.js` detects the `action` attribute and stops the mailto fallback
automatically — validation still runs first. Remove the `.form-note` paragraph once
it's live.

## Running locally

```bash
python3 -m http.server 8000    # then open http://localhost:8000
```

## Deployment

Served by GitHub Pages from the repository root. Push to the default branch and it
publishes. All internal links are relative, so the site also works from a subdirectory
or a different domain without changes.
