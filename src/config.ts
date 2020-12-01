export default () => ({
    mongoUrl: process.env.MONGO_URL,
    secret: process.env.JWT_SECRET_KEY,
});