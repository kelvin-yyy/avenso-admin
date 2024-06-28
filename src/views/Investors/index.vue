<template>
  <div class="dashboard-container">
    <el-button type="primary" @click="news()">新增</el-button>
    <el-table :data="tableData" v-loading="loading" border style="width: 100%">
      <el-table-column prop="InvestorsId" label="公司id">
      </el-table-column>
      <el-table-column prop="investorName" label="投资者名称">
      </el-table-column>
      <el-table-column prop="leadInvestor" label="领投投资者">
      </el-table-column>
      <el-table-column prop="fundingRound" label="融资轮次">
      </el-table-column>
      <el-table-column prop="partners" label="伙伴">
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
        <el-form-item label="投资者名称">
          <el-input v-model="newform.investorName"></el-input>
        </el-form-item>
        <el-form-item label="领投投资者">
          <el-input v-model="newform.leadInvestor"  ></el-input>
        </el-form-item>
        <el-form-item label="融资轮次">
          <el-input v-model="newform.fundingRound"></el-input>
        </el-form-item>
        <el-form-item label="伙伴">
          <el-input v-model="newform.partners"></el-input>
        </el-form-item>
        <el-form-item label="公司">
           <el-select v-model="newform.InvestorsId" placeholder="请选择">
              <el-option
                v-for="item in options"
                :key="item.id"
                :label="item.name"
                :value="item.id">
              </el-option>
            </el-select>
        </el-form-item>
        <el-form-item label="上传投资者头像">
           <el-upload
             action="#"
             :http-request="handleFileUpload"
             list-type="picture-card"
             :file-list="fileList"
             :limit="1"
             :on-preview="handlePictureCardPreview"
             :on-remove="handleRemove">
             <i class="el-icon-plus"></i>
           </el-upload>
           <!-- <el-dialog :visible.sync="dialogVisible"></el-dialog> -->
        </el-form-item>
        <el-form-item label="上传融资头像">
           <el-upload
             action="#"
             :http-request="handleFileUpload1"
             list-type="picture-card"
             :file-list="fileList1"
             :limit="1"
             :on-preview="handlePictureCardPreview1"
             :on-remove="handleRemove1">
             <i class="el-icon-plus"></i>
           </el-upload>
           <!-- <el-dialog :visible.sync="dialogVisible"></el-dialog> -->
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
    newInvestors,
    allcompany,
    file_upload,
    companyInvestors,
    updateInvestors,
    deleteInvestors
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
        fileList:[],
        fileList1:[],
        newform:{
         investorName:"",
         leadInvestor:"",
         fundingRound:"",
         partners:"",
         InvestorsId:"",
         investorNameImg:"",
         fundingRoundImg:""
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
        investorName:"",
        leadInvestor:"",
        fundingRound:"",
        partners:"",
        InvestorsId:"",
        investorNameImg:"",
        fundingRoundImg:""
       }
       this.fileList=[]
       this.fileList1=[]
     },

     updateClick(row){
       this.newdialog=true
       this.newform=row
       this.state=2
       this.fileList.push({url:row.investorNameImg})
       this.fileList1.push({url:row.fundingRoundImg})
     },
     handleClick(row){
            // var that
            this.$confirm('此操作将删除该fundingRounds, 是否继续?', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
                deleteInvestors({id:row.id}).then((res)=>{
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
        this.fileList.forEach((res)=>{
          this.newform.investorNameImg=res.url
        })
        this.fileList1.forEach((res)=>{
          this.newform.fundingRoundImg=res.url
        })
        companyInvestors(this.newform).then((res)=>{
          this.newdialog=false
          this.list()
        })
      },
      updateChecked(){
       this.fileList.forEach((res)=>{
         this.newform.investorNameImg=res.url
       })
       this.fileList1.forEach((res)=>{
         this.newform.fundingRoundImg=res.url
       })
        updateInvestors(this.newform).then((res)=>{
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
        newInvestors(this.form).then((res)=>{
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

    handleRemove1(file, fileList) {
       console.log(file, fileList);
       this.fileList1=[]
     },
     handlePictureCardPreview1(file) {
       this.dialogVisible = true;
     },
    async handleFileUpload1(file) {
    	var that = this
    		const fileName=file.file.name
    	const formData = new FormData()
    	formData.append('file', file.file)
    	// 调用后端服务器的接口
    	file_upload(formData,{
    			 headers: {
    			            'Content-Type': 'multipart/form-data' // 让axios知道请求体是multipart/form-data类型
    			          }
    		}).then((res) => {
    			if (res.status == 200) {
             this.fileList1.push({url:res.data.data})
    					 this.$message({
    					   message: '上传成功',
    					   type: 'success'
    					 })
    			} else {
    					this.$message({
    					  message: '上传失败',
    					  type: 'error'
    					})
    			}
    		})
    		.catch(error => {
    				this.$message({
    				  message: '上传失败',
    				  type: 'error'
    				})
    		});

    },

      handleRemove(file, fileList) {
         console.log(file, fileList);
         this.fileList=[]
       },
       handlePictureCardPreview(file) {
         this.dialogVisible = true;
       },
      async handleFileUpload(file) {
      	var that = this
      		const fileName=file.file.name
      	const formData = new FormData()
      	formData.append('file', file.file)
      	// 调用后端服务器的接口
      	file_upload(formData,{
      			 headers: {
      			            'Content-Type': 'multipart/form-data' // 让axios知道请求体是multipart/form-data类型
      			          }
      		}).then((res) => {
      			if (res.status == 200) {
               this.fileList.push({url:res.data.data})
      					 this.$message({
      					   message: '上传成功',
      					   type: 'success'
      					 })
      			} else {
      					this.$message({
      					  message: '上传失败',
      					  type: 'error'
      					})
      			}
      		})
      		.catch(error => {
      				this.$message({
      				  message: '上传失败',
      				  type: 'error'
      				})
      		});

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
