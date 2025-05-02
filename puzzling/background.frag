#version 300 es

#define PI 3.141592653589793
#define TAU 6.283185307179586
#define PIH 1.5707963267948966

precision mediump float;
out vec4 outColor;
uniform float u_time;
uniform vec2 u_resolution; // in px
uniform float u_px_per_square;
uniform vec2 u_target; // pixels from bottom-left
uniform vec2 u_avatar; // pixels from bottom-left
uniform float u_avatar_light_radius; // in squares
uniform vec2 u_grid_offset; // pixels
uniform float u_previous_toggle_t; // scaled by the same factor as u_time
uniform float u_previous_toggle_hue; // between 0 and 360
uniform vec2 u_previous_toggle_position; // pixels from bottom-left
uniform float u_won; // 0.0 during the game, then linearly interpolates to 1.0 during the winning animation

/*
HSLUV-GLSL v4.2
HSLUV is a human-friendly alternative to HSL. ( http://www.hsluv.org )
GLSL port by William Malo ( https://github.com/williammalo )
Put this code in your fragment shader.

Usage:
hsluvToRgb(vec3(h * 360.0, s * 100.0, l * 100.0)); (hue between 0 and 360, s and l between 0 and 100)
*/

vec3 hsluv_intersectLineLine(vec3 line1x, vec3 line1y, vec3 line2x, vec3 line2y) {
    return (line1y - line2y) / (line2x - line1x);
}

vec3 hsluv_distanceFromPole(vec3 pointx, vec3 pointy) {
    return sqrt(pointx * pointx + pointy * pointy);
}

vec3 hsluv_lengthOfRayUntilIntersect(float theta, vec3 x, vec3 y) {
    vec3 len = y / (sin(theta) - x * cos(theta));
    if(len.r < 0.0f) {
        len.r = 1000.0f;
    }
    if(len.g < 0.0f) {
        len.g = 1000.0f;
    }
    if(len.b < 0.0f) {
        len.b = 1000.0f;
    }
    return len;
}

float hsluv_maxSafeChromaForL(float L) {
    mat3 m2 = mat3(3.2409699419045214f, -0.96924363628087983f, 0.055630079696993609f, -1.5373831775700935f, 1.8759675015077207f, -0.20397695888897657f, -0.49861076029300328f, 0.041555057407175613f, 1.0569715142428786f);
    float sub0 = L + 16.0f;
    float sub1 = sub0 * sub0 * sub0 * .000000641f;
    float sub2 = sub1 > 0.0088564516790356308f ? sub1 : L / 903.2962962962963f;

    vec3 top1 = (284517.0f * m2[0] - 94839.0f * m2[2]) * sub2;
    vec3 bottom = (632260.0f * m2[2] - 126452.0f * m2[1]) * sub2;
    vec3 top2 = (838422.0f * m2[2] + 769860.0f * m2[1] + 731718.0f * m2[0]) * L * sub2;

    vec3 bounds0x = top1 / bottom;
    vec3 bounds0y = top2 / bottom;

    vec3 bounds1x = top1 / (bottom + 126452.0f);
    vec3 bounds1y = (top2 - 769860.0f * L) / (bottom + 126452.0f);

    vec3 xs0 = hsluv_intersectLineLine(bounds0x, bounds0y, -1.0f / bounds0x, vec3(0.0f));
    vec3 xs1 = hsluv_intersectLineLine(bounds1x, bounds1y, -1.0f / bounds1x, vec3(0.0f));

    vec3 lengths0 = hsluv_distanceFromPole(xs0, bounds0y + xs0 * bounds0x);
    vec3 lengths1 = hsluv_distanceFromPole(xs1, bounds1y + xs1 * bounds1x);

    return min(lengths0.r, min(lengths1.r, min(lengths0.g, min(lengths1.g, min(lengths0.b, lengths1.b)))));
}

