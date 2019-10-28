<template>
  <div class="bg-white">
    <!-- 参数设置 -->
    <div class="control-group"
         style="margin-top:10px">
      <Row class="area-linkage-page-row2">
        <Input v-model.trim="searchObj.searchText"
               placeholder="请输入参数名称或参数名称说明"
               style="width: 20%"
               ref="opertext"
               @keyup.native.enter="cleanSearch" />
        <Button type="primary"
                style="margin-left:5px"
                @click="cleanSearch">
          <i class="iconfont iconchaxun"></i>&#8194;查询
        </Button>
      </Row>

    </div>
    <div style="margin:10px 0;"
         id="tableBox">
      <Table :loading="loading"
             stripe
             border
             :columns="isAdmin?tableObj.adminAllList:tableObj.elseAllList"
             :data="tableObj.allData"
             :height="tabHeight"></Table>
    </div>
    <div style="padding-bottom:10px;float: right;">
      <Page @Page="changPage"
            :tabpage="pages.tabPage" />
    </div>
    <!-- 修改弹框 -->
    <Modal v-model="vShow.updMod"
           title="修改参数信息"
           :closable="false"
           :mask-closable="false">
      <div slot="footer">
        <Button type="text"
                size="large"
                @click="vShow.updMod = false">取消</Button>
        <Button type="primary"
                size="large"
                @click="updParameter">保存</Button>
      </div>
      <div style="margin-left:45px">
        <Form ref="formValidate"
              :model="formObj"
              :label-width="80">
          <Form-item label="是否为空"
                     prop="nullFlag">
            <Checkbox v-model="formObj.nullFlag"
                      @on-change="flagChange"
                      style="display: inline-block"></Checkbox>
          </Form-item>
          <FormItem label="参数名称">
            <Input v-model.trim="formObj.paramName"
                   disabled
                   placeholder="请输入参数名称"
                   style="width: 300px" />
          </FormItem>
          <FormItem label="名称说明"
                    prop="paramNameDesc">
            <Input v-model.trim="formObj.paramNameDesc"
                   disabled
                   placeholder="请输入名称说明"
                   style="width: 300px" />
          </FormItem>
          <Form-item label="参数结果"
                     class='paramValue'>
            <Input v-model.trim="formObj.paramValue"
                   placeholder="请输入参数结果"
                   style="width: 300px"
                   @on-focus="paramNameWarn = false" />
            <span class="warn-text"
                  v-if='paramNameWarn'>请输入参数结果</span>
          </Form-item>
          <FormItem label="结果说明"
                    prop="paramValueDesc">
            <Input v-model.trim="formObj.paramValueDesc"
                   disabled
                   placeholder="请输入结果说明"
                   style="width: 300px" />
          </FormItem>
          <FormItem label="业务系统"
                    prop="useAppList">
            <Input v-model.trim="formObj.useAppList"
                   disabled
                   placeholder="请输入业务系统"
                   style="width: 300px" />
          </FormItem>
        </Form>
      </div>
    </Modal>
    <!-- 停用删除确认 -->
    <comfirmDeletion :show="vShow.showStop"
                     :msg="vShow.stopMsg"
                     title='警告'
                     :btntext='vShow.stopBtnText'
                     @ok="isStopChange"
                     @close="vShow.showStop=false" />
  </div>
</template>

