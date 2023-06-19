import { GOOGLE_API_KEY } from '$env/static/private';
import { textToSpeech } from '../api-calls.js';

export const POST = async ({ request }) => {
  console.log('using serverside api, speech');
  const body = await request.json();

  const text = body?.text;
  const languageCode = body?.languageCode;
  const voice = body?.voice;

  const apiKey = GOOGLE_API_KEY;

  return await textToSpeech(text, apiKey, languageCode, voice);
};
