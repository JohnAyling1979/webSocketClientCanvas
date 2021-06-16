function Bullet(startX, startY, startDirection, destroyBullet) {
	var speed = 15;
	var direction = startDirection;
	var x = startX;
	var y = startY;

	function draw() {
		switch (direction) {
			case 'w':
				y -= speed;
				if (y < 0) destroyBullet();
			break;
			case 'a':
				x -= speed;
				if (x < 0) destroyBullet();
			break;
			case 's':
				y += speed;
				if (y > canvas.height - 50) destroyBullet();
			break;
			case 'd':
				x += speed;
				if (x > canvas.width - 50) destroyBullet();
			break;
			case ' ':
				if (bullets.length === 0) {
					bullets.push(new Bullet(0, 0, 0));
				}
			break;
		}

		ctx.beginPath();
		ctx.arc(x, y, 2, 0, 2 * Math.PI, false);
		ctx.fill();
	}

	function getX() {
		return x;
	}

	function getY() {
		return y;
	}

	return {
		draw,
		getX,
		getY,
	};
}