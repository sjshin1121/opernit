import BaseCircle from './BaseCircle.js';

export default class RangeCircle extends BaseCircle{
  constructor(config) {
    super(config);
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

