import type { Config } from "tailwindcss";
import plugin from "tailwindcss/plugin";

export default {
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
    },
  },
  plugins: [
    plugin(function ({ addUtilities }) {
      addUtilities({
        /* Thin scrollbar utility */
        ".scrollbar-thin": {
          "scrollbar-width": "thin", // For Firefox
          "-ms-overflow-style": "none", // For IE
        },
        /* Hide scrollbar utility */
        ".scrollbar-hide": {
          "scrollbar-width": "none", // For Firefox
          "-ms-overflow-style": "none", // For IE
          "&::-webkit-scrollbar": {
            display: "none", // For Chrome and Safari
          },
        },
        /* Custom scrollbar styles */
        ".scrollbar-thumb-dark": {
          "&::-webkit-scrollbar-thumb": {
            backgroundColor: "#4b5563", // Thumb color
            borderRadius: "4px",
            border: "2px solid transparent",
            backgroundClip: "content-box",
          },
        },
        ".scrollbar-track-dark": {
          "&::-webkit-scrollbar-track": {
            backgroundColor: "#1a1a1a", // Track color
            borderRadius: "4px",
          },
        },
        ".scrollbar-thumb-hover": {
          "&::-webkit-scrollbar-thumb:hover": {
            backgroundColor: "#6b7280", // Hover thumb color
          },
        },
        '.scroll-touch': {
          '-webkit-overflow-scrolling': 'touch',
        }
      });
    }),
  ],
} satisfies Config;
