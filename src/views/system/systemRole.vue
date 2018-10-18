<template>
	<div class="app-container">
		<div class="filter-container">
			<div class="container">
				<el-tooltip class="item" effect="light" content="角色名称" placement="top">
					<el-input style="width: 200px;" class="filter-item" v-model.trim="searchOptions.roleNameSearch" placeholder="角色名称"></el-input>
				</el-tooltip>
				<el-select class="filter-item" v-model="value8" clearable filterable placeholder="请选择类型" @change="typeChange">
					<el-option v-for="item in userRole" :key="item.id" :label="item.positionName" :value="item.id">
					</el-option>
				</el-select>
				<!--<el-select clearable class="filter-item" v-model="selectNotice.schoolId"  placeholder="选择院校">
		            <el-option v-for="option in schools" :label="option.schoolName" v-bind:value="option.id">
		            </el-option>
	            </el-select>-->
				<el-button class="filter-item" type="primary" style="margin-left: 6px;" icon="search" @click="searchData" v-if="showList.backUserManager_authManager_search">搜索</el-button>
				<el-button class="filter-item" align="right" style="margin-left: 6px;" @click="dialogRoleAdd = true" type="primary" icon="edit" v-if="showList.backUserManager_authManager_roleAdd">添加角色</el-button>
				<el-button class="filter-item" type="danger" @click="delBacthClick" icon="delBacthClick" v-if="showList.backUserManager_authManager_roleBatchDelete">批量删除</el-button>
			</div>
		</div>
		<el-table :data="list" v-loading.body="listLoading" element-loading-text="拼命加载中" border fit highlight-current-row @selection-change="handleSelectionChange"
			ref="multipleTable">
			<el-table-column type="selection" align="center"></el-table-column>
			<!--<el-table-column type="hidden" prop="id" label="角色ID" sortable show-overflow-tooltip></el-table-column>-->
			<el-table-column prop="roleName" label="角色名称" sortable>
				<template slot-scope="scope">
					<span slot="reference" class="name-wrapper" style="cursor:pointer;color:#1d90e6;" @click="showAuthTree(scope.row.id)">
						{{ scope.row.roleName }}
					</span>
				</template>
			</el-table-column>
			<el-table-column prop="roleTypeName" label="所属职位" sortable></el-table-column>
			<el-table-column prop="description" label="角色描述" sortable></el-table-column>
			<!--<el-table-column prop="version" label="版本" sortable></el-table-column>-->
			<el-table-column align="center" prop="id" label="操作" width="200">
				<template slot-scope="scope">
					<!--<el-button size="small" type="info" @click="details(scope.row.id);">详情</el-button>-->
					<el-button size="small" type="success" @click="update(scope.row.id);" v-if="showList.backUserManager_authManager_roleEdit">编辑</el-button>
					<el-button size="small" type="danger" @click="deleteRole(scope.row.id);" v-if="showList.backUserManager_authManager_roleDelete">删除</el-button>
				</template>
			</el-table-column>
			</el-table>
			<div align="center">
				<el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage" :page-sizes="[10, 20, 30, 40,2]"
					:page-size="pagesize" layout="total, sizes, prev, pager, next, jumper" :total="totalCount">
					</el-pagination>
			</div>
			<!-- 后台角色添加dialog-->
			<el-dialog title="角色添加" :visible.sync="dialogRoleAdd" :before-close="handleCloseAdd">
				<el-form class="small-space" :model="roleAdd" :rules="addRules" ref="addForm" label-position="left" label-width="80px" style='width: 400px; margin-left:50px;'>
					<el-form-item label="角色名称" prop="roleName">
						<el-input v-model="roleAdd.roleName" placeholder="请输入角色名称"></el-input>
					</el-form-item>
					<el-form-item label="所属职位" prop="roleType">
						<el-select class="filter-item" v-model="roleAdd.roleType" clearable filterable placeholder="请选择类型" @change="addTypeChange">
							<el-option v-for="item in userRole" :key="item.id" :label="item.positionName" :value="item.id">
							</el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="角色描述">
						<el-input v-model="roleAdd.description" placeholder="请输入角色描述"></el-input>
					</el-form-item>
				</el-form>
				<div slot="footer" class="dialog-footer">
					<el-button @click="cancleAdd('addForm')">取消</el-button>
					<el-button type="primary" @click="roleAddSubmit('addForm')" v-if="showList.backUserManager_authManager_add_sure">确 定</el-button>
				</div>
			</el-dialog>
			<!-- 后台角色修改dialog-->
			<el-dialog title="角色修改" :visible.sync="dialogRoleUpdate" :before-close="handleCloseEdit">
				<el-form class="small-space" :model="roleUpdate" :rules="editRule" ref="editForm" label-position="left" label-width="80px" style='width: 400px; margin-left:50px;'>
					<el-form-item label="id" style="display: none;">
						<el-input v-model="roleUpdate.id" disabled="disabled"></el-input>
					</el-form-item>
					<el-form-item label="角色名称" prop="roleName">
						<el-input v-model="roleUpdate.roleName" placeholder="请输入角色名称"></el-input>
					</el-form-item>
					<el-form-item label="所属职位" prop="roleType">
						<el-select class="filter-item" v-model="roleUpdate.roleType" clearable filterable placeholder="请选择类型" @change="editTypeChange">
							<el-option v-for="item in userRole" :key="item.id" :label="item.positionName" :value="item.id">
							</el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="角色描述">
						<el-input v-model="roleUpdate.description" placeholder="请输入角色描述"></el-input>
					</el-form-item>
				</el-form>
				<div slot="footer" class="dialog-footer">
					<el-button @click="dialogRoleUpdate = false;$refs.editForm.resetFields()">取消</el-button>
					<el-button type="primary" @click="roleUpdateSubmit('editForm')" v-if="showList.backUserManager_authManager_update_sure">确 定</el-button>
				</div>
			</el-dialog>
			<!-- 后台账号删除 -->
			<el-dialog title="账号删除" :visible.sync="dialogVisibleDel">
				<code> 您确认要删除此角色吗？ ID：{{delRoleId}}</code>
				<div slot="footer" class="dialog-footer">
					<el-button @click="dialogVisibleDel = false;delRoleId = null">取 消</el-button>
					<el-button type="primary" @click="roleDeleteSubmit" v-if="showList.backUserManager_authManager_delete_sure">确 定</el-button>
				</div>
			</el-dialog>
			<!-- 账号批量删除 -->
			<el-dialog title="账号批量删除" :visible.sync="dialogVisibleDelBatch">
				<code> 删除 {{multipleSelection}}</code>
				<div slot="footer" class="dialog-footer">
					<el-button @click="dialogVisibleDelBatch = false;multipleSelection = null">取 消</el-button>
					<el-button type="primary" @click="roleDeleteListSubmit" v-if="showList.backUserManager_authManager_batchDelete_sure">确 定</el-button>
				</div>
			</el-dialog>
			<!-- 权限赋值 -->
			<el-dialog title="权限赋值" :visible.sync="dialogAuthorizationAssignment">
				<el-input placeholder="输入关键字进行过滤" v-model="filterText" style="width:50%;"></el-input>
				<el-tree id="tree" class="filter-tree" node-key="id" :data="datas" show-checkbox :props="defaultProps" ref="tree" highlight-current :default-expand-all="false"
					:filter-node-method="filterNode" :default-checked-keys="checkedKeys">
				</el-tree>
				<div slot="footer" class="dialog-footer">
					<el-button @click="dialogAuthorizationAssignment = false;updateRoleId = null">取 消</el-button>
					<el-button type="primary" @click="AuthorizationAssignmentSubmit" v-if="showList.backUserManager_authManager_auth_sure" :loading="authSureButton">确 定</el-button>
				</div>
			</el-dialog>
	</div>
