<template>
  <Row class="bg-whiteclass"
       id="Rows"
       style="width:100%;height:100%">
    <!-- 左侧数据 -->
    <i-Col span="13"
           id="leftTop"
           style="height:100%;border-right:1px solid #bbbec4;padding-right:10px">
      <!-- 条件搜索 -->
      <div style="width:100%;display:flex;justify-content:space-between;align-items:center;">
        <RadioGroup v-model="animal"
                    style="width:120px;display:flex;justify-content: flex-start;"
                    @on-change="getLeftTable">
          <Radio label="业务组"></Radio>
          <Radio label="用户"></Radio>
        </RadioGroup>
        <div>
          <Input v-model.trim="searchObj.inpts"
                 placeholder="请输入组名/个人名称或拼音码"
                 @on-change="getLeftTable"
                 style="width: 200px;margin-right:10px" />
          <Button type="primary"
                  @click="addOrEditor"><i class="iconfont icontianjia"></i>&#8194;新增</Button>
        </div>
      </div>
      <Table v-show="animal==='业务组'"
             :loading="zyzLoading"
             border
             highlight-row
             :height="tableHightLt"
             stripe
             :columns="columnsInforgroup"
             :data="dataInforgroup"
             @on-row-click="tableRowclick"
             style="margin-top:10px"></Table>
      <Table v-show="animal!='业务组'"
             :loading="zyzLoading"
             border
             highlight-row
             :height="tableHightUser"
             stripe
             :columns="columnsUser"
             :data="dataUser"
             @on-row-click="tableRowclick"
             style="margin-top:10px"></Table>
      <div v-show="animal==='业务组'"
           style="width:100%;display:flex;justify-content:space-between;align-items:center; border-top:1px solid #bbbec4;margin-top:10px">
        <div style="margin-top:10px">
          <span>科室</span>
          <Input v-model.trim="searchObj.deptName"
                 @on-change="leftBottomTable"
                 placeholder="请输入科室名称或拼音码"
                 style="width: 200px;margin-left:10px" />
        </div>
        <div style="margin-top:10px">
          <span>用户</span>
          <Input v-model.trim="searchObj.searchUser"
                 @on-change="leftBottomTable"
                 placeholder="请输入用户名称或拼音码"
                 style="width: 200px;margin-left:10px" />
        </div>
      </div>
      <Table v-show="animal==='业务组'"
             border
             ref="selection"
             :loading="leftyhLoading"
             :height="tableHightLt"
             stripe
             :columns="columnsgroupLetf"
             :data="datagroupLetf"
             @on-selection-change="leftBottomCheckcancleAll"
             @on-select-all="leftBottomCheckokAll"
             @on-row-click="leftBtaleClick"
             @on-select-cancel="leftBottomCheckcancle"
             @on-select="leftBottomCheckok"
             style="margin-top:10px"></Table>
    </i-Col>
    <!-- 右侧数据 -->
    <i-Col span="11"
           style="height:100%;padding-left:10px">
      <div style="width:100%;display:flex;justify-content:space-between;align-items:center;">
        <span style="font-size:14px;font-weight:bold">业务组权限</span>
        <div>
          <Input v-model.trim="searchObj.inpt"
                 placeholder="请输入业务名称"
                 @on-change="getBusinessDict"
                 style="width: 200px" />
        </div>
      </div>
      <Table border
             :height="tableHightRt"
             stripe
             :loading="rightLoading"
             :columns="columnsgroup"
             :data="datagroup"
             style="margin-top:10px"></Table>
    </i-Col>
    <!-- 新增/修改 -->
    <Modal v-model="changeModel"
           :closable="false"
           width="450px"
           :mask-closable="false">
      <div slot="footer">
        <Button type="text"
                size="large"
                @click="addOrUpdReset('formObj')">取消</Button>
        <Button type="primary"
                size="large"
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
                     @close="delModal=false" />
    <comfirmDeletion class="aBox"
                     :show="delModals"
                     :msg="delMsgs"
                     title='警告'
                     :btntext='delBtnTexts'
                     @ok="delMenuAjaxs"
                     @close="delModals=false" />
  </Row>
