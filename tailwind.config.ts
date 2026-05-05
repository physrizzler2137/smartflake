import { join } from 'path';
import type { Config } from 'tailwindcss';
import forms from '@tailwindcss/forms';
import typography from '@tailwindcss/typography';

export default {
	darkMode: 'class',
	content: ['./src/**/*.{html,js,svelte,ts}'],

	theme: {
		extend: {
			fontFamily: {
				body: ['Inter', 'sans-serif'],
				headline: ['Space Grotesk', 'sans-serif'],
				slab: ['Roboto Slab', 'serif']
			},
			colors: {
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				border: 'hsl(var(--border))'
			},
			keyframes: {
				'logo-sm-squeeze': {
					'0%, 100%': { transform: 'translateX(0)' },
					'37.5%, 62.5%': { transform: 'translateX(0.12em)' }
				},
				'logo-rt-squeeze': {
					'0%, 100%': { transform: 'translateX(0)' },
					'37.5%, 62.5%': { transform: 'translateX(-0.12em)' }
				},
				'logo-a-pop': {
					'0%, 100%': { transform: 'scale(1, 1.4) translateY(-0.17em)' },
					'37.5%': { transform: 'scale(0.5, 1.4) translateY(-0.17em)' },
					'50%': { transform: 'scale(1.1, 1.9) translateY(-0.4em)' },
					'62.5%': { transform: 'scale(0.5, 1.4) translateY(-0.17em)' }
				},
				'revolve-in-from-left': {
					'0%': { transform: 'rotateY(-90deg)', opacity: '0' },
					'60%': { transform: 'rotateY(8deg)', opacity: '1' },
					'80%': { transform: 'rotateY(-3deg)' },
					'100%': { transform: 'rotateY(0deg)' }
				},
				'revolve-in-from-right': {
					'0%': { transform: 'rotateY(90deg)', opacity: '0' },
					'60%': { transform: 'rotateY(-8deg)', opacity: '1' },
					'80%': { transform: 'rotateY(3deg)' },
					'100%': { transform: 'rotateY(0deg)' }
				},
				'draw-line': {
					'0%': { height: '0%' },
					'100%': { height: '100%' }
				},
				'pop-then-wiggle': {
					'0%': { transform: 'scale(1) rotate(0deg)' },
					'20%': { transform: 'scale(1.2) rotate(0deg)' },
					'40%': { transform: 'scale(1.2) rotate(10deg)' },
					'60%': { transform: 'scale(1.2) rotate(-10deg)' },
					'80%': { transform: 'scale(1.2) rotate(0deg)' },
					'100%': { transform: 'scale(1) rotate(0deg)' }
				}
			},
			animation: {
				'logo-sm-squeeze': 'logo-sm-squeeze 4s ease-in-out infinite',
				'logo-rt-squeeze': 'logo-rt-squeeze 4s ease-in-out infinite',
				'logo-a-pop': 'logo-a-pop 4s ease-in-out infinite',
				'revolve-in-from-left': 'revolve-in-from-left 0.8s ease-out forwards',
				'revolve-in-from-right': 'revolve-in-from-right 0.8s ease-out forwards',
				'draw-line': 'draw-line 2s ease-out forwards',
				'pop-then-wiggle': 'pop-then-wiggle 1.5s ease-in-out infinite'
			}
		}
	},

	plugins: [forms, typography]
} satisfies Config;
