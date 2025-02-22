import { NextApiRequest, NextApiResponse } from "next";
import { supabase } from "../lib/supabase";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).end();

  const { postTitle, postLink } = req.body;

  // Fetch all subscribers
  const { data: subscribers } = await supabase.from("subscribers").select("email");

  if (!subscribers) return res.status(400).json({ message: "No subscribers found" });

  // Send emails via Brevo
  const response = await fetch("https://api.brevo.com/v3/smtp/email", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "api-key": process.env.BREVO_API_KEY!,
    },
    body: JSON.stringify({
      sender: { email: "sneghaa@arwindpianist.store", name: "Askitchen" },
      to: subscribers.map((sub) => ({ email: sub.email })),
      subject: `New Recipe: ${postTitle}`,
      htmlContent: `<p>Check out our new recipe: <a href="${postLink}">${postTitle}</a></p>`,
    }),
  });

  res.status(response.ok ? 200 : 500).json({ message: "Emails sent" });
}
