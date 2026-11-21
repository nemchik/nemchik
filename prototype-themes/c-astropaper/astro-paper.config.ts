// PROTOTYPE (nemchik/nemchik#387): AstroPaper config, refilled with Eric's content.
import { defineAstroPaperConfig } from "./src/types/config";

export default defineAstroPaperConfig({
  site: {
    url: "https://nemchik.com/",
    title: "Eric Nemchik",
    description: "Solution Architect, Software Developer, and DevOps Engineer with a passion for automation.",
    author: "Eric Nemchik",
    profile: "https://nemchik.com",
    ogImage: "default-og.jpg",
    lang: "en",
    timezone: "America/New_York",
    dir: "ltr",
  },
  posts: {
    perPage: 4,
    perIndex: 4,
  },
  features: {
    lightAndDarkMode: true,
    dynamicOgImage: true,
    showArchives: false,
    showBackButton: true,
    editPost: {
      enabled: true,
      url: "https://github.com/satnaing/astro-paper/edit/main/",
    },
    search: false,
    toc: true,
  },
  socials: [
    { name: "github",   url: "https://github.com/nemchik" },
    { name: "bluesky",  url: "https://bsky.app/profile/nemchik.com" },
    { name: "mastodon", url: "https://mastodon.linuxserver.io/@ixnyne" },
    { name: "linkedin", url: "https://www.linkedin.com/in/nemchik/" },
    { name: "mail",     url: "mailto:eric@nemchik.com" },
  ],
  shareLinks: [
    { name: "whatsapp", url: "https://wa.me/?text=" },
    { name: "facebook", url: "https://www.facebook.com/sharer.php?u=" },
    { name: "x",        url: "https://x.com/intent/post?url=" },
    { name: "telegram", url: "https://t.me/share/url?url=" },
    { name: "pinterest", url: "https://pinterest.com/pin/create/button/?url=" },
    { name: "mail",     url: "mailto:?subject=See%20this%20post&body=" },
  ],
});