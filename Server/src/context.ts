import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import { Redis } from "ioredis";

export interface Context {
  prisma: PrismaClient;
  req: Request & { session: Express.Session };
  res: Response;
  redis: Redis;
}
