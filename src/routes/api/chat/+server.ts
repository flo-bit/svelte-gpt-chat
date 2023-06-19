import * as OpenAIStream from '../../../openaistream';
import { OPENAI_API_KEY } from '$env/static/private';
import { chatComplete } from '../api-calls';

export async function POST({ request }) {
  console.log('using serverside api, chat');

  const body = await request.json();
  const messages: OpenAIStream.ChatGPTMessage[] = [];
  messages.push(...body?.messages);

  const temperature = body?.temperature ? parseFloat(body?.temperature) : 0.7;
  const max_tokens = body?.max_tokens ? parseInt(body?.max_tokens) : 100;

  return await chatComplete(messages, OPENAI_API_KEY, temperature, max_tokens);
}
