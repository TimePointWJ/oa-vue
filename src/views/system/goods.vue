<template>
    <div class="app-container">
        <!--
            查询条件和按钮
        -->
         <div class="filter-container">
            <el-select filterable clearable style="width: 200px" class="filter-item" v-model="listQuery.goodsType" @change="fetchData" placeholder="商品类别">
                <el-option v-for="item in listGoodsType" :key="item.id" :label="item.value" :value="item.key"></el-option>
            </el-select>
            <el-select clearable class="filter-item" v-model="listQuery.saleFlg" @change="fetchData" placeholder="商品状态">
                <el-option v-for="item in  listSaleFlg" :key="item.id" :label="item.value" :value="item.key"></el-option>
            </el-select>
            <el-input @keyup.enter.native="fetchData" style="width: 150px;" class="filter-item" placeholder="商品名称" v-model="listQuery.goodsName"/>
            <el-button class="filter-item" type="primary" style="margin-left: 6px;" icon="search" @click="fetchData">搜索</el-button>
            <el-button class="filter-item" style="margin-left: 10px;" @click="addGoods" type="primary" icon="edit">添加商品</el-button>
            <el-button class="filter-item" type="danger" icon="delete" @click="deleteBatchGoods">批量删除</el-button> 
            
        </div>
        <div class="filter-container">
            <!--
                商品列表
            -->
            <el-table :data="list" border fit highlight-current-row ref="multipleTable" @selection-change="handleSelectionChange">
                <el-table-column type="selection" align="center" fixed="left"></el-table-column>
                <el-table-column prop="goodsName" label="商品名" sortable width="220"></el-table-column>
                <el-table-column prop="price" label="商品价格" sortable width="220"></el-table-column>
                <el-table-column prop="saleFlg" label="商品状态" sortable width="220">
                  <template slot-scope="scope">
                        <span v-if="scope.row.saleFlg == '0'">下架</span>
                        <span v-if="scope.row.saleFlg == '1'">上架</span>
                    </template>
                </el-table-column>
                <el-table-column prop="count" label="数量" sortable width="220"></el-table-column>
                <el-table-column prop="goodsId" align="center" label="操作" width="200" fixed="right">
                    <template slot-scope="scope">
                        <el-button v-if="scope.row.saleFlg" size="small" type="success" @click="updateGoods(scope.row)">编辑</el-button>
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
                添加商品dialog
            -->
            <el-dialog title="添加商品" :visible.sync="addGoodsDialog" :before-close="addGoodsDialogClose">
                <!-- 员工注册审核表单 -->
                <el-form :model="addGoodsForm" :rules="goodsFormRules" ref="addGoodsForm" label-width="15%" size="30%">
                    <el-form-item label="商品名" prop="goodsName">
                            <el-input v-model="addGoodsForm.goodsName" placeholder="请输入商品名" style='width: 50%;'></el-input>
                    </el-form-item>
                   <el-form-item label="商品类别" prop="goodsType">
                      <el-select filterable clearable style="width: 200px" class="filter-item" v-model="addGoodsForm.goodsType"  placeholder="商品类别">
                         <el-option v-for="item in listGoodsType" :key="item.id" :label="item.value" :value="item.key"></el-option>
                       </el-select>
                  </el-form-item>
                <el-form-item prop="price" label="商品价格">
                            <el-input v-model="addGoodsForm.price" placeholder="请输入价格" style='width: 50%;'></el-input>
                </el-form-item>
               <el-form-item label="商品状态" prop="saleFlg">
                   <el-select  filterable clearable style="width: 200px" class="filter-item"  v-model="addGoodsForm.saleFlg"  placeholder="商品状态">
                      <el-option v-for="item in listSaleFlg" :key="item.id" :label="item.value" :value="item.key"></el-option>
                   </el-select>
               </el-form-item>
                <el-form-item prop="count" label="商品数量">
                            <el-input v-model="addGoodsForm.count" placeholder="请输入数量" style='width: 50%;'></el-input>
                </el-form-item>
                    <el-button style='margin-bottom:20px;margin-left:35%;' type="primary" icon="document" @click="submitaddGoodsForm('addGoodsForm')">提交</el-button>
                </el-form>
            </el-dialog>
            <!--

                商品修改dialog
            -->
            <el-dialog title="商品修改" :visible.sync="updateGoodsDialog" :before-close="updateGoodsDialogClose">
                <!-- 商品修改表单 -->
                <el-form :model="updateGoodsForm" :rules="goodsFormRules" ref="updateGoodsForm" label-width="15%" size="30%">
                    <el-form-item label="商品名" prop="goodsName">
                            <el-input v-model="updateGoodsForm.goodsName" placeholder="请输入商品名" style='width: 50%;'></el-input>
                    </el-form-item>
                    <el-form-item label="商品类别" prop="goodsType">
                        <el-select  clearable class="filter-item" v-model="updateGoodsForm.goodsType" placeholder="请选择商品类别">
                            <el-option v-for="item in listGoodsType" :key="item.id" :label="item.value" :value="item.key"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="商品状态" prop="saleFlg">
                        <el-select clearable class="filter-item" v-model="updateGoodsForm.saleFlg" placeholder="请选择商品状态">
                           <el-option v-for="item in listSaleFlg" :key="item.id" :label="item.value" :value="item.key"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="商品价格" prop="price" >
                            <el-input v-model="updateGoodsForm.price" placeholder="请输入商品价格" style='width: 50%;'></el-input>
                    </el-form-item>
                    <el-form-item label="商品数量" prop="count">
                            <el-input v-model="updateGoodsForm.count" placeholder="请输入商品数量" style='width: 50%;'></el-input>
                    </el-form-item>
                    <el-button style='margin-bottom:20px;margin-left:35%;' type="primary" icon="document" @click="submitUpdateGoodsForm('updateGoodsForm')">提交</el-button>
                </el-form>
            </el-dialog>
      
        </div>
    </div>

