define(function (require) {
	'use strict';
	var core = require("core");
	var api = require("api");
	var jqxBaseFramework = window.minQuery || window.jQuery || jQuery;
	window.jqxBaseFramework = jqxBaseFramework;
	window.jQuery = jQuery;
	window.minQuery = jQuery;
	require("bootstrap-multiselect");
	require("jqxcore");
	require("jqxdata");
	require("jqxbuttons");
	require("jqxscrollbar");
	require("jqxdatatable");
	require("jqxtreegrid");
	require("jqxmenu");
	require("select2");
	var cache = require("cache");
	var layer = require("layer"); 
	var task = require("page/task"); 
	
	var mediaRegInfoTemp = require("templates/daren/media_reg_info");
    var taskDetailTemp = require("templates/task/task_detail");
    var taskResourceListTemp = require("templates/task/task_resource_list");
	
	var dict;
	function admin() {

	}

	/**
	 * 模块方法入口
	 */
	admin.init = function (page,data) {
	    	dict = data.dict; 
		if(page === "login") {
			$("#login_captcha_img").on("click",function(event){ 
        		$(this).attr("src",$(this).attr("src"))
        	});
        	$("#forget_captcha_img").on("click",function(event){
        		$(this).attr("src",$(this).attr("src"))
        	});
			core.listenClick();
		} else if(page == "home"){
//	            core.ajax({
//	                url: "/daren-web/daren/getCurrentUserRegInfo",
//	                type:"post",
//	                success: function(resp) {
//	                    core.modal("media_reg_info_modal",mediaRegInfoTemp(resp.result));
//			    core.setDic("add_dr_payee_bank", dict.BANK,resp.result.paymentPayeeBank);     
//			    core.setDic("add_or_edit_invoice_type", dict.SETTLEMENT_INVOICE_TYPE,resp.result.paymentInvoiceType);
//			    core.setDic("add_or_edit_settlement_period", dict.SETTLEMENT_PERIOD,resp.result.paymentSettlePeriod);    
//			    core.setDic("add_or_edit_settlement_method", dict.SETTLEMENT_METHOD,resp.result.paymentSettleMethod);
//	                }
//	            }); 	
	        core.selectDrByUserId("searchDrId");
			task.publicAccountInfoList(dict);
		}
	};
	
	admin.drTaskListSearch = function(that, data){
		
		$("#waitDeliveryArticle").attr("style","background:#f5b0ff");
		$("#waitAuditArticle").attr("style","background:#f5b0ff");	
		$("#waitEntryEffect").attr("style","background:#f5b0ff");	
		$("#waitAuditEffect").attr("style","background:#f5b0ff");	
		$("#waitSettle").attr("style","background:#f5b0ff");
		$("#searchByWhat").val(0);
    	task.drTaskListSearch(that, data);
    }
	admin.mainProductsDetail = function(that){
		task.mainProductsDetail(that);
    }
	admin.taskDetail = function(that){
		var dic = dict;
		task.taskDetail(that,dic);
	}
	admin.getAutoDeliveryArticle = function(that){
		var dic = dict;
		task.getAutoDeliveryArticle(that,dic);
	}
	admin.waitDeliveryArticle = function(that, data){
		$("#waitDeliveryArticle").attr("style","background:#ec5fff");
		
		$("#waitAuditArticle").attr("style","background:#f5b0ff");	
		$("#waitEntryEffect").attr("style","background:#f5b0ff");	
		$("#waitAuditEffect").attr("style","background:#f5b0ff");	
		$("#waitSettle").attr("style","background:#f5b0ff");
		
		$("#searchByWhat").val(1);
    	task.drTaskListSearch(that, data);
    }
	admin.waitAuditArticle = function(that, data){
		$("#waitAuditArticle").attr("style","background:#ec5fff");	

		$("#waitDeliveryArticle").attr("style","background:#f5b0ff");
		$("#waitEntryEffect").attr("style","background:#f5b0ff");	
		$("#waitAuditEffect").attr("style","background:#f5b0ff");	
		$("#waitSettle").attr("style","background:#f5b0ff");
		
		$("#searchByWhat").val(2);
    	task.drTaskListSearch(that, data);
    }
	admin.waitEntryEffect = function(that, data){
		$("#waitEntryEffect").attr("style","background:#ec5fff");	

		$("#waitAuditArticle").attr("style","background:#f5b0ff");	
		$("#waitDeliveryArticle").attr("style","background:#f5b0ff");
		$("#waitAuditEffect").attr("style","background:#f5b0ff");	
		$("#waitSettle").attr("style","background:#f5b0ff");
		
		$("#searchByWhat").val(3);
    	task.drTaskListSearch(that, data);
    }
	admin.waitAuditEffect = function(that, data){
		$("#waitAuditEffect").attr("style","background:#ec5fff");	

		$("#waitEntryEffect").attr("style","background:#f5b0ff");	
		$("#waitAuditArticle").attr("style","background:#f5b0ff");	
		$("#waitDeliveryArticle").attr("style","background:#f5b0ff");
		$("#waitSettle").attr("style","background:#f5b0ff");
		$("#searchByWhat").val(4);
    	task.drTaskListSearch(that, data);
    }
	admin.waitSettle = function(that, data){
		$("#waitSettle").attr("style","background:#ec5fff");

		$("#waitAuditEffect").attr("style","background:#f5b0ff");	
		$("#waitEntryEffect").attr("style","background:#f5b0ff");	
		$("#waitAuditArticle").attr("style","background:#f5b0ff");	
		$("#waitDeliveryArticle").attr("style","background:#f5b0ff");
		
		$("#searchByWhat").val(5);
    	task.drTaskListSearch(that, data);
    }
	admin.deliveryArticle = function(that){
		var dic = dict;
		task.deliveryArticle(that,dic);
	}
	admin.submitDeliveryArticle = function(that, data){
		task.submitDeliveryArticle(that, data);
	}
	admin.submitImages = function(){
		task.submitImages();
	}
	admin.entryEffect = function(that){
		var dic = dict;
		task.entryEffect(that,dic);
	}
	admin.submitEntryEffect = function(that, data){
		task.submitEntryEffect(that, data);
	}
	admin.submitEffectImages = function(){
		task.submitEffectImages();
	}
	admin.submitArticleImages = function(){
		task.submitArticleImages();
	}
	admin.showMainProducts = function(that){
		task.showMainProducts(that);
	}
	admin.showRemark = function(that){
		task.showRemark(that);
	}
	admin.showArticleUrl = function(that){
		task.showArticleUrl(that);
	}
	
	
	
	admin.initContextMenu = function () {
		var contextMenu = $("#Menu").jqxMenu({
			width: 200,
			height: 87,
			autoOpenPopup: false,
			mode: 'popup'
		});
		$("#treeGrid").on('contextmenu', function () {
			return true;
		});
		$("#treeGrid").on('rowClick', function (event) {
			var args = event.args;
			if (args.originalEvent.button == 2) {
				var scrollTop = $(window).scrollTop();
				var scrollLeft = $(window).scrollLeft();
				contextMenu.jqxMenu('open', parseInt(event.args.originalEvent.clientX) + 5 + scrollLeft, parseInt(event.args.originalEvent.clientY) + 5 + scrollTop);
				return false;
			}
		});
		$("#Menu").on('itemclick', function (event) {
			var args = event.args;
			$('#perm-submit').unbind();
			$('#perm-form-reset').click();
			$('#perm-modal .modal-header h3').text(jQuery.trim($(args).text()));

			var selection = $("#treeGrid").jqxTreeGrid('getSelection');
			var rowid = selection[0].uid
			if (jQuery.trim($(args).text()) == "添加子节点") {
				$('#parent_name').text(selection[0].name);
				$('#pId').val(selection[0].id);
				$('#perm-modal').modal('show');
				$('#perm-submit').bind('click', addPerm);
			} else if (jQuery.trim($(args).text()) == "编辑节点") {
				if (!selection[0].pId) {
					core.warning('不能编辑根节点');
					return;
				}
				$('#pId').val(selection[0].pId);
				var rows = $("#treeGrid").jqxTreeGrid('getRows');
				for (var x in rows) {
					if (rows[x].id == selection[0].pId) {
						$('#parent_name').val(rows[x].name);
						break;
					}
				}
				$('#id').val(selection[0].id);
				$('#name').val(selection[0].name);
				$("#type").val(selection[0].type);
				$("#type").multiselect("refresh");
				$('#url').val(selection[0].url);
				$('#icon').val(selection[0].icon);
				$('#rank').val(selection[0].rank);
				$('#perm-modal').modal('show');
				$('#perm-submit').bind('click', updatePerm);
			} else if (jQuery.trim($(args).text()) == '删除节点') {
				if (!selection[0].pId) {
					layer.msg("不能删除根节点");
					return;
				}
				delPerm(selection[0].id);
			}
		});

		$('.multiselect').multiselect({
			buttonClass: 'btn btn-white btn-primary',
			templates: {
				button: '<button type="button" class="multiselect dropdown-toggle" data-toggle="dropdown"></button>',
				ul: '<ul class="multiselect-container dropdown-menu"></ul>',
				li: '<li><a href="javascript:void(0);"><label></label></a></li>',
				divider: '<li class="multiselect-item divider"></li>',
				liGroup: '<li class="multiselect-item group"><label class="multiselect-group"></label></li>'
			},
			onChange: function (element, checked) {
				alert(1)
			}
		});

		$('#perm-modal').on('show.bs.modal', function () {
			$('#type').multiselect('refresh');
			switch (parseInt($('#type').val())) {
			case 1:
				$('#rank').closest('.form-group').show()
				break;
			default:
				$('#rank').closest('.form-group').hide()
			}
		});
		$('#type').multiselect({
			onChange: function (element, checked) {
				switch (parseInt($('#type').val())) {
				case 1:
					$('#rank').closest('.form-group').show()
					break;
				default:
					$('#rank').closest('.form-group').hide()
				}
			}
		});
	}
	
	admin.submitMediaRegInfo = function(that,data){
	    var rtype = parseInt($(that).data("rtype"));
	    var url;
	    if(rtype==1){
		url = "/daren-web/daren/submitMediaRegInfoAuditForBasic";
	    }
            if(rtype==2){
        	url = "/daren-web/daren/submitMediaRegInfoAuditForContactMethod";	
            }
            if(rtype==3){
        	url = "/daren-web/daren/submitMediaRegInfoAuditForSettMethod";
            }
            core.ajax({
                url: url,
                type:"post",
                data: data,
                success: function(resp) {
                    core.success("操作成功");
                }
            });
	}
    
	
	admin.forgetPwd = function (that) { 
		$("#forget_password").modal("show");
		document.getElementById("forget-password-form").reset(); 
	}
	
	admin.submitForgetPassword = function(that, data) {
		//发送忘记密码邮件 
		core.ajax({
			url: "/daren-web/rbac/forgetPwd.wb",
			data:data, 
			type: "post",
			success: function(resp) {
//				console.log(JSON.stringify(resp));
				if(resp.status==0) {
					core.success(resp.result);
					$("#forget_password").modal("hide");
					$("#forget_password_verify").modal("show");
					document.getElementById("forget-password-verify-form").reset(); 
				}				
			}
		})
	}

	admin.submitForgetPasswordVerify = function(that, data) {
		var newPassword = $("#newPassword").val();
		var rePassword = $("#rePassword").val();
		if(rePassword!=newPassword) {
			core.warning("两次输入密码不相同");
		} else {
			core.ajax({
				url: "/daren-web/rbac/verify.wb", 
				type: "post",
				data:data,
				success: function(resp) {
					if(resp.status==0) {
						$("#forget_password_verify").modal("hide");
						core.alert("重置密码成功，请重新登录");						
					}
				}
			})
		}
		
	}

	admin.login = function (that) {
		var account = $("#account").val() || '';
		if (account === '') {
			core.warning("请输入用户名", function () {
				$("#account").focus();
			});
			return;
		}
		var password = $("#password").val() || '';
		if (password === '') {
			core.warning("密码不能为空", function () {
				$("#password").focus();
			});
			return;
		}
		var captcha = $("#captcha").val() || '';
		if (captcha === '') {
			core.warning("验证码不能为空", function () {
				$("#captcha").focus();
			});
			return;
		}
		
		var data = {
			account: account,
			password: password,
			captcha:captcha
		};
		var ajaxParam = {
			data: data,
			url: "/daren-web/rbac/login.wb",
			type: "post"
		};
		
//		var csrc = $("#login_captcha_img").attr("src"); 
//		$("#login_captcha_img").attr("src",csrc);
		

        	core.ajax({
        	    data : data,
        	    url : "/daren-web/rbac/login.wb",
        	    type : "post",
        	    success : function(jsonResult) {
        		if (jsonResult.status === 0) {
        		    var user = jsonResult.result.data1;
        		    var roles = jsonResult.result.data2 || [];
        		    user.roles = roles;
        		    cache.clearCache();
        		    cache.setAccountInfo(user);
        		    $.when(cache.initCaches(user.account)).done(function(done) {
        			location.href = "index.html";
        		    });
        		} else if (jsonResult.status === 1100) {
        		    $("#first_time_login_reset_pwd").modal("show");
        		    $("#first_time_login_reset_pwd [name=token]").val(jsonResult.msg);
        		} else {
        		    core.failure("登录失败");
        		}
        	    }
        	});

	};
	

    	admin.submitFirstTimeLoginResetPwd = function(that, data) {
        	var newPassword = data.password;
        	var rePassword = data.rePassword;
        	if (rePassword != newPassword) {
        	    core.warning("两次输入密码不相同");
        	} else {
        	    core.ajax({
        		url : "/daren-web/rbac/user/resetPwd",
        		type : "post",
        		data : data,
        		success : function(resp) {
        		    if (resp.status == 0) {
        			$("#forget_password_verify").modal("hide");
        			core.alert("重置密码成功，请重新登录");
        		    }
        		}
        	    })
        	}
        }
	
	return admin;

});