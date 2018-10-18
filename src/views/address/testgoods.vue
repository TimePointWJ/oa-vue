<template>
    <div class="app-container">
     
        <div class="filter-container">
            <el-select style="width: 200px" class="filter-item" v-model="listQuery.goodsType"  placeholder="商品类型" @change="listGoodContions">
                <el-option v-for="item in goodTypeList" :key="item.key" :label="item.value" :value="item.key"/>
            </el-select>
        <el-input @keyup.enter.native="listGoodContions" style="width: 150px;" class="filter-item" placeholder="商品名" v-model="listQuery.goodsName"   />

            <el-select style="width: 200px" class="filter-item" v-model="listQuery.saleFlg"  placeholder="是否下架" @change="listGoodContions">
                <el-option v-for="item in saleFlg" :key="item.key" :label="item.value" :value="item.key"/>
            </el-select>
            <el-button class="filter-item" style="margin-left: 10px;"  type="primary" icon="edit" @click="addBatchStaff">添加</el-button>
            <el-button class="filter-item" type="danger" icon="delete" @click="deleteBatchStaff">批量删除</el-button>
        </div>

         <el-table :data="goodList" border fit highlight-current-row ref="multipleTable" @selection-change="handleSelectionChange">
                <el-table-column type="selection"   align="center"  fixed="left"></el-table-column>
                <el-table-column prop="goodsId"     label="商品编号" sortable width="130"></el-table-column>
                <el-table-column prop="goodtypes"   label="商品类型" sortable width="130"></el-table-column>
                <el-table-column prop="goodsName"   label="商品名称" sortable width="130"></el-table-column>
                <el-table-column prop="price"       label="商品价格" sortable width="130"></el-table-column>
                <el-table-column prop="imageUrl"    label="商品图片" sortable width="130"></el-table-column>
                <el-table-column prop="saletypes"   label="商品状态" sortable width="130"></el-table-column>
                <el-table-column prop="description" label="商品描述" sortable width="130"></el-table-column>
                <el-table-column prop="id" align="center" label="操作" width="200" fixed="right">
                    <template slot-scope="scope">
                         <el-button size="small" type="success" @click="updateStaff(scope.row.goodsId)">修改</el-button>
                         <el-button size="small" type="danger"  @click="deleteStaff(scope.row.goodsId)">删除</el-button>
                    </template>
                </el-table-column>
         </el-table>
         <div align="center">
                <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="listQuery.pageNum" :page-sizes="pagesizes"
                    :page-size="listQuery.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="totalCount">
                </el-pagination>
         </div>
          <el-dialog title="商品信息修改" :visible.sync="updateStaffDialog" >
                <el-form :model="updateStaffForm"  ref="updateStaffForm" label-width="15%" size="30%">
                    <el-form-item label="商品名" prop="goodsName">
                            <el-input  v-model="updateStaffForm.goodsName" placeholder="请输入商品名" style='width: 50%;'></el-input>
                    </el-form-item>
                    <el-form-item label="商品类型" prop="goodsType">
                        <el-select clearable class="filter-item" v-model="updateStaffForm.goodsType" placeholder="请选择商品类型">
                            <el-option v-for="item in  goodTypeList" :key="item.key" :label="item.value" :value="item.key"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="商品价格" prop="price">
                            <el-input  v-model="updateStaffForm.price" placeholder="请输入商品价格" style='width: 50%;'></el-input>
                    </el-form-item>
                    <el-form-item label="商品状态" prop="saleFlg">
                        <el-select clearable class="filter-item" v-model="updateStaffForm.saleFlg" placeholder="请选择商品状态">
                            <el-option v-for="item in  saleFlg" :key="item.key" :label="item.value" :value="item.key"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="商品图片" prop="imageUrl">
                            <el-input  v-model="updateStaffForm.imageUrl" placeholder="请输入商品图片" style='width: 50%;'></el-input>
                    </el-form-item>
                     <el-form-item label="商品描述" prop="description">
                            <el-input  v-model="updateStaffForm.description" placeholder="请输入商品状态" style='width: 50%;'></el-input>
                    </el-form-item>
                    <el-button style='margin-bottom:20px;margin-left:35%;' type="primary" icon="document" @click="submitUpdateStaffForm('updateStaffForm')">提交</el-button>
                </el-form>
         </el-dialog>
         <el-dialog title="添加新商品" :visible.sync="addStaffDialog">
               <el-form :model="addStaffForm"  ref="addStaffForm" label-width="15%" size="30%">
                    <el-form-item label="商品编号" prop="goodsId">
                            <el-input  v-model="addStaffForm.goodsId" placeholder="请输入编号" style='width: 50%;'></el-input>
                    </el-form-item>
                    <el-form-item label="商品名" prop="goodsName">
                            <el-input  v-model="addStaffForm.goodsName" placeholder="请输入商品名" style='width: 50%;'></el-input>
                    </el-form-item>
                      <el-form-item label="商品类型" prop="goodsType">
                        <el-select clearable class="filter-item" v-model="addStaffForm.goodsType" placeholder="请选择商品类型">
                            <el-option v-for="item in  goodTypeList" :key="item.key" :label="item.value" :value="item.key"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="商品价格" prop="price">
                            <el-input  v-model="addStaffForm.price" placeholder="请输入商品价格" style='width: 50%;'></el-input>
                    </el-form-item>
                    <el-form-item label="商品状态" prop="saleFlg">
                        <el-select clearable class="filter-item" v-model="addStaffForm.saleFlg" placeholder="请选择商品状态">
                            <el-option v-for="item in  saleFlg" :key="item.key" :label="item.value" :value="item.key"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="商品图片" prop="imageUrl">
                            <el-input  v-model="addStaffForm.imageUrl" placeholder="请输入商品图片" style='width: 50%;'></el-input>
                    </el-form-item>
                     <el-form-item label="商品描述" prop="description">
                            <el-input  v-model="addStaffForm.description" placeholder="请输入商品状态" style='width: 50%;'></el-input>
                    </el-form-item>
                    <el-button style='margin-bottom:20px;margin-left:35%;' type="primary" icon="document" @click="submitaddStaffForm('updateStaffForm')">提交</el-button>
                
                </el-form>
         </el-dialog>
    </div>
