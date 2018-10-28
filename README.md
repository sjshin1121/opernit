# opernit

browser mouse effect using canvas

## showcase
* [bubbleCircles](https://sjshin1121.github.io/opernit/example/bubbleCircles.html)
* [telescope](https://sjshin1121.github.io/opernit/example/telescope.html)
* [collisionCircles](https://sjshin1121.github.io/opernit/example/collisionCircles.html)
* [gravityCircles](https://sjshin1121.github.io/opernit/example/gravityCircles.html)

## To-do
- [ ] canvasRender 분리하여 처리하기
- [ ] 서클 포함한 다른 오브젝트 일반화

## API

### opernit.bubbleCircles()

**discription**
 * 원이 마우스 포인터를 만나면 커지는 효과

**parameter**
 * ?object:Object
    * ?color:Array - 표현될 원 색깔
    * ?size:Number - 원 갯수
    * ?effectRadius:Number - 마우스 포인터를 만났을때 원의 반지름
    * ?maxRadius:Number - 가장 큰 원의 반지름
    * ?minRadius:Number - 가장 작은 원의 반지름

**example**
```javascript
opernit.bubbleCircles({
  color: [
    '#fffdb7',
    '#aef4a4',
    '#79b8d1',
    '#e36488',
  ],
  size: 800,
  effectRadius: 40,
  minRadius: 1,
  maxRadius: 3
});
```
***

### opernit.collisionCircles()

**discription**
 * 원끼리 부딪히는 효과

**parameter**
 * ?object:Object
    * ?color:Array - 표현될 원 색깔
    * ?size:Number - 원 갯수
    * ?radius:Number - 원 반지름

**example**
```javascript
opernit.collisionCircles({
    color: [
      '#fffdb7',
      '#aef4a4',
      '#79b8d1',
      '#e36488',
    ],
    size: 100,
    radius: 20,
});
```
***

### opernit.telescope()

**discription**
 * 원이 점점 커지면서 사라지는 효과

**parameter**
 * ?object:Object
    * ?radius:Number - 원 초기 반지름
    * ?backgroundColor:String - 원을 제외한 나머지 부분 색깔
    * ?elStyle - canvas 엘리먼트 스타일

**example**
```javascript
opernit.collisionCircles({
    radius: 50,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    elStyle: 'position: fixed;' +
             'top: 0;' +
             'left: 0;' +
             'z-index: 10;'
});
```

***

### opernit.gravityCircles()

**discription**
 * 원이 바닥에 부딪히는 

**parameter**
 * ?object:Object
    * ?color:Array - 원 초기 반지름
    * ?size:Number - 원을 제외한 나머지 부분 색깔
    * ?gravity:Number
    * ?friction:Number
    * ?minRadius:Number
    * ?maxRadius:Number

**example**
```javascript
opernit.collisionCircles({
    color: [
      '#fffdb7',
      '#aef4a4',
      '#79b8d1',
      '#e36488',
    ],
    size: 50,
    gravity: 1,
    friction: 0.99,
    minRadius: 30,
    maxRadius: 50
});
```

## License

MIT
