<template>
  <div class="bg-white">
    <!-- 顶部搜索 -->
    <div>
      <label style="display: inline-block;margin: 0  8px 0 10px">用户</label>
      <Input v-model.trim="userName"
             placeholder="请输入用户姓名"
             style="width: 180px"
             @keyup.native.enter="userSearchFns"
             @keyup.delete.native="userSearchFns" />
      <label style="display: inline-block;margin-right: 8px;margin-left:10px">科室</label>
      <span style="width:180px;display:inline-block">
        <long-range-search-select :match-field="longQueryObj.deptFieldList"
                                  :echo.sync="longQueryObj.deptEcho"
                                  @currObject="getDeptObject"
                                  :size='6'></long-range-search-select>
      </span>
      <Checkbox v-model="single"
                id="showQR"
                style="margin-left:10px;">查询全部</Checkbox>

      <Button type="primary"
              @click="userSearchFns">
        <i class="iconfont iconchaxun"></i>&nbsp;查询
      </Button>
      <Button type="primary"
              @click="addUserFn('currItemObjForm')"
              style="float: right;">
        <Icon type="md-add"
              style="vertical-align: bottom" />&#8194;新增
      </Button>
      <label style="float: right;display: inline-block;margin: 6px 15px"><span style="color:red">红色</span>为停用状态，<span style="color:#fda421">黄色</span>为锁定状态</label>
    </div>
    <!-- 搜索结果 -->
    <div class="tableBox_user">
      <Table :loading="loading"
             style="margin-top: 10px;"
             :height="tableHeight"
             border
             :columns="tableObj.columns"
             :data="tableObj.userList"></Table>
    </div>
    <!-- 底部分页 -->
    <div style="margin: 10px 0px;"
         class="fr">
      <Page @Page="changPage"
            :tabpage="pages.tabPage" />
    </div>
    <!-- 弹框 -->
    <!-- 新增/修改 -->
    <Modal v-model="showModal.addOrUpdUser"
           width="660"
           :closable="false"
           :mask-closable="false">
      <div slot="footer">
        <Button type="text"
                @click="showModal.addOrUpdUser = false">取消</Button>
        <Button type="primary"
                :loading="loadingSave"
                @click="addOrUpdUserOkFn">确定</Button>
      </div>
      <Form ref="currItemObjForm"
            :rules="addRuleValidate"
            :label-width="80"
            style="margin-top: 20px"
            :model="currItemObj">
        <div class="clearfix">
          <div class="fl"
               style="width: 48%">
            <FormItem label="人员姓名"
                      prop="userName"
                      class='need-form-item'>
              <span style="width:218px;display:inline-block"
                    v-if="showModal.isADD">
                <long-range-search-select :match-field="longQueryObj.personFieldList"
                                          :echo.sync="longQueryObj.personEcho"
                                          :disabled='!showModal.isADD'
                                          @currObject="getPersonObject"
                                          :size='6'></long-range-search-select>
              </span>
              <Input v-else
                     v-model.trim="currItemObj.userName"
                     style="width: 218px"
                     disabled />
            </FormItem>
          </div>
          <div class="fr"
               style="width: 48%">
            <FormItem label="登录账号"
                      prop="loginName">
              <Input v-model.trim="currItemObj.loginName"
                     style="width: 218px"
                     placeholder="请输入登录账号"
                     @on-blur='checkLoginName'
                     @on-focus="loginNameWarn = '请输入登录账号'" />
            </FormItem>
          </div>
        </div>
        <div class="clearfix">
          <div class="fl"
               style="width: 48%">
            <FormItem label="科室"
                      prop="deptId"
                      class='need-form-item'>
              <span style="width:218px;display:inline-block">
                <long-range-search-select :match-field="longQueryObj.deptFieldList"
                                          :echo.sync="longQueryObj.deptEchoForm"
                                          @currObject="getDeptObjectInForm"
                                          :size='6'></long-range-search-select>
              </span>
            </FormItem>
          </div>
          <div class="fr"
               style="width: 48%">
            <FormItem label="用户类型"
                      prop="userTypes">
              <Select v-model="currItemObj.userType"
                      style="width: 218px">
                <Option v-for="item in modalObj.userTypesList"
                        :value="item.flagdataValue"
                        :key="item.flagdataValue">{{ item.flagdataValueRemark }}</Option>
              </Select>
            </FormItem>
          </div>
        </div>
        <div class="clearfix">
          <div class="fl"
               style="width: 48%">
            <FormItem label="拼音码">
              <Input v-model.trim="currItemObj.pyCode"
                     style="width: 218px;" />
            </FormItem>
          </div>
          <div class="fr"
               style="width: 48%">
            <FormItem label="五笔码">
              <Input v-model.trim="currItemObj.wbCode"
                     style="width: 218px;" />
            </FormItem>
          </div>
        </div>
        <div class="clearfix">
          <div class="fl"
               style="width: 48%">
            <FormItem label="用户编号">
              <Input v-model.trim="currItemObj.personCode"
                     disabled
                     style="width: 218px" />
            </FormItem>
          </div>
          <div class="fr"
               style="width: 48%">
            <FormItem label="身份证号">
              <Input v-model.trim="currItemObj.recordNumber"
                     disabled
                     style="width: 218px" />
            </FormItem>
          </div>
        </div>
        <div class="clearfix">
          <div class="fl"
               style="width: 48%">
            <FormItem label="职工手机">
              <Input v-model.trim="currItemObj.mobileNumber"
                     id="mobileNumber"
                     disabled
                     style="width: 218px" />
            </FormItem>
          </div>
          <div class="fr"
               style="width: 48%">
            <FormItem label="最高学历">
              <Input v-model.trim="currItemObj.degreeName"
                     disabled
                     style="width: 218px" />
            </FormItem>
          </div>
        </div>
        <div class="clearfix">
          <div class="fl"
               style="width: 48%">
            <FormItem for="titleClassName"
                      label="职称等级">
              <Input v-model.trim="currItemObj.titleClassName"
                     id="titleClassId"
                     disabled
                     style="width: 218px" />
            </FormItem>
          </div>
          <div class="fr"
               style="width: 48%">
            <FormItem for="postClassId"
                      label="职务等级">
              <Input v-model.trim="currItemObj.postClassName"
                     id="postClassName"
                     disabled
                     style="width: 218px" />
            </FormItem>
          </div>
        </div>
        <div class="clearfix">
          <div class="fl"
               style="width: 48%">
            <FormItem label="工作证号">
              <Input v-model.trim="currItemObj.empNo"
                     disabled
                     style="width: 218px" />
            </FormItem>
          </div>
          <div class="fr"
               style="width: 48%">
            <FormItem label="胸牌号">
              <Input v-model.trim="currItemObj.chestGrade"
                     id="chestGrade"
                     disabled
                     style="width: 218px" />
            </FormItem>
          </div>
        </div>
      </Form>
    </Modal>
    <!-- 警告 -->
    <ConfirmDeletion :show="showModal.showWarn"
                     :msg="showModal.warnMsg"
                     title='警告'
                     :btntext='showModal.showBtnTxt'
                     @ok="warningOkFn"
                     @close="showModal.showWarn=false" />
  </div>
