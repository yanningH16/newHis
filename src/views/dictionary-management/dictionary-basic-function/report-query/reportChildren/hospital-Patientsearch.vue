<template>
  <div class="hospital-Patientsearch">
    <!-- 住院病人查询 -->
    <div>
      <Input v-model="inpatNumber"
             placeholder="请输入住院号"
             @on-enter='getDataSearch'
             style="width: 200px" />
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
  name: 'hospital-Patientsearch',
  components: { Page },
  data () {
    return {
      inpatNumber: '',
      tableHeight: 70,
      orderLoading: false,
      getTableColumns: [
        {
          title: '病案号',
          width: 120,
          align: 'center',
          key: 'medicalNum'
        },
        {
          title: '住院号',
          width: 130,
          align: 'center',
          key: 'inpatNum'
        },
        {
          title: '健康档案号',
          width: 120,
          align: 'center',
          key: 'healthNum'
        },
        {
          title: '床号',
          width: 50,
          key: 'bedNo'
        },
        {
          title: '姓名',
          width: 80,
          key: 'patName'
        },
        {
          title: '年龄',
          width: 65,
          key: 'age'
        },
        {
          title: '性别',
          width: 50,
          key: 'sex'
        },
        {
          title: '身份证号',
          width: 220,
          align: 'center',
          key: 'idNum'
        },
        {
          title: '电话',
          width: 120,
          key: 'phoneNum'
        },
        {
          title: '地址',
          width: 300,
          key: 'addressDetail'
        },
        {
          title: '入院日期',
          width: 150,
          align: 'center',
          key: 'inDatetime'
        },
        {
          title: '责任医师',
          width: 80,
          key: 'responsibleDoctorName'
        },
        {
          title: '责任护士',
          width: 80,
          key: 'responsibleNursePersonName'
        },
        {
          title: '护理等级',
          width: 80,
          key: 'nursingGradeName'
        },
        {
          title: '入院科室',
          width: 120,
          key: 'deptName'
        },
        {
          title: '入院病区',
          width: 120,
          key: 'wardDeptName'
        },
        {
          title: '床位等级',
          width: 80,
          key: 'bedLevelName'
        },
        {
          title: '结账方式',
          width: 180,
          key: 'payName'
        },
        {
          title: '联系人',
          width: 80,
          key: 'contactsName'
        },
        {
          title: '联系电话',
          width: 120,
          align: 'center',
          key: 'contactsPhoneNum'
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
        param: this.inpatNumber,
        inOutFlag: 0
      }
      this.orderLoading = true
      this.$store.dispatch("findInpPatient", params).then(res => {
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
      let params = 'PrintClient://住院病人查询.grf,' + util.BaseURL + 'findInpPatient?hospitalId='
        + this.$store.state.userInfoObj.hospitalId + '&param=' + this.inpatNumber + ',1'
      axios.get('http://127.0.0.1:5678?' + params).then(res => {
        return
      })
    }
  },
}
</script>
<style>
.hospital-Patientsearch .ivu-table-wrapper {
  height: 100% !important;
}
</style>
