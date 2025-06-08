# LangChain x OpenRouter Integration

Simple TypeScript project that integrates LangChain with OpenRouter API for AI chat streaming.

## Requirements

- Node.js (v16+)
- npm or yarn
- OpenRouter API Key

## Installation

1. Clone repository
```bash
git clone <your-repo-url>
cd langchain-x-openrouter
```

2. Install dependencies
```bash
npm install
```

3. Create `.env` file in root directory
```env
OPENROUTER_API_KEY=your_api_key_here
```

## Getting OpenRouter API Key

1. Visit [OpenRouter.ai](https://openrouter.ai/)
2. Sign up / Login
3. Go to **Keys** section in dashboard
4. Click **Create Key**
5. Copy the API key (starts with `sk-or-v1-`)

## Usage

1. Compile TypeScript
```bash
npx tsc
```

2. Run the application
```bash
node dist/main.js
```

### Alternative: Direct run with ts-node
```bash
# Install ts-node (if not installed)
npm install -D ts-node

# Run directly
npx ts-node src/main.ts
```

## Project Structure

```
langchain-x-openrouter/
├── .env                 # Environment variables
├── tsconfig.json        # TypeScript configuration
├── src/
│   └── main.ts         # Main application file
├── dist/               # Compiled JavaScript (generated)
└── README.md
```

## Features

- ✅ LangChain integration with OpenRouter
- ✅ Streaming AI responses
- ✅ TypeScript support
- ✅ Environment variables configuration
- ✅ Uses DeepSeek Chat model (free tier)

## Expected Output

```
...CALLING LLM...
...STARTING STREAMING RESPONSE ...
[Streaming AI response here]
...STREAMING RESPONSE END...
```

## Troubleshooting

- **401 Authentication Error**: Check if your API key is correctly set in `.env` file
- **Module not found**: Run `npm install` to install dependencies
- **TypeScript errors**: Make sure to compile with `npx tsc` before running
