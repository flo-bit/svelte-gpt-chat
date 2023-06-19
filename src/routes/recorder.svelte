<script lang="ts">
  import * as lamejs from 'lamejs';

  import { onMount, onDestroy } from 'svelte';
  import type { RecordRTCPromisesHandler } from 'recordrtc';

  import { listenToSpeech } from './store';

  import hark from 'hark';
  import type { Unsubscriber } from 'svelte/store';

  let isListening = false;
  let isRecording = false;
  let shouldStopRecording = false;

  let mediaRecorder: MediaRecorder,
    media: BlobPart[] = [];

  let manuallyStarted = false;

  let minLengthOfSpeech = 500;

  let timestampSpeechStart = 0;

  // listen to speech:
  // - start audio recording and always save last second
  // - on start of speech, start saving recording (with last second)

  // start listening
  // start recording

  // stop listening
  // stop recording

  let encoder: any = null;

  let unsubscribe: Unsubscriber;

  onMount(() => {
    encoder = new lamejs.Mp3Encoder(1, 44100, 96);

    document.addEventListener('keydown', (e) => {
      // ignore typing in input fields
      if (e.target instanceof Element && e.target.classList.contains('input')) {
        return;
      }

      if (e.key == ' ') {
        startRecording();
      }
    });

    document.addEventListener('keyup', (e) => {
      if (e.key == ' ' && isRecording) {
        shouldStopRecording = true;
      }
    });

    listenToSpeech.subscribe((value) => {
      console.log('listenToSpeech', value);
      if (value) {
        startRecording(true);
      }
    });
  });

  let recorder: RecordRTCPromisesHandler;
  let stream: MediaStream;

  const setupRecording = async () => {
    if (recorder != null) return;
    const {
      // @ts-ignore
      default: { RecordRTCPromisesHandler, StereoAudioRecorder }
    } = await import('recordrtc');

    stream = await navigator.mediaDevices.getUserMedia({ audio: true });

    const recordOptions = {
      type: 'audio',
      mimeType: 'audio/wav',
      numberOfAudioChannels: 1,
      bitsPerSecond: 96000,
      recorderType: StereoAudioRecorder,
      timeSlice: 500,
      ondataavailable: ondataavailable
    };

    recorder = new RecordRTCPromisesHandler(stream, recordOptions);
  };

  let listener: ReturnType<typeof hark>;

  export const startRecording = async (listenOnly: boolean = false) => {
    if (isRecording || isListening) return;

    console.log('startRecording', { listenOnly });
    startedRecording();

    if (recorder == null) {
      await setupRecording();
    }

    try {
      if (listener) listener.stop();

      if (!listenOnly) isRecording = true;
      else {
        isListening = true;

        listener = hark(stream, {});

        listener.on('speaking', () => {
          if (isListening && !isRecording) {
            isRecording = true;
            timestampSpeechStart = Date.now();
          }
        });
        listener.on('stopped_speaking', () => {
          if (isListening && isRecording) {
            if (Date.now() - timestampSpeechStart < minLengthOfSpeech) {
              console.log('speech too short');
              isRecording = false;
              return;
            }
            shouldStopRecording = true;
          }
        });
      }

      const recordState = await recorder.getState();
      if (recordState === 'inactive' || recordState === 'stopped') {
        await recorder.startRecording();
      }
      if (recordState === 'paused') {
        await recorder.resumeRecording();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const ondataavailable = async (blob: Blob) => {
    const buffer = await blob.arrayBuffer();
    const mp3chunk = encoder.encodeBuffer(new Int16Array(buffer));
    const mp3blob = new Blob([mp3chunk], { type: 'audio/mpeg' });

    if (isListening && !isRecording) media = [mp3blob];
    else if (isRecording) media.push(mp3blob);

    if (shouldStopRecording) {
      shouldStopRecording = false;
      stopRecording();
    }
    console.log(media);
  };

  const stopRecording = async () => {
    if (!isRecording) return;

    isRecording = false;
    isListening = false;
    //mediaRecorder.stop();

    const recordState = await recorder.getState();
    if (recordState === 'recording' || recordState === 'paused') {
      await recorder.stopRecording();
    }

    let recordedBlob = new Blob(media, { type: 'audio/mpeg' });
    media = [];

    /*
    const url = URL.createObjectURL(recordedBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'audio.mp3';
    a.click();
    URL.revokeObjectURL(url);*/

    await recorder.destroy();
    recorder = null;
    finishedRecording(recordedBlob);
  };

  const handleTouchStart = () => {
    document.addEventListener('mouseup', handleTouchEnd);
    document.addEventListener('touchend', handleTouchEnd);

    startRecording();
  };

  const handleTouchEnd = () => {
    shouldStopRecording = true;

    document.removeEventListener('mouseup', handleTouchEnd);
    document.removeEventListener('touchend', handleTouchEnd);
  };

  export let finishedRecording: (blob: Blob) => void;
  export let startedRecording: () => void;
</script>

<button
  class={`btn ${isRecording ? 'btn-error' : isListening ? 'btn-success' : ''}`}
  on:mousedown={handleTouchStart}
  on:touchstart={handleTouchStart}
>
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-6 h-6">
    <path d="M8.25 4.5a3.75 3.75 0 117.5 0v8.25a3.75 3.75 0 11-7.5 0V4.5z" />
    <path
      d="M6 10.5a.75.75 0 01.75.75v1.5a5.25 5.25 0 1010.5 0v-1.5a.75.75 0 011.5 0v1.5a6.751 6.751 0 01-6 6.709v2.291h3a.75.75 0 010 1.5h-7.5a.75.75 0 010-1.5h3v-2.291a6.751 6.751 0 01-6-6.709v-1.5A.75.75 0 016 10.5z"
    />
  </svg>
</button>
