<script lang="ts">
	import { onDestroy, onMount } from 'svelte';
	import type * as Monaco from 'monaco-editor/esm/vs/editor/editor.api';

	let editor: Monaco.editor.IStandaloneCodeEditor;
	let monaco: typeof Monaco;
	let editorContainer: HTMLElement;

	import  { LightSwitch }  from '$lib/components';

  const isDarkMode = () => {
    return document.documentElement.classList.contains('dark');
  };

  const switchMonacoTheme = (theme: string) => {
    monaco.editor.setTheme(theme);
  };

  const observeThemeChange = () => {
    const observer = new MutationObserver(() => {
      const theme = isDarkMode() ? 'vs-dark' : 'vs-light';
      switchMonacoTheme(theme);
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'] // Watch for changes to the class attribute
    });
  };

	onMount(async () => {


		// Import our 'monaco.ts' file here
		// (onMount() will only be executed in the browser, which is what we want)
		monaco = (await import('./monaco')).default;

		// Your monaco instance is ready, let's display some code!
		const editor = monaco.editor.create(editorContainer, {
	    value: "",
	    language: "c",
	    minimap: {
	      enabled: false,
	    },
	    tabSize: 2,
	    automaticLayout: true,
	    theme: isDarkMode() ? 'vs-dark' : 'vs-light',
	  });
		const model = monaco.editor.createModel(`void ColorPass(
  in float r,
  in float g,
  in float b,
  in float p,
  in int width,
  in int height,
  sampler2D background,
  sampler2D tex1,
  sampler2D tex2,
  out vec4 out_color
)
{{
  vec2 complex_sqr(vec2 z) { return vec2(z[0] * z[0] - z[1] * z[1], z[1] * z[0] * 2.); }
  void main()
  {
    vec2 res = vec2(width, height);
    if (gl_FragCoord.x > res.x - 200.0 && gl_FragCoord.y > res.y - 200.0) {

      float mult = 0.2;
      vec2 rel = gl_FragCoord.xy - (res - 200.0);
      vec2 checkerboard = round(fract(rel * mult));
      vec4 a = texelFetch(tex1, ivec2(rel.xy), 0);
      vec4 b = texelFetch(tex2, ivec2(rel.xy), 0);

      out_color = mix(a, b,  checkerboard.x * checkerboard.y);
      return;
    }

    vec2 uv = gl_FragCoord.xy / res.xy;
    float i = gl_FragCoord.x;
    float j = gl_FragCoord.y;
    vec2 s = res;
    int n = int(s.x * 0.5);
    vec2 c = vec2(-0.8, cos(2. * p));
    vec2 z = vec2(i / float(n) - 1., j / float(n) - 1.0) * 2.;
    int iterations = 0;
    while (sqrt(dot(z, z)) < 20. && iterations < 50) {
      z = complex_sqr(z) + c;
      iterations = iterations + 1;
    }
    vec4 fractal = vec4(float(iterations) - log2(0.5 * log(dot(z, z)) / log(20.0))) * 0.02;
    fractal.a = 1.;
    out_color.rgb = fractal.xyz * vec3(r, g, b);
    out_color.rgb = mix(out_color.rgb , texture(background, uv).rgb, 1.0 - length(out_color.rgb));
    out_color.a = 1.;
  }
}}

void DEBUGPassUV(in int width, in int height, out vec4 out_color)
{{
  vec2 complex_sqr(vec2 z) { return vec2(z[0] * z[0] - z[1] * z[1], z[1] * z[0] * 2.); }
  void main()
  {
    vec2 res = vec2(width, height);
    vec2 uv = gl_FragCoord.xy / res.xy;
    out_color = vec4(uv, 0.0, 1.0);
  }
}}

void TwoOutputsShader(out vec4 out_color1, out vec4 out_color2)
{{
  void main()
  {
    out_color1 = vec4(1.0f, 0.5f, 0.0f, 1.0f);
    out_color2 = vec4(0.0f, 0.5f, 1.0f, 1.0f);
  }
}}


[declaration: "smoothing"]
{{
  float SmoothOverTime(float val, string name, float ratio = 0.95)
  {
    ContextVec2(name) = ContextVec2(name) * ratio + vec2(val, 1) * (1.0 - ratio);
    return ContextVec2(name).x / (1e-7f + ContextVec2(name).y);
  }
}}

[rendergraph]
[include: "smoothing"]
void RenderGraphMain()
{{
  void main()
  {
    Image img = GetImage(ivec2(128, 128), rgba8);
    Image sc = GetSwapchainImage();
    int a = SliderInt("Int param", -42, 42, 7);
    float b = SliderFloat("Float param", -42.0f, 42.0f);
    int frame_idx = ContextInt("frame_idx")++;

    Image uvImage = GetImage(sc.GetSize(), rgba8);

    DEBUGPassUV(
      uvImage.GetSize().x,
      uvImage.GetSize().y,
      uvImage
    );


    Image img1 = GetImage(GetSwapchainImage().GetSize(), rgba16f);
    Image img2 = GetImage(GetSwapchainImage().GetSize(), rgba16f);
    TwoOutputsShader(
      img1,
      img2
    );

    ColorPass(
      SliderFloat("R", 0.0f, 1.0f, 0.5f),
      SliderFloat("G", 0.0f, 1.0f, 0.5f),
      SliderFloat("B", 0.0f, 1.0f, 0.5f),
      SliderFloat("P", 0.0f, 2.0f, 0.7f) + frame_idx * 1e-2,
      sc.GetSize().x,
      sc.GetSize().y,
      uvImage,
      img1,
      img2,
      sc
    );


    float dt = GetTime() - ContextFloat("prev_time");
    ContextFloat("prev_time") = GetTime();
    Text("Fps: " + 1000.0 / (1e-7f + SmoothOverTime(dt, "fps_count")));
    Text("dims: " + sc.GetSize().x + ", " + sc.GetSize().y);
  }
}}`
			,
			'c'
		);
		editor.setModel(model);
		
		observeThemeChange();
	});

	onDestroy(() => {
		monaco?.editor.getModels().forEach((model) => model.dispose());
		editor?.dispose();
	});

	import type { ComponentType } from 'svelte';
	import type { Writable } from 'svelte/store';
	import { writable } from 'svelte/store';
	import { propertyStore } from 'svelte-writable-derived';
 
 	import { AppRail, AppRailTile, AppRailAnchor } from '@skeletonlabs/skeleton';

  import { Pane, Splitpanes } from 'svelte-splitpanes';
  let currentTile: number = 0;



  import { Icon, ArrowUp, TableCells, Newspaper, AdjustmentsHorizontal, ArrowsPointingOut, Eye} from "svelte-hero-icons";

	// import { LightSwitch } from '@skeletonlabs/skeleton';

