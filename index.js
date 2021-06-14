var error = document.getElementById('error');
var canvas = document.getElementById('tutorial');
var playerName = document.getElementById('name');
var playerList = document.getElementById('player-list');

var socket = new WebSocket('ws://localhost:9080')
var otherPlayers = [];

function Player() {
	var x = 0
	var y = 0;
	var speed = 10;
	var color = 'rgb(200, 0, 0)'
	var key = null;

	function draw() {
		switch (key) {
			case 'w':
				y -= speed;
				if (y < 0) y = 0;
			break;
			case 'a':
				x -= speed;
				if (x < 0) x = 0;
			break;
			case 's':
				y += speed;
				if (y > canvas.height - 50) y = canvas.height - 50;
			break;
			case 'd':
				x += speed;
				if (x > canvas.width - 50) x = canvas.width - 50;
			break;
		}

		ctx.fillStyle = color;
		ctx.fillRect(x, y, 50, 50);
	}

	function getX() {
		return x;
	}

	function getY() {
		return y;
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
		getY
	}
}


if (canvas.getContext('2d')) {
	var ctx = canvas.getContext('2d');
	var player = Player();

	socket.addEventListener('open', function (event) {
		socket.send(JSON.stringify({
			x: player.getX(),
			y: player.getY()
		}));
	});

	socket.addEventListener('message', function (event) {
		otherPlayers = Object.values(JSON.parse(event.data).data);
	});

	socket.addEventListener('error', function (event) {
		error.innerHTML = 'Error connecting to the Server';
	});

	socket.addEventListener('close', function (event) {
		error.innerHTML = 'Connection is closed';
	});

	setInterval(function() {
		ctx.clearRect(0, 0, canvas.width, canvas.height);

		player.draw();

		playerListHtml = '';

		otherPlayers.forEach((other) => {
			ctx.fillStyle = 'rgb(0, 0, 200)';
			ctx.fillRect(other.x, other.y, 50, 50);
			playerListHtml += '<li>' + other.name + '</li>';
		});

		playerList.innerHTML = playerListHtml;

		if (socket.readyState === 1) {
			socket.send(JSON.stringify({
				x: player.getX(),
				y: player.getY(),
				name: playerName.value
			}));
		}
	}, 16);
} else {
	error.innerHTML = 'Could not get context of canvas';
}
