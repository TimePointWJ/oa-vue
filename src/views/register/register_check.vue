<template>
    <div class="app-container">
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
            <el-select clearable class="filter-item" v-model="listQuery.checkStatus" @change="fetchData" placeholder="审核状态">
                <el-option v-for="item in  listCheckStatus" :key="item.key" :label="item.value" :value="item.key"></el-option>
            </el-select>
            <el-input @keyup.enter.native="fetchData" style="width: 150px;" class="filter-item" placeholder="员工姓名" v-model="listQuery.name"/>
            <el-button class="filter-item" type="primary" style="margin-left: 6px;" icon="search" @click="fetchData">搜索</el-button>
            <el-button class="filter-item" style="margin-left: 10px;" @click="addStaff" type="primary" icon="edit">添加员工</el-button>
            <el-button class="filter-item" type="danger" icon="delete" @click="deleteBatchStaff">批量删除</el-button>
            <!-- <el-button class="filter-item" @click="" type="primary">批量导入员工</el-button> -->
        </div>
        <div class="filter-container">
            <!--
                未审核员工列表
            -->
            <el-table :data="staffList" border fit highlight-current-row ref="multipleTable" @selection-change="handleSelectionChange">
                <!-- <el-table-column prop="id" label="员工编号" sortable width="130"></el-table-column> -->
                <el-table-column type="selection" align="center" fixed="left"></el-table-column>
                <el-table-column prop="departmentName" label="部门" sortable width="130"></el-table-column>
                <el-table-column prop="staffNo" label="员工工号" sortable width="130"></el-table-column>
                <el-table-column prop="name" label="员工名" sortable width="130"></el-table-column>
                <el-table-column prop="sex" label="性别" sortable width="130">
                    <template slot-scope="scope">
                        <span v-if="scope.row.sex == 'M'">男</span>
                        <span v-if="scope.row.sex == 'F'">女</span>
                    </template>
                </el-table-column>
                <el-table-column prop="positionName" label="职位" sortable width="130"></el-table-column>
                <el-table-column prop="mobilePhone" label="手机号" sortable width="130"></el-table-column>
                <el-table-column prop="entryTime" label="入职时间" sortable width="130"></el-table-column>
                <el-table-column prop="graduationTime" label="毕业时间" sortable width="130">
                    <template slot-scope="scope">
                      <span v-if="scope.row.graduationTime != null">{{scope.row.graduationTime | parseTime('{y}-{m}')}}</span>
                      <span v-else></span>
                    </template>
                </el-table-column>
                <el-table-column prop="graduationSchool" label="毕业院校" sortable width="130"></el-table-column>
                <el-table-column prop="education" label="学历" sortable width="130">
                    <template slot-scope="scope">
                        <span v-if="scope.row.education == 1">大专</span>
                        <span v-if="scope.row.education == 2">本科</span>
                        <span v-if="scope.row.education == 3">研究生</span>
                    </template>
                </el-table-column>
                <el-table-column prop="subject" label="专业" sortable width="130"></el-table-column>
                <el-table-column prop="beginDevelopmentTime" label="软件开发开始时间" sortable width="180">
                    <template slot-scope="scope">
                      <span v-if="scope.row.beginDevelopmentTime != null">{{scope.row.beginDevelopmentTime | parseTime('{y}-{m}')}}</span>
                      <span v-else></span>
                    </template>
                </el-table-column>
                <el-table-column prop="email" label="电子邮箱" sortable width="130"></el-table-column>
                <el-table-column prop="checkStatus" label="审核状态" sortable width="130">
                    <template slot-scope="scope">
                        <span v-if="scope.row.checkStatus == 0">已审核</span>
                        <span v-if="scope.row.checkStatus == 1">未审核</span>
                    </template>
                </el-table-column>
                <el-table-column prop="status" label="在职状态" sortable width="130">
                    <template slot-scope="scope">
                        <span v-if="scope.row.status == 0">在职</span>
                        <span v-if="scope.row.status == 1">离职</span>
                    </template>
                </el-table-column>
                <el-table-column prop="remark" label="备注" sortable width="130"></el-table-column>
                <el-table-column prop="id" align="center" label="操作" width="200" fixed="right">
                    <template slot-scope="scope">
                        <el-button v-if="scope.row.checkStatus == 1" size="small" type="warning" @click="updateStaff(scope.row)">审核</el-button>
                        <el-button v-if="scope.row.checkStatus == 0" size="small" type="success" @click="updateStaff(scope.row)">修改</el-button>
                        <el-button size="small" type="danger" @click="deleteStaff(scope.row.id)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div align="center">
                <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage" :page-sizes="[10, 20, 30, 40,2]"
                    :page-size="pagesize" layout="total, sizes, prev, pager, next, jumper" :total="totalCount">
                </el-pagination>
            </div>
            <!--
                添加新员工dialog
            -->
            <el-dialog title="添加新员工" :visible.sync="addStaffDialog" :before-close="addStaffDialogClose">
                <!-- 员工注册审核表单 -->
                <el-form :model="addStaffForm" :rules="staffFormRules" ref="addStaffForm" label-width="15%" size="30%">
                    <el-form-item label="姓名" prop="name">
                            <el-input v-model="addStaffForm.name" placeholder="请输入姓名" style='width: 50%;'></el-input>
                    </el-form-item>
                    <el-form-item label="性别" prop="sex">
                        <el-select clearable class="filter-item" v-model="addStaffForm.sex" placeholder="请选择性别">
                            <el-option v-for="item in  listSex" :key="item.key" :label="item.value" :value="item.key"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="部门" prop="departmentId">
                        <el-select clearable class="filter-item" v-model="addStaffForm.departmentId" placeholder="请选择部门">
                            <el-option v-for="item in  listDepartment" :key="item.id" :label="item.name" :value="item.id"></el-option>
                        </el-select>
                    </el-form-item>
                    <!-- <el-form-item label="员工工号" prop="staffNo">
                            <el-input v-model="addStaffForm.staffNo" placeholder="请输入员工工号" style='width: 50%;'></el-input>
                    </el-form-item> -->
                    <el-form-item label="职位" prop="positionId">
                        <el-select clearable class="filter-item" v-model="addStaffForm.positionId" placeholder="请选择职位">
                            <el-option v-for="item in  listPosition" :key="item.id" :label="item.positionName" :value="item.id"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="手机号" prop="mobilePhone">
                        <el-input v-model="addStaffForm.mobilePhone" style='width: 50%;'></el-input>
                    </el-form-item>
                    <el-form-item label="入职时间" prop="entryTime">
                        <el-date-picker v-model="addStaffForm.entryTime" type="date" placeholder="入职时间"></el-date-picker>
                    </el-form-item>
                    <el-form-item label="毕业时间" prop="graduationTime">
                        <el-date-picker v-model="addStaffForm.graduationTime" type="month" placeholder="毕业时间"></el-date-picker>
                    </el-form-item>
                    <el-form-item label="毕业院校" prop="graduationSchool">
                        <el-input v-model="addStaffForm.graduationSchool" style='width: 50%;'></el-input>
                    </el-form-item>
                    <el-form-item label="学历" prop="education">
                        <el-select clearable class="filter-item" v-model="addStaffForm.education" placeholder="请选择学历">
                            <el-option v-for="item in listEducation" :key="item.key" :label="item.value" :value="item.key"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="专业" prop="subject">
                        <el-input v-model="addStaffForm.subject" style='width: 50%;'></el-input>
                    </el-form-item>
                    <el-form-item label="从事开发时间" prop="beginDevelopmentTime">
                        <el-date-picker v-model="addStaffForm.beginDevelopmentTime" type="month" placeholder="从事开发时间"></el-date-picker>
                    </el-form-item>
                    <el-form-item label="电子邮箱" prop="email">
                        <el-input v-model="addStaffForm.email" style='width: 50%;'></el-input>
                    </el-form-item>
                    <el-form-item label="省份" prop="provinceId">
                        <el-select clearable class="filter-item" v-model="addStaffForm.provinceId" placeholder="请选择省份" @change="updateProvince(addStaffForm)">
                            <el-option v-for="item in listProvince" :key="item.id" :label="item.areaName" :value="item.id"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="城市" prop="cityId">
                        <el-select clearable class="filter-item" v-model="addStaffForm.cityId" placeholder="请选择城市" @change="updateCity(addStaffForm)">
                            <el-option v-for="item in listCity" :key="item.id" :label="item.areaName" :value="item.id"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="地区" prop="districtId">
                        <el-select clearable class="filter-item" v-model="addStaffForm.districtId" placeholder="请选择地区">
                            <el-option v-for="item in listDistrict" :key="item.id" :label="item.areaName" :value="item.id"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="地址" prop="address">
                        <el-input v-model="addStaffForm.address" style='width: 50%;' placeholder="请输入地址"></el-input>
                    </el-form-item>
                    <el-form-item label="身份证号码" prop="identityCard">
                        <el-input v-model="addStaffForm.identityCard" style='width: 50%;' placeholder="请输入身份证号码"></el-input>
                    </el-form-item>
                    <el-form-item label="在职状态" prop="status">
                        <el-select clearable class="filter-item" v-model="addStaffForm.status" placeholder="请选择在职状态">
                            <el-option v-for="item in  listStatus" :key="item.key" :label="item.value" :value="item.key"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="备注" prop="remark">
                        <el-input type="textarea" v-model="addStaffForm.remark" style='width: 50%;'></el-input>
                    </el-form-item>
                    <el-button style='margin-bottom:20px;margin-left:35%;' type="primary" icon="document" @click="submitaddStaffForm('addStaffForm')">提交</el-button>
                </el-form>
            </el-dialog>
            <!--
                员工注册审核dialog
            -->
            <el-dialog title="员工注册审核" :visible.sync="updateStaffDialog" :before-close="updateStaffDialogClose">
                <!-- 员工注册审核表单 -->
                <el-form :model="updateStaffForm" :rules="staffFormRules" ref="updateStaffForm" label-width="15%" size="30%">
                    <el-form-item label="姓名" prop="name">
                            <el-input :disabled="checkFlg" v-model="updateStaffForm.name" placeholder="请输入姓名" style='width: 50%;'></el-input>
                    </el-form-item>
                    <el-form-item label="性别" prop="sex">
                        <el-select :disabled="checkFlg" clearable class="filter-item" v-model="updateStaffForm.sex" placeholder="请选择性别">
                            <el-option v-for="item in  listSex" :key="item.key" :label="item.value" :value="item.key"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="部门" prop="departmentId">
                        <el-select clearable class="filter-item" v-model="updateStaffForm.departmentId" placeholder="请选择部门">
                            <el-option v-for="item in  listDepartment" :key="item.id" :label="item.name" :value="item.id"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="员工工号" prop="staffNo" v-if="!checkFlg">
                            <el-input v-model="updateStaffForm.staffNo" placeholder="请输入员工工号" style='width: 50%;'></el-input>
                    </el-form-item>
                    <el-form-item label="职位" prop="positionId">
                        <el-select clearable class="filter-item" v-model="updateStaffForm.positionId" placeholder="请选择职位">
                            <el-option v-for="item in  listPosition" :key="item.id" :label="item.positionName" :value="item.id"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="手机号" prop="mobilePhone">
                        <el-input :disabled="checkFlg" v-model="updateStaffForm.mobilePhone" style='width: 50%;'></el-input>
                    </el-form-item>
                    <el-form-item label="入职时间" prop="entryTime">
                        <el-date-picker v-model="updateStaffForm.entryTime" type="date" placeholder="入职时间"></el-date-picker>
                    </el-form-item>
                    <el-form-item label="毕业时间" prop="graduationTime">
                        <el-date-picker :disabled="checkFlg" v-model="updateStaffForm.graduationTime" type="month" placeholder="毕业时间"></el-date-picker>
                    </el-form-item>
                    <el-form-item label="毕业院校" prop="graduationSchool">
                        <el-input :disabled="checkFlg" v-model="updateStaffForm.graduationSchool" style='width: 50%;'></el-input>
                    </el-form-item>
                    <el-form-item label="学历" prop="education">
                        <el-select :disabled="checkFlg" clearable class="filter-item" v-model="updateStaffForm.education" placeholder="请选择学历">
                            <el-option v-for="item in listEducation" :key="item.key" :label="item.value" :value="item.key"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="专业" prop="subject">
                        <el-input :disabled="checkFlg" v-model="updateStaffForm.subject" style='width: 50%;'></el-input>
                    </el-form-item>
                    <el-form-item label="从事开发时间" prop="beginDevelopmentTime">
                        <el-date-picker :disabled="checkFlg" v-model="updateStaffForm.beginDevelopmentTime" type="month" placeholder="从事开发时间"></el-date-picker>
                    </el-form-item>
                    <el-form-item label="电子邮箱" prop="email">
                        <el-input :disabled="checkFlg" v-model="updateStaffForm.email" style='width: 50%;'></el-input>
                    </el-form-item>
                    <el-form-item label="省份" prop="provinceId">
                        <el-select :disabled="checkFlg" class="filter-item" v-model="updateStaffForm.provinceId" placeholder="请选择省份"  @change="updateProvince(updateStaffForm)">
                            <el-option v-for="item in listProvince" :key="item.id" :label="item.areaName" :value="item.id"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="城市" prop="cityId">
                        <el-select :disabled="checkFlg" class="filter-item" v-model="updateStaffForm.cityId" placeholder="请选择城市"  @change="updateCity(updateStaffForm)">
                            <el-option v-for="item in listCity" :key="item.id" :label="item.areaName" :value="item.id"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="地区" prop="districtId">
                        <el-select :disabled="checkFlg" class="filter-item" v-model="updateStaffForm.districtId" placeholder="请选择地区">
                            <el-option v-for="item in listDistrict" :key="item.id" :label="item.areaName" :value="item.id"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="地址" prop="address">
                        <el-input v-model="updateStaffForm.address" style='width: 50%;' placeholder="请输入地址"></el-input>
                    </el-form-item>
                    <el-form-item label="身份证号码" prop="identityCard">
                        <el-input v-model="updateStaffForm.identityCard" style='width: 50%;' placeholder="请输入身份证号码"></el-input>
                    </el-form-item>
                    <el-form-item label="在职状态" prop="status">
                        <el-select clearable class="filter-item" v-model="updateStaffForm.status" placeholder="请选择在职状态">
                            <el-option v-for="item in  listStatus" :key="item.key" :label="item.value" :value="item.key"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="备注" prop="remark">
                        <el-input type="textarea" v-model="updateStaffForm.remark" style='width: 50%;'></el-input>
                    </el-form-item>
                    <el-button style='margin-bottom:20px;margin-left:35%;' type="primary" icon="document" @click="submitUpdateStaffForm('updateStaffForm')">提交</el-button>
                </el-form>
            </el-dialog>
        </div>
    </div>
