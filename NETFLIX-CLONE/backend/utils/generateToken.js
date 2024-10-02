import jwt from "jsonwebtoken";


export const generateTokenAndSetCookie = (userId, res) => {
    const token = jwt.sign({ userId }, JWT_SECRET_KEY, { expiresIn:"1D"});

    res.cookie("token", token, { httpOnly: true });
    return token;
}   