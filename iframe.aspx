<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<title>未授权时的页面</title>

<style>
body{
	background:url("http://qimeng.appsina.com/images/1.jpg");
}
</style>

<script src="http://js.t.sinajs.cn/t4/enterprise/js/public/appframe/appClient.js" type="text/javascript"></script>

<script>

    //弹出授权弹层：
    function authLoad() {
        App.AuthDialog.show({
            client_id: '142432575',    //必选，填入框架通过get方式传递的sub_appkey参数
            redirect_uri: 'http://e.weibo.com/1867772587/app_142432575',
            //必选，授权回调地址，必须以http://e.weibo.com开头，类似http://e.weibo.com/1717871843/app_738247391
            //或者http://e.weibo.com/thirdapp/app?appkey=142432575，不同企业应用的前台url是不固定的，需要用uid拼装
            height: 120,    //可选，默认距顶端120px
            display: 'apponweibo'  //必选，移动端H5授权则应为display: 'mobile'
        });
    }
</script>

</head>
<body onload="authLoad();">

</body>
</html>