float hsluv_maxChromaForLH(float L, float H) {

    float hrad = radians(H);

    mat3 m2 = mat3(3.2409699419045214f, -0.96924363628087983f, 0.055630079696993609f, -1.5373831775700935f, 1.8759675015077207f, -0.20397695888897657f, -0.49861076029300328f, 0.041555057407175613f, 1.0569715142428786f);
    float sub1 = pow(L + 16.0f, 3.0f) / 1560896.0f;
    float sub2 = sub1 > 0.0088564516790356308f ? sub1 : L / 903.2962962962963f;

    vec3 top1 = (284517.0f * m2[0] - 94839.0f * m2[2]) * sub2;
    vec3 bottom = (632260.0f * m2[2] - 126452.0f * m2[1]) * sub2;
    vec3 top2 = (838422.0f * m2[2] + 769860.0f * m2[1] + 731718.0f * m2[0]) * L * sub2;

    vec3 bound0x = top1 / bottom;
    vec3 bound0y = top2 / bottom;

    vec3 bound1x = top1 / (bottom + 126452.0f);
    vec3 bound1y = (top2 - 769860.0f * L) / (bottom + 126452.0f);

    vec3 lengths0 = hsluv_lengthOfRayUntilIntersect(hrad, bound0x, bound0y);
    vec3 lengths1 = hsluv_lengthOfRayUntilIntersect(hrad, bound1x, bound1y);

    return min(lengths0.r, min(lengths1.r, min(lengths0.g, min(lengths1.g, min(lengths0.b, lengths1.b)))));
}

float hsluv_fromLinear(float c) {
    return c <= 0.0031308f ? 12.92f * c : 1.055f * pow(c, 1.0f / 2.4f) - 0.055f;
}
vec3 hsluv_fromLinear(vec3 c) {
    return vec3(hsluv_fromLinear(c.r), hsluv_fromLinear(c.g), hsluv_fromLinear(c.b));
}

float hsluv_toLinear(float c) {
    return c > 0.04045f ? pow((c + 0.055f) / (1.0f + 0.055f), 2.4f) : c / 12.92f;
}

vec3 hsluv_toLinear(vec3 c) {
    return vec3(hsluv_toLinear(c.r), hsluv_toLinear(c.g), hsluv_toLinear(c.b));
}

float hsluv_yToL(float Y) {
    return Y <= 0.0088564516790356308f ? Y * 903.2962962962963f : 116.0f * pow(Y, 1.0f / 3.0f) - 16.0f;
}

float hsluv_lToY(float L) {
    return L <= 8.0f ? L / 903.2962962962963f : pow((L + 16.0f) / 116.0f, 3.0f);
}

vec3 xyzToRgb(vec3 tuple) {
    const mat3 m = mat3(3.2409699419045214f, -1.5373831775700935f, -0.49861076029300328f, -0.96924363628087983f, 1.8759675015077207f, 0.041555057407175613f, 0.055630079696993609f, -0.20397695888897657f, 1.0569715142428786f);

    return hsluv_fromLinear(tuple * m);
}

vec3 rgbToXyz(vec3 tuple) {
    const mat3 m = mat3(0.41239079926595948f, 0.35758433938387796f, 0.18048078840183429f, 0.21263900587151036f, 0.71516867876775593f, 0.072192315360733715f, 0.019330818715591851f, 0.11919477979462599f, 0.95053215224966058f);
    return hsluv_toLinear(tuple) * m;
}

vec3 xyzToLuv(vec3 tuple) {
    float X = tuple.x;
    float Y = tuple.y;
    float Z = tuple.z;

    float L = hsluv_yToL(Y);

    float denom = dot(tuple, vec3(1, 15, 3));
    if(denom == 0.0f)
        return vec3(0);
    float div = 1.f / denom;

    return vec3(1.f, (52.f * (X * div) - 2.57179f), (117.f * (Y * div) - 6.08816f)) * L;
}

