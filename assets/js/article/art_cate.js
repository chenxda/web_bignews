$(function () {
  let layer = layui.layer
  let form = layui.form

  initArtCateList()

  // 获取文章分类列表
  function initArtCateList() {
    $.ajax({
      method: 'GET',
      url: '/my/article/cates',
      success: function (res) {
        // 获取拼接好的模板字符串
        let htmlStr = template('tpl-table', res)
        // 渲染表格
        $('tbody').html(htmlStr)
      },
    })
  }

  // 为添加类别按钮绑定事件
  let indexAdd = null
  $('#btnAddCate').on('click', function () {
    indexAdd = layer.open({
      type: 1,
      area: ['500px', '250px'],
      title: '添加文章分类',
      content: $('#dialog-add').html(),
    })
  })

  // 通过事件委托的方式，为 form-add 表单绑定 submit 事件
  $('body').on('submit', '#form-add', function (e) {
    e.preventDefault()

    $.ajax({
      method: 'POST',
      url: '/my/article/addcates',
      data: $(this).serialize(),
      success: function (res) {
        console.log(res)
        if (res.status !== 0) {
          return layer.msg('添加文章类别失败！')
        }
        initArtCateList()
        layer.msg('添加文章类别成功！')

        // 根据索引，关闭对应的弹出层
        layer.close()
      },
    })
  })

  // 通过事件委托的方式，为 form-edit 表单绑定 submit 事件
  let indexEdit = null
  $('tbody').on('click', '.btn-edit', function (e) {
    // 弹出弹窗
    indexEdit = layer.open({
      type: 1,
      area: ['500px', '250px'],
      title: '修改文章分类',
      content: $('#dialog-edit').html(),
    })

    // 发起请求，获取对应分类的数据
    let id = $(this).attr('data-id') //获取对应分类的id值
    $.ajax({
      method: 'GET',
      url: '/my/article/cates/' + id,
      success: function (res) {
        // 填充表单数据
        form.val('form-edit', res.data)
      },
    })
  })

  // 通过代理的形式，为修改分类的表单绑定 submit 事件
  $('body').on('submit', '#form-edit', function (e) {
    e.preventDefault()

    $.ajax({
      method: 'POST',
      url: '/my/article/updatecate',
      data: $(this).serialize(),
      success: function (res) {
        // 请求失败
        if (res.status !== 0) {
          return layer.msg('更新分类数据失败！')
        }
        // 请求成功
        layer.msg('更新分类数据成功！')
        layer.close(indexEdit)
        initArtCateList()
      },
    })
  })

  // 通过代理的形式，为删除按钮绑定点击事件
  $('tbody').on('click', '.btn-delete', function () {
    // 获取分类id
    let id = $(this).attr('data-id')

    // 弹出询问框
    layer.confirm('确认删除?', { icon: 3, title: '提示' }, function (index) {
      //do something
      $.ajax({
        method: 'GET',
        url: `/my/article/deletecate/${id}`,
        success: function (res) {
          // 删除失败
          if (res.status !== 0) {
            return layer.msg('删除分类失败！')
          }

          // 删除成功
          layer.msg('删除分类成功！')
          layer.close(index)
          initArtCateList()
        },
      })
    })
  })
})
