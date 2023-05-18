/// <reference types="vite/client" />

declare interface TableColumn {
  prop: string
  label: string
  display: boolean
  minWidth?: number
  width?: number
  required?: boolean
  columnType?: boolean
  columnSlot?: string
  showOverflowTooltip?: boolean
  columnSlotHeader?: string
  date?: string
  sortable?: boolean| string
}

declare interface Column {
  checkedColumn: string[]
  allColumn: string[]
}

declare interface CustomParams {
  tableColumn: TableColumn[]
  tableSize: string
}

declare interface Page {
  pageSize: number
  pageNum: number
  total?: number
}