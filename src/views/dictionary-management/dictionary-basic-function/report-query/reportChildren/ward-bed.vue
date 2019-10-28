<template>
  <div class="ward-bed">
    <!-- 病区床位查询 -->
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
        床位状态</label>
      <Select v-model="bedState"
              style="width:176px;margin-left:10px"
              filterable
              clearable>
        <Option v-for="(item,index) in bedStateList"
                :value="item.id"
                :key="index">{{ item.name }}</Option>
      </Select>
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
  name: 'ward-bed',
  components: { Page },
  data () {
    return {
      wardDeptId: '',
      deptList: [],
      bedState: 1,
      //床位状态
      bedStateList: [
        {
          id: 0,
          name: '空床'
        },
        {
          id: 1,
          name: '在用'
        },
        {
          id: 2,
          name: '全部'
        }
      ],
      tableHeight: 70,
      orderLoading: false,
      getTableColumns: [
        {
          title: '病区',
          key: 'wardDeptName'
        },
        {
          title: '病房号',
          align: 'right',
          key: 'wardRoomNo'
        },

        {
          title: '床位',
          key: 'bedNo'
        },

        {
          title: '床位等级',
          key: 'levelName'
        },
        {
          title: '床位状态',
          key: 'bedStatusName'
        },
        {
          title: '停止标志',
          key: 'stopFlagName'
        },
        {
          title: '床位护士',
          key: 'nurseName'
        },
        {
          title: '责任医生',
          key: 'doctorName'
        },
      ],
      getTableData: [],
      page: 1,
      tabPages: 1,
      pageSize: 15
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
      this.getTableData = []
      let params = {
        hospitalId: this.$store.state.userInfoObj.hospitalId,
        page: this.page,
        size: this.pageSize,
        wardId: this.wardDeptId,
        status: this.bedState,
      }
      this.orderLoading = true
      this.$store.dispatch("findWardBedInfo", params).then(res => {
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
      let params = 'PrintClient://病区床位查询.grf,' + util.BaseURL + 'findWardBedInfo?hospitalId='
        + this.$store.state.userInfoObj.hospitalId + '&wardId=' + this.wardDeptId + '&status=' + this.bedState + ',1'
      axios.get('http://127.0.0.1:5678?' + params).then(res => {
        return
      })
    }
  },
}
</script>
<style>
.ward-bed .ivu-table-wrapper {
  height: 100% !important;
}
</style>
