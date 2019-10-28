<template>
  <div>
    <!-- 修改 -->
    <Modal v-model="updateBasicData"
           width="420"
           :closable="false"
           :mask-closable="false">
      <Form ref="formValidateUpdate"
            :model="formValidateUpdate"
            class="frequen"
            :label-width="90">
        <FormItem label="数据值"
                  class="must-item">
          <Input v-model.trim="formValidateUpdate.dataValueRemark"
                 style="width: 286px;"
                 :disabled="disabled" />
          <!-- 标准对照值:{{this.modalParams.pdDataValue}} -->
        </FormItem>
        <FormItem label="标准对照值">
          {{this.modalParams.pdDataValue}}
        </FormItem>
        <FormItem label="代码"
                  class="must-item">
          <Input v-model.trim="formValidateUpdate.stantCode"
                 style="width: 286px;" />
        </FormItem>
        <FormItem label="描述"
                  style="display:inline-block;width: 56%;">
          <Input v-model.trim="formValidateUpdate.freqDesc"
                 style="width: 137px;" />
        </FormItem>
        <FormItem label="计数次数"
                  class="must-item"
                  style="display:inline-block;width: 40%;margin-left:12px;">
          <InputNumber v-model.trim="counts"
                       :min="1"
                       style="width: 67px;"></InputNumber>
        </FormItem>
        <FormItem label="间隔"
                  class="must-item"
                  style="display:inline-block;width: 56%;">
          <InputNumber v-model.trim="intervals"
                       :disabled="upshow"
                       :min="1"
                       style="width: 137px;"></InputNumber>
        </FormItem>
        <FormItem label="单位"
                  class="must-item"
                  style="display:inline-block;width: 40%;margin-left:12px;">
          <Select v-model="units"
                  :disabled="upshow"
                  @on-change='unitsChange'
                  style="width: 67px;">
            <Option v-for="item in unitsList"
                    :key="item.lable"
                    :value="item.lable">{{item.value}}</Option>
          </Select>
        </FormItem>
        <FormItem label="执行时间"
                  style="display:inline-block;width: 56%;position:relative">
          <!-- <TimePicker v-model="defaultTime" format="HH:mm" style="width: 137px"></TimePicker> -->
          <Input v-model="defaultTime"
                 style="width:137px;"
                 @click.native="focusChange"
                 disabled />
          <div style="position:absolute;z-index:99999"
               v-on:mouseleave='blurChange'>
            <Card class="cardInfo"
                  v-show="weekIsShow"
                  style="width:272px;">
              <div style="text-align:left">
                <span>时间</span>
                <Input v-model="formValidateUpdate.weekTime"
                       style="width:200px;display:inline-block;margin-left:6px"
                       placeholder="请按照正确格式输入例如:08:00,16:00" />
                <p style="margin-top:5px">
                  <CheckboxGroup v-model="weekDate"
                                 @on-change='weekChange'>
                    <Checkbox label="1">周一</Checkbox>
                    <Checkbox label="2">周二</Checkbox>
                    <Checkbox label="3">周三</Checkbox>
                    <Checkbox label="4">周四</Checkbox><br>
                    <Checkbox label="5">周五</Checkbox>
                    <Checkbox label="6">周六</Checkbox>
                    <Checkbox label="7">周日</Checkbox>
                  </CheckboxGroup>
                </p>
              </div>
            </Card>
          </div>
        </FormItem>
        <FormItem label="周医嘱"
                  style="display:inline-block;width: 40%;margin-left:12px;">
          <Checkbox v-model="weekFlag"
                    @on-change="weekFlagChange"></Checkbox>
        </FormItem>
        <FormItem label="拼音码"
                  style="display:inline-block;width: 56%;">
          <Input v-model.trim="formValidateUpdate.pyCode"
                 style="width: 137px;" />
        </FormItem>
        <FormItem label="持续"
                  style="display:inline-block;width: 40%;margin-left:12px;">
          <Checkbox v-model="formValidateUpdate.continueFlag"></Checkbox>
        </FormItem>
        <FormItem label="五笔码"
                  style="display:inline-block;width: 56%;">
          <Input v-model.trim="formValidateUpdate.wbCode"
                 style="width: 137px;" />
        </FormItem>
        <FormItem label="备注">
          <Input v-model.trim="formValidateUpdate.remark"
                 style="width:286px"
                 type="textarea"
                 :autosize="{minRows: 2,maxRows: 5}" />
        </FormItem>
      </Form>
      <div slot="footer">
        <Button type="text"
                @click="updateDictModalCancel('formValidateUpdate')">取消</Button>
        <Button type="primary"
                @click="updateDictModalOk('formValidateUpdate')">保存</Button>
      </div>
    </Modal>
    <!-- 扩展 -->
    <Modal v-model="addBasicData"
           width="420"
           :closable="false"
           :mask-closable="false">
      <Form ref="formValidateAdd"
            :model="formValidateAdd"
            :rules="ruleValidateAdd"
            class="frequen"
            :label-width="90">
        <FormItem label="数据值"
                  prop="dataValueRemark">
          <Input v-model.trim="formValidateAdd.dataValueRemark"
                 style="width: 286px;" />
        </FormItem>
        <FormItem label="标准对照值">
          {{this.modalParams.pdDataValue}}
        </FormItem>
        <FormItem label="代码"
                  prop="stantCode">
          <Input v-model.trim="formValidateAdd.stantCode"
                 style="width: 286px;" />
        </FormItem>
        <FormItem label="标准对照"
                  prop="basicdatavalueId"
                  style="display:inline-block;width: 40%;margin-left:12px;">
          <Input v-model.trim="formValidateAdd.basicdatavalueId"
                 style="width: 67px;"
                 disabled />
        </FormItem>
        <FormItem label="描述"
                  prop="freqDesc"
                  style="display:inline-block;width: 56%;">
          <Input v-model.trim="formValidateAdd.freqDesc"
                 style="width: 137px;" />
        </FormItem>
        <FormItem label="计数次数"
                  prop="countsadd"
                  style="display:inline-block;width: 40%;margin-left:12px;">
          <InputNumber v-model.trim="countsadd"
                       :min="0"
                       style="width: 67px;"></InputNumber>
        </FormItem>
        <FormItem label="间隔"
                  prop="intervals"
                  style="display:inline-block;width: 56%;">
          <InputNumber v-model.trim="intervalsadd"
                       :disabled="addshow"
                       :min="0"
                       style="width: 137px;"></InputNumber>
        </FormItem>
        <FormItem label="单位"
                  prop="units"
                  style="display:inline-block;width: 40%;margin-left:12px;">
          <Select v-model="unitsadd"
                  @on-change='utitsaddChange'
                  :disabled="addshow"
                  style="width: 67px;">
            <Option v-for="item in unitsList"
                    :key="item.lable"
                    :value="item.lable">{{item.value}}</Option>
          </Select>
        </FormItem>
        <FormItem label="执行时间"
                  prop="defaultaddTime"
                  style="display:inline-block;width: 56%;position:relative">
          <Input v-model="defaultaddTime"
                 style="width:137px;"
                 disabled
                 @click.native="focusChange" />
          <div style="position:absolute;z-index:99999;left:0px;"
               v-on:mouseleave='blurChange'>
            <Card class="cardInfo"
                  v-show="weekIsShow"
                  style="width:272px;">
              <div style="text-align:left">
                <span>时间</span>
                <Input v-model="formValidateAdd.weekTime"
                       style="width:200px;display:inline-block;margin-left:6px"
                       placeholder="请按照正确格式输入例如:08:00,16:00" />
                <p style="margin-top:5px">
                  <CheckboxGroup v-model="weekDate"
                                 @on-change='weekChange'>
                    <Checkbox label="1">周一</Checkbox>
                    <Checkbox label="2">周二</Checkbox>
                    <Checkbox label="3">周三</Checkbox>
                    <Checkbox label="4">周四</Checkbox><br>
                    <Checkbox label="5">周五</Checkbox>
                    <Checkbox label="6">周六</Checkbox>
                    <Checkbox label="7">周日</Checkbox>
                  </CheckboxGroup>
                </p>
              </div>
            </Card>
          </div>
        </FormItem>
        <FormItem label="周医嘱"
                  prop="weekFlagadd"
                  style="display:inline-block;width: 40%;margin-left:12px;">
          <Checkbox v-model="weekFlagadd"
                    @on-change="weekFlagChange"></Checkbox>
        </FormItem>
        <FormItem label="拼音码"
                  prop="pyCode"
                  style="display:inline-block;width: 56%;">
          <Input v-model.trim="formValidateAdd.pyCode"
                 style="width: 137px;" />
        </FormItem>
        <FormItem label="持续"
                  prop="continueFlag"
                  style="display:inline-block;width: 40%;margin-left:12px;">
          <Checkbox v-model="formValidateAdd.continueFlag"></Checkbox>
        </FormItem>
        <FormItem label="五笔码"
                  prop="wbCode"
                  style="display:inline-block;width: 56%;">
          <Input v-model.trim="formValidateAdd.wbCode"
                 style="width: 137px;" />
        </FormItem>
        <FormItem label="备注"
                  prop="remark">
          <Input v-model.trim="formValidateAdd.remark"
                 style="width:308px"
                 type="textarea"
                 :autosize="{minRows: 2,maxRows: 5}" />
        </FormItem>
      </Form>
      <div slot="footer">
        <Button type="text"
                @click="addDictModalCancel('formValidateAdd')">取消</Button>
        <Button type="primary"
                @click="addDictModalOk('formValidateAdd')">保存</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
