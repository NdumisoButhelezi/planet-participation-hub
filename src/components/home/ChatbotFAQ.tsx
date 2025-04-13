
import { useState, useRef, useEffect } from "react";
import { MessageCircle, Send, X, MinusCircle, Bot, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface Message {
  content: string;
  sender: "user" | "bot";
  timestamp: Date;
}

const ChatbotFAQ = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      content: "Hi there! I'm PlutoBot. How can I help you learn about PlutoDev?",
      sender: "bot",
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const toggleChat = () => {
    setIsOpen(!isOpen);
    setIsMinimized(false);
  };

  const toggleMinimize = () => {
    setIsMinimized(!isMinimized);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    // Add user message
    const userMessage: Message = {
      content: inputMessage,
      sender: "user",
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInputMessage("");

    // Process response with a slight delay to simulate thinking
    setTimeout(() => generateResponse(inputMessage), 500);
  };

  const generateResponse = (query: string) => {
    const normalizedQuery = query.toLowerCase();
    let response = "";

    // FAQ logic with if-else responses
    if (normalizedQuery.includes("course") || normalizedQuery.includes("learning") || normalizedQuery.includes("curriculum")) {
      response = "PlutoDev offers a comprehensive curriculum covering web development, mobile apps, AI, and cloud computing. Our courses are designed with a competitive, gamified approach to keep you engaged!";
    } 
    else if (normalizedQuery.includes("points") || normalizedQuery.includes("leaderboard") || normalizedQuery.includes("score")) {
      response = "You earn points by completing challenges, helping peers, and submitting quality projects. These points help you climb our leaderboard and unlock special content and recognition!";
    }
    else if (normalizedQuery.includes("competitive") || normalizedQuery.includes("game") || normalizedQuery.includes("gamif")) {
      response = "PlutoDev uses gamification to make learning fun! Earn points, compete on leaderboards, win weekly challenges, and unlock achievements as you progress through your learning journey.";
    }
    else if (normalizedQuery.includes("community") || normalizedQuery.includes("help") || normalizedQuery.includes("support")) {
      response = "Our community is active and supportive! Connect with peers, participate in discussions, and get help from mentors. We also offer live Q&A sessions and dedicated support for premium members.";
    }
    else if (normalizedQuery.includes("cost") || normalizedQuery.includes("price") || normalizedQuery.includes("subscription") || normalizedQuery.includes("free")) {
      response = "PlutoDev offers both free and premium plans. The free tier gives you access to basic learning paths, while premium unlocks advanced projects, mentor support, and exclusive competitions.";
    }
    else if (normalizedQuery.includes("register") || normalizedQuery.includes("sign up") || normalizedQuery.includes("join") || normalizedQuery.includes("account")) {
      response = "You can register easily by clicking the 'Get Started' button on our homepage. The registration process takes less than 2 minutes, and you can start learning immediately!";
    }
    else if (normalizedQuery.includes("project") || normalizedQuery.includes("portfolio") || normalizedQuery.includes("build")) {
      response = "PlutoDev helps you build real-world projects that you can add to your portfolio. Each learning path includes hands-on projects with guidance from industry experts.";
    }
    else if (normalizedQuery.includes("certificate") || normalizedQuery.includes("certification")) {
      response = "Upon completing our learning paths, you'll receive a verified certificate that you can share on your resume and LinkedIn profile to showcase your skills to potential employers.";
    }
    else if (normalizedQuery.includes("job") || normalizedQuery.includes("career") || normalizedQuery.includes("employ")) {
      response = "Many of our graduates have landed jobs at top tech companies. We offer career guidance, resume reviews, and interview preparation to help you succeed in your job search.";
    }
    else if (normalizedQuery.includes("hello") || normalizedQuery.includes("hi") || normalizedQuery.includes("hey")) {
      response = "Hello! Welcome to PlutoDev. I'm here to answer any questions you have about our learning platform. What would you like to know?";
    }
    else if (normalizedQuery.includes("thank")) {
      response = "You're welcome! Is there anything else I can help you with about PlutoDev?";
    }
    else {
      response = "I'm sorry, but PlutoDev doesn't offer information on that topic. I'm here to help with questions about our learning platform, courses, community, and features. Is there something specific about PlutoDev you'd like to know?";
    }

    // Add bot response
    const botMessage: Message = {
      content: response,
      sender: "bot",
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, botMessage]);
  };

  useEffect(() => {
    // Scroll to the latest message
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    
    // Focus the input when chat is opened
    if (isOpen && !isMinimized) {
      inputRef.current?.focus();
    }
  }, [messages, isOpen, isMinimized]);

  return (
    <>
      {/* Chat toggle button */}
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              onClick={toggleChat}
              className={cn(
                "fixed bottom-5 right-5 z-50 rounded-full p-4 shadow-lg", 
                isOpen ? "bg-red-500 hover:bg-red-600" : "bg-blue-600 hover:bg-blue-700"
              )}
              size="icon"
            >
              {isOpen ? <X className="h-6 w-6" /> : <MessageCircle className="h-6 w-6" />}
            </Button>
          </TooltipTrigger>
          <TooltipContent side="left">
            <p>{isOpen ? "Close chat" : "Open FAQ chat"}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      {/* Chat window */}
      {isOpen && (
        <div 
          className={cn(
            "fixed bottom-20 right-5 z-50 w-80 sm:w-96 rounded-xl bg-white shadow-xl border border-gray-200 transition-all duration-300 ease-in-out",
            isMinimized ? "h-14" : "h-[30rem]"
          )}
        >
          {/* Chat header */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-t-xl p-3 text-white flex justify-between items-center">
            <div className="flex items-center">
              <Bot className="h-5 w-5 mr-2" />
              <h3 className="font-semibold">PlutoBot Assistant</h3>
            </div>
            <div className="flex space-x-1">
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={toggleMinimize} 
                className="h-8 w-8 text-white hover:bg-white/20 rounded-full"
              >
                <MinusCircle className="h-5 w-5" />
              </Button>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={toggleChat} 
                className="h-8 w-8 text-white hover:bg-white/20 rounded-full"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
          </div>

          {/* Chat content */}
          {!isMinimized && (
            <>
              {/* Messages area */}
              <div className="p-4 h-[calc(100%-8rem)] overflow-y-auto bg-gray-50">
                {messages.map((message, index) => (
                  <div
                    key={index}
                    className={cn(
                      "mb-4 max-w-[85%] rounded-lg p-3 break-words",
                      message.sender === "user"
                        ? "bg-blue-500 text-white ml-auto rounded-br-none"
                        : "bg-gray-200 text-gray-800 rounded-bl-none"
                    )}
                  >
                    <div className="flex items-center mb-1">
                      {message.sender === "bot" ? (
                        <Bot className="h-4 w-4 mr-1" />
                      ) : (
                        <User className="h-4 w-4 mr-1" />
                      )}
                      <span className="text-xs font-semibold">
                        {message.sender === "user" ? "You" : "PlutoBot"}
                      </span>
                    </div>
                    {message.content}
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>

              {/* Input area */}
              <form onSubmit={handleSubmit} className="p-3 border-t border-gray-200 bg-white rounded-b-xl">
                <div className="flex">
                  <Input
                    ref={inputRef}
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    placeholder="Ask about PlutoDev..."
                    className="flex-1 mr-2 focus-visible:ring-blue-500"
                  />
                  <Button type="submit" className="bg-blue-600 hover:bg-blue-700" size="icon">
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </form>
            </>
          )}
        </div>
      )}
    </>
  );
};

export default ChatbotFAQ;
