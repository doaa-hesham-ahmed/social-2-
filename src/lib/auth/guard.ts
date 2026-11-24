import jwt, {JwtPayload} from "jsonwebtoken";
import { env } from "../config/env";
import { Request, Response, NextFunction } from "express";
import { AppError } from "../error/error";

// interface JwtPayload {
//     sub: string;
//     email: string;
//     role: string;
// }

function extractTokenFromCookieHeader(cookieHeader?: string): string | undefined {
    if (!cookieHeader) return undefined;
    for (const part of cookieHeader.split(";")) {
        const [name, ...rest] = part.trim().split("=");
        if (name === "access_token") {
            return decodeURIComponent(rest.join("="));
        }
    }
    return undefined;
}

function extractToken(req: Request): string | undefined {
    const authHeader = req.headers.authorization?.trim();
    if (authHeader) {
        if (/^Bearer\s+/i.test(authHeader)) {
            return authHeader.replace(/^Bearer\s+/i, "").trim();
        }
        return authHeader;
    }

    const headerToken = req.headers["x-access-token"] ?? req.headers.token;
    if (typeof headerToken === "string" && headerToken.trim()) {
        return headerToken.trim();
    }

    return req.cookies?.access_token || extractTokenFromCookieHeader(req.headers.cookie);
}

export function authGuard(req: Request, _res: Response, next: NextFunction) {
    try {
        const token = extractToken(req);

        if (!token) throw new AppError("Access token is required", 401);

        try {
            req.user = jwt.verify(token, env.jwt.accessScret) as JwtPayload;
        } catch {
            throw new AppError("Invalid or expired access token", 401);
        }

        next();
    } catch (error) {
        next(error);
    }
}

/**
 * Extracts and validates the authenticated user ID from the request.
 */
export function getAuthUserId(req: Request): string {
    const userId = req.user?.id;
    if (!userId) {
        throw new AppError("Unauthorized", 401);
    }
    return String(userId);
}
