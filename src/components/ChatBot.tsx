"use client";

import { useState } from "react";
import { MessageSquare, X, Send, Bot, User } from "lucide-react";

export function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{sender: 'bot'|'user', text: string}[]>([
    { sender: 'bot', text: 'Initiating Support Protocol. How can FinFlow assist you in navigating the architecture?' }
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const handleSend = () => {
    if (!input.trim()) return;
    
    // Add user message
    const newMsgs = [...messages, { sender: 'user' as const, text: input }];
    setMessages(newMsgs);
    setInput("");
    setIsTyping(true);

    // Simulate RAG offline fallback
    setTimeout(() => {
      const lowerReq = newMsgs[newMsgs.length-1].text.toLowerCase();
      let botReply = "I am operating in offline RAG mode. I cannot reach the Gemini mainframe. But I detect you are asking about general features. The FinFlow ecosystem offers a Live Exchange, a Gamified Arena for cashback, and a comprehensive Ledger.";
      
      if (lowerReq.includes("balance") || lowerReq.includes("money")) {
         botReply = "Your total fiat wealth is tracked natively in your Global Header and the Ledger area. You can liquidate portfolio assets back to your balance instantly via the Portfolio tab.";
      } else if (lowerReq.includes("game") || lowerReq.includes("arena")) {
         botReply = "The Cashback Arena transforms your purchases into Digital Coins, which you can use for Data Mining and Doom Spins to earn more fiat!";
      } else if (lowerReq.includes("stock") || lowerReq.includes("buy")) {
         botReply = "You can purchase stocks natively in our integrated Exchange or the Kryptosan-style Portfolio dashboard. We cover NASDAQ, SPX500, and standard index tracking.";
      } else if (lowerReq.includes("cashback")) {
         botReply = "Our routing engine gives you 0.5% - 1.0% cashback on transactions under ₹2,000, and 2.0% - 5.0% for transactions over ₹2,000 automatically during payment!";
      }

      setMessages(prev => [...prev, { sender: 'bot', text: botReply }]);
      setIsTyping(false);
    }, 1500);
  };

  return (
    <>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-[100] bg-cyber-pink hover:bg-rose-500 text-white p-4 rounded-full shadow-[0_0_20px_rgba(255,0,60,0.4)] transition-all animate-bounce"
      >
        {isOpen ? <X className="w-6 h-6"/> : <MessageSquare className="w-6 h-6"/>}
      </button>

      {isOpen && (
        <div className="fixed bottom-24 right-6 z-[100] w-80 bg-slate-900 border border-slate-700 shadow-2xl rounded-2xl overflow-hidden flex flex-col h-[400px] animate-in slide-in-from-bottom-4">
          <div className="bg-slate-800 p-4 border-b border-slate-700 flex items-center justify-between">
             <div className="flex items-center gap-3">
               <Bot className="w-5 h-5 text-cyber-pink" />
               <h3 className="text-white font-bold tracking-wider uppercase text-sm">FinFlow Assistant</h3>
             </div>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                 <div className={`max-w-[80%] p-3 rounded-2xl text-sm ${msg.sender === 'user' ? 'bg-cyber-neon text-black rounded-tr-none font-medium' : 'bg-slate-800 text-slate-300 rounded-tl-none border border-slate-700'}`}>
                    {msg.text}
                 </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start">
                 <div className="bg-slate-800 border border-slate-700 rounded-2xl rounded-tl-none p-3 flex gap-1 items-center">
                    <div className="w-1.5 h-1.5 rounded-full bg-slate-500 animate-pulse"></div>
                    <div className="w-1.5 h-1.5 rounded-full bg-slate-500 animate-pulse delay-75"></div>
                    <div className="w-1.5 h-1.5 rounded-full bg-slate-500 animate-pulse delay-150"></div>
                 </div>
              </div>
            )}
          </div>

          <div className="p-3 bg-slate-950 border-t border-slate-800 flex gap-2">
             <input 
               type="text" 
               value={input}
               onChange={(e) => setInput(e.target.value)}
               onKeyDown={(e) => e.key === 'Enter' && handleSend()}
               placeholder="Query FinFlow DB..."
               className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-cyber-pink transition-colors"
             />
             <button onClick={handleSend} className="bg-slate-800 hover:bg-cyber-pink hover:text-white text-slate-400 p-2 rounded-lg transition-colors">
               <Send className="w-4 h-4"/>
             </button>
          </div>
        </div>
      )}
    </>
  );
}
