$(function () {
  getUserInfo()

  //  退出登录功能
  let layer = layui.layer
  $('#btnLogout').on('click', function () {
    // 提示用户是否确认退出
    layer.confirm(
      '确认退出登录?',
      { icon: 3, title: '提示' },
      function (index) {
        // 清除本地存储中的 token
        localStorage.removeItem('token')
        // 跳转到登录页
        location.href = '/18-bignews/login.html'

        // 关闭 confirm 询问框
        layer.close(index)
      }
    )
  })
})

// 获取用户基本信息
function getUserInfo() {
  $.ajax({
    method: 'GET',
    url: '/my/userinfo',
    // headers: {
    //   Authorization: localStorage.getItem('token') || '',
    // },
    success: function (res) {
      if (res.status !== 0) {
        return layui.layer.msg('获取用户失败！')
      }

      // 渲染用户头像
      renderAvatar(res.data)
    },
    // 无论此次请求成功还是失败，都会调用 complete 函数
    // complete: function (res) {
    //   // res.responseJSON：服务端响应的数据
    //   if (
    //     res.responseJSON.status === 1 &&
    //     res.responseJSON.message === '身份认证失败！'
    //   ) {
    //     // 强制清空 token
    //     localStorage.removeItem('token')
    //     // 跳转到登录页
    //     window.location = '/18-bignews/login.html'
    //   }
    // },
  })
}

// 渲染用户信息
function renderAvatar(user) {
  // 获取用户名称
  let name = user.nickname || user.username
  // 设置用户名称
  $('.welcome').html(`欢迎&nbsp;&nbsp;${name}`)

  // 按需显示头像
  if (user.user_pic !== null) {
    // 显示图片头像
    $('.layui-nav-img').attr('src', user.user_pic).show()
    $('.text-avatar').hide()
  } else {
    // 显示文字头像
    $('.layui-nav-img').hide()

    // 获取用户名首个字符
    let first = name[0].toUpperCase()
    $('.text-avatar').html(first).show()
  }
}
