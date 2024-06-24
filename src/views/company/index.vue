<template>
  <div class="dashboard-container">
    <table-Title :title="'设备列表'"></table-Title>
    <el-form ref="form" :model="form" label-width="100px">
      <div class="fromClass">
        <el-form-item label="设备类型" prop="type">
          <el-select class="selectClass" v-model="form.investmentType" clearable placeholder="请选择设备类型">
            <el-option v-for="item in companyType" :key="item.id" :label="item.name" :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit">立即查询</el-button>
          <el-button type="warning" @click="Reset">刷新</el-button>
        </el-form-item>
      </div>
    </el-form>
    <el-table :data="tableData" v-loading="loading" border style="width: 100%">
      <el-table-column prop="name" label="公司名字">
      </el-table-column>
      <el-table-column prop="Avatar" label="头像">
        <template slot-scope="scope">
          <img :src="scope.row.Avatar" alt="" srcset="" />
        </template>
      </el-table-column>
      <el-table-column prop="introduction" label="公司介绍">
      </el-table-column>
      <el-table-column prop="creatDate" label="创建时间">
      </el-table-column>
      <el-table-column prop="type" label="类型">
      </el-table-column>
      <el-table-column prop="investmentType" label="分类">
      </el-table-column>
      <el-table-column fixed="right" label="操作">
        <template slot-scope="scope">
          <el-button @click="handleClick(scope.row)" type="text" size="small">添加权重</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog title="提示" :visible.sync="dialogVisible" width="30%" :before-close="handleClose">
      <div class="dialog">
        <el-tree :data="menuList" show-checkbox default-expand-all node-key="id" ref="tree" highlight-current
          @check="treeCheck" :props="defaultProps">
          <div class="custom-tree-node" slot-scope="{ node, data }">
            <span>{{ data.name }}</span>
          </div>
        </el-tree>
      </div>
      <el-button @click="getCheckedNodes">设置</el-button>
      <el-button @click="handleClose">取消</el-button>
    </el-dialog>
    <div class="block">
      <el-pagination @current-change="handleCurrentChange" @size-change="handleSizeChange" :page-sizes="[5,10,15,20]"
        :current-page="currentPage" :page-size="pageCount" layout="total,sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>
    </div>
  </div>
</template>

<script>
  import {
    apiRead,
    weightQuery,
    updateubcompany
  } from "@/api/weight.js"
  export default {
    name: 'loginLog',
    data() {
      return {
        // 分页
        total: 0,
        currentPage: 0,
        loading: false,
        pageCount: 0,
        dialogVisible: false,
        tableData: [],
        menuList: [],
        my_key: [],
        selectId: [],
        companyId: "",
        form: {
          name: "",
          investmentType: "investmentCompany",
          pages: 1,
          pageSize: 4,
        },
        defaultProps: {
          children: 'children',
          label: 'label'
        },
        companyType: [{
            name: "investment company",
            id: "investmentCompany"
          },
          {
            name: "General Company",
            id: "otherCompanies"
          }
        ]
      }
    },
    mounted() {
      this.list()
      this.messageTitle = "获取"
    },
    computed: {},
    methods: {

      getCheckedNodes() {
        this.selectId = []; // 清空 selectId 数组
        var acc = 0;
        var checkedNodes = this.$refs.tree.getCheckedNodes();
        checkedNodes.forEach((node) => {
          if (!Array.isArray(node.children) || node.children.length === 0) {
            this.selectId.push(node.id);
          }
          const weight = parseFloat(node.weight) || 0; // 使用 parseFloat 转换 weight 并处理无效值
          acc += weight;
        });
        updateubcompany({
          id: this.companyId,
          selectId: this.selectId,
          weight: acc
        }).then((res) => {
          console.log(res)
          this.$message({
            message: '权重设置成功',
            type: 'success'
          })
          this.handleClose()
          this.list()
        })
        // 在这里，你可以将 acc 或 selectId 发送到后端或进行其他处理
        // ...
      },
      // 刷新
      Reset(formName) {
        this.$refs.form.resetFields()
        this.list()
        this.messageTitle = "刷新"
      },
      handleClose() {
        this.dialogVisible = false
        this.$refs.tree.setCheckedKeys([])
      },

      treeCheck(data) {
        // 假设 data 是被点击或选中的节点的数据对象
        let currentNode = this.$refs.tree.getNode(data.id); // 获取当前节点
        let keys = [data]; // 初始化已勾选节点的key值数组

        // 如果当前节点存在且被选中
        if (currentNode && currentNode.checked) {
          // 向上遍历父节点，直到根节点
          let parentNode = currentNode.parent;
          while (parentNode) {
            // 设置父节点的 checked 属性为 true，即选中父节点
            parentNode.checked = true;
            // 将父节点的 key 添加到 keys 数组中
            keys.unshift(parentNode.data); // 确保添加的是id
            // 继续向上遍历
            parentNode = parentNode.parent;
          }
        }

      },
      list() {
        this.loading = true
        apiRead(this.form).then((res) => {
          console.log(res)
          this.loading = false
          this.tableData = res.data.data
          this.currentPage = res.data.pager_count
          this.pageCount = res.data.page_size
          this.total = res.data.total
        })
      },
      handleClick(v) {
        console.log(v)
        this.companyId = v.id
        this.dialogVisible = true
        weightQuery().then((res) => {
          this.menuList = res.data
          this.$refs.tree.setCheckedKeys(v.selectId);
        })
      },
      handleCurrentChange(v) {
        this.form.pages = v
        this.list()
      },
      handleSizeChange(val) {
        this.form.pageSize = val
        this.list()
      },
      onSubmit() {
        this.form.pages = 1
        this.messageTitle = "查询"
        this.list()
      },
    },
    watch: {}
  }
</script>
<style type="text/css">
  .dashboard-container {
    padding: 40px;
  }

  .block {
    margin-top: 20px;
    text-align: right;
    margin-right: 30px;
  }

  .dialog {
    min-height: 400px;
  }
</style>
