/*
* @Author: 10261
* @Date:   2017-11-06 15:55:51
* @Last Modified by:   10261
* @Last Modified time: 2017-11-07 16:27:05
*/
(function () {
	function Maps(O) {

		this.width = O.width;
		this.height = O.height;

		this.canvas = document.createElement('canvas');
		this.ctx = this.canvas.getContext('2d');
		this.canvas.width = O.width;
		this.canvas.height = O.height;

		this.re = false;

	}

	Maps.prototype.render = function (scene) {

		var self = this;
		var ctx = this.ctx;
		ctx.clearRect(0, 0, self.width, self.height);
		ctx.drawImage(resources.get("./img/bg.jpg"), 0, 0, self.width, self.height, 0, 0, self.width, self.height);

		// ctx.drawImage(resources.get("./img/head.png"), 0, 0, 78, 64, 50, 25, 78, 64);
		// ctx.drawImage(resources.get("./img/goldLogo.png"), 0, 0, 49, 48, 500, 25, 49, 48);
		// ctx.drawImage(resources.get("./img/timeLogo.png"), 0, 0, 42, 47, 1000, 25, 42, 47);

		// var score = 0;
		// for (var i = 0; i < scene.gold.length; i++) {

		// 	var item = scene.gold[i];

		// 	if (!item.eat) {
		// 		ctx.drawImage(resources.get("./img/gold.png"), 0, 0, item.width, item.height, item.x, item.y, item.width, item.height);
		// 	} else {
		// 		score++;
		// 	}

		// }

		// golbal.score = score;

		// console.log(golbal.score);

		// self.re = false;
	}

	window.Maps = Maps;
})();