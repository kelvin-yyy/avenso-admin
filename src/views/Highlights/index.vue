<template>
  <div class="dashboard-container">
    <el-button type="primary" @click="news()">新增</el-button>
    <el-table :data="tableData" v-loading="loading" border style="width: 100%">
      <el-table-column prop="HighlightsId" label="公司">
      </el-table-column>
      <el-table-column prop="contacts" label="联络">
      </el-table-column>
      <el-table-column prop="EmployeeProfiles" label="员工档案">
      </el-table-column>
      <el-table-column prop="investor" label="投资人数">
      </el-table-column>
      <el-table-column prop="similarCompanies" label="类似公司">
      </el-table-column>
      <el-table-column prop="Funding" label="资金">
      </el-table-column>
      <el-table-column prop="boardMember" label="董事会成员">
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
        <el-form-item label="联络">
          <el-input v-model="newform.contacts"></el-input>
        </el-form-item>
        <el-form-item label="员工档案">
          <el-input v-model="newform.EmployeeProfiles"></el-input>
        </el-form-item>
        <el-form-item label="投资人数">
          <el-input v-model="newform.investor"></el-input>
        </el-form-item>
        <el-form-item label="类似公司">
          <el-input v-model="newform.similarCompanies"></el-input>
        </el-form-item>
        <el-form-item label="资金">
          <el-input v-model="newform.Funding"></el-input>
        </el-form-item>
        <el-form-item label="董事会成员">
          <el-input v-model="newform.boardMember"></el-input>
        </el-form-item>
        <el-form-item label="公司">
           <el-select v-model="newform.HighlightsId" placeholder="请选择">
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
    newHighlights,
    allcompany,
    companyHighlights,
    updateHighlights,
    deleteHighlights
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
          HighlightsId:"",
          contacts:"",
          EmployeeProfiles:"",
          investor:"",
          similarCompanies:"",
          Funding:"",
          boardMember:"",
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
         contacts:"",
         EmployeeProfiles:"",
         investor:"",
         similarCompanies:"",
         Funding:"",
         boardMember:"",
       }
     },
     updateClick(row){
       this.newdialog=true
       this.newform=row
       this.state=2
     },
     handleClick(row){
            // var that
            this.$confirm('此操作将删除该Highlights, 是否继续?', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
                deleteHighlights({id:row.id}).then((res)=>{
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
        companyHighlights(this.newform).then((res)=>{
          this.newdialog=false
          this.list()
        })
      },
      updateChecked(){
        updateHighlights(this.newform).then((res)=>{
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
        newHighlights(this.form).then((res)=>{
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
