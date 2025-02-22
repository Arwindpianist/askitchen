import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#6B46C1',
        'primary-dark': '#553C9A',
        background: '#EDDFEF',
        text: {
          DEFAULT: '#1A202C',
          muted: '#4A5568',
        },
      },
    },
  },
  plugins: [],
}

export default config;
