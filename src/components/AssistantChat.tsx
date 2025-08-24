import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Send, ShoppingBag, Heart, Clock, Star } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface AssistantChatProps {
  onBack: () => void;
}

interface Message {
  id: string;
  type: "user" | "assistant";
  content: string;
  products?: Product[];
  timestamp: Date;
}

interface Product {
  id: string;
  name: string;
  price: string;
  image: string;
  why: string;
  rating: number;
  inStock: boolean;
  eta: string;
}

const AssistantChat = ({ onBack }: AssistantChatProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [cart, setCart] = useState<Product[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Initial welcome message
    const welcomeMessage: Message = {
      id: "welcome",
      type: "assistant",
      content: "Hi! I'm AURA, your personal shopping assistant. I can help you find clothes that match your style, budget, and needs. What are you looking for today?",
      timestamp: new Date()
    };
    setMessages([welcomeMessage]);
  }, []);

  const mockProducts: Product[] = [
    {
      id: "1",
      name: "Relaxed Fit Cargo Pants",
      price: "₹2,299",
      image: "/api/placeholder/200/240",
      why: "Matches your minimal street style, relaxed fit as preferred",
      rating: 4.5,
      inStock: true,
      eta: "2-3 days"
    },
    {
      id: "2", 
      name: "Oversized Cotton Tee",
      price: "₹899",
      image: "/api/placeholder/200/240",
      why: "Perfect oversized fit, neutral color, quality cotton",
      rating: 4.7,
      inStock: true,
      eta: "2-3 days"
    },
    {
      id: "3",
      name: "Minimalist Sneakers", 
      price: "₹3,199",
      image: "/api/placeholder/200/240",
      why: "Clean design, sustainable materials, all-day comfort",
      rating: 4.3,
      inStock: true,
      eta: "3-4 days"
    }
  ];

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      content: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    // Simulate AI response
    setTimeout(() => {
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: "assistant",
        content: "Based on your preferences, here are some great options that match your style:",
        products: mockProducts,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, assistantMessage]);
      setIsLoading(false);
    }, 1500);
  };

  const addToCart = (product: Product) => {
    setCart(prev => [...prev, product]);
    toast({
      title: "Added to cart",
      description: `${product.name} has been added to your cart.`,
    });
  };

  const addAllToCart = (products: Product[]) => {
    setCart(prev => [...prev, ...products]);
    toast({
      title: "All items added",
      description: `${products.length} items added to your cart.`,
    });
  };

  return (
    <div className="min-h-screen bg-subtle-gradient">
      {/* Header */}
      <div className="sticky top-0 bg-background/95 backdrop-blur border-b z-10">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={onBack}>
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <div>
              <h1 className="font-semibold">AURA Assistant</h1>
              <p className="text-sm text-muted-foreground">Your personal stylist</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <ShoppingBag className="w-4 h-4 mr-2" />
              Cart ({cart.length})
            </Button>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="container mx-auto px-4 py-6 max-w-4xl">
        <div className="space-y-6 pb-32">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.type === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[80%] ${
                  message.type === "user"
                    ? "bg-primary text-primary-foreground"
                    : "bg-background border shadow-card"
                } rounded-2xl p-4`}
              >
                <p className="text-sm">{message.content}</p>
                
                {message.products && (
                  <div className="mt-6 space-y-4">
                    <div className="grid gap-4">
                      {message.products.map((product) => (
                        <Card key={product.id} className="border-0 shadow-card hover:shadow-glow transition-all">
                          <CardContent className="p-4">
                            <div className="flex gap-4">
                              <div className="w-20 h-24 bg-gradient-to-br from-purple-100 to-purple-50 rounded-lg flex items-center justify-center shrink-0">
                                <ShoppingBag className="w-8 h-8 text-primary" />
                              </div>
                              
                              <div className="flex-1 space-y-2">
                                <div className="flex justify-between items-start">
                                  <h3 className="font-medium text-sm">{product.name}</h3>
                                  <span className="font-semibold text-sm">{product.price}</span>
                                </div>
                                
                                <div className="flex items-center gap-2 text-xs">
                                  <div className="flex items-center gap-1">
                                    <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                                    <span>{product.rating}</span>
                                  </div>
                                  <div className="flex items-center gap-1 text-green-600">
                                    <Clock className="w-3 h-3" />
                                    <span>{product.eta}</span>
                                  </div>
                                  {product.inStock && (
                                    <Badge variant="secondary" className="text-xs px-2 py-0">
                                      In Stock
                                    </Badge>
                                  )}
                                </div>
                                
                                <p className="text-xs text-muted-foreground">
                                  {product.why}
                                </p>
                                
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => addToCart(product)}
                                  className="w-full"
                                >
                                  <Heart className="w-3 h-3 mr-2" />
                                  Add to Cart
                                </Button>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                    
                    <div className="flex gap-2 pt-2">
                      <Button
                        size="sm"
                        onClick={() => addAllToCart(message.products!)}
                        className="flex-1"
                      >
                        Add All to Cart
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="flex-1"
                      >
                        Refine
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
          
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-background border shadow-card rounded-2xl p-4">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></div>
                  <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                  <span className="text-sm text-muted-foreground ml-2">AURA is thinking...</span>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input */}
      <div className="fixed bottom-0 left-0 right-0 bg-background/95 backdrop-blur border-t">
        <div className="container mx-auto px-4 py-4 max-w-4xl">
          <div className="flex gap-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Tell me what you're looking for..."
              onKeyPress={(e) => e.key === "Enter" && handleSend()}
              className="flex-1"
            />
            <Button onClick={handleSend} disabled={!input.trim() || isLoading}>
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssistantChat;