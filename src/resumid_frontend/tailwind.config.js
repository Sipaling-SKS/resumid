/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: ["./index.html", "./src/**/*.{ts,tsx,js,jsx}"],
  theme: {
  	extend: {
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		},
  		colors: {
  			text: {
  				'50': '#0d0d0d',
  				'100': '#1a1a1a',
  				'200': '#333333',
  				'300': '#4d4d4d',
  				'400': '#666666',
  				'500': '#808080',
  				'600': '#999999',
  				'700': '#b3b3b3',
  				'800': '#cccccc',
  				'900': '#e6e6e6',
  				'950': '#f2f2f2'
  			},
  			background: {
  				'50': '#0d0d0d',
  				'100': '#1a1a1a',
  				'200': '#333333',
  				'300': '#4d4d4d',
  				'400': '#666666',
  				'500': '#808080',
  				'600': '#999999',
  				'700': '#b3b3b3',
  				'800': '#cccccc',
  				'900': '#e6e6e6',
  				'950': '#f2f2f2'
  			},
  			primary: {
  				'50': '#030916',
  				'100': '#07122c',
  				'200': '#0d2459',
  				'300': '#143685',
  				'400': '#1b48b1',
  				'500': '#215ade',
  				'600': '#4e7be4',
  				'700': '#7a9ceb',
  				'800': '#a6bdf2',
  				'900': '#d3def8',
  				'950': '#e9eefc'
  			},
  			secondary: {
  				'50': '#0a0514',
  				'100': '#140b28',
  				'200': '#281650',
  				'300': '#3d2178',
  				'400': '#512ca0',
  				'500': '#6537c8',
  				'600': '#845fd3',
  				'700': '#a387de',
  				'800': '#c1afe9',
  				'900': '#e0d7f4',
  				'950': '#f0ebfa'
  			},
  			accent: {
  				'50': '#0d0416',
  				'100': '#19082b',
  				'200': '#331056',
  				'300': '#4c1881',
  				'400': '#6620ac',
  				'500': '#7f28d7',
  				'600': '#9953df',
  				'700': '#b27ee7',
  				'800': '#cca9ef',
  				'900': '#e5d4f7',
  				'950': '#f2e9fb'
  			}
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
  			}
  		},
  		animation: {
  			'accordion-down': 'accordion-down 0.2s ease-out',
  			'accordion-up': 'accordion-up 0.2s ease-out'
  		}
  	}
  },
  plugins: [require("tailwindcss-animate")],
}

