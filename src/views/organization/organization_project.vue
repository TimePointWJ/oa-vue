<template>
    <div class="app-container">
        <!--
            查询条件和按钮
        -->
        <div class="filter-container">
            <!-- <el-button class="filter-item" type="primary" style="margin-left: 6px;" icon="search" @click="fetchData">搜索</el-button> -->
            <el-button class="filter-item" style="margin-left: 10px;" @click="addProject" type="primary" icon="edit">添加项目</el-button>
        </div>
        <div class="filter-container">
            <!--
                项目列表
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
                                <!-- <el-form-item label="手机号">
                                    <span>{{ staff.mobilePhone }}</span>
                                </el-form-item> -->
                                <el-form-item>
                                    <el-button type="danger" size="mini" @click="deleteProjectStaff(staff.id)">删除</el-button>
                                </el-form-item>
                            </span>
                        </el-form>
                    </template>
                </el-table-column>
                <el-table-column label="项目名称" prop="name"></el-table-column>
                <el-table-column label="项目经理" prop="managerName"></el-table-column>
                <el-table-column label="项目副经理" prop="assistantManagerName"></el-table-column>
                <el-table-column prop="id" align="center" label="操作" width="300" >
                    <template slot-scope="scope">
                        <el-button size="small" type="primary" @click="addStaff(scope.row)">添加员工</el-button>
                        <el-button size="small" type="success" @click="updateProject(scope.row)">修改</el-button>
                        <el-button size="small" type="danger" @click="deleteProject(scope.row.id)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div align="center">
                <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage" :page-sizes="[10, 20, 30, 40,2]"
                    :page-size="pagesize" layout="total, sizes, prev, pager, next, jumper" :total="totalCount">
                </el-pagination>
            </div>
            <!--
                添加新项目dialog
            -->
            <el-dialog title="添加项目" :visible.sync="addProjectDialog" :before-close="addProjectDialogClose">
                <!--项目表单 -->
                <el-form :model="addProjectForm" :rules="projectFormRules" ref="addProjectForm" label-width="15%" size="30%">
                    <el-form-item label="项目名称" prop="name">
                        <el-input v-model="addProjectForm.name" placeholder="请输入项目名称" style='width: 50%;'></el-input>
                    </el-form-item>
                    <el-form-item label="项目经理" prop="managerId">
                        <el-select clearable class="filter-item" v-model="addProjectForm.managerId" placeholder="请选择项目经理">
                            <el-option v-for="item in  listProjectManager" :key="item.id" :label="item.name" :value="item.id"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="项目副经理" prop="assistantManagerId">
                        <el-select clearable class="filter-item" v-model="addProjectForm.assistantManagerId" placeholder="请选择项目副经理">
                            <el-option v-for="item in  listProjectAsstantManager" :key="item.id" :label="item.name" :value="item.id"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="备注" prop="remark">
                        <el-input type="textarea" v-model="addProjectForm.remark" style='width: 50%;'></el-input>
                    </el-form-item>
                    <el-button style='margin-bottom:20px;margin-left:35%;' type="primary" icon="document" @click="submitaddProjectForm('addProjectForm')">提交</el-button>
                </el-form>
            </el-dialog>
            <!--
                修改项目dialog
            -->
            <el-dialog title="修改项目" :visible.sync="updateProjectDialog" :before-close="updateProjectDialogClose">
                <!--项目表单 -->
                <el-form :model="updateProjectForm" :rules="projectFormRules" ref="updateProjectForm" label-width="15%" size="30%">
                    <el-form-item label="项目名称" prop="name">
                        <el-input v-model="updateProjectForm.name" placeholder="请输入项目名称" style='width: 50%;'></el-input>
                    </el-form-item>
                    <el-form-item label="项目经理" prop="managerId">
                        <el-select clearable class="filter-item" v-model="updateProjectForm.managerId" placeholder="请选择项目经理">
                            <el-option v-for="item in  listProjectManager" :key="item.id" :label="item.name" :value="item.id"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="项目副经理" prop="assistantManagerId">
                        <el-select clearable class="filter-item" v-model="updateProjectForm.assistantManagerId" placeholder="请选择项目副经理">
                            <el-option v-for="item in  listProjectAsstantManager" :key="item.id" :label="item.name" :value="item.id"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="备注" prop="remark">
                        <el-input type="textarea" v-model="updateProjectForm.remark" style='width: 50%;'></el-input>
                    </el-form-item>
                    <el-button style='margin-bottom:20px;margin-left:35%;' type="primary" icon="document" @click="submitUpdateProjectForm('updateProjectForm')">提交</el-button>
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
                    <el-form-item label="项目" prop="projectId">
                        <el-select clearable class="filter-item" v-model="updateStaffForm.projectId" placeholder="请选择项目">
                            <el-option v-for="item in  listProject" :key="item.id" :label="item.name" :value="item.id"></el-option>
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
            <!--
                给项目添加员工
            -->
            <el-dialog title="添加员工" :visible.sync="addStaffDialog" :before-close="addStaffDialogClose">
                <!--查询员工-->
                <el-select filterable clearable style="width: 200px" class="filter-item" v-model="staffQuery.departmentId" @change="selectStaff" placeholder="部门">
                    <el-option v-for="item in listDepartment" :key="item.id" :label="item.name" :value="item.id"/>
                </el-select>
                <el-input @keyup.enter.native="selectStaff" style="width: 150px;" class="filter-item" placeholder="员工姓名" v-model="staffQuery.name"/>
                <el-button class="filter-item" type="primary" style="margin-left: 6px;" icon="search" @click="selectStaff">搜索员工</el-button>
                <!--拖拉选择器-->
                <dnd-list :list1="list1" :list2="list2" :list1Title="addStaffForm.name" list2Title="请选择员工"></dnd-list>
                <el-button style='margin-bottom:20px;margin-left:35%;' type="primary" icon="document" @click="submitAddStaffForm">提交</el-button>
            </el-dialog>
        </div>
    </div>
