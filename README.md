# svelte gpt chatbot

## features

- speech input
- speech output
- streamed response
- listening mode: automatically start and stop recording when speaking

- serverside or browserside api calls

## todo

- settings:
  - [x] turn on/off speech input
  - [x] turn on/off speech output
  - [] turn on/off dark mode
  - [x] select language
  - [] select voice
  - [] select gpt model
  - [] select gpt settings (temperature, etc.)
  - [] set start message
- [x] add browser side api calls with api keys
- encode audio to mp3 (for cross browser support)
- add function calls
- show loading indicator
- show error messages
- multiple chats
- save chats and settings in local storage

- add light mode

- multiline input

- edit chat (delete, edit, add)

- audio input

  - [] get half second before speech start
  - [] get half second after clicking stop

- figure out how to play and record on ios when phone locked

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
