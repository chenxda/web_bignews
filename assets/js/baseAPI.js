// 每次使用JQuery发起Ajax请求时，
// 都会调用一下 ajaxPrefilter() 这个函数
// options：是此次Ajax请求的配置对象
$.ajaxPrefilter(function (options) {
  // 发起Ajax请求时，统一拼接请求根路径
  options.url = 'http://www.liulongbin.top:3007' + options.url
  console.log(options.url)
})
