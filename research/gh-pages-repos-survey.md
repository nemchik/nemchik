# Survey: top-starred repos published to GitHub Pages

Research for nemchik/nemchik#380 (map #378). Collected 2026-11-20.

## Question

Among the 50 most-starred repos that publish a website to GitHub Pages (favor personal/portfolio/landing sites over pure docs sites where the sample allows), which static site generators, themes, deploy methods and PR preview setups do they use? What does the distribution say about community size and real-world stability?

## Method

- **Pool**: `gh search repos "github.io in:name" --sort stars --limit 150`. Repos named `<owner>.github.io` are the conventional home of user and org sites, so this pool favors personal and landing sites over the docs sites of big projects, which usually live elsewhere.
- **Filters**: dropped archived repos, repos where `GET /repos/{o}/{r}/pages` returns 404 (no Pages site), and three spam, mirror or moved sites (`z-libraryopp`, `vpnfast`, `koolshare`). The top 50 survivors by stars are the **main sample** (ranks 1-53 of the pool, 1,471 to 17,834 stars).
- **Personal-site supplement**: the main sample holds only 15 personal sites or personal-site templates, so the next 15 personal sites in the same pool (ranks 54-141, 622 to 1,413 stars) are listed separately.
- **Evidence per repo** (all primary, via the GitHub API):
  - `GET /repos/{o}/{r}/pages` for `build_type` (`legacy` = built from a branch, `workflow` = Actions with `actions/deploy-pages`), `cname` and the source branch and path.
  - Root config files: `_config.yml`, `Gemfile`, `Gemfile.lock`, `package.json`, `hugo.*`, `mkdocs.yml`, `astro.config.*`, `docusaurus.config.*`, `gatsby-config.js`, and the `<meta name="generator">` tag where only built output is committed.
  - Every file in `.github/workflows/`.
  - `GET /repos/{o}/{r}/environments`, plus `GET /deployments?environment=Preview` where an environment hints at a preview host. Hosted-preview GitHub Apps such as Vercel and Netlify leave no file in the repo, so this check catches them.
- **Versions**: a `legacy` build ignores the repo's `Gemfile` and runs whatever GitHub Pages pins. Today that is **Jekyll 3.10.0** (`github-pages` gem 232, Ruby 3.3.4), per <https://pages.github.com/versions.json>. Where a legacy repo's `Gemfile` asks for Jekyll 4, the table gives the version that actually builds.

Categories: **P** personal, portfolio or blog; **T** personal-site template; **L** project or product landing site; **D** docs, book, course or reference; **A** web app or tool; **O** organization page.

## Main sample (top 50)

