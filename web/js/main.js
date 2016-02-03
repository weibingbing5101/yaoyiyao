
// 张树垚 2016-02-02 15:45:09 创建
// 果仁宝摇一摇

var $dom = $(document).on('touchmove', function(ev) {
	ev.preventDefault();
});


var get = (function() {
	return location.search.replace('?', '').split('&').reduce(function(result, item) {
		if (item) {
			item = item.split('=');
			result[item[0]] = item[1];
		}
		return result;
	}, {});
})();


// 20-30		5%
// 31-50		10%
// 51-75		15%
// 76-100		25%
// 101-200		20%
// 201-500		15%
// 501-800		8%
// 801-1000		2%


var getNumber = function(from, to) { // 取值
	return parseInt(Math.random() * (to - from + 1)) + from;
};
var getBlock = function() { // 取区间
	var num = parseInt(Math.random() * 100); // 0-99
	var arr = [5,15,30,55,75,90,98,100];
	var result = [
		[20, 30],
		[31, 50],
		[51, 75],
		[76, 100],
		[101, 200],
		[201, 500],
		[501, 800],
		[801, 1000]
	];
	for (var i = 0; i < arr.length; i++) {
		if (arr[i] > num) {
			return result[i];
		}
	}
};
var testGetBlock = function() {
	var result = {};
	var length = 10000;
	var i, a;
	var arr = [];
	for (i = 0; i < length; i++) {
		a = getBlock().join('-');
		if (a in result) {
			result[a]++;
		} else {
			result[a] = 1;
		}
	}
	console.log('区间 => 概率');
	for (i in result) {
		arr.push({
			num: parseInt(i.split('-')[0]),
			key: i,
			value: (result[i] / length * 100).toFixed(2) + '%'
		});
	}
	arr.sort(function(a1, a2) {
		return a1.num - a2.num;
	}).forEach(function(item) {
		console.log(item.key + ' => ' + item.value);
	});
};






