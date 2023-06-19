<script lang="ts">
  import { onMount } from 'svelte';
  import {
    languages,
    selectedLanguage,
    speechInput,
    speechOutput,
    useBrowserSideAPI,
    listenToSpeech
  } from './store';

  onMount(() => {
    document.addEventListener('pointerup', (evt) => {
      if (evt.target instanceof Element && evt.target.closest('.navbar')) {
        return;
      }
      showLanguageSelector = false;
    });

    if ($useBrowserSideAPI) {
      api_key_modal.showModal();
    }
  });

  let showLanguageSelector = false;
</script>

<nav class="navbar bg-base-200 bg-opacity-90 fixed top-0 z-50">
  <div class="flex-none">
    {#if false}
      <label for="my-drawer" class="btn btn-square btn-ghost">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          class="inline-block w-5 h-5 stroke-current"
          ><path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M4 6h16M4 12h16M4 18h16"
          /></svg
        >
      </label>
    {/if}
  </div>
  <div class="flex-1">
    <div class="font-bold normal-case text-xl px-3">Chat</div>
  </div>
  <div class="flex-none">
    <button
      class="btn btn-square btn-ghost"
      on:click={() => (showLanguageSelector = !showLanguageSelector)}
    >
      <span class="text-2xl">{$selectedLanguage.emoji}</span>
    </button>
    {#if showLanguageSelector}
      <ul class="menu menu-sm bg-base-200 w-56 rounded-box fixed top-14 z-20">
        {#each $languages as language}
          <li>
            <button
              class={'hover:bg-gray-200' +
                ($selectedLanguage.name === language.name ? ' text-blue-500' : '')}
              on:click={() => {
                selectedLanguage.set(language);
                showLanguageSelector = false;
              }}
            >
              {language.name}
            </button>
          </li>{/each}
      </ul>
    {/if}

    <button
      class="btn btn-square btn-ghost"
      on:click={() => {
        speechOutput.set(!$speechOutput);
      }}
    >
      {#if $speechOutput}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          class="w-6 h-6"
          ><title>volume-high</title><path
            d="M14,3.23V5.29C16.89,6.15 19,8.83 19,12C19,15.17 16.89,17.84 14,18.7V20.77C18,19.86 21,16.28 21,12C21,7.72 18,4.14 14,3.23M16.5,12C16.5,10.23 15.5,8.71 14,7.97V16C15.5,15.29 16.5,13.76 16.5,12M3,9V15H7L12,20V4L7,9H3Z"
          /></svg
        >
      {:else}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          class="w-6 h-6"
          ><title>volume-off</title><path
            d="M12,4L9.91,6.09L12,8.18M4.27,3L3,4.27L7.73,9H3V15H7L12,20V13.27L16.25,17.53C15.58,18.04 14.83,18.46 14,18.7V20.77C15.38,20.45 16.63,19.82 17.68,18.96L19.73,21L21,19.73L12,10.73M19,12C19,12.94 18.8,13.82 18.46,14.64L19.97,16.15C20.62,14.91 21,13.5 21,12C21,7.72 18,4.14 14,3.23V5.29C16.89,6.15 19,8.83 19,12M16.5,12C16.5,10.23 15.5,8.71 14,7.97V10.18L16.45,12.63C16.5,12.43 16.5,12.21 16.5,12Z"
          /></svg
        >
      {/if}
    </button>

    <button
      class="btn btn-square btn-ghost"
      on:click={() => {
        listenToSpeech.set(!$listenToSpeech);
      }}
    >
      {#if $listenToSpeech}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          class="w-6 h-6"
          ><title>ear-hearing</title><path
            transform="scale(-1, 1) translate(-24, 0)"
            d="M17,20C16.71,20 16.44,19.94 16.24,19.85C15.53,19.5 15.03,18.97 14.53,17.47C14,15.91 13.06,15.18 12.14,14.47C11.35,13.86 10.53,13.23 9.82,11.94C9.29,11 9,9.93 9,9C9,6.2 11.2,4 14,4C16.8,4 19,6.2 19,9H21C21,5.07 17.93,2 14,2C10.07,2 7,5.07 7,9C7,10.26 7.38,11.65 8.07,12.9C9,14.55 10.05,15.38 10.92,16.05C11.73,16.67 12.31,17.12 12.63,18.1C13.23,19.92 14,20.94 15.36,21.65C15.87,21.88 16.43,22 17,22A4,4 0 0,0 21,18H19A2,2 0 0,1 17,20M7.64,2.64L6.22,1.22C4.23,3.21 3,5.96 3,9C3,12.04 4.23,14.79 6.22,16.78L7.63,15.37C6,13.74 5,11.5 5,9C5,6.5 6,4.26 7.64,2.64M11.5,9A2.5,2.5 0 0,0 14,11.5A2.5,2.5 0 0,0 16.5,9A2.5,2.5 0 0,0 14,6.5A2.5,2.5 0 0,0 11.5,9Z"
          /></svg
        >
      {:else}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          class="w-6 h-6"
          ><title>ear-hearing-off</title><path
            d="M1,4.27L2.28,3L20,20.72L18.73,22L12.91,16.18C12.19,16.74 11.67,17.19 11.37,18.1C10.77,19.92 10,20.94 8.64,21.65C8.13,21.88 7.57,22 7,22A4,4 0 0,1 3,18H5A2,2 0 0,0 7,20C7.29,20 7.56,19.94 7.76,19.85C8.47,19.5 8.97,18.97 9.47,17.47C9.91,16.12 10.69,15.39 11.5,14.76L5.04,8.31C5,8.54 5,8.77 5,9H3C3,8.17 3.14,7.39 3.39,6.66L1,4.27M14.18,11.94C14.71,11 15,9.93 15,9C15,6.2 12.8,4 10,4C8.81,4 7.74,4.39 6.89,5.06L5.46,3.63C6.67,2.61 8.25,2 10,2C13.93,2 17,5.07 17,9C17,10.26 16.62,11.65 15.93,12.9L15.47,13.65L14.03,12.2L14.18,11.94M16.36,2.64L17.78,1.22C19.77,3.21 21,5.96 21,9C21,11.83 19.93,14.41 18.18,16.36L16.77,14.94C18.15,13.36 19,11.28 19,9C19,6.5 18,4.26 16.36,2.64M12.5,9C12.5,9.5 12.36,9.93 12.13,10.31L8.69,6.87C9.07,6.64 9.5,6.5 10,6.5A2.5,2.5 0 0,1 12.5,9Z"
          /></svg
        >
      {/if}
    </button>

    {#if $useBrowserSideAPI}
      <button class="btn" onclick="api_key_modal.showModal()">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          class="w-6 h-6"
          ><title>key-variant</title><path
            d="M22,18V22H18V19H15V16H12L9.74,13.74C9.19,13.91 8.61,14 8,14A6,6 0 0,1 2,8A6,6 0 0,1 8,2A6,6 0 0,1 14,8C14,8.61 13.91,9.19 13.74,9.74L22,18M7,5A2,2 0 0,0 5,7A2,2 0 0,0 7,9A2,2 0 0,0 9,7A2,2 0 0,0 7,5Z"
          /></svg
        >
      </button>
    {/if}
  </div>
</nav>
