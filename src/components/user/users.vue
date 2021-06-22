<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片试图 -->
    <el-card class="box-card">
      <!-- 搜索与添加区域 -->
      <el-row :gutter="30">
        <el-col :span="8">
          <el-input placeholder="请输入内容" v-model=" queryinfo.query" clearable @clear="getuserlist">
            <el-button slot="append" icon="el-icon-search" @click="getuserlist"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="adddialogVisible=true">ADD Users</el-button>
        </el-col>
      </el-row>
      <!-- 用户表格区域 -->
      <el-table :data="userlist" style="width: 100%" stripe border>
        <el-table-column type="index"></el-table-column>
        <el-table-column prop="username" label="姓名" width="180">
        </el-table-column>
        <el-table-column prop="email" label="邮箱" width="180">
        </el-table-column>
        <el-table-column prop="mobile" label="电话" width="180">
        </el-table-column>
        <el-table-column prop="role_name" label="角色" width="180">
        </el-table-column>
        <el-table-column label="状态" width="180">
          <template slot-scope="scope">
            <!-- {{ scope.row }} 记录了每行的数据-->
            <el-switch v-model="scope.row.mg_state" @change="userStateChanged(scope.row)"> </el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180">
          <template slot-scope="scope">
            <el-tooltip
              class="item"
              effect="dark"
              content="修改"
              placement="top-end"
              :enterable="false"
           
            >
              <el-button
                type="primary"
                icon="el-icon-edit"
                size="mini"
                   @click="showEditDialog(scope.row.id)"
              ></el-button>
            </el-tooltip>
 <el-tooltip
              class="item"
              effect="dark"
              content="删除"
              placement="top-end"
              :enterable="false"
            >
          <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="removeUserById(scope.row.id)"
            ></el-button
            >
            </el-tooltip>
 </el-tooltip>
 <el-tooltip
              class="item"
              effect="dark"
              content="分配角色"
              placement="top-end"
              :enterable="false"
            >
        <el-button
              type="warning"
              icon="el-icon-setting"
              size="mini"
            ></el-button>
            </el-tooltip>
      
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页区域 -->
       <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="queryinfo.pagenum"
      :page-sizes="[1, 2, 3, 4]"    
      :page-size="queryinfo.pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>
    </el-card>
    <!-- 添加用户的对话框 -->
    <el-dialog
@close="addDialogClosed"
  title="Tips"
  :visible.sync="adddialogVisible"
  width="25%"
  >
  <!-- 内容主体区域 -->
  <el-form :model="addForm" :rules="addRuleForm" ref="addFormRef" label-width="70px" class="demo-ruleForm">
  <el-form-item label="用户名" prop="username">
    <el-input v-model="addForm.username"></el-input>
  </el-form-item>
  <el-form-item label="密码" prop="password" >
    <el-input v-model="addForm.password" type="password"></el-input>
  </el-form-item>
  <el-form-item label="邮箱" prop="email" >
    <el-input v-model="addForm.email" ></el-input>
  </el-form-item>
  <el-form-item label="手机号" prop="mobile" >
    <el-input v-model="addForm.mobile" ></el-input>
  </el-form-item>
  </el-form>
  <!-- 底部区域 -->
  <span slot="footer" class="dialog-footer">
    <el-button @click="adddialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="adduser">确 定</el-button>
  </span>
</el-dialog >
<!-- 修改用户对话框 -->
<el-dialog
  title="修改用户"
  :visible.sync="EditDialogVisble"
  width="25%"
  :close="EditDialogClose"
  >
  <el-form :model=" editForm" :rules="eidtRuleForm" ref="editFormRef" label-width="70px" >
  <el-form-item  label="用户名" >
    <el-input v-model="editForm.username" disabled></el-input>
  </el-form-item>
  <el-form-item  label="邮箱" prop="email" >
    <el-input v-model="editForm.email" ></el-input>
  </el-form-item>
  <el-form-item  label="手机号" prop='mobile' >
    <el-input v-model="editForm.mobile" ></el-input>
  </el-form-item>
  </el-form>
  <span slot="footer" class="dialog-footer">
    <el-button @click="EditDialogVisble = false">取 消</el-button>
    <el-button type="primary" @click="EditUserinfo">确 定</el-button>
  </span>
</el-dialog>
  </div>
