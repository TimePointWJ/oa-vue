<template>
  <div class="components-container">
    <el-select v-model="releaseDepartment" multiple placeholder="请选择通知部门" filterable @change='selectDepartmentStaff()'  collapse-tags>
      <el-option v-for="item in department" :key="item.id" :label="item.name" :value="item.id">
      </el-option>
    </el-select>
    <el-select v-model="notice.releaseStaff" multiple placeholder="请选择通知人员" filterable  collapse-tags>
      <el-option v-for="item in staffList" :key="item.name" :value="item.id" :label='item.name'>
      </el-option>
    </el-select>
    <br>
    <br>
    <!-- <el-button type="primary" @click="test">测试</el-button> -->
    <el-upload class="upload-demo" v-if="!phoneUpload" ref="upload" :action="uploadUrl" :file-list="fileList" :auto-upload="false" :on-success="uploadSuccess" :limit="5" :on-change="uploadChange" :on-exceed="handleExceed" :before-upload="beforUpload" drag>
      <i class="el-icon-upload"></i> 
      <div class="el-upload__text">将文件拖到此处，或
        <em>点击上传</em>
      </div>
      <div class="el-upload__tip" slot="tip">上传的文件不超过10M</div>
    </el-upload>
    <el-upload class="upload-demo" v-if="phoneUpload" ref="upload" :action="uploadUrl" :file-list="fileList" :auto-upload="false" :on-success="uploadSuccess" :limit="5" :on-change="uploadChange" :on-exceed="handleExceed" :before-upload="beforUpload">
      <el-button size="small" type="primary">上传附件</el-button>
    </el-upload>
    <br>
    <el-input v-model="notice.title" placeholder="请输入标题（不超过16字）" size="large"></el-input>
    <br>
    <br>
    <el-select v-model="notice.type" placeholder="请选择通知类别" filterable  collapse-tags>
      <el-option v-for="item in typeList" :key="item.name" :value="item.id" :label='item.name'>
      </el-option>
    </el-select>
    <el-select v-model="notice.reviewId" placeholder="请选择审核人" filterable  collapse-tags multiple multiple-limit='2'>
      <el-option v-for="item in reviewPersonList" :key="item.name" :value="item.id" :label='item.name'>
      </el-option>
    </el-select>
    <br>
    <br>
    <div>
      <tinymce :height="400" v-model="notice.content" ref="Tinymce"></tinymce>
    </div>
    <el-button type="primary" @click="prepareSubmit" style="float:right;margin-top:10px" v-if="showList.noticeManager_releaseNotice_submit">发布</el-button>
    <el-button type="success" @click="save" style="float:right;margin-top:10px;margin-right:5px" v-if="showList.noticeManager_releaseNotice_save">保存草稿</el-button>
  </div>
</template>

