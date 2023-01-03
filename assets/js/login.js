$(function () {
  // 点击“去注册”链接
  $('#link_reg').on('click', function () {
    $('.login-box').hide()
    $('.reg-box').show()
  })

  // 点击“去登陆”链接
  $('#link_login').on('click', function () {
    $('.login-box').show()
    $('.reg-box').hide()
  })
})

// 从 layui.js 中获取 form对象
let form = layui.form
let layer = layui.layer

// 通过 form.verify() 自定义校验规则
form.verify({
  // 自定义一个叫 pwd 的校验规则
  pwd: [/^[\S]{6,12}$/, '密码必须6到12位，且不能出现空格'],
  repwd: function (value) {
    let pwd = $('.reg-box [name=password]').val()
    if (pwd !== value) return '两次密码不一致！'
  },
})

// 监听注册表单事件
$('#form_reg').on('submit', function (e) {
  // 阻止表单默认提交行为
  e.preventDefault()

  // 发起Ajax的post请求
  let data = {
    username: $('#form_reg [name=username]').val(),
    password: $('#form_reg [name=password]').val(),
  }
  $.post('/api/reguser', data, function (res) {
    if (res.status !== 0) {
      return layer.msg(res.message)
    }
    layer.msg(res.message)
    $('#link_login').click()
  })
})

// 监听登录表单事件
$('#form_login').submit(function (e) {
  e.preventDefault()

  // 发起Ajax请求
  $.ajax({
    method: 'POST',
    url: '/api/login',
    data: $(this).serialize(),
    success: function (res) {
      // 登录失败
      if (res.status !== 0) {
        return layer.msg('登录失败！')
      }

      // 登录成功,将 token 字符串存储到 localStorage 中
      layer.msg('登录成功！')
      localStorage.setItem('token', res.token)
      // 跳转后台首页
      location.href = '/18-bignews/index.html'
    },
  })
})
