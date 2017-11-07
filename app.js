/*
* @Author: 10261
* @Date:   2017-11-06 22:46:53
* @Last Modified by:   10261
* @Last Modified time: 2017-11-07 21:08:25
*/
var express = require('express');
var app = express();

app.use(express.static("./public"));

app.set('port', (process.env.PORT || 8888));

app.listen(app.get('port'), function () {
	console.log('run in ', app.get('port'));
});

app.get('/xixi', function (req, res) {
	res.send('heheh');
})
