<template>
  <div style="height:100%;padding: 13px 17px 0;background: #fff;width:100%;display:flex">
    <!-- 术语字典 -->
    <div class="ry-left-tree"
         style="width:260px">
      <div class="btn"
           style="padding: 0 0 18px 0;margin: 0;">
        <Button type="primary"
                @click="addDictionaries">
          <i class="iconfont icontianjia"></i>
          新增
        </Button>
        <Button type="primary"
                @click="updateDictionaries">
          <i class="iconfont iconxiugai1"></i>
          修改
        </Button>
        <Button type="primary"
                @click="delDictionaries">
          <i class="iconfont iconshanchu"></i>
          删除
        </Button>
      </div>
      <form class="form-horizontal">
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
      </form>
      <div style="height: 75%;overflow-y: auto;width:260px;">
        <Tree ref="leftTree"
              @on-select-change="leftTreeDetail"
              :data="leftTreeData"
              style="overflow-x:hidden"
              class="hospital-tree-content"></Tree>

      </div>
    </div>
    <div class="ry-right-tree-26"
         style="width:80%">
      <!-- 标准扩展字典 -->
      <div class="standard">
        <standard :standardParams="standardParams"
                  :tableData="tableData"
                  @refresh="refreshQuery" />
      </div>
    </div>
    <!-- 新增医院基础数据总记录 -->
    <Modal v-model="addDictModal"
           width="420px"
           title="新增自定义数据字典">
      <Form ref="formValidateAdd"
            class="hospFrom"
            :model="formValidateAdd"
            :rules="ruleValidate"
            :label-width="90">
        <FormItem label="字典名称"
                  prop="basicDataName">
          <Input v-model.trim="formValidateAdd.basicDataName"
                 style="width: 300px;" />
        </FormItem>
        <FormItem style="display:inline-block;width: 50%;"
                  label="拼音码"
                  prop="pyCode">
          <Input v-model.trim="formValidateAdd.pyCode"
                 style="width: 107px;" />
        </FormItem>
        <FormItem style="display:inline-block;width: 49%;"
                  label="五笔码"
                  prop="wbCode">
          <Input v-model.trim="formValidateAdd.wbCode"
                 style="width: 106px;" />
        </FormItem>
        <FormItem label="扩展字段说明"
                  :label-width="96"
                  prop="explain">
          <Input v-model.trim="formValidateAdd.explain"
                 style="width:294px"
                 type="textarea"
                 placeholder='请输入标准JSON格式……'
                 :autosize="{minRows: 2,maxRows: 5}" />
        </FormItem>
      </Form>
      <div slot="footer">
        <Button type="text"
                @click="addDictModalCancel('formValidateAdd')">取消
        </Button>
        <Button type="primary"
                @click="addDictModalOk('formValidateAdd')">保存
        </Button>
      </div>
    </Modal>
    <!-- 修改医院基础数据总记录 -->
    <Modal v-model="updateDictModal"
           width="420px"
           title="编辑数据字典">
      <Form ref="formValidateUpdate"
            :model="formValidateUpdate"
            :rules="ruleValidate"
            :label-width="80">
        <FormItem label="字典名称"
                  prop="basicDataName">
          <Input v-model.trim="formValidateUpdate.basicDataName"
                 style="width: 300px;"
                 :disabled="disabled" />
        </FormItem>
        <FormItem style="display:inline-block;width: 50%;"
                  label="拼音码"
                  prop="pyCode">
          <Input v-model.trim="formValidateUpdate.pyCode"
                 style="width: 107px;" />
        </FormItem>
        <FormItem style="display:inline-block;width: 49%;"
                  label="五笔码"
                  prop="wbCode">
          <Input v-model.trim="formValidateUpdate.wbCode"
                 style="width: 106px;" />
        </FormItem>
        <FormItem label="扩展字段说明"
                  :label-width="96"
                  prop="explain">
          <Input v-model.trim="formValidateUpdate.explain"
                 style="width:285px"
                 placeholder='请输入标准JSON格式……'
                 type="textarea"
                 :autosize="{minRows: 2,maxRows: 5}" />
        </FormItem>
      </Form>
      <div slot="footer">
        <Button type="text"
                @click="updateDictModalCancel('formValidateUpdate')">取消
        </Button>
        <Button type="primary"
                @click="updateDictModalOk('formValidateUpdate')">保存
        </Button>
      </div>
    </Modal>
    <!-- 删除自定义数据 -->
    <Modal v-model="delDictModal"
           width="360">
      <p slot="header"
         style="color:#f60;text-align:center">
        <Icon type="information-circled"></Icon>
        <span>删除确认</span>
      </p>
      <div style="text-align:center">
        <p>确定删除【{{ delTitle }}】？</p>
      </div>
      <div slot="footer">
        <Button type="error"
                size="large"
                long
                :loading="modal_loading"
                @click="delDictModalOk">删除
        </Button>
      </div>
    </Modal>
  </div>