<script>
import util from '../../../../libs/util.js';
import Page from '../../../components/page.vue';
import comfirmDeletion from '../../../components/confirmDeletion.vue';
export default {
  components: { Page, comfirmDeletion },
  name: 'system-parameter',
  data () {
    return {
      tabHeight: '',   //表格自定义高度
      loading: true,   //表格loading效果
      pages: {        //分页
        page: 1,
        tabPage: 1,
        pageSelf: 1
      },
      vShow: {
        updMod: false,  //修改弹框显示
        showStop: false,  //停用弹框是否显示
        stopBtnText: '',  //停用弹框按钮
        stopMsg: '',   //停用弹框内容
      },
      // 列表内容
      tableObj: {
        adminAllList: [
          {
            title: '参数名称',
            key: 'paramName',
            width: 160
          },
          {
            title: '参数名称说明',
            key: 'paramNameDesc',
            width: 200,
          },
          {
            title: '参数结果',
            key: 'paramValue',
            width: 90,
            render: (h, params) => {
              return h('Poptip', {
                props: {
                  trigger: 'hover',
                  placement: 'top-start',
                  width: 300
                }
              }, [
                h('span', {
                  style: {
                    display: 'inline-block',
                    width: '100%',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap'
                  }
                }, params.row.paramValue),
                h('span', {
                  slot: 'content',
                  style: {
                    whiteSpace: 'normal',
                    wordBreak: 'break-all',
                    whiteSpace: 'normal'
                  }
                }, params.row.paramValue)
              ])
            }
          },
          {
            title: '说明',
            key: 'paramValueDesc',
          },
          {
            title: '业务系统',
            key: 'useAppList',
            width: 80
          },
          {
            title: '状态',
            key: 'stopFlagStr',
            align: 'center',
            width: 100
          },
          {
            title: '操作',
            key: ' ',
            width: 100,
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
                      class: util.icon.modify,
                      style: {
                        marginRight: '16px',
                        verticalAlign: 'middle',
                      },
                      on: {
                        click: () => {
                          this.formObj.deptId = ''
                          this.transforVal(params.row)
                          this.vShow.updMod = true
                        }
                      }
                    }),
                    h(
                      'div',
                      {
                        slot: 'content'
                      },
                      '修改'
                    )
                  ]
                ),
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
                      class: params.row.stopFlag == 0 ? util.icon.stop : util.icon.start,
                      style: {
                        verticalAlign: 'middle',
                      },
                      on: {
                        click: () => {
                          // 停用
                          this.stopClick(params.row)
                        }
                      }
                    }),
                    h(
                      'div',
                      {
                        slot: 'content'
                      },
                      params.row.stopFlag == 0 ? '停用' : '启用'
                    )
                  ]
                ),
              ])
            }
          }
        ],
        elseAllList: [
          {
            title: '参数名称',
            key: 'paramName',
            width: 160
          },
          {
            title: '参数名称说明',
            key: 'paramNameDesc',
            width: 200
          },
          {
            title: '参数结果',
            key: 'paramValue',
            width: 90,
            render: (h, params) => {
              return h('Poptip', {
                props: {
                  trigger: 'hover',
                  placement: 'top-start',
                  width: 300
                }
              }, [
                h('span', {
                  style: {
                    display: 'inline-block',
                    width: '100%',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap'
                  }
                }, params.row.paramValue),
                h('span', {
                  slot: 'content',
                  style: {
                    whiteSpace: 'normal',
                    wordBreak: 'break-all',
                    whiteSpace: 'normal'
                  }
                }, params.row.paramValue)
              ])
            }
          },
          {
            title: '说明',
            key: 'paramValueDesc',
          },
          {
            title: '业务系统',
            key: 'useAppList',
            width: 80
          },
          {
            title: '状态',
            key: 'stopFlagStr',
            align: 'center',
            width: 100
          },
        ],
        allData: [],
      },
      formObj: {  //修改弹框form表单内容
        deptList: [],
        paramName: '',
        paramNameDesc: '',
        deptId: '',
        paramValue: '',
        paramValueDesc: '',
        dataVersion: '',
        paramId: '',
        stopFlag: '',
        nullFlag: null
      },
      searchObj: {  //输入框
        searchText: '',
        isSearch: false,
      },
      paramNameWarn: false,  //输入结果是否为空
      isAdmin: false,
      pagesize: 0,
    }
  },
  mounted () {
    this.init();
    if (this.formObj.nullFlag) {  //如果弹框是否为空 没有被勾选，输入参数结果
      $('.paramValue').addClass('required-value')
    }
    this.isAdmin = this.$store.state.userInfoObj.userTypes === '1' ? true : false
  },
  destroyed () {
    $('.paramValue').removeClass('required-value')
  },
  methods: {
    init () {
      this.tabHeight = $("#tableBox").height();
      this.pagesize = parseInt(this.tabHeight / 40);
      //获取表格数据
      const oldnowData = {
        "searchParam": this.searchObj.searchText,
        page: this.pages.page,
        size: this.pagesize
      }
      this.loading = true;
      this.$store.dispatch('getListBySearchParam', oldnowData).then(res => {
        this.loading = false
        if (res.data.code === 200) {
          this.pages.tabPage = res.data.data.pages
          let deptParams = {
            deptType: 1
          }
          res.data.data.list.map((val, i) => {
            val.stopFlag == 0 ? val.stopFlagStr = '启用' : val.stopFlagStr = '停用'
          })
          this.tableObj.allData = res.data.data.list
        } else {
          util.showMsg(this, { diy: res.data.message })
        }
      })
    },
    updParameter () {   //修改弹框保存事件
      if (!this.formObj.nullFlag) {
        if (!this.formObj.paramValue) {
          this.paramNameWarn = true
          return
        }
      }
      const data = {
        nullFlag: this.formObj.nullFlag ? '1' : '0',
        stopFlag: this.formObj.stopFlag,
        paramValue: this.formObj.paramValue || util.globalVariable.isNullStr,
        dataVersion: this.formObj.dataVersion,
        paramId: this.formObj.paramId
      }
      this.$store.dispatch('ajaxUpdParameter', data).then(res => {
        if (res.data.code === 200) {
          util.showMsg(this, { succ: '修改成功' })
          this.init();
          if (this.formObj.paramName == 'timeOut') {
            localStorage.setItem('timeOut', this.formObj.paramValue);
          }
        } else {
          util.showMsg(this, { diy: res.data.message });
        }
      })
      this.vShow.updMod = false
      this.vShow.showStop = false
    },
    transforVal (item) {   //传递数据
      this.clearFormObj()
      this.formObj.paramName = item.paramName
      this.formObj.paramNameDesc = item.paramNameDesc
      this.formObj.deptId = item.deptId
      this.formObj.paramValue = item.paramValue
      this.formObj.paramValueDesc = item.paramValueDesc
      this.formObj.dataVersion = item.dataVersion
      this.formObj.paramId = item.paramId
      this.formObj.stopFlag = item.stopFlag
      this.formObj.nullFlag = item.nullFlag === '1' ? true : false
      this.formObj.useAppList = item.useAppList
    },
    clearFormObj () {   //清除弹框数据
      this.formObj.paramName = ''
      this.formObj.paramNameDesc = ''
      this.formObj.deptId = ''
      this.formObj.paramValue = ''
      this.formObj.paramValueDesc = ''
      this.formObj.dataVersion = ''
      this.formObj.paramId = ''
      this.formObj.stopFlag = ''
      this.formObj.nullFlag = ''
    },
    stopClick (item) {  //点击停用事件
      this.transforVal(item)
      this.vShow.stopBtnText = item.stopFlag == 0 ? '停用' : '启用'
      this.vShow.stopMsg = item.stopFlag == 0 ? '确定要停用【' + item.paramName + '】吗？' : '确定要启用【' + item.paramName + '】吗？'
      this.vShow.showStop = true
    },
    isStopChange () {  //停用弹框确定事件
      this.formObj.stopFlag = this.formObj.stopFlag == 0 ? 1 : 0
      this.updParameter()
    },
    changPage (Page) {  //分页
      this.pages.page = Page
      this.init()
      if (this.searchObj.searchText != '') {
        this.searchObj.isSearch = true
      } else {
        this.searchObj.isSearch = false
      }
    },
    cleanSearch () {  //查询事件
      this.pages.page = 1
      this.pages.tabPage = 1
      this.init()
    },
    flagChange (val) {  //弹框是否为空
      if (!val) {
        $('.paramValue').addClass('required-value')
      } else {
        $('.paramValue').removeClass('required-value')
      }
      this.paramNameWarn = false
    }
  },
};
</script>
<style scoped lang="less">
@import "../../../../styles/common.less";
.cursor {
  margin: 4px 8px;
  text-align: center;
  width: 80px;
  height: 35px;
  border-radius: 6px;
  float: left;
}
.inhover {
  background-color: #c9d3c0;
}
.ivu-form-item-error-tip {
  position: absolute;
  top: 100%;
  left: 90px;
  line-height: 1;
  padding-top: 6px;
  color: #f30;
}
#tableBox {
  height: calc(100vh - 25px);
}
</style>
<style>
.required-value .ivu-form-item-label::after {
  content: "*";
  display: inline-block;
  margin-left: 5px;
  color: red;
}
.paramValue .warn-text {
  position: absolute;
  left: 90px;
  top: 29px;
  color: red;
}

#tableBox ::-webkit-scrollbar {
  width: 6px !important;
}
#tableBox ::-webkit-scrollbar-track {
  background-color: #f5f7f9;
}
#tableBox ::-webkit-scrollbar-thumb {
  background-color: #ccc !important;
  border-radius: 3px !important;
}
</style>

