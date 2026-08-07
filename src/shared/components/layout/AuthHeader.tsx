import Link from "next/link";

export default function AuthHeader() {

  return (
    <header className="bg-gray-950 sticky top-0 z-10">
      <div className="max-w-screen-2xl mx-auto px-6 md:px-10 py-4 md:py-6">
        <Link href="/" className="text-2xl md:text-3xl font-bold text-blue-400">
          Stockdemy
        </Link>
      </div>
    </header>
  );
}
