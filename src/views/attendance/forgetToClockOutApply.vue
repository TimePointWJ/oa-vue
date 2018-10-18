<template>
<el-table :data="list" border highlight-current-row @selection-change="handleSelectionChange" ref="multipleTable">
  <el-table-column type="selection" align="center"></el-table-column>
  <el-table-column prop="personId" label="人员编号" min-width="160px;" sortable></el-table-column>
  <el-table-column prop="data" label="日期"  min-width="160px;" sortable></el-table-column>
  <el-table-column prop="time" label="上下班" min-width="160px;" sortable></el-table-column>
  <el-table-column prop="explains" label="说明" min-width="160px;" sortable></el-table-column>
  <el-table-column prop="ids" align="center" label="操作" min-width="160px;" >
    <template slot-scope="scope">
      <el-button size="small" type="success" @click="updateOneData(scope.row)" v-if="showList.attendance_apply_edit">编辑</el-button>
      <el-button size="small" type="danger" @click="deleteOneData(scope.row)" v-if="showList.attendance_apply_delete">删除</el-button>
    </template>
  </el-table-column>
</el-table>
</template>

<script>
import { getList } from '@/api/forgetToClockOutApply'
import { hasPermission } from '@/utils/button'
export default{
  data() {
    return {
      showList: {
        attendance_apply_edit:false,
        attendance_apply_delete:false,
      },
      listLoading: true,
      list: null,
      totalCount: 10,
      pagesize: 10,
      currentPage: 0,
    }
  },
  created() {
    this.fetchData();
    this.buttonControl()
  },
  methods: {
    fetchData() {
      const listQuery = {
        pageNum: this.currentPage,
        pageSize: this.pagesize
      }
      //页面初期加载
      getList(listQuery).then(response => {
        console.log(response);
        this.listLoading = false
        const data = response.data.responseData
        this.list = data.list
        
        this.totalCount = data.total
      });
    },
    handleSelectionChange(val) {//选择框改变的时候
      this.multipleSelection = val
    },
    buttonControl(){
      this.showList.attendance_apply_edit = hasPermission("attendance_apply_edit")
      this.showList.attendance_apply_delete = hasPermission("attendance_apply_delete")
		}
  }
}
</script>

<style scoped>
</style>
