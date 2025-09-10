import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { studentName, learningReflection } = await req.json()

    const openRouterApiKey = Deno.env.get('OPENROUTER_API_KEY')
    if (!openRouterApiKey) {
      throw new Error('OpenRouter API key not configured')
    }

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openRouterApiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://lovable.dev',
        'X-Title': 'NDU Learning Management System',
      },
      body: JSON.stringify({
        model: 'openrouter/sonoma-sky-alpha',
        messages: [
          {
            role: 'system',
            content: 'You are a helpful and encouraging coding tutor providing feedback on student learning reflections. Your responses should be warm, supportive, and educational. Keep responses concise (2-3 sentences). Focus on celebrating their progress, acknowledging specific learning points they mentioned, and offering gentle encouragement for continued growth. Always maintain a positive, mentor-like tone.'
          },
          {
            role: 'user',
            content: `A student named ${studentName} submitted this learning reflection for their coding project: "${learningReflection}". Please provide encouraging feedback that acknowledges their specific learning achievements and motivates them to continue growing.`
          }
        ],
        temperature: 0.7,
        max_tokens: 200
      })
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(`OpenRouter API error: ${errorData.error?.message || 'Unknown error'}`)
    }

    const data = await response.json()
    const feedback = data.choices[0]?.message?.content || ''

    return new Response(
      JSON.stringify({ feedback }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    )
  } catch (error) {
    console.error('Error generating feedback:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      },
    )
  }
})