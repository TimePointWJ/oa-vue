<template>
	<div class="app-container">
		<div class="filter-container">
			<div class="container">
				<el-tooltip class="item" effect="light" content="用户账号" placement="top">
					<el-input style="width: 200px;" class="filter-item" v-model.trim="searchOptions.userIdSearch" placeholder="用户账号"></el-input>
				</el-tooltip>
				<el-select class="filter-item" v-model="roleValue" clearable filterable placeholder="请选择类型" @change="userRoleChange">
					<el-option v-for="item in roleList" :key="item.id" :label="item.positionName" :value="item.id">
					</el-option>
				</el-select>
				<el-button class="filter-item" type="primary" style="margin-left: 6px;" icon="search" @click="searchData" v-if="showList.backUserManager_account_search">搜索</el-button>
			</div>
		</div>
		<!-- 后台账号一览数据展示-->
		<el-table :data="list" v-loading.body="listLoading" element-loading-text="拼命加载中" border fit highlight-current-row 
			ref="multipleTable">
			<input type="hidden" prop="id" label="id">
			<el-table-column prop="staffNo" label="用户账号" sortable></el-table-column>
			<el-table-column prop="name" label="姓名" sortable></el-table-column>
			<el-table-column prop="role" label="角色类型" sortable></el-table-column>
			<el-table-column prop="mobilePhone" label="手机号" sortable></el-table-column>

			<el-table-column align="center" prop="id" label="操作" width="200">
				<template slot-scope="scope" width="200">
					<el-button size="small" type="success" @click="update(scope.row.id);" v-if="showList.backUserManager_account_edit">编辑</el-button>
				</template>
			</el-table-column>
			</el-table>
			<div align="center">
				<el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage" :page-sizes="[10, 20, 30, 40,2]"
					:page-size="pagesize" layout="total, sizes, prev, pager, next, jumper" :total="totalCount">
					</el-pagination>
			</div>
			
			<!-- 后台账号修改dialog-->
			<el-dialog title="账号修改" :visible.sync="dialogAccountUpdate">
				<el-form class="small-space" :model="accountUpdate" :rules="editRule" ref="editForm" label-position="left" label-width="80px"
					style='width: 400px; margin-left:50px;'>
					<el-form-item label="id" style="display: none;">
						<el-input v-model="accountUpdate.id" disabled="disabled"></el-input>
					</el-form-item>
					<el-form-item label="员工名" prop="userId">
						<el-input v-model="accountUpdate.name" disabled="disabled"></el-input>
					</el-form-item>
					<div style="margin-bottom:20px;font-size:14px;color:#48576a;font-weight:700">
						<el-form-item label="角色区分" prop="accountType">
							<el-select placeholder="请选择" v-model="accountUpdate.roleCode" @change="roleChange"  >
								<!-- <el-option v-for="item in dictionaryList" :key="item.key" :label="item.value" :value="item.key" :disabled="item.disabled"></el-option> -->
								<el-option v-for="item in roleList" :key="item.id" :label="item.roleName" :value="item.id" :disabled="item.disabled"></el-option>
							</el-select>
						</el-form-item>
					</div>
					</el-form>
					<div slot="footer" class="dialog-footer">
						<el-button @click="dialogAccountUpdate = false;$refs.editForm.resetFields()">取消</el-button>
						<el-button type="primary" @click="accountUpdateSubmit('editForm')" v-if="showList.backUserManager_account_edit_sure">确 定</el-button>
					</div>
			</el-dialog>
	</div>
</template>

