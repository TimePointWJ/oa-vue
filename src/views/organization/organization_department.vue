<template>
    <div class="app-container">
        <!--
            查询条件和按钮
        -->
        <div class="filter-container">
            <!-- <el-button class="filter-item" type="primary" style="margin-left: 6px;" icon="search" @click="fetchData">搜索</el-button> -->
            <el-button class="filter-item" style="margin-left: 10px;" @click="addDept" type="primary" icon="edit">添加部门</el-button>
        </div>
        <div class="filter-container">
            <!--
                部门列表
            -->
            <el-table :data="list" style="width: 100%">
                <el-table-column type="expand">
                    <template slot-scope="props">
                        <el-form label-position="left" inline class="demo-table-expand">
                            <span v-for="staff in props.row.staffs">
                                <el-form-item label="姓名">
                                    <span style="cursor:pointer;color:#1d90e6;" @click="clickStaffName(staff)">{{ staff.name }}</span>
                                </el-form-item>
                                <el-form-item label="职位">
                                    <span>{{ staff.positionName }}</span>
                                </el-form-item>
                                <el-form-item label="工号">
                                    <span>{{ staff.staffNo }}</span>
                                </el-form-item>
                                <el-form-item label="手机号">
                                    <span>{{ staff.mobilePhone }}</span>
                                </el-form-item>
                            </span>
                        </el-form>
                    </template>
                </el-table-column>
                <el-table-column label="部门名称" prop="name"></el-table-column>
                <el-table-column label="部门经理" prop="managerName"></el-table-column>
                <el-table-column label="部门副经理" prop="assistantManagerName"></el-table-column>
                <el-table-column prop="id" align="center" label="操作" width="200">
                    <template slot-scope="scope">
                        <el-button size="small" type="success" @click="updateDept(scope.row)">修改</el-button>
                        <el-button size="small" type="danger" @click="deleteDept(scope.row.id)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div align="center">
                <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage" :page-sizes="[10, 20, 30, 40,2]"
                    :page-size="pagesize" layout="total, sizes, prev, pager, next, jumper" :total="totalCount">
                </el-pagination>
            </div>
            <!--
                添加新部门dialog
            -->
            <el-dialog title="添加部门" :visible.sync="addDeptDialog" :before-close="addDeptDialogClose">
                <!--部门表单 -->
                <el-form :model="addDeptForm" :rules="deptFormRules" ref="addDeptForm" label-width="15%" size="30%">
                    <el-form-item label="部门名称" prop="name">
                        <el-input v-model="addDeptForm.name" placeholder="请输入部门名称" style='width: 50%;'></el-input>
                    </el-form-item>
                    <el-form-item label="部门经理" prop="managerId">
                        <el-select clearable class="filter-item" v-model="addDeptForm.managerId" placeholder="请选择部门经理">
                            <el-option v-for="item in  listDeptManager" :key="item.id" :label="item.name" :value="item.id"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="部门副经理" prop="assistantManagerId">
                        <el-select clearable class="filter-item" v-model="addDeptForm.assistantManagerId" placeholder="请选择部门副经理">
                            <el-option v-for="item in  listDeptAsstantManager" :key="item.id" :label="item.name" :value="item.id"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="备注" prop="remark">
                        <el-input type="textarea" v-model="addDeptForm.remark" style='width: 50%;'></el-input>
                    </el-form-item>
                    <el-button style='margin-bottom:20px;margin-left:35%;' type="primary" icon="document" @click="submitaddDeptForm('addDeptForm')">提交</el-button>
                </el-form>
            </el-dialog>
            <!--
                修改部门dialog
            -->
            <el-dialog title="修改部门" :visible.sync="updateDeptDialog" :before-close="updateDeptDialogClose">
                <!--部门表单 -->
                <el-form :model="updateDeptForm" :rules="deptFormRules" ref="updateDeptForm" label-width="15%" size="30%">
                    <el-form-item label="部门名称" prop="name">
                        <el-input v-model="updateDeptForm.name" placeholder="请输入部门名称" style='width: 50%;'></el-input>
                    </el-form-item>
                    <el-form-item label="部门经理" prop="managerId">
                        <el-select clearable class="filter-item" v-model="updateDeptForm.managerId" placeholder="请选择部门经理">
                            <el-option v-for="item in  listDeptManager" :key="item.id" :label="item.name" :value="item.id"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="部门副经理" prop="assistantManagerId">
                        <el-select clearable class="filter-item" v-model="updateDeptForm.assistantManagerId" placeholder="请选择部门副经理">
                            <el-option v-for="item in  listDeptAsstantManager" :key="item.id" :label="item.name" :value="item.id"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="备注" prop="remark">
                        <el-input type="textarea" v-model="updateDeptForm.remark" style='width: 50%;'></el-input>
                    </el-form-item>
                    <el-button style='margin-bottom:20px;margin-left:35%;' type="primary" icon="document" @click="submitUpdateDeptForm('updateDeptForm')">提交</el-button>
                </el-form>
            </el-dialog>
            <!--
                修改员工dialog
            -->
            <el-dialog title="修改员工" :visible.sync="updateStaffDialog" :before-close="updateStaffDialogClose">
                <!-- 员工注册审核表单 -->
                <el-form :model="updateStaffForm" :rules="staffFormRules" ref="updateStaffForm" label-width="15%" size="30%">
                    <el-form-item label="姓名" prop="name">
                            <el-input disabled v-model="updateStaffForm.name" placeholder="请输入姓名" style='width: 50%;'></el-input>
                    </el-form-item>
                    <el-form-item label="部门" prop="departmentId">
                        <el-select clearable class="filter-item" v-model="updateStaffForm.departmentId" placeholder="请选择部门">
                            <el-option v-for="item in  listDepartment" :key="item.id" :label="item.name" :value="item.id"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="员工工号" prop="staffNo">
                        <el-input disabled v-model="updateStaffForm.staffNo" placeholder="请输入员工工号" style='width: 50%;'></el-input>
                    </el-form-item>
                    <el-form-item label="手机号" prop="mobilePhone">
                        <el-input disabled v-model="updateStaffForm.mobilePhone" style='width: 50%;'></el-input>
                    </el-form-item>
                    <el-button style='margin-bottom:20px;margin-left:35%;' type="primary" icon="document" @click="submitUpdateStaffForm('updateStaffForm')">提交</el-button>
                </el-form>
            </el-dialog>
        </div>
    </div>
