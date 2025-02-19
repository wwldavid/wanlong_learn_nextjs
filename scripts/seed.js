import bcrypt from "bcryptjs";
import dotenv from "dotenv";
dotenv.config();

import { db } from "@vercel/postgres";
import {
  users,
  customers,
  invoices,
  revenue,
} from "../app/lib/placeholder-data.js"; // Add `.js` at the end
async function seedDatabase() {
  console.log("Seeding database...");

  try {
    const client = await db.connect(); // Connect to the database

    // 1️⃣ Create tables if they don't exist
    await client.sql`
      CREATE TABLE IF NOT EXISTS users (
        id UUID PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL
      );
    `;

    await client.sql`
      CREATE TABLE IF NOT EXISTS customers (
        id UUID PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        image_url TEXT
      );
    `;

    await client.sql`
      CREATE TABLE IF NOT EXISTS invoices (
        id SERIAL PRIMARY KEY,
        customer_id UUID REFERENCES customers(id),
        amount INTEGER NOT NULL,
        status TEXT NOT NULL,
        date DATE NOT NULL
      );
    `;

    await client.sql`
      CREATE TABLE IF NOT EXISTS revenue (
        month TEXT PRIMARY KEY,
        revenue INTEGER NOT NULL
      );
    `;

    // 2️⃣ Insert data into users table
    for (const user of users) {
      await client.sql`DELETE FROM users;`;
      const hashedPassword = await bcrypt.hash(user.password, 10);
      await client.sql`
        INSERT INTO users (id, name, email, password)
        VALUES (${user.id}, ${user.name}, ${user.email}, ${hashedPassword})
        ON CONFLICT (id) DO NOTHING;
      `;
    }

    // 3️⃣ Insert data into customers table
    for (const customer of customers) {
      await client.sql`
        INSERT INTO customers (id, name, email, image_url)
        VALUES (${customer.id}, ${customer.name}, ${customer.email}, ${customer.image_url})
        ON CONFLICT (id) DO NOTHING;
      `;
    }

    // 4️⃣ Insert data into invoices table
    for (const invoice of invoices) {
      await client.sql`
        INSERT INTO invoices (customer_id, amount, status, date)
        VALUES (${invoice.customer_id}, ${invoice.amount}, ${invoice.status}, ${invoice.date})
        ON CONFLICT (id) DO NOTHING;
      `;
    }

    // 5️⃣ Insert data into revenue table
    for (const rev of revenue) {
      await client.sql`
        INSERT INTO revenue (month, revenue)
        VALUES (${rev.month}, ${rev.revenue})
        ON CONFLICT (month) DO NOTHING;
      `;
    }

    console.log("✅ Database seeding complete!");
  } catch (error) {
    console.error("❌ Error seeding database:", error);
  } finally {
    process.exit(); // Ensure script exits after completion
  }
}

seedDatabase();
