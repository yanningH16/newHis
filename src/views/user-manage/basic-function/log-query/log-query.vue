<template>
  <div class="bg-white log-query">
    <div style="display:flex;margin-top:10px">
      <label style="line-height:32px;margin-right:5px">日期选择</label>
      <DatePicker format='yyyy-MM-dd'
                  type='datetimerange'
                  placement='bottom-start'
                  placeholder='请选择日期'
                  v-model="searchObj.dateSearch"
                  @on-change="update"
                  style="width: 200px"></DatePicker>
      <Input v-model.trim="searchObj.textSearch"
             placeholder="请输入操作说明"
             @keyup.native.enter="cleanSearch"
             style="width: 200px;margin-left:10px" />
      <Button type="primary"
              @click="cleanSearch"
              style="margin-left:5px">
        <i class="iconfont iconchaxun"></i>&#8194;查询</Button>
    </div>
    <div style="margin-top:5px"
         id="logquery">
      <Table highlight-row
             disabled-hover
             stripe
             border
             :loading="loading"
             class="notwrap"
             :height="tabHeight"
             :columns="tableObj.columns"
             :data="tableObj.data"></Table>
    </div>
    <Modal v-model="vShow.showModal"
           :closable="false"
           title="操作详细说明"
           width="700px"
           :mask-closable="false">
      <div slot="footer">
        <Button type="primary"
                size="large"
                @click="vShow.showModal=false">确定</Button>
      </div>
      <span style="word-wrap: break-word">
        {{vShow.showText}}
      </span>
    </Modal>
    <div style="padding-bottom:10px;margin-top:10px;float: right;">
      <Page @Page="changPage"
            :tabpage="pages.tabPage" />
    </div>
  </div>

</template>

<script>
import Page from '../../../components/page.vue';
import util from '../../../../libs/util.js';
export default {
  name: 'log-query',
  data () {
    return {
      loading: false,       //表格loading效果
      tabHeight: '',     //表格自定义高度
      searchObj: {
        dateSearch:[new Date().format('yyyy-MM-dd 00:00:00'), new Date().format('yyyy-MM-dd 23:59:59')],
        textSearch: '',   //input 搜索框内容
      },
      tableObj: { //表格内容
        columns: [   //表格表头
          {
            title: '日志代码',
            key: 'logCode',
            width: 200
          },
          {
            title: '操作类型',
            key: 'opertypeName',
            align: 'center',
            width: 100
          },
          {
            title: '操作对象',
            key: 'operObjectId',
            align: 'center',
            width: 100
          },
          {
            title: '操作详细说明',
            key: 'operRemark',
          },
          {
            title: '操作者',
            key: 'userName',
            width: 100
          },
          {
            title: '操作时间',
            key: 'operDate',
            align: 'center',
            width: 150,
          },
          {
            title: '操作',
            key: '',
            width: 80,
            align: 'center',
            render: (h, params) => {
              return h('div', [
                h(
                  'Poptip',
                  {
                    props: {
                      trigger: 'hover',
                      placement: 'top'
                    }
                  },
                  [
                    h('i', {
                      class: util.icon.browse,
                      style: {
                        marginLeft: '15px',
                        verticalAlign: 'middle',
                        fontSize: '18px',
                      },
                      on: {
                        click: () => {
                          this.vShow.showText = params.row.operRemark //弹出框显示内容为操作说明
                          this.vShow.showModal = true
                        }
                      }
                    }),
                    h(
                      'div',
                      {
                        slot: 'content'
                      },
                      '查看'
                    )
                  ]
                )
              ])
            }
          }
        ],
        data: [],
        opertype: { '1': '新增', '2': '修改', '3': '删除' },
      },
      vShow: {
        showModal: false,      //判断弹框显示隐藏
        showText: '',       //弹出框显示内容
      },
      pages: {   //分页
        page: 1,
        tabPage: 1,
        pageSelf: 1,
        size: 20,
      },
    };
  },
  components: { Page },
  mounted () {
    this.init()
  },
  methods: {
    init () {
      this.tabHeight = $("#logquery").height();
      this.tableInit()
    },
    update () {    //选择日期查询事件,如果日期为空,表格为空
      if (!util.isEmpty(this.searchObj.dateSearch)) {
        this.cleanSearch()
      } else {
        this.tableObj.data = []
      }
    },
    tableInit () {      //获取表格数据
      if (util.isEmpty(this.searchObj.dateSearch) && util.isEmpty(this.searchObj.dateSearch) && this.searchObj.textSearch == '') {
        util.showMsg(this, { warning: '请填写搜索条件' })
        return
      }
      let params = {
        startDate: util.isEmpty(this.searchObj.dateSearch) ? '' : this.searchObj.dateSearch[0].format('yyyy-MM-dd 00:00:00'),  //开始日期
        endDate: util.isEmpty(this.searchObj.dateSearch) ? '' : this.searchObj.dateSearch[1].format('yyyy-MM-dd 23:59:59'), //结束日期
        operRemark: this.searchObj.textSearch != '' ? "%" + this.searchObj.textSearch + "%" : '',  //搜索条件
        hospitalId: this.$store.state.userInfoObj.hospitalId,
        page: this.pages.page,
        size: this.pages.size
      }
      this.loading = true
      this.$store.dispatch('getSysLogsByQP', params).then(res => {
        this.loading = false
        if (res.data.code === 200) {
          this.pages.tabPage = res.data.data.pages
          this.tableObj.data = res.data.data.list
          this.tableObj.data.map((val, i) => {
            val.opertypeName = this.tableObj.opertype[val.opertypeId]
            val.operDate = val.operDate
          })
        } else {
          util.showMsg(this, { diy: res.data.message });
        }
      })
    },
    cleanSearch () {      //搜索事件
      this.pages.page = 1
      this.pages.tabPage = 1
      this.tableInit()
    },
    changPage (Page) {    //分页
      this.pages.page = Page
      this.tableInit()
    },
  }
}
</script>
<style >
#logquery {
  height: 77%;
}
</style>

<style lang="less" scoped>
@import "../../../../styles/common.less";
</style>