vec3 luvToXyz(vec3 tuple) {
    float L = tuple.x;
    if(L == 0.0f)
        return vec3(0.0f);

    float U = tuple.y / (13.0f * L) + 0.19783000664283681f;
    float V = tuple.z / (13.0f * L) + 0.468319994938791f;

    float Y = hsluv_lToY(L);
    float X = 2.25f * U * Y / V;
    float Z = (3.f / V - 5.f) * Y - (X / 3.f);

    return vec3(X, Y, Z);
}

vec3 luvToLch(vec3 tuple) {
    float L = tuple.x;
    float U = tuple.y;
    float V = tuple.z;

    float C = length(tuple.yz);
    float H = degrees(atan(V, U));
    if(H < 0.0f) {
        H = 360.0f + H;
    }

    return vec3(L, C, H);
}

vec3 lchToLuv(vec3 tuple) {
    float hrad = radians(tuple.b);
    return vec3(tuple.r, cos(hrad) * tuple.g, sin(hrad) * tuple.g);
}

vec3 hsluvToLch(vec3 tuple) {
    tuple.g = (tuple.b < 0.00001f || tuple.b > 99.99999f ? 0.0f : tuple.g * hsluv_maxChromaForLH(tuple.b, tuple.r) * .01f);
    return tuple.bgr;
}

vec3 lchToHsluv(vec3 tuple) {
    tuple.g = (tuple.r < 0.00001f || tuple.r > 99.99999f ? 0.0f : tuple.g / hsluv_maxChromaForLH(tuple.r, tuple.b) * 100.0f);
    return tuple.bgr;
}

vec3 hpluvToLch(vec3 tuple) {
    tuple.g *= hsluv_maxSafeChromaForL(tuple.b) * .01f;
    return tuple.bgr;
}

vec3 lchToHpluv(vec3 tuple) {
    tuple.g /= hsluv_maxSafeChromaForL(tuple.r) * .01f;
    return tuple.bgr;
}

vec3 lchToRgb(vec3 tuple) {
    return xyzToRgb(luvToXyz(lchToLuv(tuple)));
}

vec3 rgbToLch(vec3 tuple) {
    return luvToLch(xyzToLuv(rgbToXyz(tuple)));
}

vec3 hsluvToRgb(vec3 tuple) {
    return lchToRgb(hsluvToLch(tuple));
}

vec3 rgbToHsluv(vec3 tuple) {
    return lchToHsluv(rgbToLch(tuple));
}

vec3 hpluvToRgb(vec3 tuple) {
    return lchToRgb(hpluvToLch(tuple));
}

vec3 rgbToHpluv(vec3 tuple) {
    return lchToHpluv(rgbToLch(tuple));
}

vec3 luvToRgb(vec3 tuple) {
    return xyzToRgb(luvToXyz(tuple));
}

/*
* Below from https://thebookofshaders.com/13/
*/

float random(float p) {
    p = fract(p * 0.011f);
    p *= p + 7.5f;
    p *= p + p;
    return fract(p);
}

float random(in vec2 _st) {
    return fract(sin(dot(_st.xy, vec2(12.9898f, 78.233f))) *
        43758.5453123f);
}

// Based on Morgan McGuire @morgan3d
// https://www.shadertoy.com/view/4dS3Wd
float noise(in vec2 _st) {
    vec2 i = floor(_st);
    vec2 f = fract(_st);

    // Four corners in 2D of a tile
    float a = random(i);
    float b = random(i + vec2(1.0f, 0.0f));
    float c = random(i + vec2(0.0f, 1.0f));
    float d = random(i + vec2(1.0f, 1.0f));

    vec2 u = f * f * (3.0f - 2.0f * f);

    return mix(a, b, u.x) +
        (c - a) * u.y * (1.0f - u.x) +
        (d - b) * u.x * u.y;
}

