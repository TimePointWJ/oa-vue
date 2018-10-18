<template>
    <div class="app-container">
        <!--
            查询条件和按钮
        -->
        <div class="filter-container">
            <el-select filterable clearable style="width: 200px" class="filter-item" v-model="listQuery.goodsType" @change="fetchData" placeholder="商品类型">
                <el-option v-for="item in listType" :key="item.key" :label="item.value" :value="item.key"/>
            </el-select>
            <el-select filterable clearable style="width: 200px" class="filter-item" v-model="listQuery.saleFlg" @change="fetchData" placeholder="上下架区分">
                <el-option v-for="item in  listSale" :key="item.key" :label="item.value" :value="item.key"></el-option>
            </el-select>
            <el-input @keyup.enter.native="fetchData" style="width: 150px;" class="filter-item" placeholder="商品名称" v-model="listQuery.goodsName"/>
            <el-button class="filter-item" type="primary" style="margin-left: 6px;" icon="search" @click="fetchData">搜索</el-button>
            <el-button class="filter-item" style="margin-left: 10px;" @click="addGoods" type="primary" icon="edit">添加商品</el-button>
            <el-button class="filter-item" type="danger" icon="delete" @click="deleteBatchGoods">批量删除</el-button>
        </div>
        <div class="filter-container">
            <!--商品信息列表-->
            <el-table :data="goodsList" border fit highlight-current-row ref="multipleTable" @selection-change="handleSelectionChange">
                <el-table-column type="selection" align="center" fixed="left"></el-table-column>
                <el-table-column prop="goodsName" label="商品名称" sortable width="130"></el-table-column>
                <el-table-column prop="price" label="商品价格" sortable width="130"></el-table-column>
                <el-table-column prop="cost" label="价格优惠" sortable width="130"></el-table-column>
                <el-table-column prop="count" label="商品数量" sortable width="130"></el-table-column>
                <el-table-column prop="nameValue" label="商品类型" sortable width="130"></el-table-column>
                <el-table-column prop="typeValue" label="销售状态" sortable width="130"></el-table-column>
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
            <!--添加新商品dialog-->
            <el-dialog title="添加新商品" :visible.sync="addGoodsDialog" :before-close="addGoodsDialogClose">
                <!-- 员工注册审核表单 -->
                <el-form :model="addGoodsForm" :rules="goodsFormRules" ref="addGoodsForm" label-width="15%" size="30%">
                    <el-form-item label="商品名称" prop="goodsName">
                            <el-input v-model="addGoodsForm.goodsName" placeholder="请输入商品名" style='width: 50%;'></el-input>
                    </el-form-item>
                    <el-form-item label="商品类型" prop="goodsType">
                        <el-select clearable class="filter-item" v-model="addGoodsForm.goodsType" placeholder="请选择类型">
                            <el-option v-for="item in  listType" :key="item.key" :label="item.value" :value="item.key"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="商品价格" prop="price">
                            <el-input v-model="addGoodsForm.price" placeholder="请输入价格" style='width: 50%;'></el-input>
                    </el-form-item>
                    <el-form-item label="商品图片" prop="imageUrl">
                            <el-input v-model="addGoodsForm.imageUrl" placeholder="请选择图片" style='width: 50%;'></el-input>
                    </el-form-item>
                    <el-form-item label="商品数量" prop="count">
                            <el-input v-model="addGoodsForm.count" placeholder="请输入数量" style='width: 50%;'></el-input>
                    </el-form-item>
                    <el-form-item label="商品优惠" prop="cost">
                            <el-input v-model="addGoodsForm.cost" placeholder="请输入优惠价格" style='width: 50%;'></el-input>
                    </el-form-item>
                    <el-form-item label="上下架状况" prop="saleFlg">
                        <el-select clearable class="filter-item" v-model="addGoodsForm.saleFlg" placeholder="请选择状态">
                            <el-option v-for="item in  listSale" :key="item.key" :label="item.value" :value="item.key"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="描述" prop="description">
                        <el-input type="textarea" v-model="addGoodsForm.description" style='width: 50%;'></el-input>
                    </el-form-item>
                    <el-button style='margin-bottom:20px;margin-left:35%;' type="primary" icon="document" @click="submitaddGoodsForm('addGoodsForm')">提交</el-button>
                </el-form>
            </el-dialog>
            <!-- 员工信息修改 -->
            <el-dialog title="员工信息修改" :visible.sync="updateGoodsDialog" :before-close="updateGoodsDialogClose">
                <el-form :model="updateGoodsForm" :rules="goodsFormRules" ref="updateGoodsForm" label-width="15%" size="30%">
                    <el-form-item label="商品名称" prop="goodsName">
                            <el-input v-model="updateGoodsForm.goodsName" placeholder="请输入商品名" style='width: 50%;'></el-input>
                    </el-form-item>
                    <el-form-item label="商品类型" prop="goodsType">
                        <el-select clearable class="filter-item" v-model="updateGoodsForm.goodsType" placeholder="请选择类型">
                            <el-option v-for="item in  listType" :key="item.key" :label="item.value" :value="item.key"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="商品价格" prop="price">
                            <el-input v-model="updateGoodsForm.price" placeholder="请输入价格" style='width: 50%;'></el-input>
                    </el-form-item>
                    <el-form-item label="商品图片" prop="imageUrl">
                            <el-input v-model="updateGoodsForm.imageUrl" placeholder="请选择图片" style='width: 50%;'></el-input>
                    </el-form-item>
                    <el-form-item label="商品数量" prop="count">
                            <el-input v-model="updateGoodsForm.count" placeholder="请输入数量" style='width: 50%;'></el-input>
                    </el-form-item>
                    <el-form-item label="商品优惠" prop="cost">
                            <el-input v-model="updateGoodsForm.cost" placeholder="请输入优惠价格" style='width: 50%;'></el-input>
                    </el-form-item>
                    <el-form-item label="上下架状况" prop="saleFlg">
                        <el-select clearable class="filter-item" v-model="updateGoodsForm.saleFlg" placeholder="请选择状态">
                            <el-option v-for="item in  listSale" :key="item.key" :label="item.value" :value="item.key"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="描述" prop="description">
                        <el-input type="textarea" v-model="updateGoodsForm.description" style='width: 50%;'></el-input>
                    </el-form-item>
                    <el-button style='margin-bottom:20px;margin-left:35%;' type="primary" icon="document" @click="submitUpdateGoodsForm('updateGoodsForm')">提交</el-button>
                </el-form>
            </el-dialog>
        </div> 
    </div> 
