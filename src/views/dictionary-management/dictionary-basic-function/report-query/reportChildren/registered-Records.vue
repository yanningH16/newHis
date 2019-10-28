<template>
  <div class="registered-Records">
    <!-- 门诊挂号记录查询 -->
    <div>
      <Input v-model="inpatNumber"
             placeholder="卡号/健康档案编号/姓名"
             @on-enter='getDataSearch'
             style="width: 200px" />
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
  name: 'registered-Records',
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
          width: 130,
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
          width: 80,
          key: 'sex'
        },
        {
          title: '年龄',
          width: 80,
          key: 'age'
        },
        {
          title: '证件号',
          width: 180,
          align: 'center',
          key: 'idNum'
        },
        {
          title: '收据号',
          width: 130,
          key: 'settleNo'
        },
        {
          title: '退号时间',
          width: 150,
          align: 'center',
          key: 'returnDate'
        },
        {
          title: '退号员',
          width: 100,
          key: 'returnOperPersonName'
        },
        {
          title: '病人类别',
          width: 100,
          key: 'patType'
        },
        {
          title: '挂号时间',
          width: 150,
          align: 'center',
          key: 'regDate'
        },
        {
          title: '挂号员',
          width: 150,
          align: 'center',
          key: 'operPersonName'
        },
        {
          title: '挂号号表',
          width: 250,
          key: 'registIndexName'
        },
        {
          title: '号表类别',
          width: 120,
          key: 'regTypeName'
        },
        {
          title: '号表时间段',
          width: 120,
          key: 'SHIFTNAME'
        },
        {
          title: '科室',
          width: 120,
          key: 'deptName'
        },
        {
          title: '接诊医生',
          width: 120,
          key: 'doctorName'
        },
        {
          title: '结账方式',
          width: 120,
          key: 'chargeTypeCodeName'
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
      let params = {
        hospitalId: this.$store.state.userInfoObj.hospitalId,
        page: this.page,
        size: this.pageSize,
        param: this.inpatNumber,
        startDate: util.isEmpty(this.timeId[0]) ? '' : this.timeId[0].format('yyyy-MM-dd 00:00:00'),
        endDate: util.isEmpty(this.timeId[1]) ? '' : this.timeId[1].format('yyyy-MM-dd 23:59:59'),
      }
      this.orderLoading = true
      this.$store.dispatch("findRegistRecord", params).then(res => {
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
      let params = 'PrintClient://门诊挂号记录查询.grf,' + util.BaseURL + 'findRegistRecord?hospitalId='
        + this.$store.state.userInfoObj.hospitalId + '&param=' + this.inpatNumber + ',1'
      axios.get('http://127.0.0.1:5678?' + params).then(res => {
        return
      })
    }
  },
}
</script>
<style>
.registered-Records .ivu-table-wrapper {
  height: 100% !important;
}
</style>
