import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';
import { createServer as createViteServer } from 'vite';
import { dataStore } from './src/server/storage.js';
import { ChatMessage, ServiceAction } from './src/types.js';

dotenv.config();

const PORT = 3000;
const RAW_ADMIN_PASS = (process.env.ADMIN_PASSWORD || 'concierge2025').replace(/['"]+/g, '').trim();

// Lazy GenAI Client
let genAIClient: GoogleGenAI | null = null;
function getGenAI(): GoogleGenAI {
  if (!genAIClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.warn('GEMINI_API_KEY is not set. Gemini API calls will use fallback responses.');
    }
    genAIClient = new GoogleGenAI({
      apiKey: apiKey || 'dummy-key-for-initialization',
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return genAIClient;
}

async function startServer() {
  const app = express();
  app.use(express.json());

  // CORS & Iframe Embedding Headers (for WordPress & external integration)
  app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    // Allow embedding in WordPress iframe
    res.removeHeader('X-Frame-Options');
    res.setHeader('Content-Security-Policy', "frame-ancestors *");
    if (req.method === 'OPTIONS') {
      return res.sendStatus(200);
    }
    next();
  });

  // Health check
  app.get('/api/health', (_req, res) => {
    res.json({ status: 'ok', service: 'Agent Concierge API', timestamp: new Date().toISOString() });
  });

  // Serve Widget JS directly with CORS for WordPress and external websites
  app.get('/widget.js', (_req, res) => {
    res.setHeader('Content-Type', 'application/javascript');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.sendFile(path.join(process.cwd(), 'public', 'widget.js'));
  });

  // Admin Authentication
  app.post('/api/admin/login', (req, res) => {
    const { password } = req.body;
    if (!password) {
      return res.status(400).json({ error: 'Password is required' });
    }

    const inputPass = String(password).trim().toLowerCase();
    const validPass = RAW_ADMIN_PASS.toLowerCase();

    // Accept configured password, default 'concierge2025', or common defaults 'admin', 'concierge'
    if (inputPass === validPass || inputPass === 'concierge2025' || inputPass === 'admin') {
      const token = `token_admin_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
      return res.json({ 
        success: true, 
        token, 
        user: { role: 'admin', name: 'Concierge Manager' } 
      });
    }
    return res.status(401).json({ 
      error: 'Incorrect password. The default panel password is: concierge2025' 
    });
  });

  // 1. Agent Configuration Endpoints
  app.get('/api/agent-config', (_req, res) => {
    try {
      const config = dataStore.getAgentConfig();
      res.json(config);
    } catch (err: any) {
      res.status(500).json({ error: err.message || 'Error loading agent configuration' });
    }
  });

  app.put('/api/agent-config', (req, res) => {
    try {
      const updates = req.body;
      const updated = dataStore.updateAgentConfig(updates);
      res.json(updated);
    } catch (err: any) {
      res.status(500).json({ error: err.message || 'Error saving agent configuration' });
    }
  });

  app.post('/api/agent-config/reset', (_req, res) => {
    try {
      const reset = dataStore.resetAgentConfig();
      res.json(reset);
    } catch (err: any) {
      res.status(500).json({ error: err.message || 'Error resetting agent configuration' });
    }
  });

  // 2. Knowledge Base Endpoints (CRUD)
  app.get('/api/knowledge-base', (req, res) => {
    try {
      const { category, q } = req.query;
      const items = dataStore.getKnowledgeItems(category as string, q as string);
      res.json(items);
    } catch (err: any) {
      res.status(500).json({ error: err.message || 'Error fetching knowledge base' });
    }
  });

  app.post('/api/knowledge-base', (req, res) => {
    try {
      const { title, category, content, tags, isActive, priority } = req.body;
      if (!title || !content || !category) {
        return res.status(400).json({ error: 'Title, category, and content are required' });
      }
      const newItem = dataStore.addKnowledgeItem({
        title,
        category,
        content,
        tags: Array.isArray(tags) ? tags : (typeof tags === 'string' ? tags.split(',').map(t => t.trim()) : []),
        isActive: isActive !== undefined ? Boolean(isActive) : true,
        priority: priority || 'normal',
      });
      res.status(201).json(newItem);
    } catch (err: any) {
      res.status(500).json({ error: err.message || 'Error creating knowledge base item' });
    }
  });

  app.put('/api/knowledge-base/:id', (req, res) => {
    try {
      const { id } = req.params;
      const updates = req.body;
      if (updates.tags && typeof updates.tags === 'string') {
        updates.tags = updates.tags.split(',').map((t: string) => t.trim());
      }
      const updated = dataStore.updateKnowledgeItem(id, updates);
      if (!updated) {
        return res.status(404).json({ error: 'Item not found' });
      }
      res.json(updated);
    } catch (err: any) {
      res.status(500).json({ error: err.message || 'Error updating item' });
    }
  });

  app.delete('/api/knowledge-base/:id', (req, res) => {
    try {
      const { id } = req.params;
      const deleted = dataStore.deleteKnowledgeItem(id);
      if (!deleted) {
        return res.status(404).json({ error: 'Item not found' });
      }
      res.json({ success: true, message: 'Item deleted successfully' });
    } catch (err: any) {
      res.status(500).json({ error: err.message || 'Error deleting item' });
    }
  });

  app.post('/api/knowledge-base/seed', (_req, res) => {
    try {
      const items = dataStore.seedDefaultKnowledge();
      res.json({ success: true, items });
    } catch (err: any) {
      res.status(500).json({ error: err.message || 'Error restoring default knowledge base' });
    }
  });

  // 3. Conversation Logs Endpoints
  app.get('/api/conversation-logs', (req, res) => {
    try {
      const { q, sentiment } = req.query;
      const logs = dataStore.getConversationSessions(q as string, sentiment as string);
      res.json(logs);
    } catch (err: any) {
      res.status(500).json({ error: err.message || 'Error fetching conversation logs' });
    }
  });

  app.get('/api/conversation-logs/:id', (req, res) => {
    try {
      const { id } = req.params;
      const log = dataStore.getConversationSession(id);
      if (!log) {
        return res.status(404).json({ error: 'Conversation not found' });
      }
      res.json(log);
    } catch (err: any) {
      res.status(500).json({ error: err.message || 'Error fetching conversation' });
    }
  });

  app.delete('/api/conversation-logs/:id', (req, res) => {
    try {
      const { id } = req.params;
      const deleted = dataStore.deleteConversationSession(id);
      if (!deleted) {
        return res.status(404).json({ error: 'Conversation not found' });
      }
      res.json({ success: true, message: 'Conversation record removed' });
    } catch (err: any) {
      res.status(500).json({ error: err.message || 'Error deleting conversation' });
    }
  });

  // 4. Admin Analytics Stats
  app.get('/api/admin/stats', (_req, res) => {
    try {
      const stats = dataStore.getAdminStats();
      res.json(stats);
    } catch (err: any) {
      res.status(500).json({ error: err.message || 'Error fetching statistics' });
    }
  });

  // 5. Intelligent AI Chat Endpoint (Server-Side Gemini Integration in English)
  app.post('/api/chat', async (req, res) => {
    try {
      const { message, sessionId, guestInfo, history, toneOverride } = req.body;

      if (!message || typeof message !== 'string') {
        return res.status(400).json({ error: 'Message is required' });
      }

      const activeSessionId = sessionId || `session_${Date.now()}`;
      const guestName = guestInfo?.name || 'VIP Guest';
      const guestRoom = guestInfo?.room || 'Private Suite';

      // 1. Fetch current Agent Configuration & active Knowledge Base
      const config = dataStore.getAgentConfig();
      const activeKnowledge = config.enableKnowledgeBase ? dataStore.getActiveKnowledgeItems() : [];

      // 2. Build tone instructions in English
      const selectedTone = toneOverride || config.tone;
      let toneInstructions = '';
      switch (selectedTone) {
        case 'luxury_classic':
          toneInstructions = 'Tone: Exceptionally refined, ceremonial, impeccably courteous, utilizing aristocratic British & French luxury hospitality vernacular.';
          break;
        case 'modern_executive':
          toneInstructions = 'Tone: Agile, concise, sophisticated, discreet, and focused on maximum efficiency and precision.';
          break;
        case 'sommelier':
          toneInstructions = 'Tone: Elegant, passionate about Haute Gastronomy, detailing tasting notes, rare vintages, and bespoke culinary pairings.';
          break;
        case 'resort_leisure':
          toneInstructions = 'Tone: Warm, restorative, welcoming, inviting, and dedicated to serene relaxation and bespoke leisure.';
          break;
        default:
          toneInstructions = 'Tone: Sophisticated, refined, and courteous.';
      }

      // 3. Format Knowledge Base for Grounding in English
      let knowledgeText = '';
      if (activeKnowledge.length > 0) {
        knowledgeText = `\n\n### OFFICIAL HOTEL KNOWLEDGE BASE (Use this verified information with priority):\n` +
          activeKnowledge.map(k => `[${k.category.toUpperCase()}] ${k.title}:\n${k.content}\nTags: ${k.tags.join(', ')}`).join('\n\n');
      }

      // 4. Assemble comprehensive System Instruction in English
      const fullSystemInstruction = `${config.systemPrompt}

Current Property: ${config.hotelName}
Current Guest Name: ${guestName}
Current Room / Suite: ${guestRoom}
${toneInstructions}
${knowledgeText}

### CRITICAL BEHAVIORAL DIRECTIVES:
1. **Language Requirement**: You MUST converse entirely in elegant, polished, and natural English at all times.
2. **Actionable Hospitality**: If the guest requests a table reservation, spa appointment, chauffeur transfer, butler service, or in-suite dining, provide immediate, delightful solutions and confirm the details with utmost grace.
3. **Impeccable Character**: Never break character as the Master Luxury Concierge.
4. **Readability & Formatting**: Use tasteful markdown, paragraph spacing, and bullet points when presenting options or confirmation summaries.`;

      // 5. Construct conversation turns for Gemini
      const previousTurns: { role: 'user' | 'model'; parts: { text: string }[] }[] = [];
      if (Array.isArray(history)) {
        for (const h of history.slice(-8)) {
          if (h.role === 'user') {
            previousTurns.push({ role: 'user', parts: [{ text: h.content }] });
          } else if (h.role === 'assistant') {
            previousTurns.push({ role: 'model', parts: [{ text: h.content }] });
          }
        }
      }

      // Append current user message
      previousTurns.push({ role: 'user', parts: [{ text: message }] });

      // 6. Record user message in logs
      const userChatMessage: ChatMessage = {
        id: `msg_${Date.now()}_u`,
        role: 'user',
        content: message,
        timestamp: new Date().toISOString(),
      };
      dataStore.recordChatMessage(activeSessionId, userChatMessage, {
        userName: guestName,
        guestRoom,
        sentiment: 'inquiry',
      });

      // 7. Call Gemini API
      let replyText = '';
      try {
        const ai = getGenAI();
        const response = await ai.models.generateContent({
          model: 'gemini-3.7-flash',
          contents: previousTurns,
          config: {
            systemInstruction: fullSystemInstruction,
            temperature: config.temperature ?? 0.7,
          },
        });

        replyText = response.text || `It is my distinct honor to assist you, ${guestName}. How may I further personalize your stay this evening?`;
      } catch (geminiError: any) {
        console.error('Gemini API Error:', geminiError);
        // Fallback response in English if API key is missing or offline
        replyText = `With the greatest pleasure, ${guestName}. I have received your request with priority. Our Concierge team at ${config.hotelName} is entirely at your disposal to coordinate every detail with the utmost distinction and comfort.`;
      }

      // 8. Detect potential service actions and topics in English
      const actions: ServiceAction[] = [];
      const lowerReply = replyText.toLowerCase() + ' ' + message.toLowerCase();

      if (lowerReply.includes('reserva') || lowerReply.includes('table') || lowerReply.includes('dinner') || lowerReply.includes('le miroir') || lowerReply.includes('restaurant')) {
        actions.push({
          id: `act_${Date.now()}_1`,
          type: 'reservation',
          title: 'Table Reservation at Le Miroir',
          description: 'Fine dining table at 3-Michelin-starred restaurant',
          status: 'pending',
          details: { venue: 'Le Miroir', status: 'Awaiting seating confirmation' }
        });
      }

      if (lowerReply.includes('spa') || lowerReply.includes('massage') || lowerReply.includes('élixir') || lowerReply.includes('ritual')) {
        actions.push({
          id: `act_${Date.now()}_2`,
          type: 'spa',
          title: 'L\'Élixir Spa Appointment',
          description: 'Signature restorative wellness therapy',
          status: 'pending',
          details: { sanctuary: 'L\'Élixir Spa', treatment: 'Royal Wellness Ritual' }
        });
      }

      if (lowerReply.includes('transfer') || lowerReply.includes('airport') || lowerReply.includes('maybach') || lowerReply.includes('chauffeur') || lowerReply.includes('helipad')) {
        actions.push({
          id: `act_${Date.now()}_3`,
          type: 'transfer',
          title: 'Private Chauffeur Transfer',
          description: 'Executive vehicle with bilingual chauffeur at your service',
          status: 'pending',
          details: { fleet: 'Mercedes-Maybach S-Class', service: 'VIP Airport Transfer' }
        });
      }

      let detectedTopic = 'General Concierge';
      if (lowerReply.includes('restaurant') || lowerReply.includes('dinner') || lowerReply.includes('wine') || lowerReply.includes('menu') || lowerReply.includes('miroir')) {
        detectedTopic = 'Fine Dining & Wine';
      } else if (lowerReply.includes('spa') || lowerReply.includes('massage') || lowerReply.includes('pool') || lowerReply.includes('wellness')) {
        detectedTopic = 'Spa & Wellness';
      } else if (lowerReply.includes('transfer') || lowerReply.includes('airport') || lowerReply.includes('flight') || lowerReply.includes('maybach')) {
        detectedTopic = 'Chauffeur & Transfers';
      } else if (lowerReply.includes('suite') || lowerReply.includes('room') || lowerReply.includes('check') || lowerReply.includes('penthouse')) {
        detectedTopic = 'Suites & Accommodations';
      }

      // 9. Record Assistant response in logs
      const assistantChatMessage: ChatMessage = {
        id: `msg_${Date.now()}_a`,
        role: 'assistant',
        content: replyText,
        timestamp: new Date().toISOString(),
        actions: actions.length > 0 ? actions : undefined,
        topic: detectedTopic,
        sentiment: 'positive',
      };

      dataStore.recordChatMessage(activeSessionId, assistantChatMessage, {
        userName: guestName,
        guestRoom,
        topic: detectedTopic,
        sentiment: 'positive',
      });

      return res.json({
        reply: replyText,
        actions: actions.length > 0 ? actions : undefined,
        topic: detectedTopic,
        sessionId: activeSessionId,
      });
    } catch (err: any) {
      console.error('Server chat endpoint error:', err);
      res.status(500).json({ error: err.message || 'Error processing concierge message' });
    }
  });

  // Vite Middleware for development & Static file serving for production
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`✨ Agent Concierge Server running on http://localhost:${PORT}`);
  });
}

startServer().catch(err => {
  console.error('Failed to start server:', err);
});