| # | Repo | Stars | Cat | Generator (version) | Theme / starter | Deploy | Custom domain | PR previews |
|---|------|------:|-----|---------------------|-----------------|--------|---------------|-------------|
| 1 | [academicpages/academicpages.github.io](https://github.com/academicpages/academicpages.github.io) | 17,834 | T | Jekyll 4.4.1 (`Gemfile`) | Academic Pages (detached fork of Minimal Mistakes) | Actions `deploy-pages` (`jekyll.yml`) | - | none |
| 2 | [mml-book/mml-book.github.io](https://github.com/mml-book/mml-book.github.io) | 16,238 | D | Jekyll 3.10.0 (legacy) | `jekyll-theme-modernist` (GitHub-supported theme) | legacy branch | - | none |
| 3 | [GTFOBins/GTFOBins.github.io](https://github.com/GTFOBins/GTFOBins.github.io) | 13,885 | D | Jekyll 3.10.0 (`github-pages` 232, built in Actions) | custom layouts | Actions `deploy-pages` | gtfobins.org | none (PR CI only) |
| 4 | [haoel/haoel.github.io](https://github.com/haoel/haoel.github.io) | 13,083 | D | Jekyll 3.10.0 (legacy, README only) | `jekyll-theme-cayman` | legacy branch | - | none |
| 5 | [cs231n/cs231n.github.io](https://github.com/cs231n/cs231n.github.io) | 11,124 | D | Jekyll 3.10.0 (legacy; lockfile says 4.2.0) | custom | legacy branch | - | none |
| 6 | [RayTracing/raytracing.github.io](https://github.com/RayTracing/raytracing.github.io) | 10,755 | D | hand-written HTML (Markdeep) | - | legacy branch (`release`) | - | none |
| 7 | [Huxpro/huxpro.github.io](https://github.com/Huxpro/huxpro.github.io) | 7,625 | P | Jekyll 3.10.0 (legacy; `Gemfile` asks ~> 4.0), Grunt for Less | own (Hux Blog, widely forked) | legacy branch | - | none |
| 8 | [missing-semester-cn/missing-semester-cn.github.io](https://github.com/missing-semester-cn/missing-semester-cn.github.io) | 7,481 | D | Jekyll 3.10.0 (`github-pages` 232) | custom (port of MIT Missing Semester) | legacy branch | - (CNAME file, none in API) | none |
| 9 | [WebStackPage/WebStackPage.github.io](https://github.com/WebStackPage/WebStackPage.github.io) | 7,368 | A | hand-written HTML | WebStack | legacy branch | webstack.cc | none |
| 10 | [covid19india/covid19india.github.io](https://github.com/covid19india/covid19india.github.io) | 6,796 | A | Create React App (`react-scripts`) | - | Actions + `JamesIves/github-pages-deploy-action` to `gh-pages` | - | Vercel app, stale (last 2020-05) |
| 11 | [LSPosed/LSPosed.github.io](https://github.com/LSPosed/LSPosed.github.io) | 6,370 | L | Jekyll 3.10.0 (legacy) | `jekyll-theme-slate` | legacy branch | lsposed.org | none |
| 12 | [gustavoguanabara/gustavoguanabara.github.io](https://github.com/gustavoguanabara/gustavoguanabara.github.io) | 4,731 | P | Jekyll 3.10.0 (legacy, README only, no config) | default | legacy branch | - | none |
| 13 | [LLMBook-zh/LLMBook-zh.github.io](https://github.com/LLMBook-zh/LLMBook-zh.github.io) | 4,635 | D | Jekyll 3.10.0 (legacy, README only) | default | legacy branch | - | none |
| 14 | [nerfies/nerfies.github.io](https://github.com/nerfies/nerfies.github.io) | 4,445 | L | hand-written HTML + Bulma | Nerfies (widely reused research-project page) | legacy branch | - | none |
| 15 | [vivek9patel/vivek9patel.github.io](https://github.com/vivek9patel/vivek9patel.github.io) | 4,322 | P | Next.js 13 (`next export`) + Tailwind 3 | own (Ubuntu desktop simulation) | Actions + `JamesIves/github-pages-deploy-action` to `gh-pages` | - | **Vercel app, active** (Preview deployments up to 2026-11-12) |
| 16 | [bootflat/bootflat.github.io](https://github.com/bootflat/bootflat.github.io) | 4,204 | L | hand-written HTML + Bootstrap 3 (Grunt) | Bootflat | legacy branch | - | none |
| 17 | [tmallfe/tmallfe.github.io](https://github.com/tmallfe/tmallfe.github.io) | 3,898 | O | Jekyll 3.10.0 (legacy; lockfile says 3.1.2) | custom | legacy branch | - | none |
| 18 | [jonbarron/jonbarron.github.io](https://github.com/jonbarron/jonbarron.github.io) | 3,725 | P | hand-written HTML | own (widely copied academic homepage) | legacy branch | jonbarron.info | none |
| 19 | [varHarrie/varharrie.github.io](https://github.com/varHarrie/varharrie.github.io) | 3,671 | P | Vite 4 + React 18 + Tailwind 3 | own (blog from GitHub issues) | built output committed by hand to `master` (source on `v2`) | harrie.site | none |
| 20 | [dirtycow/dirtycow.github.io](https://github.com/dirtycow/dirtycow.github.io) | 3,470 | L | hand-written HTML + Bootstrap | - | legacy branch | dirtycow.ninja | none |
| 21 | [msys2/msys2.github.io](https://github.com/msys2/msys2.github.io) | 3,347 | L | Zensical (reads `mkdocs.yml`) | Material for MkDocs config | Actions `deploy-pages` (PRs build; deploy is guarded off PRs) | www.msys2.org | none (PR build only) |
| 22 | [qiubaiying/qiubaiying.github.io](https://github.com/qiubaiying/qiubaiying.github.io) | 3,309 | P | Jekyll 3.10.0 (legacy) | Hux Blog fork | legacy branch | - | none |
| 23 | [handong1587/handong1587.github.io](https://github.com/handong1587/handong1587.github.io) | 3,133 | P | Jekyll 3.10.0 (legacy) | custom | legacy branch | - | none |
| 24 | [RayeRen/acad-homepage.github.io](https://github.com/RayeRen/acad-homepage.github.io) | 2,996 | T | Jekyll 3.10.0 (legacy; lockfile `github-pages` 215) | AcadHomepage (influenced by Minimal Mistakes) | legacy branch | - | none |
| 25 | [ephtracy/ephtracy.github.io](https://github.com/ephtracy/ephtracy.github.io) | 2,927 | L | hand-written HTML + Bootstrap/jQuery | - | legacy branch | - | none |
| 26 | [microsoft/microsoft.github.io](https://github.com/microsoft/microsoft.github.io) | 2,626 | O | hand-written HTML | - | legacy branch | - | none |
| 27 | [RootMyTV/RootMyTV.github.io](https://github.com/RootMyTV/RootMyTV.github.io) | 2,537 | L | hand-written HTML | - | legacy branch | rootmy.tv | none |
| 28 | [Terminus2049/Terminus2049.github.io](https://github.com/Terminus2049/Terminus2049.github.io) | 2,462 | D | Jekyll 3.10.0 (legacy) | custom | legacy branch | - | none |
| 29 | [opencsapp/opencsapp.github.io](https://github.com/opencsapp/opencsapp.github.io) | 2,343 | D | MkDocs + Material | Material for MkDocs | Actions running `mkdocs gh-deploy` to `gh-pages` | opencs.app | none |
| 30 | [fullstack-hy2020/fullstack-hy2020.github.io](https://github.com/fullstack-hy2020/fullstack-hy2020.github.io) | 2,254 | D | Gatsby 2 | `gatsby-starter-default` | Actions + `enriikke/gatsby-gh-pages-action` (from `source` to `master`) | fullstackopen.com | none |
| 31 | [godbasin/godbasin.github.io](https://github.com/godbasin/godbasin.github.io) | 2,173 | P | Hexo 6.3.0 (built output only, per generator meta) | likely NexT (page markup) | built locally and pushed | - | none |
| 32 | [praat/praat.github.io](https://github.com/praat/praat.github.io) | 2,034 | L | hand-written HTML in `/docs` | - | legacy branch, `/docs` | praat.org | none |
| 33 | [karpathy/karpathy.github.io](https://github.com/karpathy/karpathy.github.io) | 1,980 | P | Jekyll 3.10.0 (legacy) | minimal custom | legacy branch | - | none |
| 34 | [Gaohaoyang/gaohaoyang.github.io](https://github.com/Gaohaoyang/gaohaoyang.github.io) | 1,929 | P | Jekyll 3.10.0 (legacy) | own ("Cool Concise" theme) | legacy branch | - | none |
| 35 | [lib-pku/lib-pku.github.io](https://github.com/lib-pku/lib-pku.github.io) | 1,929 | D | hand-written HTML | - | legacy branch | - | none |
| 36 | [download-directory/download-directory.github.io](https://github.com/download-directory/download-directory.github.io) | 1,912 | A | Parcel 2 | - | Actions + `crazy-max/ghaction-github-pages` to `gh-pages` | - | Vercel app, stale (last 2022-03) |
| 37 | [sanogueralorenzo/sanogueralorenzo.github.io](https://github.com/sanogueralorenzo/sanogueralorenzo.github.io) | 1,782 | P | Eleventy 3.1 (`site/package.json`) | own | Actions `deploy-pages` | - | none |
| 38 | [WADComs/WADComs.github.io](https://github.com/WADComs/WADComs.github.io) | 1,747 | D | Jekyll 3.10.0 (legacy; lockfile says 4.2.0) | custom (GTFOBins-style) | legacy branch | - | none |
| 39 | [localdesktop/localdesktop.github.io](https://github.com/localdesktop/localdesktop.github.io) | 1,726 | L | Docusaurus 3.7.0 | Docusaurus default | Actions `deploy-pages` | - | none |
| 40 | [cloud-fs/cloud-fs.github.io](https://github.com/cloud-fs/cloud-fs.github.io) | 1,706 | L | hand-written HTML + Bootstrap 5 | - | legacy branch (`gh-pages`) | www.clouddrive2.com | none |
| 41 | [learning-rust/learning-rust.github.io](https://github.com/learning-rust/learning-rust.github.io) | 1,660 | D | Hugo (built locally into `docs/`; version hidden) | custom (`E25DX`) | Actions `deploy-pages` uploads the committed `docs/` | - | none |
| 42 | [mzlogin/mzlogin.github.io](https://github.com/mzlogin/mzlogin.github.io) | 1,658 | P | Jekyll 3.10.0 (legacy, `github-pages` gem) | own (widely forked) | legacy branch (its old Actions deploy is disabled as `ci.yml~`) | mazhuang.org | none |
| 43 | [DataScienceSpecialization/DataScienceSpecialization.github.io](https://github.com/DataScienceSpecialization/DataScienceSpecialization.github.io) | 1,657 | D | Jekyll 3.10.0 (legacy) | custom | legacy branch | - | none |
| 44 | [arethetypeswrong/arethetypeswrong.github.io](https://github.com/arethetypeswrong/arethetypeswrong.github.io) | 1,612 | A | Vite 4 (pnpm monorepo, `packages/web`) | - | Actions `deploy-pages` | - | none |
| 45 | [DustinWin/dustinwin.github.io](https://github.com/DustinWin/dustinwin.github.io) | 1,591 | D | Jekyll (built in Actions) | **Chirpy 7.6 gem** | Actions `deploy-pages` (Chirpy starter workflow) | proxy-tutorials.dustinwin.cc.cd | none |
| 46 | [varadbhogayata/varadbhogayata.github.io](https://github.com/varadbhogayata/varadbhogayata.github.io) | 1,544 | P | hand-written HTML + Bootstrap | - | legacy branch | - | none |
| 47 | [plfa/plfa.github.io](https://github.com/plfa/plfa.github.io) | 1,528 | D | Jekyll + Agda/Haskell preprocessing | custom | Actions + `JamesIves/github-pages-deploy-action` to `web` | - | none (PR CI only) |
| 48 | [fossasia/fossasia.github.io](https://github.com/fossasia/fossasia.github.io) | 1,521 | O | hand-written HTML | - | legacy branch | - | none |
| 49 | [termux/termux.github.io](https://github.com/termux/termux.github.io) | 1,518 | L | Jekyll 3.10.0 (legacy) | `remote_theme: pages-themes/primer@v0.6.0` | legacy branch | termux.dev | none |
| 50 | [raft/raft.github.io](https://github.com/raft/raft.github.io) | 1,471 | L | hand-written HTML + Bootstrap | - | legacy branch | - | none |

## Personal-site supplement (next 15 personal sites in the pool)

| Repo | Stars | Generator (version) | Theme | Deploy | Custom domain | PR previews |
|------|------:|---------------------|-------|--------|---------------|-------------|
| [leopardpan/leopardpan.github.io](https://github.com/leopardpan/leopardpan.github.io) | 1,413 | Jekyll 3.10.0 (legacy; lockfile 3.8.5) | own | legacy | - | none |
| [rajaprerak/rajaprerak.github.io](https://github.com/rajaprerak/rajaprerak.github.io) | 1,211 | hand-written HTML + Bootstrap/jQuery | - | legacy | - | none |
| [ConardLi/ConardLi.github.io](https://github.com/ConardLi/ConardLi.github.io) | 1,159 | Hexo 6.2 | Chic | legacy (`hexo deploy` script) | - | none |
| [Ovilia/ovilia.github.io](https://github.com/Ovilia/ovilia.github.io) | 1,067 | Vue 2 + webpack 4 (custom) | own | legacy | zhangwenli.com | none |
| [konmik/konmik.github.io](https://github.com/konmik/konmik.github.io) | 977 | Hugo 0.128.2 (built output committed) | - | legacy | konmik.com | none |
| [Jocs/jocs.github.io](https://github.com/Jocs/jocs.github.io) | 966 | **Astro 5.15** + Tailwind 3 | own | Actions `withastro/action@v2` + `deploy-pages` | www.jocs.me | none |
| [mojombo/mojombo.github.io](https://github.com/mojombo/mojombo.github.io) | 945 | Jekyll 3.10.0 (legacy; lockfile `github-pages` 102) | own | legacy | tom.preston-werner.com | none |
| [bchiang7/bchiang7.github.io](https://github.com/bchiang7/bchiang7.github.io) | 850 | Jekyll + Gulp | own | legacy | - | none |
| [GuangLun2000/GuangLun2000.github.io](https://github.com/GuangLun2000/GuangLun2000.github.io) | 781 | Jekyll 3.10.0 (legacy) | Minimal Mistakes-based (repo description) | legacy | caihanlin.com | none |
| [lilianweng/lilianweng.github.io](https://github.com/lilianweng/lilianweng.github.io) | 778 | Hugo 0.163.3 (built output committed) | PaperMod | legacy | - | none |
| [CntChen/cntchen.github.io](https://github.com/CntChen/cntchen.github.io) | 730 | Hexo 3 | NexT | legacy (output branch) | - | none |
| [csinva/csinva.github.io](https://github.com/csinva/csinva.github.io) | 622 | Jekyll 3.10.0 (legacy) | custom | legacy | csinva.io | none |
| [chemdemo/chemdemo.github.io](https://github.com/chemdemo/chemdemo.github.io) | 1,000 | hand-written HTML | - | legacy | www.dmyang.me | none |
| [dmego/home.github.io](https://github.com/dmego/home.github.io) | 947 | hand-written HTML | - | legacy (`gh-pages`; Actions only refresh assets) | i.dmego.cn | none |
| [kuitos/kuitos.github.io](https://github.com/kuitos/kuitos.github.io) | 1,111 | React 15 + webpack 1 (blog from GitHub issues) | own | legacy | - | none |

## Distribution

### Main sample (n = 50)

| Dimension | Breakdown |
|-----------|-----------|
| Category | Docs/book/course/reference 16 · Project/product landing 12 · Personal 13 + personal templates 2 = **15** · Web app/tool 4 · Org 3 |
| Generator | **Jekyll 23** · hand-written HTML 15 · JS app bundlers (CRA, Next, Vite x2, Parcel) 5 · JS SSGs (Gatsby, Eleventy, Docusaurus, Hexo) 4 · Python (MkDocs, Zensical) 2 · Hugo 1 |
| Pages `build_type` | **legacy 42** · workflow 8 |
| How the site reaches Pages | GitHub builds a branch itself (Jekyll or raw HTML) 34 · Actions `deploy-pages` 8 · Actions pushes built output to a branch (`JamesIves` x3, `mkdocs gh-deploy`, Gatsby action, `crazy-max`) 6 · built locally and pushed by hand 2 |
| Theme | Own, custom or forked theme ~30 · none (raw HTML) ~12 · GitHub-supported gem theme (`modernist`, `cayman`, `slate`, `primer`) 4 · maintained third-party theme pulled as a package (Chirpy gem, Material for MkDocs x2) 3 |
| Custom domain | 15 of 50 |
| PR previews | **1 active** (Vercel GitHub App on vivek9patel) · 2 stale Vercel setups (last used 2020 and 2022) · 0 using a workflow, Netlify, Cloudflare or Surge |

### All personal sites (main 15 + supplement 15 = 30)

Jekyll 14 · hand-written HTML 5 · custom JS app (React, Vue, Next, Vite) 4 · Hexo 3 · Hugo 2 · Astro 1 · Eleventy 1. Only 3 of 30 deploy with `deploy-pages` (academicpages, sanogueralorenzo, Jocs), and 1 of 30 has PR previews.

## What it says

1. **Stars measure age, not current choice.** Most of these repos date from 2013-2018, when Jekyll was the only generator GitHub Pages built for you. Jekyll's 23/50 (14/30 among personal sites) is a large installed base and Q&A footprint, but it is not where new sites start. The sites in the sample that were set up or rebuilt recently use Astro 5 (Jocs), Eleventy 3 (sanogueralorenzo), Next (vivek9patel), Docusaurus 3 (localdesktop) and Zensical (msys2).
2. **Stability means "frozen".** 42 of 50 still use the legacy branch builder, which pins Jekyll 3.10.0 and ignores the repo's `Gemfile` ([versions.json](https://pages.github.com/versions.json)). Huxpro asks for Jekyll `~> 4.0`, and cs231n and WADComs lock 4.2.0, yet all three build with 3.10.0. Sites from 2014 still serve with no maintenance at all. That is real stability, but on a toolchain GitHub has stopped moving forward, which makes legacy Jekyll a poor base for a new build.
3. **`deploy-pages` is the modern default but still a minority.** All 8 `workflow` repos use `actions/upload-pages-artifact` + `actions/deploy-pages`. They cover every generator family: Jekyll 4 / Chirpy, Zensical, Eleventy, Docusaurus, Hugo, Vite and Astro (`withastro/action`). Pushing built output to a `gh-pages` branch with `JamesIves/github-pages-deploy-action` is the older pattern still in use (3 repos).
4. **PR previews are almost nonexistent on GitHub Pages.** Only 1 of 65 surveyed sites has working previews, through the Vercel GitHub App, which needs no config file. Two more have abandoned Vercel previews. GitHub has no public preview feature: `actions/deploy-pages` has a `preview` input, but its own description says it is "only in alpha currently and is not available to the public" ([action.yml](https://github.com/actions/deploy-pages/blob/main/action.yml), v5.0.1). msys2 shows the cheap middle ground: build on every PR so it can't break, but deploy only from `main`. Previews for the Site will have to come from a third-party host. The sample offers no community pattern to copy beyond "connect the Vercel app".
5. **Maintained themes consumed as packages are rare.** Most sites fork a theme into the repo (Hux Blog, Minimal Mistakes forks such as academicpages and AcadHomepage) and never take upstream fixes. academicpages' README admits that syncing a customized fork brings merge conflicts. Only DustinWin (Chirpy gem 7.6), termux (`pages-themes/primer` remote theme) and the two Material for MkDocs sites pull a theme as a versioned dependency. That is the model the map's "start from a maintained theme and customize lightly" goal needs.
6. **Docs-site share.** In this pool 16/50 are docs, books or courses and 12/50 are project landing pages, most of them built with Jekyll or raw HTML. Material for MkDocs and Zensical appear only on docs or landing sites (msys2, opencsapp), never on a personal site.
7. **Gotcha seen in the sample.** vivek9patel's workflow runs on `pull_request` and its deploy step has no event guard. A same-repo PR would overwrite production, and a fork PR fails at deploy. Any setup that builds on PRs needs a guard like msys2's `if:` on the deploy job.

## Caveats

- The pool covers only repos named `*.github.io`. Large docs sites published from project repos (for example under `/docs`) and personal sites in repos with other names are out of scope, so this is "top-starred `*.github.io` Pages sites", not every Pages site.
- Where only built output is committed (godbasin, konmik, lilianweng, CntChen), the generator is read from `<meta name="generator">` or page markup. Theme names in those rows are inferred from markup.
- PR preview detection covers workflows, root config files (`netlify.toml`, `vercel.json`, `wrangler.toml`) and deployment environments. A host that posts only commit statuses and creates no environment could be missed.
- Raw data and scripts are not committed. Every value above comes from the API endpoints and files named in the Method section and can be re-fetched with `gh`.
