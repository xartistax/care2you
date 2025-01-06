CREATE TABLE IF NOT EXISTS "services" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"description" text NOT NULL,
	"price" double precision NOT NULL,
	"priceType" text NOT NULL,
	"status" text DEFAULT 'available' NOT NULL,
	"user_id" text NOT NULL,
	"image" text,
	"calendly" text,
	"working_hours" jsonb DEFAULT '{}' NOT NULL,
	"location" jsonb DEFAULT '{}' NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
