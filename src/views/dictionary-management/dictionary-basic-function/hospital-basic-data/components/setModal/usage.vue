<template>
  <div>
    <!-- 修改 -->
    <Modal v-model="updateBasicData"
           width="420"
           class="usage"
           :closable="false"
           :mask-closable="false">
      <Form ref="formValidate"
            :model="formValidate"
            :label-width="90">
        <FormItem label="用法名称"
                  class="must-item">
          <Input v-model.trim="formValidate.adminName"
                 style="width: 286px;"
                 disabled />
          <!-- 标准对照值:{{this.modalParams.pdDataValue}} -->
        </FormItem>
        <FormItem label="标准对照值">
          {{this.modalParams.pdDataValue}}
          <span style="margin-left:30px">
            <Checkbox v-model="isCumulative">累计使用</Checkbox>
          </span>
        </FormItem>
        <FormItem label="代码"
                  class="must-item">
          <Input v-model.trim="formValidate.stantCode"
                 style="width: 286px;" />
        </FormItem>
        <FormItem label="用法描述"
                  class="must-item">
          <Input v-model.trim="formValidate.adminDesc"
                 style="width: 286px;" />
        </FormItem>
        <FormItem label="门诊使用"
                  style="display:inline-block;width:55%">
          <Checkbox v-model="formValidate.outpEnable"></Checkbox>
        </FormItem>
        <FormItem label="住院使用"
                  style="display:inline-block;width:44%">
          <Checkbox v-model="formValidate.inpEnable"></Checkbox>
        </FormItem>
        <FormItem label="门诊联动临床项目"
                  :label-width="130">
          <span style="width:242px;display:inline-block">
            <long-range-search-select :match-field="iftmFieldList"
                                      :echo.sync="outpIftmEcho"
                                      @currObject="outpGetRoleObject"></long-range-search-select>
          </span>
        </FormItem>
        <FormItem label="住院联动临床项目"
                  :label-width="130">
          <span style="width:242px;display:inline-block">
            <long-range-search-select :match-field="iftmFieldList"
                                      :echo.sync="inpIftmEcho"
                                      @currObject="inpGetRoleObject"></long-range-search-select>
          </span>
        </FormItem>
        <FormItem label="备注"
                  prop="remark">
          <Input v-model.trim="formValidate.remark"
                 style="width: 286px;" />
        </FormItem>
      </Form>
      <div slot="footer">
        <Button type="text"
                @click="dictModalCancel('formValidate')">取消</Button>
        <Button type="primary"
                @click="dictModalOk('formValidate')">保存</Button>
      </div>
    </Modal>
    <!-- 新增 -->
    <Modal v-model="addBasicData"
           width="420"
           class="usage"
           :closable="false"
           :mask-closable="false">
      <Form ref="formValidateAdd"
            :model="formValidateAdd"
            :rules="ruleValidateAdd"
            :label-width="90">
        <FormItem label="用法名称"
                  prop="adminName"
                  style="display:inline-block;width: 55%;">
          <Input v-model.trim="formValidateAdd.adminName"
                 style="width: 237px;" />
          <!-- 标准对照值:{{this.modalParams.pdDataValue}} -->
        </FormItem>
        <FormItem label="标准对照"
                  prop="basicdatavalueId"
                  style="display:inline-block;width: 40%;">
          <Input v-model.trim="formValidateAdd.basicdatavalueId"
                 style="width: 67px;"
                 disabled />
        </FormItem>
        <FormItem label="标准对照值">
          {{this.modalParams.pdDataValue}}
        </FormItem>

        <FormItem label="代码"
                  prop="stantCode">
          <Input v-model.trim="formValidateAdd.stantCode"
                 style="width: 286px;" />
        </FormItem>
        <FormItem label="用法描述"
                  prop="adminDesc">
          <Input v-model.trim="formValidateAdd.adminDesc"
                 style="width: 286px;" />
        </FormItem>
        <FormItem label="门诊使用"
                  prop="outpEnable"
                  style="display:inline-block;width:55%">
          <Checkbox v-model="formValidateAdd.outpEnable"></Checkbox>
        </FormItem>
        <FormItem label="住院使用"
                  prop="inpEnable"
                  style="display:inline-block;width:44%">
          <Checkbox v-model="formValidateAdd.inpEnable"></Checkbox>
        </FormItem>
        <FormItem label="门诊联动临床项目"
                  :label-width="130"
                  prop="outpLinkCode">
          <span style="width:242px;display:inline-block">
            <long-range-search-select :match-field="iftmFieldList"
                                      :echo.sync="outpIftmEcho"
                                      @currObject="outpGetRoleObjectadd"></long-range-search-select>
          </span>
        </FormItem>
        <FormItem label="住院联动临床项目"
                  :label-width="130"
                  prop="inpLinkCode">
          <span style="width:242px;display:inline-block">
            <long-range-search-select :match-field="iftmFieldList"
                                      :echo.sync="inpIftmEcho"
                                      @currObject="inpGetRoleObjectadd"></long-range-search-select>
          </span>
        </FormItem>
        <FormItem label="备注"
                  prop="remark">
          <Input v-model.trim="formValidateAdd.remark"
                 style="width: 286px;" />
        </FormItem>
      </Form>
      <div slot="footer">
        <Button type="text"
                @click="dictModalCancel('formValidateAdd')">取消</Button>
        <Button type="primary"
                @click="dictModalOk('formValidateAdd')">保存</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