float noise(vec3 x) {
    const vec3 step = vec3(110, 241, 171);

    vec3 i = floor(x);
    vec3 f = fract(x);

    // For performance, compute the base input to a 1D random from the integer part of the argument and the 
    // incremental change to the 1D based on the 3D -> 1D wrapping
    float n = dot(i, step);

    vec3 u = f * f * (3.0f - 2.0f * f);
    return mix(mix(mix(random(n + dot(step, vec3(0, 0, 0))), random(n + dot(step, vec3(1, 0, 0))), u.x), mix(random(n + dot(step, vec3(0, 1, 0))), random(n + dot(step, vec3(1, 1, 0))), u.x), u.y), mix(mix(random(n + dot(step, vec3(0, 0, 1))), random(n + dot(step, vec3(1, 0, 1))), u.x), mix(random(n + dot(step, vec3(0, 1, 1))), random(n + dot(step, vec3(1, 1, 1))), u.x), u.y), u.z);
}

#define NUM_OCTAVES 4

float fbm(in vec2 _st) {
    float v = 0.0f;
    float a = 0.5f;
    vec2 shift = vec2(100.0f);
    // Rotate to reduce axial bias
    mat2 rot = mat2(cos(0.5f), sin(0.5f), -sin(0.5f), cos(0.50f));
    for(int i = 0; i < NUM_OCTAVES; ++i) {
        v += a * noise(_st);
        _st = rot * _st * 2.0f + shift;
        a *= 0.5f;
    }
    return v;
}

/*
* Above from https://thebookofshaders.com/13/
*/

float fbm3(
    in vec2 _st, // 2d coordinate, scale up to zoom out
    float speedX, // movement along x axis
    float speedY, // movement along y axis
    float speedDiff, // speed multiplied by this factor for second iteration
    float qFactor // greater values zoom out for second iteration (more complex structure)
) {
    vec2 q = vec2(fbm(_st + speedX * u_time));
    // vec2 q = vec2(0.f);
    // q.x = fbm(_st + speedX * u_time);
    // q.y = fbm(_st + vec2(1.7f, 0.2f) + speedY * u_time);

    // vec2 r = vec2(fbm(_st + 12.0 * q + speedY * u_time));
    vec2 r = vec2(0.f);
    r.x = fbm(_st + qFactor * q + vec2(1.4f, 5.3f) + speedX * u_time * speedDiff);
    r.y = fbm(_st + qFactor * q * 0.9f + vec2(8.3f, 2.8f) + speedY * u_time * speedDiff);

    return fbm(q);
}

float easeOutQuadratic(float x) {
    return 1.0f - (1.0f - x) * (1.0f - x);
}

float smoothy(float lower, float upper, float aa, float x) {
    return smoothstep(lower - aa, lower, x) - smoothstep(upper, upper + aa, x);
}

in vec4 ts;

/*
* Actual stuff.
*/

