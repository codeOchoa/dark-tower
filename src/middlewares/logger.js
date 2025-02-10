export const loggerHttp = (req, res, next) => {
    console.log(`[${req.method}] - ${req.url} - ${new Date()}`);
    next()
}