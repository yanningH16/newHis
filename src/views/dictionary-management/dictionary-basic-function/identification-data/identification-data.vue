<template>
  <Row style="padding: 13px 17px 0;background: #fff;width:100%">
    <i-Col span="4"
           style="width:27%"
           class="ry-left-tree">
      <i-Col span="24"
             style="margin-bottom:13px;"
             v-show="btnstatus">
        <i-Col span="8">
          <Button type="primary"
                  @click="addNewTree">
            <i class="iconfont icontianjia"></i>&#8194;新增</Button>
        </i-Col>
        <i-Col span="8">
          <Button type="primary"
                  @click="editTree">
            <i class="iconfont iconxiugai1"></i>&#8194;修改</Button>
        </i-Col>
        <i-Col span="8">
          <Button type="primary"
                  @click="delTree">
            <i class="iconfont iconshanchu"></i>&#8194;删除</Button>
        </i-Col>
      </i-Col>
      <Select v-model="searchVal"
              style="width: 90%;margin: 5px 0 3px 0;"
              :remote-method="remoteMethod"
              @on-change="search"
              placeholder="请输入标识数据名称"
              filterable
              remote
              @on-clear="delQuery"
              :loading="vShow.loading"
              clearable>
        <Option v-for="item in vShow.options"
                :value="item.nodeName"
                :key="item.nodeId">{{ item.nodeName }}</Option>
      </Select>
      <div class="department-tree"
           :style="{'height':tableHeight+'px'}">
        <Tree ref="departmentTree"
              class="departmentTree"
              :data="treeData"
              @on-select-change="clickTreeItem"></Tree>
      </div>
    </i-Col>
    <i-Col span="18"
           class="ry-right-tree-26"
           style="width:73%">
      <div span="5"
           class="ry-right-tree-26-title">

        <div class="ry-right-tree-26-title-span">
          <span> 标识数据名称:
            <span>{{formValidate.nodeName}}</span>
          </span>

          <span style='margin-left:20px'> 标识数据列表:
            <span>{{formValidate.flagdataCode}}</span>
          </span>

        </div>
        <Button v-show="btnstatus"
                type="primary"
                @click="addNewFlag">
          <i class="iconfont icontianjia"></i>&#8194;新增</Button>
      </div>
      <Row span="10"
           class="department-table">
        <div ref="tab"
             class="tab">
          <Table disabled-hover
                 v-if="btnstatus"
                 highlight-row
                 :height="tableHeight"
                 ref="table"
                 border
                 :data="table.data"
                 :columns="table.columns"
                 stripe
                 style="border-right: none;border-bottom: none;"></Table>

          <Table disabled-hover
                 v-if="!btnstatus"
                 highlight-row
                 :height="tableHeight"
                 ref="table"
                 border
                 :data="table.data"
                 :columns="table.columnstwo"
                 stripe
                 style="border-right: none;border-bottom: none;"></Table>
          <div style="margin-top:15px;"
               class="fr">
            <Page @Page="changPage"
                  :tabpage="pages.tabPage"
                  @pageNum="changPageNum"></Page>
          </div>
        </div>

      </Row>
    </i-Col>
    <!-- 树新增/修改节点数据-start -->
    <Modal v-model="showModal.addTableShow"
           :mask-closable="false"
           :closable="false"
           class="tableShowModal">
      <Form ref="formValidate"
            :model="formValidate"
            :rules="ruleValidate"
            :label-width="140"
            class="addTable">
        <div v-if='treeItem.nodeId'>
          <FormItem label="子级类型"
                    prop="subtype"
                    style="width:50%;">
            <RadioGroup v-model="subtype"
                        style="display:flex;margin-top: 5px;"
                        @on-change="changeSubtype">
              <Radio label="目录"
                     :disabled='isShow_1'></Radio>
              <Radio label="字典"
                     :disabled='isShow_1'></Radio>
            </RadioGroup>
          </FormItem>
        </div>
        <FormItem prop="nodeName"
                  label="标识数据类别名称">
          <i-Input v-model.trim="formValidate.nodeName"
                   style="width: 348px"></i-Input>
        </FormItem>
        <FormItem prop="flagdataCode"
                  label="标识数据标准代码"
                  v-if='isShow_1&&isAddNode'>
          <i-Input disabled
                   v-model.trim="formValidate.flagdataCode"
                   style="width: 348px"></i-Input>
        </FormItem>
        <FormItem prop="identificationFlag"
                  label="标识数据依据标准"
                  v-if='isAddNode'>
          <Select style="width: 348px"
                  v-model.trim="formValidate.identificationFlag">
            <Option v-for="item in selecteds.identificationFlagList"
                    :key="item.flagdataValue"
                    :value="item.flagdataValue">{{item.flagdataValueRemark}}</Option>
          </Select>
        </FormItem>
        <FormItem prop="nodeSortId"
                  label="排序号">
          <Input v-model="formValidate.nodeSortId"
                 id="menuSort"
                 :maxlength="6"
                 style="width: 348px" />
        </FormItem>
        <FormItem prop="nodeRemark"
                  label="备注"
                  v-if='isAddMulu'>
          <i-Input type="textarea"
                   :autosize="{minRows: 2,maxRows: 21}"
                   v-model.trim="formValidate.nodeRemark"
                   style="width: 348px"></i-Input>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button type="text"
                @click.native="cancel">取消</Button>
        <Button type="primary"
                :loading="loadadd"
                @click.native="addOrModify">保存</Button>
      </div>
    </Modal>

    <!-- 新增/修改(标识数据)  这个是右边的内容的判断 -->
    <Modal v-model="showModal.addflagShow"
           :mask-closable="false"
           :closable="false"
           class="addrightClass"
           width="490px">
      <div slot="footer">
        <Button type="text"
                @click="cancelflag">取消</Button>
        <Button type="primary"
                :loading="loadedit"
                @click="flagAddOrModify">确定</Button>
      </div>
      <Form ref="form"
            :model="form"
            :rules="rules"
            :label-width="110">
        <FormItem label="标识数据值"
                  prop="flagdataValue">
          <i-Input v-model.trim="form.flagdataValue"
                   placeholder="请输入标识数据值..."
                   style="width: 348px"></i-Input>
        </FormItem>
        <FormItem label="标识数据说明"
                  prop="flagdataValueRemark">
          <i-Input v-model.trim="form.flagdataValueRemark"
                   placeholder="请输入标识数据说明..."
                   style="width: 348px"></i-Input>
        </FormItem>
        <FormItem label="排序号"
                  prop="serialNumber">
          <InputNumber :min="0"
                       v-model="form.serialNumber"
                       style="width: 348px"></InputNumber>
        </FormItem>
      </Form>
    </Modal>

    <!-- 新增/修改(标识数据)end -->
    <!-- 标识数据表格删除确认-start -->
    <confirmDeletion :show="showModal.showDelFlag"
                     :msg="showModal.delFlagMsg"
                     title='删除确认'
                     btntext='确认删除'
                     @ok="delOk"
                     @close="showModal.showDelFlag=false" />
    <!-- 标识数据树状图删除确认-end -->
    <confirmDeletion :show="showModal.delShow"
                     :msg="showModal.delMsg"
                     title="删除确认"
                     :btntext="showModal.delBtnText"
                     @ok="delTreeOk"
                     @close="showModal.delShow = false"
                     @cancel="delTreeCancel"></confirmDeletion>
  </Row>
