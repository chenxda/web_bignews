$(function () {
  let form = layui.form

  // 为 form 表单设置校验规则
  form.verify({
    pwd: [/^[\S]{6,12}$/, '密码必须6到12位，且不能出现空格'],
    samePwd: function (value) {
      if (value === $('[name=oldPwd]').val()) {
        return '新旧密码不能相同！'
      }
    },
    rePwd: function (value) {
      if (value !== $('[name=newPwd]').val()) {
        return '两次密码不一致！'
      }
    },
  })

  // 监听表单提交事件
  $('.layui-form').on('submit', function (e) {
    e.preventDefault()

    // 发起ajax请求
    $.ajax({
      method: 'POST',
      url: '/my/updatepwd',
      data: $(this).serialize(),
      success: function (res) {
        if (res.status !== 0) {
          return layui.layer.msg('修改密码失败！')
        }
        layui.layer.msg('修改密码成功！')

        // 重置表单
        $('.layui-form')[0].reset()
      },
    })
  })
})
