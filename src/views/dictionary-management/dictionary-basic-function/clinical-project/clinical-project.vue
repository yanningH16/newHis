<template>
  <div class="clinical-project"
       style="width:100%;height:100%;padding: 13px 17px 0;background: #fff;">
    <!-- 上部搜索 -->
    <div class=""
         style="display:flex">
      <Input v-model.trim="seach.text"
             @on-change="itemSearch"
             placeholder="拼音码/名称"
             style="width: 230px" />
      <span style="line-height:32px;font-size:14px;margin-left:10px;margin-right:2px">项目类别</span>
      <Select v-model="seach.itemClass"
              clearable
              style="width:200px"
              @on-change="itemSearch">
        <Option v-for="(item,index) in seach.itemClassList"
                :value="item.id"
                :key="index">{{ item.name }}
        </Option>
      </Select>
      <Checkbox v-model="seach.single"
                @on-change="itemSearch"
                style="line-height:34px;margin-left:12px">显示停用
      </Checkbox>
      <Button type="primary"
              :loading="loadfind"
              @click="itemSearch"
              style='height: 30px;'><i class="iconfont iconchaxun"></i>&#8194;查询
      </Button>
      <div id="btn"
           style="width: 70px;">
        <Button type="primary"
                @click="formAdd"><i class="iconfont icontianjia"
             style="font-size:14px"></i>&#8194;新增
        </Button>
      </div>
    </div>
    <!-- 上部表格 -->
    <div style="margin-top:10px;border-bottom:2px solid #e9e9e9;padding-bottom:40px;"
         class="tableBox">
      <Table :loading="loading"
             disabled-hover
             highlight-row
             ref="currentrowtable"
             stripe
             border
             :height="topTableHeight"
             :columns="tableTop.columnsTop"
             :data="tableTop.dataTop"
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
                @click="bottomAdd"
                v-show="bottomData.tabs!=='执行科室'"><i class="iconfont icontianjia"
             style="font-size:14px"></i>&#8194;新增
        </Button>
      </div>
      <Tabs type="card"
            capture-focus
            @on-click='tabsClick'
            v-model="bottomData.tabs">
        <TabPane label="收费对应"
                 name="收费对应">
        </TabPane>
        <TabPane label="别名"
                 name="别名">
        </TabPane>
        <TabPane label="执行科室"
                 name="执行科室">
        </TabPane>
      </Tabs>
      <div v-show="bottomData.tabs=='收费对应'">
        <Table highlight-row
               stripe
               border
               :loading="bottomLoading.left"
               :columns="bottomData.columnsCliVsPrice"
               height="150"
               :data="bottomData.dataCliVsPrice"></Table>
      </div>
      <div v-show="bottomData.tabs=='别名'">
        <Table highlight-row
               stripe
               border
               :loading="bottomLoading.middle"
               height="150"
               :columns="bottomData.columnsBto"
               :data="bottomData.dataBto"></Table>
      </div>
      <div v-show="bottomData.tabs=='执行科室'">
        <Table id="tableUpId"
               disabled-hover
               highlight-row
               stripe
               border
               :loading="bottomLoading.right"
               height="150"
               :columns="bottomData.columnsDept"
               :data="bottomData.dataDept"></Table>
      </div>
    </div>
    <!-- 更新临床 -->
    <Modal v-model="formAddOrUpd.isShow"
           :closable="false"
           title="临床项目"
           width="700px"
           :mask-closable="false">
      <div slot="footer">
        <Button type="text"
                @click="updClinicItemCancel">取消
        </Button>
        <Button type="primary"
                :loading="loadkeep"
                @click="formAddOrUpdSave">保存
        </Button>
      </div>
      <Form ref="addOrUpd"
            class="formAddOrUpdClass"
            :model="formAddOrUpd.data"
            :rules="formAddOrUpd.rule"
            :label-width="80">
        <Row>
          <i-Col span="12"
                 v-show="false">
            <FormItem label="项目编码"
                      prop="itemCode">
              <Input v-model.trim="formAddOrUpd.data.itemCode"
                     disabled
                     style="width:200px" />
            </FormItem>
          </i-Col>
          <i-Col span="24">
            <FormItem label="项目类别"
                      prop="classType">
              <Select v-model="formAddOrUpd.data.classType"
                      filterable
                      clearable
                      style="width:80%;margin-left:10px">
                <Option v-for="(item,index) in formAddOrUpd.data.classTypeList"
                        :value="item.id"
                        :key="index">{{ item.name }}
                </Option>
              </Select>
            </FormItem>
          </i-Col>
        </Row>
        <!-- </div>  -->
        <FormItem label="项目名称"
                  prop="itemName">
          <Input v-model.trim="formAddOrUpd.data.itemName"
                 style="width:80%;margin-left:10px" />
        </FormItem>
        <FormItem label="启用属性"
                  prop=""
                  class='ppp'>
          <Checkbox v-model="formAddOrUpd.data.outpEnable"
                    style="margin-left:10px;display:inline-block">门诊可用
          </Checkbox>
          <Checkbox v-model="formAddOrUpd.data.inpEnable"
                    style="margin-left:10px;display:inline-block">住院可用
          </Checkbox>
        </FormItem>
        <FormItem label="执行属性"
                  prop="">
          <Checkbox v-model="formAddOrUpd.data.wardExecFlag"
                    style="display:inline-block;margin-left:10px">病区执行
          </Checkbox>
          <Checkbox v-model="formAddOrUpd.data.deptExecFlag"
                    style="margin-left:10px;display:inline-block">科室执行
          </Checkbox>
        </FormItem>
        <Row>
          <i-Col span="12">
            <FormItem label="拼音码"
                      prop="pyCode">
              <Input v-model.trim="formAddOrUpd.data.pyCode"
                     style="width:150px;margin-left:10px" />
            </FormItem>
          </i-Col>
          <i-Col span="12">
            <FormItem label="五笔码"
                      prop="wbCode">
              <Input v-model.trim="formAddOrUpd.data.wbCode"
                     style="width:153px" />
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
                     :loading="loadwarn"
                     @close="showModal.showStop=false" />

    <!-- 更新收费对应 -->
    <Modal v-model="formAddOrUpd.bottomData.showCliVsPrice"
           :closable="false"
           width="500px"
           title="临床收费对应"
           :mask-closable="false">
      <div slot="footer">
        <Button type="text"
                @click="addcencel">取消
        </Button>
        <Button type="primary"
                :loading="loadKEep"
                @click="addCVPSave">保存
        </Button>
      </div>
      <Form ref="addOrUpdCVP"
            :model="cliVsPriceData.from"
            :rules="cliVsPriceData.rule"
            :label-width="60">
        <Row>
          <i-Col span="20">
            <FormItem label="类别"
                      prop="priceClassId">
              <Select v-model="cliVsPriceData.from.priceClassId"
                      filterable
                      clearable
                      :disabled="formAddOrUpd.isUpd"
                      style="width:300px"
                      @on-change="showSpecChange">
                <Option v-for="(item,index) in bottomData.allPriceitemClassList"
                        :key="index"
                        :value="item.flagdataValue">{{ item.flagdataValueRemark }}
                </Option>
              </Select>
            </FormItem>
          </i-Col>
          <i-Col span="4">
            <Checkbox v-model="cliVsPriceData.from.multipleFlag"
                      style="margin-top:5px">按倍数
            </Checkbox>
          </i-Col>
        </Row>
        <Row>
          <i-Col span="15">
            <FormItem label="名称"
                      v-show="!formAddOrUpd.isUpd"
                      prop="priceItemCode">
              <longrangesearchselectElse direction='bottom'
                                         :vModel.sync='selectSerachParam'
                                         style="width:210px"
                                         value="itemCode"
                                         label='itemName'
                                         :spinShow='spinShowDP'
                                         class="tow"
                                         id="nameClass"
                                         :selectOptionsPage.sync='selectOptionsPage'
                                         :propOptions.sync='cliVsPriceData.from.priceItemCodeList'
                                         @currObject='selectObject'
                                         @getSelectOptions='getSelectOptionsFun'>
              </longrangesearchselectElse>
            </FormItem>
            <FormItem label="名称"
                      prop="priceItemName"
                      v-show="formAddOrUpd.isUpd">
              <Input v-model.trim="cliVsPriceData.from.priceItemName"
                     v-show="formAddOrUpd.isUpd"
                     :disabled="formAddOrUpd.isUpd"
                     style="width:210px" />
            </FormItem>
          </i-Col>
          <i-Col span="9">
            <FormItem label="数量"
                      prop="amount">
              <InputNumber :max="100"
                           :min="1"
                           v-model="cliVsPriceData.from.amount"
                           style="width:91px"></InputNumber>
            </FormItem>
          </i-Col>
        </Row>
        <Row>
          <i-Col span="12">
            <FormItem label="规格"
                      prop="itemSpec">
              <Input v-model.trim="cliVsPriceData.from.itemSpec"
                     disabled
                     style="width:150px" />
            </FormItem>
          </i-Col>
          <i-Col span="12">
            <FormItem label="单位"
                      prop="unit">
              <Input v-model.trim="cliVsPriceData.from.unit"
                     disabled
                     style="width:150px" />
            </FormItem>
          </i-Col>
        </Row>
      </Form>
    </Modal>

    <!-- 更新别名 -->
    <Modal v-model="formAddOrUpd.bottomData.showModal"
           :closable="false"
           width="500px"
           title="临床别名"
           :mask-closable="false">
      <div slot="footer">
        <Button type="text"
                @click="formAddOrUpd.bottomData.showModal = false">取消
        </Button>
        <Button type="primary"
                :loading="loadKEEp"
                @click="addAliasSave">保存
        </Button>
      </div>
      <Form ref="addOrUpdAlias"
            :model="formAddOrUpd.bottomData"
            :rules="formAddOrUpd.rule"
            :label-width="70">
        <Row>
          <i-Col span="24">
            <FormItem label="名称"
                      prop="itemName">
              <Input v-model.trim="formAddOrUpd.bottomData.itemName"
                     style="width:250px" />
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
  </div>