</template>     
<script>
    import { findGoods,deleteGoods,addGoods,updateGoods,selectGoodsById} from '@/api/goods_jing'
    import { dictionaryList} from '@/api/common'
    import { parseTime } from '@/utils'
   
    // 数据模板
    const goodsTemp={
        goodsId:null,
        goodsType:null,
        goodsName:null,
        price:null,
        imageUrl:null,
        count:null,
        cost:null,
        saleFlg:null,
        description:null,
    }

    export default {
        data() {
           var validatePrice=(rule, value, callback)=>{
                if(!/^(0|([1-9]\d{0,9}(\.\d{1,2})?))$/.test(value)){
                    callback(new Error('商品价格不合法'));
                }else{
                    callback(); 
                }
            }

           var validateCount=(rule, value, callback)=>{
                if(!/^\+?[1-9][0-9]*$/.test(value)){
                    callback(new Error('输入数量不合法'));
                }else{
                    callback(); 
                }
            }

            return {
                listType:[],//商品类型列表
                listSale:[],//上下架区分
                goodsList:null,//商品列表
                typeCodeType:"1000391",
                saleCodeType:"1000392",
                multipleSelection: [],
                goodsId:null,
                addGoodsDialog:false,
                updateGoodsDialog:false,
                addGoodsForm: Object.assign({}, goodsTemp),//添加商品表单
                updateGoodsForm: Object.assign({}, goodsTemp),

                totalCount: 0,
                pagesize: 10,
                currentPage: 1,
                //表单验证
                goodsFormRules: {     
                    goodsName:[{ required: true, message: '请输入商品名称', trigger: 'blur' }],//商品名称
                    goodsType:[{ required: true, message: '请选择商品类别', trigger: 'change' }],//类型
                    price: [
                        { required: true, message: '请输入商品价格', trigger: 'blur' },
                        { validator: validatePrice, trigger: 'blur' }
                        ],//价格
                    count: [
                        { required: true, message: '请输入商品数量', trigger: 'blur' },
                        { validator: validateCount, trigger: 'blur'}
                        ],//数量
                    cost: [{ validator: validatePrice, trigger: 'blur' }],//价格
                    saleFlg:[{ required: true, message: '请选择上下架状况', trigger: 'change' }],//状况
                    description: [{ required: true, message: '请输入商品信息', trigger: 'blur' }],
                },
                listQuery : {
                    goodsId:null,
                    goodsType:null,
                    saleFlg:null,
                    nameValue:null,
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
                findGoods(this.listQuery).then(response => {
                    const data=response.data.responseData
                    console.log(data);
                    this.goodsList=data.list
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
             * 下拉框查询
             */
            selectList(){
                //商品类别
                dictionaryList(this.typeCodeType).then(response => {
                    this.listType=response.data.responseData
                })
                //商品上下架
                dictionaryList(this.saleCodeType).then(response => {
                    this.listSale=response.data.responseData
                })
               
            },

            /**
             * 提交商品信息修改表单
             */
            submitUpdateGoodsForm(formName){
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        this.$confirm('确认提交', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {
                        updateGoods(this.updateGoodsForm).then(response => {
                            this.listLoading = false;
                            if (response.data.statusCode == 200) {
                                this.$notify({
                                    title: '成功',
                                    message: '提交成功',
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
             * 点击修改按钮事件
             */
            updateGoods(row){
                selectGoodsById(row.goodsId).then(response => {
                    this.updateGoodsForm=response.data.responseData
                })
                this.updateGoodsDialog=true;
            },
            /**
             * 审核dialog关闭事件
             */
            updateGoodsDialogClose(done) {
                this.updateGoodsDialog=false;
                this.$refs["updateGoodsForm"].resetFields();
            },

            /**
             * 提交新商品表单
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
             * 添加新商品button事件
             */
            addGoods(){
                //给能赋默认值的先赋上
                this.addGoodsForm.entryTime=new Date();
                this.addGoodsForm.status="0";
                this.addGoodsDialog=true;
            },
            /**
             * 审核dialog关闭事件
             */
            addGoodsDialogClose(done) {
                this.addGoodsDialog=false;
                this.$refs["addGoodsForm"].resetFields();
            },
            
            /**
             * 删除商品信息
             */
            deleteGoods(date){
                const ids=new Array()
                this.multipleSelection.forEach(function (item) {
                    ids.push(item.goodsId)
                })
                if(ids.length==0){
                    ids.push(date)
                }
                this.$confirm('确认删除', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    deleteGoods(ids).then(response => {
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
             * 复选框change事件
             */
            handleSelectionChange(val) {
                this.multipleSelection = val
            },

            /**
             * 批量删除商品
             */
            deleteBatchGoods(){
                const ids = []
                this.multipleSelection.forEach(function (item) {
                    ids.push(item.goodsId)
                })
                this.deleteGoods(ids)
            },

            
        }
    }
</script>
