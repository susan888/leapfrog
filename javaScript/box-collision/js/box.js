(function () {
  function Box(parentElement) {
    this.x = 10;
    this.y = 10;
    this.width = null;
    this.height = null;
    this.element = null;
    this.boxCollided = false;
    this.borderCollided = false;
    this.parentElement = parentElement;
    this.dy = getRandomArbitrary(-2,2) < 1 ? -2 : 2;
    this.dx = getRandomArbitrary(-2,2) < 1 ? -2 : 2;
    var that = this;

    this.init = function () {
      this.width = Math.trunc(getRandomArbitrary(10, 30));
      this.height = this.width;
      var box = document.createElement('div');
      box.classList.add('box');
      box.style.position = 'absolute';
      box.style.width = this.width + 'px';
      box.style.height = this.height + 'px';
      box.style.backgroundColor = '#'+getTruncatedInt(00,11)+getTruncatedInt(00,11)+getTruncatedInt(00,11);
      this.parentElement.appendChild(box);
      this.element = box;
      this.draw();
      return this;
    }

    this.setPostion = function(x, y) {
      this.x = x;
      this.y = y;
    }
    this.draw = function () {
      this.element.style.top = this.y + 'px';
      this.element.style.left = this.x + 'px';
    }
    this.move = function() {
      this.x += this.dx;
      this.y += this.dy;
      this.draw();
    }
    //Collision detection using top, bottom, right and left of box and boundary of container app
    this.boundaryCollision = function(width,height){
      var top = this.y;
      var left = this.x;
      var right = this.x + this.width;
      var bottom = this.y + this.height;
      if(top < 0 ){
        this.dy < 0 ? this.dy *= -1 : this.dy;
        this.borderCollided = true;
      }
      if(bottom > height){
        this.dy > 0 ? this.dy *= -1 : this.dy;
        this.borderCollided = true;
      }
      if(left < 0){
        this.dx < 0 ? this.dx *= -1 : this.dx;
        this.borderCollided = true;
      }
      if( right > width){
        this.dx > 0 ? this.dx *= -1 : this.dx;
        this.borderCollided = true;
      }
    }

    //Collision detection between boxes
    this.boxCollision = function(boxes, MAX_WIDTH, MAX_HEIGHT){
      for(var i = 0; i < boxes.length; i++){
        //true if checking box is going to be same one
        if(this != boxes[i]){
          if(this.boxCollided == false){
            if (this.x < boxes[i].x + boxes[i].width &&
              this.x + this.width > boxes[i].x &&
              this.y < boxes[i].y + boxes[i].height &&
              this.y + this.height > boxes[i].y) {  
                if(Math.abs(this.x - boxes[i].x) > Math.abs(this.y - boxes[i].y)){
                  this.dx *= -1;
                  that.boxCollided = true;
                }else{
                  this.dy *= -1;
                  that.boxCollided = true;
                }
            }
          }
        }
      }
    }
  }
  
  function getRandomArbitrary(min, max) {
    return Math.random() * (max - min) + min;
  }

  function getTruncatedInt(min,max){
    return Math.trunc(getRandomArbitrary(min,max));
  }

  function Game(parentElement, parentElementIndex) {
    var boxes = [];
    this.boxCount = 10;
    this.parentElement = parentElement;
    this.parentElementIndex = parentElementIndex;
    var MAX_WIDTH = this.parentElement.offsetWidth;
    var MAX_HEIGHT = this.parentElement.offsetHeight;

    this.startGame = function(boxCount) {
      setParentProperties(this.parentElement);
      this.boxCount = boxCount;
      for(var i=0; i < this.boxCount; i++) {
        var box = new Box(parentElement).init();
        //Check if box position overlaps
        var value = {};
        var check = true;
        if(boxes.length >= 1){
          while(check){
            var state = false;
            var overLapped = false;
            value.x = getRandomArbitrary(0, MAX_WIDTH - box.width);
            value.y = getRandomArbitrary(0, MAX_HEIGHT - box.height);
            for(var j = 0; j < boxes.length; j++){
              if(value.x < boxes[j].x + boxes[j].width &&
                value.x + box.width > boxes[j].x &&
                value.y < boxes[j].y + boxes[j].height &&
                value.y + box.height > boxes[j].y){
                overLapped = true;
                  break;
                }else{
                  state = true;
                }
            }
            if(overLapped == false && state == true)
              {check = false;}
          }
          box.setPostion(value.x,value.y);
          box.draw();
          boxes.push(box);
        }else{
          box.setPostion(
            getRandomArbitrary(0, MAX_WIDTH - box.width),
            getRandomArbitrary(0, MAX_HEIGHT - box.height)
          );          
          box.draw();
          boxes.push(box);
        }
      }

      setInterval(this.moveBoxes.bind(this), 1);
    }

    this.moveBoxes = function() {
      for(var i=0; i < this.boxCount; i++) {
        if(!boxes[i].boxCollided)
        {
          console.log('box not colided');
          boxes[i].boxCollision(boxes, MAX_WIDTH, MAX_HEIGHT);
        }
        if(!boxes[i].borderCollided)
        {
          console.log('Boundry not boxCollided');
          boxes[i].boundaryCollision(MAX_WIDTH, MAX_HEIGHT);
        }
        boxes[i].move();
      }
      for(var i=0; i < this.boxCount; i++) {
        boxes[i].boxCollided = false;
        boxes[i].borderCollided = false;
      }
    }
  }



  function setParentProperties(parent){
    parent.style.margin = '0 auto';
    parent.style.position = 'relative';
    parent.style.backgroundColor = 'grey';
    parent.style.border = '2px solid blue';
  }

  var parentElement = document.getElementsByClassName('app');
  for(var i = 0; i < parentElement.length; i++){
    new Game(parentElement[i], i).startGame(180);
  }
})();