</template>
<script>
import util from '../../../../libs/util';
import longrangesearchselect from '../../../components/long-range-search-select';
import Page from '../../../components/page.vue';
import ConfirmDeletion from '../../../components/confirmDeletion.vue';
import longrangesearchselectElse from '../../../components/long-range-search-select-else'
export default {
  name: 'user-management',
  components: {
    Page,
    ConfirmDeletion,
    longrangesearchselectElse,
    'long-range-search-select': longrangesearchselect
  },
  data () {
    return {
      loadingSave: false,   //弹框的确定按钮loading
      loading: false,    //表格loading
      single: false,    //是否点击全部
      tableHeight: '',  //表格高度
      userName: '',      //用户input框的value
      loginNameWarn: '请输入登录账号',
      longQueryObj: { // 远程搜索相关
        userEcho: {
          id: '',
          name: '',
          PyCode: ''
        },
        userFieldList: ['ItemCode', 'ItemCode', 'ItemName', 'HIS_USER_DICT'],  // 用户 
        personEcho: {
          id: '',
          name: '',
          PyCode: ''
        },
        personFieldList: ['ItemCode', 'ItemCode', 'ItemName', 'HIS_PERSON_DICT'],// 卫生服务人员
        deptEcho: {
          id: '',
          name: '',
          PyCode: ''
        },
        deptEchoForm: {
          id: '',
          name: '',
          PyCode: ''
        },
        deptFieldList: ['DEPT_ID', 'DEPT_ID', 'DEPT_NAME', 'HIS_DEPT_DICT'], // 科室
      },
      searchObj: { // 顶部搜索对象
        userId: '',
        deptId: '',
      },
      tableObj: {
        columns: [       //表格表头
          {
            title: '序号',
            width: 50,
            align: 'right',
            key: 'ROW_ID',
            render: (h, params) => {
              return h('div', [
                h('span', {
                  style: {
                    //  停用优先级大于锁定（商定结果）
                    color: params.row.lockFlag == "1" ? (!util.isEmpty(params.row.endDate) ? 'red' : '#fda421') : (!util.isEmpty(params.row.endDate) ? 'red' : 'black')
                  }
                }, params.row.ROW_ID),
              ]);
            }
          },
          {
            title: '用户账号',
            align: 'right',
            resizable: true,
            key: 'loginName',
            render: (h, params) => {
              return h('div', [
                h('span', {
                  style: {
                    color: params.row.lockFlag == "1" ? (!util.isEmpty(params.row.endDate) ? 'red' : '#fda421') : (!util.isEmpty(params.row.endDate) ? 'red' : 'black')
                  }
                }, params.row.loginName),
              ]);
            }
          },
          {
            title: '用户姓名',
            key: 'userName',
            render: (h, params) => {
              return h('div', [
                h('span', {
                  style: {
                    color: params.row.lockFlag == "1" ? (!util.isEmpty(params.row.endDate) ? 'red' : '#fda421') : (!util.isEmpty(params.row.endDate) ? 'red' : 'black')
                  }
                }, params.row.userName),
              ]);
            }
          },
          {
            title: '默认科室',
            key: 'deptName',
            render: (h, params) => {
              return h('div', [
                h('span', {
                  style: {
                    color: params.row.lockFlag == "1" ? (!util.isEmpty(params.row.endDate) ? 'red' : '#fda421') : (!util.isEmpty(params.row.endDate) ? 'red' : 'black')
                  }
                }, params.row.deptName),
              ]);
            }
          },
          {
            title: '用户类型',
            key: 'userTypes',
            render: (h, params) => {
              return h('div', [
                h('span', {
                  style: {
                    color: params.row.lockFlag == "1" ? (!util.isEmpty(params.row.endDate) ? 'red' : '#fda421') : (!util.isEmpty(params.row.endDate) ? 'red' : 'black')
                  }
                }, params.row.userTypes),
              ]);
            }
          },
          {
            title: '状态',
            width: 70,
            resizable: true,
            align: 'center',
            key: 'status',
            render: (h, params) => {
              return h('div', [
                h('span', {
                  style: {
                    color: params.row.lockFlag == "1" ? (!util.isEmpty(params.row.endDate) ? 'red' : '#fda421') : (!util.isEmpty(params.row.endDate) ? 'red' : 'black')
                  }
                }, params.row.status),
              ]);
            }
          }, {
            title: '锁定',
            width: 70,
            align: 'center',
            key: 'lockFlag',
            render: (h, params) => {
              return h('div', [
                h('span', {
                  style: {
                    color: params.row.lockFlag == "1" ? (!util.isEmpty(params.row.endDate) ? 'red' : '#fda421') : (!util.isEmpty(params.row.endDate) ? 'red' : 'black')
                  }
                }, params.row.lockFlag == '0' ? '否' : '是'),
              ])
            }
          },
          {
            title: '失效日期',
            align: 'center',
            width: 100,
            key: 'endDate',
            render: (h, params) => {
              return h('div', [
                h('span', {
                  style: {
                    color: params.row.lockFlag == "1" ? (!util.isEmpty(params.row.endDate) ? 'red' : '#fda421') : (!util.isEmpty(params.row.endDate) ? 'red' : 'black')
                  }
                }, params.row.endDate == '' || params.row.endDate == null ? '' : params.row.endDate.substr(0, 10)),
              ])
            }
          },
          {
            title: '操作',
            key: 'action',
            width: 180,
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
                  [h('i', {
                    class: util.icon.modifyNew,
                    style: {
                      marginRight: '16px',
                      verticalAlign: 'middle',
                      fontSize: '18px',
                    },
                    on: {
                      click: () => {
                        this.loginNameWarn = '请输入登录账号'
                        this.showModal.isADD = false;
                        this.updUserClick(params.row);   //修改
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
                ),
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
                      class: util.isEmpty(params.row.endDate) ? util.icon.stop : util.icon.start,
                      style: {
                        marginRight: '16px',
                        verticalAlign: 'middle',
                        fontSize: '18px',
                        color: util.isEmpty(params.row.endDate) ? '' : 'red'
                      },
                      on: {
                        click: () => {
                          this.currloginName = params.row.loginName
                          this.currItemObj = util.deepCopyU(params.row)
                          this.currWarnItem = 'stopORstart';
                          this.showModal.showWarn = true;
                          this.showModal.showBtnTxt = util.isEmpty(params.row.endDate) ? '停用' : '启用';
                          this.showModal.warnMsg = '确定要' + this.showModal.showBtnTxt + '【' + params.row.userName + '】吗？';
                        }
                      }
                    }),
                    h(
                      'div',
                      {
                        slot: 'content'
                      },
                      util.isEmpty(params.row.endDate) ? '停用' : '启用'
                    )
                  ]
                ),
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
                      class: util.icon.resetPassword,
                      style: {
                        marginRight: '16px',
                        verticalAlign: 'middle',
                        fontSize: '18px'
                      },
                      on: {
                        click: () => {
                          this.currloginName = params.row.loginName
                          this.currWarnItem = 'resetPWD';
                          this.showModal.showWarn = true;
                          this.showModal.warnMsg = '确定要重置【' + params.row.userName + '】的密码吗？';
                          this.showModal.showBtnTxt = '重置';
                        }
                      }
                    }),
                    h(
                      'div',
                      {
                        slot: 'content'
                      },
                      '重置密码'
                    )
                  ]
                ),
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
                      class: params.row.lockFlag == "1" ? util.icon.yaoshi : util.icon.locking,
                      style: {
                        marginRight: '16px',
                        verticalAlign: 'middle',
                        fontSize: '18px',
                        color: params.row.lockFlag == "1" ? '#fda421' : ''
                      },
                      on: {
                        click: () => {
                          this.currloginName = params.row.loginName
                          this.currItemObj = util.deepCopyU(params.row)  //这个拷贝有用的  拷贝出来一份数据，不影响到原数据的使用
                          this.currWarnItem = 'lockOrUnlock';
                          if (params.row.lockFlag == "1") {
                            this.currItemObj.lockFlag = '0'
                            this.showModal.showBtnTxt = '解锁'
                          } else {
                            this.currItemObj.lockFlag = '1'
                            this.showModal.showBtnTxt = '锁定'
                          }
                          this.showModal.showWarn = true;
                          this.showModal.warnMsg = '确定要' + this.showModal.showBtnTxt + '【' + params.row.userName + '】吗？';
                        }
                      }
                    }),
                    h(
                      'div',
                      {
                        slot: 'content',
                      },
                      params.row.lockFlag == "1" ? '解锁' : '锁定'
                    )
                  ]
                )
              ]);
            }
          }
        ],
        userList: [],      //表格数据
      },
      pages: {  // 分页对象
        page: 1,
        tabPage: 1,
        pageSelf: 1,
        pageSize: 15,
      },
      showModal: { // 弹框内容
        addOrUpdUser: false,
        isADD: false,
        showWarn: false,
        showBtnTxt: '',
        warnMsg: '',

      },
      currItemObj: {       //弹框的form表单
        userType: ''
      },
      currPerson: {},    //选择修改的数据
      currloginName: '',  //登录人
      currWarnItem: '',
      addRuleValidate: { // 表单校验
        userName: [
          {
            required: true,
            validator: (rule, value, callback) => {
              if (!this.longQueryObj.personEcho.id) {
                callback(new Error('请选择用户姓名'))
              } else {
                callback();
              }
            }
          }],
        loginName: [{
          required: true,
          validator: (rule, value, callback) => {
            if (!value) {
              callback(new Error(this.loginNameWarn))
            } else {
              callback();
            }
          }
        }],
        deptId: [
          {
            required: true,
            validator: (rule, value, callback) => {
              if (!this.longQueryObj.deptEchoForm.id) {
                callback(new Error('请选择科室'))
              } else {
                callback();
              }
            }
          }
        ],
        userType: [
          { required: true, type: 'string', message: '请选择用户类型', trigger: 'change' }
        ],
      },
      modalObj: { // 表单内list
        userTypesList: [],
        personNameList: [],
        deptList: [],
      },
      primevalLoginName: '', //原始登录名
      selectOptionsPage: 1,  //科室列表加载的页码
      selectOptionsList: [], //科室列表
      selectSerachParam: '',  //已显示的科室
      spinShow: false    //科室列表加载中动画
    }
  },
  mounted () {
    this.init()
  },
  watch: {
    'searchObj.deptId': function (val, oldval) { //选择科室分页变化
      this.userSearchFns()
    },
    'searchObj.userId': function (val, oldval) {  //用户
      this.userSearchFns()
    },
    "single": function (val) {   //是否查询全部
      this.userSearchFns()
    }
  },
  methods: {
    selectObject (val) {
      this.selectSerachParam = val.label  //获取已显示的科室name
      this.searchObj.userId = val.UserId
    },
    getSelectOptionsFun () {      //获取科室
      this.spinShow = true
      let nowData = {
        'dictType': 'HIS_USER_DICT',
        'hospitalId': this.$store.state.userInfoObj.hospitalId,
        'page': this.selectOptionsPage,
        'size': 6,
        'serachParam': this.selectSerachParam,
        'primaryKeyId': this.searchObj.userId
      }
      this.$store.dispatch('getCommDict', nowData).then(res => {
        if (res.data.code === 200) {
          this.selectOptionsList = this.selectOptionsList.concat(res.data.data.list)
          this.spinShow = false
        } else {
          util.showMsg(this, { diy: res.data.message });
        }
      })
    },
    init () {
      this.tableHeight = $(".tableBox_user").height();
      this.pages.pageSize = parseInt(this.tableHeight / 38);
      this.userSearchFns()
      //用户类型
      this.$store.dispatch('getFDAttr', { flagdataCode: 'FD000009' }).then(res => {
        if (res.data.code !== 200) {
          util.showMsg(this, { diy: res.data.message });
        } else {
          this.modalObj.userTypesList = res.data.data;
        }
      })
    },
    userSearchFns () {
      console.log(this.$store.state.userInfoObj)
      this.pages.page = 1
      this.pages.tabPage = 1
      this.userSearchFn()
    },
    userSearchFn () { // 顶部查询函数
      this.tableObj.userList = []
      let params = {
        page: this.pages.page,
        size: this.pages.pageSize,
        useFlag: this.single == false ? "CUR" : "ALL",
        deptId: this.longQueryObj.deptEcho.id,
        searchParam: this.userName
      }
      this.loading = true
      this.$store.dispatch('getSysUserNEW', params).then(res => {
        this.loading = false
        if (res.data.code !== 200) {
          util.showMsg(this, { diy: res.data.message });
        } else {
          let resList = res.data.data.list
          this.pages.tabPage = res.data.data.pages
          resList.map(item => {
            item.status = util.isEmpty(item.endDate) ? '启用' : '停用'
          })
          this.tableObj.userList = resList
        }
      })
    },
    addUserFn (name) { // 点击新增
      this.loginNameWarn = '请输入登录账号'
      this.showModal.isADD = true
      this.longQueryObj.personEcho = {
        id: '',
        name: '',
        PyCode: ''
      }
      this.longQueryObj.deptEchoForm = {
        id: '',
        name: '',
        PyCode: ''
      }
      this.currItemObj = {}
      this.$refs[name].resetFields();
      this.showModal.addOrUpdUser = true
      this.currItemObj.userType = this.modalObj.userTypesList[0].flagdataValue //默认展示一个
    },
    addOrUpdUserOkFn () {//点击新增或者修改弹框的确定触发的事件
      this.$refs['currItemObjForm'].validate((valid) => {
        if (valid) {
          this.loadingSave = true
          if (this.showModal.isADD) {
            this.userAddFn() //新增的
          } else {
            this.userUpdFn() //修改的
          }
        }
      })
    },
    userUpdFn () { // 修改用户.
      let paramsRrr = {
        'dataVersion': this.currItemObj.dataVersion,
        'userId': this.currItemObj.userId,
        'userTypes': this.currItemObj.userType,
        'lockFlag': this.currItemObj.lockFlag,
        'deptId': this.longQueryObj.deptEchoForm.id,
        "userName": this.currItemObj.userName,
        'pyCode': this.currItemObj.pyCode,
        'wbCode': this.currItemObj.wbCode,
        loginName: this.primevalLoginName !== this.currItemObj.loginName && this.currWarnItem != 'lockOrUnlock' ? this.currItemObj.loginName : undefined
      };
      this.$store.dispatch('updateSysUser', paramsRrr).then(res => {
        this.loadingSave = false
        if (res.data.code !== 200) {
          util.showMsg(this, { diy: res.data.message });
        } else {
          this.userSearchFn();
          util.showMsg(this, { succ: '修改成功' });
          this.currWarnItem = ''
          this.showModal.showAddOrModify = false;
          this.showModal.addOrUpdUser = false
          this.showModal.showWarn = false;
        }
      })
    },
    userAddFn () {  // 新增用户
      let params = {
        loginName: this.currItemObj.loginName,
        hospitalId: this.$store.state.userInfoObj.hospitalId,
        deptId: this.longQueryObj.deptEchoForm.id,
        userPwd: '123456',
        userName: this.currPerson.ItemName,
        personId: this.currItemObj.personId,
        pyCode: this.currItemObj.pyCode,
        wbCode: this.currItemObj.wbCode,
        userTypes: this.currItemObj.userType,
      };
      this.$store.dispatch('addSysUser', params).then(res => {
        this.loadingSave = false
        if (res.data.code !== 200) {
          util.showMsg(this, { diy: res.data.message });
        } else {
          this.userSearchFn();
          util.showMsg(this, { succ: '新增成功' });
          this.showModal.addOrUpdUser = false
          this.showModal.showAddOrModify = false;
        }
      })
    },
    updUserClick (item) { // 点击行内修改按钮
      this.currItemObj = {}
      let nowItem = util.deepCopyU(item)
      this.currItemObj = nowItem
      this.currItemObj.userType = item.userType
      this.longQueryObj.personEcho = {
        id: item.personId,
        name: item.personName,
        PyCode: ''
      }
      this.longQueryObj.deptEchoForm = {
        id: item.deptId,
        name: item.deptName,
        PyCode: ''
      }
      this.$refs["currItemObjForm"].resetFields();
      this.primevalLoginName = item.loginName
      this.showModal.addOrUpdUser = true
    },
    checkLoginName () { // 校验登录名
      if (!this.currItemObj.loginName) {
        return
      }
      if (!this.showModal.isADD) {
        if (this.currItemObj.loginName === this.primevalLoginName) {
          return
        }
      }
      let newData = {
        loginName: this.currItemObj.loginName
      }
      this.$store.dispatch('checkLoginName', newData).then(res => {
        if (res.data.code === 200) {
          if (!res.data.data) {
            this.currItemObj.loginName = ''
            this.loginNameWarn = '该账号已使用，推荐：' + res.data.data
          }
        } else {
          util.showMsg(this, { diy: res.data.message })
        }
      })
    },
    warningOkFn () { //  警告弹框
      switch (this.currWarnItem) {
        case 'resetPWD': this.resetPassword(); break;
        case 'stopORstart': this.changeStatus(); break;  //停用或者启用的
        case 'lockOrUnlock': this.userUpdFn(); break;  //锁定或者解锁的
      }
    },
    resetPassword () { // 重置密码
      this.$store.dispatch('resetPswSysUser', { loginName: this.currloginName }).then(res => {
        if (res.data.code !== 200) {
          util.showMsg(this, { diy: res.data.message });
        } else {
          this.userSearchFn();
          util.showMsg(this, { succ: '重置密码成功!初始密码为【123456】' });
          this.currWarnItem = ''
          this.showModal.showWarn = false;
        }
      })
    },
    //停用或者启用的
    changeStatus () { // 状态改变
      this.showModal.showStop = false;
      let newData = {
        id: this.currItemObj.userId,
        status: util.isEmpty(this.currItemObj.endDate) ? '0' : '1'
      }
      this.$store.dispatch('modifyStatusUser', newData).then(res => {
        if (res.data.code === 200) {
          this.userSearchFn();
          util.showMsg(this, { succ: '用户状态更新成功！' });
          this.currWarnItem = ''
          this.showModal.showWarn = false;
        } else {
          util.showMsg(this, { diy: res.data.message });
        }
      })
    },
    changPage (Page) { //分页
      this.pages.page = Page
      this.userSearchFn()
    },
    getDeptObject (item) { //获取科室
      this.searchObj.deptId = item.DEPT_ID
    },
    getDeptObjectInForm (item) {// 科室（表单）
      this.currItemObj.deptId = item.DEPT_ID
    },
    getPersonObject (item) { // 卫生服务人员
      this.currItemObj.userName = item.PERSON_ID;
      this.currPerson = item
      if (!util.isEmpty(item.PERSON_ID)) {
        this.$store.dispatch('detailEhrServicePersonal', { id: item.PERSON_ID }).then(res => {
          if (res.data.code === 200) {
            this.currItemObj = res.data.data
            this.currItemObj.loginName = res.data.data.personCode
          } else {
            util.showMsg(this, { diy: '人员信息获取失败' });
          }
        })
      } else {
        this.currItemObj = {}
      }
    },
  },
}
</script>
<style lang="less" scoped>
@import "../../../../styles/common.less";
.tableBox_user {
  height: 78%;
}
#showQR {
  display: inline-block;
  line-height: 2px !important;
  margin-top: -2px;
}
#showQR .ivu-checkbox {
  margin-top: 12px;
}
</style>
<style>
.need-form-item .ivu-form-item-label::before {
  content: "*";
  display: inline-block;
  margin-right: 4px;
  line-height: 1;
  font-family: SimSun;
  font-size: 12px;
  color: #ed3f14;
}
.tableBox_user ::-webkit-scrollbar {
  width: 6px !important;
}
.tableBox_user ::-webkit-scrollbar-track {
  background-color: #f5f7f9;
}
.tableBox_user ::-webkit-scrollbar-thumb {
  background-color: #ccc !important;
  border-radius: 3px !important;
}
</style>

