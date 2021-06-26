<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>添加商品</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-alert
        title="添加商品信息"
        type="info"
        center
        show-icon
        :closable="false"
      >
      </el-alert>
      <el-steps
        :space="200"
        :active="activeIndex - 0"
        finish-status="success"
        align-center
      >
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>

      <el-form
        :model="addForm"
        :rules="addFormrules"
        ref="addruleFormRef"
        label-width="100px"
        label-position="top"
      >
        <el-tabs
          v-model="activeIndex"
          :tab-position="'left'"
          :before-leave="beforeTableave"
          @tab-click="tableClick"
        >
          <el-tab-pane label="基本信息" name="0">
            <el-form-item label="商品名称" prop="goods_name">
              <el-input v-model="addForm.goods_name"></el-input>
            </el-form-item>
            <el-form-item label="商品价格" prop="goods_price">
              <el-input v-model="addForm.goods_price" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品重量" prop="goods_weight">
              <el-input v-model="addForm.goods_weight" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品数量" prop="goods_number">
              <el-input v-model="addForm.goods_number" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品分类" prop="goods_cate">
              <el-cascader
                v-model="addForm.goods_cat"
                expand-trigger="hover"
                :options="catelist"
                :props="cateProps"
                @change="handleChange"
              >
              </el-cascader>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品参数" name="1">
            <el-form-item
              v-for="item in manyTableData"
              :label="item.attr_name"
              :key="item.attr_id"
            >
              <el-checkbox-group v-model="item.attr_vals">
                <el-checkbox
                  border
                  v-for="(item2, i) in item.attr_vals"
                  :key="i"
                  :label="item2"
                ></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品属性" name="2">
            <el-form-item
              v-for="item in onlyTableData"
              :key="item.attr_id"
              :label="item.attr_name"
            >
              <el-input v-model="item.attr_vals"></el-input>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品图片" name="3">
            <el-upload
              :action="uploadurl"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              list-type="picture"
              :headers="headerObj"
              :on-success="handleSuccess"
            >
              <el-button size="small" type="primary">点击上传</el-button>
            </el-upload>
          </el-tab-pane>
          <el-tab-pane label="商品内容" name="4">
            <quill-editor v-model="addForm.goods_introduce"></quill-editor>
            <el-button type="primary" class="btnAdd" @click="add"
              >添加商品</el-button
            >
          </el-tab-pane>
        </el-tabs>
      </el-form>
    </el-card>

    <!-- 图片预览对话框 -->
    <el-dialog title="图片预览" :visible.sync="picDialogVisible" width="30%">
      <img :src="previewurl" alt="" />
      <span slot="footer" class="dialog-footer"> </span>
    </el-dialog>
  </div>
</template>
<script>
import _ from 'lodash'

export default {
  name: 'AddGoods',
  data() {
    return {
      activeIndex: '0',
      addForm: {
        goods_name: '',
        goods_price: '',
        goods_weight: '',
        goods_number: '',
        goods_cat: [],
        pics: [],
        goods_introduce: '',
        attrs: [],
      },
      addFormrules: {
        goods_name: [
          { required: true, message: '请输入商品名称', trigger: 'blur' },
        ],
        goods_price: [
          { required: true, message: '请输入商品价格', trigger: 'blur' },
        ],
        goods_weight: [
          { required: true, message: '请输入商品重量', trigger: 'blur' },
        ],
        goods_number: [
          { required: true, message: '请输入商品数量', trigger: 'blur' },
        ],
        goods_cat: [
          { required: true, message: '请输入商品分类', trigger: 'blur' },
        ],
      },
      catelist: [],
      cateProps: {
        label: 'cat_name',
        value: 'cat_id',
        children: 'children',
      },
      manyTableData: [],
      onlyTableData: [],
      checkList: [],
      uploadurl: 'https://lianghj.top:8888/api/private/v1/upload',
      headerObj: {
        Authorization: window.sessionStorage.getItem('token'),
      },
      previewurl: '',
      picDialogVisible: false,
    }
  },
  created() {
    this.getCateList()
  },
  methods: {
    async getCateList() {
      const { data: res } = await this.$http.get('/categories')
      if (res.meta.status !== 200) return this.$message.error('获取错误')
      this.catelist = res.data
      console.log(this.catelist)
    },
    handleChange() {
      //   console.log(this.addForm.goods_cat)
      if (this.addForm.goods_cat.length !== 3) this.addForm.goods_cat = []
    },
    beforeTableave(activeName, oldActiveName) {
      if (this.addForm.goods_cat.length !== 3) {
        this.$message.error('请选择商品分类')
        return false
      }
    },
    async tableClick() {
      if (this.activeIndex === '1') {
        const { data: res } = await this.$http.get(
          `/categories/
          ${this.cateid}/attributes`,
          {
            params: {
              sel: 'many',
            },
          }
        )
        if (res.meta.status !== 200)
          return this.$message.error('获取动态参数失败')
        this.manyTableData = res.data
        res.data.forEach((item) => {
          item.attr_vals =
            item.attr_vals.length === 0 ? [] : item.attr_vals.split(' ')
        })
      } else if (this.activeIndex === '2') {
        const { data: res } = await this.$http.get(
          `/categories/
          ${this.cateid}/attributes`,
          {
            params: {
              sel: 'only',
            },
          }
        )
        if (res.meta.status !== 200)
          return this.$message.error('获取商品属性失败')
        // console.log(res.data)
        this.onlyTableData = res.data
      }
    },
    handlePreview(file) {
      console.log(file)
      this.previewurl = file.response.data.url
      this.picDialogVisible = true
    },
    handleRemove(file) {
      console.log(this.addForm.pics)
      const filepath = file.response.data.tmp_path
      const i = this.addForm.pics.findIndex((x) => x.pic === filepath)
      this.addForm.pics.splice(i, 1)
      console.log(this.addForm)
    },
    handleSuccess(res) {
      const picInfo = {
        pic: res.data.tmp_path,
      }
      this.addForm.pics.push(picInfo)
    },
    add() {
      this.$refs.addruleFormRef.validate(async (valid) => {
        if (!valid) return this.$message.error('请填写必要表单项目')
        const newaddForm = _.cloneDeep(this.addForm)
        newaddForm.goods_cat = newaddForm.goods_cat.join(',')
        this.manyTableData.forEach((item) => {
          const newInfo = {
            attr_id: item.attr_id,
            attr_value: item.attr_vals.join(' '),
          }
          this.addForm.attrs.push(newInfo)
        })
        this.onlyTableData.forEach((item) => {
          const newInfo = { attr_id: item.attr_id, attr_value: item.attr_vals }
          this.addForm.attrs.push(newInfo)
        })
        newaddForm.attrs = this.addForm.attrs

        const { data: res } = await this.$http.post('/goods', newaddForm)
        if (res.meta.status !== 201) return this.$message.error('添加错误')
        this.$message.success(res.meta.msg)
        this.$router.push('/goods')
        console.log(newaddForm)
      })
    },
  },
  computed: {
    cateid() {
      if (this.addForm.goods_cat.length === 3) return this.addForm.goods_cat[2]
    },
  },
}
</script>
<style lang="less" scoped>
.el-checkbox {
  margin: 15px;
}
.btnAdd {
  margin-top: 12px;
}
</style>