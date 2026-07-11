import type { PropsWithChildren } from "react";
import DetailHeader from "@/shared/components/layout/DetailHeader";
import Footer from "@/shared/components/layout/Footer";

export default function DetailLayout({ children }: PropsWithChildren) {

  return (
    <>
      <DetailHeader />
      <main className="flex-1">{children}</main>
      <Footer />
    </>
  );
}
