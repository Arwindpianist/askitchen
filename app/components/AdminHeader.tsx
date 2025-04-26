import Link from "next/link";

export default function AdminHeader() {
  return (
    <header className="bg-emerald-700 border-b border-purple-700">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link href="/admin" className="text-2xl font-bold text-white hover:text-purple-400 transition-colors">
          Admin Panel
        </Link>
        <div className="flex gap-4">
          <Link href="/admin" className="text-white hover:text-purple-400 transition-colors">
            Dashboard
          </Link>
          <Link href="/admin/recipe" className="text-white hover:text-purple-400 transition-colors">
            Manage Recipes
          </Link>
          <Link href="/admin/blog" className="text-white hover:text-purple-400 transition-colors">
            Manage Blogs
          </Link>
          <Link href="/" className="text-white hover:text-purple-400 transition-colors">
            Back to Site
          </Link>
        </div>
      </nav>
    </header>
  );
}