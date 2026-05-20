import { ChatBox } from '../components/chat/ChatBox';

export default function Home() {
  return (
    <main className="h-screen w-screen bg-slate-50/50 text-[#1e293b] px-4 md:px-6 flex flex-col items-center justify-center relative overflow-hidden">
      {/* Background cute blur decoration blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-[45%] h-[45%] bg-teal-200/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[35%] h-[35%] bg-indigo-200/20 rounded-full blur-3xl pointer-events-none" />
      
      {/* Cute Floating Animal SVG Decorations (Visible on medium screens and up) */}
      
      {/* Cute Cat on the Left */}
      <div className="absolute left-[3%] top-[15%] hidden lg:block animate-float-slow pointer-events-none select-none">
        <svg viewBox="0 0 100 100" className="w-20 h-20 text-teal-400/40 fill-current">
          <polygon points="20,40 35,10 45,35" />
          <polygon points="80,40 65,10 55,35" />
          <ellipse cx="50" cy="55" rx="35" ry="25" />
          <circle cx="38" cy="50" r="4.5" fill="#475569" />
          <circle cx="62" cy="50" r="4.5" fill="#475569" />
          <polygon points="50,58 47,55 53,55" fill="#f43f5e" />
          <path d="M47,62 Q50,65 53,62" stroke="#475569" strokeWidth="2.5" fill="none" />
          <line x1="20" y1="55" x2="4" y2="53" stroke="#475569" strokeWidth="1.5" opacity="0.6" />
          <line x1="20" y1="60" x2="2" y2="62" stroke="#475569" strokeWidth="1.5" opacity="0.6" />
          <line x1="80" y1="55" x2="96" y2="53" stroke="#475569" strokeWidth="1.5" opacity="0.6" />
          <line x1="80" y1="60" x2="98" y2="62" stroke="#475569" strokeWidth="1.5" opacity="0.6" />
        </svg>
      </div>

      {/* Cute Dog on the Right */}
      <div className="absolute right-[3%] top-[18%] hidden lg:block animate-float-slower pointer-events-none select-none">
        <svg viewBox="0 0 100 100" className="w-20 h-20 text-indigo-400/40 fill-current">
          <ellipse cx="50" cy="50" rx="32" ry="28" />
          <path d="M18,35 Q8,55 18,65" stroke="#818cf8" strokeWidth="8" strokeLinecap="round" fill="none" />
          <path d="M82,35 Q92,55 82,65" stroke="#818cf8" strokeWidth="8" strokeLinecap="round" fill="none" />
          <circle cx="38" cy="45" r="4.5" fill="#475569" />
          <circle cx="62" cy="45" r="4.5" fill="#475569" />
          <ellipse cx="50" cy="60" rx="12" ry="9" fill="#f8fafc" />
          <ellipse cx="50" cy="56" rx="5" ry="3.5" fill="#1e293b" />
          <line x1="50" y1="59" x2="50" y2="65" stroke="#1e293b" strokeWidth="2" />
        </svg>
      </div>

      {/* Cute Bunny on the Right Bottom */}
      <div className="absolute right-[4%] bottom-[15%] hidden lg:block animate-float-slow pointer-events-none select-none">
        <svg viewBox="0 0 100 100" className="w-16 h-16 text-pink-400/40 fill-current">
          <ellipse cx="38" cy="25" rx="8" ry="20" transform="rotate(-10 38 25)" />
          <ellipse cx="62" cy="25" rx="8" ry="20" transform="rotate(10 62 25)" />
          <circle cx="50" cy="60" r="28" />
          <circle cx="40" cy="55" r="3.5" fill="#475569" />
          <circle cx="60" cy="55" r="3.5" fill="#475569" />
          <polygon points="50,63 47,60 53,60" fill="#f43f5e" />
          <circle cx="32" cy="62" r="3.5" fill="#f43f5e" opacity="0.4" />
          <circle cx="68" cy="62" r="3.5" fill="#f43f5e" opacity="0.4" />
        </svg>
      </div>

      {/* Cute Paw Print on Left Bottom */}
      <div className="absolute left-[5%] bottom-[12%] hidden lg:block animate-float-slower pointer-events-none select-none">
        <svg viewBox="0 0 100 100" className="w-16 h-16 text-amber-400/40 fill-current">
          {/* Main pad */}
          <path d="M50,45 C35,45 35,70 50,70 C65,70 65,45 50,45 Z" />
          {/* Small toe pads */}
          <circle cx="28" cy="38" r="8" />
          <circle cx="43" cy="24" r="9" />
          <circle cx="57" cy="24" r="9" />
          <circle cx="72" cy="38" r="8" />
        </svg>
      </div>
      
      {/* Tiny Paw Print floating left middle */}
      <div className="absolute left-[8%] top-[45%] hidden xl:block animate-float-slow opacity-60 pointer-events-none select-none">
        <svg viewBox="0 0 100 100" className="w-10 h-10 text-teal-400/30 fill-current">
          <path d="M50,45 C35,45 35,70 50,70 C65,70 65,45 50,45 Z" />
          <circle cx="28" cy="38" r="8" />
          <circle cx="43" cy="24" r="9" />
          <circle cx="57" cy="24" r="9" />
          <circle cx="72" cy="38" r="8" />
        </svg>
      </div>

      {/* Tiny Paw Print floating right middle */}
      <div className="absolute right-[8%] top-[50%] hidden xl:block animate-float-slower opacity-60 pointer-events-none select-none">
        <svg viewBox="0 0 100 100" className="w-10 h-10 text-pink-400/30 fill-current">
          <path d="M50,45 C35,45 35,70 50,70 C65,70 65,45 50,45 Z" />
          <circle cx="28" cy="38" r="8" />
          <circle cx="43" cy="24" r="9" />
          <circle cx="57" cy="24" r="9" />
          <circle cx="72" cy="38" r="8" />
        </svg>
      </div>

      {/* Locked height at 94vh (3vh margins on top & bottom) with window scrolling fully disabled */}
      <div className="w-full max-w-5xl z-10 flex flex-col h-[94vh] min-h-0">
        <ChatBox />
      </div>
    </main>
  );
}
