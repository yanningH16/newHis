<template>
  <div class="clearfix  medicalStaff"
       style="overflow: hidden;display:flex;padding: 13px 17px 0;background: #fff;height: 100%;">
    <div class="ry-left-tree"
         style="margin-left:0px;margin-right:10px">
      <div class="title">
        <Input v-model.trim="find.query"
               id="query"
               style="width: 250px;"
               placeholder="请输入姓名或拼音码"
               @on-change="queryResut"
               @keyup.enter.native="queryResut" />
        <Button type="primary"
                @click="addDetail">
          <i class="iconfont icontianjia"></i>
          新增
        </Button>
      </div>
      <div class="tab"
           ref="tab">
        <Table :loading="loading"
               disabled-hover
               stripe
               border
               highlight-row
               :height="tabHeight"
               ref="tableData"
               :columns="medicalStaffColumns"
               :data="medicalStaffData"
               @on-row-click="tableChange"></Table>
      </div>
      <div style="margin: 12px;float:right">
        <Page @Page="changPage"
              :tabpage="tabPage" />
      </div>
    </div>
    <div style="height:100%;overflow:hidden;width: 100%;">
      <div style="height:45px;padding-left: 16px;">
        <h3 class="fl">{{ title }}</h3>
        <div class="btn fr">
          <Button type="primary"
                  @click="preservation"
                  :loading="loadingSave"
                  :disabled="disabled">
            <i class="iconfont iconbaocun1"></i>
            保存
          </Button>
        </div>
      </div>
      <form class="form-horizontal">
        <Row>
          <i-Col span="8">
            <div class="form-group">
              <label for="personCode"
                     class="control-label">
                <span>*</span>人员编码</label>
              <Input v-model.trim="curTable.personCode"
                     class="tow"
                     placeholder='请输入'
                     :number=true
                     :disabled='disabled' />
            </div>
          </i-Col>
          <i-Col span="8">
            <div class="form-group">
              <label for="personName"
                     class="control-label">
                <span>*</span>姓名</label>
              <Input v-model.trim="curTable.personName"
                     class="tow"
                     placeholder='请输入'
                     :disabled='disabled' />
            </div>
          </i-Col>
          <i-Col span="8">
            <div class="form-group">
              <label for="sexId"
                     class="control-label">
                <span>*</span>性别</label>
              <Select v-model="curTable.sexId"
                      id="sexId"
                      filterable
                      class="tow"
                      :disabled='disabled'>
                <Option v-for="item in selects.sexList"
                        :value="item.datavalueId"
                        :key="item.datavalueId">{{ item.dataValueRemark }}
                </Option>
              </Select>
            </div>
          </i-Col>

          <i-Col span="8">
            <div class="form-group">
              <label for="recordNumber"
                     class="control-label">
                <span>*</span>身份证号</label>
              <Input v-model.trim="curTable.recordNumber"
                     placeholder='请输入'
                     class="tow"
                     :disabled='disabled'
                     @on-blur="propleID(curTable.recordNumber)" />
            </div>
          </i-Col>
          <i-Col span="8">
            <div class="form-group">
              <label for="contactNumber"
                     class="control-label">
                <span>*</span>联系电话</label>
              <Input v-model.trim="curTable.contactNumber"
                     class="tow"
                     placeholder='请输入'
                     :disabled='disabled' />
            </div>
          </i-Col>
          <i-Col span="8">
            <div class="form-group">
              <label for="birthdays"
                     class="control-label">
                <span>*</span>出生日期</label>
              <DatePicker v-model="curTable.birthdays"
                          placeholder='请选择'
                          type="date"
                          class="tow"
                          :disabled='disabled'
                          placement="bottom-end"></DatePicker>
            </div>
          </i-Col>
          <i-Col span="16">
            <div class="form-group specil">
              <label for="workType"
                     class="control-label">
                <span>*</span>从事工种</label>
              <Select v-model="currworkType"
                      clearable
                      multiple
                      placement="bottom"
                      @on-change="currworkTypechangPage"
                      filterable
                      class="three"
                      id="workType"
                      :disabled='disabled'
                      style="display:inline-block">
                <Option v-for="item in workTypeList"
                        :value="item.flagdataValue"
                        :key="item.flagdataValue">{{ item.flagdataValueRemark }}
                </Option>
              </Select>
            </div>
          </i-Col>
          <i-Col span="8">
            <div class="form-group">
              <label for="empNo"
                     class="control-label"
                     style="height:30px;">工作证号</label>
              <Input v-model.trim="curTable.empNo"
                     id="empNo"
                     :disabled='disabled'
                     placeholder='请输入'
                     class="tow" />
            </div>
          </i-Col>
          <i-Col span="8">
            <div class="form-group">
              <label for="chestGrade"
                     class="control-label">胸牌号</label>
              <Input v-model.trim="curTable.chestGrade"
                     id="chestGrade"
                     :disabled='disabled'
                     placeholder='请输入'
                     class="tow" />
            </div>
          </i-Col>
          <i-Col span="8">
            <div class="form-group">
              <label for="validDate"
                     class="control-label">生效日期</label>
              <DatePicker v-model="curTable.validDate"
                          type="date"
                          :disabled='disabled'
                          placeholder='请选择'
                          class="tow"></DatePicker>
            </div>
          </i-Col>
          <i-Col span="8">
            <div class="form-group">
              <label for="unvalidDate"
                     class="control-label">失效日期</label>
              <DatePicker v-model="curTable.unvalidDate"
                          type="date"
                          class="tow"
                          :disabled='disabled'
                          placeholder='请选择'
                          placement="bottom-end"></DatePicker>
            </div>
          </i-Col>
          <i-Col span="8">
            <div class="form-group">
              <label for="permanentFlag"
                     class="control-label"
                     style="width:130px">常住地址户籍标志</label>
              <Select v-model="curTable.permanentFlag"
                      filterable
                      :disabled='disabled'
                      class="one">
                <Option v-for="item in selects.permanentFlagList"
                        :value="item.flagdataValue"
                        :key="item.flagdataValue">{{ item.flagdataValueRemark }}
                </Option>
              </Select>
            </div>
          </i-Col>
          <i-Col span="8">
            <div class="form-group">
              <label for="email"
                     class="control-label">电子邮箱</label>
              <Input v-model.trim="curTable.email"
                     id="email"
                     :disabled='disabled'
                     placeholder='请输入'
                     class="tow"
                     :class="this.curTable.email != '' && !/^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/.test(this.curTable.email) ? 'redBorder' : ''" />
            </div>
          </i-Col>
          <i-Col span="8">
            <div class="form-group">
              <label for="countryId"
                     class="control-label">国籍</label>
              <longrangesearchselectElse direction='top'
                                         :vModel.sync='selectSerachParamgj'
                                         value="datavalueId"
                                         label='dataValueRemark'
                                         :spinShow='spinShowgj'
                                         :disabled='disabled'
                                         class="tow"
                                         :selectOptionsPage.sync='selectOptionsPagegj'
                                         :propOptions.sync='selectOptionsListgj'
                                         @currObject='selectObjectgj'
                                         @getSelectOptions='getSelectOptionsFungj'>
              </longrangesearchselectElse>
            </div>
          </i-Col>
          <i-Col span="8">
            <div class="form-group">
              <label for="nationId"
                     class="control-label">民族</label>
              <longrangesearchselectElse direction='top'
                                         :vModel.sync='selectSerachParammz'
                                         value="datavalueId"
                                         label='dataValueRemark'
                                         :spinShow='spinShowmz'
                                         :disabled='disabled'
                                         class="tow"
                                         :selectOptionsPage.sync='selectOptionsPagemz'
                                         :propOptions.sync='selectOptionsListmz'
                                         @currObject='selectObjectmz'
                                         @getSelectOptions='getSelectOptionsFunmz'>
              </longrangesearchselectElse>
            </div>
          </i-Col>
          <i-Col span="16">
            <div class="form-group">
              <label for="addressVal"
                     class="control-label">地址</label>
              <Cascader :data="addressData"
                        v-model="selects.addressVal"
                        :disabled='disabled'
                        trigger="hover"
                        class="three"
                        style="display:inline-block"></Cascader>
            </div>
          </i-Col>
          <i-Col span="8">
            <div class="form-group">
              <label for="townshipAddr"
                     class="control-label">乡</label>
              <Input v-model.trim="curTable.townshipAddr"
                     id="townshipAddr"
                     :disabled='disabled'
                     placeholder='请输入'
                     class="tow" />
            </div>
          </i-Col>
          <i-Col span="8">
            <div class="form-group">
              <label for="villageAddr"
                     class="control-label">村</label>
              <Input v-model.trim="curTable.villageAddr"
                     id="villageAddr"
                     placeholder='请输入'
                     :disabled='disabled'
                     class="tow" />
            </div>
          </i-Col>
          <i-Col span="8">
            <div class="form-group">
              <label for="addrNumber"
                     class="control-label">门牌号码</label>
              <Input v-model.trim="curTable.addrNumber"
                     id="addrNumber"
                     placeholder='请输入'
                     :disabled='disabled'
                     class="tow" />
            </div>
          </i-Col>
          <i-Col span="8">
            <div class="form-group">
              <label for="phoneNumber"
                     class="control-label">邮政编码</label>
              <Input v-model.trim="curTable.phoneNumber"
                     id="phoneNumber"
                     :disabled='disabled'
                     class="tow"
                     placeholder='请输入'
                     :class="this.curTable.phoneNumber != '' && !/^[1-9][0-9]{5}$/.test(this.curTable.phoneNumber) ? 'redBorder' : ''" />
            </div>
          </i-Col>
          <i-Col span="8">
            <div class="form-group">
              <label for="occupationTypeId"
                     class="control-label">职业类别</label>
              <longrangesearchselectElse direction='top'
                                         :vModel.sync='selectSerachParamlb'
                                         value="datavalueId"
                                         label='dataValueRemark'
                                         :spinShow='spinShowlb'
                                         :disabled='disabled'
                                         class="tow"
                                         :selectOptionsPage.sync='selectOptionsPagelb'
                                         :propOptions.sync='selectOptionsListlb'
                                         @currObject='selectObjectlb'
                                         @getSelectOptions='getSelectOptionsFunlb'>
              </longrangesearchselectElse>
            </div>
          </i-Col>
          <i-Col span="8">
            <div class="form-group">
              <label for="marriageTypeId"
                     class="control-label">婚姻状况</label>
              <longrangesearchselectElse direction='top'
                                         :vModel.sync='selectSerachParamhy'
                                         value="datavalueId"
                                         label='dataValueRemark'
                                         :spinShow='spinShowhy'
                                         :disabled='disabled'
                                         class="tow"
                                         :selectOptionsPage.sync='selectOptionsPagehy'
                                         :propOptions.sync='selectOptionsListhy'
                                         @currObject='selectObjecthy'
                                         @getSelectOptions='getSelectOptionsFunhy'>
              </longrangesearchselectElse>
            </div>
          </i-Col>
          <i-Col span="8">
            <div class="form-group">
              <label for="workDate"
                     class="control-label">参加工作日期</label>
              <DatePicker v-model="curTable.workDate"
                          type="date"
                          :disabled='disabled'
                          class="tow"
                          placeholder='请选择'
                          placement="top-start"></DatePicker>
            </div>
          </i-Col>
          <i-Col span="8">
            <div class="form-group">
              <label for="academicDegreeId"
                     class="control-label">最高学位</label>
              <longrangesearchselectElse direction='top'
                                         :vModel.sync='selectSerachParamxw'
                                         value="datavalueId"
                                         label='dataValueRemark'
                                         :spinShow='spinShowxw'
                                         :disabled='disabled'
                                         class="tow"
                                         :selectOptionsPage.sync='selectOptionsPagexw'
                                         :propOptions.sync='selectOptionsListxw'
                                         @currObject='selectObjectxw'
                                         @getSelectOptions='getSelectOptionsFunxw'>
              </longrangesearchselectElse>
            </div>
          </i-Col>
          <i-Col span="8">
            <div class="form-group">
              <label for="degreeId"
                     class="control-label">最高学历</label>
              <longrangesearchselectElse direction='top'
                                         :vModel.sync='selectSerachParamxl'
                                         value="datavalueId"
                                         label='dataValueRemark'
                                         :spinShow='spinShowxl'
                                         :disabled='disabled'
                                         class="tow"
                                         :selectOptionsPage.sync='selectOptionsPagexl'
                                         :propOptions.sync='selectOptionsListxl'
                                         @currObject='selectObjectxl'
                                         @getSelectOptions='getSelectOptionsFunxl'>
              </longrangesearchselectElse>
            </div>
          </i-Col>
          <i-Col span="8">
            <div class="form-group">
              <label for="mobileNumber"
                     class="control-label">职工手机</label>
              <Input v-model.trim="curTable.mobileNumber"
                     id="mobileNumber"
                     placeholder='请输入'
                     :disabled='disabled'
                     class="tow"
                     :class="this.curTable.mobileNumber != '' && !(/^1[34578]\d{9}$/.test(this.curTable.mobileNumber)) ? 'redBorder' : ''" />
            </div>
          </i-Col>
          <i-Col span="8">
            <div class="form-group">
              <label for="telephone"
                     class="control-label">办公室电话</label>
              <Input v-model.trim="curTable.telephone"
                     id="telephone"
                     placeholder='请输入'
                     :disabled='disabled'
                     class="tow"
                     :class="this.curTable.telephone != '' && !/^(\(\d{3,4}\)|\d{3,4}-|\s)?\d{7,14}$/.test(this.curTable.telephone) ? 'redBorder' : ''" />
            </div>
          </i-Col>
          <i-Col span="8">
            <div class="form-group">
              <label for="officeFax"
                     class="control-label">办公室传真</label>
              <Input v-model.trim="curTable.officeFax"
                     id="officeFax"
                     placeholder='请输入'
                     :disabled='disabled'
                     class="tow"
                     :class="this.curTable.officeFax != '' && !/^(\d{3,4}-)?\d{7,8}$/.test(this.curTable.officeFax) ? 'redBorder' : ''" />
            </div>
          </i-Col>
          <i-Col span="8">
            <div class="form-group">
              <label for="titleClassId"
                     class="control-label">职称等级</label>
              <Select v-model="curTable.titleClassId"
                      filterable
                      clearable
                      class="tow"
                      :disabled='disabled'
                      placement='top'>
                <Option v-for="item in selects.titleClassList"
                        :value="item.datavalueId"
                        :key="item.datavalueId">{{ item.dataValueRemark }}
                </Option>
              </Select>
            </div>
          </i-Col>
          <i-Col span="8">
            <div class="form-group">
              <label for="postClassId"
                     class="control-label">职务等级</label>
              <longrangesearchselectElse direction='top'
                                         :disabled='disabled'
                                         class="tow"
                                         :vModel.sync='selectSerachParamzw'
                                         value="datavalueId"
                                         label='dataValueRemark'
                                         :spinShow='spinShowzw'
                                         :selectOptionsPage.sync='selectOptionsPagezw'
                                         :propOptions.sync='selectOptionsListzw'
                                         @currObject='selectObjectzw'
                                         @getSelectOptions='getSelectOptionsFunzw'>
              </longrangesearchselectElse>
            </div>
          </i-Col>
          <i-Col span="8">
            <div class="form-group">
              <label for="entryDate"
                     class="control-label">到本单位日期</label>
              <DatePicker v-model="curTable.entryDate"
                          type="date"
                          :disabled='disabled'
                          placeholder='请选择'
                          placement="top-end"
                          class="tow"></DatePicker>
            </div>
          </i-Col>
          <i-Col span="8">
            <div class="form-group">
              <label for="personClassId"
                     class="control-label">职工分类标志</label>
              <Select v-model="curTable.personClassId"
                      filterable
                      clearable
                      :disabled='disabled'
                      class="tow"
                      placement='top'>
                <Option v-for="item in selects.personClassList"
                        :value="item.flagdataValue"
                        :key="item.flagdataValue">{{ item.flagdataValueRemark }}
                </Option>
              </Select>
            </div>
          </i-Col>
          <i-Col span="8">
            <div class="form-group">
              <label for="partyId"
                     class="control-label">党派</label>
              <longrangesearchselectElse direction='top'
                                         :vModel.sync='selectSerachParam'
                                         value="datavalueId"
                                         label='dataValueRemark'
                                         :spinShow='spinShowDP'
                                         :disabled='disabled'
                                         class="tow"
                                         :selectOptionsPage.sync='selectOptionsPage'
                                         :propOptions.sync='selectOptionsList'
                                         @currObject='selectObject'
                                         @getSelectOptions='getSelectOptionsFun'>
              </longrangesearchselectElse>
            </div>
          </i-Col>
          <i-Col span="8">
            <div class="form-group">
              <label for="graduateSchool"
                     class="control-label">毕业学校</label>
              <Input v-model.trim="curTable.graduateSchool"
                     id="graduateSchool"
                     :disabled='disabled'
                     placeholder='请输入'
                     class="tow" />
            </div>
          </i-Col>
          <i-Col span="8">
            <div class="form-group">
              <label for="professionalName"
                     class="control-label">所学专业名称</label>
              <Input v-model.trim="curTable.professionalName"
                     id="professionalName"
                     :disabled='disabled'
                     placeholder='请输入'
                     class="tow" />
            </div>
          </i-Col>
          <i-Col span="8">
            <div class="form-group">
              <label for="graduateDate"
                     class="control-label">毕业日期</label>
              <DatePicker v-model="curTable.graduateDate"
                          placement="top-start"
                          placeholder='请选择'
                          :disabled='disabled'
                          type="date"
                          class="tow"></DatePicker>
            </div>
          </i-Col>
        </Row>
      </form>
    </div>
  </div>