</template>

<script>
import util from '../../../../libs/util';
import qs from 'qs';
import confirmDeletion from '../../../components/confirmDeletion.vue';
import Page from '../../../components/page1.vue';

export default {
  components: { confirmDeletion, Page },
  name: 'identification-data',
  data () {
    const validateAge = (rule, value, callback) => {
      if (!Number.isInteger(value * 1) && !util.isEmpty(value)) {
        callback(new Error('序号只能为整数字'));
      } else if (value * 1 <= 0 && !util.isEmpty(value)) {
        callback(new Error('序号必须大于0'));
      } else if (util.isEmpty(value)) {
        if (!this.statusTj) {
          callback(new Error('序号不能为空'));
        } else {
          callback();
        }
      } else {
        callback();
      }
    };
    return {
      loadedit: false,
      loadadd: false, //新增保存
      isAddNode: false,
      isAddMulu: true,
      loading: false,
      tableHeight: 0,
      isShow: false,
      isShow_1: false,
      statusTj: false,
      IsAdd: false,
      //下拉树相关数据集合
      selecteds: {
        flagdataList: [],  //获取字典列表
        directoryList: [], //获取目录列表
        identificationFlagList: []  //树新增-字典-标识数据依据标准
      },
      vShow: {
        loading: false,//下拉菜单加载
        options: [],//下拉菜单备选项
      },
      flagStatusTj: false,  //添加或修改标识数据用
      page: 1,
      tabPage: 1,
      pages: {
        page: 1,
        tabPage: 1,
        pageSelf: 1,
        pageSize: 15
      },
      treeData: [],
      searchVal: '',  //远程搜索内容
      form: { //右侧表格
        dataVersion: null,
        flagdataId: null,      //父节点ID
        flagdatavalueId: null, //值ID
        flagdataValue: null,   //新增标识数据名称
        flagdataValueRemark: null,  //新增标识数据说明
        serialNumber: 0      //序号
      },
      rules: {
        flagdataValue: [
          { required: true, message: '标识数据值不能为空', trigger: 'blur' }
        ],
        flagdataValueRemark: [
          { required: true, message: '标识数据说明不能为空', trigger: 'blur' }
        ]
      },
      table: {
        columns: [
          {
            title: '标识数据值',
            key: 'flagdataValue',
          },
          {
            title: '标识数据说明',
            key: 'flagdataValueRemark',
            width: 300
          },
          {
            title: '排序号',
            align: 'left',
            key: 'serialNumber',
            width: 150
          },
          {
            title: '操作',
            key: 'opration',
            align: 'center',
            width: 120,
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
                      class: util.icon.modify,
                      style: {
                        marginRight: '16px',
                        verticalAlign: 'middle',
                        fontSize: '18px'
                      },
                      on: {
                        click: () => {
                          this.handleEdit(params);
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
                      class: util.icon.delete,
                      style: {
                        verticalAlign: 'middle',
                        fontSize: '18px'
                      },
                      on: {
                        click: () => {
                          this.delFlagItem(params.index);
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
        columnstwo: [
          {
            title: '标识数据值',
            key: 'flagdataValue',
          },
          {
            title: '标识数据说明',
            key: 'flagdataValueRemark',
            width: 300
          },
          {
            title: '排序号',
            align: 'left',
            key: 'serialNumber',
            width: 150
          }
        ],
        data: [],  //表格数据集合
        curIndex: -1
      },
      treeItem: {},
      //控制对话框
      showModal: {
        delShow: false,
        addTableShow: false,
        addflagShow: false,
        delMsg: '',
        delBtnText: '确认删除',
        showDelFlag: false,
        delFlagMsg: ''
      },
      subtype: '目录',
      formValidate: {
        nodeRemark: '',
        nodeSortId: 0,
        nodeName: '',
        flagdataCode: '',
        nodeName: '',
        identificationFlag: '' //结束
      },
      clickValue: [],
      ruleValidate: {
        nodeSortId: [{ validator: validateAge, trigger: 'blur' }],
        nodeName: [
          {
            required: true,
            message: '标识数据类别名称不能为空',
            trigger: 'blur'
          }
        ],
        identificationFlag: [
          {
            required: true,
            message: '标识数据依据标准不能为空',
            trigger: 'blur'
          }
        ]
      },
      btnstatus: false  //控制是否有超级管理员增删改权限
    };
  },
  mounted () {
    // 设置表格高度 
    this.tableHeight = this.$refs.tab.offsetHeight - 30;
    if (this.$store.state.userInfoObj.loginName != 'SUPERADMIN') {
      this.btnstatus = false
    } else {
      this.btnstatus = true
    }
  },
  created () {
    this.init();
    this.fetchTreeDetail();
  },
  watch: {
    'pages.page': function (val) {
      this.pages.pageSelf = val;
      this.getSysFlagVal(this.treeItem.flagdataId); //查询一下
    }
  },
  methods: {
    delQuery () {
      this.getSysDirectoryAjax()
    },
    //树下拉菜单里的远程搜索
    remoteMethod (query) {
      if (query !== '') {
        this.vShow.loading = true;
        setTimeout(() => {
          this.vShow.loading = false;
          const list = this.selecteds.directoryList.map(item => {
            return {
              nodeId: item.nodeId,
              nodeName: item.nodeName,
              pyCodeLower: util.isEmpty(item.pyCode) ? '' : item.pyCode.toLowerCase(),
              pyCodeUpper: util.isEmpty(item.pyCode) ? '' : item.pyCode.toUpperCase(),
              wbCode: util.isEmpty(item.wbCode) ? '' : item.wbCode,
            };
          });
          this.vShow.options = util.findKeys(query, list, ['nodeName', 'pyCodeLower', 'pyCodeUpper', 'wbCode'])
        }, 200);

      } else {
        this.vShow.options = this.selecteds.directoryList;
      }
    },
    //获取字典下拉
    fetchTreeDetail () {
      this.vShow.loading = true;
      this.$store.dispatch('getSysFlagData').then(res => {
        if (res.data.code === 200) {
          this.selecteds.flagdataList = res.data.data.list;
          console.log(111111111, this.selecteds.flagdataList.filter((item, index) => item.flagdataName === 'jiedian'))
          this.getSysDirectoryAjax()
        } else {
          util.showMsg(this, { diy: res.data.message })
        }
      })
    },
    //对字典数据进行排序
    compare (property) {
      return function (a, b) {
        var value1 = a[property];
        var value2 = b[property];
        return value1 - value2;
      }
    },
    //获取目录 并从新组合字典
    getSysDirectoryAjax () {
      let data = {
        dirId: 3
      }
      this.$store.dispatch('getSysDirectory', data).then(res => {
        if (res.data.code === 200) {
          let restlist = [];
          res.data.data.list.map(vals => {
            !util.isEmpty(vals.nodeName) ? restlist.push(vals) : ''
          })
          this.selecteds.directoryList = restlist;
          this.vShow.loading = false
          let ai = 999999
          let nowFlag = 0
          this.selecteds.directoryList.map((dval, di) => {
            this.selecteds.flagdataList.map((fval, fi) => {
              if (dval.nodeId == fval.nodeId && !util.isEmpty(dval.nodeName)) {
                this.selecteds.directoryList.push({
                  'nodeName': fval.flagdataName,
                  'nodeId': ai++,
                  'parentNodeId': dval.nodeId,
                  'dataVersion': fval.dataVersion,
                  'hospitalId': fval.hospitalId,
                  'flagdataId': fval.flagdataId,
                  'sortNo': fval.sortNo,
                  'flagdataCode': fval.flagdataCode,
                  'identificationFlag': fval.identificationFlag,
                  'pyCode': fval.pyCode,
                  'wbCode': fval.wbCode,
                })
                this.selecteds.directoryList.sort(this.compare('sortNo'))
              }
              if (fval.nodeId == 0 && nowFlag == 0) {
                this.selecteds.directoryList.push({
                  'nodeName': fval.flagdataName,
                  'nodeId': ai++,
                  'sortNo': fval.sortNo,
                  'parentNodeId': 0,
                  'dataVersion': fval.dataVersion,
                  'hospitalId': fval.hospitalId,
                  'flagdataId': fval.flagdataId,
                  'flagdataCode': fval.flagdataCode,
                  'identificationFlag': fval.identificationFlag,
                  'pyCode': fval.pyCode,
                  'wbCode': fval.wbCode,
                })
                this.selecteds.directoryList.sort(this.compare('sortNo'))
              }
            })
            nowFlag++
          })
          this.selecteds.directoryList.sort(this.compare('nodeSortId'))
          this.treeData = util.getTree(this.selecteds.directoryList, 'nodeId', 'nodeName', 'parentNodeId', '标识数据类别', 0)[0].children;
          this.vShow.options = this.selecteds.directoryList;
        } else {
          util.showMsg(this, { diy: res.data.message })
        }
      })
    },
    //点击树的数据来源start 
    getSysFlagVal (id) {
      if (util.isEmpty(id)) return
      this.table.data = []
      let data = {
        page: this.pages.pageSelf,
        size: this.pages.pageSize,
        flagdataId: id
      }
      this.loadadd = true;
      this.$store.dispatch("getSysFlagVal", data).then(res => {
        this.loadadd = false
        if (res.data.code !== 200) {
          util.showMsg(this, { diy: res.data.message })
        } else {
          this.table.data = res.data.data.list;
          this.pages.tabPage = res.data.data.pages;//获取分页总量
        }
      })
    },
    init () {
      //获取标识数据依据标准
      this.$store.dispatch('getFDAttr', { 'flagdataCode': 'FD000001' }).then(res => {
        if (res.data.code !== 200) {
          util.showMsg(this, { diy: res.data.message })
        } else {
          //树新增-字典-标识数据依据标准
          this.selecteds.identificationFlagList = res.data.data;   //注意数据所在位置   
        }
      })
    },
    //左侧树删除
    delTree () {
      let sel = this.$refs['departmentTree'].getSelectedNodes();
      if (util.isEmpty(sel)) {
        util.showMsg(this, { warning: '请选择需要删除的数据！' });
        return; // 未选中
      }
      if (!util.isEmpty(this.table.data) || !util.isEmpty(sel[0].children)) {
        util.showMsg(this, { warning: '请先清除完子级才能删除!' });
        return;
      }
      if (util.isEmpty(this.treeItem.flagdataId)) {
        this.showModal.delMsg = '确定要删除' + '【' + this.clickValue[0].data.nodeName + '】主目录吗？';
      } else {
        this.showModal.delMsg = '确定要删除' + '【' + this.clickValue[0].data.nodeName + '】吗？';
      }
      this.showModal.delShow = true;
    },
    //树删除确认
    delTreeOk () {
      if (util.isEmpty(this.treeItem.flagdataId)) {  //父节点的删除
        this.$store.dispatch('delSysDirectory', { id: this.treeItem.nodeId }).then(res => {
          util.isEmpty(this, res.data)
          if (res.data.code === 200) {
            this.showModal.delShow = false;
            util.showMsg(this, { succ: '删除成功' });
            this.fetchTreeDetail();
            this.clearData()
          } else {
            util.showMsg(this, { diy: res.data.message })
          }
        })
      } else {//子节点的删除
        this.$store.dispatch("delSysFlagData", { id: this.treeItem.flagdataId }).then(res => {
          util.isEmpty(this, res.data)
          if (res.data.code === 200) {
            this.showModal.delShow = false;
            util.showMsg(this, { succ: '删除成功' });
            this.fetchTreeDetail();
            this.clearData()
          } else {
            util.showMsg(this, { diy: res.data.message })
          }
        })
      }
    },
    delTreeCancel () {
      this.showModal.delShow = false;
    },
    //点击树状图每一项  
    clickTreeItem (item) {
      if (item.length > 0) {
        this.clickValue = item;
        this.treeItem = item[0].data;
        this.formValidate.flagdataCode = item[0].data.flagdataCode
        this.formValidate.nodeName = item[0].data.nodeName
        this.getSysFlagVal(item[0].data.flagdataId || item[0].data.nodeId);
      } else {
        this.clearData()
      }

    },
    //写一个清空的方法
    clearData () {
      this.treeItem = {}
      this.table.data = []
      this.formValidate = {}
    },
    //管理员表格修改功能
    handleEdit (val) {
      this.$refs['form'].resetFields();
      this.showModal.addflagShow = true;
      this.flagStatusTj = false;
      this.form = util.deepCopy(val.row);
      this.table.curIndex = val.index;  //删除的时候可能需要
    },
    //管理员表格新增功能
    addNewFlag () {
      let sel = this.$refs['departmentTree'].getSelectedNodes();
      if (util.isEmpty(sel)) {
        util.showMsg(this, { warning: '请选择要添加数据的节点！' });
        return; // 未选中
      }
      if (util.isEmpty(this.treeItem.flagdataId)) {
        util.showMsg(this, { warning: '不能选择主数据目录添加数据！' });
        return;
      }
      this.$refs['form'].resetFields();   //清除红框
      this.showModal.addflagShow = true;
      this.flagStatusTj = true;
      if (this.flagStatusTj) {
        //新增时先清空数据
        let flagObjAdd = {
          'dataVersion': '',
          'flagdataId': '',
          'flagdatavalueId': '',
          'serialNumber': 0,
          'flagdataValue': '',
          'flagdataValueRemark': ''
        };
        this.form = flagObjAdd;
      }
    },
    //管理员表格删除功能
    delFlagItem (index) {
      this.showModal.showDelFlag = true;
      this.table.curIndex = index;
      this.showModal.delFlagMsg = '确定要删除【' + this.table.data[index].flagdataValueRemark + '】吗？';
    },
    //管理员表格删除确认功能
    delOk () {
      let data = {
        "id": this.table.data[this.table.curIndex].flagdatavalueId
      }
      this.$store.dispatch("delSysFlagVal", qs.stringify(data)).then(res => {
        if (res.data.code !== 200) {
          util.showMsg(this, { diy: res.data.message })
        } else {
          this.showModal.showDelFlag = false;
          util.showMsg(this, { succ: '删除成功' });
          this.getSysFlagVal(this.treeItem.flagdataId);
        }
      }).catch(err => {
        util.showErrMsg(this, res);
      });
    },
    //树状图新增根据切换 目录/字典  重置各自表单
    changeSubtype (val) {
      if (val === '目录') {
        this.isAddMulu = true
        this.isAddNode = false
        this.$refs['formValidate'].resetFields();
      }
      if (val === '字典') {
        this.isAddNode = true
        this.isAddMulu = false
        this.$refs['formValidate'].resetFields()
      }
      this.formValidate.nodeSortId = 0;
      this.formValidate.flagdataCode = '';
      this.formValidate.nodeName = '';
      this.formValidate.identificationFlag = '';
      this.formValidate.nodeRemark = '';
    },
    // 树状图 新增/修改 弹框取消操作
    cancelflag () {
      this.showModal.addflagShow = false
      this.$refs['form'].resetFields()
    },
    //标识数据添加或修改-start    右侧表格 新增/修改 确认操作
    flagAddOrModify () {
      //确定
      if (!this.flagStatusTj) {
        this.$refs['form'].validate((valid) => {
          if (valid) {
            this.flagUpdate();
          } else {
            util.showMsg(this, { warning: '请填写必填项！' });
          }
        });
      } else {
        //校验代码-start
        this.$refs['form'].validate((valid) => {
          if (valid) {
            //校验代码-end
            let data = {
              "flagdataId": this.treeItem.flagdataId,
              "flagdataValue": this.form.flagdataValue,
              "flagdataValueRemark": this.form.flagdataValueRemark,
              "hospitalId": 0,
              "serialNumber": this.form.serialNumber
            }
            this.$store.dispatch("addSysFlagVal", data).then(res => {
              if (res.data.code !== 200) {
                util.showMsg(this, { diy: res.data.message });
              } else {
                this.$refs['form'].resetFields()
                this.showModal.addflagShow = false;
                util.showMsg(this, { succ: '新增成功' });
                this.getSysFlagVal(this.treeItem.flagdataId);
              }
            })
          } else {
            util.showMsg(this, { warning: '请填写必填项！' });
          }
        });
      }
    },
    // 右侧表格 新增/修改 获取对应数据
    flagUpdate () {
      let data = {
        "dataVersion": this.form.dataVersion,
        "flagdataId": this.form.flagdataId,
        "flagdataValue": this.form.flagdataValue,
        "flagdatavalueId": this.form.flagdatavalueId,
        "flagdataValueRemark": this.form.flagdataValueRemark,
        "serialNumber": this.form.serialNumber
      }
      this.loadedit = true;
      this.$store.dispatch("updateSysFlagVal", data).then(res => {
        if (res.data.code !== 200) {
          util.showMsg(this, { diy: res.data.message });
        } else {
          this.showModal.addflagShow = false;
          util.showMsg(this, { succ: '右侧列表数据更新成功' });
          this.getSysFlagVal(this.treeItem.flagdataId);
          this.$refs['form'].resetFields()
        }
        this.loadedit = false;
      })
    },
    //点击左侧新增
    addNewTree () {
      let sel = this.$refs['departmentTree'].getSelectedNodes();
      console.log(sel)
      if (util.isEmpty(sel)) {
        util.showMsg(this, { warning: '请选择要添加数据的节点！' });
        return; // 未选中
      }
      if (this.treeItem.flagdataId) {
        util.showMsg(this, { warning: '节点下不能挂其他节点' })
        return
      }
      this.formValidate.nodeSortId = 0
      this.formValidate = {};
      this.isAddMulu = true
      this.isAddNode = false
      this.showModal.addTableShow = true;
      if (util.isEmpty(this.treeItem.nodeId)) { //如果为空 则是添加父节点 
        this.isShow = false
      } else { //否则则是添加子节点
        this.isShow = true
        this.IsAdd = true
      }
      this.isShow_1 = false
      this.statusTj = true
    },
    //左侧树形结构   点击弹窗的保存按钮触发以下的东西  保存按钮 和修改保存共用
    addOrModify () {

      if (this.statusTj) {
        if (this.isAddNode) {  //走子节点的新增
          this.$refs['formValidate'].validate((valid) => {
            if (valid) {
              let data = {
                "flagdataName": this.formValidate.nodeName,
                "hospitalId": 0,
                "identificationFlag": this.formValidate.identificationFlag,
                "nodeId": this.treeItem.nodeId,
              }
              this.loadadd = true;
              this.$store.dispatch("addSysFlagData", data).then(res => {
                if (res.data.code !== 200) {
                  util.showMsg(this, { diy: res.data.message });
                  this.showModal.addTableShow = false;
                  this.loadadd = false;
                } else {
                  this.showModal.addTableShow = false;
                  util.showMsg(this, { succ: '子节点新增成功' });
                  this.fetchTreeDetail();
                  this.clearData()
                  this.loadadd = false;
                  this.isAddMulu = true
                  this.isAddNode = false
                  this.$refs['formValidate'].resetFields()
                  this.formValidate.nodeSortId = 0;
                  this.formValidate.flagdataCode = '';
                  this.formValidate.nodeName = '';
                  this.formValidate.identificationFlag = '';
                  this.formValidate.nodeRemark = '';
                  this.subtype = '目录'
                }
              })

            } else {
              util.showMsg(this, { warning: '请填写必填项！' });
              return;
            }
          });
        } else { //走父节点的新增
          this.addCatalog()
        }

      } else {//走更新
        if (this.isAddNode) {
          this.update()
        } else {
          this.updateParent()
        }

      }
    },
    //左侧树形结构   点击弹窗的取消按钮触发以下的东西  
    cancel () {
      this.showModal.addTableShow = false
      this.isAddMulu = true
      this.isAddNode = false
      this.$refs['formValidate'].resetFields();
      this.formValidate.nodeSortId = 0;
      this.formValidate.flagdataCode = '';
      this.formValidate.nodeName = '';
      this.formValidate.identificationFlag = '';
      this.formValidate.nodeRemark = '';
      this.subtype = '目录'
    },
    //左功能树新增功能
    addCatalog () {
      this.$refs['formValidate'].validate((valid) => {
        if (valid) {
          this.loadadd = true;
          let data = {
            "dirId": util.isEmpty(this.treeItem.dirId) ? '3' : this.treeItem.dirId,
            "hospitalId": '0',
            "nodeName": this.formValidate.nodeName,
            "nodeRemark": this.formValidate.nodeRemark,
            "nodeSortId": this.formValidate.nodeSortId, //排序号
            "parentNodeId": util.isEmpty(this.treeItem.nodeId) ? '0' : this.treeItem.nodeId
          }
          this.$store.dispatch('addSysDirectory', data).then(res => {
            if (res.data.code === 200) {
              util.showMsg(this, { succ: '标识数据新增成功' })
              this.showModal.addTableShow = false;
              this.fetchTreeDetail();//更新树结构的方法
              this.clearData()
              this.isAddMulu = true
              this.isAddNode = false
              this.$refs['formValidate'].resetFields()
              this.formValidate.nodeSortId = 0;
              this.formValidate.flagdataCode = '';
              this.formValidate.nodeName = '';
              this.formValidate.identificationFlag = '';
              this.formValidate.nodeRemark = '';
              this.subtype = '目录'
              this.loadadd = false;
            } else {
              this.showModal.addTableShow = false;
              util.showMsg(this, { diy: res.data.message });
              this.loadadd = false;
            }
          })
        } else {
          util.showMsg(this, { warning: '请填写必填项！' });
        }
      });
    },
    //点击左侧树形列表的修改
    editTree () {
      if (!this.treeItem.flagdataId) {
        this.subtype = '目录'
        this.isAddMulu = true
        this.isAddNode = false
      } else {
        this.subtype = '字典'
        this.isAddMulu = false
        this.isAddNode = true
      }
      this.IsAdd = false
      this.isShow_1 = true
      // 修改树结构
      if (JSON.stringify(this.treeItem) == "{}") {
        util.showMsg(this, { warning: '请选择需要修改的数据' })
        return false
      }
      if (this.treeItem.parentNodeId == 0) {//父级修改
        this.isShow = false
      } else {
        this.isShow = true
        this.formValidate.identificationFlag = this.treeItem.identificationFlag
      }
      this.showModal.addTableShow = true;
      this.statusTj = false;
      this.formValidate.nodeName = this.treeItem.nodeName
      this.formValidate.nodeSortId = util.isEmpty(this.treeItem.nodeSortId) && util.isEmpty(this.treeItem.sortNo) ? '1' : (util.isEmpty(this.treeItem.sortNo) ? this.treeItem.nodeSortId : this.treeItem.sortNo)
      this.formValidate.nodeRemark = this.treeItem.nodeRemark
      this.formValidate.flagdataCode = this.treeItem.flagdataCode
    },
    //父节点的更新
    updateParent () {
      this.$refs['formValidate'].validate((valid) => {
        if (valid) {
          this.loadadd = true;
          let data = {
            "dataVersion": this.treeItem.dataVersion,
            "hospitalId": 0,
            "nodeId": this.treeItem.nodeId,
            "nodeName": this.formValidate.nodeName,
            "dirId": this.treeItem.dirId,
            "parentNodeId": this.treeItem.parentNodeId,
            "nodeSortId": this.formValidate.nodeSortId,
            "nodeRemark": this.formValidate.nodeRemark
          }

          this.$store.dispatch("sysDirectoryupdate", data).then(res => {
            this.loadadd = false;
            if (res.data.code !== 200) {
              util.showMsg(this, { diy: res.data.message });
              this.showModal.addTableShow = false;
            } else {
              this.showModal.addTableShow = false;
              util.showMsg(this, { succ: '父节点更新成功' });
              this.fetchTreeDetail();
              this.clearData()
            }
          })
          this.formValidate.nodeRemark = ''
        } else {
          util.showMsg(this, { warning: '请填写必填项！' });
        }
      });

    },
    //子节点的更新
    update () {
      this.$refs['formValidate'].validate((valid) => {
        if (valid) {
          let data = {
            "dataVersion": this.treeItem.dataVersion,
            "flagdataName": this.formValidate.nodeName,
            "flagdataId": this.treeItem.flagdataId,
            "hospitalId": 0,
            "identificationFlag": this.formValidate.identificationFlag,//标识数据依据标准
            "flagdataCode": this.treeItem.flagdataCode,//标识数据代码
            "sortNo": this.formValidate.nodeSortId, //排序号
          }
          this.$store.dispatch("updateSysFlagData", data).then(res => {
            if (res.data.code !== 200) {
              util.showMsg(this, { diy: res.data.message });
              this.showModal.addTableShow = false;
            } else {
              this.showModal.addTableShow = false;
              util.showMsg(this, { succ: '子节点更新成功' });
              this.fetchTreeDetail();
              this.clearData()
            }
          })
          this.formValidate.nodeRemark = ''
        } else {
          util.showMsg(this, { warning: '请填写必填项！' });
        }
      })

    },
    changPage (Page) {
      this.pages.page = Page;
    },
    //切换每页多少条
    changPageNum (val) {
      this.pages.page = 1;
      this.pages.pageSize = val;
      this.getSysFlagVal(this.treeItem.flagdataId);
    },
    //树远程搜索功能
    search () {
      if (!util.isEmpty(this.searchVal)) {
        let id = util.findOfObject(this.searchVal, this.selecteds.directoryList, 'nodeName', 'nodeId');
        if (id) {
          this.treeData.map((val, i) => {
            if (val.id === id) {
              this.treeItem = val;
            } else {
              this.treeData[i].children.map((cval, ci) => {
                if (cval.id === id) {
                  this.treeItem = cval;
                } else {
                  this.treeData[i].children[ci].children.map((ccval, cci) => {
                    if (ccval.id === id) {
                      this.treeItem = ccval;
                    }
                  })
                }
              })
            }
          });

          if (this.treeItem.nodeKey !== 0) {
            this.$refs['departmentTree'].handleSelect(this.treeItem.nodeKey);
            this.$nextTick().then(
              () => {
                document.querySelector('.departmentTree span.ivu-tree-title.ivu-tree-title-selected').scrollIntoView({ behavior: "instant", block: "end", inline: "nearest" });
              }
            )
          }
        } else {
          util.showMsg(this, { warning: `没有${this.searchVal}节点` });
          return;
        }
      }
    }
  }
};
</script>


<style lang='less' scoped>
@import "../../../../styles/common.less";
@import "./identification-data.less";
.tab {
  height: calc(78vh);
}
.ry-right-tree-26 {
  padding-top: 0px;
  margin-bottom: 16px;
  padding-right: 0px;
}
::-webkit-scrollbar {
  width: 6px;
  height: 16px;
  background-color: #f5f5f5;
}

/*定义滚动条轨道 内阴影+圆角*/
::-webkit-scrollbar-track {
  // -webkit-box-shadow: inset 0 0 6px #e9eaec;
  border-radius: 3px;
  background-color: #f5f7f9;
}

/*定义滑块 内阴影+圆角*/
::-webkit-scrollbar-thumb {
  border-radius: 3px;
  // -webkit-box-shadow: inset 0 0 6px #e9e9e9;
  background-color: #ccc;
}
</style>
<style>
.tableShowModal .ivu-FormItem-error-tip {
  position: absolute;
  top: 100%;
  left: 120px;
  line-height: 1;
  padding-top: 6px;
  color: #f30;
}
.ivu-page-simple .ivu-page-simple-pager input {
  width: 45px !important;
}
.department-tree .ivu-tree-title {
  width: 90%;
}
</style>