import { json } from '@sveltejs/kit';
import { transcribeText } from '../api-calls.js';
import { env } from '$env/dynamic/private';

export const POST = async ({ request }) => {
  const requestBody = await request.formData();
  const requestFile = requestBody.get('file');
  let requestLanguage = requestBody.get('language');
  requestLanguage = requestLanguage ? requestLanguage.toString() : 'en';

  if (!requestFile) {
    return json({ error: 'No file provided' });
  }
  const OPENAI_API_KEY = env.OPENAI_API_KEY ?? '';
  const file = new Blob([requestFile], { type: 'video/mp4' });
  return await transcribeText(file, OPENAI_API_KEY, requestLanguage);
};
