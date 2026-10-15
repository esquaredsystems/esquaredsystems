# esquaredsystems.com (Jekyll)

Static site for GitHub Pages. Content is data-driven — most edits never touch HTML.

## Run locally
    bundle install
    bundle exec jekyll serve      # http://localhost:4000

## Where things live
| What | File |
| --- | --- |
| Site title, tagline, nav, hero rotating words, form endpoint | `_config.yml` |
| Contact details, vision, mission, commitments | `_data/profile.yml` |
| Services (home bento + services page + footer + contact dropdown) | `_data/services.csv` |
| Team | `_data/team.csv` (add LinkedIn/X URLs to show icons) |
| "How we work" values | `_data/values.csv` |
| Portfolio | `_data/projects.csv` (+ optional write-up `_projects/<slug>.md`) |
| Images | `assets/img/` (all WordPress media, converted to WebP) |
| Styles / JS | `assets/css/style.css`, `assets/js/site.js` |

Adding a project: add a row to `projects.csv` (`slug,title,category,year,summary,image,link`),
optionally create `_projects/<slug>.md` with a `title:` front matter and the case study text.
Portfolio filters are generated from the categories automatically.

## Dynamic bits (client-side, no build step)
Dark/light theme (remembers choice), hero typewriter, scroll reveals, service/portfolio
filters, AJAX contact form, mobile menu, and redirects from old WordPress `?page_id=` links.

## Contact form
Messages are emailed to `form_email` (info@esquaredsystems.com) via FormSubmit — no account needed.
1. After deploying, send one test message from the live /contact/ page.
2. FormSubmit emails info@esquaredsystems.com an activation link — click **Activate Form**
   (nothing is delivered until you do).
3. Optional: the activation email includes a random alias; set `form_alias` in `_config.yml`
   so the address isn't visible in the page source (spam protection).
Visitors' email is used as Reply-To, so you can reply straight from your inbox.
Works without JavaScript too (falls back to a normal POST and returns to /contact/?sent=1).

## Deploy
1. Push to a GitHub repo, Settings → Pages → Deploy from branch `main`, folder `/ (root)`.
2. `CNAME` already contains `esquaredsystems.com`. At Namecheap set A records for `@` to
   185.199.108.153, 185.199.109.153, 185.199.110.153, 185.199.111.153 and a CNAME `www` →
   `<user>.github.io`. Then tick "Enforce HTTPS" in Pages settings.
