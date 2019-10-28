<template>
  <div class="bg-white"
       style="width:100%;height:100%;display:flex">
    <!-- 左部分 -->
    <div style="width:50%;border-right: 2px solid #e9e9e9;height:100%;margin-top:-16px;padding-top:16px">
      <div style="display:flex">
        <label class="control-label-left tc-left">项目类别</label>
        <Select v-model="itemClass.itemClass"
                id="deptName"
                style="width:40%;margin-left:10px"
                filterable
                :loading="selectLoading"
                clearable
                @on-change="itemChangeSearchLeft">
          <Option v-for="(item,index) in itemClass.itemClassList"
                  :value="item.flagdataValue"
                  :key="index">{{ item.flagdataValueRemark }}</Option>
        </Select>
      </div>
      <div class="tableBox">
        <Table style="margin: 16px 30px 0 0;"
               :loading="loadingLeft"
               highlight-row
               disabled-hover
               border
               :height="tabHeightR"
               :data="tableObj.leftData"
               :columns="tableObj.leftColumns"></Table>
        <div style="padding-bottom:10px;margin:10px 30px 0 0;float: right;">
          <Page @Page="changPageL"
                :tabpage="pages.tabPageL" />
        </div>
      </div>
    </div>
    <!-- 右部分 -->
    <div style="width:50%;height:100%;margin:-16px 0 0  30px;padding-top:18px">
      <div style="display:flex">

        <Input v-model.trim="cliItem.inputItemName"
               @keyup.native.enter="itemChangeSearchRight"
               placeholder="请输入项目名称 / 拼音码"
               style="width:44%;margin-right:10px" />
        <label class="control-label-left tc-left">类别</label>
        <Select v-model="cliItem.cliItemId"
                style="width:30%;margin-left:10px"
                filterable
                clearable>
          <Option v-for="(item,index) in cliItem.cliItemList"
                  :value="item.datavalueId"
                  :key="index">{{ item.dataValueRemark }}</Option>
        </Select>
        <Button type="primary"
                @click="itemChangeSearchRight"
                style="margin-left:10px;float: right;"><i class="iconfont iconchaxun"></i>&#8194;查询</Button>
      </div>
      <div class="tableBox">
        <Table style="margin: 18px 0 0 0;"
               :loading='loadingRight'
               highlight-row
               border
               disabled-hover
               :height="tabHeightR"
               :data="tableObj.rightData"
               :columns="tableObj.rightColumns"></Table>
        <div style="padding-bottom:10px;margin-top:10px;float: right;">
          <Page @Page="changPageR"
                :tabpage="pages.tabPageR" />
        </div>
      </div>
    </div>

    <confirmDeletion :msg="showModal.delMsg"
                     title='删除'
                     :btntext='showModal.delBtnText'
                     :show="showModal.delModal"
                     @ok='delItemClassAjax'
                     @close="showModal.delModal=false"></confirmDeletion>

  </div>
</template>

<script>
import util from '../../../../libs/util';
import confirmDeletion from '../../../components/confirmDeletion.vue';
import Page from '../../../components/page.vue';

