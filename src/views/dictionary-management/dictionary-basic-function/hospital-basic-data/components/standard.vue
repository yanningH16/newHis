<template>
  <div>
    <div class="title">
      <form class="form-horizontal fl">
        <div class="form-group"
             style="display:flex;align-items:center;">
          <label for="query"
                 class="control-label">{{ title }}</label>
          <Input v-model.trim="query"
                 id="query"
                 style="width: 180px"
                 placeholder="请输入数据值或拼音码" />
        </div>
      </form>
      <div class="fl">
        <Checkbox v-model="isStop"
                  style="line-height:34px;margin-left:12px;width:100px">显示全部
        </Checkbox>
      </div>
      <div class="fl"
           style="width:auto;min-width:300px;font-size:14px;">
        <span v-show="!buttonFlag">标准数据：{{ text.standardTotle }}</span>
        <span v-show="!buttonFlag">扩展数据：{{ text.customTotle }}</span>
        <span>{{ text.code }}</span>
      </div>
      <Button type="primary"
              @click="addcustom"
              class="fr"
              v-show="buttonFlag">
        <i class="iconfont icon-tianjia"></i>
        新增
      </Button>
    </div>
    <div id="tab">
      <Table stripe
             border
             highlight-row
             :height="tabHeight"
             :loading="dataLoad"
             :columns="buttonFlag?detailColumnsVal:detailColumns"
             :data="basicDataTotle"></Table>
    </div>
    <div style="margin: 12px;float:right">
      <Page @Page="changPage"
            :tabpage="tabPage"
            @pageNum="changPageNum" />
    </div>
    <div>
      <usage v-show="flag.usage.state"
             :modalFlag="modalFlag"
             @query="queryNowData"
             :modalParams="modalParams" />
      <frequency v-show="flag.frequency.state"
                 :modalFlag="modalFlag"
                 @query="queryNowData"
                 :modalParams="modalParams" />
      <nursingGrade v-show="flag.nursingGrade.state"
                    :modalFlag="modalFlag"
                    @query="queryNowData"
                    :modalParams="modalParams" />
      <custom v-show="flag.custom.state"
              @query="queryNowData"
              :text="text"
              :modalFlag="modalFlag"
              :modalStatus="modalStatus"
              :modalParams="modalParams" />
    </div>
    <!-- 新增  -->
    <!-- "this.modalParams == '' ? ruleValidate : ruleValidateBZ" -->
    <Modal v-model="addcustomModel"
           width="420"
           :closable="false"
           :mask-closable="false">
      <Form ref="formValidate"
            class="stanForm"
            :model="formValidate"
            :rules="ruleValidate"
            :label-width="70">
        <div>
          <FormItem label="数据值"
                    prop="dataValueRemark">
            <Input v-model.trim="formValidate.dataValueRemark"
                   style="width: 286px;" />
          </FormItem>
          <FormItem label="代码"
                    prop="stantCode">
            <Input v-model.trim="formValidate.stantCode"
                   style="width: 286px;" />
          </FormItem>
          <FormItem label="序号"
                    prop="serialNumber">
            <Input v-model="formValidate.serialNumber"
                   :maxlength="5"
                   style="width: 286px" />
          </FormItem>
        </div>
      </Form>
      <div slot="footer">
        <Button type="text"
                @click.stop="dictModalCancel('formValidate')">取消
        </Button>
        <Button type="primary"
                @click.stop="dictModalOk('formValidate')"
                :loading="loading.loadingSave">保存
        </Button>
      </div>
    </Modal>
  </div>
</template>

<script>
import util from '../../../../../libs/util.js'
import Page from '../../../../components/page1.vue'
import usage from './setModal/usage.vue'
import frequency from './setModal/frequency.vue'
import nursingGrade from './setModal/nursingGrade.vue'
import custom from './setModal/custom.vue'

