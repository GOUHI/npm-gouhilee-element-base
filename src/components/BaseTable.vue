<style lang="scss" scoped>
.table_header {
  padding: 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 40px;
  border-bottom: 1px solid #eee;

  .table_header_option {
    display: flex;
    align-items: center;

    ::v-deep .el-link {
      font-size: 12px;
    }

    .setting {
      padding: 20px;
    }
  }
}

.table_foot_box {
  height: 46px;
  padding: 10px;
  border-radius: 4px;
}
</style>
<template>
  <div class="table_header">
    <div>
      <slot name="btn"></slot>
    </div>
    <div>
      <div class="table_header_option">
        <el-link :underline="false" icon="download" class="m-r-10" v-if="isExport">导出</el-link>
        <el-link :underline="false" icon="refreshLeft" class="m-r-10" @click="refresh">刷新</el-link>
        <el-popover placement="bottom" :width="300" trigger="click">
          <div class="setting">
            <div>
              <el-tooltip class="item" effect="dark" content="可控制显示的表格字段，刷新后保持选择项。" placement="top-start">
                <template #content>可控制显示的表格字段，刷新后保持选择项。<br>如果希望还原配置信息请清空浏览器缓存</template>
                <el-icon :size="16">
                  <QuestionFilled />
                </el-icon>
              </el-tooltip>
              <el-checkbox v-model="selectAll" :indeterminate="isIndeterminate" @change="handleCheckAllChange" label="全选"
                size="large" class="m-l-20" />

              <el-radio-group v-model="customParams.tableSize" @change="setColumn" class="m-l-20">
                <el-radio label="default">表格大</el-radio>
                <el-radio label="small">表格小</el-radio>
              </el-radio-group>
            </div>
            <div>
              <el-checkbox-group v-model="column.checkedColumn" @change="handleCheckedColumnGroupChange">
                <template v-for="(item, index) in tableColumn">
                  <div v-if="!item.required" :key="index" class="setting_table_column_item">
                    <el-checkbox :label="item.prop" @change="handleCheckedColumnChange(index)">{{
                      item.label }}</el-checkbox>
                  </div>
                </template>
              </el-checkbox-group>
            </div>
          </div>
          <template #reference>
            <el-link :underline="false" icon="setting">设置</el-link>
          </template>
        </el-popover>
      </div>
    </div>
  </div>
  <el-table :data="tableData" v-bind="$attrs" height="100%" :highlight-current-row="true" v-loading="loading"
    @selection-change="selectionChange" @sort-change="sortChange" :size="customParams.tableSize">
    <el-table-column v-if="isExpand" type="expand">
      <template #default="scope: any">
        <slot name="expand" :row=" scope.row "></slot>
      </template>
    </el-table-column>
    <el-table-column v-if=" isCheck " type="selection" width="55" />
    <template v-for=" item  in  customParams.tableColumn ">
      <!-- 需要单独处理的字段 -->
      <el-table-column v-if=" item.columnType && item.display " :key=" item.prop " :prop=" item.prop " :label=" item.label "
        :min-width=" item.minWidth " :width=" item.width " :show-overflow-tooltip=" !!item.showOverflowTooltip "
        :fixed=" item.prop === 'option' ? 'right' : false " :class-name=" item.prop === 'option' ? 'operation' : '' "
        :sortable=" item.sortable ? item.sortable : false ">
        <template #header v-if=" item.columnSlotHeader ">
          <slot :name=" `${item.columnSlot}Header` " :data=" item " />
        </template>
        <template #default=" scope: any ">
          <slot :name=" item.columnSlot " :row=" scope.row " :index=" 1 " />
        </template>
      </el-table-column>
      <!-- 不需要处理的数据 -->
      <el-table-column v-if=" !item.columnType && item.display " :key=" item.prop " :prop=" item.prop " :label=" item.label "
        :min-width=" item.minWidth " :width=" item.width " :sortable=" item.sortable ? item.sortable : false ">
        <template #default=" scope: any ">
          <span v-if=" item.date && getProLevel(scope.row, item) ">{{ dayjs(getProLevel(scope.row ,
            item)).format(item.date)}}</span>
          <span v-else>{{ getProLevel(scope.row , item) || '-'}}</span>
        </template>
      </el-table-column>
    </template>
  </el-table>
  <div class="table_foot_box">
    <el-pagination v-if=" tableData && tableData.length > 0 " background small
      :page-size=" page.pageSize && page.pageSize >= 20 ? page.pageSize : $pageSize " :page-sizes=" $pageSizeOptions "
      layout="total, sizes, prev, pager, next, jumper" :total=" page.total " :current-page=" page.pageNum "
      @size-change=" handleSizeChange " @current-change=" handleCurrentChange " />
  </div>
