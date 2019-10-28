<template>
  <div class="bg-whites credit-management"
       style="width:100%;height:100%">
    <div style="display:flex">
      <h3 style="margin-top:5px">信用管理维护</h3>
      <!-- <div style="position: absolute;right:17px">
                <Button type="primary" @click="addCreditManage"><i class="iconfont icon-tianjia"></i> 新增</Button>
            </div> -->
    </div>
    <div class="creditTableBox">
      <Table disabled-hover
             style="margin: 16px 0 0 0;"
             :loading="loading"
             highlight-row
             border
             :height="topTableHeight"
             :data="tableObj.data"
             :columns="tableObj.columns"
             @on-row-click="transmitData"></Table>
    </div>

    <!-- 弹窗 -->
    <Modal v-model="showModal.updCredit"
           :closable="false"
           width='520px'
           :mask-closable="false"
           class-name="vertical-center-modal">
      <div slot="footer">
        <Button type="text"
                size="large"
                @click="showModal.updCredit = false">取消</Button>
        <Button type="primary"
                size="large"
                @click="updCreditSave">保存</Button>
      </div>
      <Form ref="addOrUpdCredit"
            :model="formObj"
            :rules="rule"
            :label-width="80">
        <Row>
          <i-Col span="24">
            <FormItem label="名称"
                      prop="creditName">
              <Input v-model.trim="formObj.creditName"
                     :disabled='disableTrue'
                     style="width:390px" />
            </FormItem>
          </i-Col>
        </Row>
        <Row>
          <i-Col span="12">
            <FormItem label="周期类型"
                      prop="creditCycleType">
              <Select v-model="formObj.creditCycleType"
                      clearable
                      style="width:145px"
                      @on-change="creditCycleTypeClick"
                      placeholder="  ">
                <Option v-for="item in creditCycleTypeList"
                        :value="item.value"
                        :key="item.value">{{ item.label }}</Option>
              </Select>
            </FormItem>
          </i-Col>
          <i-Col span="12" v-show="creditCycleTypeState ==1">
            <FormItem label="周期起始"
                      prop="creditBegin">
              <InputNumber :max="12"
                           :min="0"
                           v-model="formObj.creditBegin"
                           style="width:145px;"></InputNumber>
            </FormItem>
          </i-Col>
        </Row>
        <Row>
          <i-Col span="12" v-show="creditCycleTypeState == 2">
            <FormItem label="周期"
                      prop="creditCycle">
              <InputNumber :max="12"
                           :min="0"
                           v-model="formObj.creditCycle"
                           style="width:145px;"></InputNumber>
            </FormItem>
          </i-Col>
          <i-Col span="12">
            <FormItem label="失信次数"
                      prop="limitNum">
              <InputNumber :max="10"
                           :min="0"
                           v-model="formObj.limitNum"
                           style="width:145px;"></InputNumber>
            </FormItem>
          </i-Col>
        </Row>
      </Form>
    </Modal>
    <confirmDeletion :msg="showModal.delMsg"
                     title='删除'
                     :btntext='showModal.delBtnText'
                     :show="showModal.delModal"
                     @ok='delCreditManageAjax'
                     @close="showModal.delModal=false"
                     @cancel='showModal.delModal = false'></confirmDeletion>

  </div>
</template>

<script>
import util from '../../../../libs/util';
import confirmDeletion from '../../../components/confirmDeletion.vue';