export default {
  components: {
    confirmDeletion,
    Page
  },
  name: 'dept-exec-item',
  data () {
    return {
      loadingLeft: false,
      loadingRight: false,
      selectLoading: false,
      tabHeight: '',
      tabHeightR: '',
      pages: {
        pageL: 1,
        tabPageL: 3,
        pageSelfL: 1,
        pageR: 1,
        tabPageR: 1,
        pageSelfR: 1,
        size: 13,
      },
      itemClass: {
        itemClassList: [],
        itemClassListFB: [],
        itemClass: '',
      },
      cliItem: {
        cliItemList: [],
        cliItemId: '',
        inputItemName: '',
      },
      tableObj: {
        leftData: [],
        leftColumns: [{
          title: '名称',
          key: 'itemName',
          align: 'left',
        }, {
          title: '医嘱类别',
          key: 'itemFlagName',
          align: 'left',
          width: 100,
        }, {
          title: '规格',
          key: 'itemSpec',
          align: 'left',
        }, {
          title: '操作',
          key: ' ',
          width: 90,
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
                    class: util.icon.delete,
                    style: {
                      verticalAlign: 'middle',
                    },
                    on: {
                      click: () => {
                        this.leftDataDel(params.row)
                      }
                    }
                  }),
                  h(
                    'div',
                    {
                      slot: 'content'
                    },
                    '删除'
                  )
                ]
              )
            ]);
          }
        }],
        rightData: [],
        rightDataFB: [],
        rightColumns: [{
          title: '名称',
          key: 'itemName',
          align: 'left',
        }, {
          title: '医嘱类别',
          align: 'left',
          key: 'itemClassName',
        }, {
          title: '规格',
          align: 'left',
          key: 'itemSpec',
        }, {
          title: '操作',
          key: '',
          align: 'center',
          width: 80,
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
                    class: util.icon.left,
                    style: {
                      marginRight: '5px',
                      fontSize: '16px'
                    },
                    on: {
                      click: () => {
                        this.rightDataAdd(params.row)
                      }
                    }
                  }),
                  h(
                    'div',
                    {
                      slot: 'content'
                    },
                    '添加至左表'
                  )
                ]
              ),
            ])
          }
        }]
      },
      showModal: {
        delBtnText: '删除',
        delModal: false,
        delMsg: '',
        addBtnText: '确定',
        addModal: false,
        addMsg: '',
      },
      currObj: {
        oneId: '',
        currItem: {}
      },
    };
  },
  mounted () {
    this.init();
  },
  methods: {
    init () {
      this.tabHeightR = $(".tableBox").height() - 30;
      this.itemClass.itemClassList = []
      this.selectLoading = true
      this.$store.dispatch('getFDAttr', { 'flagdataCode': 'FD000288' }).then(res => {//获取fd数据
        if (res.data.code !== 200) {
          util.showMsg(this, { diy: res.data.message });
        } else {
          let resList = res.data.data
          this.itemClass.itemClassList = resList
          this.itemClass.itemClassListFB = resList
          this.selectLoading = false
        }
      })
      this.$store.dispatch("getPDOrHDAttrs", { hospitalId: this.$store.state.userInfoObj.hospitalId, pdCode: 'PD0000000375' }).then(res => {
        if (res.data.code !== 200) {
          util.showMsg(this, { diy: res.data.message });
        } else {
          let resList = res.data.data.list
          resList.map(item => {
            if (item.dataValueRemark.indexOf('药品') != -1) item.datavalueId = 1
            if (item.dataValueRemark.indexOf('材料') != -1) item.datavalueId = 2
          })
          this.cliItem.cliItemList = resList
          this.selectLoading = false
        }
      })
      this.itemChange()
    },
    delQuery () {
      this.pages.pageSelfL = 1
      this.pages.tabPageR = 1
    },
    itemClassChange () { //左上改变事件
      if (!util.isEmpty(this.itemClass.itemClass)) {
        this.loadingLeft = true
        this.tableObj.leftData = []
        let nowData = {
          typeCode: this.itemClass.itemClass,
          page: this.pages.pageSelfL,
          size: this.pages.size
        }
        this.$store.dispatch('queryByItemCode', nowData).then(res => {
          if (res.data.code !== 200) {
            util.showMsg(this, { diy: res.data.message });
          } else {
            let resList = res.data.data.list
            this.tableObj.leftData = resList
            this.pages.tabPageL = res.data.data.pages
          }
          this.loadingLeft = false
        })
      } else {
        this.tableObj.leftData = []
      }
    },
    itemChangeSearchLeft () {
      this.pages.pageSelfL = 1
      this.pages.tabPageL = ''
      this.itemClassChange()
    },
    itemChangeSearchRight () {
      this.pages.pageSelfR = 1
      this.pages.tabPageR = ''
      this.itemChange()
    },
    itemChange () { // 右上改变事件
      this.loadingRight = true
      let nowData = {
        page: this.pages.pageSelfR,
        size: this.pages.size
      }
      if (!util.isEmpty(this.cliItem.inputItemName)) nowData.wbCode = this.cliItem.inputItemName
      if (!util.isEmpty(this.cliItem.cliItemId)) nowData.typeCode = this.cliItem.cliItemId
      this.$store.dispatch('queryListByCodeR', nowData).then(res => {//获取fd数据
        if (res.data.code !== 200) {
          util.showMsg(this, { diy: res.data.message });
        } else {
          let resList = res.data.data.list
          this.tableObj.rightData = resList
          this.pages.tabPageR = res.data.data.pages
        }
        this.loadingRight = false
      })
    },
    leftDataDel (item) {  // 左边删除弹窗
      this.currObj.currItem = item
      this.showModal.delMsg = '确定要删除项目【' + item.itemName + '】吗？'
      this.showModal.delModal = true

    },
    delItemClassAjax () { //删除确认
      this.$store.dispatch('itemClassDelFn', { id: this.currObj.currItem.ctmId }).then(res => {
        if (res.data.code !== 200) {
          util.showMsg(this, { diy: res.data.message });
        } else {
          this.itemChange()
          this.itemClassChange()
          util.showMsg(this, { succ: "删除成功" });
        }
        this.showModal.delModal = false
      })
    },
    rightDataAdd (item) { // 右边传至左边
      if (util.isEmpty(this.itemClass.itemClass)) {
        util.showMsg(this, { warning: "请选择项目类别" });
        return
      }
      let nowFlog = ''
      if (item.itemClassName.indexOf('药品') != -1) nowFlog = '2'
      if (item.itemClassName.indexOf('材料') != -1) nowFlog = '3'
      if (nowFlog == '') nowFlog = '1'
      let nowData = {
        typeCode: this.itemClass.itemClass,
        hospitalId: this.$store.state.userInfoObj.hospitalId,
        itemId: item.itemId,
        itemFlag: nowFlog
      }
      this.$store.dispatch('itemClassAddFn', nowData).then(res => {
        if (res.data.code !== 200) {
          util.showMsg(this, { diy: res.data.message });
        } else {
          this.itemChange()
          this.itemClassChange()
          util.showMsg(this, { succ: "添加成功" });
        }
        this.loadingRight = false
      })
    },
    changPageL (Page) { //左侧分页
      if (Page + 0 != Page) {
        this.pages.pageL = this.pages.pageL
      } else {
        this.pages.pageL = Page
      }
      this.pageWitchL(Page)
    },
    pageWitchL (val) { //左侧分页监听
      this.pages.pageSelfL = val
      this.itemClassChange()
    },
    changPageR (Page) { //右侧分页
      if (Page + 0 != Page) {
        this.pages.pageR = this.pages.pageR
      } else {
        this.pages.pageR = Page
      }
      this.pageWitchR(Page)
    },
    pageWitchR (val) { //右侧分页监听
      this.pages.pageSelfR = val
      this.itemChange()
    },
    itemClassRemoteMethod () { },// 项目类别远程搜索
  }
};
</script>
<style lang="less" scoped>
@import "../../../../styles/common.less";
.tableBox {
  height: 82%;
}
</style>
<style>
.ivu-page-simple .ivu-page-simple-pager input {
  width: 45px !important;
}
</style>
