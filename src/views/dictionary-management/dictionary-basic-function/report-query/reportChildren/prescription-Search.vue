<template>
  <div class="prescription-Search">
    <!-- 处方查询 -->
    <div>
      <Input v-model="inpatNumber"
             @on-enter='getDataSearch'
             placeholder="卡号/健康档案编号/门诊号/病案号/处方号"
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
  name: 'prescription-Search',
  components: { Page },
  data () {
    return {
      inpatNumber: '',
      tableHeight: 70,
      orderLoading: false,
      getTableColumns: [
        {
          title: '日期',
          width: 150,
          align: 'center',
          key: 'createDatetime'
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
          width: 80,
          key: 'age'
        },
        {
          title: '费用',
          width: 80,
          align: 'right',
          key: 'prescCosts',
          render: (h, params) => {
            return params.row.prescCosts = (!util.isEmpty(params.row.prescCosts) ? (params.row.prescCosts - 0).toFixed(2) : 0.00)
          }
        },
        {
          title: '卡号',
          width: 100,
          key: 'cardNum'
        },
        {
          title: '健康档案号',
          width: 120,
          align: 'center',
          key: 'healthNum'
        },
        {
          title: '病案号',
          width: 120,
          align: 'center',
          key: 'medicalNum'
        },
        {
          title: '门诊号',
          width: 130,
          key: 'outpatNum'
        },
        {
          title: '收据号',
          width: 130,
          align: 'center',
          key: 'settleNo'
        },
        {
          title: '处方号',
          width: 130,
          align: 'center',
          key: 'prescNum'
        },
        {
          title: '组号',
          width: 50,
          align: 'right',
          key: 'groupNo'
        },
        {
          title: '组序号',
          width: 80,
          align: 'right',
          key: 'groupSubNo'
        },

        {
          title: '药品名称',
          width: 230,
          key: 'drugName'
        },
        {
          title: '规格',
          width: 200,
          key: 'drugSpec'
        },
        {
          title: '计量',
          width: 80,
          key: 'totalDosage',
          render: (h, params) => {
            return params.row.dosages = params.row.dosage + params.row.unitName
          }
        },
        {
          title: '频次',
          width: 80,
          key: 'freqName'
        },
        {
          title: '用药途径',
          width: 120,
          key: 'patType'
        },
        {
          title: '天数',
          width: 50,
          align: 'right',
          key: 'days'
        },
        {
          title: '数量',
          width: 50,
          align: 'right',
          key: 'prescCosts',
          render: (h, params) => {
            return params.row.totalDosages = params.row.packageQty + params.row.packageUnitName
          }
        },
        {
          title: '执行时间',
          width: 200,
          key: 'performTime'
        },
        {
          title: '嘱托',
          width: 120,
          key: 'administrationName'
        },
        {
          title: '状态',
          width: 150,
          key: 'prescStatusName'
        }
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
      this.$store.dispatch("findPatientPresc", params).then(res => {
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
      let params = 'PrintClient://处方查询.grf,' + util.BaseURL + 'findPatientPresc?hospitalId='
        + this.$store.state.userInfoObj.hospitalId + '&param=' + this.inpatNumber + ',1'
      axios.get('http://127.0.0.1:5678?' + params).then(res => {
        return
      })
    }
  },
}
</script>
<style>
.prescription-Search .ivu-table-wrapper {
  height: 100% !important;
}
</style>
