<template>
    <div class="login-container">
        <!--
            登录表单
        -->
        <el-form class="login-form" autoComplete="on" :model="loginForm" :rules="loginRules" ref="loginForm" label-position="left">
            <div class="title-container">
                <h3 class="title">OA系统登录</h3>
            </div>
            <el-form-item prop="username">
                <span class="svg-container svg-container_login">
                    <svg-icon icon-class="user" />
                </span>
                <el-input name="username" type="text" v-model="loginForm.username" autoComplete="on" placeholder="请输入用户名" />
            </el-form-item>
            <el-form-item prop="password">
                <span class="svg-container">
                    <svg-icon icon-class="password" />
                </span>
                <el-input name="password" :type="passwordType" @keyup.enter.native="handleLogin" v-model="loginForm.password" autoComplete="on" placeholder="请输入密码" />
                <span class="show-pwd" @click="showPwd">
                    <svg-icon icon-class="eye" />
                </span>
            </el-form-item>
            <el-form-item prop="code" style="display:block;" id="el-form-code-style">
                <el-input class="el-form-code-input" name="code" type="text" v-model="loginForm.code" autoComplete="on" placeholder="请输入验证码" @keyup.enter.native="handleLogin"/>
                <el-input type="button" @click.native="createCode" class="el-form-code-img" v-model="getCode"/>
            </el-form-item>
            <el-form-item class="form-group clearfix" style="margin-bottom: 0px;">
                <div class="col-md-6 col-sm-6 col-xs-6 rememberUserNames">
                    <label class="radio-inline" >
                        <el-checkbox v-model="inlineBox1"/>
                        <span for="inlineRadioOptions"> 记住用户名</span>
                    </label>
                </div>
                <div class="col-md-6 col-sm-6 col-xs-6 autoLogin">
                    <label class="radio-inline">
                        <el-checkbox v-model="inlineBox2"/>
                        <span for="inlineRadioOptions"> 自动登录</span>
                    </label>
                </div>
            </el-form-item>
            <el-button type="primary" style="width:100%;margin-bottom:10px;" :loading="loading" @click.native.prevent="handleLogin">登 录</el-button>
            <el-button style="width:100%;margin-left:0px;" @click.native.prevent="handleRegister">注 册</el-button>
        </el-form>
        <el-dialog :title="$t('login.thirdparty')" :visible.sync="showDialog" append-to-body>
            {{$t('login.thirdpartyTips')}}
            <br/><br/><br/>
        </el-dialog>
        <!--
            修改密码
        -->
        <div class="updateDiv">
            <el-dialog :modal="false" title="请修改初始密码" :visible.sync="updatePwdDiaLog" style="width:40%;margin-left:30%;margin-top:5%;" class="dialogcss">
                <el-form :model="systemAccount" :rules="systemAccountRules"  ref="systemAccount"  label-position="left" label-width="100px" style='width: 100%'>
                    <el-form-item label="用户名" prop="staffNo">
                        <el-input class="input" disabled type="text" v-model="systemAccount.staffNo"></el-input>
                    </el-form-item>
                    <el-form-item label="密码" prop="newPassword">
                        <el-input class="input" type="password" v-model="systemAccount.newPassword" auto-complete="off" width="200" placeholder="请输入密码"></el-input>
                    </el-form-item>
                    <el-form-item label="确认密码" prop="rePassword">
                        <el-input class="input" type="password" v-model="systemAccount.rePassword" auto-complete="off" placeholder="请再次输入密码"></el-input>
                    </el-form-item>
                    <el-button style='margin-left:40%;' type="primary" @click="updatePwd('systemAccount')">确 定</el-button>
                </el-form>
            </el-dialog>
        </div>
        <!-- 
            员工注册 
        -->
        <div class="registerDiv">
            <el-dialog :modal="false" title="员工注册" :visible.sync="registerDiaLog">
                <el-form :model="staffForm" :rules="staffFormRules" ref="staffForm" label-width="20%" size="20%">
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
            </el-dialog>
        </div>
    </div>

</template>

