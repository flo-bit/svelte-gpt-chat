<script lang="ts">
  import { onMount } from 'svelte';
  import type { ChatGPTMessage } from '../openaistream';
  import { fade } from 'svelte/transition';
  import Recorder from './recorder.svelte';
  import {
    speechInput,
    speechOutput,
    selectedLanguage,
    useBrowserSideAPI,
    openaiAPIKey,
    googleAPIKey,
    listenToSpeech
  } from './store';

  import { chatComplete, textToSpeech, transcribeText } from './api/api-calls';

  import { Howl } from 'howler';

  const convertNewLines = (text: string) => text.replaceAll('\n', '<br />');

  let messages: ChatGPTMessage[] = [
    /*{
      
      role: 'assistant',
      content: convertNewLines(
        'Hello, I am your personal assistant.\n\nHow can I help you?\nHello, I am your personal assistant.\n\nHow can I help you?\nHello, I am your personal assistant.\n\nHow can I help you?\nHello, I am your personal assistant.\n\nHow can I help you?\nHello, I am your personal assistant.\n\nHow can I help you?\nHello, I am your personal assistant.\n\nHow can I help you?\nHello, I am your personal assistant.\n\nHow can I help you?\n\nHello, I am your personal assistant.\n\nHow can I help you?\n\nHello, I am your personal assistant.\n\nHow can I help you?\n\nHello, I am your personal assistant.\n\nHow can I help you?\n\nHello, I am your personal assistant.\n\nHow can I help you?\n\nHello, I am your personal assistant.\n\nHow can I help you?\n\nHello, I am your personal assistant.\n\nHow can I help you?\n\nHello, I am your personal assistant.\n\nHow can I help you?\n\nHello, I am your personal assistant.\n\nHow can I help you?\n\nHello, I am your personal assistant.\n\nHow can I help you?\n'
      )
    }*/
  ];
  let currentMessage = '';

  let isSending = false;

  const sendMessage = async () => {
    if (isSending) return;
    isSending = true;
    const newMessages = [...messages, { role: 'user', content: currentMessage } as ChatGPTMessage];
    currentMessage = '';
    messages = newMessages;
    scrollIntoView();

    const last10messages = newMessages.slice(-2); // remember last 2 messages

    let response: Response;
    if ($useBrowserSideAPI) {
      response = await chatComplete(last10messages, $openaiAPIKey);
    } else {
      response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          messages: last10messages
        })
      });
    }

    if (!response.ok) {
      throw new Error(response.statusText);
    }

    const data = response.body;
    if (!data) {
      return;
    }

    const reader = data.getReader();
    const decoder = new TextDecoder();
    let done = false;

    let lastMessage = '';

    while (!done) {
      const { value, done: doneReading } = await reader.read();
      done = doneReading;
      const chunkValue = decoder.decode(value);
      lastMessage = lastMessage + chunkValue;

      messages = [
        ...newMessages,
        { role: 'assistant', content: convertNewLines(lastMessage) } as ChatGPTMessage
      ];
      scrollIntoView();
    }

    if ($speechOutput) speak(lastMessage);
    else canStartListening();
    isSending = false;
  };

  function scrollIntoView() {
    const el = document.querySelector('#after-last-message');
    if (!el) return;
    el.scrollIntoView({
      behavior: 'smooth'
    });
  }

  const handleTranscription = async (blob: Blob) => {
    console.log('transcribing');
    const formData = new FormData();
    formData.append('file', blob);
    if ($selectedLanguage.code != '') formData.append('language', $selectedLanguage.code);

    let response: Response;
    if ($useBrowserSideAPI) {
      response = await transcribeText(blob, $openaiAPIKey, $selectedLanguage.code);
    } else {
      response = await fetch('/api/transcription', {
        method: 'POST',
        body: formData
      });
    }
    const json = await response.json();
    currentMessage = json.transcribedText;

    // check if text is empty or only contains spaces
    if (currentMessage.trim() == '') {
      console.log('empty text');
      canStartListening();
      return;
    }

    console.log('transcribed', currentMessage);
    sendMessage();
    return response;
  };

  let currentSound: Howl | null = null;

  const stopSpeaking = () => {
    // @ts-ignore
    currentSound?.stop();
  };

  const canStartListening = () => {
    if ($listenToSpeech) startRecording(true);
  };

  const speak = async (lastMessage: string) => {
    const languageCode = $selectedLanguage.voiceCode != '' ? $selectedLanguage.voiceCode : 'en-US';
    const voice = $selectedLanguage.voice != '' ? $selectedLanguage.voice : 'en-US-Wavenet-D';

    let speechResponse: Response;
    if ($useBrowserSideAPI) {
      speechResponse = await textToSpeech(lastMessage, $googleAPIKey, languageCode, voice);
    } else {
      speechResponse = await fetch('/api/speech', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          text: lastMessage,
          languageCode: languageCode,
          voice: voice
        })
      });
    }

    const speechData = await speechResponse.json();

    // Base64 to Blob
    const byteCharacters = atob(speechData.audioContent);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: 'audio/mp3' });

    // Create URL from Blob
    const url = URL.createObjectURL(blob);

    var sound = new Howl({
      src: [url],
      format: ['mp3']
    });

    currentSound = sound;
    // @ts-ignore
    sound.play();

    // @ts-ignore
    sound.on('end', () => {
      canStartListening();
    });
    // // Play audio
    //play(url);
  };

  let startRecording: (listenOnly: boolean) => Promise<void>;
</script>

<main class="relative mt-16">
  {#each messages as message, i}
    {#if message.role === 'user'}
      <div class="chat chat-end m-2" transition:fade>
        <div class="chat-bubble">{@html message.content}</div>
      </div>
    {:else}
      <div class="chat chat-start m-2" transition:fade>
        <div class="chat-bubble">{@html message.content}</div>
      </div>
    {/if}
    {#if i === messages.length - 1}
      <div class="h-16" id="after-last-message" />
    {/if}
  {:else}
    <div class="m-3">Start chatting!</div>
  {/each}

  <div class="join w-full fixed bottom-0 left-0 right-0 p-3">
    <input
      type="text"
      placeholder="Type here"
      class="input input-bordered w-full mr-2"
      bind:value={currentMessage}
      on:keypress={(e) => {
        if (e.key === 'Enter' && currentMessage.length > 0) {
          sendMessage();
        }
      }}
    />

    {#if currentMessage.length > 0}
      <button class={`btn ${isSending ? 'opacity-50' : ''}`} on:click={sendMessage}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          class="h-6 w-6"
          fill="currentColor"
        >
          <title>send</title>
          <path d="M2,21L23,12L2,3V10L17,12L2,14V21Z" />
        </svg>
      </button>
    {:else if $speechInput}
      <Recorder
        finishedRecording={handleTranscription}
        startedRecording={stopSpeaking}
        bind:startRecording
      />
    {/if}
  </div>
</main>
