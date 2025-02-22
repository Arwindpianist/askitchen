import Link from "next/link";

export default function Header() {
  return (
    <header className="bg-white border-b border-gray-200">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link href="/" className="text-2xl font-bold text-purple-600 hover:text-purple-700 transition-colors">
          ASKitchen
        </Link>
        <div className="flex gap-4">
          <Link href="/" className="text-gray-900 hover:text-purple-600 transition-colors">
            Home
          </Link>
          <Link href="/recipe" className="text-gray-900 hover:text-purple-600 transition-colors">
            Recipes
          </Link>
        </div>
      </nav>
    </header>
  );
} 