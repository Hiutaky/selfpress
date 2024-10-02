/** @type {import('prettier').Config & import('prettier-plugin-tailwindcss').PluginOptions} */
const config = {
  bracketSpacing: true,
  plugins: ["prettier-plugin-tailwindcss"],
  semi: true,
  singleQuote: true,
  tabWidth: 2,
  trailingComma: "none",
  useTabs: true,
};

export default config;
