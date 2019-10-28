<template>
  <div class="baby-info">
    <!-- 产婴登记信息查询 -->
    <div>
      <label style="display: inline-block;margin-left:10px"
             class="control-label">
        病区</label>
      <Select v-model="wardDeptId"
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
  name: 'baby-info',
  components: { Page },
  data () {
    return {
      wardDeptId: '',
      deptList: [],
      tableHeight: 70,
      orderLoading: false,
      getTableColumns: [
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
          title: '健康档案号',
          width: 120,
          align: 'center',
          key: 'healthNum'
        },
        {
          title: '产妇住院号',
          width: 120,
          align: 'center',
          key: 'motherInpNum'
        },
        {
          title: '手机号',
          width: 130,
          align: 'right',
          key: 'phoneNum'
        },
        {
          title: '姓名',
          width: 100,
          key: 'patName'
        },
        {
          title: '胎儿姓名',
          width: 100,
          key: 'name'
        },
        {
          title: '性别',
          width: 80,
          key: 'sex'
        },
        {
          title: '出生日期',
          width: 100,
          key: 'bornDate',
        },
        {
          title: '出生时间',
          width: 100,
          key: 'bornTime',
        },
        {
          title: '身高（cm）',
          width: 100,
          key: 'height'
        },
        {
          title: '体重（g）',
          width: 100,
          key: 'weight'
        },
        {
          title: '年龄',
          width: 100,
          key: 'age'
        },
        {
          title: '民族',
          width: 80,
          key: 'nationName'
        },
        {
          title: '是否抢救',
          width: 80,
          key: 'rescue'
        },
        {
          title: '畸形',
          width: 80,
          key: 'malformation'
        },
        {
          title: '抢救次数',
          width: 80,
          alingn: 'right',
          key: 'rescueTime'
        },
        {
          title: '成功次数',
          width: 80,
          alingn: 'right',
          key: 'successTime'
        },
        {
          title: '胎方位',
          width: 100,
          key: 'fetalName'
        },
        {
          title: '分娩结果',
          width: 100,
          key: 'deliveryName'
        },
        {
          title: '皮肤接触',
          width: 100,
          key: 'skinContact'
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
    //获取病区
    getDeptList () {
      let nowData = {
        deptType: 2,
        userId: this.$store.state.userInfoObj.userId,
        hospitalId: this.$store.state.userInfoObj.hospitalId
      }
      this.$store.dispatch("getDeptDictOnly", nowData).then(res => {
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
        wardId: this.wardDeptId,
        startDate: util.isEmpty(this.timeId[0]) ? '' : this.timeId[0].format('yyyy-MM-dd 00:00:00'),
        endDate: util.isEmpty(this.timeId[1]) ? '' : this.timeId[1].format('yyyy-MM-dd 23:59:59'),
      }
      this.orderLoading = true
      this.$store.dispatch("findInpBabyInfo", params).then(res => {
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
      let params = 'PrintClient://产婴登记查询.grf,' + util.BaseURL + 'findInpBabyInfo?hospitalId='
        + this.$store.state.userInfoObj.hospitalId + '&wardId=' + this.wardDeptId + '&startDate=' +
        this.timeId[0].format('yyyy-MM-dd 00:00:00') + '&endDate=' +
        this.timeId[1].format('yyyy-MM-dd 23:59:59') + ',1'
      axios.get('http://127.0.0.1:5678?' + params).then(res => {
        return
      })
    }
  },
}
</script>
<style>
.baby-info .ivu-table-wrapper {
  height: 100% !important;
}
</style>
