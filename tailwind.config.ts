import type {Config} from 'tailwindcss';

export default {
  darkMode: ['class'],
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        body: ['Inter', 'sans-serif'],
        headline: ['"Space Grotesk"', 'sans-serif'],
        code: ['monospace'],
        merriweather: ['Merriweather', 'serif'],
        lora: ['Lora', 'serif'],
        'playfair-display': ['"Playfair Display"', 'serif'],
        'eb-garamond': ['"EB Garamond"', 'serif'],
        'cormorant-garamond': ['"Cormorant Garamond"', 'serif'],
        'libre-baskerville': ['"Libre Baskerville"', 'serif'],
        arvo: ['Arvo', 'serif'],
        'pt-serif': ['"PT Serif"', 'serif'],
        cardo: ['Cardo', 'serif'],
        'old-standard-tt': ['"Old Standard TT"', 'serif'],
        raleway: ['Raleway', 'sans-serif'],
        lato: ['Lato', 'sans-serif'],
        'noto-serif': ['"Noto Serif"', 'serif'],
        'source-serif-pro': ['"Source Serif Pro"', 'serif'],
        'roboto-slab': ['"Roboto Slab"', 'serif'],
        orbitron: ['Orbitron', 'sans-serif'],
        'roboto-mono': ['"Roboto Mono"', 'monospace'],
        electrolize: ['Electrolize', 'sans-serif'],
        'nova-square': ['"Nova Square"', 'sans-serif'],
        audiowide: ['Audiowide', 'sans-serif'],
        bungee: ['Bungee', 'sans-serif'],
        'chakra-petch': ['"Chakra Petch"', 'sans-serif'],
        'cutive-mono': ['"Cutive Mono"', 'monospace'],
        'fira-mono': ['"Fira Mono"', 'monospace'],
        gruppo: ['Gruppo', 'sans-serif'],
        'share-tech-mono': ['"Share Tech Mono"', 'monospace'],
        syncopate: ['Syncopate', 'sans-serif'],
        'major-mono-display': ['"Major Mono Display"', 'monospace'],
        megrim: ['Megrim', 'sans-serif'],
        'turret-road': ['"Turret Road"', 'sans-serif'],
        vt323: ['VT323', 'monospace'],
        tomorrow: ['Tomorrow', 'sans-serif'],
        'russo-one': ['"Russo One"', 'sans-serif'],
        roboto: ['Roboto', 'sans-serif'],
        'roboto-condensed': ['"Roboto Condensed"', 'sans-serif'],
        'roboto-serif': ['"Roboto Serif"', 'serif'],
        'zilla-slab': ['"Zilla Slab"', 'serif'],
        rokkitt: ['Rokkitt', 'serif'],
        'josefin-slab': ['"Josefin Slab"', 'serif'],
        'patua-one': ['"Patua One"', 'serif'],
        'crete-round': ['"Crete Round"', 'serif'],
      },
      colors: {
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        chart: {
          '1': 'hsl(var(--chart-1))',
          '2': 'hsl(var(--chart-2))',
          '3': 'hsl(var(--chart-3))',
          '4': 'hsl(var(--chart-4))',
          '5': 'hsl(var(--chart-5))',
        },
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
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      keyframes: {
        'accordion-down': {
          from: {
            height: '0',
          },
          to: {
            height: 'var(--radix-accordion-content-height)',
          },
        },
        'accordion-up': {
          from: {
            height: 'var(--radix-accordion-content-height)',
          },
          to: {
            height: '0',
          },
        },
        'text-fade-in-down': {
          '0%': {
            opacity: '0',
            transform: 'translateY(-10px)'
          },
          '100%': {
            opacity: '1',
            transform: 'translateY(0)'
          }
        },
        'fly-in-from-left': {
          '0%': {
            transform: 'translateX(-100%)',
            opacity: '0',
          },
          '100%': {
            transform: 'translateX(0)',
            opacity: '1',
          },
        },
        'fly-in-from-right': {
          '0%': {
            transform: 'translateX(100%)',
            opacity: '0',
          },
          '100%': {
            transform: 'translateX(0)',
            opacity: '1',
          },
        },
        'fly-out-to-left': {
          'from': { transform: 'translateX(0)', opacity: '1' },
          'to': { transform: 'translateX(-100%)', opacity: '0' },
        },
        'fly-out-to-right': {
          'from': { transform: 'translateX(0)', opacity: '1' },
          'to': { transform: 'translateX(100%)', opacity: '0' },
        },
        'zoom-in-out': {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.05)' },
        },
        'fade-in-up': {
          '0%': {
            opacity: '0',
            transform: 'translateY(20px)'
          },
          '100%': {
            opacity: '1',
            transform: 'translateY(0)'
          }
        },
        'background-pan': {
          '0%': { 'background-position': '0% 50%' },
          '50%': { 'background-position': '100% 50%' },
          '100%': { 'background-position': '0% 50%' },
        },
        'draw-line': {
          'from': { height: '0%' },
          'to': { height: '100%' },
        },
        'logo-in': {
            '0%': { transform: 'scale(0) rotate(-180deg)', opacity: '0' },
            '80%': { transform: 'scale(1.2) rotate(10deg)'},
            '100%': { transform: 'scale(1) rotate(0deg)', opacity: '1' },
        },
        'scale-in-diag': {
            '0%': { transform: 'scale(0)', opacity: '0' },
            '100%': { transform: 'scale(1)', opacity: '1' },
        },
        'thumb-scale-out': {
          '0%': {
            transform: 'translate(0px, 0px) scale(1)',
            opacity: '1',
          },
          '99%': {
            transform: 'translate(20px, 80px) scale(4)',
            opacity: '1',
          },
          '100%': {
            transform: 'translate(20px, 80px) scale(4)',
            opacity: '0',
          },
        },
        'wiggle': {
          '0%, 85%': { transform: 'rotate(0) scale(1)' },
          '87%': { transform: 'scale(1.5)' },
          '89%': { transform: 'rotate(12deg) scale(1.5)' },
          '92%': { transform: 'rotate(-12deg) scale(1.5)' },
          '95%': { transform: 'rotate(6deg) scale(1.5)' },
          '98%': { transform: 'rotate(0) scale(1.5)' },
          '100%': { transform: 'rotate(0) scale(1)' },
        },
        'logo-sm-squeeze': {
          '0%, 100%': { transform: 'translateX(0)' },
          '37.5%, 62.5%': { transform: 'translateX(0.07em)' },
        },
        'logo-rt-squeeze': {
          '0%, 100%': { transform: 'translateX(0)' },
          '37.5%, 62.5%': { transform: 'translateX(-0.07em)' },
        },
        'logo-a-pop': {
          '0%, 100%': { transform: 'scale(1, 1.4) translateY(-0.17em)' },
          '37.5%': { transform: 'scale(0.5, 1.4) translateY(-0.17em)' },
          '50%': { transform: 'scale(1.1, 1.9) translateY(-0.4em)' },
          '62.5%': { transform: 'scale(0.5, 1.4) translateY(-0.17em)' },
        },
        'bling-pop': {
          '0%, 100%': { transform: 'scale(0)', opacity: '0' },
          '50%': { transform: 'scale(var(--star-size))', opacity: '1' },
        },
        'pop-then-wiggle': {
          '0%': { transform: 'scale(1) rotate(0deg)' },
          '20%': { transform: 'scale(1.2) rotate(0deg)' },
          '40%': { transform: 'scale(1.2) rotate(10deg)' },
          '60%': { transform: 'scale(1.2) rotate(-10deg)' },
          '80%': { transform: 'scale(1.2) rotate(0deg)' },
          '100%': { transform: 'scale(1) rotate(0deg)' },
        },
        'washing-machine': {
            '0%': { transform: 'rotate(0deg)' }, 
            '10%': { transform: 'rotate(3deg) translateX(1px)' }, /* Sensing */
            '20%': { transform: 'rotate(-3deg) translateX(-1px)' },
            '30%': { transform: 'rotate(45deg) translateX(-3px)' }, /* Agitation */
            '40%': { transform: 'rotate(-45deg) translateX(3px)' },
            '50%': { transform: 'rotate(0deg) scale(1.01)' }, /* Drain/Pause */
            '60%': { transform: 'rotate(20deg) translateX(1px)' }, /* Rinse */
            '70%': { transform: 'rotate(-20deg) translateX(-1px)' },
            '80%': { transform: 'rotate(360deg) scale(1.02)' }, /* Spin up */
            '95%': { transform: 'rotate(1080deg) scale(1.05)' }, /* High speed spin */
            '100%': { transform: 'rotate(1080deg) scale(1)' }, /* End */
        },
        'image-ripple': {
            '0%': { transform: 'scale(1)' },
            '25%': { transform: 'scale(0.9, 1.1)' },
            '50%': { transform: 'scale(1.1, 0.9)' },
            '75%': { transform: 'scale(0.95, 1.05)' },
            '100%': { transform: 'scale(1)' },
        },
        'revolve-in-from-left': {
          '0%': { transform: 'rotateY(-90deg)', opacity: '0' },
          '60%': { transform: 'rotateY(20deg)', opacity: '1' },
          '75%': { transform: 'rotateY(-10deg)' },
          '88%': { transform: 'rotateY(5deg)' },
          '96%': { transform: 'rotateY(-2deg)' },
          '100%': { transform: 'rotateY(0deg)', opacity: '1' },
        },
        'revolve-in-from-right': {
          '0%': { transform: 'rotateY(90deg)', opacity: '0' },
          '60%': { transform: 'rotateY(-20deg)', opacity: '1' },
          '75%': { transform: 'rotateY(10deg)' },
          '88%': { transform: 'rotateY(-5deg)' },
          '96%': { transform: 'rotateY(2deg)' },
          '100%': { transform: 'rotateY(0deg)', opacity: '1' },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        'text-fade-in-down': 'text-fade-in-down 0.5s ease-out',
        'fly-in-from-left': 'fly-in-from-left 0.5s ease-out',
        'fly-in-from-right': 'fly-in-from-right 0.5s ease-out',
        'fly-out-to-left': 'fly-out-to-left 0.3s ease-out forwards',
        'fly-out-to-right': 'fly-out-to-right 0.3s ease-out forwards',
        'zoom-in-out': 'zoom-in-out 3s ease-in-out infinite',
        'fade-in-up': 'fade-in-up 0.7s ease-out',
        'background-pan': 'background-pan 15s ease-in-out infinite',
        'draw-line': 'draw-line 1.5s ease-out forwards',
        'logo-in': 'logo-in 0.8s ease-out 0.5s backwards',
        'scale-in-diag': 'scale-in-diag 1s ease-out',
        'thumb-scale-out': 'thumb-scale-out 1s ease-out forwards',
        'wiggle': 'wiggle 3s ease-in-out infinite',
        'logo-sm-squeeze': 'logo-sm-squeeze 4s ease-in-out infinite',
        'logo-rt-squeeze': 'logo-rt-squeeze 4s ease-in-out infinite',
        'logo-a-pop': 'logo-a-pop 4s ease-in-out infinite',
        'bling-pop': 'bling-pop var(--animation-duration, 4s) ease-in-out var(--animation-delay, 0s) infinite backwards',
        'pop-then-wiggle': 'pop-then-wiggle 0.7s ease-out',
        'washing-machine': 'washing-machine 5s ease-in-out infinite',
        'image-ripple': 'image-ripple 0.6s ease-in-out',
        'revolve-in-from-left': 'revolve-in-from-left 2s ease-out',
        'revolve-in-from-right': 'revolve-in-from-right 2s ease-out',
      },
      backgroundImage: {
        'grid': "linear-gradient(to right, hsl(var(--border)) 1px, transparent 1px), linear-gradient(to bottom, hsl(var(--border)) 1px, transparent 1px)",
      }
    },
  },
  plugins: [require('tailwindcss-animate')],
} satisfies Config;
