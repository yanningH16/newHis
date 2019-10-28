<template>
  <div class="bg-whiteclass price-list"
       style="width:100%;height:100%">
    <!-- 上部搜索 -->
    <div class=""
         style="display:flex">
      <Input v-model.trim="seach.text"
             placeholder="拼音码/名称/物价码"
             @on-change="itemSearch"
             style="width: 230px" />
      <span style="line-height:32px;font-size:14px;margin-left:10px;margin-right:2px">项目类别</span>
      <Select v-model="seach.itemClass"
              clearable
              style="width:200px"
              @on-clear="delSelset"
              @on-change="itemSearch">
        <Option v-for="item in seach.itemClassList"
                :value="item.id"
                :key="item.id">{{ item.name }}</Option>
      </Select>
      <Checkbox v-model="seach.single"
                @on-change="itemSearch"
                style="line-height:34px;margin-left:12px">显示全部</Checkbox>
      <Button type="primary"
              size="small"
              @click="itemSearch"><i class="iconfont icon-chaxun"></i>&#8194;查询</Button>
      <div id="btn"
           style="width: 70px;">
        <Button type="primary"
                size="small"
                style="margin-right:10px"
                @click="formAdd"><i class="iconfont icon-tianjia"
             style="font-size:14px"></i>&#8194;新增
        </Button>
      </div>
    </div>
    <!-- 上部表格 -->
    <div style="margin-top:10px;border-bottom:2px solid #e9e9e9;"
         class="tableBox"
         ref="tableBox">
      <Table :loading="loading"
             highlight-row
             disabled-hover
             ref="currentRowTableTop"
             stripe
             :columns="tableTop.columnsTop"
             :data="tableTop.dataTop"
             :height="topTableHeight"
             @on-row-click="getAlias"></Table>
      <div style="padding-bottom:10px;margin-top:10px;float: right;">
        <Page @Page="changPage"
              :tabpage="pages.tabPage" />
      </div>
    </div>
    <!-- 下部模块 -->
    <div style="height:300px;padding-top:14px">
      <div id="btn">
        <Button type="primary"
                size="small"
                style="margin-right:10px"
                @click="bottomAdd"><i class="iconfont icon-tianjia"
             style="font-size:14px"></i>&#8194;新增
        </Button>
      </div>
      <Tabs type="card"
            @on-click='tabsClick'
            v-model="bottomData.tabs">
        <TabPane label="别名"
                 name="别名">
        </TabPane>
        <TabPane label="执行科室"
                 name="执行科室">
        </TabPane>
      </Tabs>
      <div v-show="bottomData.tabs=='别名'">
        <Table highlight-row
               disabled-hover
               ref="currentRowTable"
               stripe
               height="150"
               :loading="bottomLoading.left"
               :columns="bottomData.columnsBto"
               :data="bottomData.dataBto"></Table>
      </div>
      <div v-show="bottomData.tabs=='执行科室'">
        <Table highlight-row
               disabled-hover
               ref="currentRowTable"
               stripe
               height="150"
               :loading="bottomLoading.right"
               :columns="bottomData.columnsDept"
               :data="bottomData.dataDept"></Table>
      </div>
    </div>
    <!-- 更新价表 -->
    <Modal v-model="formAddOrUpd.isShow"
           :closable="false"
           width="700px"
           :mask-closable="false">
      <div slot="footer">
        <Button type="text"
                size="large"
                @click="updPriceCencal">取消</Button>
        <Button type="primary"
                size="large"
                @click="formAddOrUpdSave">保存</Button>
      </div>
      <Form ref="addOrUpd"
            :model="formAddOrUpd.data"
            :rules="formAddOrUpd.rule"
            :label-width="100">
        <Row>
          <i-Col span="12">
            <FormItem label="项目编码"
                      prop="itemCode">
              <Input v-model.trim="formAddOrUpd.data.itemCode"
                     disabled
                     style="width:200px" />
            </FormItem>
          </i-Col>
          <i-Col span="12">
            <FormItem label="项目类别"
                      prop="classType">
              <Select v-model="formAddOrUpd.data.classType"
                      filterable
                      clearable
                      style="width:200px">
                <Option v-for="item in formAddOrUpd.data.classTypeList"
                        :value="item.id"
                        :key="item.id">{{item.name}}</Option>
              </Select>
            </FormItem>
          </i-Col>
        </Row>
        <!-- </div>  -->
        <FormItem label="项目名称"
                  prop="itemName">
          <Input v-model.trim="formAddOrUpd.data.itemName"
                 style="width:560px;padding-right:25px;" />
        </FormItem>
        <Row>
          <i-Col span="12">
            <FormItem label="项目规格"
                      prop="itemSpec">
              <Input v-model.trim="formAddOrUpd.data.itemSpec"
                     style="width:200px" />
            </FormItem>
          </i-Col>
          <i-Col span="12">
            <FormItem label="项目单位"
                      prop="unit">
              <longrangesearchselectElse direction='bottom'
                                         :vModel.sync='selectSerachParam'
                                         value="datavalueId"
                                         label='dataValueRemark'
                                         style="width:200px"
                                         :spinShow='spinShow'
                                         :selectOptionsPage.sync='selectOptionsPage'
                                         :propOptions.sync='selectOptionsLists'
                                         @currObject='selectObject'
                                         @getSelectOptions='getSelectOptionsFun'>
              </longrangesearchselectElse>
            </FormItem>
          </i-Col>
        </Row>
        <Row>
          <i-Col span="12">
            <FormItem label="物价编码"
                      prop="unitCode">
              <Input v-model.trim="formAddOrUpd.data.unitCode"
                     style="width:200px" />
            </FormItem>
          </i-Col>
          <i-Col span="12">
            <FormItem label="单价"
                      prop="price">
              <InputNumber :max="1000000000000000000"
                           v-model="formAddOrUpd.data.price"
                           :step="1.00"
                           style="width:200px"></InputNumber>
            </FormItem>
          </i-Col>
        </Row>
        <Row>
          <i-Col span="12">
            <FormItem label="门诊收据"
                      prop="outpRcptTypeId">
              <longrangesearchselectElse direction='bottom'
                                         :vModel.sync='selectSerachParamsj'
                                         value="datavalueId"
                                         label='dataValueRemark'
                                         style="width:200px"
                                         :spinShow='spinShowsj'
                                         :selectOptionsPage.sync='selectOptionsPagesj'
                                         :propOptions.sync='selectOptionsListsj'
                                         @currObject='selectObjectsj'
                                         @getSelectOptions='getSelectOptionsFunsj'>
              </longrangesearchselectElse>
            </FormItem>
          </i-Col>
          <i-Col span="12">
            <FormItem label="住院收据"
                      prop="inpRcptTypeId">
              <longrangesearchselectElse direction='bottom'
                                         :vModel.sync='selectSerachParamsjs'
                                         value="datavalueId"
                                         label='dataValueRemark'
                                         style="width:200px"
                                         :spinShow='spinShowsjs'
                                         :selectOptionsPage.sync='selectOptionsPagesjs'
                                         :propOptions.sync='selectOptionsListsjs'
                                         @currObject='selectObjectsjs'
                                         @getSelectOptions='getSelectOptionsFunsjs'>
              </longrangesearchselectElse>
            </FormItem>
          </i-Col>
        </Row>
        <Row>
          <i-Col span="12">
            <FormItem label="首页类别"
                      prop="mrTypeId">
              <longrangesearchselectElse direction='bottom'
                                         :vModel.sync='selectSerachParamlb'
                                         value="datavalueId"
                                         label='dataValueRemark'
                                         style="width:200px"
                                         :spinShow='spinShowlb'
                                         :selectOptionsPage.sync='selectOptionsPagelb'
                                         :propOptions.sync='selectOptionsListlb'
                                         @currObject='selectObjectlb'
                                         @getSelectOptions='getSelectOptionsFunlb'>
              </longrangesearchselectElse>
            </FormItem>
          </i-Col>
          <i-Col span="12">
            <FormItem label="中医首页类别"
                      prop="mrTcmTypeId">
              <longrangesearchselectElse direction='bottom'
                                         :vModel.sync='selectSerachParamlbs'
                                         value="datavalueId"
                                         label='dataValueRemark'
                                         style="width:200px"
                                         :spinShow='spinShowlbs'
                                         :selectOptionsPage.sync='selectOptionsPagelbs'
                                         :propOptions.sync='selectOptionsListlbs'
                                         @currObject='selectObjectlbs'
                                         @getSelectOptions='getSelectOptionsFunlbs'>
              </longrangesearchselectElse>
            </FormItem>
          </i-Col>
        </Row>
        <FormItem label="备注"
                  prop="memo">
          <Input v-model.trim="formAddOrUpd.data.memo"
                 style="width:94%" />
        </FormItem>
        <Row>
          <i-Col span="12">
            <FormItem label="拼音码"
                      prop="pyCode">
              <Input v-model.trim="formAddOrUpd.data.pyCode"
                     style="width:200px" />
            </FormItem>
          </i-Col>
          <i-Col span="12">
            <FormItem label="五笔码"
                      prop="wbCode">
              <Input v-model.trim="formAddOrUpd.data.wbCode"
                     style="width:200px" />
            </FormItem>
          </i-Col>
        </Row>

      </Form>
    </Modal>
    <!-- 停用确认 -->
    <comfirmDeletion :show="showModal.showStop"
                     :msg="showModal.stopMsg"
                     title='警告'
                     :btntext='showModal.stopBtnText'
                     @ok="change"
                     @close="showModal.showStop=false" />
    <!-- 更新别名 -->
    <Modal v-model="formAddOrUpd.bottomData.showModal"
           :closable="false"
           width="500px"
           :mask-closable="false">
      <div slot="footer">
        <Button type="text"
                size="large"
                @click="formAddOrUpd.bottomData.showModal = false">取消</Button>
        <Button type="primary"
                size="large"
                @click="addAliasSave">保存</Button>
      </div>
      <Form class="formClass"
            ref="addOrUpdAlias"
            :model="formAddOrUpd.bottomData"
            :rules="formAddOrUpd.ruleBto"
            :label-width="50">
        <Row>
          <i-Col span="24">
            <FormItem label="名称"
                      prop="itemName"
                      class='item-name-form-item'>
              <Input v-model.trim="formAddOrUpd.bottomData.itemName"
                     style="width:384px" />
            </FormItem>
          </i-Col>
        </Row>
        <Row>
          <i-Col span="12">
            <FormItem label="拼音码"
                      prop="pyCode">
              <Input v-model.trim="formAddOrUpd.bottomData.pyCode"
                     style="width:150px" />
            </FormItem>
          </i-Col>
          <i-Col span="12">
            <FormItem label="五笔码"
                      prop="wbCode">
              <Input v-model.trim="formAddOrUpd.bottomData.wbCode"
                     style="width:150px" />
            </FormItem>
          </i-Col>
        </Row>
      </Form>
    </Modal>
    <!-- 更新执行科室 -->
    <Modal v-model="bottomData.showModal"
           :closable="false"
           width="500px"
           :mask-closable="false">
      <div slot="footer">
        <Button type="text"
                size="large"
                @click="bottomData.showModal = false">取消</Button>
        <Button type="primary"
                size="large"
                @click="addDeptSave">保存</Button>
      </div>
      <Form ref="updDept"
            :rules="bottomData.rule"
            :model="bottomData"
            :label-width="100"
            style="margin-top:15px">
        <FormItem label="选择科室"
                  prop="dept"
                  class='dept-form-item'>
          <longrangesearchselectElse direction='bottom'
                                     :vModel.sync='selectSerachParamks'
                                     value="deptId"
                                     label='deptName'
                                     style="width:350px"
                                     :spinShow='spinShowks'
                                     :selectOptionsPage.sync='selectOptionsPageks'
                                     :propOptions.sync='selectOptionsListks'
                                     @currObject='selectObjectks'
                                     @getSelectOptions='getSelectOptionsFunks'>
          </longrangesearchselectElse>
        </FormItem>
      </Form>
    </Modal>
  </div>