export default {
  name: 'standard',
  data () {
    const validatedataValue = (rule, value, callback) => {
      var reg = /^[0-9]*$/;
      if (value === '') {
        callback(new Error('请填写代码'));
      } else if (!reg.test(value * 1)) {
        callback(new Error('只能为整数字'));
      } else {
        callback();
      }
    };
    const validatedatadataValueRemark = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请填写数据值'));
      } else {
        callback();
      }
    };
    const validateAge = (rule, value, callback) => {
      if (!Number.isInteger(value * 1)) {
        callback(new Error('序号只能为整数字'));
      } else if (value * 1 <= 0 && value != null && value != '') {
        callback(new Error('序号必须大于0'));
      } else {
        callback();
      }
    };
    return {
      name: 'frequency',
      addcustomModel: false,   //自定义字典  新增
      tabHeight: '',
      basicdataValue: '',
      basiNum: '',
      dataLoad: true,
      isStop: false,
      loading: {
        loadingSave: false  //新增保存 按钮
      },
      updateAuthority: "",
      formValidate: {
        dataValueRemark: '',
        serialNumber: null,
        outpEnable: true,
        pdDataValueId: '',
        dataValue: '',
        stantCode: ''
      },
      ruleValidate: {
        dataValueRemark: [
          { required: true, validator: validatedatadataValueRemark, trigger: 'blur' }
        ],
        serialNumber: [{ validator: validateAge, trigger: 'blur' }],
        stantCode: [
          { required: true, validator: validatedataValue, trigger: 'blur' }
        ]
      },
      ruleValidateBZ: {
        dataValueRemark: [
          { required: true, message: '请填写数据值', trigger: 'blur' }
        ],
        serialNumber: [{ validator: validateAge, trigger: 'blur' }],
      },
      detailColumns: [
        {
          title: '数据ID',
          align: 'center',
          key: 'basicdatavalueId'
        },
        {
          title: '数据值',
          key: 'dataValueRemark'
        },
        {
          title: '是否使用',
          align: 'center',
          key: 'enable'
        },
        {
          title: '标准',
          align: 'center',
          key: 'extFlag'
        },
        {
          title: '标准对照ID',
          align: 'center',
          key: 'pdDataValueId'
        },
        {
          title: '标准对照值',
          align: 'left',
          key: 'pdDataValue'
        },
        {
          title: '操作',
          align: 'center',
          width: 140,
          key: 'action',
          render: (h, params) => {
            if (params.row.extFlag != "是") {
              return h('div', [
                h(
                  'Poptip',
                  {
                    props: this.updateAuthority === "1" ? {
                      trigger: 'hover',
                      placement: 'top'
                    } : {}
                  },
                  [
                    h('i', {
                      class: this.updateAuthority === "1" ? util.icon.modifyNew : "",
                      style: {
                        marginRight: '16px'
                      },
                      on: {
                        click: () => {
                          this.updateBasicDataValue(params)
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
                      class: params.row.enableReversal == "停用" ? util.icon.stop : util.icon.start,
                      on: {
                        click: () => {
                          this.stateBasicDataValue(params)
                        }
                      }
                    }),
                    h(
                      'div',
                      {
                        slot: 'content'
                      },
                      params.row.enableReversal == "停用" ? '停用' : '启用'
                    )
                  ]
                )
              ]);
            } else {
              return h('div', [
                h(
                  'Poptip',
                  {
                    props: this.updateAuthority === "1" ? {
                      trigger: 'hover',
                      placement: 'top'
                    } : {}
                  },
                  [
                    h('i', {
                      class: this.updateAuthority === "1" ? util.icon.modifyNew : "",
                      style: {
                        marginRight: '16px'
                      },
                      on: {
                        click: () => {
                          this.updateBasicDataValue(params)
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
                      class: params.row.enableReversal == "停用" ? util.icon.stop : util.icon.start,
                      style: {
                        marginRight: '16px'
                      },
                      on: {
                        click: () => {
                          this.stateBasicDataValue(params)
                        }
                      }
                    }),
                    h(
                      'div',
                      {
                        slot: 'content'
                      },
                      params.row.enableReversal == "停用" ? '停用' : '启用'
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
                      class: params.row.canExt == '1' && params.row.extFlag == '是' ? util.icon.extend : '',
                      on: {
                        click: () => {
                          this.text.dataValue = params.row.dataValue
                          this.addBasicDataValue(params)
                        }
                      }
                    }),
                    h(
                      'div',
                      {
                        slot: 'content'
                      },
                      '扩展'
                    )
                  ]
                )
              ]);
            }
          }
        }
      ],
      detailColumnsVal: [
        {
          title: '数据ID',
          align: 'center',
          key: 'basicdatavalueId'
        },
        {
          title: '数据值',
          key: 'dataValueRemark'
        },
        {
          title: '是否使用',
          align: 'center',
          key: 'enable'
        },
        {
          title: '标准',
          align: 'center',
          key: 'extFlag'
        },
        {
          title: '操作',
          align: 'center',
          width: 120,
          key: 'action',
          render: (h, params) => {
            if (params.row.extFlag != "是") {
              return h('div', [
                h(
                  'Poptip',
                  {
                    props: this.updateAuthority === "1" ? {
                      trigger: 'hover',
                      placement: 'top'
                    } : {}
                  },
                  [
                    h('i', {
                      class: this.updateAuthority === "1" ? util.icon.modifyNew : "",
                      style: {
                        marginRight: '16px'
                      },
                      on: {
                        click: () => {
                          this.updateBasicDataValue(params)
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
                      class: params.row.enableReversal == "停用" ? util.icon.stop : util.icon.start,
                      on: {
                        click: () => {
                          this.stateBasicDataValue(params)
                        }
                      }
                    }),
                    h(
                      'div',
                      {
                        slot: 'content'
                      },
                      params.row.enableReversal == "停用" ? '停用' : '启用'
                    )
                  ]
                )
              ]);
            } else {
              return h('div', [
                h(
                  'Poptip',
                  {
                    props: this.updateAuthority === "1" ? {
                      trigger: 'hover',
                      placement: 'top'
                    } : {}
                  },
                  [
                    h('i', {
                      class: this.updateAuthority === "1" ? util.icon.modifyNew : "",
                      style: {
                        marginRight: '16px'
                      },
                      on: {
                        click: () => {
                          this.updateBasicDataValue(params)
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
                      class: params.row.enableReversal == "停用" ? util.icon.stop : util.icon.start,
                      style: {
                        marginRight: '16px'
                      },
                      on: {
                        click: () => {
                          this.stateBasicDataValue(params)
                        }
                      }
                    }),
                    h(
                      'div',
                      {
                        slot: 'content'
                      },
                      params.row.enableReversal == "停用" ? '停用' : '启用'
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
                      class: params.row.canExt == '1' && params.row.extFlag == '是' ? util.icon.extend : '',
                      on: {
                        click: () => {
                          this.text.dataValue = params.row.dataValue
                          this.addBasicDataValue(params)
                        }
                      }
                    }),
                    h(
                      'div',
                      {
                        slot: 'content'
                      },
                      '扩展'
                    )
                  ]
                )
              ]);
            }
          }
        }
      ],
      detailData: [],
      id: '',
      text: {
        standardTotle: 0,
        customTotle: 0,
        code: '',
        dataValue: ''
      },
      curPage: 1,
      page: 1,
      pageSize: 15,
      pageSelf: 1,
      tabPage: 1,
      query: '',  //模糊查询内容
      title: '代码表',
      basicDataTotle: [],  //表格数据集合
      flag: {
        usage: {
          state: false,
          updateBasicData: false,
          addBasicData: false
        },
        frequency: {
          state: false,
          updateBasicData: false,
          addBasicData: false
        },
        nursingGrade: {
          state: false,
          updateBasicData: false,
          addBasicData: false
        },
        custom: {
          state: false,
          updateBasicData: false,
          addBasicData: false
        }
      },
      modalFlag: '',
      modalStatus: '',
      modalParams: '',
      buttonFlag: false,  //控制 新增按钮
      update: {}
    }
  },
  props: ["standardParams", "tableData"],
  components: { Page, usage, frequency, custom, nursingGrade },
  watch: {
    isStop (val, oldval) {
      this.page = 1
      this.curPage = 1
      this.tabPage = 1
      this.newBasicDataVal()
      // this.tableInit();
      console.log(val, '看看')
    },
    //判断是否左侧树选中
    tableData () {
      if (this.tableData == 0) {
        this.basicDataTotle = []
      }
    },
    //监控左侧树选中更改
    standardParams: {
      handler (newValue, oldValue) {
        this.curPage = 1
        this.page = 1
        this.tabPage = 1
        this.isStop = false
        this.query = ''
        if (!util.isEmpty(newValue)) {
          this.title = newValue[0].title
          this.id = newValue[0].basicdataId
          this.newBasicDataVal()
        } else {
          this.text.standardTotle = 0
          this.text.customTotle = 0
          this.text.code = ''
          this.detailData = []
          this.basicDataTotle = []
        }
      },
      deep: true
    },
    //监听模糊查询输入框 获取新的列表数据
    query (val) {
      this.page = 1
      this.curPage = 1
      this.tabPage = 1
      this.newBasicDataVal()  //获取列表数据
    },
    page (val) {
      this.curPage = val
      this.newBasicDataVal()
    },
    //监控各个弹框展示
    flag: {
      handler (newValue, oldValue) {
        this.modalFlag = newValue
      },
      deep: true
    }
  },
  methods: {
    //接受page1组件 切换到某一页
    changPage (Page) {
      this.page = Page
    },
    //接受page1组件 切换每页多少条
    changPageNum (val) {
      this.page = 1;
      this.tabPage = ""
      this.pageSize = val;
      if (util.isEmpty(this.basicDataTotle)) {
        return
      }
      this.newBasicDataVal()
    },
    // 自定义字典新增
    addcustom (params) {
      this.formValidate.pdDataValueId = params.pdDataValueId
      this.modalParams = util.isEmpty(params.basicdataId) ? '' : params
      this.addcustomModel = true
      this.$refs['formValidate'].resetFields();
    },
    //自定义字典 新增保存
    dictModalOk (name) {
      this.$refs[name].validate((valid) => {
        if (valid) {
          let data = {
            "dataValueRemark": this.formValidate.dataValueRemark,
            "enable": this.formValidate.outpEnable ? '1' : '0',
            "basicdatavalueId": this.modalParams.basicdatavalueId,
            "pdDataValueId": this.formValidate.pdDataValueId,
            "hospitalId": this.$store.state.userInfoObj.hospitalId,
            "basicdataId": this.standardParams[0].basicdataId,
            'serialNumber': this.formValidate.serialNumber,
            "dataValue": this.formValidate.stantCode,   //扩展自定义数据没有dataValue
          }
          this.loading.loadingSave = true
          this.$store.dispatch("addBasicDataValue", data).then(res => {
            if (res.data.code !== 200) {
              util.showMsg(this, { diy: res.data.message })
            } else {
              this.newBasicDataVal();
              util.showMsg(this, { succ: '新增成功!' })
              this.addcustomModel = false
            }
            this.loading.loadingSave = false
          })
        }
      })
    },
    dictModalCancel (name) {
      this.addcustomModel = false
      this.$refs[name].resetFields();
      this.$refs['formValidate'].resetFields();
    },
    //获取某字典表格数据
    newBasicDataVal () {
      if (this.tableData === 0) {
        this.basicDataTotle = []
        return
      }
      this.basiNum = ''
      this.text.code = this.standardParams[0].basicDataCode   //  选中树某项基本code
      //this.standardParams[0].identificationFlag  是否为为自定义字典 新增
      if (util.isEmpty(this.standardParams[0].identificationFlag)) {
        this.buttonFlag = true
      } else {
        this.buttonFlag = false
      }

      this.text.standardTotle = 0
      this.text.customTotle = 0
      this.basicDataTotle = []
      let data = {
        page: this.page,
        size: this.pageSize,
        basicdataId: this.id,
        hospitalId: this.$store.state.userInfoObj.hospitalId,
        enable: !this.isStop ? 1 : 3
      }
      if (this.query) {
        data['query'] = this.query
      }
      this.dataLoad = true;
      this.$store.dispatch("basicDataValueByRemark", data).then(res => {
        if (res.data.code != 200) {
          util.showMsg(this, { diy: res.data.message })
        } else {
          this.dataLoad = false;
          this.basiNum = '1'
          this.tabPage = res.data.data.pages
          let list = res.data.data.list
          let arry = []
          if (this.$store.state.userInfoObj.mapList.length > 0) {
            this.updateAuthority = ''
            this.$store.state.userInfoObj.mapList.map((val, i) => {
              if (val.resourceId == "6" && this.standardParams[0].initializeFlag == "0") {
                this.updateAuthority = val.resourceParam
              }
            })
          } else {
            if (this.$store.state.userInfoObj.userTypes == "1") {
              this.updateAuthority = "1"
            }
          }
          list.map((val, i) => {
            arry.push({
              basicdataId: val.basicdataId,
              basicdatavalueId: val.basicdatavalueId,
              dataValueRemark: val.dataValueRemark,
              enable: util.switch(val.enable),
              enableReversal: util.switchReversal(val.enable),
              extInfo: val.extInfo,
              extFlag: util.extFlag(val.extFlag),
              canExt: val.canExt,
              serialNumber: val.serialNumber,
              pdDataValueId: val.pdDataValueId,
              pdDataValue: val.pdDataValue,
              dataVersion: val.dataVersion,
              wbCode: val.wbCode,
              pyCode: val.pyCode,
              dataValue: val.dataValue,
              hospitalId: val.hospitalId
            })
            this.basicDataTotle = arry
            if (val.extFlag == 0) {
              this.text.standardTotle++
            } else {
              this.text.customTotle++
            }

          })
        }
      })
    },

    // 修改基础数据值  根据基础code  不同弹框展示判断
    updateBasicDataValue (params) {
      this.modalStatus = this.standardParams[0].identificationFlag
      console.log(this.standardParams[0].identificationFlag)
      switch (this.standardParams[0].identificationFlag) {
        case 'PD0000000367':
          this.flag.frequency.state = true
          this.flag.frequency.updateBasicData = true
          this.flag.frequency.addBasicData = false
          break;
        case 'PD0000000408':
          this.flag.usage.state = true
          this.flag.usage.updateBasicData = true
          this.flag.usage.addBasicData = false
          break;
        case 'PD0000000126':
          this.flag.nursingGrade.state = true
          this.flag.nursingGrade.updateBasicData = true
          this.flag.nursingGrade.addBasicData = false
          break;
        default:
          this.flag.custom.state = true
          this.flag.custom.updateBasicData = true
          this.flag.custom.addBasicData = false
      }
      this.modalParams = params.row
    },

    // 扩展基础数据值
    addBasicDataValue (params) {
      this.modalParams = params.row
      this.modalStatus = this.standardParams[0].identificationFlag
      switch (this.standardParams[0].identificationFlag) {
        case 'PD0000000367':
          this.flag.frequency.state = true
          this.flag.frequency.updateBasicData = false
          this.flag.frequency.addBasicData = true
          break;
        case 'PD0000000408':
          this.flag.usage.state = true
          this.flag.usage.updateBasicData = false
          this.flag.usage.addBasicData = true
          break;
        case 'PD0000000126':
          this.flag.nursingGrade.state = true
          this.flag.nursingGrade.updateBasicData = false
          this.flag.nursingGrade.addBasicData = true
          break;
        default:
          this.flag.custom.state = true
          this.flag.custom.updateBasicData = false
          this.flag.custom.addBasicData = true
      }
    },
    //向hospital-basic-data 组件传值
    queryNowData (val) {
      console.log(val)
      this.$emit('refresh', val)
    },
    // 修改基础数据值的状态
    stateBasicDataValue (params) {
      let data = {
        "basicdataId": params.row.basicdataId,
        "basicdatavalueId": params.row.basicdatavalueId,
        "enable": params.row.enable == "启用" ? 0 : 1,
        "hospitalId": params.row.hospitalId,
        "dataVersion": params.row.dataVersion,
        'DataValueRemark': params.row.dataValueRemark,
        'dataValue': params.row.dataValue

      }
      this.$store.dispatch("updateBasicDataValue", data).then(res => {
        if (res.data.code != 200) {
          util.showMsg(this, { diy: res.data.message })
        } else {
          this.newBasicDataVal()
          util.showMsg(this, { succ: "使用状态修改成功" })
        }
      })
    }
  },
  mounted () {
    this.tabHeight = $("#tab").height();
    this.dataLoad = false;
  }
}
</script>
<style>
.stanForm .ivu-form-item .ivu-form-item-content .ivu-form-item-error-tip {
  position: absolute;
  top: 100%;
  line-height: 1;
  padding-top: 6px;
  color: #ed3f14;
}
</style>
<style lang="less" scoped>
@import "../../../../../styles/common.less";
@import "../hospital-basic-data.less";

#tab {
  height: calc(100vh - 25px);
}
</style>

