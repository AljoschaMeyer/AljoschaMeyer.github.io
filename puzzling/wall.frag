#version 300 es

#define PI 3.141592653589793
#define TAU 6.283185307179586
#define PIH 1.5707963267948966

precision mediump float;
out vec4 outColor;
uniform float u_time;
uniform vec2 u_resolution; // in px
uniform float u_px_per_square;
uniform vec2 u_center_of_square; // in clip-coordinates
uniform float u_hue; // in degrees, i.e., between 0 and 360, as expected by hsluvToRgb
uniform float u_activity; // 0.0: turned off, 1.0: turned on; values between used for animating the transition
uniform vec2 u_avatar; // pixels from bottom-left
uniform float u_avatar_light_radius; // in squares

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

#define NUM_OCTAVES 5

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

float fbmcheap(in vec2 _st) {
    float v = 0.0f;
    float a = 0.5f;
    vec2 shift = vec2(100.0f);
    // Rotate to reduce axial bias
    mat2 rot = mat2(cos(0.5f), sin(0.5f), -sin(0.5f), cos(0.50f));
    for(int i = 0; i < 4; ++i) {
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
    float qFactor // greater values zoom out for second iteration (more complex structure)
) {
    vec2 q = vec2(0.f);
    q.x = fbm(_st);
    q.y = fbm(_st + vec2(1.7f, 0.2f));

    vec2 r = vec2(0.f);
    r.x = fbm(_st + qFactor * q + vec2(1.4f, 5.3f));
    r.y = fbm(_st + qFactor * q * 0.9f + vec2(8.3f, 2.8f));

    return fbm(r);
}

float easeOutQuadratic(float x) {
    return 1.0f - (1.0f - x) * (1.0f - x);
}

// from https://iquilezles.org/articles/distfunctions
float sdRoundBox(vec2 p, vec2 b, float r) {
    vec2 q = abs(p) - b + r;
    return length(max(q, 0.0f)) + min(max(q.x, q.y), 0.0f) - r;
}

in vec4 ts;

void main() {
    // Coordinate within the square, ranging from (-1, -1) to (1, 1).
    vec2 sq = vec2((ts.xy - u_center_of_square) * u_resolution / u_px_per_square); // Huh, that actually works... Math is neat sometimes!

    const float cornerOffset = 0.7f;
    const float cornerWidth = 0.12f;
    const float cornerRadius = 0.04f;

    float d = sdRoundBox(sq + vec2(cornerOffset, cornerOffset), vec2(cornerWidth), cornerRadius); // distance to edge of rounded box, 0 inside the box
    float alpha = 1.0f - smoothstep(0.0f, 0.05f, d);

    d = sdRoundBox(sq + vec2(cornerOffset, -cornerOffset), vec2(cornerWidth), cornerRadius);
    alpha += 1.0f - smoothstep(0.0f, 0.05f, d);

    d = sdRoundBox(sq + vec2(-cornerOffset, -cornerOffset), vec2(cornerWidth), cornerRadius);
    alpha += 1.0f - smoothstep(0.0f, 0.05f, d);

    d = sdRoundBox(sq + vec2(-cornerOffset, cornerOffset), vec2(cornerWidth), cornerRadius);
    alpha += 1.0f - smoothstep(0.0f, 0.05f, d);

    float outerBox = 1.0f - smoothstep(0.0f, 0.05f, sdRoundBox(sq, vec2(0.9f, 0.9f), 0.12f));

    float cheapNoise = fbmcheap(20.0f * ts.xy + 0.02f * u_time + random(64.0f * u_center_of_square) * vec2(73.5f, -47.9f));

    const float baseL = 30.0f;
    const float lAmplitude = 10.0f;
    float l = baseL;
    l += mix(-lAmplitude, lAmplitude, cheapNoise);

    float finalAlpha = max(alpha, min(0.4f * u_activity, outerBox));
    float finalL = mix(l, 35.0f, alpha);

    outColor = vec4(hsluvToRgb(vec3(u_hue, 75.0f, finalL)), finalAlpha);

    vec2 px = ts.xy * u_resolution * 0.5f + u_resolution * 0.5f; // current px from bottom-left
    float avatarDistance = distance(px, u_avatar) + u_px_per_square * 0.15f; // in px
    float avatarClampedDist = clamp(avatarDistance, 0.0f, u_avatar_light_radius * u_px_per_square);
    float avatarDistNormalized = avatarClampedDist / (u_avatar_light_radius * u_px_per_square);
    float lightFactor = mix(25.0f, 1.0f, easeOutQuadratic(avatarDistNormalized));

    outColor.xyz *= lightFactor;
}