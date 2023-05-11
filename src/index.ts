// 引入封装好的组件
import BaseDialog from "./components/BaseDialog.vue";
import BaseDrawer from "./components/BaseDrawer.vue"
import BaseSearch from "./components/BaseSearch.vue"
import BaseTable from "./components/BaseTable.vue"
import "./assets/css/index.scss"

let arr = [BaseDialog, BaseDrawer, BaseSearch, BaseTable]; // 如果有多个其它组件,都可以写到这个数组里

// 批量组件注册
const install = function (Vue: any) {
  arr.forEach((com) => {
    Vue.component(com.name, com);
  });
};

export default install;