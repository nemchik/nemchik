# PR preview approaches for a GitHub Pages site

Research for [#382](https://github.com/nemchik/nemchik/issues/382), part of map [#378](https://github.com/nemchik/nemchik/issues/378). Sources checked 2026-11-20.

## Question

How can the Site (nemchik.com, GitHub Pages with a custom domain) get a PR preview for each pull request, and what does each approach cost? Production stays on GitHub Pages.

## Starting point

- `.github/workflows/docs.yml` builds on every `push` and `pull_request`, uploads with `actions/upload-pages-artifact`, and runs `actions/deploy-pages` only on pushes to `main`/`master`. The Pages source is **GitHub Actions**, not a branch.
- `docs/CNAME` holds `nemchik.com`. The repo is public and owned by a personal account.
- Renovate opens many PRs. They come from branches in this repo (not forks), so they get the same token and secrets as PRs Eric opens.

## Short answer

1. **Nothing native exists.** `actions/deploy-pages` still has a `preview` input whose description says the feature is alpha and not public. The GitHub Community request ([discussion #7730](https://github.com/orgs/community/discussions/7730)) is still open; its latest comment (2026-06-30) says "Still not available in June 2026". The `deploy-pages` issue asking for a timeline ([actions/deploy-pages#180](https://github.com/actions/deploy-pages/issues/180)) was closed without a date. No Pages changelog entry mentions previews.
2. **A `gh-pages` branch with subfolders** (`rossjrw/pr-preview-action`) is free but means leaving the Actions publishing source. Previews would also live on the production domain, under a sub-path.
3. **Cloudflare Pages for PR previews only** leaves the production pipeline as it is, serves each preview at a root URL (so no base-path problems), costs nothing at this scale, and uses an account Eric already has. **This is the recommendation.** Netlify and Vercel work too, but bring a new account, and Netlify's free plan pauses every site on it once its credits run out.

## Comparison

| | (1) `gh-pages` + `rossjrw/pr-preview-action` | (2a) Cloudflare Pages, Git integration | (2b) Cloudflare Pages, Direct Upload from Actions | (2c) Netlify | (2c) Vercel | (3) Native GitHub Pages |
|---|---|---|---|---|---|---|
| **Effect on current prod deploy** | Must switch Pages source to "Deploy from a branch"; the action says the GitHub Actions source "does not work with this action". Prod deploy moves to a branch-push action (e.g. JamesIves) with `clean-exclude: pr-preview/` | None; prod stays on `deploy-pages` | None; add a step to the existing workflow | None | None | n/a |
| **Preview URL** | `nemchik.com/pr-preview/pr-N/` (on the production domain) | `<branch>.<project>.pages.dev` + `<hash>.<project>.pages.dev` | Same as 2a (`--branch=<branch>`) | `deploy-preview-N--<site>.netlify.app` | `<project>-git-<branch>-<user>.vercel.app` | n/a |
| **Base path / assets** | Every preview needs a build with the base path set to `/pr-preview/pr-N/`; root-absolute links and assets break otherwise | Served at root; no change | Served at root | Served at root | Served at root | n/a |
| **Fork PRs** | Not supported ("does not currently support deploying previews for PRs from forks") | No preview for fork PRs | Fork PRs get no secrets, so no deploy | Governed by the "untrusted deploys" policy | Needs an owner to authorize it (Git Fork Protection) | n/a |
| **Bot (Renovate) PRs** | Work (same repo). Each one adds a commit to `gh-pages` and a Pages build (10 builds/hour soft limit for branch builds) | Work. Each one uses a build (500/month free). Branch controls can exclude `renovate/*` | Work (same-repo PRs get secrets). The workflow can skip bots with an `if:` | Work. Previews cost 0 credits | Work. 100 deployments/day | n/a |
| **Secrets** | Default `GITHUB_TOKEN` with write permission | None in GitHub (Cloudflare GitHub app) | `CLOUDFLARE_API_TOKEN` + account ID | None (Netlify app) | None (Vercel app) | n/a |
| **Cleanup on close** | Automatic on the `closed` event (workflow must listen for it) | None on close. Deployments older than 30 days are deleted unless among the 100 most recent | Same as 2a, plus an optional `wrangler pages deployment delete` step | Auto-deletion per Netlify retention | Retention per Vercel | n/a |
| **URL posted to PR** | Sticky comment (default on) | Cloudflare app posts a status comment + check run | Workflow posts its own comment | Status, plus a comment if deploy notifications are on | Comment + GitHub deployment | n/a |
| **Cost / limits (free)** | Free. Pages: 1 GB site, 100 GB/month soft | 500 builds/month, 1 concurrent, 20 min, 20,000 files | Builds run on GitHub Actions; Cloudflare only hosts | 300 credits/month hard cap; **all sites paused** when spent. Previews 0 credits, but their requests and bandwidth count | 100 GB transfer, 100 deploys/day. Hobby is for personal, non-commercial use | n/a |
| **Maintenance** | Medium: rendered HTML in a branch, branch history grows, prod/preview deploys can overwrite each other, base-path handling for each generator, previews are public and indexable on the prod domain | Low: one dashboard setup, and the build settings live in Cloudflare | Low to medium: about 15 workflow lines plus a secret to rotate | Low, plus a new account and the risk of everything pausing | Low, plus a new account | n/a |

## Details

### (3) Native GitHub Pages: not available

- `actions/deploy-pages` `action.yml` defines `preview` (default `false`): "Is this attempting to deploy a pull request as a GitHub Pages preview site?", and notes the feature is alpha and not public. [source](https://github.com/actions/deploy-pages/blob/main/action.yml)
- GitHub's publishing-source docs say a workflow's deploy step "is skipped if the workflow was triggered by a pull request"; there is still one source per site. [source](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site)
- Discussion #7730 remains open; the most recent comments (2026-02 and 2026-06) say it is still unavailable. [source](https://github.com/orgs/community/discussions/7730)
- The rossjrw maintainer and contributors explain why the Actions/artifact model can't host previews: each `deploy-pages` deploy is atomic and replaces the whole site, so a preview subfolder would be wiped by the next production deploy. [rossjrw/pr-preview-action#21](https://github.com/rossjrw/pr-preview-action/issues/21)

If GitHub ships this, it would be the obvious choice. Nothing suggests it is close.

### (1) `gh-pages` branch with subfolders (`rossjrw/pr-preview-action`, v1.8.2, 2026-10-27)

Setup ([README](https://github.com/rossjrw/pr-preview-action)):

1. Set Pages to "Deploy from a branch" (`gh-pages`, root). Set workflow permissions to read and write.
2. Replace `upload-pages-artifact` + `deploy-pages` with a branch-push deploy for production (e.g. `JamesIves/github-pages-deploy-action` with `clean-exclude: pr-preview/` and `force: false`). Otherwise each production deploy deletes the previews.
3. Add a PR workflow on `opened, reopened, synchronize, closed` that builds with the preview base path and runs the action. Use one concurrency group per PR.
4. `CNAME` must be written into the `gh-pages` root by the production deploy.

Things to watch:

- **Base path.** The preview is served from `/pr-preview/pr-N/`. Each generator needs its base or prefix option set for the preview build (Hugo `--baseURL`, Astro `base`, Eleventy `pathPrefix`, Next `basePath`). Hard-coded root-absolute links such as `/img/x.png` break.
- **Custom domain.** Previews appear at `nemchik.com/pr-preview/…`, publicly and on the production origin. Search engines can index them unless the preview build adds `noindex`. Using a custom domain for preview URLs was a long-standing issue in the action ([#12](https://github.com/rossjrw/pr-preview-action/issues/12), now closed).
- **Forks.** Unsupported ([#3](https://github.com/rossjrw/pr-preview-action/issues/3), [#54](https://github.com/rossjrw/pr-preview-action/issues/54) open).
- **Timing.** `wait-for-pages-deployment` defaults to `false`, so the comment can appear before the preview is live.
- **Renovate.** Each Renovate PR push commits to `gh-pages` and triggers a branch-based Pages build. Builds from a branch have a 10/hour soft limit; that limit does not apply to custom Actions workflows. [Pages limits](https://docs.github.com/en/pages/getting-started-with-github-pages/github-pages-limits)
- **Cost.** Free.
- **Downside.** It reverses the move to Actions-based publishing and puts rendered HTML back into a branch.

### (2) Third-party preview host, production unchanged

The current workflow already builds on `pull_request` and only gates the deploy step, so a preview host slots in beside it.

#### (2a) Cloudflare Pages with Git integration (recommended)

- Setup: Cloudflare dashboard → create a Pages project → connect the GitHub repo → set the build command and output directory (and the Node/Python version through an environment variable). Turn off automatic production deployments in branch controls, or let the prod branch deploy to `*.pages.dev` as a harmless duplicate. Optionally exclude `renovate/*` to save builds.
- "Every time you open a new pull request … Cloudflare Pages will create a unique preview URL", and build status appears as GitHub check runs. Fork PRs get none: "preview URL will not be created for pull requests created from forks". [GitHub integration](https://developers.cloudflare.com/pages/configuration/git-integration/github-integration/)
- URLs: `<hash>.<project>.pages.dev` for each deployment, plus a branch alias `<branch>.<project>.pages.dev`. Previews send `X-Robots-Tag: noindex` by default and can be put behind Cloudflare Access. [Preview deployments](https://developers.cloudflare.com/pages/configuration/preview-deployments/)
- Cleanup: nothing happens on PR close. Deployments older than 30 days are deleted automatically, except the 100 most recent and the current production deployment; `wrangler pages deployment delete` deletes one by hand.
- Free limits: 500 builds/month, 1 concurrent, 20 min timeout, 20,000 files, 25 MiB per file. [Limits](https://developers.cloudflare.com/pages/platform/limits/)
- The Cloudflare GitHub app (shared by Workers and Pages) posts the build status and preview URLs as a PR comment. [Workers GitHub integration](https://developers.cloudflare.com/workers/ci-cd/builds/git-integration/github-integration/)
- Caveat: the build runs on Cloudflare's build image, separate from the GitHub Actions build, so the two can drift (tool versions are pinned in two places). A Git-integrated project cannot later become Direct Upload, and the reverse is also true: "If you choose Direct Upload, you cannot switch to Git integration later." [Direct Upload](https://developers.cloudflare.com/pages/get-started/direct-upload/)

#### (2b) Cloudflare Pages with Direct Upload from the existing workflow

- Add `cloudflare/wrangler-action` (or `npx wrangler pages deploy site --branch=<head_ref>`) to the existing job when `github.event_name == 'pull_request'`, plus a comment step (e.g. a sticky-comment action) that posts the URL.
- One build pipeline (GitHub Actions) for both prod and preview, with the same tool versions and Renovate pinning.
- Needs `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID` secrets. Renovate PRs come from same-repo branches, so they get the secrets. Fork PRs do not, so the step must skip on forks.
- The 500 builds/month limit doesn't apply, because builds run on Actions. Cloudflare's GitHub app is not needed.

#### Cloudflare Workers (static assets) instead of Pages

Workers also supports preview URLs (`<preview>.<domain>`, configured through a `previews` block in Wrangler), and Workers Builds gives 3,000 build minutes/month free. [Migration guide](https://developers.cloudflare.com/workers/static-assets/migration-guides/migrate-from-pages/), [Builds limits](https://developers.cloudflare.com/workers/ci-cd/builds/limits-and-pricing/). The docs checked don't say Pages is deprecated. For a static site that only needs previews, Pages is less to configure.

#### (2c) Netlify

- Previews at `deploy-preview-N--<site>.netlify.app`, with a status on the PR and a comment if deploy notifications are on. Fork PRs follow the "untrusted deploys" policy. [Deploy Previews](https://docs.netlify.com/deploy/deploy-types/deploy-previews/)
- Credit pricing: production deploys cost 15 credits; Deploy Previews and branch deploys cost 0, but requests and bandwidth to them count. The free plan has a hard cap of 300 credits/month, with no top-up. "Once your credit balance is completely used up, all of your web projects … are paused." [How credits work](https://docs.netlify.com/manage/accounts-and-billing/billing/billing-for-credit-based-plans/how-credits-work/)
- Workable for previews only, but it means a new account and a pause risk that Cloudflare doesn't have.

#### (2c) Vercel

- Vercel's GitHub app comments on each PR with the preview URL, and fork PRs need authorization. Hobby allows 100 deployments/day and 100 GB transfer. [Vercel for GitHub](https://vercel.com/docs/git/vercel-for-github), [Hobby](https://vercel.com/docs/plans/hobby)
- Works, but means a new account. It suits Next.js best, and nothing here needs that.

## Recommendation

**Cloudflare Pages for PR previews, production unchanged on GitHub Pages via `deploy-pages`.** Then choose between:

- **2a Git integration**: least work; Cloudflare posts the comment and status. Costs a second build environment.
- **2b Direct Upload from `docs.yml`**: one build pipeline that Renovate keeps pinned; needs an API token secret and a comment step.

Prefer **2b** if keeping one pinned toolchain matters, and **2a** if no extra workflow code matters more. Either way, decide whether Renovate PRs get previews. Leaving them in costs nothing at this scale (Git integration: one build each against 500/month; Direct Upload: no Cloudflare build at all), and it shows that a dependency bump didn't break the Site.

Avoid option 1 unless staying entirely on GitHub matters more than the rest. It undoes the Actions-based publishing, puts previews on the production domain, and makes every generator handle a sub-path.

This is a recommendation, not a decision. The choice belongs to the grilling ticket ([#384](https://github.com/nemchik/nemchik/issues/384)).
