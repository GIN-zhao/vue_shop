<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item>订单列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-row :gutter="30">
        <el-col :span="8">
          <el-input placeholder="请输入内容" clearable>
            <el-button slot="append" icon="el-icon-search"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary">添加订单</el-button>
        </el-col>
      </el-row>
      <el-table :data="OrderList" border stripe>
        <el-table-column type="index"></el-table-column>
        <el-table-column label="订单编号" prop="order_number"></el-table-column>
        <el-table-column label="订单价格" prop="order_price"></el-table-column>
        <el-table-column label="是否付款" prop="pay_status">
          <template slot-scope="scope">
            <el-tag type="success" v-if="scope.pay_status == '1'"
              >已付款</el-tag
            >
            <el-tag type="danger">未付款</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="是否发货" prop="is_send"></el-table-column>
        <el-table-column label="下单时间">
          <template slot-scope="scope">
            {{ scope.row.create_time | dateFormat }}
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="showBox"
            ></el-button>
            <el-button
              type="success"
              icon="el-icon-location"
              size="mini"
              @click="showProgressBox"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页区域 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[1, 2, 3, 4]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
      <!-- 对话框区域 -->
      <el-dialog
        title="修改地址"
        :visible.sync="addressDialogVisble"
        width="35%"
      >
        <el-form
          :model="addressForm"
          :rules="addressrules"
          ref="addresFormRef"
          label-width="100px"
        >
          <el-form-item label="省市区/县" prop="address1">
            <el-cascader
              v-model="addressForm.address1"
              :options="cityData"
            ></el-cascader>
          </el-form-item>
          <el-form-item label="详细地址" prop="address2">
            <el-input v-model="addressForm.address2"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="addressDialogVisble = false">取 消</el-button>
          <el-button type="primary">确 定</el-button>
        </span>
      </el-dialog>
      <!-- 展示物流进度 -->
      <el-dialog
        title="物流进度"
        :visible.sync="progressDialogVisble"
        width="35%"
      >
        <span slot="footer" class="dialog-footer"> </span>
      </el-dialog>
    </el-card>
  </div>
</template>
<script>
import cityData from './citydata.js'
export default {
  name: 'order',
  data() {
    return {
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 5,
      },
      OrderList: [],
      total: 0,
      addressDialogVisble: false,
      progressDialogVisble: false,
      addressForm: {
        address1: [],
        address2: '',
      },
      addressrules: {
        address1: [
          {
            reqired: true,
            message: '请输入地址',
            trigger: 'blur',
          },
        ],
        address2: [
          {
            reqired: true,
            message: '请输入地址',
            trigger: 'blur',
          },
        ],
      },
      cityData,
      progressInfo: [],
    }
  },
  created() {
    this.getOrderList()
  },
  methods: {
    async getOrderList() {
      const { data: res } = await this.$http.get('/orders', {
        params: this.queryInfo,
      })
      if (res.meta.status !== 200) return this.$message.error('请求错误')
      this.OrderList = res.data.goods
      this.total = res.data.total
    },
    handleSizeChange(newsize) {
      this.queryInfo.pagesize = newsize
      this.getOrderList()
    },
    handleCurrentChange(newpage) {
      this.queryInfo.pagenum = newpage
      this.getOrderList()
    },
    showBox() {
      this.addressDialogVisble = true
    },
    async showProgressBox() {
      const { data: res } = await this.$http.get('/kuaidi/804909574412544580')
      //   if (res.meta.status !== 200)
      //     return this.$message.error('获取物流信息失败')
      console.log(res)
      // this.progressInfo = res.data
      this.progressDialogVisble = true
      console.log(this.progressInfo)
    },
  },
}
</script>
<style lang="less" scoped>
</style>