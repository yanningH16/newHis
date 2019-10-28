<template>
  <!-- 药房授权 -->
  <div>
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
      <div style="width:100%;justify-content:space-between;align-items:center; ">
        <span style="font-size:14px;font-weight:bold">资源组权限</span>
        <!-- 药房授权 -->
        <Input v-model="wareHouseGroup"
               style="width: 200px;margin-left:10px"
               placeholder="请输入名称查询"
               @on-change="wareHouseTabel"
               @keyup.native.enter="wareHouseTabel" />
      </div>
      <div id="tableSelectId"
           style="width:100%;overflow-y:auto;">
        <Table :loading="rightKFLoading"
               border
               ref="selectionRightYk"
               :height="tableHightRt"
               stripe
               :columns="columnskf"
               :data="datakf"
               @on-row-click="yktaleClick"
               @on-selection-change="kufCance"
               style="margin-top:10px"></Table>
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
          <!-- <Row> -->
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
                     style="width:300px" />
            </FormItem>
          </i-Col>
          <i-Col span="14">
            <FormItem label="拼音码"
                      prop="pyCode">
              <Input v-model="formObj.pyCode"
                     style="width:110px" />
            </FormItem>
          </i-Col>
          <i-Col span="10">
            <FormItem label="五笔码"
                      prop="wbCode"
                      :label-width="65">
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
              <longrangesearchselectElse direction="bottom"
                                         :vModel.sync="selectSerachParam"
                                         value="userId"
                                         label="userName"
                                         :spinShow="spinShowDP"
                                         class="selectData"
                                         placeholder="请输入名称查询"
                                         style="width: 300px;"
                                         :selectOptionsPage.sync="selectOptionsPage"
                                         :propOptions.sync="selectOptionsList"
                                         @currObject="selectObject"
                                         @getSelectOptions="getSelectOptionsFun"></longrangesearchselectElse>
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
      tableHightRt: 500,
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
      // 药库表格
      columnskf: [
        {
          type: 'selection',
          width: 60,
          align: 'center'
        }, {
          title: '库房名称',
          key: 'deptName',
          align: 'center',
        }
      ],
      datakf: [],       //药房房授权的资源组左侧表格数据
      datakfClon: [],
      wareHouseGroup: '',   //药房授权的input搜索框回显数据
      rightKFLoading: false
    }
  },
  mounted () {
    this.tableHightLt = (window.innerHeight - this.$refs.selectionRightYk.$el.offsetTop - 300) / 2;       //资源组左侧两个表格的自定义高度
    this.tableHightUser = window.innerHeight - this.$refs.selectionRightYk.$el.offsetTop - 170;           //用户表格的自定义高度
    this.tableHightRt = window.innerHeight - this.$refs.selectionRightYk.$el.offsetTop - 170           //右侧表格的自定义高度  
  },
  methods: {
    init () {// 初始化
      this.leftBottomTable()    //获取左下表格
      this.getLeftTable()//获取左上表格
      this.getkuFangTableAjax() //获取药房授权全部数据
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
        resourceType: 4
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
      this.tabPage = 1
      this.getLeftTable()
      this.animal === '资源组' ? this.leftBottomTable() : ''
      this.getkuFangTableAjax() //获取药房授权全部数据
    },
    tabsfindClick () {      //左侧搜索框事件
      this.getkuFangTableAjax() //获取药房授权全部数据
      this.getLeftTable()
      this.animal === '资源组' ? this.leftBottomTable() : ''
    },
    tableRowclick (val) {      //点击左侧列表数据获取右侧数据
      this.groupIds = val;
      this.animal === '资源组' ? this.leftBottomCheckData(val) : '';
      this.wareHouseTabel(this.wareHouseGroup)
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
    // 左下表格回显
    leftBottomCheckData (val) {
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
          const resList = res.data.data.list
          resList.map(item => {
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
    // 新增保存
    addOrUpdFc (name) {
      this.$refs[name].validate((valid) => {
        if (valid) {
          this.loading = true
          let nowData = {
            resourceType: 4,
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
    //搜索库房
    wareHouseTabel () {
      this.getkuFangTableAjax();
      setTimeout(() => {
        !util.isEmpty(this.groupIds) ? this.getkufCheckData(this.groupIds) : ""; // 库房权限
      }, 50);
    },
    //点击药库表格
    yktaleClick (val, index) {
      this.$refs.selectionRightYk.toggleSelect(index);
    },
    // 库房新增取消
    kufCance (val) {
      if (util.isEmpty(this.groupIds)) {
        util.showMsg(this, { warning: '请选择资源组或用户' })
        return
      }
      this.rightKFLoading = true
      let arry = []
      let arrys = []
      if (val.length > this.kfChecked.length) {
        //新增
        if (val.length > 0) {
          val.map(item => {
            const index = util.indexOfObject(item.deptId, this.kfChecked, 'deptId')
            if (index == -1) {
              const obj = {}
              obj["hospitalId"] = this.$store.state.userInfoObj.hospitalId
              obj["resourceId"] = item.deptId
              obj["resourceType"] = '4'
              obj["groupId"] = this.groupIds.groupId
              arrys.push(obj)
            }
          })
          let param = []
          param.push({ 'groupId': this.groupIds.groupId })
          param.push(arrys)
          this.$store.dispatch('batchAddftzs', param).then(res => {
            this.rightKFLoading = false
            if (res.data.code !== 200) {
              util.showMsg(this, { diy: res.data.message })
            } else {
              util.showMsg(this, { succ: '新增成功' })
              this.wareHouseTabel(this.wareHouseGroup)
            }
          })
        }
      } else {
        //单个删除
        let arrs = []
        this.kfChecked.map(item => {
          const index = util.indexOfObject(item.deptId, val, 'deptId')
          if (index === -1) {
            arrs.push(item.deptId)
          }
        })
        let nowDatas = {
          groupId: this.groupIds.groupId,
          hospitalId: this.$store.state.userInfoObj.hospitalId,
          resourceIds: arrs.join(","),
          resourceType: '4'
        }
        this.$store.dispatch('sysUserResourceFztDeletes', nowDatas).then(res => {
          this.rightKFLoading = false
          if (res.data.code !== 200) {
            util.showMsg(this, { diy: res.data.message })
          } else {
            util.showMsg(this, { succ: '删除成功' })
            this.wareHouseTabel(this.wareHouseGroup)
          }
        })
      }
    },
    // 库房回显
    getkufCheckData (val) {
      this.rightKFLoading = true
      let nowData = {
        groupId: val.groupId,
        hospitalId: this.$store.state.userInfoObj.hospitalId,
        resourceType: '4'
      }
      this.$store.dispatch('getGroupResources', nowData).then(res => {
        if (res.data.code !== 200) {
          util.showMsg(this, { diy: res.data.message })
        } else {
          this.kfChecked = []
          this.datakf.forEach(element => {
            element._checked = false
          })
          res.data.data.list.map(item => {
            const index = util.indexOfObject(item.resourceId, this.datakf, 'deptId')
            if (index != -1) {
              this.kfChecked.push(this.datakf[index])
              this.datakf[index]._checked = true
              this.datakf.unshift(this.datakf[index]);
              this.datakf.splice(index + 1, 1);
            }
          })
        }
        this.rightKFLoading = false
      })
    },
    // 获取药房数据
    getkuFangTableAjax () {
      this.rightKFLoading = true
      let nowData = {
        enable: 1, //1为启用的药房 空是全部  0是未启用
        flag: 2,  // 1-药品仓库,2-药房,3-窗口
        searchPharm: this.wareHouseGroup
      }
      this.$store.dispatch('getStoragePhamDictTotle', nowData).then(res => {
        if (res.data.code === 200) {
          let resList = res.data.data.list
          resList.map(item => {
            item._checked = false
          })
          this.datakf = resList;
          this.datakfClon = resList;
        } else {
          util.showMsg(this, { diy: res.data.message })
        }
        this.rightKFLoading = false
      })
    },
  }
}

</script>
<style>
</style>