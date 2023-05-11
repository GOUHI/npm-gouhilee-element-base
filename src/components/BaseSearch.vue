<style lang="scss" scoped>
.search_box{
  border-bottom: 1px solid#eee;
  padding: 20px 20px 0 20px;
  display: flex;
  // align-items: center;
  justify-content: space-between;
  .search_left{
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    .search_btn{
      display: flex;
      margin-bottom: 20px;
      .search_screen{
        display: flex;
        align-items: center;
        margin-right: 20px;
        color:#409EFF;
        cursor: pointer;
      }
    }
  }
  .search_right{
    display: flex;
    align-items: center;
    margin-bottom: 20px;
  }
}
</style>
<template>
  <div class="search_box">
    <div class="search_left">
      <slot name="searchFirst" />
      <slot v-if="show" name="searchItem" />
      <div class="search_btn">
        <div class="search_screen" @click="handleShow" v-if="$slots.searchItem">
          {{ show ? '收筛选' : '展筛选' }}
          <el-icon>
            <ArrowUp v-if="show"/>
            <ArrowDown v-else />
          </el-icon>
        </div>
        <el-button type="primary" @click="onSearch" :loading="loading" :loading-icon="Eleme">查询</el-button>
        <el-button type="warning" @click="onReset" v-if="showReset">重置</el-button>
      </div>
    </div>
    <div class="search_right">
      <slot name="searchRight"></slot>
    </div>
  </div>
</template>
<script setup lang="ts">
import { Eleme } from '@element-plus/icons-vue'
import { ref } from 'vue'
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const props = defineProps({
  loading: Boolean,
  showReset:{
    type: Boolean,
    default: false
  }
})

const show = ref(false)
const handleShow = () => {
  show.value = !show.value
}

const emits = defineEmits(['search', 'reset'])
const onSearch = () => {
  emits('search')
}
const onReset = () => {
  emits('reset')
}
</script>
<script lang="ts">
export default {
  name: "BaseSearch"
}
</script>