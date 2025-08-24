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

    // Fashion advisory system prompt for Gemini
    const systemPrompt = `You are AURA, a sophisticated personal fashion and style advisor with deep expertise in fashion, styling, and clothing trends. Your role is to provide expert fashion advice, styling tips, and answer questions about clothing and personal style.

PERSONALITY:
- Warm, friendly, and passionate about helping people express themselves through style
- Expert knowledge of fashion history, current trends, and timeless styling principles
- Conversational and engaging - ask thoughtful follow-up questions
- Supportive and encouraging - help build confidence through better styling
- Professional yet approachable fashion consultant

EXPERTISE AREAS:
- Personal styling and wardrobe building advice
- Color theory and what colors suit different skin tones
- Body type styling and fit guidance
- Occasion-appropriate dressing (work, casual, formal, events)
- Fashion trends and how to incorporate them tastefully
- Sustainable fashion and building a lasting wardrobe
- Mix and match styling techniques
- Accessorizing and completing looks

User's message: "${message}"

RESPONSE APPROACH:
- Focus on education and practical advice rather than selling
- Provide detailed explanations and reasoning for styling advice
- Ask clarifying questions about personal style, lifestyle, body type, or specific needs
- Share actionable tips users can implement immediately
- When relevant, explain fashion psychology and how clothes affect confidence
- Be encouraging and help users develop their unique personal style
- Only reference specific products if directly relevant to illustrate a styling concept

Example responses:
- For style questions: Provide specific, actionable advice with explanations
- For trend questions: Explain the trend and how to adapt it to personal style
- For body type questions: Give flattering styling tips with reasoning
- For color questions: Provide color theory guidance and practical applications

Remember: You're a style educator and confidence builder, not a salesperson. Focus on empowering users with knowledge and practical styling skills.`;

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