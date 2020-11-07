<template>

  <section class="el-container is-horizontal">

    <section class="el-container is-vertical" style="width: 50%">
      <header class="el-header"
              style="text-align: left;height: 60px;border-radius: 5px;background-color: #aca5a5;padding: 20px">目录
      </header>
      <section class="el-container" style="margin-top: 50px">
        <el-tree
            class="el-aside"
            :data="data"
            show-checkbox
            node-key="id"
            default-expand-all
            :expand-on-click-node="false">
        </el-tree>
      </section>
    </section>

    <section class="el-container" style="height: 60px;width: 50%;padding: 20px">
      <header>

        <el-input placeholder="请输入内容" style="width: 300px"></el-input>
      </header>
    </section>
  </section>

</template>

<script>


import lyzLayout from '@/components/lyzLayout';
import manage from '../manage.component';


export default {
  name: "info",
  data() {
    const data = [{
      id: 1,
      label: '第一章 第一单元',
      children: [{
        id: 2,
        label: '1.1 第一课时',
      }, {
        id: 3,
        label: '1.2 第二课时',
      }, {
        id: 4,
        label: '1.3 第三课时',
      }, {
        id: 5,
        label: '1.4 第四课时',
      }]
    }];
    return {
      data: JSON.parse(JSON.stringify(data)),
    }
  },
  components: {
    lyzLayout,
  },
  mixins: [manage],
  created() {

  },
  mounted() {
  },
  methods: {}

}
</script>

<style scoped>
.el-aside {
  text-align: center;
  width: 100%;
}

.el-main {
  text-align: center;
  width: 300px;
}

</style>
