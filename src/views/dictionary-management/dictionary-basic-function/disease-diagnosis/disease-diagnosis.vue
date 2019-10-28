<template>
  <div class="main"
       style="height: 98%;padding: 13px 17px 0;background: #fff;width:100%">
    <div class="mainContent"
         style="display:flex">
      <div style="height:100%;border-right:2px solid #e9e9e9;position: relative;padding-right:16px;width:40.5%">
        <form class="form-horizontal"
              onsubmit="return false;">
          <div class="form-group">
            <label class="control-label"
                   style="font-weight: bold;">标准疾病诊断</label>
            <i-Input @on-change="seachStandard"
                     v-model.trim="standard"
                     style="width: 200px"
                     placeholder="请输入编码或名称"></i-Input>
          </div>
        </form>
        <!--左侧-->
        <div class="content tab"
             ref="tab">
          <Table stripe
                 highlight-row
                 border
                 disabled-hover
                 :loading="loading"
                 :height="tabHeight"
                 :columns="standardColumns"
                 :data="standardData"
                 ref="leftTableRef"
                 @on-row-click="leftTableClick"></Table>
        </div>
        <div class="fr"
             style="margin-top:10px;">
          <Page @Page="changPage"
                :tabpage="tabPage" />
        </div>
      </div>
      <div style="margin-left:16px;width:58%">
        <div style="display:flex;">
          <form class="form-horizontal"
                onsubmit="return false;">
            <div class="form-group">
              <label for="hospital"
                     class="control-label"
                     style="font-weight: bold;">医院疾病诊断</label>
              <i-Input @on-change='seachHospital'
                       v-model.trim="hospital"
                       id="hospital"
                       style="width: 200px"
                       placeholder="请输入编码或名称"></i-Input>
            </div>
          </form>
          <div class="form-group"
               style="margin:5px 0 0 26px;">
            <Checkbox v-model="single">显示全部</Checkbox>
          </div>
        </div>
        <div class="content">
          <Table stripe
                 highlight-row
                 disabled-hover
                 border
                 :loading="loading1"
                 :height="tabHeight"
                 ref="rightTableRef"
                 @on-row-click="rightTableClick"
                 :columns="this.saveData == ''?hospitalColumnsList:hospitalColumns"
                 :data="hospitalData"></Table>
        </div>
        <div class="fr"
             style="margin-top:10px;">
          <Page @Page="changPageVal"
                :tabpage="tabPageVal" />
        </div>
      </div>
    </div>
    <!-- 修改 -->
    <Modal v-model="administrationDictUpdate"
           width="600"
           :closable="false"
           :mask-closable="false">
      <Form ref="formValidateUpdate"
            :model="formValidateUpdate"
            :rules="ruleValidateUpdate"
            :label-width="110">
        <div class="clearfix">
          <FormItem class="fl"
                    label="ICD-10码"
                    prop="dataValue"
                    style="display:inline-block;width: 48%;">
            <i-Input v-model.trim="formValidateUpdate.diagIcd"
                     style="width: 144px;"
                     disabled></i-Input>
          </FormItem>
          <FormItem class="fr"
                    label="扩展码"
                    prop="diagSecondIcd"
                    style="display:inline-block;width: 48%;">
            <i-Input v-model.trim="formValidateUpdate.diagSecondIcd"
                     style="width: 144px;"></i-Input>
          </FormItem>
        </div>
        <FormItem class="formClassS"
                  label="疾病诊断名称"
                  prop="diagName">
          <i-Input v-model.trim="formValidateUpdate.diagName"
                   style="width: 439px;"></i-Input>
        </FormItem>
        <div class="clearfix">
          <FormItem class="fl fls"
                    label="生效日期"
                    prop="beginDate"
                    style="display:inline-block;width: 48%;">
            <DatePicker type="datetime"
                        v-model="formValidateUpdate.beginDate"
                        format="yyyy-MM-dd"
                        style="width: 144px"
                        disabled></DatePicker>
          </FormItem>
          <FormItem class="fr"
                    label="失效日期"
                    prop="endDate"
                    style="display:inline-block;width: 48%;">
            <DatePicker type="datetime"
                        v-model="formValidateUpdate.endDate"
                        format="yyyy-MM-dd"
                        style="width: 144px"></DatePicker>
          </FormItem>
        </div>
        <div class="clearfix">
          <FormItem class="fl"
                    label="拼音码"
                    prop="pyCode"
                    style="display:inline-block;width: 48%;">
            <i-Input v-model.trim="formValidateUpdate.pyCode"
                     style="width: 144px;"></i-Input>
          </FormItem>
          <FormItem class="fr"
                    label="五笔码"
                    prop="wbCode"
                    style="display:inline-block;width: 48%;">
            <i-Input v-model.trim="formValidateUpdate.wbCode"
                     style="width: 144px;"></i-Input>
          </FormItem>
        </div>
      </Form>
      <div slot="footer">
        <Button type="text"
                @click="updateDictModalCancel('formValidateUpdate')">取消
        </Button>
        <Button type="primary"
                @click="updateDictModalOk('formValidateUpdate')">保存
        </Button>
      </div>
    </Modal>
    <!-- 增加 -->
    <Modal v-model="administrationDictAdd"
           width="600"
           :closable="false"
           :mask-closable="false">
      <Form ref="formValidateAdd"
            :model="formValidateAdd"
            :rules="ruleValidateAdd"
            :label-width="110">
        <div class="clearfix">
          <FormItem class="fl"
                    label="ICD-10码"
                    prop="dataValue"
                    style="display:inline-block;width: 48%;">
            <i-Input v-model.trim="formValidateAdd.dataValue"
                     style="width: 144px;"
                     disabled></i-Input>
          </FormItem>
          <FormItem class="fr"
                    label="扩展码"
                    prop="diagSecondIcd"
                    style="display:inline-block;width: 48%;">
            <i-Input v-model.trim="formValidateAdd.diagSecondIcd"
                     style="width: 144px;"></i-Input>
          </FormItem>
        </div>
        <FormItem label="疾病诊断名称"
                  class="formClassS"
                  prop="diagName">
          <i-Input v-model.trim="formValidateAdd.diagName"
                   style="width: 439px;"></i-Input>
        </FormItem>
        <div class="clearfix">
          <FormItem class="fl fls"
                    label="生效日期"
                    prop="beginDate"
                    style="display:inline-block;width: 48%;">
            <DatePicker type="datetime"
                        v-model="formValidateAdd.beginDate"
                        format="yyyy-MM-dd"
                        style="width: 144px"></DatePicker>
          </FormItem>
          <FormItem class="fr"
                    label="失效日期"
                    prop="endDate"
                    style="display:inline-block;width: 48%;">
            <DatePicker type="datetime"
                        v-model="formValidateAdd.endDate"
                        format="yyyy-MM-dd"
                        style="width: 144px"></DatePicker>
          </FormItem>
        </div>
        <div class="clearfix">
          <FormItem class="fl"
                    label="拼音码"
                    prop="pyCode"
                    style="display:inline-block;width: 48%;">
            <i-Input v-model.trim="formValidateAdd.pyCode"
                     style="width: 144px;"></i-Input>
          </FormItem>
          <FormItem class="fr"
                    label="五笔码"
                    prop="wbCode"
                    style="display:inline-block;width: 48%;">
            <i-Input v-model.trim="formValidateAdd.wbCode"
                     style="width: 144px;"></i-Input>
          </FormItem>
        </div>
      </Form>
      <div slot="footer">
        <Button type="text"
                @click="addDictModalCancel('formValidateAdd')">取消
        </Button>
        <Button type="primary"
                @click="addDictModalOk('formValidateAdd')">保存
        </Button>
      </div>
    </Modal>
    <!-- 停用确认 -->
    <ConfirmDeletion :show="showModal.showStop"
                     :msg="showModal.stopMsg"
                     title='操作'
                     :btntext='showModal.stopBtnText'
                     @ok="changeOk"
                     @close="showModal.showStop=false" />
  </div>
