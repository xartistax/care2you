import { doublePrecision, jsonb, pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core';

// This file defines the structure of your database tables using the Drizzle ORM.

// To modify the database schema:
// 1. Update this file with your desired changes.
// 2. Generate a new migration by running: `npm run db:generate`

// The generated migration file will reflect your schema changes.
// The migration is automatically applied during the next database interaction,
// so there's no need to run it manually or restart the Next.js server.

export const servicesSchema = pgTable('services', {
  id: serial('id').primaryKey(),
  title: text('title').notNull(), // Service title
  description: text('description').notNull(), // Detailed service description
  price: doublePrecision('price').notNull(), // Price of the service in cents (or adjust as needed)
  priceType: text('priceType').notNull(),
  status: text('status').default('available').notNull(), // Status of the service (e.g., available, unavailable)
  userId: text('user_id').notNull(), // Foreign key to associate a service with a user
  image: text('image'),
  calendly: text('calendly'), // Calendly link for booking
  workingHours: jsonb('working_hours').notNull().default('{}'), // JSONB to store working hours per day
  location: jsonb('location').notNull().default('{}'), // JSONB to store address details
  updatedAt: timestamp('updated_at', { mode: 'date' })
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
  createdAt: timestamp('created_at', { mode: 'date' }).defaultNow().notNull(),
});
