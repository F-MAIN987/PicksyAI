import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Sparkles, MessageCircle, ShoppingBag, Clock, Shield, Heart } from "lucide-react";
import heroImage from "@/assets/hero-image.jpg";
import StyleQuiz from "@/components/StyleQuiz";
import AssistantChat from "@/components/AssistantChat";

const Index = () => {
  const [showQuiz, setShowQuiz] = useState(false);
  const [showChat, setShowChat] = useState(false);

  const features = [
    {
      icon: Sparkles,
      title: "Tell us your vibe",
      description: "Quick 60-second style quiz to understand your taste"
    },
    {
      icon: MessageCircle,
      title: "See 3-6 picks with honest tradeoffs",
      description: "Curated recommendations with clear explanations"
    },
    {
      icon: ShoppingBag,
      title: "One tap to cart. Done.",
      description: "Seamless checkout with pre-built cart"
    }
  ];

  const trustFeatures = [
    { icon: Clock, text: "Real stock, real delivery ETAs" },
    { icon: Shield, text: "No spam discounts" },
    { icon: Heart, text: "Free 7-day returns on most items" }
  ];

  const sampleProducts = [
    {
      name: "Minimal Crew Tee",
      price: "₹1,299",
      why: "Perfect weight cotton, goes with everything",
      image: "/api/placeholder/200/240"
    },
    {
      name: "Tailored Straight Pants",
      price: "₹2,899", 
      why: "Relaxed fit, breathable fabric for all-day comfort",
      image: "/api/placeholder/200/240"
    },
    {
      name: "Classic Canvas Sneakers",
      price: "₹1,799",
      why: "Versatile silhouette, sustainable materials",
      image: "/api/placeholder/200/240"
    },
    {
      name: "Structured Blazer",
      price: "₹4,599",
      why: "Smart-casual ready, wrinkle-resistant fabric",
      image: "/api/placeholder/200/240"
    }
  ];

  if (showQuiz) {
    return <StyleQuiz onComplete={() => { setShowQuiz(false); setShowChat(true); }} />;
  }

  if (showChat) {
    return <AssistantChat onBack={() => setShowChat(false)} />;
  }

  return (
    <div className="min-h-screen bg-subtle-gradient">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="container mx-auto px-4 py-20 lg:py-32">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <h1 className="text-4xl lg:text-6xl font-bold tracking-tight">
                  Shop like it was
                  <span className="block bg-hero-gradient bg-clip-text text-transparent">
                    made for you
                  </span>
                </h1>
                <p className="text-xl text-muted-foreground max-w-lg">
                  AURA learns your taste, budget, and fit — then does the hunting for you.
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  variant="hero" 
                  size="lg"
                  onClick={() => setShowQuiz(true)}
                  className="group"
                >
                  <Sparkles className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                  Start your 60-second style quiz
                </Button>
                <Button 
                  variant="subtle" 
                  size="lg"
                  onClick={() => setShowChat(true)}
                >
                  <MessageCircle className="w-5 h-5" />
                  Talk to the assistant
                </Button>
              </div>

              {/* Trust Bar */}
              <div className="flex flex-wrap gap-6 pt-4">
                {trustFeatures.map((feature, index) => (
                  <div key={index} className="flex items-center gap-2 text-sm text-muted-foreground">
                    <feature.icon className="w-4 h-4 text-primary" />
                    {feature.text}
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              <div className="absolute inset-0 bg-hero-gradient rounded-3xl blur-3xl opacity-20 scale-110"></div>
              <img 
                src={heroImage} 
                alt="Curated fashion items" 
                className="relative rounded-3xl shadow-hero w-full h-auto"
              />
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">How it works</h2>
            <p className="text-lg text-muted-foreground">Three simple steps to your perfect wardrobe</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="border-0 shadow-card hover:shadow-glow transition-all duration-300 hover:-translate-y-1">
                <CardContent className="p-8 text-center">
                  <div className="w-16 h-16 bg-hero-gradient rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-glow">
                    <feature.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Preview carousel */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">Curated just for you</h2>
            <p className="text-lg text-muted-foreground">See how AURA finds pieces that fit your style</p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {sampleProducts.map((product, index) => (
              <Card key={index} className="group cursor-pointer overflow-hidden border-0 shadow-card hover:shadow-glow transition-all duration-300">
                  <div className="aspect-[4/5] bg-muted relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <div className="w-full h-full bg-hero-gradient flex items-center justify-center">
                    <div className="text-center p-4">
                      <div className="w-16 h-16 bg-background/20 backdrop-blur-sm rounded-full mx-auto mb-3 flex items-center justify-center border border-white/20">
                        <ShoppingBag className="w-8 h-8 text-white" />
                      </div>
                      <p className="text-sm font-medium text-white">{product.name}</p>
                    </div>
                  </div>
                </div>
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-medium text-sm">{product.name}</h3>
                    <span className="font-semibold text-sm">{product.price}</span>
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    {product.why}
                  </Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Privacy note */}
      <section className="py-12 bg-muted/30">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm text-muted-foreground">
            Your preferences live on your device unless you choose to save them.
          </p>
        </div>
      </section>
    </div>
  );
};

export default Index;