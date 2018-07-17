import BaseClass from "./BaseClass";

export default class Scene extends BaseClass{
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
        window.addEventListener(eventName, listener)
      } else {
        this.canvasEl.addEventListener(eventName, listener)
      }
    });
    window.addEventListener('resize', () => {
      this.canvasEl.width = window.innerWidth;
      this.canvasEl.height = window.innerHeight;
    })

    this.addEvent('destroy', this.destroy)
  }

  addCircle (circle) {
    circle.ctx = this.ctx;
    this.circles.push(circle);
  }

  _render() {
    this.ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
    this.circles.forEach(circle => {
      circle.update(this.mousePosition);
    })
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
};

