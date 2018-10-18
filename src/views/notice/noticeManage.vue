<template>
    <div class="app-container">

        <div class="filter-container">
            <el-input @keyup.enter.native="fetchData" style="width: 150px;" class="filter-item" placeholder="标题" v-model="listQuery.title" clearable />
            <!-- <el-input @keyup.enter.native="fetchData" style="width: 150px;" class="filter-item" placeholder="发布人" v-model="listQuery.author" clearable /> -->
            <el-select v-model="listQuery.author" placeholder="发布人" class="filter-item" clearable filterable>
                <el-option v-for="item in authorList" :key="item.id" :label="item.name" :value="item.name">
                </el-option>
            </el-select>
            <el-date-picker v-model="listQuery.startTime" type="date" placeholder="开始日期" class="filter-item">
            </el-date-picker>
            <el-date-picker v-model="listQuery.endTime" type="date" placeholder="截止日期" class="filter-item">
            </el-date-picker>
            <el-button class="filter-item" type="primary" style="margin-left: 6px;" icon="search" @click="fetchData" v-if="showList.noticeManager_reviewNotice_search">搜索</el-button>
            <!-- <el-button class="filter-item" type="danger" style="margin-left: 6px;" icon="delete" @click="multipleDelete">批量删除</el-button> -->
        </div>
        <div class="filter-container">
            <el-table :data="list" border highlight-current-row ref="multipleTable" @selection-change="handleSelectionChange">
                <!-- <el-table-column type="selection" align="center"></el-table-column> -->
                <el-table-column label="标题" prop="title" sortable>
                    <template slot-scope="scope">
                        <span class="link-type" @click="clickTitle(scope.row)">{{scope.row.title}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="发布时间" prop="author" sortable>
                    <template slot-scope="scope">
                        <el-date-picker v-model="scope.row.createTime" format='yyyy-M-d' readonly type="datetime" placeholder="选择日期时间">
                        </el-date-picker>
                    </template>
                </el-table-column>
                <el-table-column prop="author" label="发布人" sortable></el-table-column>
                <el-table-column prop="typeName" label="类别" sortable></el-table-column>
                <el-table-column prop="reviewFlg" label="审核状态" sortable width="130" >
                    <template slot-scope="scope">
                      <el-tag type="success" v-if="scope.row.reviewPeopleFlg == true">已审核</el-tag>
                      <el-tag type="info" v-if="scope.row.reviewPeopleFlg != true">未审核</el-tag>
                      <!-- <span v-if="scope.row.reviewFlg == 0">未审核</span>
                      <span v-if="scope.row.reviewFlg == 1">已审核</span> -->
                    </template>
                </el-table-column>
                <el-table-column prop="id" align="center" label="操作" width="280">
                    <template slot-scope="scope">
                        <el-button v-if="scope.row.reviewPeopleFlg != true&&showList.noticeManager_reviewNotice_review" size="small" type="warning" @click="clickReview(scope.row)" >审核</el-button>
                        <el-button v-if="scope.row.reviewPeopleFlg == true&&showList.noticeManager_reviewNotice_review" size="small" type="warning" @click="clickReview(scope.row)" disabled >审核</el-button>
                        <el-button size="small" type="danger" @click="deleteOneData(scope.row)" v-if="showList.noticeManager_reviewNotice_delete">删除</el-button>
                    </template>
                </el-table-column>

            </el-table>
            <div align="center">
                <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage" :page-sizes="[10, 20, 30, 40,2]" :page-size="pagesize" layout="total, sizes, prev, pager, next, jumper" :total="totalCount">
                </el-pagination>
            </div>
        </div>
        <el-dialog title="审核公告" :visible.sync="reviewVisible">
            <el-form :model="notice">
                <el-form-item label="标题" width="12">
                      <el-input v-model="notice.title" style="width:156px" disabled></el-input>
                </el-form-item>
                <el-form-item label="发布时间" width="12">
                    <el-input v-model="notice.createTime" style="width:129px" disabled></el-input>
                </el-form-item>
                <el-form-item label="发布人" width="12">
                    <el-input v-model="notice.author" style="width:141px" disabled></el-input>
                </el-form-item>
                <el-form-item label="内容" width="12">
                    <el-input type="textarea" v-html="notice.content"></el-input>
                </el-form-item>
            </el-form>
            <el-form  v-if="file!=null">
                <el-form-item label="附件" width="12">
                    <div v-for="item in file">
                        <span class="link-type" @click="clickFile(item)">{{item.fileName}}</span>
                    </div> 
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="reviewVisible = false">取 消</el-button>
                <el-button type="primary" @click="review" v-if="showList.noticeManager_reviewNotice_review_sure">审核通过</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import {
  pagination,
  deleteNotice,
  reviewNotice,
  lookOneNotice,
  listAuthor
} from "@/api/notice";
import { mapGetters } from "vuex";
import { hasPermission } from '@/utils/button'
// 数据模板
const staffTemp = {};
export default {
  data() {
    return {
      list: null,
      authorList: [],
      totalCount: 0,
      pagesize: 10,
      currentPage: 1,
      listQuery: {
        title: null, //标题
        author: null, //发布人
        pageNum: 1,
        pageSize: 10,
        startTime: null,
        endTime: null
      },
      notice: [],
      file: [],
      reviewVisible: false,
      multipleSelection:[],
      showList:{
        noticeManager_reviewNotice_search:false,
        noticeManager_reviewNotice_review:false,
        noticeManager_reviewNotice_delete:false,
        noticeManager_reviewNotice_review_sure:false,

      },
    };
  },
  computed: {
    ...mapGetters(["name", "avatar", "roles"])
  },
  created() {
    this.fetchData();
    this.listSelect();
    this.buttonControl();
  },
  methods: {
    /**
     * 初期化
     */
    fetchData() {
      this.listLoading = true;
      this.listQuery.pageNum = this.currentPage;
      this.listQuery.pageSize = this.pagesize;
      pagination(this.listQuery).then(response => {
        const data = response.data.responseData;
        this.list = data.list;
        this.totalCount = data.total;
        this.listLoading = false;
      });
    },
    /**
     * 每页显示数据量变更
     */
    handleSizeChange(val) {
      this.pagesize = val;
      this.fetchData();
    },
    /**
     * 页码变更
     */
    handleCurrentChange(val) {
      this.currentPage = val;
      this.fetchData();
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    deleteOneData(row) {
      this.$confirm("删除本条公告, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          deleteNotice([row.id]).then(response => {
            const flg = response.data.statusCode;
            //console.log(flg);
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
            this.fetchData();
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    multipleDelete() {
      //批量删除
      if (this.multipleSelection.length == 0) {
        this.$message({
          type: "error",
          message: "尚未选择公告!"
        });
      } else {
        var id = new Array();
        for (var i = 0; i < this.multipleSelection.length; i++) {
          id.push(this.multipleSelection[i].id);
        }
        this.$confirm("删除选中公告, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(() => {
            deleteNotice(id).then(response => {
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
              this.fetchData();
            });
          })
          .catch(() => {
            this.$message({
              type: "info",
              message: "已取消删除"
            });
          });
      }
    },
    clickReview(row) {
      const data = {
        noticeId: row.id,
        staffNo: null,
        type: null
      };
      lookOneNotice(data).then(response => {
        this.notice = response.data.responseData.noticeEx;
        this.file = response.data.responseData.file;
        var date = new Date();
        date.setTime(this.notice.createTime);
        this.releaseDate = date.toLocaleDateString();
        this.notice.createTime = date.toLocaleDateString();
        this.reviewVisible = true;
      });
    },
    clickFile(file) {
      var index = file.url.indexOf("~$~");
      var downloadUrl = "static/file/notice/" + file.url.substring(index);
      location.href = downloadUrl;
    },
    review() {
      reviewNotice([this.notice.id]).then(response => {
        const flg = response.data.statusCode;
        if (flg === 200) {
          this.$message({
            type: "success",
            message: "审核成功!"
          });
        } else {
          this.$message({
            type: "error",
            message: "审核失败!"
          });
        }
        this.fetchData();
        this.reviewVisible = false;
      });
    },
    clickTitle(row) {
      this.$router.push({
        name: "noticeDetial",
        params: { noticeId: row.id, type: "manager", staffNo: this.name }
      });
    },
    listSelect() {
      listAuthor().then(response => {
        this.authorList = response.data.responseData;
      });
    },
    buttonControl(){
      this.showList.noticeManager_reviewNotice_search = hasPermission("noticeManager_reviewNotice_search")
      this.showList.noticeManager_reviewNotice_review = hasPermission("noticeManager_reviewNotice_review")
      this.showList.noticeManager_reviewNotice_delete = hasPermission("noticeManager_reviewNotice_delete")
      this.showList.noticeManager_reviewNotice_review_sure = hasPermission("noticeManager_reviewNotice_review_sure")

    },
  }
};
</script>