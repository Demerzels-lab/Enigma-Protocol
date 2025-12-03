/** @type {import('tailwindcss').Config} */
module.exports = {
	darkMode: ['class'],
	content: [
		'./pages/**/*.{ts,tsx}',
		'./components/**/*.{ts,tsx}',
		'./app/**/*.{ts,tsx}',
		'./src/**/*.{ts,tsx}',
	],
	theme: {
		container: {
			center: true,
			padding: {
				DEFAULT: '1rem',
				sm: '2rem',
				lg: '4rem',
			},
			screens: {
				sm: '640px',
				md: '768px',
				lg: '1024px',
				xl: '1280px',
				'2xl': '1400px',
			},
		},
		extend: {
			colors: {
				primary: {
					50: '#EFF6FF',
					100: '#DBEAFE',
					500: '#6366F1',
					700: '#4338CA',
					900: '#312E81',
				},
				accent: {
					400: '#A855F7',
					500: '#8B5CF6',
					600: '#7C3AED',
				},
				neutral: {
					0: '#000000',
					50: '#0A0A0A',
					100: '#141414',
					200: '#1F1F1F',
					300: '#A3A3A3',
					400: '#525252',
				},
				text: {
					primary: '#F5F5F5',
				},
				semantic: {
					success: '#10B981',
					warning: '#F59E0B',
					error: '#EF4444',
					info: '#06B6D4',
				},
				background: {
					page: '#000000',
					surface: '#0A0A0A',
				},
			},
			fontFamily: {
				// Add "display" for headings
				display: ['"Space Grotesk"', 'sans-serif'],
				// Keep "body" for paragraphs
				body: ['"Inter"', 'sans-serif'],
			},
			fontSize: {
				xs: '12px',
				sm: '14px',
				base: '16px',
				lg: '20px',
				xl: '24px',
				'2xl': '30px',
				'3xl': '36px',
				'4xl': '48px',
				'5xl': '60px',
				'6xl': '72px',
			},
			spacing: {
				1: '4px',
				2: '8px',
				3: '12px',
				4: '16px',
				6: '24px',
				8: '32px',
				12: '48px',
				16: '64px',
				24: '96px',
				32: '128px',
			},
			borderRadius: {
				sm: '4px',
				md: '8px',
				lg: '12px',
				xl: '16px',
				'2xl': '24px',
				full: '9999px',
			},
			boxShadow: {
				card: '0 0 1px rgba(139, 92, 246, 0.5), 0 4px 12px rgba(0, 0, 0, 0.8), inset 0 0 20px rgba(139, 92, 246, 0.05)',
				'card-hover': '0 0 2px rgba(139, 92, 246, 0.8), 0 8px 24px rgba(0, 0, 0, 0.9), inset 0 0 30px rgba(139, 92, 246, 0.1)',
				glow: '0 0 20px rgba(139, 92, 246, 0.5), 0 0 40px rgba(139, 92, 246, 0.2)',
				'glow-strong': '0 0 30px rgba(139, 92, 246, 0.8), 0 0 60px rgba(139, 92, 246, 0.4)',
				modal: '0 20px 60px rgba(0, 0, 0, 0.95), 0 0 80px rgba(139, 92, 246, 0.3)',
				terminal: '0 0 1px rgba(139, 92, 246, 0.6), inset 0 0 20px rgba(139, 92, 246, 0.08)',
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'pulse-glow': 'pulse-glow 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
			},
			keyframes: {
				'accordion-down': {
					from: { height: 0 },
					to: { height: 'var(--radix-accordion-content-height)' },
				},
				'accordion-up': {
					from: { height: 'var(--radix-accordion-content-height)' },
					to: { height: 0 },
				},
				'pulse-glow': {
					'0%, 100%': { opacity: 1 },
					'50%': { opacity: 0.7 },
				},
			},
			transitionDuration: {
				fast: '200ms',
				normal: '300ms',
				slow: '500ms',
			},
		},
	},
	plugins: [require('tailwindcss-animate')],
}