</template>

<script>
import Page from '../../../components/page.vue';
import util from '../../../../libs/util.js';
import longrangesearchselectElse from '../../../components/long-range-search-select-else'

export default {
  name: 'medical-staff',
  inject: ['app'],
  components: {
    Page,
    longrangesearchselectElse
  },
  watch: {
    'curTable.birthdays': function (val) {
      if (val == '') {
        this.curTable.birthdays = null
      }
    }
  },
  data () {
    return {
      loadingSave: false,
      loading: true,
      find: {
        query: '',
      },
      title: '详细信息',
      tabHeight: '',
      page: 1,
      tabPage: 1,
      disabled: true,
      medicalStaffColumns: [
        {
          title: '编码',
          width: 80,
          key: 'personCode'
        },
        {
          title: '姓名',
          width: 80,
          key: 'personName'
        },
        {
          title: '性别',
          width: 50,
          align: 'center',
          key: 'sexName'
        },
        {
          title: '出生日期',
          align: 'center',
          key: 'birthdays',
        },
        {
          title: '职务等级',
          key: 'postClassName'
        }
      ],
      medicalStaffData: [],
      selects: {
        addressVal: [],
        countryList: [],
        permanentFlagList: [],
        sexList: [],
        nationList: [],
        cityList: [],
        countyList: [],
        marriageTypeList: [],
        occupationTypeList: [],
        occupationTypeListclone: [],
        degreeList: [],
        academicDegreeList: [],
        titleClassList: [],
        personClassList: [],
        partyList: []
      },
      curTable: {
        personCode: null, //人员编码
        personName: null, //姓名
        sexId: '',        //性别
        contactNumber: null, //联系电话
        recordNumber: null,  //身份证号码
        telephone: '',
        birthdays: null,     //出生日期
        permanentFlag: '',
        email: '',
        countryId: '',
        nationId: '',
        provinceId: '',
        cityId: '',
        countyId: '',
        townshipAddr: '',
        villageAddr: '',
        addrNumber: '',
        phoneNumber: '',
        occupationTypeId: '',
        marriageTypeId: '',
        academicDegreeId: '',
        degreeId: '',
        mobileNumber: '',
        empNo: '',
        telephone: '',
        officeFax: '',
        titleClassId: '',
        postClassId: '',
        workType: '',
        chestGrade: '',
        personClassId: '',
        partyId: '',
        graduateSchool: '',
        professionalName: '',

      },
      workTypeList: [],
      currworkType: [],
      clickTable: '',   //是否点击新增
      ruleValidate: {
        personCode: [
          { required: true, message: ' ', trigger: 'blur' }
        ]
      },
      addressData: [],
      clickTableParams: '',
      pageSize: 13,
      selectOptionsPage: 1,
      selectOptionsList: [],
      selectSerachParam: '',
      spinShowDP: false,
      spinShow: false,
      selectSerachParamzw: '',
      selectOptionsPagezw: 1,
      selectOptionsListzw: [],
      spinShowzw: false,
      selectSerachParamxl: '',
      selectOptionsPagexl: 1,
      selectOptionsListxl: [],
      spinShowxl: false,
      selectOptionsPagexw: 1,
      selectOptionsListxw: [],
      selectSerachParamxw: '',
      spinShowxw: false,
      selectOptionsPagehy: 1,
      selectOptionsListhy: [],
      selectSerachParamhy: '',
      spinShowhy: false,
      selectOptionsPagemz: 1,
      selectOptionsListmz: [],
      selectSerachParammz: '',
      spinShowmz: false,
      selectOptionsPagegj: 1,
      selectOptionsListgj: [],
      selectSerachParamgj: '',
      spinShowgj: false,
      selectOptionsPagelb: 1,
      selectOptionsListlb: [],
      selectSerachParamlb: '',
      spinShowlb: false,
    };
  },
  methods: {
    //清空从事工种数组感觉没什么用
    currworkTypechangPage (val) {
      if (this.currworkType.length == 0) {
        this.currworkType = []
      }
    },
    changPage (Page) {
      this.page = Page;
      this.leftTable()
    },
    //左侧表格
    leftTable () {
      let data = {
        page: this.page,
        hospitalId: this.$store.state.userInfoObj.hospitalId,
        size: this.pageSize
      }
      if (this.find.query != '') {
        data.searchPharm = this.find.query
      }
      this.loading = true
      this.$store.dispatch('getEhrServicePersonalNew', data).then(res => {
        if (res.data.code === 200) {
          this.tabPage = res.data.data.pages;
          this.medicalStaffData = res.data.data.list;
          this.medicalStaffData.map((val, i) => {
            if (!util.isEmpty(val.birthday)) {
              val.birthdays = val.birthday.substr(0, 10);
            }
          });
          this.loading = false
        } else {
          util.showMsg(this, { diy: res.data.message })
        }
      })
    },
    init () {
      this.empty()
      this.leftTable()
      // 性别代码
      this.$store.dispatch('getPDOrHDAttrs', {
        pdCode: 'PD0000000269',
        hospitalId: this.$store.state.userInfoObj.hospitalId
      }).then(res => {
        if (res.data.code !== 200) {
          util.showMsg(this, { diy: res.data.message })
        } else {
          this.selects.sexList = res.data.data.list;
        }
      })

      // 地址 省
      setTimeout(() => {
        this.addressData = this.app.vShow.addressData
      }, 1000)
      //工种
      this.$store.dispatch('getFDAttr', { 'flagdataCode': 'FD000192' }).then(res => {//获取fd数据
        if (res.data.code !== 200) {
          util.showMsg(this, { diy: res.data.message })
        } else {
          this.workTypeList = res.data.data
        }
      })
      // 常住地址户籍标志
      this.$store.dispatch('getFDAttr', {
        'flagdataCode': 'FD000057',
        'hospitalId': this.$store.state.userInfoObj.hospitalId
      }).then(res => {
        if (res.data.code !== 200) {
          util.showMsg(this, { diy: res.data.message })
        } else {
          this.selects.permanentFlagList = res.data.data;
        }
      })
      // 职称等级
      this.$store.dispatch('getPDOrHDAttrs', {
        pdCode: 'PD0000000427',
        hospitalId: this.$store.state.userInfoObj.hospitalId
      }).then(res => {
        if (res.data.code !== 200) {
          util.showMsg(this, { diy: res.data.message })
        } else {
          this.selects.titleClassList = res.data.data.list;
        }
      })
      // 职工分类标志
      this.$store.dispatch('getFDAttr', {
        'flagdataCode': 'FD000056',
        'hospitalId': 2
      }).then(res => {
        if (res.data.code !== 200) {
          util.showMsg(this, { diy: res.data.message })
        } else {
          this.selects.personClassList = res.data.data;
        }
      })
    },
    //职业类别
    getSelectOptionsFunlb () {
      let nowData = {
        'pdCode': 'PD0000000432',
        'page': this.selectOptionsPagelb,
        'size': 6,
        'hospitalId': this.$store.state.userInfoObj.hospitalIdlb,
        "searchParam": this.selectSerachParamlb,
      }
      this.spinShowlb = true;
      this.$store.dispatch('getPDOrHDAttrs', nowData).then(res => {
        if (res.data.code === 200) {
          this.selectOptionsListlb = this.selectOptionsListlb.concat(res.data.data.list)
          this.spinShowlb = false
        } else {
          util.showMsg(this, { diy: res.data.message })
        }
      })
    },
    selectObjectlb (val) {
      this.selectSerachParamlb = val.label
      this.curTable.occupationTypeId = val.datavalueId
    },
    //国籍
    getSelectOptionsFungj () {
      this.spinShowgj = true;
      let nowData = {
        'pdCode': 'PD0000000271',
        'page': this.selectOptionsPagegj,
        'size': 6,
        'hospitalId': this.$store.state.userInfoObj.hospitalId,
        "searchParam": this.selectSerachParamgj,
      }
      this.$store.dispatch('getPDOrHDAttrs', nowData).then(res => {
        if (res.data.code === 200) {
          let newDate = []
          res.data.data.list.map(item => {
            if (item.dataValueRemark != '中国') {
              newDate.push(item)
            } else {
              newDate.unshift(item)
            }
          })
          this.selectOptionsListgj = this.selectOptionsListgj.concat(newDate)
          this.spinShowgj = false
        } else {
          util.showMsg(this, { diy: res.data.message })
        }
      })
    },
    selectObjectgj (val) {
      this.selectSerachParamgj = val.label
      this.curTable.countryId = val.datavalueId
    },
    // 民族
    getSelectOptionsFunmz () {
      this.spinShowmz = true;
      let nowData = {
        'pdCode': 'PD0000000215',
        'page': this.selectOptionsPagemz,
        'size': 6,
        'hospitalId': this.$store.state.userInfoObj.hospitalId,
        "searchParam": this.selectSerachParammz,
      }
      this.$store.dispatch('getPDOrHDAttrs', nowData).then(res => {
        if (res.data.code === 200) {
          this.selectOptionsListmz = this.selectOptionsListmz.concat(res.data.data.list)
          this.spinShowmz = false
        } else {
          util.showMsg(this, { diy: res.data.message })
        }
      })
    },
    selectObjectmz (val) {
      this.selectSerachParammz = val.label
      this.curTable.nationId = val.datavalueId
    },
    // 婚姻状况
    getSelectOptionsFunhy () {
      this.spinShowhy = true;
      let nowData = {
        'pdCode': 'PD0000000137',
        'page': this.selectOptionsPagehy,
        'size': 6,
        'hospitalId': this.$store.state.userInfoObj.hospitalId,
        "searchParam": this.selectSerachParamhy,
      }
      this.$store.dispatch('getPDOrHDAttrs', nowData).then(res => {
        if (res.data.code === 200) {
          this.selectOptionsListhy = this.selectOptionsListhy.concat(res.data.data.list)
          this.spinShowhy = false
        } else {
          util.showMsg(this, { diy: res.data.message })
        }
      })
    },
    //婚姻状况
    selectObjecthy (val) {
      this.selectSerachParamhy = val.label
      this.curTable.marriageTypeId = val.datavalueId
    },
    // 党派
    getSelectOptionsFun () {
      this.spinShowDP = true;
      let nowData = {
        'pdCode': 'PD0000000725',
        'page': this.selectOptionsPage,
        'size': 6,
        'hospitalId': this.$store.state.userInfoObj.hospitalId,
        "searchParam": this.selectSerachParam,
      }
      this.$store.dispatch('getPDOrHDAttrs', nowData).then(res => {
        if (res.data.code === 200) {
          this.selectOptionsList = this.selectOptionsList.concat(res.data.data.list)
          this.spinShowDP = false
        } else {
          util.showMsg(this, { diy: res.data.message })
        }
      })
    },
    //党派
    selectObject (val) {
      this.selectSerachParam = val.label
      this.curTable.partyId = val.datavalueId
    },
    //职务等级
    getSelectOptionsFunzw () {
      this.spinShowzw = true;
      let nowData = {
        'pdCode': 'PD0000000471',
        'page': this.selectOptionsPagezw,
        'size': 6,
        'hospitalId': this.$store.state.userInfoObj.hospitalId,
        "searchParam": this.selectSerachParamzw,
      }
      this.$store.dispatch('getPDOrHDAttrs', nowData).then(res => {
        if (res.data.code === 200) {
          this.selectOptionsListzw = this.selectOptionsListzw.concat(res.data.data.list)
          this.spinShowzw = false
        } else {
          util.showMsg(this, { diy: res.data.message })
        }
      })
    },
    //职务等级
    selectObjectzw (val) {
      this.selectSerachParamzw = val.label
      this.curTable.postClassId = val.datavalueId
    },

    //最高学历
    getSelectOptionsFunxl () {
      this.spinShowxl = true;
      let nowData = {
        'pdCode': 'PD0000000346',
        'page': this.selectOptionsPagexl,
        'size': 6,
        'hospitalId': this.$store.state.userInfoObj.hospitalId,
        "searchParam": this.selectSerachParamxl,
      }
      this.$store.dispatch('getPDOrHDAttrs', nowData).then(res => {
        if (res.data.code === 200) {
          this.selectOptionsListxl = this.selectOptionsListxl.concat(res.data.data.list)
          this.spinShowxl = false
        } else {
          util.showMsg(this, { diy: res.data.message })
        }
      })
    },
    //最高学历
    selectObjectxl (val) {
      this.selectSerachParamxl = val.label
      this.curTable.degreeId = val.datavalueId
    },
    //最高学位
    getSelectOptionsFunxw () {
      this.spinShowxw = true;
      let nowData = {
        'pdCode': 'PD0000000447',
        'page': this.selectOptionsPagexw,
        'size': 6,
        'hospitalId': this.$store.state.userInfoObj.hospitalId,
        "searchParam": this.selectSerachParamxw,
      }
      this.$store.dispatch('getPDOrHDAttrs', nowData).then(res => {
        if (res.data.code === 200) {
          this.selectOptionsListxw = this.selectOptionsListxw.concat(res.data.data.list)
          this.spinShowxw = false
        } else {
          util.showMsg(this, { diy: res.data.message })
        }
      })
    },
    //最高学位传参
    selectObjectxw (val) {
      this.selectSerachParamxw = val.label
      this.curTable.academicDegreeId = val.datavalueId
    },
    occupationChange (val) {
      this.selects.occupationTypeList = util.findKeys(val + '', this.selects.occupationTypeListclone, ['dataValueRemark', 'datavalueId', 'pyCode', 'wbCode']);
    },
    //获得选中行数据
    tableChange (val) {
      console.log(val)
      this.empty();
      this.clickTableParams = val
      this.disabled = false
      this.title = val.personName + '信息修改'
      this.clickTable = val;
      let sexId = ''
      let permanentFlag, nationId, countryId, cityId, countyId, provinceId, occupationTypeId, marriageTypeId,
        academicDegreeId, degreeId, titleClassId, postClassId, personClassId, partyId;
      partyId = util.isEmpty(val.partyId) ? '' : val.partyId
      this.selects.sexList.map((value, i) => {
        if (val.sexId == value.datavalueId) {
          sexId = val.sexId
        }
      })
      permanentFlag = util.isEmpty(val.permanentFlag) ? '' : val.permanentFlag
      nationId = util.isEmpty(val.nationId) ? '' : val.nationId
      countryId = util.isEmpty(val.countryId) ? '' : val.countryId
      occupationTypeId = util.isEmpty(val.occupationTypeId) ? '' : val.occupationTypeId
      marriageTypeId = util.isEmpty(val.marriageTypeId) ? '' : val.marriageTypeId
      academicDegreeId = util.isEmpty(val.academicDegreeId) ? '' : val.academicDegreeId
      degreeId = util.isEmpty(val.degreeId) ? '' : val.degreeId
      titleClassId = util.isEmpty(val.titleClassId) ? '' : val.titleClassId
      postClassId = util.isEmpty(val.postClassId) ? '' : val.postClassId
      personClassId = util.isEmpty(val.personClassId) ? '' : val.personClassId
      provinceId = util.isEmpty(val.provinceId) ? 0 : val.provinceId
      cityId = util.isEmpty(val.cityId) ? 0 : val.cityId
      countyId = util.isEmpty(val.countyId) ? 0 : val.countyId
      this.selects.addressVal = util.isEmpty(val.provinceId) ? [] : [provinceId, cityId, countyId]
      this.clickTableParams = ''
      this.curTable.contactNumber = util.isEmpty(val.telephone) ? null : val.telephone;
      this.curTable.personCode = util.isEmpty(val.personCode) ? null : val.personCode;
      this.curTable.personName = util.isEmpty(val.personName) ? null : val.personName;
      this.curTable.sexId = val.sexId
      this.curTable.recordNumber = util.isEmpty(val.recordNumber) ? null : val.recordNumber;
      this.curTable.telephone = val.officeTelephone;
      this.curTable.birthdays = val.birthdays;
      this.curTable.permanentFlag = val.permanentFlag;
      this.curTable.email = val.email;
      this.curTable.countryId = val.countryId;
      this.selectSerachParamgj = val.countryName
      this.curTable.nationId = val.nationId;
      this.selectSerachParammz = val.nationName;
      this.curTable.provinceId = val.provinceId;
      this.curTable.cityId = val.cityId;
      this.curTable.countyId = val.countyId;
      this.curTable.townshipAddr = val.townshipAddr;
      this.curTable.villageAddr = val.villageAddr;
      this.curTable.addrNumber = val.addrNumber;
      this.curTable.phoneNumber = val.phoneNumber;
      this.curTable.occupationTypeId = val.occupationTypeId;
      this.selectSerachParamlb = val.occupationTypeName;
      this.curTable.marriageTypeId = val.marriageTypeId;
      this.selectSerachParamhy = val.marriageTypeName
      this.curTable.academicDegreeId = val.academicDegreeId;
      this.selectSerachParamxw = val.academicDegreeName;
      this.curTable.degreeId = val.degreeId;
      this.selectSerachParamxl = val.degreeName;
      this.curTable.mobileNumber = val.mobileNumber;
      this.curTable.empNo = val.empNo;
      this.curTable.mobileNumber = val.mobileNumber;
      this.curTable.officeFax = val.officeFax;
      this.curTable.titleClassId = val.titleClassId;
      this.curTable.postClassId = val.postClassId;
      this.selectSerachParamzw = val.postClassName;
      this.currworkType = val.workTypeList == null ? [''] : val.workTypeList.map(String);  //将数字id转为字符串
      this.curTable.chestGrade = val.chestGrade;
      this.curTable.personClassId = val.personClassId;
      this.curTable.partyId = val.partyId;
      this.selectSerachParam = val.partyName
      this.curTable.graduateSchool = val.graduateSchool;
      this.curTable.professionalName = val.professionalName;
      if (!util.isEmpty(val.workDate)) {
        this.curTable.workDate = val.workDate.substr(0, 10);
      }
      if (!util.isEmpty(val.entryDate)) {
        this.curTable.entryDate = val.entryDate.substr(0, 10);
      }
      if (!util.isEmpty(val.graduateDate)) {
        this.curTable.graduateDate = val.graduateDate.substr(0, 10);
      }
      if (!util.isEmpty(val.validDate)) {
        this.curTable.validDate = val.validDate.substr(0, 10);
      }
      if (!util.isEmpty(val.unvalidDate)) {
        this.curTable.unvalidDate = val.unvalidDate.substr(0, 10);
      }
    },
    //取消暂未使用
    // cancelDetail () {
    //   this.empty()
    //   this.clickTableParams = ''
    //   this.disabled = true
    //   this.title = '详细信息'
    //   this.curTable.birthdays = null;
    // },
    // 查询
    queryResut () {
      this.medicalStaffData = [];  //列表数据集合
      this.tabPage = 1;
      this.page = 1
      this.leftTable();
    },
    // 新增
    addDetail () {
      this.empty();                             //清楚表单数据
      this.$refs.tableData.clearCurrentRow();  //清除表格选中项
      this.clickTableParams = ''               //清除选中行数据
      this.clickTable = null;                 //判断修改与新增
      this.disabled = false                   //取消不可操作
      this.title = '新增卫生人员';
    },
    //清楚表单数据
    empty () {
      this.selects.addressVal = []
      this.curTable.personCode = null;
      this.curTable.personName = null;
      this.curTable.sexId = '';
      this.curTable.recordNumber = null;
      this.curTable.telephone = '';
      this.curTable.birthdays = null;
      this.curTable.permanentFlag = '1';
      this.curTable.email = '';
      this.curTable.countryId = 14485;
      this.selectSerachParamgj = '中国';
      this.curTable.nationId = 14670;
      this.selectSerachParammz = '汉族'
      this.curTable.provinceId = '';
      this.curTable.cityId = '';
      this.curTable.countyId = '';
      this.curTable.townshipAddr = '';
      this.curTable.villageAddr = '';
      this.curTable.addrNumber = '';
      this.curTable.phoneNumber = '';
      this.curTable.occupationTypeId = '';
      this.selectSerachParamlb = '';
      this.curTable.marriageTypeId = '';
      this.selectSerachParamhy = '';
      this.curTable.academicDegreeId = '';
      this.selectSerachParamxw = '';
      this.curTable.degreeId = '';
      this.selectSerachParamxl = '';
      this.curTable.mobileNumber = '';
      this.curTable.empNo = '';
      this.curTable.mobileNumber = '';
      this.curTable.officeFax = '';
      this.curTable.titleClassId = '';
      this.curTable.postClassId = '';
      this.selectSerachParamzw = '';
      this.currworkType = [];
      this.curTable.chestGrade = '';
      this.curTable.personClassId = '';
      this.curTable.partyId = '';
      this.selectSerachParam = '';
      this.curTable.graduateSchool = '';
      this.curTable.professionalName = '';
      this.curTable.workDate = '';
      this.curTable.entryDate = '';
      this.curTable.graduateDate = '';
      this.curTable.validDate = '';
      this.curTable.unvalidDate = '';
      this.curTable.contactNumber = null
    },
    //输入身份证号获的出生年月日
    propleID (val) {
      if (val.substring(12, 14) != '') {
        util.isEmpty(this.curTable.birthdays) ? this.curTable.birthdays = val.substring(6, 10) + "-" + val.substring(10, 12) + "-" + val.substring(12, 14) : '';
      }

    },
    //新增/修改  保存
    preservation () {
      if (util.isEmpty(this.curTable.personCode)) {
        util.showMsg(this, { warning: '人员编码不能为空' })
        return
      }
      if (!util.isPositiveInteger(this.curTable.personCode)) {
        util.showMsg(this, { warning: '人员编码只能为正整数' })
        return
      }
      if (util.isEmpty(this.curTable.personName)) {
        util.showMsg(this, { warning: '姓名不能为空' })
        return
      }
      if (util.isEmpty(this.curTable.sexId)) {
        util.showMsg(this, { warning: '性别不能为空' })
        return
      }
      if (util.isIdCarBasic(this.curTable.recordNumber)) {
        util.showMsg(this, { warning: '请输入正确的的身份证号' })
        return
      }
      if (util.isPhone(this.curTable.contactNumber)) {
        util.showMsg(this, { warning: '请输入正确的联系电话' })
        return
      }
      if (util.isEmpty(this.curTable.birthdays)) {
        util.showMsg(this, { warning: '出生日期不能为空' })
        return
      }
      if (util.isEmpty(this.currworkType)) {
        util.showMsg(this, { warning: '从事工种不能为空' })
        return
      }
      if (!util.isEmpty(this.clickTable)) {
        let data = {
          'telephone': this.curTable.contactNumber,
          'academicDegreeId': util.isEmpty(this.curTable.academicDegreeId) ? util.globalVariable.isNullStr : this.curTable.academicDegreeId,
          'addrNumber': util.isEmpty(this.curTable.addrNumber) ? util.globalVariable.isNullStr : this.curTable.addrNumber,
          'birthday': util.isEmpty(this.curTable.birthdays) ? '1900-01-01 00:00:59' : this.curTable.birthdays.format('yyyy-MM-dd'),
          'chestGrade': util.isEmpty(this.curTable.chestGrade) ? util.globalVariable.isNullStr : this.curTable.chestGrade,
          'cityId': util.isEmpty(this.selects.addressVal[1]) ? util.globalVariable.isNullStr : this.selects.addressVal[1],
          'countryId': this.curTable.countryId,
          'countyId': util.isEmpty(this.selects.addressVal[2]) ? util.globalVariable.isNullStr : this.selects.addressVal[2],
          'degreeId': util.isEmpty(this.curTable.degreeId) ? util.globalVariable.isNullStr : this.curTable.degreeId,
          'email': util.isEmpty(this.curTable.email) ? util.globalVariable.isNullStr : this.curTable.email,
          'empNo': util.isEmpty(this.curTable.empNo) ? util.globalVariable.isNullStr : this.curTable.empNo,
          'graduateSchool': util.isEmpty(this.curTable.graduateSchool) ? util.globalVariable.isNullStr : this.curTable.graduateSchool,
          'hospitalId': this.$store.state.userInfoObj.hospitalId,
          'marriageTypeId': util.isEmpty(this.curTable.marriageTypeId) ? util.globalVariable.isNullStr : this.curTable.marriageTypeId,
          'nationId': this.curTable.nationId,
          'occupationTypeId': util.isEmpty(this.curTable.occupationTypeId) ? util.globalVariable.isNullStr : this.curTable.occupationTypeId,
          'officeFax': util.isEmpty(this.curTable.officeFax) ? util.globalVariable.isNullStr : this.curTable.officeFax,
          'partyId': util.isEmpty(this.curTable.partyId) ? util.globalVariable.isNullStr : this.curTable.partyId,
          'permanentFlag': this.curTable.permanentFlag,
          'personClassId': util.isEmpty(this.curTable.personClassId) ? util.globalVariable.isNullStr : this.curTable.personClassId,
          'personCode': this.curTable.personCode,
          'personName': this.curTable.personName,
          'phoneNumber': util.isEmpty(this.curTable.phoneNumber) ? util.globalVariable.isNullStr : this.curTable.phoneNumber,
          'postClassId': util.isEmpty(this.curTable.postClassId) ? util.globalVariable.isNullStr : this.curTable.postClassId,
          'professionalName': util.isEmpty(this.curTable.professionalName) ? util.globalVariable.isNullStr : this.curTable.professionalName,
          'provinceId': util.isEmpty(this.selects.addressVal[0]) ? util.globalVariable.isNullStr : this.selects.addressVal[0],
          'recordNumber': this.curTable.recordNumber,
          'sexId': this.curTable.sexId,
          'officeTelephone': util.isEmpty(this.curTable.telephone) ? util.globalVariable.isNullStr : this.curTable.telephone,
          'titleClassId': util.isEmpty(this.curTable.titleClassId) ? util.globalVariable.isNullStr : this.curTable.titleClassId,
          'townshipAddr': util.isEmpty(this.curTable.townshipAddr) ? util.globalVariable.isNullStr : this.curTable.townshipAddr,
          'validDate': util.isEmpty(this.curTable.validDate) ? '1900-01-01 00:00:59' : this.curTable.validDate.format('yyyy-MM-dd'),
          'unvalidDate': util.isEmpty(this.curTable.unvalidDate) ? '1900-01-01 00:00:59' : this.curTable.unvalidDate.format('yyyy-MM-dd'),
          'villageAddr': util.isEmpty(this.curTable.villageAddr) ? util.globalVariable.isNullStr : this.curTable.villageAddr,
          'workDate': util.isEmpty(this.curTable.workDate) ? '1900-01-01 00:00:59' : this.curTable.workDate.format('yyyy-MM-dd'),
          'entryDate': util.isEmpty(this.curTable.entryDate) ? '1900-01-01 00:00:59' : this.curTable.entryDate.format('yyyy-MM-dd'),
          'graduateDate': util.isEmpty(this.curTable.graduateDate) ? '1900-01-01 00:00:59' : this.curTable.graduateDate.format('yyyy-MM-dd'),
          'mobileNumber': util.isEmpty(this.curTable.mobileNumber) ? util.globalVariable.isNullStr : this.curTable.mobileNumber,
          'workTypeList': this.currworkType,
          'dataVersion': this.clickTable.dataVersion,
          'personId': this.clickTable.personId
        };
        this.loadingSave = true
        this.$store.dispatch('updateEhrServicePersonal', data).then(res => {
          this.loadingSave = false
          if (res.data.code === 200) {
            util.showMsg(this, { succ: '修改成功' })
            this.empty();
            this.disabled = true;
            this.title = '详细信息'
            this.clickTable = res.data.data
            this.leftTable();
          } else {
            util.showMsg(this, { diy: res.data.message })
          }
        })
      } else {
        let data = {
          'telephone': this.curTable.contactNumber,
          'academicDegreeId': this.curTable.academicDegreeId,
          'addrNumber': this.curTable.addrNumber,
          'birthday': this.curTable.birthdays.format('yyyy-MM-dd'),
          'chestGrade': this.curTable.chestGrade,
          'cityId': this.curTable.cityId,
          'countryId': this.curTable.countryId,
          'countyId': this.curTable.countyId,
          'degreeId': this.curTable.degreeId,
          'email': this.curTable.email,
          'empNo': this.curTable.empNo,
          'graduateSchool': this.curTable.graduateSchool,
          'hospitalId': this.$store.state.userInfoObj.hospitalId,
          'marriageTypeId': this.curTable.marriageTypeId,
          'nationId': this.curTable.nationId,
          'occupationTypeId': this.curTable.occupationTypeId,
          'officeFax': this.curTable.officeFax,
          'partyId': this.curTable.partyId,
          'permanentFlag': this.curTable.permanentFlag,
          'personClassId': this.curTable.personClassId,
          'personCode': this.curTable.personCode,
          'personName': this.curTable.personName,
          'phoneNumber': this.curTable.phoneNumber,
          'postClassId': this.curTable.postClassId,
          'professionalName': this.curTable.professionalName,
          'provinceId': this.curTable.provinceId,
          'recordNumber': this.curTable.recordNumber,
          'sexId': this.curTable.sexId,
          'officeTelephone': this.curTable.telephone,
          'titleClassId': this.curTable.titleClassId,
          'townshipAddr': this.curTable.townshipAddr,
          'validDate': util.isEmpty(this.curTable.validDate) ? '1900-01-01 00:00:59' : this.curTable.validDate.format('yyyy-MM-dd'),
          'unvalidDate': util.isEmpty(this.curTable.unvalidDate) ? '1900-01-01 00:00:59' : this.curTable.unvalidDate.format('yyyy-MM-dd'),
          'villageAddr': this.curTable.villageAddr,
          'workDate': util.isEmpty(this.curTable.workDate) ? '1900-01-01 00:00:59' : this.curTable.workDate.format('yyyy-MM-dd'),
          'entryDate': util.isEmpty(this.curTable.entryDate) ? '1900-01-01 00:00:59' : this.curTable.entryDate.format('yyyy-MM-dd'),
          'graduateDate': util.isEmpty(this.curTable.graduateDate) ? '1900-01-01 00:00:59' : this.curTable.graduateDat.format('yyyy-MM-dd'),
          'mobileNumber': this.curTable.mobileNumber,
          'workTypeList': this.currworkType
        };
        this.loadingSave = true
        this.$store.dispatch('addEhrServicePersonal', data).then(res => {
          this.loadingSave = false
          if (res.data.code === 200) {
            util.showMsg(this, { succ: '新增成功' })
            this.empty();
            this.disabled = true;
            this.title = '详细信息'
            this.page = 1
            this.tabPage = 1
            this.leftTable();
          } else {
            util.showMsg(this, { diy: res.data.message })
          }
        })
      }
    }
  },
  mounted () {
    this.tabHeight = this.$refs["tab"].offsetHeight;
    this.pageSize = parseInt(this.tabHeight / 40);
    this.init();
  }
};
</script>

<style lang="less" scoped>
@import "../../../../styles/common.less";
@import "./medical-staff.less";

.tab {
  height: calc(100vh - 23.5px);
}

.specil .ivu-select-multiple .ivu-select-selection {
  height: 32px;
  overflow: auto;
}
</style>


