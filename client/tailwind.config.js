/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
      fontSize: {
        'xxl': '1.35rem',
      },
      animation: {
        'scale-in': 'scaleIn 0.3s ease-out',
      },
      keyframes: {
        scaleIn: {
          '0%': { transform: 'scale(0.8)', },
          '100%': { transform: 'scale(1)',  },
        },
        scaleInOut: {
          '0%': { transform: 'scale(1)', },
          '50%': { transform: 'scale(1.2)',  },
          '100%': { transform: 'scale(1)',  },
        },
      },
    },
  },
  plugins: [],
};
