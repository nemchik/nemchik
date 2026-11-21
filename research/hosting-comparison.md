# Free hosting platforms for the Site and its PR previews

Research for [#386](https://github.com/nemchik/nemchik/issues/386), part of map [#378](https://github.com/nemchik/nemchik/issues/378). Sources checked 2026-11-20. This builds on [#382's PR preview findings](https://github.com/nemchik/nemchik/blob/research/pr-preview-approaches/research/pr-preview-approaches.md); facts already established there are not repeated in detail.

## Question

Which free hosting platform serves the Site in production and for PR previews, and how do its deploys get automated? Hard requirements: free, and production and PR-preview deploys are both automated. Soft preference: one platform for both.

## Context

- The Site will be plain static output from Astro, Hugo or Eleventy/Build Awesome (see [#381](https://github.com/nemchik/nemchik/issues/381)). No server-side code.
- The site is personal and non-commercial, and the repo is public on a personal GitHub account.
- `nemchik.com` DNS is a Cloudflare zone. The apex is proxied through Cloudflare to GitHub Pages today. Cloudflare Web Analytics is the chosen analytics.
- Renovate opens frequent PRs from same-repo branches, and many of them get merged. Each merge is a production deploy.
- `.github/workflows/docs.yml` already builds on every `push` and `pull_request` and deploys only from `main`/`master`.

## Short answer

1. **Cloudflare now steers static sites to Workers.** The Pages docs landing page carries a notice: "Are you sure you want to use Pages? Workers supports most Pages use cases and offers a broader feature set. It is Cloudflare's primary platform for building applications. Start new projects with Workers." Pages is not deprecated. [Pages docs](https://developers.cloudflare.com/pages/)
2. **Workers static assets is free and unlimited for a static site.** "Requests to static assets are free and unlimited", and storing assets costs nothing. [Billing and limitations](https://developers.cloudflare.com/workers/static-assets/billing-and-limitations/)
3. **Worker Previews (released September 2026) fill the old Workers preview gap.** Each branch or PR gets a named Preview with its own URL. The docs ship a GitHub Actions recipe that deploys `pr-<N>`, posts the URL to the PR and deletes the Preview when the PR closes. [Previews](https://developers.cloudflare.com/workers/previews/), [examples](https://developers.cloudflare.com/workers/previews/examples/), [announcement](https://blog.cloudflare.com/worker-previews/)
4. **Netlify free is out.** A production deploy costs 15 of the 300 monthly credits, so 20 merges in a month (fewer once bandwidth is counted) use up the plan. When credits run out, every site on the account is paused. Renovate alone can do that. [How credits work](https://docs.netlify.com/manage/accounts-and-billing/billing/billing-for-credit-based-plans/how-credits-work/)
5. **Recommendation: Cloudflare Workers static assets for both production and PR previews, deployed from the existing GitHub Actions workflow with Wrangler.** The apex is attached as a Workers Custom Domain in the existing zone. One platform, one build pipeline, no new account, and no limit that a static site can realistically hit.

## Comparison

| | **Cloudflare Workers (static assets)** | **Cloudflare Pages** | **Vercel Hobby** | **Netlify Free** | **GitHub Pages + Cloudflare previews** |
|---|---|---|---|---|---|
| **One platform for prod + previews** | Yes | Yes | Yes | Yes | No (two) |
| **Cloudflare's stance** | "Primary platform … Start new projects with Workers" | Supported, not deprecated; new projects pointed to Workers | n/a | n/a | n/a |
| **Serving limits (free)** | Static asset requests free and unlimited; 20,000 files per version, 25 MiB per file | Unlimited static requests; 20,000 files, 25 MiB per file | 100 GB Fast Data Transfer, 1M CDN requests/month | 300 credits/month hard cap: bandwidth 20 credits/GB, 2 credits per 10k requests | 1 GB site, 100 GB/month soft bandwidth |
| **Deploy limits (free)** | Workers Builds: 3,000 min/month, 1 concurrent, 20 min. Actions upload: no Cloudflare build used | 500 builds/month, 1 concurrent, 20 min (Direct Upload uses none) | 100 deployments/day | Production deploy = 15 credits (about 20/month); previews 0 credits | No build limit with Actions workflows |
| **When exceeded** | Only Worker-script requests are limited (Error 1027 / 429); pure asset requests are unaffected | Builds stop until the next month | "wait until 30 days have passed before you can use the feature again" | **All sites on the account paused** ("Site not available") | "may not be able to serve your site"; Support emails first |
| **Terms for a personal site** | No usage restriction found | No usage restriction found | Hobby: "only … for your personal or non-commercial use" (undefined) | No restriction found; cost is the problem | Not for running a business or commercial SaaS; a personal site is fine |
| **Apex on Cloudflare DNS** | Native Custom Domain: Cloudflare creates DNS and the cert; needs the zone on Cloudflare (it is) | Native custom domain in the same zone | Records must be **DNS-only** (grey cloud); Vercel discourages the Cloudflare proxy | Records DNS-only; Netlify advises against proxying and prefers `www` as primary on external DNS | Works today (proxied CNAME) |
| **Build on platform vs Actions upload** | Both: Workers Builds, or `wrangler deploy` / `wrangler preview` from Actions | Both, but a one-way choice per project (Git integration or Direct Upload) | Both (Git app, or `vercel deploy --prebuilt` from Actions) | Both (Git app, or CLI deploy) | Actions `deploy-pages` (today) + Wrangler for previews |
| **Preview URL** | `pr-N-<worker>.<subdomain>.workers.dev` (or on a custom domain) | `<branch>.<project>.pages.dev` | `<project>-git-<branch>-<user>.vercel.app` | `deploy-preview-N--<site>.netlify.app` | As for Workers or Pages |
| **URL posted to PR** | Workers Builds posts a PR comment; the Actions recipe uses `gh pr comment --edit-last --create-if-none` | Cloudflare app comment + check run (Git); own step (Direct Upload) | Vercel app comment | Status + comment if notifications are on | Own step |
| **Bot (Renovate) PRs** | Work (same-repo branches get secrets) | Work; Git integration can exclude `renovate/*` | Work | Previews work; **merges cost credits** | Work |
| **Fork PRs** | Actions: no secrets, skip (docs recipe checks head repo). Builds: not documented | No preview from forks | Need owner authorization | "untrusted deploys" policy | Same as Cloudflare |
| **Cleanup** | `wrangler preview delete --name pr-N` on PR close; at 100 Previews per Worker (free) the oldest is auto-deleted | None on close; >30-day deployments deleted beyond the 100 most recent | Retention policy | Retention policy | As Cloudflare |
| **Preview noindex** | workers.dev Preview URLs send `X-Robots-Tag: noindex` | Previews send `noindex` | Preview deployments not indexed by default (not re-checked) | Not re-checked | As Cloudflare |
| **Config / lock-in** | One `wrangler.jsonc` (name, `assets.directory`, custom domain); `_headers`/`_redirects` supported | Dashboard settings or `wrangler.toml`; `_headers`/`_redirects` | `vercel.json` optional | `netlify.toml` optional | `CNAME` file |
| **Cost of moving away** | Low: static files plus a DNS change in a zone already on Cloudflare | Low | Low; DNS goes back to grey-cloud records | Low | Low |
| **New account needed** | No | No | Yes | Yes | No |

## Details

### Cloudflare Workers static assets (recommended)

**Platform direction.** The Pages docs now open with "Start new projects with Workers". The migration guide says "Unlike Pages, Workers has a distinctly broader set of features." Its compatibility matrix lists custom headers and redirects (`_headers`, `_redirects`) as supported on both. Two gaps it notes: Workers only partly supports branch deploy controls, and "Workers does not support any domain whose nameservers are not managed by Cloudflare". Neither matters here: nemchik.com's nameservers are Cloudflare's. [Migrate from Pages](https://developers.cloudflare.com/workers/static-assets/migration-guides/migrate-from-pages/)

**Free limits.**

- Static asset requests are "free and unlimited" and don't invoke the Worker script, so they don't count against the free plan's 100,000 requests/day. Only requests that run Worker code (none, for a pure static site) can hit Error 1027 or 429. [Billing and limitations](https://developers.cloudflare.com/workers/static-assets/billing-and-limitations/), [Workers limits](https://developers.cloudflare.com/workers/platform/limits/)
- Static assets: 20,000 files per Worker version, 25 MiB per file. [Workers limits](https://developers.cloudflare.com/workers/platform/limits/)
- Workers Builds (if used): 3,000 build minutes/month, 1 concurrent build, 20-minute timeout. [Builds limits](https://developers.cloudflare.com/workers/ci-cd/builds/limits-and-pricing/)
- Previews: 100 Previews per Worker and 100 deployments per Preview on Free. At the limit the oldest is deleted automatically. [Previews](https://developers.cloudflare.com/workers/previews/)

**Custom apex domain.** A Workers Custom Domain can be the apex (`example.com` with `custom_domain: true`). It needs an active zone on the account. Cloudflare "will create DNS records and issue necessary certificates on your behalf". Creating one fails while the hostname still has a CNAME, so the cutover deletes the apex's current CNAME to GitHub Pages first. That leaves a short gap, so the cutover ticket should plan for it. [Custom Domains](https://developers.cloudflare.com/workers/configuration/routing/custom-domains/)

**PR previews (Worker Previews).**

- `npx wrangler preview --name <name>` deploys a named Preview. It needs Wrangler 4.135.0 or later. URLs are `<preview-name>-<worker-name>.<subdomain>.workers.dev`, or a custom domain such as `<preview-name>.previews.example.com`. Each deploy also gets an immutable Deployment URL. workers.dev Preview URLs send `X-Robots-Tag: noindex`. Custom-domain ones don't, so Cloudflare Access is suggested for those. [Previews](https://developers.cloudflare.com/workers/previews/)
- The official GitHub Actions recipe: [examples](https://developers.cloudflare.com/workers/previews/examples/)
  - Secrets `CLOUDFLARE_API_TOKEN` (Workers Scripts edit) and `CLOUDFLARE_ACCOUNT_ID`. "Repository secrets are unavailable to forked pull requests by default", so the job checks that the head repo matches the base repo.
  - Deploy: `npx wrangler preview --name "pr-${PR_NUMBER}" --json`, then read `.preview.urls[0]` with `jq`.
  - Comment: `gh pr comment "$PR_NUMBER" --body "Preview: $PREVIEW_URL" --edit-last --create-if-none` (needs `pull-requests: write`).
  - Cleanup: on `pull_request` `closed`, `npx wrangler preview delete --name "pr-${PR_NUMBER}" --skip-confirmation`.
- Version URLs (formerly "preview URLs", `wrangler versions upload --preview-alias`) still exist, but the docs say not to use them for branch or PR testing. "For branches and pull requests, use Previews." [Version URLs](https://developers.cloudflare.com/workers/configuration/previews/)

**Two ways to automate.**

- **(A) Upload from GitHub Actions (recommended).** Keep `docs.yml` as the one build. On push to `master`, run `wrangler deploy` (e.g. via `cloudflare/wrangler-action`). On `pull_request`, run `wrangler preview --name pr-N`, then comment. On `closed`, delete the Preview. Renovate keeps the toolchain pinned in one place, Renovate PRs get previews (same-repo branches have the secrets), fork PRs are skipped, and Cloudflare build minutes are never used. Costs: an API token secret to manage, and roughly 25 to 40 lines of workflow.
- **(B) Workers Builds (Git integration).** Connect the repo in the dashboard and tick "Enable Preview Builds". "Every push to a branch that is not your production branch triggers a preview build" running the build command and then `npx wrangler preview`. "Cloudflare will automatically post a comment on the pull request with the status of the build", and "Subsequent pushes to the same branch update the same Preview URL". [Build branches](https://developers.cloudflare.com/workers/ci-cd/builds/build-branches/), [GitHub integration](https://developers.cloudflare.com/workers/ci-cd/builds/git-integration/github-integration/) This means less YAML, but a second build environment whose tool versions Renovate doesn't pin. The docs checked describe no branch filter (so no excluding `renovate/*`), no fork-PR behaviour and no cleanup on PR close; Previews then age out only at the 100-Preview limit.

**Config the repo gains.** A small `wrangler.jsonc` with the Worker name, a `compatibility_date`, `assets.directory` pointing at the generator's output, and the custom-domain route. Astro, Hugo and Eleventy all just produce that directory.

### Cloudflare Pages

Still works and is still supported. The free limits and preview behaviour are covered in #382: 500 builds/month, `<branch>.<project>.pages.dev` previews with `noindex`, no preview cleanup on PR close, and a one-way choice between Git integration and Direct Upload. Pages can exclude branches such as `renovate/*` and has full branch deploy controls, which Workers Builds lacks. The case against it is direction: Cloudflare tells new projects to use Workers, and Previews, Custom Domains and new features are landing there. Pages is the fallback if a Worker Previews problem appears during the build.

### Vercel Hobby

- Free with 100 GB Fast Data Transfer, 1M CDN requests and 100 deployments/day. When a Hobby limit is exceeded, "you will have to wait until 30 days have passed before you can use the feature again". [Hobby](https://vercel.com/docs/plans/hobby)
- Terms §4: "You shall only use the Services under a Hobby plan for your personal or non-commercial use." The terms don't define commercial use. A personal site fits, but a portfolio that advertises consulting work could be argued either way. [Terms](https://vercel.com/legal/terms)
- With Cloudflare DNS, Vercel wants the records set to DNS only. It does not recommend a reverse proxy in front of Vercel, and proxied records cause "Invalid Configuration" during cert issuance. Cloudflare's proxy features (and Cloudflare Web Analytics auto-injection on proxied hostnames) would be given up or need the JS snippet. [Cloudflare and Vercel](https://vercel.com/docs/integrations/external-platforms/cloudflare), [proxy guide](https://vercel.com/kb/guide/can-i-use-a-proxy-on-top-of-my-vercel-deployment)
- Previews and PR comments are the best out of the box (Vercel GitHub app), and fork PRs need authorization (#382). It means a new account, and Vercel's strengths (Next.js, functions) are unused here.

### Netlify Free

- 300 credits/month hard cap, with no top-up. A production deploy costs 15 credits, Deploy Previews 0, bandwidth 20 credits/GB, and requests 2 credits per 10,000. "Once your credit balance is completely used up, all of your web projects (sites/apps) are paused and visitors … will find a `Site not available` page." [How credits work](https://docs.netlify.com/manage/accounts-and-billing/billing/billing-for-credit-based-plans/how-credits-work/)
- That means at most about 20 production deploys a month before the Site goes dark, and bandwidth eats into the same pool. Renovate merges are production deploys, so this fails the "free and automated" requirement in practice. Deploying only on a schedule or by hand would work around it, but that breaks automation.
- Netlify also advises against proxying through Cloudflare and prefers `www` as the primary domain on external DNS. [Domains](https://docs.netlify.com/manage/domains/get-started-with-domains/), [support guide](https://answers.netlify.com/t/support-guide-difference-between-netlify-dns-and-external-dns/151308)

### GitHub Pages for production + Cloudflare for previews

Covered in #382 (its recommendation 2b). It still works: production stays on `deploy-pages` with no DNS change, and previews go to Cloudflare. Today the preview side would be a Worker with Previews rather than Pages Direct Upload. Next to an all-Workers setup it means two platforms, two deploy mechanisms and two domain setups. The previews also run on a different host from production, so header or redirect behaviour can differ. GitHub Pages has no `_headers`/`_redirects` equivalent. Its one advantage is zero cutover risk.

## Recommendation

**Cloudflare Workers with static assets for both production and PR previews, deployed from GitHub Actions (option A):**

- `master` push → build → `wrangler deploy` to a Worker with the `nemchik.com` apex as a Custom Domain.
- `pull_request` (same-repo, including Renovate) → build → `wrangler preview --name pr-N` → sticky PR comment with the URL.
- `pull_request` `closed` → `wrangler preview delete --name pr-N`.
- Fork PRs are skipped (no secrets). There are no outside contributors today.

Why: it meets both hard requirements and the soft preference, there's no new account, nothing a static site does can hit a free limit, the apex stays in the existing Cloudflare zone, Cloudflare names this as its recommended path, and leaving later is just static files plus a DNS change.

Choose option B (Workers Builds) instead only if zero workflow code matters more than a single pinned toolchain and cleanup on PR close. Keep Cloudflare Pages as the fallback if Worker Previews misbehaves. Rule out Netlify, because the credit cap pauses the Site under Renovate's merge volume. Vercel is viable but needs a new account, conflicts with proxying through Cloudflare, and has an undefined "non-commercial" clause.

Open points for [#384](https://github.com/nemchik/nemchik/issues/384):

- Option A or B.
- Whether Renovate PRs get previews (free either way).
- Whether previews should live on a custom subdomain (e.g. `*.preview.nemchik.com`). That loses the default `noindex`, so it would need Access or a `noindex` header.
- The cutover sequence: the apex CNAME must be deleted before the Workers Custom Domain is created, then `deploy-pages` and `docs/CNAME` are retired.

This is a recommendation, not a decision. The choice belongs to the grilling ticket ([#384](https://github.com/nemchik/nemchik/issues/384)).
