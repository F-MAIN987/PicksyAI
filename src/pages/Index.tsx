import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Sparkles, MessageCircle, ShoppingBag, Clock, Shield, Heart, Star, ChevronRight, Users, Award, Zap } from "lucide-react";
import heroImage from "@/assets/hero-image.jpg";
import Header from "@/components/Header";
import StyleQuiz from "@/components/StyleQuiz";
import AssistantChat from "@/components/AssistantChat";

const Index = () => {
  const [currentView, setCurrentView] = useState<"home" | "quiz" | "chat">("home");

  if (currentView === "quiz") {
    return <StyleQuiz onBack={() => setCurrentView("home")} />;
  }

  if (currentView === "chat") {
    return <AssistantChat onBack={() => setCurrentView("home")} />;
  }

  return (
    <div className="min-h-screen">
      <Header />
      
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center">
        <div className="container mx-auto px-4 py-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <Badge variant="secondary" className="text-sm px-4 py-2">
                  ✨ AI-Powered Fashion Advisor
                </Badge>
                <h1 className="text-5xl lg:text-7xl font-bold leading-tight">
                  Discover Your
                  <span className="block bg-hero-gradient bg-clip-text text-transparent">
                    Perfect Style
                  </span>
                </h1>
                <p className="text-xl text-muted-foreground max-w-lg">
                  Get personalized fashion advice, styling tips, and expert recommendations tailored to your unique taste and lifestyle.
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  size="lg" 
                  className="text-lg px-8 py-6"
                  onClick={() => setCurrentView("chat")}
                >
                  <MessageCircle className="mr-2 h-5 w-5" />
                  Start Styling Session
                </Button>
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="text-lg px-8 py-6"
                  onClick={() => setCurrentView("quiz")}
                >
                  <Sparkles className="mr-2 h-5 w-5" />
                  Take Style Quiz
                </Button>
              </div>

              {/* Stats */}
              <div className="flex gap-8 pt-8">
                <div className="text-center">
                  <div className="text-3xl font-bold bg-hero-gradient bg-clip-text text-transparent">10K+</div>
                  <div className="text-sm text-muted-foreground">Happy Clients</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold bg-hero-gradient bg-clip-text text-transparent">500+</div>
                  <div className="text-sm text-muted-foreground">Style Tips</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold bg-hero-gradient bg-clip-text text-transparent">24/7</div>
                  <div className="text-sm text-muted-foreground">AI Support</div>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="absolute inset-0 bg-hero-gradient rounded-3xl blur-3xl opacity-20 scale-110"></div>
              <img 
                src={heroImage} 
                alt="Fashion styling consultation" 
                className="relative rounded-3xl shadow-hero w-full h-auto"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-subtle-gradient">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Why Choose AURA?</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Experience the future of personal styling with our AI-powered fashion advisor
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="border-0 shadow-card hover:shadow-glow transition-all">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-hero-gradient rounded-full flex items-center justify-center mx-auto mb-6">
                  <Zap className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-4">Instant Advice</h3>
                <p className="text-muted-foreground">
                  Get personalized styling recommendations in seconds with our advanced AI technology.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-card hover:shadow-glow transition-all">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-hero-gradient rounded-full flex items-center justify-center mx-auto mb-6">
                  <Users className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-4">Expert Knowledge</h3>
                <p className="text-muted-foreground">
                  Trained on fashion expertise from top stylists and industry professionals worldwide.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-card hover:shadow-glow transition-all">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-hero-gradient rounded-full flex items-center justify-center mx-auto mb-6">
                  <Award className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-4">Personalized</h3>
                <p className="text-muted-foreground">
                  Tailored advice based on your body type, lifestyle, budget, and personal preferences.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Our Services</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Comprehensive fashion advice for every aspect of your style journey
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: MessageCircle,
                title: "Style Consultation",
                description: "One-on-one fashion advice",
                color: "bg-purple-500"
              },
              {
                icon: Heart,
                title: "Wardrobe Planning",
                description: "Build a cohesive closet",
                color: "bg-pink-500"
              },
              {
                icon: ShoppingBag,
                title: "Shopping Guidance",
                description: "Smart purchase decisions",
                color: "bg-blue-500"
              },
              {
                icon: Star,
                title: "Occasion Styling",
                description: "Perfect outfits for events",
                color: "bg-green-500"
              }
            ].map((service, index) => (
              <Card key={index} className="border-0 shadow-card hover:shadow-glow transition-all group cursor-pointer">
                <CardContent className="p-6">
                  <div className={`w-12 h-12 ${service.color} rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                    <service.icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{service.title}</h3>
                  <p className="text-sm text-muted-foreground">{service.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-subtle-gradient">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">What Our Clients Say</h2>
            <p className="text-xl text-muted-foreground">Real feedback from fashion-forward individuals</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: "Sarah Thompson",
                role: "Fashion Enthusiast",
                content: "AURA completely transformed my wardrobe! The AI gives incredibly personalized advice.",
                rating: 5
              },
              {
                name: "Mike Chen",
                role: "Business Professional",
                content: "Perfect for building a professional wardrobe. The styling tips are spot-on!",
                rating: 5
              },
              {
                name: "Emma Rodriguez",
                role: "Creative Director",
                content: "Love how AURA understands my unique style and helps me express it better.",
                rating: 5
              }
            ].map((testimonial, index) => (
              <Card key={index} className="border-0 shadow-card">
                <CardContent className="p-6">
                  <div className="flex mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-muted-foreground mb-4">"{testimonial.content}"</p>
                  <div>
                    <div className="font-semibold">{testimonial.name}</div>
                    <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="bg-hero-gradient rounded-3xl p-12 text-center text-white">
            <h2 className="text-4xl font-bold mb-4">Ready to Transform Your Style?</h2>
            <p className="text-xl opacity-90 mb-8 max-w-2xl mx-auto">
              Join thousands of fashion-forward individuals who trust AURA for their styling needs.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                variant="secondary"
                className="text-lg px-8 py-6"
                onClick={() => setCurrentView("chat")}
              >
                <MessageCircle className="mr-2 h-5 w-5" />
                Get Started Free
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                className="text-lg px-8 py-6 bg-white/10 border-white/20 text-white hover:bg-white/20"
                onClick={() => setCurrentView("quiz")}
              >
                <Sparkles className="mr-2 h-5 w-5" />
                Take Style Quiz
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h3 className="text-2xl font-bold bg-hero-gradient bg-clip-text text-transparent mb-4">AURA</h3>
            <p className="text-muted-foreground mb-6">Your AI-powered personal fashion stylist</p>
            <div className="flex justify-center gap-8 text-sm text-muted-foreground">
              <span>Privacy Policy</span>
              <span>Terms of Service</span>
              <span>Contact</span>
              <span>About</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;