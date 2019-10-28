<template>
  <div class="apply-drug">
    <!-- 病区领药查询 -->
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
              @click="getDataSearch"
              style="margin-left:10px">
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
  name: 'apply-drug',
  components: { Page },
  data () {
    return {
      wardDeptId: '',
      deptList: [],
      tableHeight: 70,
      orderLoading: false,
      getTableColumns: [
        {
          title: '科室名称',
          width: 130,
          key: 'deptName'
        },
        {
          title: '床号',
          width: 80,
          key: 'bed'
        },
        {
          title: '病人姓名',
          width: 100,
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
          title: '住院号',
          width: 150,
          align: 'center',
          key: 'inpatNum'
        },
        {
          title: '医嘱类别',
          width: 80,
          key: 'orderClass'
        },
        {
          title: '医嘱类型',
          width: 100,
          key: 'orderFlagName'
        },
        {
          title: '序号',
          width: 100,
          align: 'right',
          key: 'orderSubNo'
        },
        {
          title: '开始时间',
          width: 150,
          align: 'right',
          key: 'beginTime'
        },
        {
          title: '医嘱项目',
          width: 180,
          align: 'right',
          key: 'ordersItem'
        },
        {
          title: '规格',
          width: 230,
          key: 'itemSpec'
        },
        {
          title: '用药途径',
          width: 100,
          key: 'administrationName'
        },
        {
          title: '次剂量',
          width: 80,
          key: 'itemDosage'
        },
        {
          title: '单位',
          width: 80,
          key: 'unit'
        },
        {
          title: '总剂量',
          width: 80,
          key: 'totalDosage',
        },
        {
          title: '频次',
          width: 100,
          key: 'freq',
        },
        {
          title: '医嘱执行日期',
          width: 130,
          key: 'performDate'
        },
        {
          title: '医嘱执行时间点',
          width: 120,
          key: 'performTime'
        },
        {
          title: '停止时间',
          width: 150,
          key: 'stopTime'
        },
        {
          title: '执行状态',
          width: 80,
          key: 'execStatus'
        },
        {
          title: '累计发药标记',
          width: 130,
          key: 'accumulateFlagName '
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
        deptId: this.wardDeptId,
        startDate: util.isEmpty(this.timeId[0]) ? '' : this.timeId[0].format('yyyy-MM-dd 00:00:00'),
        endDate: util.isEmpty(this.timeId[1]) ? '' : this.timeId[1].format('yyyy-MM-dd 23:59:59'),
      }
      this.orderLoading = true
      this.$store.dispatch("findDrugByWardId", params).then(res => {
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
      let params = 'PrintClient://病区领药查询.grf,' + util.BaseURL + 'findDrugByWardId?hospitalId='
        + this.$store.state.userInfoObj.hospitalId + '&deptId=' + this.wardDeptId + '&startDate=' + this.timeId[0].format('yyyy-MM-dd 00:00:00') +
        '&endDate=' + this.timeId[1].format('yyyy-MM-dd 23:59:59') + ',1'
      axios.get('http://127.0.0.1:5678?' + params).then(res => {
        return
      })
    }
  },
}
</script>
<style>
.apply-drug .ivu-table-wrapper {
  height: 100% !important;
}
</style>
