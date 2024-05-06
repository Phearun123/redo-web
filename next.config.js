/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        domains: ['localhost'],
    },
    env: {
        DISABLE_SIGNUP: process.env.DISABLE_SIGNUP
    }
}

module.exports = nextConfig