</template>
<script>
    import { selectStaffByQuery} from '@/api/staff'
    import { getProjectStaffByPositionId,updateProjectStaff,deleteProjectStaff} from '@/api/projectStaff'
    import { pagination,insertProject,updateProject,deleteProject,addStaffToProject} from '@/api/project'
    import { dictionaryList, projectList,positionList,departmentList} from '@/api/common'
    import DndList from '@/components/DndList'
    // 员工数据模板
    const staffTemp = {
        id:null,//员工编号
        projectId:null,//项目编号
        staffNo:null,//员工工号
        name:null,//员工名
        sex:null,//性别
        positionId:null,//职位   1.总经理、2.项目经理、3.人事、4.财务、5.员工
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
        remark:null,//备注
        addStaffs:null//添加员工集合
    }
    //项目数据模板
    const projectTemp={
        id:null,//项目id
        name:null,//项目名称
        managerId:null,//项目经理id
        assistantManagerId:null,//项目副经理id
        remark:null,//备注
    }
    export default {
        components: { DndList },
        data() {
            return {
                list1: [],
                //list2: [{id:1,name:"张三",departmentName:"一部",positionName:"普通员工"},{id:2,name:"周全",departmentName:"二部",positionName:"部门经理"}],
                list2: [],
                list:null,
                listLoading: true,
                listDepartment:[],//部门列表
                listProject:[],//项目
                listProjectAsstantManager:[],//项目副经理
                listProjectManager:[],//项目经理
                totalCount: 0,
                pagesize: 10,
                currentPage: 1,
                listQuery : {
                    pageNum: 1,
                    pageSize: 10
                },
                staffQuery:{
                    name:null,
                    departmentId:null,
                    projectId:null
                },
                addProjectDialog:false,//添加项目dialog
                updateProjectDialog:false,//修改项目dialog
                updateStaffDialog:false,//修改员工dialog
                addStaffDialog:false,//添加员工dialog
                addProjectForm:Object.assign({}, projectTemp),//添加项目表单
                updateProjectForm:Object.assign({}, projectTemp),//修改项目表单
                updateStaffForm:Object.assign({}, staffTemp),//修改员工表单
                addStaffForm:Object.assign({}, staffTemp),//修改员工表单
                projectFormRules:{
                    name:[{ required: true, message: '请输入项目名称', trigger: 'blur' }],//员工工号
                },
                staffFormRules:{

                },
                addStaffFormRules:{

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
            submitUpdateProjectForm(formName){
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        this.$confirm('确认提交', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {
                        updateProject(this.updateProjectForm).then(response => {
                            this.listLoading = false;
                            if (response.data.statusCode == 200) {
                                this.$notify({
                                    title: '成功',
                                    message: '提交成功',
                                    type: 'success',
                                    duration: 2000
                                });
                                this.updateProjectDialog=false
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
                        return false;
                    }
                });
            },
            /**
             * 添加-提交表单
             */
            submitaddProjectForm(formName){
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        this.$confirm('确认添加', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {
                        insertProject(this.addProjectForm).then(response => {
                            this.listLoading = false;
                            if (response.data.statusCode == 200) {
                                this.$notify({
                                    title: '成功',
                                    message: '添加成功',
                                    type: 'success',
                                    duration: 2000
                                });
                                this.addProjectDialog=false
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
                        updateProjectStaff(this.updateStaffForm).then(response => {
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
                        return false;
                    }
                });
            },
            /**
             * 下拉框查询
             */
            selectList(){
                //项目副经理
                getProjectStaffByPositionId(4.0).then(response => {
                    this.listProjectAsstantManager=response.data.responseData
                })
                //项目经理
                getProjectStaffByPositionId(3.0).then(response => {
                    this.listProjectManager=response.data.responseData
                })
                //项目
                projectList().then(response => {
                    this.listProject=response.data.responseData
                })
                //部门
                departmentList().then(response => {
                    this.listDepartment=response.data.responseData
                })
            },
            /**
             * 添加项目click事件
             */
            addProject(){
                this.addProjectDialog=true;
            },
            /**
             * 点击修改事件
             */
            updateProject(row){
                this.updateProjectForm=row
                this.updateProjectDialog=true;
            },
            /**
             * 点击删除事件
             */
            deleteProject(data){
                const ids=new Array()
                if(ids.length==0){
                    ids.push(data)
                }
                this.$confirm('确认删除', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    deleteProject(ids).then(response => {
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
             * 从项目删除员工
             */
            deleteProjectStaff(data){
                const ids=new Array()
                if(ids.length==0){
                    ids.push(data)
                }
                this.$confirm('确认删除', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    deleteProjectStaff(ids).then(response => {
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
             * 添加项目dialog关闭
             */
            addProjectDialogClose(){
                this.addProjectDialog=false;
                this.$refs["addProjectForm"].resetFields();
            },
            /**
             * 修改项目dialog关闭
             */
            updateProjectDialogClose(){
                this.updateProjectDialog=false;
                this.$refs["updateProjectForm"].resetFields();
            },
            /**
             * 修改员工dialog关闭
             */
            updateStaffDialogClose(){
                this.updateStaffDialog=false;
            },
            /**
             * 添加员工dialog关闭
             */
            addStaffDialogClose(){
                this.addStaffDialog=false;
                this.list2=[];
                this.list1=[];
            },
            /**
             * 给项目添加员工
             */
            addStaff(data){
                this.addStaffForm=data;
                this.addStaffDialog=true;
            },
            /**
             * 根据条件查询员工
             */
            selectStaff(data){
                this.staffQuery.projectId=this.addStaffForm.id;
                selectStaffByQuery(this.staffQuery).then(response => {
                    this.list2=response.data.responseData
                })
            },
            /**
             *  提交添加员工到项目 
             */
            submitAddStaffForm(){
                this.addStaffForm.addStaffs=this.list1
                this.$confirm('确认提交', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.listLoading=true;
                    addStaffToProject(this.addStaffForm).then(response => {
                        this.listLoading = false;
                        if (response.data.statusCode == 200) {
                            this.$notify({
                                title: '成功',
                                message: '提交成功',
                                type: 'success',
                                duration: 2000
                            });
                            this.addStaffDialog=false
                            this.list2=[];
                            this.list1=[];
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
                    this.listLoading = false;
                    this.$message({
                        type: 'info',
                        message: '取消添加'
                    });
                });
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
</style>