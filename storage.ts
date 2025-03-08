import { contacts, newsletters, signups, users, type Contact, type InsertContact, type Newsletter, type InsertNewsletter, type Signup, type InsertSignup, type User, type InsertUser } from "@shared/schema";
import session from "express-session";
import createMemoryStore from "memorystore";

const MemoryStore = createMemoryStore(session);

export interface IStorage {
  createContact(contact: InsertContact): Promise<Contact>;
  subscribeNewsletter(newsletter: InsertNewsletter): Promise<Newsletter>;
  createSignup(signup: InsertSignup): Promise<Signup>;

  // User Operations
  createUser(user: InsertUser): Promise<User>;
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;

  // Session Store
  sessionStore: session.Store;
}

export class MemStorage implements IStorage {
  private contacts: Map<number, Contact>;
  private newsletters: Map<number, Newsletter>;
  private signups: Map<number, Signup>;
  private users: Map<number, User>;
  private currentContactId: number;
  private currentNewsletterId: number;
  private currentSignupId: number;
  private currentUserId: number;
  readonly sessionStore: session.Store;

  constructor() {
    this.contacts = new Map();
    this.newsletters = new Map();
    this.signups = new Map();
    this.users = new Map();
    this.currentContactId = 1;
    this.currentNewsletterId = 1;
    this.currentSignupId = 1;
    this.currentUserId = 1;
    this.sessionStore = new MemoryStore({
      checkPeriod: 86400000 // prune expired entries every 24h
    });
  }

  async createContact(insertContact: InsertContact): Promise<Contact> {
    const id = this.currentContactId++;
    const contact: Contact = { id, ...insertContact };
    this.contacts.set(id, contact);
    return contact;
  }

  async subscribeNewsletter(insertNewsletter: InsertNewsletter): Promise<Newsletter> {
    const existing = Array.from(this.newsletters.values()).find(
      n => n.email === insertNewsletter.email
    );
    if (existing) {
      throw new Error("Email already subscribed");
    }

    const id = this.currentNewsletterId++;
    const newsletter: Newsletter = { id, ...insertNewsletter };
    this.newsletters.set(id, newsletter);
    return newsletter;
  }

  async createSignup(insertSignup: InsertSignup): Promise<Signup> {
    const id = this.currentSignupId++;
    const signup: Signup = { 
      id, 
      ...insertSignup,
      createdAt: new Date() 
    };
    this.signups.set(id, signup);
    return signup;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const existingUsername = await this.getUserByUsername(insertUser.username);
    if (existingUsername) {
      throw new Error("Username already exists");
    }

    const existingEmail = await this.getUserByEmail(insertUser.email);
    if (existingEmail) {
      throw new Error("Email already exists");
    }

    const id = this.currentUserId++;
    const user: User = {
      id,
      ...insertUser,
      role: "client",
      createdAt: new Date()
    };
    this.users.set(id, user);
    return user;
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      user => user.username.toLowerCase() === username.toLowerCase()
    );
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      user => user.email.toLowerCase() === email.toLowerCase()
    );
  }
}

export const storage = new MemStorage();