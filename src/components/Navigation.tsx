import Link from "next/link";

export default function Navigation() {
  return (
    <nav className="bg-white shadow-sm border-b mb-8">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-center space-x-8">
          <Link
            href="/"
            className="px-4 py-2 rounded-md text-sm font-medium bg-blue-500 text-white hover:bg-blue-600 transition-colors cursor-pointer"
          >
            SSR (Server-Side Rendering)
          </Link>
          <Link
            href="/csr"
            className="px-4 py-2 rounded-md text-sm font-medium bg-green-500 text-white hover:bg-green-600 transition-colors cursor-pointer"
          >
            CSR (Client-Side Rendering)
          </Link>
        </div>
      </div>
    </nav>
  );
}
