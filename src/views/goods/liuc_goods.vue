<template>
    <div class="app-container">
        <!--
            查询条件和按钮
        -->
        <div class="filter-container">
            <el-select filterable clearable style="width: 200px" class="filter-item" v-model="listQuery.goodsType" @change="fetchData" placeholder="商品类型">
                <el-option v-for="item in listGoodsType" :key="item.key" :label="item.value" :value="item.key"/>
            </el-select>
            <el-select filterable clearable style="width: 200px" class="filter-item" v-model="listQuery.saleFlg" @change="fetchData" placeholder="上下架">
                <el-option v-for="item in  listSalaType" :key="item.key" :label="item.value" :value="item.key"></el-option>
            </el-select>
            <el-input @keyup.enter.native="fetchData" style="width: 150px;" class="filter-item" placeholder="商品名称" v-model="listQuery.goodsName"/>
            <el-button class="filter-item" type="primary" style="margin-left: 6px;" icon="search" @click="fetchData">搜索</el-button>
            <el-button class="filter-item" style="margin-left: 10px;" @click="addGoods" type="primary" icon="edit">添加商品</el-button>
            <el-button class="filter-item" type="danger" icon="delete" @click="deleteBatchStaff">批量删除</el-button>
        </div>
        <div class="filter-container">
            <!--
                商品列表
            -->
            <el-table :data="goodsList" border fit highlight-current-row ref="multipleTable" @selection-change="handleSelectionChange">
                <el-table-column type="selection" align="center" fixed="left"></el-table-column>
                <!-- <el-table-column prop="goodsType" label="类别" sortable width="130">
                    <template slot-scope="scope">
                        <span v-if="scope.row.goodsType == '1'">鞋子</span>
                        <span v-if="scope.row.goodsType == '2'">衣服</span>
                    </template>
                </el-table-column> -->
                <el-table-column prop="typeValue" label="商品类型" sortable width="130"></el-table-column>
                <el-table-column prop="goodsName" label="商品名称" sortable width="130"></el-table-column>
                <el-table-column prop="price" label="价格" sortable width="130"></el-table-column>
                <el-table-column prop="imageUrl" label="图片" sortable width="130"></el-table-column>
                <el-table-column prop="count" label="数量" sortable width="130"></el-table-column>
                <el-table-column prop="cost" label="成本" sortable width="130"></el-table-column>
                <!-- <el-table-column prop="saleFlg" label="上下架" sortable width="130">
                    <template slot-scope="scope">
                        <span v-if="scope.row.saleFlg == '1'">上架</span>
                        <span v-if="scope.row.saleFlg == '0'">下架</span>
                    </template>
                </el-table-column> -->
                <el-table-column prop="salaValue" label="上下架" sortable width="130"></el-table-column>
                <el-table-column prop="description" label="商品描述" sortable width="130"></el-table-column>
                <el-table-column prop="goodsId" align="center" label="操作" width="200" fixed="right">
                    <template slot-scope="scope">
                        <el-button size="small" type="success" @click="updateGoods(scope.row)">修改</el-button>
                        <el-button size="small" type="danger" @click="deleteGoods(scope.row.goodsId)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div align="center">
                <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage" :page-sizes="[10, 20, 30, 40,2]"
                    :page-size="pagesize" layout="total, sizes, prev, pager, next, jumper" :total="totalCount">
                </el-pagination>
            </div>
            <!--
                添加新商品dialog
            -->
            <el-dialog title="添加商品" :visible.sync="addGoodsDialog" :before-close="addGoodsDialogClose">
                <!-- 商品添加表单 -->
                <el-form :model="addGoodsForm" :rules="goodsFormRules" ref="addGoodsForm" label-width="15%" size="30%">
                    <el-form-item label="商品名" prop="goodsName">
                            <el-input v-model="addGoodsForm.goodsName" placeholder="请输入商品名" style='width: 50%;'></el-input>
                    </el-form-item>
                    <el-form-item label="商品类别" prop="goodsType">
                        <el-select clearable class="filter-item" v-model="addGoodsForm.goodsType" placeholder="请选择类别">
                            <el-option v-for="item in  listGoodsType" :key="item.key" :label="item.value" :value="item.key"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="价格" prop="price">
                        <el-input v-model="addGoodsForm.price" placeholder="请输入商品价格" style='width: 50%;'></el-input>
                    </el-form-item>
                    <el-form-item label="图片" prop="imageUrl">
                        <el-input v-model="addGoodsForm.imageUrl" placeholder="请选择图片" style='width: 50%;'></el-input>
                    </el-form-item>
                    <el-form-item label="数量" prop="count">
                        <el-input v-model="addGoodsForm.count" placeholder="请输入商品数量" style='width: 50%;'></el-input>
                    </el-form-item>
                    <el-form-item label="成本" prop="cost">
                        <el-input v-model="addGoodsForm.cost" placeholder="请输入商品成本" style='width: 50%;'></el-input>
                    </el-form-item>
                    <el-form-item label="上下架" prop="saleFlg">
                        <el-select clearable class="filter-item" v-model="addGoodsForm.saleFlg" placeholder="请选择">
                            <el-option v-for="item in  listSalaType" :key="item.key" :label="item.value" :value="item.key"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="商品描述" prop="description">
                        <el-input v-model="addGoodsForm.description" placeholder="请输入商品介绍" style='width: 50%;'></el-input>
                    </el-form-item>
                    <el-form-item label="创建时间" prop="createTime">
                        <el-date-picker v-model="addGoodsForm.createTime" type="date" placeholder="创建时间"></el-date-picker>
                    </el-form-item>
                    <el-button style='margin-bottom:20px;margin-left:35%;' type="primary" icon="document" @click="submitaddGoodsForm('addGoodsForm')">提交</el-button>
                </el-form>
            </el-dialog>
            <!-- 
                 修改商品dialog
            -->
            <el-dialog title="修改商品" :visible.sync="updateGoodsDialog" :before-close="updateGoodsDialogClose">
                <!-- 商品修改表单 -->
                <el-form :model="updateGoodsForm" :rules="goodsFormRules" ref="updateGoodsForm" label-width="15%" size="30%">
                    <el-form-item label="商品名" prop="goodsName">
                            <el-input v-model="updateGoodsForm.goodsName" placeholder="请输入商品名" style='width: 50%;'></el-input>
                    </el-form-item>
                    <el-form-item label="类别" prop="goodsType">
                        <el-select clearable class="filter-item" v-model="updateGoodsForm.goodsType" placeholder="请选择类别">
                            <el-option v-for="item in  listGoodsType" :key="item.key" :label="item.value" :value="item.key"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="价格" prop="price">
                            <el-input v-model="updateGoodsForm.price" placeholder="请输入商品价格" style='width: 50%;'></el-input>
                    </el-form-item>
                    
                    <el-form-item label="图片" prop="imageUrl">
                        <el-input v-model="updateGoodsForm.imageUrl" style='width: 50%;'></el-input>
                    </el-form-item>

                    <el-form-item label="数量" prop="count">
                            <el-input v-model="updateGoodsForm.count" placeholder="请输入商品数量" style='width: 50%;'></el-input>
                    </el-form-item>
                    <el-form-item label="成本" prop="cost">
                            <el-input v-model="updateGoodsForm.cost" placeholder="请输入商品成本" style='width: 50%;'></el-input>
                    </el-form-item>
                    <el-form-item label="上下架" prop="saleFlg">
                        <el-select clearable class="filter-item" v-model="updateGoodsForm.saleFlg" placeholder="请选择">
                            <el-option v-for="item in  listSalaType" :key="item.key" :label="item.value" :value="item.key"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="商品描述" prop="description">
                        <el-input v-model="updateGoodsForm.description" placeholder="请输入商品介绍" style='width: 50%;'></el-input>
                    </el-form-item>
                    <el-button style='margin-bottom:20px;margin-left:35%;' type="primary" icon="document" @click="submitUpdateGoodsForm('updateGoodsForm')">提交</el-button>
                </el-form>
            </el-dialog>
        </div>
    </div>
