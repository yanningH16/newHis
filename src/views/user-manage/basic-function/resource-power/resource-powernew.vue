<template>
  <Row class="bg-whiteclass"
       id="Rows"
       style="width:100%;height:100%">
    <!-- 左侧数据 -->
    <div id="leftTop"
         ref="leftTop"
         style="height:5%;border-right:1px solid #bbbec4;padding-right:10px;width:50%">
      <!-- tab页切换 -->
      <Tabs :value="tabsName"
            type="card"
            @on-click="tabsClick"
            style="width:100%">
        <TabPane class="leftMargin"
                 label="号表授权"
                 name="1"
                 v-if="user == '1' ? true : arr.indexOf(7) != -1">
        </TabPane>
        <TabPane class="leftMargin"
                 label="分诊台授权"
                 name="2"
                 v-if="user == '1' ? true : arr.indexOf(8) != -1">
        </TabPane>
        <TabPane class="leftMargin"
                 label="科室授权"
                 name="3"
                 v-if="user == '1' ? true : arr.indexOf(9) != -1">
        </TabPane>
        <TabPane class="leftMargin"
                 label="菜单授权"
                 name="4"
                 style="margin-left:-16px"
                 v-if="user == '1' ? true : arr.indexOf(10) != -1">
        </TabPane>
        <TabPane class="leftMargin"
                 label="报表授权"
                 name="5"
                 v-if="user == '1' ? true : arr.indexOf(11) != -1">
        </TabPane>
        <TabPane class="leftMargin"
                 label="药房授权"
                 name="6"
                 style="margin-left:-16px"
                 v-if="user == '1' ? true : arr.indexOf(12) != -1">
        </TabPane>
        <TabPane class="leftMargin"
                 label="药库授权"
                 name="8"
                 style="margin-left:-16px"
                 v-if="user == '1' ? true : arr.indexOf(13) != -1">
        </TabPane>
        <TabPane class="leftMargin"
                 label="报表列表"
                 name="7"
                 v-if="user == '1' ? true : arr.indexOf(14) != -1">
        </TabPane>
      </Tabs>
    </div>
    <numberTable ref="numberTable"
                 @numberTable='tabsClick'
                 v-show="resourceNum == 1"></numberTable>
    <triage ref="triage"
            @triage='tabsClick'
            v-show="resourceNum == 2"></triage>
    <depts ref="depts"
           @depts='tabsClick'
           v-show="resourceNum == 3"></depts>
    <menus ref="menu"
           @menu='tabsClick'
           v-show="resourceNum == 8"></menus>
    <reports ref="reports"
             @reports='tabsClick'
             v-show="resourceNum == 7"></reports>
    <drugstore ref="drugstore"
               @drugstore='tabsClick'
               v-show="resourceNum == 4"></drugstore>
    <medicineStorage ref="medicineStorage"
                     @medicineStorage='tabsClick'
                     v-show="resourceNum == 5"></medicineStorage>
    <report ref="report"
            @report='tabsClick'
            v-show="resourceNum == 9"></report>
    <emptys ref="emptys"
            @emptys='tabsClick'
            v-show="resourceNum == 10"></emptys>
  </Row>
