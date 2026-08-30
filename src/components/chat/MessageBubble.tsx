import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, 
  User, 
  Compass, 
  Clock, 
  FileText, 
  ChevronDown, 
  ChevronRight, 
  Search, 
  Wrench, 
  FileCode 
} from 'lucide-react';
import { Message } from '../../types/chat';
import { formatTime } from '../../utils/formatters';
import { cn } from '../ui/Button';

interface MessageBubbleProps {
  message: Message;
}

export function MessageBubble({ message }: MessageBubbleProps) {
  const isUser = message.role === 'user';
  const [isDocsOpen, setIsDocsOpen] = useState(false);
  const [isTimingOpen, setIsTimingOpen] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className={cn(
        "flex w-full mb-6 first:mt-2",
        isUser ? "justify-end" : "justify-start"
      )}
    >
      <div className={cn(
        "flex w-full max-w-[88%]",
        isUser ? "justify-end pl-4" : "justify-start pr-4"
      )}>
        {/* Cute Avatar */}
        <div className={cn(
          "flex-shrink-0 h-9 w-9 rounded-full flex items-center justify-center mt-1 shadow-sm border",
          isUser 
            ? "bg-amber-100 border-amber-200 text-amber-600 order-2 ml-3" 
            : "bg-gradient-to-tr from-teal-500 to-emerald-400 border-transparent text-white order-1 mr-3"
        )}>
          {isUser ? <User size={15} /> : <Sparkles size={15} />}
        </div>

        {/* Message Bubble & Time */}
        <div className={cn(
          "flex flex-col order-2",
          isUser ? "items-end order-1" : "items-start"
        )}>
          {/* Bubble wrapper */}
          <div className={cn(
            "px-4 py-3 rounded-2xl text-sm sm:text-base leading-relaxed shadow-sm border",
            isUser 
              ? "bg-teal-500 border-transparent text-white rounded-tr-sm" 
              : "bg-white border-slate-100 text-slate-800 rounded-tl-sm w-full"
          )}>
            {isUser ? (
              <div className="whitespace-pre-wrap">{message.content}</div>
            ) : (
              message.content === '' ? (
                /* Shimmering Placeholder Lines (Light theme) */
                <div className="space-y-3 py-1 w-[160px] sm:w-[320px]">
                  <div className="h-2.5 bg-slate-100 rounded-full w-full shimmer-loading" />
                  <div className="h-2.5 bg-slate-100 rounded-full w-[85%] shimmer-loading" />
                  <div className="h-2.5 bg-slate-100 rounded-full w-[60%] shimmer-loading" />
                </div>
              ) : (
                <>
                  <div className="prose prose-sm sm:prose-base max-w-none text-slate-800">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                      {String(message.content || '')}
                    </ReactMarkdown>
                  </div>
                  
                  {/* RAG Metadata (Fades in once typing is complete) */}
                  {(message.intent || message.elapsed_time !== undefined || message.standalone_query) && (
                    <div className="mt-3 pt-3 border-t border-slate-100/80 space-y-3">
                      {/* Badge info row */}
                      <div className="flex flex-wrap items-center gap-2 text-xs font-sans">
                        {message.intent && (
                          <span className={cn(
                            "px-2.5 py-0.5 rounded-full flex items-center gap-1 font-bold text-[10px] tracking-wider uppercase border shadow-sm",
                            message.intent === 'KNOWLEDGE' && "bg-amber-50 text-amber-700 border-amber-200/60",
                            message.intent === 'TOOL' && "bg-indigo-50 text-indigo-700 border-indigo-200/60",
                            message.intent === 'GREETING' && "bg-emerald-50 text-emerald-700 border-emerald-200/60"
                          )}>
                            {message.intent === 'KNOWLEDGE' && <Compass size={11} className="text-amber-500" />}
                            {message.intent === 'TOOL' && <Wrench size={11} className="text-indigo-500" />}
                            {message.intent === 'GREETING' && <Sparkles size={11} className="text-emerald-500 animate-pulse" />}
                            {message.intent}
                          </span>
                        )}
                        
                        {message.elapsed_time !== undefined && (
                          <span className="flex items-center gap-1 text-[11px] text-slate-500 bg-slate-50 border border-slate-200/50 px-2.5 py-0.5 rounded-full font-medium shadow-sm">
                            <Clock size={11} className="text-slate-400" />
                            {(Number(message.elapsed_time) || 0).toFixed(2)}s
                          </span>
                        )}
                        
                        {message.num_docs !== undefined && message.num_docs > 0 && (
                          <span className="flex items-center gap-1 text-[11px] text-slate-500 bg-slate-50 border border-slate-200/50 px-2.5 py-0.5 rounded-full font-medium shadow-sm">
                            <FileText size={11} className="text-slate-400" />
                            {message.num_docs} tài liệu
                          </span>
                        )}
                      </div>

                      {/* Standalone Query */}
                      {message.standalone_query && message.standalone_query !== message.content && (
                        <div className="flex items-start gap-1.5 text-xs text-slate-500 bg-slate-50/50 border border-slate-100 rounded-2xl p-3 font-sans leading-relaxed">
                          <Search size={13} className="text-teal-500 mt-0.5 flex-shrink-0" />
                          <div>
                            <span className="font-semibold text-slate-600">Standalone query:</span>{' '}
                            <span className="italic text-slate-600">"{message.standalone_query}"</span>
                          </div>
                        </div>
                      )}

                      <AnimatePresence>
                        {/* Accordion: Xem dữ liệu đã truy xuất */}
                        {Array.isArray(message.context_docs) && message.context_docs.length > 0 && (
                          <div className="font-sans">
                            <button
                              onClick={() => setIsDocsOpen(!isDocsOpen)}
                              className="flex items-center justify-between w-full p-2.5 text-xs font-semibold text-slate-700 bg-slate-50/70 hover:bg-slate-100/60 border border-slate-200/50 rounded-xl transition-all duration-300 cursor-pointer shadow-sm"
                            >
                              <div className="flex items-center gap-2">
                                <Search size={13} className="text-teal-500" />
                                <span>Xem dữ liệu đã truy xuất</span>
                              </div>
                              {isDocsOpen ? <ChevronDown size={14} className="text-slate-400" /> : <ChevronRight size={14} className="text-slate-400" />}
                            </button>
                            
                            {isDocsOpen && (
                              <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                transition={{ duration: 0.25, ease: "easeInOut" }}
                                className="overflow-hidden mt-1.5 space-y-2 max-h-[250px] overflow-y-auto pr-1 scrollbar-none"
                              >
                                {message.context_docs.map((doc, idx) => {
                                  const scores = [];
                                  const rerankNum = Number(doc?.rerank_score);
                                  if (!isNaN(rerankNum) && doc?.rerank_score !== undefined) {
                                    scores.push(`🏆 Rerank: ${rerankNum.toFixed(4)}`);
                                  }
                                  const rrfNum = Number(doc?.rrf_score);
                                  if (!isNaN(rrfNum) && doc?.rrf_score !== undefined) {
                                    scores.push(`🎯 RRF: ${rrfNum.toFixed(4)}`);
                                  }
                                  const scoreText = scores.length > 0 ? ` — ${scores.join(' · ')}` : '';
                                  
                                  return (
                                    <div key={idx} className="bg-slate-50/70 border border-slate-200/30 rounded-xl p-3 text-xs leading-relaxed text-slate-600">
                                      <div className="flex items-center gap-1.5 font-semibold text-slate-700 mb-1 border-b border-slate-100 pb-1 flex-wrap">
                                        <FileCode size={12} className="text-slate-400" />
                                        <span>Tài liệu {idx + 1}</span>
                                        <span className="text-[10px] bg-slate-200/60 text-slate-600 px-1.5 py-0.5 rounded font-mono truncate max-w-[200px]" title={doc?.source}>
                                          {doc?.source}
                                        </span>
                                        {scoreText && <span className="text-[10px] text-teal-600 font-medium ml-auto">{scoreText}</span>}
                                      </div>
                                      <div className="whitespace-pre-wrap font-mono text-[10.5px] bg-white border border-slate-100 rounded-lg p-2 max-h-[120px] overflow-y-auto scrollbar-none">
                                        {doc?.content}
                                      </div>
                                    </div>
                                  );
                                })}
                              </motion.div>
                            )}
                          </div>
                        )}

                        {/* Accordion: Timing breakdown */}
                        {message.timing && typeof message.timing === 'object' && !Array.isArray(message.timing) && Object.keys(message.timing).length > 0 && (
                          <div className="font-sans">
                            <button
                              onClick={() => setIsTimingOpen(!isTimingOpen)}
                              className="flex items-center justify-between w-full p-2.5 text-xs font-semibold text-slate-700 bg-slate-50/70 hover:bg-slate-100/60 border border-slate-200/50 rounded-xl transition-all duration-300 cursor-pointer shadow-sm"
                            >
                              <div className="flex items-center gap-2">
                                <Clock size={13} className="text-indigo-500" />
                                <span>Timing breakdown</span>
                              </div>
                              {isTimingOpen ? <ChevronDown size={14} className="text-slate-400" /> : <ChevronRight size={14} className="text-slate-400" />}
                            </button>
                            
                            {isTimingOpen && (
                              <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                transition={{ duration: 0.25, ease: "easeInOut" }}
                                className="overflow-hidden mt-1.5 bg-slate-50/70 border border-slate-200/30 rounded-xl p-3 space-y-2.5"
                              >
                                {(() => {
                                  const timingLabels: Record<string, string> = {
                                    "rewrite_query": "✏️ Query Rewrite",
                                    "intent_router": "🧭 Intent Router",
                                    "cache_lookup": "⚡ Cache Lookup",
                                    "hybrid_retrieval": "🔎 Hybrid Retrieval",
                                    "jina_reranker": "🏆 Jina Reranker",
                                    "tool_lookup": "🔧 Tool Lookup (Supabase)",
                                    "qa_generation": "🤖 QA Generation",
                                    "cache_store": "💾 Cache Store",
                                  };
                                  
                                  const timingValues = Object.values(message.timing).map((v) => Number(v) || 0);
                                  const totalElapsed = Number(message.elapsed_time) || timingValues.reduce((a, b) => a + b, 0) || 1;
                                  
                                  return Object.entries(message.timing).map(([key, rawVal]) => {
                                    const val = Number(rawVal) || 0;
                                    const label = timingLabels[key] || key;
                                    const pct = Math.min((val / totalElapsed) * 100, 100);
                                    
                                    return (
                                      <div key={key} className="space-y-1 text-xs">
                                        <div className="flex justify-between font-medium text-slate-600">
                                          <span>{label}</span>
                                          <span className="font-mono text-[10px] text-slate-500 font-semibold">
                                            {val.toFixed(3)}s ({pct.toFixed(1)}%)
                                          </span>
                                        </div>
                                        <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                                          <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: `${pct}%` }}
                                            transition={{ duration: 0.6, ease: "easeOut" }}
                                            className="h-full bg-gradient-to-r from-teal-400 to-indigo-500 rounded-full shadow-sm"
                                          />
                                        </div>
                                      </div>
                                    );
                                  });
                                })()}
                              </motion.div>
                            )}
                          </div>
                        )}
                      </AnimatePresence>
                    </div>
                  )}
                </>
              )
            )}
          </div>
          
          {/* Timestamp */}
          <span className="text-[9px] text-slate-400 mt-1 px-1 tracking-wider">
            {formatTime(message.timestamp)}
          </span>
        </div>
      </div>
    </motion.div>
  );
}