<script>
import Tinymce from "@/components/Tinymce";
import MdInput from "@/components/MDinput";
import { departmentList, staffList } from "@/api/common";
import { submitNotice, reviewPersonList,getEditData } from "@/api/notice";
import { listIllegalWord, getIllegalWordFromJava } from "@/api/illegalWord";
import { typeList } from "@/api/noticeType";
import { getToken } from "@/utils/auth";
import { hasPermission } from '@/utils/button'
const noticeTemp = {
  id:null,
  title: null,
  content: null,
  releaseStaff: [],
  fileUrl: [],
  type: null,
  reviewId: null,
  status: null
};
export default {
  name: "tinymce-demo",
  components: { Tinymce, MdInput },
  data() {
    return {
      uploadUrl:
        "http://localhost:8080/service/notice/upload?token=" + this.getToken(),
      notice: Object.assign({}, noticeTemp),
      fileList: [],
      fileLength: 0,
      releaseDepartment: [],
      releaseDepartmentTemp: [],
      beyondLimit: false,
      staffList: [],
      department: [], //存放部门
      result: "",
      uploadLimit: 10485760, //文件大小上限
      illegalStr: [],
      typeList: [],
      reviewPersonList: [],
      clearStatus:false,
      phoneUpload:false,
      showList:{
        noticeManager_releaseNotice_submit:false,
        noticeManager_releaseNotice_save:false
      },
    };
  },
  created() {
    this.isEdit();
    this.selectList(); //查询相关list
    this.judgePhone();
    this.buttonControl();
  },
  methods: {
    test() {
      if(this.fileLength>0){
        this.$refs.upload.clearFiles();
      }
      
    },
    getToken() {
      return getToken();
    },
    uploadChange(file, fileList) {
      console.log(file.size)
      if(file.size>this.uploadLimit){
        this.$message({
          type: "error",
          message: "上传文件大小超过" + this.uploadLimit / 1024 / 1024 + "MB!"
        });
        this.$refs.upload.clearFiles();
      }
      this.fileLength = file.length;
    },
    handleExceed() {
      this.$message.error("只能选择五个文件!");
    },
    beforUpload(file) {
      console.log(file.size);
      if (file.size > this.uploadLimit) {
        // this.$refs.upload.abort(file)
        this.$message({
          type: "error",
          message: "上传文件大小超过" + this.uploadLimit / 1024 / 1024 + "MB!"
        });
        //this.beyondLimit = true;
        return false;
      } else {
        //this.beyondLimit = false;
      }
    },
    uploadSuccess(response) {
      //有文件，先上传文件再发布
      this.notice.fileUrl.push(response.responseData[0]);
      if (
        this.fileLength > 0 &&
        this.fileLength == this.notice.fileUrl.length
      ) {
        submitNotice(this.notice).then(response => {
          this.result = response.data.statusCode;
          if (this.result === 200) {
            this.$message({
              type: "success",
              message: "发布成功!"
            });
            this.notice.fileUrl = [];
            this.$refs.Tinymce.setContent(null);
            this.$refs.upload.clearFiles();
            this.notice = Object.assign({}, noticeTemp);
            location.reload();
          } else {
            this.$message({
              type: "error",
              message: "发布失败!"
            });
          }
        });
      }
    },
    prepareSubmit() {
      //发布待审核
      this.notice.status = 1;
      this.submit();
    },
    save() {
      //保存草稿
      this.notice.status = 0;
      if(this.fileLength>0){
        this.$confirm('保存草稿不可上传文件, 是否清除文件继续保存?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$refs.upload.clearFiles();
          this.submit();
          console.log("清除文件")
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消保存'
          });          
        });
      }else{
        this.submit();
      }
    },
    async submit() {
      //发布公告
      if (this.notice.releaseStaff.length == 0) {
        this.$message.error("通知人员为空!");
        return;
      }
      if (this.notice.title == null || this.notice.title.trim().length == 0) {
        this.$message.error("通知标题为空!");
        return;
      }
      if (this.notice.title.trim().length > 16) {
        this.$message.error("通知标题不能超过16字!");
        return;
      }
      if(this.notice.type==null){
        this.$message.error("未选择通知类别!");
        return;
      }
      if(this.notice.reviewId==null||this.notice.reviewId.length==0){
        this.$message.error("未选择审核人!");
        return;
      }
      /*if (!this.isLegal(this.illegalStr,this.notice.title)) {
        this.$message.error("标题存在敏感词语:"+this.returnIllegalWord(this.illegalStr,this.notice.title).toString());
        return;
      }*/
      var illegal = false;
      await getIllegalWordFromJava(this.notice.title).then(response => {
        const illegalTitle = response.data.responseData;
        if (illegalTitle.length > 0) {
          console.log("1");
          illegal = true;
          this.$message.error("标题存在敏感词语:" + illegalTitle.toString());
          //return;//在await后，return无效
        }
      });
      if (illegal) {
        return;
      }
      if (this.notice.content == null) {
        this.$message.error("通知内容为空!");
        return;
      }
      if (this.notice.content.length > 1000) {
        this.$message.error("通知内容超过上限!");
        return;
      }
      /*if (!this.isLegal(this.illegalStr,this.notice.content)) {
        this.$message.error("内容存在敏感词语:"+this.returnIllegalWord(this.illegalStr,this.notice.content).toString());
        return;
      }*/
      await getIllegalWordFromJava(this.notice.content).then(response => {
        const illegaContent = response.data.responseData;
        if (illegaContent.length > 0) {
          this.$message.error("内容存在敏感词语:" + illegaContent.toString());
          illegal = true;
        }
      });
      if (illegal) {
        return;
      }
      this.$refs.upload.submit(); //文件上传
      if (this.fileLength == 0) {
        //无文件直接发布
        console.log("无文件");
        //this.notice.content = this.$refs.editor.getContent();
        submitNotice(this.notice).then(response => {
          this.result = response.data.statusCode;
          if (this.result === 200) {
            if (this.notice.status == 1) {
              this.$message({
                type: "success",
                message: "发布成功!"
              });
            }
            if (this.notice.status == 0) {
              this.$message({
                type: "success",
                message: "保存草稿成功!"
              });
            }
            this.$refs.Tinymce.setContent(null);
            this.$refs.Tinymce.initTinymce();
            this.notice = Object.assign({}, noticeTemp);
            location.reload();
          } else {
            this.$message({
              type: "error",
              message: "发布失败!"
            });
          }
        });
      }
    },
    isLegal(ilLegalArray, content) {
      // 输入内容是否合法
      for (var i = 0; i < ilLegalArray.length; i++) {
        var ge = new RegExp(ilLegalArray[i]);
        if (ge.test(content)) {
          return false;
        }
      }
      return true;
    },
    returnIllegalWord(illegalArray, content) {
      //返回非法字符串
      var illegalWord = new Array();
      for (var i = 0; i < illegalArray.length; i++) {
        var re = new RegExp(illegalArray[i]);
        var t = re.exec(content);
        if (t != null) {
          illegalWord.push(t);
        }
      }
      return illegalWord;
    },
    selectList() {
      //下拉框数据
      departmentList().then(response => {
        this.department = response.data.responseData;
      });
      staffList().then(response => {
        this.staffList = response.data.responseData;
      });
      typeList().then(response => {
        this.typeList = response.data.responseData;
      });
      reviewPersonList().then(response => {
        this.reviewPersonList = response.data.responseData;
      });
      /*listIllegalWord().then(response => {
        this.illegalStr = response.data.responseData;
      });*/
    },
    selectDepartmentStaff() {
      //部门改变调用
      //this.notice.releaseStaff = [];
      var add = this.getArrayDifference(
        this.releaseDepartment,
        this.releaseDepartmentTemp
      );
      var reduce = this.getArrayDifference(
        this.releaseDepartmentTemp,
        this.releaseDepartment
      );
      this.releaseDepartmentTemp = this.releaseDepartment;
      for (var i = 0; i < add.length; i++) {
        //添加
        for (var j = 0; j < this.staffList.length; j++) {
          if (this.staffList[j].departmentId == add[i]) {
            this.notice.releaseStaff.push(this.staffList[j].id);
          }
        }
      }
      for (var i = 0; i < reduce.length; i++) {
        //删除
        for (var j = 0; j < this.staffList.length; j++) {
          if (this.staffList[j].departmentId == reduce[i]) {
            //需要删除的员工
            for (var m = 0; m < this.notice.releaseStaff.length; m++) {
              //删除部门内员工
              if (this.notice.releaseStaff[m] == this.staffList[j].id) {
                this.notice.releaseStaff.splice(m, 1);
              }
            }
          }
        }
      }
    },
    getIllegalWordFromJava(content) {
      //从后台获取非法字符
      getIllegalWordFromJava(content).then(response => {
        data = response.data.responseData;
      });
    },
    getArrayDifference(arr1, arr2) {
      //获取差集arr1-arr2
      var diff = [];
      var tmp = arr2;
      arr1.forEach(function(val1, i) {
        if (arr2.indexOf(val1) < 0) {
          diff.push(val1);
        } else {
          tmp.splice(tmp.indexOf(val1), 1);
        }
      });
      return diff;
    },
    isEdit(){//进入编辑模式
      console.log("111")
      console.log(this.$route.params.noticeId!=undefined);
      console.log("111")
      if(this.$route.params.noticeId!=undefined){
        getEditData([this.$route.params.noticeId]).then(response => {
        this.notice = response.data.responseData;
        //this.$refs.Tinymce.setContent(this.notice)
        this.notice.fileUrl=[]
        console.log(this.notice.fileUrl)
        console.log(this.notice.releaseStaff);
        console.log(this.notice.content);
      });
      }
    },
    judgePhone(){
      if(navigator.userAgent.match(
            /(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i
          ) == null){
            this.phoneUpload=false
          }else{
            this.phoneUpload=true
          } 
    },
    buttonControl(){
      this.showList.noticeManager_releaseNotice_submit = hasPermission("noticeManager_releaseNotice_submit");
      this.showList.noticeManager_releaseNotice_save = hasPermission("noticeManager_releaseNotice_save");
    },
  }
};
</script>

<style scoped>
.editor-content {
  margin-top: 20px;
}
</style>