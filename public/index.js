var error = document.getElementById('error');
var canvas = document.getElementById('tutorial');
var playerScore = document.getElementById('score');
var playerList = document.getElementById('player-list');

var socket = new WebSocket('wss://protected-spire-67513.herokuapp.com/')
var otherPlayers = [];

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
		if (!player.isDead()) {
			ctx.clearRect(0, 0, canvas.width, canvas.height);

			player.draw();

			playerListHtml = '';
			otherPlayers.forEach((other, index) => {
				ctx.fillStyle = 'rgb(0, 0, 200)';
				ctx.fillRect(other.x, other.y, 50, 50);
				playerListHtml += '<li>Oponent #' + (index + 1) + ' score ' + other.score + '</li>';

				if (other.bullet) {
					ctx.beginPath();
					ctx.arc(other.bullet.x, other.bullet.y, 2, 0, 2 * Math.PI, false);
					ctx.fill();

					player.collistionCheck(other.bullet.x, other.bullet.y);
				}
			});

			playerList.innerHTML = playerListHtml;
			playerScore.innerHTML = player.getScore()

			if (socket.readyState === 1) {
					socket.send(JSON.stringify({
						x: player.getX(),
						y: player.getY(),
						bullet: player.getBullet(),
						score: player.getScore()
					}));
			}
		} else {
			socket.close();

			ctx.clearRect(0, 0, canvas.width, canvas.height);

			ctx.font = "30px Arial";
			ctx.fillText("Game Over", 10, 50);
		}
	}, 16);
} else {
	error.innerHTML = 'Could not get context of canvas';
}
