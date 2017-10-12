// 存放主要交互逻辑js代码
// javascript 模块化
var seckill = {
	// 封装秒杀相关ajax的url
	URL : {
		now : function() {
			return '/seckill/time/now';
		},
		exposer : function(seckillId) {
			return '/seckill/' + seckillId + '/exposer';
		},
		execution : function(seckillId, md5) {
			return '/seckill/' + seckillId + '/' + md5 + '/execution';
		}
	},
	// 处理秒杀逻辑
	handlerSeckill : function(seckillId, node) {
		// 获取秒杀地址，控制显示逻辑，执行秒杀
		node.hide().html('<button class="btn btn-primary btn-lg" id="killBtn">开始秒杀</button>');
		$.post(seckill.URL.exposer(seckillId), {}, function(result) {
			// 在回调函数中，执行交互流程
			if (result && result['success']) {
				var exposer = result['data'];
				if (exposer['exposed']) {
					// 开启秒杀
					// 获取秒杀地址
					var md5 = exposer['md5'];
					var killUrl = seckill.URL.execution(seckillId, md5);
					// console.log("killUrl:" + killUrl);
					// 绑定一次点击事件，防止重复点击
					$('#killBtn').one('click', function() {
						// 执行秒杀请求操作
						// 1：先禁用按钮
						$(this).addClass('disabled');
						// 2：发送秒杀请求执行秒杀
						$.post(killUrl, {}, function(result) {
							if (result && result['success']) {
								var killResult = result['data'];
								var state = killResult['state'];
								var stateInfo = killResult['stateInfo'];
								// 3：显示秒杀结果
								node.html('<span class="label label-success">' + stateInfo + '</span>');
							}
						});
					});
					node.show();
				} else {
					// 未开启秒杀，客户端与服务器端时间存在偏差
					var now = exposer['now'];
					var start = exposer['start'];
					var end = exposer['end'];
					// 重新计算计时逻辑
					seckill.countdown(seckillId, now, start, end);
				}
			} else {
				console.log("result:" + result);
			}
		});
	},
	// 验证手机号
	validatePhone : function(phone) {
		if (phone && phone.length == 11 && !isNaN(phone)) {
			return true;
		} else {
			return false;
		}
	},
	countdown : function(seckillId, nowTime, startTime, endTime) {
		var seckillBox = $('#seckill-box');
		// 时间判断
		if (nowTime > endTime) {
			// 秒杀结束
			seckillBox.html('秒杀结束！');
		} else if (nowTime < startTime) {
			// 秒杀未开始，计时事件绑定
			var killTime = new Date(Number(startTime) + 1000);
			// jquery倒计时插件，监听时间变化循环回调函数
			seckillBox.countdown(killTime, function(event) {
				// 时间格式
				var format = event.strftime('秒杀倒计时： %D天 %H时 %M分 %S秒');
				seckillBox.html(format);
			}).on('finish.countdown', function() {
				// 时间完成后回调事件
				seckill.handlerSeckill(seckillId, seckillBox);
			});
		} else {
			// 秒杀开始
			seckill.handlerSeckill(seckillId, seckillBox);
		}
	},
	// 详情页秒杀逻辑
	detail : {
		init : function(params) {
			// 手机验证和登录，计时交互
			// 规划我们的交互流程
			// 在cookie中查找手机号
			var killPhone = $.cookie('killPhone');
			// 没有登录
			if (!seckill.validatePhone(killPhone)) {
				// 绑定phone
				// 控制输出
				var killPhoneModal = $('#killPhoneModal');
				killPhoneModal.modal({
					// 显示弹出层
					show : true,
					// 禁止位置关闭
					backdrop : 'static',
					// 关闭键盘事件
					keyboard : false
				});
				$('#killPhoneBtn').click(function() {
					var inputPhone = $('#killPhoneKey').val();
					if (seckill.validatePhone(inputPhone)) {
						// 电话写入cookie
						$.cookie('killPhone', inputPhone,{expires:7, path:'/seckill'})
						// 刷新页面
						window.location.reload();
					} else {
						// 提交的电话号码无效
						// 显示手机号输入错误的提示信息（先隐藏节点，再写入数据，再显示出来，添加缓慢出现的显示效果）
						$('#killPhoneMessage').hide().html('<label class="label label-danger">手机号错误！</label>').show(300);
					}
				});
			}
			// 已经登录
			// 计时交互
			var startTime = params['startTime'];
			var endTime = params['endTime'];
			var seckillId = params['seckillId'];
			$.get(seckill.URL.now(), {}, function(result) {
				if (result && result['success']) {
					var nowTime = result['data'];
					// 时间判断，计时交互
					seckill.countdown(seckillId, nowTime, startTime, endTime);
				} else {
					console.log("result:" + result);
				}
			});
		}
	}
}