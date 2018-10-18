<template>
<div class="app-container" v-loading.body="listLoading" element-loading-text="拼命加载中">
  <div class="filter-container">
    <el-input style="width: 300px;" class="filter-item" v-model="selectName.name" placeholder="人员编号"></el-input>
    <!-- <el-select :clearable="clearableSchool" class="filter-item" v-model="value8" filterable placeholder="请选择学校" @change="schoolChange">
        <el-option v-for="item in school" :key="item.id" :label="item.schoolName" :value="item.id">
        </el-option>
    </el-select> -->
    <el-button class="filter-item" type="primary" style="margin-left: 6px;" icon="search" @click="selectListData" v-if="showList.attendance_record_search">搜索</el-button>
    <el-button class="filter-item" @click="excelStart" type="primary" v-if="showList.attendance_record_batch_insert">批量导入信息</el-button>

    <el-table :data="list" border highlight-current-row @selection-change="handleSelectionChange" ref="multipleTable">
      <el-table-column type="selection" align="center"></el-table-column>
      <el-table-column prop="personId" label="人员编号" min-width="160px;" sortable></el-table-column>
      <el-table-column prop="attendanceDate" label="考勤日期"  min-width="160px;" sortable></el-table-column>
      <el-table-column prop="iswork" label="是否出勤" min-width="160px;" sortable></el-table-column>
      <el-table-column prop="leaveType" label="请假信息编号" min-width="160px;" sortable></el-table-column>
      <el-table-column prop="late" label="是否迟到" min-width="160px;" sortable></el-table-column>
      <el-table-column prop="leaveEarly" label="是否早退" min-width="160px;" sortable></el-table-column>
      <el-table-column prop="absenteeism" label="是否旷职" min-width="160px;" sortable></el-table-column>
      <el-table-column prop="onBusiness" label="出差" min-width="160px;" sortable></el-table-column>
      <el-table-column prop="forgetToClockOut" label="忘打卡" min-width="160px;" sortable></el-table-column>
      <el-table-column prop="legwork" label="外勤" min-width="160px;" sortable></el-table-column>
      <!-- <el-table-column prop="ids" align="center" label="操作" min-width="160px;" >
        <template slot-scope="scope">
          <el-button size="small" type="success" @click="updateOneData(scope.row)" v-if="showList.but_edit">编辑</el-button>
          <el-button size="small" type="danger" @click="deleteOneData(scope.row)" v-if="showList.but_delete">删除</el-button>
        </template>
      </el-table-column> -->
    </el-table>
    <!--批量导入信息弹窗-->
    <el-dialog title="Excel表格导入信息" :visible.sync="excelVisible" :before-close="cancelExcelImport">
        <el-button type="primary" style="margin-bottom: 9px" @click="downloadTemplet" v-if="showList.attendance_record_downloadExcel">下载模板Excel</el-button>
        <upload-excel @on-selected-file='readExcel' ></upload-excel>
        <p align="center">
            <font size="5">错误信息展示</font>
        </p>
        <el-table :data="resultData" border highlight-current-row style="width: 100%;margin-top:20px;" height="300">
            <el-table-column prop="staffno" label="工号"></el-table-column>
            <el-table-column prop="cardname" label="卡号"></el-table-column>
            <el-table-column prop="name" label="姓名"></el-table-column>
            <el-table-column prop="departmentid" label="部门名称"></el-table-column>
            <el-table-column prop="time" label="时间"></el-table-column>
            <el-table-column prop="site" label="地点"></el-table-column>
            <el-table-column prop="state" label="出入状态"></el-table-column>
            <el-table-column prop="detection" label="通过检测"></el-table-column>
            <el-table-column prop="result" label="导入结果">
            </el-table-column>
        </el-table>
        <div slot="footer" class="dialog-footer" width="1px">
            <el-button @click="cancelExcelImport" v-if="showList.attendance_record_batchInsert_cancle">取 消</el-button>
            <el-button type="primary" @click="exportExcel" v-if="exportButtonVisible" v-show="showList.attendance_record_batchInsert_result">导 出 结 果</el-button>
        </div>
    </el-dialog>
  </div>
