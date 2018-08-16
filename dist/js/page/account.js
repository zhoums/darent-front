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
    require("jqxcore");
    require("jqxdata");
    require("jqxbuttons");
    require("jqxscrollbar");
    require("jqxdatatable");
    require("jqxtreegrid");
    require("jqxmenu");
    var layer = require("layer");
    var core = require("core");
    var dataUtil = require("common/data");

    var addSubAccountTemp = require("templates/account/add_sub_account");

    var dict;
    function account() {

    }

    account.init = function(page, data) {
	dict = data.dict;
	if (page === "account_list") {
	    getAccountPage();
	}
    };

    function getAccountPage() {
	var tableConfig = {
	    "ajax" : {
		url : "/daren-web/account/getSubAccountPage",
		dataSrc : function(resp) {
		    if (resp.status != 0) {
			core.alert(resp.msg);
		    } else {
			core.fixResp(resp, function(row) {
			    row.op = '<a href="#" class="bind bind-click" roleid= "5"  rolename="' + row.realName
				    + '" bind-method="getRolePerms">授权</a>';
			    row.statusStr = row.status == 0 ? "锁定" : "正常";
			});
			return resp.result.list;
		    }

		},
	    },
	    "paging" : true,
	    drawCallback : function(e) {
	    }
	};
	window.oTable = core.dataTable("sub-account-list-table", tableConfig);
	paintRolePerms();
    }

    /**
     * 绘制角色资源树
     */
    function paintRolePerms() {
	var source1 = {
	    dataType : "json",
	    dataFields : [ {
		name : 'id'
	    }, {
		name : 'name'
	    }, {
		name : 'pId'
	    }, {
		name : 'type'
	    }, {
		name : 'url'
	    }, {
		name : 'code'
	    } ],
	    hierarchy : {
		keyDataField : {
		    name : 'id'
		},
		parentDataField : {
		    name : 'pId'
		}
	    },
	    id : 'id',
	    url : '/daren-web/rbac/perms/perms.json?type=3',
	};
	var dataAdapter1 = new jQuery.jqx.dataAdapter(source1);
	$("#treeGrid1").jqxTreeGrid(
		{
		    localization : {
			loadText : "加载中...",
			emptyDataString : "找不到数据 ⊙o⊙"
		    },
		    theme : "metro",
		    width : '100%',
		    height : 600,
		    columnsResize : true,
		    source : dataAdapter1,
		    sortable : false,
		    hierarchicalCheckboxes : true,
		    checkboxes : true,
		    icons : true,
		    ready : function() {
			$("#treeGrid1").jqxTreeGrid('expandRow', 1);
		    },
		    columns : [
			    {
				text : '资源名',
				dataField : 'name'
			    },
			    {
				text : '资源类型',
				dataField : 'type',
				width : 150,
				cellsRenderer : function(row, dataField, cellValue, rowData, cellText) {
				    return cellValue == 0 ? "根"
					    : (cellValue == 1 ? '<font color="blue" weight="bold">菜单</font>'
						    : (cellValue == 2 ? '<font color="red" weight="bold">操作</font>'
							    : '资源'));
				}
			    } ]
		});
    }

    account.openAddSubAccountModal = function(that) {
	core.modal("add_sub_account_modal", addSubAccountTemp());
	core.selectShopByPrincipal("add_sub_account_dr_list");
    }

    account.submitAddSubAccount = function(that, data) {
	data.drIds = JSON.stringify(data.drIds);
	core.ajax({
	    url : "/daren-web/account/addSubAccount",
	    data : data,
	    type : "post",
	    success : function(resp) {
		if (resp.status == 0) {
		    window.oTable.ajax.reload();
		    core.closeModal("add_sub_account_modal");
		    core.success("添加成功");
		}
	    }
	});
    }

    account.getRolePerms = function(that) {
	var rolename = that.attr("rolename");
	var roleid = that.attr("roleid");
	$("#bindRolePermsButton").attr("roleid", roleid);
	$('#div-perm').css('visibility', 'visible');
	$('#perms-title').text(rolename + " - 可访问的资源");
	var rows = $("#treeGrid1").jqxTreeGrid('getCheckedRows');
	for ( var x in rows) {
	    $("#treeGrid1").jqxTreeGrid('uncheckRow', rows[x].id);
	}
	var ajaxParam = {
	    url : "/daren-web/rbac/role_perm_list?roleid= " + roleid,
	    success : function(jsonResult) {
		$('#treeGrid1').jqxTreeGrid('expandRow', 1);
		for ( var x in jsonResult.result) {
		    $('#treeGrid1').jqxTreeGrid('checkRow', jsonResult.result[x]);
		}
	    }
	};
	core.ajax(ajaxParam);
    };

    return account;
});
