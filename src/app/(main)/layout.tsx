import type { PropsWithChildren } from "react";
import MainHeader from "@/shared/components/layout/MainHeader";
import Footer from "@/shared/components/layout/Footer";

export default function MainLayout({ children }: PropsWithChildren) {

  return (
    <>
      <MainHeader />
      <main className="flex-1">{children}</main>
      <Footer />
    </>
  );
}
