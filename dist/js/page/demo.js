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

    var jqueryUploadDemoTemp = require("templates/daren/jqueryUploadDemo");

    require("bootstrap-file-input");
    require("bfi-zh");

    function demo() {

    }

    demo.init = function(page, data) {
	dict = data.dict;
    };

    // 文件上传
    demo.openJquploadDemoModal = function(that) {
	core.modal("jq_upload_demo_modal", jqueryUploadDemoTemp());
	$("#file-0d").fileinput({
	    language : 'zh', // 设置语言
	    uploadUrl : "/daren-web/upload/uploadFiles", // 上传的地址
	    allowedFileExtensions : [ 'jpg', 'gif', 'png' ],// 接收的文件后缀
	    showUpload : false, // 是否显示上传按钮
	    showCaption : true,// 是否显示标题
	    browseClass : "btn btn-primary", // 按钮样式
	    // dropZoneEnabled: false,//是否显示拖拽区域
	    // minImageWidth: 50, //图片的最小宽度
	    // minImageHeight: 50,//图片的最小高度
	    // maxImageWidth: 1000,//图片的最大宽度
	    // maxImageHeight: 1000,//图片的最大高度
	    // maxFileSize: 0,//单位为kb，如果为0表示不限制文件大小
	    // minFileCount: 0,
	    maxFileCount : 10, // 表示允许同时上传的最大文件个数
	    enctype : 'multipart/form-data',
	    validateInitialCount : true,
	    previewFileIcon : "<i class='glyphicon glyphicon-king'></i>",
	    msgFilesTooMany : "选择上传的文件数量({n}) 超过允许的最大数值{m}！",
	}).on("filebatchselected", function(event, files) {
	    $(this).fileinput("upload");
	})
    }

    return demo;
});
