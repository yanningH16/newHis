<template>
  <div class="hospital-appointment">
    <!-- 住院预约查询 -->
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
      <Input v-model="inpatNumber"
             placeholder="病案号或住院号"
             @on-enter='getDataSearch'
             style="width: 176px" />
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
  name: 'hospital-appointment',
  components: { Page },
  data () {
    return {
      inpatNumber: '',
      deptId: '',
      deptList: [],
      tableHeight: 70,
      orderLoading: false,
      getTableColumns: [
        {
          title: '健康档案编号',
          width: 120,
          align: 'center',
          key: 'healthNum'
        },
        {
          title: '住院号',
          width: 130,
          key: 'inpatNum'
        },
        {
          title: '门诊号',
          width: 120,
          key: 'outpatNum'
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
          width: 80,
          key: 'sexName'
        },
        {
          title: '电话',
          width: 150,
          align: 'right',
          key: 'phoneNum'
        },
        {
          title: '联系人',
          width: 150,
          align: 'right',
          key: 'contactsName'
        },
        {
          title: '联系人电话',
          width: 150,
          align: 'right',
          key: 'contactsPhoneNum'
        },
        {
          title: '预约日期',
          width: 150,
          align: 'center',
          key: 'appTime'
        },
        {
          title: '病情',
          width: 100,
          key: 'diseaseState'
        },
        {
          title: '预约科室',
          width: 130,
          key: 'planDeptName'
        },
        {
          title: '预约入院开始时间',
          width: 130,
          align: 'center',
          key: 'planInDateBegin'
        },
        {
          title: '预约入院结束时间',
          width: 130,
          align: 'center',
          key: 'planInDateEnd'
        },
        {
          title: '操作人',
          width: 100,
          key: 'appOperName'
        },
        {
          title: '病人确认时间',
          width: 130,
          align: 'center',
          key: 'billTime'
        },
        {
          title: '确认入院日期',
          width: 130,
          align: 'center',
          key: 'readyInDate'
        },
        {
          title: '确认入院病区',
          width: 130,
          key: 'readyWardName'
        },
        {
          title: '确认预约床位',
          width: 120,
          key: 'readyBedNo'
        },
        {
          title: '预约状态',
          width: 90,
          key: 'statusName'
        },

        {
          title: '入院床位',
          width: 90,
          key: 'inBedNo'
        },
        {
          title: '入院时间',
          width: 130,
          align: 'center',
          key: 'inTime'
        },
        {
          title: '备注',
          width: 150,
          key: 'remark'
        },
        {
          title: '取消预约操作人',
          width: 150,
          key: 'cancleAppOperName'
        },
        {
          title: '取消预约时间',
          width: 150,
          align: 'center',
          key: 'cancleAppTime'
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
      this.$store.dispatch("findInpApp", params).then(res => {
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
      let params = 'PrintClient://出院病人费用查询.grf,' + util.BaseURL + 'findInpApp?hospitalId='
        + this.$store.state.userInfoObj.hospitalId + '&deptId=' + this.deptId + '&startDate=' + util.isEmpty(this.timeId[0]) ? '' : this.timeId[0].format('yyyy-MM-dd 00:00:00') + '&endDate=' + util.isEmpty(this.timeId[1]) ? '' : this.timeId[1].format('yyyy-MM-dd 23:59:59') + ',1'
      axios.get('http://127.0.0.1:5678?' + params).then(res => {
        return
      })
    }
  },
}
</script>
<style>
.hospital-appointment .ivu-table-wrapper {
  height: 100% !important;
}
</style>
