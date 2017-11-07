/*
* @Author: 10261
* @Date:   2017-11-07 17:31:56
* @Last Modified by:   10261
* @Last Modified time: 2017-11-07 17:59:16
*/
(function () {
	function Nums() {
		this.canvas = document.createElement('canvas');
		this.ctx = this.canvas.getContext('2d');

		this.canvas.width = 51;
		this.canvas.height = 34;

		this.num = 0;
		this.draw(this.num);
	}

	Nums.prototype.draw = function (num) {
		var self = this;
		var ctx = this.ctx;
		self.num = num;

		ctx.clearRect(0, 0, 51, 34);

		var urlArr = [
		    "./img/0.png",
		    "./img/1.png",
		    "./img/2.png",
		    "./img/3.png",
		    "./img/4.png",
		    "./img/5.png",
		    "./img/6.png",
		    "./img/7.png",
		    "./img/8.png",
		    "./img/9.png"];

		var a = Math.floor(self.num / 100);
		var b = Math.floor((self.num - a * 100) / 10);
		var c = Math.floor((self.num - a * 100) % 10);

		ctx.drawImage(resources.get(urlArr[a]), 0, 0, 17, 34, 0, 0, 17, 34);
		ctx.drawImage(resources.get(urlArr[b]), 0, 0, 17, 34, 17, 0, 17, 34);
		ctx.drawImage(resources.get(urlArr[c]), 0, 0, 17, 34, 34, 0, 17, 34);

	}

	window.Nums = Nums;
})()