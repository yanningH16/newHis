<template>
  <div class="personInfo_1">
    <Row class="row">
      <i-Col span="12">
        <label style="width:70px;font-size:14px;display: inline-block">卡号</label>
        <i-Input v-model="cardNum"
                 style="width:44%"
                 placeholder="请输入卡号"
                 @keyup.native.enter="personInfoChangeCLick"></i-Input>
      </i-Col>
      <i-Col span="12">
        <label style="width:70px;font-size:14px;display: inline-block">住院号</label>
        <i-Input v-model="inpatNum"
                 style="width:44%"
                 placeholder="请输入住院号"
                 @keyup.native.enter="personInfoChangeCLick"></i-Input>
        <Button type="primary"
                style="margin-left:10px"
                @click="personInfoChangeCLick">
          <i class="iconfont iconchaxun"></i>&nbsp;查询
        </Button>
        <Button type="primary"
                style="margin-left:10px"
                :loading="loadingSave"
                @click="saveUpdata">
          <i class="iconfont iconbaocun1"></i>
          保存</Button>
      </i-Col>
    </Row>
    <Row class="row">
      <i-Col span="6">
        <label style="width:70px;font-size:14px;display: inline-block">姓名</label>
        <i-Input v-model="basicInfo.residentName"
                 disabled
                 style="width:65%"
                 placeholder=""></i-Input>
      </i-Col>
      <i-Col span="3">
        <label style="width:70px;font-size:14px;display: inline-block">性别</label>
        <Select v-model='basicInfo.sexId'
                style="width:40%"
                disabled
                clearable
                filterable>
          <Option v-for="item in sexArr"
                  :value="item.datavalueId"
                  :key="item.datavalueId">{{ item.dataValueRemark }}</Option>
        </Select>
      </i-Col>
      <i-Col span="3">
        <label style="width:56px;font-size:14px;display: inline-block">年龄</label>
        <i-Input v-model="basicInfo.age"
                 disabled
                 style="width:40%"></i-Input>
      </i-Col>
      <i-Col span="6">
        <label style="width:70px;font-size:14px;display: inline-block">出生年月</label>
        <DatePicker v-model='basicInfo.birthday'
                    format='yyyy-MM-dd'
                    disabled
                    placement='bottom-start'
                    style="width:65%"></DatePicker>
      </i-Col>
      <i-Col span="6">
        <label style="width:70px;font-size:14px;display: inline-block;">常住地户籍</label>
        <Select v-model='basicInfo.permanentFlag'
                style="width:65%"
                clearable
                filterable
                placeholder="">
          <Option v-for="item in getPermanentFlagList"
                  :value="item.flagdataValue"
                  :key="item.flagdataValue">{{ item.flagdataValueRemark }}</Option>
        </Select>
      </i-Col>
    </Row>
    <Row class="row">
      <i-Col span="6">
        <label style="width:70px;font-size:14px;display: inline-block">证件类别</label>
        <Select v-model='basicInfo.idTypeId'
                style="width:65%"
                clearable
                disabled
                filterable>
          <Option v-for="item in idTypeList"
                  :value="item.datavalueId"
                  :key="item.datavalueId">{{ item.dataValueRemark }}</Option>
        </Select>
      </i-Col>
      <i-Col span="6">
        <label style="width:70px;font-size:14px;display: inline-block">证件号</label>
        <i-Input v-model="basicInfo.recordNumber"
                 style="width:65%"
                 disabled
                 placeholder=""></i-Input>
      </i-Col>
      <i-Col span="6">
        <label style="width:70px;font-size:14px;display: inline-block">生效日期</label>
        <DatePicker v-model='basicInfo.validDate'
                    format='yyyy-MM-dd'
                    placement='bottom-start'
                    style="width:65%"></DatePicker>
      </i-Col>
      <i-Col span="6">
        <label style="width:70px;font-size:14px;display: inline-block">失效日期</label>
        <DatePicker v-model='basicInfo.unvalidDate'
                    format='yyyy-MM-dd'
                    placement='bottom-end'
                    style="width:65%"></DatePicker>
      </i-Col>
    </Row>
    <Row class="row">
      <i-Col span="6">
        <label style="width:70px;font-size:14px;display: inline-block">国籍</label>
        <Select v-model='basicInfo.countryId '
                style="width:65%"
                clearable
                filterable>
          <Option v-for="item in countryList"
                  :value="item.datavalueId"
                  :key="item.datavalueId">{{ item.dataValueRemark }}</Option>
        </Select>
      </i-Col>
      <i-Col span="6">
        <label style="width:70px;font-size:14px;display: inline-block">民族</label>
        <Select v-model='basicInfo.nationId'
                style="width:65%"
                clearable
                filterable>
          <Option v-for="item in nationList"
                  :value="item.datavalueId"
                  :key="item.datavalueId">{{ item.dataValueRemark }}</Option>
        </Select>
      </i-Col>
      <i-Col span="6">
        <label style="width:70px;font-size:14px;display: inline-block">职业</label>
        <Select v-model='basicInfo.occupationTypeId'
                style="width:65%"
                clearable
                filterable>
          <Option v-for="item in workTypeList"
                  :value="item.datavalueId"
                  :key="item.datavalueId">{{ item.dataValueRemark}}</Option>
        </Select>
      </i-Col>
      <i-Col span="6">
        <label style="width:70px;font-size:14px;display: inline-block">婚姻状况</label>
        <Select v-model='basicInfo.marriageTypeId'
                style="width:65%"
                clearable
                filterable>
          <Option v-for="item in marriageTypeList"
                  :value="item.datavalueId"
                  :key="item.datavalueId">{{ item.dataValueRemark }}</Option>
        </Select>
      </i-Col>
    </Row>
    <Row class="row">
      <i-Col span="6">
        <label style="width:70px;font-size:14px;display: inline-block">付费方式</label>
        <Select v-model='basicInfo.insuranceTypeId'
                style="width:65%"
                clearable
                disabled
                filterable>
          <Option v-for="item in insuranceTypeList"
                  :value="item.datavalueId"
                  :key="item.datavalueId">{{ item.dataValueRemark }}</Option>
        </Select>
      </i-Col>
      <!-- <i-Col span="6">
        <label style="width:70px;font-size:14px;display: inline-block">医嘱类别</label>
        <Select v-model='basicInfo.docType'
                style="width:65%"
                clearable
                filterable>
          <Option v-for="item in typeList"
                  :value="item.datavalueId"
                  :key="item.datavalueId">{{ item.dataValueRemark }}</Option>
        </Select>
      </i-Col> -->
      <i-Col span="6">
        <label style="width:70px;font-size:14px;display: inline-block">联系电话</label>
        <i-Input v-model="basicInfo.telephone"
                 style="width:65%"
                 placeholder=""></i-Input>
      </i-Col>
      <i-Col span="6">
        <label style="width:70px;font-size:14px;display: inline-block">文化程度</label>
        <Select v-model='basicInfo.degreeId'
                style="width:65%"
                clearable
                filterable>
          <Option v-for="item in degreeIdList"
                  :value="item.datavalueId"
                  :key="item.datavalueId">{{ item.dataValueRemark }}</Option>
        </Select>
      </i-Col>
    </Row>
    <Row class="row">
      <i-Col span="6">
        <label style="width:70px;font-size:14px;display: inline-block">医保卡号</label>
        <i-Input v-model="basicInfo.insuranceNum"
                 style="width:65%"
                 placeholder=""></i-Input>
      </i-Col>
      <i-Col span="6">
        <label style="width:70px;font-size:14px;display: inline-block">新农合号</label>
        <i-Input v-model="basicInfo.agriInsuranceNum"
                 style="width:65%"
                 placeholder=""></i-Input>
      </i-Col>
      <i-Col span="6">
        <label style="width:88px;font-size:14px;display: inline-block;margin-left: -16px;">预防接种卡号</label>
        <i-Input v-model="basicInfo.vaccinationNum"
                 style="width:65%"
                 placeholder=""></i-Input>
      </i-Col>
    </Row>
    <Row class="row">
      <i-Col span="12">
        <label style="width:70px;font-size:14px;display: inline-block">现住址</label>
        <Cascader id="address"
                  :data="addressData"
                  v-model="selects.addressNow"
                  trigger="hover"
                  class="one"
                  style="display:inline-block;width:82.5%"
                  placeholder="请选择地址"></Cascader>
      </i-Col>
      <i-Col span="12">
        <label style="width:70px;font-size:14px;display: inline-block">乡(镇)</label>
        <i-Input v-model="basicInfo.townshipAddr"
                 style="width:82%"
                 placeholder=""></i-Input>
      </i-Col>
    </Row>
    <Row class="row">
      <i-Col span="12">
        <label style="width:70px;font-size:14px;display: inline-block">村(街/路)</label>
        <i-Input v-model="basicInfo.villageAddr"
                 style="width:82.5%"
                 placeholder=""></i-Input>
      </i-Col>
      <i-Col span="6">
        <label style="width:70px;font-size:14px;display: inline-block">门牌号</label>
        <i-Input v-model="basicInfo.addrNumber"
                 style="width:65%"
                 placeholder=""></i-Input>
      </i-Col>
      <i-Col span="6">
        <label style="width:70px;font-size:14px;display: inline-block">邮编</label>
        <i-Input v-model="basicInfo.phoneNumber"
                 style="width:64%"
                 placeholder=""></i-Input>
      </i-Col>
    </Row>
    <Row class="row">
      <i-Col span="12">
        <label style="width:70px;font-size:14px;display: inline-block">工作单位</label>
        <Cascader :data="addressData"
                  v-model="selects.addressWork"
                  id="addressWork"
                  trigger="hover"
                  class="three"
                  style="display:inline-block;width:82.5%"></Cascader>
      </i-Col>
      <i-Col span="12">
        <label style="width:70px;font-size:14px;display: inline-block">具体地址</label>
        <i-Input v-model="basicInfo.workAddrDesc"
                 style="width:82%"
                 placeholder=""></i-Input>
      </i-Col>
    </Row>
    <Row class="row">
      <i-Col span="6">
        <label style="width:70px;font-size:14px;display: inline-block">邮编</label>
        <i-Input v-model="basicInfo.workZipCode"
                 style="width:64%"
                 placeholder=""></i-Input>
      </i-Col>
      <i-Col span="6">
        <label style="width:70px;font-size:14px;display: inline-block">单位电话</label>
        <i-Input v-model="basicInfo.workPhoneNum"
                 style="width:65%"
                 placeholder=""></i-Input>
      </i-Col>
      <i-Col span="12">
        <label style="width:70px;font-size:14px;display: inline-block">单位名称</label>
        <i-Input v-model="basicInfo.workUnit"
                 style="width:82%"
                 placeholder=""></i-Input>
      </i-Col>
    </Row>
    <Row class="row">
      <i-Col span="12">
        <label style="width:70px;font-size:14px;display: inline-block">户口地址</label>
        <Cascader id="address"
                  :data="addressData"
                  v-model="selects.addressRegist"
                  trigger="hover"
                  class="one"
                  style="display:inline-block;width:82.5%"
                  placeholder="请选择地址"></Cascader>
      </i-Col>
      <i-Col span="12">
        <label style="width:70px;font-size:14px;display: inline-block">乡(镇)</label>
        <i-Input v-model="basicInfo.registTownship"
                 style="width:82%"
                 placeholder=""></i-Input>
      </i-Col>
    </Row>
    <Row class="row">
      <i-Col span="12">
        <label style="width:70px;font-size:14px;display: inline-block">村(街/路)</label>
        <i-Input v-model="basicInfo.registVillage"
                 style="width:82.5%"
                 placeholder=""></i-Input>
      </i-Col>
      <i-Col span="6">
        <label style="width:70px;font-size:14px;display: inline-block">门牌号</label>
        <i-Input v-model="basicInfo.registHouseNum"
                 style="width:65%"
                 placeholder=""></i-Input>
      </i-Col>
      <i-Col span="6">
        <label style="width:70px;font-size:14px;display: inline-block">邮编</label>
        <i-Input v-model="basicInfo.registZipCode"
                 style="width:64%"
                 placeholder=""></i-Input>
      </i-Col>
    </Row>
    <Row class="row">
      <i-Col span="12">
        <label style="width:70px;font-size:14px;display: inline-block">籍贯</label>
        <Cascader id="address"
                  :data="addressData"
                  v-model="selects.addressOrigin"
                  trigger="hover"
                  placement='top'
                  class="one"
                  style="display:inline-block;width:82.5%"
                  placeholder="请选择地址"></Cascader>
      </i-Col>
      <i-Col span="12">
        <label style="width:70px;font-size:14px;display: inline-block">出生地</label>
        <Cascader id="address"
                  :data="addressData"
                  v-model="selects.addressBirth"
                  placement='top'
                  trigger="hover"
                  class="one"
                  style="display:inline-block;width:82%"
                  placeholder="请选择地址"></Cascader>
      </i-Col>
    </Row>
    <Row class="row">
      <i-Col span="6">
        <label style="width:70px;font-size:14px;display: inline-block">第一监护人</label>
        <i-Input v-model="basicInfo.firstContactsName"
                 style="width:65%"
                 placeholder=""></i-Input>
      </i-Col>
      <i-Col span="6">
        <label style="width:70px;font-size:14px;display: inline-block">与本人关系</label>
        <Select v-model='basicInfo.firstRelationshipId'
                style="width:65%"
                clearable
                filterable
                placement="top">
          <Option v-for="item in relationshipList"
                  :value="item.datavalueId"
                  :key="item.datavalueId">{{ item.dataValueRemark }}</Option>
        </Select>
      </i-Col>
      <i-Col span="6">
        <label style="width:70px;font-size:14px;display: inline-block">电话</label>
        <i-Input v-model="basicInfo.firstContactsTel"
                 style="width:65%"
                 placeholder=""></i-Input>
      </i-Col>
    </Row>
    <Row class="row">
      <i-Col span="6">
        <label style="width:70px;font-size:14px;display: inline-block">第二监护人</label>
        <i-Input v-model="basicInfo.secondContactsName"
                 style="width:65%"
                 placeholder=""></i-Input>
      </i-Col>
      <i-Col span="6">
        <label style="width:70px;font-size:14px;display: inline-block">与本人关系</label>
        <Select v-model='basicInfo.secondRelationshipId'
                style="width:65%"
                clearable
                filterable
                placement="top">
          <Option v-for="item in relationshipList"
                  :value="item.datavalueId"
                  :key="item.datavalueId">{{ item.dataValueRemark }}</Option>
        </Select>
      </i-Col>
      <i-Col span="6">
        <label style="width:70px;font-size:14px;display: inline-block">电话</label>
        <i-Input v-model="basicInfo.secondContactsTel"
                 style="width:65%"
                 placeholder=""></i-Input>
      </i-Col>
    </Row>
    <Spin size="large"
          fix
          v-if="spinShow"></Spin>
  </div>
