
import { useState, useRef, useEffect } from "react";
import { Bot, Send, X, MessageCircle, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { useIsMobile } from "@/hooks/use-mobile";

const PREMADE_PROMPTS = [
  "What programming languages do you teach?",
  "How do I get started with AI development?",
  "What are the course requirements?",
  "Tell me about the certification process",
  "How long does it take to complete?",
  "What support do you provide?",
];

const ChatbotFAQ = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      type: "bot",
      content: "Hi! I'm your AI assistant. How can I help you learn more about PlutoDev?",
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (message = input) => {
    if (!message.trim()) return;

    const userMessage = { type: "user", content: message };
    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const responses = {
        "What programming languages do you teach?": "We teach Python, JavaScript, React, Node.js, and AI/ML frameworks like TensorFlow and PyTorch. Our curriculum is designed to give you hands-on experience with the most in-demand technologies.",
        "How do I get started with AI development?": "Start with our foundational courses in Python and mathematics. Then progress to our AI/ML modules covering machine learning basics, neural networks, and practical AI applications. We provide step-by-step guidance throughout your journey.",
        "What are the course requirements?": "No prior programming experience required! We start from the basics. You'll need a computer with internet access and dedication to practice. Our self-paced learning allows you to progress at your own speed.",
        "Tell me about the certification process": "Complete all course modules, submit projects, and pass our assessments to earn your PlutoDev certification. Our certificates are recognized by industry partners and demonstrate your practical coding skills.",
        "How long does it take to complete?": "Our program typically takes 6-12 months depending on your pace and schedule. With our flexible learning approach, you can study part-time while working or studying full-time for faster completion.",
        "What support do you provide?": "We offer 24/7 AI-powered assistance, mentor sessions, peer learning communities, and dedicated support channels. You're never alone in your learning journey with us!",
      };

      const botResponse = {
        type: "bot",
        content: responses[message] || "That's a great question! I'd be happy to help you with that. For specific inquiries, please feel free to reach out to our support team through the contact form on our website.",
      };

      setMessages(prev => [...prev, botResponse]);
      setIsTyping(false);
    }, 1500);
  };

  const handlePromptClick = (prompt: string) => {
    handleSend(prompt);
  };

  return (
    <>
      {/* Chat Button */}
      <div className="fixed bottom-4 right-4 z-50">
        <Button
          onClick={() => setIsOpen(!isOpen)}
          size={isMobile ? "default" : "lg"}
          className={`rounded-full shadow-lg transition-all duration-300 ${
            isOpen ? "scale-110 rotate-180" : "hover:scale-105"
          } bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700`}
        >
          {isOpen ? (
            <X className={`${isMobile ? "h-5 w-5" : "h-6 w-6"}`} />
          ) : (
            <MessageCircle className={`${isMobile ? "h-5 w-5" : "h-6 w-6"}`} />
          )}
        </Button>
      </div>

      {/* Chat Window */}
      <div
        className={`fixed bottom-20 right-4 z-40 transition-all duration-500 ease-in-out transform ${
          isOpen
            ? "translate-y-0 opacity-100 scale-100"
            : "translate-y-8 opacity-0 scale-95 pointer-events-none"
        } ${isMobile ? "w-[calc(100vw-2rem)] max-w-sm" : "w-96"}`}
      >
        <Card className="shadow-2xl border-0 bg-white/95 backdrop-blur-sm">
          {/* Header */}
          <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white p-4 rounded-t-lg">
            <div className="flex items-center gap-2">
              <Bot className="h-5 w-5" />
              <span className="font-semibold">PlutoDev AI Assistant</span>
              <Sparkles className="h-4 w-4 ml-auto animate-pulse" />
            </div>
          </div>

          <CardContent className="p-0">
            {/* Messages */}
            <div className={`${isMobile ? "h-64" : "h-80"} overflow-y-auto p-4 space-y-3`}>
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex ${message.type === "user" ? "justify-end" : "justify-start"} animate-fade-in`}
                >
                  <div
                    className={`max-w-[80%] p-3 rounded-lg text-sm ${
                      message.type === "user"
                        ? "bg-purple-600 text-white rounded-br-none"
                        : "bg-gray-100 text-gray-800 rounded-bl-none"
                    }`}
                  >
                    {message.content}
                  </div>
                </div>
              ))}
              
              {/* Typing Indicator */}
              {isTyping && (
                <div className="flex justify-start animate-fade-in">
                  <div className="bg-gray-100 text-gray-800 p-3 rounded-lg rounded-bl-none">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Premade Prompts */}
            {messages.length === 1 && (
              <div className="px-4 pb-3">
                <p className="text-xs text-gray-500 mb-2">Try asking:</p>
                <div className="grid grid-cols-1 gap-2">
                  {PREMADE_PROMPTS.slice(0, isMobile ? 3 : 4).map((prompt, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      size="sm"
                      onClick={() => handlePromptClick(prompt)}
                      className="text-left text-xs justify-start h-auto py-2 px-3 hover:bg-purple-50 hover:border-purple-200 transition-colors"
                    >
                      {prompt}
                    </Button>
                  ))}
                </div>
              </div>
            )}

            {/* Input */}
            <div className="p-4 border-t">
              <div className="flex gap-2">
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask me anything..."
                  className="flex-1 text-sm"
                  onKeyPress={(e) => e.key === "Enter" && handleSend()}
                />
                <Button
                  onClick={() => handleSend()}
                  size="sm"
                  className="bg-purple-600 hover:bg-purple-700"
                  disabled={!input.trim() || isTyping}
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default ChatbotFAQ;
