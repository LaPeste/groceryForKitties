import type { NextFunction, Request, Response } from "express";

export default function catchAllErrors(err: Error, req: Request, res: Response, next: NextFunction): void {
    res.status(500);
}