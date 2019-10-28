<template>
  <div class="outpatient-Workload">
    <!-- 门诊操作员工作量统计 -->
    <div>
      <label style="display: inline-block;margin-left:10px"
             class="control-label">
        操作员</label>
      <Select v-model="operPersonId"
              style="width:176px;margin-left:10px"
              filterable
              clearable>
        <Option v-for="(item,index) in deptList"
                :value="item.userId"
                :key="index">{{ item.userName }}</Option>
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
  name: 'outpatient-Workload',
  components: { Page },
  data () {
    return {
      operPersonId: '',
      deptList: [],
      tableHeight: 70,
      orderLoading: false,
      getTableColumns: [
        {
          title: '操作人姓名',
          key: 'operName'
        },
        {
          title: '挂号数量',
          align: 'right',
          key: 'reqNum'
        },
        {
          title: '退号数量',
          align: 'right',
          key: 'returnNum'
        },
        {
          title: '挂号费',
          align: 'center',
          key: 'registFee',
          render: (h, params) => {
            return params.row.reqFee = (!util.isEmpty(params.row.reqFee) ? (params.row.reqFee - 0).toFixed(2) : 0.00)
          }
        },
        {
          title: '诊疗费',
          align: 'center',
          key: 'clinicFee',
          render: (h, params) => {
            return params.row.reqFee = (!util.isEmpty(params.row.reqFee) ? (params.row.reqFee - 0).toFixed(2) : 0.00)
          }
        },
        {
          title: '其他费',
          align: 'center',
          key: 'otherFee',
          render: (h, params) => {
            return params.row.reqFee = (!util.isEmpty(params.row.reqFee) ? (params.row.reqFee - 0).toFixed(2) : 0.00)
          }
        },
        {
          title: '挂号金额',
          align: 'center',
          key: 'reqFee',
          render: (h, params) => {
            return params.row.reqFee = (!util.isEmpty(params.row.reqFee) ? (params.row.reqFee - 0).toFixed(2) : 0.00)
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
    //获取护士
    getDeptList () {
      let nowData = {
        "hospitalId": this.$store.state.userInfoObj.hospitalId,
        'workType': 2,
      }
      this.$store.dispatch("findUserByWorkTypes", nowData).then(res => {
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
        operPersonId: this.operPersonId,
        startDate: util.isEmpty(this.timeId[0]) ? '' : this.timeId[0].format('yyyy-MM-dd 00:00:00'),
        endDate: util.isEmpty(this.timeId[1]) ? '' : this.timeId[1].format('yyyy-MM-dd 23:59:59'),
      }
      this.orderLoading = true
      this.$store.dispatch("findWorkloadStatistics", params).then(res => {
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
      let params = 'PrintClient://门诊操作员工作量统计.grf,' + util.BaseURL + 'findWorkloadStatistics?hospitalId='
        + this.$store.state.userInfoObj.hospitalId + '&operPersonId=' + this.operPersonId + '&startDate=' + util.isEmpty(this.timeId[0]) ? '' : this.timeId[0].format('yyyy-MM-dd 00:00:00') + '&endDate=' + util.isEmpty(this.timeId[1]) ? '' : this.timeId[1].format('yyyy-MM-dd 23:59:59') + ',1'
      axios.get('http://127.0.0.1:5678?' + params).then(res => {
        return
      })
    }
  },
}
</script>
<style>
.outpatient-Workload .ivu-table-wrapper {
  height: 100% !important;
}
</style>
