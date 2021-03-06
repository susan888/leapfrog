function Arrow(ctx, player){
	this.dx = 0;
	this.dy = 0;
	this.speed = 35;
	this.width = 10;
	this.height = 45;
	this.eCenterX = 0;
	this.eCentery = 0;
	this.angle = null;
	this.damagePoint = 0;
	this.collidedTo = null;
	this.collidedState = false;
	this.x = Math.floor(player.x + player.width / 2);
	this.y = Math.floor(player.y + player.height / 2);

	this.init = function(playerDamage){
		this.damagePoint = playerDamage;
		this.eCenterX = Math.floor(player.enemyTarget.x + player.enemyTarget.width / 2);
		this.eCentery = Math.floor(player.enemyTarget.y + player.enemyTarget.height / 2);
		this.angle = Math.atan2( this.y - this.eCentery ,  this.x - this.eCenterX);
		this.dx = - Math.cos(this.angle);
		this.dy = - Math.sin(this.angle);
		this.x -= this.width / 2;
		this.y -= this.height / 2;
	}
	this.setPosition = function(newPosition){
		var newPositionOfX = this.dx > 0 ? 1 : -1;
		var newPositionOfY = this.dy > 0 ? 1 : -1;
		this.y += newPosition * (-newPositionOfY);
		this.x += newPosition * (newPositionOfX) + this.width / 2;

	}
	this.update = function(){
		if(this.collidedState == false){
			this.x += this.speed * this.dx;
			this.y += this.speed * this.dy;
			this.draw();
		}
	}
	this.checkBoundry = function(){
		if(this.x < gameBoundary.left){
			this.collidedTo = 'boundry';
			this.collidedState = true;
			return true;
		}
		if(this.x + this.width > gameBoundary.right){
			this.collidedTo = 'boundry';
			this.collidedState = true;
			return true;
		}
		if(this.y < gameBoundary.top){
			this.collidedTo = 'boundry';
			this.collidedState = true;
			return true;
		}
		if(this.y + this.height >mapInfo.y - gameBoundary.bottom){
			this.collidedTo = 'boundry';
			this.collidedState = true;
			return true;
		}
	}
	this.checkObstacle = function(obstacles){
		for(i = 0; i < obstacles.length; i++){
			if(collisionCheck(obstacles[i], this)){
				this.collidedState = true;
				this.collidedTo = 'obstacle';
			}
		}
	}
	this.checkEnemyCollision = function(enemies){
		for(i = 0; i < enemies.length; i++){
			if(collisionCheck(enemies[i], this)){
				this.collidedState = true;
				this.collidedTo = 'enemy';
				enemies[i].damageByHit(this.damagePoint);
				var arr = [];
				arr.push(this);
				arr.push(enemies[i]);
				return arr;
			}
		}
		return false;
	}
	this.draw = function(){
		ctx.beginPath();
		ctx.save();
		ctx.fillStyle = 'red';
		ctx.translate(this.x + this.width / 2, this.y + this.height / 2);
		ctx.rotate(this.angle - Math.PI / 2);
		ctx.translate( - this.x - this.width / 2, - this.y - this.height / 2);
		ctx.drawImage(arrowImg, this.x, this.y, this.width, this.height);
		ctx.restore();
	}
}