</template>
<script>
import numberTable from './number-table'    //号表授权
import triage from './triage'    //分诊室授权
import depts from './depts'    //科室授权
import menus from './menu'    //菜单授权
import reports from './reports'    //报表授权
import drugstore from './drugstore'    //药房授权
import medicineStorage from './medicineStorage'    //药库授权
import report from './report'    //报表列表
import emptys from './emptys'    //如果页面没有权限,显示的空页面
import util from '../../../../libs/util.js'
export default {
  name: 'resource-powernew',
  components: { numberTable, triage, depts, menus, reports, drugstore, medicineStorage, report ,emptys},
  data () {
    return {
      tabsName: '1',  //自定义tab名称
      resourceNum: 1,
      arr: [],
      userList: [],
      user: '',
    }
  },
  mounted () {
    this.userList = this.$store.state.userInfoObj.mapList
    this.user = this.$store.state.userInfoObj.userTypes
    if (this.user != 1) {
      if (this.userList.length == 0) {
        this.resourceNum = 10
        this.$refs.leftTop.style.borderRightWidth = 0
        util.showMsg(this, { warning: '暂无权限!' });
        return;
      }
    } else {
      this.$refs.numberTable.init()
    }
    this.userList.map(item => {
      if (item.resourceParam == 1) {
        this.arr.push(item.resourceId)
      }
    })
  },
  methods: {
    tabsClick (val) {
      if (val != '资源组' && val != '用户') {
        this.tabsName = val + ''
        if (val * 1 === 4) {
          this.resourceNum = 8
          this.$refs.menu.init() //菜单
        } else if (val * 1 === 5) {
          this.resourceNum = 7
          this.$refs.reports.init()   //报表授权
        } else if (val * 1 === 6) {
          this.resourceNum = 4
          this.$refs.drugstore.init() //药房
        } else if (val * 1 === 7) {
          this.resourceNum = 9
          this.$refs.report.init() //报表列表
        } else if (val * 1 === 8) {
          this.resourceNum = 5
          this.$refs.medicineStorage.init() //库房
        } else if (val * 1 === 3) {
          this.resourceNum = 3
          this.$refs.depts.init()  //科室
        } else if (val * 1 === 2) {
          this.resourceNum = 2
          this.$refs.triage.init()    //分诊台
        } else if (val * 1 === 1) {
          this.resourceNum = 1
          this.$refs.numberTable.init() //号表
        }
      }
    },
  }
}
</script>
<style>
.menu-item .ivu-collapse-content {
  overflow: hidden;
  color: #000000;
  padding: 0px 0px;
  background-color: #fff;
}
#tableSelectId::-webkit-scrollbar {
  width: 6px !important;
}
#Rows::-webkit-scrollbar-track {
  background-color: #f5f7f9;
}
#Rows::-webkit-scrollbar-thumb {
  background-color: #ccc !important;
  border-radius: 3px !important;
}
#Rows .ivu-tree ul li {
  padding: 10px 0 8px 0 !important;
  margin: 1px;
}
#Rows .ivu-tree li ul {
  padding: 0px 0 0 0 !important;
}
.room-tree-contentfzts .ivu-tree-children {
  background-color: #dddee1;
  padding: 0px 1px 0 1px !important;
}
.room-tree-contentfzts .ivu-tree-children > li > .ivu-tree-children {
  background-color: #f8f8f8;
  margin: 0px -1px !important;
  padding: 0px 1px 0 1px !important;
}
.room-tree-contentfzts
  .ivu-tree-children
  > li
  > .ivu-tree-children
  > li
  > .ivu-tree-children {
  background-color: #ffffff;
  margin: 0px -1px !important;
  padding: 0px 1px 0 1px !important;
}
.room-tree-contentfzts .ivu-tree-title {
  width: 92.5%;
}
.room-tree-contentfzts .ivu-tree {
  padding: 0px !important;
}

.room-tree-contentdepts .ivu-tree-children {
  /* background-color: #dddee1; */
  background-color: #dddee1;
  padding: 0px 1px 0 1px !important;
}
.room-tree-contentdepts .ivu-tree-children > li > .ivu-tree-children {
  background-color: #f8f8f8;
  margin: 0px -1px !important;
  padding: 0px 1px 0 1px !important;
}
.room-tree-contentdepts
  .ivu-tree-children
  > li
  > .ivu-tree-children
  > li
  > .ivu-tree-children {
  background-color: #ffffff;
  margin: 0px -1px !important;
  padding: 0px 1px 0 1px !important;
}
.room-tree-contentdepts .ivu-tree-title {
  width: 92.5%;
}
.room-tree-contentdepts .ivu-tree {
  padding: 0px !important;
}

