<template>
    <div class="components-container" style="width:80%;margin:0 auto;">
        <br>
        <div class="editor-content" style="text-align: center">
            <font v-html="notice.title" style="font-size: 40px "></font>
        </div>
        <div style="text-align: center">
            <span  v-if="file.length!=0">附件：</span>
            <span v-for="(item,index) in file" v-if="file!=null">
              {{index+1}}.<span class="link-type" @click="clickFile(item)">{{item.fileName}}</span>
            </span>
            <div>
                <font style="font-size: 15px">发布人：</font>
                <font v-html="notice.author" style="font-size: 15px"></font>
            </div>
            <div>
                <font style="font-size: 15px">发布日期：</font>
                <font v-html="releaseDate" style="font-size: 15px"></font>
            </div>
            <el-steps :active="notice.status" finish-status="success" simple style="margin-top: 20px"v-if="!(notice.reviewFlg==1&&notice.staffNo!=staffNoSelf)">
              <el-step title="草稿" ></el-step>
              <el-step title="审核中" ></el-step>
              <el-step title="已发布" ></el-step>
            </el-steps>
            <div v-if="notice.status==1">
              <el-tag type="success" size="mini" v-if="notice.reviewOneStatus==1">{{notice.reviewOneName}}已审核</el-tag>
              <el-tag type="danger" size="mini" v-if="notice.reviewOneStatus==0">{{notice.reviewOneName}}未审核</el-tag>
              <el-tag type="success" size="mini" v-if="notice.reviewTwoStatus==1">{{notice.reviewTwoName}}已审核</el-tag>
              <el-tag type="danger" size="mini" v-if="notice.reviewTwoStatus==0&&notice.reviewTwoName!=null">{{notice.reviewTwoName}}未审核</el-tag>
            </div>
            <!-- <div v-if="notice.status==1">
              <el-tag type="success" size="mini" v-if="notice.reviewTwoStatus==1">{{notice.reviewTwoName}}已审核</el-tag>
              <el-tag type="danger" size="mini" v-if="notice.reviewTwoStatus==0">{{notice.reviewTwoName}}未审核</el-tag>
            </div> -->
        </div>
        <div class="editor-content">
            <font v-html="notice.content" style="font-size: 20px;word-break:break-all"></font>
        </div>
        <div style="margin-top:100px;text-align:right" >
            <!-- <span class="link-type" @click="deleteNotice" >删除&nbsp;</span>
            <span class="link-type" @click="responseNotice" >&nbsp;回复</span> -->
            <el-button type="danger" @click="deleteNotice" style="margin-top:10px" v-if="notice.staffNo==staffNoSelf">删除</el-button>
            <el-button type="primary" @click="responseNotice" style="margin-top:10px" v-if="notice.reviewFlg==1">回复</el-button>
            <el-button type="primary" @click="editNotice" style="margin-top:10px" v-if="notice.status==0">编辑</el-button>
        </div>
        <!-- <hr> -->
        <div v-if="responseStatus">
      <tinymce :height="400" v-model="noticeResponse.content" ref="Tinymce"></tinymce>
      <div style="text-align:right;margin-top:5px">
          <el-button type="danger" @click="cancelResponseNotice" style="margin-top:10px" size="mini">取消</el-button>
          <el-button type="primary" @click="submitResponseNotice" style="margin-top:10px" size="mini">确认</el-button>
      </div>
        </div>
        <div v-if="responseList!=null&&responseList.length>0" style="margin-top:10px">
            回复列表:
            <div v-for="item in responseList" style="margin-top:30px">
                <span >{{item.createId}}</span>
                <div><font v-html="item.content" style="word-break:break-all"></font></div>
                <!-- <p v-html="item.content"></p> -->
                <div style="text-align:right">
                    <font style="font-size: 15px">{{item.releaseTime}}</font>
                    <el-button type="danger" @click="deleteResponse(item.id)" size="mini" style="">删除</el-button>
                </div>
                <hr>
            </div>
            <div align="center">
                <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage" :page-sizes="[2,5,10, 20, 30, 40]" :page-size="pagesize" layout="total, sizes, prev, pager, next, jumper" :total="totalCount">
                </el-pagination>
            </div>
            <!-- <el-table :data="responseList">
                <el-table-column prop="createId">
                    <template slot-scope="scope">
                        <span class="link-type" @click="clickAuthor(scope.row)">{{scope.row.title}}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="content">
                </el-table-column>
        </el-table> -->
        </div>
        <!--<div style="margin-top: 300px;text-align: center;width: 90px;float: right">
            <span class="link-type" @click="clickFile" v-if="file!=null">{{file.fileName}}</span>
            <div v-html="notice.author"></div>
            <div v-html="releaseDate"></div>
        </div>-->
    </div>
</template>

