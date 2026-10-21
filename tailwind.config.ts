import type { Config } from "tailwindcss";

/* CO2 design tokens
   carbon  — the "C" in CO2: deep warm black for cinematic sections
   bone    — warm white base for editorial sections
   stone / sand — product-photo marbles
   gold    — the metallic of the infinity mark (accent only)
   leaf    — the green of the logo leaves (used sparingly) */
const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./hooks/**/*.{ts,tsx}"],
  theme: {
    screens: { xs: "420px", sm: "640px", md: "768px", lg: "1024px", xl: "1280px", "2xl": "1536px" },
    extend: {
      colors: {
        carbon: { DEFAULT: "#11100D", 2: "#191713", 3: "#24211C" },
        bone: { DEFAULT: "#F4EFE7", 2: "#EDE6DA" },
        stone: { DEFAULT: "#E3D9CA", 2: "#D6C8B3" },
        taupe: "#8B8072",
        ink: { DEFAULT: "#1A1814", soft: "#5F574C" },
        gold: { DEFAULT: "#B8924F", light: "#E2C68C", deep: "#8A6A34" },
        leaf: { DEFAULT: "#4E7A39", light: "#86B060" },
        line: { DEFAULT: "rgba(26,24,20,.14)", dark: "rgba(244,239,231,.14)" },
      },
      fontFamily: {
        display: ['"Instrument Serif"', "Georgia", "serif"],
        sans: ['"Inter Tight Variable"', "Inter Tight", "system-ui", "sans-serif"],
      },
      fontSize: {
        "2xs": ["0.6875rem", { lineHeight: "1rem", letterSpacing: "0.18em" }],
        "display-xl": ["clamp(4.25rem, 13vw, 14rem)", { lineHeight: "0.86", letterSpacing: "-0.035em" }],
        "display-lg": ["clamp(3.25rem, 8.5vw, 8.5rem)", { lineHeight: "0.9", letterSpacing: "-0.03em" }],
        "display-md": ["clamp(2.5rem, 5.5vw, 5.25rem)", { lineHeight: "0.95", letterSpacing: "-0.025em" }],
        "display-sm": ["clamp(2rem, 3.4vw, 3.25rem)", { lineHeight: "1", letterSpacing: "-0.02em" }],
      },
      spacing: { gutter: "clamp(1rem, 3.2vw, 3rem)", section: "clamp(4rem, 7.5vw, 7rem)" },
      maxWidth: { site: "1600px", prose: "38rem" },
      transitionTimingFunction: { expo: "cubic-bezier(0.16, 1, 0.3, 1)", silk: "cubic-bezier(0.65, 0, 0.35, 1)" },
      keyframes: {
        marquee: { from: { transform: "translateX(0)" }, to: { transform: "translateX(-50%)" } },
        float: { "0%,100%": { transform: "translateY(0)" }, "50%": { transform: "translateY(-10px)" } },
        shimmer: { from: { backgroundPosition: "200% 0" }, to: { backgroundPosition: "-200% 0" } },
      },
      animation: {
        marquee: "marquee 38s linear infinite",
        float: "float 6s ease-in-out infinite",
        shimmer: "shimmer 6s linear infinite",
      },
    },
  },
  plugins: [],
};

export default config;
