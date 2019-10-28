<template>
  <div class="drug-consumption">
    <!-- 药品消耗统计 -->
    <div>
      <label style="display: inline-block;margin-left:10px"
             class="control-label">
        科室</label>
      <Select v-model="deptId"
              style="width:176px;margin-left:10px"
              filterable
              clearable>
        <Option v-for="(item,index) in deptList"
                :value="item.deptId"
                :key="index">{{ item.deptName }}</Option>
      </Select>
      <label style="display: inline-block;margin-left:10px"
             class="control-label">
        入院时间</label>
      <DatePicker v-model='timeId'
                  format='yyyy-MM-dd'
                  type='datetimerange'
                  placement='bottom-start'
                  placeholder='请选择日期'
                  style='width: 200px'></DatePicker>
      <Button type="primary"
              style="margin-left:10px"
              @click="getDataSearch">
        <i class="iconfont iconchaxun"></i>&nbsp;查询
      </Button>
      <Button type="primary"
              style="margin-left:10px"
              @click.native="print">
        <i class="iconfont icondayin"
           style="font-size:12px;margin-top:2px;margin-right:2px"></i>
        打印</Button>
    </div>
    <!-- 表格部分 -->
    <div style="margin-top:10px">
      <Table :loading="orderLoading"
             :height="tableHeight"
             stripe
             border
             ref="table"
             highlight-row
             :columns="getTableColumns"
             :data="getTableData"></Table>
      <div style="margin-top:5px;float:right">
        <Page @Page="changPage"
              :tabpage="tabPages"
              @pageNum="changPageNum"></Page>
      </div>
    </div>

  </div>
</template>
<script>
import util from '../../../../../libs/util'
import Page from '../../../../components/page1';
import axios from 'axios';
export default {
  name: 'drug-consumption',
  components: { Page },
  data () {
    return {
      deptId: '',
      deptList: [],
      tableHeight: 70,
      orderLoading: false,
      getTableColumns: [
        {
          title: '科室',
          width: 120,
          key: 'execDeptName'
        },
        {
          title: '项目名称',
          key: 'itemName'
        },
        {
          title: '项目规格',
          width: 150,
          key: 'itemSpec'
        },
        {
          title: '数量',
          width: 60,
          align: 'right',
          key: 'amount'
        },
        {
          title: '单位',
          width: 60,
          key: 'unit'
        },
        {
          title: '单价',
          width: 80,
          align: 'right',
          key: 'price',
          render: (h, params) => {
            return params.row.price = (!util.isEmpty(params.row.price) ? (params.row.price - 0).toFixed(2) : 0.00)
          }
        },
        {
          title: '数量',
          width: 60,
          key: 'amount'
        },
        {
          title: '总金额',
          width: 80,
          align: 'right',
          key: 'costs',
          render: (h, params) => {
            return params.row.price = (!util.isEmpty(params.row.price) ? (params.row.price - 0).toFixed(2) : 0.00)
          }
        },
      ],
      getTableData: [],
      page: 1,
      tabPages: 1,
      pageSize: 15,
      timeId: [new Date().format('yyyy-MM-dd 00:00:00'), new Date().format('yyyy-MM-dd 23:59:59')],
    }
  },
  mounted () {
    this.tableHeight = window.innerHeight - this.$refs.table.$el.offsetTop - 250
    this.getDeptList()
  },
  methods: {
    //获取科室
    getDeptList () {
      let nowData = {
        'deptTypeId': 2,
        "hospitalId": this.$store.state.userInfoObj.hospitalId,
        "userId": this.$store.state.userInfoObj.userId,
      }
      this.$store.dispatch("getUserSYAndZSDept", nowData).then(res => {
        if (res.data.code != 200) {
          util.showMsg(this, res.data)
        } else {
          this.deptList = res.data.data.list
        }
      })
    },
    //切换页数
    changPage (Page) {
      this.page = Page
      this.getData()
    },
    //切换条数
    changPageNum (val) {
      this.pageSize = val
      this.getDataSearch()
    },
    //查询接口
    getDataSearch () {
      this.page = 1
      this.tabPages = 1
      this.getData()
    },
    getData () {
      let params = {
        hospitalId: this.$store.state.userInfoObj.hospitalId,
        page: this.page,
        size: this.pageSize,
        deptId: this.deptId,
        startDate: util.isEmpty(this.timeId[0]) ? '' : this.timeId[0].format('yyyy-MM-dd 00:00:00'),
        endDate: util.isEmpty(this.timeId[1]) ? '' : this.timeId[1].format('yyyy-MM-dd 23:59:59'),
      }
      this.orderLoading = true
      this.$store.dispatch("findDrugConsumeByDept", params).then(res => {
        this.orderLoading = false
        if (!util.isEmpty(res.data.message)) {
          util.showMsg(this, { diy: res.data.message });
        } else {
          this.getTableData = res.data.Details
          if (res.data.Master.length > 0) {
            this.tabPages = Math.ceil((res.data.Master[0].total) / this.pageSize)
          }
        }
      })
    },
    print () {
      let params = 'PrintClient://科室药品消耗统计(医技).grf,' + util.BaseURL + 'findDrugConsumeByDept?hospitalId='
        + this.$store.state.userInfoObj.hospitalId + '&deptId=' + this.deptId + '&startDate=' + util.isEmpty(this.timeId[0]) ? '' : this.timeId[0].format('yyyy-MM-dd 00:00:00') + '&endDate=' + util.isEmpty(this.timeId[1]) ? '' : this.timeId[1].format('yyyy-MM-dd 23:59:59') + ',1'
      axios.get('http://127.0.0.1:5678?' + params).then(res => {
        return
      })
    }
  },
}
</script>
<style>
.drug-consumption .ivu-table-wrapper {
  height: 100% !important;
}
</style>
