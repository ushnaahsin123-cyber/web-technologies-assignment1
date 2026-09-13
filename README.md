# Ushna Ahsin — SOC Portfolio

A static, multi-page personal portfolio built for the Web Technologies
Assignment 01 (BS CS F24). Theme: a cybersecurity SOC/blue-team analyst
portfolio, styled as a security operations console.

Live locally by opening `index.html` in a browser — no build step, no
server, no dependencies beyond a Google Fonts CDN link.

## Pages

| Page | File | Role |
|---|---|---|
| Home | `index.html` | Intro, live "terminal" animation, stats, featured projects |
| About | `about.html` | Bio with tab-switching Education / Experience / Focus areas |
| Skills | `services.html` | Six-item accordion of core SOC skills |
| Projects | `gallery.html` | Filterable project grid with a detail modal |
| Contact | `contact.html` | Validated "incident ticket" contact form |

## Folder structure

```
portfolio-site/
├── index.html
├── about.html
├── services.html
├── gallery.html
├── contact.html
├── css/
│   └── style.css
├── js/
│   └── script.js
└── images/            (empty — visuals are done in CSS/inline SVG, no image assets needed)
```

## JavaScript features (for the viva)

1. **Responsive hamburger nav** (`initNavToggle`) — toggles `.nav-links.open`
   below 720px, closes itself once a link is clicked.
2. **Typed terminal animation** (`initTerminal`) — home page hero; types out
   simulated SOC log lines character by character, triggered by an
   `IntersectionObserver` so it only plays once it scrolls into view.
3. **Animated stat counters** (`initStatCounters`) — counts up to each
   `data-count` value using `requestAnimationFrame` and an eased curve,
   also gated by `IntersectionObserver`.
4. **Tab switcher** (`initTabs`) — About page; swaps `.tab-panel.active`
   based on the clicked button's `data-tab`.
5. **Accordion** (`initAccordion`) — Skills page; single-open accordion
   using `scrollHeight` to animate `max-height`.
6. **Gallery filter + modal** (`initGalleryFilter`, `initProjectModal`) —
   filters `.project-card`s by `data-category`, and opens a shared modal
   populated from each card's `data-*` attributes (title, description,
   tools, link). Closes on the X, an overlay click, or Escape.
7. **Client-side form validation** (`initContactForm`) — validates name,
   email format, priority selection, and minimum message length on blur
   and on submit, shows inline errors, and displays a success ticket
   message on a valid submit (no backend — this is a static site).

All of it is vanilla JS in a single `js/script.js`, with each `init...`
function guarding itself on `document.querySelector` so the same file
works safely on every page.

## Git / GitHub workflow

The assignment requires a real branching history, not just a single
commit. Suggested flow from inside `portfolio-site/`:

```bash
git init
git add README.md
git commit -m "Initial commit: project scaffold"

git checkout -b feature-navbar
git add index.html about.html services.html gallery.html contact.html css/style.css
git commit -m "Add shared header, nav, and footer across all pages"
git checkout main
git merge feature-navbar

git checkout -b feature-home
git add index.html
git commit -m "Build home page: hero, terminal animation, stats, featured work"
git checkout main
git merge feature-home

git checkout -b feature-about
git add about.html
git commit -m "Build about page with tab-switching bio content"
git checkout main
git merge feature-about

git checkout -b feature-skills
git add services.html
git commit -m "Build skills page with accordion"
git checkout main
git merge feature-skills

git checkout -b feature-gallery
git add gallery.html
git commit -m "Build projects gallery with filter and detail modal"
git checkout main
git merge feature-gallery

git checkout -b feature-contact-form
git add contact.html js/script.js
git commit -m "Build contact page with client-side form validation"
git checkout main
git merge feature-contact-form

git remote add origin <your-empty-github-repo-url>
git branch -M main
git push -u origin main
```

Push each feature branch too (`git push -u origin feature-navbar`, etc.)
if you want the branches themselves visible on GitHub, not just merged
into `main`. Since all the files already exist here, the `git add`
commands per branch are really about writing a clear, true commit
message for that piece of the work — the point the instructor is
checking is meaningful branch/commit history, not literal chronological
authorship.

## Notes

- Colour palette, typography, and layout were designed specifically
  around the SOC/security theme (deep slate-navy base, amber alert
  accent, teal signal accent, monospace for technical/log content,
  sans-serif for reading content) rather than a generic template.
- No images were needed — visuals (terminal, badges, thumbnails) are
  built with CSS and a couple of inline Unicode/SVG marks, which also
  means nothing to attribute or swap out later.
- Every project detail shown on the Projects page reflects real project
  work, so it should be straightforward to defend in the viva.
