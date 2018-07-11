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

  update({x = 0, y = 0} = {}) {
    this._updateMove();
    this._updateEffect({x, y});

    this.draw();
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
  }
  draw() {
    this.ctx.beginPath();
    this.ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
    this.ctx.strokeStyle = this.color;
    this.ctx.fillStyle = this.color;
    this.ctx.stroke();
    this.ctx.fill();
  }

};

