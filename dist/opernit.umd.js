(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global.opernit = factory());
}(this, (function () { 'use strict';

  const listeners = {};

  class BaseClass {
    addEvent (type, listener, isGlobal = true) {
      listeners[type] = listeners[type] || [];
      if(listeners[type].indexOf(listener) === -1) {
        listeners[type].push({
          f: listener,
          ctx: this,
          isGlobal: isGlobal
        });
      }
    }
    dispatch (type) {
      if(!listeners[type]) return;
      const evt = listeners[type], params = Array.prototype.slice.call(arguments, 1);
      let i = evt.length;


      while (i--) {
        if (evt[i].ctx === this || evt[i].isGlobal)
          evt[i].f.apply(evt[i].ctx, params);
      }
    }
  }

  class Scene extends BaseClass{
    constructor ({
        el,
        width = window.innerWidth,
        height = window.innerHeight,
        isWindowEvent = false,
        eventNames = ['mousemove'],
        elStyle = 'position: fixed;' +
                  'top: 0;' +
                  'left: 0;' +
                  'z-index: -1;',
    } = {}) {
      super();
      this._initialize(el, width, height, elStyle);
      this._eventInitialize(isWindowEvent, eventNames);
    }

    _initialize (el, width, height, elStyle) {
      this.circles = [];
      this.mousePosition = {};

      let canvasEl;
      canvasEl = el;
      if (!canvasEl) {
        canvasEl = document.createElement('canvas');
        document.body.appendChild(canvasEl);
      }
      canvasEl.width = width;
      canvasEl.height = height;
      canvasEl.style = elStyle;

      this.canvasEl = canvasEl;
      this.ctx = canvasEl.getContext('2d');
    }

    _eventInitialize (isWindowEvent, eventNames) {
      const listener = e => {
        this.mousePosition.type = e.type;
        this.mousePosition.x = e.x;
        this.mousePosition.y = e.y;
      };

      eventNames.forEach(eventName => {
        if (isWindowEvent) {
          window.addEventListener(eventName, listener);
        } else {
          this.canvasEl.addEventListener(eventName, listener);
        }
      });
      window.addEventListener('resize', () => {
        this.canvasEl.width = window.innerWidth;
        this.canvasEl.height = window.innerHeight;
        this._rePositionOutCircles();
      });

      this.addEvent('destroy', this.destroy);
    }

    addCircle (circle) {
      circle.ctx = this.ctx;
      this.circles.push(circle);
    }

    _rePositionOutCircles() {
      this.circles.forEach(circle => {
        if (circle.x > this.canvasEl.width) circle.x = this.canvasEl.width - circle.radius;
        if (circle.y > this.canvasEl.height) circle.y = this.canvasEl.height - circle.radius;
      });
    }

    _render() {
      this.ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
      this.circles.forEach(circle => {
        circle.update(this.mousePosition, this.circles);
      });
    }

    render () {
      let animate;
      (animate = () => {
        this.animationReq = window.requestAnimationFrame(animate);
        this._render();
      })();
    }

    destroy() {
      this.canvasEl.parentElement.removeChild(this.canvasEl);
      window.cancelAnimationFrame(this.animationReq);
    }
  }

  class BaseCircle extends BaseClass{
    constructor({
      x = 0,
      y = 0,
      radius = 10,
      maxRadius = 30,
      minRadius = 10,
      color = '#5b48ff',
      velocityX = (Math.random() - 0.5),
      velocityY = (Math.random() - 0.5)
                } = {}) {
      super();

      Object.assign(this, {x, y, radius, maxRadius, minRadius, color, velocityX, velocityY});

      this.ctx = null;
    }

    update({x = 0, y = 0, type = ''} = {}, circles) {
      this._updateMove({x, y, type}, circles);
      this._updateEffect({x, y, type});

      this.draw();
    }

    _updateMove() {}
    _updateEffect() {}
    draw() {
      this.ctx.beginPath();
      this.ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
      this.ctx.strokeStyle = this.color;
      this.ctx.fillStyle = this.color;
      this.ctx.stroke();
      this.ctx.fill();
    }

  }

  class RangeCircle extends BaseCircle{
    constructor(config) {
      super(config);
    }

    _updateMove() {
      if ( this.x + this.radius > innerWidth || this.x - this.radius < 0 ) {
        this.velocityX = -this.velocityX;
      }

      if ( this.y + this.radius > innerHeight || this.y - this.radius < 0 ) {
        this.velocityY = -this.velocityY;
      }

      this.x += this.velocityX;
      this.y += this.velocityY;
    }
    _updateEffect({x, y}) {
      if (x - this.x < 50 && x - this.x > -50
        && y - this.y < 50 && y - this.y > -50) {
        if (this.radius < this.maxRadius)
          this.radius += 1;
      } else if (this.radius > this.minRadius) {
        this.radius -= 1;
      }
    }

  }

  class TelescopeCircle extends BaseCircle {
    constructor(config) {
      super(config);
    }

    _updateMove({x, y}) {
      this.x = x;
      this.y = y;
    }

    _updateEffect({x, y, type}) {
      if (type === 'click' || this.isContinueEffect) {
        this.radius += 5;
        this.isContinueEffect = true;
        if (this.radius > Math.sqrt(Math.pow(window.innerWidth, 2)+Math.pow(window.innerHeight, 2))) {
          this.dispatch('destroy');
        }
      }
    }

    draw() {
      this.ctx.fillStyle = 'black';
      this.ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);
      this.ctx.globalCompositeOperation = 'destination-out';

      this.ctx.fillStyle = 'white';
      this.ctx.beginPath();
      this.ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
      this.ctx.closePath();
      this.ctx.fill();
      this.ctx.globalCompositeOperation = 'source-over';
    }
  }

  function getRandomArbitrary(min, max) {
    return Math.random() * (max - min) + min;
  }


  function rotate(velocityX, velocityY, angle) {
    const rotatedVelocities = {
      x: velocityX * Math.cos(angle) - velocityY * Math.sin(angle),
      y: velocityX * Math.sin(angle) + velocityY * Math.cos(angle)
    };

    return rotatedVelocities;
  }

  function resolveCollision(particle, otherParticle) {
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

  function distance(x1, y1, x2, y2) {
    return Math.sqrt(Math.pow((x1-x2), 2) + Math.pow((y1-y2), 2));
  }

  class RangeCircle$1 extends BaseCircle{
    constructor(config) {
      super(config);
      this.mass = 1;
    }

    _updateMove(mousePointer, circles) {
      circles.forEach(circle => {
        if (this === circle) return;

        if (distance(this.x, this.y, circle.x, circle.y) - this.radius * 2 < 0) {
          resolveCollision(this, circle);
        }
      });

      if ( this.x + this.radius > innerWidth || this.x - this.radius < 0 ) {
        this.velocityX = -this.velocityX;
      }

      if ( this.y + this.radius > innerHeight || this.y - this.radius < 0 ) {
        this.velocityY = -this.velocityY;
      }

      this.x += this.velocityX;
      this.y += this.velocityY;
    }
    _updateEffect({x, y}) {

      if (distance(this.x, this.y, x, y) - this.radius * 2 < 0) {
        console.log(distance(this.x, this.y, x, y));
        resolveCollision(this, { x, y, mass: 4, velocityX: -this.velocityX, velocityY: -this.velocityY});
      }
    }

  }

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

    scene.render();
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

    scene.render();
  };

  opernit.collisionCircle = ({
                               color = [
                                 '#fffdb7',
                                 '#aef4a4',
                                 '#79b8d1',
                                 '#e36488',
                               ],
                               size = 100,
                               effectRadius = 40,
                               minRadius = 20,
                               maxRadius = 20
                             } = {}) => {

    const scene = new Scene({
      isWindowEvent: true
    });
    for (let i = 0, j = size; i < j; i++) {
      const radius = getRandomArbitrary(minRadius, maxRadius);
      const rangeCircle = new RangeCircle$1({
        x: Math.random() * (window.innerWidth - radius * 2) + radius,
        y: Math.random() * (window.innerHeight - radius * 2) + radius,
        radius: radius,
        minRadius: radius,
        MaxRadius: effectRadius,
        color: Array.isArray(color) ? color[Math.floor(Math.random() * color.length)] : color,
        velocityX: (Math.random() - 0.5),
        velocityY: (Math.random() - 0.5),
      });

      if (i !== 0) {
        let m, n;
        for (m = 0, n = scene.circles.length; m < n; m++) {
          if (distance(rangeCircle.x, rangeCircle.y, scene.circles[m].x, scene.circles[m].y) - radius * 2 < 0) {
            rangeCircle.x = Math.random() * (window.innerWidth - radius * 2) + radius;
            rangeCircle.y = Math.random() * (window.innerHeight - radius * 2) + radius;

            m = -1;
          }
        }
      }
      scene.addCircle(rangeCircle);
    }

    scene.render();
  };

  return opernit;

})));
