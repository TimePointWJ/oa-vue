<template>
    <div class="app-container">
        <div class="filter-container">
            <!--
                查询条件和按钮
            -->
            <div class="filter-container">
                <el-select filterable clearable style="width: 200px" class="filter-item" v-model="listQuery.departmentId" @change="fetchData" placeholder="部门">
                    <el-option v-for="item in listDepartment" :key="item.id" :label="item.name" :value="item.id"/>
                </el-select>
                <el-select filterable clearable style="width: 200px" class="filter-item" v-model="listQuery.positionId" @change="fetchData" placeholder="职位">
                    <el-option v-for="item in  listPosition" :key="item.id" :label="item.positionName" :value="item.id"></el-option>
                </el-select>
                <el-input @keyup.enter.native="fetchData" style="width: 150px;" class="filter-item" placeholder="员工姓名" v-model="listQuery.name"/>
                <el-button class="filter-item" type="primary" style="margin-left: 6px;" icon="search" @click="fetchData">搜索</el-button>
                <!-- <el-button class="filter-item" @click="" type="primary">批量导入员工</el-button> -->
            </div>
            <!--
                通讯录list
            -->
            <el-table :data="list" border fit highlight-current-row>
                <!-- <el-table-column prop="" label="部门" sortable>
                    <template slot-scope="scope">
                        <span v-if="scope.row.departmentName !=null&&scope.row.positionName!=null">{{scope.row.departmentName+"-"+scope.row.positionName}}</span>
                    </template>
                </el-table-column> -->
                <el-table-column prop="departmentName" label="部门" sortable></el-table-column>
                <el-table-column prop="name" label="姓名" sortable></el-table-column>
                <el-table-column prop="sex" label="性别" sortable>
                    <template slot-scope="scope">
                        <span v-if="scope.row.sex == 'M'">男</span>
                        <span v-if="scope.row.sex == 'F'">女</span>
                    </template>
                </el-table-column>
                <el-table-column prop="positionName" label="职位" sortable></el-table-column>
                <el-table-column prop="mobilePhone" label="手机号" sortable>
                    <template slot-scope="scope">
                        <span @click="phone(scope.row.mobilePhone)" style="cursor:pointer;color:#1d90e6;">{{scope.row.mobilePhone}}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="id" align="center" label="消息" width="100">
                    <template slot-scope="scope">
                        <el-badge :value="scope.row.countMessage" class="item">
                            <el-button size="small" type="primary" class="el-icon-edit-outline" @click="clickMessage(scope.row)">消息</el-button>
                        </el-badge>
                    </template>
                </el-table-column>
                <el-table-column prop="privateFlg" align="center" label="加入我的通讯录" width="120">
                    <template slot-scope="scope">
                        <el-button v-if="scope.row.privateFlg==0" size="small" type="success" class="el-icon-plus" @click="addToPrivate(scope.row)">添加</el-button>
                        <el-button v-else size="small" type="warning" class="el-icon-minus" @click="moveFormPrivate(scope.row)">移出</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div align="center">
                <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="currentPage" :page-sizes="[10, 20, 30, 40,2]"
                    :page-size="pagesize" layout="total, sizes, prev, pager, next, jumper" :total="totalCount">
                </el-pagination>
            </div>
            <!--
                chat
            -->
            <el-dialog :title="messageDialogTitle" :visible.sync="messageDialog" :before-close="messageDialogClose">
                <el-button style="width:100px;" type="primary" class="filter-item el-icon-refresh" @click="clickRefresh">刷新</el-button>
                <el-button class="filter-item" type="danger"  @click="deleteAllMessage">删除全部聊天记录</el-button>
                <div align="center">
                    <el-pagination @size-change="handleSizeChangeMessage" @current-change="handleCurrentChangeMessage" :current-page.sync="currentPageMessage" :page-sizes="[10, 20, 30, 40,2]"
                        :page-size="pagesizeMessage" layout="total, sizes, prev, pager, next, jumper" :total="totalCountMessage">
                    </el-pagination>
                </div>
                <el-table :data="messageList" border fit highlight-current-row>
                    <el-table-column prop="sendName" label="发送者" sortable></el-table-column>
                    <el-table-column prop="message" label="消息内容" sortable></el-table-column>
                    <el-table-column prop="createTime" label="发送时间" sortable>
                        <template slot-scope="scope">
                            <span v-if="scope.row.createTime != null">{{scope.row.createTime | parseTime('{y}-{m}-{d} {h}:{i}')}}</span>
                            <span v-else></span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="readFlg" label="状态" sortable>
                        <template slot-scope="scope">
                            <span v-if="scope.row.readFlg =='0'&&scope.row.sendName !='我'" style="color:red;">新消息</span>
                            <span v-if="scope.row.readFlg =='1'&&scope.row.sendName !='我'">我已查看</span>
                            <span v-if="scope.row.readFlg =='0'&&scope.row.sendName =='我'" style="color:green">已发送</span>
                            <span v-if="scope.row.readFlg =='1'&&scope.row.sendName =='我'">对方已查看</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="操作" width="110">
                        <template slot-scope="scope">
                             <el-button size="small" type="danger" @click="deleteMessage(scope.row)">删除此条</el-button>
                        </template>
                    </el-table-column>
                </el-table>
                <el-form :model="messageForm" ref="messageForm">
                    <el-form-item>
                        <el-input type="textarea" style="width:89%" @keyup.enter.native="sendMessage()"  v-model="messageForm.message"></el-input>
                        <el-button  style="width:10%" type="primary" @click="sendMessage()">发送</el-button>
                    </el-form-item>
                </el-form>
            </el-dialog>
        </div>
    </div>