import util from '../../../../../../libs/util.js'
export default {
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
    return {
      name: "frequency",
      upshow: false,
      addshow: false,
      weekIsShow: false,
      updateBasicData: false,
      disabled: false,
      weekDate: [],
      defaultTime: '',
      intervals: 1,
      units: 'W',
      counts: 1,
      weekFlag: null,
      formValidateUpdate: {
        dataValueRemark: '',
        basicdatavalueId: '',
        freqDesc: '',
        dataVersion: '',
        counts: 1,
        enable: false,
        weekFlag: false,
        continueFlag: false,
        pyCode: '',
        wbCode: '',
        remark: '',
        weekTime: '',
        saveWeek: '',
        stantCode: '',
        intervals: 1,
        units: 'W',

      },
      unitsList: [
        {
          lable: 'W',
          value: "周"
        },
        {
          lable: 'D',
          value: "日"
        },
        {
          lable: 'H',
          value: "小时"
        },
        {
          lable: 'M',
          value: "分"
        },
        {
          lable: 'T',
          value: "即刻"
        },
      ],
      addBasicData: false,
      defaultaddTime: '',
      intervalsadd: 1,
      unitsadd: '',
      countsadd: 1,
      weekFlagadd: null,
      formValidateAdd: {
        dataValueRemark: '',
        basicdatavalueId: '',
        freqDesc: '',
        dataVersion: '',
        unitsadd: '',
        countsadd: 1,
        enable: '',
        weekFlag: '',
        continueFlag: '',
        pyCode: '',
        wbCode: '',
        remark: '',
        weekTime: '',
        saveWeek: '',
        stantCode: ''
      },
      ruleValidateAdd: {
        dataValueRemark: [
          { required: true, message: '请填写数据值', trigger: 'blur' }
        ],
        countsadd: [
          { required: true, type: 'number', message: '请填写计数次数', trigger: 'change' }
        ],
        unitsadd: [
          { required: true, message: '请填写单位', trigger: 'blur' }
        ],
        intervalsadd: [
          { required: true, type: 'number', message: '请填写间隔数', trigger: 'change' }
        ],
        stantCode: [
          { required: true, validator: validatedataValue, trigger: 'blur' }
        ]
      },
    }
  },
  props: ["modalFlag", "modalParams"],
  watch: {
    weekFlag: {
      handler (newValue, oldValue) {
        if (newValue) {
          this.unitsadd = 'W'
          this.units = 'W'
        } else {
          this.unitsadd = 'D'
          this.units = 'D'
        }
      }
    },
    //修改or扩展
    modalFlag: {
      handler (newValue, oldValue) {
        this.$refs['formValidateUpdate'].resetFields()
        if (newValue.frequency.updateBasicData) {
          this.updateBasicData = true
          this.updateDict()
        } else if (newValue.frequency.addBasicData) {
          this.addBasicData = true
          this.addDict()
        }

      },
      deep: true
    },
    modalParams: {
      handler (newValue, oldValue) {
        if (newValue.extFlag == "是") {
          this.disabled = true
        } else {
          this.disabled = false
        }
      }
    },
  },

  methods: {
    //执行时间聚焦时候
    focusChange () {
      this.weekIsShow = true
      let abc = ''
      if (this.updateBasicData) {
        abc = this.defaultTime.split('|')
        if (abc.length > 1) {
          this.formValidateUpdate.weekTime = abc[1].toString()
        } else {
          this.formValidateUpdate.weekTime = abc[0].toString()
        }
      } else {
        abc = this.defaultaddTime.split('|')
        if (abc.length > 1) {
          this.formValidateAdd.weekTime = abc[1].toString()
        } else {
          this.formValidateAdd.weekTime = abc[0].toString()
        }
      }

    },
    //时间car离开时候的时候
    blurChange () {
      console.log(this.formValidateUpdate.weekTime)
      console.log(this.formValidateAdd.weekTime)
      let saveWeek = this.weekDate.length > 0 ? this.weekDate.toString() + '|' : ''
      if (this.updateBasicData) {
        if (this.weekFlag) {//true  则是修改周医嘱
          let arrTest = this.formValidateUpdate.weekTime.split(',')
          if (arrTest.length > 1) {
            util.showMsg(this, { warning: '周医嘱时间点只能有一个' })
            return
          }
        }
        this.defaultTime = ''
        this.defaultTime = saveWeek + this.defaultTime + this.formValidateUpdate.weekTime
      } else {
        if (this.weekFlagadd) {//true  则是修改周医嘱
          let arrTest = this.formValidateAdd.weekTime.split(',')
          if (arrTest.length > 1) {
            util.showMsg(this, { warning: '周医嘱时间点只能有一个' })
            return
          }
        }
        this.defaultaddTime = ''
        this.defaultaddTime = saveWeek + this.defaultaddTime + this.formValidateAdd.weekTime
      }
      this.weekIsShow = false
    },
    //执行时间
    weekChange (val) {
      if (this.updateBasicData) {
        this.weekFlag = val.length > 0 ? true : false
        this.formValidateUpdate.saveWeek = val.length > 0 ? val.toString() + '|' : ''
      } else {
        this.weekFlagadd = val.length > 0 ? true : false
        this.formValidateAdd.saveWeek = val.length > 0 ? val.toString() + '|' : ''
      }
    },
    //修改执行时间 联动单位周医嘱
    weekFlagChange (val) {
      if (val) {
        this.weekIsShow = true
        if (this.updateBasicData) {
          this.defaultTime = !util.isEmpty(this.defaultTime.split('|')[1]) ? this.defaultTime.split('|')[1].substr(0, 5) : this.defaultTime.split('|')[0].substr(0, 5)
          this.intervals = 1
          this.formValidateUpdate.intervals = 1
          this.formValidateUpdate.units = 'W'
          this.units = 'W'
          this.upshow = true
        } else {
          this.defaultaddTime = !util.isEmpty(this.defaultaddTime.split('|')[0]) ? this.defaultaddTime.split('|')[0].substr(0, 5) : this.defaultaddTime.split('|')[0].substr(0, 5)
          this.unitsadd = 'W'
          this.intervalsadd = 1
          this.formValidateAdd.intervals = 1
          this.formValidateAdd.units = 'W'
          this.addshow = true
        }
      } else {
        this.units = 'D'
        this.formValidateAdd.unitsadd = 'D'
        this.weekIsShow = false
        if (this.updateBasicData) {
          this.defaultTime = !util.isEmpty(this.defaultTime.split('|')[1]) ? this.defaultTime.split('|')[1] : this.defaultTime.split('|')[0]
          this.upshow = false
        } else {
          this.defaultaddTime = !util.isEmpty(this.defaultaddTime.split('|')[1]) ? this.defaultaddTime.split('|')[1] : this.defaultaddTime.split('|')[0]
          this.addshow = false
        }
        this.weekDate = []
      }
    },
    // 修改查询
    updateDict () {
      let data = {
        id: this.modalParams.basicdatavalueId
      }
      this.$store.dispatch("getFrequency", data).then(res => {
        if (res.data.code != 200) {
          util.showMsg(this, { diy: res.data.message })
        } else {
          let list = res.data.data
          this.formValidateUpdate = list

          if (list.frequency.defaultTime.split('|').length > 1) {
            this.formValidateUpdate.weekTime = list.frequency.defaultTime.split('|')[1]
            this.weekDate = list.frequency.defaultTime.split('|')[0].split(',')
          } else {
            this.formValidateUpdate.weekTime = list.frequency.defaultTime.split('|')[0]
            this.weekDate = []
          }
          this.formValidateUpdate.stantCode = list.dataValue
          this.counts = list.frequency.counts
          this.formValidateUpdate.counts = list.frequency.counts
          this.formValidateUpdate.intervals = list.frequency.intervals
          this.formValidateUpdate.units = list.frequency.units
          this.intervals = list.frequency.intervals
          this.units = list.frequency.units
          this.formValidateUpdate.freqDesc = list.frequency.freqDesc
          this.defaultTime = list.frequency.defaultTime
          this.formValidateUpdate.remark = list.frequency.remark
          this.formValidateUpdate.enable = list.enable == 1 ? true : false
          this.weekFlag = list.frequency.weekFlag == 1 ? true : false
          this.formValidateUpdate.continueFlag = list.frequency.continueFlag == 1 ? true : false
        }
      })
    },
    // 修改确认
    updateDictModalOk (name) {
      //判断代码值
      var reg = /^[0-9]*$/;
      if (util.isEmpty(this.formValidateUpdate.stantCode)) {
        util.showMsg(this, { warning: '请填写代码' })
        return
      } else if (!reg.test(this.formValidateUpdate.stantCode * 1)) {
        util.showMsg(this, { warning: '只能为整数字' })
        return
      }
      console.log(this.intervals)
      if (util.isEmpty(this.intervals)) {
        util.showMsg(this, { warning: '请选择时间间隔' })
        return
      }
      if (this.weekFlag && util.isEmpty(this.weekDate)) {
        util.showMsg(this, { warning: '您选择了周医嘱，请点击执行时间进行勾选' })
        return
      }
      if (this.weekFlag && this.weekDate.length > 0 && this.weekDate.length != this.counts) {
        util.showMsg(this, { warning: '您选择了周医嘱，计数次数应与周医嘱天数相同' })
        return
      }
      if (this.weekFlag == false) {
        let arrTime = this.defaultTime.split(',')
        if (arrTime.length != this.counts) {
          util.showMsg(this, { warning: '执行时间的次数应与计数次数相同' })
          return
        }
      }
      let data = {
        "basicdataId": this.formValidateUpdate.basicdataId,
        "basicdatavalueId": this.formValidateUpdate.basicdatavalueId,
        "basicdataversionId": this.formValidateUpdate.basicdataversionId,
        "basicdatavalueId": this.modalParams.basicdatavalueId,
        "dataValue": this.formValidateUpdate.stantCode,
        "dataValueRemark": this.formValidateUpdate.dataValueRemark,
        "dataVersion": this.formValidateUpdate.dataVersion,
        "enable": this.formValidateUpdate.enable ? 1 : 0,
        "endDate": this.formValidateUpdate.endDate,
        "extFlag": '',
        "extInfo": this.formValidateUpdate.extInfo,
        "frequency": {
          "continueFlag": this.formValidateUpdate.continueFlag ? 1 : 0,
          "counts": this.counts,
          "defaultTime": this.defaultTime,
          "freqDesc": this.formValidateUpdate.freqDesc,
          "freqName": this.formValidateUpdate.dataValueRemark,
          "intervals": this.intervals,
          "remark": this.formValidateUpdate.remark,
          "units": this.units,
          "weekFlag": this.weekFlag ? 1 : 0
        },
        "hospitalId": this.formValidateUpdate.hospitalId,
        "parentDatavalueId": this.formValidateUpdate.parentDatavalueId,
        "pdDataValueId": this.formValidateUpdate.pdDataValueId,
        "pyCode": this.formValidateUpdate.pyCode,
        "serialNumber": this.formValidateUpdate.serialNumber,
        "wbCode": this.formValidateUpdate.wbCode
      }
      this.$store.dispatch("updateFrequency", data).then(res => {
        if ( res.data.code !== 200) {
          util.showMsg(this, { diy: res.data.message });
        } else {
          this.updateBasicData = false
          this.modalFlag.frequency.updateBasicData = false
          this.modalFlag.frequency.state = false
          this.$emit('query', 'upd')
          util.showMsg(this, { succ: "修改成功" })
          this.weekIsShow = false
        }
      })
    },
    //修改取消
    updateDictModalCancel (name) {
      this.updateBasicData = false
      this.modalFlag.frequency.updateBasicData = false
      this.modalFlag.frequency.state = false
      this.$refs[name].resetFields();
      this.formValidateAdd.continueFlag = true
      this.weekFlagadd = true
      this.formValidateAdd.enable = true
      this.weekIsShow = false
    },
    // 扩展
    addDict () {
      this.$refs["formValidateAdd"].resetFields();
      this.formValidateAdd.dataValueRemark = this.modalParams.dataValueRemark
      this.formValidateAdd.basicdatavalueId = this.modalParams.basicdatavalueId
      this.formValidateAdd.stantCode = this.modalParams.dataValue
      this.weekFlagadd = false
      this.formValidateAdd.continueFlag = false
      this.formValidateAdd.enable = true
      this.weekDate = []
      this.unitsadd = ''
      this.defaultaddTime = ''
      this.weekFlagadd = false
      this.countsadd = 1

    },
    //扩展保存
    addDictModalOk (name) {
      if (util.isEmpty(this.unitsadd)) {
        util.showMsg(this, { warning: '请输入单位' })
        return
      }
      this.$refs[name].validate((valid) => {
        if (valid) {
          if (util.isEmpty(this.defaultaddTime)) {
            util.showMsg(this, { warning: '请输入执行时间' })
            return
          }
          if (this.weekFlagadd && this.weekDate.length == 0) {
            util.showMsg(this, { warning: '您选择了周医嘱，请点击执行时间进行勾选' })
            return
          }
          if (this.weekFlagadd && this.weekDate.length > 0 && this.weekDate.length != this.countsadd) {
            util.showMsg(this, { warning: '您选择了周医嘱，计数次数应与周医嘱个数相同' })
            return
          }
          if (this.weekFlagadd == false) {
            let arrTime = this.defaultaddTime.split(',')
            if (arrTime.length != this.countsadd) {
              util.showMsg(this, { warning: '执行时间的次数应与计数次数相同' })
              return
            }
          }
          let data = {
            "basicdataId": this.modalParams.basicdataId,
            "pdDataValueId": this.formValidateAdd.pdDataValueId,
            "basicdataversionId": this.modalParams.basicdataversionId,
            "dataValue": this.formValidateAdd.stantCode,
            "dataValueRemark": this.formValidateAdd.dataValueRemark,
            "enable": this.formValidateAdd.enable ? 1 : 0,
            "endDate": this.modalParams.endDate,
            "extFlag": "1",
            "extInfo": this.modalParams.extInfo,
            "frequency": {
              "continueFlag": this.formValidateAdd.continueFlag ? 1 : 0,
              "counts": this.countsadd,
              "defaultTime": util.isEmpty(this.defaultaddTime) ? '' : this.defaultaddTime,
              "freqDesc": this.formValidateAdd.freqDesc,
              "freqName": this.formValidateAdd.dataValueRemark,
              "intervals": this.intervalsadd,
              "remark": this.formValidateAdd.remark,
              "units": this.unitsadd,
              "weekFlag": this.weekFlagadd ? 1 : 0
            },
            "hospitalId": this.$store.state.userInfoObj.hospitalId,
            "parentDatavalueId": this.modalParams.parentDatavalueId,
            "pdDataValueId": this.modalParams.pdDataValueId,
            "pyCode": this.formValidateAdd.pyCode,
            "serialNumber": this.modalParams.serialNumber,
            "wbCode": this.formValidateAdd.wbCode
          }
          this.$store.dispatch("addFrequency", data).then(res => {
            if (res.data.code === 200 ) {
              this.modalFlag.frequency.addBasicData = false
              this.addBasicData = false
              this.modalFlag.frequency.addBasicData = false
              this.modalFlag.frequency.state = false
              util.showMsg(this, { succ: "扩展成功" })
              this.$emit('query', 'add')
              this.weekIsShow = false
            } else {
              util.showMsg(this, { diy: res.data.message })
            }

          })
        } else {
          util.showMsg(this, { warning: '请完善信息！' })
        }
      })
    },
    //扩展取消
    addDictModalCancel (name) {
      this.addBasicData = false
      this.modalFlag.frequency.addBasicData = false
      this.modalFlag.frequency.state = false
      this.$refs[name].resetFields();
      this.formValidateAdd.continueFlag = true
      this.weekFlagadd = false
      this.formValidateAdd.enable = true
      this.weekIsShow = false
    },
    //扩展的单位发生变化的时候触发
    utitsaddChange () {
      if (this.unitsadd == 'W') {
        this.weekFlagadd = true
      } else {
        this.weekFlagadd = false
      }
    },
    //修改的单位发生变化的时候触发
    unitsChange () {
      if (this.units == 'W') {
        this.weekFlag = true
      } else {
        this.weekFlag = false
      }
    },
  }
}
</script>
<style lang="less" scope>
.must-item {
  .ivu-form-item-label::before {
    content: "*";
    display: inline-block;
    margin-right: 4px;
    line-height: 1;
    font-family: SimSun;
    font-size: 12px;
    color: #ed3f14;
  }
}
</style>