<script>
    import { isvalidUsername } from '@/utils/validate'
    import LangSelect from '@/components/LangSelect'
    import SocialSign from './socialsignin'
    import { updateUserPwd} from '@/api/staff'
    import { register} from '@/api/login'
    import { dictionaryList, departmentList,positionList,listAreDate} from '@/api/common'
    import Cookies from 'js-cookie'
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
        components: { LangSelect, SocialSign },
        name: 'login',
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
            const validateUsername = (rule, value, callback) => {
                if (!isvalidUsername(value)) {
                    callback(new Error('请输入正确的用户名'))
                } else {
                    callback()
                }
            }
            const validatePassword = (rule, value, callback) => {
                if (value == null || value.length < 6) {
                    callback(new Error('密码不能小于6位'))
                }else if(this.errorMsg){
                    callback(new Error('用户名或密码错误'))
                }else {
                    callback()
                }
            }
            const validateCode = (rule, value, callback) => {
                if (value == null || value.length < 1) {
                    callback(new Error('验证码不能为空'))
                } else if (value.toUpperCase() != this.checkCode) {
                    callback(new Error('验证码输入错误，请重新输入'))
                }else {
                    callback()
                }
            }
            var validatePass = (rule, value, callback) => {
                if (value === ''||value==null) {
                    callback(new Error('请输入密码'));
                } else {
                    if (this.systemAccount.rePassword !== ''&&this.systemAccount.rePassword !==null) {
                        this.$refs.systemAccount.validateField('rePassword');
                    }
                    callback();
                }
            };
            var validatePass2 = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('请再次输入密码'));
                } else if (value !== this.systemAccount.newPassword) {
                    callback(new Error('两次输入密码不一致!'));
                } else {
                    callback();
                }
            };
            return {
                registerDiaLog:false,
                updatePwdDiaLog:false,
                systemAccount:{
                    staffNo:null,
                    password:null,
                    newPassword:null,
                    rePassword:null
                },
                loginForm: {
                    username: null,
                    password: null
                },
                loginRules: {
                    username: [{ required: true, trigger: 'blur', validator: validateUsername }],
                    password: [{ required: true, trigger: 'blur', validator: validatePassword }],
                    code: [{ required: true, trigger: 'blur', validator: validateCode }]
                },
                passwordType: 'password',
                loading: false,
                showDialog: false,
                checkCode:'',
                inlineBox1:false,
                inlineBox2:false,
                systemAccountRules:{
                    newPassword: [
                        {min: 6, max: 16, message: '长度在6到16个字符', trigger: 'blur' },
                        {required: true, validator: validatePass, trigger: 'blur' }
                    ],
                    rePassword: [
                        {required: true, validator: validatePass2, trigger: 'blur' }
                    ],
                },
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
    computed: {
        getCode () {
            var code = "";
            var codeLength = 4;//验证码的长度
            var random = new Array(0,1,2,3,4,5,6,7,8,9,'A','B','C','D','E','F','G','H','I','J','K','M','N','P','Q','R','S','T','U','V','W','X','Y','Z');//随机数
            for(var i = 0; i < codeLength; i++) {
                //循环操作
                var index = Math.floor(Math.random()*34);//取得随机数的索引（0~33）
                code += random[index];//根据索引取得随机数加到code上
            }
            this.checkCode = code;
            return this.checkCode;
        }
    },
    created() {
        this.getCookie()
        this.selectList()//查询下拉框
        this.getProvinceList(this.areaQuery)//查询省份下拉框
        this.fetchData()
    },
    methods: {
        handleRegister(){
            this.registerDiaLog=true;
        },
        // 图片验证码
        createCode(){
            var code = "";
            var codeLength = 4;//验证码的长度
            var random = new Array(0,1,2,3,4,5,6,7,8,9,'A','B','C','D','E','F','G','H','I','J','K','M','N','P','Q','R','S','T','U','V','W','X','Y','Z');//随机数
            for(var i = 0; i < codeLength; i++) {
                //循环操作
                var index = Math.floor(Math.random()*34);//取得随机数的索引（0~33）
                code += random[index];//根据索引取得随机数加到code上
            }
            this.checkCode = code;//把code值赋给验证码
            return this.checkCode;
        },
        showPwd() {
            if (this.passwordType === 'password') {
                this.passwordType = ''
            } else {
                this.passwordType = 'password'
            }
        },
        handleLogin() {
            this.errorMsg = false;
            this.$refs.loginForm.validate(valid => {
                if (valid) {
                    if(this.inlineBox1 == true || this.inlineBox2 == true){
                        this.setCookie(this.loginForm.username,this.loginForm.password,this.inlineBox1,this.inlineBox2,7);
                    }else{
                        this.clearCookie();
                    }
                    this.loading = true
                    this.$store.dispatch('LoginByUsername', this.loginForm).then((response) => {
                        this.loading = false
                        if(response.data.statusCode == 200){
                            sessionStorage.setItem("userId",response.data.responseData.id);
                            sessionStorage.setItem("staffNo",response.data.responseData.staffNo);
                            sessionStorage.setItem("userName",response.data.responseData.name);
                            console.log("sendId::>>>>");
                            console.log(sessionStorage.getItem("userId"));
                            if(navigator.userAgent.match(/(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i)){
                                Cookies.set('sidebarStatus', 1)
                                this.$store.state.app.sidebar.opened=false;
                            }else{
                                Cookies.set('sidebarStatus', 0)
                                this.$store.state.app.sidebar.opened=true;
                            }
                            if(response.data.responseData.updatePasswordFlg=="0"){
                                // this.$store.dispatch('FedLogOut').then(() => {
                                sessionStorage.setItem("password","123456");
                                this.systemAccount.staffNo=this.loginForm.username
                                this.updatePwdDiaLog=true
                                // this.clearCookie();
                                // })
                            }else{
                                this.$router.push({ path: '/' })
                            }
                        }else if(response.data.statusCode == 203){
                            this.$message({
                                type: 'info',
                                message: response.data.statusMsg
                            });
                        }else{
                            this.errorMsg = true;
                            this.$refs.loginForm.validateField('password');
                        }
                    }).catch(() => {
                        this.loading = false;
                        this.clearCookie();
                        this.$message({message: '系统繁忙,请稍后重试.',type: 'error'});
                    })
                } else {
                    return false
                }
            })
        },
        //设置cookie
        setCookie(c_name,c_pwd,box1,box2,exdays) {
            /*hex_md5(c_pwd)*/ //加密
            var exdate=new Date();//获取时间
            exdate.setTime(exdate.getTime() + 24*60*60*1000*exdays);//保存的天数
            //字符串拼接cookie
            window.document.cookie="userName"+ "=" +c_name+";path=/;expires="+exdate.toGMTString();
            window.document.cookie="userPwd"+"="+c_pwd+";path=/;expires="+exdate.toGMTString();
            window.document.cookie="box1"+"="+box1+";path=/;expires="+exdate.toGMTString();
            window.document.cookie="box2"+"="+box2+";path=/;expires="+exdate.toGMTString();
        },
        //读取cookie
        getCookie:function () {
            if (document.cookie.length>0) {
                var arr=document.cookie.split('; ');
                for(var i=0;i<arr.length;i++){
                    var arr2=arr[i].split('=');
                    if(arr2[0]=='userName'){
                        this.loginForm.username=arr2[1];
                    }else if(arr2[0]=='userPwd'){
                        this.loginForm.password=arr2[1];
                    }
                    if(arr2[0]=='box1'){
                        if(arr2[1] == 'true')
                            this.inlineBox1=true;
                        else
                            this.inlineBox1=false;
                    }
                    if(arr2[0]=='box2'){
                        if(arr2[1] == 'true')
                            this.inlineBox2=true;
                        else
                            this.inlineBox2=false;
                    }
                }
            //自动登录
            if(this.inlineBox2 == true){
                //this.handleLogin();
            }
        }

        },
        updatePwd(formName){
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    this.$confirm('确认修改', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {
                        this.systemAccount.password=this.systemAccount.newPassword
                        updateUserPwd(this.systemAccount).then(response => {
                            if(response.data.statusCode==201){
                                this.$alert(response.data.statusMsg, '错误信息', {
                                  confirmButtonText: '确定'
                                });
                            }else{
                                sessionStorage.setItem("password","");
                                this.updatePwdDiaLog=false;
                                this.$alert('修改成功', '', {
                                  confirmButtonText: '确定',
                                  callback: action => {
                                    this.$router.push({ path: '/' })
                                  }
                                });
                            }
                        })
                    }).catch(() => {
                        this.$message({
                            type: 'info',
                            message: '取消修改'
                        });
                    });
                } else {
                    return false;
                }
            });
        },
        //清除cookie
        clearCookie:function () {
            this.setCookie("","","",-1);//修改2值都为空，天数为负1天就好了
        },
        resetLink(){
            this.$router.push({ path: '/resetUser' })
        },/**
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
                        console.log("123456");
                        console.log(this.staffForm);
                        register(this.staffForm).then(response => {
                            this.listLoading = false;
                            if (response.data.statusCode == 200) {
                                this.$notify({
                                    title: '成功',
                                    message: '注册成功，等待人事审核',
                                    type: 'success',
                                    duration: 2000
                                });
                                this.$refs[formName].resetFields();
                                this.registerDiaLog=false;
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
    },
        destroyed() {
            // window.removeEventListener('hashchange', this.afterQRScan)
        },
  
}
</script>

<style rel="stylesheet/scss" lang="scss">
$bg:#2d3a4b;
$light_gray:#000;

/* reset element-ui css */
.login-container {
  .updateDiv{
    .el-dialog{
      .el-form{
        .el-form-item{
          .el-form-item__content{
            .el-input{
              .el-input__inner{

                width:150%;
                color:black;  
                background-color:#F5F7FA;
              }
            }
          }
          background-color:#F5F7FA;
        }
      }
    }
  }
    .registerDiv{
        .el-dialog{
            .el-form{
                .el-form-item{
                    .el-form-item__content{
                        .el-input{

                            .el-input__inner{
                                border: 1px solid #dcdfe6;
                                width:100%;
                                color:black;  
                            }
                        }
                        .el-select{
                            .el-input{
                                width:100%;
                            }
                        }
                    }
                    background-color:white;
                }
            }
        }
    }
  .el-form-code-img {
      border: 1px solid rgba(255, 255, 255, 0.1);
      background: rgb(192, 87, 87);
      border-radius: 5px;
      width: 30%;
      height: 50px;
      margin-left: 5%;
      font-size: 25px;
    }
    .el-form-code-img input{
      padding: 0px;
      color: #68dac4;
    }
  .el-input {
    display: inline-block;
    height: 47px;
    width: 40%;
    input {
      background: transparent;
      border: 0px;
      -webkit-appearance: none;
      border-radius: 0px;
      padding: 12px 5px 12px 15px;
      color: #eee;
      height: 47px;
      &:-webkit-autofill {
        -webkit-box-shadow: 0 0 0px 1000px $bg inset !important;
        -webkit-text-fill-color: #fff !important;
      }
    }
  }
  .el-form-item {
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: rgba(0, 0, 0, 0.1);
    border-radius: 5px;
    color: #454545;
  }
  
}
.dialogcss{
  color:red;
}
</style>

