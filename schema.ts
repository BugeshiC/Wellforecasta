import { pgTable, text, serial, timestamp, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const contacts = pgTable("contacts", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  company: text("company").notNull(),
  message: text("message").notNull(),
});

export const newsletters = pgTable("newsletters", {
  id: serial("id").primaryKey(),
  email: text("email").notNull().unique(),
});

export const signups = pgTable("signups", {
  id: serial("id").primaryKey(),
  companyName: text("company_name").notNull(),
  companySize: text("company_size").notNull(),
  industry: text("industry").notNull(),
  fullName: text("full_name").notNull(),
  email: text("email").notNull(),
  position: text("position").notNull(),
  phone: text("phone").notNull(),
  businessNeeds: text("business_needs").array().notNull(),
  additionalInfo: text("additional_info"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  companyName: text("company_name").notNull(),
  role: text("role").notNull().default("client"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertContactSchema = createInsertSchema(contacts).pick({
  name: true,
  email: true,
  company: true,
  message: true,
});

export const insertNewsletterSchema = createInsertSchema(newsletters).pick({
  email: true,
});

export const insertSignupSchema = createInsertSchema(signups).pick({
  companyName: true,
  companySize: true,
  industry: true,
  fullName: true,
  email: true,
  position: true,
  phone: true,
  businessNeeds: true,
  additionalInfo: true,
});

export const insertUserSchema = createInsertSchema(users)
  .pick({
    username: true,
    email: true,
    password: true,
    companyName: true,
  })
  .extend({
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export const loginSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
});

export type Contact = typeof contacts.$inferSelect;
export type InsertContact = z.infer<typeof insertContactSchema>;
export type Newsletter = typeof newsletters.$inferSelect;
export type InsertNewsletter = z.infer<typeof insertNewsletterSchema>;
export type Signup = typeof signups.$inferSelect;
export type InsertSignup = z.infer<typeof insertSignupSchema>;
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type LoginData = z.infer<typeof loginSchema>;