</template>
<script>
import util from '../../../../libs/util.js'
import Page from '../../../components/page.vue'
import comfirmDeletion from '../../../components/confirmDeletion.vue'
import longrangesearchselectElse from '../../../components/long-range-search-select-else'
import confirmDeletionVue from '../../../components/confirmDeletion.vue';
import Vue from 'vue';
export default {
  name: 'menu-poewrnew',
  components: { Page, comfirmDeletion, longrangesearchselectElse },
  data () {
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
    const validategroupName = (rule, value, callback) => {
      if (util.isEmpty(value)) {
        callback(new Error('名称不能为空'));
      } else {
        callback();
      }
    };
    return {
      animal: '业务组',
      searchObj: {
        deptName: '',   //左下的科室框搜索
        inpts: '',    //左下的input框搜索
        searchUser: '',   //左上用户搜索
        inpt: ''      //右侧的input框
      },
      zyzLoading: false,  //左上表格loading
      leftyhLoading: false,  //左下表格loading
      rightLoading: false,  //右侧表格loading
      // 表格高度
      tableHightLt: 300,
      tableHightRt: 500,
      tableHightUser: 500,
      // 左上用户表格
      columnsUser: [//资源组表头
        {
          title: '排序号',
          key: 'sortNo',
          align: 'center',
          width: 60
        }, {
          title: '组类型',
          key: 'groupType',
          align: 'center',
          render: (h, params) => {
            let val = params.row.groupType * 1 === 3 ? '业务组' : '用户'
            return h('div', {}, val)
          }
        }, {
          title: '业务组编码',
          key: 'groupCode',
          align: 'center',
        }, {
          title: '业务组名称',
          key: 'groupName',
          align: 'center',
        }, {
          title: '用户编码',
          key: 'personCode',
          align: 'center',
          width: 75
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
            let style
            style = {
              lineHeight: "1",
              cursor: "pointer",
              color: "#2db7f5",
              marginRight: '3px'
            }
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
                    style: style,
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
                    style: style,
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
      // 左上业务组表格
      columnsInforgroup: [//资源组表头
        {
          title: '排序号',
          key: 'sortNo',
          align: 'center',
          width: 60
        }, {
          title: '组类型',
          key: 'groupType',
          align: 'center',
          render: (h, params) => {
            let val = params.row.groupType * 1 === 3 ? '业务组' : '用户'
            return h('div', {}, val)
          }
        }, {
          title: '业务组编码',
          key: 'groupCode',
          align: 'center',
        }, {
          title: '业务组名称',
          key: 'groupName',
          align: 'center',
        }, {
          title: '操作',
          key: ' ',
          align: 'center',
          width: 100,
          render: (h, params) => {
            let style
            style = {
              lineHeight: "1",
              cursor: "pointer",
              color: "#2db7f5",
              marginRight: '3px'
            }
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
                    style: style,
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
                    style: style,
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
      // 左下表格
      columnsgroupLetf: [
        {
          type: 'selection',
          width: 60,
          align: 'center'
        }, {
          title: '科室名称',
          key: 'deptName',
          align: 'center',
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
      // 右侧表格
      columnsgroup: [
        {
          title: '业务名称',
          key: 'businessName',
          align: 'center',
        }, {
          title: '业务参数设置',
          align: 'center',
          render: (h, params) => {
            return h("RadioGroup",
              {
                props: {
                  value: !util.isEmpty(params.row.businessParam) ? (params.row.businessParam * 1 == 1 ? '可以' : '不可以') : ''
                },
                on: {
                  "on-change": (val) => {
                    val == '可以' ? params.row.businessParam = '1' : params.row.businessParam = '0'
                    this.rightselect(params.row, val);
                  }
                }
              },
              [
                h("Radio", {
                  style: {
                    display: "inline-block",
                    "font-size": "14px"
                  },
                  props: {
                    label: "可以",
                  }
                }),
                h("Radio", {
                  style: {
                    display: "inline-block",
                    "font-size": "14px"
                  },
                  props: {
                    label: "不可以",
                  }
                })
              ]);
          }
        }, {
          title: '操作',
          key: ' ',
          align: 'center',
          width: 100,
          render: (h, params) => {
            let style
            style = {
              lineHeight: "1",
              cursor: "pointer",
              color: "#2db7f5",
              marginRight: '3px'
            }
            return h('div',
              [h('Poptip',
                {
                  props: {
                    trigger: 'hover',
                    placement: 'top'
                  }
                },
                [
                  h('i', {
                    class: util.icon.xiangpc,
                    style: style,
                    on: {
                      click: () => {
                        this.delModals = true;
                        this.delMsgs = '确定要移除【' + params.row.businessName + '】吗？'
                        this.deleteData = params.row
                      }
                    }
                  }),
                  h(
                    'div',
                    {
                      slot: 'content'
                    },
                    '移除'
                  )
                ]
              )
              ]);
          }
        }
      ],
      deleteData: {},  //要删除的数据
      dataInforgroup: [],  //左上业务组表格的数据
      dataUser: [],   //左上用户表格的数据
      datagroup: [],   //右侧表格数据
      datagroupLetf: [],//左下表格的数据
      datagroupLetfFB: [],
      changeModel: false,  //弹框显示隐藏
      delModal: false,  //删除框显示隐藏
      delModals: false, //删除框显示隐藏
      delBtnText: '删除',  //删除框按钮
      delBtnTexts: '删除',
      delMsg: '',   //删除框内容
      delMsgs: '',
      loading: false,   //弹出框保存按钮loading
      formObj: {   //新增修改弹出框form
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
      ruleValidate: {     //弹出框规则
        groupName: [
          { required: true, validator: validategroupName, trigger: 'blur' }
        ],
        sortNo: [{ validator: validateAge, trigger: 'blur' }],
      },
      selectOptionsList: [],  //用户列表下拉list
      groupIds: null,      //选择左侧点击的数据
      groupNameslect: '',  //被选择的名称
      addOrUp: 1, //判断为新增或修改
      rightCheck: [],  //右侧表格数据回显
      selectOptionsPage: 1,  //用户名称列表加载页码
      selectSerachParam: '',
      spinShowDP: false,   //列表加载动画
      leftboCheckAll: [],   //左下表格数据回显
      leftboCheckAllstatus: false,
      objArr: []  //存放已有权限的id
    }
  },
  mounted () {
    this.tableHightLt = ($("#leftTop").height() - 205) / 2;
    this.tableHightUser = $("#leftTop").height() - 147;
    this.tableHightRt = $("#leftTop").height() - 144;
    this.getLeftTable();
    this.getBusinessDict();
  },
  watch: {
    'changeModel': function (val) {  //监听弹框事件
      if (!val) {
        this.groupNameslect = ''
        this.selectSerachParam = ''
      }
    },
    'delModal': function (val) {  //删除弹框事件
      !val ? this.formObj.groupId = null : ''
    },
    'delModals': function (val) {//删除弹框事件
      !val ? this.deleteData = {} : ''
    },
  },
  methods: {
    getLeftTable () {// 获取左上表格
      this.getBusinessDict();
      let nowData = {
        groupType: this.animal === '业务组' ? 3 : 4,
        searchParam: this.searchObj.inpts,
        resourceType: 10
      }
      this.zyzLoading = true
      this.$store.dispatch('getSysResourceGroups', nowData).then(res => {
        this.zyzLoading = false
        if (res.data.code !== 200) {
          util.showMsg(this, { diy: res.data.message })
        } else {
          if (this.animal === '业务组') {
            this.dataInforgroup = res.data.data.list
            this.dataInforgroup.sort(this.compare('sortNo'))
            this.leftBottomTable();
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
    leftBottomTable () {//获取左下表格
      let data = {
        searchUser: this.searchObj.searchUser,
        searchDept: this.searchObj.deptName,
        hospitalId: this.$store.state.userInfoObj.hospitalId
      }
      this.leftyhLoading = true
      this.$store.dispatch('getAllUsers', data).then(res => {
        this.leftyhLoading = false
        if (res.data.code === 200) {
          this.datagroupLetf = res.data.data.list
          this.datagroupLetfFB = res.data.data.list
          if (!util.isEmpty(this.groupIds)) {
            this.leftBottomCheckData(this.groupIds)
          }
        }
      })
    },
    getSelectOptionsFun () {    //查询用户名称下拉列表
      this.spinShowDP = true;
      let data = {
        'searchUser': this.selectSerachParam,
        'page': this.selectOptionsPage,
        'size': 6,
        hospitalId: this.$store.state.userInfoObj.hospitalId
      }
      this.$store.dispatch('getAllUsers', data).then(res => {
        if (res.data.code === 200) {
          this.selectOptionsList = this.selectOptionsList.concat(res.data.data.list)
          this.spinShowDP = false
        } else {
          util.showMsg(this, { diy: res.data.message })
        }
      })
    },
    selectObject (val) {  //用户名称列表
      this.formObj.personCode = val.personCode
      this.formObj.deptName = val.deptName
      this.groupNameslect = val.userName
      this.selectSerachParam = val.label
      this.formObj.groupName = val.userId
    },
    tableRowclick (val) {    // 获取权限
      this.zyzLoading = true
      this.groupIds = val;
      this.listChang = true;
      this.animal === '业务组' ? this.leftBottomCheckData(val) : '';
      this.rightCheckData(val);
    },
    getBusinessDict () {    // 获取右侧表格数据
      this.rightLoading = true
      let nowData = {
        hospitalId: this.$store.state.userInfoObj.hospitalId,
        searchParam: this.searchObj.inpt
      }
      this.$store.dispatch('getBusinessDictSs', nowData).then(res => {
        this.rightLoading = false
        if (res.data.code !== 200) {
          util.showMsg(this, { diy: res.data.message })
        } else {
          this.datagroup = res.data.data.list
          if (!util.isEmpty(this.groupIds)) {
            this.rightCheckData(this.groupIds)
          }
        }
      })
    },
    leftBottomCheckData (val) {    // 左下表格回显
      this.leftyhLoading = true
      //  对应方法  一  更改datagroupLetf._checked 属性 渲染列表数据
      //this.datagroupLetf = this.datagroupLetfFB;
      //  对应方法  二  更改datagroupLetf._checked 属性 渲染列表数据  深拷贝改变数据指针 更新 this.datagroupLetf
      this.datagroupLetf = JSON.parse(JSON.stringify(this.datagroupLetfFB));
      let params = {
        hospitalId: this.$store.state.userInfoObj.hospitalId,
        groupId: val.groupId
      }
      this.$store.dispatch('getSysGroupMenuList', params).then(res => {
        this.leftyhLoading = false
        if (res.data.code !== 200) {
          util.showMsg(this, { diy: res.data.message })
        } else {
          this.leftboCheck = []
          this.leftboCheckAll = []
          //  对应方法  一
          // if (res.data.data.list < 1) {
          //   this.datagroupLetf.map((item, index) => {
          //     Vue.delete(this.datagroupLetf[index],"_checked")
          //   })
          // }
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
    leftBtaleClick (val, index) {    //点击左下表格
      this.$refs.selection.toggleSelect(index);
    },
    leftBottomCheckcancleAll (val) {    // 左下表格单击取消全部选中
      if (util.isEmpty(this.groupIds)) {
        util.showMsg(this, { warning: '请选择资源组或用户' })
        return
      }
      if (!this.leftboCheckAllstatus && this.datagroupLetf.length === 1 && this.leftboCheck.length === 1 && val.length === 0) {
        this.leftboCheckAllstatus = true
        this.leftBottomCheckcancle(val)
        return
      } else if (this.datagroupLetf.length === this.leftboCheck.length && this.datagroupLetf.length >= 1 && val.length === 0) {
        this.leftyhLoading = true
        let nowData = {
          groupId: this.groupIds.groupId,
        }
        this.$store.dispatch('sysGroupMenuDeleteByUserIds', nowData).then(res => {
          this.leftyhLoading = false
          if (res.data.code !== 200) {
            util.showMsg(this, { diy: res.data.message })
          } else {
            util.showMsg(this, { succ: '取消成功' });
            this.leftBottomCheckData(this.groupIds)
          }
        })
      }
    },
    leftBottomCheckok (val) {    // 左下表格单击选中
      if (util.isEmpty(this.groupIds)) {
        util.showMsg(this, { warning: '请选择业务组或用户' })
        return
      }
      this.leftyhLoading = true
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
        this.leftyhLoading = false
        if (res.data.code !== 200) {
          util.showMsg(this, { diy: res.data.message })
        } else {
          util.showMsg(this, { succ: '新增成功' });
          this.leftBottomCheckData(this.groupIds)
        }
      })
    },
    rightCheckData (val) {    // 右侧表格回显
      this.rightLoading = true
      let nowData = {
        groupId: val.groupId,
        hospitalId: this.$store.state.userInfoObj.hospitalId,
        resourceType: '10'
      }
      this.$store.dispatch('getGroupResources', nowData).then(res => {
        this.rightLoading = false
        if (res.data.code !== 200) {
          util.showMsg(this, { diy: res.data.message })
        } else {
          this.rightCheck = []
          this.datagroup.forEach(element => {
            element.businessParam = ''
          });
          this.objArr = []
          res.data.data.list.map(item => {
            this.objArr.push(item.resourceId)
            const index = util.indexOfObject(item.resourceId, this.datagroup, 'businessId')
            if (index != -1) {
              this.rightCheck.push(item)
              this.datagroup[index].businessParam = item.businessParam
              this.datagroup[index].userresId = item.userresId
              this.datagroup[index].dataVersion = item.dataVersion
            }
          })
        }
        this.zyzLoading = false
      })
    },
    rightselect (listVal, val) {    // 判断右侧表格修改状态取消/新增
      console.log(this.groupIds, 22)
      if (util.isEmpty(this.groupIds)) {
        util.showMsg(this, { warning: '请选择业务组组或用户' })
        return
      }
      const index = util.indexOfObject(listVal.businessId, this.rightCheck, 'resourceId')
      this.rightLoading = true
      if (index != -1) {
        this.rightselectCance(listVal, this.rightCheck[index])
        return
      } else {
        this.rightselectAdd(listVal, this.rightCheck[index])
        return
      }
    },
    rightselectCance (listVal, val) {    // 右侧表格修改
      const obj = {}
      obj["businessParam"] = listVal.businessParam
      obj["hospitalId"] = this.$store.state.userInfoObj.hospitalId
      obj["resourceId"] = listVal.businessId
      obj["userresId"] = val.userresId
      obj["dataVersion"] = listVal.dataVersion
      obj["resourceType"] = '10'
      obj["userId"] = this.groupIds.groupId
      this.$store.dispatch('batchupdates', obj).then(res => {
        this.rightLoading = false
        if (res.data.code !== 200) {
          util.showMsg(this, { diy: res.data.message })
        } else {
          util.showMsg(this, { succ: '修改成功' })
        }
        this.rightCheckData(this.groupIds)
      })
      return
    },
    rightselectAdd (listVal, val) {// 右侧表格新增
      let arrs = []
      let param = []
      const obj = {}
      obj["businessParam"] = listVal.businessParam
      obj["hospitalId"] = this.$store.state.userInfoObj.hospitalId
      obj["resourceId"] = listVal.businessId
      obj["resourceType"] = '10'
      obj["groupId"] = this.groupIds.groupId
      arrs.push(obj)
      param.push({ 'groupId': this.groupIds.groupId })
      param.push(arrs)
      this.$store.dispatch('batchAddftzs', param).then(res => {
        this.rightLoading = false
        if (res.data.code !== 200) {
          util.showMsg(this, { diy: res.data.message })
        } else {
          util.showMsg(this, { succ: '修改成功' })
        }
        this.rightCheckData(this.groupIds)
      })
      return
    },
    leftBottomCheckcancle (val) {    // 左下表格单击取消选中
      this.leftyhLoading = true
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
        this.leftyhLoading = false
        if (res.data.code !== 200) {
          util.showMsg(this, { diy: res.data.message })
        } else {
          util.showMsg(this, { succ: '取消成功' });
        }
        this.leftBottomCheckData(this.groupIds)
      })
    },
    leftBottomCheckokAll (val) {// 左下表格单击全选
      if (util.isEmpty(this.groupIds)) {
        util.showMsg(this, { warning: '请选择资源组或用户' })
        return
      }
      this.leftyhLoading = true
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
        this.leftyhLoading = false
        if (res.data.code !== 200) {
          util.showMsg(this, { diy: res.data.message })
        } else {
          util.showMsg(this, { succ: '新增成功' });
        }
        this.leftBottomCheckData(this.groupIds)
      })
    },
    addOrEditor () {  //新增
      this.changeModel = true;
      this.addOrUp = 1;
      this.formObj.groupType = this.animal;
    },
    addOrUpdReset (name) { //弹框的取消事件
      this.$refs[name].resetFields();
      this.changeModel = false;
      this.groupNameslect = ''
    },
    upBtn (val) {    //修改按钮
      this.formObj.sortNo = val.sortNo;
      this.formObj.groupType = this.animal;
      this.formObj.groupId = val.groupId;
      this.formObj.wbCode = val.wbCode;
      this.formObj.pyCode = val.pyCode;
      this.formObj.dataVersion = val.dataVersion;
      if (this.animal === '业务组') {
        this.formObj.groupName = val.groupName;
      } else {
        this.groupNameslect = val.groupName
        this.selectSerachParam = val.groupName
        this.formObj.personCode = val.personCode;
        this.formObj.groupCode = val.groupCode;
        this.formObj.deptName = val.deptName
        this.datagroupLetfFB.map(item => {
          if (item.userName === val.groupName) {
            this.formObj.groupName = item.userId
          }
        })
      }
    },
    addOrUpdFc (name) { // 新增保存
      this.$refs[name].validate((valid) => {
        if (valid) {
          this.zyzLoading = true
          this.loading = true
          let nowData = {
            hospitalId: this.$store.state.userInfoObj.hospitalId,
            groupType: this.animal == '业务组' ? '3' : '4',
            groupId: this.addOrUp == 2 ? this.formObj.groupId : undefined,
            groupName: this.animal == '业务组' ? this.formObj.groupName : this.groupNameslect,
            stopFlag: '0',
            sortNo: this.formObj.sortNo,
            pyCode: this.formObj.pyCode,
            wbCode: this.formObj.wbCode,
            dataVersion: this.addOrUp == 2 ? this.formObj.dataVersion : undefined,
            personCode: this.animal == '业务组' ? undefined : this.formObj.groupName,
            resourceType: 10
          }
          if (this.addOrUp === 1) {
            this.$store.dispatch('addGroupSs', nowData).then(res => {
              if (res.data.code === 200) {
                util.showMsg(this, { succ: '新增成功' });
                this.changeModel = false;
                this.getLeftTable();
                this.groupNameslect = ''
                this.$refs[name].resetFields();
              } else {
                util.showMsg(this, { diy: res.data.message })
              }
              this.zyzLoading = false
              this.loading = false
            })
          } else if (this.addOrUp === 2) {
            this.$store.dispatch('updateGroupSs', nowData).then(res => {
              if (res.data.code === 200) {
                util.showMsg(this, { succ: '修改成功' });
                this.changeModel = false;
                this.getLeftTable();
                this.$refs[name].resetFields();
                this.groupNameslect = ''
                this.formObj.dataVersion = null
              } else {
                util.showMsg(this, { diy: res.data.message })
              }
              this.zyzLoading = false
              this.loading = false
            })
          }
        }
      })
    },
    // 删除
    delMenuAjax (val) {
      if (this.animal === '业务组' && this.leftboCheck.length != 0) {
        util.showMsg(this, { warning: '有组成员的不可删除！' });
        return
      }
      let nowData = {
        groupId: this.formObj.groupId,
        resourceType: 10
      }
      this.$store.dispatch('deleteGroupSs', nowData).then(res => {
        this.delModal = false;
        if (res.data.code === 200) {
          util.showMsg(this, { succ: '删除成功' });
          this.getLeftTable();
          this.$refs['formObj'].resetFields();
          this.formObj.groupId = null
        } else {
          util.showMsg(this, { diy: res.data.message })
        }
      })
    },
    // 移除删除
    delMenuAjaxs (val) {
      if (this.objArr.indexOf(this.deleteData.businessId) == -1) {
        util.showMsg(this, { warning: '用户没有业务权限,不能移除！' });
        this.delModals = false
        return
      }
      let nowData = {
        groupId: this.groupIds.groupId,
        hospitalId: this.$store.state.userInfoObj.hospitalId,
        resourceIds: this.deleteData.businessId,
        resourceType: '10'
      }
      this.$store.dispatch('sysUserResourceFztDeletes', nowData).then(res => {
        this.delModals = false
        if (res.data.code !== 200) {
          util.showMsg(this, { diy: res.data.message })
        } else {
          util.showMsg(this, { succ: '删除成功' });
          this.getBusinessDict()
        }
      })
    },
    compare (property) {    //排序
      return function (a, b) {
        var value1 = a[property];
        var value2 = b[property];
        return value1 - value2;
      }
    },
  }
}
</script>
<style>
</style>
<style lang="less" scoped>
@import "../../../../styles/common.less";
.bg-whiteclass {
  padding: 13px 17px 0;
  background: #fff;
  height: 100%;
}
.leftMargin {
  margin-left: 10px;
}
.leftMargin ::-webkit-scrollbar {
  width: 6px !important;
}
.leftMargin ::-webkit-scrollbar-track {
  background-color: #f5f7f9;
}
.leftMargin ::-webkit-scrollbar-thumb {
  background-color: #ccc !important;
  border-radius: 3px !important;
}
</style>