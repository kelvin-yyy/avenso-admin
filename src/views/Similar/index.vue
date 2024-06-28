<template>
  <div class="dashboard-container">
    <el-button type="primary" @click="news()">新增</el-button>
    <el-table :data="tableData" v-loading="loading" border style="width: 100%">
      <el-table-column prop="Similar_Companies_id" label="公司id">
      </el-table-column>
      <el-table-column prop="name" label="名字">
      </el-table-column>
      <el-table-column prop="address" label="地址">
      </el-table-column>
      <el-table-column prop="Contacts" label="联系人">
      </el-table-column>
      <el-table-column prop="employees" label="员工数">
      </el-table-column>
      <el-table-column prop="briefIntroduction" label="简介">
      </el-table-column>
      <el-table-column prop="briefIntroductions" label="深简介">
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
        <el-form-item label="标签">
          <div v-for="item in label">
            <div style="display: flex;align-items: center;">
              <el-input v-model="item.name"></el-input>
              <i class="el-icon-circle-plus-outline" @click="newinput" style="font-size:20px;margin-left: 10px;"></i>
              <i class="el-icon-remove-outline" @click="delectinput(i)" style="font-size:20px"></i>
            </div>
          </div>
        </el-form-item>
        <el-form-item label="名字">
          <el-input v-model="newform.name"></el-input>
        </el-form-item>
        <el-form-item label="地址">
          <el-input v-model="newform.address"></el-input>
        </el-form-item>
        <el-form-item label="联系人">
          <el-input v-model="newform.Contacts"></el-input>
        </el-form-item>
        <el-form-item label="员工数">
          <el-input v-model="newform.employees"></el-input>
        </el-form-item>
        <el-form-item label="简介">
          <el-input v-model="newform.briefIntroduction"></el-input>
        </el-form-item>
        <el-form-item label="深简介">
          <el-input v-model="newform.briefIntroductions"></el-input>
        </el-form-item>
        <el-form-item label="公司id">
           <el-select v-model="newform.Similar_Companies_id" placeholder="请选择">
              <el-option
                v-for="item in options"
                :key="item.id"
                :label="item.name"
                :value="item.id">
              </el-option>
            </el-select>
        </el-form-item>
          <el-form-item>
            <el-form-item label="上传图片">
               <el-upload
                 action="#"
                 :http-request="handleFileUpload"
                 list-type="picture-card"
                 :file-list="fileList"
                 :limit="1"
                 :on-preview="handlePictureCardPreview"
                 :on-remove="newClose">
                 <i class="el-icon-plus"></i>
               </el-upload>
               <!-- <el-dialog :visible.sync="dialogVisible"></el-dialog> -->
            </el-form-item>
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
    newSimilar,
    allcompany,
    companySimilar,
    updateSimilar,
    deleteSimilar,
    file_upload
  } from "@/api/weight.js"
  export default {
    name: 'loginLog',
    data() {
      return {
        form: {
          pages: 1,
          pageSize:5,
        },
        label:[{name:''}],
        tableData:[],
        total: 0,
        currentPage: 0,
        loading: false,
        pageCount: 0,
        newdialog:false,
        state:1,
        options:[],
        fileList:[],
        newform:{
          name:"",
          img:'',
          label:[],
          Contacts:"",
          address:"",
          employees:"",
          briefIntroduction:"",
          briefIntroductions:"",
          Similar_Companies_id:""
        }
      }
    },
    mounted() {
      this.list()

    },
    computed: {},
    methods: {
      newinput(){
        this.label.push({name:""})
      },
      delectinput(i){
        this.label.splice(i,1)
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
        name:"",
        img:'',
        label:[],
        Contacts:"",
        address:"",
        employees:"",
        briefIntroduction:"",
        briefIntroductions:"",
        Similar_Companies_id:""
       }
       this.label=[{name:''}]
     },
     updateClick(row){
       this.newdialog=true
       this.newform=row
       this.state=2
       this.label=[]
       row.label.forEach((res)=>{
         this.label.push({name:res})
       })
       this.fileList.push({url:row.img})
       console.log( this.fileList)
     },
     handleClick(row){
            // var that
            this.$confirm('此操作将删除该Details, 是否继续?', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
                deleteSimilar({id:row.id}).then((res)=>{
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
        this.newform.label=[]
        this.fileList.forEach((res)=>{
          this.newform.img=res.url
        })
        this.label.forEach((res)=>{
          this.newform.label.push(res.name)
        })
        companySimilar(this.newform).then((res)=>{
          this.newdialog=false
          this.list()
        })
      },
      updateChecked(){
       this.newform.label=[]
       this.fileList.forEach((res)=>{
         this.newform.img=res.url
       })
       this.label.forEach((res)=>{
         this.newform.label.push(res.name)
       })
        updateSimilar(this.newform).then((res)=>{
          this.newdialog=false
          this.resetFields()
          this.list()
        })
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
      newClose(){
          this.newdialog=false
          this.state=2
      },
      list(){
        newSimilar(this.form).then((res)=>{
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
