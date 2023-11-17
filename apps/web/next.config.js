const defaultNextConfig = require("@rcpswap/nextjs-config")

module.exports = {
  ...defaultNextConfig,
  output: "export",
  transpilePackages: ["@rcpswap/wagmi"],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
}
