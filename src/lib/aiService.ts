/**
 * AI Service for generating feedback using OpenRouter
 * This provides client-side AI generation as an alternative to Supabase Edge Functions
 */

const OPENROUTER_API_URL = 'https://openrouter.ai/api/v1/chat/completions';
const OPENROUTER_API_KEY = import.meta.env.VITE_OPENROUTER_API_KEY;
const SITE_URL = import.meta.env.VITE_SITE_URL || 'https://plutodev.com';
const SITE_NAME = import.meta.env.VITE_SITE_NAME || 'NDU Learning Management System';

interface FeedbackRequest {
  studentName: string;
  learningReflection: string;
  submissionType?: 'weekly' | 'playlist';
  weekNumber?: number;
  skillLevel?: 'beginner' | 'intermediate' | 'advanced';
}

interface AIResponse {
  feedback: string;
  model?: string;
}

/**
 * Generate AI feedback for a student submission
 */
export async function generateAIFeedback(request: FeedbackRequest): Promise<AIResponse> {
  if (!OPENROUTER_API_KEY || OPENROUTER_API_KEY === 'your_openrouter_api_key_here') {
    throw new Error('OpenRouter API key not configured. Please set VITE_OPENROUTER_API_KEY in .env.local');
  }

  const systemPrompt = buildSystemPrompt(request);
  const userPrompt = buildUserPrompt(request);

  try {
    const response = await fetch(OPENROUTER_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': SITE_URL,
        'X-Title': SITE_NAME,
      },
      body: JSON.stringify({
        model: selectModel(request),
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.7,
        max_tokens: 250,
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.error?.message || 
        `OpenRouter API error: ${response.status} ${response.statusText}`
      );
    }

    const data = await response.json();
    const feedback = data.choices[0]?.message?.content || '';

    if (!feedback.trim()) {
      throw new Error('AI returned empty feedback');
    }

    return {
      feedback: feedback.trim(),
      model: data.model || 'unknown'
    };
  } catch (error) {
    console.error('AI feedback generation error:', error);
    throw error;
  }
}

/**
 * Select the appropriate AI model based on request context
 */
function selectModel(request: FeedbackRequest): string {
  // Default: Fast and cost-effective model for general feedback
  // You can switch to other models based on your needs:
  // - 'anthropic/claude-3.5-sonnet' for detailed technical analysis
  // - 'openai/gpt-4o-mini' for quick responses
  // - 'google/gemini-pro-1.5' for longer context
  
  return 'openrouter/auto'; // Auto-selects best available model
}

/**
 * Build context-aware system prompt
 */
function buildSystemPrompt(request: FeedbackRequest): string {
  let prompt = `You are a helpful and encouraging coding tutor providing feedback on student learning reflections. 
Your responses should be warm, supportive, and educational. Keep responses concise (2-3 sentences).`;

  if (request.skillLevel) {
    const skillContext = {
      beginner: 'This student is a beginner. Use simple language and celebrate small wins.',
      intermediate: 'This student has intermediate skills. Provide balanced feedback with growth opportunities.',
      advanced: 'This student is advanced. Offer deeper technical insights and challenge them.'
    };
    prompt += `\n\n${skillContext[request.skillLevel]}`;
  }

  if (request.submissionType === 'weekly' && request.weekNumber) {
    prompt += `\n\nThis is a Week ${request.weekNumber} submission. Acknowledge their progress in the learning journey.`;
  }

  prompt += `\n\nFocus on:
1. Acknowledging specific learning points they mentioned
2. Celebrating their progress and effort
3. Offering one gentle suggestion for continued growth
4. Maintaining a positive, mentor-like tone`;

  return prompt;
}

/**
 * Build user prompt with submission details
 */
function buildUserPrompt(request: FeedbackRequest): string {
  const submissionContext = request.submissionType === 'weekly' 
    ? `Week ${request.weekNumber} coding project` 
    : 'playlist project';

  return `A student named ${request.studentName} submitted this learning reflection for their ${submissionContext}:

"${request.learningReflection}"

Please provide encouraging feedback that acknowledges their specific learning achievements and motivates them to continue growing.`;
}

/**
 * Test the AI service configuration
 */
export async function testAIService(): Promise<boolean> {
  try {
    const result = await generateAIFeedback({
      studentName: 'Test Student',
      learningReflection: 'I learned how to implement authentication in my app using Firebase. It was challenging but rewarding.',
      submissionType: 'weekly',
      weekNumber: 1,
      skillLevel: 'beginner'
    });
    
    console.log('✅ AI Service Test Passed');
    console.log('Model used:', result.model);
    console.log('Sample feedback:', result.feedback);
    return true;
  } catch (error) {
    console.error('❌ AI Service Test Failed:', error);
    return false;
  }
}

/**
 * Available AI models on OpenRouter (as of Nov 2024)
 * Update pricing at: https://openrouter.ai/docs#models
 */
export const AVAILABLE_MODELS = {
  // Free/Cheap models
  auto: 'openrouter/auto', // Auto-selects best model
  
  // Premium models (better quality)
  claude35Sonnet: 'anthropic/claude-3.5-sonnet',
  gpt4oMini: 'openai/gpt-4o-mini',
  geminiPro: 'google/gemini-pro-1.5',
  
  // Budget models
  llama3: 'meta-llama/llama-3.1-8b-instruct',
  mistral: 'mistralai/mistral-7b-instruct',
};
