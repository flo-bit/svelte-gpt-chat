import * as OpenAIStream from '../../openaistream';

export const chatComplete = async (
  messages: OpenAIStream.ChatGPTMessage[],
  OPENAI_API_KEY: string,
  temperature: number = 0.7,
  max_tokens: number = 100
): Promise<Response> => {
  const payload: OpenAIStream.OpenAIStreamPayload = {
    model: 'gpt-3.5-turbo',
    messages: messages,
    temperature: temperature,
    max_tokens: max_tokens,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0,
    stream: true,
    n: 1
  };

  const stream = await OpenAIStream.OpenAIStream(payload, OPENAI_API_KEY);
  return new Response(stream);
};

export const textToSpeech = async (
  text: string,
  GOOGLE_API_KEY: string,
  languageCode: string = 'en-US',
  voice: string = 'en-US-Neural2-J'
): Promise<Response> => {
  const apiUrl = `https://texttospeech.googleapis.com/v1/text:synthesize?key=${GOOGLE_API_KEY}`;

  try {
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=utf-8'
      },
      body: JSON.stringify({
        input: {
          text: text
        },
        voice: {
          languageCode: languageCode ?? 'en-US',
          name: voice ?? 'en-US-Neural2-J'
        },
        audioConfig: {
          audioEncoding: 'MP3'
        }
      })
    });

    const data = await response.json();
    return new Response(JSON.stringify(data));
  } catch (error) {
    console.error(`Error synthesizing text: ${error}`);
  }
  return new Response(JSON.stringify({}));
};

export const transcribeText = async (
  audioBlob: Blob,
  OPENAI_API_KEY: string,
  language: string = 'en'
): Promise<Response> => {
  const formData = new FormData();
  formData.append('file', audioBlob, 'test.wav');
  formData.append('model', 'whisper-1');
  formData.append('language', language);

  /**
   * https://platform.openai.com/docs/api-reference/audio/create
   */
  const transcriptionResponse = await fetch(`https://api.openai.com/v1/audio/transcriptions`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${OPENAI_API_KEY}`,
      Accept: 'application/json'
    },
    body: formData
  });

  const data = await transcriptionResponse.json();
  const transcribedText = data?.text || '';

  return new Response(JSON.stringify({ transcribedText }));
};
