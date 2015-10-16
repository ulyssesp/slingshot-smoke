#version 330 core

uniform vec2 i_resolution;
uniform float i_dt;
uniform float i_time;
uniform float i_volume;
uniform float i_smokeLineY;
uniform vec2 i_smokePosition;
uniform sampler2D tex_prev;

out vec4 fragColor;

vec3 hsv2rgb(vec3 c) {
  vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
  vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
  return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
}

float rand(vec2 co){
    return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453);
}

void main() {
	vec2 pos = gl_FragCoord.xy / i_resolution.xy;

	vec3 current = texture2D(tex_prev, pos).xyz;
	current.x *= (1.0 - 0.8 * i_dt);
	current.y *= (1.0 - 0.5 * i_dt);

	float dropDistance = pos.y - i_smokeLineY;

	float density = max(0, 0.0001 - dropDistance) * i_dt * i_volume * rand(vec2(i_time, pos.x));

	float temperature = current.y + density * 8;

	float hue = current.z;
	if(density > 0.0001) {
		hue = abs(mod(i_time, 2.) - 1.) * 0.25;
	}

	fragColor = vec4(current.x + density, temperature, hue, 1);
}
