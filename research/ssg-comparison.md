# Static site generator comparison for the Site

Research for [#381](https://github.com/nemchik/nemchik/issues/381) on map [#378](https://github.com/nemchik/nemchik/issues/378). The data was pulled on 2026-11-20.

**Question:** Which static site generators best fit the Site, ranked against the map's criteria?

The criteria come from #378 Notes:

- mature and stable (1.0+ preferred);
- actively maintained;
- the largest community and Q&A footprint;
- simple frontend customization;
- a personal-site look rather than a docs look;
- it deploys to GitHub Pages.

Learning curve counts as a weight, not a filter. Node is preferred; React, Vue and Go templates carry a cost.

## Recommended shortlist

This is a recommendation, not a decision. The owner picks in the grilling ticket.

1. **Astro.** It is the best overall fit.
   - It runs on Node and TypeScript, and it has by far the largest npm footprint of any SSG-first tool: 49.8M downloads a month.
   - It is backed by a company: The Astro Technology Company joined Cloudflare in January 2026, and Astro stays MIT-licensed and platform-agnostic.
   - GitHub Pages has an official `withastro/action` and a GitHub starter workflow (`astro.yml`).
   - `.astro` files are HTML with a JavaScript frontmatter block. React and Vue are optional, so the learning curve is closest to "HTML plus JS" for a jQuery/Bootstrap-era developer.
   - Its personal and portfolio theme ecosystem is large and actively maintained.
   - The cost is churn: a fast major-version cadence (7.0 shipped 2026-06-22, and roughly 100 releases in the last 3 weeks across its packages). Renovate pinning helps.
2. **Hugo.** It has the biggest community and the most themes.
   - It has the most GitHub stars of any SSG-first tool (90.5k), 13 years of history and a release every couple of weeks.
   - The official gallery lists 643 themes, and the GitHub starter workflow is `hugo.yml`.
   - It ships as a single binary with no dependency tree to keep updated.
   - The costs: Go templates are the steepest learning curve here for a JS/Node developer, and the version is still 0.x (v0.170.1), though it is stable in practice.
3. **Eleventy, now "Build Awesome".** It is the simplest Node option.
   - It runs on Node, the templating (Nunjucks, Liquid or plain JS) is the most familiar to the jQuery era, the output has no client JS, and it reached 3.x stable.
   - The costs: a much smaller theme ecosystem (about 70 to 90 starters, few of them polished portfolio themes) and a smaller community (1.25M npm downloads a month). It also carries brand churn: it was renamed Build Awesome in March 2026, the repo moved to `11ty/buildawesome`, the npm package is moving to `@awesome.me/buildawesome`, and v4 is in alpha.

Jekyll is the runner-up outside the shortlist. It has the largest historical Q&A footprint and native Pages support, but it is on Ruby, has had no release since January 2025, and native Pages builds are pinned to Jekyll 3.10.

## Comparison table

Stars, release and commit figures come from `gh api repos/<o>/<r>` and `.../releases`. Downloads are npm last-month figures (2026-10-21 to 2026-11-19). SO tag is the Stack Overflow tag total, followed by questions in the last 12 months. Theme repos are GitHub repos with the theme topic, followed by those pushed in the last year.

| Generator | Runtime / templating | Latest stable (date) | Age | Stars | Downloads / mo | SO tag (last 12 mo) | Theme repos (active) | GH Pages | Look |
|---|---|---|---|---|---|---|---|---|---|
| **Astro** | Node/TS; `.astro` (HTML + JS frontmatter), optional React/Vue/Svelte | 7.4.13 (2026-11-18) | 2021 | 64.1k | 49.8M (`astro`) | 752 (8) | 306 `astro-theme` (269) + 264 `astro-template` | Official `withastro/action` + starter `astro.yml` | Personal/portfolio/landing; docs via Starlight |
| **Hugo** | Go binary; Go templates | v0.170.1 (2026-11-17) | 2013 | 90.5k | n/a (Go); `hugo-extended` npm wrapper 1.1M | 1,344 (7) | 1,709 (714); 643 in official gallery | Official guide + starter `hugo.yml` | Any; large portfolio set |
| **Eleventy / Build Awesome** | Node; Nunjucks, Liquid, Markdown, JS, WebC | 3.1.8 (2026-11-03); v4 alpha | 2017 | 20.0k | 1.25M (`@11ty/eleventy`) | 284 (4) | 67 `eleventy-starter` (28) + 87 `eleventy-template` | Official docs; no starter workflow | Minimal starters; DIY look |
| **Jekyll** | Ruby; Liquid | 4.4.1 (2025-01-29) | 2008 | 51.8k | 45.1M gem total | 6,339 (3) | 1,763 (454) | Native on Pages (pinned 3.10.0) + starters `jekyll.yml`, `jekyll-gh-pages.yml` | Blog/portfolio (Minimal Mistakes, Chirpy, academicpages) |
| **Gatsby** | Node; React + GraphQL | 5.16.1 (2026-02-10) | 2015 | 55.9k | 1.29M | 5,826 (0) | 531 `gatsby-starter` (45) | Starter `gatsby.yml` | Varied, mostly stale |
| **Next.js** (static export) | Node; React | v16.4.6 (2026-11-09) | 2016 | 143.6k | 403.7M | 41,492 (231) | n/a (app templates) | Starter `nextjs.yml` | App framework, not SSG-first |
| **Docusaurus** | Node; React/MDX | 3.10.2 (2026-07-10) | 2017 | 66.8k (now `meta/docusaurus`) | 8.56M (`@docusaurus/core`) | 515 (4) | 16 | Official docs | **Docs look** |
| **VitePress** | Node; Vue/Markdown | 1.6.4 (2025-08-05); v2.0.0-alpha.21 | 2020 | 18.5k | 8.31M | 37 (1) | 77 | Official docs | **Docs look** |
| **Hexo** | Node; EJS/Nunjucks/Pug | 8.1.2 (2026-05-06) | 2012 | 41.8k | 186k | 276 (0) | 586 (140) | Official docs | Blog-centric |
| **Zola** | Rust binary; Tera | v0.23.6 (2026-09-12) | 2016 | 17.6k | n/a | 15 | small | Community action | Blog/docs |
| Zensical (current) | Python; Material-style | v0.1.3 (2026-11-20) | 2025 | 6.2k | n/a (PyPI) | n/a | n/a | Current workflow | **Docs look** |

## Findings by criterion

### Community and Q&A footprint

- **Stack Overflow no longer measures the community.** In the last 12 months the SSG tags drew almost nothing: Jekyll 3, Hugo 7, Astro 8, Eleventy 4, Docusaurus 4, VitePress 1, Gatsby 0 and Hexo 0. The one exception is `next.js`, with 231. All-time tag totals show only historical size: Jekyll leads at 6,339, then Hugo at 1,344 and Astro at 752. ([Stack Exchange API](https://api.stackexchange.com/docs))
- **Live Q&A now happens elsewhere**: GitHub Discussions, Discord (Astro, Eleventy) and Discourse (Hugo at discourse.gohugo.io). Today the better proxies for "the Ubuntu of SSGs" are npm downloads and theme ecosystem size.
- **By npm**, Astro (49.8M a month) is about 40× Eleventy (1.25M) and about 6× Docusaurus or VitePress (around 8.3–8.6M). Hugo isn't distributed via npm, but its `hugo-extended` wrapper alone sees 1.1M a month. ([npm downloads API](https://api.npmjs.org/downloads/point/last-month/astro))
- **By GitHub stars**, among SSG-first tools: Hugo 90.5k, Docusaurus 66.8k, Astro 64.1k, Gatsby 55.9k, Jekyll 51.8k, Hexo 41.8k, Eleventy 20.0k and VitePress 18.5k.

### Maturity and maintenance

- **Astro** is on 7.x. 7.0 shipped 2026-06-22 with Vite 8 and a new Rust compiler, and minor releases follow monthly ([Astro blog](https://astro.build/blog/)). The Astro Technology Company joined Cloudflare on 2026-01-16, and Cloudflare says Astro "will remain open source, MIT-licensed… with a public roadmap and open governance" and stays deployable anywhere ([Cloudflare blog](https://blog.cloudflare.com/astro-joins-cloudflare/)). In August 2026 Matthew Phillips took over as Project Steward from Fred Schott.
- **Hugo** has released 100 stable versions since 2024-09 and is still 0.x (v0.170.1). Breaking changes do happen across minor versions, but the project is very stable in practice.
- **Eleventy** joined Font Awesome in September 2024 and was renamed **Build Awesome** in March 2026 ([build.awesome.me](https://build.awesome.me/), [11ty.dev blog](https://www.11ty.dev/blog/)). The GitHub repo `11ty/eleventy` now redirects to `11ty/buildawesome`. Stable is 3.1.8, with v4 in alpha (alpha.12 on 2026-11-19). The new site documents `npx @awesome.me/buildawesome`, while npm still publishes `@11ty/eleventy` 3.1.8. Funding comes from Font Awesome, a Build Awesome Pro Kickstarter with 838 backers, and Open Collective.
- **Jekyll** last released 4.4.1 on 2025-01-29, about 22 months ago, and has had only 28 commits in the last year. GitHub Pages' built-in builder still runs **Jekyll 3.10.0** via `github-pages` gem 232 ([pages.github.com/versions](https://pages.github.com/versions/)). To use Jekyll 4 you build with Actions.
- **Gatsby** last released 5.16.1 on 2026-02-10. It is effectively in maintenance mode, and only 45 of its 531 starters were pushed in the last year.
- **VitePress** last released stable 1.6.4 on 2025-08-05, and 2.0 has been in alpha since then (alpha.21 on 2026-10-25).
- **Docusaurus** moved to the `meta/` GitHub org. It is on 3.10.2 (2026-07-10).

### GitHub Pages deploy

GitHub's `actions/starter-workflows/pages` ships first-party starter workflows for **Astro, Gatsby, Hugo, Jekyll, Next.js, Nuxt and mdBook**, plus a generic `static.yml`. Eleventy, VitePress, Docusaurus and Hexo document their own workflows but have no GitHub starter.

- **Astro**: the official `withastro/action` plus `actions/deploy-pages`. For a custom domain, set `site` in the config and put `CNAME` in `public/` ([Astro docs](https://docs.astro.build/en/guides/deploy/github/)).
- **Hugo**: a full `hugo.yaml` workflow in the official docs, which pins Hugo, Dart Sass, Go and Node ([Hugo docs](https://gohugo.io/host-and-deploy/host-on-github-pages/)). Renovate can pin the Hugo version in the workflow.
- All of them fit the current `docs.yml` shape: `configure-pages`, then build, then `upload-pages-artifact`, with `deploy-pages` on master. Only the toolchain setup step changes, from Python to Node, or a Hugo binary download.

### Theme ecosystem (personal/portfolio look)

- **Hugo**: 643 themes in the [official gallery](https://themes.gohugo.io/) (`gohugoio/hugoThemesSiteBuilder` `themes.txt`), and 1,709 GitHub repos tagged `hugo-theme`, of which 714 were pushed in the last year. Strong portfolio options include HugoBlox (9.8k stars, formerly Wowchemy), PaperMod (14.0k stars, a blog-leaning theme) and many single-page resume themes.
- **Astro**: the official [theme catalog](https://astro.build/themes/) has a Portfolio category and mixes free and paid themes; its featured slots are all paid. On GitHub, 306 repos are tagged `astro-theme`, and 88% of them (269) were pushed in the last year, the freshest ecosystem of all. Examples: AstroWind (6.1k stars), AstroPaper (5.2k, pushed 2026-11-20) and devportfolio (5.0k).
- **Jekyll**: 1,763 `jekyll-theme` repos, 454 of them active. Strong personal and portfolio themes include Minimal Mistakes (13.6k), academicpages (17.8k) and Chirpy (10.3k). Only 13 themes are whitelisted for native Pages builds.
- **Eleventy**: about 150 starter or template repos, 28 of the `eleventy-starter` ones active, plus the official `eleventy-base-blog` (1.5k). Few are polished portfolio themes, so expect more DIY styling.
- **Docusaurus and VitePress** are built for documentation. Bending them into a personal-site look is the same problem the Site has with Zensical today.

### Learning curve for a JS/TS/Node, jQuery/Bootstrap-era developer

| | Templating | Curve |
|---|---|---|
| Eleventy | Nunjucks/Liquid (`{% for %}`, `{{ var }}`) or plain JS; plain HTML/CSS output | **Lowest** |
| Astro | `.astro` = HTML + `---` JS/TS frontmatter, JSX-like `{expr}` in markup; component model; no framework required | **Low–moderate**: the component and island concepts are new, but no React is needed |
| Jekyll | Liquid, same as Eleventy | Low templating, but Ruby/Bundler tooling |
| Hugo | Go templates (`{{ range .Pages }}`, `{{ mul $a $b }}`, dot context, pipes) ([Hugo docs](https://gohugo.io/templates/introduction/)) | **Moderate–high**: the dot-context and lookup-order rules are a known stumbling block |
| Docusaurus / Gatsby / Next.js | React (JSX, hooks); Gatsby adds GraphQL | High |
| VitePress | Vue SFCs | Moderate–high |

For light customization (colors, links, content), all three shortlisted options mostly involve editing a config file plus CSS variables or Tailwind tokens in the chosen theme. Templating only matters when a section's markup has to change.

## Excluded, and why

- **Docusaurus and VitePress**: their look is docs, which is the problem being solved. VitePress has also had no stable release in 15 months.
- **Gatsby**: declining. It needs React plus GraphQL, and its starters are stale.
- **Next.js**: an application framework, not an SSG. Its huge Q&A footprint is about apps, and it would bring React and its own conventions for a link-hub site.
- **Hexo**: a small and shrinking English-language community. It is blog-centric, with 0 Stack Overflow questions in the last year.
- **Zola**: too small a community.
- **Jekyll**: viable but on a stagnating trajectory. It is held back by Ruby, no release since January 2025, and Pages-native pinned at 3.10.

## Open questions for the grilling ticket

- Astro's major-version churn (6 and 7 both in 2026) against Hugo's 0.x minor-version breakage: which upgrade burden is more acceptable under Renovate?
- Is Go-template exposure acceptable if a Hugo theme needs almost no template edits?
- Is Eleventy's rename and v4 transition a risk, or a non-issue for a small site?
