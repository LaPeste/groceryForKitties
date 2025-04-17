import type { NextFunction, Request, Response } from "express";

export default function logRequest(req: Request, res: Response, next: NextFunction): void {
    if (process.env.DEBUG) {
        if (Object.keys(req.query).length > 0) {
            console.log("Query fields of incoming request:");
            for (const key in req.query) {
                console.log(`${key}: ${req.query[key]}\n`);
            }
        }

        if (req.body && Object.keys(req.body).length > 0) {
            console.log("Body of incoming request:");
            console.log(req.body);
        }
    }
    next();
}