</template>
<script>
export default {
  name: 'users',
  data() {
    var checkEmail = (rule, value, cb) => {
      //验证邮箱的正则表达式
      const regEmail = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/
      if (regEmail.test(value)) {
        return cb()
      }
      cb(new Error('请输入合法的邮箱'))
    }
    var checkmoblie = (rule, value, cb) => {
      const regMobile =
        /^(0|86|17951)?(13[0-9]|15[0123456789]|17[678]|18[0-9]|14[57])[0-9]{8}$/
      if (regMobile.test(value)) {
        return cb()
      }
      cb(new Error('请输入合法手机号'))
    }
    return {
      queryinfo: {
        query: '',
        pagenum: 1,
        pagesize: 2,
      },
      userlist: [],
      total: 0,
      //控制修改对话款
      EditDialogVisble: false,
      adddialogVisible: false, //控制用户对话框的显示与隐藏
      //添加用户的表单数据
      addForm: {
        username: '',
        password: '',
        email: '',
        mobile: '',
      },
      editForm: {},
      //添加表单验证规则
      addRuleForm: {
        username: [
          { required: true, message: '请输入用户名称', trigger: 'blur' },
          {
            min: 3,
            max: 12,
            message: '长度在 3 到 12 个字符',
            trigger: 'blur',
          },
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          {
            min: 6,
            max: 8,
            message: '密码长度在 6 到 8 个字符',
            trigger: 'blur',
          },
        ],
        email: [
          { required: true, message: '请输入邮箱账号', trigger: 'blur' },
          {
            validator: checkEmail,
            trigger: 'blur',
          },
        ],
        mobile: [
          { required: true, message: '请输入手机号', trigger: 'blur' },

          {
            min: 11,
            max: 11,
            message: '无法识别的手机号',
            trigger: 'blur',
          },
          {
            validator: checkmoblie,
            trigger: 'blur',
          },
        ],
      },
      eidtRuleForm: {
        email: [
          { required: true, message: '请输入邮箱账号', trigger: 'blur' },
          {
            validator: checkEmail,
            trigger: 'blur',
          },
        ],
        mobile: [
          { required: true, message: '请输入手机号', trigger: 'blur' },

          {
            min: 11,
            max: 11,
            message: '无法识别的手机号',
            trigger: 'blur',
          },
          {
            validator: checkmoblie,
            trigger: 'blur',
          },
        ],
      },
    }
  },
  created() {
    this.getuserlist()
  },
  mounted() {},
  methods: {
    async getuserlist() {
      const { data: res } = await this.$http.get('/users', {
        params: this.queryinfo,
      })
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.userlist = res.data.users
      this.total = res.data.total
    },
    handleSizeChange(newsize) {
      //   console.log(newsize)
      this.queryinfo.pagesize = newsize
      this.getuserlist()
      //   console.log(this.total)
    },
    handleCurrentChange(newpage) {
      //   console.log(newpage)
      this.queryinfo.pagenum = newpage
      this.getuserlist()
    },
    //监听switch开关
    async userStateChanged(userinfo) {
      const { data: res } = await this.$http.put(
        `/users/${userinfo.id}/state/${userinfo.mg_state}`
      )
      if (res.meta.status !== 200) {
        userinfo.mg_state = !userinfo.mg_state
        return this.$message.error('ERROR')
      } else {
        this.$message.success('success!!!')
      }
    },
    addDialogClosed() {
      this.$refs.addFormRef.resetFields()
    },
    adduser() {
      this.$refs.addFormRef.validate(async (valid) => {
        if (!valid) return this.$message.error('注册失败')
        else {
          const { data: res } = await this.$http.post('/users', this.addForm)
          if (res.meta.status !== 201) return this.$message.error('注册失败')
          this.$message.success('注册成功')
          this.adddialogVisible = false
          this.getuserlist()
        }
      })
    },
    async showEditDialog(id) {
      //展示编辑用户对话框
      this.EditDialogVisble = true
      //   console.log(id)
      const { data: res } = await this.$http.get('/users/' + id)
      if (res.meta.status !== 200) return this.$message.error('查询数据错误')
      this.editForm = res.data
      console.log(this.editForm)
    },
    EditDialogClose() {
      this.$refs.editFormRef.resetFields()
    },
    EditUserinfo() {
      this.EditDialogVisble = false
      this.$refs.editFormRef.validate(async (valid) => {
        if (!valid) return this.$message.error('修改失败')

        const { data: res } = await this.$http.put(
          '/users/' + this.editForm.id,
          {
            email: this.editForm.email,
            mobile: this.editForm.mobile,
          }
        )
        if (res.meta.status !== 200)
          return this.$message.error('更新用户数据失败')
        this.getuserlist()
        this.$message.success('更新用户信息成功')
      })
    },
    async removeUserById(id) {
      //   console.log(id)
      const res = await this.$confirm(
        '此操作将永久删除该用户, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        }
      ).catch((err) => err)
      //   console.log(res)
      if (res != 'confirm') return this.$message.success('已经取消了删除')
      const { data: res2 } = await this.$http.delete('/users/' + id)
      if (res2.meta.status !== 200) return this.$message.error('删除用户失败')
      this.$message.success('删除用户成功')
      this.getuserlist()
    },
  },
}
</script>
<style lang="less" scoped>
* {
  padding: 0;
  margin: 0;
}
</style>