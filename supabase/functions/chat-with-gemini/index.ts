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

    // Check if the message is asking for fashion advice or product recommendations
    const fashionKeywords = [
      'outfit', 'style', 'fashion', 'clothes', 'wear', 'dress', 'shirt', 'pants', 'shoes',
      'look', 'recommend', 'suggest', 'buy', 'shopping', 'color', 'match', 'size',
      'occasion', 'formal', 'casual', 'work', 'party', 'date', 'wedding', 'trend',
      'wardrobe', 'accessory', 'jewelry', 'bag', 'jacket', 'coat', 'jeans', 'dress up'
    ];

    const isFashionQuery = fashionKeywords.some(keyword => 
      message.toLowerCase().includes(keyword)
    );

    // Only find relevant products if it's a fashion-related query
    let relevantProducts = [];
    if (isFashionQuery) {
      relevantProducts = products.filter((product: any) => {
        const searchTerms = message.toLowerCase();
        const productText = `${product.name} ${product.category}`.toLowerCase();
        return searchTerms.split(' ').some((term: string) => 
          productText.includes(term) || 
          product.category.toLowerCase().includes(term)
        );
      });
    }

    // Fashion advisory system prompt for Gemini
    const systemPrompt = `You are PicksyAI, a sophisticated personal fashion and style advisor with deep expertise in fashion, styling, and clothing trends. Your role is to provide expert fashion advice, styling tips, and answer questions about clothing and personal style.

CONVERSATION GUIDELINES:
- For general greetings, casual questions, or non-fashion topics: Respond naturally and warmly, but do NOT suggest any products
- For fashion-related questions: Provide expert styling advice and relevant product suggestions when appropriate
- Always be friendly and engaging regardless of the topic

PERSONALITY:
- Warm, friendly, and passionate about helping people express themselves through style
- Expert knowledge of fashion history, current trends, and timeless styling principles
- Conversational and engaging - ask thoughtful follow-up questions
- Supportive and encouraging - help build confidence through better styling
- Professional yet approachable fashion consultant

EXPERTISE AREAS (only relevant for fashion questions):
- Personal styling and wardrobe building advice
- Color theory and what colors suit different skin tones
- Body type styling and fit guidance
- Occasion-appropriate dressing (work, casual, formal, events)
- Fashion trends and how to incorporate them tastefully
- Sustainable fashion and building a lasting wardrobe
- Mix and match styling techniques
- Accessorizing and completing looks

User's message: "${message}"
Is this a fashion-related query: ${isFashionQuery}

RESPONSE APPROACH:
- If NOT fashion-related: Respond naturally to greetings, general questions, or casual conversation without mentioning products
- If fashion-related: Focus on education and practical advice, provide detailed explanations and reasoning for styling advice
- Ask clarifying questions about personal style, lifestyle, body type, or specific needs when relevant
- Share actionable tips users can implement immediately
- When relevant, explain fashion psychology and how clothes affect confidence
- Be encouraging and help users develop their unique personal style
- Only reference specific products if directly relevant to illustrate a styling concept

Example responses:
- For greetings: "Hello! I'm PicksyAI, your personal fashion advisor. How can I help you with your style today?"
- For general questions: Answer naturally without fashion advice
- For style questions: Provide specific, actionable advice with explanations
- For trend questions: Explain the trend and how to adapt it to personal style

Remember: You're a style educator and confidence builder, not a salesperson. Only suggest products when users are specifically asking for fashion advice or recommendations.`;

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
      products: isFashionQuery ? relevantProducts.slice(0, 3) : [] // Only return products for fashion queries
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