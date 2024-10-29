export const strInitialEditorContents = `void ColorPass(
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
}}`;