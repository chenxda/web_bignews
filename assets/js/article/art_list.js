$(function () {
  let layer = layui.layer
  let form = layui.form
  let laypage = layui.laypage

  // 定义 补零 函数
  function padZero(n) {
    return n > 9 ? n : '0' + n
  }

  // 定义一个美化事件的过滤器
  template.defaults.imports.dateFormat = function (date) {
    const dt = new Date(date)

    let y = dt.getFullYear()
    let m = padZero(dt.getMonth() + 1)
    let d = padZero(dt.getDate())

    let hh = padZero(dt.getHours())
    let mm = padZero(dt.getMinutes())
    let ss = padZero(dt.getSeconds())

    return `${y}-${m}-${d} ${hh}:${mm}:${ss}`
  }

  // 定义一个查询的参数对象，
  // 将来请求数据时，需要将请求对象提交到服务器
  let q = {
    pagenum: 1, //页码值，默认请求第一页数据
    pagesize: 2, //每页显示数据条数，默认每页显示2条
    cate_id: '', //文章分类的id
    state: '', //文章的发布状态
  }

  initTable()
  initCate()

  // 获取文章列表的方法
  function initTable() {
    // 发起请求，获取文章列表数据
    $.ajax({
      method: 'GET',
      url: '/my/article/list',
      data: q,
      success: function (res) {
        // 获取数据失败
        if (res.status !== 0) {
          return layer.msg('获取文章列表失败！')
        }

        // 获取数据成功
        // 使用模板引擎渲染页面的数据
        let htmlStr = template('tpl-table', res)
        $('tbody').html(htmlStr)

        // 渲染分页
        renderPage(res.total)
      },
    })
  }

  // 初始化文章分类
  function initCate() {
    $.ajax({
      method: 'GET',
      url: '/my/article/cates',
      success: function (res) {
        // 获取失败
        if (res.status !== 0) {
          return layer.msg('获取文章分类数据失败！')
        }

        // 调用模板引擎渲染分类的可选项
        let htmlStr = template('tpl-cate', res)
        $('[name=cate_id]').html(htmlStr)
        // 通知 layui 重新渲染表单区域的UI结构
        form.render()
      },
    })
  }

  // 为筛选表单绑定 submit 事件
  $('#form-search').on('submit', function (e) {
    e.preventDefault()

    // 获取表单中选中项的值
    let cate_id = $('[name=cate_id]').val()
    let state = $('[name=state]').val()

    // 为查询参数对象q 中对应的属性赋值
    q.cate_id = cate_id
    q.state = state

    // 根据最新的筛选条件，重新渲染表格
    initTable()
  })

  // 定义渲染分页的方法
  function renderPage(total) {
    // 调用 laypage.render() 方法来渲染分页结构
    laypage.render({
      elem: 'pageBox', //分页容器id
      count: total, //总数据条数
      limit: q.pagesize, //每页显示几条数据
      curr: q.pagenum, //设置默认被选中的分页
      layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'], //自定义分页排版
      limits: [2, 3, 5, 10], //每页显示数据条数选项值

      // 触发 jump 回调的两种方式
      // 1、点击页码时，会触发 jump 回调
      // 2、只要调用了 laypage.render() 方法，就会触发 jump 函数
      jump: function (obj, first) {
        // 把最新的页码值，赋值给查询参数对象 q
        q.pagenum = obj.curr

        // 把最新的显示条目数，赋值到q.pagesize属性中
        q.pagesize = obj.limit

        // 直接调用 initTable() 方法，会发生死循环
        // 原因：这里调用initTable()，但是initTable()里有renderPage(res.total)
        // 两个方法不断调用，陷入死循环
        // initTable()

        // 可以通过 first 的值，来判断是通过哪种方式触发的 jump回调
        // 如果first 为 true，证明是方式2触发的
        // 否则就是方式1触发的

        // 根据最新的 q 获取对应的数据，并渲染表格
        if (!first) initTable()
      },
    })
  }

  // 通过代理，为删除按钮绑定点击事件
  $('tbody').on('click', '.btn-delete', function () {
    // 获取本页表格中还有几个删除按钮
    // 借此判断本页有几条数据
    let len = $('.btn-delete').length
    console.log(len)

    // 获取按钮对应的数据的id
    let id = $(this).attr('data-id')

    // 弹出确认弹窗
    layer.confirm('确认删除？', { icon: 3, title: '提示' }, function (index) {
      //do something
      $.ajax({
        method: 'GET',
        url: '/my/article/delete/' + id,
        success: function (res) {
          if (res.status !== 0) {
            return layer.msg('删除文章失败！')
          }

          layer.msg('删除文章成功！')

          // 当数据删除后，需要判断当前这一页，是否还有剩余数据
          // 如果没有剩余数据，则让页码 -1 之后，在调用 initTable()
          if (len === 1) {
            // 如果 len = 1 说明此次删除之后，本页没有数据了
            // 页码最小值必须为1
            q.pagenum = q.pagenum === 1 ? 1 : q.pagenum - 1
          }

          initTable()
        },
      })

      layer.close(index)
    })
  })

  // 通过代理，为编辑按钮绑定点击事件
  $('tbody').on('click', '.btn-edit', function () {
    location.href =
      '/18-bignews/article/art_edit.html?data-id=' +
      $('.btn-edit').attr('data-id')
  })
})
