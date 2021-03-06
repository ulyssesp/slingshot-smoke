#pragma once

#include "cinder\gl\gl.h"
#include "cinder\gl\BufferTexture.h"
#include "cinder\app\App.h"
#include "PingPongFBO.h"

using namespace ci;

// Holds the state for a fluid simulation. This involves calculating and storing the velocity field. A glsl program is
// provided in `update` to update forces. Other quantities are advected through the advect method.
class Fluid {
public:
	Fluid();
	Fluid(vec2 fluidResolution);

	// Update the main velocity state
	void update(float dt, gl::GlslProgRef forces, gl::TextureRef smoke);

	// Advect a texture based on the current velocity
	void advect(float dt, PingPongFBO* value);

	PingPongFBO mVelocityFBO, mPressureFBO;

private:
	vec2 mFluidResolution;

	gl::GlslProgRef
		mAdvectShader,
		mAdvectMaccormackShader,
		mDivergenceShader,
		mPressureSolveShader,
		mSubtractPressureShader;


	void applyForces(gl::GlslProgRef forces, gl::TextureRef smoke);
	void computeDivergence();
	void solvePressure();
	void subtractPressure();

};