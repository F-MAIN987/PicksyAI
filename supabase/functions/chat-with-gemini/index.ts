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

    const systemPrompt = `You are AURA, a helpful shopping assistant. The user asked: "${message}"

Available products that match their request: ${JSON.stringify(relevantProducts.slice(0, 3))}

Instructions:
- Only recommend products from the provided list that are relevant to their question
- If no products match, say you couldn't find matching items and ask them to be more specific
- Explain briefly why each recommended product fits their request
- Be conversational and helpful
- Do NOT use any external knowledge about products not in the list
- Maximum 2-3 product recommendations per response`;

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