</template>

<script>
    import { pagination,deleteGoods,updateGoods,selectGoodsById,addGoods} from '@/api/liucGood'
    import { dictionaryList} from '@/api/common'
    // import { parseTime } from '@/utils'
    // 数据模板
    const goodsTemp = {
        goodsName:null,//商品名称
        goodsId:null,//商品id
        goodsType:null,//商品类型
        price:null,//价格验证
        saleFlg:null,//上下架验证
        count:null,//商品数量
        cost:null,//商品原价
        createTime:null,//创建时间
        updateTime:null,//修改时间
        imageUrl:null,//图片路径
        //status:null,//在职状态   0.在职 1.离职
        //remark:null,//备注
    }
    export default {
        data() {
            var validatePrice=(rule,value,callback)=>{
                if(!/^\d+$/.test(value)){
                    callback(new Error('请输入正确价格(数字)'));
                }else{
                    callback(); 
                }
            }
            var validateCount=(rule,value,callback)=>{
                if(!/^\d+$/.test(value)){
                    callback(new Error('请输入正确数量(数字)'));
                }else{
                    callback(); 
                }
            }
            return {
                //checkFlg:false,//true为审核，false为修改
                goodsList:null,//商品列表
                listLoading: true,
                updateGoodsForm: Object.assign({}, goodsTemp),//更新商品表单
                addGoodsForm: Object.assign({}, goodsTemp),//添加商品表单
                goodsType:"1000391",//商品数据字典code
                saleType:"1000392",//商品数据字典code

                multipleSelection: [],//复选框使用
                listGoodsType:[],//存储商品类型
                listSalaType:[],//存储商品上下架
                totalCount: 0,
                pagesize: 10,
                currentPage: 1,
                updateGoodsDialog:false,//更新商品的dialog
                addGoodsDialog:false,//添加商品的dialog
                //商品表单验证
                goodsFormRules: {     
                    goodsType:[{ required: true, message: '请选择商品类型', trigger: 'change' }],//商品类型
                    goodsName: [{ required: true, message: '请输入正确商品名', trigger: 'blur' }],//员工名
                    saleFlg:[{ required: true, message: '请选择上架或下架', trigger: 'change' }],//性别
                    price:[{validator: validatePrice, trigger: 'blur' }],//价格验证
                    cost:[{validator: validatePrice, trigger: 'blur' }],//成本验证
                    count:[{validator: validateCount, trigger: 'blur' }],//数量验证
                },
                listQuery : {
                    goodsType:null,
                    goodsName:null,
                    saleflg:null,
                    pageNum: 1,
                    pageSize: 10
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
                    console.log('eqeqeqweqwee'+this.listGoodsType[0].key)
                    const data=response.data.responseData
                    console.log(data);
                    this.goodsList=data.list
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
             * 提交更新表单
             */
            submitUpdateGoodsForm(formName){
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        this.$confirm('确认提交更新', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {
                        updateGoods(this.updateGoodsForm).then(response => {
                            this.listLoading = false;
                            if (response.data.statusCode == 200) {
                                this.$notify({
                                    title: '成功',
                                    message: '更新成功',
                                    type: 'success',
                                    duration: 2000
                                });
                                this.updateGoodsDialog=false
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
             * 提交添加表单
             */
            submitaddGoodsForm(formName){
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        this.$confirm('确认添加', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {
                        addGoods(this.addGoodsForm).then(response => {
                            this.listLoading = false;
                            if (response.data.statusCode == 200) {
                                this.$notify({
                                    title: '成功',
                                    message: '添加成功',
                                    type: 'success',
                                    duration: 2000
                                });
                                this.addGoodsDialog=false
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
                //商品类别
                dictionaryList(this.goodsType).then(response => {
                    this.listGoodsType=response.data.responseData
                })
                //商品上下架
                dictionaryList(this.saleType).then(response => {
                    this.listSalaType=response.data.responseData
                })
            },
            
            /**
             * 点击商品更新按钮事件
             */
            updateGoods(row){
                // if(row.checkStatus==1){
                //     this.checkFlg=true;
                // }else{
                //     this.checkFlg=false;
                // }
                
                //根据id查询商品信息
                selectGoodsById(row.goodsId).then(response => {
                    this.updateGoodsForm=response.data.responseData
                })
                this.updateGoodsDialog=true;
            },
            /**
             * 删除商品信息
             */
            deleteGoods(date){
                const ids=new Array()
                this.multipleSelection.forEach(function (item) {
                    console.log("aaaaaaaaaa"+item.goodsId)
                    ids.push(item.goodsId)
                })
                if(ids.length==0){
                    ids.push(date)
                    console.log("bbbbbbbbbbbbbb"+ids)
                }
                this.$confirm('确认删除', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    deleteGoods(ids).then(response => {
                        console.log("ccccccccccc"+ids)
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
            updateGoodsDialogClose(done) {
                this.updateGoodsDialog=false;
                this.$refs["updateGoodsForm"].resetFields();
            },
            /**
             * 审核dialog关闭事件
             */
            addGoodsDialogClose(done) {
                this.addGoodsDialog=false;
                this.$refs["addGoodsForm"].resetFields();
            },
            /**
             * 添加新员工button事件
             */
            addGoods(){
                //给能赋默认值的先赋上
                this.addGoodsForm.createTime=new Date();
                //打开添加商品dislog
                this.addGoodsDialog=true;
            },
            /**
             * 复选框change事件
             */
            handleSelectionChange(val) {
                this.multipleSelection = val
            },
            /**
             * 批量删除商品信息
             */
            deleteBatchStaff(){
                const ids = []
                this.multipleSelection.forEach(function (item) {
                    ids.push(item.goodsId)
                     console.log("4444444"+ids)
                })
                this.deleteGoods(ids)
            },
        }
    }
</script>
