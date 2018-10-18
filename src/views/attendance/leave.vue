<template>
  <div class="app-container" v-loading.body="listLoading" element-loading-text="拼命加载中">

    <div class="filter-container">
      <el-button class="filter-item" type="primary" icon="edit" @click="addOneDate" v-if="showList.attendance_leave_add">添加</el-button>
      <el-button class="filter-item" type="danger" @click="handleMultipleDelete" icon="delete" v-if="showList.attendance_leave_batch_delete">批量删除</el-button>
    </div>

    <div>
      <el-table :data="list" border highlight-current-row @selection-change="handleSelectionChange" ref="multipleTable">
        <el-table-column type="selection" align="center"></el-table-column>
        <!-- <el-table-column prop="id" label="请假编号" sortable></el-table-column> -->
        <el-table-column prop="name" label="请假名称" sortable></el-table-column>
        <el-table-column prop="ids" align="center" min-width="200px" label="操作">
          <template slot-scope="scope">
            <el-button size="small" type="success" @click="updateOneData(scope.row)" v-if="showList.attendance_leave_edit">编辑</el-button>
            <el-button size="small" type="danger" @click="deleteOneData(scope.row)" v-if="showList.attendance_leave_delete">删除</el-button>
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
      <el-form :model="addLeave" :rules="addRules" ref="addForm">
        <el-form-item label="请假类型名称" prop="name">
          <el-input v-model="addLeave.name" auto-complete="off" placeholder="请输入请假类型名称"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer" width="1px">
        <el-button @click="cancelAdd('addForm')" v-if="showList.attendance_leave_add_cancle">取 消</el-button>
        <el-button type="primary" @click="submitAdd('addForm')" v-if="showList.attendance_leave_add_sure">确 定</el-button>
      </div>
    </el-dialog>
    <!--编辑请假信息-->
    <el-dialog title="编辑请假信息" :visible.sync="dialogFormVisible" :before-close="handleCloseUpdate">
      <el-form :model="addLeave" :rules="addRules" ref="editForm">
        <!-- <el-form-item label="请假编号" prop="id">
          <el-input v-model="addLeave.id" auto-complete="off" disabled></el-input>
        </el-form-item> -->
        <el-form-item label="请假名称" prop="name">
          <el-input v-model="addLeave.name" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer" width="1px">
        <el-button @click="cancelEdit('editForm')" v-if="showList.attendance_leave_edit_cancle">取 消</el-button>
        <el-button type="primary" @click="submitEdit('editForm')" v-if="showList.attendance_leave_edit_sure">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import { getList,insertOrUpdate,deleteLeave,delList } from '@/api/leave'
  import { hasPermission } from '@/utils/button'

  export default {
    name: 'backToTop-demo',
    data() {
      return {
        showList: {
          attendance_leave_add:false,
          attendance_leave_batch_delete:false,
          attendance_leave_edit:false,
          attendance_leave_delete:false,
          attendance_leave_cancle:false,
          attendance_leave_add_cancle:false,
          attendance_leave_add_sure:false,
          attendance_leave_edit_cancle:false,
          attendance_leave_edit_sure:false
        },
        list: null,
        totalCount: 10,
        pagesize: 10,
        currentPage: 1,
        listLoading: true,
        addDialogFormVisible: false,//添加弹窗显示状态
        dialogFormVisible: false,//编辑弹窗显示状态
        addLeave: {
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
      addOneDate() {//使添加框显示
        this.reset();
        this.addDialogFormVisible = true;
        this.showList.leave_type_add_cancel = true;
        this.showList.leave_type_add_sure = true;
      },
      handleClose(done){//使添加框不显示
        this.reset();
        this.addDialogFormVisible=false;
        this.$refs.addForm.resetFields();
        this.addLeave.name = '';
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
                name: this.addLeave.name
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
            this.addLeave.name = '';
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
        this.addLeave.name = '';
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
                          id: this.addLeave.id,
                          name: this.addLeave.name,
                          delFlg: this.addLeave.delFlg,
                          version: this.addLeave.version,
                          createId: this.addLeave.createId,
                          createTime: this.addLeave.createTime,
                          updateId: this.addLeave.updateId,
                          updateTime: this.addLeave.updateTime
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
         this.addLeave = row;
         this.dialogFormVisible = true;
         this.showList.leave_type_edit_sure = true;
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
              deleteLeave(data).then(response => {
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
        this.addLeave = {
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
        this.showList.attendance_leave_add = hasPermission("attendance_leave_add")
        this.showList.attendance_leave_batch_delete = hasPermission("attendance_leave_batch_delete")
        this.showList.attendance_leave_edit = hasPermission("attendance_leave_edit")
        this.showList.attendance_leave_delete = hasPermission("attendance_leave_delete")
        this.showList.attendance_leave_cancle = hasPermission("attendance_leave_cancle")
        this.showList.attendance_leave_add_cancle = hasPermission("attendance_leave_add_cancle")
        this.showList.attendance_leave_add_sure = hasPermission("attendance_leave_add_sure")
        this.showList.attendance_leave_edit_cancle = hasPermission("attendance_leave_edit_cancle")
        this.showList.attendance_leave_edit_sure = hasPermission("attendance_leave_edit_sure")
			}

    }
  }
</script>

<style scoped>

</style>
