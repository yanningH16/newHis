<template>
  <!-- 分诊台授权 -->
  <div style="height:100%">
    <i-Col span="12"
           style="border-right:1px solid #bbbec4;padding-right:10px">
      <div style="width:100%;display:flex;justify-content:space-between;align-items:center;">
        <RadioGroup v-model="animal"
                    style="width:120px;display:flex;justify-content: flex-start;"
                    @on-change="tabsClick">
          <Radio label="资源组"></Radio>
          <Radio label="用户"></Radio>
        </RadioGroup>
        <div>
          <Input v-model.trim="searchObj.inpt"
                 placeholder="请输入组名/个人名称或拼音码"
                 style="width: 200px;margin-right:10px"
                 @on-change="tabsfindClick" />
          <Button type="primary"
                  @click="addOrEditor"> <i class="iconfont icontianjia"></i>&#8194;新增</Button>
        </div>
      </div>
      <Table v-show="animal==='资源组'"
             :loading="zyzLoading"
             border
             highlight-row
             :height="tableHightLt"
             stripe
             :columns="columnsInforgroup"
             :data="dataInforgroup"
             @on-row-click="tableRowclick"
             style="margin-top:10px"></Table>
      <Table v-show="animal!='资源组'"
             :loading="zyzLoading"
             border
             highlight-row
             :height="tableHightUser"
             stripe
             ref="table"
             :columns="columnsUser"
             :data="dataUser"
             @on-row-click="tableRowclick"
             style="margin-top:10px"></Table>
      <div v-show="animal==='资源组'"
           style="width:100%;display:flex;justify-content:space-between;align-items:center; border-top:1px solid #bbbec4;margin-top:10px">
        <div style="margin-top:10px">
          <span>科室</span>
          <Input v-model.trim="searchObj.deptName"
                 @on-change="leftBottomTables"
                 placeholder="请输入科室名称或拼音码"
                 style="width: 200px;margin-left:10px" />
        </div>
        <div style="margin-top:10px">
          <span>用户</span>
          <Input v-model.trim="searchObj.userOrPy"
                 placeholder="请输入用户名称或拼音码"
                 @on-change="leftBottomTables"
                 style="width: 200px;margin-left:10px" />
        </div>
      </div>
      <Table v-show="animal==='资源组'"
             :loading="leftyhLoading"
             border
             ref="selection"
             :height="tableHightLt"
             stripe
             :columns="columnsgroupLetf"
             :data="datagroupLetf"
             style="margin-top:10px"
             @on-row-click="leftBtaleClick"
             @on-selection-change="leftBottomCheckcancleAll"
             @on-select-all="leftBottomCheckokAll"
             @on-select-cancel="leftBottomCheckcancle"
             @on-select="leftBottomCheckok"></Table>
      <div style="margin-top:10px;float:right">
        <Page @Page="changPage"
              v-show="animal==='资源组'"
              :tabpage="tabPage" />
      </div>
    </i-Col>
    <i-Col span="12"
           style="height:100%;padding-left:10px;margin-top:-40px">
      <div style="width:53%;display:flex;justify-content:space-between;align-items:center; ">
        <span style="font-size:14px;font-weight:bold">资源组权限</span>
        <Select v-model="deptSearchobjs"
                filterable
                clearable
                id="selectlIId"
                remote
                placeholder="请输入名称查询"
                style="width: 200px;margin-left:10px"
                @on-change="deptSearchobj"
                :remote-method="deptRemoteMethodquery">
          <Option v-for="(option, index) in deptOptionsvals"
                  :value="option.label"
                  :key="index">{{option.label}}</Option>
        </Select>
      </div>
      <div id="tableSelectId"
           style="width:100%;margin-top:10px;overflow-y:auto;height:82%">
        <span style="border:1px solid gery">
          <Tree class="room-tree-contentfzts"
                ref="fztRoom"
                :data="fenztList"
                @on-check-change="treeFztCance"
                show-checkbox></Tree>
          <Spin size="large"
                fix
                v-if="rightfztLoading"></Spin>
        </span>
      </div>
    </i-Col>
    <!-- 新增/修改 -->
    <Modal v-model="changeModel"
           :closable="false"
           width="450px"
           :mask-closable="false">
      <div slot="footer">
        <Button type="text"
                @click="addOrUpdReset('formObj')">取消</Button>
        <Button type="primary"
                @click="addOrUpdFc('formObj')"
                :loading="loading">保存</Button>
      </div>
      <Form class="rescourceForm"
            ref="formObj"
            label-position="left"
            :model="formObj"
            :rules="ruleValidate"
            :label-width="100">
        <Row v-show="this.animal==='资源组'">
          <!-- 资源组 -->
          <i-Col span="24">
            <FormItem label="资源组ID"
                      prop="groupId">
              <Input disabled
                     v-model="formObj.groupId"
                     style="width:300px" />
            </FormItem>
          </i-Col>
          <i-Col span="24">
            <FormItem label="组类型"
                      prop="groupType">
              <Input disabled
                     v-model="formObj.groupType"
                     style="width:300px" />
            </FormItem>
          </i-Col>
          <i-Col span="24">
            <FormItem label="资源组名称"
                      prop="groupName">
              <Input v-model="formObj.groupName"
                     style="width:300px" />
            </FormItem>
          </i-Col>
          <i-Col span="24">
            <FormItem label="排序号"
                      prop="sortNo">
              <Input v-model="formObj.sortNo"
                     style="width:110px" />
            </FormItem>
          </i-Col>
          <i-Col span="12">
            <FormItem label="拼音码"
                      prop="pyCode">
              <Input v-model="formObj.pyCode"
                     style="width:110px" />
            </FormItem>
          </i-Col>
          <i-Col span="12">
            <FormItem label="五笔码"
                      prop="wbCode"
                      :label-width="65"
                      style="margin-left:15px">
              <Input v-model="formObj.wbCode"
                     style="width:94px" />
            </FormItem>
          </i-Col>
        </Row>
        <!-- 用户 -->
        <Row v-show="this.animal!='资源组'">
          <i-Col span="24">
            <FormItem label="用户编码"
                      prop="groupCode">
              <Input disabled
                     v-model="formObj.groupCode"
                     style="width:300px" />
            </FormItem>
          </i-Col>
          <i-Col span="24">
            <FormItem label="组类型"
                      prop="groupType">
              <Input disabled
                     v-model="formObj.groupType"
                     style="width:300px" />
            </FormItem>
          </i-Col>
          <i-Col span="24">
            <FormItem label="用户名称"
                      prop="groupName">
              <longrangesearchselectElse direction='bottom'
                                         :vModel.sync='selectSerachParam'
                                         value="userId"
                                         label='userName'
                                         :spinShow='spinShowDP'
                                         class="selectData"
                                         placeholder="请输入名称查询"
                                         style="width: 300px;"
                                         :selectOptionsPage.sync='selectOptionsPage'
                                         :propOptions.sync='selectOptionsList'
                                         @currObject='selectObject'
                                         @getSelectOptions='getSelectOptionsFun'>
              </longrangesearchselectElse>
            </FormItem>
          </i-Col>
          <i-Col span="14">
            <FormItem label="用户编码"
                      prop="personCode">
              <Input disabled
                     v-model="formObj.personCode"
                     style="width:110px" />
            </FormItem>
          </i-Col>
          <i-Col span="10">
            <FormItem label="排序号"
                      :label-width="65"
                      prop="sortNo">
              <Input v-model="formObj.sortNo"
                     style="width:93px" />
            </FormItem>
          </i-Col>
          <i-Col span="24">
            <FormItem label="默认科室"
                      prop="deptName">
              <Input disabled
                     v-model="formObj.deptName"
                     style="width:300px" />
            </FormItem>
          </i-Col>
          <i-Col span="14">
            <FormItem label="拼音码"
                      prop="pyCode">
              <Input v-model="formObj.pyCode"
                     style="width:119px" />
            </FormItem>
          </i-Col>
          <i-Col span="10">
            <FormItem label="五笔码"
                      :label-width="65"
                      prop="wbCode">
              <Input v-model="formObj.wbCode"
                     style="width:93px" />
            </FormItem>
          </i-Col>
        </Row>
      </Form>
    </Modal>
    <comfirmDeletion class="aBox"
                     :show="delModal"
                     :msg="delMsg"
                     title='警告'
                     :btntext='delBtnText'
                     @ok="delMenuAjax"
                     :loading="delLoading"
                     @close="delModal=false" />
  </div>
