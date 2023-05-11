<template>
  <el-dialog
    v-bind="$attrs"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    :draggable="true"
    :before-close="handleClose"
  >
    <template #header="{ row }">
      <slot name="header" :data="row"></slot>
    </template>
    <template #default="{ row }">
      <slot name="default" :data="row"></slot>
    </template>
  </el-dialog>
</template>
<script setup lang="ts">
const emits = defineEmits(['close'])
const handleClose = () => {
  emits('close')
}
</script>
<script lang="ts">
export default {
  name:'BaseDialog'
}
</script>