</template>
<style>
    .item {
        margin-top: 10px;
        margin-right: 40px;
    }
</style>
<script>
    import { paginationPublic,addToPrivate,moveFormPrivate} from '@/api/address'
    import { paginationMessage,sendMessage,deleteAllMessage,deleteMessage} from '@/api/message'
    import { departmentList,positionList} from '@/api/common'
    import { parseTime } from '@/utils'
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
    //消息模板
    const messageTemp={
        id:null,
        title:null,
        message:null,
        sendId:sessionStorage.getItem("userId"),
        receiveId:null,
        readFlg:null,
    }
    //私有通讯录模板
    const addressPrivateTemp={
        id:null,
        staffNo:null,//用户登录时用的登录名
        staffId:null,//用户搜藏的员工id
    }
    export default {
        data() {
            return {
                list:null,
                listLoading: true,
                totalCount: 0,
                pagesize: 10,
                currentPage: 1,
                totalCountMessage: 0,
                pagesizeMessage: 10,
                currentPageMessage: 1,
                listQuery : {
                    userId:sessionStorage.getItem("userId"),
                    staffNo:sessionStorage.getItem("staffNo"),
                    departmentId:null,
                    positionId:null,
                    pageNum: 1,
                    pageSize: 10
                },
                messageQuery:{
                    userId:sessionStorage.getItem("userId"),
                    staffNo:sessionStorage.getItem("staffNo"),
                    clickMessageFlg:"0",
                    staffId:null,
                    pageNum: 1,
                    pageSize: 10
                },
                listDepartment:[],//部门列表
                listPosition:[],
                messageDialogTitle:null,
                messageDialog:false,
                messageList:null,
                messageForm:Object.assign({}, messageTemp),
                addressPrivateForm:Object.assign({},addressPrivateTemp),
                clickMessageFlg:"0",
                sendMessageFlg:"0",
            }
        },
        created() {
            this.selectList()
            this.fetchData()
        },
        methods: {
            phone(phone){
                location.href="tel:"+phone;
                alert("tel:"+phone)
            },
            /**
             * 初期化
             */
            fetchData() {
                this.listLoading = true
                this.listQuery.pageNum=this.currentPage
                this.listQuery.pageSize=this.pagesize
                paginationPublic(this.listQuery).then(response => {
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
             * 每页显示数据量变更
             */
            handleSizeChangeMessage(val) {
                this.pagesizeMessage = val;
                this.clickMessage();
            },
            /**
             * 页码变更
             */
            handleCurrentChangeMessage(val) {
                //如果是发送消息的话，限制只能查询一次，
                if(this.sendMessageFlg=="0"){
                    //如果不是发送消息的话，也限制只能查一次
                    if(this.clickMessageFlg=="0"){
                        this.currentPageMessage = val;
                        this.clickMessage();
                    }
                    this.clickMessageFlg="0"
                }
                this.sendMessageFlg="0"
            },
            /**
             * 下拉框查询
             */
            selectList(){
                //部门
                departmentList().then(response => {
                    this.listDepartment=response.data.responseData
                })
                //职位
                positionList().then(response => {
                    this.listPosition=response.data.responseData
                })
            },
            /**
             * 点击消息按钮
             */
            clickMessage(row){
                this.listLoading = true
                if(row!=null){
                    this.messageDialogTitle=row.name;
                    this.messageQuery.staffId=row.id;
                    this.messageForm.receiveId=row.id;
                    //设置接收者id，全部删除的时候用到
                    sessionStorage.setItem("receiveId",row.id);
                    this.messageQuery.clickMessageFlg="1"
                    this.clickMessageFlg="1";
                }
                this.messageQuery.pageNum=this.currentPageMessage
                this.messageQuery.pageSize=this.pagesizeMessage
                paginationMessage(this.messageQuery).then(response => {
                    const data=response.data.responseData
                    this.messageList=data.list
                    console.log(this.messageList);
                    if(data.list.length!=0){
                        //如果两次相等，不会触发页码change事件，flg要归0
                        if(this.currentPageMessage==data.pageNum){
                            this.clickMessageFlg="0";
                        }else{
                            this.currentPageMessage=data.pageNum;
                        }
                    }
                    this.totalCountMessage = data.total;
                    this.messageQuery.clickMessageFlg="0"
                    this.listLoading = false
                })
                this.messageDialog=true;
            },
            /**
             * messageDialogClose关闭
             */
            messageDialogClose(){
                this.messageDialog=false;
                this.fetchData()
            },
            /**
             * clickRefresh
             */
            clickRefresh(){
                this.$refs['messageForm'].resetFields();
                this.messageQuery.clickMessageFlg="1"
                this.clickMessageFlg="1";
                this.clickMessage();
            },
            /**
             * 发送消息
             */
            sendMessage(){
                this.sendMessageFlg="1"
                //发送的时候再次确认userId
                this.messageForm.sendId=sessionStorage.getItem("userId");
                sendMessage(this.messageForm).then(response => {
                    if (response.data.statusCode == 200) {
                        this.messageForm.message=null;
                        if(this.messageList.length==this.pagesizeMessage){
                            this.currentPageMessage=9999
                            this.clickMessageFlg="1"
                        }
                        this.clickMessage();
                    } else {
                        this.$notify({
                            title: '失败',
                            message: response.data.statusMsg,
                            type: 'info',
                            duration: 2000
                        });
                    }
                })
            },
            /**
             * 添加到私有通讯录
             */
            addToPrivate(row){
                this.addressPrivateForm.staffNo=sessionStorage.getItem("staffNo");
                this.addressPrivateForm.staffId=row.id;
                addToPrivate(this.addressPrivateForm).then(response => {
                    if (response.data.statusCode == 200) {
                        this.$notify({
                            title: '成功',
                            message: "加入成功",
                            type: 'success',
                            duration: 2000
                        });
                        this.fetchData();
                    } else {
                        this.$notify({
                            title: '失败',
                            message: response.data.statusMsg,
                            type: 'info',
                            duration: 2000
                        });
                    }
                })
            },
            /**
             * 从私有通讯录移出
             */
            moveFormPrivate(row){
                this.addressPrivateForm.id=row.privateFlg;
                this.addressPrivateForm.staffNo=sessionStorage.getItem("staffNo");
                this.addressPrivateForm.staffId=row.id;
                moveFormPrivate(this.addressPrivateForm).then(response => {
                    if (response.data.statusCode == 200) {
                        this.$notify({
                            title: '成功',
                            message: "取消成功",
                            type: 'success',
                            duration: 2000
                        });
                        this.fetchData();
                    } else {
                        this.$notify({
                            title: '失败',
                            message: response.data.statusMsg,
                            type: 'info',
                            duration: 2000
                        });
                    }
                })
            },   
            /**
             * 删除此条记录
             */
            deleteMessage(row){
                deleteMessage(row).then(response => {
                    if (response.data.statusCode == 200) {
                        this.$notify({
                            title: '成功',
                            message: "删除成功",
                            type: 'success',
                            duration: 2000
                        });
                        this.clickMessage();
                    } else {
                        this.$notify({
                            title: '失败',
                            message: response.data.statusMsg,
                            type: 'info',
                            duration: 2000
                        });
                    }
                })
            },
            /**
             * 删除全部聊天记录
             */
            deleteAllMessage(){
                const data={
                    sendId:sessionStorage.getItem("userId"),//发送者id
                    receiveId:sessionStorage.getItem("receiveId")//接收者id
                }
                deleteAllMessage(data).then(response => {
                    if (response.data.statusCode == 200) {
                        this.$notify({
                            title: '成功',
                            message: "删除成功",
                            type: 'success',
                            duration: 2000
                        });
                        this.clickMessage();
                    } else {
                        this.$notify({
                            title: '失败',
                            message: response.data.statusMsg,
                            type: 'info',
                            duration: 2000
                        });
                    }
                })
            },
        }
    }
</script>