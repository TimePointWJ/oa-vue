<template>
    <div class="app-container">

        <div class="filter-container">
            <el-input @keyup.enter.native="fetchData" style="width: 150px;" class="filter-item" placeholder="关键字" v-model="listQuery.word" clearable />
            <!-- <el-input @keyup.enter.native="fetchData" style="width: 150px;" class="filter-item" placeholder="发布人" v-model="listQuery.author" clearable /> -->
            <el-select v-model="listQuery.createId" placeholder="创建人" class="filter-item" clearable filterable>
                <el-option v-for="item in personList" :key="item.id" :label="item.name" :value="item.id">
                </el-option>
            </el-select>
            <el-button class="filter-item" type="primary" style="margin-left: 6px;" icon="search" @click="fetchData" v-if="showList.noticeManager_illegalWordManage_search">搜索</el-button>
            <el-button class="filter-item" type="primary" style="margin-left: 6px;" icon="search" @click="prepareAddWord" v-if="showList.noticeManager_illegalWordManage_add">添加</el-button>
            <el-button class="filter-item" type="danger" style="margin-left: 6px;" icon="delete" @click="multipleDelete" v-if="showList.noticeManager_illegalWordManage_batchDelete">批量删除</el-button>
        </div>
        <div class="filter-container">
            <el-table :data="list" border highlight-current-row ref="multipleTable" @selection-change="handleSelectionChange">
                <el-table-column type="selection" align="center" fixed="left"></el-table-column>
                <!--<el-table-column type="selection" align="center"></el-table-column>-->
                <el-table-column label="关键字" prop="word" sortable>
                </el-table-column>
                <!-- <el-table-column label="发布时间" prop="author" sortable>
                    <template slot-scope="scope">
                        <el-date-picker v-model="scope.row.createTime" format='yyyy-M-d' readonly type="datetime" placeholder="选择日期时间">
                        </el-date-picker>
                    </template>
                </el-table-column> -->
                <el-table-column prop="createPerson" label="发布人" sortable></el-table-column>
                <el-table-column prop="id" align="center" label="操作" width="280">
                    <template slot-scope="scope">
                        <el-button size="small" type="success" @click="prepareEditWord(scope.row)" v-if="showList.noticeManager_illegalWordManage_edit">编辑</el-button>
                        <el-button size="small" type="danger" @click="deleteWord(scope.row)" v-if="showList.noticeManager_illegalWordManage_delete">删除</el-button>
                    </template>
                </el-table-column>

            </el-table>
            <div align="center">
                <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage" :page-sizes="[10, 20, 30, 40,2]" :page-size="pagesize" layout="total, sizes, prev, pager, next, jumper" :total="totalCount">
                </el-pagination>
            </div>
        </div>
        <el-dialog title="添加关键字" :visible.sync="addVisible" :before-close="beforeCloseAdd">
            <el-form :model="illegalWord" :rules="rules" ref="addForm">
                <el-form-item label="关键字" width="12" prop="word">
                    <el-input v-model="illegalWord.word" style="width:150px"></el-input>
                    </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="addVisible = false;$refs.addForm.resetFields()">取 消</el-button>
                <el-button type="primary" @click="submitAdd"  v-if="showList.noticeManager_illegalWordManage_add_sure">确 认</el-button>
            </div>
        </el-dialog>

        <el-dialog title="编辑关键字" :visible.sync="editVisible" :before-close="beforeCloseEdit">
            <el-form :model="illegalWord" :rules="rules" ref="editForm">
                <el-form-item label="关键字" width="12" prop="word">
                    <el-input v-model="illegalWord.word" style="width:150px"></el-input>
                    </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="editVisible = false;$refs.editForm.resetFields()">取 消</el-button>
                <el-button type="primary" @click="submitEdit" v-if="showList.noticeManager_illegalWordManage_edit_sure">确 认</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import {
  pagination,
  addWord,
  deleteWord,
  editWord,
  listPerson
} from "@/api/illegalWord";
import { mapGetters } from "vuex";
import { hasPermission } from '@/utils/button'
// 数据模板
const wordTemp = {
  word: null,
  id: null
};
export default {
  data() {
    return {
      list: null,
      personList: [],
      totalCount: 0,
      pagesize: 10,
      currentPage: 1,
      listQuery: {
        word: null, //关键字
        createId: null, //发布人
        pageNum: 1,
        pageSize: 10
      },
      addVisible: false,
      editVisible: false,
      illegalWord: Object.assign({}, wordTemp),
      multipleSelection: [],
      rules: {
        word: [
          { required: true, message: "请输入关键字", trigger: "blur" },
          { min: 1, max: 10, message: "长度在 1 到 10 个字符", trigger: "blur" }
        ]
      },
      showList:{
        noticeManager_illegalWordManage_search:false,
        noticeManager_illegalWordManage_add:false,
        noticeManager_illegalWordManage_batchDelete:false,
        noticeManager_illegalWordManage_edit:false,
        noticeManager_illegalWordManage_delete:false,
        noticeManager_illegalWordManage_add_sure:false,
        noticeManager_illegalWordManage_edit_sure:false,

      },
    };
  },
  computed: {
    ...mapGetters(["name", "avatar", "roles"])
  },
  created() {
    this.fetchData();
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
      this.listSelect();
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
    prepareAddWord() {
      this.addVisible = true;
    },
    submitAdd() {
      this.$refs["addForm"].validate(valid => {
        if (valid) {
          const data = {
            word: this.illegalWord.word
          };
          addWord(data).then(response => {
            const str = response.data.responseData;
            if (str == null) {
              this.$message({
                type: "success",
                message: "添加成功!"
              });
              this.addVisible = false;
              this.illegalWord = Object.assign({}, wordTemp);
              this.fetchData();
            } else {
              this.$message({
                type: "error",
                message: str
              });
            }
            this.fetchData();
          });
        }
      });
    },
    prepareEditWord(row) {
      this.illegalWord.word = row.word;
      this.illegalWord.id = row.id;
      this.editVisible = true;
    },
    submitEdit() {
      this.$refs["editForm"].validate(valid => {
        if (valid) {
          const data = {
            word: this.illegalWord.word,
            id: this.illegalWord.id
          };
          editWord(data).then(response => {
            const str = response.data.responseData;
            if (str == null) {
              this.$message({
                type: "success",
                message: "编辑成功!"
              });
              this.editVisible = false;
              this.illegalWord = Object.assign({}, wordTemp);
              this.fetchData();
            } else {
              this.$message({
                type: "error",
                message: str
              });
            }
            this.fetchData();
          });
        }
      });
    },
    deleteWord(row) {
      this.$confirm("删除该键字, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          //确认后进行删除，删除成功则flg为1
          deleteWord([row.id]).then(response => {
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
          message: "尚未选择关键字!"
        });
      } else {
        var id = new Array();
        for (var i = 0; i < this.multipleSelection.length; i++) {
          id.push(this.multipleSelection[i].id);
        }
        this.$confirm("删除选择中键字, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(() => {
            deleteWord(id).then(response => {
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
    listSelect() {
      listPerson().then(response => {
        this.personList = response.data.responseData;
      });
    },
    beforeCloseAdd(){
        this.addVisible=false;
        this.$refs.addForm.resetFields();
        this.illegalWord = Object.assign({}, wordTemp);
    },
    beforeCloseEdit(){
        this.editVisible=false;
        this.$refs.editForm.resetFields();
        this.illegalWord = Object.assign({}, wordTemp);
    },
    buttonControl(){
      this.showList.noticeManager_illegalWordManage_search = hasPermission("noticeManager_illegalWordManage_search")
      this.showList.noticeManager_illegalWordManage_add = hasPermission("noticeManager_illegalWordManage_add")
      this.showList.noticeManager_illegalWordManage_batchDelete = hasPermission("noticeManager_illegalWordManage_batchDelete")
      this.showList.noticeManager_illegalWordManage_edit = hasPermission("noticeManager_illegalWordManage_edit")
      this.showList.noticeManager_illegalWordManage_delete = hasPermission("noticeManager_illegalWordManage_delete")
      this.showList.noticeManager_illegalWordManage_add_sure = hasPermission("noticeManager_illegalWordManage_add_sure")
      this.showList.noticeManager_illegalWordManage_edit_sure = hasPermission("noticeManager_illegalWordManage_edit_sure")

    },
  }
};
</script>