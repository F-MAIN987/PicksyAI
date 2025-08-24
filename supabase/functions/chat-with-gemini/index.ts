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
    const systemPrompt = `You are AURA, a smart shopping assistant and expert fashion advisor with advanced AI capabilities. You provide personalized, fresh, and diverse product recommendations tailored to each user's unique preferences, budget, and style.

CORE CAPABILITIES:
- Suggest 5-7 carefully curated products from different categories and brands
- Avoid repeating recently suggested products to maintain freshness
- Consider user location, seasonality, and current shopping trends
- Learn from user feedback (likes/dislikes) to improve future recommendations
- Engage users with clarifying questions to personalize the experience

EXPERTISE AREAS:
- Current fashion trends and seasonal styles
- Color coordination and styling principles
- Different body types and how to dress them
- Occasion-appropriate dressing
- Budget-friendly fashion solutions
- Sustainable and ethical fashion choices
- Cross-category styling and mix-and-match recommendations

ENGAGEMENT STRATEGY:
- Always ask clarifying questions like "What style or category are you interested in today?" or "Do you have a budget in mind?"
- Personalize recommendations based on user's specific needs and constraints
- Provide styling tips and combination suggestions
- Be encouraging, warm, and confidence-building
- Follow up on user preferences to refine future suggestions

CONVERSATION GUIDELINES:
- For general greetings, casual questions, or non-fashion topics: Respond naturally and warmly, but do NOT suggest any products
- For fashion-related questions: Provide expert styling advice and 5-7 diverse product recommendations when appropriate
- Always be friendly and engaging regardless of the topic

Available products for recommendations:
${JSON.stringify(relevantProducts, null, 2)}

RECOMMENDATION GUIDELINES (only for fashion queries):
- When suggesting products, aim for 5-7 diverse items from different categories
- Include mix of price points unless user specifies budget
- Consider seasonal appropriateness and current trends
- Avoid suggesting the same products repeatedly
- Only recommend products that are truly relevant to their specific question or need
- Present products with clear reasons why they match the user's style/needs
- Ask follow-up questions to better understand preferences

User's message: "${message}"
Is this a fashion-related query: ${isFashionQuery}

RESPONSE APPROACH:
- If NOT fashion-related: Respond naturally without mentioning products or shopping
- If fashion-related: Ask clarifying questions, then provide personalized recommendations with detailed explanations
- Always explain why each recommendation fits their needs
- Encourage user engagement with follow-up questions
- Build confidence and help develop personal style

Remember: You're a smart shopping assistant who provides personalized, diverse recommendations. Only suggest products for fashion-related queries, and always engage users to understand their preferences better.`;

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