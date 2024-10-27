<script>
  export let src;
  export let size = "100%";

  if (size !== "100%") {
    if (
      size.slice(-1) != "x" &&
      size.slice(-1) != "m" &&
      size.slice(-1) != "%"
    ) {
      try {
        size = parseInt(size) + "px";
      } catch (error) {
        size = "100%";
      }
    }
  }

  $: icon = src;
</script>

<svg
  xmlns="http://www.w3.org/2000/svg"
  width={size}
  height={size}
  viewBox={icon.viewBox}
  fill="none"
  aria-hidden="true"
  style="margin: 2px auto; vertical-align: middle;"
  {...$$restProps}
>
  {#each icon?.path ?? [] as a}
    <path {...a} />
  {/each}
</svg>