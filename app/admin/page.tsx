// path/to/AdminPage.tsx
"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/app/lib/supabase";
import AdminHeader from "@/app/components/AdminHeader";

const allowedEmails: string[] = process.env.NEXT_PUBLIC_ALLOWED_ADMIN_EMAILS?.split(",") || [];

export default function AdminPage() {
  const [isLoading, setLoading] = useState<boolean>(true);
  const [user, setUser] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      const { data } = await supabase.auth.getUser();
      if (!data?.user) {
        router.push("/login");
        return;
      }

      if (!data?.user?.email || !allowedEmails.includes(data.user.email)) {
        alert("Unauthorized access.");
        await supabase.auth.signOut();
        router.push("/login");
        return;
      }

      setUser(data.user);
      setLoading(false);
    };

    checkAuth();
  }, [router]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-gray-600">Loading...</p>
      </div>
    );
  }

  return (
    <>
      <AdminHeader />
      <main className="min-h-screen py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Welcome to the Admin Panel</h1>
            <button onClick={handleSignOut} className="btn-secondary">
              Sign Out
            </button>
          </div>
          <p className="text-gray-600 mb-6">
            Use the navigation links above to manage recipes, blogs, or return to the main site.
          </p>
          <p className="text-gray-600">
            If you encounter any issues, please contact the site administrator.
          </p>
        </div>
      </main>
    </>
  );
}