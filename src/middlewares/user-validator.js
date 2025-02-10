export const userValidator = (req, res, next) => {
    if (
        req.body.email === undefined ||
        typeof req.body.email !== "string" ||
        req.body.password === undefined ||
        typeof req.body.password !== "string" ||
        req.body.age === undefined ||
        typeof req.body.age !== "number"
    )
        res.status(404).json({ error: "Invalid body" });
    return next();
};

export const userRoleValidate = (req, res, next) => {
    if (req.body.role === "admin") next();
    else return res.status(401).send("No estas autorizado");
};

// ---> POST /users --> userValidator
//                    |ERROR| |next()|
//                                  |__>  createUser()