</script>

		<div class="card bg-surface-50-900-token rounded-none h-[100%] grid grid-cols-[auto_1fr] w-full">
			<AppRail class="w-8">
				<!-- <svelte:fragment slot="lead">
					<AppRailAnchor href="#" ><Icon src="{ArrowUp}" size="16" style="margin:auto;"/></AppRailAnchor>
				</svelte:fragment> -->
				<!-- --- -->
				<AppRailTile bind:group={currentTile} name="tile-1" value={0} title="tile-1">
					<svelte:fragment slot="lead">
						<Icon src="{TableCells}" size="16" style="margin: 4px auto;" solid/>
					</svelte:fragment>
				</AppRailTile>
				<AppRailTile bind:group={currentTile} name="tile-1" value={1} title="tile-1">
					<svelte:fragment slot="lead">
						<Icon src="{Newspaper}" size="16" style="margin: 4px auto;" solid/>
					</svelte:fragment>
				</AppRailTile>
				<AppRailTile bind:group={currentTile} name="tile-2" value={2} title="tile-2">
					<svelte:fragment slot="lead">
						<Icon src="{AdjustmentsHorizontal}" size="16" style="margin: 4px auto;" solid/>
					</svelte:fragment>
				</AppRailTile>
				<AppRailTile bind:group={currentTile} name="tile-2" value={3} title="tile-2">
					<svelte:fragment slot="lead">
						<Icon src="{Eye}" size="16" style="margin: 4px auto;" solid/>
					</svelte:fragment>
				</AppRailTile>
				<AppRailTile bind:group={currentTile} name="tile-3" value={4} title="tile-3">
					<svelte:fragment slot="lead">
						<Icon src="{ArrowsPointingOut}" size="16" style="margin: 4px auto;" solid/>
					</svelte:fragment>
				</AppRailTile> 
				<!-- --- -->
				<svelte:fragment slot="trail">
					<AppRailAnchor href="#" title="Account">
						<LightSwitch />
					</AppRailAnchor>
				</svelte:fragment>
			</AppRail>
			<div class="grid">
				<!-- <span class="badge variant-soft">Tile Value: {currentTile}</span> -->

				<Splitpanes theme="skeleton-theme" style="width: 100%; height: 100%;">
				  <Pane minSize={20}>
						<div class="container" bind:this={editorContainer} style="display: block; height: 100vh;"/>
				  </Pane>
				  <Pane minSize={20}>
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


	.container {
		width: 100%;
		height: 100%;
	}


:global(.splitpanes.skeleton-theme .splitpanes__pane) {
  background-color: rgba(210, 210, 210, 0.2) !important;
}
:global(.dark .splitpanes.skeleton-theme .splitpanes__pane) {
  background-color: rgba(60, 60, 60, 0.2) !important;
}
:global(.splitpanes.skeleton-theme .splitpanes__splitter) {
  background-color: rgba(210, 210, 210, 0.7) !important;
  box-sizing: border-box;
  position: relative;
  flex-shrink: 0;
}
:global(.dark .splitpanes.skeleton-theme .splitpanes__splitter) {
  background-color: rgba(60, 60, 60, 0.7) !important;
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
  width: 5px;
  background-color: rgba(210, 210, 210, 1) !important;
  cursor: col-resize;
}
:global(.dark .skeleton-theme.splitpanes--vertical > .splitpanes__splitter,
.dark .skeleton-theme .splitpanes--vertical > .splitpanes__splitter) {
  width: 5px;
  background-color: rgba(60, 60, 60, 1) !important;
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
  height: 5px;
  border-top: rgba(210, 210, 210, 1) !important;
  cursor: row-resize;
}
:global(.dark .skeleton-theme.splitpanes--horizontal > .splitpanes__splitter,
.dark .skeleton-theme .splitpanes--horizontal > .splitpanes__splitter) {
  height: 5px;
  border-top: rgba(255, 0, 0, 1) !important;
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