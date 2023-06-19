import { readable, writable } from 'svelte/store';

export const useBrowserSideAPI = readable(false);
export const openaiAPIKey = writable('');
export const googleAPIKey = writable('');

export const speechOutput = writable(false);
export const speechInput = writable(true);
export const listenToSpeech = writable(false);

const languagesData = [
  { name: 'English', code: 'en', voice: 'en-US-Neural2-J', voiceCode: 'en-US', emoji: '🇺🇸' },
  { name: 'German', code: 'de', voice: 'de-DE-Neural2-B', voiceCode: 'de-DE', emoji: '🇩🇪' },
  { name: 'French', code: 'fr', voice: 'fr-FR-Neural2-D', voiceCode: 'fr-FR', emoji: '🇫🇷' },
  { name: 'Italian', code: 'it', voice: 'it-IT-Neural2-C', voiceCode: 'it-IT', emoji: '🇮🇹' },
  { name: 'Spanish', code: 'es', voice: 'es-ES-Neural2-F', voiceCode: 'es-ES', emoji: '🇪🇸' },
  { name: 'Portuguese', code: 'pt', voice: 'pt-BR-Neural2-A', voiceCode: 'pt-BR', emoji: '🇧🇷' },
  { name: 'Russian', code: 'ru', voice: 'ru-RU-Wavenet-D', voiceCode: 'ru-RU', emoji: '🇷🇺' }
];

export const selectedLanguage = writable(languagesData[0]);
export const selectedLanguageName = writable(languagesData[0].name);
export const languages = readable(languagesData);

selectedLanguageName.subscribe((value) => {
  let newLang = languagesData.find((lang) => lang.name === value);
  if (newLang != undefined) selectedLanguage.set(newLang);
});
