export const errorHandler = (error, req, res, next) => {
    const status = error.status || 400;
    return res.status(status).json({ message: error.message });
};
