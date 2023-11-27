/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
        'node_modules/flowbite-react/**/*.{js,jsx,ts,tsx}'
    ],
    theme: {
        fontFamily: {
            brandon: ['Brandon', 'sans-serif'],
            roboto: ['Roboto', 'sans-serif']
        }
    },
    plugins: [
        require('flowbite/plugin'),
    ],
}

