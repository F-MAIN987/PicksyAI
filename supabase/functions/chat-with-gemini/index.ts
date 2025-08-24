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

    // Smart shopping assistant system prompt for Gemini
    const systemPrompt = `You are AURA, a smart shopping assistant and expert fashion advisor. When users ask for specific products, provide immediate recommendations rather than asking multiple questions.

CORE CAPABILITIES:
- Provide 5-7 immediate product recommendations when users ask for specific items
- Include diverse categories, brands, and price points
- Consider seasonality and current trends
- Give brief styling tips with each recommendation

RESPONSE APPROACH:
- For general greetings/casual conversation: Respond naturally without products
- For specific product requests (like "winter jackets", "shoes", "dresses"): IMMEDIATELY suggest 5-7 relevant products with brief explanations
- For general style questions: Ask ONE clarifying question max, then provide recommendations

Available products for recommendations:
${JSON.stringify(relevantProducts, null, 2)}

User's message: "${message}"
Is this a fashion-related query: ${isFashionQuery}

RECOMMENDATION FORMAT (for fashion queries):
- Lead with enthusiasm about the request
- Suggest 5-7 products immediately
- Include brief reason why each product is great
- End with ONE optional follow-up question if needed for refinement

Example for "winter jackets":
"Great choice for winter! Here are some fantastic jacket options I'd recommend:
[list 5-7 products with brief explanations]
Let me know if you'd like suggestions for a specific style or budget!"

Remember: Be decisive and helpful - provide immediate value with product suggestions rather than extensive questioning.`;

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
      products: isFashionQuery ? relevantProducts.slice(0, 7) : [] // Return up to 7 products for fashion queries
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