</template>
<script>
import Vue from 'vue'
import util from '../../../../libs/util.js'
import Page from '../../../components/page.vue'
import comfirmDeletion from '../../../components/confirmDeletion.vue'
import longrangesearchselectElse from '../../../components/long-range-search-select-else'
export default {
  components: { comfirmDeletion, longrangesearchselectElse, Page },
  data () {
    const validategroupName = (rule, value, callback) => {
      if (util.isEmpty(value)) {
        callback(new Error('名称不能为空'));
      } else {
        callback();
      }
    };
    const validateAge = (rule, value, callback) => {
      if (!Number.isInteger(value * 1)) {
        callback(new Error('排序号只能为整数字'));
      } else if (value * 1 <= 0 && !util.isEmpty(value)) {
        callback(new Error('排序号必须大于0'));
      } else if (util.isEmpty(value)) {
        if (this.addOrUp == 2) {
          callback(new Error('排序号不能为空'));
        } else {
          callback();
        }
      } else {
        callback();
      }
    };
    return {
      //表格高度
      tableHightLt: 300,
      tableHightUser: 500,
      // 左上资源组表格
      columnsInforgroup: [
        {//资源组表头
          title: '排序号',
          key: 'sortNo',
          align: 'center',
          width: 60
        }, {
          title: '组类型',
          key: 'groupType',
          align: 'center',
          render: (h, params) => {
            let val = params.row.groupType * 1 === 1 ? '资源组' : '用户'
            return h('div', {}, val)
          }
        }, {
          title: '资源组编码',
          key: 'groupCode',
          align: 'center',
        }, {
          title: '资源组名称',
          key: 'groupName',
          align: 'center',
        }, {
          title: '操作',
          key: ' ',
          align: 'center',
          width: 90,
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
                    on: {
                      click: () => {
                        this.changeModel = true
                        this.addOrUp = 2
                        this.upBtn(params.row)
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
                    class: util.icon.delete,
                    on: {
                      click: () => {
                        this.delModal = true;
                        this.delMsg = '确定要删除【' + params.row.groupName + '】吗？'
                        this.formObj.groupId = params.row.groupId
                      }
                    }
                  }),
                  h(
                    'div',
                    {
                      slot: 'content'
                    },
                    '删除'
                  )
                ]
              )
            ]);
          }
        }
      ],
      dataInforgroup: [],
      zyzLoading: false,
      // 左下表格
      columnsgroupLetf: [
        {
          type: 'selection',
          width: 60,
          align: 'center'
        }, {
          title: '科室名称',
          key: 'deptName',
          align: 'center'
        }, {
          title: '用户编码',
          key: 'personCode',
          align: 'center',
          width: 80
        }, {
          title: '用户',
          key: 'userName',
          align: 'center',
          width: 90
        }, {
          title: '职务等级',
          key: 'postClassName',
          align: 'center',
        }
      ],
      datagroupLetf: [],
      datagroupLetfFB: [],
      leftyhLoading: false,
      leftboCheck: [],//所选用户的科室列表
      leftboCheckAll: [],
      // 左上用户表格
      columnsUser: [
        {//资源组表头
          title: '排序号',
          key: 'sortNo',
          align: 'center',
          width: 60
        }, {
          title: '组类型',
          key: 'groupType',
          align: 'center',
          width: 65,
          render: (h, params) => {
            let val = params.row.groupType * 1 === 1 ? '资源组' : '用户'
            return h('div', {}, val)
          }
        }, {
          title: '用户名称',
          key: 'groupName',
          align: 'center',
        }, {
          title: '用户编码',
          key: 'personCode',
          width: 90
        }, {
          title: '默认科室',
          key: 'deptName',
          align: 'center',
        }, {
          title: '操作',
          key: ' ',
          align: 'center',
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
                    on: {
                      click: () => {
                        this.changeModel = true
                        this.addOrUp = 2
                        this.upBtn(params.row)
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
                    class: util.icon.delete,
                    on: {
                      click: () => {
                        this.delModal = true;
                        this.delMsg = '确定要删除【' + params.row.groupName + '】吗？'
                        this.formObj.groupId = params.row.groupId
                      }
                    }
                  }),
                  h(
                    'div',
                    {
                      slot: 'content'
                    },
                    '删除'
                  )
                ]
              )
            ]);
          }
        }
      ],
      dataUser: [],
      zyzLoading: false,
      animal: '资源组',    //判断为资源组还是用户
      searchObj: {   //条件搜索
        inpt: '',
        deptName: '',
        userOrPy: '',
        inptRight: ''
      },
      tabPage: 1,
      page: 1,//左下角分页的处理
      formObj: {        //新增修改弹框的form数据
        groupName: '',
        groupId: null,
        groupType: '',
        sortNo: null,
        pyCode: '',
        wbCode: '',
        personCode: '',
        deptName: '',
        dataVersion: null
      },
      ruleValidate: {      //弹框的form规则
        groupName: [
          { required: true, validator: validategroupName, trigger: 'blur' }
        ],
        sortNo: [{ validator: validateAge, trigger: 'blur' }],
      },
      changeModel: false,     //新增修改弹出框是否显示
      loading: false,       //弹出框保存按钮的loading
      delLoading: false,    //删除弹出框loading
      delModal: false,     //判断删除弹框的显示隐藏
      delBtnText: '删除',   //删除弹框的按钮显示
      delMsg: '',          //删除弹框的显示内容
      groupNameslect: '',
      selectOptionsPage: 1,      //用户名称下拉框页数
      selectSerachParam: '',     //用户名称下拉框回显内容
      spinShowDP: false,          //用户名称下拉框加载动画
      selectOptionsList: [],     //用户名称下拉列表的数据
      groupIds: null,     //点击左侧列表数据
      fenztList: [],         //分诊台右侧树节点
      deptSearchobjs: '',     //分诊台搜索的回显数据
      fenztListFB: [],     //获取到的分诊台数据
      fenztListClon: [],
      fenzhtCheck: [],       //选择用户已有的权限
      fenzhtAllCheck: [],
      deptOptionsvals: [],     //分诊台搜索右侧的下拉框列表数据
      rightfztLoading: false,
      fztNum: true,
    }
  },
  mounted () {
    this.tableHightLt = (window.innerHeight - this.$refs.table.$el.offsetTop - 300) / 2;       //资源组左侧两个表格的自定义高度
    this.tableHightUser = window.innerHeight - this.$refs.table.$el.offsetTop - 140;           //用户表格的自定义高度
  },
  methods: {
    init () {// 初始化
      this.leftBottomTable()    //获取左下表格
      this.getLeftTable()//获取左上表格
      this.getFenZhenAjax() //获取分诊台全部数据
    },
    addOrEditor () {   //新增事件 
      this.changeModel = true;
      this.addOrUp = 1;
      this.formObj.groupType = this.animal;
    },
    getLeftTable () {    // 获取左上表格
      let nowData = {
        groupType: this.animal === '资源组' ? 1 : 2,
        searchParam: this.searchObj.inpt,
        resourceType: 2
      }
      this.zyzLoading = true
      this.$store.dispatch('getSysResourceGroups', nowData).then(res => {
        this.zyzLoading = false
        if (res.data.code !== 200) {
          util.showMsg(this, { diy: res.data.message })
        } else {
          this.groupIds = null;
          this.listChang = false;
          if (this.animal === '资源组') {
            this.dataInforgroup = res.data.data.list
            this.dataInforgroup.sort(this.compare('sortNo'))
            this.dataInforgroup.length > 0 ? this.tableRowclick(this.dataInforgroup[0]) : ''
            this.dataInforgroup.length > 0 ? this.dataInforgroup[0]._highlight = true : ''
          } else {
            this.dataUser = res.data.data.list
            this.dataUser.sort(this.compare('sortNo'))
            this.dataUser.length > 0 ? this.tableRowclick(this.dataUser[0]) : ''
            this.dataUser.length > 0 ? this.dataUser[0]._highlight = true : ''
          }
        }
      })
      this.deptSearchobjs = ''    //搜索框置空
    },
    getSelectOptionsFun () {// 用户名称-更新、查询下拉列表的事件
      this.spinShowDP = true;
      let data = {
        'searchUser': this.selectSerachParam,
        'page': this.selectOptionsPage,
        'size': 6,
        hospitalId: this.$store.state.userInfoObj.hospitalId
      }
      this.$store.dispatch('getAllUsers', data).then(res => {
        this.spinShowDP = false
        if (res.data.code === 200) {
          this.selectOptionsList = this.selectOptionsList.concat(res.data.data.list)
        } else {
          util.showMsg(this, { diy: res.data.message })
        }
      })
    },
    selectObject (val) {       // 用户名称-选中的option
      this.formObj.personCode = val.personCode
      this.formObj.deptName = val.deptName
      this.groupNameslect = val.userName
      this.selectSerachParam = val.label
      this.formObj.groupName = val.userId
    },
    leftBottomTables () {
      this.page = 1
      this.tabPage = 1
      this.leftBottomTable()
    },
    leftBottomTable () {    //获取左下表格
      let data = {
        searchUser: this.searchObj.userOrPy,
        searchDept: this.searchObj.deptName,
        page: this.page,
        size: 8,
        hospitalId: this.$store.state.userInfoObj.hospitalId
      }
      this.leftyhLoading = true
      this.$store.dispatch('getAllUsers', data).then(res => {
        this.leftyhLoading = false
        if (res.data.code === 200) {
          this.datagroupLetf = res.data.data.list;
          this.datagroupLetfFB = res.data.data.list;
          this.tabPage = res.data.data.pages
          if (!util.isEmpty(this.groupIds)) {
            this.leftBottomCheckData(this.groupIds)
          }
        } else {
          util.showMsg(this, { diy: res.data.message })
        }
      })
    },
    tabsClick (val) {      //选择用户或者资源组
      this.page = 1
      this.searchObj.inpt = ''     //左侧三个搜索框为空
      this.searchObj.userOrPy = ''
      this.searchObj.deptName = ''
      this.getLeftTable()
      this.animal === '资源组' ? this.leftBottomTable() : ''
      this.getFenZhenAjax() //获取分诊台全部数据
    },
    tabsfindClick () {      //左侧搜索框事件
      this.getFenZhenAjax() //获取分诊台全部数据
      this.getLeftTable()
      this.animal === '资源组' ? this.leftBottomTable() : ''
    },
    tableRowclick (val) {      //点击左侧列表数据获取右侧数据
      this.deptSearchobjs = ''
      this.groupIds = val;
      this.animal === '资源组' ? this.leftBottomCheckData(val) : '';
      this.getfztCheckData(val)     //获取分诊台数据
    },
    leftBtaleClick (val, index) {  //点击左下表格选中当前行
      this.$refs.selection.toggleSelect(index);
    },
    leftBottomCheckcancleAll (val) {// 左下表格单击取消全部选中
      if (util.isEmpty(this.groupIds)) {
        util.showMsg(this, { warning: '请选择资源组或用户' })
        return
      }
      if (!this.leftboCheckAllstatus && this.datagroupLetf.length === 1 && this.leftboCheck.length === 1 && val.length === 0) {
        this.leftboCheckAllstatus = true
        this.leftBottomCheckcancle(val)
        return
      } else if (this.datagroupLetf.length === this.leftboCheck.length && this.datagroupLetf.length >= 1 && val.length === 0) {
        let nowData = {
          groupId: this.groupIds.groupId,
        }
        this.$store.dispatch('sysGroupMenuDeleteByUserIds', nowData).then(res => {
          if (res.data.code !== 200) {
            util.showMsg(this, { diy: res.data.message })
          } else {
            util.showMsg(this, { succ: '取消成功' });
            this.leftBottomCheckData(this.groupIds)
          }
        })
      }
    },
    leftBottomCheckData (val) {    // 左下表格回显
      this.datagroupLetf = JSON.parse(JSON.stringify(this.datagroupLetfFB));
      let data = {
        hospitalId: this.$store.state.userInfoObj.hospitalId,
        groupId: val.groupId
      }
      this.$store.dispatch('getSysGroupMenuList', data).then(res => {
        if (res.data.code !== 200) {
          util.showMsg(this, { diy: res.data.message })
        } else {
          this.leftboCheck = []
          this.leftboCheckAll = []
          res.data.data.list.map(item => {
            const index = util.indexOfObject(item.userId, this.datagroupLetf, 'userId')
            if (index != -1) {
              this.leftboCheck.push(this.datagroupLetf[index].userId)
              this.leftboCheckAll.push(this.datagroupLetf[index])
              this.datagroupLetf[index]._checked = true
              this.datagroupLetf.unshift(this.datagroupLetf[index]);
              this.datagroupLetf.splice(index + 1, 1);
            }
          })
        }

      })
    },
    leftBottomCheckokAll (val) {   // 左下表格单击全选
      if (util.isEmpty(this.groupIds)) {
        util.showMsg(this, { warning: '请选择资源组或用户' })
        return
      }
      let userid = [];
      val.map(item => {
        const index = util.indexOfObject(item.userId, this.leftboCheckAll, 'userId')
        if (index == -1) {
          const obj = {}
          obj["hospitalId"] = this.$store.state.userInfoObj.hospitalId
          obj["menuId"] = item.userId
          obj["groupId"] = this.groupIds.groupId
          userid.push(obj)
        }
      })
      this.$store.dispatch('batchAddGroupUsers', userid).then(res => {
        if (res.data.code !== 200) {
          util.showMsg(this, { diy: res.data.message })
        } else {
          util.showMsg(this, { succ: '新增成功' });
          this.leftBottomCheckData(this.groupIds)
        }
      })
    },
    leftBottomCheckcancle (val) {    // 左下表格单击取消选中
      if (util.isEmpty(this.groupIds)) {
        util.showMsg(this, { warning: '请选择资源组或用户' })
        return
      }
      if (!this.leftboCheckAllstatus && this.datagroupLetf.length === 1 && this.leftboCheck.length === 1 && val.length === 0) {
        this.leftboCheckAllstatus = false
        return
      }
      this.leftboCheckAllstatus = false
      let userid = null;
      this.leftboCheck.map(item => {
        const index = util.indexOfObject(item, val, 'userId')
        if (index == -1) {
          userid = item
        }
      })
      let nowData = {
        groupId: this.groupIds.groupId,
        userId: userid
      }
      this.$store.dispatch('sysGroupMenuDeleteByUserIds', nowData).then(res => {
        if (res.data.code !== 200) {
          util.showMsg(this, { diy: res.data.message })
        } else {
          util.showMsg(this, { succ: '取消成功' });
          this.leftBottomCheckData(this.groupIds)
        }
      })
    },
    leftBottomCheckok (val) {    // 左下表格单击选中
      if (util.isEmpty(this.groupIds)) {
        util.showMsg(this, { warning: '请选择资源组或用户' })
        return
      }
      let userid = null;
      val.map(item => {
        const index = util.indexOfObject(item.userId, this.leftboCheck, 'userId')
        if (index == -1) {
          userid = item.userId
        }
      })
      let nowData = {
        groupId: this.groupIds.groupId,
        hospitalId: this.$store.state.userInfoObj.hospitalId,
        userId: userid
      }
      this.$store.dispatch('sysGroupMenuAdds', nowData).then(res => {
        if (res.data.code !== 200) {
          util.showMsg(this, { diy: res.data.message })
        } else {
          util.showMsg(this, { succ: '新增成功' });
          this.leftBottomCheckData(this.groupIds)
        }
      })
    },
    upBtn (val) {       //行内修改操作
      this.formObj.sortNo = val.sortNo;
      this.formObj.groupType = this.animal;
      this.formObj.groupId = val.groupId;
      this.formObj.wbCode = val.wbCode;
      this.formObj.pyCode = val.pyCode;
      this.formObj.dataVersion = val.dataVersion;
      if (this.animal === '资源组') {
        this.formObj.groupName = val.groupName;
      } else {
        this.formObj.groupCode = val.groupCode;
        this.selectSerachParam = val.groupName;
        this.formObj.deptName = val.deptName
        this.formObj.personCode = val.personCode;
        this.groupNameslect = val.groupName;
        this.datagroupLetf.map(item => {
          if (item.userName === val.groupName) {
            this.formObj.groupName = item.userId
          }
        })
      }
    },
    changPage (Page) { //左下角表格分页
      this.page = Page
      this.leftBottomTable()
    },
    hbBtaleClick (val, index) {    //点击号表表格
      this.$refs.selectionRight.toggleSelect(index);
    },
    delMenuAjax (val) {     // 删除
      if (this.animal === '资源组' && this.leftboCheck.length != 0) {
        util.showMsg(this, { warning: '有组成员的不可删除！' });
        return
      }
      let nowData = {
        groupId: this.formObj.groupId,
      }
      this.delLoading = true
      this.$store.dispatch('deleteGroupSs', nowData).then(res => {
        this.delLoading = false
        if (res.data.code === 200) {
          util.showMsg(this, { succ: '删除成功' });
          this.delModal = false;
          this.tabsClick(this.resources);
          this.$refs['formObj'].resetFields();
          this.formObj.groupId = null
        } else {
          util.showMsg(this, { diy: res.data.message })
        }
      })
    },
    addOrUpdFc (name) {    // 新增保存
      this.$refs[name].validate((valid) => {
        if (valid) {
          this.loading = true
          let nowData = {
            resourceType: 2,
            hospitalId: this.$store.state.userInfoObj.hospitalId,
            groupType: this.animal == '资源组' ? '1' : '2',
            groupId: this.addOrUp === 1 ? undefined : this.formObj.groupId,
            groupName: this.animal == '资源组' ? this.formObj.groupName : this.groupNameslect,
            stopFlag: '0',
            sortNo: this.formObj.sortNo,
            pyCode: this.formObj.pyCode,
            wbCode: this.formObj.wbCode,
            dataVersion: this.addOrUp === 1 ? undefined : this.formObj.dataVersion,
            personCode: this.animal == '资源组' ? undefined : this.formObj.groupName,
          }
          if (this.addOrUp === 1) {
            this.$store.dispatch('addGroupSs', nowData).then(res => {
              if (res.data.code === 200) {
                util.showMsg(this, { succ: '新增成功' });
                this.changeModel = false;
                this.tabsClick(this.resources);
                this.groupNameslect = ''
                this.$refs[name].resetFields();
              } else {
                util.showMsg(this, { diy: res.data.message })
              }
              this.loading = false
            })
          } else if (this.addOrUp === 2) {
            this.$store.dispatch('updateGroupSs', nowData).then(res => {
              this.loading = false
              if (res.data.code === 200) {
                util.showMsg(this, { succ: '修改成功' });
                this.changeModel = false;
                this.tabsClick(this.resources);
                this.$refs[name].resetFields();
                this.groupNameslect = ''
                this.formObj.dataVersion = null
              } else {
                util.showMsg(this, { diy: res.data.message })
              }
            })
          }
        }
      })
    },
    addOrUpdReset (name) {      //取消
      this.$refs[name].resetFields();
      this.changeModel = false;
      this.groupNameslect = ''
    },
    compare (property) {    //排序
      return function (a, b) {
        var value1 = a[property];
        var value2 = b[property];
        return value1 - value2;
      }
    },
    getFenZhenAjax () { // 获取分诊台数据
      let nowData = {
        flag: '1,3'
      }
      this.rightfztLoading = true;
      this.$store.dispatch('getNursesReceptionList', nowData).then(
        res => {
          if (res.data.code !== 200) {
            util.showMsg(this, { diy: res.data.message })
          } else {
            this.fenztListFB = res.data.data.list
            let restList = util.getTree(
              res.data.data.list,
              'roomId',
              'roomName',
              'parentId',
              '全部诊室');
            this.fenztList = restList[0].children
            this.fenztListClon = restList[0].children
          }
          this.rightfztLoading = false;

        }
      );
    },
    deptSearchobj () {    // 分诊台搜索
      if (!util.isEmpty(this.deptSearchobjs)) {
        let id = util.findOfObject(this.deptSearchobjs, this.fenztListFB, 'roomName', 'roomId', 'wbCode', 'pyCode');
        if (id) {
          let treeItems = {};
          this.fenztList.map(val => {
            if (util.treeMap(val, id)) {
              treeItems = util.treeMap(val, id);
            }
          })
          if (!treeItems) {
            util.showMsg(this, { warning: `没有${this.deptSearchobjs}` });
            return;
          }
          if (treeItems.nodeKey != undefined) {
            this.$refs['fztRoom'].handleSelect(treeItems.nodeKey);
            this.$nextTick().then(
              () => {
                util.isEmpty(document.querySelector('.room-tree-contentfzts span.ivu-tree-title.ivu-tree-title-selected')) ? '' : document.querySelector('.room-tree-contentfzts span.ivu-tree-title.ivu-tree-title-selected').scrollIntoView({ behavior: "instant", block: "end", inline: "nearest" });
              }
            )
          }
        }
      }
    },
    deptRemoteMethodquery (query) {      //下拉框远程搜索
      if (query !== '') {
        setTimeout(() => {
          const list = this.fenztListFB.map(item => {
            return {
              value: item.roomId,
              label: item.roomName,
              pyCodeLower: item.pyCode.toLowerCase(),
              pyCodeUpper: item.pyCode.toUpperCase(),
              wbCode: item.wbCode
            };
          });
          this.deptOptionsvals = util.findKeys(query, list, ['label', 'pyCodeLower', 'pyCodeUpper', 'wbCode'])
        }, 10);
      } else {
        this.deptOptionsvals = [];
      }
    },
    getfztCheckData (val) {    // 分诊台回显
      this.rightfztLoading = true
      this.fenztList = JSON.parse(JSON.stringify(this.fenztListClon));
      let nowData = {
        groupId: val.groupId,
        hospitalId: this.$store.state.userInfoObj.hospitalId,
        resourceType: '2'
      }
      this.$store.dispatch('getGroupResources', nowData).then(res => {
        if (res.data.code !== 200) {
          util.showMsg(this, { diy: res.data.message })
        } else {
          this.fenzhtCheck = []
          this.fenzhtAllCheck = []
          let hasCheck = []
          this.fenztList.map(ite => {
            ite.children.map(Element => {
              Element.checked = false
              ite.indeterminate = false
            })
            res.data.data.list.map(item => {
              const index = util.treeMap(ite, item.resourceId)
              if (index != undefined) {
                hasCheck.push(index)
                this.fenzhtAllCheck.push(item)
                index.children.length == 0 ? this.fenzhtCheck.push(item) : ''
              }
            })
          })
          hasCheck.map((vals, i) => {
            const varData = { checked: 'true', nodeKey: `${vals.nodeKey}` };
            if (vals.children.length == 0) {
              this.fztNum = false;
              this.$refs['fztRoom'].handleCheck(varData)
            }
            // 排序，选中在前
            this.listSort(this.fenztList, vals)
          })
        }
        this.rightfztLoading = false
      })
    },
    listSort (sortList, vals) {    // 树排序
      sortList.map((ite, index) => {
        if (ite.nodeKey == vals.nodeKey) {
          if (ite.children.length == 0) {
            sortList.unshift(sortList[index]);
            sortList.splice(index + 1, 1);
          }
        } else {
          ite.children.map((ites, ind) => {
            if (ites.nodeKey == vals.nodeKey) {
              if (ites.children.length == 0) {
                ite.children.unshift(ite.children[ind]);
                ite.children.splice(ind + 1, 1);
                sortList.unshift(sortList[index]);
                sortList.splice(index + 1, 1);
              }
            } else {
              ites.children.map((items, indx) => {
                if (items.nodeKey == vals.nodeKey) {
                  ites.children.unshift(ites.children[indx]);
                  ites.children.splice(indx + 1, 1);
                  ite.children.unshift(ite.children[ind]);
                  ite.children.splice(ind + 1, 1);
                  sortList.unshift(sortList[index]);
                  sortList.splice(index + 1, 1);
                }
              })
            }
          })
        }
      })
    },
    treeFztCance (val) {    // 分诊台新增取消
      if (util.isEmpty(this.groupIds)) {
        util.showMsg(this, { warning: '请选择资源组或用户' })
        return
      }
      if (this.fztNum == false) {
        this.fztNum = true
        return
      }
      this.rightfztLoading = true
      let userid = null;
      let selectList = []
      val.map(valu => {
        valu.children.length === 0 ? selectList.push(valu) : ''
      })
      let arry = []
      if (selectList.length > this.fenzhtCheck.length) {
        //新增
        val.map(item => {
          const index = util.indexOfObject(item.id, this.fenzhtAllCheck, 'resourceId')
          if (index == -1) {
            const obj = {}
            obj["hospitalId"] = this.$store.state.userInfoObj.hospitalId
            obj["resourceId"] = item.id
            obj["resourceType"] = '2'
            obj["groupId"] = this.groupIds.groupId
            arry.push(obj)
          }
        })
        let param = []
        param.push({ 'groupId': this.groupIds.groupId })
        param.push(arry)
        this.$store.dispatch('batchAddftzs', param).then(res => {
          this.rightfztLoading = false
          if (res.data.code !== 200) {
            util.showMsg(this, { diy: res.data.message })
          } else {
            util.showMsg(this, { succ: '新增成功' });
            this.getfztCheckData(this.groupIds)
          }
        })
      } else {
        //单个删除
        let arr = []
        this.fenzhtAllCheck.map(item => {
          const index = util.indexOfObject(item.resourceId, val, 'id')
          if (index == -1) {
            arr.push(item.resourceId)
          }
        })
        let nowData = {
          groupId: this.groupIds.groupId,
          hospitalId: this.$store.state.userInfoObj.hospitalId,
          resourceIds: arr.join(","),
          resourceType: '2'
        }
        this.$store.dispatch('sysUserResourceFztDeletes', nowData).then(res => {
          this.rightfztLoading = false
          if (res.data.code !== 200) {
            util.showMsg(this, { diy: res.data.message })
          } else {
            util.showMsg(this, { succ: '删除成功' });
            this.getfztCheckData(this.groupIds)
          }
        })
      }
    },
  }
}
</script>
<style>
</style>