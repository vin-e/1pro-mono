/** @type {import('tailwindcss').Config} */

const defaultTheme = require("tailwindcss/defaultTheme");
const colors = require("tailwindcss/colors")

module.exports = {
	content: [
		'./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}',
		'../components/src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'
	],
	theme: {
		extend: {
			colors: {
        primary: colors.blue,
        secondary: colors.pink,
      },
      fontFamily: {
        sans: ["'IBM Plex Sans'", ...defaultTheme.fontFamily.sans],
      },
		},
	},
	plugins: [require("@tailwindcss/typography")],
	darkMode: "class",
	safelist: [
    {
      pattern: /(bg|text)-*-*/,
      variants: ['lg', 'hover', 'focus', 'lg:hover'],
    },
  ],
}
