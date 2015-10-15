#version 330 core

uniform vec2 i_resolution;
uniform sampler2D tex_velocity;
uniform sampler2D tex_smoke;

uniform float i_dt;
uniform float i_time;

out vec4 fragColor;

vec4 boundary(vec2 pos) {
	vec2 offset = vec2(0, 0);

	if(pos.x <= 1. / i_resolution.x) {
		offset.x = 1/i_resolution.x;
	}
	else if(pos.x * i_resolution.x >= i_resolution.x - 1) {
		offset.x = -1/i_resolution.x;
	}

	if(pos.y <= 1. / i_resolution.y) {
		offset.y = 1/i_resolution.y;
	}
	else if(pos.y * i_resolution.y >= i_resolution.y - 1) {
		offset.y = -1/i_resolution.y;
	}

	return vec4(texture2D(tex_velocity, pos + offset).xy, 1.0, 1);
}

vec4 inner(vec2 pos) {
	vec4 velocity = texture2D(tex_velocity, pos);
	vec2 smoke = texture(tex_smoke, pos).xy; // x is density, y is temperature
	vec2 v = velocity.xy;

	float Fb = (4 * smoke.y - 0.5 * smoke.x); // buoyancy = (-k*density + (T - T0))
	v.y += Fb;

	v.x += cos(i_time * 0.25) * cos(i_time * 0.25) - 0.5;

	return vec4(v, 0, 1);
}

void main() {
	vec4 outVelocity;
	vec2 pos = gl_FragCoord.xy / i_resolution.xy;
	if(pos.x <= 1. / i_resolution.x || pos.y <= 1. / i_resolution.y || pos.x >= 1.0 - 1.1 / i_resolution.x || pos.y >= 1.0 - 1.1 / i_resolution.y) {
		outVelocity = boundary(pos);
	}
	else {
		outVelocity = inner(pos);
	}

	fragColor = outVelocity;
}