</template>
<script>
import util from '../../../../libs/util.js';
import Page from '../../../components/page.vue';
import qs from 'qs';
import comfirmDeletion from '../../../components/confirmDeletion.vue';
import longrangesearchselectElse from '../../../components/long-range-search-select-else'
import confirmDeletionVue from '../../../components/confirmDeletion.vue';
export default {
  name: 'price-list',
  components: { comfirmDeletion, Page, longrangesearchselectElse },
  data () {
    const valideDept = (rule, value, callback) => {
      if (this.bottomData.nowDept == null || this.bottomData.nowDept == '') {
        callback(new Error('请选择执行科室'));
      } else {
        callback();
      }
    };
    return {
      bottomLoading: {
        left: false,
        right: false
      },
      topTableHeight: '',
      loading: true,
      pages: {
        page: 1,
        tabPage: 1,
        pageSelf: 1,
        size: 15,
      },
      seach: {//上部搜素
        text: '',
        itemClass: '',
        itemClassList: [],
        single: false
      },
      showModal: {
        showStop: false,
        stopMsg: '',
        stopBtnText: '停用',
      },
      tableTop: {//上表信息
        columnsTop: [
          {
            title: '项目编码',
            key: 'itemCode',
            align: 'center',
            width: 100
          }, {
            title: '项目类别',
            key: 'itemClassName',
            align: 'center',
            width: 80
          }, {
            title: '项目名称',
            key: 'itemName',
            align: 'left',
            width: 140,
          }, {
            title: '项目规格',
            key: 'itemSpec',
            align: 'left',
            width: 80
          }, {
            title: '项目单位',
            key: 'unit',
            align: 'left',
            width: 80
          }, {
            title: '单价',
            key: 'price',
            align: 'right',
            width: 70
          }, {
            title: '物价编号',
            key: 'unitCode',
            align: 'center',
            width: 80
          }, {
            title: '开始时间',
            key: 'startDate',
            align: 'center',
            width: 130
          }, {
            title: '结束时间',
            key: 'stopDate',
            align: 'center',
            width: 130
          }, {
            title: '备注',
            key: 'memo',
            align: 'left',
          }, {
            title: '操作',
            key: 'del',
            align: 'center',
            width: 70,
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
                      class: util.icon.modifyNew,
                      style: {

                        verticalAlign: 'middle',
                        fontSize: '20px',
                        marginRight: '10px'
                      },
                      on: {
                        click: () => {
                          this.showModal.stopBtnText = '修改'
                          this.fromUpd(params.row);
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
                ), h(
                  'Poptip',
                  {
                    props: {
                      trigger: 'hover',
                      placement: 'top'
                    }
                  },
                  [
                    h('i', {
                      class: params.row.startFlag == '1' ? util.icon.stop : util.icon.start,
                      style: {
                        verticalAlign: 'middle',
                        fontSize: '20px'
                      },
                      on: {
                        click: () => {
                          if (params.row.startFlag == '1') {
                            this.formAddOrUpd.isStart = false
                            this.fromStop(params.row);
                          } else {
                            this.formAddOrUpd.isStart = true
                            this.fromStart(params.row);
                          }
                        }
                      }
                    }),
                    h(
                      'div',
                      {
                        slot: 'content'
                      },
                      params.row.stopDate == null || Date.parse(params.row.stopDate.replace("-", "/")) > new Date() ? '停用' : '启用',
                    )
                  ]
                )
              ]);
            }
          }],
        dataTop: [],
      },
      currObj: {},  //当前选中的项目
      bottomData: {//下部模块data
        nowDept: this.$store.state.userInfoObj.deptId,//当前选定的科室
        deptDefult: false,//执行科室默认
        performeDeptId: '',//执行科室唯一id
        dataVersion: '',//执行科室版本
        allDept: [],//全部科室
        tabs: '别名',
        columnsBto: [//别名表头
          {
            title: '序号',
            type: 'index',
            align: 'center',
            width: 50
          }, {
            title: '名称',
            key: 'itemName',
            align: 'left',
            width: 600
          }, {
            title: '正名',
            key: 'formalFlag',
            align: 'center',
          }, {
            title: '拼音码',
            key: 'pyCode',
            align: 'center',
          }, {
            title: '五笔码',
            key: 'wbCode',
            align: 'center',
          }, {
            title: '操作',
            key: ' ',
            align: 'center',
            width: 80,
            render: (h, params) => {
              let style
              if (params.row.formalFlag === '否') {
                style = {
                  lineHeight: "1",
                  cursor: "pointer",
                  color: "#2D8CF0",
                  marginRight: '3px'
                }
              } else {
                style = {
                  lineHeight: "1",
                  cursor: "no-drop",
                  color: "#9ea7b3",
                  marginRight: '3px'
                }
              }
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
                      class: util.icon.modifyNew,
                      style: style,
                      on: {
                        click: () => {
                          if (params.row.formalFlag === '否') {
                            this.aliasUpd(params.row);
                          }
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
                ), h(
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
                      style: style,
                      on: {
                        click: () => {
                          if (params.row.formalFlag === '否') {
                            this.showModal.stopBtnText = '删除';
                            this.aliasStop(params.row);
                          }
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
        dataBto: [],
        formalFlag: { '0': '否', '1': '是' },
        columnsDept: [//科室表头
          {
            title: '序号',
            type: 'index',
            align: 'center',
            width: 50
          }, {
            title: '科室',
            key: 'deptName',
            align: 'left',
          }, {
            title: '操作',
            key: ' ',
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
                      class: util.icon.modifyNew,
                      style: {
                        verticalAlign: 'middle',
                        fontSize: '20px',
                        marginRight: '10px'
                      },
                      on: {
                        click: () => {
                          this.deptUpd(params.row);
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
                ), h(
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
                        fontSize: '20px'
                      },
                      on: {
                        click: () => {
                          this.showModal.stopBtnText = '删除';
                          this.deptStop(params.row);
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
                ),
              ]);
            }
          }],
        dataDept: [],
        showModal: false,
        rule: { dept: [{ required: true, validator: valideDept, trigger: 'change' }] }
      },
      formAddOrUpd: {//新增修改表单
        isShow: false,
        data: {//上部新增表单数据
          itemCode: '',//项目编码
          classType: '',//项目类别
          classTypeList: [],//项目类别数组
          itemName: '',//项目名称
          itemSpec: '',//项目规格
          unit: '',//项目单位
          unitCode: '',//物价编码
          price: 0.00,//单价
          outpRcptTypeId: '',//门诊收据
          inpRcptTypeId: '',//住院收据
          mrTypeId: '',//首页类别
          mrTcmTypeId: '',//中医首页类别
          memo: '',//备注
          wbCode: '',
          pyCode: '',
          dataVersion: '',
          priceItemId: '',
          stopDate: '',
          startFlag: null,
        },
        rule: {//上部新增校验数据
          classType: [{ required: true, message: '  ', trigger: 'change' }],
          itemName: [{ required: true, message: '  ', trigger: 'blur' }],
          itemSpec: [{ required: true, message: '  ', trigger: 'blur' }],
          unit: [{ required: true, message: '  ', trigger: 'change' }],
          unitCode: [{ required: false, message: '  ', trigger: 'blur' }],
          outpRcptTypeId: [{ required: true, message: '  ', trigger: 'change' }],
          inpRcptTypeId: [{ required: true, message: '  ', trigger: 'change' }],
          mrTypeId: [{ required: true, message: '  ', trigger: 'change' }],
          mrTcmTypeId: [{ required: true, message: '  ', trigger: 'change' }],
        },
        isUpd: false,
        isAlias: false,
        isDept: false,
        isStart: false,
        bottomData: {//下部新增表单数据
          showModal: false,//显示别名模态框
          itemName: '',//名称
          formalFlag: true,//启用标记
          pyCode: '',//拼音码
          wbCode: '',//五笔码
          dataVersion: '',
          aliasId: '',
        },
        ruleBto: {      //更新别名规则
          itemName: [{ required: true, message: '请输入名称', trigger: 'change' }],
        }
      },
      selectOptionsPagesj: 1,
      selectOptionsListsj: [],
      selectSerachParamsj: '',
      spinShowsj: false,
      selectOptionsPagesjs: 1,
      selectOptionsListsjs: [],
      selectSerachParamsjs: '',
      spinShowsjs: false,
      selectOptionsLists: [],
      selectOptionsPage: 1,
      selectOptionsList: [],
      selectSerachParam: '',
      spinShow: false,
      emtrycode: '',
      emptymome: '',
      selectOptionsPageks: 1,
      selectOptionsListks: [],
      selectSerachParamks: '',
      spinShowks: false,
      selectOptionsPagelb: 1,
      selectOptionsListlb: [],
      selectSerachParamlb: '',
      spinShowlb: false,
      selectOptionsPagelbs: 1,
      selectOptionsListlbs: [],
      selectSerachParamlbs: '',
      spinShowlbs: false,

    };
  },
  mounted () {
    this.init();
    util.getServiceDate()
  },
  methods: {
    delSelset () {
      this.pages.page = 1
      this.seach.itemClass = "C,D,E,F,G,H,Z"
      this.tableInit();
    },
    getSelectOptionsFunlbs () {  //中医首页类别查询下拉列表事件
      this.spinShowlbs = true
      let nowData = {
        'pdCode': 'PD0000000724',
        'hospitalId': this.$store.state.userInfoObj.hospitalId,
        'page': this.selectOptionsPagelbs,
        'size': 6,
        'searchParam': this.selectSerachParamlbs,
        'outpType': 'S'
      }
      this.$store.dispatch('getPDOrHDAttrs', nowData).then(res => {
        this.spinShowlbs = false
        if ( res.data.code === 200) {
          this.selectOptionsListlbs = this.selectOptionsListlbs.concat(res.data.data.list)
        } else {
          util.showMsg(this, { diy: res.data.message });
        }
      })
    },
    selectObjectlbs (val) {  //中医首页类别下拉列表内容
      this.selectSerachParamlbs = val.label
      this.formAddOrUpd.data.mrTcmTypeId = String(val.datavalueId)
    },
    getSelectOptionsFunlb () {  //首页类别查询下拉列表事件
      this.spinShowlb = true
      let nowData = {
        'pdCode': 'PD0000000724',
        'hospitalId': this.$store.state.userInfoObj.hospitalId,
        'page': this.selectOptionsPagelb,
        'size': 6,
        'searchParam': this.selectSerachParamlb,
        'outpType': 'S'
      }
      this.$store.dispatch('getPDOrHDAttrs', nowData).then(res => {
        this.spinShowlb = false
        if ( res.data.code === 200) {
          this.selectOptionsListlb = this.selectOptionsListlb.concat(res.data.data.list)
        } else {
          util.showMsg(this, { diy: res.data.message });
        }
      })
    },
    selectObjectlb (val) {      //首页类别下拉列表内容
      this.selectSerachParamlb = val.label
      this.formAddOrUpd.data.mrTypeId = String(val.datavalueId)
    },
    getSelectOptionsFunks () {   //选择科室查询下拉列表
      this.spinShowks = true
      let nowData = {
        'hospitalId': this.$store.state.userInfoObj.hospitalId,
        'page': this.selectOptionsPageks,
        'deptType': 1,
        'size': 6,
        'insertWord': this.selectSerachParamks,
      }
      this.$store.dispatch('getDeptDictOnly', nowData).then(res => {
        this.spinShowks = false
        if ( res.data.code === 200) {
          const resList = res.data.data.list
          this.selectOptionsListks = this.selectOptionsListks.concat(resList)
        } else {
          util.showMsg(this, { diy: res.data.message });
        }
      })
    },
    selectObjectks (val) {      //选择科室下拉列表内容
      this.selectSerachParamks = val.label
      this.bottomData.nowDept = val.deptId
    },
    getSelectOptionsFunsjs () {    //住院收据查询下拉列表
      this.spinShowsjs = true
      let nowData = {
        'pdCode': 'PD0000000667',
        'hospitalId': this.$store.state.userInfoObj.hospitalId,
        'page': this.selectOptionsPagesjs,
        'size': 6,
        'searchParam': this.selectSerachParamsjs,
        'outpType': 'S'
      }
      this.$store.dispatch('getPDOrHDAttrs', nowData).then(res => {
        this.spinShowsjs = false
        if ( res.data.code === 200) {
          const resList = res.data.data.list
          this.selectOptionsListsjs = this.selectOptionsListsjs.concat(resList)
        } else {
          util.showMsg(this, { diy: res.data.message });
        }
      })
    },
    selectObjectsjs (val) {      //住院收据下拉列表内容
      this.selectSerachParamsjs = val.label
      this.formAddOrUpd.data.inpRcptTypeId = String(val.datavalueId)
    },
    getSelectOptionsFunsj () {     //门诊收据查询下拉列表
      this.spinShowsj = true
      let nowData = {
        'pdCode': 'PD0000000211',
        'hospitalId': this.$store.state.userInfoObj.hospitalId,
        'page': this.selectOptionsPagesj,
        'size': 6,
        'searchParam': this.selectSerachParamsj,
        'outpType': 'S'
      }
      this.$store.dispatch('getPDOrHDAttrs', nowData).then(res => {
        if ( res.data.code === 200) {
          const resList = res.data.data.list
          this.selectOptionsListsj = this.selectOptionsListsj.concat(resList)
          this.spinShowsj = false
        } else {
          util.showMsg(this, { diy: res.data.message });
        }
      })
    },
    selectObjectsj (val) {        //门诊收据下拉列表内容
      this.selectSerachParamsj = val.label
      this.formAddOrUpd.data.outpRcptTypeId = String(val.datavalueId)
    },
    getSelectOptionsFun () {     //项目单位查询下拉列表
      this.spinShow = true
      let nowData = {
        'pdCode': 'HD0000000004',
        'hospitalId': this.$store.state.userInfoObj.hospitalId,
        'page': this.selectOptionsPage,
        'size': 6,
        'searchParam': this.selectSerachParam,
        'outpType': 'S'
      }
      this.$store.dispatch('getPDOrHDAttrs', nowData).then(res => {
        this.spinShow = false
        if ( res.data.code === 200) {
          const resList = res.data.data.list
          this.selectOptionsLists = this.selectOptionsLists.concat(resList)
        } else {
          util.showMsg(this, { diy: res.data.message });
        }
      })
    },
    selectObject (val) {       //项目单位下拉列表
      this.selectSerachParam = val.label
      this.formAddOrUpd.data.unit = String(val.datavalueId)
    },
    init () {//初始化
      this.topTableHeight = this.$refs['tableBox'].offsetHeight - 50;
      //项目类别
      this.$store.dispatch('getFDAttr', { 'flagdataCode': 'FD000118' }).then(res => {
        if (res.data.code == 200) {
          res.data.data.map((val, i) => {
            if (val.flagdataValue != 'A' && val.flagdataValue != 'L') {
              this.seach.itemClassList.push({
                id: val.flagdataValue,
                name: val.flagdataValueRemark,
              });
            }
          });
          this.formAddOrUpd.data.classTypeList = this.seach.itemClassList;
          this.tableInit(); //获取表格信息
        } else {
          util.showMsg(this, { diy: res.data.message });
        }
      });
      // 执行科室
      let params = {
        deptType: 1,
        hospitalId: this.$store.state.userInfoObj.hospitalId
      }
      this.$store.dispatch("getDeptDictOnly", params).then(res => {
        if ( res.data.code === 200) {
          this.bottomData.allDept = res.data.data.list;
        } else {
          util.showMsg(this, { diy: res.data.message });
        }
      });
      const nowData = {
        pdCode: 'HD0000000004',
        hospitalId: this.$store.state.userInfoObj.hospitalId
      }
      this.$store.dispatch('getPDOrHDAttr', nowData).then(res => {
        if ( res.data.code === 200) {
          this.selectOptionsList = res.data.data.list
        } else {
          util.showMsg(this, { diy: res.data.message });
        }
      })
    },
    tableInit () {//获取表格
      this.loading = true
      var nowData = {
        'hospitalId': this.$store.state.userInfoObj.hospitalId,
        'priceType': 'CUR',
        'page': this.pages.page,
        'size': 10,
        priceType: this.seach.single ? 'ALL' : undefined,
        priceItemClass: this.seach.itemClass != '' ? (this.seach.itemClass == undefined ? 'C,D,E,F,G,H,Z' : this.seach.itemClass) : 'C,D,E,F,G,H,Z',
        searchParam: this.seach.text != '' ? this.seach.text : undefined,
      }
      this.$store.dispatch('getPriceU', nowData).then(res => {
        this.loading = false;
        if ( res.data.code !== 200) {
          util.showMsg(this, { diy: res.data.message })
          return false
        } else {
          this.pages.tabPage = res.data.data.pages
          this.tableTop.dataTop = res.data.data.list;
          util.id2Name(this.tableTop.dataTop, 'itemClassCode', 'itemClassName', this.seach.itemClassList, 'id', 'name');
          this.tableTop.dataTop.map((val, i) => {
            val.startDate = val.startDate.substr(0, 16);
          });
          this.tableTop.dataTop.map((val, i) => {
            if (val.stopDate) val.stopDate = val.stopDate.substr(0, 16);
            val.price = !util.isEmpty(val.price) ? val.price.toFixed(2) : val.price = '0.00'
          });
        }
      });
      this.formAddOrUpd.data.itemCode = ''
    },
    changPage (Page) {   //分页
      this.pages.page = Page
      this.tableInit()
    },
    formAdd () {  //新增事件
      this.formAddOrUpd.isShow = true;
      this.formAddOrUpd.isUpd = false;
      this.selectSerachParam = '';
      this.selectSerachParamsj = '';
      this.selectSerachParamsjs = '';
      this.selectSerachParamlb = '';
      this.selectSerachParamlbs = '';
      this.bottomData.dataBto = []
      this.bottomData.dataDept = []
      this.handleReset('addOrUpd');
      this.$refs.currentRowTableTop.clearCurrentRow()
    },
    fromUpd (item) {//修改事件
      this.handleReset('addOrUpd');
      this.formAddOrUpd.isShow = true;
      this.formAddOrUpd.isUpd = true;
      this.transmit(item);
    },
    fromStop (item) {//上表停用
      this.showModal.stopBtnText = '停用';
      this.formAddOrUpd.isAlias = false;
      this.formAddOrUpd.isDept = false;
      this.showModal.stopMsg = '确定要停用' + '【' + item.itemName + '】吗？';
      this.showModal.showStop = true;
      this.formAddOrUpd.data.startFlag = '0';
      this.transmit(item);
    },
    updPriceCencal () {    //更新弹框取消事件
      this.formAddOrUpd.isShow = false
    },
    startPrice () {//启用价表  （考虑到新增操作要过表单验证，故未复用）
      var index = util.indexOfObject(this.formAddOrUpd.data.unit, this.selectOptionsList, 'datavalueId')
      var unitname = this.selectOptionsList[index].dataValueRemark;
      var obj = {
        'hospitalId': this.$store.state.userInfoObj.hospitalId,
        'inpRcptTypeId': this.formAddOrUpd.data.inpRcptTypeId,
        'itemClassCode': this.formAddOrUpd.data.classType,
        'itemName': this.formAddOrUpd.data.itemName,
        'itemCode': this.formAddOrUpd.data.itemCode,
        'itemSpec': this.formAddOrUpd.data.itemSpec,
        'memo': this.formAddOrUpd.data.memo,
        'mrTcmTypeId': this.formAddOrUpd.data.mrTcmTypeId,
        'mrTypeId': this.formAddOrUpd.data.mrTypeId,
        'outpRcptTypeId': this.formAddOrUpd.data.outpRcptTypeId,
        'price': this.formAddOrUpd.data.price + "",
        'pyCode': this.formAddOrUpd.data.pyCode,
        'unitId': this.formAddOrUpd.data.unit,
        'unit': unitname,
        'unitCode': this.formAddOrUpd.data.unitCode,
        'wbCode': this.formAddOrUpd.data.wbCode,
      };
      let nowData = []
      nowData[0] = {
        "sync": 0
      }
      nowData[1] = obj
      this.$store.dispatch('addPriceDatas', nowData).then(res => {
        if ( res.data.code !== 200) {
          util.showMsg(this, { diy: res.data.message })
        } else {
          util.showMsg(this, { succ: '启用成功' });
          this.tableInit();
        }
      });
    },
    fromStart (item) { //上表启用
      this.showModal.stopBtnText = '启用';
      this.formAddOrUpd.isAlias = false;
      this.showModal.stopMsg = '确定要启用' + '【' + item.itemName + '】吗？';
      this.showModal.showStop = true;
      this.transmit(item);
    },
    aliasStop (item) {//别名停用
      this.formAddOrUpd.isAlias = true;
      this.showModal.stopMsg = '确定要删除' + '【' + item.itemName + '】吗？';
      this.showModal.showStop = true;
      this.aliasTransmit(item);
    },
    change () {//停用当前项目事件
      this.showModal.showStop = false;
      if (this.formAddOrUpd.isAlias) {
        this.aliasDel();
      } else if (this.formAddOrUpd.isDept) {
        this.deptDel();
      } else {
        this.updated();
        if (!this.formAddOrUpd.isStart) {
          this.formAddOrUpd.data.stopDate = new Date().format('yyyy-MM-dd hh:mm:ss');
        }
      }
    },
    transmit (item) {//行数据传from
      this.formAddOrUpd.data.itemCode = item.itemCode;
      this.selectSerachParam = item.unit;
      this.formAddOrUpd.data.classType = item.itemClassCode;
      this.formAddOrUpd.data.itemName = item.itemName;
      this.formAddOrUpd.data.itemSpec = item.itemSpec;
      this.formAddOrUpd.data.unit = item.unitId + '';
      this.formAddOrUpd.data.unitCode = item.unitCode;
      this.emtrycode = util.isEmpty(item.unitCode) ? '' : '111'
      this.formAddOrUpd.data.price = Number(item.price);
      this.formAddOrUpd.data.outpRcptTypeId = item.outpRcptTypeId + '';
      this.selectSerachParamsj = item.outpRcptTypeName
      this.formAddOrUpd.data.inpRcptTypeId = item.inpRcptTypeId + '';
      this.selectSerachParamsjs = item.inpRcptTypeName
      this.formAddOrUpd.data.mrTypeId = item.mrTypeId + '';
      this.selectSerachParamlb = item.mrTypeName;
      this.formAddOrUpd.data.mrTcmTypeId = item.mrTcmTypeId + '';
      this.selectSerachParamlbs = item.mrTcmTypeName
      this.formAddOrUpd.data.memo = item.memo;
      this.emptymome = util.isEmpty(item.memo) ? '' : '111'
      this.formAddOrUpd.data.wbCode = item.wbCode;
      this.formAddOrUpd.data.pyCode = item.pyCode;
      this.formAddOrUpd.data.dataVersion = item.dataVersion;
      this.formAddOrUpd.data.priceItemId = item.priceItemId;
      this.formAddOrUpd.data.stopDate = util.globalVariable.isNullDate;
      this.formAddOrUpd.data.itemCode = item.itemCode
    },
    updated () {//修改价表
      var index = util.indexOfObject(this.formAddOrUpd.data.unit, this.selectOptionsList, 'datavalueId')
      var unitname = this.selectOptionsList[index].dataValueRemark;
      let emptyMome = ''
      let emtryCode = ''
      if (this.emptymome === '') {
        emptyMome = this.formAddOrUpd.data.memo
      } else {
        if (util.isEmpty(this.formAddOrUpd.data.memo)) {
          emptyMome = util.globalVariable.isNullStr
        } else {
          emptyMome = this.formAddOrUpd.data.memo
        }
      }
      if (this.emtrycode === '') {
        emtryCode = this.formAddOrUpd.data.unitCode
      } else {
        if (util.isEmpty(this.formAddOrUpd.data.unitCode)) {
          emtryCode = util.globalVariable.isNullStr
        } else {
          emtryCode = this.formAddOrUpd.data.unitCode
        }
      }
      var nowData = {
        'hospitalId': this.$store.state.userInfoObj.hospitalId,
        'inpRcptTypeId': this.formAddOrUpd.data.inpRcptTypeId,
        'itemClassCode': this.formAddOrUpd.data.classType,
        'itemName': this.formAddOrUpd.data.itemName,
        'itemCode': this.formAddOrUpd.data.itemCode,
        'itemSpec': this.formAddOrUpd.data.itemSpec,
        'memo': emptyMome,
        'mrTcmTypeId': this.formAddOrUpd.data.mrTcmTypeId,
        'mrTypeId': this.formAddOrUpd.data.mrTypeId,
        'outpRcptTypeId': this.formAddOrUpd.data.outpRcptTypeId,
        'price': this.formAddOrUpd.data.price + '',
        'pyCode': this.formAddOrUpd.data.pyCode === null || this.formAddOrUpd.data.pyCode === "" ? util.globalVariable.isNullStr : this.formAddOrUpd.data.pyCode,
        'unit': unitname,
        'unitId': this.formAddOrUpd.data.unit,
        'unitCode': emtryCode,
        'wbCode': this.formAddOrUpd.data.wbCode === null || this.formAddOrUpd.data.wbCode === "" ? util.globalVariable.isNullStr : this.formAddOrUpd.data.wbCode,
        'dataVersion': this.formAddOrUpd.data.dataVersion,
        'priceItemId': this.formAddOrUpd.data.priceItemId,
        startFlag: this.showModal.stopBtnText === '启用' ? 1 : 0,
        stopDate: this.showModal.stopDate === '启用' ? util.globalVariable.isNullDate : this.formAddOrUpd.data.stopDate
      };

      this.$store.dispatch('updPriceData', nowData).then(res => {
        if (res.data.code == 200) {
          if (this.showModal.stopBtnText === '停用') {
            util.showMsg(this, { succ: '停用成功' });
          } else if (this.showModal.stopBtnText === '启用') {
            util.showMsg(this, { succ: '启用成功' });
          } else {
            util.showMsg(this, { succ: '修改成功' });
          }
          this.tableInit();
        } else {
          util.showMsg(this, { diy: res.data.message })
        }
      });
    },
    formAddOrUpdSave () {//更新弹框保存
      this.$refs['addOrUpd'].validate((valid) => {
        if (valid) {
          if (util.isEmpty(this.formAddOrUpd.data.unit)) {
            util.showMsg(this, { warning: '请重新选择单位信息！' });
            return
          }
          if (util.isEmpty(this.formAddOrUpd.data.outpRcptTypeId)) {
            util.showMsg(this, { warning: '请重新选择门诊收据！' });
            return
          }
          if (util.isEmpty(this.formAddOrUpd.data.inpRcptTypeId)) {
            util.showMsg(this, { warning: '请重新选择住院收据！' });
            return
          }
          if (util.isEmpty(this.formAddOrUpd.data.mrTypeId)) {
            util.showMsg(this, { warning: '请重新选择首页类别！' });
            return
          }
          if (util.isEmpty(this.formAddOrUpd.data.mrTcmTypeId)) {
            util.showMsg(this, { warning: '请重新选择中医首页类别！' });
            return
          }
          if (this.formAddOrUpd.isUpd) {//修改
            this.updated();
          } else {//新增
            var index = util.indexOfObject(this.formAddOrUpd.data.unit, this.selectOptionsList, 'datavalueId')
            var unitname = this.selectOptionsList[index].dataValueRemark;
            var nowData = {
              'hospitalId': this.$store.state.userInfoObj.hospitalId,
              'inpRcptTypeId': this.formAddOrUpd.data.inpRcptTypeId,
              'itemClassCode': this.formAddOrUpd.data.classType,
              'itemName': this.formAddOrUpd.data.itemName,
              'itemSpec': this.formAddOrUpd.data.itemSpec,
              'memo': this.formAddOrUpd.data.memo,
              'mrTcmTypeId': this.formAddOrUpd.data.mrTcmTypeId,
              'mrTypeId': this.formAddOrUpd.data.mrTypeId,
              'outpRcptTypeId': this.formAddOrUpd.data.outpRcptTypeId,
              'price': this.formAddOrUpd.data.price + '',
              'pyCode': this.formAddOrUpd.data.pyCode,
              'unit': unitname,
              'unitId': this.formAddOrUpd.data.unit,
              'unitCode': this.formAddOrUpd.data.unitCode,
              'wbCode': this.formAddOrUpd.data.wbCode
            };
            this.$store.dispatch('addPriceData', nowData).then(res => {
              if (res.data.code == 200) {
                util.showMsg(this, { succ: '新增成功' });
                this.formAddOrUpd.isShow = false;
                this.tableInit();
              } else {
                util.showMsg(this, { diy: res.data.message });
              }
            });
          }
        } else {
          util.showMsg(this, { warning: '完善收费项目信息' });
        }
      });
    },
    itemSearch () {//input搜索
      this.currObj = {}
      this.pages = {
        page: 1,
        tabPage: 1,
        pageSelf: 1,
        size: 10,
      }
      this.bottomData.dataBto = []
      this.bottomData.dataDept = []
      this.formAddOrUpd.data.itemCode = ''
      this.tableInit();
    },
    onChange () {//项目类别改变事件
      if (this.seach.text != '') {
        this.tableTop.dataTop = util.findKeys(this.seach.text, this.tableTop.dataTopFB, ['itemName', 'pyCode', 'unitCode']);
        this.tableTop.dataTop = util.findKeys(this.seach.itemClass, this.tableTop.dataTop, ['itemClassCode']);
      } else {
        this.tableTop.dataTop = util.findKeys(this.seach.itemClass, this.tableTop.dataTopFB, ['itemClassCode']);
      }
    },
    bottomAdd () {//下模块新增
      this.formAddOrUpd.isUpd = false;
      console.log(this.formAddOrUpd.data)
      if (this.bottomData.tabs == '别名') {
        if (this.formAddOrUpd.data.itemCode == '') {
          util.showMsg(this, { warning: '新增别名需选定收费项目' });
          this.formAddOrUpd.isUpd = false;
        } else {
          this.$refs['addOrUpdAlias'].resetFields();
          this.formAddOrUpd.bottomData.showModal = true;
        }
      } else {
        if (this.formAddOrUpd.data.itemCode == '') {
          util.showMsg(this, { warning: '新增执行科室需选定收费项目' });
        } else {
          this.bottomData.nowDept = '';
          this.selectSerachParamks = '';
          this.$refs['updDept'].resetFields();
          this.bottomData.showModal = true;
        }
      }
    },
    getAlias (item) {//获取别名
      this.currObj = item
      this.transmit(item);
      if (this.bottomData.tabs == '执行科室') {
        this.getDept(item)
        return;
      }
      this.getDept
      var nowData = {
        priceCode: item.itemCode,
        itemType: 1,
        clinicId: item.clinicItemId,
      }
      this.bottomLoading.left = true
      this.$store.dispatch('getAliasDict', nowData).then(res => {
        if (res.data.code == 200) {

          this.bottomLoading.left = false
          this.bottomData.dataBto = res.data.data.list;
          this.bottomData.dataBto.map((val, i) => {
            val.formalFlag = this.bottomData.formalFlag[val.formalFlag];
          });
        } else {
          util.showMsg(this, { diy: res.data.message });
        }
      });
    },
    addAliasSave () {//更新别名保存事件
      this.$refs['addOrUpdAlias'].validate((valid) => {
        if (valid) {
          this.formAddOrUpd.bottomData.showModal = false;
          if (this.formAddOrUpd.isUpd) {
            this.aliasupdated();
          } else {
            this.addAliasAjax();
          }
        }
      });
    },
    addAliasAjax () {//新增别名ajax
      var nowData = {
        'formalFlag': 0,
        'hospitalId': this.$store.state.userInfoObj.hospitalId,
        'itemName': this.formAddOrUpd.bottomData.itemName,
        'itemType': '1',
        'priceCode': this.formAddOrUpd.data.itemCode,
        'pyCode': this.formAddOrUpd.bottomData.pyCode,
        'wbCode': this.formAddOrUpd.bottomData.wbCode,
      };
      this.$store.dispatch('addAliasDict', nowData).then(res => {
        if (res.data.code == 200) {
          util.showMsg(this, { succ: '新增成功' });
        } else {
          util.showMsg(this, { diy: res.data.message });
        }
        this.getAlias(this.formAddOrUpd.data);
      });
    },
    aliasUpd (item) {//别名修改
      this.formAddOrUpd.isUpd = true;
      this.formAddOrUpd.bottomData.showModal = true;
      this.aliasTransmit(item);
    },
    aliasupdated () {//修改别名ajax
      var nowData = {
        'aliasId': this.formAddOrUpd.bottomData.aliasId,
        'dataVersion': this.formAddOrUpd.bottomData.dataVersion,
        'formalFlag': 0,
        'hospitalId': this.$store.state.userInfoObj.hospitalId,
        'itemName': this.formAddOrUpd.bottomData.itemName,
        'itemType': '1',
        'priceCode': this.formAddOrUpd.data.itemCode,
        'pyCode': this.formAddOrUpd.bottomData.pyCode,
        'wbCode': this.formAddOrUpd.bottomData.wbCode,
      };
      this.$store.dispatch('updAliasDict', nowData).then(res => {
        if (res.data.code == 200) {
          util.showMsg(this, { succ: '修改成功' });
        } else {
          util.showMsg(this, { diy: res.data.message });
        }
        this.getAlias(this.formAddOrUpd.data);
      });
    },
    aliasDel () {//删除别名
      this.$store.dispatch('delAliasDict', this.formAddOrUpd.bottomData.aliasId).then(res => {
        if (res.data.code == 200) {
          util.showMsg(this, { succ: '删除成功' });
        } else {
          if (res.data.message == '正名字典不允许删除!') {
            util.showMsg(this, { warning: '正名字典不允许删除!' });
          } else {
            util.showMsg(this, { diy: res.data.message });
          }
        }
        this.getAlias(this.formAddOrUpd.data);
      });
    },
    aliasTransmit (item) {//别名值传递
      this.formAddOrUpd.bottomData.itemName = item.itemName;
      this.formAddOrUpd.bottomData.wbCode = item.wbCode;
      this.formAddOrUpd.bottomData.pyCode = item.pyCode;
      this.formAddOrUpd.bottomData.dataVersion = item.dataVersion;
      this.formAddOrUpd.bottomData.aliasId = item.aliasId;
      this.formAddOrUpd.bottomData.formalFlag = item.formalFlag == '否' ? false : true;
    },
    getDept (item) {//获取执行科室
      let nowData = {
        itemType: 1,
        priceCode: item.itemCode
      }
      this.bottomLoading.right = true
      this.$store.dispatch('getPerformeDept', nowData).then(res => {
        this.bottomLoading.right = false
        if (res.data.code === 200 ) {
          this.bottomData.dataDept = res.data.data.list;
          util.id2Name(this.bottomData.dataDept, 'deptId', 'deptName', this.bottomData.allDept, 'deptId', 'deptName');
          this.bottomData.dataDept.map((val, i) => {
            val.defaultFlag = this.bottomData.formalFlag[val.defaultFlag];
          });
        } else {
          util.showMsg(this, { diy: res.data.message })
        }
      });
    },
    addDeptSave () {//新增执行科室保存
      this.$refs['updDept'].validate((valid) => {
        if (valid) {
          if (this.formAddOrUpd.isUpd) {
            this.updatedDeptAjax();
            this.bottomData.showModal = false;
          } else {
            this.addDeptAJax();
          }
        }
      });
    },
    addDeptAJax () {//新增执行科室ajax
      if (this.bottomData.nowDept == '') {
        util.showMsg(this, { warning: '未选择执行科室' });
        return
      }
      var nowData = {
        'defaultFlag': 0,
        'deptId': this.bottomData.nowDept,
        'hospitalId': this.$store.state.userInfoObj.hospitalId,
        'itemType': '1',
        'priceCode': this.formAddOrUpd.data.itemCode,
        'clinicId': this.currObj.clinicItemId
      };
      this.$store.dispatch('addPerformeDept', nowData).then(res => {
        if (res.data.code === 200 ) {
          util.showMsg(this, { succ: '新增成功' });
        } else {
          util.showMsg(this, { diy: res.data.message })
        }
        this.bottomData.showModal = false;
        this.getDept(this.formAddOrUpd.data);
      });
    },
    deptUpd (item) {//修改执行科室
      this.formAddOrUpd.isUpd = true;
      this.bottomData.showModal = true;
      this.bottomData.nowDept = item.deptId;
      this.selectSerachParamks = item.deptName
      this.bottomData.dataVersion = item.dataVersion;
      this.bottomData.performeDeptId = item.performeDeptId;
      this.bottomData.deptDefult = item.defaultFlag == '否' ? false : true;
    },
    updatedDeptAjax () {//修改执行科室ajax
      var nowData = {
        'dataVersion': this.bottomData.dataVersion,
        'defaultFlag': 0,
        'deptId': this.bottomData.nowDept,
        'hospitalId': this.$store.state.userInfoObj.hospitalId,
        'performeDeptId': this.bottomData.performeDeptId,
        'priceCode': this.formAddOrUpd.data.itemCode,
        'clinicId': this.currObj.clinicItemId
      };
      this.$store.dispatch('updPerformeDept', nowData).then(res => {
        if (res.data.code == 200) {
          util.showMsg(this, { succ: '修改成功' });
        } else {
          util.showMsg(this, { diy: res.data.message });
        }
        this.getDept(this.formAddOrUpd.data);
      });
    },
    deptStop (item) {//取消默认执行科室
      this.formAddOrUpd.isDept = true;
      this.showModal.stopMsg = '确定要取消默认执行科室' + '【' + item.deptName + '】吗？';
      this.showModal.showStop = true;
      this.bottomData.performeDeptId = item.performeDeptId;
    },
    deptDel () {//删除执行科室
      this.$store.dispatch('delPerformeDept', this.bottomData.performeDeptId).then(res => {
        if (res.data.code == 200) {
          util.showMsg(this, { succ: '修改成功' });
        } else {
          util.showMsg(this, { diy: res.data.message });
        }
        this.getDept(this.formAddOrUpd.data);
      });
    },
    handleReset (name) {//表单验证重置
      this.$refs[name].resetFields();
    },
    tabsClick () {   //下部表格数据切换处理
      if (this.bottomData.tabs == '别名') {
        if (JSON.stringify(this.currObj) != "{}") {
          this.getAlias(this.currObj)
        } else {
          this.bottomData.dataBto = []
        }
      } else {
        if (JSON.stringify(this.currObj) != "{}") {
          this.getDept(this.currObj)
        } else {
          this.bottomData.dataDept = []
        }
      }
    }
  },
};
</script>
<style lang="less" scoped>
.price-list .tableBox {
  height: 56%;
  margin-top: 10px;
  border-bottom: 2px solid #e9e9e9;
  padding-bottom: 40px;
}
.bg-whiteclass {
  padding: 13px 17px 0;
  background: #fff;
  height: 100%;
}
@import "../../../../styles/common.less";
#btn {
  position: absolute;
  right: 10px;
  z-index: 10;
}
#lastCho {
  position: absolute;
  right: 40px;
  top: 40px;
  z-index: 10;
}
</style>
<style>
.price-list .ivu-form-item-error-tip {
  position: absolute;
  top: 100%;
  left: 110px;
  line-height: 1;
  padding-top: 6px;
  color: #f30;
}
.price-list thead {
  text-align: center;
}
.price-list .ivu-tabs-bar {
  margin-bottom: 14px;
  border-bottom: none;
}
</style>

