/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        primary: "#0969DA", // GitHub blue-ish
        secondary: "#0F4C81", // Navy from logo
        accent: "#0096C7", // Teal from logo
        "background-light": "#ffffff",
        "background-dark": "#0d1117",
        "surface-light": "#f6f8fa",
        "surface-dark": "#161b22",
        "border-light": "#d0d7de",
        "border-dark": "#30363d",
        "text-light": "#24292f",
        "text-dark": "#c9d1d9",
        "text-muted-light": "#57606a",
        "text-muted-dark": "#8b949e",
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
      borderRadius: {
        DEFAULT: "6px",
      },
      backgroundImage: {
        'grid-pattern': "url(\"data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%230969da' fill-opacity='0.05' fill-rule='evenodd'%3E%3Cpath d='M0 40L40 0H20L0 20M40 40V20L20 40'/%3E%3C/g%3E%3C/svg%3E\")",
        'dot-pattern': "radial-gradient(#d0d7de 1px, transparent 1px)",
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'float-delayed': 'float 6s ease-in-out 3s infinite',
        'shimmer': 'shimmer 2s infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        shimmer: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        }
      }
    },
  },
  plugins: [],
}

