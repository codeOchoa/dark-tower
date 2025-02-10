import { createHmac, randomBytes } from "node:crypto";

export const createHash = (user) => {
    user.secretKey = randomBytes(128).toString();
    user.password = createHmac("sha256", user.secretKey)
        .update(user.password)
        .digest("hex");
};
