import { themes as prismThemes } from 'prism-react-renderer';
import type { Config } from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

const config: Config = {
  title: 'Nusantara',
  tagline: 'Dokumentasi Programmer Nusantara',
  favicon: 'img/favicon.ico',

  future: {
    v4: true,
  },

  url: 'https://programmernusantara.github.io',
  baseUrl: '/nusantara/',

  organizationName: 'programmernusantara',
  projectName: 'nusantara',
  deploymentBranch: 'gh-pages',

  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',

  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      'classic',
      {
        docs: {
          routeBasePath: '/', // ⬅️ Docs jadi halaman utama
          sidebarPath: './sidebars.ts',
          editUrl: 'https://github.com/programmernusantara/nusantara/tree/main/',
        },

        blog: false, // ⬅️ Blog dimatikan

        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    image: 'img/docusaurus-social-card.jpg',

    colorMode: {
      respectPrefersColorScheme: true,
    },

    navbar: {
      title: 'Nusantara',
      logo: {
        alt: 'Nusantara Logo',
        src: 'img/logo.svg',
      },
      items: [
        {
          type: 'docSidebar',
          sidebarId: 'tutorialSidebar',
          position: 'left',
          label: 'Dokumentasi',
        },
        {
          href: 'https://github.com/programmernusantara/nusantara',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },

    footer: {
      style: 'dark',
      links: [
        {
          title: 'Docs',
          items: [
            {
              label: 'Dokumentasi',
              to: '/',
            },
          ],
        },
        {
          title: 'Community',
          items: [
            {
              label: 'Discord',
              href: 'https://discordapp.com/invite/docusaurus',
            },
          ],
        },
        {
          title: 'Support',
          items: [
            {
              label: 'Saweria',
              href: 'https://saweria.co/sinautech',
            },
          ],
        },
        {
          title: 'Media',
          items: [
            {
              label: 'YouTube',
              href: 'https://www.youtube.com/@wildanfq',
            },
          ],
        },
      ],
    },

    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
