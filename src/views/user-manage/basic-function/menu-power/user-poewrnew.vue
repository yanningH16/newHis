<template>
  <Row class="bg-whiteclass"
       id="Rows"
       style="width:100%;height:100%">
    <!-- 左侧数据 -->
    <i-Col span="8"
           id="leftTop"
           class="leftTop">
      <!-- 条件搜索 -->
      <div>
        <span>用户</span>
        <Input v-model.trim="searchObj.textSearch"
               placeholder="请输入姓名或人员编码"
               style="width: 292px;margin-left:20px"
               @on-change="leftBottomTable" />
      </div>
      <Table border
             highlight-row
             :height="tableHightLt"
             stripe
             :columns="columnUser"
             :data="datagroupuser"
             :loading="leftyhLoading"
             @on-row-click="leftBtaleClick"
             style="margin-top:10px"></Table>
    </i-Col>
    <!-- 中间数据 -->
    <i-Col span="8"
           style="height:100%;padding-left:10px;padding-right:10px">
      <div class="classZyz">
        <span class="titleClass">所在资源组</span>
      </div>
      <Table border
             ref="selectiontop"
             highlight-row
             :loading="zyzLoading"
             :height="tableHightMd"
             stripe
             :columns="columnsgroupzy"
             :data="datagroupzy"
             @on-row-click="zyzTableClick"
             style="margin-top:10px"></Table>
      <div class="classZyzBottom">
        <span class="titleClass">所在业务组</span>
      </div>
      <Table border
             ref="selectionBottom"
             highlight-row
             :loading="ywzLoading"
             :height="tableHightMd"
             stripe
             :columns="columnsgroupjs"
             :data="datagroupjs"
             @on-row-click="ywTableClick"
             style="margin-top:10px"></Table>
    </i-Col>
    <!-- 右侧数据 -->
    <i-Col span="8"
           style="height:100%;padding-left:10px;border-left:1px solid #bbbec4;">
      <div class="classZyz">
        <span class="titleClass">已有资源权限</span>
        <Select v-model="zyzposwers"
                style="width:200px"
                @on-change="selectChnage"
                v-if="tableTileshow">
          <Option v-for="(item,index) in zyzposwersList"
                  :value="item.value"
                  :key="index">{{ item.label }}</Option>
        </Select>
      </div>

      <Table border
             highlight-row
             :loading="zyzPoeserLoading"
             :height="tableHightMd"
             stripe
             :columns="columnshavezy"
             :data="datahavezy"
             style="margin-top:10px"></Table>
      <div class="classZyzBottom">
        <span class="titleClass">已有业务权限</span>
      </div>
      <Table border
             :height="tableHightMd"
             :loading="ywzPoeserLoading"
             stripe
             :columns="columnsgroup"
             :data="datagroup"
             style="margin-top:10px"></Table>
    </i-Col>
  </Row>
