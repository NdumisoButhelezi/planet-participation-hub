# OpenRouter AI Setup Guide

## Overview
This project uses **OpenRouter** to generate AI-powered feedback for student submissions. OpenRouter provides access to multiple AI models through a single API.

## Setup Instructions

### 1. Get Your OpenRouter API Key

1. **Visit OpenRouter**: Go to [https://openrouter.ai](https://openrouter.ai)
2. **Sign Up/Login**: Create an account or sign in
3. **Generate API Key**: 
   - Go to [https://openrouter.ai/keys](https://openrouter.ai/keys)
   - Click "Create Key"
   - Copy your API key (starts with `sk-or-v1-...`)

### 2. Configure Your Environment

1. **Open `.env.local`** in the project root
2. **Add your API key**:
   ```env
   VITE_OPENROUTER_API_KEY=sk-or-v1-your-actual-api-key-here
   ```
3. **Save the file**

### 3. Test the Configuration

Run the test command in your browser console:
```javascript
import { testAIService } from './src/lib/aiService';
testAIService();
```

Or click the "Generate AI Feedback" button in the admin submissions panel.

## How It Works

### Architecture

```
Student Submission → Admin Panel → AI Service → OpenRouter API → AI Model → Feedback
```

### Endpoints Hierarchy

1. **Primary**: Client-side OpenRouter API (fastest, direct)
   - Uses `src/lib/aiService.ts`
   - Requires `VITE_OPENROUTER_API_KEY` in `.env.local`

2. **Fallback**: Supabase Edge Functions
   - `/api/generate-feedback`
   - `/functions/v1/generate-feedback`
   - Uses `OPENROUTER_API_KEY` set in Supabase dashboard

### Features

✅ **Context-Aware Feedback**
- Adjusts tone based on student skill level (beginner/intermediate/advanced)
- Recognizes week numbers and submission types
- Personalizes feedback with student name

✅ **Multiple AI Models**
- Default: `openrouter/auto` (auto-selects best available)
- Can switch to Claude, GPT-4, Gemini, etc.
- See `AVAILABLE_MODELS` in `src/lib/aiService.ts`

✅ **Cost Optimization**
- Uses budget-friendly models by default
- ~$0.001-0.003 per feedback generation
- Automatic fallback if quota exceeded

## Cost Estimates

| Monthly Submissions | Estimated Cost |
|---------------------|----------------|
| 100 submissions     | $0.30          |
| 500 submissions     | $1.50          |
| 1,000 submissions   | $3.00          |
| 5,000 submissions   | $15.00         |

*Based on openrouter/auto pricing*

## Usage in Admin Panel

### Manual Generation

1. Go to **Admin Panel** → **Submissions Management**
2. Click on any pending submission
3. Click **"Generate AI Feedback"** button (✨ icon)
4. Review and edit the generated feedback
5. Click **Approve** or **Reject** with the feedback

### Automatic Generation (Coming Soon)

Enable auto-generation in settings to automatically generate feedback when admins approve/reject submissions.

## Customization

### Change AI Model

Edit `src/lib/aiService.ts`:

```typescript
function selectModel(request: FeedbackRequest): string {
  return 'anthropic/claude-3.5-sonnet'; // Use Claude for better quality
  // or 'openai/gpt-4o-mini' for faster responses
}
```

### Adjust Feedback Length

Edit the `max_tokens` parameter:

```typescript
body: JSON.stringify({
  // ...
  max_tokens: 300, // Longer feedback
  // max_tokens: 150, // Shorter feedback
})
```

### Customize Prompts

Edit `buildSystemPrompt()` or `buildUserPrompt()` functions in `src/lib/aiService.ts`.

## Troubleshooting

### Error: "OpenRouter API key not configured"

**Solution**: Make sure `.env.local` exists with:
```env
VITE_OPENROUTER_API_KEY=sk-or-v1-your-key-here
```

Then restart the dev server:
```bash
npm run dev
```

### Error: "Rate limit exceeded"

**Solutions**:
1. Check your OpenRouter credits at [https://openrouter.ai/credits](https://openrouter.ai/credits)
2. Add credits to your account
3. Switch to a cheaper model in `aiService.ts`

### Error: "Unable to reach AI feedback service"

**Check**:
1. ✅ Internet connection
2. ✅ API key is valid
3. ✅ OpenRouter service status: [https://status.openrouter.ai](https://status.openrouter.ai)

### AI Returns Empty/Poor Feedback

**Try**:
1. Switch to a more powerful model (Claude 3.5 Sonnet)
2. Increase `max_tokens` to 300+
3. Refine the system prompt for better instructions

## Security Notes

⚠️ **Important**:
- ✅ `.env.local` is in `.gitignore` (API keys won't be committed)
- ✅ API key is only exposed to your frontend (client-side)
- ✅ OpenRouter has rate limiting and spending limits
- ⚠️ For production, consider using Supabase Edge Functions to hide the API key

## Alternative: Supabase Edge Functions

If you prefer server-side AI generation (hides API key):

### Setup

1. **Install Supabase CLI**:
   ```bash
   npm install -g supabase
   ```

2. **Login to Supabase**:
   ```bash
   supabase login
   ```

3. **Link your project**:
   ```bash
   supabase link --project-ref your-project-ref
   ```

4. **Set the secret**:
   ```bash
   supabase secrets set OPENROUTER_API_KEY=sk-or-v1-your-key
   ```

5. **Deploy the function**:
   ```bash
   supabase functions deploy generate-feedback
   ```

The function is already created at `supabase/functions/generate-feedback/index.ts`.

## Support

- **OpenRouter Docs**: [https://openrouter.ai/docs](https://openrouter.ai/docs)
- **Model List**: [https://openrouter.ai/docs#models](https://openrouter.ai/docs#models)
- **Pricing**: [https://openrouter.ai/docs#pricing](https://openrouter.ai/docs#pricing)

## Next Steps

1. ✅ Set up OpenRouter API key
2. ✅ Test AI feedback generation
3. 🔄 (Optional) Deploy Supabase Edge Function
4. 🚀 Start using AI-powered feedback!
