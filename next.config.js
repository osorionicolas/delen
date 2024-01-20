/** @type {import('next').NextConfig} */
const withSerwist = require("@serwist/next").default({
    swSrc: "app/sw.js",
    swDest: "public/sw.js",
})
      

const nextConfig = {
  output: "standalone",
};

module.exports = nextConfig;