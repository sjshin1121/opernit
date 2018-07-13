export default class BaseCircle {
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

};

