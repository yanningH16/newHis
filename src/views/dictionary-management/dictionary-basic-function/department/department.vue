<template>
  <!-- <div> -->
  <Row class="bg-white department "
       id="Rows">
    <i-Col span="8"
           class="ry-left-tree"
           style="margin-top: -13px;padding-top: 13px;margin-left:-10px;position: absolute;z-index: 1;">
      <div class="form-group">
        <Select style="width: 224px"
                v-model="selects.query"
                placeholder="请输入基础字典名称或拼音码"
                filterable
                remote
                :remote-method="remoteMethod"
                :loading="selects.loading"
                @on-change="queryChange"
                clearable>
          <Option v-for="(option, index) in selects.options"
                  :value="option.value"
                  :key="index">{{option.label}}
          </Option>
        </Select>
      </div>
      <div class="department-tree"
           style='overflow-y:auto;overflow-x:hidden;height:95%'>
        <Tree class="department-tree-content"
              ref="departmentTree"
              :data="treeData"
              @on-select-change="clickTreeItem"></Tree>
      </div>
    </i-Col>
    <i-Col span="18"
           class="department-right-tree"
           style="height:100%">
      <div span="5"
           class="department-right-tree-title"
           style="height:5%">
        <div class="department-right-tree-title-span">
          管理类别科室列表

          <span style="width:220px;display:inline-block;margin-left:10px;font-weight:normal">
            <long-range-search-select :match-field="longQueryObj.deptFieldList"
                                      :echo.sync="longQueryObj.deptEcho"
                                      @currObject="getDeptObject"
                                      ref="clearValue"
                                      :size='6'></long-range-search-select>
          </span></div>
        <div class="btnmedical">
          <Button type="primary"
                  :disabled='formValidate.detailFlag?false:true'
                  @click="addNewFuc">
            <i class="iconfont icontianjia"
               style="font-size: 14px;"></i>
            新增
          </Button>
          <Button :disabled="inpDis"
                  type="primary"
                  :loading="loadLeft"
                  @click.native="okFuc">
            <i class="iconfont iconbaocun1"></i>
            保存
          </Button>
        </div>
      </div>
      <Table highlight-row
             :data="table.data"
             :columns="table.columns"
             @on-row-click="tableClick"
             stripe
             border
             :height="tableHeight"
             ref="table"
             style="border-right: none;border-bottom: none;height:40%"></Table>
      <!-- </div> -->
      <div style="margin-top:15px;float:right;height:10">
        <Page @Page="changPage"
              :tabpage="tabPage"
              style="float:right"></Page>
      </div>
      <!-- </Row> -->
      <div style="height:40%;margin-top:20px">
        <Form ref="deptFormRef"
              :model="formValidate"
              :rules="ruleValidate"
              :label-width="70"
              class="formCladd"
              style="margin-left:40px;">
          <Row>
            <i-Col span="12">
              <Form-item label="类型">
                <div style="display:flex;flex-direction:row;align-items: center;margin-top: 5px;">
                  <Checkbox :disabled="inpDis"
                            v-model="formValidate.detailFlag"
                            style="margin-left: 5px;">虚拟科室
                  </Checkbox>
                </div>
              </Form-item>
            </i-Col>
            <i-Col span="12">
              <Form-item prop="deptName"
                         label="科室">
                <Input :disabled="inpDis"
                       v-model.trim="formValidate.deptName"
                       style="width: 300px" />
              </Form-item>
            </i-Col>
            <i-Col span="12">
              <Form-item prop="deptPosition"
                         label="科室位置">
                <Input :disabled="inpDis"
                       v-model.trim="formValidate.deptPosition"
                       style="width: 300px" />
              </Form-item>
            </i-Col>
            <i-Col span="12">
              <Form-item prop="deptSort"
                         label="顺序号">
                <Input :disabled="inpDis"
                       v-model.trim="formValidate.deptSort"
                       style="width: 300px;" />
              </Form-item>
            </i-Col>
            <i-Col span="12">
              <Form-item prop="deptTypeList"
                         label="科室属性"
                         class="formSelect">
                <Select placement="top"
                        :disabled="inpDis"
                        style="width: 300px;max-height:30px"
                        v-model="deptTypeList"
                        multiple
                        clearable
                        filterable>
                  <Option v-for="item in selecteds.deptAuxList"
                          :key="item.label"
                          :value="item.value">{{item.label}}
                  </Option>
                </Select>
              </Form-item>
            </i-Col>
            <i-Col span="12">
              <Form-item prop="deptAuxId"
                         label="辅助属性">
                <Select placement="top"
                        :disabled="inpDis"
                        style="width: 300px;"
                        v-model="formValidate.deptAuxId"
                        clearable
                        filterable>
                  <Option v-for="item in selecteds.deptClassList"
                          :key="item.label"
                          :value="item.value">{{item.label}}
                  </Option>
                </Select>
              </Form-item>
            </i-Col>
            <i-Col span="12">
              <Form-item prop="deptOtherCode"
                         label="辅助编码">
                <Input :disabled="inpDis"
                       v-model.trim="formValidate.deptOtherCode"
                       style="width: 300px" />
              </Form-item>
            </i-Col>
            <i-Col span="12">
              <Form-item prop="pyCode"
                         label="拼音码">
                <Input :disabled="inpDis"
                       v-model.trim="formValidate.pyCode"
                       style="width: 300px;" />
              </Form-item>
            </i-Col>
            <i-Col span="12">
              <Form-item prop="wbCode"
                         label="五笔码">
                <Input :disabled="inpDis"
                       v-model.trim="formValidate.wbCode"
                       style="width: 300px;" />
              </Form-item>
            </i-Col>
            <i-Col span="12">
              <div>
              </div>
            </i-Col>
          </Row>
        </Form>

      </div>
    </i-Col>
    <confirmDeletion :show="showModal.delShow"
                     :msg="showModal.delMsg"
                     title="删除确认"
                     @close="showModal.delShow=false"
                     :btntext="showModal.delBtnText"
                     ::loading="loadDel"
                     @ok="delTreeOk"
                     @cancel="delTreeCancel" />
    <!-- 状态确认 -->
    <confirmDeletion :show="showModal.showStop"
                     :msg="showModal.stopMsg"
                     title='状态确认'
                     :loading="loadRight"
                     :btntext='showModal.stopBtnText'
                     @ok="change"
                     @close="showModal.showStop=false" />
  </Row>
  <!-- </div> -->
