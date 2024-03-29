/** @type {import('next').NextConfig} */
const withSerwist = require("@serwist/next").default({
    swSrc: "src/app/sw.ts",
    swDest: "public/sw.js",
})

const nextConfig = {
    output: "standalone",
    api: {
        responseLimit: false,
    },
}

module.exports = withSerwist(nextConfig)
