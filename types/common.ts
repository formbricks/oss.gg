import { z } from "zod";

export const ZString = z.string();

export const ZNumber = z.number();

export const ZId = z.string().cuid2();