</template>

<script>
    import { updateStaff,pagination,deleteStaff ,selectStaffById,addStaff} from '@/api/staff'
    import { dictionaryList, departmentList,positionList,listAreDate} from '@/api/common'
    import { parseTime } from '@/utils'
    // 数据模板
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
    export default {
        data() {
            var validatePhone=(rule, value, callback)=>{
                if(!/^[0]?[1][3|4|5|7|8][0-9]\d{8}$/.test(value)){
                    callback(new Error('手机号码不合法'));
                }else{
                    callback(); 
                }
            }
            var validateCard=(rule, value, callback)=>{
                if(!/(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/.test(value)){
                    callback(new Error('身份证号码不合法'));
                }else{
                    callback(); 
                }
            }
            return {
                checkFlg:false,//true为审核，false为修改
                staffList:null,//待审核员工列表
                listLoading: true,
                updateStaffForm: Object.assign({}, staffTemp),//审核员工表单
                addStaffForm: Object.assign({}, staffTemp),//添加员工表单
                sexCodeType:"1000010",//性别数据字典code
                educationCodeType:"1000030",//学历数据字典code
                checkStatusCodeType:"1000040",//审核状态数据字典code
                statusCodeType:"1000050",//在职状态数据字典code
                multipleSelection: [],
                listSex:[],
                listPosition:[],
                listEducation:[],
                listCheckStatus:[],
                listStatus:[],
                listDepartment:[],//部门列表
                listProvince:[],//省份列表
                listCity:[],//城市列表
                listDistrict:[],//地区列表
                areaQuery:{ 
                    followAreaId:0,
                    areaKbn: 1 
                },//地区查询条件
                totalCount: 0,
                pagesize: 10,
                currentPage: 1,
                updateStaffDialog:false,//注册员工审核dialog
                addStaffDialog:false,//添加新员工dialog
                //表单验证
                staffFormRules: {     
                    staffNo:[{ required: true, message: '请输入员工工号', trigger: 'blur' }],//员工工号
                    departmentId:[{ required: true, message: '请选择部门', trigger: 'change' }],//部门编号
                    name: [{ required: true, message: '请输入姓名', trigger: 'blur' }],//员工名
                    sex:[{ required: true, message: '请选择性别', trigger: 'change' }],//性别
                    positionId:[{ required: true, message: '请选择职位', trigger: 'change' }],//职位   1.总经理、2.部门经理、3.人事、4.财务、5.员工
                    mobilePhone:[
                        { required: true, message: '请选择性别', trigger: 'change' },
                        {validator: validatePhone, trigger: 'blur' }
                    ],//手机号
                    // password:null,//密码
                    entryTime:[{ required: true, message: '请选择入职时间', trigger: 'change' }],//入职时间
                    graduationTime:[{ required: true, message: '请选择毕业时间', trigger: 'change' }],//毕业时间
                    graduationSchool:[{ required: true, message: '请输入毕业院校', trigger: 'blur' }],//毕业院校
                    education:[{ required: true, message: '请选择学历', trigger: 'change' }],//学历  0：专科 1：本科
                    subject:[{ required: true, message: '请输入专业', trigger: 'blur' }],//专业
                    beginDevelopmentTime:[{ required: true, message: '请选择从事软件开发开始时间', trigger: 'change' }],//软件开发开始时间
                    provinceId:[{ required: true, message: '请选择省份', trigger: 'change' }],//省份
                    cityId:[{ required: true, message: '请选择城市', trigger: 'change' }],//城市
                    districtId:[{ required: true, message: '请选择地区', trigger: 'change' }],//地区
                    address:[{ required: true, message: '请输入地址', trigger: 'blur' }],//地址
                    identityCard:[
                        { required: true, message: '请输入身份证号码', trigger: 'blur' },
                        {validator: validateCard, trigger: 'blur' }
                    ],//身份证
                    // email:null,//电子邮箱
                    // checkStatus:null,//审核状态   0：已审核 1：未审核
                    status:[{ required: true, message: '请选择在职状态', trigger: 'change' }],//在职状态   0.在职 1.离职
                    // remark:null//备注
                },
                listQuery : {
                    checkStatus:null,
                    departmentId:null,
                    positionId:null,
                    checkStatus:null,//未审核
                    name:null,
                    pageNum: 1,
                    pageSize: 10
                },
            }
        },
        created() {
            this.selectList()//查询下拉框
            this.getProvinceList(this.areaQuery)//查询省份下拉框
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
                    this.staffList=data.list
                    console.log(data.list+"12356465465");
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
             * 提交表单
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
             * 提交表单
             */
            submitaddStaffForm(formName){
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        this.$confirm('确认添加', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {
                        addStaff(this.addStaffForm).then(response => {
                            this.listLoading = false;
                            if (response.data.statusCode == 200) {
                                this.$notify({
                                    title: '成功',
                                    message: '添加成功',
                                    type: 'success',
                                    duration: 2000
                                });
                                this.addStaffDialog=false
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
             * 下拉框查询
             */
            selectList(){
                //性别
                dictionaryList(this.sexCodeType).then(response => {
                    this.listSex=response.data.responseData
                })
                //学历
                dictionaryList(this.educationCodeType).then(response => {
                    this.listEducation=response.data.responseData
                })
                //审核状态
                dictionaryList(this.checkStatusCodeType).then(response => {
                    this.listCheckStatus=response.data.responseData
                })
                //在职状态
                dictionaryList(this.statusCodeType).then(response => {
                    this.listStatus=response.data.responseData
                })
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
             * 获取省份列表
             */
            getProvinceList(data) {
                listAreDate(data).then(response => {
                    this.listProvince = response.data.responseData
                })
            },
            /**
             * 获取城市列表
             */
            getCityList(data) {
                listAreDate(data).then(response => {
                    this.listCity = response.data.responseData
                })
            },
            /**
             * 获取地区列表
             */
            getDistrictList(data) {
                listAreDate(data).then(response => {
                    this.listDistrict = response.data.responseData
                })
            },
            /**
             * 省份change事件
             */
            updateProvince(data){
                data.cityId=null
                data.districtId=null
                this.areaQuery.followAreaId=data.provinceId
                this.areaQuery.areaKbn=2
                this.getCityList(this.areaQuery)
            },
            /**
             * 城市change事件
             */
            updateCity(data){
                if(data.cityId!=null){
                    this.areaQuery.followAreaId=data.cityId
                    this.areaQuery.areaKbn=3
                    this.getDistrictList(this.areaQuery)
                }
            },
            /**
             * 点击审核按钮事件
             */
            updateStaff(row){
                if(row.checkStatus==1){
                    this.checkFlg=true;
                }else{
                    this.checkFlg=false;
                }
                //根据id查询员工信息
                selectStaffById(row.id).then(response => {
                    this.updateStaffForm=response.data.responseData
                    const city={
                        followAreaId:this.updateStaffForm.provinceId,
                        areaKbn:2
                    }
                    this.getCityList(city);
                    const district={
                        followAreaId:this.updateStaffForm.cityId,
                        areaKbn:3
                    }
                    this.getDistrictList(district);
                    //如果是审核，付一些默认值
                    if(row.checkStatus==1){
                        this.updateStaffForm.entryTime=new Date();
                        this.updateStaffForm.status="0";
                    }
                })
                this.updateStaffDialog=true;
            },
            /**
             * 删除未审核的员工
             */
            deleteStaff(date){
                const ids=new Array()
                this.multipleSelection.forEach(function (item) {
                    ids.push(item.id)
                })
                if(ids.length==0){
                    ids.push(date)
                }
                this.$confirm('确认删除', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    deleteStaff(ids).then(response => {
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
             * 审核dialog关闭事件
             */
            updateStaffDialogClose(done) {
                this.updateStaffDialog=false;
                this.$refs["updateStaffForm"].resetFields();
            },
            /**
             * 审核dialog关闭事件
             */
            addStaffDialogClose(done) {
                this.addStaffDialog=false;
                this.$refs["addStaffForm"].resetFields();
            },
            /**
             * 添加新员工button事件
             */
            addStaff(){
                //给能赋默认值的先赋上
                this.addStaffForm.entryTime=new Date();
                this.addStaffForm.status="0";
                this.addStaffDialog=true;
            },
            /**
             * 复选框change事件
             */
            handleSelectionChange(val) {
                this.multipleSelection = val
            },
            /**
             * 批量删除员工
             */
            deleteBatchStaff(){
                const ids = []
                this.multipleSelection.forEach(function (item) {
                    ids.push(item.id)
                })
                this.deleteStaff(ids)
            },
        }
    }
</script>
