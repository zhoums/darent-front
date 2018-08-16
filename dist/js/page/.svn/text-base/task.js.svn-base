define(function(require) {
    // 兼容jquery form begin
    jQuery.browser = {};
    jQuery.browser.msie = false;
    jQuery.browser.version = 0;
    if (navigator.userAgent.match(/MSIE ([0-9]+)\./)) {
	jQuery.browser.msie = true;
	jQuery.browser.version = RegExp.$1;
    }
    // 兼容jquery form end
    var core = require("core");
    var jqform = require("jqform");
    require("hoverPreview");

    var dataUtil = require("common/data");
    var jqraty = require("common/jquery.raty.min");
    var dict;
    var taskDetailInfo = '';
    var isSendImg = false;

    var largeImgWrapperTemp = require("templates/task/large_img_wrapper");
    var mainProductsTemp = require("templates/task/main_products");
    var taskDetailTemp = require("templates/task/task_detail");
    var accountInfoListTemp = require("templates/task/account_info_list");
    var taskResourceListTemp = require("templates/task/task_resource_list");
    var entryEffectTemp = require("templates/task/entry_effect");
    var deliveryArticleTemp = require("templates/task/delivery_article");
    var autoDeliveryArticleTemp = require("templates/task/auto_delivery_article");
    var batchReceiveArticleTemp = require("templates/task/batch_receive_article");
    var noticeTemp = require("templates/common/notice");
    var drSettleApplyTemp = require("templates/task/dr_settle_apply");

    function task() {
//	console.log("构造");

    }
    task.init = function(page, data) {
//	console.log("初始化");
	dict = data.dict;
	var resourceLocation = dict.RESOURCE_LOCATION;
	resourceLocation[0] = '全选';
	core.setDic("searchResourceLocation", resourceLocation);
	core.setDic("searchTaskStatus", dict.TASK_STATUS);
	core.selectShop("searchShopId");
	core.selectAe("searchAeId");
	core.selectDren("searchDrId");
	if (page === "my_task") {
	    taskList();
	} else if (page === "account_info") {
	    accountInfoList();
	} else if (page === "media_settle_task_list") {
	    core.selectShop("search_shopId");
	    core.selectAllAe("search_aeId");
	    var resourceLocation = dict.RESOURCE_LOCATION;
	    resourceLocation[0] = '请选择';
	    core.setDic("search_resourceLocation", resourceLocation);
	    var taskStatus = dict.TASK_STATUS;
	    delete taskStatus[33];
	    taskStatus[0] = '全选';
	    core.setDic("task_status", taskStatus);
	    mediaSettleTaskList();
	}else if (page === "auto_delivery_article") {
	    autoList();
	}
    };
    // 打开达人结算Modal
    task.openDarenSettlementApplyModal = function(that, data) {
	var taskId = that.attr("taskId");
	var drsmethod = $(that).data("drsmethod");
	var needInvoice = false;
	if (parseInt(drsmethod) == 2)
	    needInvoice = true;
	core.modal("dr_settle_apply", drSettleApplyTemp({
	    taskId : taskId,
	    needInvoice : needInvoice
	}));
	$("#dr_settle_apply").on("change", "[name=hasInvoice]", function() {
	    var that = this;
	    var thatVal = parseInt($(that).val());
	    if (thatVal == 1) {
		$("#dr_settle_apply [name=invoiceNum]").addClass("required");
		$("#dr_settle_apply [name=invoiceAmt]").addClass("required");
	    } else {
		$("#dr_settle_apply [name=invoiceNum]").removeClass("required");
		$("#dr_settle_apply [name=invoiceAmt]").removeClass("required");
	    }
	});
    }
    // 提交达人结算申请
    task.submitDarenSettlementApplyModal = function(that, data) {
	var needinvoice = $(that).data("needinvoice");
	if (needinvoice) {
	    var image = [];
	    $('#invoiceFileWrapper li').map(function(index, target) {
		image.push($(target).find('img').attr('f'));
	    });
	    $.extend(data, {
		invoiceFile : image.join(",")
	    });
	}
	data.invoiceAmt = data.invoiceAmt || 0.0;
	var taskId = that.attr("taskId");
	core.confirm("申请结算?", function() {
	    core.ajax({
		url : "/daren-web/task/settle/dr_apply_settle",
		data : data,
		type : "post",
		success : function(resp) {
		    core.success("申请成功");
		    window.settleApplyTable.ajax.reload(null, false);
		    core.closeModal("dr_settle_apply");
		}
	    });
	});
    };

    task.mediaSettleTaskListSearch = function(that, data) {
//	console.log("task.taskListSearch--->>[data]" + JSON.stringify(data));
	window.mediaSettleTaskListTable.ajax.reload();
    }
    function mediaSettleTaskList() {
	core.initDatePicker("search_date_from", "search_date_to");
	core.initDatePicker("searchArticleRetrieve_date_from", "searchArticleRetrieve_date_to");
	var tableConfig = {
	    "ajax" : {
		url : "/daren-web/task/mediaSettleTaskPager",
		data : function(d) {
		    return d;
		},
		dataSrc : function(resp) {
		    if (resp.status != 0) {
			core.alert(resp.msg);
		    } else {
			core.fixResp(resp, function(row) {
			    row.idStr = "RW" + core.padLeft(row.id, 4);
			    var _rl = row.resourceLocation;
			    row.resourceLocation = dict.RESOURCE_LOCATION[row.resourceLocation];
			    if (row.estRetrieveTime) {
				row.estRetrieveTime = row.estRetrieveTime.substring(0, 10);
			    }
			    if (row.articleRetrieveTime) {
				row.articleRetrieveTime = row.articleRetrieveTime.substring(0, 10);
			    }
			    row.statusStr = dict.TASK_STATUS[row.status];
			    if (row.articleUrl && row.articleUrl.length > 0) {
				row.articleUrl = '[<a class="J_DoCopy" url="' + row.articleUrl + '" title="'
					+ row.articleUrl + '">复制</a>]';
			    }
			    
			    if(row.status!=90 &&row.status!=95 &&row.status!=96 &&row.status!=99) {
                            	if(row.status == 75) {
                            	    //只有平台审核通过的，才可以做结算
                            	    if(row.drFee && row.drFee>0.0 && row.drAccountAmt==0 && row.drIsAccount==0) {
                                    	var drOp = ' <a class="bind bind-click permission" code="settle_dr_task" bind-method="openDarenSettlementApplyModal" taskId='+row.id+' data-drsmethod="'+row.drSettlementMethod+'" >[结算]</a>';
                                    	row.op = drOp;
                                    }
                            	}
                            }
			    
			});
			return resp.result.list;
		    }
		},
	    },
	    "bSort" : false,
	    drawCallback : function(e) {
		$('.J_DoCopy').each(function(index, that) {
		    $(that).click(function(ev) {
			var oEvent = ev || event;
//			console.log(oEvent.clientX + "--" + oEvent.clientY);
			var url = $(that).attr("url");
			var transfer = document.getElementById('J_CopyTransfer');
			if (!transfer) {
			    transfer = document.createElement('textarea');
			    transfer.id = 'J_CopyTransfer';
			    transfer.style.position = 'fixed';
			    // transfer.style.display = 'none';
			    transfer.style.left = '-99999px';
			    transfer.style.top = '-99999px';
			    document.body.appendChild(transfer);
			}
			transfer.value = url;
			transfer.focus();
			transfer.select();
			document.execCommand('Copy', false, null);
		    });
		})
	    }
	};
	window.mediaSettleTaskListTable = core.dataTable("tb-list", tableConfig);
    }

    task.taskListSearch = function(that, data) {
//	console.log("task.taskListSearch--->>[data]" + JSON.stringify(data));
	window.myTaskListTable.ajax.reload();
    }

    function taskList() {
	core.initDatePicker("searchDeliveryDateFrom", "searchDeliveryDateTo");
	$("#searchSettlementStatus").prepend("<option value='' >请选择</option>");
	var tableConfig = {
	    "ajax" : {
		url : "/daren-web/task/myTaskList",
		dataSrc : function(resp) {
		    if (resp.status != 0) {
			core.alert(resp.msg);
		    } else {
			core.fixResp(resp,function(row) {
					    var _rl = row.resourceLocation;
					    row.resourceLocationStr = dict.RESOURCE_LOCATION[row.resourceLocation];
					    if (row.platform) {
						row.platformStr = dict.WE_MEDIA_PLATFORM[row.platform];
					    }
					    if (row.estRetrieveTime) {
						row.estRetrieveTime = row.estRetrieveTime.substring(0, 10);
					    }
					    if (row.isSettled == 0) {
						row.settlementStatus = "待结算";
					    }
					    if (row.isSettled == 1) {
						row.settlementStatus = "已结算";
					    }
					    row.statusStr = dict.TASK_STATUS[row.status];
					    if (row.productIds && row.productIds != 0) {
						row.mainProducts = '<a href="#" class="bind bind-click" bind-method="mainProductsDetail" productIds = '
							+ row.productIds + ' >查看</a>';
					    }
					    row.idStr = row.id;
					    var op = '';

					    // op += '<a href="#" class="bind
					    // bind-click permission"
					    // code="task_my_task_task_detail"
					    // bind-method="taskDetail"
					    // rl='+_rl+' task_id=
					    // "{{id}}">详情</a>';
					    op += '<a href="#" class="bind bind-click" bind-method="taskDetail" rl='
						    + _rl + ' task_id= "{{id}}">详情</a>';

					    row.op = core.render(row, op);
					});
			return resp.result.list;
		    }

		},
	    },
	    "bSort" : false,
	    drawCallback : function(e) {
		$('.J_DoCopy').each(function(index, that) {
		    $(that).click(function(ev) {
			var oEvent = ev || event;
//			console.log(oEvent.clientX + "--" + oEvent.clientY);
			var url = $(that).attr("url");
			var transfer = document.getElementById('J_CopyTransfer');
			if (!transfer) {
			    transfer = document.createElement('textarea');
			    transfer.id = 'J_CopyTransfer';
			    transfer.style.position = 'fixed';
			    // transfer.style.display = 'none';
			    transfer.style.left = '-99999px';
			    transfer.style.top = '-99999px';
			    document.body.appendChild(transfer);
			}
			transfer.value = url;
			transfer.focus();
			transfer.select();
			document.execCommand('Copy', false, null);
			// core.alert("复制成功");
		    });
		})
	    }
	};
	window.myTaskListTable = core.dataTable("tb-my-task-list", tableConfig);
    }
    task.publicAccountInfoList = function(dict, data) {
	accountInfoList(dict);
    }

    task.drTaskListSearch = function(that, data) {
//	console.log("task.drTaskListSearch--->>[data]" + JSON.stringify(data));
	window.drTaskListTable.ajax.reload();
    }

    function accountInfoList(dict) {
		var tableConfig = {
		    "ajax" : {
			url : "/daren-web/task/accountInfoList/",
			type : "post",
			dataSrc : function(resp) {
			    if (resp.status != 0) {
				core.alert(resp.msg);
			    } else {
					var result = resp.result;
		
					var taskCount = result;
					var accountInfo = result.taskList;
					
					if (taskCount.waitDeliveryArticle != 0) {
					    var list = taskCount.waitDeliveryArticle;
					    var info = list.split('|');
					    var count;
					    var taskId;
					    $.each(info, function() {
						count = info[0];
						taskId = info[1];
					    })
					    $('#waitDeliveryArticle').html("1.待回稿:"+count);
					    $('#waitDeliveryArticleTaskIds').val(taskId);
					} else {
					    $('#waitDeliveryArticle').html("1.待回稿:0");
					    $('#waitDeliveryArticle').attr("disabled", true);
					    $("#waitDeliveryArticle").css("pointer-events", "none");
					}
					if (taskCount.waitAuditArticle != 0) {
					    var list = taskCount.waitAuditArticle;
					    var info = list.split('|');
					    var count;
					    var taskId;
					    $.each(info, function() {
						count = info[0];
						taskId = info[1];
					    })
					    $('#waitAuditArticle').html("2.待审核:"+count);
					    $('#waitAuditArticleTaskIds').val(taskId);
					} else {
					    $('#waitAuditArticle').html("2.待审核:0");
					    $('#waitAuditArticle').attr("disabled", true);
					    $("#waitAuditArticle").css("pointer-events", "none");
					}
					if (taskCount.waitEntryEffect != 0) {
					    var list = taskCount.waitEntryEffect;
					    var info = list.split('|');
					    var count;
					    var taskId;
					    $.each(info, function() {
						count = info[0];
						taskId = info[1];
					    })
					    $('#waitEntryEffect').html("3.待回填成效:"+count);
					    $('#waitEntryEffectTaskIds').val(taskId);
					} else {
					    $('#waitEntryEffect').html("3.待回填成效:0");
					    $('#waitEntryEffect').attr("disabled", true);
					    $("#waitEntryEffect").css("pointer-events", "none");
					}
					if (taskCount.waitAuditEffect != 0) {
					    var list = taskCount.waitAuditEffect;
					    var info = list.split('|');
					    var count;
					    var taskId;
					    $.each(info, function() {
						count = info[0];
						taskId = info[1];
					    })
					    $('#waitAuditEffect').html("4.待AE审核:"+count);
					    $('#waitAuditEffectTaskIds').val(taskId);
					} else {
					    $('#waitAuditEffect').html("4.待AE审核:0");
					    $('#waitAuditEffect').attr("disabled", true);
					    $("#waitAuditEffect").css("pointer-events", "none");
					}
					if (taskCount.waitSettle != 0) {
					    var list = taskCount.waitSettle;
					    var info = list.split('|');
					    var count;
					    var taskId;
					    $.each(info, function() {
						count = info[0];
						taskId = info[1];
					    })
					    $('#waitSettle').html("5.待结算:"+count);
					    $('##waitSettleTaskIds').val(taskId);
					} else {
					    $('#waitSettle').html("5.待结算:0");
					    $('#waitSettle').attr("disabled", true);
					    $("#waitSettle").css("pointer-events", "none");
					}
					
					var accountInfoHtml = '';
					core.fixAcc(accountInfo,function(row) {
						    var _rl = row.resourceLocation;
						    if (row.estRetrieveTime) {
							row.estRetrieveTime = row.estRetrieveTime.substring(0, 10);
						    }
		
						    row.resourceLocationStr = dict.RESOURCE_LOCATION[row.resourceLocation];
						    if (row.platform) {
							row.platformStr = dict.WE_MEDIA_PLATFORM[row.platform];
						    }
						    if (row.estRetrieveTime) {
							row.estRetrieveTime = row.estRetrieveTime.substring(0, 10);
						    }
						    if (row.isSettled == 0) {
							row.settlementStatus = "待结算";
						    }
						    if (row.isSettled == 1) {
							row.settlementStatus = "已结算";
						    }
						    row.statusStr = dict.TASK_STATUS[row.status];
						    if (row.productIds && row.productIds != 0) {
							row.mainProducts = '<a href="#" class="bind bind-click" bind-method="mainProductsDetail" productIds = '
								+ row.productIds + ' >查看</a>';
						    } else {
							row.mainProducts = "无商品";
						    }
						    row.idStr = row.id;
						    var op = '';
						    op += '<a href="#" class="bind bind-click" bind-method="taskDetail" rl=' + _rl
							    + ' task_id= "{{id}}">详情</a>';
		
						    row.op = core.render(row, op);
		//				    console.log("accountInfo[row]--->>" + JSON.stringify(row));
						    accountInfoHtml += accountInfoListTemp(row);
						});
						$('#tb-dr-task-list tbody').html(accountInfoHtml);
						return resp.result.taskList.list;
				    }
			    },
		    },
//		    "paging" : true,
//		    "info" : false
		}
		window.drTaskListTable = core.dataTable("tb-dr-task-list", tableConfig);
    }

    task.taskDetail = function(that, dic) {
		var taskId = that.attr("task_id");
		var resourceLocation = that.attr("rl");
		core.toggle(taskDetailTemp({
		    "taskId" : taskId,
		    "resourceLocation" : resourceLocation
		}));
		if (dic == null) {
		    dic = dict;
		}
		getTaskDetail(taskId, dic);
    };

    function getTaskDetail(taskDetailId, dict) {
	core.ajax({
		    url : "/daren-web/task/detail/" + taskDetailId,
		    type : "post",
		    success : function(resp) {
			var result = resp.result;
			taskDetailInfo = result;
			var taskEffectInfo = result.taskEffectInfo;
			var resources = result.resources;
			var taskEffectInfoAuditLog = result.taskEffectInfoAuditLog;
			var resourseListHtml = '', taskEffectInfoAuditLogHtml = '';

			if (taskEffectInfo == null) {
			    $("#entryEffect").attr("disabled", true).attr("style", "display:none;");
			    $("#deliveryArticle").attr("disabled", false).attr("style", "display:block;");

			} else {
			    $("#entryEffect").attr("disabled", false).attr("style", "display:block;").attr("effectId",
				    taskEffectInfo.id);
			    $("#deliveryArticle").attr("disabled", true).attr("style", "display:none;");
			}

			resources.map(function(row) {
//			    console.log("getTaskDetail[row]--->>" + JSON.stringify(row));
			    row.idStr = row.id;
			    if (row.postTimeFrom && row.postTimeTo) {
				row.postTime = row.postTimeFrom.substring(0, 10) + " -- "
					+ row.postTimeTo.substring(0, 10);
			    }
			    if (row.upTime) {
				row.upTime = row.upTime.substring(0, 10);
			    }
			    row.resourceLocation = dict.RESOURCE_LOCATION[row.resourceLocation];
			    var commissionLinks = "";
			    if (row.commissionLinks && row.commissionLinks.length > 0) {
				for (var i = 0; i < row.commissionLinks.length; i++) {
				    var link = row.commissionLinks[i];
				    commissionLinks += link.link + "\r\n";
				}
			    }
			    row.commissionLink = commissionLinks;
			    var mainProducts = "";
			    if (row.products && row.products.length > 0) {
				for (var i = 0; i < row.products.length; i++) {
				    var product = row.products[i];
				    if (i > 0) {
					mainProducts += "---------------------------------------------<br>";
				    }
				    if (product.name)
					mainProducts += "商品名称：" + product.name + "<br>";
				    if (product.productUrl)
					mainProducts += "商品链接：" + product.productUrl + "<br>";
				    if (product.picUrl)
					mainProducts += "白底图链接：" + product.picUrl + "<br>";
				    if (product.salesPoint)
					mainProducts += "卖点：" + product.salesPoint + "<br>";
				    if (product.remark)
					mainProducts += "商品备注：" + product.remark + "<br>";
				}
			    } else {
				mainProducts = row.mainProducts;
			    }
			    row.mainProducts = mainProducts;
			    row.statusStr = dict.RESOURCE_ITEM_STATUS[row.status];
			    resourseListHtml += taskResourceListTemp(row)
			});
			$('#tb-task-resource-item-list tbody').html(resourseListHtml);
			taskTooltip();

			if (taskEffectInfoAuditLog != null && taskEffectInfoAuditLog.length > 0) {
			    var status = taskEffectInfoAuditLog[0].auditStatus;
			    if (status == 3) {
				$('#entryEffect').html("修改成效");
				$('#entryEffect').attr("effectId", taskEffectInfo.id);
			    }
			}

			taskEffectInfoAuditLog.map(function(row) {
				    var img = '';
				    if(row.effectFileUrls){
					    row.effectFileUrls.map(function(url) {
							img += '<img class="auditLogImg" src="'+ url+ '" style="max-width: 40px;max-height:40px;margin-right: 10px;border:1px solid black;cursor:pointer;"/>'
					    });
				    }
				    if (row.createDate) {
					row.createDate = row.createDate.substring(0, 10);
				    }
				    if (row.collectTime) {
					row.collectTime = row.collectTime.substring(0, 10);
				    }
				    if (row.retrieveMethod) {
					row.retrieveMethodStr = dict.MEDIA_EFFECT_RETRIEVE_METHOD[row.retrieveMethod];
				    }
				    
				    taskEffectInfoAuditLogHtml += '<tr>';
				    taskEffectInfoAuditLogHtml += '<td>' + row.createTime + '</td><td>' + row.username + '</td><td>' + row.pv + '</td><td>' + row.uv + '</td>';
				    taskEffectInfoAuditLogHtml += '<td>' + row.interactions + '</td><td>'+ row.comments + '</td><td>' + row.praises + '</td><td>'+ row.retransmissions + '</td><td>' + row.collectTime + '</td>';
				    taskEffectInfoAuditLogHtml += '<td>' + img + '</td><td>' + row.articleStatusStr+ '</td>';
				    taskEffectInfoAuditLogHtml += '<td><span id="span_ArticleUrl_'+row.id+'" style="display:none">'+row.articleUrl+'<br></span>';
				    taskEffectInfoAuditLogHtml += '<a data-toggle="tooltip" data-placement="top" title="'+row.articleUrl+'" data-html="true" class="bind bind-click" bind-method="showArticleUrl" logId="'+row.id+'">详情</a>';
				    taskEffectInfoAuditLogHtml += '</td>';
				    
				    taskEffectInfoAuditLogHtml += '<td>'+ row.retrieveMethodStr + '</td><td>' + row.auditStatusStr + '</td><td>'+ row.auditRemark + '</td>';
				    taskEffectInfoAuditLogHtml += '</tr>';
				});
			$('#tb-task-effect-info-audit-log-list tbody').html(taskEffectInfoAuditLogHtml);
			taskTooltip();
			$('#taskId').html(result.id);
			var statusStr2 = dict.TASK_STATUS[result.status];
			if (result.failRemark && result.failRemark.length > 0) {
			    statusStr2 += "[" + result.failRemark + "]";
			}
			$('#statusStr').html(statusStr2);
			$('#aeName').html(result.aeName);
			if (result.estRetrieveTime) {
			    $('#estRetrieveTime').html(result.estRetrieveTime.substring(0, 10));
			}
			var resourceLocationStr = dict.RESOURCE_LOCATION[result.resourceLocation];
			$('#resourceLocation').html(resourceLocationStr);
			$('#drFee').html(result.drFee);
			$('#drName').html(result.drName);
			$('#remark').html(result.remark);

			if (taskEffectInfo != null) {
			    $('#articleStatusStr').html(taskEffectInfo.articleStatusStr);
			    $('#articleTitle').html(taskEffectInfo.articleTitle);
			    $('#articleUrl').html(taskEffectInfo.articleUrl);
			    if(taskEffectInfo.pv==0){
			    	$('#effectInfoHtml').remove();
			    }
			    $('#pv').html(taskEffectInfo.pv);
			    $('#uv').html(taskEffectInfo.uv);
			    $('#interactions').html(taskEffectInfo.interactions);
			    $('#comments').html(taskEffectInfo.comments);
			    $('#praises').html(taskEffectInfo.praises);
			    $('#retransmissions').html(taskEffectInfo.retransmissions);
			}else{
				$('#articleInfoHtml').remove();
				$('#effectInfoHtml').remove();
			}

			core.listenClick();
			// 要放在core.listenClick后面
		    }
		});
    }
    function taskTooltip() {
	$('[data-toggle="tooltip"]').tooltip();
    }

    function getEffectInfo(effectId, dict) {
	core.ajax({
	    url : "/daren-web/task/getEffectInfo/" + effectId,
	    type : "post",
	    success : function(resp) {
		if (resp.status != 0) {
		    core.alert(resp.msg);
		} else {
		    var effect = resp.result;
		    if (effect) {
			if (effect.collectTime && effect.collectTime.length >= 10) {
			    effect.collectTime = effect.collectTime.substring(0, 10);
			}
			if (effect.issueDate && effect.issueDate.length >= 10) {
			    effect.issueDate = effect.issueDate.substring(0, 10);
			}
			if (effect.effectFile) {
			    var $imgWrapper = $('#imgEffectWrapper');
			    var img = effect.effectFile.split('|');
			    for (var i = 0; i < img.length; i++) {
				html = '<li><img src="' + img[i] + '" f="' + img[i]
					+ '"/><a href="javascript:void(0);" class="deleteImg"> × </a></li>';
				$imgWrapper.append(html);
			    }
			}
			if (effect.images) {
			    var $imgWrapper = $('#imgArticleWrapper');
			    var img = effect.images.split('|');
			    for (var i = 0; i < img.length; i++) {
				html = '<li><img src="' + img[i] + '" f="' + img[i]
					+ '"/><a href="javascript:;" class="deleteImg"> × </a></li>';
				$imgWrapper.append(html);
			    }
			}

			core.initForm("entryEffect-form", effect);
			core.initForm("article-form", effect);
		    }
		}
	    }
	});
    }

    task.entryEffect = function(that, dic) {
		var taskId = that.attr("taskId");
		var effectId = that.attr("effectId");
		core.modal("entry_effect", entryEffectTemp({
		    "taskId" : taskId,
		    "effectId" : effectId
	}));
	if (dic != null) {
	    dict = dic;
	}
	getEffectInfo(effectId, dict);
	$(".exampleImg").hoverPreview({
	    width : '180px',
	    backgroundColor : 'white'
	});
    }
    task.submitEffectImages = function() {
//	console.log($('#effectFile').val());
	if (!$('#effectFile').val()) {
	    core.alert('请选择成效图片');
	    return;
	}
	var $imgWrapper = $('#imgEffectWrapper')
	if ($imgWrapper.find('li').length >= 5) {
	    core.alert('最多上传5张图片');
	    return;
	}
	$("#effectFileForm").ajaxSubmit(
		{
		    url : '/daren-web/upload/uploadEffectImg',
		    type : "post",
		    success : function(data) {
			if (data.status === 0) {
			    var html = '';
			    html = '<li><img src="' + data.result + '" f="' + data.result
				    + '"><a href="javascript:;" class="deleteImg"> × </a></li>';
			    $imgWrapper.append(html);
			}
		    },
		    error : function(data) {
			if (data && data.msg) {
			    core.failure(data.msg);
			} else {
			    core.failure("上传失败！");
			}
		    },
		    clearForm : true,
		    timeout : 10000
		});
    }
    task.submitArticleImages = function() {
//	console.log($('#articleFile').val());
	if (!$('#articleFile').val()) {
	    core.alert('请选择回稿图片');
	    return;
	}
	var $imgWrapper = $('#imgArticleWrapper')
	if ($imgWrapper.find('li').length >= 5) {
	    core.alert('最多上传5张图片');
	    return;
	}
	$("#articleFileForm").ajaxSubmit(
		{
		    url : '/daren-web/upload/uploadArticleImg',
		    type : "post",
		    success : function(data) {
			if (data.status === 0) {
			    var html = '';
			    html = '<li><img src="' + data.result + '" f="' + data.result
				    + '"><a href="javascript:;" class="deleteImg"> × </a></li>';
			    $imgWrapper.append(html);
			}
		    },
		    error : function(data) {
			if (data && data.msg) {
			    core.failure(data.msg);
			} else {
			    core.failure("上传失败！");
			}
		    },
		    clearForm : true,
		    timeout : 10000
		});
    }
    task.submitEntryEffect = function(that, data) {
		var articleImgs = [];
		var effectImgs = [];
		$('#imgArticleWrapper li').map(function(index, target) {
		    articleImgs.push($(target).find('img').attr('src'))
		});
		$('#imgEffectWrapper li').map(function(index, target) {
		    effectImgs.push($(target).find('img').attr('src'))
		});
		data.images = articleImgs.join('|'); // 拼接几张图片，用竖线分隔，如：http://www.baidu.com|http://www.163.com
		data.effectFile = effectImgs.join('|'); // 拼接几张图片，用竖线分隔，如：http://www.baidu.com|http://www.163.com
		data.id = data.id || 0;
		core.ajax({
		    url : "/daren-web/task/entryEffect",
		    type : "post",
		    data : data,
		    success : function(resp) {
			core.closeModal("entry_effect");
			core.success("提交成功");
			window.myTaskListTable.ajax.reload(null, false);
			getTaskDetail(data.taskId);
		    },
		    error : function(resp){
		    	core.closeModal("entry_effect");
		    	core.alert(resp.msg);
		    }
		    
		});
    };
    function autoList(){
    	var tableConfig = {
    		    "ajax" : {
    			url : "/daren-web/task/getAutoDeliveryArticle/",
    			type : "post",
    			dataSrc : function(resp) {
    			    if (resp.status != 0) {
    			    	core.alert(resp.msg);
    			    } else {
    				core.fixResp(resp,function(row) {
    						    if (row.platform) {
    							row.platformStr = dict.WE_MEDIA_PLATFORM[row.platform];
    						    }
    						    if (row.lastUpdateTime) {
    							row.lastUpdateTime = row.lastUpdateTime.substring(0, 10);
    						    }
    						    var op = '';
    	
    						    if (row.waitFee) {
    							op += '<a href="#" class="bind bind-click" bind-method="entryEffect" taskId= "{{id}}"  effectId= "{{effectId}}">详情</a> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;';
    						    }
    	
    						    op += '<a href="#" class="bind bind-click" bind-method="autoDeliveryArticle" data-darenId="{{darenId}}" data-token="{{token}}" >智能回填数据</a>';
    	
    						    row.op = core.render(row, op);
    						    core.listenClick();
    						    // 要放在core.listenClick后面
    	
    						});
    				return resp.result;
    			    }
    			},
    		    },
    		    "paging" : false,
    		    "info" : false,
    	};

    	window.autoList = core.dataTable("tb-auto-list", tableConfig);
    }
    
    task.getAutoDeliveryArticle = function(that, dic) {
		if (dic != null) {
		    dict = dic;
		};
		core.modal("auto_delivery_article", autoDeliveryArticleTemp());
		var tableConfig = {
		    "ajax" : {
			url : "/daren-web/task/getAutoDeliveryArticle/",
			type : "post",
			dataSrc : function(resp) {
			    if (resp.status != 0) {
				core.alert(resp.msg);
			    } else {
				core
					.fixResp(
						resp,
						function(row) {
						    if (row.platform) {
							row.platformStr = dict.WE_MEDIA_PLATFORM[row.platform];
						    }
						    if (row.lastUpdateTime) {
							row.lastUpdateTime = row.lastUpdateTime.substring(0, 10);
						    }
						    var op = '';
	
						    if (row.waitFee) {
							op += '<a href="#" class="bind bind-click" bind-method="entryEffect" taskId= "{{id}}"  effectId= "{{effectId}}">详情</a> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;';
						    }
	
						    op += '<a href="#" class="bind bind-click" bind-method="autoDeliveryArticle" data-darenId="{{darenId}}" data-token="{{token}}" >智能回填数据</a>';
	
						    row.op = core.render(row, op);
						    core.listenClick();
						    // 要放在core.listenClick后面
	
						});
				return resp.result;
			    }
			},
		    },
		    "paging" : false,
		    "info" : false,
	};

	window.autoDeliveryListTable = core.dataTable("tb-auto-delivery-article-list", tableConfig);
    };

    task.deliveryArticle = function(that, dic) {
		var taskId = that.attr("taskId");
		if (dic != null) {
		    dict = dic;
		};
		core.modal("delivery_article", deliveryArticleTemp({
		    "taskId" : taskId
		}));
    };
    task.submitImages = function() {
		// console.log($('#file').val());
		if (!$('#file').val()) {
		    core.alert('请选择图片');
		    return;
		}
		var $imgWrapper = $('.imgWrapper')
		if ($imgWrapper.find('li').length >= 5) {
		    core.alert('最多上传5张图片');
		    return;
		}
	
		if (!isSendImg) {
		    core.uploadImage("file", "fileForm");
		    isSendImg = false;
		}
    }
	
    task.submitDeliveryArticle = function(that, data) {
		var image = [];
		$('.imgWrapper li').map(function(index, target) {
		    image.push($(target).find('img').attr('src'))
		});
		data.images = image.join('|'); // 拼接几张图片，用竖线分隔，如：http://www.baidu.com|http://www.163.com
		data.id = data.id || 0;
		core.ajax({
		    url : "/daren-web/task/deliveryArticle",
		    type : "post",
		    data : data,
		    success : function(resp) {
				core.success("提交成功");
				core.closeModal("delivery_article");
				window.myTaskListTable.ajax.reload(null, false);
				getTaskDetail(data.taskId);
		    },
		    error : function(resp) {
				core.closeModal("delivery_article");
				core.alert(resp.msg);
		    }
		});
    };

    // 批量回收稿件
    task.batchReceiveArticle = function(that, data) {
	core.modal("batchReceiveArticle", batchReceiveArticleTemp());
    }

    task.submitBatchReceiveArticleExcel = function(that, data) {
	var filePath = $("#batchReceiveArticle #excelFile").val();
	if (!filePath || filePath.length == 0) {
	    core.warning("请选择文件");
	} else {
	    var size = $("#batchReceiveArticle #excelFile")[0].files[0].size;
//	    console.log("submitBatchReceiveArticleExcel--->>[size]" + size);
	    // 文件大小是否符合要求 20971520
	    if (size > 20971520) {
		core.warning("文件大小超出限制，文件不能超过20M");
	    } else {
		core.confirm("批量回收稿件?", function() {
		    $("#batchReceiveArticle #excelFileForm").ajaxSubmit({
			url : '/daren-web/task/batchReceiveArticleExcel',
			type : "post",
			success : function(data) {
			    if (data.status === 0) {
				if (data.result && data.result.length > 0) {
				    var rst = "";
				    for (var i = 0; i < data.result.length; i++) {
					rst += "<p>" + (i + 1) + ":" + data.result[i] + "</p>";
				    }
				    core.modal("noticeDiv", noticeTemp());
				    $("#noticeMsg").html(rst);
				    // core.success("批量导入完成,失败记录如下:"+rst);
				} else {
				    core.success("导入成功");
				}
				core.closeModal("batchReceiveArticle");
				window.myTaskListTable.ajax.reload(null, false);
			    } else {
				core.failure("导入失败");
			    }
			},
			error : function(data) {
			    if (data && data.msg) {
				core.failure(data.msg);
			    } else {
				core.failure("上传出错了！");
			    }
			},
			clearForm : true,
			timeout : 30000
		    });
		});
	    }

	}
    }

    task.submitBatchReceiveArticleImgs = function(that, data) {
	var filePath = $("#batchReceiveArticle #imgsFile").val();
	if (!filePath || filePath.length == 0) {
	    core.warning("请选择文件");
	} else {
	    var size = $("#batchReceiveArticle #imgsFile")[0].files[0].size;
//	    console.log("submitBatchReceiveArticleImgs--->>[size]" + size);
	    // 文件大小是否符合要求 20971520
	    if (size > 20971520) {
		core.warning("文件大小超出限制，文件不能超过20M");
	    } else {
		core.confirm("确认上传图片?", function() {
		    $("#batchReceiveArticle #imgFileForm").ajaxSubmit({
			url : '/daren-web/task/batchReceiveArticleImgs',
			type : "post",
			success : function(data) {
			    if (data.status === 0) {
				if (data.result && data.result.length > 0) {
				    var rst = "";
				    for (var i = 0; i < data.result.length; i++) {
					rst += "<p>" + (i + 1) + ":" + data.result[i] + "</p>";
				    }
				    core.modal("noticeDiv", noticeTemp());
				    $("#noticeMsg").html(rst);
				    // core.success("批量导入完成,失败记录如下:"+rst);
				} else {
				    core.success("导入成功");
				}
				core.closeModal("batchReceiveArticle");
				window.myTaskListTable.ajax.reload(null, false);
			    } else {
				core.failure("导入失败");
			    }
			},
			error : function(data) {
			    if (data && data.msg) {
				core.failure(data.msg);
			    } else {
				core.failure("上传出错了！");
			    }
			},
			clearForm : true,
			timeout : 30000
		    });
		});
	    }

	}
    }

    task.mainProductsDetail = function(that) {
	var pid = that.attr("productIds");
	var tableConfig = {
	    "ajax" : {
		url : "/daren-web/task/getMainProductsById/" + pid,
		dataSrc : function(resp) {
		    if (resp.status != 0) {
			core.alert(resp.msg);
		    } else if (resp.result.length == 0) {
			core.alert("无主推商品");
			core.closeModal("main_products");
		    } else {
			return resp.result;
		    }
		}
	    },
	    paging : false
	};
	core.modal("main_products", mainProductsTemp({
	    "id" : pid
	}));
	window.mpTable = core.dataTable("tb-main-product-list", tableConfig);
    }

    task.showMainProducts = function(that) {
	var resourceItemId = that.attr("resource_item_id");
	$("#span_MainProduct_" + resourceItemId).toggle();
    };
    task.showArticleUrl = function(that) {
	var logId = that.attr("logId");
	$("#span_ArticleUrl_" + logId).toggle();
    };
    task.showRemark = function(that) {
	var resourceItemId = that.attr("resource_item_id");
	$("#span_Remark_" + resourceItemId).toggle();
    };
    
    task.taskListSearchExport = function(that, data) {
	var action = "/daren-web/task/export";
	core.exportAction(that, data, action);
    };

    $('body').on('click', '.imgWrapper .deleteImg,.auditLogImg', function() {
	if ($(this).hasClass('auditLogImg')) {
	    core.modal("largeImgWrapper", largeImgWrapperTemp());
	    $('#largeImg').attr('src', $(this).attr('src'));
	}
	if ($(this).hasClass('deleteImg')) {
		 $(this).closest('li').remove();
	}
    });

    return task;
});