/**
 * 
 */

define(function(require) {
    jQuery.browser = {};
    jQuery.browser.msie = false;
    jQuery.browser.version = 0;
    if (navigator.userAgent.match(/MSIE ([0-9]+)\./)) {
	jQuery.browser.msie = true;
	jQuery.browser.version = RegExp.$1;
    }
    var jqform = require("jqform");
    var core = require("core");
    var dataUtil = require("common/data");

    var addDarenInfoTemp = require("templates/daren/add_daren_info");
    var modifyDarenInfoTemp = require("templates/daren/modify_daren_info");
    var modifyDarenResourceTemp = require("templates/daren/modify_daren_resource");
    var drTbodyResourceListTemp = require("templates/daren/dr_resource_list_data");
    var setIncludingTaxModalTemp = require("templates/daren/set_including_tax");

    var dict;
    function daren() {

    }

    daren.init = function(page, data) {
	dict = data.dict;
	if (page === "dr_list") {
	    core.setDic("searchMediaPlatform", dict.WE_MEDIA_PLATFORM);
	    core.setDic("searchResourceType", dict.RESOURCE_LOCATION);
	    $("#searchMediaPlatform").prepend("<option value='0' >请选择</option>");
	    $("#searchResourceType").prepend("<option value='0' >请选择</option>");
	    mediaDarenList();
	}
    };
    
    daren.mediaDarenPageSearch = function(that,data){
	window.mediaDarenPageTab.ajax.reload();
    }

    function mediaDarenList() {
	var tableConfig = {
	    "ajax" : {
		url : "/daren-web/daren/getDarenPager",
		dataSrc : function(resp) {
		    if (resp.status != 0) {
			core.alert(resp.msg);
		    } else {
			core.fixResp(resp, function(row) {
			    row.platformStr = dict.WE_MEDIA_PLATFORM[row.platform];
			    row.accountTypeStr = dict.ACCOUNT_TYPE[row.accountType];
			    row.accountTypeStr = dataUtil.isEmpty(row.accountTypeStr)?'未设置':row.accountTypeStr;
			    row.domainStr = dict.DR_DOMAIN[row.domain];
			    row.statusStr = dict.DREN_STATUS[row.status];
			    row.auditStatusStr = dict.MEDIA_AUDIT_STATUS[row.auditStatus];
			    row.levelStr = dict.DR_LEVEL[row.level];
			    row.op = "<a class='bind bind-click' bind-method='openModifyDrInfoModal' data-diid='"+row.id+"'>修改</a><br>";
			    row.op+="<a class='bind bind-click' bind-method='openDarenResourceManagerModalForClick' data-diid='"+row.id+"'>管理渠道报价</a><br>";
			});
			return resp.result.list;
		    }

		},
	    },
	    "bSort" : false,
	    drawCallback : function(e) {
	    }
	};
	window.mediaDarenPageTab = core.dataTable("media-daren-list-tab", tableConfig);
    }

    daren.openModifyDrInfoModal = function(that) {
	core.ajax({
	    url : "/daren-web/daren/getDarenInfoDetail",
	    data : {
		diId : $.trim($(that).data("diid"))
	    },
	    type : "post",
	    success : function(resp) {
		core.modal("modify_daren_info", modifyDarenInfoTemp(resp.result));
		core.setDic("platform", dict.WE_MEDIA_PLATFORM, resp.result.platform);
		core.setDic("resourceType", dict.RESOURCE_LOCATION, resp.result.articleChannel);
		$("#platform").prepend("<option value='0' >请选择</option>");
		$("#resourceType").prepend("<option value='0' >请选择</option>");
	    }
	});
    }

    daren.submitModifyDrInfo = function(that, data) {
	core.ajax({
	    url : "/daren-web/daren/modifyMediaDarenInfo",
	    data : data,
	    type : "post",
	    success : function(resp) {
		if (parseInt(resp.result) > 0) {
		    core.success("更新成功");
		    // window.drMediaRegInfoLogTable.ajax.reload(null, false);
		    return;
		}
		core.success("更新失败");
	    }
	});
    }

    daren.openAddDrInfoModal = function(that) {
	core.modal("add_daren_info", addDarenInfoTemp());
	core.setDic("add_daren_info_platform", dict.WE_MEDIA_PLATFORM);
	core.setDic("add_daren_info_resourceType", dict.RESOURCE_LOCATION);
	$("#add_daren_info_platform").prepend("<option value='0' >请选择</option>");
	$("#add_daren_info_resourceType").prepend("<option value='0' >请选择</option>");
    }

    daren.submitDrInfo = function(that, data) {
	core.ajax({
	    url : "/daren-web/daren/addDaren",
	    data : data,
	    type : "post",
	    success : function(resp) {
		if (resp.result) {
		    core.closeModal("add_daren_info");
		    // window.drMediaRegInfoLogTable.ajax.reload(null, false);
		    $.extend(resp.result, {
			platformStr : dict.WE_MEDIA_PLATFORM[resp.result.platform],
			articleChannelStr : dict.RESOURCE_LOCATION[resp.result.resourceType]
		    });
		    openDarenResourceManagerModal(resp.result);
		    return;
		}
		core.success("新增失败");
	    }
	});
    }

    /** **************添加渠道相关************************** */

    function bindDrenResourceData(drId) {
	core.ajax({
	    url : "/daren-web/daren/resource_list/" + drId,
	    success : function(resp) {
		var datas = resp.result;
		var html = "";
		for ( var i in datas) {
		    if (datas[i].expiryDate) {
			datas[i].expiryDateStr = datas[i].expiryDate.substring(0, 10);
		    }
		    if (datas[i].resourceType) {
			datas[i].resourceTypeStr = dict.RESOURCE_LOCATION[datas[i].resourceType];
		    }
		    html += drTbodyResourceListTemp(datas[i]);
		}
		$("#detail-tbody-dr-media-list").append(html);
		$("#detail-tbody-dr-media-list input[id^='ipt_expiry_date_']").each(function() {
		    var dipt = $(this).attr("id");
		    core.initDatePicker(dipt);
		});
		core.listenClick();
	    }
	});
    }

    daren.deleteDrenResource = function(that) {
	core.confirm("确定删除该达人渠道?", function() {
	    var id = that.attr("id");
	    core.ajax({
		url : "/daren-web/daren/resource_delete",
		data : {
		    id : id
		},
		type : "post",
		success : function(resp) {
		    if (resp.status == 0) {
			$("#dren_resource_" + id).remove();
			core.success("删除成功！");
		    } else {
			core.warning(resp.msg);
		    }

		}
	    });
	});
    };

    daren.openDarenResourceManagerModalForClick = function(that) {
	var diid = $(that).data("diid");
	core.ajax({
	    url : "/daren-web/daren/getDarenInfoDetail",
	    data : {
		diId : diid
	    },
	    type : "post",
	    success : function(resp) {
		$.extend(resp.result, {
		    platformStr : dict.WE_MEDIA_PLATFORM[resp.result.platform],
		    articleChannelStr : dict.RESOURCE_LOCATION[resp.result.articleChannel]
		});
		openDarenResourceManagerModal(resp.result);
	    }
	});
    }

    function openDarenResourceManagerModal(drInfo) {
	core.ajax({
	    url : "/daren-web/daren/getCurrentUserRegInfo",
	    type : "post",
	    success : function(resp) {
		$.extend(drInfo, {
		    includingTax : resp.result.includingTax,
		    includingTaxStr : dict.INCLUDING_TAX[resp.result.includingTax],
		    pinfo : resp.result.id
		});
		core.modal("modify_daren_resource_modal", modifyDarenResourceTemp(drInfo));
		bindDrenResourceData(drInfo.id);
		// 检查是否设置税费类型
		if (resp.result.includingTax == 0) {
		    core.modal("set_including_tax_modal", setIncludingTaxModalTemp(resp.result));
		}
	    }
	});
    }

    daren.addDrenResource = function(that) {
	var drId = that.attr("drId");
	core.modal("add_dr_resource", addDrenResourceTemp({
	    drId : drId
	}));
	core.setDic("add_resourceType", dict.RESOURCE_LOCATION);
	core.initDatePicker("add_dr_expiryDate");
	core.listenClick();
    };

    var batchResourceLineNo = 0;
    daren.addDrenResourceNewLine = function(that) {
	$("tr[id^='dren_resource_']").each(function() {
	    batchResourceLineNo++;
	});
	var obj = {
	    lineNo : batchResourceLineNo
	};
	var drName = that.attr("drName");
	var tpl = $("#add_dren_resource_batch_tpl").html();
	tpl = tpl.replaceAll("REPLACE_LINENO", "L_" + batchResourceLineNo).replaceAll("REPLACE_DREN_NAME", drName);
	var html = core.render(obj, tpl);
	$("#detail-tbody-dr-media-list").append(html);
	initDrenResourceBatchInput();
	core.listenClick();
    };

    daren.delDrenResourceLine = function(that) {
	var lineNo = that.attr("line_no");
	if (lineNo) {
	    $("#dren_resource_" + lineNo).remove();
	}

    }

    function initDrenResourceBatchInput() {
	$("select[id^='ipt_resource_type_']").each(function() {
	    var sel = $(this).val();
	    core.setDic($(this).attr("id"), dict.RESOURCE_LOCATION, sel);
	});
	$("input[id^='ipt_expiry_date_']").each(function() {
	    core.initDatePicker($(this).attr("id"));
	});
    }

    daren.batchEditDrenResource = function(that) {
	var flag = true;
	var resourceLocations = [];
	$("tr[id^='dren_resource_']").each(function() {
	    var rid = $(this).attr("rid");
	    if (rid == 0) {
		// 新增
		rid = $(this).attr("lineno");
		var resourceLocation = $("#ipt_resource_type_" + rid).val();
		if (!resourceLocation || resourceLocation == 0) {
		    core.warning("渠道必填");
		    flag = false;
		} else {
		    if (resourceLocations.length > 0 && resourceLocations.indexOf(resourceLocation) >= 0) {
			core.warning("渠道重复了");
			flag = false;
		    } else {
			resourceLocations.push(resourceLocation);
		    }
		}
	    } else {
		var resourceLocation = $("#ipt_resource_type_" + rid).attr("value");
		if (resourceLocations.length > 0 && resourceLocations.indexOf(resourceLocation) >= 0) {
		    core.warning("渠道重复了");
		    flag = false;
		} else {
		    resourceLocations.push(resourceLocation);
		}
	    }
	});
	if (flag) {
	    core.confirm("批量修改达人报价数据？", function() {
		// 批量修改达人资源
		var resources = getDrenBatchResource();
//		console.log("media.batchEditDrenResource--->>[resources]" + JSON.stringify(resources));
		if (resources && resources.length > 0) {
		    core.ajax({
			url : "/daren-web/daren/resource_batch_save",
			data : {
			    "drId" : that.attr("drId"),
			    "resourceStr" : JSON.stringify(resources)
			},
			type : "post",
			success : function(resp) {
			    if (resp.status === 0) {
				core.success("批量修改成功");
			    } else {
				core.warning(resp.msg);
			    }
			}
		    });
		}
	    });
	}

    };

    function getDrenBatchResource() {
	var resources = [];
	$("tr[id^='dren_resource_']").each(function() {
	    var resource = {};
	    var rid = $(this).attr("rid");
	    if (rid == 0) {
		// 新增
		rid = $(this).attr("lineno");
		var resourceLocation = $("#ipt_resource_type_" + rid).val();
		resource.resourceType = resourceLocation;
	    } else {
		resource.id = rid || 0;
	    }
	    var price = $("#ipt_price_" + rid).val();
	    var discountPrice = $("#ipt_discount_price_" + rid).val();
	    var expiryDate = $("#ipt_expiry_date_" + rid).val();
	    var priceRemark = $("#ipt_price_remark_" + rid).val();

	    resource.price = price || 0.0;
	    resource.discountPrice = discountPrice || 0.0;
	    resource.expiryDate = expiryDate || null;
	    resource.priceRemark = priceRemark;
	    resources.push(resource);
	});
	return sresources;
    }

    daren.openSetIncludingTaxModal = function(that) {
	var itax = $(that).data("itax");
	var pinfo = $(that).data("pinfo");
	core.modal("set_including_tax_modal", setIncludingTaxModalTemp({
	    includingTax : itax,
	    id : pinfo
	}));
    }

    daren.submitSetIncludingTax = function(that, data) {
	if (dataUtil.isEmpty(data.tax)) {
	    core.warning("请选择税费类型");
	    return;
	}
	core.ajax({
	    url : "/daren-web/daren/modifyMediaRegInfoByIncludingTax",
	    data : data,
	    type : "post",
	    success : function(resp) {
		if (resp.result > 0) {
		    $("#modify_daren_resource_modal #taxStr").text(dict.INCLUDING_TAX[data.tax]);
		    $("#modify_daren_resource_modal #tax_a").data("itax", data.tax);
		    core.closeModal("set_including_tax_modal");
		    core.success("设置成功");
		} else {
		    core.success("设置失败");
		}
	    }
	});
    }

    /** **************添加渠道相关************************** */
    return daren;
});
