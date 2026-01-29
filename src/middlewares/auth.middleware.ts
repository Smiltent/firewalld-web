import type { NextFunction, Request, Response } from "express"

export default function requireLogin(req: Request, res: Response, next: NextFunction) {
    if (!req.session.loggedIn) {
        return res.redirect("/")
    }

    next()
}