void main() {
    // outColor = vec4(vec3(0.2, 0.7, 0.4), 1.0f);

    vec2 st = vec2(ts.x, ts.y);

    /*
    * Background
    */
    vec3 bgColor = vec3(0.0f);

    float bg1 = fbm3(st * 5.0f, 0.5f, -0.4f, 1.3f, 3.0f);
    vec3 color1 = vec3(0.44f, 0.71f, 0.89f);
    bgColor = bg1 * color1 * 1.6f;

    float stars = pow(noise(vec3(st.x * 223.7f, st.y * 217.3f, 0.6f * u_time + 123.4f * st)), 64.f) * 4.0f;
    bgColor += stars;

    float avatarDistance = distance(gl_FragCoord.xy, u_avatar);
    float targetDistance = distance(gl_FragCoord.xy, u_target);

    const float avatarFrequency = 14.0f; // Keep in sync with value in typescript.
    float avatarClampedDist = clamp(avatarDistance, 0.0f, u_avatar_light_radius * u_px_per_square);

    const float targetRadiusBase = 0.68f; // base of target light radius in squares
    float targetLightRadius = targetRadiusBase + sin(avatarFrequency * u_time) * (targetRadiusBase / 30.0f); // animated target light radius
    float targetClampedDist = clamp(targetDistance, 0.0f, targetLightRadius * u_px_per_square);

    const float noLight = 0.15f;
    const float avatarLight = 1.5f;

    float avatarDistNormalized = avatarClampedDist / (u_avatar_light_radius * u_px_per_square);
    float targetDistNormalized = targetClampedDist / (targetLightRadius * u_px_per_square);

    bgColor *= mix(avatarLight, noLight, min(easeOutQuadratic(avatarDistNormalized), easeOutQuadratic(targetDistNormalized)));

    vec3 avatarColor = vec3(0.95f) + sin(avatarFrequency * u_time) * 0.04f;
    float avatarAA = 0.9f;
    float avatarRadius = 0.8f * u_px_per_square * 0.5f;
    float avatarRadiusInner = 0.45f * u_px_per_square * 0.5f;
    bgColor = mix(bgColor, avatarColor, smoothstep(avatarRadiusInner - avatarAA, avatarRadiusInner + avatarAA, avatarDistance) - smoothstep(avatarRadius - avatarAA, avatarRadius + avatarAA, avatarDistance));

    vec3 targetColor = vec3(0.909f) + sin(avatarFrequency * u_time) * 0.04f;
    bgColor = mix(bgColor, targetColor, (1.0f - smoothstep(avatarRadiusInner - avatarAA, avatarRadiusInner + avatarAA, targetDistance)) * 0.85f);

    outColor = vec4(bgColor, 1.0f);

    /*
    * Grid
    */

    if(int(mod(gl_FragCoord.x, u_px_per_square)) == int(u_grid_offset.x) || int(mod(gl_FragCoord.y, u_px_per_square)) == int(u_grid_offset.y)) {
        outColor.xyz = outColor.xyz + 0.02f;
    }

    /*
    * Crosshairs emitted by avatar
    */

    const vec3 crosshairsSummandColor = vec3(1.0f) * 0.0355191f;
    float crosshairsWidth = u_px_per_square / 2.0f;
    // vec2 avatarDistanceByDimension = abs(u_avatar - gl_FragCoord.xy);
    vec2 avatarDistanceByDimension = abs(u_avatar - gl_FragCoord.xy + (noise(vec3(50.0f * st, 12.0f * u_time)) - 0.5f) * u_px_per_square / 8.0f);
    // outColor.xyz = outColor.xyz + (1.0f - smoothstep(0.0f, crosshairsWidth, avatarDistanceByDimension.x)) * crosshairsSummandColor + (1.0f - smoothstep(0.0f, crosshairsWidth, avatarDistanceByDimension.y)) * crosshairsSummandColor;
    outColor.xyz = outColor.xyz + (1.0f - smoothstep(0.5f, crosshairsWidth, avatarDistanceByDimension.x)) * crosshairsSummandColor + (1.0f - smoothstep(0.5f, crosshairsWidth, avatarDistanceByDimension.y)) * crosshairsSummandColor;

    /*
    * Ripple emitted by a toggle activation.
    */

    float rippleBaseSpeed = 30.0f * u_px_per_square; // pixels per 10 seconds
    float rippleTTL = 0.0470f;

    float distToActivation = distance(gl_FragCoord.xy, u_previous_toggle_position);
    float rippleMid = (u_time - u_previous_toggle_t) * rippleBaseSpeed;

    float rippleIntensity = easeOutQuadratic(min(1.0f, rippleMid / distToActivation));
    rippleIntensity = rippleIntensity * easeOutQuadratic(max(0.0f, 1.0f - (u_time - u_previous_toggle_t) / rippleTTL));

    vec3 rippleColor = hsluvToRgb(vec3(u_previous_toggle_hue, 30.0f, 60.0f * rippleIntensity));
    outColor.xyz += max(outColor.xyz, rippleColor) * 0.4f;

    /*
    * Winning animation
    */
    vec3 winColor = vec3(0.86f, 0.79f, 0.99f);
    outColor.xyz += min(1.0f, 1.5f * u_won) * winColor * 0.6f;
}