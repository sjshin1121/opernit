import Scene from './Scene.js';
import RangeCircle from './RangeCircle.js';
import TelescopeCircle from './TelescopeCircle.js';
import { getRandomArbitrary } from './utility.js'

const opernit = {};

opernit.circles = ({
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

opernit.telescope = () => {
  const scene = new Scene({
    isWindowEvent: false,
    eventNames: ['mousemove', 'click'],
    elStyle:  'position: fixed;' +
              'top: 0;' +
              'left: 0;' +
              'z-index: 10;',
  });

  scene.addCircle(new TelescopeCircle({ radius: 50, color: 'rgba(255, 255, 255, 0.1)' }));

  scene.render()
};

export default opernit;