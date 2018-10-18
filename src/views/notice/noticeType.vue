<template>
  <div class="app-container" v-loading.body="listLoading" element-loading-text="拼命加载中">

    <div class="filter-container">
      <el-button class="filter-item" type="primary" icon="edit" @click="add" v-if="showList.noticeManager_noticeTypeManage_add">添加</el-button>
      <el-button class="filter-item" type="danger" @click="handleMultipleDelete" icon="delete" v-if="showList.noticeManager_noticeTypeManage_batchDelete" >批量删除</el-button>
    </div>

    <div>
      <el-table :data="list" border highlight-current-row @selection-change="handleSelectionChange" ref="multipleTable">
        <el-table-column type="selection" align="center"></el-table-column>
        <!-- <el-table-column prop="id" label="请假编号" sortable></el-table-column> -->
        <el-table-column prop="name" label="类别名称" sortable></el-table-column>
        <el-table-column prop="id" align="center" min-width="200px" label="操作">
          <template slot-scope="scope">
            <el-button size="small" type="success" @click="updateOneData(scope.row)" v-if="showList.noticeManager_noticeTypeManage_edit">编辑</el-button>
            <el-button size="small" type="danger" @click="deleteOneData(scope.row)" v-if="showList.noticeManager_noticeTypeManage_delete">删除</el-button>
          </template>
        </el-table-column>

      </el-table>
     <div align="center">
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage" :page-sizes="[5, 10, 20, 30, 40, 50]"
                       :page-size="pagesize" layout="total, sizes, prev, pager, next, jumper" :total="totalCount">
        </el-pagination>
      </div>
      <!--添加弹框-->
    </div>
    <el-dialog title="添加" :visible.sync="addDialogFormVisible" :before-close="handleClose">
      <el-form :model="noticeType" :rules="addRules" ref="addForm">
        <el-form-item label="类别名称" prop="name">
          <el-input v-model="noticeType.name" auto-complete="off" placeholder="请输入类别名称"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer" width="1px">
        <el-button @click="cancelAdd('addForm')" >取 消</el-button>
        <el-button type="primary" @click="submitAdd('addForm')" v-if="showList.noticeManager_noticeTypeManage_add_sure">确 定</el-button>
      </div>
    </el-dialog>
    <!--编辑请假信息-->
    <el-dialog title="编辑类别信息" :visible.sync="dialogFormVisible" :before-close="handleCloseUpdate">
      <el-form :model="noticeType" :rules="addRules" ref="editForm">
        <!-- <el-form-item label="请假编号" prop="id">
          <el-input v-model="addLeave.id" auto-complete="off" disabled></el-input>
        </el-form-item> -->
        <el-form-item label="类别名称" prop="name">
          <el-input v-model="noticeType.name" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer" width="1px">
        <el-button @click="cancelEdit('editForm')" >取 消</el-button>
        <el-button type="primary" @click="submitEdit('editForm')" v-if="showList.noticeManager_noticeTypeManage_edit_sure">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import { getList,insertOrUpdate,deleteType,delList } from '@/api/noticeType'
  import { hasPermission } from '@/utils/button'

  export default {
    name: 'backToTop-demo',
    data() {
      return {
        showList: {
          noticeManager_noticeTypeManage_add:false,
          noticeManager_noticeTypeManage_batchDelete:false,
          noticeManager_noticeTypeManage_edit:false,
          noticeManager_noticeTypeManage_delete:false,
          noticeManager_noticeTypeManage_add_sure:false,
          noticeManager_noticeTypeManage_edit_sure:false

        },
        list: null,
        totalCount: 10,
        pagesize: 10,
        currentPage: 1,
        listLoading: true,
        addDialogFormVisible: false,//添加弹窗显示状态
        dialogFormVisible: false,//编辑弹窗显示状态
        noticeType: {
          id: null,
          name: null,
          delFlg: null,
          version: null,
          createId: null,
          createTime: null,
          updateId: null,
          updateTime: null
        },
        addRules: {//添加规则
          name: [
            { required: true, message: '请输入请假类型名称', trigger: 'blur' },
            { min: 2, max: 50, message: '长度在 2 到 50 个字符', trigger: 'blur' }
          ]
        }
      }
    },
    created() {
      this.fetchData();
			this.buttonControl()
    },
    methods: {
      fetchData() {
        //this.listLoading = false
        const listQuery = {
          pageNum: this.currentPage,
          pageSize: this.pagesize
        }
        //页面初期加载
        getList(listQuery).then(response => {
          this.listLoading = false
          const data = response.data.responseData
          this.list = data.list
          this.totalCount = data.total
        });
      },
      handleSelectionChange(val) {
        this.multipleSelection = val
      },
      add() {//使添加框显示
        this.reset();
        this.addDialogFormVisible = true;
      },
      handleClose(done){//使添加框不显示
        this.reset();
        this.addDialogFormVisible=false;
        this.$refs.addForm.resetFields();
        this.noticeType.name = '';
      },
      submitAdd(formName) {//提交添加
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.$confirm('确认添加', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              const data = {
                name: this.noticeType.name
              };
            insertOrUpdate(data).then(response => {
              const responseData = response.data
              if(responseData){
                const flg = 0;
                if (flg === 0) {
                  this.$message({
                    type: 'success',
                    message: '添加成功!'
                  });
                  this.fetchData();
                } else {
                  this.$message({
                    type: 'error',
                    message: '添加失败！'
                  });
                }
              }else{
                this.$message({
                  type: 'error',
                  message: '网络问题，添加失败！'
                });
              }
            this.addDialogFormVisible = false;
            this.noticeType.name = '';
            this.fetchData();
            this.$refs[formName].resetFields()
          });
          }).catch(() => {
              this.$message({
              type: 'info',
              message: '取消添加'
            });
          });
          }
        });
      },
      cancelAdd(formName) {//取消添加框
        this.reset();
        this.addDialogFormVisible = false;
        this.noticeType.name = '';
        this.$refs[formName].resetFields();
      },
      handleCloseUpdate(done){//关闭编辑框
        this.reset();
        this.dialogFormVisible=false;
        this.$refs.editForm.resetFields()
        this.fetchData();
      },
      //提交编辑
      submitEdit(formName) {
          this.$refs[formName].validate((valid) => {
              if (valid) {
                  this.$confirm('确认修改', '提示', {
                      confirmButtonText: '确定',
                      cancelButtonText: '取消',
                      type: 'warning'
                  }).then(() => {
                      const data = {
                          id: this.noticeType.id,
                          name: this.noticeType.name,
                          delFlg: this.noticeType.delFlg,
                          version: this.noticeType.version,
                          createId: this.noticeType.createId,
                          createTime: this.noticeType.createTime,
                          updateId: this.noticeType.updateId,
                          updateTime: this.noticeType.updateTime
                      }

                      insertOrUpdate(data).then(response => {
                          const flg = response.data.responseData;
                          if (flg == 0) {
                              this.$message({
                                  type: 'success',
                                  message: '编辑成功!'
                              });
                              this.fetchData();
                          }
                          else {
                              this.$message({
                                  type: 'error',
                                  message: '编辑失败!'
                              });
                          }
                          this.$refs[formName].resetFields();
                          this.dialogFormVisible = false;
                      });
                  }).catch(() => {
                      this.$message({
                          type: 'info',
                          message: '取消修改'
                      });
                  });
                  this.fetchData();
              }
          });
      },
      //进入编辑状态
      updateOneData(row, column, cell, event,$index,store) {
         this.noticeType = row;
         this.dialogFormVisible = true;
          //this.$refs.editForm.resetFields();
      },
      cancelEdit(formName) {//关闭编辑状态
          this.reset();
          this.dialogFormVisible = false;
          this.fetchData();
          this.$refs[formName].resetFields();
      },
      //删除一条数据
      deleteOneData(row) {
          this.$confirm('确认删除?', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
          }).then(() => {//确认后进行删除，删除成功则flg为1
              const data = {
                  id: row.id
              };
              deleteType(data).then(response => {
                  const flg = response.data.responseData
                  if (flg === 1) {
                      this.$message({
                          type: 'success',
                          message: '删除成功!'
                      });
                      this.fetchData();
                  } else {
                      this.$message({
                          type: 'error',
                          message: '删除失败'
                      });
                  }
                  this.fetchData();
              });

          }).catch(() => {
              this.$message({
                  type: 'info',
                  message: '已取消删除'
              });
          });
      },
      reset(){
        this.noticeType = {
          id: null,
          name: null,
          delFlg: null,
          version: null,
          createId: null,
          createTime: null,
          updateId: null,
          updateTime: null
        }
      },
      //每页显示数据量变更
      handleSizeChange(val) {
          this.pagesize = val;
          this.fetchData();
      },
      //页码变更
      handleCurrentChange(val) {
          this.currentPage = val;
          this.fetchData();
      },
      //批量删除
      handleMultipleDelete() {
          const ids = []
          const rows = []
          if(this.multipleSelection){
            this.multipleSelection.forEach(function (item) {
                ids.push(item.id)
                rows.push(item)
            })
            if(ids.length > 0){
              this.handleDelete(ids, rows)
            }else{
              this.$message({
                  type: 'info',
                  message: '请选择删除记录'
              });
            }
          }else{
            this.$message({
                  type: 'info',
                  message: '请选择删除记录'
              });
          }
      },
      //删除
      handleDelete(ids, rows) {
          this.$confirm('确认删除', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
          }).then(() => {
              delList(ids).then(response => {
                  if (response.data.statusCode == 201) {
                      this.$notify({
                          title: '失败',
                          message: '删除失败',
                          type: 'info',
                          duration: 2000
                      })
                  } else {
                      this.$notify({
                          title: '成功',
                          message: '删除成功',
                          type: 'success',
                          duration: 2000
                      })
                      this.fetchData();
                  }
              })
          }).catch(() => {
              this.$message({
                  type: 'info',
                  message: '取消删除'
              });
          });
      },
      buttonControl(){
        this.showList.noticeManager_noticeTypeManage_add = hasPermission("noticeManager_noticeTypeManage_add")
        this.showList.noticeManager_noticeTypeManage_batchDelete = hasPermission("noticeManager_noticeTypeManage_batchDelete")
        this.showList.noticeManager_noticeTypeManage_edit = hasPermission("noticeManager_noticeTypeManage_edit")
        this.showList.noticeManager_noticeTypeManage_delete = hasPermission("noticeManager_noticeTypeManage_delete")
        this.showList.noticeManager_noticeTypeManage_add_sure = hasPermission("noticeManager_noticeTypeManage_add_sure")
        this.showList.noticeManager_noticeTypeManage_edit_sure = hasPermission("noticeManager_noticeTypeManage_edit_sure")

			}

    }
  }
</script>

<style scoped>

</style>
