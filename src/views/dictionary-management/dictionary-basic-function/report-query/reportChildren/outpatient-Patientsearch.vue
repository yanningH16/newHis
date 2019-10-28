<template>
  <div class="outpatient-Patientsearch">
    <!-- 门诊病人查询 -->
    <div>
      <Input v-model="inpatNumber"
             @on-enter='getDataSearch'
             placeholder="卡号/健康档案编号/姓名"
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
  name: 'outpatient-Patientsearch',
  components: { Page },
  data () {
    return {
      inpatNumber: '',
      tableHeight: 70,
      orderLoading: false,
      getTableColumns: [
        {
          title: '健康档案号',
          width: 120,
          align: 'center',
          key: 'healthNum'
        },
        {
          title: '卡号',
          width: 100,
          align: 'right',
          key: 'cardNum'
        },
        {
          title: '门诊号',
          width: 130,
          key: 'outpNum'
        },
        {
          title: '姓名',
          width: 80,
          key: 'patName'
        },
        {
          title: '性别',
          width: 50,
          key: 'sex'
        },
        {
          title: '年龄',
          width: 50,
          key: 'age'
        },
        {
          title: '联系电话',
          width: 120,
          align: 'right',
          key: 'phoneNum'
        },
        {
          title: '现住址',
          width: 300,
          key: 'addressDetail'
        },
        {
          title: '患者类型',
          width: 80,
          key: 'patTypeName'
        },
        {
          title: '就诊时间',
          width: 150,
          key: 'queueDate'
        },
        {
          title: '就诊科室',
          width: 120,
          key: 'queueDeptName'
        },
        {
          title: '就诊医生',
          width: 120,
          key: 'queueDoctorName'
        },
        {
          title: '专科专家号',
          width: 230,
          key: 'registLabel'
        },
        {
          title: '诊疗费',
          width: 80,
          align: 'right',
          key: 'clinicFee',
          render: (h, params) => {
            return params.row.clinicFee = (!util.isEmpty(params.row.clinicFee) ? (params.row.clinicFee - 0).toFixed(2) : 0.00)
          }
        },
        {
          title: '其它费',
          width: 80,
          align: 'right',
          key: 'otherFee',
          render: (h, params) => {
            return params.row.otherFee = (!util.isEmpty(params.row.otherFee) ? (params.row.otherFee - 0).toFixed(2) : 0.00)
          }
        },
        {
          title: '挂号费',
          width: 80,
          align: 'right',
          key: 'registFee',
          render: (h, params) => {
            return params.row.registFee = (!util.isEmpty(params.row.registFee) ? (params.row.registFee - 0).toFixed(2) : 0.00)
          }
        },
        {
          title: '结账方式',
          width: 180,
          key: 'chargeTypeCode'
        },
        {
          title: '医保类别',
          width: 200,
          key: 'insuranceTypeCode'
        },
        {
          title: '操作人',
          width: 120,
          key: 'operPersonName'
        },
        {
          title: '结算号',
          width: 150,
          align: 'center',
          key: 'settleNo'
        },
      ],
      getTableData: [],
      page: 1,
      tabPages: 1,
      pageSize: 15,
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
      let params = {
        hospitalId: this.$store.state.userInfoObj.hospitalId,
        page: this.page,
        size: this.pageSize,
        param: this.inpatNumber //卡号 健康档案号
      }
      this.orderLoading = true
      this.$store.dispatch("findOutPatient", params).then(res => {
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
      let params = 'PrintClient://门诊病人查询.grf,' + util.BaseURL + 'findOutPatient?hospitalId='
        + this.$store.state.userInfoObj.hospitalId + '&param=' + this.inpatNumber + ',1'
      axios.get('http://127.0.0.1:5678?' + params).then(res => {
        return
      })
    }
  },
}
</script>
<style>
.outpatientPatientsearch .ivu-table-wrapper {
  height: 100% !important;
}
</style>