</div>
</template>

<script>
import { getList,excelImport } from '@/api/attendanceRecord'
import uploadExcel from 'components/UploadExcel/index.vue'
import { hasPermission } from '@/utils/button'

export default{
  components: { uploadExcel },
  data() {
    return {
      showList: {
        attendance_record_search:false,
        attendance_record_batch_insert:false,
        attendance_record_downloadExcel:false,
        attendance_record_batchInsert_cancle:false,
        attendance_record_batchInsert_result:false,
      },
      listLoading: true,
      list: null,
      totalCount: 10,
      pagesize: 10,
      currentPage: 0,
      selectName: {
          name: ''//搜索框内输入的数据
      },
      excelVisible: false, //excel信息导入弹窗显示状态
      resultData: [],//excel导入返回的结果
      exportButtonVisible: true,//导出按钮是否显示
      tableData: [],//excel表格数据
      tableHeader: [],//excel表头
    }
  },
  created() {
    this.fetchData();
	this.buttonControl()
  },
  methods: {
    fetchData() {
      //this.listLoading = false
      const listQuery = {
        name: this.selectName.name,
        pageNum: this.currentPage,
        pageSize: this.pagesize
      }
      //页面初期加载
      getList(listQuery).then(response => {
        //console.log(response);
        this.listLoading = false
        const data = response.data.responseData
        this.list = data.list
        for(var i=0;i<this.list.length;i++){
          var obj = this.list[i];
          //考勤日期
          if(obj.attendanceDate){
            this.list[i].attendanceDate = new Date(obj.attendanceDate).toLocaleString();
          }
          //是否出勤
          if(obj.work){
            this.list[i].iswork = "是"
          }else{
            this.list[i].iswork = "否"
          }
          //是否迟到
          if(obj.late){
            this.list[i].late = "是"
          }else{
            this.list[i].late = "否"
          }
          //是否早退
          if(obj.leaveEarly){
            this.list[i].leaveEarly = "是"
          }else{
            this.list[i].leaveEarly = "否"
          }
          //是否旷职
          if(obj.absenteeism){
            this.list[i].absenteeism = "是"
          }else{
            this.list[i].absenteeism = "否"
          }
        }
        this.totalCount = data.total
      });
    },
    handleSelectionChange(val) {//selection-change
      this.multipleSelection = val
    },
    selectListData(){//搜索
      this.currentPage = 1,
      this.listLoading = true,
      this.fetchData()
    },
    excelStart(){//导入
      this.excelVisible = true
    },
    cancelExcelImport() {//取消导入
        //this.resultData = [];
        this.excelVisible = false;
        if(this.resultData!=null){                  
            this.resultData=[]
        }   
        //this.exportButtonVisible = false;
    },
    formatJson(filterVal, jsonData) {
        return jsonData.map(v => filterVal.map(j => {
            if (j === 'timestamp') {
                return parseTime(v[j])
            } else {
                return v[j]
            }
        }))
    },
    downloadTemplet() {//下载模板
        const { export_json_to_excel } = require('vendor/Export2Excel')
        const tHeader = ['工号', '卡号', '姓名','部门名称','时间','地点','出入状态','通过检测']
        const list = []
        const filterVal = ['staffNo', 'cardname', 'name','departmentid','time','site','state','detection']
        const data = this.formatJson(filterVal, list)
        export_json_to_excel(tHeader, data, '考勤记录模板', '模板信息')
    },
    readExcel(data) {//读取Excel数据
        console.log("data");
        console.log(data);
        this.tableData = data.results
        this.tableHeader = data.header
        this.resultData = [];
                console.log("tableData");
                console.log(this.tableData);
        if (data == null) { }
        //判断是否符合规范
        //if (String(this.tableHeader[0]) === this.excelColOne && String(this.tableHeader[1]) === this.excelColTwo && String(this.tableHeader[2]) === this.excelColThree) {
        if (String(this.tableHeader[0]) === "工号"
          && String(this.tableHeader[1]) === "卡号"
          && String(this.tableHeader[2]) === "姓名"
          && String(this.tableHeader[3]) === "部门名称"
          && String(this.tableHeader[4]) === "时间"
          && String(this.tableHeader[5]) === "地点"
          && String(this.tableHeader[6]) === "出入状态"
          && String(this.tableHeader[7]) === "通过检测") {

            //开始导入
            if (this.tableData.length == 0) {
                this.$alert('请选择有效Excel', '错误', {
                    confirmButtonText: '确定',
                });
            } else {
                excelImport(this.setExcelData(this.tableData)).then(response => {
                    this.resultData = response.data.responseData;//返回导入结果
                    for(var i=0;i<this.resultData.length;i++){          
                        //时间
                        if(this.resultData[i].time){
                            this.resultData[i].time = new Date(this.resultData[i].time).toLocaleString();
                        }
                    }
                    this.tableHeader = [];
                    this.tableData = [];
                    if (this.resultData.length == 0) {
                        //this.excelVisible = false;
                        this.$message({
                            type: 'success',
                            message: '所有数据导入成功!'
                        });
                        this.fetchData();
                    } else {
                        this.$message({
                            type: 'error',
                            message: '共' + this.resultData.length + '条数据未导入成功'
                        });
                        this.exportButtonVisible = true;
                        this.fetchData();
                        //this.readExcel(null);
                    }
                })
            }
        } else {
            this.$alert('文件不符合规范', '读取错误', {
                confirmButtonText: '确定',
                callback: action => {
                    this.$message({
                        type: 'info',
                        message: `请重新选择Excel文件`
                    });
                }
            });
        }
    },
    setExcelData(data) {
        var arr = new Array();
        for (var i = 0; i < data.length; i++) {
            var excelData= {
                staffno: null,
                cardname: null,
                name: null,
                departmentid: null,
                time: null,
                site: null,
                state: null,
                detection: null
            };
            excelData.staffno = data[i].工号;
            excelData.cardname = data[i].卡号;
            excelData.name = data[i].姓名;
            excelData.departmentid = data[i].部门名称;
            excelData.time = data[i].时间;
            excelData.site = data[i].地点;
            excelData.state = data[i].出入状态;
            excelData.detection = data[i].通过检测;
            arr.push(excelData);
        }
        return arr;
    },
    exportExcel() {//导出excel
        if (this.resultData.length == 0) {
            this.$alert('暂无错误信息', '提示', {
                confirmButtonText: '确定',
                type: 'info',
            });
        } else {
            require.ensure([], () => {
                const { export_json_to_excel } = require('vendor/Export2Excel')
                const tHeader = ['年级名称', '所属院校', '年级主任', '导入结果']
                const filterVal = ['gradeName', 'schoolName', 'gradeHeadmasterName', 'result']
                const list = this.resultData
                const data = this.formatJson(filterVal, list)
                var date = new Date();
                var strYear = date.getFullYear();//年
                var strMonth = date.getMonth() + 1;//月
                var strDate = date.getDate();//日
                var strHour = date.getHours();//时
                var strMin = date.getMinutes();//分
                export_json_to_excel(tHeader, data, '导出结果' + strYear + strMonth + strDate + strHour + strMin,'导出结果')
            })
        }

    },
    buttonControl(){
        this.showList.attendance_record_search = hasPermission("attendance_record_search")
        this.showList.attendance_record_batch_insert = hasPermission("attendance_record_batch_insert")
        this.showList.attendance_record_downloadExcel = hasPermission("attendance_record_downloadExcel")
        this.showList.attendance_record_batchInsert_cancle = hasPermission("attendance_record_batchInsert_cancle")
        this.showList.attendance_record_batchInsert_result = hasPermission("attendance_record_batchInsert_result")
	}

  }
}
</script>

<style scoped>
</style>
