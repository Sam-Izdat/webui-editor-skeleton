<script lang="ts">

	import type { ComponentType } from 'svelte';
	import type { Writable } from 'svelte/store';
	import { writable } from 'svelte/store';
	import { propertyStore } from 'svelte-writable-derived';
 
 	import { AppRail, AppRailTile, AppRailAnchor } from '@skeletonlabs/skeleton';

  import { Pane, Splitpanes } from 'svelte-splitpanes';
  let currentTile: number = 0;
</script>
		<div class="card bg-surface-50-900-token rounded-none h-[100%] grid grid-cols-[auto_1fr] w-full">
			<AppRail class="w-8">
				<svelte:fragment slot="lead">
					<AppRailAnchor href="#" >(ico)</AppRailAnchor>
				</svelte:fragment>
				<!-- --- -->
				<AppRailTile bind:group={currentTile} name="tile-1" value={0} title="tile-1">
					<svelte:fragment slot="lead">(ico)</svelte:fragment>
					<span>T 1</span>
				</AppRailTile>
				<AppRailTile bind:group={currentTile} name="tile-2" value={1} title="tile-2">
					<svelte:fragment slot="lead">(ico)</svelte:fragment>
					<span>T 2</span>
				</AppRailTile>
				<AppRailTile bind:group={currentTile} name="tile-3" value={2} title="tile-3">
					<svelte:fragment slot="lead">(ico)</svelte:fragment>
					<span>T 3</span>
				</AppRailTile> 
				<!-- --- -->
				<svelte:fragment slot="trail">
					<AppRailAnchor href="/" target="_blank" title="Account">(ico)</AppRailAnchor>
				</svelte:fragment>
			</AppRail>
			<div class="grid">
				<!-- <span class="badge variant-soft">Tile Value: {currentTile}</span> -->

				<Splitpanes theme="skeleton-theme" style="width: 100%; height: 100%;">
				  <Pane minSize={20}>
				    1
				    <br />
				    <em class="specs">I have a min width of 20%</em>
				  </Pane>
				  <Pane>
				    <Splitpanes horizontal={true}>
				      <Pane minSize={15}>
				        2
				        <br />
				        <em class="specs">I have a min height of 15%</em>
				      </Pane>
				      <Pane>3 <span class="badge variant-soft">Tile Value: {currentTile}</span></Pane>
				      <!-- <Pane>4</Pane> -->
				    </Splitpanes>
				  </Pane>
				  <!-- <Pane>5</Pane> -->
				</Splitpanes>
			</div>
		</div>
<style>	
:global(.splitpanes.skeleton-theme .splitpanes__pane) {
  background-color: rgba(255, 255, 255, 0.15) !important;
}
:global(.splitpanes.skeleton-theme .splitpanes__splitter) {
  background-color: #fff;
  box-sizing: border-box;
  position: relative;
  flex-shrink: 0;
}
:global(.splitpanes.skeleton-theme .splitpanes__splitter:before, .splitpanes.skeleton-theme .splitpanes__splitter:after) {
  content: "";
  position: absolute;
  top: 50%;
  left: 50%;
  background-color: rgba(0, 0, 0, 0.15);
  transition: background-color 0.3s;
}
:global(.splitpanes.skeleton-theme .splitpanes__splitter:hover:before, .splitpanes.skeleton-theme .splitpanes__splitter:hover:after) {
  background-color: rgba(0, 0, 0, 0.25);
}

:global(.splitpanes.skeleton-theme .splitpanes__splitter:first-child) {
  cursor: auto;
}

:global(.skeleton-theme.splitpanes .splitpanes .splitpanes__splitter) {
  z-index: 1;
}

:global(.skeleton-theme.splitpanes--vertical > .splitpanes__splitter,
.skeleton-theme .splitpanes--vertical > .splitpanes__splitter) {
  width: 7px;
  border-left: 1px solid #eee;
  cursor: col-resize;
}

:global(.skeleton-theme.splitpanes--vertical > .splitpanes__splitter:before, .skeleton-theme.splitpanes--vertical > .splitpanes__splitter:after,
.skeleton-theme .splitpanes--vertical > .splitpanes__splitter:before,
.skeleton-theme .splitpanes--vertical > .splitpanes__splitter:after) {
  transform: translateY(-50%);
  width: 1px;
  height: 30px;
}

:global(.skeleton-theme.splitpanes--vertical > .splitpanes__splitter:before,
.skeleton-theme .splitpanes--vertical > .splitpanes__splitter:before) {
  margin-left: -2px;
}
:global(.skeleton-theme.splitpanes--vertical > .splitpanes__splitter:after,
.skeleton-theme .splitpanes--vertical > .splitpanes__splitter:after) {
  margin-left: 1px;
}
:global(.skeleton-theme.splitpanes--horizontal > .splitpanes__splitter,
.skeleton-theme .splitpanes--horizontal > .splitpanes__splitter) {
  height: 7px;
  border-top: 1px solid #eee;
  cursor: row-resize;
}
:global(.skeleton-theme.splitpanes--horizontal > .splitpanes__splitter:before, .skeleton-theme.splitpanes--horizontal > .splitpanes__splitter:after,
.skeleton-theme .splitpanes--horizontal > .splitpanes__splitter:before,
.skeleton-theme .splitpanes--horizontal > .splitpanes__splitter:after) {
  transform: translateX(-50%);
  width: 30px;
  height: 1px;
}
:global(.skeleton-theme.splitpanes--horizontal > .splitpanes__splitter:before,
.skeleton-theme .splitpanes--horizontal > .splitpanes__splitter:before) {
  margin-top: -2px;
}
:global(.skeleton-theme.splitpanes--horizontal > .splitpanes__splitter:after,
.skeleton-theme .splitpanes--horizontal > .splitpanes__splitter:after) {
  margin-top: 1px;
}
</style>