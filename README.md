
# 🥘 ASKitchen

[![Vercel Deployment](https://vercelbadge.vercel.app/api/Arwindpianist/askitchen)](https://askitchen.vercel.app/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

**ASKitchen** is a modern recipe-sharing website built with **Next.js 14**, **TypeScript**, **Tailwind CSS**, and **Supabase**.  
It provides a fast, minimal, and elegant way to browse, create, and subscribe to delicious recipes.

🌐 [Visit the live website →](https://askitchen.vercel.app/)
---

## 🛠 How It Was Built

ASKitchen was carefully crafted with a focus on simplicity, performance, and easy content management:

- **Frontend**:  
  Built using **Next.js 14 App Router** with **TypeScript** for strong typing and **Tailwind CSS** for flexible, responsive design.

- **Backend & Database**:  
  **Supabase** (an open-source Firebase alternative) handles database storage and API access for recipes and subscriptions.

- **Authentication**:  
  Admin access is restricted to specific email addresses hardcoded into the environment settings, keeping things lightweight and avoiding the need for a full auth system.

- **Deployment**:  
  The site is deployed on **Vercel**, leveraging its fast global CDN for excellent load times and instant updates.

---

## ⚙️ How the Website Works

- **Public Users**:
  - Can browse a curated collection of recipes.
  - Have the option to subscribe with their email to receive updates and special offers.

- **Admins** (authorized emails only):
  - Can log into a secure Admin Panel.
  - Create, update, and delete recipe entries.
  - Manage recipes directly through a simple, user-friendly interface.

- **Data Storage**:
  - Recipes and subscriber data are securely stored in **Supabase**.
  - No external CMS is needed — content is managed directly within the app.

- **Subscription System**:
  - Visitors are invited to subscribe to the mailing list through a simple subscribe wall.
  - Emails are stored in the database and can be used for future campaigns or notifications.

---

## 📂 Key Technologies

| Purpose              | Technology           |
|----------------------|-----------------------|
| Frontend Framework    | [Next.js 14](https://nextjs.org/) |
| Styling               | [Tailwind CSS](https://tailwindcss.com/) |
| Database & Backend    | [Supabase](https://supabase.com/) |
| Hosting               | [Vercel](https://vercel.com/) |
| Programming Language  | [TypeScript](https://www.typescriptlang.org/) |

---

## 📜 License

This project is open-sourced under the [MIT License](LICENSE).

---

> Built and maintained with ❤️ by [Arwindpianist Multimedia & Consulting](https://arwindpianist.store)

---