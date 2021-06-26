<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图区域 -->
    <el-card>
      <!-- 添加角色按钮区域 -->
      <el-row>
        <el-col>
          <el-button type="primary" @click="addRoleBtn">添加角色</el-button>
        </el-col>
      </el-row>
      <el-table :data="roleList" border stripe>
        <el-table-column type="expand">
          <template slot-scope="scope">
            <el-row
              :class="['bdbottom', i1 === 0 ? 'bdtop' : '', 'vcenter']"
              v-for="(item1, i1) in scope.row.children"
              :key="item1.id"
            >
              <!-- 渲染一级权限 -->
              <el-col :span="5">
                <el-tag
                  @close="removeRightById(scope.row, item1.id)"
                  closable
                  >{{ item1.authName }}</el-tag
                >
                <i class="el-icon-caret-right"></i>
              </el-col>
              <!-- 渲染二级权限 -->
              <el-col :span="19">
                <el-row
                  :class="[i2 === 0 ? 'bdtop' : '', 'bdbottom', 'vcenter']"
                  v-for="(item2, i2) in item1.children"
                  :key="item2.id"
                >
                  <el-col :span="6">
                    <el-tag
                      @close="removeRightById(scope.row, item2.id)"
                      closable
                      type="success"
                      >{{ item2.authName }}</el-tag
                    >
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <el-col :span="18">
                    <el-tag
                      @close="removeRightById(scope.row, item3.id)"
                      closable
                      type="warning"
                      v-for="(item3, i3) in item2.children"
                      :key="item3.id"
                      >{{ item3.authName }}</el-tag
                    >
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <el-table-column type="index"></el-table-column>
        <el-table-column label="角色名称" prop="roleName"></el-table-column>
        <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
        <el-table-column label="操作" width="300px">
          <template slot-scope="scope">
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="showEditDialog(scope.row.id)"
              >编辑</el-button
            >
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="deleteRole(scope.row.id)"
              >删除</el-button
            >
            <el-button
              type="warning"
              icon="el-icon-settting"
              size="mini"
              @click="showSetRightDialog(scope.row)"
              >分配权限</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <!-- 角色列表区域 -->
    </el-card>
    <!-- //编辑角色对话框 -->
    <el-dialog
      title="修改角色"
      :visible.sync="EditDialogVisble"
      width="25%"
      :close="EditDialogClose"
    >
      <el-form :model="editRoleForm" ref="editFormRef" label-width="70px">
        <el-form-item label="角色名称">
          <el-input v-model="editRoleForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述">
          <el-input v-model="editRoleForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="EditDialogVisble = false">取 消</el-button>
        <el-button type="primary" @click="EditRoleinfo">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 添加角色对话框 -->
    <el-dialog
      title="修改角色"
      :visible.sync="addDialogVisble"
      width="25%"
      :close="addDialogClose"
    >
      <el-form :model="addRoleForm" ref="addFormRef" label-width="70px">
        <el-form-item label="角色名称">
          <el-input v-model="addRoleForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述">
          <el-input v-model="addRoleForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisble = false">取 消</el-button>
        <el-button type="primary" @click="addRoleinfo">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 分配权限的对话框 -->
    <el-dialog
      title="分配角色"
      :visible.sync="SetRightDialogVisble"
      width="25%"
    >
      <el-tree
        show-checkbox
        :data="rightList"
        :props="treeProps"
        node-key="id"
        :default-expand-all="true"
        :default-checked-keys="defKeys"
        ref="treeRef"
      ></el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="SetRightDialogVisble = false">取 消</el-button>
        <el-button type="primary" @click="allotRights">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  name: 'roles',
  data() {
    return {
      //所有角色列表
      roleList: [],
      rightList: [],
      //默认勾选的分支Id
      defKeys: [],
      roleId: '',
      treeProps: {
        label: 'authName',
        children: 'children',
      },
      editRoleForm: [],
      addRoleForm: {
        roleName: '',
        roleDesc: '',
      },
      EditDialogVisble: false,
      addDialogVisble: false,
      SetRightDialogVisble: false,
    }
  },
  created() {
    this.getrolesList()
  },
  methods: {
    async getrolesList() {
      const { data: res } = await this.$http.get('/roles')
      if (res.meta.status !== 200) return this.$message.error('请求数据失败')
      this.$message.success('请求数据成功')
      this.roleList = res.data
      console.log(this.roleList)
    },
    // 添加角色
    addRoleBtn() {
      this.addDialogVisble = true
    },
    //删除角色
    async deleteRole(id) {
      console.log(id)
      const res = await this.$confirm(
        '此操作将永久删除该角色, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        }
      ).catch((err) => err)
      if (res != 'confirm') return this.$message.success('已经取消了删除')
      const { data: res2 } = await this.$http.delete('/roles/' + id)
      if (res2.meta.status !== 200) return this.$message.error('删除角色失败')
      this.$message.success('res2.meta.msg')
      this.getrolesList()
    },
    //编辑角色
    async showEditDialog(id) {
      this.EditDialogVisble = true
      console.log(id)
      const { data: res } = await this.$http.get('/roles/' + id)

      if (res.meta.status !== 200) return this.$message.error('获取失败')
      this.$message.success(res.meta.msg)
      this.editRoleForm = res.data
      console.log(this.editRoleForm)
    },
    async EditRoleinfo() {
      this.EditDialogVisble = false

      const { data: res } = await this.$http.put(
        '/roles/' + this.editRoleForm.roleId,
        {
          //   id: this.editRoleForm.roleId,
          roleName: this.editRoleForm.roleName,
          roleDesc: this.editRoleForm.roleDesc,
        }
      )
      if (res.meta.status !== 200) return this.$message.error('请求失败')
      this.$message.success(res.meta.msg)
      this.getrolesList()
    },
    EditDialogClose() {
      this.$refs.editFormRef.resetFields()
    },
    //添加角色信息
    addDialogClose() {
      this.$refs.addFormRef.resetFields()
    },
    async addRoleinfo() {
      this.addDialogVisble = false
      console.log(this.addRoleForm)
      const { data: res } = await this.$http.post('/roles', this.addRoleForm)
      if (res.meta.status != 201) return this.$message.error('添加角色失败')
      this.$message.success(res.meta.msg)
      this.getrolesList()
    },
    async removeRightById(role, rightId) {
      const confimresult = await this.$confirm(
        '此操作将永久删除该角色, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        }
      ).catch((err) => err)
      if (confimresult !== 'confirm')
        return this.$message.success('取消了这次删除')
      const { data: res } = await this.$http.delete(
        `/roles/${role.id}/rights/${rightId}`
      )
      if (res.meta.status !== 200) return this.$message.error('删除权限失败')
      role.children = res.data
      this.$message.success('删除成功')
    },
    //分配角色
    async showSetRightDialog(role) {
      this.roleId = role.id
      const { data: res } = await this.$http.get('/rights/tree')
      if (res.meta.status !== 200) return this.$message.error('请求失败')
      this.$message.success('请求分配成功')
      this.rightList = res.data

      this.defKeys.splice(0, this.defKeys.length)
      this.getLeafKeys(role, this.defKeys)
      this.SetRightDialogVisble = true
    },
    getLeafKeys(node, arr) {
      if (!node.children) {
        return arr.push(node.id)
      }

      node.children.forEach((item) => {
        this.getLeafKeys(item, arr)
      })
    },
    async allotRights() {
      const keys = [
        ...this.$refs.treeRef.getCheckedKeys(),
        this.$refs.treeRef.getHalfCheckedKeys(),
      ]
      const idStr = keys.join(',')
      const { data: res } = await this.$http.post(
        `/roles/${this.roleId}/rights`,
        { rids: idStr }
      )
      if (res.meta.status !== 200) return this.$message.error('分配失败')
      this.$message.success(res.meta.msg)
      this.SetRightDialogVisble = false
      this.getrolesList()
    },
  },
}
</script>
<style lang="less" scoped>
.el-tag {
  margin: 7px;
}
.bdtop {
  border-top: 1px solid #eee;
}
.bdbottom {
  border-bottom: 1px solid #eee;
}
.vcenter {
  display: flex;
  align-items: center;
}
</style>