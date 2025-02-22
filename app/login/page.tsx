"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/app/lib/supabase";
import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";

export default function LoginPage() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [allowedEmails, setAllowedEmails] = useState<string[]>([]);
  const router = useRouter();

  useEffect(() => {
    // Load allowed emails from environment variable
    const emails = process.env.NEXT_PUBLIC_ALLOWED_ADMIN_EMAILS?.split(",") || [];
    setAllowedEmails(emails);

    if (emails.length > 0) {
      setEmail(emails[0] || ""); // Ensure a default email is set
    }
  }, []);

  const handleLogin = async () => {
    if (!email) {
      alert("Please select an email.");
      return;
    }

    const { data, error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      alert("Invalid credentials");
      return;
    }

    if (!allowedEmails.includes(email)) {
      alert("You are not authorized to access the admin panel.");
      await supabase.auth.signOut();
      return;
    }

    router.push("/admin");
  };

  return (
    <>
      <Header />
      <main className="min-h-screen py-12 bg-gray-50">
        <div className="max-w-md mx-auto px-4">
          <h1 className="text-3xl font-bold text-text mb-8 text-center">Admin Login</h1>
          <div className="card">
            <select
              className="input-field mb-4"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            >
              {allowedEmails.length > 0 ? (
                allowedEmails.map((adminEmail, index) => (
                  <option key={index} value={adminEmail}>
                    {adminEmail}
                  </option>
                ))
              ) : (
                <option value="">No allowed emails configured</option>
              )}
            </select>
            <input
              type="password"
              placeholder="Password"
              className="input-field mb-6"
              onChange={(e) => setPassword(e.target.value)}
            />
            <button onClick={handleLogin} className="btn-primary w-full">
              Login
            </button>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
