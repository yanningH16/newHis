<template>
  <div>
    <Modal v-model="updateBasicData"
           width="420"
           :closable="false"
           :mask-closable="false">
      <Form ref="formValidate"
            :model="formValidate"
            :rules="ruleValidate"
            class="nurs"
            :label-width="80">
        <FormItem label="名称"
                  prop="title">
          <Input v-model.trim="formValidate.title"
                 style="width: 286px;"
                 :disabled='formValidate.extFlag==="0"' />
          <!-- 标准对照值:{{this.modalParams.pdDataValue}} -->
        </FormItem>
        <FormItem label="标准对照值"
                  :label-width="100">
          {{this.modalParams.pdDataValue}}
        </FormItem>
        <FormItem label="代码"
                  prop="stantCode">
          <Input v-model.trim="formValidate.stantCode"
                 style="width: 286px;" />
        </FormItem>
        <FormItem label="颜色"
                  prop="bedCardColor">
          <ColorPicker v-model="formValidate.bedCardColor"
                       size="large"
                       @on-change="pickColorFuc"
                       format="rgb"
                       style="width: 286px;"></ColorPicker>
        </FormItem>
        <FormItem label="联动项目"
                  prop="outpLinkCode"
                  class="must-item">
          <span style="width:286px;display:inline-block">
            <long-range-search-select :match-field="iftmFieldList"
                                      :echo.sync="iftmEcho"
                                      @currObject="getRoleObject"></long-range-search-select>
          </span>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button type="text"
                @click="updateDictModalCancel('formValidate')">取消</Button>
        <Button type="primary"
                @click="updateDictModalOk('formValidate')">保存</Button>
      </div>
    </Modal>

    <Modal v-model="addBasicData"
           width="420"
           :closable="false"
           :mask-closable="false">
      <Form ref="formValidateAdd"
            :model="formValidateAdd"
            :rules="ruleValidates"
            class="nurs"
            :label-width="80">
        <FormItem label="名称"
                  prop="title">
          <Input v-model.trim="formValidateAdd.title"
                 style="width: 286px;" />
          <!-- 标准对照值:{{this.modalParams.pdDataValue}} -->
        </FormItem>
        <FormItem label="标准对照值"
                  :label-width="80">
          {{this.modalParams.pdDataValue}}
        </FormItem>
        <FormItem label="代码"
                  ref="addStantCode"
                  prop="stantCode">
          <Input v-model.trim="formValidateAdd.stantCode"
                 style="width: 286px;" />
        </FormItem>
        <FormItem label="颜色"
                  prop="bedCardColor">
          <ColorPicker v-model="formValidateAdd.bedCardColor"
                       @on-change="pickColorAddFuc"
                       size="large"
                       format="rgb"
                       style="width: 286px;"
                       disabled></ColorPicker>
        </FormItem>
        <FormItem label="临床项目"
                  prop="outpLinkCode"
                  class="must-item">
          <span style="width:286px;display:inline-block">
            <long-range-search-select :match-field="iftmFieldList"
                                      :echo.sync="iftmEcho"
                                      @currObject="getRoleAddObject"></long-range-search-select>
          </span>
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
import util from '../../../../../../libs/util.js';
import longrangesearchselect from '../../../../../components/long-range-search-select'

