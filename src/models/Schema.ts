import { doublePrecision, jsonb, pgEnum, pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core';

// Define the enum type explicitly first
export const PriceTypeEnum = pgEnum('priceTypeEnum', ['fix', 'hourly']);

export const servicesSchema = pgTable('services', {
  id: serial('id').primaryKey(),
  title: text('title').notNull(), // Service title
  description: text('description').notNull(), // Detailed service description
  price: doublePrecision('price').notNull(), // Price of the service in cents (or adjust as needed)
  priceType: PriceTypeEnum('priceType').notNull(), // Use the defined enum
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
