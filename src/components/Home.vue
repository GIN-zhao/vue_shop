<template>
  <!-- 头部区域 -->
  <el-container class="home-container">
    <el-header>
      <div>
        <img src="../assets/img/love.jpg" alt="" />
      </div>
      <span>CodeBug的管理系统</span>

      <el-button class="btn1" type="info" @click="logout">exit</el-button>
    </el-header>
    <!-- 主体区域 -->
    <el-container>
      <!-- 侧边区域 -->
      <el-aside :width="flag ? '64px' : '200px'">
        <div class="toggle-button" @click="toggleCollapese">|||</div>
        <el-menu
          :router="true"
          :unique-opened="true"
          background-color="#333744"
          text-color="#fff"
          active-text-color="aqua"
          :collapse="flag"
          :collapse-transition="false"
          :default-active="activePath"
        >
          <!-- //一级菜单 -->
          <el-submenu
            :index="item.id + ''"
            v-for="item in menulist"
            :key="item.id"
          >
            <!-- 一级菜单模板 -->
            <template slot="title">
              <!-- icon -->
              <i :class="iconsObj[item.id]"></i>
              <!-- text -->
              <span>{{ item.authName }}</span>
            </template>
            <!-- 二级菜单 -->
            <el-menu-item
              :index="'/' + subitem.path"
              v-for="subitem in item.children"
              :key="subitem.id"
              @click="saveNavState('/' + subitem.path)"
            >
              <template slot="title">
                <!-- icon -->
                <i class="el-icon-menu"></i>
                <!-- text -->
                <span>{{ subitem.authName }}</span>
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu></el-aside
      >
      <!-- 右侧主体区域 -->
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>
<script>
export default {
  name: 'home',
  data() {
    return {
      menulist: [],
      iconsObj: {
        125: 'iconfont icon-user',
        103: 'iconfont icon-tijikongjian',
        101: 'iconfont icon-shangpin',
        102: 'iconfont icon-danju',
        145: 'iconfont icon-baobiao',
      },
      //绑定collpase
      flag: true,
      activePath: '',
    }
  },
  created() {
    this.getMenuList(),
      (this.activePath = window.sessionStorage.getItem('activepath'))
  },
  methods: {
    logout() {
      window.sessionStorage.clear()
      this.$router.push('/login')
    },
    async getMenuList() {
      const { data: res } = await this.$http.get('/menus')
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.menulist = res.data
      console.log(res)
    },
    //点击按钮切换菜单折叠和展开
    toggleCollapese() {
      this.flag = !this.flag
    },
    //保存链接的激活状态
    saveNavState(activepath) {
      window.sessionStorage.setItem('activepath', activepath)
      this.activePath = activepath
    },
  },
}
</script>
<style  scoped>
.el-menu {
  border: none;
}
.el-header {
  display: flex;
  background-color: #373d41;
  justify-content: space-between;
  padding-left: 0;
  align-items: center;
  color: #fff;
}
.el-header > div {
  width: 50px;
  height: 50px;
  display: flex;
  align-items: center;
}
.el-header div > img {
  width: 80%;
  height: 80%;
  border-radius: 50%;
}
.el-header > span {
  color: aqua;
  font-size: 20px;
  text-shadow: 2px 2px 2px aqua;
}
.btn1 {
  /* position: absolute;
  right: 10%;
  top: 50%;
  transform: translateY(-50%); */
}
.el-aside {
  background-color: #333744;
}
.el-main {
  background-color: #eaedf1;
}
.home-container {
  width: 100%;
  height: 100%;
}
.iconfont {
  margin-right: 10px;
  font-size: 20px;
  color: skyblue;
}
.toggle-button {
  background-color: #4a5064;
  font-size: 10px;
  line-height: 24px;
  color: aqua;
  text-align: center;
  letter-spacing: 0.2em;
  cursor: pointer;
  transition: 0.3s;
}
.toggle-button:hover {
  background-color: rgb(48, 105, 131);
}
</style>