<script>
	import { pagination, accountDetails, listRoleType , accountAdd, accountUpdate, accountDelete, accountDeletList, dictionaryList, listSchoolStaff, listSystemRole } from '@/api/system/systemAccount'
	import { hasPermission } from '@/utils/button'
	import { positionList} from '@/api/common'
	import { getRole} from '@/api/system/systemRole'

	const tmp = {
		id: null,
		account: null,
		userId: null,
		accountType: null,
		password: null,
		version: 1,
		newPassword:null,
		rePassword:null
	}
	export default {
		data() {
			return {
				showList:{
					backUserManager_account_search:false,
					backUserManager_account_edit:false,
					backUserManager_account_edit_sure:false,
				},
				userRole:null,
				roleList:null,
				dictionaryList: {
					key:'',
					value:'',
					disabled:false,
				},
				disabledSelect:null,
				list: null,
				totalCount: 100,
				pagesize: 10,
				currentPage: 1,
				listLoading: true,
				updatePwdDiaLog:false,
				searchOptions: {
					userIdSearch: '',
					roleTypeSearch: '',
					nameSearch: null,
					accountKbnSearch:''
				},
				dialogAccountAdd: false,
				dialogAccountUpdate: false,
				accountDetail: Object.assign({}, tmp),
				accountAdd: Object.assign({}, tmp),
				accountUpdate: Object.assign({}, tmp),
				value8: '',
				roleValue:'',
				listQuery: {
					key: undefined,
					value: undefined,
					pageNum: 1,
					pageSize: 10
				},
				editRule: {
					userId: [
						{ required: true, message: '请输入用户账号', trigger: 'blur' },
					],
					accountType: [
						{ required: true, message: '请选择角色区分', trigger: 'blur' },
					],
					account: [
						{ required: true, message: '请输入账户', trigger: 'blur' },
					],
					password: [
						{ required: true, message: '请输入密码', trigger: 'blur' },
						{ min: 4, max: 50, message: '长度在 4 到 50 个字符', trigger: 'blur' }
					],
				},
				addRule: {
					id: [
						{ required: true, message: '请选择则用户名', trigger: 'blur' },
					],
					userId: [
						{ required: true, message: '请输入用户账号', trigger: 'blur' },
					],
					accountType: [
						{ required: true, message: '请选择角色区分', trigger: 'blur' },
					],
					account: [
						{ required: true, message: '请输入账户', trigger: 'blur' },
					],
					password: [
						{ required: true, message: '请输入密码', trigger: 'blur' },
						{ min: 4, max: 50, message: '长度在 4 到 50 个字符', trigger: 'blur' }
					],
				},
			}
		},
		created() {
			this.fetchData()
			this.listRole()
			this.buttonControl()
		},
		methods: {
			fetchData() {
				this.listLoading = true
				const listQuery = {
					userIdSearch: this.searchOptions.userIdSearch,
					roleTypeSearch: this.searchOptions.roleTypeSearch,
					nameSearch: this.searchOptions.nameSearch,
					accountKbnSearch:this.searchOptions.accountKbnSearch,
					pageNum: this.currentPage,
					pageSize: this.pagesize
				}
				pagination(listQuery).then(response => {
					const data = response.data.responseData
					this.list = data.list
					this.totalCount = data.total
					this.listLoading = false
				})
			},
			listRole() {
				const data = {
					codeType: 1000350
				};
				dictionaryList("1000350").then(response => {
					const user = response.data.responseData;
					this.userRole = user;
					this.value8 = "2";
				})
				getRole().then(response => {
					const user = response.data.responseData;
					this.roleList = user;
				})
				dictionaryList("1000390").then(response => {
					this.dictionaryList = response.data.responseData

				})
			},
			typeChange(key) {
				this.searchOptions.roleTypeSearch = key;
			},
			roleChange(key){
				this.accountUpdate.accountType = key;
			},
			userRoleChange(key){
				this.searchOptions.accountKbnSearch = key;
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
			log(message, type) {
				this.$message({
					message: message,
					type: type
				})
			},
			//查询用户列表
			searchData() {
				this.currentPage = 1,
				this.listLoading = true,
				this.fetchData()
			},
			//账号修改数据获取
			update(key) {
				this.listLoading = true;
				accountDetails(key).then(response => {
					this.accountUpdate = response.data.responseData;;
					this.listLoading = false;
					if (response.data.statusCode == 200) {
						this.dialogAccountUpdate = true;
						this.dictionaryList.some(disab => disab.disabled = false);
						
						
					} else {
						this.log('获取数据失败.', 'error');
					}
				}).catch(() => {
					this.loading = false;
					this.log('取数据失败.', 'error');
				});
			},
			//账号修改保存
			Submit(formName) {
				this.$refs[formName].validate((valid) => {
					if (valid) {
						this.dialogVisible = true;
						accountUpdate(this.accountUpdate).then(response => {
							const data = response.data.responseData
							this.listLoading = false;
							if (response.data.statusCode == 200) {
								this.log('修改成功.', 'success');
								this.$refs[formName].resetFields();
								this.dialogAccountUpdate = false;
								this.accountUpdate = Object.assign({}, tmp);
								this.fetchData();
							} else {
								this.log('修改失败.', 'error');
							}
						}).catch(() => {
							this.loading = false;
							this.log('修改失败.', 'error');
						});
					}
				});
			},
			//数据字典查询账户区分
			select() {
				dictionaryList("1000390").then(response => {
					this.dictionaryList = response.data.responseData

				})
			},//账号修改保存
			accountUpdateSubmit(formName) {
					if (this.accountUpdate.id != null && this.accountUpdate.id != "") {
						this.dialogVisible = true;
						accountUpdate(this.accountUpdate).then(response => {
							const data = response.data.responseData
							this.listLoading = false;
							if (response.data.statusCode == 200) {
								this.log('修改成功.', 'success');
								this.$refs[formName].resetFields();
								this.dialogAccountUpdate = false;
								this.accountUpdate = Object.assign({}, tmp);
								this.fetchData();
							} else {
								this.log('修改失败.', 'error');
							}
						}).catch(() => {
							this.loading = false;
							this.log('修改失败.', 'error');
						});
					}
			},
			buttonControl(){
				this.showList.backUserManager_account_search = hasPermission("backUserManager_account_search")
				this.showList.backUserManager_account_edit = hasPermission("backUserManager_account_edit")
				this.showList.backUserManager_account_edit_sure = hasPermission("backUserManager_account_edit_sure")
			}
		}
	}

</script>