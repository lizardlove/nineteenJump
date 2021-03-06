/*
* @Author: 10261
* @Date:   2017-11-06 10:14:47
* @Last Modified by:   10261
* @Last Modified time: 2017-11-08 21:15:20
*/
'use strict';
$(function() {
	FastClick.attach(document.body);
	console.log("fastclick, ok");
});
$(window).on('scroll.elasticity', function (e) {
    e.preventDefault();
}).on('touchmove.elasticity', function (e) {
    e.preventDefault();
});

var requestAnimFrame = (function(){
	return window.requestAnimationFrame       ||
           window.webkitRequestAnimationFrame ||
           window.mozRequestAnimationFrame    ||
           window.oRequestAnimationFrame      ||
           window.msRequestAnimationFrame     ||
           function(callback){
           	  window.setTimeout(callback, 1000 / 30);
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
	rec: 4,
	ratio: 0,
	lastTime: Date.now(),
	startTime: Date.now(),
	orient: "portrait",
	collisions: [false, false, false, false],

	init: function () {

		var self = this;

		self.click = false;

		self.checkOrient();
		
		self.ratio = self.height / 750;
		console.log(self.orient);

		self.master = new Role({
			x: 25,
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

		var viewCanvas = $('#bg')[0];
		var timeCanvas = $("#timeNum")[0];
		var scoreCanvas = $("#scoreNum")[0];
		var head = $('#head');
		var score = $("#score");
		var time = $("#time");
		head.css("width", 80 * self.ratio / 75 + "rem");
		head.css("height", 80 * self.ratio / 75 + "rem");
		score.css("width", 60 * self.ratio / 75 + "rem");
		score.css("height", 60 * self.ratio / 75 + "rem");
		time.css("width", 60 * self.ratio / 75 + "rem");
		time.css("height", 60 * self.ratio / 75 + "rem");
		timeCanvas.width = self.width / 15;
		timeCanvas.height = self.height / 15;
		scoreCanvas.width = self.width / 15;
		scoreCanvas.height = self.height / 15;
		viewCanvas.width = self.width;
		viewCanvas.height =self.height;

		self.score = new Nums({
			canvas: scoreCanvas
		});
		self.time = new Nums({
			canvas: timeCanvas
		});
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

		self.view.render(self.master, self.score, self.time, self.scene.gold);
		self.setTime = setInterval(function () {
			self.view.render(self.master, self.score, self.time, self.scene.gold);
			self.rec --;
			if (self.rec == 0) {
				clearInterval(self.setTime);
				self.master.sprite.run = true;
				self.update();
				self.startTime = Date.now();
				return;
			}
			console.log(self.rec);
			self.view.viewCtx.save();
			self.view.viewCtx.font = "100px Arial";
			self.view.viewCtx.textAlign = "center";
			self.view.viewCtx.fillStyle = "#ff752a";
			self.view.viewCtx.fillText(self.rec, self.width / 2, self.height / 2);
			self.view.viewCtx.restore();
			// self.view.viewCtx.drawImage(resources.get("./img/big" + self.rec + ".png"), 0, 0, 140, 300, self.width / 2 - self.height * 3 / 20, self.height / 5, self.height * 3 / 10, self.height * 3 / 5);
		}, 1000)
	},
	update: function () {
		var self = this;


		var now = Date.now();
		var dt = (now - self.lastTime) / 1000.0;
		self.lastTime = now;
		self.master.sprite.update(dt);
		self.master.render();


		self.time.num = Math.floor((now - self.startTime) / 1000.0);
		self.time.draw(self.time.num);

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

		self.view.render(self.master, self.score, self.time, self.scene.gold);
		if (self.view.x + self.view.width * (750 / self.view.height) >= self.scene.width) {
			var ratio = self.view.height / 750;
			var flag = self.scene.flag;
			self.view.viewCtx.drawImage(resources.get("./img/flag.png"), 0, 0, flag.width, flag.height, (flag.x - self.view.x) * ratio, flag.y * ratio, flag.width *ratio, flag.height * ratio);
		}

		if (self.master.x + self.master.width > 21430) {
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
				if (mNorth - 10 < iSouth && mSouth > iNorth && mEast > iWest && mWest < iEast) {
					col[0] = true;
				} 
				if (mEast + 10 > iWest && mWest < iEast && mNorth < iSouth && mSouth > iNorth) {
					col[1] = true;
				} 
				if (mSouth + 10 > iNorth && mNorth < iSouth && mEast > iWest && mWest < iEast) {
					col[2] = true;
				}
				if (mWest - 10 < iEast && mEast > iWest && mNorth < iSouth && mSouth > iNorth) {
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
			self.master.x  = self.master.x - 1;
			this.collisions = check(mEast, mWest, mSouth, mNorth, staticThing);
			console.log(self.master.x);
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
			
			self.width = document.documentElement.clientHeight;
			self.height = document.documentElement.clientWidth;
			document.querySelector('body').style.transform = "rotate(90deg)";
			self.orient = 'portrait';
		} 
		if (cw == _Height) {
			//横屏
			document.querySelector('body').style.transform = "rotate(0deg)";
			self.width = document.documentElement.clientWidth;
			self.height = document.documentElement.clientHeight;
			self.orient = 'landscape';
		}

		$("#headBg").css("width", self.width);
		$("#headBg").css("height", self.height);
	},
	craeteGold: function () {
		var self = this;

		var num = parseInt(Math.random() * 40 + 80);
		var unit = self.scene.width / num;

		self.scene.gold = [];
		var str = '富强,民主,文明,和谐,自由,平等,公正,法治,爱国,敬业,诚信,友善,伟大复兴,新时代,从严治党,五位一体,四个全面,中国梦,不忘初心,牢记使命,供给侧,一带一路,数字经济,人工智能,反腐倡廉,大数据,云计算,创新驱动,创新创业,人才强国,乡村振兴,军民融合,和平共处,绿水青山,群众路线,三严三实,两学一做,八项规定,打虎拍蝇,理论自信.道路自信,文化自信,制度自信,工匠精神,健康中国,美丽中国,数字中国,精准扶贫,精准脱贫,伟大工程,伟大事业,伟大梦想,伟大斗争,科教兴国,共享经济,政治意识,大局意识,核心意识,看齐意识,改革开放,爱国精神,国家意识,全球治理观,人民为中心,新发展理念,区域协调发展';
		var keyword = str.split(',');
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

			var x = unit * (i + 2 + Math.random());
			var y1 = findY(x, 92, self.scene.step);
			var y2 = findY(x, 92, self.scene.block);
			var y = Math.random() > 0.5 ? y1 : y2;

			if (y == 750) {
				y = 400;
			}
			self.scene.gold.push({
				x: Math.floor(x),
				y: Math.floor(y),
				width: 50, 
				height: 50, 
				eat: false,
				data: keyword[Math.floor(Math.random()*keyword.length)]
			});

		}
	},
	flag: function () {
		var self = this;
		var ratio = self.height / 750;
		var flag = self.scene.flag;

		self.checkCollisions();

		self.master.jump();

		self.view.render(self.master, self.score, self.time, self.scene.gold);

		self.view.viewCtx.drawImage(resources.get("./img/flag.png"), 0, 0, flag.width, flag.height, (flag.x - self.view.x) * ratio, flag.y * ratio, flag.width *ratio, flag.height * ratio);

		self.scene.flag.y -= 4;
		console.log(0.1);

		if (self.scene.flag.y < 300) {
			function asdasdaflfajkbfdksadknaskdna(afmasdknkasdasfankmlkohiqwei){afmasdknkasdasfankmlkohiqwei=afmasdknkasdasfankmlkohiqwei||10;var asdklnalsfnn="";for(var i=0;i<afmasdknkasdasfankmlkohiqwei;i++){asdklnalsfnn+=Math.floor(Math.random()*10)}return asdklnalsfnn}function kasaasfnkafjaisdjhn(asdasdasdasfasc){return btoa(encodeURIComponent("umrcaonimayangqifanumr"+asdasdaflfajkbfdksadknaskdna()+asdasdasdasfasc+asdasdaflfajkbfdksadknaskdna()+"umrcaonimayangqifanumr").replace(/%([0-9A-F]{2})/g,function(match,p1){return String.fromCharCode("0x"+p1)}))}function asdnasofbasofnoasdimas(asidafinowefpoasdnams,maspo){return kasaasfnkafjaisdjhn(asidafinowefpoasdnams,maspo)};
			var data = asdnasofbasofnoasdimas('shitidsbllp' + asdnasofbasofnoasdimas(self.time.num) + 'xiyiailolifuck' + asdnasofbasofnoasdimas(self.score.num) + 'bitchfackyangqifan');
			$.ajax({
				type: "POST",
				url: "./setScore",
				data: data,
				success: function (result) {
					window.location.href = "./results";
				}
			})
			console.log("game over");
		} else {
			requestAnimFrame(function () {
				self.flag();
			});
		}
	}
}

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
window.onresize = utils.debounce(golbal.checkOrient, 300);

golbal.checkOrient();

var gos = $("#go"),
    lingos = $("#lingo"),
    mores = $("#more"),
    heads = $("#head"),
    scores = $("#score"),
    times = $("#time"),
    bgs = $('#bg'),
    boxs = $("#box"),
    timeNums = $("#timeNum"),
    scoreNums = $("#scoreNum"),
    headBgs = $("#headBg"),
    closes = $("#close");

gos.on('click', function () {
	headBgs.css("display", "none");
	heads.css("display", "block");
	scores.css("display", "block");
	times.css("display", "block");
	bgs.css("display", "block");
	timeNums.css("display", "block");
	scoreNums.css("display", "block");
	scores.css("display", "block");
	setTimeout(function () {
		golbal.init()
	}, 500);
});
lingos.on('click', function () {
	boxs.css("display", "block");
});
closes.on('click', function () {
	boxs.css("display", "none");
})

// setTimeout(function () {
// 	golbal.init();
// }, 1000); 
