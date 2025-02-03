ALTER TABLE "services" ALTER COLUMN "priceType" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "services" ALTER COLUMN "priceType" SET DEFAULT 'fix';--> statement-breakpoint
DROP TYPE "public"."priceType";