.room-tree-contentbbsq .ivu-tree-children {
  /* background-color: #dddee1; */
  background-color: #dddee1;
  padding: 0px 1px 0 1px !important;
}
.room-tree-contentbbsq .ivu-tree-children > li > .ivu-tree-children {
  background-color: #f8f8f8;
  margin: 0px -1px !important;
  padding: 0px 1px 0 1px !important;
}
.room-tree-contentbbsq
  .ivu-tree-children
  > li
  > .ivu-tree-children
  > li
  > .ivu-tree-children {
  background-color: #ffffff;
  margin: 0px -1px !important;
  padding: 0px 1px 0 1px !important;
}
.room-tree-contentbbsq .ivu-tree-title {
  width: 92.5%;
}
.room-tree-contentbbsq .ivu-tree {
  padding: 0px !important;
}

.room-tree-contentwebmenu .ivu-tree-children {
  /* background-color: #dddee1; */
  background-color: #dddee1;
  padding: 0px 1px 0 1px !important;
}
.room-tree-contentwebmenu .ivu-tree-children > li > .ivu-tree-children {
  background-color: #f8f8f8;
  margin: 0px -1px !important;
  padding: 0px 1px 0 1px !important;
}
.room-tree-contentwebmenu
  .ivu-tree-children
  > li
  > .ivu-tree-children
  > li
  > .ivu-tree-children {
  background-color: #ffffff;
  margin: 0px -1px !important;
  padding: 0px 1px 0 1px !important;
}
.room-tree-contentwebmenu .ivu-tree-title {
  width: 92.5%;
}
.room-tree-contentwebmenu .ivu-tree {
  padding: 0px !important;
}

.room-tree-contentcmenu .ivu-tree-children {
  /* background-color: #dddee1; */
  background-color: #dddee1;
  padding: 0px 1px 0 1px !important;
}
.room-tree-contentcmenu .ivu-tree-children > li > .ivu-tree-children {
  background-color: #f8f8f8;
  margin: 0px -1px !important;
  padding: 0px 1px 0 1px !important;
}
.room-tree-contentcmenu
  .ivu-tree-children
  > li
  > .ivu-tree-children
  > li
  > .ivu-tree-children {
  background-color: #ffffff;
  margin: 0px -1px !important;
  padding: 0px 1px 0 1px !important;
}
.room-tree-contentcmenu .ivu-tree-title {
  width: 92.5%;
}
.room-tree-contentcmenu .ivu-tree {
  padding: 0px !important;
}

.room-tree-contentbaob .ivu-tree-children {
  /* background-color: #dddee1; */
  background-color: #dddee1;
  padding: 0px 1px 0 1px !important;
}
.room-tree-contentbaob .ivu-tree-children > li > .ivu-tree-children {
  background-color: #f8f8f8;
  margin: 0px -1px !important;
  padding: 0px 1px 0 1px !important;
}
.room-tree-contentbaob
  .ivu-tree-children
  > li
  > .ivu-tree-children
  > li
  > .ivu-tree-children {
  background-color: #ffffff;
  margin: 0px -1px !important;
  padding: 0px 1px 0 1px !important;
}
.room-tree-contentbaob .ivu-tree-title {
  width: 92.5%;
}
.room-tree-contentbaob .ivu-tree {
  padding: 0px !important;
}
</style>

<style lang="less" scoped>
@import "../../../../styles/common.less";
.bg-whiteclass {
  padding: 13px 17px 0;
  background: #fff;
  height: 100%;
}
.leftMargin {
  margin-left: 10px;
}
.leftMargin ::-webkit-scrollbar {
  width: 6px !important;
}
.leftMargin ::-webkit-scrollbar-track {
  background-color: #f5f7f9;
}
.leftMargin ::-webkit-scrollbar-thumb {
  background-color: #ccc !important;
  border-radius: 3px !important;
}
#selectlIId .ivu-select-dropdown {
  overflow: auto !important;
}
#selectlIId .ivu-select-dropdown .ivu-select-dropdown-list .ivu-select-item {
  overflow-x: hidden !important;
  white-space: nowrap !important;
  text-overflow: ellipsis !important;
}
</style>