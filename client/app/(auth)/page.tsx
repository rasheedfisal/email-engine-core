"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { NextLink } from "@/components/ui/next-link";
import { env } from "@/lib/env.client";
import { Providers } from "@/lib/types/general";

export default function LoginPage() {
  return (
    <div className="w-full h-screen flex items-center justify-center px-4">
      <Card className="mx-auto max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl">Access Control</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            <NextLink
              href={`${env.EXTERNAL_OAUTH_ROUTE}/${Providers.OUTLOOK}`}
              type="button"
              variant="outline"
              className="w-full gap-3"
            >
              Continue with Outlook
            </NextLink>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
