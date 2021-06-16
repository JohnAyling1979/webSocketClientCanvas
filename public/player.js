function Player() {
	var x = 0
	var y = 0;
	var speed = 10;
	var color = 'rgb(200, 0, 0)'
	var key = null;
	var score = 0;
	var bullet = null;
	var direction = 'd';
	var dead = false;
	var score = 0;

	function draw() {
		switch (key) {
			case 'w':
				direction = 'w';
				y -= speed;
				if (y < 0) y = 0;
			break;
			case 'a':
				direction = 'a';
				x -= speed;
				if (x < 0) x = 0;
			break;
			case 's':
				direction = 's';
				y += speed;
				if (y > canvas.height - 50) y = canvas.height - 50;
			break;
			case 'd':
				direction = 'd';
				x += speed;
				if (x > canvas.width - 50) x = canvas.width - 50;
			break;
			case ' ':
				if (bullet === null) {
					switch (direction) {
						case 'w':
							bullet = new Bullet(x + 25, y -1, direction, destroyBullet)
						break;
						case 'a':
							bullet = new Bullet(x - 1, y + 25, direction, destroyBullet)
						break;
						case 's':
							bullet = new Bullet(x +25, y + 51, direction, destroyBullet)
						break;
						case 'd':
							bullet = new Bullet(x + 51, y + 25, direction, destroyBullet)
						break;
					}
				}
			break;
		}

		ctx.fillStyle = color;
		ctx.fillRect(x, y, 50, 50);

		if (bullet) {
			bullet.draw();
		}

		score += (1 / 80)
	}

	function getX() {
		return x;
	}

	function getY() {
		return y;
	}

	function getScore() {
		return Math.floor(score);
	}

	function destroyBullet() {
		bullet = null;
	}

	function getBullet() {
		if (bullet) {
			return {
				x: bullet.getX(),
				y: bullet.getY()
			};
		}
	}

	function collistionCheck(pointX, pointY) {
		if (
			pointX >= x && pointX <= x + 50 &&
			pointY >= y && pointY <= y + 50
		) {
			dead = true;
		}
	}

	function isDead() {
		return dead;
	}

	window.addEventListener('keypress', function (e) {
		key = e.key
	});

	window.addEventListener('keyup', function (e) {
		key = null;
	});

	return {
		draw,
		getX,
		getY,
		getBullet,
		collistionCheck,
		isDead,
		getScore
	}
}