</template>
<script>
    import { selectStaffById,getStaffByPositionId,updateStaff} from '@/api/staff'
    import { pagination,insertDept,updateDept,deleteDept} from '@/api/department'
    import { dictionaryList, departmentList,positionList} from '@/api/common'
    // 员工数据模板
    const staffTemp = {
        id:null,//员工编号
        departmentId:null,//部门编号
        staffNo:null,//员工工号
        name:null,//员工名
        sex:null,//性别
        positionId:null,//职位   1.总经理、2.部门经理、3.人事、4.财务、5.员工
        mobilePhone:null,//手机号
        password:null,//密码
        entryTime:null,//入职时间
        graduationTime:null,//毕业时间
        graduationSchool:null,//毕业院校
        education:null,//学历  0：专科 1：本科
        subject:null,//专业
        beginDevelopmentTime:null,//软件开发开始时间
        email:null,//电子邮箱
        provinceId:null,//省份
        cityId:null,//城市
        districtId:null,//地区
        address:null,//地址
        provinceName:null,
        cityName:null,
        districtName:null,
        identityCard:null,//身份证
        checkStatus:null,//审核状态   0：已审核 1：未审核
        status:null,//在职状态   0.在职 1.离职
        remark:null//备注
    }
    //部门数据模板
    const deptTemp={
        id:null,//部门id
        name:null,//部门名称
        managerId:null,//部门经理id
        assistantManagerId:null,//部门副经理id
        remark:null//备注
    }
    export default {
        data() {
            return {
                list:null,
                listLoading: true,
                listDepartment:[],//部门
                listDeptAsstantManager:[],//部门副经理
                listDeptManager:[],//部门经理
                totalCount: 0,
                pagesize: 10,
                currentPage: 1,
                listQuery : {
                    pageNum: 1,
                    pageSize: 10
                },
                addDeptDialog:false,//添加部门dialog
                updateDeptDialog:false,//修改部门dialog
                updateStaffDialog:false,//修改员工dialog
                addDeptForm:Object.assign({}, deptTemp),//添加部门表单
                updateDeptForm:Object.assign({}, deptTemp),//修改部门表单
                updateStaffForm:Object.assign({}, staffTemp),//修改员工表单
                deptFormRules:{
                    name:[{ required: true, message: '请输入部门名称', trigger: 'blur' }],//员工工号
                },
                staffFormRules:{

                },
            }
        },
        created() {
            this.selectList()//查询下拉框
            this.fetchData()
        },
        methods: {
            /**
             * 初期化
             */
            fetchData() {
                this.listLoading = true
                this.listQuery.pageNum=this.currentPage
                this.listQuery.pageSize=this.pagesize
                pagination(this.listQuery).then(response => {
                    const data=response.data.responseData
                    console.log(data);
                    this.list=data.list
                    this.totalCount = data.total
                    this.listLoading = false
                })
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
            /**
             * 修改-提交表单
             */
            submitUpdateDeptForm(formName){
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        this.$confirm('确认提交', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {
                        updateDept(this.updateDeptForm).then(response => {
                            this.listLoading = false;
                            if (response.data.statusCode == 200) {
                                this.$notify({
                                    title: '成功',
                                    message: '提交成功',
                                    type: 'success',
                                    duration: 2000
                                });
                                this.updateDeptDialog=false
                                this.$refs[formName].resetFields();
                                this.fetchData()
                            } else {
                                this.$notify({
                                    title: '失败',
                                    message: response.data.statusMsg,
                                    type: 'info',
                                    duration: 2000
                                });
                            }
                        })
                    }).catch(() => {
                        this.$message({
                            type: 'info',
                            message: '取消提交'
                        });
                    });
                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                });
            },
            /**
             * 添加-提交表单
             */
            submitaddDeptForm(formName){
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        this.$confirm('确认添加', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {
                        insertDept(this.addDeptForm).then(response => {
                            this.listLoading = false;
                            if (response.data.statusCode == 200) {
                                this.$notify({
                                    title: '成功',
                                    message: '添加成功',
                                    type: 'success',
                                    duration: 2000
                                });
                                this.addDeptDialog=false
                                this.$refs[formName].resetFields();
                                this.fetchData()
                            } else {
                                this.$notify({
                                    title: '失败',
                                    message: response.data.statusMsg,
                                    type: 'info',
                                    duration: 2000
                                });
                            }
                        })
                    }).catch(() => {
                        this.$message({
                            type: 'info',
                            message: '取消添加'
                        });
                    });
                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                });
            },
            /**
             * 提交表单-修改员工
             */
            submitUpdateStaffForm(formName){
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        this.$confirm('确认提交', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {
                        updateStaff(this.updateStaffForm).then(response => {
                            this.listLoading = false;
                            if (response.data.statusCode == 200) {
                                this.$notify({
                                    title: '成功',
                                    message: '提交成功',
                                    type: 'success',
                                    duration: 2000
                                });
                                this.updateStaffDialog=false
                                this.$refs[formName].resetFields();
                                this.fetchData()
                            } else {
                                this.$notify({
                                    title: '失败',
                                    message: response.data.statusMsg,
                                    type: 'info',
                                    duration: 2000
                                });
                            }
                        })
                    }).catch(() => {
                        this.$message({
                            type: 'info',
                            message: '取消提交'
                        });
                    });
                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                });
            },
            /**
             * 下拉框查询
             */
            selectList(){
                //部门副经理
                getStaffByPositionId(4.0).then(response => {
                    this.listDeptAsstantManager=response.data.responseData
                })
                //部门经理
                getStaffByPositionId(3.0).then(response => {
                    this.listDeptManager=response.data.responseData
                })
                //部门
                departmentList().then(response => {
                    this.listDepartment=response.data.responseData
                })
            },
            /**
             * 添加部门click事件
             */
            addDept(){
                this.addDeptDialog=true;
            },
            /**
             * 点击修改事件
             */
            updateDept(row){
                this.updateDeptForm=row
                this.updateDeptDialog=true;
            },
            /**
             * 点击删除事件
             */
            deleteDept(date){
                const ids=new Array()
                if(ids.length==0){
                    ids.push(date)
                }
                this.$confirm('确认删除', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    deleteDept(ids).then(response => {
                        if(response.data.statusCode==200){
                            this.$notify({
                                title: '成功',
                                message: '删除成功',
                                type: 'success',
                                duration: 2000
                            })
                            this.fetchData();
                        }else{
                            this.$notify({
                                title: '失败',
                                message: '删除失败',
                                type: 'info',
                                duration: 2000
                            })
                        }
                    })
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '取消删除'
                    });
                });
            },
            /**
             * 点击员工姓名
             */
            clickStaffName(staff){
                this.updateStaffForm=staff
                this.updateStaffDialog=true;
            },
            /**
             * 添加部门dialog关闭
             */
            addDeptDialogClose(){
                this.addDeptDialog=false;
                this.$refs["addDeptForm"].resetFields();
            },
            /**
             * 修改部门dialog关闭
             */
            updateDeptDialogClose(){
                this.updateDeptDialog=false;
                this.$refs["updateDeptForm"].resetFields();
            },
            /**
             * 修改员工dialog关闭
             */
            updateStaffDialogClose(){
                this.updateStaffDialog=false;
            },
        }
    }
