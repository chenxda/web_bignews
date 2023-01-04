// 每次使用JQuery发起Ajax请求时，
// 都会调用一下 ajaxPrefilter() 这个函数
// options：是此次Ajax请求的配置对象
$.ajaxPrefilter(function (options) {
  // 发起Ajax请求时，统一拼接请求根路径
  options.url = 'http://www.liulongbin.top:3007' + options.url

  // 统一为有权限的接口，添加 headers 请求头
  if (options.url.indexOf('/my/') !== -1) {
    options.headers = {
      Authorization: localStorage.getItem('token') || '',
    }
  }

  // 全局同一挂载 complete 函数
  options.complete = function (res) {
    // res.responseJSON：服务端响应的数据
    if (
      res.responseJSON.status === 1 &&
      res.responseJSON.message === '身份认证失败！'
    ) {
      // 强制清空 token
      localStorage.removeItem('token')
      // 跳转到登录页
      window.location = '/18-bignews/login.html'
    }
  }
})
