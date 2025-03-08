import type { Express } from "express";
import { createServer } from "http";
import { storage } from "./storage";
import { insertContactSchema, insertNewsletterSchema, insertSignupSchema } from "@shared/schema";

export async function registerRoutes(app: Express) {
  app.post("/api/contact", async (req, res) => {
    try {
      const contactData = insertContactSchema.parse(req.body);
      const contact = await storage.createContact(contactData);
      res.json(contact);
    } catch (error) {
      res.status(400).json({ message: error instanceof Error ? error.message : "Invalid request" });
    }
  });

  app.post("/api/newsletter", async (req, res) => {
    try {
      const newsletterData = insertNewsletterSchema.parse(req.body);
      const newsletter = await storage.subscribeNewsletter(newsletterData);
      res.json(newsletter);
    } catch (error) {
      res.status(400).json({ message: error instanceof Error ? error.message : "Invalid request" });
    }
  });

  app.post("/api/signup", async (req, res) => {
    try {
      const signupData = insertSignupSchema.parse(req.body);
      const signup = await storage.createSignup(signupData);
      res.json(signup);
    } catch (error) {
      res.status(400).json({ message: error instanceof Error ? error.message : "Invalid request" });
    }
  });

  return createServer(app);
}