</template>

<script setup lang="ts">
import { ElMessage } from 'element-plus'
import _get from 'lodash/get'
import dayjs from 'dayjs'
import { getCurrentInstance, ref, reactive, onMounted, type PropType } from 'vue'
const emits = defineEmits(['selectionChange', 'sortChange', 'handleCurrentChange', 'handleSizeChange', 'refresh'])
const current = getCurrentInstance()

const $pageSize = current?.appContext.config.globalProperties.$pageSize
const $pageSizeOptions = current?.appContext.config.globalProperties.$pageSizeOptions

const props = defineProps({
  tableData: Array,
  tableColumn: {
    type: Array as PropType<TableColumn[]>,
    required: true
  },
  tableName: {
    type: String,
    required: true
  },
  debug: Boolean,
  isCheck: Boolean,
  isExpand: Boolean,
  isExport: {
    type: Boolean,
    default: false
  },
  page: {
    type: Object as PropType<Page>,
    required: true
  },
  loading: Boolean
})

const selectAll = ref(false)
const isIndeterminate = ref(true)
const column: Column = reactive({
  checkedColumn: [],
  allColumn: []
})
let customParams: CustomParams = reactive({
  tableColumn: props.tableColumn || [],
  tableSize: 'default'
})

onMounted(() => {
  if (!props.tableName) {
    ElMessage.error('调用子组件请填写表格名称')
  }

  if (props.debug) {
    customParams.tableColumn = props.tableColumn
    customParams.tableSize = 'default'
  } else {
    const sessionStorageCustomTable = sessionStorage.getItem(props.tableName)
    if (sessionStorageCustomTable) {
      customParams = reactive(JSON.parse(sessionStorageCustomTable))
    } else {
      setColumn()
    }
  }

  // 传入外部的数据并且存入
  for (const item of customParams.tableColumn) {
    if (!item.required && item.prop) {
      column.allColumn.push(item.prop)
      if (item.display !== false) {
        column.checkedColumn.push(item.prop)
      }
    }
  }
  // 判断初始化全选多选框的状态
  selectAll.value = column.checkedColumn.length === column.allColumn.length
  isIndeterminate.value = column.checkedColumn.length > 0 && column.checkedColumn.length < column.allColumn.length
})

/**
 * 设置可显示表格列
 */
const handleCheckAllChange = (val: boolean) => {
  column.checkedColumn = val ? column.allColumn : []
  isIndeterminate.value = false
  customParams.tableColumn.forEach((i: TableColumn) =>
    i.required !== true ? (i.display = val) : true
  )
  setColumn()
}
const handleCheckedColumnGroupChange = (value: string[]) => {
  const checkedCount = value.length
  selectAll.value = checkedCount === column.allColumn.length
  isIndeterminate.value = checkedCount > 0 && checkedCount < column.allColumn.length
}
const handleCheckedColumnChange = (index: number) => {
  customParams.tableColumn[index].display = !customParams.tableColumn[index].display
  setColumn()
}

// 通用改值存会话中
const setColumn = () => {
  sessionStorage.setItem(props.tableName, JSON.stringify(customParams))
}

// 获取到prop下级元素
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const getProLevel = (row: any, item: TableColumn) => {
  if (item.prop.indexOf('.') > -1) {
    return _get(row, item.prop)
  } else {
    return row[item.prop]
  }
}

const selectionChange = (v: number[]) => {
  emits('selectionChange', v)
}

const sortChange = (column: { prop: string, order: string }) => {
  emits('sortChange', column)
}

// 分页操作
const handleSizeChange = (v: number) => {
  console.log('handleSizeChange');
  emits('handleSizeChange', v)
}
const handleCurrentChange = (v: number) => {
  console.log('handleCurrentChange');
  emits('handleCurrentChange', v)
}

const refresh = () => {
  emits('refresh')
}
</script>
<script lang="ts">
export default {
  name: "BaseTable"
}
</script>

<style scoped></style>
