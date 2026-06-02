'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export type ChatStatus = 'idle' | 'sending' | 'thinking' | 'streaming';

interface StatusPuppyProps {
  status: ChatStatus;
}

export function StatusPuppy({ status }: StatusPuppyProps) {
  const isSending = status === 'sending';
  const isThinking = status === 'thinking';
  const isStreaming = status === 'streaming';

  return (
    <AnimatePresence>
      {status !== 'idle' && (
        <motion.div
          initial={{ opacity: 0, y: 16, scale: 0.92 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 12, scale: 0.95 }}
          transition={{ type: 'spring', stiffness: 260, damping: 22 }}
          className="flex items-center gap-4 px-5 py-3.5 rounded-2xl bg-white/90 backdrop-blur-sm border border-slate-200/60 shadow-lg shadow-slate-200/40 max-w-max my-3 font-sans ml-12"
        >
          {/* === Inline keyframe styles === */}
          <style dangerouslySetInnerHTML={{ __html: `
            @keyframes puppy-ear-wiggle {
              0%, 100% { transform: rotate(0deg); }
              20% { transform: rotate(-14deg); }
              40% { transform: rotate(10deg); }
              60% { transform: rotate(-8deg); }
              80% { transform: rotate(6deg); }
            }
            @keyframes puppy-tail-wag {
              0%, 100% { transform: rotate(-15deg); }
              25% { transform: rotate(25deg); }
              50% { transform: rotate(-20deg); }
              75% { transform: rotate(20deg); }
            }
            @keyframes puppy-bounce {
              0%, 100% { transform: translateY(0) scaleY(1) scaleX(1); }
              30% { transform: translateY(-8px) scaleY(1.06) scaleX(0.95); }
              50% { transform: translateY(-12px) scaleY(1.08) scaleX(0.93); }
              70% { transform: translateY(-6px) scaleY(1.04) scaleX(0.96); }
              85% { transform: translateY(2px) scaleY(0.96) scaleX(1.04); }
            }
            @keyframes puppy-sparkle {
              0%, 100% { opacity: 1; transform: scale(1); }
              50% { opacity: 0.4; transform: scale(0.6); }
            }
            @keyframes puppy-heart {
              0% { opacity: 0; transform: translateY(0) scale(0.5); }
              30% { opacity: 1; transform: translateY(-6px) scale(1); }
              100% { opacity: 0; transform: translateY(-18px) scale(0.7); }
            }
            @keyframes puppy-blink {
              0%, 42%, 58%, 100% { transform: scaleY(1); }
              50% { transform: scaleY(0.08); }
            }
            @keyframes puppy-head-tilt {
              0%, 100% { transform: rotate(0deg); }
              50% { transform: rotate(-8deg); }
            }
            .puppy-ear-wiggle { animation: puppy-ear-wiggle 0.6s ease-in-out infinite; }
            .puppy-tail-wag { animation: puppy-tail-wag 0.35s ease-in-out infinite; transform-origin: 72px 52px; }
            .puppy-bounce { animation: puppy-bounce 0.55s ease-in-out infinite; }
            .puppy-sparkle { animation: puppy-sparkle 0.8s ease-in-out infinite; }
            .puppy-heart { animation: puppy-heart 1.2s ease-out infinite; }
            .puppy-blink { animation: puppy-blink 3.5s ease-in-out infinite; transform-origin: center; }
            .puppy-head-tilt { animation: puppy-head-tilt 1.2s ease-in-out infinite; transform-origin: 50px 48px; }
          `}} />

          {/* === Puppy SVG Illustration === */}
          <div className={`flex-shrink-0 w-16 h-16 relative ${isStreaming ? 'puppy-bounce' : ''}`}>
            <svg viewBox="0 0 100 100" className="w-full h-full" aria-hidden="true">
              <defs>
                <radialGradient id="bodyGrad" cx="50%" cy="40%" r="55%">
                  <stop offset="0%" stopColor="#FBBE6A" />
                  <stop offset="100%" stopColor="#D4792B" />
                </radialGradient>
                <radialGradient id="headGrad" cx="45%" cy="35%" r="60%">
                  <stop offset="0%" stopColor="#FFF5E0" />
                  <stop offset="100%" stopColor="#FBBE6A" />
                </radialGradient>
                <radialGradient id="cheekGrad" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#FDA4AF" stopOpacity="0.6" />
                  <stop offset="100%" stopColor="#FDA4AF" stopOpacity="0" />
                </radialGradient>
              </defs>

              {/* ── Tail ── */}
              <g className={isThinking ? 'puppy-tail-wag' : ''}>
                <path
                  d="M72,52 C78,42 84,34 82,28 C80,22 76,26 74,34 C72,42 72,48 72,52"
                  fill="#D4792B"
                  stroke="#A0622A"
                  strokeWidth="0.5"
                />
                <ellipse cx="81.5" cy="27" rx="3.5" ry="4" fill="#FFF5E0" />
              </g>

              {/* ── Body ── */}
              <ellipse cx="50" cy="62" rx="22" ry="16" fill="url(#bodyGrad)" stroke="#A0622A" strokeWidth="0.6" />
              {/* Belly patch — Shiba cream underbelly */}
              <ellipse cx="48" cy="66" rx="12" ry="9" fill="#FFF5E0" opacity="0.7" />

              {/* ── Legs ── */}
              <rect x="34" y="72" width="8" height="14" rx="4" fill="#D4792B" stroke="#A0622A" strokeWidth="0.5" />
              <rect x="56" y="72" width="8" height="14" rx="4" fill="#D4792B" stroke="#A0622A" strokeWidth="0.5" />
              {/* Paws — cream Shiba toes */}
              <ellipse cx="38" cy="86" rx="5.5" ry="3" fill="#FFECD2" stroke="#A0622A" strokeWidth="0.5" />
              <ellipse cx="60" cy="86" rx="5.5" ry="3" fill="#FFECD2" stroke="#A0622A" strokeWidth="0.5" />

              {/* ── Head group ── */}
              <g className={isSending ? 'puppy-head-tilt' : ''}>
                {/* ── Ears — Shiba Inu triangular erect ears ── */}
                <g className={isSending ? 'puppy-ear-wiggle' : ''} style={{ transformOrigin: '32px 30px' }}>
                  <polygon
                    points="24,38 32,6 40,34"
                    fill="#D4792B"
                    stroke="#A0622A"
                    strokeWidth="0.8"
                    strokeLinejoin="round"
                  />
                  {/* Inner ear — pink */}
                  <polygon points="27,35 32,12 37,32" fill="#FECACA" opacity="0.65" />
                </g>
                <g className={isSending ? 'puppy-ear-wiggle' : ''} style={{ transformOrigin: '68px 30px', animationDelay: '0.1s' }}>
                  <polygon
                    points="76,38 68,6 60,34"
                    fill="#D4792B"
                    stroke="#A0622A"
                    strokeWidth="0.8"
                    strokeLinejoin="round"
                  />
                  {/* Inner ear — pink */}
                  <polygon points="73,35 68,12 63,32" fill="#FECACA" opacity="0.65" />
                </g>

                {/* ── Head ── */}
                <ellipse cx="50" cy="38" rx="22" ry="20" fill="url(#headGrad)" stroke="#A0622A" strokeWidth="0.5" />
                {/* Shiba face mask — cream cheeks and chin marking */}
                <path d="M34,38 Q38,28 50,26 Q62,28 66,38 Q62,48 50,50 Q38,48 34,38" fill="#FFF5E0" opacity="0.45" />
                {/* Forehead patch */}
                <path d="M42,22 C46,18 54,18 58,22 C55,25 45,25 42,22" fill="#D4792B" opacity="0.45" />

                {/* ── Eyes ── */}
                {isStreaming ? (
                  /* Joyful squint eyes  >ω< */
                  <>
                    <path d="M36,36 Q40,32 44,36" stroke="#78350f" strokeWidth="2.5" strokeLinecap="round" fill="none" />
                    <path d="M56,36 Q60,32 64,36" stroke="#78350f" strokeWidth="2.5" strokeLinecap="round" fill="none" />
                  </>
                ) : (
                  /* Normal big sparkly eyes */
                  <>
                    <g className="puppy-blink">
                      {/* Left eye */}
                      <circle cx="40" cy="36" r="5" fill="#1C1917" />
                      <circle cx="40" cy="36" r="4.2" fill="#292524" />
                      <circle cx="38.5" cy="34.5" r="1.8" fill="#FFFFFF" />
                      <circle cx="41.5" cy="37" r="0.9" fill="#FFFFFF" opacity="0.7" />
                      {/* Right eye */}
                      <circle cx="60" cy="36" r="5" fill="#1C1917" />
                      <circle cx="60" cy="36" r="4.2" fill="#292524" />
                      <circle cx="58.5" cy="34.5" r="1.8" fill="#FFFFFF" />
                      <circle cx="61.5" cy="37" r="0.9" fill="#FFFFFF" opacity="0.7" />
                    </g>
                  </>
                )}

                {/* ── Cheek blush ── */}
                <circle cx="30" cy="42" r="5" fill="url(#cheekGrad)" opacity={isStreaming ? 1 : 0.4} />
                <circle cx="70" cy="42" r="5" fill="url(#cheekGrad)" opacity={isStreaming ? 1 : 0.4} />

                {/* ── Muzzle ── */}
                <ellipse cx="50" cy="46" rx="9" ry="6.5" fill="#FFF5E0" stroke="#D4792B" strokeWidth="0.3" />
                {/* Nose */}
                <ellipse cx="50" cy="43.5" rx="3.5" ry="2.5" fill="#1C1917" />
                <ellipse cx="49" cy="43" rx="1.2" ry="0.7" fill="#FFFFFF" opacity="0.35" />

                {/* ── Mouth ── */}
                {isStreaming ? (
                  /* Open happy mouth + tongue */
                  <>
                    <path d="M46,47 Q50,52 54,47" stroke="#78350F" strokeWidth="1.2" fill="none" />
                    <path d="M48,48 Q50,54 52,48" fill="#FB7185" stroke="#E11D48" strokeWidth="0.3" />
                  </>
                ) : isSending ? (
                  /* Small 'o' curious mouth */
                  <ellipse cx="50" cy="48.5" rx="2" ry="1.8" fill="#78350F" opacity="0.6" />
                ) : (
                  /* Normal cute W-smile */
                  <path d="M44,47 Q47,49.5 50,47 Q53,49.5 56,47" stroke="#78350F" strokeWidth="1.2" fill="none" strokeLinecap="round" />
                )}

                {/* ── Floating hearts (streaming) ── */}
                {isStreaming && (
                  <>
                    <text x="18" y="22" fontSize="8" className="puppy-heart" style={{ animationDelay: '0s' }}>💖</text>
                    <text x="72" y="18" fontSize="7" className="puppy-heart" style={{ animationDelay: '0.5s' }}>✨</text>
                    <text x="26" y="14" fontSize="6" className="puppy-heart" style={{ animationDelay: '0.9s' }}>💕</text>
                  </>
                )}
                {/* ── Sparkle stars (sending/thinking) ── */}
                {(isSending || isThinking) && (
                  <>
                    <text x="14" y="18" fontSize="7" className="puppy-sparkle" style={{ animationDelay: '0s' }}>✦</text>
                    <text x="76" y="22" fontSize="6" className="puppy-sparkle" style={{ animationDelay: '0.4s' }}>✦</text>
                  </>
                )}
              </g>

              {/* ── Collar ── */}
              <path d="M34,56 Q50,62 66,56" stroke="#F43F5E" strokeWidth="2.5" fill="none" strokeLinecap="round" />
              <circle cx="50" cy="59" r="2.5" fill="#FBBF24" stroke="#D97706" strokeWidth="0.5" />
            </svg>
          </div>

          {/* === Text label === */}
          <div className="flex flex-col gap-1 min-w-0">
            <span className="text-[13px] font-bold text-slate-700 leading-tight tracking-tight">
              {isSending && 'Alya hóng hớt... 👂'}
              {isThinking && 'Alya đang tìm kiếm... 🔍'}
              {isStreaming && 'Alya trả lời rồi nè! 🎉'}
            </span>
            <span className="text-[10.5px] text-slate-400 font-medium leading-snug">
              {isSending && 'Dạ, em đang vểnh tai nghe bạn nói nhen~'}
              {isThinking && 'Đang lục tìm tài liệu cho bạn, đợi xíu nha!'}
              {isStreaming && 'Gửi bạn thông tin tham khảo nè, yêu lắm ♡'}
            </span>

            {/* Thinking dots */}
            {isThinking && (
              <div className="flex gap-1.5 mt-1.5">
                {[0, 1, 2].map(i => (
                  <motion.div
                    key={i}
                    className="w-2 h-2 rounded-full bg-teal-400"
                    animate={{ y: [0, -5, 0], opacity: [0.4, 1, 0.4] }}
                    transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15, ease: 'easeInOut' }}
                  />
                ))}
              </div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
