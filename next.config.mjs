/** @type {import('next').NextConfig} */
const nextConfig = {
    env: {
        MONGODB_URL: 'mongodb+srv://yildirimdemir77:MK0dlM79GG9wR7tJ@cluster0.zjmgehc.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0',
        LOCAL_HOST: "http://localhost:3000",
        NEXTAUTH_SECRET: 'y - l - d - d - m - r - 1',
        JWT_SECRET: 'mrkNoraQ7!13mz',
        EMAIL_HOST: 'smtp.gmail.com',
        EMAIL_PORT: '465',
        EMAIL_USERNAME: 'yildirim@marketconqueror.com',
        EMAIL_PASSWORD: 'dgiyshnnkywcatwd',
        EMAIL_FROM: 'yildirim@marketconqueror.com'
    },
};

export default nextConfig;
