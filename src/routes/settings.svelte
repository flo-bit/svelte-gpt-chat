<script lang="ts">
  import { googleAPIKey, openaiAPIKey } from './store';

  let openaiAPIKeyInput = $openaiAPIKey;
  let googleAPIKeyInput = $googleAPIKey;
</script>

<dialog id="api_key_modal" class="modal">
  <form method="dialog" class="modal-box" id="api-key-form">
    <button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
    <h3 class="font-bold text-lg">API Keys</h3>
    <div class="py-4">
      <label for="api-key-form" class="label">
        <span class="label-text"
          >Please enter your OpenAI and Google Cloud (with Text-To-Speech enabled) API keys to use
          this demo. Your keys are not saved anywhere and only sent to their respective APIs. Your
          OpenAI key is used for chat completion and speech to text, and your Google Cloud key is
          used for text to speech.
          <br /> <br />
          Using this demo may incur charges on your OpenAI and Google Cloud accounts.
        </span>
      </label>
      <div class="form-control w-full">
        <label for="openai-api-key" class="label">
          <span class="label-text">OpenAI API Key</span>
        </label>
        <input
          id="openai-api-key"
          type="text"
          placeholder="Your key here"
          bind:value={openaiAPIKeyInput}
          class="input input-bordered w-full"
        />
      </div>
      <div class="form-control w-full">
        <label class="label" for="google-api-key">
          <span class="label-text">Google Cloud API Key</span>
        </label>
        <input
          id="google-api-key"
          type="text"
          placeholder="Your key here"
          bind:value={googleAPIKeyInput}
          class="input input-bordered w-full"
        />
      </div>
    </div>
    <button
      class="btn btn-success"
      on:click={() => {
        openaiAPIKey.set(openaiAPIKeyInput);
        googleAPIKey.set(googleAPIKeyInput);
      }}>Save</button
    >
  </form>
  <form method="dialog" class="modal-backdrop">
    <button>close</button>
  </form>
</dialog>
