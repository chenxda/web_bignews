$(function () {
  let layer = layui.layer
  let form = layui.form

  initCate()

  // 初始化富文本编辑器
  initEditor()

  // 定义加载文章分类选择框的方法
  function initCate() {
    $.ajax({
      method: 'GET',
      url: '/my/article/cates',
      success: function (res) {
        if (res.status !== 0) {
          return layer.msg('初始化文章分类失败！')
        }

        // 调用模板引擎，渲染文章分类下拉框
        let htmlStr = template('tpl-cate', res)
        $('[name=cate_id]').html(htmlStr)

        // 一定要调用 formr.ender(),刷新表单内容
        form.render()
      },
    })
  }

  // 初始化图片裁剪
  // 1. 初始化图片裁剪器
  let $image = $('#image')
  // 2. 裁剪选项
  let options = {
    aspectRatio: 400 / 280,
    preview: '.img-preview',
  }
  // 3. 初始化裁剪区域
  $image.cropper(options)

  // 为选择封面按钮设置点击事件
  $('#btnChooseImage').on('click', function () {
    $('#coverFile').click()
  })

  // 监听 coverFile 按钮的 change 事件
  $('#coverFile').on('change', function (e) {
    // 获取文件的列表数组
    let files = e.target.files

    // 判断用户是否选择文件
    if (files.length === 0) {
      return
    }

    // 根据选择的文件，创建一个对应的 URL 地址
    var newImgURL = URL.createObjectURL(files[0])

    // 先销毁旧的裁剪区域，再重新设置图片路径，之后再创建新的裁剪区域：
    $image
      .cropper('destroy') // 销毁旧的裁剪区域
      .attr('src', newImgURL) // 重新设置图片路径
      .cropper(options) // 重新初始化裁剪区域
  })

  // 获取到点击编辑对应的文章的id
  let dataid = window.location.search.split('=')[1]
  // 根据文章id发起ajax请求，获取文章数据
  $.ajax({
    method: 'GET',
    url: '/my/article/' + dataid,
    success: function (res) {
      if (res.status !== 0) {
        return layer.msg('获取文章信息失败！')
      }

      // 利用 val(filter, obj) 函数，快速为表单赋值
      // filter: 表单lay-filter属性的值
      // obj：赋值的对象
      form.val('form-edit', res.data)
    },
  })

  // 定义文章发布状态
  let art_state = res.data.state

  // 为存为草稿按钮设置点击事件
  $('#btnSave2').on('click', function () {
    art_state = '草稿'
  })

  // 为表单绑定 submit 提交事件
  $('#form-edit').on('submit', function (e) {
    // 1、阻止表单默认提交行为
    e.preventDefault()

    // 2、基于form表单，快速创建FormData对象
    let fd = new FormData($(this)[0])

    // 3、将文章发布状态，存到fd中
    fd.append('state', art_state)

    // 4、将封面裁剪过后的图片，输出为一个文件对象
    $image
      .cropper('getCroppedCanvas', {
        // 创建一个 Canvas 画布
        width: 400,
        height: 280,
      })
      .toBlob(function (blob) {
        // 将 Canvas 画布上的内容，转化为文件对象
        // 得到文件对象后，进行后续的操作

        // 5、将文件对象，存储到 fd 中
        fd.append('cover_img', blob)

        // 6、发起ajax请求，发布文章
        publishArticle(fd)
      })
  })

  // 定义发布文章的方法
  function publishArticle(fd) {
    $.ajax({
      method: 'POST',
      url: '/my/article/add',
      data: fd,
      contentType: false,
      processData: false,
      success: function (res) {
        if (res.status !== 0) {
          return layer.msg('发布文章失败!')
        }
        layer.msg('发布文章成功!')

        // 发布文章成功后，跳转到文章列表页
        location.href = '/18-bignews/article/art_list.html'
      },
    })
  }
})
