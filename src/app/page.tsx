import { ChatBox } from '../components/chat/ChatBox';

export default function Home() {
  return (
    <main className="min-h-screen p-4 sm:p-8 flex flex-col items-center justify-center relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-teal-200/30 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[30%] h-[30%] bg-blue-200/30 rounded-full blur-3xl pointer-events-none" />
      
      <div className="w-full max-w-4xl z-10">
        <div className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-800 tracking-tight mb-2">
            Petcare <span className="text-teal-500">RAG</span>
          </h1>

        </div>
        
        <ChatBox />
      </div>
    </main>
  );
}
