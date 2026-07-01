/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}"
  ],
  darkMode: "class",
  corePlugins: {
    preflight: false,
  },
  theme: {
    extend: {
      colors: {
        "secondary-fixed": "#e5e2e1",
        "on-primary-fixed": "#3d0600",
        "primary-fixed": "#ffdad2",
        "on-secondary-fixed-variant": "#474746",
        "surface-variant": "#e8e2d6",
        "outline-variant": "#e0bfb8",
        "surface-container": "#f3ede1",
        "inverse-on-surface": "#f6f0e4",
        "on-primary": "#ffffff",
        "inverse-surface": "#333028",
        "surface-bright": "#fff9ed",
        "primary": "#9c2b11",
        "outline": "#8c716b",
        "on-background": "#1e1c14",
        "inverse-primary": "#ffb4a3",
        "surface-container-lowest": "#ffffff",
        "surface-tint": "#aa361b",
        "secondary-fixed-dim": "#c8c6c5",
        "on-primary-container": "#ffeae6",
        "on-tertiary-container": "#d7f6dd",
        "error-container": "#ffdad6",
        "on-tertiary-fixed-variant": "#324d3b",
        "on-secondary-fixed": "#1c1b1b",
        "tertiary-fixed": "#cbead2",
        "surface": "#fff9ed",
        "on-error-container": "#93000a",
        "on-primary-fixed-variant": "#891e04",
        "tertiary-fixed-dim": "#b0ceb6",
        "on-tertiary-fixed": "#062011",
        "on-secondary": "#ffffff",
        "on-surface-variant": "#58413c",
        "surface-dim": "#dfd9ce",
        "primary-container": "#bd4327",
        "on-tertiary": "#ffffff",
        "background": "#fff9ed",
        "surface-container-low": "#f9f3e7",
        "surface-container-high": "#eee8db",
        "secondary-container": "#e2dfde",
        "error": "#ba1a1a",
        "on-surface": "#1e1c14",
        "surface-container-highest": "#e8e2d6",
        "tertiary-container": "#57725e",
        "secondary": "#5f5e5e",
        "on-secondary-container": "#636262",
        "tertiary": "#3f5a47",
        "primary-fixed-dim": "#ffb4a3",
        "on-error": "#ffffff",
        "charcoal": "#1A1A1A",
        "bone": "#F5F5F0"
      },
      borderRadius: {
        "DEFAULT": "0px",
        "lg": "0px",
        "xl": "0px",
        "full": "9999px"
      },
      spacing: {
        "stack-md": "24px",
        "gutter": "24px",
        "stack-sm": "8px",
        "margin-page": "40px",
        "stack-lg": "64px"
      },
      maxWidth: {
        "container-max": "1280px"
      },
      fontFamily: {
        "button-text": ["Space Grotesk", "sans-serif"],
        "headline-lg": ["Playfair Display", "serif"],
        "headline-lg-mobile": ["Playfair Display", "serif"],
        "headline-xl": ["Playfair Display", "serif"],
        "body-md": ["Geist", "sans-serif"],
        "body-lg": ["Geist", "sans-serif"],
        "label-caps": ["Space Grotesk", "sans-serif"]
      },
      fontSize: {
        "button-text": ["15px", {"lineHeight": "1", "fontWeight": "700"}],
        "headline-lg": ["48px", {"lineHeight": "1.2", "fontWeight": "800"}],
        "headline-lg-mobile": ["32px", {"lineHeight": "1.2", "fontWeight": "800"}],
        "headline-xl": ["72px", {"lineHeight": "1.1", "letterSpacing": "-0.02em", "fontWeight": "900"}],
        "body-md": ["16px", {"lineHeight": "1.6", "fontWeight": "400"}],
        "body-lg": ["18px", {"lineHeight": "1.6", "fontWeight": "400"}],
        "label-caps": ["14px", {"lineHeight": "1", "letterSpacing": "0.1em", "fontWeight": "700"}]
      }
    }
  },
  plugins: [],
}