</template>

<script>
import util from '../../../../libs/util.js';
import Page from '../../../components/page.vue'
import ConfirmDeletion from '../../../components/confirmDeletion.vue'

export default {
  name: 'disease-diagnosis',
  data () {
    return {
      oldVal: null,
      loading: false,
      loading1: false,
      name: "disease-diagnosis",
      saveData: '',
      showModal: {//显示
        showStop: false,
        stopMsg: '',
        stopBtnText: '',
      },
      stopParams: {},
      //标准疾病诊断  搜索内容
      standard: '',
      hospital: '',
      tabHeight: '',
      pageSize: 18,
      single: false,
      curPageRight: 1,
      //标准疾病诊断表格
      standardColumns: [
        {
          title: 'ICD-10编码',
          width: 120,
          key: 'dataValue',
        },
        {
          title: '诊断名称',
          key: 'dataValueRemark'
        },
        {
          title: '操作',
          key: 'action',
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
                    class: [
                      util.icon.select
                    ],
                    style: {
                      verticalAlign: 'middle',
                      fontSize: '20px'
                    },
                    on: {
                      click: () => {
                        this.standardChoice(params)
                      }
                    }
                  }),
                  h(
                    'div',
                    {
                      slot: 'content'
                    },
                    '新增'
                  )
                ]
              )
            ]);
          }
        }
      ],
      standardData: [],
      hospitalColumns: [
        {
          title: 'ICD-10编码',
          width: 100,
          key: 'diagIcd',
        },
        {
          title: '诊断名称',
          key: 'diagName'
        },
        {
          title: '扩展码',
          width: 110,
          key: 'diagSecondIcd'
        },
        {
          title: '失效日期',
          width: 100,
          align: 'center',
          key: 'endDate'
        },
        {
          title: '操作',
          key: 'action',
          width: 100,
          align: 'center',
          render: (h, params) => {
            if (!util.isEmpty(params.row.endDate) && params.row.endDate.substr(0, 10) < util.getFullDate()) {
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
                      class: util.icon.start,
                      style: {
                        verticalAlign: 'middle'
                      },
                      on: {
                        click: () => {
                          this.sysDiagDictStateStart(params)
                        }
                      }
                    }),
                    h(
                      'div',
                      {
                        slot: 'content'
                      },
                      '启用'
                    )
                  ]
                )
              ])
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
                    style: {
                      marginRight: '6px',
                      verticalAlign: 'middle',
                      fontSize: '18px'
                    },
                    on: {
                      click: () => {
                        this.sysDiagDictUpdate(params.row)
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
                    class: util.icon.stop,
                    style: {
                      verticalAlign: 'middle'
                    },
                    on: {
                      click: () => {
                        this.sysDiagDictState(params)
                      }
                    }
                  }),
                  h(
                    'div',
                    {
                      slot: 'content'
                    },
                    '停用'
                  )
                ]
              )
            ]);
          }
        }
      ],
      hospitalColumnsList: [
        {
          title: 'ICD-10编码',
          width: 100,
          key: 'dataValue',
        },
        {
          title: '诊断名称',
          key: 'dataValueRemark'
        },
        {
          title: '扩展码',
          width: 110,
          key: 'diagSecondIcd'
        },
        {
          title: '失效日期',
          width: 100,
          align: 'center',
          key: 'endDate'
        },
        {
          title: '操作',
          key: 'action',
          width: 100,
          align: 'center',
          render: (h, params) => {
            if (!util.isEmpty(params.row.endDate) && params.row.endDate.substr(0, 10) < util.getFullDate()) {
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
                      class: util.icon.start,
                      style: {
                        verticalAlign: 'middle'
                      },
                      on: {
                        click: () => {
                          this.sysDiagDictStateStart(params)
                        }
                      }
                    }),
                    h(
                      'div',
                      {
                        slot: 'content'
                      },
                      '启用'
                    )
                  ]
                )
              ])
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
                    style: {
                      marginRight: '16px',
                      verticalAlign: 'middle',
                      fontSize: '18px'
                    },
                    on: {
                      click: () => {
                        this.sysDiagDictUpdate(params.row)
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
                    class: [
                      util.icon.stop
                    ],
                    style: {
                      verticalAlign: 'middle'
                    },
                    on: {
                      click: () => {
                        this.sysDiagDictState(params)
                      }
                    }
                  }),
                  h(
                    'div',
                    {
                      slot: 'content'
                    },
                    '停用'
                  )
                ]
              )
            ]);
          }
        }
      ],
      hospitalData: [],
      page: 1,
      tabPage: 1,
      tabPageVal: 1,
      pageVal: 1,
      administrationDictAdd: false,
      administrationDictUpdate: false,
      //左侧表格新增form表单参数
      formValidateAdd: {
        hospitalId: '',
        dataValue: '',
        diagSecondIcd: '',
        diagName: '',
        beginDate: new Date().format('yyyy-MM-dd'),
        endDate: '',
        pyCode: '',
        wbCode: ''
      },
      ruleValidateAdd: {
        diagName: [
          { required: true, message: '请填写疾病诊断名称', trigger: 'blur' }
        ],
        beginDate: [
          { required: true, type: 'date', message: '请选择生效日期', trigger: 'change' }
        ]
      },
      formValidateUpdate: {
        dataVersion: '',
        hospitalId: '',
        dataValue: '',
        diagSecondIcd: '',
        diagName: '',
        beginDate: '',
        endDate: '',
        pyCode: '',
        wbCode: ''
      },
      ruleValidateUpdate: {
        diagName: [
          { required: true, message: '请填写疾病诊断名称', trigger: 'blur' }
        ]
      },
      standardTotle: [],
      rowOldRightData: {
        datavalueId: null
      },
    }
  },
  components: {
    Page,
    ConfirmDeletion
  },
  watch: {
    single (val) {
      this.pageVal = 1
      this.tabPageVal = 1
      this.hospitalValue(this.saveData)
    },
  },
  methods: {
    getListByDateValue (val, standard) {
      this.pageSize = parseInt(this.tabHeight / 43);
      let data = ''
      if (!util.isEmpty(standard)) {
        data = {
          hospitalId: 0,
          primaryDataCode: 'PD0000000017',
          dataValueRemark: standard,
          dataValue: standard,
          pyCode: standard.toUpperCase(),
          wbCode: standard,
          page: val,
          size: this.pageSize
        }
      } else {
        data = {
          hospitalId: 0,
          primaryDataCode: 'PD0000000017',
          page: val,
          size: this.pageSize
        }
      }
      this.loading = true
      //请求标准疾病诊断列表数据
      this.$store.dispatch("getListByDateValue", data).then(res => {
        if (res.data.code != 200) {
          util.showMsg(this, { diy: res.data.message })
        } else {
          this.tabPage = res.data.data.pages
          this.standardData = res.data.data.list
          this.loading = false
        }
      })
    },

    //标准诊断的列表
    init () {
      this.tabHeight = this.$refs.tab.offsetHeight;
      this.pageSize = parseInt(this.tabHeight / 43);
      let data = ''
      if (!util.isEmpty(this.standard)) {
        data = {
          hospitalId: 0,
          primaryDataCode: 'PD0000000017',
          dataValueRemark: this.standard,
          dataValue: this.standard,
          pyCode: this.standard.toUpperCase(),
          wbCode: this.standard,
          page: this.page,
          size: this.pageSize
        }
      } else {
        data = {
          hospitalId: 0,
          primaryDataCode: 'PD0000000017',
          page: this.page,
          size: this.pageSize
        }
      }
      this.loading = true
      this.$store.dispatch("getSysParameterPageId", data).then(res => {
        if (res.data.code != 200) {
          util.showMsg(this, { diy: res.data.message })
        } else {
          this.tabPage = res.data.data.pages
          this.standardData = res.data.data.list
          this.loading = false
        }
      })
    },
    //左侧
    changPage (Page) {
      this.page = Page
      this.init(this.page)
    },
    //右侧
    changPageVal (Page) {
      this.pageVal = Page
      this.hospitalValue(this.saveData)
    },

    /**
     * 判断左侧表格是否选中，并根据选中状态更改右侧表格显示的数据
     * @param val
     */
    leftTableClick (val) {
      this.pageVal = 1
      // console.log("leftTableClick")
      if (!util.isEmpty(this.oldVal)) {
        if (util.isEmpty(this.oldVal.dataValue)) {
          this.hospitalValue(val)
          this.oldVal = val
        } else {
          if (val.dataValue === this.oldVal.dataValue) {
            this.$refs.leftTableRef.clearCurrentRow();
            let tempObj = JSON.parse(JSON.stringify(val));
            tempObj.dataValue = undefined;
            this.hospitalValue(tempObj);
            this.oldVal = tempObj
          } else {
            this.hospitalValue(val);
            this.oldVal = val
          }
        }

      } else {
        this.hospitalValue(val);
        this.oldVal = val
      }
    },
    //右侧查询接口
    hospitalValue (val) {
      this.saveData = val
      this.hospitalData = []
      let data = {
        hospitalId: this.$store.state.userInfoObj.hospitalId,
        page: this.pageVal,
        size: this.pageSize,
        diagIcd: util.isEmpty(val) ? undefined : val.dataValue,
        condition: util.isEmpty(this.hospital) ? undefined : this.hospital,
        endDate: this.single ? undefined : new Date().format('yyyy-MM-dd 23:59:59')
      }
      this.$store.dispatch("getBasicDataValueSel", data).then(res => {
        this.loading1 = true
        if (res.data.code != 200 || res.data.code != 200) {
          util.showMsg(this, { diy: res.data.message })
        } else {
          this.hospitalData = res.data.data.list
          this.hospitalData.map((val, i) => {
            if (!util.isEmpty(val.endDate)) {
              val.endDate = val.endDate.substr(0, 10)
            }
          })
          this.tabPageVal = res.data.data.pages
          this.loading1 = false
        }
      })
    },
    //左侧表格新增
    standardChoice (params) {
      this.administrationDictAdd = true
      this.formValidateAdd.dataValue = params.row.dataValue
      this.formValidateAdd.diagSecondIcd = ''
      this.formValidateAdd.diagName = params.row.dataValueRemark
      this.formValidateAdd.pyCode = params.row.pyCode
      this.formValidateAdd.wbCode = params.row.wbCode
      this.formValidateAdd.dataVersion = params.row.dataVersion
      this.formValidateAdd.hospitalId = params.row.hospitalId
    },
    //添加确认
    addDictModalOk (name) {
      console.log(1111)
      this.$refs[name].validate((valid) => {
        if (valid) {
          let endDate = ''
          let beginDate = ''
          if (!util.isEmail(this.formValidateAdd.endDate) && this.formValidateAdd.endDate != '') {
            endDate = this.formValidateAdd.endDate.format('yyyy-MM-dd')
          }
          if (!util.isEmail(this.formValidateAdd.endDate) && this.formValidateAdd.beginDate != '') {
            beginDate = this.formValidateAdd.beginDate.format('yyyy-MM-dd')
          }
          console.log(1111)
          if (!util.isEmpty(endDate)) {
            let timeend = (endDate).toString().indexOf('-') != -1 ? endDate : endDate.format('yyyy-MM-dd');
            let timeStar = (beginDate).toString().indexOf('-') != -1 ? beginDate : beginDate.format('yyyy-MM-dd');
            // console.log(timeend,timeStar)
            if (!this.timeCheck(timeStar + '', timeend + '')) {
              util.showMsg(this, { warning: '结束时间不能小于开始时间！' })
              return
            } else {
              this.addAjax(this.formValidateAdd, endDate, beginDate)
            }
          } else {
            this.addAjax(this.formValidateAdd, endDate, beginDate)
          }
        }
      })
    },
    //添加请求
    addAjax (params, endDate, beginDate) {
      console.log(1111)
      let data = {
        "beginDate": beginDate,
        "diagIcd": params.dataValue,
        "diagName": params.diagName,
        "diagSecondIcd": params.diagSecondIcd,
        "endDate": endDate,
        "hospitalId": this.$store.state.userInfoObj.hospitalId,
        "pyCode": params.pyCode,
        "wbCode": params.wbCode
      }
      this.$store.dispatch("addSysDiagDict", data).then(res => {
        if (res.data.code === 200) {
          let list = res.data.data
          this.hospitalValue(this.saveData)
          this.$refs['formValidateAdd'].resetFields();
        } else {
          util.showMsg(this, { diy: res.data.message })
          this.$refs['formValidateAdd'].resetFields();
        }
      })
      this.administrationDictAdd = false
    },
    //添加弹框
    addDictModalCancel (name) {
      this.administrationDictAdd = false
      this.$refs[name].resetFields();
    },
    //修改
    sysDiagDictUpdate (params) {
      // console.log(params)
      this.administrationDictUpdate = true
      this.formValidateUpdate.diagIcd = params.diagIcd
      this.formValidateUpdate.diagSecondIcd = params.diagSecondIcd
      this.formValidateUpdate.diagName = params.diagName
      this.formValidateUpdate.beginDate = params.beginDate
      this.formValidateUpdate.endDate = params.endDate
      this.formValidateUpdate.pyCode = params.pyCode
      this.formValidateUpdate.wbCode = params.wbCode
      this.formValidateUpdate.wbCode = params.wbCode
      this.formValidateUpdate.dataVersion = params.dataVersion
      this.formValidateUpdate.hospitalId = params.hospitalId
      this.formValidateUpdate.diagId = params.diagId
    },
    //判断时间 生效时间小于失效时间
    timeCheck (timeStar, timeend) {
      var arr = timeStar.split("-");
      var starttime = new Date(arr[0], arr[1], arr[2]);
      var starttimes = starttime.getTime();
      var array = timeend.split(" ")
      var arrs = array[0].split("-");
      // console.log(arr,2222)
      var endtime = new Date(arrs[0], arrs[1], arrs[2]);
      var endtimes = endtime.getTime();
      if (starttimes > endtimes)//开始大于结束
      {
        return false;
      } else {
        return true;
      }
    },
    //右侧的修改
    updateDictModalOk (name) {
      if (util.isEmpty(this.formValidateUpdate.diagName)) {
        util.showMsg(this, { warning: '请填写疾病诊断名称' })
        return
      }
      if (!util.isEmpty(this.formValidateUpdate.endDate)) {
        let timeend = (this.formValidateUpdate.endDate).toString().indexOf('-') != -1 ? this.formValidateUpdate.endDate : this.formValidateUpdate.endDate.format('yyyy-MM-dd');
        let timeStar = (this.formValidateUpdate.beginDate).toString().indexOf('-') != -1 ? this.formValidateUpdate.beginDate : this.formValidateUpdate.beginDate.format('yyyy-MM-dd');
        // console.log(timeend,timeStar)
        if (!this.timeCheck(timeStar + '', timeend + '')) {
          util.showMsg(this, { warning: '结束时间不能小于开始时间！' })
          return
        }
      }
      let data = {
        "beginDate": this.formValidateUpdate.beginDate,
        "dataVersion": this.formValidateUpdate.dataVersion,
        "diagId": this.formValidateUpdate.diagId,
        "diagName": this.formValidateUpdate.diagName,
        "diagSecondIcd": this.formValidateUpdate.diagSecondIcd,
        "endDate": util.isEmpty(this.formValidateUpdate.endDate) ? '' : (this.formValidateUpdate.endDate).toString().indexOf('-') != -1 ? this.formValidateUpdate.endDate : this.formValidateUpdate.endDate.format('yyyy-MM-dd hh:mm:ss'),
        "hospitalId": this.formValidateUpdate.hospitalId,
        "pyCode": this.formValidateUpdate.pyCode,
        "wbCode": this.formValidateUpdate.wbCode
      }
      this.$store.dispatch("updateSysDiagDict", data).then(res => {
        if (res.data.code === 200) {
          this.administrationDictUpdate = false
          util.showMsg(this, { succ: '修改成功' })
          this.hospitalValue(this.saveData)
          this.$refs['formValidateUpdate'].resetFields();
        } else {
          util.showMsg(this, { diy: res.data.message })
          this.$refs['formValidateUpdate'].resetFields();
        }
      })
    },
    updateDictModalCancel (name) {
      this.administrationDictUpdate = false
      this.$refs[name].resetFields();
    },
    //停用确认
    changeOk () {
      this.showModal.showStop = false
      if (this.showModal.stopBtnText === '停用') {
        if (this.stopParams.row.endDate == null || this.stopParams.row.endDate > util.getFullDate()) {
          let data = {
            "endDate": util.getYYYYMMDDDate() + ' 00:00:00',
            "dataVersion": this.stopParams.row.dataVersion,
            "diagVersion": this.stopParams.row.diagVersion,
            "rangeCode": this.stopParams.row.rangeCode,
            "diagName": this.stopParams.row.diagName,
            "diagSecondIcd": this.stopParams.row.diagSecondIcd,
            "beginDate": this.stopParams.row.beginDate,
            "pyCode": this.stopParams.row.pyCode,
            "wbCode": this.stopParams.row.wbCode,
            "diagId": this.stopParams.row.diagId
          }
          this.$store.dispatch("updateSysDiagDict", data).then(res => {
            if (res.data.code == 200) {
              this.hospitalValue(this.saveData)
            } else {
              util.showMsg({ diy: res.data.message })
            }

          })
        } else {
          params.row.dataValue = params.row.diagIcd
          this.addAjax(params.row, '', util.getFullDate())
        }
      } else {//启用
        let data = {
          "endDate": '',
          "dataVersion": this.stopParams.row.dataVersion,
          "diagVersion": this.stopParams.row.diagVersion,
          "rangeCode": this.stopParams.row.rangeCode,
          "diagName": this.stopParams.row.diagName,
          "diagSecondIcd": this.stopParams.row.diagSecondIcd,
          "beginDate": this.stopParams.row.beginDate,
          "pyCode": this.stopParams.row.pyCode,
          "wbCode": this.stopParams.row.wbCode,
          "diagId": this.stopParams.row.diagId
        }
        this.$store.dispatch("updateSysDiagDict", data).then(res => {
          if (res.data.code == 200) {
            this.hospitalValue(this.saveData)
          } else {
            util.showMsg({ diy: res.data.message })
          }
        })
      }

    },
    //右侧表格停用
    sysDiagDictState (params) {
      this.showModal.showStop = true
      this.showModal.stopMsg = '确认停用【' + params.row.diagName + '】吗？'
      this.stopParams = params,
        this.showModal.stopBtnText = '停用'
    },
    //点击启用按钮
    sysDiagDictStateStart (params) {
      this.showModal.showStop = true
      this.showModal.stopMsg = '确认启用【' + params.row.diagName + '】吗？'
      this.stopParams = params
      this.showModal.stopBtnText = '启用'
    },
    // 搜索   标准疾病诊断
    seachStandard (iten) {
      this.page = 1
      this.tabPage = 1
      if (iten === 1) {
        this.standardData = []
        this.getListByDateValue(1, null);
        this.$refs.rightTableRef.clearCurrentRow();
        this.init()
        return
      }
      if (util.isEmpty(this.standard)) {
        this.seachHospital(1)
      }
      this.standardData = []
      this.$refs.rightTableRef.clearCurrentRow();
      this.init()
    },
    //模糊查询监视
    seachHospital (item) {
      this.pageVal = 1
      this.tabPageVal = 1
      if (item === 1) {
        this.hospitalData = []
        this.hospitalValue(null)
        this.$refs.leftTableRef.clearCurrentRow();
        this.rowOldRightData.datavalueId = null;
        return
      }
      if (util.isEmpty(this.hospital)) {
        this.seachStandard(1)
      }
      this.hospitalData = []
      this.hospitalValue(null)
      this.$refs.leftTableRef.clearCurrentRow();
      this.rowOldRightData.datavalueId = null;
    },
    //右侧表格点击搜索
    rightTableClick (rowRightData) {
      // console.log("我执行了")
      if (this.rowOldRightData.datavalueId == rowRightData.datavalueId) {
        this.$refs.rightTableRef.clearCurrentRow();
        this.rowOldRightData.datavalueId = null;
        this.getListByDateValue(1, null);
      } else {
        this.rowOldRightData = rowRightData;
        this.getListByDateValue(1, rowRightData.dataValue);
      }
    }
  },
  mounted () {
    this.init()
    this.hospitalValue()
  }
}
</script>

<style lang="less" scoped>
@import "../../../../styles/common.less";

.content {
  margin-top: 10px;
}

.content .ivu-page {
  position: absolute;
  bottom: -25px;
  right: 6px;
}

.tab {
  height: calc(100vh - 24px);
}
</style>
<style>
.mainContent .ivu-page-simple .ivu-page-simple-pager input {
  width: 45px !important;
}
</style>

