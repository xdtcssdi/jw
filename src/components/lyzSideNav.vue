<template>
  <aside class="el-aside" :class="{'close-side':collapse}">
    <div class="side-top">
      <span v-show="!collapse">补考信息管理系统</span>
    </div>
    <div class="side-bottom">
      <el-menu :default-active="$route.path"
               :router="true"
               @select="handleSelect"
               background-color="#545c64"
               text-color="#fff"
               active-text-color="#ffd04b"
               :collapse="collapse"
               collapse-transition>
        <el-menu-item v-for="(item,index) in routerList" :key="index" :index="item.path+''">
          <i :class="item.icon"></i>
          <span>{{ item.name }}</span>
        </el-menu-item>
      </el-menu>
    </div>


  </aside>
</template>

<script>
import {mapState} from 'vuex';

export default {
  name: "lyzSideNav",
  data() {
    return {
      routerList: [],


    }
  },
  beforeCreate() {
    // this.$http.get('/user/current-user',{}).then(({body}) => {
    //   console.log(body);
    //   if (body.success === true) {
    //   } else {
    //     window.location.href = '/login.html';
    //   }
    // });
  },
  created() {
    this.getLeftMenus();
  },
  computed: mapState(['collapse']),
  methods: {
    getLeftMenus() {
      let menuList = [
        {'path': '/make_up', 'name': '补考信息管理', 'icon': 'el-icon-menu'},
        {'path': '/student', 'name': '补考学生信息管理', 'icon': 'el-icon-menu'},
        {'path': '/teacher', 'name': '监考老师信息管理', 'icon': 'el-icon-menu'},
        {'path': '/exam', 'name': '考试信息管理', 'icon': 'el-icon-menu'},
      ];

      if (localStorage.type === "student") {
        menuList = [
          {'path': '/make_up', 'name': '补考信息管理', 'icon': 'el-icon-menu'},
          // {'path':'/assignment', 'name':'作业信息管理','icon':'el-icon-menu'},
          {'path': '/address', 'name': '通讯录管理', 'icon': 'el-icon-menu'},];
      }

      if (localStorage.type === "teacher") {
        menuList = [
          {'path': '/make_up', 'name': '补考信息管理', 'icon': 'el-icon-menu'},
          {'path': '/assignment', 'name': '作业信息管理', 'icon': 'el-icon-menu'},
          {'path': '/address', 'name': '通讯录管理', 'icon': 'el-icon-menu'},];
      }


      this.routerList = menuList;
      this.$store.commit('setRouteList', this.routerList);
    },
    handleSelect() {

    },
  }
}
</script>

<style scoped lang="scss">
.el-aside {
  display: flex;
  flex-direction: column;

  &.close-side {
    .side-top {
      width: 65px;
      transition: width linear .3s;
    }

    .side-bottom {
      .el-menu--collapse {
        width: 65px;
        /*transition: width linear .4s;*/
      }
    }

  }

  .side-top {
    width: 210px;
    height: 60px;
    background: #1a6a98;
    text-align: center;
    line-height: 60px;
    color: white;
    font-size: 18px;
    /*transition: width linear .1s;*/
  }

  .side-bottom {
    flex: 1;

    .el-menu {
      height: 100%;
      border: 0;
    }
  }

}
</style>
