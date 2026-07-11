import type { PropsWithChildren } from "react";
import AuthHeader from "@/shared/components/layout/AuthHeader";
import Footer from "@/shared/components/layout/Footer";

export default function AuthLayout({ children }: PropsWithChildren) {

  return (
    <>
      {/*<AuthHeader />*/}
      <main className="flex-1 flex items-center justify-center px-6 py-10">
        {children}
      </main>
      <Footer />
    </>
  );
}