</template>
<script>
import util from '../../../../libs/util.js'
import Page from '../../../components/page.vue'
export default {
  name: 'user-poewrnew',
  components: { Page },
  data () {
    return {
      animal: '业务组',
      tableTileshow: true,  //已有资源权限下拉框是否显示
      zyzposwers: '',//已有资源权限下拉框显示内容
      searchObj: {   //用户输入框显示内容
        textSearch: ''
      },
      leftyhLoading: false,    //用户列表loading
      zyzLoading: false,      //所在资源组表格loading
      ywzLoading: false,    //所在业务组loading
      ywzPoeserLoading: false,   //已有业务权限loading
      zyzPoeserLoading: false,   //已有资源权限loading
      // 表格高度
      tableHightLt: 300,  //左侧表格高度
      tableHightMd: 300,   //右侧四个表格自定义高度
      // 左上业务组表格
      columnUser: [
        {
          title: '人员编码',
          key: 'personCode',
          align: 'center',
          width: 73
        }, {
          title: '姓名',
          key: 'userName',
          align: 'center',
          width: 90
        }, {
          title: '职务等级',
          key: 'postClassName',
          align: 'center',
        }, {
          title: '科室名称',
          align: 'center',
          key: 'deptName',
        }
      ],
      columnshavezy: [   //已有资源权限表头
        {
          title: '权限类别',
          key: 'resourceType',
          align: 'center',
          width: 120
        }, {
          title: '权限名称',
          key: 'resourceName',
          align: 'center',
        }
      ],
      datahavezy: [],
      // 所在资源组
      columnsgroupzy: [
        {
          title: '资源组ID',
          key: 'groupCode',
          align: 'center',
        }, {
          title: '资源组名称',
          key: 'groupName',
          align: 'center',
        }, {
          title: '组类型',
          key: 'groupTypeName',
          align: 'center',
        }
      ],
      datagroupzy: [],
      // 所在业务组
      columnsgroupjs: [{
        title: '角色组ID',
        key: 'groupCode',
        align: 'center',
      }, {
        title: '角色组名称',
        key: 'groupName',
        align: 'center',
      }, {
        title: '组类型',
        key: 'groupTypeName',
        align: 'center',
      }
      ],
      datagroupjs: [],
      // 已有业务权限
      columnsgroup: [
        {
          title: '业务名称',
          key: 'resourceName',
          width: 120,
          align: 'center',
        }, {
          title: '业务参数设置',
          key: 'resourceParam',
          align: 'center',
          render: (h, params) => {
            let val = params.row.resourceParam * 1 === 1 ? '可以' : '不可以'
            return h('div', {}, val)
          }
        }
      ],
      datagroup: [],
      datahavezyFB: [],
      datagroupuser: [],  //左侧表格数据
      zyzposwersList: [],  //已有资源权限下拉框内容
      ajaxTitle: '',   //选择要触发的接口
      selectTableTop: {},   //所在资源组被点击的数据
      leftUserTable: {},   //左侧表格被点击的数据
      selectTableBottom: {},//所在业务组被点击的数据
    }
  },
  mounted () {
    this.tableHightLt = $("#leftTop").height() - 140;
    this.tableHightMd = ($("#leftTop").height() - 190) / 2;
    this.init()
  },
  watch: {
    zyzposwersList (val) {  //已有资源权下拉框默认选项为第一个
      val.length > 0 ? this.zyzposwers = this.zyzposwersList[0].value : this.zyzposwers = ''
    },
  },
  methods: {
    init () {
      this.leftBottomTable();
    },
    //获取用户表格
    leftBottomTable () {
      let data = {
        searchUser: this.searchObj.textSearch,
        hospitalId: this.$store.state.userInfoObj.hospitalId
      }
      this.leftyhLoading = true
      this.$store.dispatch('getAllUsers', data).then(res => {
        this.leftyhLoading = false
        if (res.data.code === 200) {
          this.datagroupuser = res.data.data.list
          this.datagroupzy = [];
          this.datagroupjs = [];
          this.datagroup = [];
          this.datahavezyFB = []
          this.datahavezy = []
          this.zyzposwersList = []
        } else {
          util.showMsg(this, { diy: res.data.message })
        }
      })
    },
    //获取所在资源组表格
    getZyzData (val) {
      let data = {
        userId: val.userId,
        groupType: "1,2"
      }
      this.zyzLoading = true
      this.$store.dispatch('getUserGroupss', data).then(res => {
        this.zyzLoading = false
        if (res.data.code === 200) {
          this.datagroupzy = res.data.data
        } else {
          util.showMsg(this, { diy: res.data.message })
        }
      })
    },
    zyzTableClick (val) {//根据所在资源组获取已有资源权限表格
      if (this.selectTableTop.groupId === val.groupId) {
        this.$refs.selectiontop.clearCurrentRow();
        this.selectTableTop = {}
        this.getZyzPowserData(this.leftUserTable);
        this.tableTileshow = true
        return
      }
      this.selectTableTop = val
      this.tableTileshow = false
      this.changeList();
      let data = {
        groupId: val.groupId,
        hospitalId: this.$store.state.userInfoObj.hospitalId,
      }
      if (val.resourceType * 1 === 1) {
        this.ajaxTitle = 'getYwzRegistIndexS'
      } else if (val.resourceType * 1 === 2) {
        this.ajaxTitle = 'personalReceptAndConsults'
      } else if (val.resourceType * 1 === 3) {
        this.ajaxTitle = 'deptAuthorizations'
      } else if (val.resourceType * 1 === 4) {
        this.ajaxTitle = 'personalPharms'
      } else if (val.resourceType * 1 === 5) {
        this.ajaxTitle = 'personalPharmRepertorys'
      } else if (val.resourceType * 1 === 6) {
        this.ajaxTitle = 'authorizeInformations' //第三方返回值可能不一样
      } else if (val.resourceType * 1 === 7) {
        this.ajaxTitle = 'customReportAuthorizations'
      } else if (val.resourceType * 1 === 8) {
        this.ajaxTitle = 'menuAuthorizations'
      } else if (val.resourceType * 1 === 9) {
        this.ajaxTitle = 'reportAuthorizations'
      }
      this.zyzPoeserLoading = true
      this.$store.dispatch(this.ajaxTitle, data).then(res => {
        this.zyzPoeserLoading = false
        if (res.data.code === 200) {
          res.data.data.list.map(vals => {
            if (!util.isEmpty(vals.resourceName)) {
              vals.resourceType = val.resourceType
              this.datahavezyFB.push(vals)
            }
          })
          this.selectChnage(val.resourceType)
        } else {
          util.showMsg(this, { diy: res.data.message })
        }
      })
    },
    getZyzPowserData (val) {//获取所在业务组组权限表格
      this.changeList();
      let data = {
        userId: val.userId,
        groupType: '1,2',
        hospitalId: this.$store.state.userInfoObj.hospitalId,
      }
      this.zyzPoeserLoading = true
      this.$store.dispatch('getUserGroupResourcess', data).then(res => {
        this.zyzPoeserLoading = false
        if (res.data.code === 200) {
          res.data.data.list.map(val => {
            if (!util.isEmpty(val.resourceName)) {
              this.datahavezyFB.push(val)
            }
          })
          let i = 0;
          let y = this.datahavezyFB.length;
          for (i; i < y; i++) {
            const index = util.indexOfObject(i, this.datahavezyFB, 'resourceType')
            if (index != -1) {
              if (i === 1) {
                this.zyzposwersList.push({
                  value: '1',
                  label: '号表权限'
                })
              } else if (i === 2) {
                this.zyzposwersList.push({
                  value: '2',
                  label: '分诊台权限'
                })
              } else if (i === 3) {
                this.zyzposwersList.push({
                  value: '3',
                  label: '科室权限'
                })
              } else if (i === 4) {
                this.zyzposwersList.push({
                  value: '4',
                  label: '药房权限'
                })
              } else if (i === 5) {
                this.zyzposwersList.push({
                  value: '5',
                  label: '药库权限'
                })
              } else if (i === 6) {
                this.zyzposwersList.push({
                  value: '6',
                  label: '第三方系统权限'
                })
              } else if (i === 7) {
                this.zyzposwersList.push({
                  value: '7',
                  label: '自定义报表权限'
                })
              } else if (i === 8) {
                this.zyzposwersList.push({
                  value: '8',
                  label: '菜单权限'
                })
              } else if (i === 9) {
                this.zyzposwersList.push({
                  value: '9',
                  label: 'C#报表权限'
                })
              }
            }
          }
        } else {
          util.showMsg(this, { diy: res.data.message })
        }
      })
    },
    getYwzData (val) {    //获取所在业务组表格
      let data = {
        userId: val.userId,
        groupType: "3,4"
      }
      this.ywzLoading = true
      this.$store.dispatch('getUserGroupss', data).then(res => {
        if (res.data.code === 200) {
          if (res.data.data != null) {
            this.datagroupjs = res.data.data.list
          } else {
            this.datagroupjs = []
          }
        } else {
          util.showMsg(this, { diy: res.data.message })
        }
        this.ywzLoading = false
      })
    },
    ywTableClick (val) {    //根据所在业务组获取所在业务组权限表格
      if (this.selectTableBottom.groupId === val.groupId) {
        this.$refs.selectionBottom.clearCurrentRow();
        this.selectTableBottom = {}
        this.getYwzPowserData(this.leftUserTable);
        return
      }
      this.selectTableBottom = val
      let data = {
        groupId: val.groupId,
        hospitalId: this.$store.state.userInfoObj.hospitalId,
      }
      this.ywzPoeserLoading = true
      this.$store.dispatch('getbusinessPermissionS', data).then(res => {
        if (res.data.code === 200) {
          this.datagroup = res.data.data.list
        } else {
          util.showMsg(this, { diy: res.data.message })
        }
        this.ywzPoeserLoading = false
      })
    },
    getYwzPowserData (val) {    //获取所在业务组权限表格
      let data = {
        userId: val.userId,
        groupType: '3,4',
        hospitalId: this.$store.state.userInfoObj.hospitalId,
      }
      this.ywzPoeserLoading = true
      this.$store.dispatch('getUserGroupResourcess', data).then(res => {
        if (res.data.code === 200) {
          this.datagroup = res.data.data.list
        } else {
          util.showMsg(this, { diy: res.data.message })
        }
        this.ywzPoeserLoading = false
      })
    },
    leftBtaleClick (val, index) {    //点击左侧表格
      this.tableTileshow = true
      this.getYwzData(val);
      this.getZyzData(val);
      this.getYwzPowserData(val);
      this.getZyzPowserData(val);
      this.leftUserTable = val
    },
    selectChnage (val, lable) {       //已有资源权限下拉框修改事件
      if (!util.isEmpty(val)) {
        this.zyzPoeserLoading = true
        this.datahavezy = []
        let arry = {}
        let title = ''
        if (val * 1 == 1) {
          title = '号表权限'
        } else if (val * 1 == 2) {
          title = '分诊台权限'
        } else if (val * 1 == 3) {
          title = '科室权限'
        } else if (val * 1 == 4) {
          title = '药房权限'
        } else if (val * 1 == 5) {
          title = '药库权限'
        } else if (val * 1 == 6) {
          title = '第三方系统权限'
        } else if (val * 1 == 7) {
          title = '自定义报表权限'
        } else if (val * 1 == 8) {
          title = '菜单权限'
        } else if (val * 1 == 9) {
          title = 'C#报表权限'
        }
        this.datahavezyFB.map(vals => {
          if (vals.resourceType * 1 === val * 1) {
            arry = vals
            arry.resourceType = title
            this.datahavezy.push(arry)
          }
        })
        this.zyzPoeserLoading = false
      }
    },
    changeList () {  //清空数据
      this.datahavezyFB = []
      this.zyzposwersList = []
      this.datahavezy = []
    },
  }
}
</script>
<style>
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
.leftTop {
  height: 100%;
  border-right: 1px solid #bbbec4;
  padding-right: 10px;
}
.classZyz {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.classZyzBottom {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 10px;
}
.titleClass {
  color: #ffffff;
  font-size: 14px;
  font-weight: bold;
  background-color: #2db7f5;
  padding: 5px 8px;
}
// .rescourceForm .ivu-form-item{
//     display: flex !important;
//     justify-content: flex-start !important;
//   }
// .powerTableBox {
//   height: 80%;
// }
// // input{
// //     overflow: auto;
// // }

// #leftTab {
//   height: calc(100vh - 25px);
// }
//
</style>
// <style lang="less">
// .ivu-page-simple .ivu-page-simple-pager input {
//   width: 45px !important;
// }
// #leftTab ::-webkit-scrollbar {
//   width: 6px !important;
// }
// #leftTab ::-webkit-scrollbar-track {
//   background-color: #f5f7f9;
// }
// #leftTab ::-webkit-scrollbar-thumb {
//   background-color: #ccc !important;
//   border-radius: 3px !important;
// }
</style>