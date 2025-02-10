export const paramsValidator = (req, res, next) => {
    const { id } = req.params;
    if (id && id.length < 36 || id.length > 36) res.status(404).json({ error: "Invalid id" });
    return next();
};
