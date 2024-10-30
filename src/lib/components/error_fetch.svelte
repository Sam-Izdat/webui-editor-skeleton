<script>
  import { Icon } from 'svelte-hero-icons';
  import * as hero from 'svelte-hero-icons';
  export let url = '';
</script>
<div class="h-full w-full flex justify-center items-center">
    <aside class="alert variant-ghost-error w-fit">
        <div>
          <Icon src="{hero.ExclamationTriangle}" size="64" alt="Error" solid/>
        </div>
        <div class="alert-message">
            <h3 class="h3">Nope...</h3>
            <p>Failed to fetch URL:</p>
            <code>{url}</code>
        </div>
    </aside>
</div>