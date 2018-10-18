<template>
    <div class="app-container">
        <div class="filter-container">
            <el-container style="height: 700px; border: 1px solid #eee">
                <el-aside width="200px" style="background-color: rgb(238, 241, 246)">
                    <el-menu v-for="dept in list" :key="dept.id">
                        <el-submenu index="dept.id">
                            <template slot="title"><i class="el-icon-menu"></i>{{dept.name}}</template>
                            <ul role="menu" class="el-menu" v-for="staff in dept.staffs" :key="staff.id">
                                <li role="menuitem" tabindex="staff.id" class="menuItem">{{staff.name}}</li>
                            </ul>
                        </el-submenu>
                    </el-menu>
                </el-aside>
                <el-container>
                    <el-header style="text-align: right; font-size: 12px">
                        <el-dropdown>
                            <i class="el-icon-setting" style="margin-right: 15px"></i>
                            <el-dropdown-menu slot="dropdown">
                                <el-dropdown-item>查看</el-dropdown-item>
                                <el-dropdown-item>新增</el-dropdown-item>
                                <el-dropdown-item>删除</el-dropdown-item>
                            </el-dropdown-menu>
                        </el-dropdown>
                        <span>王小虎</span>
                    </el-header>
                    <el-main>
                        <div style="height:80%"></div>
                        <el-input type="textarea" style="width:93%"></el-input>
                        <el-button  style="width:6%" type="primary">发送</el-button>
                    </el-main>
                </el-container>
            </el-container>
        </div>
    </div>
</template>
<style>
  .el-header {
    background-color: #B3C0D1;
    color: #333;
    line-height: 60px;
  }
  
  .el-aside {
    color: #333;
  }
  .menuItem{
    height:50px;
    line-height: 50px;
    color:black;
    background-color: #DFEEFE;
    padding-left: 40px;
    cursor:pointer;
  }
  .menuItem:hover{
    background-color: #C6E2FD;
  }
</style>

<script>
    import { pagination} from '@/api/department'
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
        remark:null//备注
    }
    export default {
        data() {
            const item = {
                date: '2016-05-02',
                name: '王小虎',
                address: '上海市普陀区金沙江路 1518 弄'
            };
            return {
                tableData: Array(20).fill(item),
                list:null,
                listLoading: true,
                totalCount: 0,
                pagesize: 10,
                currentPage: 1,
                listQuery : {
                    pageNum: 1,
                    pageSize: 10
                },
            }
        },
         created() {
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
        }
    };
</script>