import type { PropsWithChildren } from "react";
import Footer from "@/shared/components/layout/Footer";
import GuestRoute from "@/system/auth/GuestRoute";

export default function AuthLayout({ children }: PropsWithChildren) {

  return (
    <GuestRoute>
      {/*<AuthHeader />*/}
      <main className="flex-1 flex items-center justify-center px-6 py-10">
        {children}
      </main>
      <Footer />
    </GuestRoute>
  );
}
