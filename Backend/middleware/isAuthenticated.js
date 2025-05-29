import jwt from "jsonwebtoken";

function authenticateToken(req, res, next) {
    try {
        const token = req.cookies.token;
        if (!token) {
            return res.status(401).json({
                message: "No token provided",
                success: false,
            });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (!decoded) {
            return res.status(401).json({
                message: "Unauthorized",
                success: false,
            });
        }
        req.id = decoded.userId;
        next();

        // jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        //     if (err) {
        //         return res.status(403).json({
        //             message: "Forbidden",
        //             success: false,
        //         });
        //     }
        //     req.user = user;
        //     next();
        // });
    }
    catch (error) {
        console.error("Error in authentication middleware:", error);
        return res.status(500).json({
            message: "Internal server error",
            success: false,
        });
    }
}
export default authenticateToken;