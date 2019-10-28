<template>
  <div class="outHospital-costsearch">
    <!-- 出院病人费用查询 -->
    <div>
      <label style="display: inline-block;margin-left:10px"
             class="control-label">
        入院时间</label>
      <DatePicker v-model='timeId'
                  format='yyyy-MM-dd'
                  type='datetimerange'
                  placement='bottom-start'
                  placeholder='请选择日期'
                  style='width: 200px'></DatePicker>
      <Input v-model="inpatNumber"
             placeholder="病案号或住院号"
             @on-enter='getDataSearch'
             style="width: 200px" />
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
  name: 'outHospital-costsearch',
  components: { Page },
  data () {
    return {
      inpatNumber: '',
      tableHeight: 70,
      orderLoading: false,
      getTableColumns: [
        {
          title: '病案号',
          width: 130,
          key: 'medicalNum'
        },
        {
          title: '住院号',
          width: 130,
          key: 'inpatNum'
        },
        {
          title: '姓名',
          width: 80,
          key: 'patName'
        },
        {
          title: '年龄',
          width: 80,
          key: 'age'
        },
        {
          title: '性别',
          width: 50,
          key: 'sex'
        },
        {
          title: '入院日期',
          width: 150,
          align: 'center',
          key: 'inDatetime'
        },
        {
          title: '出院日期',
          width: 150,
          align: 'center',
          key: 'outDatetime'
        },
        {
          title: '类别',
          width: 80,
          key: 'itemClassCode'
        },
        {
          title: '状态',
          width: 80,
          key: 'status'
        },
        {
          title: '记账人',
          width: 130,
          key: 'billPersonName'
        },
        {
          title: '记账时间',
          width: 150,
          align: 'center',
          key: 'billTime'
        },
        {
          title: '项目名称',
          width: 230,
          key: 'itemName'
        },
        {
          title: '项目规格',
          width: 130,
          key: 'itemSpac'
        },
        {
          title: '数量',
          width: 90,
          key: 'amount'
        },
        {
          title: '单位',
          width: 90,
          key: 'unit'
        },
        {
          title: '单价',
          width: 120,
          align: 'right',
          key: 'price',
          render: (h, params) => {
            return params.row.price = (!util.isEmpty(params.row.price) ? (params.row.price - 0).toFixed(2) : 0.00)
          }
        },
        {
          title: '金额',
          width: 120,
          align: 'right',
          key: 'costs',
          render: (h, params) => {
            return params.row.costs = (!util.isEmpty(params.row.costs) ? (params.row.costs - 0).toFixed(2) : 0.00)
          }
        },
        {
          title: '执行人',
          width: 120,
          key: 'execPersonName'
        },
        {
          title: '执行科室',
          width: 120,
          key: 'execDeptName'
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
  },
  methods: {
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
      console.log(this.timeId, '看看链接哦i')
      let params = {
        hospitalId: this.$store.state.userInfoObj.hospitalId,
        page: this.page,
        size: this.pageSize,
        param: this.inpatNumber,
        startDate: util.isEmpty(this.timeId[0]) ? '' : this.timeId[0].format('yyyy-MM-dd 00:00:00'),
        endDate: util.isEmpty(this.timeId[1]) ? '' : this.timeId[1].format('yyyy-MM-dd 23:59:59'),
      }
      this.orderLoading = true
      this.$store.dispatch("findInpMaster", params).then(res => {
        this.orderLoading = false
        if (!util.isEmpty(res.data.message)) {
          util.showMsg(this, { diy: res.data.message });
        } else {
          console.log(res, '看看这个里面的值')
          this.getTableData = res.data.Details
          if (res.data.Master.length > 0) {
            this.tabPages = Math.ceil((res.data.Master[0].total) / this.pageSize)
          }

        }
      })
    },
    print () {
      let params = 'PrintClient://出院病人费用查询.grf,' + util.BaseURL + 'findInpMaster?hospitalId='
        + this.$store.state.userInfoObj.hospitalId + '&param=' + this.inpatNumber + '&startDate=' + util.isEmpty(this.timeId[0]) ? '' : this.timeId[0].format('yyyy-MM-dd 00:00:00') + '&endDate=' + util.isEmpty(this.timeId[1]) ? '' : this.timeId[1].format('yyyy-MM-dd 23:59:59') + ',1'
      axios.get('http://127.0.0.1:5678?' + params).then(res => {
        return
      })
    }
  },
}
</script>
<style>
.outHospital-costsearch .ivu-table-wrapper {
  height: 100% !important;
}
</style>
