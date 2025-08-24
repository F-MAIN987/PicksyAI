import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};



serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { message, products } = await req.json();
    
    // Get GEMINI_API_KEY from environment
    const GEMINI_API_KEY = Deno.env.get('GEMINI_API_KEY');
    if (!GEMINI_API_KEY) {
      console.error('GEMINI_API_KEY not found in environment');
      throw new Error('GEMINI_API_KEY not configured');
    }

    console.log('Processing message:', message);

    // Fashion-related keywords for product filtering
    const fashionKeywords = [
      'style', 'fashion', 'outfit', 'wear', 'clothing', 'dress', 'shirt', 'pants', 'shoes', 
      'jacket', 'accessories', 'bag', 'jewelry', 'wardrobe', 'trendy', 'casual', 'formal',
      'color', 'size', 'fit', 'brand', 'material', 'fabric', 'season', 'occasion',
      'shopping', 'buy', 'purchase', 'recommend', 'suggest', 'look', 'appearance'
    ];

    // Check if the message is fashion-related
    const isFashionQuery = fashionKeywords.some(keyword => 
      message.toLowerCase().includes(keyword.toLowerCase())
    );

    let relevantProducts = [];
    let systemPrompt = `You are PicksyAI, a friendly and intelligent AI assistant. You can help with a wide variety of topics and questions. Be conversational, helpful, and engaging in your responses.

Key guidelines:
- Be natural and conversational in your responses
- If users ask about fashion, style, or shopping, you can recommend products when relevant
- For general questions, provide helpful and informative answers
- Keep responses concise but comprehensive
- Be encouraging and positive in your tone
- If you don't know something, be honest about it

Respond naturally to whatever the user asks about.`;

    // If it's a fashion query and we have products, filter relevant ones
    if (isFashionQuery && products && products.length > 0) {
      // Simple relevance filtering based on message content
      relevantProducts = products.filter(product => {
        const searchTerms = message.toLowerCase().split(' ');
        const productText = `${product.name} ${product.category} ${product.why}`.toLowerCase();
        return searchTerms.some(term => productText.includes(term)) || 
               fashionKeywords.some(keyword => productText.includes(keyword));
      }).slice(0, 3); // Limit to 3 most relevant products

      systemPrompt = `You are PicksyAI, a friendly AI fashion and shopping assistant. The user is asking about fashion, style, or shopping.

${relevantProducts.length > 0 ? `Here are some relevant products that might help:
${relevantProducts.map(p => `- ${p.name} (${p.price}) - ${p.why}`).join('\n')}

When recommending products, explain why they would be good for the user's specific needs.` : ''}

Key guidelines:
- Be conversational and helpful
- Provide fashion advice and styling tips
- Recommend products when they match the user's needs
- Explain your reasoning for recommendations
- Be encouraging about their style choices
- Keep responses engaging and not too long`;
    }

    // Make request to Gemini API
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                { text: systemPrompt },
                { text: `User message: ${message}` }
              ]
            }
          ],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 500,
          }
        })
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Gemini API error:', errorText);
      throw new Error(`Gemini API error: ${response.status}`);
    }

    const data = await response.json();
    console.log('Gemini response:', data);

    // Extract the generated text
    let generatedContent = "I'm having trouble processing your request right now. Please try again!";
    
    if (data.candidates && data.candidates[0] && 
        data.candidates[0].content && data.candidates[0].content.parts && 
        data.candidates[0].content.parts[0] && data.candidates[0].content.parts[0].text) {
      generatedContent = data.candidates[0].content.parts[0].text;
    }

    // Return response with content and products (if fashion-related)
    return new Response(
      JSON.stringify({
        content: generatedContent,
        products: isFashionQuery ? relevantProducts : []
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );

  } catch (error) {
    console.error('Error in chat-with-gemini function:', error);
    
    // Return a more helpful error response
    return new Response(
      JSON.stringify({
        error: 'Failed to process request',
        content: "I'm having trouble right now. Please try again!",
        products: []
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});