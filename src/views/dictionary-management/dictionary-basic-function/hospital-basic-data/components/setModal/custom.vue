<template>
  <Modal v-model="custom"
         width="480"
         :closable="false"
         :mask-closable="false">
    <Form ref="formValidates"
          class="customclass"
          :model="formValidate"
          :rules="ruleValidate"
          :label-width="112">
      <div>
        <FormItem v-if="singleStatus"
                  label="数据值"
                  prop="dataValueRemark">
          <Input v-model.trim="formValidate.dataValueRemark"
                 style="width: 286px;" />
        </FormItem>
        <FormItem v-if="!singleStatus"
                  label="数据值"
                  prop="dataValueRemark">
          <Input v-model.trim="formValidate.dataValueRemark"
                 style="width: 286px;" />
        </FormItem>
        <FormItem v-if="singleStatus"
                  prop="pdDataValue"
                  label="标准对照值">
          {{this.modalParams.pdDataValue}}
        </FormItem>
        <FormItem label="代码">
          <Input v-model.trim="formValidate.stantCode"
                 style="width: 286px;" />
        </FormItem>
        <FormItem label="序号"
                  prop="serialNumber">
          <Input v-model="formValidate.serialNumber"
                 :maxlength="5"
                 style="width: 286px" />
        </FormItem>

        <FormItem v-if="yiLiaoShow"
                  label="医疗付费类别">
          <Select style="width: 286px;"
                  filterable
                  v-model="formValidate.insuranceSort"
                  clearable
                  @on-change="selectStantChange">
            <Option v-for="item in selectStantOptionsList"
                    :value="String(item.dataValueRemark)"
                    :key="item.datavalueId">{{ item.dataValueRemark }}
            </Option>
          </Select>
        </FormItem>
        <FormItem v-if="yiLiaoShow"
                  :label-width="130"
                  label="医疗付费类别代码"
                  prop="insuranceSortCode">
          <Input v-model.trim="formValidate.insuranceSortCode"
                 disabled
                 style="width: 270px;" />
        </FormItem>

        <FormItem v-if="blood"
                  label="类别"
                  prop="stanparams">
          <Select v-model="formValidate.stanparams"
                  @on-change="getMedtDeptClass"
                  clearable
                  filterable
                  style="width:286px;margin-right:10px;">
            <Option v-for="item in deptList"
                    :value="item.flagdataValue"
                    :key="item.flagdataValue">{{ item.flagdataValueRemark }}</Option>
          </Select>
        </FormItem>
        <FormItem v-if="blood"
                  label="单位"
                  prop="company">
          <Select style="width: 286px;"
                  filterable
                  v-model="formValidate.company"
                  clearable
                  @on-change="selectUnitChange">
            <Option v-for="item in selectOptionsList"
                    :value="String(item.dataValueRemark)"
                    :key="item.datavalueId">{{ item.dataValueRemark }}
            </Option>
          </Select>
        </FormItem>
      </div>
    </Form>
    <div slot="footer">
      <Button type="text"
              @click="dictModalCancel('formValidates')">取消</Button>
      <Button type="primary"
              @click="dictModalOk('formValidates')">保存</Button>
    </div>
  </Modal>
</template>