<script>
import Tinymce from "@/components/Tinymce";
import {
  submitNotice,
  lookOneNotice,
  submitResponse,
  deleteNotice,
  deleteResponse,
  pageResponse
} from "@/api/notice";
import { mapGetters } from "vuex";
const noticeTemp = {
  title: null,
  content: null,
  author: null
};
const noticeResponseTemp = {
  content: null,
  responseToId: null
};
export default {
  name: "notice_detail",
  components: { Tinymce },
  data() {
    return {
      //notice1: Object.assign({}, noticeTemp),//
      notice: null, //公告
      noticeResponse: Object.assign({}, noticeResponseTemp), //
      releaseDate: null, //发布日期
      file: null, //文件
      responseStatus: false, //回复文本框显示
      responseList: null, //回复列表
      totalCount: 0,
      pagesize: 5,
      currentPage: 1,
      listQuery: {
        pageNum: 1,
        pageSize: 5
      },
      staffNoSelf:null,
    };
  },
  computed: {
    ...mapGetters(["name", "avatar", "roles"])
  },
  created() {
    this.findData(this.$route.params);
    console.log(this.$route);
    this.staffNoSelf=this.name;
    console.log(this.staffNoSelf)
  },
  mounted() {
    //this.findData(this.$route.params);
  },
  methods: {
    handleSizeChange(val) {
      this.pagesize = val;
      this.fetchData();
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      this.fetchData();
    },
    fetchData() {
      this.listLoading = true;
      this.listQuery.pageNum = this.currentPage;
      this.listQuery.pageSize = this.pagesize;
      this.listQuery.noticeId = this.$route.params.noticeId;
      pageResponse(this.listQuery).then(response => {
        const data = response.data.responseData;
        this.responseList = data.list;
        this.totalCount = data.total;
        this.listLoading = false;
      });
    },
    findData(params) {
      const data = {
        noticeId: params.noticeId,
        staffNo: params.staffNo,
        type: params.type
      };
      lookOneNotice(data).then(response => {
        this.notice = response.data.responseData.noticeEx;
        console.log(this.notice.staffNo)
        console.log(this.notice.staffNo==this.staffNoSelf)
        this.file = response.data.responseData.file;
        this.fetchData();
        //this.responseList = response.data.responseData.noticeResponses;
        var date = new Date();
        date.setTime(this.notice.createTime);
        this.releaseDate = date.toLocaleDateString();
        console.log(this.notice.reviewTwoName)
      });
    },
    responseNotice() {
      this.responseStatus = true;
    },
    deleteNotice() {
      this.$confirm("删除本条公告, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          //确认后进行删除，删除成功则flg为1
          deleteNotice([this.$route.params.noticeId]).then(response => {
            const flg = response.data.statusCode;
            if (flg === 200) {
              this.$message({
                type: "success",
                message: "删除成功!"
              });
              setTimeout(this.transfer, 500);
            } else {
              this.$message({
                type: "error",
                message: "删除失败!"
              });
            }
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    cancelResponseNotice() {
      this.responseStatus = false;
    },
    submitResponseNotice() {
      if (this.noticeResponse.content == null) {
        this.$message.error("回复内容为空!");
        return;
      }
      if (this.noticeResponse.content.length > 1000) {
        this.$message.error("回复内容超过上限!");
        return;
      }
      this.noticeResponse.responseToId = this.$route.params.noticeId;
      submitResponse(this.noticeResponse).then(response => {
        const flg = response.data.statusCode;
        if (flg === 200) {
          this.$message({
            type: "success",
            message: "回复成功!"
          });
          //this.findData(this.$route.params);
          //location.reload()
          this.fetchData();
          this.responseStatus = false;
        } else {
          this.$message({
            type: "error",
            message: "回复失败!"
          });
        }
      });
    },
    clickFile(file) {
      var index = file.url.indexOf("~$~");
      var downloadUrl = "static/file/notice/" + file.url.substring(index);
      location.href = downloadUrl;
    },
    transfer() {
      this.$router.push({ name: "首页" });
    },
    clickAuthor(id) {
      console.log(id);
    },
    editNotice(){
      console.log(this.notice.id)
      this.$router.push({
        name: "发布公告",
        params: { noticeId: this.notice.id, type: "edit" }
      });
    },
    deleteResponse(id) {
      this.$confirm("删除本条回复, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          deleteResponse([id]).then(response => {
            const flg = response.data.statusCode;
            if (flg === 200) {
              this.$message({
                type: "success",
                message: "删除成功!"
              });
              this.fetchData();
            } else {
              this.$message({
                type: "error",
                message: "删除失败!"
              });
            }
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    refresh() {
      this.findData(this.$route.params);
    }
  }
};
</script>

<style scoped>
.editor-content {
  margin-top: 20px;
}
</style>