import { ChatRequest, ChatResponse, Message } from '../types/chat';

const API_BASE_URL = 'http://localhost:8000'; // Update this when backend is ready

export const chatApi = {
  async sendMessage(request: ChatRequest): Promise<ChatResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/chat`, {
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
        message: 'Xin lỗi, hiện tại tôi không thể kết nối tới máy chủ (Backend chưa hoạt động). Vui lòng thử lại sau!',
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
      return data.messages || [];
    } catch (error) {
      console.error('Error fetching history:', error);
      return [];
    }
  }
};
