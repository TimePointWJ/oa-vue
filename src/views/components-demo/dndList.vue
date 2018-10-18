<template>
  <div class="components-container">
    <div class="editor-container">
      <dnd-list :list1="list1" :list2="list2" list1Title="" list2Title="请选择员工"></dnd-list>
    </div>
  </div>
</template>

<script>
import DndList from '@/components/DndList'
import { fetchList } from '@/api/article'

export default {
  name: 'dndList-demo',
  components: { DndList },
  data() {
    return {
      list1: [],
      list2: [{id:1,name:"张三",departmentName:"一部",positionName:"普通员工"},{id:2,name:"周全",departmentName:"二部",positionName:"部门经理"}]
    }
  },
  created() {
    this.getData()
  },
  methods: {
    getData() {
      console.log(this.list1);
      // this.listLoading = true
      // fetchList().then(response => {
      //   this.list1 = response.data.items.splice(0, 5)
      //   this.list2 = response.data.items
      // })
    }
  }
}
</script>


