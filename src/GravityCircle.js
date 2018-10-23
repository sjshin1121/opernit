import BaseCircle from './BaseCircle.js';

export default class GravityCircle extends BaseCircle{
  constructor({ friction, gravity, ...config }) {
    super(config);

    Object.assign(this, {friction, gravity});
  }

  _updateMove() {
    if (this.y + this.radius + this.velocityY> innerHeight) {
      this.velocityY = -this.velocityY;
      this.velocityY = this.velocityY * this.friction;
      this.velocityX = this.velocityX * this.friction;
    } else {
      this.velocityY += this.gravity;
    }

    if (this.x + this.radius >= innerWidth || this.x - this.radius <= 0) {
      this.velocityX = -this.velocityX * this.friction;
    }

    this.x += this.velocityX;
    this.y += this.velocityY;
  }
  _updateEffect({x, y}) {
    if (x - this.x < 50 && x - this.x > -50
      && y - this.y < 50 && y - this.y > -50) {
      this.velocityY += 5;
    }
  }

};

