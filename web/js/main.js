
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


var getNumber = function(from, to) { // 取值
	return parseInt(Math.random() * (to - from + 1)) + from;
};
var blockArr = [
	[20, 30],
	[31, 50],
	[51, 75],
	[76, 100],
	[101, 200],
	[201, 500],
	[501, 800],
	[801, 1000]
];
var getBlock = function() { // 取区间
	var num = parseInt(Math.random() * 100); // 0-99
	var arr = [5,15,30,55,75,90,98,100];
	for (var i = 0; i < arr.length; i++) {
		if (arr[i] > num) {
			return blockArr[i];
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
var getMoney = function() {
	return getNumber.apply(this, getBlock());
};


var page1 = $('.page1');
var page2 = $('.page2');
var page1Load = function(fnEnd) {
	$.loader(page1, '_src', null, function() {
		fnEnd && fnEnd();
	});
};
var page2Load = function(fnEnd) {
	$.loader(page2, '_src', null, function() {
		fnEnd && fnEnd();
	});
};
var setPage2 = function(money, withoutShare) {
	$('#page2-money').html(money);
	money = parseInt(money);
	for (var i = 0; i < blockArr.length; i++) {
		if (money < blockArr[i][1]) {
			$('#page2-desc-img').attr('src', './images/desc' + (i + 1) + '.png');
			break;
		}
	}
	if (!withoutShare) {
		wx_title = '新年我能轻松赚' + money + '万，不跟尔等抢红包啦~';
		// wx_desc = '新年我能轻松赚' + money + '万，不跟尔等抢红包啦~';
		wx_link = baseUrl + '/index.html?m=' + money;
		setShare();
		$('.page2-btn2').show();
		$('#page2-btn1-img').attr('src', './images/btn3.png').parent().removeClass('center');
		$('#page2-title-img').attr('src', './images/page2-title-1.png');
	}
};


// ?m=33 进入页面
if (get.m) {
	page2Load(function() {
		page1Load();
		$('.page2-btn2').hide();
		$('#page2-btn1-img').attr('src', './images/btn1.png').parent().addClass('center');
		$('#page2-title-img').attr('src', './images/page2-title-2.png');
		setPage2(get.m, true);
		page2.fadeIn();
	});
} else {
	page1Load(function() {
		page2Load();
		page1.fadeIn(function() {
			shakable = true;
		});
	});
}

// 摇一摇
var shakable = false;
var onShake = function() { // 摇一摇成功
	shakable = false;
	var money = getMoney();
	setPage2(money);
	page2.fadeIn();
};
window.DeviceMotionEvent && (function() {
	var SHAKE_THRESHOLD = 2000;
	var last_update = 0;
	var x, y, z, last_x, last_y, last_z;
	window.ondevicemotion = function(obj) {
		if (!shakable) { return; }
		var acceleration = obj.accelerationIncludingGravity;
		var curTime = new Date().getTime();
		if ((curTime - last_update) > 100) {
			var diffTime = curTime - last_update;
			last_update = curTime;
			x = acceleration.x;
			y = acceleration.y;
			z = acceleration.z;
			var speed = Math.abs(x + y + z - last_x - last_y - last_z) / diffTime * 10000;
			if (speed > SHAKE_THRESHOLD) {
				onShake && onShake();
			}
			last_x = x;
			last_y = y;
			last_z = z;
		}
	};
})();

// 分享
var baseUrl = 'http://www.goopal.com.cn/yaoyiyao';
var wx_title = '抢完红包看一看, 新年你能赚多少？';
var wx_desc = '抢完红包看一看, 新年你能赚多少？';
var wx_link = baseUrl + '/index.html';
var wx_imgUrl = baseUrl + '/images/weixin.png';
var setShare = function() {
	wx.onMenuShareTimeline({
		title: wx_title,
		link: wx_link,
		imgUrl: wx_imgUrl,
		success: function() {
			console.log('分享成功');
		},
		cancel: function() {
			console.log('分享取消');
		},
		error: function() {
			console.log('分享失败');
		}
	});
	wx.onMenuShareAppMessage({
		title: wx_title,
		desc: wx_desc,
		link: wx_link,
		imgUrl: wx_imgUrl,
		success: function() {
			console.log('分享成功');
		},
		cancel: function() {
			console.log('分享取消');
		},
		error: function() {
			console.log('分享失败');
		}
	});
};
$.ajax({
	url: 'http://116.213.142.89:8080/common/weixin/signature',
	type: 'post',
	data: JSON.stringify({
		url: window.location.href
	}),
	dataType: 'json',
	success: function(data) {
		if (data.status == 200) {
			var returnData = data.data.signatureData;
			wx.config({
				appId: returnData.appId,
				timestamp: returnData.timestamp,
				nonceStr: returnData.nonceStr,
				signature: returnData.signature,
				jsApiList: [
					'onMenuShareTimeline',
					'onMenuShareAppMessage'
				]
			});
			wx.ready(function() {
				setShare();
			});
		}
	}
});

// 按钮
var page3 = $('.page3').on('click', function() {
	page3.fadeOut();
});
$('#page2-btn1-img').on('click', function() {
	page2.fadeOut();
	page1.fadeIn();
	shakable = true;
	wx_title = '抢完红包看一看, 新年你能赚多少？';
	// wx_desc = '抢完红包看一看, 新年你能赚多少？';
	wx_link = baseUrl + '/index.html';
	setShare();
});
$('#page2-btn2-img').on('click', function() {
	page3.fadeIn();
});
$('.music').on('click', function() {
	var bg = $('#audio-bg').get(0);
	var self = $(this);
	if (bg.paused) {
		bg.play();
		self.addClass('on');
	} else {
		bg.pause();
		self.removeClass('on');
	}
});


