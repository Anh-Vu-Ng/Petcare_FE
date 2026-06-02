import { useState, useEffect, useRef } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Message } from '../types/chat';
import { chatApi } from '../services/api';
import { ChatStatus } from '../components/chat/StatusPuppy';

export function useChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [chatStatus, setChatStatus] = useState<ChatStatus>('idle');
  const [sessionId, setSessionId] = useState<string | null>(null);
  
  // Ref for the current stream content to handle React state updates
  const streamContentRef = useRef<string>('');

  useEffect(() => {
    // Initialize session
    let sid = sessionStorage.getItem('petcare_session_id');
    if (!sid) {
      sid = uuidv4();
      sessionStorage.setItem('petcare_session_id', sid);
    }
    setSessionId(sid);

    // Load history
    const loadHistory = async () => {
      if (sid) {
        setIsLoading(true);
        const history = await chatApi.getHistory(sid);
        if (history && history.length > 0) {
          setMessages(history);
        }
        setIsLoading(false);
      }
    };

    loadHistory();
  }, []);

  // Simulate typing effect for the response
  const simulateStreaming = async (
    fullText: string,
    messageId: string,
    metadata?: {
      intent?: string;
      from_cache?: boolean;
      elapsed_time?: number;
      num_docs?: number;
      context_docs?: any[];
      price_data?: string;
      timing?: Record<string, number>;
      standalone_query?: string;
    }
  ) => {
    streamContentRef.current = '';
    const chunks = fullText.split(/(\s+)/); // Split by spaces to stream words
    
    // Create an initial empty message
    setMessages(prev => [...prev, {
      id: messageId,
      role: 'assistant',
      content: '',
      timestamp: Date.now()
    }]);

    for (let i = 0; i < chunks.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 15 + Math.random() * 20)); // Delay between words
      streamContentRef.current += chunks[i];
      
      setMessages(prev => prev.map(msg => 
        msg.id === messageId 
          ? { ...msg, content: streamContentRef.current } 
          : msg
      ));
    }

    // Attach metadata after streaming completes to avoid jumpy UI layouts
    if (metadata) {
      setMessages(prev => prev.map(msg => 
        msg.id === messageId 
          ? { ...msg, ...metadata } 
          : msg
      ));
    }
  };

  const sendMessage = async (content: string) => {
    if (!content.trim() || !sessionId) return;

    const userMsgId = uuidv4();
    const newUserMsg: Message = {
      id: userMsgId,
      role: 'user',
      content,
      timestamp: Date.now()
    };

    setMessages(prev => [...prev, newUserMsg]);
    setIsLoading(true);
    
    // 1. Chú cún hóng hớt: ngồi im, vểnh tai nghe ngóng
    setChatStatus('sending');
    await new Promise(resolve => setTimeout(resolve, 800));

    // 2. Xử lý RAG: vẫy đuôi chờ đợi sốt ruột
    setChatStatus('thinking');

    try {
      const response = await chatApi.sendMessage({
        session_id: sessionId,
        message: content
      });

      const botMsgId = uuidv4();
      const botAnswer = response.answer || response.message || '';
      
      // 3. Chữ bắt đầu xuất hiện: nhảy cẫng hân hoan
      setChatStatus('streaming');
      await simulateStreaming(botAnswer, botMsgId, {
        intent: response.intent,
        from_cache: response.from_cache,
        elapsed_time: response.elapsed_time,
        num_docs: response.num_docs,
        context_docs: response.context_docs,
        price_data: response.price_data,
        timing: response.timing,
        standalone_query: response.standalone_query,
      });
      
    } catch (error) {
      console.error(error);
      const errorMsgId = uuidv4();
      setMessages(prev => [...prev, {
        id: errorMsgId,
        role: 'assistant',
        content: 'Đã có lỗi xảy ra. Vui lòng thử lại sau.',
        timestamp: Date.now()
      }]);
    } finally {
      setIsLoading(false);
      setChatStatus('idle');
    }
  };

  const clearChat = () => {
    setMessages([]);
    // Generate new session ID to completely refresh context/memory on UI/Session level
    const newSid = uuidv4();
    sessionStorage.setItem('petcare_session_id', newSid);
    setSessionId(newSid);
  };

  return {
    messages,
    isLoading,
    sendMessage,
    chatStatus,
    clearChat
  };
}
