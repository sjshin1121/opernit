export function getRandomArbitrary(min, max) {
  return Math.random() * (max - min) + min;
}


function rotate(velocityX, velocityY, angle) {
  const rotatedVelocities = {
    x: velocityX * Math.cos(angle) - velocityY * Math.sin(angle),
    y: velocityX * Math.sin(angle) + velocityY * Math.cos(angle)
  };

  return rotatedVelocities;
}

export function resolveCollision(particle, otherParticle) {
  const xVelocityDiff = particle.velocityX - otherParticle.velocityX;
  const yVelocityDiff = particle.velocityY - otherParticle.velocityY;

  const xDist = otherParticle.x - particle.x;
  const yDist = otherParticle.y - particle.y;

  // Prevent accidental overlap of particles
  if (xVelocityDiff * xDist + yVelocityDiff * yDist >= 0) {

    // Grab angle between the two colliding particles
    const angle = -Math.atan2(otherParticle.y - particle.y, otherParticle.x - particle.x);

    // Store mass in var for better readability in collision equation
    const m1 = particle.mass;
    const m2 = otherParticle.mass;

    // Velocity before equation
    const u1 = rotate(particle.velocityX, particle.velocityY, angle);
    const u2 = rotate(otherParticle.velocityX, otherParticle.velocityY, angle);


    // Velocity after 1d collision equation
    const v1 = { x: u1.x * (m1 - m2) / (m1 + m2) + u2.x * 2 * m2 / (m1 + m2), y: u1.y };
    const v2 = { x: u2.x * (m1 - m2) / (m1 + m2) + u1.x * 2 * m2 / (m1 + m2), y: u2.y };

    // Final velocity after rotating axis back to original location
    const vFinal1 = rotate(v1.x, v1.y, -angle);
    const vFinal2 = rotate(v2.x, v2.y, -angle);

    // Swap particle velocities for realistic bounce effect
    particle.velocityX = vFinal1.x;
    particle.velocityY = vFinal1.y;

    otherParticle.velocityX = vFinal2.x;
    otherParticle.velocityY = vFinal2.y;
  }
}

export function distance(x1, y1, x2, y2) {
  return Math.sqrt(Math.pow((x1-x2), 2) + Math.pow((y1-y2), 2));
}