<style rel="stylesheet/scss" lang="scss" scoped>
$bg:#2d3a4b;
$dark_gray:#889aa4;
$light_gray:#eee;

.login-container {
  position: fixed;
  height: 100%;
  width: 100%;
  background-color: $bg;
  .login-form {
    position: absolute;
    left: 0;
    right: 0;
    @media screen and (min-width: 520px) {
      width: 520px;
    }
    padding: 35px 35px 15px 35px;
    margin: 120px auto;
  }
  .tips {
    font-size: 14px;
    color: #fff;
    margin-bottom: 10px;
    span {
      &:first-of-type {
        margin-right: 16px;
      }
    }
  }
  .svg-container {
    padding: 6px 5px 6px 15px;
    color: $dark_gray;
    vertical-align: middle;
    width: 30px;
    display: inline-block;
    &_login {
      font-size: 20px;
    }
  }
  .title-container {
    position: relative;
    .title {
      font-size: 26px;
      font-weight: 400;
      color: $light_gray;
      margin: 0px auto 40px auto;
      text-align: center;
      font-weight: bold;
    }
    .set-language {
      color: #fff;
      position: absolute;
      top: 5px;
      right: 0px;
    }
  }
  .show-pwd {
    position: absolute;
    right: 10px;
    top: 7px;
    font-size: 16px;
    color: $dark_gray;
    cursor: pointer;
    user-select: none;
  }
  .thirdparty-button {
    position: absolute;
    right: 35px;
    bottom: 28px;
  }
}
  .radio-inline{
    span {
      color: #eeeeee;
    }
  }
</style>

