// PROTOTYPE (nemchik/nemchik#387): Dante's site config, refilled with Eric's content.
import avatar from '../assets/images/avatar.jpg';
import type { SiteConfig } from '../types';

const siteConfig: SiteConfig = {
    website: 'https://nemchik.com',
    avatar: {
        src: avatar,
        alt: 'Eric Nemchik'
    },
    title: 'Eric Nemchik',
    subtitle: 'Solution Architect · Developer · DevOps',
    description: 'Solution Architect, Software Developer, and DevOps Engineer with a passion for automation.',
    headerNavLinks: [
        { text: 'Home', href: '/' },
        { text: 'Projects', href: '/projects' },
        { text: 'About', href: '/about' },
        { text: 'Contact', href: '/contact' }
    ],
    footerNavLinks: [
        { text: 'About', href: '/about' },
        { text: 'Contact', href: '/contact' },
        { text: 'AbuseIPDB', href: '#' }
    ],
    socialLinks: [
        { text: 'GitHub', href: 'https://github.com/nemchik' },
        { text: 'Bluesky', href: 'https://bsky.app/profile/nemchik.com' },
        { text: 'Mastodon', href: 'https://mastodon.linuxserver.io/@ixnyne' },
        { text: 'LinkedIn', href: 'https://linkedin.com/in/nemchik' }
    ],
    hero: {
        title: "Hi, I'm Eric Nemchik.",
        text: "I'm a **Solution Architect, Software Developer, and DevOps Engineer** with a passion for automation.\n\nI build integrations and automation: NetSuite and SuiteScript, Docker images, CI pipelines, and the glue between them. I maintain [DockSTARTer](https://github.com/GhostWriters/DockSTARTer) and help out on several [LinuxServer.io](https://github.com/linuxserver) projects.",
        actions: [
            { text: 'Get in Touch', href: '/contact' },
            { text: 'GitHub', href: 'https://github.com/nemchik' }
        ]
    },
    subscribe: {
        enabled: false,
        title: '',
        text: '',
        form: { action: '#' }
    },
    postsPerPage: 8,
    projectsPerPage: 8
};

export default siteConfig;