export default {
  name: 'nursingGrade',
  components: {
    'long-range-search-select': longrangesearchselect
  },
  props: ["modalFlag", "modalParams"],
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
    const validatedataValuess = (rule, value, callback) => {
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
      updateBasicData: false,  //修改弹框
      addBasicData: false,     //扩展弹框
      //修改弹框字段
      formValidate: {
        dataValueRemark: '',
        title: '',
        bedCardColor: 'rgba(220, 85, 85, 1)',
        enable: false,
        nursing: {},
        outpLinkCode: '',
        extFlag: '',
        stantCode: ''
      },
      //修改
      ruleValidate: {
        title: [
          { required: true, message: '请填写数据值', trigger: 'blur' }
        ],
        stantCode: [
          { required: true, validator: validatedataValue, trigger: 'blur' }
        ]
      },
      ruleValidates: {
        title: [
          { required: true, message: '请填写数据值', trigger: 'blur' }
        ],
        stantCode: [
          { required: true, validator: validatedataValuess, trigger: 'blur' }
        ]
      },
      //扩展字段
      formValidateAdd: {
        dataValueRemark: '',
        title: '',
        bedCardColor: 'rgba(220, 85, 85, 1)',
        enable: false,
        nursing: {},
        outpLinkCode: '',
        stantCode: ''
      },
      //弹框下拉组件传参  iftmFieldList   iftmEcho
      iftmFieldList: ['clinicItemId', 'clinicItemId', 'itemName', 'HIS_CLINIC_ITEM_DICT'],
      iftmEcho: {}
    }
  },
  watch: {
    //监听 修改/扩展
    modalFlag: {
      handler (newValue, oldValue) {
        this.$refs['formValidateAdd'].resetFields()
        if (newValue.nursingGrade.updateBasicData) {
          this.formValidate.outpLinkCode = ''
          this.updateBasicData = true
          this.updateDict()
        } else if (newValue.nursingGrade.addBasicData) {
          this.formValidate.outpLinkCode = ''
          this.addBasicData = true
          this.addDict()
        }
      },
      deep: true
    },
    //监听树状图点击
    modalParams: {
      handler (newValue, oldValue) {
        if (newValue.extFlag == "是") {
          this.disabled = true
        } else {
          this.disabled = false
        }
      }
    }
  },
  methods: {
    // 修改查询
    updateDict () {
      let data = {
        id: this.modalParams.basicdatavalueId
      }
      this.$store.dispatch("nursingDictDetail", data).then(res => {
        if (res.data.code != 200) {
          util.showMsg(this, { diy: res.data.message })
        } else {
          let list = res.data.data
          this.formValidate.title = list.clinicItemName
          this.formValidate.stantCode = list.dataValue
          this.formValidate.enable = list.enable == '1' ? true : false
          this.formValidate.bedCardColor = !list.nursing.bedCardColor ? '#A9A9A9' : list.nursing.bedCardColor
          this.formValidate.outpLinkCode = list.nursing.clinicItemId
          this.formValidate.parentDatavalueId = list.parentDatavalueId
          this.formValidate.extFlag = list.extFlag
          this.iftmEcho = {
            id: list.nursing.clinicItemId,
            name: list.clinicItemName,
            spec: list.itemSpace || '',
            PyCode: ''
          }
        }
      })
    },
    // 修改确认
    updateDictModalOk (name) {
      if (util.isEmpty(this.formValidate.outpLinkCode)) {
        util.showMsg(this, { warning: '请输入联动项目' })
        return
      }
      this.$refs[name].validate((valid) => {
        if (valid) {
          let data = {
            "basicdataId": this.modalParams.basicdataId,
            "basicdatavalueId": this.modalParams.basicdatavalueId,
            "basicdataversionId": this.modalParams.basicdataversionId,
            "beginDate": this.modalParams.beginDate,
            "dataValue": this.formValidate.stantCode,
            "dataValueRemark": this.formValidate.title,
            "dataVersion": this.modalParams.dataVersion,
            "enable": this.formValidate.enable ? 1 : 0,
            "endDate": this.modalParams.endDate,
            "extFlag": '1',
            "extInfo": this.modalParams.extInfo,
            "nursing": {
              "bedCardColor": this.formValidate.bedCardColor,
              "clinicItemId": this.formValidate.outpLinkCode
            },
            "hospitalId": this.modalParams.hospitalId,
            "pdDataValueId": this.modalParams.pdDataValueId,
            "pyCode": this.modalParams.pyCode,
            "serialNumber": this.modalParams.serialNumber,
            "wbCode": this.modalParams.wbCode
          }
          this.$store.dispatch("nursingUpdate", data).then(res => {
            if (res.data.code === 200) {
              util.showMsg(this, { succ: "修改成功" })
              this.$emit('query', 'upd')
              this.updateBasicData = false
              this.modalFlag.nursingGrade.updateBasicData = false
              this.modalFlag.nursingGrade.state = false
            } else {
              util.showMsg(this, { diy: res.data.message })
            }
          })
        }
      })
    },
    //修改取消
    updateDictModalCancel (name) {
      this.updateBasicData = false
      this.modalFlag.nursingGrade.updateBasicData = false
      this.modalFlag.nursingGrade.state = false
      this.$refs[name].resetFields();
    },
    // 扩展
    addDict () {
      this.iftmEcho = {
        id: '',
        name: '',
        spec: '',
        PyCode: ''
      }
      this.$refs.formValidateAdd.resetFields();
      this.formValidateAdd.title = this.modalParams.dataValueRemark
      this.formValidateAdd.stantCode = this.modalParams.dataValue
      this.formValidateAdd.basicdatavalueId = this.modalParams.basicdatavalueId
      this.formValidateAdd.enable = this.modalParams.enable == "启用" ? true : false
    },
    //扩展确认
    addDictModalOk (name) {
      if (util.isEmpty(this.formValidateAdd.outpLinkCode)) {
        util.showMsg(this, { warning: '请输入临床项目' })
        return
      }
      this.$refs[name].validate((valid) => {
        if (valid) {
          let params = {
            "basicdataId": this.modalParams.basicdataId,
            "dataValue": this.formValidateAdd.stantCode,
            "pdDataValueId": this.formValidateAdd.pdDataValueId,
            "basicdataversionId": this.modalParams.basicdataversionId,
            "dataValueRemark": this.formValidateAdd.title,
            "enable": this.formValidateAdd.enable ? 1 : 0,
            "endDate": this.modalParams.endDate,
            "extFlag": "1",
            "extInfo": this.modalParams.extInfo,
            "nursing": {
              "bedCardColor": this.formValidateAdd.bedCardColor,
              "clinicItemId": this.formValidateAdd.outpLinkCode,
            },
            "hospitalId": this.$store.state.userInfoObj.hospitalId,
            "parentDatavalueId": this.modalParams.parentDatavalueId,
            "pdDataValueId": this.modalParams.pdDataValueId,
            "pyCode": this.modalParams.pyCode,
            "serialNumber": this.modalParams.serialNumber,
            "wbCode": this.modalParams.wbCode
          }
          this.$store.dispatch("nursingDictAdd", params).then(res => {
            if (res.data.code === 200) {
              util.showMsg(this, { succ: "扩展成功" })
              this.$emit('query', 'add')
              this.modalFlag.nursingGrade.addBasicData = false
              this.addBasicData = false
              this.modalFlag.nursingGrade.state = false
            } else {
              util.showMsg(this, { diy: res.data.message })
              if (res.data.message.indexOf('代码') != -1) {
                this.$refs["addStantCode"].focus();
              }
            }
          })
        }
      })
    },
    //添加取消
    addDictModalCancel (name) {
      this.addBasicData = false
      this.modalFlag.nursingGrade.addBasicData = false
      this.modalFlag.nursingGrade.state = false
      this.$refs[name].resetFields();
    },
    //修改颜色
    pickColorFuc (val) {
      this.formValidate.bedCardColor = val;
    },

    //扩展颜色
    pickColorAddFuc (val) {
      this.formValidateAdd.bedCardColor = val;
    },
    //修改项目
    getRoleObject (obj) {
      this.formValidate.outpLinkCode = obj.key || ''
    },
    //扩展项目
    getRoleAddObject (obj) {
      this.formValidateAdd.outpLinkCode = obj.key || ''
    }
  }
}
</script>
<style lang="less" scoped>
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