<script lang="ts">
  // NOTE: This can be drastically simplified, but I just copied the skeleton lightswitch to save time

  import { onMount } from 'svelte';
  import { modeCurrent, setModeUserPrefers, setModeCurrent, setInitialClassState, getModeOsPrefers } from './anchor_lightswitch.ts';

  import { AppRailAnchor } from '@skeletonlabs/skeleton';
  // Types
  import type { CssClasses, SvelteEvent } from '../../index.js';

  // Props
  /** Customize the `title` attribute for the component.  */
  export let title = 'Toggle light or dark mode.';
  // Props (styles)
  /** Provide classes to set the light background color. */
  export let bgLight: CssClasses = 'bg-surface-50';
  /** Provide classes to set the dark background color. */
  export let bgDark: CssClasses = 'bg-surface-900';
  /** Provide classes to set the light SVG fill color. */
  export let fillLight: CssClasses = 'fill-surface-50';
  /** Provide classes to set the dark SVG fill color. */
  export let fillDark: CssClasses = 'fill-surface-900';
  /** Provide classes to set width styles. */
  export let width: CssClasses = 'w-12';
  /** Provide classes to set height styles. Should be half of width. */
  export let height: CssClasses = 'h-6';
  /** Provide classes to set ring styles. */
  export let ring: CssClasses = 'ring-[1px] ring-surface-500/30';
  /** Provide classes to set border radius styles. */
  export let rounded: CssClasses = 'rounded-token';



    import { Icon, LightBulb} from "svelte-hero-icons";

  // Classes
  const cTransition = `transition-all duration-[200ms]`;
  const cTrack = 'cursor-pointer';
  const cThumb = 'aspect-square scale-[0.8] flex justify-center items-center';
  const cIcon = 'w-[70%] aspect-square';

  function onToggleHandler(): void {
    $modeCurrent = !$modeCurrent;
    setModeUserPrefers($modeCurrent);
    setModeCurrent($modeCurrent);
  }

  // A11y Input Handlers
  function onKeyDown(event: SvelteEvent<KeyboardEvent, HTMLDivElement>): void {
    // Enter/Space triggers selection event
    if (['Enter', 'Space'].includes(event.code)) {
      event.preventDefault();
      event.currentTarget.click();
    }
  }

  // Lifecycle
  onMount(() => {
    // Sync lightswitch with the theme
    if (!('modeCurrent' in localStorage)) {
      setModeCurrent(getModeOsPrefers());
    }
  });

  // State
  $: trackBg = $modeCurrent === true ? bgLight : bgDark;
  $: thumbBg = $modeCurrent === true ? bgDark : bgLight;
  $: thumbPosition = $modeCurrent === true ? 'translate-x-[100%]' : '';
  $: iconFill = $modeCurrent === true ? fillLight : fillDark;
  // Reactive
  $: classesTrack = `${cTrack} ${cTransition} ${width} ${height} ${ring} ${rounded} ${trackBg} ${$$props.class ?? ''}`;
  $: classesThumb = `${cThumb} ${cTransition} ${height} ${rounded} ${thumbBg} ${thumbPosition}`;
  $: classesIcon = `${cIcon} ${iconFill}`;
</script>

<svelte:head>
  <!-- Workaround for a svelte parsing error: https://github.com/sveltejs/eslint-plugin-svelte/issues/492 -->
  {@html `<\u{73}cript nonce="%sveltekit.nonce%">(${setInitialClassState.toString()})();</script>`}
</svelte:head>


<AppRailAnchor href="#" title={title}
  on:click={onToggleHandler}
  on:click
  on:keydown={onKeyDown}
  on:keydown
  on:keyup
  on:keypress
  role="switch"
  aria-label="Light Switch"
  aria-checked={$modeCurrent}
  tabindex="0">
  <Icon src="{LightBulb}" size="16" style="margin: 4px auto;" solid/>
</AppRailAnchor>