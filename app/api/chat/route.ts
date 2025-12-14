import Anthropic from '@anthropic-ai/sdk';

// 1. Initialize Client
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || '',
});

export const runtime = 'edge';

export async function POST(req: Request) {
  // 2. Parse the conversation history from the frontend
  const { messages } = await req.json();

  // 3. Create a ReadableStream to pipe data to the frontend
  const stream = new ReadableStream({
    async start(controller) {
      // 4. Use the official Anthropic stream method
      anthropic.messages.stream({
        messages: messages,
        model: 'claude-sonnet-4-5', // Your specific model ID
        max_tokens: 1024,
      })
      .on('text', (text) => {
        // EVENT: When text arrives, encode it and send it to the browser
        controller.enqueue(new TextEncoder().encode(text));
      })
      .on('end', () => {
        // EVENT: When generation is done, close the stream
        controller.close();
      })
      .on('error', (error) => {
        // EVENT: Handle errors
        console.error("Stream Error:", error);
        controller.error(error);
      });
    },
  });

  // 5. Return the stream
  return new Response(stream, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'no-cache',
    },
  });
}