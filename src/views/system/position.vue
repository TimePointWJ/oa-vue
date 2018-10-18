<template>
  <div class="app-container" v-loading.body="listLoading" element-loading-text="拼命加载中">

    <div class="filter-container">
      <el-button class="filter-item" type="primary" icon="edit" @click="add" >添加</el-button>
      <el-button class="filter-item" type="danger" @click="handleMultipleDelete" icon="delete" >批量删除</el-button>
    </div>

    <div>
      <el-table :data="list" border highlight-current-row @selection-change="handleSelectionChange" ref="multipleTable">
        <el-table-column type="selection" align="center"></el-table-column>
        <!-- <el-table-column prop="id" label="请假编号" sortable></el-table-column> -->
        <el-table-column prop="positionName" label="职位名称" sortable></el-table-column>
        <el-table-column prop="rank" label="职位类别" sortable>
          <template slot-scope="scope">
            <span v-if="scope.row.rank==1">管理员</span>
            <span v-if="scope.row.rank==2">经理</span>
            <span v-if="scope.row.rank==3">普通员工</span>
          </template>
        </el-table-column>
        <el-table-column prop="remark" label="备注" sortable>
        </el-table-column>
        <el-table-column prop="id" align="center" min-width="200px" label="操作">
          <template slot-scope="scope">
            <el-button size="small" type="success" @click="updateOneData(scope.row)" >编辑</el-button>
            <el-button size="small" type="danger" @click="deleteOneData(scope.row)" >删除</el-button>
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
      <el-form :model="position" :rules="addRules" ref="addForm">
        <el-form-item label="职位名称" prop="positionName">
          <el-input v-model="position.positionName" auto-complete="off" placeholder="请输入职位名称" style="width:200px"></el-input>
        </el-form-item>
        <el-form-item label="职位类别" prop="rank">
          <el-select v-model="position.rank" placeholder="职位类别" class="filter-item" clearable filterable>
                <el-option v-for="item in positionRank" :key="item.key" :label="item.value" :value="item.key">
                </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="position.remark" auto-complete="off" placeholder="请输入职位备注" style="width:230px"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer" width="1px">
        <el-button @click="cancelAdd('addForm')" >取 消</el-button>
        <el-button type="primary" @click="submitAdd('addForm')">确 定</el-button>
      </div>
    </el-dialog>
    <!--编辑-->
    <el-dialog title="编辑类别信息" :visible.sync="dialogFormVisible" :before-close="handleCloseUpdate">
      <el-form :model="position" :rules="addRules" ref="editForm">
        <el-form-item label="职位名称" prop="positionName">
          <el-input v-model="position.positionName" auto-complete="off" placeholder="请输入职位名称" style="width:200px"></el-input>
        </el-form-item>
        <el-form-item label="职位类别" prop="rank">
          <el-select v-model="position.rank" placeholder="职位类别" class="filter-item" clearable filterable>
                <el-option v-for="item in positionRank" :key="item.key" :label="item.value" :value="item.key">
                </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="position.remark" auto-complete="off" placeholder="请输入职位备注" style="width:230px"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer" width="1px">
        <el-button @click="cancelEdit('editForm')" >取 消</el-button>
        <el-button type="primary" @click="submitEdit('editForm')" >确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import { getList,insertOrUpdate,deleteType,delList } from '@/api/system/position'
  import { dictionaryList } from '@/api/common'
  import { hasPermission } from '@/utils/button'

  export default {
    name: 'backToTop-demo',
    data() {
      return {
        list: null,
        totalCount: 10,
        pagesize: 10,
        currentPage: 1,
        listLoading: true,
        addDialogFormVisible: false,//添加弹窗显示状态
        dialogFormVisible: false,//编辑弹窗显示状态
        positionRank:null,//职位类别
        position: {
          id: null,
          positionName: null,
          rank:null,
          remark:null,
          delFlg: null,
          version: null,
          createId: null,
          createTime: null,
          updateId: null,
          updateTime: null
        },
        addRules: {//添加规则
          positionName: [
            { required: true, message: '请输入职位名称', trigger: 'blur' },
            { min: 2, max: 50, message: '长度在 2 到 50 个字符', trigger: 'blur' }
          ],
          rank: [
            { required: true, message: '请选择职位类别', trigger: 'blur' },
          ]
        }
      }
    },
    created() {
      this.fetchData();
      //this.buttonControl()
      this.getList();
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
        this.position.positionName = '';
        this.position.rank = null;
        this.position.remark = '';
      },
      submitAdd(formName) {//提交添加
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.$confirm('确认添加', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
            insertOrUpdate(this.position).then(response => {
              const responseData = response.data
              if(responseData){
                const flg = responseData.responseData;
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
            this.position.positionName = '';
            this.position.rank = null;
            this.position.remark = '';
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
        this.position.positionName = '';
        this.position.rank = null;
        this.position.remark = '';
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
                      insertOrUpdate(this.position).then(response => {
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
         this.position = row;
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
        this.position = {
          id: null,
          positionName: null,
          rank: null,
          remark: null,
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
      getList(){
        dictionaryList('1000390').then(response =>{
          this.positionRank=response.data.responseData
        })
      },

    }
  }
</script>

<style scoped>

</style>
