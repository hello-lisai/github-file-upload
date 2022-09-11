// 导入配置
import configObj from './config.js'
import '../jquery.js'
$(function () {
  // 回显配置
  (function () {
    $("input[name='token']").val(configObj.token)
    $("input[name='userAndRepo']").val(configObj.userAndRepo)
    $("input[name='branch']").val(configObj.branch)
    $("input[name='path']").val(configObj.path)
  })()
  // 配置的保存
  $("#config_control").click(function () {
    if ($("#config").is(":visible")) {
      $("#config_control").text("配置")
      // 执行保存配置的操作
      configObj.token = $("input[name='token']").val()
      configObj.userAndRepo = $("input[name='userAndRepo']").val()
      configObj.branch = $("input[name='branch']").val()
      configObj.path = $("input[name='path']").val()
      localStorage.setItem("config", JSON.stringify(configObj));
    } else {
      $("#config_control").text("保存")

    }
    $("#config").slideToggle();
  })
  // 上传扩展到父容器
  $("#choose_img > input[name='content'],#img_pre_show").click(function (event) {
    event.stopPropagation();    //  阻止事件冒泡
  })

  $("#choose_img").click(function () {
    $("#choose_img > input[name='content']").click()
  })

  $('#myFile').on('input', (e) => {
    var windowURL = window.URL || window.webkitURL;
    var dataURL = windowURL.createObjectURL($('#myFile')[0].files[0]);
    console.log(dataURL)
    $('#img_pre_show').attr('src', dataURL)
    $("#upload_hint").hide()
  })


})