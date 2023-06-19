import { json } from '@sveltejs/kit';
import { OPENAI_API_KEY } from '$env/static/private';
import { transcribeText } from '../api-calls.js';

export const POST = async ({ request }) => {
  console.log('using serverside api, transcribeText');

  const requestBody = await request.formData();
  const requestFile = requestBody.get('file');
  let requestLanguage = requestBody.get('language');
  requestLanguage = requestLanguage ? requestLanguage.toString() : 'en';

  if (!requestFile) {
    return json({ error: 'No file provided' });
  }
  /**
   * Request config.
   */
  const file = new Blob([requestFile], { type: 'video/mp4' });
  return await transcribeText(file, OPENAI_API_KEY, requestLanguage);
};
