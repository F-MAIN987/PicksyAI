import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const GEMINI_API_KEY = Deno.env.get('GEMINI_API_KEY');

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { message, products } = await req.json();

    // Find relevant products based on user message
    const relevantProducts = products.filter((product: any) => {
      const searchTerms = message.toLowerCase();
      const productText = `${product.name} ${product.category}`.toLowerCase();
      return searchTerms.split(' ').some((term: string) => 
        productText.includes(term) || 
        product.category.toLowerCase().includes(term)
      );
    });

    // Enhanced conversational system prompt for Gemini
    const systemPrompt = `You are AURA, a friendly and intelligent shopping assistant powered by AI. You're here to help users discover amazing products and have natural conversations about fashion, lifestyle, and shopping.

Personality:
- Be warm, enthusiastic, and genuinely helpful
- Use natural, conversational language - not robotic
- Show personality and be engaging
- Ask thoughtful follow-up questions to understand user needs better
- Be encouraging and supportive in your recommendations

User's message: "${message}"

Available products: ${JSON.stringify(relevantProducts.slice(0, 3))}

Response guidelines:
- If products match their request: Recommend 1-3 products with enthusiastic explanations
- If no products match: Be understanding, suggest alternatives, or ask clarifying questions
- For general questions: Engage naturally and guide conversation toward helpful product discovery
- Be conversational - use phrases like "I'd love to help you find...", "That sounds perfect for...", "I think you'd really like..."
- Always end with an engaging question or invitation to continue the conversation
- Keep responses concise but warm and personal

Remember: You're not just recommending products, you're having a genuine conversation with someone who's looking for help with their shopping journey.`;

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: systemPrompt
          }]
        }],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 1024,
        }
      }),
    });

    if (!response.ok) {
      throw new Error(`Gemini API error: ${response.status}`);
    }

    const data = await response.json();
    const generatedText = data.candidates?.[0]?.content?.parts?.[0]?.text || "I'm having trouble processing your request right now.";

    return new Response(JSON.stringify({ 
      content: generatedText,
      products: relevantProducts.slice(0, 3) // Return only relevant products
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in chat-with-gemini function:', error);
    return new Response(JSON.stringify({ 
      error: 'Failed to process request',
      content: "I'm having trouble right now. Please try again!" 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});