</template>
<script>
import util from '../../../../libs/util.js';
import Page from '../../../components/page.vue';
import qs from 'qs';
import comfirmDeletion from '../../../components/confirmDeletion.vue';
import longrangesearchselectElse from '../../../components/long-range-search-select-else'

export default {
  name: 'clinical-project',
  components: { comfirmDeletion, Page, longrangesearchselectElse },
  data () {
    const valideDept = (rule, value, callback) => {
      if (this.bottomData.nowDept == null || this.bottomData.nowDept == '') {
        callback(new Error(''));
      } else {
        callback();
      }
    };
    return {
      bottomLoading: {
        left: false,
        middle: false,
        right: false
      },
      topTableHeight: '',
      loadwarn: false,
      loadfind: false,
      loadkeep: false,
      loadKEep: false,
      loadKEEp: false,
      loading: true,
      pages: {
        page: 1,
        tabPage: 1,
        size: 15,
      },
      seach: {//上部搜素
        text: '',
        itemClass: '',
        itemClassList: [],
        single: false
      },
      showModal: {//显示
        showStop: false,
        stopMsg: '',
        stopBtnText: '停用',
      },
      tableTop: {//上表信息
        columnsTop: [
          {
            title: "项目编码",
            key: "itemCode",
            align: "center",
          }, {
            title: "项目类别",
            key: "itemClassName",
            align: "left",
            width: 80
          }, {
            title: "项目名称",
            key: "itemName",
            align: "left"
          }, {
            title: "价格",
            key: "itemPrice",
            width: 90
          }, {
            title: "在用",
            key: "status",
            align: "center",
            width: 100

          }, {
            title: "门诊可用",
            key: "outpEnable",
            align: "center",
            width: 100
          }, {
            title: "住院可用",
            key: "inpEnable",
            align: "center",
            width: 100
          }, {
            title: "病区执行",
            key: "wardExecFlag",
            align: "center",
            width: 100
          }, {
            title: "科室执行",
            key: "deptExecFlag",
            align: "center",
            width: 100
          }, {
            title: "操作",
            key: "del",
            align: "center",
            width: 100,
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
                        marginRight: '10px'
                      },
                      on: {
                        click: () => {
                          this.showModal.stopBtnText = '修改'
                          this.fromUpd(params.row)
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
                      class: params.row.status == "是" ? util.icon.stop : util.icon.start,
                      style: {
                        verticalAlign: 'middle',
                      },
                      on: {
                        click: () => {
                          if (params.row.status == "是") {
                            this.showModal.stopBtnText = '停用'
                            this.fromStop(params.row)
                          } else {
                            console.log('启用')
                            this.showModal.stopBtnText = '启用'
                            this.fromStart(params.row)
                          }
                        }
                      }
                    }),
                    h(
                      'div',
                      {
                        slot: 'content'
                      },
                      params.row.status === '是' ? '停用' : '启用'
                    )
                  ]
                ),
              ]);
            }
          }],
        dataTop: [],
      },
      bottomData: {//下部模块data
        nowDept: this.$store.state.userInfoObj.deptId,//当前选定的科室
        deptDefult: false,//执行科室默认
        performeDeptId: "",//执行科室唯一id
        dataVersion: "",//执行科室版本
        allDept: [],//全部科室
        allPrice: [],//全部收费
        allPriceitemClassList: [],//全部收费类别
        tabs: '收费对应',
        columnsBto: [//别名表头
          {
            title: "序号",
            type: 'index',
            align: "center",
            width: 50
          }, {
            title: "名称",
            key: "itemName",
          }, {
            title: "正名",
            key: "formalFlag",
          }, {
            title: "拼音码",
            key: "pyCode",
          }, {
            title: "五笔码",
            key: "wbCode",
          }, {
            title: "操作",
            key: " ",
            align: "center",
            width: 100,
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
                        marginRight: '10px',
                        cursor: params.row.formalFlag === '是' ? 'no-drop' : 'pointer',
                        color: params.row.formalFlag === '是' ? '#ccc' : '#2db7f5',
                      },
                      on: {
                        click: () => {
                          if (params.row.formalFlag === '是') {
                            return;
                          }
                          this.aliasUpd(params.row)
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
                        cursor: params.row.formalFlag === '是' ? 'no-drop' : 'pointer',
                        color: params.row.formalFlag === '是' ? '#ccc' : '#2db7f5',
                        verticalAlign: 'middle',
                      },
                      on: {
                        click: () => {
                          if (params.row.formalFlag === '是') {
                            return;
                          }
                          this.showModal.stopBtnText = '删除'
                          this.aliasStop(params.row)
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
        formalFlag: { '0': '否', '1': '是' },//formalFlag[val.status]
        columnsDept: [//科室表头
          {
            title: "序号",
            type: 'index',
            align: "center",
            width: 50
          }, {
            title: "科室",
            key: "deptName",
            align: "left",
          }
        ],
        dataDept: [],       //执行科室内容
        columnsCliVsPrice: [    //收费对应表头
          {
            title: "序号",
            key: 'priceItemNo',
            align: "center",
            width: 50
          }, {
            title: "收费类别",
            key: "itemClassName",
            width: 100
          }, {
            title: "收费项目",
            key: "priceItemName",
            align: "left",
          }, {
            title: "规格",
            key: "itemSpec",
          }, {
            title: "单位",
            key: "unit",
            width: 80
          }, {
            title: "单价",
            key: "price",
            align: "right",
            width: 80
          }, {
            title: "数量",
            key: "amount",
            align: "right",
            width: 80
          }, {
            title: "金额",
            key: "pricesum",
            align: "right",
            width: 80
          }, {
            title: "按倍数",
            key: "multipleFlag",//按倍数使用标记：1-是，0-否 ,
            align: "center",
            width: 80
          }, {
            title: "操作",
            align: "center",
            width: 100,
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
                        marginRight: '10px'
                      },
                      on: {
                        click: () => {
                          this.cliVsPriceUpd(params.row)
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
                      },
                      on: {
                        click: () => {
                          this.showModal.stopBtnText = '删除'
                          this.cliVsPriceStop(params.row)
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
        dataCliVsPrice: [],     //收费内容
        showModal: false,
        rule: { dept: [{ required: true, validator: valideDept, trigger: 'change' }] },
      },
      formAddOrUpd: {//新增修改表单
        isShow: false,
        data: {//上部新增表单数据
          itemCode: '',//项目编码
          classType: '',//项目类别
          classTypeList: [],//项目类别数组
          itemName: '',//项目名称
          wbCode: '',
          pyCode: '',
          dataVersion: '',
          clinicItemId: '',
          inpEnable: true,//住院
          status: true,//在用
          outpEnable: true,//门诊
          wardExecFlag: true,//病区执行
          deptExecFlag: true,//科室执行
        },
        rule: {//上部新增校验数据
          classType: [{ required: true, message: '  ', trigger: 'change' }],
          itemName: [{ required: true, message: '  ', trigger: 'blur' }],
        },
        isUpd: false,
        isAlias: false,
        isDept: false,
        isCVP: false,
        bottomData: {//下部新增表单数据
          showModal: false,//显示别名模态框
          itemName: '',//名称
          formalFlag: false,//启用标记
          pyCode: '',//拼音码
          wbCode: '',//五笔码
          dataVersion: '',//别名数据库版本
          aliasId: '',//别名唯一id
          showCliVsPrice: false,//收费对应模态框
        },
      },
      cliVsPriceData: {//临床收费对应数据
        from: {
          priceItemName: '',//收费名称
          priceItemCode: '',//收费code
          priceItemCodeList: [],//收费code
          itemSpec: '',//收费规格
          unit: '',//收费单位
          amount: 1,//收费数量
          multipleFlag: true,//按倍数
          priceClassId: '',//收费类别
          clinicVsPriceId: '',//唯一id
          dataVersion: '',//数据库版本
        },
        rule: {
          priceClassId: [{ required: true, message: '  ', trigger: 'change' }],
          priceItemCode: [{ required: true, message: '  ', trigger: 'blur' }],
        }
      },
      currObj: {
        currItem: {}
      },
      cloneList: [],
      spinShowDP: false,
      selectSerachParam: '',
      selectOptionsPage: 1,
      valCode: '',
      clickshow: false
    }
  },
  mounted () {
    this.init()
  },
  methods: {
    showSpecChange (val) {         //选择修改类别
      this.cliVsPriceData.from.priceItemCode = ''
      this.cliVsPriceData.from.priceItemCodeList = []
      this.cloneList = []
      this.valCode = val
      if (util.isEmpty(val)) {
        this.selectSerachParam = ''
      }
    },
    init () {//初始化
      //项目类别
      this.topTableHeight = $(".tableBox").height();
      this.pages.size = parseInt(this.topTableHeight / 40)
      let data = {
        hospitalId: this.$store.state.userInfoObj.hospitalId,
        pdCode: 'PD0000000375',
        outpType: 'ALL'
      }
      this.$store.dispatch("getPDOrHDAttrs", data).then(res => {
        if (res.data.code === 200) {
          res.data.data.list.map((val, i) => {
            if (val.dataValue !== '01' && val.dataValue !== '06') {
              this.formAddOrUpd.data.classTypeList.push({
                id: val.datavalueId + '',
                name: val.dataValueRemark,
              })
              this.seach.itemClassList.push({
                id: val.dataValue,
                name: val.dataValueRemark,
              })
            }
          })
          this.tableInit()
        } else {
          util.showMsg(this, { diy: res.data.message });
        }
      })
      //全部科室
      let params = {
        deptType: 1
      }
      this.$store.dispatch("departTabList", { hospitalId: this.$store.state.userInfoObj.hospitalId }).then(res => {
        if (res.data.code === 200) {
          this.bottomData.allDept = res.data.data.list
        } else {
          util.showMsg(this, { diy: res.data.message });
        }
      })
      this.getPrice() //全部收费
      //收费项目类别
      this.$store.dispatch("getFDAttr", { "flagdataCode": "FD000118" }).then(res => {
        if (res.data.code === 200) {
          this.cliVsPriceData.from.priceItemCode = ''
          this.bottomData.allPriceitemClassList = res.data.data
        } else {
          util.showMsg(this, { diy: res.data.message });
        }
      })
    },
    getPrice () {      //收费
      var nowData = {
        'hospitalId': this.$store.state.userInfoObj.hospitalId,
        'priceItemClass': 'A,C,D,E,F,G,H,L,Z',
        'priceType': 'CUR'
      }
      this.$store.dispatch("getPriceU", nowData).then(res => {
        if (res.data.code === 200) {
          this.bottomData.allPrice = res.data.data.list
        } else {
          util.showMsg(this, { diy: res.data.message });
        }
      })
    },
    tableInit () {//获取临床项目内容
      let nowData = {
        hospitalId: this.$store.state.userInfoObj.hospitalId,
        itemClass: this.seach.itemClass != '' ? this.seach.itemClass : '03,02,04,05,07,08,99',
        searchParam: this.seach.text != '' ? this.seach.text : undefined,
        status: this.seach.single ? undefined : 1,
        page: this.pages.page,
        size: this.pages.size
      }
      this.loading = true
      this.loadfind = true;
      this.$store.dispatch("getClinicItemQuery", nowData).then(res => {
        this.loadfind = false;
        this.loading = false
        if (res.data.code === 200) {
          this.pages.tabPage = res.data.data.pages
          this.tableTop.dataTop = res.data.data.list;
          util.id2Name(this.tableTop.dataTop, "itemClassId", "itemClassName", this.formAddOrUpd.data.classTypeList, "id", "name")
          this.tableTop.dataTop.map((val, i) => {
            val.status = this.bottomData.formalFlag[val.status]
            val.outpEnable = this.bottomData.formalFlag[val.outpEnable]
            val.inpEnable = this.bottomData.formalFlag[val.inpEnable]
            val.wardExecFlag = this.bottomData.formalFlag[val.wardExecFlag]
            val.deptExecFlag = this.bottomData.formalFlag[val.deptExecFlag]
            val.itemPrice = val.itemPrice === '' ? 0 : val.itemPrice.toFixed(2)
          })
          if (this.clickshow) {
            this.clickshow = false
            this.tableTop.dataTop.map((val, i) => {
              val.clinicItemId === this.currObj.currItem.clinicItemId ? val._highlight = true : ''
            })
            this.getAlias(this.currObj.currItem)
          }
        } else {
          util.showMsg(this, { diy: res.data.message });
        }
      })
      this.formAddOrUpd.data.itemCode = ''
      this.currObj.currItem = {}
    },
    changPage (Page) {     //分页
      this.pages.page = Page
      this.tableInit()
      this.bottomData.dataCliVsPrice = []
      this.bottomData.dataBto = []
      this.bottomData.dataDept = []
      this.$refs.currentrowtable.clearCurrentRow();
    },
    formAdd () {//新增事件
      this.bottomData.dataCliVsPrice = []
      this.bottomData.dataBto = []
      this.bottomData.dataDept = []
      this.$refs.currentrowtable.clearCurrentRow();
      this.formAddOrUpd.isShow = true
      this.formAddOrUpd.isUpd = false
      this.formAddOrUpd.data.inpEnable = true
      this.formAddOrUpd.data.status = true
      this.formAddOrUpd.data.outpEnable = true
      this.formAddOrUpd.data.wardExecFlag = true
      this.formAddOrUpd.data.deptExecFlag = true
      this.handleReset('addOrUpd')
    },
    fromUpd (item) {//上表修改事件
      this.handleReset('addOrUpd')
      this.formAddOrUpd.isShow = true
      this.formAddOrUpd.isUpd = true
      this.transmit(item)
    },
    fromStop (item) {//上表停用
      this.formAddOrUpd.isAlias = false
      this.formAddOrUpd.isDept = false
      this.formAddOrUpd.isCVP = false
      this.showModal.stopMsg = '确定要停用' + '【' + item.itemName + '】吗？';
      this.showModal.showStop = true;
      this.transmit(item)
    },
    fromStart (item) {//上表启用
      this.formAddOrUpd.isAlias = false
      this.formAddOrUpd.isDept = false
      this.formAddOrUpd.isCVP = false
      this.showModal.stopMsg = '确定要启用' + '【' + item.itemName + '】吗？';
      this.showModal.showStop = true;
      this.transmit(item)
    },
    aliasStop (item) {//别名停用  删除按钮
      this.formAddOrUpd.isAlias = true
      this.formAddOrUpd.isDept = false
      this.formAddOrUpd.isCVP = false
      this.showModal.stopMsg = '确定要删除别名' + '【' + item.itemName + '】吗？';
      this.formAddOrUpd.data.status = true
      this.aliasTransmit(item)
      this.showModal.showStop = true;
    },
    change () {//停用下半部分当前项目事件
      this.showModal.showStop = false;
      if (this.formAddOrUpd.isAlias) {
        this.aliasDel()     //删除别名
      } else if (this.formAddOrUpd.isCVP) {
        this.cliVsPriceDel()  //删除对应收费
      } else {
        this.formAddOrUpd.data.status = this.showModal.stopBtnText == '停用' ? false : true
        this.updated()     //修改临床
      }
    },
    transmit (item) {//行数据传from
      this.formAddOrUpd.data.itemCode = item.itemCode
      this.formAddOrUpd.data.classType = item.itemClassId
      this.formAddOrUpd.data.itemName = item.itemName
      this.formAddOrUpd.data.wbCode = item.wbCode
      this.formAddOrUpd.data.pyCode = item.pyCode
      this.formAddOrUpd.data.dataVersion = item.dataVersion
      this.formAddOrUpd.data.clinicItemId = item.clinicItemId
      this.formAddOrUpd.data.inpEnable = item.inpEnable == '是' ? true : false
      this.formAddOrUpd.data.status = item.status == '是' ? true : false
      this.formAddOrUpd.data.outpEnable = item.outpEnable == '是' ? true : false
      this.formAddOrUpd.data.deptExecFlag = item.deptExecFlag == '是' ? true : false
      this.formAddOrUpd.data.wardExecFlag = item.wardExecFlag == '是' ? true : false
    },
    updated () {//修改临床
      this.loadwarn = true;
      var nowData = {
        "hospitalId": this.$store.state.userInfoObj.hospitalId,
        "itemClassId": this.formAddOrUpd.data.classType,
        "itemName": this.formAddOrUpd.data.itemName,
        "inpEnable": this.formAddOrUpd.data.inpEnable ? 1 : 0,
        "status": this.formAddOrUpd.data.status ? 1 : 0,
        "outpEnable": this.formAddOrUpd.data.outpEnable ? 1 : 0,
        "wardExecFlag": this.formAddOrUpd.data.wardExecFlag ? 1 : 0,
        "deptExecFlag": this.formAddOrUpd.data.deptExecFlag ? 1 : 0,
        "pyCode": this.formAddOrUpd.data.pyCode,
        "wbCode": this.formAddOrUpd.data.wbCode,
        "dataVersion": this.formAddOrUpd.data.dataVersion,
        "clinicItemId": this.formAddOrUpd.data.clinicItemId,
      }
      this.$store.dispatch("updClinicItem", nowData).then(res => {
        if (res.data.code == 200) {
          if (this.showModal.stopBtnText == '停用') {
            util.showMsg(this, { succ: "停用成功" })
          } else if (this.showModal.stopBtnText == '启用') {
            util.showMsg(this, { succ: "启用成功" })
          } else {
            util.showMsg(this, { succ: "修改成功" })
          }
          this.tableInit()
        } else {
          util.showMsg(this, { diy: res.data.message });
        }
        this.loadwarn = false;
      })
    },
    formAddOrUpdSave () {//更新临床项目弹框保存
      this.$refs["addOrUpd"].validate((valid) => {
        if (valid) {
          this.formAddOrUpd.isShow = false
          if (this.formAddOrUpd.isUpd) {//修改
            this.updated()
          } else {//新增
            this.loadkeep = true;
            var nowData = [{
              "hospitalId": this.$store.state.userInfoObj.hospitalId,
              "inpEnable": this.formAddOrUpd.data.inpEnable ? 1 : 0,
              "itemClassId": this.formAddOrUpd.data.classType,
              "itemName": this.formAddOrUpd.data.itemName,
              "pyCode": this.formAddOrUpd.data.pyCode,
              "outpEnable": this.formAddOrUpd.data.outpEnable ? 1 : 0,
              "wardExecFlag": this.formAddOrUpd.data.wardExecFlag ? 1 : 0,
              "deptExecFlag": this.formAddOrUpd.data.deptExecFlag ? 1 : 0,
              "status": this.formAddOrUpd.data.status ? 1 : 0,
              "wbCode": this.formAddOrUpd.data.wbCode
            }, { sync: 1 }]
            this.$store.dispatch("addClinicItemToSync", nowData).then(res => {
              if (res.data.code == 200) {
                util.showMsg(this, { succ: "新增成功" })
                this.tableInit()
              }
            })
            this.loadkeep = false;
          }
        } else {
          util.showMsg(this, { diy: res.data.message })
        }
      })
    },
    itemSearch () {//input搜索
      this.pages = {
        page: 1,
        tabPage: 1,
        size: this.pages.size,
      }
      this.bottomData.dataCliVsPrice = [];
      this.bottomData.dataBto = [];
      this.bottomData.dataDept = [];
      this.formAddOrUpd.data.itemCode = '';
      //更新全部收费价格
      this.getPrice()
      this.tableInit()
    },
    updClinicItemCancel () {     //临床弹框取消事件
      this.formAddOrUpd.isShow = false;
    },
    bottomAdd () {//下模块新增
      this.formAddOrUpd.isUpd = false
      if (this.bottomData.tabs == "收费对应") {
        if (this.formAddOrUpd.data.itemCode == '') {
          util.showMsg(this, { warning: "新增收费对应需选定临床项目" })
          this.formAddOrUpd.isUpd = false
        } else {
          this.$refs['addOrUpdCVP'].resetFields();
          this.formAddOrUpd.bottomData.showCliVsPrice = true
        }
      } else if (this.bottomData.tabs == "别名") {
        if (this.formAddOrUpd.data.itemCode == '') {
          util.showMsg(this, { warning: "新增别名需选定临床项目" })
          this.formAddOrUpd.isUpd = false
        } else {
          this.$refs['addOrUpdAlias'].resetFields();
          this.formAddOrUpd.bottomData.showModal = true
        }
      } else {
        if (this.formAddOrUpd.data.itemCode == '') {
          util.showMsg(this, { warning: "新增执行科室需选定临床项目" })
        } else {
          this.bottomData.nowDept = null
          this.$refs['updDept'].resetFields();
          this.bottomData.showModal = true
        }
      }
    },
    getAlias (item) {//获取别名
      this.currObj.currItem = item
      this.transmit(item)
      if (this.bottomData.tabs == '执行科室') {
        this.getDept(item)//同时获取执行科室
        return
      } else if (this.bottomData.tabs == '收费对应') {
        this.getCliVsPrice(item)//同时获取收费对应
        return
      }
      var nowData = {
        clinicId: item.clinicItemId,
        itemType: 2,
      }
      this.bottomLoading.middle = true
      this.$store.dispatch("getAliasDict", nowData).then(res => {
        this.bottomLoading.middle = false
        if (res.data.code != 200) {
          util.showMsg(this, { diy: res.data.message })
        } else {
          this.bottomData.dataBto = res.data.data.list
          this.bottomData.dataBto.map((val, i) => {
            val.formalFlag = this.bottomData.formalFlag[val.formalFlag]
          })
        }
      })
    },
    addAliasSave () {//更新别名保存事件
      this.$refs['addOrUpdAlias'].validate((valid) => {
        if (valid) {
          this.formAddOrUpd.bottomData.showModal = false
          if (this.formAddOrUpd.isUpd) {
            this.aliasupdated()
          } else {
            this.addAliasAjax()
          }
        }
      })
    },
    addAliasAjax () {//新增别名ajax
      this.loadKEEp = true;
      var nowData = {
        "formalFlag": this.formAddOrUpd.bottomData.formalFlag ? 1 : 0,
        "hospitalId": this.$store.state.userInfoObj.hospitalId,
        "itemName": this.formAddOrUpd.bottomData.itemName,
        "itemType": "2",
        "clinicId": this.formAddOrUpd.data.clinicItemId,
        "pyCode": this.formAddOrUpd.bottomData.pyCode,
        "wbCode": this.formAddOrUpd.bottomData.wbCode,
      }
      this.$store.dispatch("addAliasDict", nowData).then(res => {
        this.loadKEEp = false;
        if (res.data.code == 200) {
          util.showMsg(this, { succ: "新增成功" })
          this.clickshow = true
          this.getAlias(this.currObj.currItem)
        } else {
          util.showMsg(this, { diy: res.data.message })
        }
      })
    },
    aliasUpd (item) {//别名修改
      this.formAddOrUpd.isUpd = true
      this.formAddOrUpd.bottomData.showModal = true
      this.aliasTransmit(item)
    },
    aliasupdated () {//修改别名ajax
      this.loadKEEp = true;
      var nowData = {
        "aliasId": this.formAddOrUpd.bottomData.aliasId,
        "dataVersion": this.formAddOrUpd.bottomData.dataVersion,
        "formalFlag": this.formAddOrUpd.bottomData.formalFlag ? 1 : 0,
        "hospitalId": this.$store.state.userInfoObj.hospitalId,
        "itemName": this.formAddOrUpd.bottomData.itemName,
        "itemType": "2",
        "clinicId": this.formAddOrUpd.data.clinicItemId,
        "pyCode": this.formAddOrUpd.bottomData.pyCode,
        "wbCode": this.formAddOrUpd.bottomData.wbCode,
      }
      this.$store.dispatch("updAliasDict", nowData).then(res => {
        this.loadKEEp = false;
        if (res.data.code == 200) {
          util.showMsg(this, { succ: "修改成功" })
          this.clickshow = true
          this.getAlias(this.currObj.currItem)
        } else {
          util.showMsg(this, { diy: res.data.message })
        }
      })
    },
    aliasTransmit (item) {//别名值传递
      this.formAddOrUpd.bottomData.itemName = item.itemName
      this.formAddOrUpd.bottomData.wbCode = item.wbCode
      this.formAddOrUpd.bottomData.pyCode = item.pyCode
      this.formAddOrUpd.bottomData.dataVersion = item.dataVersion
      this.formAddOrUpd.bottomData.aliasId = item.aliasId
      this.formAddOrUpd.bottomData.formalFlag = item.formalFlag == '否' ? false : true
    },
    getDept (item) {//获取执行科室
      let nowData = {
        itemType: 2,
        clinicId: item.clinicItemId
      }
      this.bottomLoading.right = true
      this.$store.dispatch("getPerformeDept", nowData).then(res => {
        this.bottomLoading.right = false
        if (res.data.code != 200) {
          util.showMsg(this, { diy: res.data.message })
        } else {
          this.bottomData.dataDept = res.data.data.list
          util.id2Name(this.bottomData.dataDept, "deptId", "deptName", this.bottomData.allDept, "deptId", "deptName")
          this.bottomData.dataDept.map((val, i) => {
            val.defaultFlag = this.bottomData.formalFlag[val.defaultFlag]
          })
        }
      })
    },
    getCliVsPrice (item) {//获取收费对应
      let nowData = {
        clinicItemId: this.formAddOrUpd.data.clinicItemId
      }
      this.bottomLoading.left = true
      this.$store.dispatch("getClinicItemVsPrice", nowData).then(res => {
        this.bottomLoading.left = false
        if (res.data.code != 200) {
          util.showMsg(this, { diy: res.data.message })
        } else {
          let resList = res.data.data.list
          //收费数组添加类别name字段
          util.id2Name(this.bottomData.allPrice, "itemClassCode", "itemClassName", this.bottomData.allPriceitemClassList, "flagdataValue", "flagdataValueRemark")
          //  CVP数组添加收费name字段
          util.id2Name(resList, "priceItemCode", "priceItemName", this.bottomData.allPrice, "itemCode", "itemName")
          //  CVP数组添加收费单位unit字段
          util.id2Name(resList, "priceItemCode", "unit", this.bottomData.allPrice, "itemCode", "unit")
          //  CVP数组添加收费单位price字段
          util.id2Name(resList, "priceItemCode", "price", this.bottomData.allPrice, "itemCode", "price")
          //  CVP数组添加收费规格itemSpec字段
          util.id2Name(resList, "priceItemCode", "itemSpec", this.bottomData.allPrice, "itemCode", "itemSpec")
          //  CVP数组添加收费规格itemSpec字段
          util.id2Name(resList, "priceItemCode", "itemClassName", this.bottomData.allPrice, "itemCode", "itemClassName")
          //  CVP数组添加收费itemClassCode字段
          util.id2Name(resList, "priceItemCode", "itemClassCode", this.bottomData.allPrice, "itemCode", "itemClassCode")
          //  CVP数组状态字段换值文字
          let reslist1 = []
          resList.map((val, i) => {
            val.multipleFlag = this.bottomData.formalFlag[val.multipleFlag]
            val.price = val.price == '' ? 0 : val.price.toFixed(2)
            val.pricesum = val.price * val.amount
            val.pricesum = val.pricesum.toFixed(2)
            if (val.itemClassName != '') {
              reslist1.push(val)
            }
          })
          this.bottomData.dataCliVsPrice = reslist1
        }
      })
    },
    getSelectOptionsFun () {     //查询名称下拉列表
      if (util.isEmpty(this.valCode)) {
        return
      }
      this.spinShowDP = true;
      let nowData = {
        'hospitalId': this.$store.state.userInfoObj.hospitalId,
        'priceItemClass': this.valCode,
        'priceType': 'CUR',
        'size': 6,
        'page': this.selectOptionsPage,
        "searchParam": this.selectSerachParam,
      }
      this.$store.dispatch('getPriceU', nowData).then(res => {
        if (res.data.code === 200) {
          this.cliVsPriceData.from.priceItemCodeList = this.cliVsPriceData.from.priceItemCodeList.concat(res.data.data.list)
          this.spinShowDP = false
        } else {
          util.showMsg(this, { diy: res.data.message })
        }
      })
    },
    selectObject (val) {      //名称 下拉内容
      this.selectSerachParam = val.label
      this.cliVsPriceData.from.priceItemCode = val.itemCode
      let index = util.indexOfObject(this.cliVsPriceData.from.priceItemCode, this.bottomData.allPrice, 'itemCode')
      if (index != -1) {
        this.cliVsPriceData.from.itemSpec = '';
        this.cliVsPriceData.from.unit = '';
        this.cliVsPriceData.from.itemSpec = this.bottomData.allPrice[index].itemSpec
        this.cliVsPriceData.from.unit = this.bottomData.allPrice[index].unit
      }
    },
    cliVsPriceAdd () {//新增临床收费对应ajax
      this.loadKEep = true;
      var nowData = {
        "amount": this.cliVsPriceData.from.amount,
        "clinicItemId": this.formAddOrUpd.data.clinicItemId,
        "hospitalId": this.$store.state.userInfoObj.hospitalId,
        "multipleFlag": this.cliVsPriceData.from.multipleFlag ? 1 : 0,
        "priceItemCode": this.cliVsPriceData.from.priceItemCode,
      }
      this.$store.dispatch("addClinicItemVsPrice", nowData).then(res => {
        if (res.data.code == 200) {
          util.showMsg(this, { succ: "新增成功" })
          this.clickshow = true
          this.getCliVsPrice(this.currObj.currItem)
          this.itemSearch()
        } else {
          util.showMsg(this, { diy: res.data.message })
        }
        this.loadKEep = false;
      })
    },
    addCVPSave () {//更新收费对应保存
      this.$refs['addOrUpdCVP'].validate((valid) => {
        if (valid) {
          if (this.formAddOrUpd.isUpd) {
            this.updatedCVPAjax()
          } else {
            this.cliVsPriceAdd()
          }
          this.formAddOrUpd.bottomData.showCliVsPrice = false
        }
      })
    },
    cliVsPriceUpd (item) {//收费对应更新
      this.formAddOrUpd.isUpd = true
      this.$refs['addOrUpdCVP'].resetFields();
      this.transmitCVP(item)
      this.formAddOrUpd.bottomData.showCliVsPrice = true
    },
    updatedCVPAjax () {//修改临床收费ajax
      this.loadKEep = true;
      var nowData = {
        "amount": this.cliVsPriceData.from.amount,
        "multipleFlag": this.cliVsPriceData.from.multipleFlag ? 1 : 0,
        "clinicVsPriceId": this.cliVsPriceData.from.clinicVsPriceId,
        "dataVersion": this.cliVsPriceData.from.dataVersion,
      }
      this.$store.dispatch("updClinicItemVsPrice", nowData).then(res => {
        this.loadKEep = false;
        if (res.data.code == 200) {
          util.showMsg(this, { succ: "修改成功" })
          this.clickshow = true
          this.tableInit()
          this.itemSearch()
        } else {
          util.showMsg(this, { diy: res.data.message })
        }
      })
    },
    transmitCVP (item) {//收费对应值传递
      this.cliVsPriceData.from.priceItemCode = item.priceItemCode
      this.cliVsPriceData.from.priceItemName = item.priceItemName
      this.cliVsPriceData.from.priceClassId = item.itemClassCode
      this.cliVsPriceData.from.itemSpec = item.itemSpec
      this.cliVsPriceData.from.unit = item.unit
      this.cliVsPriceData.from.amount = item.amount
      this.cliVsPriceData.from.dataVersion = item.dataVersion
      this.cliVsPriceData.from.clinicVsPriceId = item.clinicVsPriceId
      this.cliVsPriceData.from.multipleFlag = item.multipleFlag == "是" ? true : false
    },
    cliVsPriceStop (item) {//收费对应停用
      this.formAddOrUpd.isCVP = true
      this.formAddOrUpd.isAlias = false
      this.formAddOrUpd.isDept = false
      this.showModal.stopMsg = '确定要删除对应收费项目' + '【' + item.priceItemName + '】吗？';
      this.transmitCVP(item)
      this.showModal.showStop = true
    },
    cliVsPriceDel () {//删除收费对应
      this.loadwarn = true;
      let data = {
        id: this.cliVsPriceData.from.clinicVsPriceId
      }
      this.$store.dispatch("delClinicItemVsPrice", data).then(res => {
        if (res.data.code == 200) {
          util.showMsg(this, { succ: "删除成功" })
          this.clickshow = true
          this.getCliVsPrice(this.currObj.currItem)
        } else {
          util.showMsg(this, { diy: res.data.message })
        }
        this.loadwarn = false;
      })
    },
    aliasDel () {//删除别名
      this.loadwarn = true;
      let data = {
        id: this.formAddOrUpd.bottomData.aliasId
      }
      this.$store.dispatch("delAliasDict", data).then(res => {
        if (res.data.code == 200) {
          util.showMsg(this, { succ: "删除成功" })
          this.clickshow = true
          this.getAlias(this.currObj.currItem)
        } else {
          util.showMsg(this, { diy: res.data.message })
        }
        this.loadwarn = false;
      })
    },
    handleReset (name) {//表单验证重置
      this.$refs[name].resetFields();
    },
    addcencel () {     //收费对应弹框取消按钮
      this.formAddOrUpd.bottomData.showCliVsPrice = false
    },
    tabsClick () {//底部三个切换的时候要请求相应的接口
      if (this.bottomData.tabs == '收费对应') {
        if (JSON.stringify(this.currObj.currItem) != "{}") {  //判断是否选中项目，如果没有选中项目，底部表格显示为空
          this.getCliVsPrice(this.currObj.currItem)
        } else {
          this.bottomData.dataCliVsPrice = []
        }
      } else if (this.bottomData.tabs == '别名') {
        if (JSON.stringify(this.currObj.currItem) != "{}") {
          this.getAlias(this.currObj.currItem)
        } else {
          this.bottomData.dataBto = []
        }
      } else {
        if (JSON.stringify(this.currObj.currItem) != "{}") {
          this.getDept(this.currObj.currItem)
        } else {
          this.bottomData.dataDept = []
        }
      }
    }
  },
}
</script>
<style lang="less" scoped>
.tableBox {
  height: 53%;
}

@import "../../../../styles/common.less";
#btn {
  position: absolute;
  right: 17px;
  z-index: 10;
}

#lastCho {
  position: absolute;
  right: 40px;
  top: 75px;
  z-index: 10;
}
</style>
<style lang='less'>
.clinical-project {
  thead {
    text-align: center;
  }

  .ivu-tabs-bar {
    margin-bottom: 14px;
    // border-bottom: none;
  }
}

.ivu-page-simple .ivu-page-simple-pager input {
  width: 45px !important;
}

.ivu-form-item-error-tip {
  position: absolute;
  top: 100%;
  left: 75px;
  line-height: 1;
  padding-top: 6px;
  color: #f30;
}
</style>

