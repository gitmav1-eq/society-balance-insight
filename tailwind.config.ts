import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./pages/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./app/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}"],
  prefix: "",
  theme: {
  	container: {
  		center: true,
  		padding: '2rem',
  		screens: {
  			'2xl': '1400px'
  		}
  	},
  	extend: {
  		colors: {
  			border: 'hsl(var(--border))',
  			input: 'hsl(var(--input))',
  			ring: 'hsl(var(--ring))',
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
  			destructive: {
  				DEFAULT: 'hsl(var(--destructive))',
  				foreground: 'hsl(var(--destructive-foreground))'
  			},
  			muted: {
  				DEFAULT: 'hsl(var(--muted))',
  				foreground: 'hsl(var(--muted-foreground))'
  			},
  			accent: {
  				DEFAULT: 'hsl(var(--accent))',
  				foreground: 'hsl(var(--accent-foreground))'
  			},
  			popover: {
  				DEFAULT: 'hsl(var(--popover))',
  				foreground: 'hsl(var(--popover-foreground))'
  			},
  			card: {
  				DEFAULT: 'hsl(var(--card))',
  				foreground: 'hsl(var(--card-foreground))'
  			},
  			sidebar: {
  				DEFAULT: 'hsl(var(--sidebar-background))',
  				foreground: 'hsl(var(--sidebar-foreground))',
  				primary: 'hsl(var(--sidebar-primary))',
  				'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
  				accent: 'hsl(var(--sidebar-accent))',
  				'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
  				border: 'hsl(var(--sidebar-border))',
  				ring: 'hsl(var(--sidebar-ring))'
  			}
  		},
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		},
		keyframes: {
			'accordion-down': {
				from: {
					height: '0'
				},
				to: {
					height: 'var(--radix-accordion-content-height)'
				}
			},
			'accordion-up': {
				from: {
					height: 'var(--radix-accordion-content-height)'
				},
				to: {
					height: '0'
				}
			},
			'nebula-pulse-1': {
				'0%, 100%': {
					opacity: '0.3',
					transform: 'scale(1) translate(0, 0)'
				},
				'50%': {
					opacity: '0.5',
					transform: 'scale(1.1) translate(5%, 5%)'
				}
			},
			'nebula-pulse-2': {
				'0%, 100%': {
					opacity: '0.25',
					transform: 'scale(1) translate(0, 0)'
				},
				'50%': {
					opacity: '0.4',
					transform: 'scale(1.15) translate(-5%, -5%)'
				}
			},
			'nebula-pulse-3': {
				'0%, 100%': {
					opacity: '0.2',
					transform: 'scale(0.9) translate(-50%, -50%)'
				},
				'50%': {
					opacity: '0.35',
					transform: 'scale(1.1) translate(-50%, -50%)'
				}
			},
			'nebula-float': {
				'0%': {
					transform: 'translate(0, 0)'
				},
				'25%': {
					transform: 'translate(-10%, 15%)'
				},
				'50%': {
					transform: 'translate(5%, 25%)'
				},
				'75%': {
					transform: 'translate(15%, 10%)'
				},
				'100%': {
					transform: 'translate(0, 0)'
				}
			},
			'confetti-fall': {
				'0%': {
					transform: 'translateY(0) rotate(0deg)',
					opacity: '1'
				},
				'100%': {
					transform: 'translateY(100vh) rotate(720deg)',
					opacity: '0'
				}
			},
			'confetti-spin': {
				'0%': {
					transform: 'rotateX(0) rotateY(0)'
				},
				'100%': {
					transform: 'rotateX(360deg) rotateY(180deg)'
				}
			},
			'fade-in': {
				'0%': {
					opacity: '0',
					transform: 'translateY(10px)'
				},
				'100%': {
					opacity: '1',
					transform: 'translateY(0)'
				}
			},
			'scale-in': {
				'0%': {
					opacity: '0',
					transform: 'scale(0.9)'
				},
				'100%': {
					opacity: '1',
					transform: 'scale(1)'
				}
			},
			'system-reveal': {
				'0%': {
					opacity: '0',
					transform: 'translateY(12px)',
					filter: 'blur(4px)'
				},
				'100%': {
					opacity: '1',
					transform: 'translateY(0)',
					filter: 'blur(0)'
				}
			}
		},
		animation: {
			'accordion-down': 'accordion-down 0.2s ease-out',
			'accordion-up': 'accordion-up 0.2s ease-out',
			'nebula-pulse-1': 'nebula-pulse-1 12s ease-in-out infinite',
			'nebula-pulse-2': 'nebula-pulse-2 15s ease-in-out infinite',
			'nebula-pulse-3': 'nebula-pulse-3 10s ease-in-out infinite',
			'nebula-float': 'nebula-float 20s ease-in-out infinite',
			'confetti-fall': 'confetti-fall 3s ease-out forwards',
			'confetti-spin': 'confetti-spin 1s linear infinite',
			'fade-in': 'fade-in 0.3s ease-out',
			'scale-in': 'scale-in 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
		},
  		boxShadow: {
  			'2xs': 'var(--shadow-2xs)',
  			xs: 'var(--shadow-xs)',
  			sm: 'var(--shadow-sm)',
  			md: 'var(--shadow-md)',
  			lg: 'var(--shadow-lg)',
  			xl: 'var(--shadow-xl)',
  			'2xl': 'var(--shadow-2xl)'
  		},
  		fontFamily: {
  			sans: [
  				'DM Sans',
  				'ui-sans-serif',
  				'system-ui',
  				'-apple-system',
  				'BlinkMacSystemFont',
  				'Segoe UI',
  				'Roboto',
  				'Helvetica Neue',
  				'Arial',
  				'Noto Sans',
  				'sans-serif'
  			],
  			serif: [
  				'Crimson Pro',
  				'ui-serif',
  				'Georgia',
  				'Cambria',
  				'Times New Roman',
  				'Times',
  				'serif'
  			],
  			mono: [
  				'SF Mono',
  				'ui-monospace',
  				'SFMono-Regular',
  				'Menlo',
  				'Monaco',
  				'Consolas',
  				'Liberation Mono',
  				'Courier New',
  				'monospace'
  			]
  		}
  	}
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
