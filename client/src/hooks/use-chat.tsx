import { useEffect, useState, useCallback } from "react";
import { useAuth } from "./use-auth";
import { ChatMessage, ChatSession } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";

type ChatHook = {
  isConnected: boolean;
  session: ChatSession | null;
  messages: ChatMessage[];
  sendMessage: (message: string) => void;
  startSession: () => Promise<void>;
  isLoading: boolean;
  error: string | null;
};

export function useChat(): ChatHook {
  const { user } = useAuth();
  const [ws, setWs] = useState<WebSocket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [session, setSession] = useState<ChatSession | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const connectWebSocket = useCallback(() => {
    if (!user) return;

    const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
    const wsUrl = `${protocol}//${window.location.host}/ws`;
    const socket = new WebSocket(wsUrl);

    socket.onopen = () => {
      console.log("WebSocket connected");
      setIsConnected(true);
      setError(null);
    };

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      
      if (data.type === 'chat_message') {
        setMessages(prev => [...prev, data.message]);
      } else if (data.type === 'error') {
        setError(data.message);
      }
    };

    socket.onclose = () => {
      console.log("WebSocket disconnected");
      setIsConnected(false);
    };

    socket.onerror = (error) => {
      console.error("WebSocket error:", error);
      setError("Connection error occurred");
      setIsConnected(false);
    };

    setWs(socket);
  }, [user]);

  const startSession = async () => {
    if (!user) return;
    
    setIsLoading(true);
    setError(null);

    try {
      const res = await apiRequest("POST", "/api/chat/session");
      const newSession = await res.json();
      setSession(newSession);

      // Load existing messages
      const messagesRes = await apiRequest("GET", `/api/chat/messages/${newSession.id}`);
      const existingMessages = await messagesRes.json();
      setMessages(existingMessages);

      // Connect WebSocket if not already connected
      if (!ws || ws.readyState !== WebSocket.OPEN) {
        connectWebSocket();
      }
    } catch (error) {
      console.error("Failed to start chat session:", error);
      setError("Failed to start chat session");
    } finally {
      setIsLoading(false);
    }
  };

  const sendMessage = useCallback((message: string) => {
    if (!ws || !session || !user || ws.readyState !== WebSocket.OPEN) {
      setError("Not connected to chat");
      return;
    }

    const messageData = {
      type: 'chat_message',
      sessionId: session.id,
      senderId: user.id,
      senderType: 'user',
      message: message.trim(),
    };

    ws.send(JSON.stringify(messageData));
  }, [ws, session, user]);

  useEffect(() => {
    return () => {
      if (ws) {
        ws.close();
      }
    };
  }, [ws]);

  return {
    isConnected,
    session,
    messages,
    sendMessage,
    startSession,
    isLoading,
    error,
  };
}
