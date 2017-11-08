/*
* @Author: 10261
* @Date:   2017-11-07 00:33:01
* @Last Modified by:   10261
* @Last Modified time: 2017-11-08 16:11:11
*/
'use strict';
(function () {
	var resourceCache = {};

	function load (urlOrArr) {
		if (urlOrArr instanceof Array) {
			urlOrArr.forEach(function (url) {
				_load(url);
			});
		} else {
			_load(urlOrArr);
		}
	}

	function _load(url) {
		if (resourceCache[url]) {
			return resourceCache[url];
		} else {
			var img = new Image();
			img.onload = function () {
				resourceCache[url] = img;
			}

			resourceCache[url] = false;
			img.src = url;
		}
	}

	function get(url) {
		return resourceCache[url];
	}

	function isReady() {
		var ready = true;

		for (var key in resourceCache) {
			if (resourceCache.hasOwnProperty(key) && !resourceCache[k]) {
				ready = false;
			}
		}

		return ready;
	}

	window.resources = {
		load: load,
		get: get
	};

	window.resources.load(['./img/bg.jpg',
		                   './img/big1.png',
		                   './img/big2.png',
		                   './img/big3.png',
		                   './img/goldLogo.png',
		                   './img/0.png', 
		                   './img/1.png', 
		                   './img/2.png',
		                   './img/3.png',
		                   './img/4.png',
		                   './img/5.png',
		                   './img/6.png',
		                   './img/7.png',
		                   './img/8.png',
		                   './img/9.png',
		                   './img/flag.png',
		                   './img/sprite.png']);

	setTimeout(function () {
		console.log(resources.get("./img/bg.jpg"));
	}, 1000);
})();