import util from '../../../../../../libs/util.js'
import longrangesearchselect from '../../../../../components/long-range-search-select'
export default {
  components: {
    'long-range-search-select': longrangesearchselect
  },
  data () {
    const validatedataValues = (rule, value, callback) => {
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
      name: "basicdataId82",
      updateBasicData: false,  //修改弹框
      addBasicData: false,     //扩展弹框
      isCumulative: false,
      basicData: false,
      formValidate: {
        adminName: '',
        basicdatavalueId: '',
        adminDesc: '',
        dataVersion: '',
        outpEnable: false,
        inpEnable: false,
        outpLinkCode: '',
        inpLinkCode: '',
        remark: '',
        basicdataId: '',
        pyCode: '',
        wbCode: '',
        hospitalId: '',
        enable: '',
        extFlag: '',
        managerGroup: [],
        stantCode: ''
      },
      formValidateAdd: {
        adminName: '',
        basicdatavalueId: '',
        adminDesc: '',
        dataVersion: '',
        outpEnable: false,
        inpEnable: false,
        outpLinkCode: '',
        inpLinkCode: '',
        remark: '',
        basicdataId: '',
        pyCode: '',
        wbCode: '',
        hospitalId: '',
        enable: '',
        extFlag: '',
        managerGroup: [],
        stantCode: ''
      },
      ruleValidateAdd: {
        adminName: [
          { required: true, message: '请填写用法名称', trigger: 'blur' }
        ],
        adminDesc: [
          { required: true, message: '请填写用法描述', trigger: 'blur' }
        ],
        stantCode: [
          { required: true, validator: validatedataValues, trigger: 'blur' }
        ]
      },
      //懒加载下拉传值
      iftmFieldList: ['clinicItemId', 'clinicItemId', 'itemName', 'HIS_CLINIC_ITEM_DICT_TYPE', "'01','02','03','04','06','05','07','08','09'"],
      outpIftmEcho: {},
      inpIftmEcho: {}
    }

  },
  props: ["modalFlag", "modalParams"],
  watch: {
    modalFlag: {
      handler (newValue, oldValue) {
        if (newValue.usage.updateBasicData) {
          this.updateBasicData = true
          this.updateDict()
        } else if (newValue.usage.addBasicData) {
          this.addBasicData = true
          this.addDict()
        }
      },
      deep: true
    }
  },
  methods: {
    // 修改查询
    updateDict () {
      let data = {
        id: this.modalParams.basicdatavalueId
      }
      this.$store.dispatch("getAdministrationDict", data).then(res => {
        if (res.data.code != 200) {
          util.showMsg(this, { diy: res.data.message })
        } else {
          let list = res.data.data
          this.formValidate = list
          console.log(list)
          this.formValidate.adminName = list.dataValueRemark
          if (!util.isEmpty(list.administration)) {
            this.formValidate.pharmacy = util.isEmpty(list.administration.pharmacyId) ? '' : list.administration.pharmacyId
            this.formValidate.outpEnable = list.administration.outpEnable == 1 ? true : false
            this.formValidate.inpEnable = list.administration.inpEnable == 1 ? true : false
            this.formValidate.adminDesc = list.administration.adminDesc
            this.formValidate.outpLinkCode = Number(list.administration.outpLinkCode)
            this.formValidate.inpLinkCode = Number(list.administration.inpLinkCode)
            this.formValidate.remark = list.administration.remark
            this.isCumulative = list.administration.accumulateFlag == '1' ? true : false
            this.formValidate.stantCode = list.dataValue
            this.formValidate.managerGroup = util.isEmpty(list.administration.managerGroup) ? [] : JSON.parse(list.administration.managerGroup).managerGroup
            this.outpIftmEcho = {
              id: Number(list.administration.outpLinkCode),
              name: list.administration.outpItemName,
              spec: list.administration.itemSpace || '',
              PyCode: ''
            }
            this.inpIftmEcho = {
              id: Number(list.administration.inpLinkCode),
              name: list.administration.inpItemName,
              spec: list.administration.inpItemSpec || '',
              PyCode: ''
            }
          }
        }
      })
    },
    //保存按钮
    dictModalOk (name) {
      let outpEnable = 0
      let inpEnable = 0
      if (this.formValidate.outpEnable) {
        outpEnable = 1
      }
      if (this.formValidate.inpEnable) {
        inpEnable = 1
      }
      if (this.updateBasicData) {
        var reg = /^[0-9]*$/;
        if (util.isEmpty(this.formValidate.stantCode)) {
          util.showMsg(this, { warning: '请填写代码' })
          return
        } else if (!reg.test(this.formValidate.stantCode * 1)) {
          util.showMsg(this, { warning: '只能为整数字' })
          return
        }
        if (util.isEmpty(this.formValidate.adminDesc)) {
          util.showMsg(this, { warning: '请输入用法描述' })
          return
        }
        this.$refs[name].validate((valid) => {
          if (valid) {
            this.updated(name, outpEnable, inpEnable)
          }
        })
      } else {
        this.$refs[name].validate((valid) => {
          if (valid) {
            this.add(name, outpEnable, inpEnable)
          }
        })
      }
    },
    //修改保存请求
    updated (name, outpEnable, inpEnable) {
      let managerGroup = JSON.stringify({ "managerGroup": this.formValidate.managerGroup })
      let data = {
        "administration": {
          "adminDesc": this.formValidate.adminDesc,
          "adminName": this.formValidate.adminName,
          "inpEnable": inpEnable,
          "inpLinkCode": this.formValidate.inpLinkCode == 0 ? '' : this.formValidate.inpLinkCode,
          "managerGroup": managerGroup,
          "outpEnable": outpEnable,
          "outpLinkCode": this.formValidate.outpLinkCode == 0 ? '' : this.formValidate.outpLinkCode,
          "remark": this.formValidate.remark,
          "pharmacyId": this.formValidate.pharmacy,
          "accumulateFlag": this.isCumulative ? 1 : 0
        },
        "basicdataId": this.formValidate.basicdataId,
        "basicdatavalueId": this.formValidate.basicdatavalueId,
        "dataVersion": this.formValidate.dataVersion,
        "extFlag": this.formValidate.extFlag,
        "hospitalId": this.formValidate.hospitalId,
        "pyCode": this.formValidate.pyCode,
        "wbCode": this.formValidate.wbCode,
        "dataValue": this.formValidate.stantCode,

      }
      this.$store.dispatch("updateAdministrationDict", data).then(res => {
        if (res.data.code == 200) {
          util.showMsg(this, { succ: "修改成功" })
          this.$emit('query', 'upd')
          this.updateBasicData = false
          this.modalFlag.usage.addBasicData = false
          this.modalFlag.usage.updateBasicData = false
          this.modalFlag.usage.state = false
          this.outpIftmEcho = {
            id: '',
            name: '',
            spec: '',
            PyCode: ''
          }
          this.inpIftmEcho = {
            id: '',
            name: '',
            spec: '',
            PyCode: ''
          }
        } else {
          util.showMsg(this, { diy: res.data.message })
        }
      })
    },
    //扩展展示
    addDict () {
      this.formValidateAdd.managerGroup = []
      this.formValidateAdd.adminName = this.modalParams.dataValueRemark
      this.formValidateAdd.basicdatavalueId = this.modalParams.pdDataValueId
      this.formValidateAdd.stantCode = this.modalParams.dataValue
    },
    //扩展请求
    add (name, outpEnable, inpEnable) {
      let managerGroup = JSON.stringify({ "managerGroup": this.formValidate.managerGroup })
      let data = {
        "administration": {
          "adminDesc": this.formValidateAdd.adminDesc,
          "adminName": this.formValidateAdd.adminName,
          "inpEnable": inpEnable,
          "inpLinkCode": this.formValidateAdd.inpLinkCode == 0 ? '' : this.formValidateAdd.inpLinkCode,
          "managerGroup": managerGroup,
          "outpEnable": outpEnable,
          "outpLinkCode": this.formValidateAdd.outpLinkCode == 0 ? '' : this.formValidateAdd.outpLinkCode,
          "remark": this.formValidateAdd.remark,
          "pharmacyId": this.formValidateAdd.pharmacy,
          "accumulateFlag": this.isCumulative ? 1 : 0
        },
        "enable": 1,
        "pdDataValueId": this.modalParams.pdDataValueId,
        "dataValue": this.formValidateAdd.stantCode,
        "dataValueRemark": this.formValidateAdd.adminName,
        "basicdataId": this.modalParams.basicdataId,
        "extFlag": 1,
        "hospitalId": this.modalParams.hospitalId,
        "pyCode": this.modalParams.pyCode,
        "wbCode": this.modalParams.wbCode
      }
      this.$store.dispatch("addAdministrationDict", data).then(res => {
        if (res.data.code == 200) {
          this.$emit('query', 'add')
          util.showMsg(this, { succ: "扩展成功" })
          this.addBasicData = false
          this.modalFlag.usage.addBasicData = false
          this.modalFlag.usage.updateBasicData = false
          this.modalFlag.usage.state = false
        } else {
          util.showMsg(this, { diy: res.data.message })
        }
      })
    },
    //取消按钮
    dictModalCancel (name) {
      this.addBasicData = false
      this.updateBasicData = false
      this.$refs[name].resetFields();
      this.modalFlag.usage.addBasicData = false
      this.modalFlag.usage.updateBasicData = false
      this.modalFlag.usage.state = false
      this.outpIftmEcho = {
        id: '',
        name: '',
        spec: '',
        PyCode: ''
      }
      this.inpIftmEcho = {
        id: '',
        name: '',
        spec: '',
        PyCode: ''
      }
    },
    outpGetRoleObject (obj) {
      this.formValidate.outpLinkCode = obj.key || ''
      console.log(obj)
    },
    inpGetRoleObject (obj) {
      this.formValidate.inpLinkCode = obj.key || ''
      console.log(obj)
    },
    outpGetRoleObjectadd (obj) {
      this.formValidateAdd.outpLinkCode = obj.key || ''
      console.log(obj)
    },
    inpGetRoleObjectadd (obj) {
      this.formValidateAdd.inpLinkCode = obj.key || ''
      console.log(obj)
    }
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