</script>

<style>
  .demo-table-expand {
    font-size: 0;
  }
  .demo-table-expand label {
    width: 90px;
    color: #99a9bf;
  }
  .demo-table-expand .el-form-item {
    margin-right: 0;
    margin-bottom: 0;
    width: 23%; 
  }
  /*@media screen and (max-width:1500px){
    *{font-size:20px}
    }*/
</style>
<!--
<style rel="stylesheet/scss" lang="scss">
@media screen and (max-width:1500px){
$bg:#2d3a4b;
$light_gray:#000;

/* reset element-ui css */
.filter-container {
    .el-dialog{
      .el-form{
        .el-form-item{

            .el-form-item__label{
                font-size:20px;
            }
            .el-form-item__content{
                font-size:20px;
            .el-input{
                font-size:20px;
              .el-input__inner{
                font-size:20px;
                
              }
            }
          }
          
        }
      }
    }

         .el-pagination{
            font-size:20px;
            .el-pagination__total{
                font-size:20px;
            } 
            .el-pagination__sizes{
                *{font-size:20px;}
                font-size:20px;
                
                    font-size:20px;
                    .el_input{
                        *{font-size:20px;}
                        font-size:20px;
                        .el-input__inner{
                            *{font-size:20px;}
                            font-size:20px;
                        }
                        .el-input__suffix{
                            font-size:20px;
                        }

                    }
                    .contract-trigger{
                        font-size:20px;
                        .expand-trigger{
                            font-size:20px;
                        }
                        .contract-trigger{
                            font-size:20px;   
                        }
                    }
                
            }

            *{font-size:20px;}
            .el-pagination__jump{
                font-size:20px;
            }
        }
    
       
}

   }
  
</style>
-->