import { useState, useRef, useEffect } from 'react';
import { Card } from '@/shared/ui/Card';
import { Button } from '@/shared/ui/Button';
import { Input } from '@/shared/ui/Input';
import { ScrollArea } from '@/shared/ui/ScrollArea';
import { Loader } from '@/shared/ui/Loader';
import { Send, Bot, User, Sparkles } from 'lucide-react';
import { useAI } from '../hooks/useAI';
import { AIMessage } from '../types';
import { cn } from '@/shared/lib/cn';
import { motion, AnimatePresence } from 'framer-motion';

export const ChatInterface = () => {
    const { chat } = useAI();
    const [input, setInput] = useState('');
    const [messages, setMessages] = useState<AIMessage[]>([]);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = async () => {
        if (!input.trim()) return;

        const userMsg: AIMessage = {
            id: Date.now().toString(),
            role: 'user',
            content: input,
            timestamp: new Date().toISOString()
        };

        setMessages(prev => [...prev, userMsg]);
        setInput('');

        try {
            const response = await chat.mutateAsync({ message: userMsg.content });

            const aiMsg: AIMessage = {
                id: (Date.now() + 1).toString(),
                role: 'assistant',
                content: response.message || "I processed that request.",
                timestamp: new Date().toISOString()
            };

            setMessages(prev => [...prev, aiMsg]);
        } catch (error) {
            console.error(error);
            const errorMsg: AIMessage = {
                id: (Date.now() + 1).toString(),
                role: 'system',
                content: "Error: Could not connect to Neural Core.",
                timestamp: new Date().toISOString()
            };
            setMessages(prev => [...prev, errorMsg]);
        }
    };

    return (
        <Card className="h-[600px] flex flex-col bg-zinc-900/50 border-white/10 backdrop-blur-xl shadow-2xl overflow-hidden relative">
            {/* Header */}
            <div className="p-4 border-b border-white/5 flex items-center gap-3 bg-white/5">
                <div className="p-2 bg-primary/20 rounded-lg">
                    <Sparkles className="w-5 h-5 text-primary animate-pulse" />
                </div>
                <div>
                    <h3 className="font-bold text-white tracking-wide">LIA // ASSISTANT</h3>
                    <p className="text-xs text-gray-400 font-mono">NEURAL INTERFACE V2.2</p>
                </div>
            </div>

            {/* Messages Area */}
            <ScrollArea className="flex-1 p-4 space-y-4">
                <AnimatePresence initial={false}>
                    {messages.length === 0 && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="flex flex-col items-center justify-center h-full text-center text-gray-500 space-y-4 mt-20"
                        >
                            <Bot className="w-16 h-16 opacity-20" />
                            <p>System Online. Awaiting Input.</p>
                        </motion.div>
                    )}

                    {messages.map((msg) => (
                        <motion.div
                            key={msg.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className={cn(
                                "flex items-start gap-3 mb-4",
                                msg.role === 'user' ? "flex-row-reverse" : "flex-row"
                            )}
                        >
                            <div className={cn(
                                "w-8 h-8 rounded-full flex items-center justify-center shrink-0",
                                msg.role === 'user' ? "bg-white/10" : "bg-primary/20"
                            )}>
                                {msg.role === 'user' ? <User size={14} /> : <Bot size={14} className="text-primary" />}
                            </div>
                            <div className={cn(
                                "max-w-[80%] rounded-2xl p-3 text-sm leading-relaxed",
                                msg.role === 'user'
                                    ? "bg-white text-black rounded-tr-sm"
                                    : "bg-white/5 text-gray-200 border border-white/5 rounded-tl-sm"
                            )}>
                                {msg.content}
                            </div>
                        </motion.div>
                    ))}
                    {chat.isPending && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-2 text-xs text-primary font-mono ml-11">
                            <Loader text="PROCESSING" />
                        </motion.div>
                    )}
                </AnimatePresence>
                <div ref={messagesEndRef} />
            </ScrollArea>

            {/* Input Area */}
            <div className="p-4 bg-white/5 border-t border-white/5">
                <form
                    onSubmit={(e) => { e.preventDefault(); handleSend(); }}
                    className="flex gap-2"
                >
                    <Input
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Command or query..."
                        className="bg-black/20 border-white/10 focus:border-primary/50 text-white placeholder:text-gray-600"
                    />
                    <Button
                        type="submit"
                        disabled={chat.isPending || !input.trim()}
                        className="bg-primary hover:bg-primary/80 text-black px-4"
                    >
                        <Send size={18} />
                    </Button>
                </form>
            </div>
        </Card>
    );
};
