<template>
  <div class="dashboard-container">
    <el-button type="primary" @click="news()">新增</el-button>
    <el-table :data="tableData" v-loading="loading" border style="width: 100%">
      <el-table-column prop="contact_informationId" label="公司">
      </el-table-column>
      <el-table-column prop="name" label="名字">
      </el-table-column>
      <el-table-column prop="position" label="职位">
      </el-table-column>
      <el-table-column prop="administration" label="管理">
      </el-table-column>
      <el-table-column prop="management_position" label="管理职位">
      </el-table-column>
      <el-table-column prop="email" label="email">
      </el-table-column>
      <el-table-column prop="phone" label="phone">
      </el-table-column>
      <el-table-column prop="phones" label="phones">
      </el-table-column>
      <el-table-column fixed="right" label="操作">
        <template slot-scope="scope">
          <el-button   @click="updateClick(scope.row)" type="text" size="small">更改</el-button>
          <el-button @click="handleClick(scope.row)" type="text" size="small">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog :title="state==1?'新增':'修改'" :visible.sync="newdialog"   width="30%" :before-close="newClose">
      <el-form ref="newform" :model="newform" label-width="80px">
        <el-form-item label="名字">
          <el-input v-model="newform.name"></el-input>
        </el-form-item>
        <el-form-item label="职位">
          <el-input v-model="newform.position"></el-input>
        </el-form-item>
        <el-form-item label="管理">
          <el-input v-model="newform.administration"></el-input>
        </el-form-item>
        <el-form-item label="管理职位">
          <el-input v-model="newform.management_position"></el-input>
        </el-form-item>
        <el-form-item label="email">
          <el-input v-model="newform.email"></el-input>
        </el-form-item>
        <el-form-item label="phone">
          <el-input v-model="newform.phone"></el-input>
        </el-form-item>
        <el-form-item label="phones">
          <el-input v-model="newform.phones"></el-input>
        </el-form-item>
        <el-form-item label="公司">
           <el-select v-model="newform.contact_informationId" placeholder="请选择">
              <el-option
                v-for="item in options"
                :key="item.id"
                :label="item.name"
                :value="item.id">
              </el-option>
            </el-select>
        </el-form-item>
          <el-form-item>
        <el-button @click="establishChecked()" type="primary"  v-if="state==1">确定</el-button>
        <el-button @click="updateChecked()" type="primary"  v-else>更改</el-button>
        <el-button @click="newClose()">取消</el-button>
        </el-form-item>
      </el-form>
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
    newcontact,
    allcompany,
    companycontact,
    updatecontact,
    deletecontact
  } from "@/api/weight.js"
  export default {
    name: 'loginLog',
    data() {
      return {
        form: {
          pages: 1,
          pageSize:5,
        },
        tableData:[],
        total: 0,
        currentPage: 0,
        loading: false,
        pageCount: 0,
        newdialog:false,
        state:1,
        options:[],
        newform:{
          contact_informationId:"",
          name:"",
          position:"",
          administration:"",
          management_position:"",
          email:"",
          phone:"",
          phones:"",
        }
      }
    },
    mounted() {
      this.list()

    },
    computed: {},
    methods: {
      news(){
        this.state=1
        this.newdialog=true
        this.resetFields()
        allcompany().then((res)=>{
          this.options=res.data
        })
      },
     resetFields(){
       this.newform={
         HighlightsId:"",
         name:"",
         position:"",
         administration:"",
         management_position:"",
         email:"",
         phone:"",
       }
     },
     updateClick(row){
       this.newdialog=true
       this.newform=row
       this.state=2
     },
     handleClick(row){
            // var that
            this.$confirm('此操作将删除该contact, 是否继续?', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
                deletecontact({id:row.id}).then((res)=>{
                  this.list()
                  this.$message({
                    type: 'success',
                    message: '删除成功'
                  });
                })
            }).catch(() => {
              this.$message({
                type: 'info',
                message: '已取消删除'
              });
            });
     },
      establishChecked(){
        console.log(this.newform)
        companycontact(this.newform).then((res)=>{
          this.newdialog=false
          this.list()
        })
      },
      updateChecked(){
        updatecontact(this.newform).then((res)=>{
          this.newdialog=false
          this.resetFields()
          this.list()
        })
      },
      newClose(){
          this.newdialog=false
          this.state=2
      },
      list(){
        newcontact(this.form).then((res)=>{
          this.tableData=res.data.data
          this.currentPage = res.data.currentPage
          this.pageCount = res.data.page_size
          this.total = res.data.pager_count
          this.resetFields()
          this.state=1
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
  .fromClass{
    display: flex;
    justify-content: space-between;
  }
</style>
