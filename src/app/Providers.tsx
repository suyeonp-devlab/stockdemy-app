"use client";

import { OverlayProvider } from "@/system/overlay/OverlayProvider";
import OverlayBridge from "@/system/overlay/OverlayBridge";
import { QueryClientProvider } from "@tanstack/react-query";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { PropsWithChildren } from "react";
import { getQueryClient } from "@/shared/lib/query-client";

const googleClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ?? "";

export default function Providers({ children }: PropsWithChildren) {

  const queryClient = getQueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <OverlayProvider>
        <OverlayBridge />
        <GoogleOAuthProvider clientId={googleClientId}>
          {children}
        </GoogleOAuthProvider>
      </OverlayProvider>
    </QueryClientProvider>
  );
}
