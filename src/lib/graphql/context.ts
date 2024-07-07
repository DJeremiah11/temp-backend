// context.ts
import { PrismaClient } from '@prisma/client';
import { Request, Response } from 'express';
import prisma from 'lib/prisma';

export interface Context {
  prisma: PrismaClient;
  req: Request;
  res: Response;
}

export function createContext({ req, res }: { req: Request; res: Response }): Context {
  return {
    prisma,
    req,
    res,
  };
}
