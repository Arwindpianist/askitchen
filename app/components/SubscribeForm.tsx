"use client";
import { useState } from "react";
import { supabase } from "../lib/supabase";

export default function SubscribeForm() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");
    
    if (!validateEmail(email)) {
      setMessage("Please enter a valid email address.");
      return;
    }

    setIsLoading(true);

    const { data, error } = await supabase
      .from(process.env.NEXT_PUBLIC_SUPABASE_SUBSCRIBERS_TABLE || "subscribers")
      .insert([{ email }]);

    if (error) {
      if (error.code === "23505") {
        setMessage("You're already subscribed!");
      } else {
        setMessage("Subscription failed. Please try again.");
        console.error("Subscription Error:", error.message);
      }
    } else {
      setMessage("Thank you for subscribing!");
      setEmail(""); // Clear input after successful subscription
    }

    setIsLoading(false);
  };

  return (
    <div className="card">
      <h2 className="text-2xl font-bold text-text mb-4">Subscribe to Our Newsletter</h2>
      <p className="text-text-muted mb-6">Get notified about new recipes and cooking tips!</p>
      <form onSubmit={handleSubscribe} className="space-y-4">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          className="input-field"
          required
        />
        <button 
          type="submit"
          className="btn-primary w-full"
          disabled={isLoading}
        >
          {isLoading ? "Subscribing..." : "Subscribe"}
        </button>
      </form>
      {message && <p className="mt-2 text-sm">{message}</p>}
    </div>
  );
}

// ✅ Email Validation Function
const validateEmail = (email: string) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};
