/*
* @Author: 10261
* @Date:   2017-11-06 10:14:47
* @Last Modified by:   10261
* @Last Modified time: 2017-11-07 21:10:29
*/
'use strict';
$(function() {
	FastClick.attach(document.body);
	console.log("fastclick, ok");
});
var requestAnimFrame = (function(){
	return window.requestAnimationFrame       ||
           window.webkitRequestAnimationFrame ||
           window.mozRequestAnimationFrame    ||
           window.oRequestAnimationFrame      ||
           window.msRequestAnimationFrame     ||
           function(callback){
           	  window.setTimeout(callback, 1000 / 60);
           };
})();

var utils = {
	debounce: function (func, delay) {
		var timer = null;
		return function () {
			var self = this;
			clearTimeout(timer);
			timer = setTimeout(function () {
				func.apply(self, arguments);
			}, delay);
		}
	}
}
var golbal = {
	map: {},
	master: {},
	view: {},
	rightDown: false,
	width: 0,
	height: 0,
	time: {},
	score: {},
	setTime: {},
	click: false,
	scene: {},
	rec: 3,
	lastTime: Date.now(),
	orient: "portrait",
	collisions: [false, false, false, false],

	init: function () {

		var self = this;

		window.onresize = utils.debounce(self.checkOrient, 300);
		self.checkOrient();
		console.log(self.orient);

		self.map = new Maps({
			width: self.scene.width,
			height: self.scene.height,
		});

		self.master = new Role({
			x: 200,
			y: 500,
			width: 70,
			height: 90,
			sprite: {
				url: "./img/sprite.png",
				size: [100, 136],
				frames: 10,
				pos: [0, 0],
				speed: 15
			}
		})

		self.lastTime = Date.now();

		var viewCanvas = document.createElement("canvas");
		viewCanvas.width = self.width;
		viewCanvas.height =self.height;
		document.body.appendChild(viewCanvas);

		self.score = new Nums();
		self.time = new Nums();


		self.view = new Views({
			canvas: viewCanvas, 
			x: 0, 
			y: 0
		});

		$("body").on('click', function (e) {
			self.click = true;
		});
		$("body").on('keydown', function (e) {
			var key = e.which;
			if (key == 68) {
				self.rightDown = true;
			}
		});
		$("body").on('keyup',function (e) {
			var key = e.which;
			if (key == 68) {
				self.rightDown = false;
			}
		});

		self.map.render(self.scene);
		self.view.render(self.map, self.master, self.score, self.time, self.scene.gold);
		self.setTime = setInterval(function () {
			self.view.render(self.map, self.master, self.score, self.time, self.scene.gold);

			self.view.ctx.drawImage(resources.get("./img/" + self.rec + ".png"), 0, 0, 17, 34, self.width / 2 - self.height * 3 / 20, self.height / 5, self.height * 3 / 10, self.height * 3 / 5);
			self.rec --;
			if (self.rec == 0) {
				clearInterval(self.setTime);
				self.master.sprite.run = true;
				self.update();
				self.setTime = setInterval(function () {
					self.time.num++;
					self.time.draw(self.time.num);
				}, 1000);
			}
		}, 1000)
		// setTimeout(function () {
		// 	self.master.sprite.run = true;
		// 	self.update();
		// 	self.setTime = setInterval(function () {
		// 		self.time.num++;
		// 		self.time.draw(self.time.num);
		// 	}, 1000);
		// }, 3000);
	},
	update: function () {
		var self = this;
		var now = Date.now();
		var dt = (now - self.lastTime) / 1000.0;
		self.lastTime = now;
		self.master.sprite.update(dt);

		self.checkCollisions();

		if (self.collisions[1]) {
			self.master.isRun = false;
		} else {
			self.master.isRun = true;
		}

		if (self.click) {
			if (!self.master.isJump) {
				self.master.isJump = true;
				self.master.jumpDirection = "UP";
			}
			self.click = false;
		} 

		self.master.move();

		if (self.master.isRun) {
			if (self.master.x - self.view.x > self.view.width * (750 / self.view.height) / 2 && self.view.x + self.view.width * (750 / self.view.height) < self.scene.width) {
				self.view.move();
			}
		}

		self.view.render(self.map, self.master, self.score, self.time, self.scene.gold);

		// if (self.rightDown) {
		// 	self.view.move();
		// 	self.view.render(self.map, self.master);
		// }
		// 
		if (self.master.x + self.master.width > 21430) {
			clearInterval(self.setTime);
			self.master.isRun = false;
			self.flag();

		} else {
			requestAnimFrame(function () {
				self.update();
			});
		}
	},
	checkCollisions: function () {
		var self = this;
		var mEast, mWest, mSouth, mNorth;
		this.collisions = [false, false, false, false];

		mEast = self.master.x + self.master.width;
		mWest = self.master.x;
		mSouth = self.master.y + self.master.height;
		mNorth = self.master.y;

		function check(mEast, mWest, mSouth, mNorth, block) {
			var col = [false, false, false, false];

			for (var i = 0; i < block.length; i ++) {
				var item = block[i],
				    iEast = item.x + item.width,
				    iWest = item.x,
				    iSouth = item.y + item.height,
				    iNorth = item.y;
				if (mNorth - 20 < iSouth && mSouth > iNorth && mEast > iWest && mWest < iEast) {
					col[0] = true;
				} 
				if (mEast + 20 > iWest && mWest < iEast && mNorth < iSouth && mSouth > iNorth) {
					col[1] = true;
				} 
				if (mSouth + 20 > iNorth && mNorth < iSouth && mEast > iWest && mWest < iEast) {
					col[2] = true;
				}
				if (mWest - 20 < iEast && mEast > iWest && mNorth < iSouth && mSouth > iNorth) {
					col[3] = true;
				}
			}

			return col;
		}

		var staticThing = [];

		for (var i = 0; i < self.scene.block.length; i++) {
			staticThing.push(self.scene.block[i]);
		}
		for (var i = 0; i < self.scene.step.length; i++) {
			staticThing.push(self.scene.step[i]);
		}

		this.collisions = check(mEast, mWest, mSouth, mNorth, staticThing);
		if (this.collisions[0] && this.collisions[1] && this.collisions[2] && this.collisions[3]) {
			self.master.x  = self.master.x - 20;
			this.collisions = check(mEast, mWest, mSouth, mNorth, staticThing);
		}


		for (var i = 0; i < self.scene.gold.length; i++) {
			var item = self.scene.gold[i];
			var box = [item];
			var goldCol = check(mEast, mWest, mSouth, mNorth, box);
			if (goldCol[0] || goldCol[1] || goldCol[2] || goldCol[3]) {
				self.scene.gold[i].eat = true;
			}
		}


	},
	checkOrient: function () {
		var self = this;
		var data = localStorage.getItem("orientX");
		var cw = document.documentElement.clientWidth;
		var _Width = 0;
		var _Height = 0;
		if (!data) {
			var sw = window.screen.width;
			var sh = window.screen.height;

			_Width = sw < sh ? sw : sh;
			_Height = sw >= sh ? sw : sh;
			localStorage.setItem('orientX', _Width + ',' + _Height);
		} else {
			var screen = data.split(',');
			_Width = screen[0];
			_Height = screen[1];
		}

		if (cw == _Width) {
			//竖屏
			document.querySelector('body').style.transform = "rotate(90deg)";
			self.width = document.documentElement.clientHeight;
			self.height = document.documentElement.clientWidth;
			self.orient = 'portrait';
		} 
		if (cw == _Height) {
			//横屏
			document.querySelector('body').style.transform = "rotate(0deg)";
			self.width = document.documentElement.clientWidth;
			self.height = document.documentElement.clientHeight;
			self.orient = 'landscape';
		}
	},
	craeteGold: function () {
		var self = this;

		var num = parseInt(Math.random() * 40 + 80);
		var unit = self.scene.width / num;

		self.scene.gold = [];

		function findY(x, width, block) {
			var box = [];
			var min = 750;
			for (var i = 0; i < block.length; i++) {
				var item = block[i];
				if (Math.abs((x + width / 2) - (item.x + item.width / 2)) < (width + item.width) / 2) {
					box.push(block[i]);
				}
			}
			if (box.length == 0) {
				return 750;
			} else {
				for (var i = 0; i < box.length; i++) {
					if (box[i].y < min) {
						min =box[i].y;
					}
				}

				return min - 77 - Math.random() * 50;
			}
		}

		for (var i = 0; i < num - 5; i++) {

			var x = unit * (i + 3 + Math.random());
			var y1 = findY(x, 92, self.scene.step);
			var y2 = findY(x, 92, self.scene.block);
			var y = Math.random() > 0.5 ? y1 : y2;
			self.scene.gold.push({
				x: x,
				y: y,
				width: 92, 
				height: 77, 
				eat: false
			});

		}
	},
	flag: function () {
		var self = this;
		var ratio = self.height / 750;
		var flag = self.scene.flag;

		self.checkCollisions();

		self.master.jump();

		self.view.render(self.map, self.master, self.score, self.time, self.scene.gold);

		self.view.ctx.drawImage(resources.get("./img/flag.png"), 0, 0, flag.width, flag.height, (flag.x - self.view.x) * ratio, flag.y * ratio, flag.width *ratio, flag.height * ratio);

		self.scene.flag.y -= 1;
		console.log(0.1);

		if (self.scene.flag.y < 300) {
			//传递数据，游戏结束
			console.log("game over");
		} else {
			requestAnimFrame(function () {
				self.flag();
			});
		}
	},
	reverse: function () {},
	over: function () {}
}

// golbal.init();

$.ajax({
	type: 'GET',
	url: './js/scene.json',
	async: false,
	success: function (data) {
		golbal.scene = data;
		golbal.craeteGold();
		console.log(data);
	}
});
setTimeout(function () {
	golbal.init();
}, 1000); 