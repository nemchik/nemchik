# Survey: the 50 most-starred Profile README repos

Research for [#379](https://github.com/nemchik/nemchik/issues/379), part of the map [#378](https://github.com/nemchik/nemchik/issues/378).
Data gathered 2026-11-20 from the GitHub API and by fetching every embedded image URL.

## Question

What do the 50 most-starred GitHub Profile README repos (`user/user`) look like, and which patterns fit a short Profile README that points to a separate Site?

## Answer in brief

- **Short and long are both common; the short ones age best.** The median README is 62 lines and about 120 words of prose. 9 of 50 are 20 lines or fewer; 10 exceed 150 lines. The heavy ones (DenverCoder1, trinib, Carol42, anshumanjadiya1102, milaan9) carry most of the breakage.
- **Breakage is widespread.** 20 of 50 READMEs have at least one image that no longer loads (18 confirmed; 2 are slow or bot-blocking hosts that likely fail on GitHub too). Separately, 18 of the 23 READMEs that use shields.io badges have at least one badge whose logo has silently disappeared, mostly LinkedIn (12 badges) and Twitter (6).
- **What breaks is third-party or self-hosted services, never committed files.** Dead hosts: Glitch (`visitor-badge.glitch.me`, `profile-counter.glitch.me`), Cyclic (`*.cyclic.app`), personal Vercel deployments returning HTTP 402 (Vercel's "payment required", a paused deployment), personal API domains that lapsed, and Twitter avatar URLs. Even the public `github-profile-trophy.vercel.app` and `github-contributor-stats.vercel.app` now return 402. Images committed to the repo (or a gist) all still load. One Action-generated SVG (ChrisTitusTech's `github-metrics.svg`) is a valid image whose content reads "API error: 403", because the workflow's token stopped working.
- **Stats, trophy and streak cards are a minority habit.** 17 of 50 use at least one. The public `github-readme-stats.vercel.app` instance works today (8 READMEs use it); 7 READMEs run their own Vercel forks; the trophy public instance is dead.
- **Linking out to a personal site is common, mostly through a linked header image.** 23 of 50 link to the owner's own site. The cleanest pattern: the top banner or card is the link (adamalston, anuraghazra, MartinHeinz, WaylonWalker, mattpocock, guilyx). Others use a "Website" shields badge (codeSTACKr, anmol098, MacroPower), the name in the H1 (mayhemantt, ashleymavericks), plain prose (sindresorhus, halfrost) or an Action-updated "latest posts" list (simonw, ouuan, khalby786, mmphego).
- **Dark/light handling is rare: 8 of 50.** Six use `<picture>` with `<source media="(prefers-color-scheme: dark)">` (Andrew6rant, adamalston, mattpocock, terkelg, ouuan, ChrisTitusTech); two use the older `#gh-dark-mode-only` / `#gh-light-mode-only` URL fragments (codeSTACKr, trinib). The rest rely on images that look acceptable on both themes, or pick a dark theme and leave light-mode viewers to cope.
- **Best fit for "a short card that points to the Site":** one `<picture>` light/dark image committed to the repo, wrapped in a link to the Site, plus at most a line of text or a short row of links. adamalston/adamalston is almost exactly this.

## Method

GitHub search cannot filter on "repo name equals owner login", so a strict top 50 by stars is not attainable. The sample was built like this:

1. Collected candidates from:
   - GitHub repo search across the topics `github-profile-readme`, `profile-readme`, `readme-profile`, `github-profile`, `profile`, `about-me`, `portfolio`, `readme` and `config-files` (stars > 50, up to 500 results each), keeping only repos whose name equals the owner.
   - Every GitHub username linked from five curated lists: [abhisheknaiidu/awesome-github-profile-readme](https://github.com/abhisheknaiidu/awesome-github-profile-readme), [coderjojo/creative-profile-readme](https://github.com/coderjojo/creative-profile-readme), [kautukkundan/Awesome-Profile-README-templates](https://github.com/kautukkundan/Awesome-Profile-README-templates), [EddieHubCommunity/awesome-github-profiles](https://github.com/EddieHubCommunity/awesome-github-profiles) and [durgeshsamariya/awesome-github-profile-readme-templates](https://github.com/durgeshsamariya/awesome-github-profile-readme-templates).
   - About 80 well-known developers, checked by hand.
2. Looked up `owner/owner` for all ~600 candidate logins through the GraphQL API (`stargazerCount`, owner type).
3. Dropped organisation-owned repos (for example `simple-icons/simple-icons` and `vercel/vercel`), which are projects, not Profile READMEs. Kept the 50 most-starred user-owned ones (2,699 down to 199 stars).
4. Fetched each README raw (`GET /repos/{o}/{o}/readme` with `Accept: application/vnd.github.raw`) and extracted every image URL: Markdown images, `<img src>`, `<source srcset>` and reference-style image links. Relative paths were resolved against `raw.githubusercontent.com/{o}/{o}/HEAD/`.
5. Requested all 1,152 distinct image URLs with `curl -L` (browser user agent, 30 to 45 s timeout) and recorded status and content type. An image counts as broken if it does not return 200 with an `image/*` type, or if the returned SVG is an error card. Shields.io badges with `logo=` were checked for a missing `<image>` element (the logo silently dropped).
6. Confirmed with GitHub's own renderer (`Accept: application/vnd.github.html`) that `github.com/.../blob/...` image URLs are rewritten to `/raw/` and therefore work, so they are not counted as broken.

**Bias and caveats.** The sample over-represents the showcase style that curated lists favour (many cards, GIFs) and under-represents famous developers whose profile repo is modest; a handful of those were added by hand (karpathy, mattpocock, wesbos, ThePrimeagen, simonw, sindresorhus). Some well-starred `user/user` repos outside the lists and topics will be missing. Curl results are a proxy for GitHub's image proxy (camo), which has a shorter timeout, so slow hosts such as `metrics.lecoq.io` fail on GitHub too. Shields badges containing raw emoji or HTML entities returned "badge not found" to curl but may work in a browser, so they were left out of the counts. URLs inside HTML comments were counted (a few dead ones are commented out).

## Length and structure

| Measure | Median | Q1 | Q3 | Max |
|---|---:|---:|---:|---:|
| Lines | 62 | 32 | 129 | 703 |
| Prose words (markup stripped) | 123 | 36 | 231 | 2,973 |
| Images | 12.5 | 5.5 | 31 | 134 |
| Headings | 3 | 1 | 6 | 17 |

Typical section order in the longer READMEs: greeting or hero banner, a one-paragraph intro or "about me" bullet list (currently working on, learning, ask me about), a tech-stack row (devicons or skillicons icons, or shields badges), stats cards, social and contact badges, auto-updated lists (blog posts, releases, WakaTime), then a visitor counter in the footer.

Four READMEs have no images at all: karpathy (one line: "I like deep neural nets."), mscoutermarsh (a stargazer list), wesbos (the repo is the source of his website and the README documents that) and ThePrimeagen (a heading, one paragraph and a bullet list of links).

Other notable structures: games played through Issues and Actions (timburgan's chess, marcizhu, rossjrw's Royal Game of Ur, JonathanGin52); a single generated "terminal" or neofetch-style card (Andrew6rant, guilyx); a three-column table of auto-updated releases, blog posts and TILs (simonw).

## Badges, cards and dynamic images

Number of the 50 READMEs using each element:

| Element | READMEs | Notes |
|---|---:|---|
| shields.io badges | 23 | 18 of them have at least one logo-less badge today |
| GitHub-hosted images (committed, gist, attachments) | 37 | all load |
| Action-updated content (`<!-- ...START -->` markers) | 20 | blog feeds, WakaTime, releases, games |
| Visitor counters | 13 | Glitch-hosted ones are all dead; `komarev.com` works |
| GIFs | 17 | |
| github-readme-stats, public instance | 8 | works today |
| github-readme-stats, self-hosted forks | 7 | mostly work; `github-contributor-stats.vercel.app` returns 402 |
| Streak stats | 9 | `streak-stats.demolab.com` (the maintainer's instance) works |
| Trophy | 7 | public `github-profile-trophy.vercel.app` returns 402; one fork returns 404 |
| lowlighter/metrics | 7 | committed and gist outputs load; hosted `metrics.lecoq.io` returned 500 or timed out |
| Now playing (Spotify, Last.fm) | 7 | 3 of the self-hosted ones are dead (402, 500, no DNS) |
| Dark/light handling | 8 | see below |

### Who hosts the dynamic cards

- **Public instance someone else runs:** `github-readme-stats.vercel.app`, `streak-stats.demolab.com`, `readme-typing-svg.demolab.com`, `capsule-render.vercel.app`, `komarev.com`, `skillicons.dev`, shields.io. All of these worked on the day of the survey. Dead ones: `github-profile-trophy.vercel.app` (402), `github-contributor-stats.vercel.app` (402), `techstack-generator.vercel.app` (402), and anything on Glitch or Cyclic.
- **Self-hosted (the owner's own Vercel or domain):** DenverCoder1, trinib, ouuan, Carol42, KasRoudra and halfrost run forks of the stats, trophy and streak projects; natemoo-re, andyruwruw, terkelg and novatorem run bespoke APIs. Of these, natemoo-re (`status.nmoo.dev`, 402), andyruwruw (`readme.andyruwruw.com`, no response), Carol42 (Spotify card 500, trophy 402), KasRoudra (trophy fork 404) and trinib (quotes card returns JSON) are broken. This supports the map's "no self-hosted services" rule.
- **Generated by a GitHub Action and committed (to the repo, a branch or a gist):** Andrew6rant (light/dark SVG), lowlighter (gist SVGs), Carol42 and trinib (contribution snake on an `output` branch), anshumanjadiya1102 (3D contribution graph), ChrisTitusTech (metrics SVG), and simonw, ouuan, khalby786 and mmphego (Markdown text between markers). All load, because GitHub serves them; the failure mode is silent staleness (ChrisTitusTech's SVG renders "API error: 403").
- **Static, hand-made and committed:** adamalston (two SVG cards, no workflow at all), sindresorhus (GIFs), BrunnerLivio, anuraghazra and MartinHeinz (header PNGs). Nothing here can break short of deleting the file.

## Links to a personal site

23 of 50 link to their own site (not counting social networks, employers and project pages). How:

| Pattern | Examples |
|---|---|
| The header banner or card is the link | adamalston, anuraghazra, MartinHeinz, WaylonWalker, guilyx, mattpocock, KasRoudra |
| Image "button" | terkelg ("visit my website" SVG), BrunnerLivio ("Visit my personal website" with a globe GIF) |
| Shields "Website" badge | codeSTACKr (`img.shields.io/website`, a live up/down badge), anmol098, MacroPower |
| Name in the H1 | mayhemantt, ashleymavericks |
| Plain prose or a list line | sindresorhus, halfrost, ChrisTitusTech |
| Auto-updated "latest posts" list | simonw, ouuan, khalby786, mmphego |

## Dark and light mode

- `<picture>` with `<source media="(prefers-color-scheme: dark)" srcset="...">` and a fallback `<img>`: Andrew6rant, adamalston, mattpocock, terkelg, ouuan, ChrisTitusTech. This is the method [GitHub documents](https://docs.github.com/en/get-started/writing-on-github/getting-started-with-writing-and-formatting-on-github/basic-writing-and-formatting-syntax#specifying-the-theme-an-image-is-shown-to) for theme-specific images.
- `#gh-dark-mode-only` / `#gh-light-mode-only` URL fragments: codeSTACKr, trinib. This is the older approach; GitHub's docs now describe only `<picture>`.
- 42 of 50 do nothing. Typical results: dark-themed stats cards on a white page, and transparent PNG logos that vanish on a dark background.

## Standout short examples worth copying

1. **[adamalston/adamalston](https://github.com/adamalston/adamalston)**: 18 lines. One `<picture>` with committed light and dark SVG cards, the whole thing wrapped in a link to adamalston.com. No services, no workflow, nothing to break. The closest match to "a short card that points to the Site".
2. **[mattpocock/mattpocock](https://github.com/mattpocock/mattpocock)**: 10 lines. One light/dark banner (`<picture>`) linking to his main site. The images live on Cloudinary rather than in the repo.
3. **[Andrew6rant/Andrew6rant](https://github.com/Andrew6rant/Andrew6rant)**: 7 lines. A light/dark neofetch-style SVG, regenerated by an Action and committed. Clever, but it adds a workflow and a token to maintain.
4. **[anuraghazra/anuraghazra](https://github.com/anuraghazra/anuraghazra)**: 45 lines. A linked header image to his site, a short intro, then a few pinned-repo cards. The header-as-link idea is worth copying; the cards are not.
5. **[sindresorhus/sindresorhus](https://github.com/sindresorhus/sindresorhus)**: 27 lines of retro GIFs, all committed, with one line pointing to his site and latest blog post. Shows how far personality can go with zero services.
6. **[ThePrimeagen/ThePrimeagen](https://github.com/ThePrimeagen/ThePrimeagen)**: 19 lines, no images. One paragraph plus a bullet list of where to find him. Proof that a text-only card works.
7. **[guilyx/guilyx](https://github.com/guilyx/guilyx)**: 15 lines. A committed hero GIF that links to the site, then one row of uniformly styled shields badges (dark label, one accent colour). Its LinkedIn badge has already lost its logo.
8. **[simonw/simonw](https://github.com/simonw/simonw)**: 61 lines. One sentence pointing to the blog, then an Action-updated three-column table. Useful if the Profile README should surface recent Site content, at the cost of a workflow.
9. **[terkelg/terkelg](https://github.com/terkelg/terkelg)**: every element is a themed SVG served from his own domain, with a `<picture>` per element and a "visit my website" button at the top. Copy the look, not the hosting: it is a self-hosted service.

## Implications for this repo

- The breakage the map already lists (Simple Icons logo removals, a dead self-hosted trophy card) is the common case across the most-starred profiles, not bad luck.
- Images committed to the repo and rendered by GitHub were the only category with zero failures. Static content beats any card service, public or self-hosted.
- If shields badges stay, assume brand logos can disappear without notice. A badge with no logo still renders, but looks broken.
- `<picture>` with `prefers-color-scheme` is the documented way to theme an image; only 6 of 50 use it.

## Per-repo results

"Broken images" counts URLs that failed as described in Method. "Logo-less badges" counts shields badges whose requested logo no longer renders.

| # | Repo | Stars | Lines | Images | Broken images | Logo-less badges | Dark/light | Links to own site |
|---|---|---:|---:|---:|---:|---:|---|---|
| 1 | [rafaballerini/rafaballerini](https://github.com/rafaballerini/rafaballerini) | 2699 | 27 | 13 |  | 1 |  |  |
| 2 | [codeSTACKr/codeSTACKr](https://github.com/codeSTACKr/codeSTACKr) | 1239 | 119 | 33 |  | 1 | `#gh-*-mode-only` | badge + light/dark globe icon |
| 3 | [timburgan/timburgan](https://github.com/timburgan/timburgan) | 1195 | 71 | 8 |  |  |  |  |
| 4 | [Andrew6rant/Andrew6rant](https://github.com/Andrew6rant/Andrew6rant) | 1006 | 7 | 2 |  |  | `<picture>` |  |
| 5 | [elidianaandrade/elidianaandrade](https://github.com/elidianaandrade/elidianaandrade) | 882 | 32 | 7 |  | 2 |  |  |
| 6 | [novatorem/novatorem](https://github.com/novatorem/novatorem) | 763 | 11 | 4 |  | 1 |  |  |
| 7 | [DenverCoder1/DenverCoder1](https://github.com/DenverCoder1/DenverCoder1) | 748 | 286 | 130 | 4 | 6 |  |  |
| 8 | [mattpocock/mattpocock](https://github.com/mattpocock/mattpocock) | 727 | 10 | 2 |  |  | `<picture>` | whole banner links to product site |
| 9 | [anmol098/anmol098](https://github.com/anmol098/anmol098) | 695 | 235 | 18 | 1 | 1 |  | badge |
| 10 | [ChrisTitusTech/ChrisTitusTech](https://github.com/ChrisTitusTech/ChrisTitusTech) | 631 | 48 | 19 | 1 | 1 | `<picture>` | plain list line |
| 11 | [guilyx/guilyx](https://github.com/guilyx/guilyx) | 571 | 15 | 7 |  | 1 |  | hero GIF links to site + badge |
| 12 | [wesbos/wesbos](https://github.com/wesbos/wesbos) | 564 | 10 | 0 |  |  |  |  |
| 13 | [thmsgbrt/thmsgbrt](https://github.com/thmsgbrt/thmsgbrt) | 541 | 88 | 49 | 2 | 4 |  |  |
| 14 | [trinib/trinib](https://github.com/trinib/trinib) | 516 | 519 | 76 | 1 |  | `#gh-*-mode-only` |  |
| 15 | [sindresorhus/sindresorhus](https://github.com/sindresorhus/sindresorhus) | 504 | 27 | 14 |  |  |  | inline prose |
| 16 | [natemoo-re/natemoo-re](https://github.com/natemoo-re/natemoo-re) | 486 | 41 | 4 | 4 |  |  |  |
| 17 | [abhisheknaiidu/abhisheknaiidu](https://github.com/abhisheknaiidu/abhisheknaiidu) | 452 | 32 | 2 |  |  |  |  |
| 18 | [simonw/simonw](https://github.com/simonw/simonw) | 448 | 61 | 1 |  |  |  | prose + auto-updated blog feed |
| 19 | [MartinHeinz/MartinHeinz](https://github.com/MartinHeinz/MartinHeinz) | 443 | 83 | 24 |  |  |  | header image + prose |
| 20 | [Carol42/Carol42](https://github.com/Carol42/Carol42) | 416 | 198 | 65 | 6 | 2 |  |  |
| 21 | [anuraghazra/anuraghazra](https://github.com/anuraghazra/anuraghazra) | 387 | 46 | 12 |  |  |  | header image |
| 22 | [mscoutermarsh/mscoutermarsh](https://github.com/mscoutermarsh/mscoutermarsh) | 385 | 5 | 0 |  |  |  |  |
| 23 | [KasRoudra/KasRoudra](https://github.com/KasRoudra/KasRoudra) | 349 | 147 | 40 | 1 | 1 |  | linked header |
| 24 | [mmphego/mmphego](https://github.com/mmphego/mmphego) | 333 | 53 | 12 |  |  |  | auto-updated blog list |
| 25 | [ashleymavericks/ashleymavericks](https://github.com/ashleymavericks/ashleymavericks) | 295 | 76 | 78 | 1 | 1 |  | name in H1 |
| 26 | [andyruwruw/andyruwruw](https://github.com/andyruwruw/andyruwruw) | 292 | 54 | 8 | 4 |  |  |  |
| 27 | [iampavangandhi/iampavangandhi](https://github.com/iampavangandhi/iampavangandhi) | 275 | 99 | 20 |  | 2 |  |  |
| 28 | [Thaiane/Thaiane](https://github.com/Thaiane/Thaiane) | 271 | 30 | 8 | 1 | 1 |  |  |
| 29 | [ouuan/ouuan](https://github.com/ouuan/ouuan) | 269 | 234 | 23 |  |  | `<picture>` | auto-updated blog list |
| 30 | [ThePrimeagen/ThePrimeagen](https://github.com/ThePrimeagen/ThePrimeagen) | 268 | 19 | 0 |  |  |  |  |
| 31 | [Raymo111/Raymo111](https://github.com/Raymo111/Raymo111) | 266 | 130 | 11 | 1 |  |  | intro GIF alt/title |
| 32 | [mayhemantt/mayhemantt](https://github.com/mayhemantt/mayhemantt) | 265 | 129 | 31 | 2 | 1 |  | name in H1 |
| 33 | [gautamkrishnar/gautamkrishnar](https://github.com/gautamkrishnar/gautamkrishnar) | 263 | 319 | 56 | 2 |  |  |  |
| 34 | [adamalston/adamalston](https://github.com/adamalston/adamalston) | 259 | 18 | 2 |  |  | `<picture>` | whole card links to site |
| 35 | [terkelg/terkelg](https://github.com/terkelg/terkelg) | 258 | 34 | 13 |  |  | `<picture>` | "visit my website" button image |
| 36 | [JonathanGin52/JonathanGin52](https://github.com/JonathanGin52/JonathanGin52) | 256 | 50 | 8 |  | 2 |  |  |
| 37 | [Ridermansb/ridermansb](https://github.com/Ridermansb/ridermansb) | 254 | 49 | 15 |  |  |  |  |
| 38 | [marcizhu/marcizhu](https://github.com/marcizhu/marcizhu) | 245 | 76 | 9 |  |  |  |  |
| 39 | [lowlighter/lowlighter](https://github.com/lowlighter/lowlighter) | 244 | 36 | 6 |  |  |  |  |
| 40 | [MacroPower/MacroPower](https://github.com/MacroPower/MacroPower) | 224 | 100 | 15 |  |  |  | shields website badge + blog link |
| 41 | [anshumanjadiya1102/anshumanjadiya1102](https://github.com/anshumanjadiya1102/anshumanjadiya1102) | 222 | 703 | 134 | 21 |  |  | icon link |
| 42 | [BrunnerLivio/brunnerlivio](https://github.com/BrunnerLivio/brunnerlivio) | 217 | 77 | 14 |  |  |  | "Visit my personal website" table cell |
| 43 | [WaylonWalker/WaylonWalker](https://github.com/WaylonWalker/WaylonWalker) | 216 | 127 | 19 | 8 |  |  | header banner |
| 44 | [halfrost/halfrost](https://github.com/halfrost/halfrost) | 213 | 156 | 35 | 2 |  |  | prose bullet |
| 45 | [eddiejaoude/eddiejaoude](https://github.com/eddiejaoude/eddiejaoude) | 212 | 72 | 9 |  | 1 |  |  |
| 46 | [rossjrw/rossjrw](https://github.com/rossjrw/rossjrw) | 204 | 367 | 32 | 7 |  |  |  |
| 47 | [khalby786/khalby786](https://github.com/khalby786/khalby786) | 202 | 62 | 2 | 1 |  |  | auto-updated blog list |
| 48 | [karpathy/karpathy](https://github.com/karpathy/karpathy) | 201 | 2 | 0 |  |  |  |  |
| 49 | [milaan9/milaan9](https://github.com/milaan9/milaan9) | 200 | 157 | 90 | 2 | 8 |  |  |
| 50 | [CyrisXD/CyrisXD](https://github.com/CyrisXD/CyrisXD) | 199 | 48 | 7 |  |  |  |  |

## Sources

- GitHub REST API: [Get a repository README](https://docs.github.com/en/rest/repos/contents#get-a-repository-readme), [Search repositories](https://docs.github.com/en/rest/search/search#search-repositories); GraphQL [`repository`](https://docs.github.com/en/graphql/reference/queries#repository) for star counts and owner type.
- GitHub Docs: [Managing your profile README](https://docs.github.com/en/account-and-profile/setting-up-and-managing-your-github-profile/customizing-your-profile/managing-your-profile-readme); [Specifying the theme an image is shown to](https://docs.github.com/en/get-started/writing-on-github/getting-started-with-writing-and-formatting-on-github/basic-writing-and-formatting-syntax#specifying-the-theme-an-image-is-shown-to).
- Each README and image URL listed above, fetched 2026-11-20.