</template>


<script>
	import { pagination, roleDetails, roleAdd, roleUpdate, roleDelete, roleDeletList, listRoleType,menuList,saveAuth } from '@/api/system/systemRole'
	import { positionList} from '@/api/common'
	import { hasPermission } from '@/utils/button'

	const tmp = {
		id: null,
		roleName: '',
		roleType: null,
		description: '',
		vision: 1
	}
	const tree = {
		id: '', 
		label: '', 
		open: null,
		checked: true, 
		parentId: null, 
		visible: null, 
		searched: null, 
		children: [] 
	}
	export default {
		data() {
			return {
				showList:{
					backUserManager_authManager_search:false,
					backUserManager_authManager_roleAdd:false,
					backUserManager_authManager_roleBatchDelete:false,
					backUserManager_authManager_roleEdit:false,
					backUserManager_authManager_roleDelete:false,
					backUserManager_authManager_add_sure:false,
					backUserManager_authManager_update_sure:false,
					backUserManager_authManager_delete_sure:false,
					backUserManager_authManager_batchDelete_sure:false,
					backUserManager_authManager_auth_sure:false,
				},
				filterText:'',
				defaultProps:{
					children: 'children',
          			label: 'label'
				},
				checkedKeys:[],
				updateRoleId:null,
				updateMessage:null,
				list: null,
				totalCount: 100,
				pagesize: 10,
				currentPage: 1,
				listLoading: true,
				authSureButton:false,
				searchOptions: {
					roleNameSearch: null,
					roleTypeSearch: null,
				},
				dialogRoleAdd: false,
				dialogRoleUpdate: false,
				dialogVisibleDel: false,
				dialogVisibleDelBatch: false,
				dialogAuthorizationAssignment:false,
				roleAdd: Object.assign({}, tmp),
				roleUpdate: Object.assign({}, tmp),
				datas: Object.assign({}, tree),
				delRoleId: null,
				multipleSelection: [],
				userRole: null,
				value8: '',
				selectedtype: '',
				addRules: {//添加规则
					roleName: [
						{ required: true, message: '请输入角色名称', trigger: 'blur' },
					],
					roleType: [
						{ required: true, message: '请选择角色类型', trigger: 'blur' },
					],
				},
				editRule: {//编辑规则
					roleName: [
						{ required: true, message: '请输入角色名称', trigger: 'blur' },
					],
					roleType: [
						{ required: true, message: '请选择角色类型', trigger: 'blur' },
					],
				}
			}
		},
		created() {
			this.fetchData();
			this.listRole();
			this.buttonControl()
		},
		watch: {
			filterText(val) {
				this.$refs.tree.filter(val);
			}
		},
		methods: {
			fetchData() {
				this.listLoading = true
				const listQuery = {
					roleNameSearch: this.searchOptions.roleNameSearch,
					roleTypeSearch: this.searchOptions.roleTypeSearch,
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
					codeType: 1000390
				};
				positionList().then(response => {
					const user = response.data.responseData;
					this.userRole = user;
				})
			},
			typeChange(key) {
				this.searchOptions.roleTypeSearch = key;
				this.fetchData();
			},
			editTypeChange(key) {
				this.roleUpdate.roleType = key
			},
			addTypeChange(key) {
				this.roleAdd.roleType = key
				//console.log(typeof(key));
			},
			cancleAdd(formName) {
				this.dialogRoleAdd = false;
				this.$refs[formName].resetFields();
			},
			handleSelectionChange(val) {
				if (val != null && val != '') {
					var arr = [];
					for (var i = 0; i < val.length; i++) {
						arr[i] = val[i].id;
					}
					this.multipleSelection = arr;
				} else {
					this.multipleSelection = val;
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
				const id = {
					id: key
				}
				roleDetails(id).then(response => {
					this.roleUpdate = response.data.responseData;;
					this.listLoading = false;
					if (response.data.statusCode == 200) {
						this.dialogRoleUpdate = true;
					} else {
						this.log('获取数据失败.', 'error');
					}
				}).catch(() => {
					this.loading = false;
					this.log('取数据失败.', 'error');
				});
			},
			//账号修改保存
			roleUpdateSubmit(formName) {
				this.$refs[formName].validate((valid) => {
					if (valid) {
						this.dialogVisible = true;
						roleUpdate(this.roleUpdate).then(response => {
							const data = response.data.responseData
							this.listLoading = false;
							if (response.data.statusCode == 200) {
								this.log('修改成功.', 'success');
								this.$refs[formName].resetFields();
								this.dialogRoleUpdate = false;
								this.roleUpdate = Object.assign({}, tmp);
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
			//账号添加保存
			roleAddSubmit(formName) {
				this.$refs[formName].validate((valid) => {
					if (valid) {
						roleAdd(this.roleAdd).then(response => {
							const data = response.data.responseData
							this.listLoading = false;
							if (response.data.statusCode == 200) {
								this.log('添加成功.', 'success');
								this.$refs[formName].resetFields();
								this.dialogRoleAdd = false;
								this.roleAdd = Object.assign({}, tmp);
								this.fetchData();
							} else {
								this.log('添加失败.', 'error');
							}
						}).catch(() => {
							this.loading = false;
							this.log('添加失败.', 'error');
						});
					}
				});
			},
			//删除确认
			deleteRole(id) {
				this.dialogVisibleDel = true;
				this.delRoleId = id;
			},
			//删除
			roleDeleteSubmit(key) {
				this.listLoading = true;
				const id = {
					id: this.delRoleId
				}
				this.dialogVisibleDel = false;
				roleDelete(id).then(response => {
					const data = response.data.responseData
					this.listLoading = false;
					if (response.data.statusCode == 200) {
						this.delRoleId = null;
						this.log('删除成功.', 'success');
					} else {
						this.log(response.data.statusMsg, 'error');
					}
					this.fetchData();
				}).catch(() => {
					this.loading = false;
					this.log('删除失败.', 'error');
				});
			},
			//批量删除确认
			delBacthClick() {
				if (this.multipleSelection == null || this.multipleSelection == '') {
					this.log('您还未勾选.', 'error');
					return;
				}
				this.dialogVisibleDelBatch = true;
			},
			//批量删除
			roleDeleteListSubmit() {
				this.listLoading = true;
				this.dialogVisibleDelBatch = false;
				roleDeletList(this.multipleSelection).then(response => {
					const data = response.data.responseData
					this.listLoading = false;
					if (response.data.statusCode == 200) {
						this.multipleSelection = [];
						this.log('批量删除成功.', 'success');
						this.fetchData();
					} else {
						this.log('批量删除失败.', 'error');
					}
				}).catch(() => {
					this.loading = false;
					this.log('批量删除失败.', 'error');
				});
			},
			showAuthTree(id){
					this.dialogAuthorizationAssignment = true;	
					this.updateRoleId = id,
					menuList(id).then(response => {
						this.filterText= ''
						this.defaultProps={
							children: 'children',
          					label: 'label'
						}
						this.datas = response.data.responseData.menu
						this.checkedKeys = response.data.responseData.right
						
					}).catch(() => {
						this.loading = false;
						this.log('展示页面权限失败.', 'error');
					});
			},
			filterNode(value, data) {
				if (!value) return true;
				return data.label.indexOf(value) !== -1;
			},
			getAllNodes() {
				var allNodes = [];
				var nodesMap = this.$refs.tree.store.nodesMap;
				for (var nodeKey in nodesMap) {
				if (nodesMap.hasOwnProperty(nodeKey)) {
					allNodes.push(nodesMap[nodeKey]);
				}
				}

				return allNodes;
			},
			getAllCheckedKeys() {
				let leafOnly = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;

				let key = this.key;
				let allNodes = this.getAllNodes();
				let keys = [];
				allNodes.forEach(function (node) {
				if (!leafOnly || leafOnly && node.isLeaf) {
					if (node.checked || node.indeterminate) {
					keys.push(node.data.id);
					}
				}
				});
				return keys;
			},
			AuthorizationAssignmentSubmit(){
				let module = this.getAllCheckedKeys()
				console.log(module);
				module.push(this.updateRoleId);
				this.authSureButton = true,
				// 权限加角色传入进去
				saveAuth(module).then(response => {
					this.dialogAuthorizationAssignment = false;	
					if (response.data.statusCode == 200) {
						this.updateMessage = response.data.responseData;
						this.log('权限重新分配成功.', 'success');
						this.fetchData();
					} else {
						this.log('权限重新分配失败.', 'error');
					}
					this.authSureButton = false
				}).catch(() => {
					this.loading = false;
					this.authSureButton = false,
					this.log('保存权限失败.', 'error');
				});
			},
			handleCloseAdd(){
				this.dialogRoleAdd=false;
				this.$refs.addForm.resetFields();
			},
			handleCloseEdit(){
				this.dialogRoleUpdate=false;
				this.$refs.editForm.resetFields();
			},
			buttonControl(){
				this.showList.backUserManager_authManager_search = hasPermission("backUserManager_authManager_search")
				this.showList.backUserManager_authManager_roleAdd = hasPermission("backUserManager_authManager_roleAdd")
				this.showList.backUserManager_authManager_roleBatchDelete = hasPermission("backUserManager_authManager_roleBatchDelete")
				this.showList.backUserManager_authManager_roleEdit = hasPermission("backUserManager_authManager_roleEdit")
				this.showList.backUserManager_authManager_roleDelete = hasPermission("backUserManager_authManager_roleDelete")
				this.showList.backUserManager_authManager_add_sure = hasPermission("backUserManager_authManager_add_sure")
				this.showList.backUserManager_authManager_update_sure = hasPermission("backUserManager_authManager_update_sure")
				this.showList.backUserManager_authManager_delete_sure = hasPermission("backUserManager_authManager_delete_sure")
				this.showList.backUserManager_authManager_batchDelete_sure = hasPermission("backUserManager_authManager_batchDelete_sure")
				this.showList.backUserManager_authManager_auth_sure = hasPermission("backUserManager_authManager_auth_sure")
			}
		}
	}

</script>