</template>

<script>
import util from '../../../../libs/util.js'
export default {
  name: 'basic-info',
  inject: ['app'],
  data () {
    return {
      spinShow: false,
      loadingSave: false,
      cardNum: '',//卡号
      inpatNum: '',//住院号
      selects: {
        addressWork: [],//工作单位的
        addressRegist: [],//户口地址
        addressNow: [],//现住址的
        addressOrigin: [],//籍贯的
        addressBirth: [],//出生地
      },
      addressData: [],
      basicInfo: {
        residentName: '',//姓名
        sexId: '',
        birthday: '',
        age: '',
        idTypeId: '',//证件类别
        recordNumber: '',//证件号
        validDate: '',//生效日期
        unvalidDate: '',//失效日期
        telephone: '',//本人的联系电话
        phoneNum: '',
        countryId: '',//国籍
        nationId: '',//名族
        occupationTypeId: '',//职业
        marriageTypeId: '',//婚姻状况
        insuranceTypeId: '',//医疗付费方式
        insuranceNum: '',//医保卡号
        agriInsuranceNum: '',//新农合号
        vaccinationNum: '',//预防接种卡号
        villageAddr: '',//村 秒速
        townshipAddr: '',//乡镇
        addrNumber: '',//门牌号
        phoneNumber: '',//现住址邮编
        workUnit: '',//工作单位 具体描述
        workAddrDesc: '',//工作单位具体地址
        workZipCode: '',//单位地址邮编
        workPhoneNum: '',//工作单位电话
        docType: '',//医嘱类别
        registAddrDesc: '',//街道 户口
        registTownship: '',//乡镇
        registHouseNum: '',//门牌号
        registZipCode: '',//邮编
        contactsName: '',//联系人
        relationshipId: '',//联系人与患者关系
        contactsPhoneNum: '',//联系人电话
        contactsTownship: '',//联系人街道 暂定这个字段
        gmtCreate: '',
        gmtModify: '',
        firstContactsName: '',//第一监护人的名字
        firstContactsTel: '',//第一监护人的电话
        firstRelationshipId: '',//第一监护人与本人关系
        secondContactsName: '',//第二监护人的名字
        secondContactsTel: '',//第一监护人的电话
        secondRelationshipId: '',//第一监护人与本人关系
        permanentFlag: '',//常驻地标识
        degreeId: '',//学历代码
      },
      sexArr: [],
      countryList: [],//国籍
      nationList: [],//民族
      typeList: [],//医嘱类型
      workTypeList: [],//职业
      marriageTypeList: [],//婚姻状况
      relationshipList: [],//与患者关系
      idTypeList: [],//证件类别
      getPermanentFlagList: [],//常住地数组
      insuranceTypeList: [],//医疗付费方式
      degreeIdList: [],//学历数据
    }
  },
  watch: {
    // 如果路由有变化，会再次执行该方法
    // "$route": "getGetVal"
    // 如果路由有变化，会再次执行该方法
    $route (to, from) {
      if (to.name == 'basic-info') {
        if (!util.isEmpty(this.$route.params.getVal)) {
          this.inpatNum = ''
          this.cardNum = ''
          this.spinShow = true
          setTimeout(() => {
            this.inpatNum = this.$route.params.getVal.inpatNum
            this.initInfo()
          }, 500)
        }
      }
    }
  },
  mounted () {
    if (!util.isEmpty(this.$route.params.getVal)) {  //上面也监听了  原因是缓存导致了必须这样处理
      this.inpatNum = ''
      this.cardNum = ''
      setTimeout(() => {
        this.inpatNum = this.$route.params.getVal.inpatNum
        this.initInfo()
      }, 500)
    } else {
      this.initInfo()
    }

  },
  methods: {
    //获取入院途径
    initInfo () {
      setTimeout(() => {
        this.addressData = this.app.vShow.addressData
      }, 1000)
      this.spinShow = false
      const list = this.$store.state.attribute.nationality
      if (list.length) {
        this.countryList = this.$store.state.attribute.nationality
      } else {
        this.$store.dispatch('getPDOrHDAttrs', {
          pdCode: 'PD0000000271',
          hospitalId: this.$store.state.userInfoObj.hospitalId
        }).then(res => { //getStoragePhamDict
          if (res.data.code === 200) {
            let newDate = []
            res.data.data.list.map(item => {
              if (item.dataValueRemark != '中国') {
                newDate.push(item)
              } else {
                newDate.unshift(item)
              }
            })
            this.$store.commit('nationalityList', newDate)
            this.countryList = newDate
          } else {
            util.showMsg(this, { diy: res.data.message });
          }
        })
      }
      // 证件类别
      this.$store.dispatch('getPDOrHDAttrs', {
        pdCode: 'PD0000000260',
        hospitalId: this.$store.state.userInfoObj.hospitalId
      }).then(res => {
        if (res.data.code !== 200) {
          util.showMsg(this, { diy: res.data.message });
        } else {
          this.idTypeList = res.data.data.list;
        }
      }),
        // 民族
        this.$store.dispatch('getPDOrHDAttrs', {
          pdCode: 'PD0000000215',
          hospitalId: this.$store.state.userInfoObj.hospitalId
        }).then(res => {
          if (res.data.code !== 200) {
            util.showMsg(this, { diy: res.data.message });
          } else {
            this.nationList = res.data.data.list;
          }
        }),
        // 婚姻状况
        this.$store.dispatch('getPDOrHDAttrs', {
          pdCode: 'PD0000000137',
          hospitalId: this.$store.state.userInfoObj.hospitalId
        }).then(res => {
          if (res.data.code !== 200) {
            util.showMsg(this, { diy: res.data.message });
          } else {
            this.marriageTypeList = res.data.data.list;
          }
        }),
        //与患者关系
        this.$store.dispatch('getPDOrHDAttrs', { hospitalId: this.$store.state.userInfoObj.hospitalId, pdCode: 'PD0000000143' }).then(res => {
          if (res.data.code !== 200) {
            util.showMsg(this, { diy: res.data.message });
          } else {
            this.relationshipList = res.data.data.list;
          }
        })
      //获取职业
      this.$store.dispatch('getPDOrHDAttrs', {
        pdCode: 'PD0000000069',
        hospitalId: this.$store.state.userInfoObj.hospitalId
      }).then(res => {
        if (res.data.code !== 200) {
          util.showMsg(this, { diy: res.data.message });
        } else {
          this.workTypeList = res.data.data.list
        }
      }),
        //获取付费类型
        this.$store.dispatch("getPDOrHDAttrs", {
          hospitalId: this.$store.state.userInfoObj.hospitalId,
          pdCode: 'PD0000000371'
        }).then(res => {
          if (res.data.code != 200) {
            util.showMsg(this, { diy: res.data.message });
          } else {
            this.insuranceTypeList = res.data.data.list
          }
        })
      //获取医嘱类别
      this.$store.dispatch("getPDOrHDAttrs", {
        hospitalId: this.$store.state.userInfoObj.hospitalId,
        pdCode: 'PD0000000374'
      }).then(res => {
        if (res.data.code != 200) {
          util.showMsg(this, { diy: res.data.message });
        } else {
          res.data.data.list.forEach(element => {
            if (element.datavalueId != 32203) {
              this.typeList.push(element)
            }
          });
        }
      })
      //文化程度
      this.$store.dispatch('getPDOrHDAttrs', {
        pdCode: 'PD0000000346',
        hospitalId: this.$store.state.userInfoObj.hospitalId
      }).then(res => {
        if (res.data.code !== 200) {
          util.showMsg(this, { diy: res.data.message });
        } else {
          this.degreeIdList = res.data.data.list;
        }
      })
      //获取常驻地
      this.$store.dispatch('getFDAttr', { 'flagdataCode': 'FD000057' }).then(res => {
        if (res.data.code !== 200) {
          util.showMsg(this, { diy: res.data.message });
        } else {
          console.log(res.data)
          this.getPermanentFlagList = res.data.data
        }
      }),
        // 性别代码
        this.$store.dispatch('getPDOrHDAttrs', {
          pdCode: 'PD0000000269',
          hospitalId: this.$store.state.userInfoObj.hospitalId
        }).then(res => {
          if (res.data.code !== 200) {
            util.showMsg(this, { diy: res.data.message });
          } else {
            this.sexArr = res.data.data.list
            console.log(res, '性别')
          }
        })
      this.personInfoChange()
      setTimeout(() => {
        this.$route.params.getVal = null//做这个数据的清空 为了避免非跳转的切换处理
      }, 600)
    },
    saveUpdata () {
      if (util.isEmpty(this.basicInfo.residentName)) {
        util.showMsg(this, { warning: '请先输入卡号或者住院号查询' });
        return
      }
      let nowData = {
        dataVersion: this.basicInfo.dataVersion,//版本号
        residentId: this.basicInfo.residentId,//唯一id
        residentName: util.isEmpty(this.basicInfo.residentName) ? util.globalVariable.isNullStr : this.basicInfo.residentName,//姓名
        sexId: util.isEmpty(this.basicInfo.sexId) ? util.globalVariable.isNullNum : this.basicInfo.sexId,//性别
        age: util.isEmpty(this.basicInfo.age) ? util.globalVariable.isNullNum : this.basicInfo.age,//年龄
        birthday: util.isEmpty(this.basicInfo.birthday) ? util.globalVariable.isNullDate : this.basicInfo.birthday,//出生年月
        permanentFlag: util.isEmpty(this.basicInfo.permanentFlag) ? util.globalVariable.isNullNum : this.basicInfo.permanentFlag,//常住地户籍
        idTypeId: util.isEmpty(this.basicInfo.idTypeId) ? util.globalVariable.isNullNum : this.basicInfo.idTypeId,//证件类别
        recordNumber: util.isEmpty(this.basicInfo.recordNumber) ? util.globalVariable.isNullNum : this.basicInfo.recordNumber,//证件号
        validDate: util.isEmpty(this.basicInfo.validDate) ? util.globalVariable.isNullDate : this.basicInfo.validDate,//生效日期
        unvalidDate: util.isEmpty(this.basicInfo.unvalidDate) ? util.globalVariable.isNullDate : this.basicInfo.unvalidDate,//失效日期
        countryId: util.isEmpty(this.basicInfo.countryId) ? util.globalVariable.isNullNum : this.basicInfo.countryId,//国籍
        nationId: util.isEmpty(this.basicInfo.nationId) ? util.globalVariable.isNullNum : this.basicInfo.nationId,//名族
        occupationTypeId: util.isEmpty(this.basicInfo.occupationTypeId) ? util.globalVariable.isNullNum : this.basicInfo.occupationTypeId,//职业
        marriageTypeId: util.isEmpty(this.basicInfo.marriageTypeId) ? util.globalVariable.isNullNum : this.basicInfo.marriageTypeId,//婚姻状况
        insuranceTypeId: util.isEmpty(this.basicInfo.insuranceTypeId) ? util.globalVariable.isNullNum : this.basicInfo.insuranceTypeId,//付费方式
        docType: util.isEmpty(this.basicInfo.docType) ? util.globalVariable.isNullNum : this.basicInfo.docType,//医嘱类别
        telephone: util.isEmpty(this.basicInfo.telephone) ? util.globalVariable.isNullNum : this.basicInfo.telephone,//联系电话
        degreeId: util.isEmpty(this.basicInfo.degreeId) ? util.globalVariable.isNullNum : this.basicInfo.degreeId,//文化程度
        insuranceNum: util.isEmpty(this.basicInfo.insuranceNum) ? util.globalVariable.isNullNum : this.basicInfo.insuranceNum,//医保卡号
        agriInsuranceNum: util.isEmpty(this.basicInfo.agriInsuranceNum) ? util.globalVariable.isNullNum : this.basicInfo.agriInsuranceNum,//新农合号
        vaccinationNum: util.isEmpty(this.basicInfo.vaccinationNum) ? util.globalVariable.isNullNum : this.basicInfo.vaccinationNum,//预防接种卡号
        provinceId: util.isEmpty(this.selects.addressNow[0]) ? util.globalVariable.isNullNum : this.selects.addressNow[0],//现住址的 省
        cityId: util.isEmpty(this.selects.addressNow[1]) ? util.globalVariable.isNullNum : this.selects.addressNow[1],//现住址 市
        countyId: util.isEmpty(this.selects.addressNow[2]) ? util.globalVariable.isNullNum : this.selects.addressNow[2],//现住址的 区
        townshipAddr: util.isEmpty(this.basicInfo.townshipAddr) ? util.globalVariable.isNullStr : this.basicInfo.townshipAddr,//乡镇
        villageAddr: util.isEmpty(this.basicInfo.villageAddr) ? util.globalVariable.isNullStr : this.basicInfo.villageAddr,//村
        addrNumber: util.isEmpty(this.basicInfo.addrNumber) ? util.globalVariable.isNullStr : this.basicInfo.addrNumber,//门牌号
        phoneNumber: util.isEmpty(this.basicInfo.phoneNumber) ? util.globalVariable.isNullNum : this.basicInfo.phoneNumber,//现住址 邮编
        workProvinceId: util.isEmpty(this.selects.addressWork[0]) ? util.globalVariable.isNullNum : this.selects.addressWork[0],//工作单位的省
        workCityId: util.isEmpty(this.selects.addressWork[1]) ? util.globalVariable.isNullNum : this.selects.addressWork[1],//工作单位的市
        workCountyId: util.isEmpty(this.selects.addressWork[2]) ? util.globalVariable.isNullNum : this.selects.addressWork[2],//工作单位的区
        workAddrDesc: util.isEmpty(this.basicInfo.workAddrDesc) ? util.globalVariable.isNullStr : this.basicInfo.workAddrDesc,//工作单位的具体描述
        workZipCode: util.isEmpty(this.basicInfo.workZipCode) ? util.globalVariable.isNullStr : this.basicInfo.workZipCode,//工作单位的邮编
        workPhoneNum: util.isEmpty(this.basicInfo.workPhoneNum) ? util.globalVariable.isNullNum : this.basicInfo.workPhoneNum,//工作单位电话
        workUnit: util.isEmpty(this.basicInfo.workUnit) ? util.globalVariable.isNullStr : this.basicInfo.workUnit,//工作单位名称
        registProvinceId: util.isEmpty(this.selects.addressRegist[0]) ? util.globalVariable.isNullNum : this.selects.addressRegist[0],//户口地址的省
        registCityId: util.isEmpty(this.selects.addressRegist[1]) ? util.globalVariable.isNullNum : this.selects.addressRegist[1],//户口地址的市
        registCountyId: util.isEmpty(this.selects.addressRegist[2]) ? util.globalVariable.isNullNum : this.selects.addressRegist[2],//户口地址的区
        registTownship: util.isEmpty(this.basicInfo.registTownship) ? util.globalVariable.isNullStr : this.basicInfo.registTownship,//户口地址乡镇
        registVillage: util.isEmpty(this.basicInfo.registVillage) ? util.globalVariable.isNullStr : this.basicInfo.registVillage,//户口地址村 街道
        registHouseNum: util.isEmpty(this.basicInfo.registHouseNum) ? util.globalVariable.isNullNum : this.basicInfo.registHouseNum,//户口地址的门牌号
        registZipCode: util.isEmpty(this.basicInfo.registZipCode) ? util.globalVariable.isNullNum : this.basicInfo.registZipCode,//户口地址的邮政编码
        originProvinceId: util.isEmpty(this.selects.addressOrigin[0]) ? util.globalVariable.isNullNum : this.selects.addressOrigin[0],//籍贯的省
        originCityId: util.isEmpty(this.selects.addressOrigin[1]) ? util.globalVariable.isNullNum : this.selects.addressOrigin[1],//籍贯的市
        originCountyId: util.isEmpty(this.selects.addressOrigin[2]) ? util.globalVariable.isNullNum : this.selects.addressOrigin[2],//籍贯的区
        birthProvinceId: util.isEmpty(this.selects.addressBirth[0]) ? util.globalVariable.isNullNum : this.selects.addressBirth[0],//出生地的省
        birthCityId: util.isEmpty(this.selects.addressBirth[1]) ? util.globalVariable.isNullNum : this.selects.addressBirth[1],//出生地的市
        birthCountyId: util.isEmpty(this.selects.addressBirth[2]) ? util.globalVariable.isNullNum : this.selects.addressBirth[2],//出生地的区
        firstContactsName: util.isEmpty(this.basicInfo.firstContactsName) ? util.globalVariable.isNullStr : this.basicInfo.firstContactsName,//第一监护人
        firstRelationshipId: util.isEmpty(this.basicInfo.firstRelationshipId) ? util.globalVariable.isNullNum : this.basicInfo.firstRelationshipId,//与本人关系
        firstContactsTel: util.isEmpty(this.basicInfo.firstContactsTel) ? util.globalVariable.isNullNum : this.basicInfo.firstContactsTel,//电话
        secondContactsName: util.isEmpty(this.basicInfo.secondContactsName) ? util.globalVariable.isNullStr : this.basicInfo.secondContactsName,//第二监护人
        secondRelationshipId: util.isEmpty(this.basicInfo.secondRelationshipId) ? util.globalVariable.isNullNum : this.basicInfo.secondRelationshipId,//与本人关系
        secondContactsTel: util.isEmpty(this.basicInfo.secondContactsTel) ? util.globalVariable.isNullNum : this.basicInfo.secondContactsTel,//电话
      }
      //更改病人的基本信息
      this.loadingSave = true
      this.$store.dispatch('updatabasicData', nowData).then(res => {
        this.loadingSave = false
        if (res.data.code !== 200) {
          util.showMsg(this, { diy: res.data.message });
        } else {
          util.showMsg(this, { succ: '病人基本信息更新成功' });
          this.personInfoChange()
        }
      })
    },
    personInfoChangeCLick () {
      if (util.isEmpty(this.cardNum) && util.isEmpty(this.inpatNum)) {
        util.showMsg(this, { warning: '请先输入卡号或者住院号查询' });
        return
      }
      this.personInfoChange()
    },
    personInfoChange () {
      this.basicInfo = {}
      this.selects = {}
      if (util.isEmpty(this.cardNum) && util.isEmpty(this.inpatNum)) {
        return
      }
      var nowData = {
        cardNum: this.cardNum,
        inpatNum: this.inpatNum
      }
      this.$store.dispatch('queryPatientBasicInformation', nowData).then(res => {
        if (res.data.code !== 200) {
          util.showMsg(this, { diy: res.data.message });
        } else {
          console.log(res, '病人信息参数')
          this.basicInfo = res.data.data
          this.basicInfo.occupationTypeId = res.data.data.occupationTypeId - 0
          this.basicInfo.insuranceTypeId = res.data.data.insuranceTypeId - 0
          this.basicInfo.gmtCreate = res.data.data.gmtCreate == '' ? '' : ''
          this.basicInfo.gmtModify = res.data.data.gmtModify == '' ? '' : ''
          this.selects.addressNow = [this.basicInfo.provinceId, this.basicInfo.cityId, this.basicInfo.countyId] //现住址
          this.selects.addressWork = [this.basicInfo.workProvinceId, this.basicInfo.workCityId, this.basicInfo.workCountyId] //工作单位
          this.selects.addressRegist = [this.basicInfo.registProvinceId, this.basicInfo.registCityId, this.basicInfo.registCountyId] //户口
          this.selects.addressOrigin = [this.basicInfo.originProvinceId, this.basicInfo.originCityId, this.basicInfo.originCountyId] //籍贯
          this.selects.addressBirth = [this.basicInfo.birthProvinceId, this.basicInfo.birthCityId, this.basicInfo.birthCountyId] //出生地
        }
      })
    }
  }
}
</script>
<style lang="less" scoped>
.personInfo_1 {
  padding-left: 20px;
  width: 100%;
  height: 100%;
  padding-bottom: 100px;
  overflow-y: hidden;
  background: white;
}
.personInfo_1 .row {
  margin-top: 10px;
}
</style>
