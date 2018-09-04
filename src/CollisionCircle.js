import BaseCircle from './BaseCircle.js';
import { distance, resolveCollision } from './utility';

export default class RangeCircle extends BaseCircle{
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

};

