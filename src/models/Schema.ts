import { doublePrecision, jsonb, pgEnum, pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core';

// Define the enum type explicitly first

export const PriceType = pgEnum('priceType', ['fix', 'hourly']);

export const servicesSchema = pgTable('services', {
  id: serial('id').primaryKey(),
  internalId: text('internalId').notNull(),
  title: text('title').notNull(), // Service title
  description: text('description').notNull(), // Detailed service description
  category: text('category').notNull(),
  price: doublePrecision('price').notNull(), // Price of the service in cents (or adjust as needed)
  priceType: PriceType('priceType').notNull(), // Use the defined enum
  status: text('status').default('active').notNull(), // Status of the service (e.g., available, unavailable)
  userId: text('userId').notNull(), // Foreign key to associate a service with a user
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
