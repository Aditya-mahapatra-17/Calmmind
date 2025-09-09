import { 
  users, 
  moodEntries, 
  chatSessions, 
  chatMessages, 
  achievements, 
  crisisAlerts,
  type User, 
  type InsertUser,
  type MoodEntry,
  type InsertMoodEntry,
  type ChatSession,
  type InsertChatSession,
  type ChatMessage,
  type InsertChatMessage,
  type Achievement,
  type CrisisAlert
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, and, sql, count } from "drizzle-orm";
import session from "express-session";
import connectPg from "connect-pg-simple";
import { pool } from "./db";

const PostgresSessionStore = connectPg(session);

export interface IStorage {
  // User management
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUserStreak(userId: string, streak: number): Promise<void>;
  
  // Mood tracking
  createMoodEntry(entry: InsertMoodEntry & { userId: string }): Promise<MoodEntry>;
  getUserMoodEntries(userId: string, limit?: number): Promise<MoodEntry[]>;
  getTodayMoodEntry(userId: string): Promise<MoodEntry | undefined>;
  
  // Chat system
  createChatSession(session: InsertChatSession & { userId: string }): Promise<ChatSession>;
  getChatSession(id: string): Promise<ChatSession | undefined>;
  getActiveChatSession(userId: string): Promise<ChatSession | undefined>;
  endChatSession(sessionId: string): Promise<void>;
  
  // Chat messages
  createChatMessage(message: InsertChatMessage): Promise<ChatMessage>;
  getChatMessages(sessionId: string): Promise<ChatMessage[]>;
  
  // Achievements
  getUserAchievements(userId: string): Promise<Achievement[]>;
  createAchievement(userId: string, type: string, title: string, description: string, icon: string): Promise<Achievement>;
  
  // Crisis support
  createCrisisAlert(userId: string, moodLevel: number, notes?: string): Promise<CrisisAlert>;
  
  sessionStore: session.Store;
}

export class DatabaseStorage implements IStorage {
  sessionStore: session.Store;

  constructor() {
    this.sessionStore = new PostgresSessionStore({ 
      pool, 
      createTableIfMissing: true 
    });
  }

  // User management
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values({
        ...insertUser,
        displayName: insertUser.displayName || insertUser.username,
      })
      .returning();
    return user;
  }

  async updateUserStreak(userId: string, streak: number): Promise<void> {
    await db
      .update(users)
      .set({ 
        streak,
        totalCheckIns: sql`${users.totalCheckIns} + 1`
      })
      .where(eq(users.id, userId));
  }

  // Mood tracking
  async createMoodEntry(entry: InsertMoodEntry & { userId: string }): Promise<MoodEntry> {
    const [moodEntry] = await db
      .insert(moodEntries)
      .values(entry)
      .returning();
    return moodEntry;
  }

  async getUserMoodEntries(userId: string, limit = 10): Promise<MoodEntry[]> {
    return await db
      .select()
      .from(moodEntries)
      .where(eq(moodEntries.userId, userId))
      .orderBy(desc(moodEntries.createdAt))
      .limit(limit);
  }

  async getTodayMoodEntry(userId: string): Promise<MoodEntry | undefined> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const [entry] = await db
      .select()
      .from(moodEntries)
      .where(
        and(
          eq(moodEntries.userId, userId),
          sql`${moodEntries.createdAt} >= ${today.toISOString()}`
        )
      )
      .orderBy(desc(moodEntries.createdAt))
      .limit(1);
    
    return entry || undefined;
  }

  // Chat system
  async createChatSession(session: InsertChatSession & { userId: string }): Promise<ChatSession> {
    const [chatSession] = await db
      .insert(chatSessions)
      .values(session)
      .returning();
    return chatSession;
  }

  async getChatSession(id: string): Promise<ChatSession | undefined> {
    const [session] = await db.select().from(chatSessions).where(eq(chatSessions.id, id));
    return session || undefined;
  }

  async getActiveChatSession(userId: string): Promise<ChatSession | undefined> {
    const [session] = await db
      .select()
      .from(chatSessions)
      .where(
        and(
          eq(chatSessions.userId, userId),
          eq(chatSessions.isActive, true)
        )
      )
      .orderBy(desc(chatSessions.createdAt))
      .limit(1);
    
    return session || undefined;
  }

  async endChatSession(sessionId: string): Promise<void> {
    await db
      .update(chatSessions)
      .set({ 
        isActive: false, 
        endedAt: new Date() 
      })
      .where(eq(chatSessions.id, sessionId));
  }

  // Chat messages
  async createChatMessage(message: InsertChatMessage): Promise<ChatMessage> {
    const [chatMessage] = await db
      .insert(chatMessages)
      .values(message)
      .returning();
    return chatMessage;
  }

  async getChatMessages(sessionId: string): Promise<ChatMessage[]> {
    return await db
      .select()
      .from(chatMessages)
      .where(eq(chatMessages.sessionId, sessionId))
      .orderBy(chatMessages.createdAt);
  }

  // Achievements
  async getUserAchievements(userId: string): Promise<Achievement[]> {
    return await db
      .select()
      .from(achievements)
      .where(eq(achievements.userId, userId))
      .orderBy(desc(achievements.unlockedAt));
  }

  async createAchievement(userId: string, type: string, title: string, description: string, icon: string): Promise<Achievement> {
    const [achievement] = await db
      .insert(achievements)
      .values({
        userId,
        type,
        title,
        description,
        icon,
      })
      .returning();
    return achievement;
  }

  // Crisis support
  async createCrisisAlert(userId: string, moodLevel: number, notes?: string): Promise<CrisisAlert> {
    const [alert] = await db
      .insert(crisisAlerts)
      .values({
        userId,
        moodLevel,
        notes,
      })
      .returning();
    return alert;
  }
}

export const storage = new DatabaseStorage();
