<template>
  <el-container class="home-container">
    <el-aside class="aside-container" :width="menuCollapse ? ' 64px' : '200px'">
      <div class="logo-area">
        <img src="../assets/wzut-logo.jpg" :width="menuCollapse ? '30px' : '80px'" />
        <div v-show="!menuCollapse">框架设计课程</div>
      </div>
      <hr />
      <el-menu background-color="#253a49" text-color="#fff" active-text-color="#ffd04b" :collapse="menuCollapse"
        :collapse-transition="false" :router="true">
        <el-submenu v-for="item in menuList" :index="item.id" :key="item.id">
          <template slot="title">
            <i :class="item.iconClass"></i>
            <span>{{ item.title }}</span>
          </template>
          <el-menu-item v-for="subItem in item.children" :index="subItem.route" :key="subItem.id">
            <i :class="subItem.iconClass"></i>
            {{ subItem.title }}
          </el-menu-item>
        </el-submenu>
      </el-menu>
    </el-aside>

    <el-container>
      <el-header class="header-container">
        <div class="toggle-button">
          <i :class="menuCollapse ? 'el-icon-s-unfold' : 'el-icon-s-fold'" @click="toggleMenuCollapse"></i>
        </div>


        <el-dropdown class="user-info">
          <span class="el-dropdown-link">
            用户名称<i class="el-icon-arrow-down el-icon--right"></i>
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item>用户信息</el-dropdown-item>
            <el-dropdown-item divided>退出</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </el-header>

      <el-main class="work-container">
        <el-breadcrumb separator="/">
          <el-breadcrumb-item v-for="item in breadCrumb" :to="item.path" :key="item.path">
            {{ item.meta }}
          </el-breadcrumb-item>
        </el-breadcrumb>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  data() {
    return {
      menuCollapse: false,
      breadCrumb: [],
      menuList: [
        {
          id: "1",
          title: "系统管理",
          iconClass: "el-icon-setting",
          children: [
            {
              id: "1-1",
              title: "用户管理",
              iconClass: "el-icon-user",
              route: "/sysuser",
            },
            {
              id: "1-2",
              title: "组织管理",
              iconClass: "el-icon-house",
              route: "/sysdept",
            },
            {
              id: "1-3",
              title: "角色管理",
              iconClass: "el-icon-document-copy",
              route: "/sysrole",
            },
            {
              id: "1-4",
              title: "菜单管理",
              iconClass: "el-icon-mobile",
              route: "/sysmenu",
            },
          ],
        },
        {
          id: "2",
          title: "应用管理",
          iconClass: "el-icon-tableware",
          children: null,
        },
        {
          id: "3",
          title: "试卷管理",
          iconClass: "el-icon-dish",
          children: [
            {
              id: "3-1",
              title: "题目管理",
              iconClass: "el-icon-mobile",
              route: "/quest",
            },
          ],
        },
      ],
    };
  },
  watch: {
    $route: {
      //监控$route变量的变化
      handler() {
        this.breadCrumb = this.$route.matched;
      },
    },
  },
  created() {
    this.breadCrumb = this.$route.matched;
  },
  methods: {
    toggleMenuCollapse() {
      this.menuCollapse = !this.menuCollapse;
    },
  },
};
</script>

<style lang="less" scoped>
.home-container {
  height: 100%; //确保全屏
  border: 1px solid #eee;
}

.header-container {
  background-color: #fcfcfc;
  border-bottom: #eeeeee 1px solid;
  font-size: 12px;
  display: flex;
  justify-content: space-between;
  align-items: center;

  .toggle-button {
    align-items: center;
    text-align: left;
    font-size: 30px;
    color: #8c8b8b;
    cursor: pointer;
  }

  .search {
    width: 350px;
  }
}

.aside-container {
  background-color: #253a49;

  .el-menu {
    border-right: 0px;
  }

  .logo-area {
    height: 120px;
    padding: 20px;
    width: 100px;
    position: relative;
    left: 50%;
    transform: translate(-50%, 0%);
    text-align: center;
    color: lightgrey;
  }

  hr {
    border: 1px inset grey;
  }
}

.work-container {
  background-color: #ffffff;

  .el-breadcrumb {
    padding-bottom: 10px;
  }
}
</style>