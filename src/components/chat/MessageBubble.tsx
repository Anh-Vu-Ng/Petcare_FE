import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { motion, AnimatePresence } from 'framer-motion';
import {
  User,
  Compass,
  Clock,
  FileText,
  ChevronDown,
  ChevronRight,
  Search,
  Wrench,
  FileCode,
  Sparkles,
  Database,
} from 'lucide-react';
import { Message } from '../../types/chat';
import { formatTime } from '../../utils/formatters';
import { cn } from '../ui/Button';

interface MessageBubbleProps {
  message: Message;
}

const TIMING_LABELS: Record<string, string> = {
  rewrite_query: 'Viết lại truy vấn',
  intent_router: 'Phân loại ý định',
  cache_lookup: 'Kiểm tra bộ nhớ đệm',
  hybrid_retrieval: 'Truy xuất tài liệu',
  jina_reranker: 'Xếp hạng độ phù hợp',
  tool_lookup: 'Tra cứu dữ liệu hệ thống',
  qa_generation: 'Tổng hợp câu trả lời',
  cache_store: 'Lưu bộ nhớ đệm',
};

export function MessageBubble({ message }: MessageBubbleProps) {
  const isUser = message.role === 'user';
  const [isInspectorOpen, setIsInspectorOpen] = useState(false);
  const [isDocsOpen, setIsDocsOpen] = useState(false);
  const [isTimingOpen, setIsTimingOpen] = useState(false);

  const hasMetadata = Boolean(
    message.intent ||
      message.elapsed_time !== undefined ||
      message.standalone_query ||
      (Array.isArray(message.context_docs) && message.context_docs.length > 0) ||
      (message.timing &&
        typeof message.timing === 'object' &&
        !Array.isArray(message.timing) &&
        Object.keys(message.timing).length > 0)
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.18, ease: 'easeOut' }}
      className={cn('flex w-full mb-5 first:mt-1', isUser ? 'justify-end' : 'justify-start')}
    >
      <div
        className={cn(
          'flex w-full max-w-[92%] sm:max-w-[88%]',
          isUser ? 'justify-end pl-6' : 'justify-start pr-4'
        )}
      >
        {/* Avatar */}
        <div
          className={cn(
            'flex-shrink-0 h-8 w-8 rounded-[9px] flex items-center justify-center mt-0.5 border text-xs font-bold',
            isUser
              ? 'bg-surface-subtle border-clay text-ink-slate order-2 ml-2.5'
              : 'bg-shell-bg border-shell-header-border text-shell-ink-bright order-1 mr-2.5'
          )}
          aria-hidden="true"
        >
          {isUser ? <User size={15} /> : <span className="tracking-tight">PC</span>}
        </div>

        {/* Message Bubble & Timestamp */}
        <div className={cn('flex flex-col min-w-0', isUser ? 'items-end order-1' : 'items-start order-2 w-full')}>
          <div
            className={cn(
              'px-4 py-3 rounded-[12px] text-sm sm:text-[15px] leading-relaxed border',
              isUser
                ? 'bg-shell-bg border-shell-header-border text-shell-ink-bright rounded-tr-[3px]'
                : 'bg-surface-pure border-rim text-ink-primary rounded-tl-[3px] w-full'
            )}
          >
            {isUser ? (
              <div className="whitespace-pre-wrap">{message.content}</div>
            ) : message.content === '' ? (
              <div className="space-y-2.5 py-1 w-[180px] sm:w-[320px]">
                <div className="h-2.5 rounded-full w-full shimmer-loading" />
                <div className="h-2.5 rounded-full w-[85%] shimmer-loading" />
                <div className="h-2.5 rounded-full w-[60%] shimmer-loading" />
              </div>
            ) : (
              <>
                <div className="prose prose-sm sm:prose-base max-w-none">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {String(message.content || '')}
                  </ReactMarkdown>
                </div>

                {/* Optional Subtle RAG Inspector Toggle — Collapsed by Default for Pet Owners */}
                {hasMetadata && (
                  <div className="mt-3 pt-2.5 border-t border-divider">
                    <button
                      type="button"
                      onClick={() => setIsInspectorOpen((prev) => !prev)}
                      aria-expanded={isInspectorOpen}
                      className="flex items-center justify-between w-full text-left text-xs text-ink-secondary hover:text-ink-slate py-1 transition-colors cursor-pointer select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring rounded"
                    >
                      <span className="flex items-center gap-1.5 font-medium">
                        <Database size={13} className="text-ink-slate" />
                        <span>Chi tiết nguồn RAG</span>
                        {message.num_docs !== undefined && message.num_docs > 0 && (
                          <span className="font-mono tabular-nums text-[11px] text-ink-muted">
                            · {message.num_docs} tài liệu
                          </span>
                        )}
                        {message.elapsed_time !== undefined && (
                          <span className="font-mono tabular-nums text-[11px] text-ink-muted">
                            · {(Number(message.elapsed_time) || 0).toFixed(2)}s
                          </span>
                        )}
                      </span>
                      {isInspectorOpen ? (
                        <ChevronDown size={14} className="text-ink-muted" />
                      ) : (
                        <ChevronRight size={14} className="text-ink-muted" />
                      )}
                    </button>

                    <AnimatePresence>
                      {isInspectorOpen && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.18, ease: 'easeOut' }}
                          className="overflow-hidden mt-2 space-y-2.5"
                        >
                          {/* Intent & Metrics Chips */}
                          <div className="flex flex-wrap items-center gap-2 text-xs">
                            {message.intent && (
                              <span
                                className={cn(
                                  'px-2 py-0.5 rounded-[6px] inline-flex items-center gap-1 font-semibold text-[11px] uppercase tracking-wide border',
                                  message.intent === 'KNOWLEDGE' &&
                                    'bg-state-warning-soft text-state-warning-ink border-state-warning-border',
                                  message.intent === 'TOOL' &&
                                    'bg-slate-soft text-slate-soft-ink border-slate-soft-border',
                                  message.intent === 'GREETING' &&
                                    'bg-state-success-soft text-state-success-ink border-state-success-border'
                                )}
                              >
                                {message.intent === 'KNOWLEDGE' && <Compass size={11} />}
                                {message.intent === 'TOOL' && <Wrench size={11} />}
                                {message.intent === 'GREETING' && <Sparkles size={11} />}
                                {message.intent}
                              </span>
                            )}

                            {message.elapsed_time !== undefined && (
                              <span className="inline-flex items-center gap-1 text-[11px] text-ink-secondary bg-surface-subtle border border-rim px-2 py-0.5 rounded-[6px] font-mono tabular-nums">
                                <Clock size={11} className="text-ink-muted" />
                                {(Number(message.elapsed_time) || 0).toFixed(2)}s
                              </span>
                            )}

                            {message.num_docs !== undefined && message.num_docs > 0 && (
                              <span className="inline-flex items-center gap-1 text-[11px] text-ink-secondary bg-surface-subtle border border-rim px-2 py-0.5 rounded-[6px] font-mono tabular-nums">
                                <FileText size={11} className="text-ink-muted" />
                                {message.num_docs} tài liệu
                              </span>
                            )}
                          </div>

                          {/* Standalone Query */}
                          {message.standalone_query && message.standalone_query !== message.content && (
                            <div className="flex items-start gap-2 text-xs text-ink-secondary bg-surface-card border border-rim rounded-[8px] p-2.5 leading-relaxed">
                              <Search size={13} className="text-ink-slate mt-0.5 flex-shrink-0" />
                              <div>
                                <span className="font-semibold text-ink-primary">Truy vấn chuẩn hóa:</span>{' '}
                                <span className="italic">&ldquo;{message.standalone_query}&rdquo;</span>
                              </div>
                            </div>
                          )}

                          {/* Retrieved Context Documents */}
                          {Array.isArray(message.context_docs) && message.context_docs.length > 0 && (
                            <div>
                              <button
                                type="button"
                                onClick={() => setIsDocsOpen(!isDocsOpen)}
                                className="flex items-center justify-between w-full px-3 py-2 text-xs font-semibold text-ink-primary bg-surface-subtle/70 hover:bg-surface-subtle border border-rim rounded-[8px] transition-colors cursor-pointer"
                              >
                                <span className="flex items-center gap-1.5">
                                  <Search size={12} className="text-ink-slate" />
                                  <span>Dữ liệu đã truy xuất ({message.context_docs.length})</span>
                                </span>
                                {isDocsOpen ? (
                                  <ChevronDown size={14} className="text-ink-muted" />
                                ) : (
                                  <ChevronRight size={14} className="text-ink-muted" />
                                )}
                              </button>

                              {isDocsOpen && (
                                <div className="mt-1.5 space-y-2 max-h-[240px] overflow-y-auto pr-1 no-scrollbar">
                                  {message.context_docs.map((doc, idx) => {
                                    const scores: string[] = [];
                                    const rerankNum = Number(doc?.rerank_score);
                                    if (!isNaN(rerankNum) && doc?.rerank_score !== undefined) {
                                      scores.push(`Rerank ${rerankNum.toFixed(4)}`);
                                    }
                                    const rrfNum = Number(doc?.rrf_score);
                                    if (!isNaN(rrfNum) && doc?.rrf_score !== undefined) {
                                      scores.push(`RRF ${rrfNum.toFixed(4)}`);
                                    }
                                    const scoreText = scores.join(' · ');

                                    return (
                                      <div
                                        key={idx}
                                        className="bg-surface-card border border-rim rounded-[8px] p-2.5 text-xs text-ink-secondary"
                                      >
                                        <div className="flex items-center gap-1.5 font-semibold text-ink-primary mb-1.5 pb-1 border-b border-divider flex-wrap">
                                          <FileCode size={12} className="text-ink-muted" />
                                          <span>Tài liệu {idx + 1}</span>
                                          {doc?.source && (
                                            <span
                                              className="text-[10px] bg-surface-subtle text-ink-secondary px-1.5 py-0.5 rounded font-mono truncate max-w-[200px]"
                                              title={doc.source}
                                            >
                                              {doc.source}
                                            </span>
                                          )}
                                          {scoreText && (
                                            <span className="text-[10px] font-mono tabular-nums text-ink-slate font-semibold ml-auto">
                                              {scoreText}
                                            </span>
                                          )}
                                        </div>
                                        <div className="whitespace-pre-wrap font-mono text-[11px] bg-surface-pure border border-divider rounded-[6px] p-2 max-h-[120px] overflow-y-auto no-scrollbar text-ink-primary">
                                          {doc?.content}
                                        </div>
                                      </div>
                                    );
                                  })}
                                </div>
                              )}
                            </div>
                          )}

                          {/* Timing Breakdown */}
                          {message.timing &&
                            typeof message.timing === 'object' &&
                            !Array.isArray(message.timing) &&
                            Object.keys(message.timing).length > 0 && (
                              <div>
                                <button
                                  type="button"
                                  onClick={() => setIsTimingOpen(!isTimingOpen)}
                                  className="flex items-center justify-between w-full px-3 py-2 text-xs font-semibold text-ink-primary bg-surface-subtle/70 hover:bg-surface-subtle border border-rim rounded-[8px] transition-colors cursor-pointer"
                                >
                                  <span className="flex items-center gap-1.5">
                                    <Clock size={12} className="text-accent-collar-ink" />
                                    <span>Thời gian xử lý</span>
                                  </span>
                                  {isTimingOpen ? (
                                    <ChevronDown size={14} className="text-ink-muted" />
                                  ) : (
                                    <ChevronRight size={14} className="text-ink-muted" />
                                  )}
                                </button>

                                {isTimingOpen && (
                                  <div className="mt-1.5 bg-surface-card border border-rim rounded-[8px] p-3 space-y-2">
                                    {(() => {
                                      const timingValues = Object.values(message.timing).map(
                                        (v) => Number(v) || 0
                                      );
                                      const totalElapsed =
                                        Number(message.elapsed_time) ||
                                        timingValues.reduce((a, b) => a + b, 0) ||
                                        1;

                                      return Object.entries(message.timing).map(([key, rawVal]) => {
                                        const val = Number(rawVal) || 0;
                                        const label = TIMING_LABELS[key] || key;
                                        const pct = Math.min((val / totalElapsed) * 100, 100);

                                        return (
                                          <div key={key} className="space-y-1 text-xs">
                                            <div className="flex justify-between font-medium text-ink-secondary">
                                              <span>{label}</span>
                                              <span className="font-mono tabular-nums text-[11px] text-ink-primary font-semibold">
                                                {val.toFixed(3)}s ({pct.toFixed(1)}%)
                                              </span>
                                            </div>
                                            <div className="w-full h-1.5 bg-rim rounded-full overflow-hidden">
                                              <div
                                                style={{ width: `${pct}%` }}
                                                className="h-full bg-ink-slate rounded-full transition-all duration-300"
                                              />
                                            </div>
                                          </div>
                                        );
                                      });
                                    })()}
                                  </div>
                                )}
                              </div>
                            )}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                )}
              </>
            )}
          </div>

          <span className="text-[11px] font-mono tabular-nums text-ink-muted mt-1 px-1">
            {formatTime(message.timestamp)}
          </span>
        </div>
      </div>
    </motion.div>
  );
}
