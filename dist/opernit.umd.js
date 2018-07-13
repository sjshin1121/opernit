(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global.opernit = factory());
}(this, (function () { 'use strict';

  class Scene {
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
      });
    }

    addCircle (circle) {
      circle.ctx = this.ctx;
      this.circles.push(circle);
    }

    render () {
      this.ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
      this.circles.forEach(circle => {
        circle.update(this.mousePosition);
      });
    }
  }

  class BaseCircle {
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

      Object.assign(this, {x, y, radius, maxRadius, minRadius, color, velocityX, velocityY});

      this.ctx = null;
    }

    update({x = 0, y = 0, type = ''} = {}) {
      this._updateMove({x, y, type});
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

  class GrowingCircle extends BaseCircle {
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
    const animate = function () {
      requestAnimationFrame(animate);
      scene.render();
    };

    animate();
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

    scene.addCircle(new GrowingCircle({ radius: 50, color: 'rgba(255, 255, 255, 0.1)' }));

    const animate = function () {
      requestAnimationFrame(animate);
      scene.render();
    };

    animate();
  };

  return opernit;

})));