</template>

<script>
import util from '../../../../libs/util';
import confirmDeletion from '../../../components/confirmDeletion.vue';
import longrangesearchselect from '../../../components/long-range-search-select'
import Page from '../../../components/page.vue';
import Vue from 'vue';

export default {
  components: { confirmDeletion, Page, 'long-range-search-select': longrangesearchselect },
  name: 'department',
  data () {
    const validateAge = (rule, value, callback) => {
      if (!Number.isInteger(value * 1) && !util.isEmpty(value)) {
        callback(new Error('顺序号只能为数字'));
      } else if (value * 1 <= 0 && !util.isEmpty(value)) {
        callback(new Error('顺序号必须大于0'));
      } else {
        callback();
      }
    };
    return {
      inpDis: true,
      longQueryObj: { // 远程搜索相关
        deptEcho: {
          id: '',
          name: '',
          PyCode: ''
        },
        deptFieldList: ['DEPT_ID', 'DEPT_ID', 'DEPT_NAME', 'HIS_DEPT_DICT'], // 科室
      },
      treeHeight: 0,
      loadLeft: false,
      loadDel: false,
      loadRight: false,
      loading: false,
      options1: [],
      selecteds: {
        deptList: [],
        deptAuxList: [],
        deptClassList: []
      },
      page: 1,
      tabPage: 1,
      selectVariable: '',
      treeData: [],
      searchVal: '',
      current: {},
      tableHeight: 0,
      table: {
        columns: [
          {
            title: '编码',
            key: 'deptCode',
            render: (h, params) => {
              return h('div', [
                h('span', {
                  style: {
                    color: params.row.stopFlag * 1 === 1 ? 'red' : 'black'
                  }
                }, params.row.deptCode),
              ]);
            }
          },
          {
            title: '名称',
            key: 'deptName',
            width: 300,
            render: (h, params) => {
              return h('div', [
                h('span', {
                  style: {
                    color: params.row.stopFlag * 1 === 1 ? 'red' : 'black'
                  }
                }, params.row.deptName),
              ]);
            }
          },
          {
            title: '位置',
            key: 'deptPosition',
            render: (h, params) => {
              params.row.deptPosition = params.row.deptPosition != null ? params.row.deptPosition : ''
              return h('div', [
                h('span', {
                  style: {
                    color: params.row.stopFlag * 1 === 1 ? 'red' : 'black'
                  }
                }, params.row.deptPosition),
              ]);
            }
          },
          {
            title: '科室属性',
            key: 'deptTypeName',
            render: (h, params) => {
              return h('div', [
                h('span', {
                  style: {
                    color: params.row.stopFlag * 1 === 1 ? 'red' : 'black'
                  }
                }, params.row.deptTypeName),
              ]);
            }
          },
          {
            title: '操作',
            key: 'opration',
            width: 100,
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
                  [
                    h('i', {
                      class: params.row.stopFlag === '0' ? util.icon.stop : util.icon.start,
                      style: {
                        marginRight: '10px'
                      },
                      on: {
                        click: () => {
                          this.disableTable(params.index);
                        }
                      }
                    }),
                    h(
                      'div',
                      {
                        slot: 'content'
                      },
                      params.row.stopFlag === '0' ? '停用' : '启用'
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
                          this.delTree(params.row);
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
        data: []
      },
      treeItem: {},
      showModal: {
        delShow: false,
        editShow: false,
        addTableShow: false,
        delMsg: '',
        delBtnText: '删除',
        showStop: false,
        stopMsg: '',
        stopBtnText: ''
      },
      curIndex: 0,
      formValidate: {
        pyCode: '', // 拼音码
        wbCode: '', // 五笔码
        deptName: '', // 科室名字
        deptPosition: '', // 科室位置
        deptTypeList: '', // 科室属性
        deptSort: '', // 顺序号
        deptOtherCode: '', // 辅助编码
        deptAuxId: '', // 辅助属性
        parentDeptId: 1,
        detailFlag: false
      },
      deptTypeList: [],
      deptTypeList: [],
      clickValue: [],
      dataVersion: '',
      ruleValidate: {
        deptName: [{ required: true, message: '科室名称不能为空', trigger: 'blur' }],
        deptSort: [{ validator: validateAge, trigger: 'blur' }]
      },
      nodeClick: [],
      nodeStatus: 0,
      pageSize: 0,
      tableSelecyVal: {},
      tableTree: 0,
      selectTerees: {},
      selects: {
        query: '',
        loading: false,
        options: []
      },
    };
  },
  watch: {
    'table.data': function (val) {
      this.table.data.map(item => {
        if (this.nodeClick[0].id === item.deptId) {
          item._highlight = true
          this.nodeClick[0].nodeKey !== 0 ? this.tableClick(this.nodeClick[0].data) : ''
        } else {
          item._highlight = false
        }
      })
    }
  },
  created () {
    this.fetchTreeDetail();
  },
  mounted () {
    this.init();
    this.tableHeight = window.innerHeight - this.$refs.table.$el.offsetTop - 400
  },
  methods: {
    // 查询
    queryChange (val) {
      if (util.isEmpty(val)) return
      let id = util.findOfObject(val, this.leftTreeList, 'deptName', 'deptId');
      let treeItem = util.treeMap(this.treeData[0], id);
      if (!treeItem) {
        util.showMsg(this, { warning: `没有${val}医疗机构` });
        return;
      }
      if (treeItem.nodeKey !== 0) {
        this.$refs['departmentTree'].handleSelect(treeItem.nodeKey);
        this.$nextTick().then(() => {
          util.isEmpty(document.querySelector('.department-tree-content span.ivu-tree-title.ivu-tree-title-selected')) ? '' : document.querySelector('.department-tree-content span.ivu-tree-title.ivu-tree-title-selected').scrollIntoView({
            behavior: "instant",
            block: "end",
            inline: "nearest"
          });
        })
      }
    },
    //左侧树 远程搜索
    remoteMethod (query) {
      if (query !== '') {
        this.selects.loading = true;
        setTimeout(() => {
          this.selects.loading = false;
          const list = this.leftTreeList.map(item => {
            return {
              value: item.deptName,
              label: item.deptName,
              pyCodeLower: item.pyCode.toLowerCase(),
              pyCodeUpper: item.pyCode.toUpperCase(),
              wbCode: item.wbCode,
              id: item.deptId
            };
          });
          this.selects.options = util.findKeys(query, list, ['pyCodeLower', 'pyCodeUpper', 'label', 'wbCode'])
        }, 200);
      } else {
        this.selects.options = []
      }
    },
    //右侧表格选中
    tableClick (val) {
      this.cancelFuc()
      this.tableSelecyVal = val;
      this.showDataDiy(val)
      if (this.tableTree != 3) {
        if (val.deptName === this.treeItem.deptName || this.selectTerees.deptName === val.deptName) {
          let id = util.findOfObject(val.deptId, this.selecteds.deptList, 'deptId', 'deptId');
          if (id) {
            let treeItems = util.treeMap(this.treeData[0], id);
            this.tableTree = 2
            if (treeItems.nodeKey !== 0) {
              this.$refs['departmentTree'].handleSelect(treeItems.nodeKey);
              this.$nextTick().then(
                () => {
                  util.isEmpty(document.querySelector('.department-tree-content span.ivu-tree-title.ivu-tree-title-selected')) ? '' : document.querySelector('.department-tree-content span.ivu-tree-title.ivu-tree-title-selected').scrollIntoView({
                    behavior: "instant",
                    block: "end",
                    inline: "nearest"
                  });
                }
              )
            }
          }
        }
      }
      if (this.tableTree === 0 || this.tableTree === 3) {
        let id = util.findOfObject(val.deptId, this.selecteds.deptList, 'deptId', 'deptId');
        if (id) {
          let treeItems = util.treeMap(this.treeData[0], id);
          this.tableTree = 1
          if (!treeItems) {
            util.showMsg(this, { warning: `没有${val.deptName}科室` });
            return;
          }
          if (treeItems.nodeKey !== 0) {
            this.$refs['departmentTree'].handleSelect(treeItems.nodeKey);
            this.$nextTick().then(
              () => {
                util.isEmpty(document.querySelector('.department-tree-content span.ivu-tree-title.ivu-tree-title-selected')) ? '' : document.querySelector('.department-tree-content span.ivu-tree-title.ivu-tree-title-selected').scrollIntoView({
                  behavior: "instant",
                  block: "end",
                  inline: "nearest"
                });
              }
            )
          }
        }
      }
      this.selectTerees = val;
      this.treeItem = val;
      this.editTree()
    },
    //管理类别科室列表 下拉传参
    getDeptObject (item) {
      this.searchVal = item.DEPT_NAME;
      this.search();
    },
    refreshFuc () {
      const params2 = { page: this.page, size: this.pageSize }
      if (this.nodeClick.length != 0 && this.nodeClick[0].nodeKey !== 0) {
        let deptData = this.nodeClick;
        deptData = deptData.concat(deptData[0].children);
        let deptId = util.getOne(deptData, 'id');
        params2.deptIdList = deptId.join(',');
      }
      this.$store.dispatch('departTabList', params2).then(res => {
        if (res.data.code !== 200) {
          util.showMsg(this, { diy: res.data.message });
        } else {
          this.tabPage = res.data.data.pages;
          let resList = res.data.data.list;
          resList.map((item, index) => {
            let nameStr = ''
            if (!util.isEmpty(item.deptTypeNameList)) {
              item.deptTypeNameList.map(val => {
                if (nameStr == '') {
                  nameStr += val
                } else {
                  nameStr += ',' + val
                }
              })
            }
            item.deptTypeName = nameStr
          })
          this.table.data = resList;
        }
      });
    },
    fetchTreeDetail () {
      let data = {
        deptType: 0,
        detailFlag: 1,
        hospitalId: this.$store.state.userInfoObj.hospitalId,
      }
      this.$store.dispatch('getDeptDictOnly', data).then(res => {
        if (res.data.code !== 200) {
          util.showMsg(this, { diy: res.data.message });
        } else {
          this.selecteds.deptList = res.data.data.list;
          let resList = res.data.data.list;
          resList.map((item, index) => {
            let nameStr = ''
            if (item.deptTypeNameList == null) {
              item.deptTypeNameList = []
              item.deptTypeIdList = []
            }
            if (item.deptTypeNameList != null) {
              if (item.deptTypeNameList.length = 0) {
                item.deptTypeNameList.map(val => {
                  if (nameStr == '') {
                    nameStr += val
                  } else {
                    nameStr += ',' + val
                  }
                })
              }

            }
            item.deptTypeName = nameStr
          })
          this.leftTreeList = resList
          this.treeData = util.getTree(
            resList,
            'deptId',
            'deptName',
            'parentDeptId',
            '全部科室'
          );
          if (!util.isEmpty(this.nodeClick[0])) {
            this.selecteds.deptList.map(item => {
              if (item.deptName == this.nodeClick[0].title) {
                this.nodeClick[0].dataVersion = item.dataVersion;
              }
            })
          }
          this.selecteds.deptList.map(item => {
            if (item.stopFlag === '1') {
              this.$nextTick().then(
                () => {
                  Array.from(document.querySelectorAll('.department-tree-content span.ivu-tree-title')).map(
                    litem => {
                      if (litem.innerHTML === item.deptName) {
                        litem.className = 'ivu-tree-title flagColor'
                      }
                    }
                  )
                }
              )
            } else {
              this.$nextTick().then(
                () => {
                  Array.from(document.querySelectorAll('.department-tree-content span.ivu-tree-title')).map(
                    litem => {
                      if (litem.innerHTML === item.deptName) {
                        litem.className = 'ivu-tree-title';
                      }
                    }
                  )
                }
              )
            }
            if (!util.isEmpty(this.nodeClick[0]) && this.nodeClick[0].nodeKey > 0) {
              this.$nextTick().then(
                () => {
                  Array.from(document.querySelectorAll('.department-tree-content span.ivu-tree-title')).map(
                    litem => {
                      if (litem.innerHTML === this.nodeClick[0].title) {
                        litem.className += ' ' + 'active';
                      }
                    }
                  )
                }
              )
            }
          })
        }
      })
    },
    init () {
      // 获取科室属性、辅助属性
      this.$store.dispatch('getFDAttr', { flagdataCode: 'FD000027'}).then(res => {
        if (res.data.code !== 200) {
          util.showMsg(this, { diy: res.data.message });
        } else {
          res.data.data.forEach((item, i) => {
            this.selecteds.deptAuxList.push({
              value: item.flagdataValue,
              label: item.flagdataValueRemark
            });
          });
        }
      })
      this.$store.dispatch('getFDAttr', {flagdataCode: 'FD000035'}).then(res => {
        if (res.data.code !== 200) {
          util.showMsg(this, { diy: res.data.message });
        } else {
          res.data.data.forEach((item, i) => {
            this.selecteds.deptClassList.push({
              value: item.flagdataValue,
              label: item.flagdataValueRemark
            });
          });
        }
      })
    },
    //  检查用户是否选择了科室
    checkSelect () {
      let sel = this.$refs['departmentTree'].getSelectedNodes();
      if (util.isEmpty(sel)) {
        return true; // 未选中
      } else {
        return true; // 选中节点
      }
    },
    //修改tree某一项
    editTree () {
      let tableDeptIds = null;
      let id = util.findOfObject(this.tableSelecyVal.deptId, this.selecteds.deptList, 'deptId', 'deptId');
      if (id) {
        let treeItems = util.treeMap(this.treeData[0], id);
        tableDeptIds = treeItems;
      }
      let params = tableDeptIds;

      if (params == '' || params == null) {
        util.showMsg(this, { warning: "未选择节点" })
      } else {
        if (this.treeItem.deptName == undefined) {
          util.showMsg(this, { warning: '根节点不可修改' });
          return
        }
        this.inpDis = false
        // 修改树结构
        this.$refs['deptFormRef'].resetFields();
        this.showDataDiy(this.tableSelecyVal)
        this.formValidate.detailFlag = this.treeItem.detailFlag === '1' ? true : false;
        this.showModal.addTableShow = true;
        this.showModal.editShow = true;
      }
    },
    //删除tree某一项
    delTree (val) {
      let tableDeptIds = null;
      let id = util.findOfObject(val.deptId, this.selecteds.deptList, 'deptId', 'deptId');
      if (id) {
        let treeItems = util.treeMap(this.treeData[0], id);
        tableDeptIds = treeItems;
      }
      let params = tableDeptIds;
      if (params == '' || params == null) {
        util.showMsg(this, { warning: "未选择节点" })
      } else {
        if (!this.checkSelect()) return;

        if (tableDeptIds.children.length) {
          util.showMsg(this, { warning: '请先清除完子级才能删除' });
          return;
        }
        this.showModal.delMsg = '确定要删除' + '【' + tableDeptIds.data.deptName + '】吗？';
        this.showModal.delShow = true;
      }
    },
    //删除确认
    delTreeOk () {
      this.loadDel = true;
      let tableDeptId = null;
      let id = util.findOfObject(this.tableSelecyVal.deptId, this.selecteds.deptList, 'deptId', 'deptId');
      if (id) {
        let treeItems = util.treeMap(this.treeData[0], id);
        tableDeptId = treeItems.data.deptId;
      }
      const delId = { id: tableDeptId, hospitalId: this.$store.state.userInfoObj.hospitalId };
      // return
      // 删除
      this.$store.dispatch('deptDelete', delId).then(res => {
        this.loadDel = false;
        if (res.data.code == 200) {
          util.showMsg(this, { succ: '删除完成' });
          this.showModal.delShow = false;
          this.refreshFuc();
          this.formValidate.pyCode = '';
          this.formValidate.wbCode = ''; // 五笔码
          this.formValidate.deptName = ''; // 科室名字
          this.formValidate.detailFlag = false;
          this.formValidate.deptPosition = ''; // 科室位置
          this.deptTypeList = []; // 科室属性
          this.formValidate.deptSort = ''; // 顺序号
          this.formValidate.deptOtherCode = ''; // 辅助编码
          this.formValidate.deptAuxId = ''; // 辅助属性
          this.formValidate.parentDeptId = 1; // 科室类型
        } else {
          util.showMsg(this, { diy: res.data.message });
        }
        this.fetchTreeDetail();
      });
    },
    //隐藏删除弹框
    delTreeCancel () {
      this.showModal.delShow = false;
    },
    //点击左侧的树 获取到右侧的数据
    clickTreeItem (item) {
      this.tabPage = 1
      console.log(item, '店家一下看看')
      item.length === 0 ? '' : item[0].nodeKey === 0 ? this.tableSelecyVal = {} : ''
      item.length === 0 ? '' : item[0].nodeKey === 0 ? this.treeItem = {} : ''
      if (this.tableTree === 1) {
        this.tableTree = 0;
        return
      }
      if (this.tableTree === 2) {
        this.tableTree = 3;
        util.isEmpty(item) ? '' : this.tableClick(item[0].data)
        return
      }
      if (item.length > 0 && item[0].id === this.longQueryObj.deptEcho.id) {
      } else {
        this.searchVal = ''
        this.$refs.clearValue.vModelClear()
        this.longQueryObj.deptEcho.id = null;
        this.longQueryObj.deptEcho.name = null;
        this.longQueryObj.deptEcho.PyCode = null;
      }
      this.inpDis = true
      this.nodeStatus = 0;
      this.nodeClick = item;
      if (!item.length) {
        this.table.data = [];
        this.formValidate.pyCode = '';
        this.formValidate.wbCode = ''; // 五笔码
        this.formValidate.deptName = ''; // 科室名字
        this.formValidate.detailFlag = false;
        this.formValidate.deptPosition = ''; // 科室位置
        this.deptTypeList = []; // 科室属性
        this.formValidate.deptSort = ''; // 顺序号
        this.formValidate.deptOtherCode = ''; // 辅助编码
        this.formValidate.deptAuxId = ''; // 辅助属性
        this.formValidate.parentDeptId = 1; // 科室类型
        return
      } else {
        if (item[0].nodeKey === 0) {
          this.table.data = [];
          this.formValidate.pyCode = '';
          this.formValidate.wbCode = ''; // 五笔码
          this.formValidate.deptName = ''; // 科室名字
          this.formValidate.detailFlag = false;
          this.formValidate.deptPosition = ''; // 科室位置
          this.deptTypeList = []; // 科室属性
          this.formValidate.deptSort = ''; // 顺序号
          this.formValidate.deptOtherCode = ''; // 辅助编码
          this.formValidate.deptAuxId = ''; // 辅助属性
          this.formValidate.parentDeptId = 1; // 科室类型
        }
      }
      ;
      this.deptTypeList = []
      item === [] ? '' : this.treeItem = item[0].data;
      const params = { page: this.page, size: this.pageSize };
      this.selecteds.deptList.map(list => {
        if (list.stopFlag === '1') {
          this.$nextTick().then(
            () => {
              Array.from(document.querySelectorAll('.department-tree-content span.ivu-tree-title')).map(
                litem => {
                  if (litem.innerHTML === list.deptName) {
                    litem.className += ' ' + 'flagColor'
                  }
                }
              )
            }
          )
        }
        if (this.nodeClick[0].nodeKey > 0) {
          this.$nextTick().then(
            () => {
              Array.from(document.querySelectorAll('.department-tree-content span.ivu-tree-title')).map(
                litem => {
                  if (list.id === this.nodeClick[0].id) {
                    litem.className += ' ' + 'active'
                  }
                }
              )
            }
          )
        }
      })
      this.clickValue = item;
      if (item[0].nodeKey !== 0) {
        let deptData = item;
        deptData = deptData.concat(deptData[0].children);
        let deptId = util.getOne(deptData, 'id');
        params.deptIdList = deptId.join(',');
      }
      if (item[0].id === 0) {
        this.current = {};
        this.current.deptId = 0;
        this.current.parentDeptId = -1;
      } else {
        this.current = item[0].data;
        this.tableSelecyVal = {}
        // this.table.data = [];
        this.formValidate.pyCode = '';
        this.formValidate.wbCode = ''; // 五笔码
        this.formValidate.deptName = ''; // 科室名字
        this.formValidate.detailFlag = false;
        this.formValidate.deptPosition = ''; // 科室位置
        this.deptTypeList = []; // 科室属性
        this.formValidate.deptSort = ''; // 顺序号
        this.formValidate.deptOtherCode = ''; // 辅助编码
        this.formValidate.deptAuxId = ''; // 辅助属性
        this.formValidate.parentDeptId = 1; // 科室类型
      }
      this.$store.dispatch('departTabList', params).then(res => {
        if (res.data.code !== 200) {
          util.showMsg(this, { diy: res.data.message });
        } else {
          console.log(res.data.data.pages)
          setTimeout(() => {
            this.tabPage = res.data.data.pages;
          }, 100)
          let resList = res.data.data.list;
          resList.map((item, index) => {
            let nameStr = ''
            if (!util.isEmpty(item.deptTypeNameList)) {
              item.deptTypeNameList.map(val => {
                if (nameStr == '') {
                  nameStr += val
                } else {
                  nameStr += ',' + val
                }
              })
            }
            item.deptTypeName = nameStr
          })
          this.table.data = resList
        }
      })
      if (this.nodeClick[0].title == '全部科室') {
        this.formValidate.detailFlag = true
      }
    },
    //回显表格数据在下方表单中
    showDataDiy (item) {
      this.formValidate.pyCode = item.pyCode;
      this.formValidate.detailFlag = item.detailFlag === '1' ? true : false;
      this.formValidate.wbCode = item.wbCode; // 五笔码
      this.formValidate.deptName = item.deptName; // 科室名字
      this.formValidate.deptPosition = item.deptPosition; // 科室位置
      this.deptTypeList = item.deptTypeIdList === null ? [] : item.deptTypeIdList; // 科室属性
      this.formValidate.deptSort = item.deptSort; // 顺序号
      this.formValidate.deptOtherCode = item.deptOtherCode; // 辅助编码
      this.formValidate.deptAuxId = item.deptAuxId; // 辅助属性
      this.formValidate.parentDeptId = item.parentDeptId == 0 ? 0 : 1; // 科室类型
    },
    change () {
      this.loadRight = true;
      const params = {
        stopFlag: this.table.data[this.curIndex].stopFlag === '1' ? '0' : '1',
        dataVersion: this.table.data[this.curIndex].dataVersion,
        deptId: this.table.data[this.curIndex].deptId,
        hospitalId: this.table.data[this.curIndex].hospitalId,
        deptSort: this.table.data[this.curIndex].deptSort,
        deptName: this.table.data[this.curIndex].deptName, // 科室名字
        deptPosition: this.table.data[this.curIndex].deptPosition, // 科室位置
        deptOtherCode: this.table.data[this.curIndex].deptOtherCode, // 辅助编码
        deptAuxId: this.table.data[this.curIndex].deptAuxId, // 辅助属性
        detailFlag: this.table.data[this.curIndex].detailFlag,
        pyCode: this.table.data[this.curIndex].pyCode,
        wbCode: this.table.data[this.curIndex].wbCode

      }
      this.$store.dispatch('deptUpdate', params).then(res => {
        this.loadRight = false;
        if (res.data.code === 200) {
          util.showMsg(this, { succ: res.data.message });
          this.fetchTreeDetail();
          this.refreshFuc();
        } else {
          util.showMsg(this, { diy: res.data.message });
        }
        this.showModal.showStop = false;
      });
    },
    //删除表格某一项
    disableTable (index) {
      let n = 0;
      this.curIndex = index;
      let status = this.table.data[index].stopFlag === '0' ? '停用' : '启用';
      // 判断子集父级状态
      if (this.table.data[index].stopFlag === '0') {
        this.table.data.map((item) => {
          item.parentDeptId === this.table.data[index].deptId ? (item.stopFlag === '0' ? (n = n + 1) : '') : '';
        })
        if (n > 0) {
          util.showMsg(this, { warning: '必须子集都停用' });
          return
        }
      } else {
        this.table.data.map((item) => {
          item.deptId === this.table.data[index].parentDeptId ? (item.stopFlag === '1' ? (n = n + 1) : '') : '';
        })
        if (n > 0) {
          util.showMsg(this, { warning: '必须父级启用' });
          return
        }
      }
      this.showModal.showStop = true;
      this.showModal.stopMsg = '确定要' + status + '【' + this.table.data[index].deptName + '】吗？';
      this.showModal.stopBtnText = '确认' + status;
    },
    //新增
    addNewFuc () {

      let params = this.nodeClick;
      if (util.isEmpty(params)) {
        util.showMsg(this, { warning: "未选择节点" })
      } else {
        this.$refs['deptFormRef'].resetFields();
        if (!this.checkSelect()) return;

        this.inpDis = false;
        this.formValidate.pyCode = '';
        this.formValidate.wbCode = ''; // 五笔码
        this.formValidate.deptName = ''; // 科室名字
        this.formValidate.detailFlag = false;
        this.formValidate.deptPosition = ''; // 科室位置
        this.deptTypeList = []; // 科室属性
        this.formValidate.deptSort = ''; // 顺序号
        this.formValidate.deptOtherCode = ''; // 辅助编码
        this.formValidate.deptAuxId = ''; // 辅助属性
        this.formValidate.parentDeptId = 1; // 科室类型
        this.showModal.addTableShow = true;
        this.showModal.editShow = false;
      }

    },
    //保存
    addBtnFuc () {
      let tableDeptId = null;
      let findDeptId = null;
      if (JSON.stringify(this.tableSelecyVal) === "{}") {
        findDeptId = this.nodeClick[0].id
      } else {
        findDeptId = this.tableSelecyVal.deptId
      }

      let id = util.findOfObject(findDeptId, this.selecteds.deptList, 'deptId', 'deptId');
      if (id) {
        let treeItems = util.treeMap(this.treeData[0], id);
        tableDeptId = treeItems.data.deptId;
      }
      const params = {
        hospitalId: this.$store.state.userInfoObj.hospitalId,
        pyCode: this.formValidate.pyCode, // 拼音码
        wbCode: this.formValidate.wbCode, // 五笔码
        deptName: this.formValidate.deptName, // 科室名字
        deptPosition: this.formValidate.deptPosition, // 科室位置
        deptTypeIdList: this.deptTypeList, // 科室属性
        deptSort: this.formValidate.deptSort, // 顺序号
        deptOtherCode: this.formValidate.deptOtherCode, // 辅助编码
        deptAuxId: this.formValidate.deptAuxId, // 辅助属性
        parentDeptId: this.nodeClick.length == 0 ? 0 : tableDeptId,//? this.treeItem.parentDeptId : this.treeItem.deptId
        detailFlag: this.formValidate.detailFlag ? '1' : '0'
      };
      if (params.parentDeptId == undefined) {
        params.parentDeptId = 0
      }
      let dept = this.addOrModify(params);
      if (dept !== false) {
        this.showModal.addTableShowShow = false;
        this.showModal.editShow = false;
        this.formValidate.pyCode = '';
        this.formValidate.wbCode = ''; // 五笔码
        this.formValidate.deptName = ''; // 科室名字
        this.formValidate.detailFlag = false;
        this.formValidate.deptPosition = ''; // 科室位置
        this.deptTypeList = []; // 科室属性
        this.formValidate.deptSort = ''; // 顺序号
        this.formValidate.deptOtherCode = ''; // 辅助编码
        this.formValidate.deptAuxId = ''; // 辅助属性
        this.formValidate.parentDeptId = 1; // 科室类型
      }
    },
    //保存逻辑
    addOrModify (params) {
      this.loadLeft = true;
      this.$store.dispatch('deptAdd', params).then(res => {
        this.loadLeft = false;
        if (res.data.code === 200) {
          this.showModal.addTableShow = false
          let obj = res.data.data;
          obj.id = obj.deptId
          this.nodeClick[0].children.push(obj);
          this.fetchTreeDetail();
          this.refreshFuc();
          util.showMsg(this, { succ: '保存成功' });
          return res.data.data;
        } else {
          util.showMsg(this, { diy: res.data.message });
          return false;
        }
      });
    },
    //修改
    editBtnFuc () {
      let tableDeptId = null;
      let tableDataVersion = null;
      let id = util.findOfObject(this.tableSelecyVal.deptId, this.selecteds.deptList, 'deptId', 'deptId');
      if (id) {
        let treeItems = util.treeMap(this.treeData[0], id);
        tableDeptId = treeItems.data.deptId;
        tableDataVersion = treeItems.data.dataVersion;
      }
      const params = {
        dataVersion: tableDataVersion,
        hospitalId: this.$store.state.userInfoObj.hospitalId,
        pyCode: this.formValidate.pyCode, // 拼音码
        wbCode: this.formValidate.wbCode, // 五笔码
        deptName: this.formValidate.deptName, // 科室名字
        deptPosition: this.formValidate.deptPosition, // 科室位置
        deptTypeIdList: this.deptTypeList, // 科室属性
        deptSort: this.formValidate.deptSort, // 顺序号
        deptOtherCode: this.formValidate.deptOtherCode, // 辅助编码
        deptAuxId: this.formValidate.deptAuxId, // 辅助属性
        detailFlag: this.formValidate.detailFlag ? '1' : '0',
        deptId: tableDeptId
      };
      this.loadLeft = true;
      this.$store.dispatch('deptUpdate', params).then(res => {
        this.loadLeft = false;
        if (res.data.code === 200) {
          // 方法
          util.showMsg(this, { succ: '操作成功' });
          this.clickTreeItem(this.nodeClick);
          this.showModal.addTableShow = false;
          this.fetchTreeDetail();
        } else {
          util.showMsg(this, { diy: res.data.message });
          this.fetchTreeDetail();
        }
      })
    },
    //保存确认
    okFuc () {
      if (this.formValidate.parentDeptId == undefined) {
        util.showMsg(this, { warning: '请选择科室类型' })
        return
      }
      this.page = 1
      this.tabPage = 1
      this.$refs['deptFormRef'].validate(valid => {
        if (valid) {
          this.inpDis = true
          if (!this.showModal.editShow) {
            this.addBtnFuc();
          } else {
            this.editBtnFuc();
            this.showModal.editShow = false;
          }
          this.showModal.addTableShow = false;
        }
      });
    },
    //清空表格下方表单内容
    cancelFuc () {
      this.inpDis = true;
      if (!this.showModal.editShow) {
        this.formValidate.parentDeptId = '';
        this.showModal.addTableShow = false;
        this.$refs['deptFormRef'].resetFields();
        this.formValidate.pyCode = '';
        this.formValidate.wbCode = ''; // 五笔码
        this.formValidate.deptName = ''; // 科室名字
        this.formValidate.detailFlag = false;
        this.formValidate.deptPosition = ''; // 科室位置
        this.deptTypeList = []; // 科室属性
        this.formValidate.deptSort = ''; // 顺序号
        this.formValidate.deptOtherCode = ''; // 辅助编码
        this.formValidate.deptAuxId = ''; // 辅助属性
        this.formValidate.parentDeptId = 1; // 科室类型
      }
      this.showModal.addTableShow = false;
    },
    //分页
    changPage (Page) {
      const params = { page: Page, size: this.pageSize };
      if (this.nodeClick[0].nodeKey !== 0) {
        let deptData = this.nodeClick;
        deptData = deptData.concat(deptData[0].children);
        let deptId = util.getOne(deptData, 'id');
        params.deptIdList = deptId.join(',');
      }
      this.$store.dispatch('departTabList', params)
        .then(res => {
          if (res.data.code !== 200) {
            util.showMsg(this, { diy: res.data.message });
          } else {
            setTimeout(() => {
              this.tabPage = res.data.data.pages;
            }, 10)
            this.table.data = res.data.data.list;
          }
        })
    },
    //搜索
    search () {
      if (!util.isEmpty(this.searchVal)) {
        let id = util.findOfObject(this.searchVal, this.selecteds.deptList, 'deptName', 'deptId');
        if (id) {
          let treeItems = util.treeMap(this.treeData[0], id);
          if (!treeItems) {
            util.showMsg(this, { warning: `没有${this.searchVal}科室` });
            return;
          }
          if (treeItems.nodeKey !== 0) {
            this.$refs['departmentTree'].handleSelect(treeItems.nodeKey);
            this.$nextTick().then(
              () => {
                util.isEmpty(document.querySelector('.department-tree-content span.ivu-tree-title.ivu-tree-title-selected')) ? '' : document.querySelector('.department-tree-content span.ivu-tree-title.ivu-tree-title-selected').scrollIntoView({
                  behavior: "instant",
                  block: "end",
                  inline: "nearest"
                });
              }
            )
          }
        }
      }
    }
  }
};
</script>


<style lang='less' scoped>
@import "../../../../styles/common.less";
@import "./department-basic-data.less";

#tab {
  height: 100%;
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
.formSelect .ivu-select-selection {
  overflow-y: auto;
  max-height: 33px;
}

.active {
  background-color: #d5e8fc;
}

.flagColor {
  color: red;
}

.ivu-page-simple .ivu-page-simple-pager input {
  width: 45px !important;
}

.formCladd .ivu-form-item {
  margin-bottom: 18px !important;
}
</style>
