/*
* @Author: 10261
* @Date:   2017-11-07 17:31:56
* @Last Modified by:   10261
* @Last Modified time: 2017-11-08 14:42:26
*/
(function () {
	function Nums(O) {
		this.canvas = O.canvas
		this.ctx = this.canvas.getContext('2d');

		this.width = this.canvas.width;
		this.height = this.canvas.height;

		this.num = 0;
		this.draw(this.num);
	}

	Nums.prototype.draw = function (num) {
		var self = this;
		var ctx = this.ctx;
		self.num = num;

		ctx.clearRect(0, 0, self.width, self.height);

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

		ctx.drawImage(resources.get(urlArr[a]), 0, 0, 17, 34, 0, 0, self.width / 3, self.height);
		ctx.drawImage(resources.get(urlArr[b]), 0, 0, 17, 34, self.width / 3, 0, self.width / 3, self.height);
		ctx.drawImage(resources.get(urlArr[c]), 0, 0, 17, 34, self.width * 2 / 3, 0, self.width / 3, self.height);

	}

	window.Nums = Nums;
})()