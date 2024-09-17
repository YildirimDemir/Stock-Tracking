/** @type {import('next').NextConfig} */
const nextConfig = {
    env: {
        MONGODB_URL: process.env.MONGODB_URL,
        LOCAL_HOST: process.env.LOCAL_HOST,
        NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
        JWT_SECRET: process.env.JWT_SECRET,
        EMAIL_HOST: process.env.EMAIL_HOST,
        EMAIL_PORT: process.env.EMAIL_PORT,
        EMAIL_USERNAME: process.env.EMAIL_USERNAME,
        EMAIL_PASSWORD: process.env.EMAIL_PASSWORD,
        EMAIL_FROM: process.env.EMAIL_FROM,
    },
};

export default nextConfig;
