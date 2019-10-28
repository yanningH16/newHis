<template>
  <div class="outpatient-Visits">
    <!-- 门诊出诊查询 -->
    <div>
      <label style="display: inline-block;margin-left:10px"
             class="control-label">
        号表</label>
      <Select v-model="registIndexId"
              style="width:176px;margin-left:10px"
              filterable
              clearable>
        <Option v-for="(item,index) in deptList"
                :value="item.registIndexId"
                :key="index">{{ item.registLabel }}</Option>
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
  name: 'outpatient-Visits',
  components: { Page },
  data () {
    return {
      registIndexId: '',
      deptList: [],
      tableHeight: 70,
      orderLoading: false,
      getTableColumns: [
        {
          title: '出诊日期',
          width: 120,
          key: 'scheDate'
        },
        {
          title: '星期',
          width: 90,
          key: 'week'
        },
        {
          title: '号表名称',
          width: 250,
          key: 'registLabel'

        },
        {
          title: '号表时段',
          width: 80,
          align: 'right',
          key: 'shiftName'
        },
        {
          title: '限号数',
          width: 80,
          align: 'right',
          key: 'limitNum'
        },
        {
          title: '有效号数',
          width: 80,
          align: 'right',
          key: 'validCount'
        },
        {
          title: '限预约号数',
          width: 100,
          align: 'right',
          key: 'limitCount'
        },
        {
          title: '已预约数',
          width: 80,
          align: 'right',
          key: 'appointNum'
        },
        {
          title: '诊毕人数',
          width: 80,
          align: 'right',
          key: 'count'
        },
        {
          title: '挂号费',
          width: 80,
          align: 'right',
          key: 'costs'
        },
        {
          title: '停诊',
          width: 80,
          align: 'center',
          key: 'scheduleStatus'
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
    this.getDeptList()
  },
  methods: {
    //获取号表
    getDeptList () {
      let nowData = {
        "hospitalId": this.$store.state.userInfoObj.hospitalId
      }
      this.$store.dispatch("getRegistIndexList", nowData).then(res => {
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
        registIndexId: this.registIndexId,
        startDate: util.isEmpty(this.timeId[0]) ? '' : this.timeId[0].format('yyyy-MM-dd 00:00:00'),
        endDate: util.isEmpty(this.timeId[1]) ? '' : this.timeId[1].format('yyyy-MM-dd 23:59:59'),
      }
      this.orderLoading = true
      this.$store.dispatch("findOutpVisit", params).then(res => {
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
      let params = 'PrintClient://门诊出诊查询.grf,' + util.BaseURL + 'findOutpVisit?hospitalId='
        + this.$store.state.userInfoObj.hospitalId + '&registIndexId=' + this.registIndexId + '&startDate=' + util.isEmpty(this.timeId[0]) ? '' : this.timeId[0].format('yyyy-MM-dd 00:00:00') + '&endDate=' + util.isEmpty(this.timeId[1]) ? '' : this.timeId[1].format('yyyy-MM-dd 23:59:59') + ',1'
      axios.get('http://127.0.0.1:5678?' + params).then(res => {
        return
      })
    }
  },
}
</script>
<style>
.outpatient-Visits .ivu-table-wrapper {
  height: 100% !important;
}
</style>