<script>
import util from '../../../../../../libs/util.js'
export default {
  name: 'custom',
  props: ["modalFlag", "modalParams", "modalStatus", "text"],
  watch: {
    modalStatus () {
      util.isEmpty(this.modalStatus) ? this.singleStatus = false : this.singleStatus = true
    },
    modalFlag: {
      handler (newValue, oldValue) { //this.modalFlag.custom.updateBasicData
        this.custom = true
        this.formValidate.dataValueRemark = this.modalParams.dataValueRemark
        this.formValidate.dataValue = this.modalParams.dataValue
        this.formValidate.serialNumber = this.modalParams.serialNumber
        this.formValidate.stantCode = this.modalParams.dataValue
        this.text.code === "PD0000000286" ? this.blood = true : this.blood = false;
        this.text.code === "PD0000000368" ? this.yiLiaoShow = true : this.yiLiaoShow = false;
        this.stateFlag = true
        if (!util.isEmpty(this.modalParams.extInfo) && (this.text.code === "PD0000000368" || this.text.code === "PD0000000286")) {
          this.formValidate.stanparams = JSON.parse(this.modalParams.extInfo).stanparams  //类别
          this.formValidate.company = JSON.parse(this.modalParams.extInfo).company  //单位
          this.formValidate.insuranceSort = JSON.parse(this.modalParams.extInfo).dataValueRemark
          this.formValidate.insuranceSortCode = JSON.parse(this.modalParams.extInfo).dataValue
          this.exbasicdatavalueId = JSON.parse(this.modalParams.extInfo).basicdatavalueId
        }
      },
      deep: true
    }
  },

  data () {
    const validateAge = (rule, value, callback) => {
      if (!Number.isInteger(value * 1)) {
        callback(new Error('序号只能为整数字'));
      } else if (value * 1 <= 0 && !util.isEmpty(value)) {
        callback(new Error('序号必须大于0'));
      } else if (util.isEmpty(value)) {
        if (this.modalFlag.custom.updateBasicData) {
          callback(new Error('序号不能为空'));
        } else {
          callback();
        }
      } else {
        callback();
      }
    };
    return {
      singleStatus: false,
      yiLiaoShow: false,
      blood: false,
      custom: false,
      stateFlag: false,
      deptList: [],
      formValidate: {
        company: '',
        stanparams: '',
        dataValueRemark: '',
        serialNumber: null,
        stantCode: 0,
        insuranceSort: '',
        insuranceSortCode: '',
        pdDataValue: ''
      },
      ruleValidate: {
        dataValueRemark: [
          { required: true, message: '请填写数据值', trigger: 'blur' }
        ],
        stanparams: [
          { required: true, message: '请选择类别', trigger: 'blur' }
        ],
        serialNumber: [{ validator: validateAge, trigger: 'blur' }]
      },
      updatedFlag: {
        success: false,
        num: 0
      },
      getBloodUnit: '',
      getName: '',
      selectOptionsList: [],
      selectStantOptionsList: [],
      stantId: 0,
      exbasicdatavalueId: null,
      exdataValue: null
    }
  },
  mounted () {
    this.standParams()
    this.getSelectOptionsFun();    //获取输血中单位
    this.getStartSelectOptions();    //获取医疗收费中的保险选项
  },
  methods: {
    selectStantChange (val) {      //获取医疗收费中的保险选项关联类别代码
      if (util.isEmpty(val)) {
        this.formValidate.insuranceSortCode = ''
        return
      }
      this.selectStantOptionsList.map((item) => {
        item.dataValueRemark === val ? this.formValidate.insuranceSortCode = item.dataValue : '';
        item.dataValueRemark === val ? this.exbasicdatavalueId = item.basicdatavalueId : '';
      })
    },
    getStartSelectOptions () {     //获取医疗付费中的
      let nowData = {
        'primaryDataCode': 'PD0000000371',
        'hospitalId': this.$store.state.userInfoObj.hospitalId,
      }
      this.$store.dispatch('getValueDicLists', nowData).then(res => {
        if (res.data.code === 200) {
          this.selectStantOptionsList = res.data.data
          console.log(res.data.data, 1111)
        }
      })
    },
    getSelectOptionsFun () {                //获取输血中单位
      let nowData = {
        'pdCode': 'HD0000000004',
        'hospitalId': this.$store.state.userInfoObj.hospitalId,
        'page': 1,
        'size': 999999,
        'searchParam': this.formValidate.company,
        'outpType': 'S'
      }
      this.$store.dispatch('getPDOrHDAttrs', nowData).then(res => {
        if (res.data.code === 200) {
          this.selectOptionsList = res.data.data.list
        }
      })
    },
    selectUnitChange (val) {       //获取输血中单位代码
      this.selectOptionsList.map((item) => {
        item.dataValueRemark === val ? this.getBloodUnit = item.datavalueId : '';
      })
    },
    //修改
    updated () {
      let params = {
        company: this.formValidate.company,
        stanparams: this.formValidate.stanparams,
        unitId: this.getBloodUnit,
        stanName: this.getName
      }
      let parm = {
        dataValueRemark: this.formValidate.insuranceSort,
        dataValue: this.formValidate.insuranceSortCode
      }
      this.text.code === "PD0000000368" ? parm.dataValue = this.formValidate.insuranceSortCode : '';
      this.text.code === "PD0000000368" ? parm.basicdatavalueId = this.exbasicdatavalueId : '';
      this.text.code === "PD0000000368" ? parm.dataValueRemark = this.formValidate.insuranceSort : '';
      let data = {
        "basicdatavalueId": this.modalParams.basicdatavalueId,
        "dataValueRemark": this.formValidate.dataValueRemark,
        "dataVersion": this.modalParams.dataVersion,
        "serialNumber": this.formValidate.serialNumber,
        "dataValue": this.formValidate.stantCode,
      }
      this.text.code === "PD0000000286" ? data.extInfo = JSON.stringify(params) : '';
      this.text.code === "PD0000000368" ? data.extInfo = JSON.stringify(parm) : '';
      this.$store.dispatch("updateBasicDataValue", data).then(res => {
        if (res.data.code === 200) {
          this.updatedFlag.num++
          this.updatedFlag.success = true
          this.$emit('query', 'upd')
          util.showMsg(this, { succ: "修改成功" })
          this.custom = false
          this.modalFlag['custom'].updateBasicData = false
          this.modalFlag['custom'].state = false
        } else {
          this.updatedFlag.success = false
          util.showMsg(this, { diy: res.data.message })
        }
      })
    },
    //扩展
    added () {
      let params = {
        company: this.formValidate.company,
        stanName: this.getName,
        stanparams: this.formValidate.stanparams,
        unitId: this.getBloodUnit,
        dataValue: this.formValidate.stantCode
      }
      let parm = {
        dataValueRemark: this.formValidate.insuranceSort,
        dataValue: this.formValidate.stantCode
      }
      this.text.code === "PD0000000368" ? parm.dataValue = this.formValidate.insuranceSortCode : '';
      this.text.code === "PD0000000368" ? parm.basicdatavalueId = this.exbasicdatavalueId : '';
      this.text.code === "PD0000000368" ? parm.dataValueRemark = this.formValidate.insuranceSort : '';
      let data = {
        "dataValueRemark": this.formValidate.dataValueRemark,
        "enable": 1,
        "pdDataValueId": this.modalParams.pdDataValueId,
        "hospitalId": this.$store.state.userInfoObj.hospitalId,
        "basicdataId": this.modalParams.basicdataId,
        "dataValue": this.formValidate.stantCode,   //扩展自定义数据没有dataValue
      }
      this.text.code === "PD0000000286" ? data.extInfo = JSON.stringify(params) : '';
      this.text.code === "PD0000000368" ? data.extInfo = JSON.stringify(parm) : '';
      this.$store.dispatch("addBasicDataValue", data).then(res => {
        if (res.data.code === 200) {
          this.updatedFlag.num++
          this.updatedFlag.success = true
          this.$emit('query', 'add')
          util.showMsg(this, { succ: "扩展成功" })
          this.custom = false
          this.modalFlag['custom'].updateBasicData = false
          this.modalFlag['custom'].state = false
        } else {
          this.updatedFlag.success = false
          util.showMsg(this, { diy: res.data.message })
        }
      })
    },
    //保存按钮
    dictModalOk (name) {
      if (this.blood) {
        if (this.formValidate.stanparams == '') {
          util.showMsg(this, { warning: '请选择血型分类' });
          return
        }
      }
      if (this.stateFlag) {
        this.$refs[name].validate((valid) => {
          if (valid) {
            if (this.modalFlag.custom.updateBasicData) {
              this.updated()
            } else {
              this.added()
            }
          }
        })
      }
    },
    //修改取消
    dictModalCancel (name) {
      this.custom = false
      this.$refs["formValidates"].resetFields();
      this.modalFlag.custom.updateBasicData = false
      this.modalFlag.custom.state = false
    },
    standParams () {
      this.$store.dispatch('getFDAttr', { 'flagdataCode': 'FD000291' }).then(res => {//获取fd数据 类别数据
        if (res.data.code !== 200) {
          util.showMsg(this, { diy: res.data.message })
        } else {
          this.deptList = res.data.data;
        }
      })
    },
    //下拉联动  368  医疗付费
    getMedtDeptClass () {
      this.deptList.forEach(element => {
        if (this.formValidate.stanparams == element.flagdataValue) {
          this.getName = element.flagdataValueRemark
        }
      });
    }
  }
}
</script>
<style>
</style>

