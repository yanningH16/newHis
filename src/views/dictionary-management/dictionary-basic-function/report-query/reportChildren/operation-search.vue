<template>
  <div class="operation-search">
    <!-- 手术安排查询 -->
    <div>
      <Input v-model="inpatNumber"
             placeholder="病案号/住院号"
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
  name: 'operation-search',
  components: { Page },
  data () {
    return {
      inpatNumber: '',
      tableHeight: 70,
      orderLoading: false,
      getTableColumns: [
        {
          title: '申请单号',
          width: 130,
          align: 'center',
          key: 'req_num'
        },
        {
          title: '健康档案号',
          width: 130,
          align: 'center',
          key: 'healthNum'
        },
        {
          title: '住院号',
          width: 130,
          align: 'center',
          key: 'inpatNum'
        },
        {
          title: '科室',
          width: 100,
          key: 'deptName'
        },
        {
          title: '病床号',
          width: 100,
          key: 'bedNo'
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
          title: '手术科室',
          width: 120,
          key: 'operationDeptName'
        },
        {
          title: '手术室',
          width: 100,
          key: 'roomName'
        },
        {
          title: '预约手术时间',
          width: 150,
          key: 'scheduledTime'
        },
        {
          title: '申请时间',
          width: 150,
          key: 'reqTime'
        },
        {
          title: '状态',
          width: 130,
          key: 'statusName'
        },
        {
          title: '手术',
          width: 250,
          key: 'operItemItem'
        },
        {
          title: '病人情况',
          width: 250,
          key: 'patSituation'
        },
        {
          title: '手术风险',
          width: 250,
          key: 'operationRisk'
        },
        {
          title: '麻醉方法',
          width: 100,
          key: 'anestheticUsedFlagName'
        },
        {
          title: '麻醉医师',
          width: 100,
          key: 'anaesDoctorPersonName'
        },
        {
          title: '审批结果',
          width: 100,
          key: 'approveResultName'
        },
        {
          title: '手术医师',
          width: 100,
          key: 'operPersonName'
        },
        {
          title: '开始时间',
          width: 100,
          key: 'beginDatetime'
        },
        {
          title: '手术切口描述',
          width: 150,
          key: 'surgicalIncision'
        },
        {
          title: '手术台次',
          width: 80,
          key: 'seqNo'
        },
        {
          title: '术前准备',
          width: 100,
          key: 'notes'
        },
        {
          title: '安排手术时间',
          width: 150,
          key: 'arrangeTime'
        },
        {
          title: 'Ⅱ助姓名',
          width: 100,
          key: 'assIiPersonName'
        },
        {
          title: '巡台护士姓名',
          width: 150,
          key: 'patrolNursePersonName'
        },
        {
          title: 'Ⅰ助姓名',
          width: 100,
          key: 'assIPersonName'
        },
        {
          title: '麻醉中西医标识',
          width: 130,
          key: 'anestheticUsedFlagName'
        },
        {
          title: '急诊标记',
          width: 80,
          key: 'emergencyFlagName'
        },
        {
          title: '器械护士',
          width: 120,
          key: 'apparatusNursePersonName'
        },
        {
          title: '隔离标记',
          width: 80,
          key: 'isolationFlagName'
        }
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
      this.$store.dispatch("findOperationInfo", params).then(res => {
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
      let params = 'PrintClient://手术安排查询.grf,' + util.BaseURL + 'findOperationInfo?hospitalId='
        + this.$store.state.userInfoObj.hospitalId + '&param=' + this.inpatNumber + ',1'
      axios.get('http://127.0.0.1:5678?' + params).then(res => {
        return
      })
    }
  },
}
</script>
<style>
.operation-search .ivu-table-wrapper {
  height: 100% !important;
}
</style>
