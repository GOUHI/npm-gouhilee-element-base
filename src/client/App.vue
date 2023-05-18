<style lang="scss" scoped>
.tips{
  background-color: #fff;
  font-size: 12px;
  >div{
    width: 865px;
    padding: 8px;
    border-radius: 4px;
    background-color: #F4F4F5;
    color: #919399;
    display: flex;
    align-items: center;
    >i{
      margin-right: 5px;
    }
  }
}
</style>
<template>
  <el-config-provider :locale="locale">
    <div class="body_main">
      <BaseSearch :loading="loading" @search="search">
        <template #searchFirst>
          <div class="search_item">
            <el-input v-model="searchForm.keywords" placeholder="请输入站点名称" v-on:keyup.enter="search" @clear="search" clearable />
          </div>
        </template>
      </BaseSearch>
      <BaseTable
        :tableData="tableData.list"
        :tableColumn="tableColumn"
        tableName="operateListTable"
        stripe
        :page="page"
        @handleSizeChange="handleSizeChange"
        @handleCurrentChange="handleCurrentChange"
        @refresh="getOperateList"
        :loading="loading"
        :debug="debug"
        @sortChange="sortChange"
        >
          <template #btn>
            <div class="tips">
              <div>
                <i class="el-icon-warning-outline" /><span>当前数据为辅助运营知晓站点使用情况。统计信息为同步数据，不包含逆向操作。如（新增商机后删除。这里会继续记录新增为一条，请熟知运营统计规则）</span>
              </div>
            </div>
          </template>
          <template #staffCountHeader>
            <el-tooltip class="item" effect="dark" content="去除离职，停用的员工总数" placement="top-start">
              <span>员工总数</span>
            </el-tooltip>
          </template>
          <template #staffCount="scope: any">
            <el-tag>{{ scope.row.staffCount }}</el-tag>
          </template>
          <template #operationCountHeader>
            <el-tooltip class="item" effect="dark" content="当前7日内，通过操作日志获取出使用人数(去重)" placement="top-start">
              <span>近7天操作人数</span>
            </el-tooltip>
          </template>
          <template #operationCount="scope: any">
            <el-tag>{{ scope.row.operationCount }}</el-tag>
          </template>
          <template #businessCountHeader>
            <el-tooltip class="item" effect="dark" content="累计新增商机，后续删除的不计算" placement="top-start">
              <span>新增商机</span>
            </el-tooltip>
          </template>
          <template #businessCount="scope: any">
            <el-tag>{{ scope.row.businessCount }}</el-tag>
          </template>
          <template #followCountHeader>
            <el-tooltip class="item" effect="dark" content="客户跟进总数，包含打卡的跟进" placement="top-start">
              <span>客户跟进数</span>
            </el-tooltip>
          </template>
          <template #followCount="scope: any">
            <el-tag>{{ scope.row.followCount }}</el-tag>
          </template>
          <template #publicBusinessCount="scope: any">
            <el-tag>{{ scope.row.publicBusinessCount }}</el-tag>
          </template>
          <template #contractFormCount="scope: any">
            <el-tag>{{ scope.row.contractFormCount }}</el-tag>
          </template>
          <template #visitClockCount="scope: any">
            <el-tag>{{ scope.row.visitClockCount }}</el-tag>
          </template>
          <template #contractCount="scope: any">
            <el-tag>{{ scope.row.contractCount }}</el-tag>
          </template>
          <template #invoiceCount="scope: any">
            <el-tag>{{ scope.row.invoiceCount }}</el-tag>
          </template>
          <template #approvalHeader>
            <el-tooltip class="item" effect="dark" content="当审批设置有一个开启都认为是开启状态" placement="top-start">
              <span>审批设置</span>
            </el-tooltip>
          </template>
          <template #approval="scope: any">
            <el-tag>{{ scope.row.approval }}</el-tag>
          </template>
          <template #operate="scope: any">
            <el-icon style="cursor: pointer;"><Histogram /></el-icon>
          </template>
      </BaseTable>
    </div>
  </el-config-provider>
</template>
<script setup lang="ts">
import { reactive, ref, onMounted } from 'vue';
import BaseSearch from '@/components/BaseSearch.vue'
import BaseTable from '@/components/BaseTable.vue'
import zhCn from 'element-plus/lib/locale/lang/zh-cn'
const locale = zhCn

const searchForm = reactive({
  keywords: '',
  desc: '',
  order: ''
})
const loading = ref(false)
const search = ()=> {
  page.pageNum = 1
  getOperateList()
}

// 获取全局参数
const tableColumn: TableColumn[] = reactive([
  { prop: 'siteId', label: 'id', display: true, width: 80, required: true },
  { prop: 'siteName', label: '站点名称', display: true },
  { prop: 'staffCount', label: '员工总数', display: true, columnType: true, columnSlot:'staffCount', columnSlotHeader: 'staffCount', sortable: 'custom' },
  { prop: 'operationCount', label: '近7天操作人数', display: true, columnType: true, columnSlot:'operationCount', columnSlotHeader: 'operationCount' },
  { prop: 'businessCount', label: '新增商机', display: true, columnType: true, columnSlot:'businessCount', columnSlotHeader: 'businessCount' },
  { prop: 'followCount', label: '客户跟进数', display: true, columnType: true, columnSlot:'followCount', columnSlotHeader: 'followCount'},
  { prop: 'publicBusinessCount', label: '掉公海客户数', display: true, columnType: true, columnSlot:'publicBusinessCount' },
  { prop: 'visitClockCount', label: '打卡次数', display: true, columnType: true, columnSlot:'visitClockCount' },
  { prop: 'contractCount', label: '新增合同', display: true, columnType: true, columnSlot:'contractCount' },
  { prop: 'invoiceCount', label: '新增发票数', display: true, columnType: true, columnSlot:'invoiceCount' },
  { prop: 'operate', label: '运营数据', display: true, columnType: true, columnSlot: 'operate' }
])
const debug = true

const tableData = reactive({
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  list:<any>[
    
  ]
})
const page:Page = reactive({
  pageSize: 20,
  pageNum: 1,
  total: 0
})

const getOperateList = async() => {
  loading.value = true
  
  try{
      const res = {
        code: 200,
        data: {
          items:[
            {
              approval: 1,
              businessCount: 81,
              commodityCount: 792,
              contractCount: 99,
              contractFormCount: 18,
              count: 15,
              customerRules: 1,
              followCount: 116,
              invoiceCount: 45,
              operationCount: 6,
              publicBusinessCount: 103,
              siteId: 1,
              siteName: "测试环境",
              staffCount: 26,
              visitClockCount: 47
            }
          ],
          total: 1
        },
      }
      tableData.list = res.data.items
      page.total = res.data.total
      loading.value = false
  }catch(e){
    loading.value = false
    console.log('getOperateList',e);
  }
  
}

const handleSizeChange = (v: number)=>{
  page.pageSize = v
  getOperateList() 
}
const handleCurrentChange = (v: number)=>{
  page.pageNum = v
  getOperateList()
}

// 获取当前选择的排序信息
const sortChange = (column: {prop: string, order: string}) => {
  console.log(column);
}

onMounted(()=>{
  tableColumn.push({
    prop: 'contractFormCount', label: '创建签约单', display: true, columnType: true, columnSlot: 'contractFormCount'
  })
  
  getOperateList()
})
</script>