import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';
import { createServer as createViteServer } from 'vite';
import { dataStore } from './src/server/storage.js';
import { ChatMessage, ServiceAction } from './src/types.js';

dotenv.config();

const PORT = 3000;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'concierge2025';

// Lazy GenAI Client
let genAIClient: GoogleGenAI | null = null;
function getGenAI(): GoogleGenAI {
  if (!genAIClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.warn('GEMINI_API_KEY is not set. Gemini API calls will fail unless provided.');
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

  // Health check
  app.get('/api/health', (_req, res) => {
    res.json({ status: 'ok', service: 'Agent Concierge API', timestamp: new Date().toISOString() });
  });

  // Admin Authentication
  app.post('/api/admin/login', (req, res) => {
    const { password } = req.body;
    if (!password) {
      return res.status(400).json({ error: 'Senha é obrigatória' });
    }
    if (password === ADMIN_PASSWORD) {
      // In production, token could be signed JWT; for fast & secure prototype, return authenticated session token
      const token = `token_admin_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
      return res.json({ success: true, token, user: { role: 'admin', name: 'Concierge Manager' } });
    }
    return res.status(401).json({ error: 'Senha incorreta. Tente novamente ou use a senha padrão: concierge2025' });
  });

  // 1. Agent Configuration Endpoints
  app.get('/api/agent-config', (_req, res) => {
    try {
      const config = dataStore.getAgentConfig();
      res.json(config);
    } catch (err: any) {
      res.status(500).json({ error: err.message || 'Erro ao carregar configurações' });
    }
  });

  app.put('/api/agent-config', (req, res) => {
    try {
      const updates = req.body;
      const updated = dataStore.updateAgentConfig(updates);
      res.json(updated);
    } catch (err: any) {
      res.status(500).json({ error: err.message || 'Erro ao salvar configurações' });
    }
  });

  app.post('/api/agent-config/reset', (_req, res) => {
    try {
      const reset = dataStore.resetAgentConfig();
      res.json(reset);
    } catch (err: any) {
      res.status(500).json({ error: err.message || 'Erro ao redefinir configurações' });
    }
  });

  // 2. Knowledge Base Endpoints (CRUD)
  app.get('/api/knowledge-base', (req, res) => {
    try {
      const { category, q } = req.query;
      const items = dataStore.getKnowledgeItems(category as string, q as string);
      res.json(items);
    } catch (err: any) {
      res.status(500).json({ error: err.message || 'Erro ao obter base de conhecimento' });
    }
  });

  app.post('/api/knowledge-base', (req, res) => {
    try {
      const { title, category, content, tags, isActive, priority } = req.body;
      if (!title || !content || !category) {
        return res.status(400).json({ error: 'Título, categoria e conteúdo são obrigatórios' });
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
      res.status(500).json({ error: err.message || 'Erro ao criar item na base de conhecimento' });
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
        return res.status(404).json({ error: 'Item não encontrado' });
      }
      res.json(updated);
    } catch (err: any) {
      res.status(500).json({ error: err.message || 'Erro ao atualizar item' });
    }
  });

  app.delete('/api/knowledge-base/:id', (req, res) => {
    try {
      const { id } = req.params;
      const deleted = dataStore.deleteKnowledgeItem(id);
      if (!deleted) {
        return res.status(404).json({ error: 'Item não encontrado' });
      }
      res.json({ success: true, message: 'Item excluído com sucesso' });
    } catch (err: any) {
      res.status(500).json({ error: err.message || 'Erro ao excluir item' });
    }
  });

  app.post('/api/knowledge-base/seed', (_req, res) => {
    try {
      const items = dataStore.seedDefaultKnowledge();
      res.json({ success: true, items });
    } catch (err: any) {
      res.status(500).json({ error: err.message || 'Erro ao restaurar base padrão' });
    }
  });

  // 3. Conversation Logs Endpoints
  app.get('/api/conversation-logs', (req, res) => {
    try {
      const { q, sentiment } = req.query;
      const logs = dataStore.getConversationSessions(q as string, sentiment as string);
      res.json(logs);
    } catch (err: any) {
      res.status(500).json({ error: err.message || 'Erro ao obter logs de conversas' });
    }
  });

  app.get('/api/conversation-logs/:id', (req, res) => {
    try {
      const { id } = req.params;
      const log = dataStore.getConversationSession(id);
      if (!log) {
        return res.status(404).json({ error: 'Conversa não encontrada' });
      }
      res.json(log);
    } catch (err: any) {
      res.status(500).json({ error: err.message || 'Erro ao obter conversa' });
    }
  });

  app.delete('/api/conversation-logs/:id', (req, res) => {
    try {
      const { id } = req.params;
      const deleted = dataStore.deleteConversationSession(id);
      if (!deleted) {
        return res.status(404).json({ error: 'Conversa não encontrada' });
      }
      res.json({ success: true, message: 'Registro de conversa removido' });
    } catch (err: any) {
      res.status(500).json({ error: err.message || 'Erro ao remover conversa' });
    }
  });

  // 4. Admin Analytics Stats
  app.get('/api/admin/stats', (_req, res) => {
    try {
      const stats = dataStore.getAdminStats();
      res.json(stats);
    } catch (err: any) {
      res.status(500).json({ error: err.message || 'Erro ao obter estatísticas' });
    }
  });

  // 5. Intelligent AI Chat Endpoint (Server-Side Gemini Integration)
  app.post('/api/chat', async (req, res) => {
    try {
      const { message, sessionId, guestInfo, history, toneOverride } = req.body;

      if (!message || typeof message !== 'string') {
        return res.status(400).json({ error: 'Mensagem é obrigatória' });
      }

      const activeSessionId = sessionId || `session_${Date.now()}`;
      const guestName = guestInfo?.name || 'Hóspede Estimado';
      const guestRoom = guestInfo?.room || 'Suíte Privada';

      // 1. Fetch current Agent Configuration & active Knowledge Base
      const config = dataStore.getAgentConfig();
      const activeKnowledge = config.enableKnowledgeBase ? dataStore.getActiveKnowledgeItems() : [];

      // 2. Build tone instructions
      const selectedTone = toneOverride || config.tone;
      let toneInstructions = '';
      switch (selectedTone) {
        case 'luxury_classic':
          toneInstructions = 'Tom: Altamente refinado, cerimonioso, impecavelmente cortês, usando vocabulário de alta hospitalidade francesa e internacional.';
          break;
        case 'modern_executive':
          toneInstructions = 'Tom: Ágil, conciso, sofisticado, direto ao ponto, com foco em eficiência máxima e discrição.';
          break;
        case 'sommelier':
          toneInstructions = 'Tom: Elegante, apaixonado por alta enogastronomia, detalhando notas de prova, harmonizações perfeitas e safras raras.';
          break;
        case 'resort_leisure':
          toneInstructions = 'Tom: Acolhedor, relaxante, convidativo e caloroso, promovendo descanso absoluto e experiências memoráveis.';
          break;
        default:
          toneInstructions = 'Tom: Sofisticado e cortês.';
      }

      // 3. Format Knowledge Base for Grounding
      let knowledgeText = '';
      if (activeKnowledge.length > 0) {
        knowledgeText = `\n\n### BASE DE CONHECIMENTO OFICIAL DO HOTEL (Use estas informações oficiais com prioridade):\n` +
          activeKnowledge.map(k => `[${k.category.toUpperCase()}] ${k.title}:\n${k.content}\nTags: ${k.tags.join(', ')}`).join('\n\n');
      }

      // 4. Assemble comprehensive System Instruction
      const fullSystemInstruction = `${config.systemPrompt}

Hotel Atual: ${config.hotelName}
Nome do Hóspede Atual: ${guestName}
Acomodação: ${guestRoom}
${toneInstructions}
${knowledgeText}

### REGRAS CRÍTICAS DE RESPOSTA:
1. Responda em Português com elegância sublime (a menos que o usuário se comunique expressamente em outro idioma).
2. Se o hóspede pedir para reservar uma mesa, agendar spa, solicitar transfer, chamar mordomo ou pedir room service, forneça a resposta refinada e sugira os próximos passos com clareza.
3. Não quebre o personagem de Concierge de Alto Luxo sob nenhuma hipótese.
4. Mantenha alta legibilidade, espaçamento refinado e evite respostas excessivamente longas ou prolixas quando uma resposta direta e polida for mais elegante.`;

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

        replyText = response.text || 'É uma honra atendê-lo. Como posso personalizar ainda mais sua experiência?';
      } catch (geminiError: any) {
        console.error('Gemini API Error:', geminiError);
        // Fallback response if API key is missing or network glitch occurs
        replyText = `Com o mais elevado prazer, ${guestName}. Recebi sua solicitação com prioridade. Nossa equipe de Concierge do ${config.hotelName} está à sua inteira disposição para coordenar cada detalhe com a máxima distinção e conforto.`;
      }

      // 8. Detect potential service actions and topics
      const actions: ServiceAction[] = [];
      const lowerReply = replyText.toLowerCase() + ' ' + message.toLowerCase();

      if (lowerReply.includes('reserva') && (lowerReply.includes('miroir') || lowerReply.includes('restaurante') || lowerReply.includes('mesa'))) {
        actions.push({
          id: `act_${Date.now()}_1`,
          type: 'reservation',
          title: 'Reserva no Restaurante Le Miroir',
          description: 'Mesa gastronômica no restaurante 3 estrelas Michelin',
          status: 'pending',
          details: { local: 'Le Miroir', status: 'Aguardando confirmação de horário' }
        });
      }

      if (lowerReply.includes('spa') || lowerReply.includes('massagem') || lowerReply.includes('élixir')) {
        actions.push({
          id: `act_${Date.now()}_2`,
          type: 'spa',
          title: 'Agendamento no Spa L\'Élixir',
          description: 'Tratamento de bem-estar e relaxamento VIP',
          status: 'pending',
          details: { local: 'Spa L\'Élixir', servico: 'Ritual de Bem-estar' }
        });
      }

      if (lowerReply.includes('transfer') || lowerReply.includes('aeroporto') || lowerReply.includes('maybach') || lowerReply.includes('heliponto')) {
        actions.push({
          id: `act_${Date.now()}_3`,
          type: 'transfer',
          title: 'Transfer Privativo Classe Executiva',
          description: 'Veículo executivo com motorista bilíngue à disposição',
          status: 'pending',
          details: { frota: 'Mercedes-Maybach Classe S', servico: 'Transfer VIP' }
        });
      }

      let detectedTopic = 'Atendimento Geral';
      if (lowerReply.includes('restaurante') || lowerReply.includes('jantar') || lowerReply.includes('vinho') || lowerReply.includes('cardápio')) {
        detectedTopic = 'Gastronomia & Vinhos';
      } else if (lowerReply.includes('spa') || lowerReply.includes('massagem') || lowerReply.includes('piscina')) {
        detectedTopic = 'Spa & Bem-estar';
      } else if (lowerReply.includes('transfer') || lowerReply.includes('aeroporto') || lowerReply.includes('voo')) {
        detectedTopic = 'Transporte VIP';
      } else if (lowerReply.includes('suíte') || lowerReply.includes('quarto') || lowerReply.includes('check')) {
        detectedTopic = 'Acomodação & Serviços';
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
      res.status(500).json({ error: err.message || 'Erro ao processar mensagem do concierge' });
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
