/*
* @Author: 10261
* @Date:   2017-11-06 12:12:43
* @Last Modified by:   10261
* @Last Modified time: 2017-11-07 22:35:18
*/
'use strict';
(function () {
	function Role(O) {
		this.x = O.x;
		this.y = O.y;

		this.width = O.width;
		this.height = O.height;

		this.speed = 8;

		this.isRun = false;

		this.isJump = false;
		this.jumpDirection = "DOWN";
		this.jumpHeight = 0;
		this.jumpMax = 200;

		this.sprite = {
			url: O.sprite.url,
			size: O.sprite.size,
			run: false,
			img: new Image(),
			_move: 0,
			pos: O.sprite.pos,
			frames: O.sprite.frames,
			speed: O.sprite.speed,
			update: function (dt) {
				this._move += this.speed * dt;
			},
			render: function (ctx, unit, rx, ry) {
				var frames = 0;
				var self = this;
				self.img.src = self.url;

				if (self.run) {
					var max = self.frames;
					var idx = Math.floor(self._move);
					frames = Math.floor(idx % max);
				}
				var x = self.pos[0];
				var y = self.pos[1];
				x += frames * self.size[0];
				ctx.drawImage(self.img, x, y, self.size[0], self.size[1], rx * unit, ry * unit, self.size[0] * unit * 0.75, self.size[1] * unit * 0.75);
			}
		}
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