</template>

<script>
import {
  pagination,
  goodsTypeList,
  saleFlgList,
  deleteGoods,
  addGoods,
  updateGoods
} from "@/api/system/goods";
import { dictionaryList } from "@/api/common";
import { parseTime } from "@/utils";
//数据模板
const goodsTemp = {
  goodsId: null,
  goodsName: null,
  goodsType: null,
  saleFlg: null,
  price: null,
  count: null
};
export default {
  data() {
    var validateNum = (rule, value, callback) => {
      if (!/^[0-9]*$/.test(value)) {
        callback(new Error("输入不合法"));
      } else {
        callback();
      }
    };
    return {
      list: null,
      updateGoodsDialog: false, //更新商品dialog
      addGoodsDialog: false, //添加商品dialog
      updateGoodsForm: Object.assign({}, goodsTemp), //商品信息表单
      addGoodsForm: Object.assign({}, goodsTemp), //添加商品
      saleFlgCode: "1000392",
      goodsTypeCode: "1000391",
      listGoodsType: [],
      listSaleFlg: [],
      multipleSelection: [],
      totalCount: 0,
      pagesize: 10,
      currentPage: 1,
      //表单验证
      goodsFormRules: {
        goodsName: [
          { required: true, message: "请输入商品名", trigger: "blur" }
        ], //商品名
        goodsType: [
          { required: true, message: "请选择商品类别", trigger: "change" }
        ], //商品类别
        saleFlg: [
          { required: true, message: "请选择商品状态", trigger: "change" }
        ],
        price: [
          { required: true, message: "输入价格", trigger: "change" },
          { validator: validateNum, trigger: "blur" }
        ], //价格
        count: [
          { required: true, message: "输入数量", trigger: "change" },
          { validator: validateNum, trigger: "blur" }
        ] //商品数量
      },
      listQuery: {
        saleFlg: null,
        goodsId: null,
        goodsType: null,
        goodsName: null,
        count: null,
        price: null,
        pageNum: 1,
        pageSize: 10
      }
    };
  },
  created() {
    this.fetchData();
    this.selectList();
  },
  methods: {
    fetchData() {
      //页面初期加载
      this.listLoading = true;
      this.listQuery.pageNum = this.currentPage;
      this.listQuery.pageSize = this.pagesize;
      pagination(this.listQuery).then(response => {
        this.listLoading = false;
        const data = response.data.responseData;
        this.list = data.list;
        this.totalCount = data.total;
      });
    },
    selectList() {
      //商品状态
      dictionaryList(this.saleFlgCode).then(response => {
        this.listSaleFlg = response.data.responseData;
      });
      //商品状态
      dictionaryList(this.goodsTypeCode).then(response => {
        this.listGoodsType = response.data.responseData;
      });
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
     * 复选框change事件
     */
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    /**
     * 提交表单
     */
    submitUpdateGoodsForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.$confirm("确认提交", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning"
          })
            .then(() => {
              updateGoods(this.updateGoodsForm).then(response => {
                this.listLoading = false;
                if (response.data.statusCode == 200) {
                  this.$notify({
                    title: "成功",
                    message: "提交成功",
                    type: "success",
                    duration: 2000
                  });
                  this.updateGoodsDialog = false;
                  this.$refs[formName].resetFields();
                  this.fetchData();
                } else {
                  this.$notify({
                    title: "失败",
                    message: response.data.statusMsg,
                    type: "info",
                    duration: 2000
                  });
                }
              });
            })
            .catch(() => {
              this.$message({
                type: "info",
                message: "取消提交"
              });
            });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    /**
     * 删除商品
     */
    deleteGoods(data) {
      const ids = new Array();
      this.multipleSelection.forEach(function(item) {
        ids.push(item.goodsId);
      });
      if (ids.length == 0) {
        ids.push(data);
      }
      this.$confirm("确认删除", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          deleteGoods(ids).then(response => {
            if (response.data.statusCode == 200) {
              this.$notify({
                title: "成功",
                message: "删除成功",
                type: "success",
                duration: 2000
              });
              this.fetchData();
            } else {
              this.$notify({
                title: "失败",
                message: "删除失败",
                type: "info",
                duration: 2000
              });
            }
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "取消删除"
          });
        });
    },
    /**
     * 提交表单
     */
    submitaddGoodsForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.$confirm("确认添加", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning"
          })
            .then(() => {
              addGoods(this.addGoodsForm).then(response => {
                this.listLoading = false;
                if (response.data.statusCode == 200) {
                  this.$notify({
                    title: "成功",
                    message: "添加成功",
                    type: "success",
                    duration: 2000
                  });
                  this.addGoodsDialog = false;
                  this.$refs[formName].resetFields();
                  this.fetchData();
                } else {
                  this.$notify({
                    title: "失败",
                    message: response.data.statusMsg,
                    type: "info",
                    duration: 2000
                  });
                }
              });
            })
            .catch(() => {
              this.$message({
                type: "info",
                message: "取消添加"
              });
            });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    /**
     * 批量删除商品
     */
    deleteBatchGoods() {
      const ids = [];
      this.multipleSelection.forEach(function(item) {
        ids.push(item.goodsId);
      });
      this.deleteGoods(ids);
    },
    /**
     * 更新dialog关闭事件
     */
    updateGoodsDialogClose(done) {
      this.updateGoodsDialog = false;
      this.$refs["updateGoodsForm"].resetFields();
    },
    /**
     * 添加dialog关闭事件
     */
    addGoodsDialogClose(done) {
      this.addGoodsDialog = false;
      this.$refs["addGoodsForm"].resetFields();
    },
    /**
     * 添加新商品button事件
     */
    addGoods() {
      //给能赋默认值的先赋上
      this.addGoodsForm.saleFlg = "1";
      this.addGoodsDialog = true;
    },
    /**
     * 点击更新按钮事件
     */
    updateGoods(row) {
      this.updateGoodsForm= row;
      this.updateGoodsDialog = true;
      console.log(this.updateGoodsForm)
    }
  }
};
</script>
