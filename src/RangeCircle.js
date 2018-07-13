import BaseCircle from './BaseCircle.js';

export default class RangeCircle extends BaseCircle{
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

};

