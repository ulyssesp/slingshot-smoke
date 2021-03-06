#pragma once

#include "Smoker.h"

class BottomSmoker : public Smoker
{
public:
	BottomSmoker(vec2 fluidResolution, vec2 smokeResolution);
	void update(float volume, float dt, Fluid* fluid, AudioSource* audioSource, PingPongFBO* smokeField);
	void light(vec2 smokePosition, params::InterfaceGlRef params);

private:
	gl::GlslProgRef
		mForcesProg,
		mDropProg;
};