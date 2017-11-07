/*
* @Author: 10261
* @Date:   2017-11-06 15:55:42
* @Last Modified by:   10261
* @Last Modified time: 2017-11-07 21:41:51
*/
(function () {
	function Views(O) {
		
		this.canvas = O.canvas;
		this.viewCtx = this.canvas.getContext('2d');

		this.staticCnavas = document.createElement("canvas");
		this.ctx = this.staticCnavas.getContext('2d');

		this.x = O.x;
		this.y = O.y;
		this.speed = 12;

		this.width = this.canvas.width;
		this.height = this.canvas.height;

		this.score = 0;
	}

	Views.prototype.move = function () {
		var self = this;
		self.x = self.x + self.speed;
	}

	Views.prototype.render = function (map, master, score, time, gold) {

		var self = this;
		var relaX = master.x - self.x;
		var relaY = master.y;
		var ratio = self.height / 750;

		self.ctx.clearRect(0, 0, self.width, self.height);
		self.ctx.drawImage(map.canvas, self.x, 0, self.width * (750 / self.height), 750, 0, 0, self.width, self.height);


		self.ctx.drawImage(resources.get("./img/head.png"), 0, 0, 78, 64, 50 * ratio, 25 * ratio, 78 * ratio, 64 * ratio);
		self.ctx.drawImage(resources.get("./img/goldLogo.png"), 0, 0, 49, 48, 500 * ratio, 25 * ratio, 49 * ratio, 48 * ratio);
		self.ctx.drawImage(resources.get("./img/timeLogo.png"), 0, 0, 42, 47, 1000 * ratio, 25 * ratio, 42 * ratio, 47 * ratio);


		var count = 0;

		for (var i = 0; i < gold.length; i++) {
			var item = gold[i];
			if (item.x + item.width > self.x && item.x < self.x + self.width * (750 / self.height)) {
				if (!item.eat) {
					self.ctx.drawImage(resources.get("./img/gold.png"), 0, 0, item.width, item.height, (item.x - self.x) * ratio, item.y * ratio, item.width * ratio, item.height * ratio);
				}
			}
			if (item.eat) {
				count++;
			}
		}

		if (score.num != count) {
			score.draw(count);
		}
		self.ctx.drawImage(score.canvas, 0, 0, 51, 34, 570 * ratio, 25 * ratio, 51 * ratio, 34 * ratio);
		self.ctx.drawImage(time.canvas, 0, 0, 51, 34, 1070 * ratio, 25 * ratio, 51 * ratio, 34 * ratio);


		master.sprite.render(self.ctx, ratio, relaX, relaY);

		self.viewCtx.drawImage(self.staticCnavas, 0, 0, self.width, self.height, 0, 0 self.width, self.height);
		// self.ctx.fillRect(relaX * ratio, relaY * ratio, master.width * ratio, master.height * ratio);
	}
	window.Views = Views;
})();