</template>

<script>
       import {listGoodContion,dictionaryList,deleteGoods,selectGoodsById,updateGoods,addGoods} from '@/api/goods'
        const staffTemp = {
        goodsId:null,
        goodsName:null,
        goodsType:null,
        price:null,
        saleFlg:null,
        imageUrl:null,
        description:null,
        }
        const  pagesizes=[10,8,5,2];  //页面大小常量
        export default {
          data() {       
            return {
                pagesizes:pagesizes,
                updateStaffDialog:false,
                addStaffDialog:false,    //默认修改和插入的弹出框为FALSE隐藏
                valid:true,             //假设插入时验证通过
                updateStaffForm: Object.assign({}, staffTemp),  //修改员工表单，staffTemp为外部定义元素数组
                addStaffForm: Object.assign({}, staffTemp),    //添加员工表单，staffTemp为外部定义元素数组
                totalCount:null,
                goodTypeList:[],
                saleFlg:[],
                goodList:[],
                goodListtype:'1000391',
                saletype:'1000392',
                multipleSelection: [],
                listQuery : {
                    goodsType:null,
                    saleFlg:null,
                    goodsName:null,
                    pageNum: 1,
                    pageSize: pagesizes[1],
                },
            }
        },
        created() {
            this.listGoodContions();      //条件查询，每次刷新页面执行
        },
        methods: {
            selectList(){
                listGood().then(response => {
                    this.goodList=response.data.responseData
                })
            },
            listGoodContions(){
                  //数据字典的查询，将字典编码作为参数传入，返回类型，状态数组
                  dictionaryList(this.goodListtype).then(response => {
                    this.goodTypeList=response.data.responseData
                 })
                  dictionaryList(this.saletype).then(response => {
                    this.saleFlg=response.data.responseData
                 })
                 //页面加载就执行的查询
                 listGoodContion(this.listQuery).then(response => {
                    this.goodList=response.data.responseData.list       //返回查询的结果
                    this.totalCount=response.data.responseData.total   //返回查询的总数
                })
            },
            //分页的触发两个事件，分别修改pagesize,pagenum
            handleSizeChange(val){
                this.listQuery.pageSize=val;
                this.listGoodContions();
            },
            handleCurrentChange(val) {
                this.listQuery.pageNum=val;
                this.listGoodContions();
            },  
            deleteStaff(date){
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
                            this.listGoodContions()
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
            deleteBatchStaff(){
                const ids = []
                this.multipleSelection.forEach(function (item) {
                    ids.push(item.goodsId);
                })
                this.deleteStaff(ids)
            },
            updateStaff(row){           //根据id查
                selectGoodsById(row).then(response => {
                    this.updateStaffForm=response.data.responseData
                })
                this.updateStaffDialog=true;
            },
            submitUpdateStaffForm(formName){   
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        this.$confirm('确认提交', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {
                        updateGoods(this.updateStaffForm).then(response => {
                            this.listLoading = false;
                            if (response.data.statusCode == 200) {
                                this.$notify({
                                    title: '成功',
                                    message: '提交成功',
                                    type: 'success',
                                    duration: 2000
                                });
                                this.updateStaffDialog=false
                                this.listGoodContions()
                            }else {
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
               submitaddStaffForm(formName){
                    if (this.valid) {
                        this.$confirm('确认添加', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {
                        addGoods(this.addStaffForm).then(response => {
                            this.listLoading = false;
                            if (response.data.statusCode == 200) {
                                this.$notify({
                                    title: '成功',
                                    message: '添加成功',
                                    type: 'success',
                                    duration: 2000
                                });
                                this.addStaffDialog=false
                                this.listGoodContions();
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
                    }else {
                        console.log('error submit!!');
                        return false;
                    }
            },

          handleSelectionChange(val) {
                this.multipleSelection = val
          },
         //添加商品的弹出框触发事件
         addBatchStaff(){
             this.addStaffDialog=true;
         },
         
      }
     
            
     }
            
</script>
