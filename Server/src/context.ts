import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";

export interface Context {
    prisma: PrismaClient;
    req: Request & { session: Express.Session };
    res: Response;
}
