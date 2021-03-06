/*
* @Author: 10261
* @Date:   2017-11-06 12:12:43
* @Last Modified by:   10261
* @Last Modified time: 2017-11-08 16:41:29
*/
'use strict';
(function () {
	function Role(O) {
		this.x = O.x;
		this.y = O.y;

		this.width = O.width;
		this.height = O.height;

		this.canvas = document.createElement("canvas");
		this.ctx = this.canvas.getContext('2d');
		this.canvas.width = this.width;
		this.canvas.height = this.height;

		this.speed = 6;

		this.isRun = false;

		this.isJump = false;
		this.jumpDirection = "DOWN";
		this.jumpHeight = 0;
		this.jumpMax = 200;

		this.sprite = {
			size: O.sprite.size,
			run: false,
			_move: 0,
			pos: O.sprite.pos,
			frames: O.sprite.frames,
			speed: O.sprite.speed,
			update: function (dt) {
				this._move += this.speed * dt;
			}
		}
	}

	Role.prototype.render = function () {
		var self = this;
		var ctx = self.ctx;

		self.ctx.clearRect(0, 0, self.width, self.height);

		var frames = 0;

		if (self.sprite.run) {
			var max = self.sprite.frames;
			var idx = Math.floor(self.sprite._move);
			frames = Math.floor(idx % max);
		}
		var x = frames * self.sprite.size[0];
		ctx.drawImage(resources.get('./img/sprite.png'), x, 0, self.sprite.size[0], self.sprite.size[1], 0, 0, self.width, self.height);

	}

	Role.prototype.move = function () {
		var self = this;
		if (self.isRun) {
			self.sprite.run = true;
			self.x = self.x + self.speed;
		} else {
			self.sprite.run = false;
		}
		if (self.isJump) {
			self.jump();
		} else {
			if (!golbal.collisions[2]) {
				self.jump();
			}
		}
	}

	Role.prototype.jump = function () {
		var self = this;
		if (self.jumpDirection == "UP") {
			if (self.jumpHeight < self.jumpMax && !golbal.collisions[0]) {
				self.y = self.y - 10;
				self.jumpHeight += 10;
			} else {
				self.jumpDirection = "DOWN";
			}
		} else {
			if (!golbal.collisions[2]) {
				self.y = self.y + 10;
			} else {
				self.isJump = false;
				self.jumpHeight = 0;
			}
		}
	}
	window.Role = Role;

})();