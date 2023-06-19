# svelte gpt chatbot

## features

- speech input and output (speech synthesis and speech recognition) using google cloud speech-to-text and whisper for text-to-speech
- multiple languages (for speech input and output)
- listening mode: automatically start and stop voice recording when speaking

- streamed response
- serverside or browserside api calls

## todo

- settings:
  - [x] turn on/off speech input
  - [x] turn on/off speech output
  - [x] select language
  - [ ] turn on/off dark mode
  - [ ] select voice
  - [ ] select gpt model
  - [ ] select gpt settings (temperature, etc.)
  - [ ] set start message
- [x] add browser side api calls with api keys
- [x] encode audio to mp3 (for cross browser support)
- [x] get half second before speech start
- [x] get half second after clicking stop
- [ ] add function calls
- [ ] show loading indicator
- [ ] show error messages
- [ ] multiple chats
- [ ] save chats and settings in local storage
- [ ] multiline input
- [ ] edit chat (delete, edit, add)
- [ ] figure out how to play and record on ios when phone locked

## Developing

Create a `.env` file with the following content:

```bash
# .env
GOOGLE_API_KEY=your-google-api-key
OPENAI_API_KEY=your-openai-api-key
```

Where your google API key has the Speech-to-Text API enabled.

Install dependencies with `npm install` and start a development server:

```bash
# install dependencies
npm install
# start dev server
npm run dev
```

Open the localhost url in your browser and start chatting.