export default {
  components: {
    confirmDeletion
  },
  name: 'credit-management',
  data () {
    return {
      disableTrue: true,
      isUpd: false,
      loading: true,
      topTableHeight: '',
      showModal: {
        updCredit: false,
        delModal: false,
        delMsg: '',
        delBtnText: '删除'
      },
      tableObj: {
        data: [],
        columns: [{
          title: '代码',
          key: 'creditCode',
          width: 130,
          align: 'left'
        }, {
          title: '名称',
          key: 'creditName',
          align: 'left'
        }, {
          title: '周期类型',
          key: 'creditCycleTypeName',
          width: 150,
          align: 'left'
        }, {
          title: '周期起始',
          key: 'creditBegin',
          width: 100,
          align: 'right'
        }, {
          title: '周期(月)',
          key: 'creditCycle',
          width: 100,
          align: 'right'
        }, {
          title: '失信次数',
          key: 'limitNum',
          width: 100,
          align: 'right'
        }, {
          title: '操作',
          key: ' ',
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
                      fontSize: '20px',
                      marginRight: '10px'
                    },
                    on: {
                      click: () => {
                        console.log(params.row)
                        params.row.creditCycleType == 1 ? this.creditCycleTypeState = 1 : this.creditCycleTypeState = 2
                        this.formObj = JSON.parse(JSON.stringify(params.row))
                        this.showModal.updCredit = true
                        this.isUpd = true
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
                    class: params.row.enableFlag * 1 == 0 ? util.icon.start : util.icon.stop,
                    style: {
                      verticalAlign: 'middle',
                      fontSize: '20px'
                    },
                    on: {
                      click: () => {
                        if (params.row.enableFlag * 1 == 0) {
                          this.stopStart = '启用'
                        } else {
                          this.stopStart = '停用'
                        }
                        this.stopstart(params.row)
                      }
                    }
                  }),
                  h(
                    'div',
                    {
                      slot: 'content'
                    },
                    params.row.enableFlag * 1 == 0 ? '启用' : '停用' ,
                  )
                ]
              ),]);          }
        }],
      },
      stopStart: '',
      formObj: {
        creditName: '',
        creditCycleType: '',
        creditBegin: 1,
        creditCycle: 0,
        limitNum: 0,
        hospitalId: this.$store.state.userInfoObj.hospitalId
      },
      rule: {
        creditName: [{ required: true, message: '请输入信用管理名称', trigger: 'change' }],
        creditCycleType: [{ required: true, type: 'string', message: '请选择周期类型', trigger: 'change' }],
        // creditBegin: [{ required: true, message: '请输入周期起始', trigger: 'change' }],

      },
      creditCycleType: { '1': '按自然月计算', '2': '按首次爽约计算' },  //: 信用周期类型：FD 1-按自然月计算，2-按首次爽约计算 
      creditCycleTypeList: [{ value: '1', label: '按自然月计算' }, { value: '2', label: '按首次爽约计算' }],
      creditCycleTypeState: 0
    };
  },
  mounted () {
    this.init();
  },
  watch: {
  },
  methods: {
    init () {
      this.topTableHeight = $(".creditTableBox").height();
      console.log(this.topTableHeight)
      this.getCreditData()
    },
    creditCycleTypeClick (valid) {
      console.log(valid)
      valid == 1 ? this.creditCycleTypeState = 1 : this.creditCycleTypeState = 2
    },
    getCreditData () {
      this.loading = true
      this.$store.dispatch("getCreditRoleSet").then(res => {
        if ( res.data.code !== 200) {
          util.showMsg(this, { diy: '信用管理记录获取失败' })
        } else {
          let resList = res.data.data.list
          resList.map(item => {
            item.creditCycleTypeName = this.creditCycleType[item.creditCycleType]
          })
          this.tableObj.data = resList
        }
        this.loading = false
      })
    },
    transmitData () { },
    addCreditManage () {
      let formObj = {
        creditName: '',
        creditCycleType: '',
        creditBegin: 1,
        creditCycle: 0,
        limitNum: 0,
        hospitalId: this.$store.state.userInfoObj.hospitalId
      }
      this.formObj = formObj
      this.isUpd = false
      this.$refs['addOrUpdCredit'].resetFields();
      this.showModal.updCredit = true
    },
    stopstart (item) {
      let obj = item
      delete obj['gmtCreate']
      delete obj['gmtModify']
      if (this.stopStart === '停用') {
        // console.log(this.stopStart,item)
        obj.enableFlag = 0
      } else {
        obj.enableFlag = 1
      }
      this.$store.dispatch("updCreditRoleSet", obj).then(res => {
        if ( res.data.code !== 200) {
          util.showMsg(this, { diy: res.data.message })
        } else {
          util.showMsg(this, { succ: this.stopStart + '成功！' })
          this.getCreditData()
        }
      })
    },
    updCreditSave () {
      this.$refs['addOrUpdCredit'].validate((valid) => {
        if (valid) {
          if (this.isUpd) {
            this.updCreditManageAjax()
          } else {
            this.addCreditManageAjax()
          }
          this.showModal.updCredit = false
        } else {
          util.showMsg(this, { warning: '请完善信用管理维护信息！' })
        }
      })
    },
    addCreditManageAjax () {
      this.$store.dispatch("addCreditRoleSet", this.formObj).then(res => {
        if ( res.data.code !== 200) {
          util.showMsg(this, { diy: res.data.message })
        } else {
          util.showMsg(this, { succ: '新增成功！' })
          this.getCreditData()
        }
      })
    },
    updCreditManageAjax () {
      delete this.formObj['gmtCreate']
      delete this.formObj['gmtModify']
      console.log(this.formObj);
      this.$store.dispatch("updCreditRoleSet", this.formObj).then(res => {
        if ( res.data.code !== 200) {
          util.showMsg(this, { diy: res.data.message })
        } else {
          util.showMsg(this, { succ: '修改成功！' })
          this.getCreditData()
        }
      })
    },
    delCreditManageAjax () {
      this.$store.dispatch("delCreditRoleSet", { id: this.formObj.creditRoleId }).then(res => {
        if ( res.data.code !== 200) {
          util.showMsg(this, { diy: res.data.message })
        } else {
          this.showModal.delModal = false
          util.showMsg(this, { succ: '删除成功！' })
          this.getCreditData()
        }
      })
    },
  }
};
</script>
<style>
.ivu-form-item-error-tip {
  position: absolute;
  top: 100%;
  /* left: 80px; */
  line-height: 1;
  padding-top: 6px;
  color: #f30;
}
</style>

<style lang="less" scoped>
@import "../../../../styles/common.less";
.creditTableBox {
  height: 82%;
}
.bg-whites {
  padding: 13px 17px 0;
  background: #fff;
  height: 100%;
}
</style>