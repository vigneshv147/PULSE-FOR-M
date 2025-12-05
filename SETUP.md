# Running AI Assistants on Any Laptop

Your AI text and voice assistants now use **cloud-based APIs** instead of local models. This means they work on ANY laptop with internet connection!

## Quick Setup (5 Minutes)

### 1. Get a Free API Key

**Google Gemini (Recommended - Free):**
1. Visit https://aistudio.google.com/app/apikey
2. Click "Create API Key"
3. Copy the key

**Alternative Options:**
- **Groq** (Free & Fast): https://console.groq.com/keys
- **OpenAI** (Paid): https://platform.openai.com/api-keys
- **Hugging Face** (Free): https://huggingface.co/settings/tokens

### 2. Add API Key to Your Project

1. Open the `.env` file in your project root
2. Replace `your_gemini_api_key_here` with your actual API key:
   ```
   VITE_GEMINI_API_KEY=AIzaSyC...your_actual_key
   ```
3. Save the file

### 3. Run the Application

```bash
npm run dev
```

That's it! Your assistants will now work on any laptop! 🎉

## Switching AI Providers

Want to use a different AI service? Just change these two lines in `.env`:

```env
VITE_AI_PROVIDER=groq
VITE_GROQ_API_KEY=your_groq_key_here
```

Available providers: `gemini`, `openai`, `groq`, `huggingface`

## Running on Another Laptop

To run on any other laptop:

1. Copy your project folder
2. Install dependencies: `npm install`
3. Add API key to `.env` file
4. Run: `npm run dev`

No need to install Ollama or download models!

## Troubleshooting

**"API key not configured" error:**
- Make sure your `.env` file has the correct API key
- Restart the dev server after changing `.env`

**"Fetch failed" error:**
- Check your internet connection
- Verify the API key is correct

**Voice recognition not working:**
- Voice recognition uses browser APIs (works offline)
- Make sure you're using Chrome, Edge, or Safari
- Grant microphone permissions when prompted

## Features

✅ **Text Assistant** - Chat interface with AI
✅ **Voice Assistant** - Speak to AI and hear responses
✅ **Multiple AI Providers** - Switch between Gemini, OpenAI, Groq, HuggingFace
✅ **Works Offline** - Voice recognition and speech synthesis work offline
✅ **Free Options** - Gemini and Groq offer free tiers

## Cost

- **Gemini**: 1500 free requests/day
- **Groq**: Completely free
- **OpenAI**: ~$0.002 per request
- **Hugging Face**: Free tier available
