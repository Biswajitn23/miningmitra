import { useState, useRef, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { 
  MessageCircle, 
  X, 
  Send, 
  Loader2, 
  Sparkles, 
  Bot,
  User,
  Minimize2,
  Maximize2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { sendMessageToPerplexity, QUICK_QUESTIONS, type Message } from '@/lib/perplexity';
import { toast } from 'sonner';

export const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: "👋 Hi! I'm MiningMitra AI, your mining safety assistant. Ask me anything about corridor safety, environmental monitoring, worker health, or equipment maintenance!",
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Debug: Log component mount
  useEffect(() => {
    console.log('🤖 Chatbot component mounted');
  }, []);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen && !isMinimized && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen, isMinimized]);

  const handleSendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      role: 'user',
      content: input.trim(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await sendMessageToPerplexity([...messages, userMessage]);
      
      if (response.error) {
        toast.error('Failed to get response', {
          description: response.error,
        });
      }

      const assistantMessage: Message = {
        role: 'assistant',
        content: response.message,
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      toast.error('Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickQuestion = (question: string) => {
    setInput(question);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="chatbot-container">
      {/* Floating Chat Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            className="fixed bottom-6 right-6 z-[9999] pointer-events-auto"
            style={{ position: 'fixed' }}
          >
            <Button
              onClick={() => {
                console.log('Chatbot button clicked!');
                setIsOpen(true);
              }}
              size="lg"
              className="h-16 w-16 rounded-full shadow-2xl bg-gradient-to-br from-red-600 to-red-800 hover:from-red-700 hover:to-red-900 group relative overflow-hidden pointer-events-auto cursor-pointer"
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
              />
              <MessageCircle className="h-7 w-7 group-hover:scale-110 transition-transform relative z-10" />
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute -top-1 -right-1 h-4 w-4 bg-green-500 rounded-full border-2 border-background"
              />
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 100, scale: 0.8 }}
            animate={{ 
              opacity: 1, 
              y: 0, 
              scale: 1,
              height: isMinimized ? 'auto' : '600px'
            }}
            exit={{ opacity: 0, y: 100, scale: 0.8 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed bottom-6 right-6 z-[9999] w-[420px] max-w-[calc(100vw-3rem)] pointer-events-auto"
            style={{ position: 'fixed' }}
            onWheel={(e) => e.stopPropagation()}
          >
            <Card className="overflow-hidden border-2 border-red-600/30 shadow-2xl backdrop-blur-xl bg-background/95" onWheel={(e) => e.stopPropagation()}>
              {/* Header */}
              <div className="bg-gradient-to-r from-red-600 to-red-800 p-4 text-white">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <div className="h-10 w-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                        <Bot className="h-6 w-6" />
                      </div>
                      <motion.div
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="absolute -bottom-1 -right-1 h-3 w-3 bg-green-400 rounded-full border-2 border-red-600"
                      />
                    </div>
                    <div>
                      <h3 className="font-bold flex items-center gap-2">
                        MiningMitra AI
                        <Sparkles className="h-4 w-4" />
                      </h3>
                      <p className="text-xs text-white/80">Mining Safety Assistant</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      onClick={() => setIsMinimized(!isMinimized)}
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-white hover:bg-white/20"
                    >
                      {isMinimized ? <Maximize2 className="h-4 w-4" /> : <Minimize2 className="h-4 w-4" />}
                    </Button>
                    <Button
                      onClick={() => setIsOpen(false)}
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-white hover:bg-white/20"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>

              {!isMinimized && (
                <CardContent className="p-0">
                  {/* Messages Area */}
                  <ScrollArea 
                    className="h-[400px] p-4" 
                    ref={scrollAreaRef}
                    onWheel={(e) => e.stopPropagation()}
                  >
                    <div className="space-y-4" onWheel={(e) => e.stopPropagation()}>
                      {messages.map((message, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className={`flex gap-3 ${
                            message.role === 'user' ? 'flex-row-reverse' : 'flex-row'
                          }`}
                        >
                          {/* Avatar */}
                          <div
                            className={`flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center ${
                              message.role === 'user'
                                ? 'bg-gradient-to-br from-gray-600 to-gray-800'
                                : 'bg-gradient-to-br from-red-600 to-red-800'
                            }`}
                          >
                            {message.role === 'user' ? (
                              <User className="h-4 w-4 text-white" />
                            ) : (
                              <Bot className="h-4 w-4 text-white" />
                            )}
                          </div>

                          {/* Message Bubble */}
                          <div
                            className={`flex-1 max-w-[80%] rounded-2xl p-3 ${
                              message.role === 'user'
                                ? 'bg-gradient-to-br from-gray-700 to-gray-800 text-white'
                                : 'bg-gradient-to-br from-red-50 to-red-100 text-black border border-red-200/50'
                            }`}
                          >
                            <p className="text-sm leading-relaxed whitespace-pre-wrap text-black">
                              {message.content}
                            </p>
                          </div>
                        </motion.div>
                      ))}

                      {/* Loading Indicator */}
                      {isLoading && (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="flex gap-3"
                        >
                          <div className="flex-shrink-0 h-8 w-8 rounded-full bg-gradient-to-br from-red-600 to-red-800 flex items-center justify-center">
                            <Bot className="h-4 w-4 text-white" />
                          </div>
                          <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-2xl p-3 border border-red-200/50">
                            <div className="flex gap-1">
                              <motion.div
                                animate={{ scale: [1, 1.2, 1] }}
                                transition={{ duration: 0.6, repeat: Infinity, delay: 0 }}
                                className="h-2 w-2 rounded-full bg-red-600"
                              />
                              <motion.div
                                animate={{ scale: [1, 1.2, 1] }}
                                transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }}
                                className="h-2 w-2 rounded-full bg-red-600"
                              />
                              <motion.div
                                animate={{ scale: [1, 1.2, 1] }}
                                transition={{ duration: 0.6, repeat: Infinity, delay: 0.4 }}
                                className="h-2 w-2 rounded-full bg-red-600"
                              />
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </div>
                  </ScrollArea>

                  {/* Quick Questions */}
                  {messages.length === 1 && (
                    <div className="px-4 pb-3 space-y-2">
                      <p className="text-xs text-muted-foreground font-medium">Quick Questions:</p>
                      <div className="flex flex-wrap gap-2">
                        {QUICK_QUESTIONS.slice(0, 3).map((question, index) => (
                          <Badge
                            key={index}
                            variant="outline"
                            className="cursor-pointer hover:bg-red-50 dark:hover:bg-red-950/30 hover:border-red-600 transition-colors text-xs"
                            onClick={() => handleQuickQuestion(question)}
                          >
                            {question}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Input Area */}
                  <div className="border-t p-4 bg-muted/30">
                    <div className="flex gap-2">
                      <Input
                        ref={inputRef}
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="Ask about mining safety..."
                        disabled={isLoading}
                        className="flex-1 bg-background"
                      />
                      <Button
                        onClick={handleSendMessage}
                        disabled={isLoading || !input.trim()}
                        size="icon"
                        className="bg-gradient-to-br from-red-600 to-red-800 hover:from-red-700 hover:to-red-900"
                      >
                        {isLoading ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Send className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                    <p className="text-[10px] text-muted-foreground mt-2 text-center">
                      Powered by Perplexity AI • Press Enter to send
                    </p>
                  </div>
                </CardContent>
              )}
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
