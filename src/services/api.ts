import { ChatRequest, ChatResponse, Message } from '../types/chat';
const RAW_API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_API_URL || '';
const API_BASE_URL = RAW_API_BASE_URL ? RAW_API_BASE_URL.replace(/\/+$/, '') : (typeof window !== 'undefined' ? '' : 'http://localhost:8000');

export const chatApi = {
  async sendMessage(request: ChatRequest): Promise<ChatResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/chat/send`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error sending message:', error);
      // For development: Mock response if backend is offline
      return {
        answer: 'Xin lỗi, hiện tại tôi không thể kết nối tới máy chủ (Backend chưa hoạt động). Vui lòng thử lại sau!',
        intent: 'GREETING',
        from_cache: false,
        elapsed_time: 0.05,
        num_docs: 0,
        context_docs: [],
        timing: { "mock_delay": 0.05 }
      };
    }
  },

  async getHistory(sessionId: string): Promise<Message[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/chat/history/${sessionId}`);

      if (!response.ok) {
        if (response.status === 404) return [];
        throw new Error(`API error: ${response.statusText}`);
      }

      const data = await response.json();
      const messages = Array.isArray(data) ? data : (data.messages || []);
      // Map database format created_at / role to Message format if needed
      return messages.map((m: any, idx: number) => ({
        id: m.id || `hist-${idx}`,
        role: m.role,
        content: m.content,
        timestamp: m.created_at ? new Date(m.created_at).getTime() : Date.now()
      }));
    } catch (error) {
      console.error('Error fetching history:', error);
      return [];
    }
  }
};

