/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        "bg" : "#E6E7F5",
        "text-primary" : "#EBE9FC",
        "bg-primary" : "#3A31D8",
        "bg-secondary" : "#020024",
        "bg-accent" : "#0600C2",
      }
    },
  },
  plugins: [],
}