</template>

<script>
import util from '../../../../libs/util.js';
import standard from './components/standard.vue';

export default {
  name: "hospital-basic-data",
  data () {
    return {
      nowTreeData: [],
      selects: {
        query: '',
        loading: false,
        options: []
      },
      leftTreeData: [
        {
          title: '全部',
          expand: true,
          id: 0,
          children: [
            {
              title: '标准扩展字典',
              expand: true,
              children: []
            },
            {
              title: '自定义数据字典',
              expand: true,
              children: []
            }
          ]
        }
      ],
      leftTreeList: [],
      addDictModal: false,
      formValidateAdd: {
        basicDataName: '',
        pyCode: '',
        wbCode: '',
        explain: ''
      },
      updateDictModal: false,
      formValidateUpdate: {
        basicDataName: '',
        pyCode: '',
        wbCode: '',
        explain: '',
        dataVersion: '',
        basicdataId: ''
      },
      delDictModal: false,
      modal_loading: false,
      ruleValidate: {
        basicDataName: [
          { required: true, message: '请填写字典名称', trigger: 'blur' }
        ]
      },
      standard: {
        flag: true
      },
      delTitle: '',
      delBasicdataId: '',
      disabled: false,
      standardParams: [],
      tableData: 0 //左侧树选中状态
    }
  },
  components: {
    standard
  },
  methods: {
    init () {
      this.$store.dispatch("termDictInit", { hospitalId: this.$store.state.userInfoObj.hospitalId }).then(res => {
        if (res.data.code == 200) {
          this.$store.dispatch("getTreeList", { hospitalId: this.$store.state.userInfoObj.hospitalId }).then(res => {
            if (res.data.code === 200) {
              let list = res.data.data.list
              this.leftTreeList = list
              this.leftTreeList.map((val, i) => {
                val.id = val.basicdataId
              })
              this.leftTreeData[0].children[0].children = [];
              this.leftTreeData[0].children[1].children = [];
              let num = 0;
              let num2 = 0;
              if (!util.isEmpty(list)) {
                list.map((val, i) => {
                  if (val.identificationFlag != '') {
                    num++
                    this.leftTreeData[0].children[0].children.push(val)
                    this.leftTreeData[0].children[0].children.map((value, index) => {
                      val.title = value.basicDataName
                      val.id = value.basicdataId
                      val.index = num
                      val.children = []
                    })
                  } else {
                    num2++
                    this.leftTreeData[0].children[1].children.push(val)
                    this.leftTreeData[0].children[1].children.map((value, index) => {
                      val.title = value.basicDataName
                      val.id = value.basicdataId
                      val.index = num2
                      val.children = []
                    })
                  }
                })
              }
            } else {
              util.showMsg(this, { diy: res.data.message })
            }
          })
        } else {
          util.showMsg(this, { diy: res.data.message })
        }
      })
      this.leftTreeDetail()

    },
    // 新增医院基础数据总记录
    addDictionaries () {
      this.addDictModal = true
      this.formValidateAdd.basicDataName = ''
      this.formValidateAdd.pyCode = ''
      this.formValidateAdd.wbCode = ''
      this.formValidateAdd.explain = ''
    },
    // js判断字符串是否为JSON格式
    isJSON (str) {
      if (typeof str == 'string') {
        try {
          var obj = JSON.parse(str);
          if (typeof obj == 'object' && obj) {
            return true;
          } else {
            return false;
          }

        } catch (e) {
          return false;
        }
      }
    },
    //左侧树新增  保存
    addDictModalOk (name) {
      this.$refs[name].validate((valid) => {
        if (valid) {
          let data = {
            basicDataName: this.formValidateAdd.basicDataName,
            hospitalId: this.$store.state.userInfoObj.hospitalId,
            extExplain: this.formValidateAdd.explain,
            pyCode: this.formValidateAdd.pyCode,
            wbCode: this.formValidateAdd.wbCode,
            a: this.formValidateAdd.numberSort,
            initializeFlag: "0"
          }
          if (this.formValidateAdd.explain) {
            if (!this.isJSON(this.formValidateAdd.explain)) {
              util.showMsg(this, { warning: '备注信息填写格式不是标准JSON格式' });
              return
            }
          }
          this.addDictModal = false
          this.$store.dispatch("addHospitalBasic", data).then(res => {
            if (res.data.code === 200) {
              util.showMsg(this, { succ: "新增成功" });
              this.init()
            } else {
              util.showMsg(this, { diy: res.data.message })
            }
          })
        } else {
          util.showMsg(this, { warning: "请填写字典名称" });
        }
      })
    },
    //左侧树新增   取消
    addDictModalCancel (name) {
      this.addDictModal = false
      this.$refs[name].resetFields();
    },
    // 修改医院基础数据总记录
    updateDictionaries () {
      let params = this.$refs["leftTree"].getSelectedNodes()
      if (params == '') {
        util.showMsg(this, { warning: "未选择节点" })
      } else {
        if (util.isEmpty(params[0].basicDataCode)) {
          this.disabled = false
          this.updateDictModal = true
          this.assignment(params[0])
        } else {
          this.disabled = true
          this.assignment(params[0])
        }
      }
    },
    //复现选中数据
    assignment (params) {
      this.updateDictModal = true
      this.formValidateUpdate.basicDataName = params.title
      this.formValidateUpdate.pyCode = params.pyCode
      this.formValidateUpdate.wbCode = params.wbCode
      this.formValidateUpdate.explain = params.extExplain
      this.formValidateUpdate.dataVersion = params.dataVersion
      this.formValidateUpdate.basicdataId = params.basicdataId
    },
    //  修改弹框 保存
    updateDictModalOk (name) {
      this.$refs[name].validate((valid) => {
        if (valid) {
          let data = {
            basicDataName: this.formValidateUpdate.basicDataName,
            extExplain: this.formValidateUpdate.explain,
            pyCode: this.formValidateUpdate.pyCode,
            wbCode: this.formValidateUpdate.wbCode,
            dataVersion: this.formValidateUpdate.dataVersion,
            basicdataId: this.formValidateUpdate.basicdataId
          }
          if (this.formValidateUpdate.explain) {
            if (!this.isJSON(this.formValidateUpdate.explain)) {
              util.showMsg(this, { warning: '备注信息填写格式不是标准JSON格式' });
              return
            }
          }
          this.$store.dispatch("updateHospitalBasic", data).then(res => {
            if (res.data.code === 200) {
              util.showMsg(this, { succ: "修改成功" })
              this.init()
            } else {
              util.showMsg(this, { diy: res.data.message })
            }
          })
          this.updateDictModal = false
        }
      })
    },
    //修改取消
    updateDictModalCancel (name) {
      this.updateDictModal = false
      this.$refs[name].resetFields();
    },
    //左侧树修改按钮
    delDictionaries () {
      let params = this.$refs["leftTree"].getSelectedNodes()
      if (params == '') {
        util.showMsg(this, { warning: "未选择节点" })
      } else {
        this.delTitle = params[0].title
        if (util.isEmpty(params[0].identificationFlag)) {
          this.delDictModal = true
          this.delBasicdataId = params[0].basicdataId
        } else {
          util.showMsg(this, { warning: "标准扩展字典不能删除" })
        }
      }
    },
    //删除确认
    delDictModalOk () {
      this.modal_loading = true
      let data = {
        id: this.delBasicdataId
      }
      this.$store.dispatch("delHospitalBasic", data).then(res => {
        this.modal_loading = false
        if (res.data.code === 200) {
          this.delDictModal = false
          util.showMsg(this, { succ: "删除成功" })
          this.init()
          this.standardParams = []
        } else {
          util.showMsg(this, { diy: res.data.message })
        }
      })
    },
    //左侧树 远程搜索
    remoteMethod (query) {
      if (query !== '') {
        this.selects.loading = true;
        setTimeout(() => {
          this.selects.loading = false;
          const list = this.leftTreeList.map(item => {
            return {
              value: item.basicDataName,
              label: item.basicDataName,
              pyCodeLower: item.pyCode.toLowerCase(),
              pyCodeUpper: item.pyCode.toUpperCase(),
              wbCode: item.wbCode,
              id: item.basicdataId
            };
          });
          this.selects.options = util.findKeys(query, list, ['pyCodeLower', 'pyCodeUpper', 'label', 'wbCode'])
        }, 200);
      } else {
        this.selects.options = [];
      }
    },
    // 查询
    queryChange (val) {
      if (util.isEmpty(val)) return
      let id = util.findOfObject(val, this.leftTreeList, 'basicDataName', 'basicdataId');
      let treeItem = util.treeMap(this.leftTreeData[0], id);
      if (!treeItem) {
        util.showMsg(this, { warning: `没有${val}医疗机构` });
        return;
      }
      if (treeItem.nodeKey !== 0) {
        this.$refs['leftTree'].handleSelect(treeItem.nodeKey);
        this.$nextTick().then(() => {
          document.querySelector('.hospital-tree-content span.ivu-tree-title.ivu-tree-title-selected').scrollIntoView({
            behavior: "instant",
            block: "end",
            inline: "nearest"
          });
        })
      }
    },
    //左侧树选中
    leftTreeDetail (params) {
      if (util.isEmpty(params)) {
        this.tableData = 0
        return
      } else {
        this.tableData = 1
      }
      this.nowTreeData = params
      if (util.isEmpty(params[0].children)) {
        this.standardParams = []
        this.leftTreeData[0].children[0].children.map((val, i) => {
          if (val.title === params[0].title) {
            this.standardParams.push(val)
            this.standardParams.push({ identificationFlag: params[0].identificationFlag })
          }
        })
        this.leftTreeData[0].children[1].children.map((val, i) => {
          if (val.title === params[0].title) {
            this.standardParams.push(val)
            this.standardParams.push({ identificationFlag: params[0].identificationFlag })
          }
        })
      } else {
        this.standardParams = []
      }
    },
    //获取standard组件传递  修改or扩展  刷新表格
    refreshQuery (val) {
      this.leftTreeDetail(this.nowTreeData)
    }
  },
  mounted () {
    this.init()
  }
}
</script>
<style>
.hospFrom .ivu-form-item .ivu-form-item-content .ivu-form-item-error-tip {
  position: absolute;
  top: 100%;
  /* left: 80px; */
  line-height: 1;
  padding-top: 6px;
  color: #ed3f14;
}
</style>

<style lang="less" scoped>
@import "../../../../styles/common.less";
@import "./hospital-basic-data.less";

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
<style lang="less">
.ivu-page-simple .ivu-page-simple-pager input {
  width: 40px !important;
}
</style>

