import Scene from './Scene.js';
import RangeCircle from './RangeCircle.js';
import TelescopeCircle from './TelescopeCircle.js';
import CollisionCircle from './CollisionCircle';
import { getRandomArbitrary, distance } from './utility.js'

const opernit = {};

opernit.bubbleCircles = ({
  color = [
    '#fffdb7',
    '#aef4a4',
    '#79b8d1',
    '#e36488',
  ],
  size = 800,
  effectRadius = 40,
  minRadius = 1,
  maxRadius = 3
} = {}) => {

  const scene = new Scene({
    isWindowEvent: true
  });
  for (let i = 0, j = size; i < j; i++) {
    const radius = getRandomArbitrary(minRadius, maxRadius);
    const rangeCircle = new RangeCircle({
      x: Math.random() * (window.innerWidth - radius * 2) + radius,
      y: Math.random() * (window.innerHeight - radius * 2) + radius,
      radius: radius,
      minRadius: radius,
      MaxRadius: effectRadius,
      color: Array.isArray(color) ? color[Math.floor(Math.random() * color.length)] : color,
      velocityX: (Math.random() - 0.5),
      velocityY: (Math.random() - 0.5),
    });
    scene.addCircle(rangeCircle);
  }

  scene.render()
};

opernit.telescope = ({
  radius = 50,
  backgroundColor = 'rgba(0, 0, 0, 0.6)',
  elStyle = 'position: fixed;' +
            'top: 0;' +
            'left: 0;' +
            'z-index: 10;'
} = {}) => {
  const scene = new Scene({
    isWindowEvent: false,
    eventNames: ['mousemove', 'click'],
    elStyle: elStyle
  });

  scene.addCircle(new TelescopeCircle({ radius: radius, color: backgroundColor }));

  scene.render()
};

opernit.collisionCircles = ({
  color = [
    '#fffdb7',
    '#aef4a4',
    '#79b8d1',
    '#e36488',
  ],
  size = 100,
  radius = 20,
} = {}) => {

  const scene = new Scene({
    isWindowEvent: true
  });
  for (let i = 0, j = size; i < j; i++) {
    const collisionCircle = new CollisionCircle({
      x: Math.random() * (window.innerWidth - radius * 2) + radius,
      y: Math.random() * (window.innerHeight - radius * 2) + radius,
      radius: radius,
      color: Array.isArray(color) ? color[Math.floor(Math.random() * color.length)] : color,
      velocityX: (Math.random() - 0.5),
      velocityY: (Math.random() - 0.5),
    });

    if (i !== 0) {
      let m, n;
      for (m = 0, n = scene.circles.length; m < n; m++) {
        if (distance(collisionCircle.x, collisionCircle.y, scene.circles[m].x, scene.circles[m].y) - radius * 2 < 0) {
          collisionCircle.x = Math.random() * (window.innerWidth - radius * 2) + radius;
          collisionCircle.y = Math.random() * (window.innerHeight - radius * 2) + radius;

          m = -1;
        }
      }
    }
    scene.addCircle(collisionCircle);
  }

  scene.render()
};

export default opernit;