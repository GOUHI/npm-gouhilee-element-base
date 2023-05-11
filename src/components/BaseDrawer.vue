<template>
  <el-drawer
    v-bind="$attrs"
    class="drawer"
    :before-close="handleClose"
    append-to-body
    :show-close="false"
    :close-on-click-modal="false"
  >
    <template #header>
      <slot name="header"/>
    </template>
    <div class="drawer-box">
      <div class="drawer-close" @click="handleClose">
        <el-icon><Close /></el-icon>
      </div>
      <slot name="default"/>
    </div>
  </el-drawer>
</template>

<script setup lang="ts">
const emits = defineEmits(['close'])
const handleClose = ()=>  {  
  // 通知父组件关闭，如果是true就代表清空和刷新数据
  emits('close', true)
}
</script>
<script lang="ts">
export default {
  name: 'BaseDrawer'
}
</script>
<style lang='scss'>
.drawer {
  overflow: visible !important;
}

.drawer-close {
  width: 40px;
  height: 60px;
  position: absolute;
  left: -40px;
  top: 50%;
  transform: translateY(-50%);
  background-color: #f5f5f5;
  cursor: pointer;
  padding: 15px 5px;
  border-bottom-left-radius: 8px;
  border-top-left-radius: 8px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 24px;
}
</style>
