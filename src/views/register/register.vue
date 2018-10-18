<template>
    <div class="app-container">
        <div style="width:70%;margin: auto">
            <!-- 员工注册表单 -->
            <el-form :model="staffForm" :rules="staffFormRules" ref="staffForm" label-width="10%" size="30%">
                <el-form-item label="姓名" prop="name">
                    <el-input v-model="staffForm.name" placeholder="请输入姓名" style='width: 50%;'></el-input>
                </el-form-item>
                <el-form-item label="性别" prop="sex">
                    <el-select clearable class="filter-item" v-model="staffForm.sex" placeholder="请选择性别">
                        <el-option v-for="item in  listSex" :key="item.key" :label="item.value" :value="item.key"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="部门" prop="departmentId">
                    <el-select clearable class="filter-item" v-model="staffForm.departmentId" placeholder="请选择部门">
                        <el-option v-for="item in  listDepartment" :key="item.id" :label="item.name" :value="item.id"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="职位" prop="positionId">
                    <el-select clearable class="filter-item" v-model="staffForm.positionId" placeholder="请选择职位">
                        <el-option v-for="item in  listPosition" :key="item.id" :label="item.positionName" :value="item.id"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="手机号" prop="mobilePhone">
                    <el-input v-model="staffForm.mobilePhone" style='width: 50%;'></el-input>
                </el-form-item>
                <el-form-item label="毕业时间" prop="graduationTime">
                    <el-date-picker v-model="staffForm.graduationTime" type="month" placeholder="毕业时间"></el-date-picker>
                </el-form-item>
                <el-form-item label="毕业院校" prop="graduationSchool">
                    <el-input v-model="staffForm.graduationSchool" style='width: 50%;'></el-input>
                </el-form-item>
                <el-form-item label="学历" prop="education">
                    <el-select clearable class="filter-item" v-model="staffForm.education" placeholder="请选择学历">
                        <el-option v-for="item in listEducation" :key="item.key" :label="item.value" :value="item.key"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="专业" prop="subject">
                    <el-input v-model="staffForm.subject" style='width: 50%;'></el-input>
                </el-form-item>
                <el-form-item label="从事开发时间" prop="beginDevelopmentTime">
                    <el-date-picker v-model="staffForm.beginDevelopmentTime" type="month" placeholder="从事开发时间"></el-date-picker>
                </el-form-item>
                <el-form-item label="电子邮箱" prop="email">
                    <el-input v-model="staffForm.email" style='width: 50%;'></el-input>
                </el-form-item>
                <el-form-item label="省份" prop="provinceId">
                    <el-select clearable class="filter-item" v-model="staffForm.provinceId" placeholder="请选择省份" @change="updateProvince(staffForm)">
                        <el-option v-for="item in listProvince" :key="item.id" :label="item.areaName" :value="item.id"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="城市" prop="cityId">
                    <el-select clearable class="filter-item" v-model="staffForm.cityId" placeholder="请选择城市" @change="updateCity(staffForm)">
                        <el-option v-for="item in listCity" :key="item.id" :label="item.areaName" :value="item.id"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="地区" prop="districtId">
                    <el-select clearable class="filter-item" v-model="staffForm.districtId" placeholder="请选择地区">
                        <el-option v-for="item in listDistrict" :key="item.id" :label="item.areaName" :value="item.id"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="地址" prop="address">
                    <el-input v-model="staffForm.address" style='width: 50%;' placeholder="请输入地址"></el-input>
                </el-form-item>
                <el-form-item label="身份证号码" prop="identityCard">
                    <el-input v-model="staffForm.identityCard" style='width: 50%;' placeholder="请输入身份证号码"></el-input>
                </el-form-item>
                <el-form-item label="备注" prop="remark">
                    <el-input type="textarea" v-model="staffForm.remark" style='width: 50%;'></el-input>
                </el-form-item>
                <el-button style='margin-bottom:20px;margin-left:25%;' type="success" icon="document" @click="resetRegisterForm('staffForm')">重置</el-button>
                <el-button style='margin-bottom:20px;margin-left:5%;' type="primary" icon="document" @click="submitRegisterForm('staffForm')">提交</el-button>
            </el-form>
        </div>
    </div>
</template>

<script>
    import { insertStaff } from '@/api/staff'
    import { dictionaryList, departmentList,positionList,listAreDate} from '@/api/common'
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
                listLoading: true,
                staffForm: Object.assign({}, staffTemp),//员工表单
                sexCodeType:"1000010",//性别数据字典code
                educationCodeType:"1000030",//学历数据字典code
                checkStatusCodeType:"1000040",//审核状态数据字典code
                statusCodeType:"1000050",//在职状态数据字典code
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
                    followAreaId: 0,
                    areaKbn: 1 
                },//地区查询条件
                //表单验证
                staffFormRules: {          
                    name: [{ required: true, message: '请输入姓名', trigger: 'blur' }],//员工名
                    sex:[{ required: true, message: '请选择性别', trigger: 'change' }],//性别
                    //position:[{ required: true, message: '请选择职位', trigger: 'change' }],//职位   1.总经理、2.部门经理、3.人事、4.财务、5.员工
                    mobilePhone:[
                        { required: true, message: '请选择性别', trigger: 'change' },
                        {validator: validatePhone, trigger: 'blur' }
                    ],//手机号
                    // password:null,//密码
                    // entryTime:null,//入职时间
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
                    // status:null,//在职状态   0.在职 1.离职
                    // remark:null//备注
                }
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
            },
            /**
             * 重置表单
             */
            resetRegisterForm(formName){
                this.$refs[formName].resetFields();
            },
            /**
             * 提交表单
             */
            submitRegisterForm(formName){
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        this.$confirm('确认添加', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {
                        insertStaff(this.staffForm).then(response => {
                            this.listLoading = false;
                            if (response.data.statusCode == 200) {
                                this.$notify({
                                    title: '成功',
                                    message: '注册成功，等待人事审核',
                                    type: 'success',
                                    duration: 2000
                                });
                                this.$refs[formName].resetFields();
                            } else {
                                this.$notify({
                                    title: '失败',
                                    message: '注册失败',
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
        }
    }
</script>
