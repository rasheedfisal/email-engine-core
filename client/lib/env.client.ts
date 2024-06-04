"use client";
import { z } from "zod";

export const env = {
  EXTERNAL_OAUTH_ROUTE: z
    .string()
    .min(1)
    .parse(process.env.NEXT_PUBLIC_EXTERNAL_OAUTH_ROUTE),

  API_BASE_ROUTE: z
    .string()
    .min(1)
    .parse(process.env.NEXT_PUBLIC_API_BASE_ROUTE),
};
