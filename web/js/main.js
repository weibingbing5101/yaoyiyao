
// 张树垚 2015-09-16 20:39:03 创建
// 呼呼

var $dom = $(document).on('touchmove', function(ev) {
	ev.preventDefault();
});

var screenBox = $('.screen');

Math.double = function(num) {
	var pre = num < 0 ? '-' : '';
	num = Math.abs(num);
	return pre + (num < 10 ? ('0' + num) : ('' + num));
};


var canSwipe = false;
var Time = function(controll, imgBox, defaultNum, max) {

	this.document = $(document);

	this.controll = $(controll);
	this.imgBox = $(imgBox);
	this.num = defaultNum || '00';
	this.max = max || 60;

	this.imgs = this.imgBox.find('img');

	this.seperate = 20;
	this.startY = 0;
	this.startNum = this.num;

	this.set(this.num);
	this.bind();
};
Time.prototype = {
	bind: function() {
		this.controll.on('touchstart', this.touchstart.bind(this));
	},
	set: function(num) {
		console.log(num)
		this.num = num;
		this.imgs.forEach(this.setImg.bind(this));
	},
	setImg: function(img, i) {
		img.src = './images/no/' + this.num[i] + '.png';
	},
	touchstart: function(ev) {
		ev.preventDefault();
		this.startY = ev.touches[0].pageY;
		this.startNum = parseInt(this.num);
		this.controll.on('touchmove', this.touchmove.bind(this));
		this.controll.on('touchend', this.touchend.bind(this));
	},
	touchmove: function(ev) {
		var newNum = Math.floor(this.startNum + (this.startY - ev.touches[0].pageY) / this.seperate);
		newNum = Math.double((newNum % this.max + this.max) % this.max);
		if (newNum != this.num) {
			this.set(newNum);
			canSwipe = true;
		}
	},
	touchend: function(ev) {
		this.controll.off('touchmove');
		this.controll.off('touchend');
	}
};


var hour = new Time('.page1-controll-left', '.page1-time-hour', '16', 24);
var minute = new Time('.page1-controll-right', '.page1-time-minute', '30', 60);

$('.page1-controll-bottom').on('swipeRight', function() {
	if (canSwipe) {
		$('.page2').show().anim({opacity: 1}, 1, 'linear');
	} else {
		alert('亲，先选择下班时间再开门哦！');
	}
});



var $share = $('.share').on('click', function() {
	$share.hide();
});
$('[data-share]').on('click', function() {
	$share.show();
});
$('[data-test]').on('click', function() {
	alert('测试');
});












