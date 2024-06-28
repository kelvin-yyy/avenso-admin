<template>
  <div class="dashboard-container">
    <el-button type="primary" @click="news()">新增</el-button>
    <el-table :data="tableData" v-loading="loading" border style="width: 100%">
      <el-table-column prop="DetailsId" label="公司id">
      </el-table-column>
      <el-table-column prop="phone" label="电话">
      </el-table-column>
      <el-table-column prop="expectedRevenue" label="预计收益">
      </el-table-column>
      <el-table-column prop="FoundedDate" label="成立时间">
      </el-table-column>
      <el-table-column prop="OperatingStatus" label="经营状况">
      </el-table-column>
      <el-table-column prop="LastFundingType" label="最后融资类型">
      </el-table-column>
      <el-table-column prop="companyType" label="公司类型">
      </el-table-column>
      <el-table-column prop="email" label="email">
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
        <el-form-item label="行业">
          <div v-for="item in Industries">
            <div style="display: flex;align-items: center;">
              <el-input v-model="item.name"></el-input>
              <i class="el-icon-circle-plus-outline" @click="newinput" style="font-size:20px;margin-left: 10px;"></i>
              <i class="el-icon-remove-outline" @click="delectinput(i)" style="font-size:20px"></i>
            </div>
          </div>
        </el-form-item>
        <el-form-item label="总部区域">
          <div v-for="item in HeadquartersRegion">
            <div style="display: flex;align-items: center;">
              <el-input v-model="item.name"></el-input>
              <i class="el-icon-circle-plus-outline" @click="newregion" style="font-size:20px;margin-left: 10px;"></i>
              <i class="el-icon-remove-outline" @click="delectregion(i)" style="font-size:20px"></i>
            </div>
          </div>
        </el-form-item>
        <el-form-item label="创始人">
          <div v-for="item in Founders">
            <div style="display: flex;align-items: center;">
              <el-input v-model="item.name"></el-input>
              <i class="el-icon-circle-plus-outline" @click="newFounders" style="font-size:20px;margin-left: 10px;"></i>
              <i class="el-icon-remove-outline" @click="delectFounders(i)" style="font-size:20px"></i>
            </div>
          </div>
        </el-form-item>
        <el-form-item label="电话">
          <el-input v-model="newform.phone"></el-input>
        </el-form-item>
        <el-form-item label="预计收益">
          <el-input v-model="newform.expectedRevenue"></el-input>
        </el-form-item>
        <el-form-item label="成立时间">
          <el-date-picker
                v-model="newform.FoundedDate"
                type="date"
                placeholder="选择日期">
              </el-date-picker>
        </el-form-item>
        <el-form-item label="经营状况">
          <el-input v-model="newform.OperatingStatus"></el-input>
        </el-form-item>
        <el-form-item label="最后融资类型">
          <el-input v-model="newform.LastFundingType"></el-input>
        </el-form-item>
        <el-form-item label="公司类型">
          <el-input v-model="newform.companyType"></el-input>
        </el-form-item>
        <el-form-item label="email">
          <el-input v-model="newform.email"></el-input>
        </el-form-item>
        <el-form-item label="公司id">
           <el-select v-model="newform.DetailsId" placeholder="请选择">
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
    newDetails,
    allcompany,
    companyDetails,
    updateDetails,
    deleteDetails
  } from "@/api/weight.js"
  export default {
    name: 'loginLog',
    data() {
      return {
        form: {
          pages: 1,
          pageSize:5,
        },
        Industries:[{name:''}],
        HeadquartersRegion:[{name:''}],
        Founders:[{name:''}],
        tableData:[],
        total: 0,
        currentPage: 0,
        loading: false,
        pageCount: 0,
        newdialog:false,
        state:1,
        options:[],
        newform:{
          phone:"",
          Industries:[],
          HeadquartersRegion:[],
          Founders:[],
          FoundedDate:"",
          expectedRevenue:"",
          OperatingStatus:"",
          LastFundingType:"",
          companyType:"",
          email:"",
          DetailsId:""
        }
      }
    },
    mounted() {
      this.list()

    },
    computed: {},
    methods: {
      newinput(){
        this.Industries.push({name:""})
      },
      delectinput(i){
        this.Industries.splice(i,1)
      },
      newregion(){
        this.HeadquartersRegion.push({name:""})
      },
      delectregion(i){
        this.HeadquartersRegion.splice(i,1)
      },
      newFounders(){
        this.Founders.push({name:""})
      },
      delectFounders(i){
        this.Founders.splice(i,1)
      },
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
         phone:"",
         Industries:[],
         HeadquartersRegion:[],
         Founders:[],
         expectedRevenue:"",
         OperatingStatus:"",
         LastFundingType:"",
         companyType:"",
         email:"",
         DetailsId:""
       }
       this.Industries=[{name:''}]
       this.HeadquartersRegion=[{name:''}]
       this.Founders=[{name:''}]
     },
     updateClick(row){
       this.newdialog=true
       this.newform=row
       this.state=2
       this.Industries=[]
       this.HeadquartersRegion=[]
       this.Founders=[]
       row.Industries.forEach((res)=>{
         this.Industries.push({name:res})
       })
       row.HeadquartersRegion.forEach((res)=>{
         this.HeadquartersRegion.push({name:res})
       })
       row.Founders.forEach((res)=>{
         this.Founders.push({name:res})
       })
     },
     handleClick(row){
            // var that
            this.$confirm('此操作将删除该Details, 是否继续?', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
                deleteDetails({id:row.id}).then((res)=>{
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
        var that=this
        this.Industries.forEach((res)=>{
          this.newform.Industries.push(res.name)
        })
        this.HeadquartersRegion.forEach((res)=>{
          this.newform.HeadquartersRegion.push(res.name)
        })
        this.Founders.forEach((res)=>{
          this.newform.Founders.push(res.name)
        })
        companyDetails(this.newform).then((res)=>{
          this.newdialog=false
          this.list()
        })
      },
      updateChecked(){
        this.newform.Industries=[]
        this.newform.HeadquartersRegion=[]
        this.newform.Founders=[]
        this.Industries.forEach((res)=>{
          this.newform.Industries.push(res.name)
        })
        this.HeadquartersRegion.forEach((res)=>{
          this.newform.HeadquartersRegion.push(res.name)
        })
        this.Founders.forEach((res)=>{
          this.newform.Founders.push(res.name)
        })
        updateDetails(this.newform).then((res)=>{
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
        newDetails(this.form).then((res)=>{
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
