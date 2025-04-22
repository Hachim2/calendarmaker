import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        main: 'var(--main)',
        overlay: 'var(--overlay)',
        bg: 'var(--bg)',
        bw: 'var(--bw)',
        blank: 'var(--blank)',
        text: 'var(--text)',
        mtext: 'var(--mtext)',
        border: 'var(--border)',
        ring: 'var(--ring)',
        ringOffset: 'var(--ring-offset)',
        
        secondaryBlack: '#212121',
        
        // Icon background colors - Light mode
        iconBg: {
          home: '#e6f7ff',            // Blue
          dashboard: '#e6fffb',       // Teal
          blog: '#f0f5ff',            // Light blue
          browser: '#fff7e6',         // Yellow-ish
          pricing: '#fff2e8',         // Orange
          docs: '#f6ffed',            // Green
          github: '#f9f0ff',          // Purple
          theme: '#fff1f0',           // Red
        },
        // Icon colors - Light mode
        iconColor: {
          home: '#0050b3',            // Blue
          dashboard: '#006d75',       // Teal
          blog: '#1d39c4',            // Blue
          browser: '#d48806',         // Yellow-gold
          pricing: '#d4380d',         // Orange
          docs: '#237804',            // Green
          github: '#531dab',          // Purple
          theme: '#a8071a',           // Red
        },
        // Icon background colors - Dark mode
        darkIconBg: {
          home: '#111d2c',            // Dark blue
          dashboard: '#112123',       // Dark teal
          blog: '#131629',            // Dark blue
          browser: '#1d1b16',         // Dark yellow
          pricing: '#2b1611',         // Dark orange
          docs: '#121619',            // Dark green
          github: '#120338',          // Dark purple
          theme: '#2a1215',           // Dark red
        },
        // Icon colors - Dark mode
        darkIconColor: {
          home: '#69c0ff',            // Light blue
          dashboard: '#5cdbd3',       // Light teal
          blog: '#85a5ff',            // Light blue
          browser: '#ffec3d',         // Bright yellow
          pricing: '#ff7a45',         // Light orange
          docs: '#95de64',            // Light green
          github: '#b37feb',          // Light purple
          theme: '#ff7875',           // Light red
        },
      },
      borderRadius: {
        base: '6px'
      },
      borderWidth: {
        '6': '6px',
      },
      boxShadow: {
        shadow: 'var(--shadow)'
      },
      translate: {
        boxShadowX: '6px',
        boxShadowY: '6px',
        reverseBoxShadowX: '-6px',
        reverseBoxShadowY: '-6px',
      },
      fontWeight: {
        base: '500',
        heading: '700',
      },
    },
  },
  plugins: [],
  sidebar: {
    DEFAULT: 'hsl(var(--sidebar-background))',
    foreground: 'hsl(var(--sidebar-foreground))',
    primary: 'hsl(var(--sidebar-primary))',
    'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
    accent: 'hsl(var(--sidebar-accent))',
    'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
    border: 'hsl(var(--sidebar-border))',
    ring: 'hsl(var(--sidebar-ring))',
  },
} satisfies Config;