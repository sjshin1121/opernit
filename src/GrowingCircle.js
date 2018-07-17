import BaseCircle from './BaseCircle.js';

export default class GrowingCircle extends BaseCircle {
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