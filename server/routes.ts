import type { Express } from "express";
import { createServer, type Server } from "http";
import { WebSocketServer, WebSocket } from "ws";
import { storage } from "./storage";
import { setupAuth } from "./auth";
import { insertMoodEntrySchema, insertChatMessageSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Setup authentication routes
  setupAuth(app);

  // Mood tracking endpoints
  app.post("/api/mood", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    
    try {
      const validatedData = insertMoodEntrySchema.parse(req.body);
      const moodEntry = await storage.createMoodEntry({
        ...validatedData,
        userId: req.user!.id,
      });

      // Update user streak
      const user = await storage.getUser(req.user!.id);
      if (user) {
        await storage.updateUserStreak(user.id, user.streak + 1);
      }

      // Check for crisis
      if (validatedData.moodLevel <= 2) {
        await storage.createCrisisAlert(req.user!.id, validatedData.moodLevel, validatedData.notes || undefined);
      }

      // Check for achievements
      if (user && user.streak > 0 && (user.streak + 1) % 7 === 0) {
        await storage.createAchievement(
          user.id,
          "daily-tracker",
          "Daily Tracker",
          `${user.streak + 1} days in a row`,
          "fas fa-calendar-check"
        );
      }

      res.json(moodEntry);
    } catch (error) {
      console.error("Mood entry error:", error);
      res.status(400).json({ error: "Invalid mood data" });
    }
  });

  app.get("/api/mood/history", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    
    try {
      const entries = await storage.getUserMoodEntries(req.user!.id);
      res.json(entries);
    } catch (error) {
      console.error("Mood history error:", error);
      res.status(500).json({ error: "Failed to fetch mood history" });
    }
  });

  app.get("/api/mood/today", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    
    try {
      const entry = await storage.getTodayMoodEntry(req.user!.id);
      res.json(entry || null);
    } catch (error) {
      console.error("Today mood error:", error);
      res.status(500).json({ error: "Failed to fetch today's mood" });
    }
  });

  // Chat endpoints
  app.post("/api/chat/session", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    
    try {
      // Check for existing active session
      const existingSession = await storage.getActiveChatSession(req.user!.id);
      if (existingSession) {
        return res.json(existingSession);
      }

      const session = await storage.createChatSession({
        userId: req.user!.id,
        counselorId: null, // Anonymous for now
      });

      res.json(session);
    } catch (error) {
      console.error("Chat session error:", error);
      res.status(500).json({ error: "Failed to create chat session" });
    }
  });

  app.get("/api/chat/messages/:sessionId", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    
    try {
      const { sessionId } = req.params;
      const session = await storage.getChatSession(sessionId);
      
      if (!session || session.userId !== req.user!.id) {
        return res.sendStatus(403);
      }

      const messages = await storage.getChatMessages(sessionId);
      res.json(messages);
    } catch (error) {
      console.error("Chat messages error:", error);
      res.status(500).json({ error: "Failed to fetch messages" });
    }
  });

  // Achievements endpoint
  app.get("/api/achievements", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    
    try {
      const achievements = await storage.getUserAchievements(req.user!.id);
      res.json(achievements);
    } catch (error) {
      console.error("Achievements error:", error);
      res.status(500).json({ error: "Failed to fetch achievements" });
    }
  });

  const httpServer = createServer(app);

  // WebSocket server for real-time chat
  const wss = new WebSocketServer({ server: httpServer, path: '/ws' });

  wss.on('connection', (ws, req) => {
    console.log('WebSocket connection established');

    ws.on('message', async (data) => {
      try {
        const message = JSON.parse(data.toString());
        
        if (message.type === 'chat_message') {
          const validatedMessage = insertChatMessageSchema.parse({
            sessionId: message.sessionId,
            senderId: message.senderId,
            senderType: message.senderType,
            message: message.message,
          });

          const savedMessage = await storage.createChatMessage(validatedMessage);

          // Broadcast to all connected clients in the same session
          wss.clients.forEach((client) => {
            if (client.readyState === WebSocket.OPEN) {
              client.send(JSON.stringify({
                type: 'chat_message',
                message: savedMessage,
              }));
            }
          });
        }
      } catch (error) {
        console.error('WebSocket message error:', error);
        ws.send(JSON.stringify({
          type: 'error',
          message: 'Invalid message format',
        }));
      }
    });

    ws.on('close', () => {
      console.log('WebSocket connection closed');
    });
  });

  return httpServer;
}
