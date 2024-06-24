<template>
  <div class="userRights">
    <el-card class="userleft">
      <el-button type="primary" @click="increase" class="increaseBut">增加主菜单</el-button>
      <el-tree :data="menuList" node-key="id" :expand-on-click-node="false">
        <div class="custom-tree-node" slot-scope="{ node, data }">
          <span @click="() =>handleNodeClick(data)">{{ data.name }}</span>
          <span style="margin-left: 30px">
            <el-button type="text" size="mini" @click="() => append(data)">
              新增
            </el-button>
            <el-button type="text" size="mini" @click="() => remove(node, data)">
              删除
            </el-button>
          </span>
        </div>
      </el-tree>
    </el-card>
    <el-card class="userleft">
      <el-form ref="form" :rules="rules" :model="form" label-width="100px">
        <div class="menu">
          {{titles}}
        </div>
        <el-form-item label="name" prop="name">
          <el-input v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item label="weight" prop="weight">
          <el-input v-model="form.weight"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onchange" v-if="state==1" v-loading.fullscreen.lock="fullscreenLoading">立即更改</el-button>
          <el-button type="primary" @click="onSubmit" v-else v-loading.fullscreen.lock="fullscreenLoading">立即添加</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
    import {
      apiWeight,
      weightQuery,
      updateWeight,
      deleteWeight,
      subWeight,
      deletesubWeight,
      updateubWeight
    } from "@/api/weight.js"
    import { MessageBox, Message } from 'element-ui'
  export default {
    name: 'userRights',
    data() {
      return {
         fullscreenLoading: false,
         childState:true,
          weight:1,
          titles: "增加主菜单",
          menuList: [],
          form: {
            weight: '',
            name: '',
          },
          state: 0,
          rules: {
            name: [{
              required: true,
              message: '请输入name',
              trigger: 'blur'
            }],
            weight: [{
              required: true,
              message: '请输入weight',
              trigger: 'blur'
            }],
        },
      };
    },
    mounted() {
      this.list()
    },
    methods: {
      list() {
        weightQuery().then((res)=>{
            this.menuList=res.data
            this.fullscreenLoading = false;
        })
      },
      increase() {
        this.form = {
          weight: '',
          name: '',
        }
        this.weight=1
        this.titles = "增加主菜单"
      },
      onSubmit() {
         this.fullscreenLoading = true;
        this.$refs.form.validate((valid) => {
          if (valid) {
            if(this.weight==1){
              apiWeight(this.form).then((res)=>{
                this.list()
              })
            }else{
              subWeight(this.form).then((res)=>{
                this.list()
              })
            }
          } else {
            return false;
          }
        })
      },
      onchange() {
            this.fullscreenLoading = true;
        this.$refs.form.validate((valid) => {
          if (valid) {
             if(this.childState){
               updateWeight(this.form).then((res)=>{
                 this.list()
               })
             }else{
               updateubWeight(this.form).then((res)=>{
                 this.list()
               })
             }
          } else {
            return false;
          }
        })
      },
      handleNodeClick(data) {
        console.log(data)
        this.form = {
          weight: data.weight,
          name: data.name,
          id:data.id
        }
        if(data.childid){
          this.childState=true
        }else{
          this.childState=false
        }
        this.state = 1
        this.titles = "更改" + data.name
      },
      append(data) {
        if(data.pid){
          this.form = {
            weight: '',
            name: '',
            childid:data.id,
            pid:data.pid
          }
        }else{
          this.form = {
            weight: '',
            name: '',
            childid:0,
            pid:data.id
          }
        }
        console.log(this.form)
        this.state = 0
        this.weight=2
        this.titles = "父菜单:" + data.name
      },
      remove(node, data) {
        if ( !Array.isArray(data.children) || data.children.length === 0) {
          this.fullscreenLoading = true;
          // var that
          this.$confirm('此操作将删除该菜单, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            if(!data.childid){
              deleteWeight({id:data.id}).then((res)=>{
                  this.list()
              })
            }else{
              deletesubWeight({id:data.id}).then((res)=>{
                  this.list()
              })
            }
          }).catch(() => {
            this.fullscreenLoading = false;
            this.$message({
              type: 'info',
              message: '已取消删除'
            });
          });
        }else{
          Message({
            message: "无法删除",
            type: 'error',
            duration: 5 * 1000
          })
        }
      },
    }
  };
</script>

<style>
  .userRights {
    width: 90%;
    padding: 40px;
    display: flex;
    justify-content: space-between;
    box-sizing: border-box;
    margin-left: 70px;
  }

  .custom-tree-node {
    width: 600px;
  }

  .increaseBut {
    margin: 10px 0 40px 10px;
  }

  .userleft {
    width: 38%;
    height: 700px;
  }

  .menu {
    text-align: center;
    font-size: 20px;
    font-weight: bold;
    margin: 20px 0;
  }
</style>
