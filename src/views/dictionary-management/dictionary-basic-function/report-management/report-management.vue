<template>
  <Row class="bg-white report-management"
       style="display: flex;">
    <i-Col span="6"
           style="margin-top: -13px;padding: 13px 18px 0 0;border-right:2px solid #f3f3f3">
      <Row class="btn"
           style="padding: 0 0 18px 0;height: auto;">
        <i-Col span="7">
          <Button type="primary"
                  @click.native="addReport('curTable')">
            <i class="iconfont icontianjia"></i>
            新增
          </Button>
        </i-Col>
        <i-Col span="7"
               style="margin-left:8px"
               @click.native="updateReport('curTable')">
          <Button type="primary">
            <i class="iconfont iconxiugai1"
               style="font-size: 15px;"></i>
            修改
          </Button>
        </i-Col>
        <i-Col span="7"
               style="margin-left:8px">
          <Button type="primary"
                  @click.native="delReport('curTable')">
            <i class="iconfont iconshanchu"
               style="font-size: 15px;"></i>
            删除
          </Button>
        </i-Col>
      </Row>
      <form class="form-horizontal">
        <div class="form-group">
          <Select style="width: 100%"
                  v-model="selects.query"
                  placeholder="请输入报名表名称查询"
                  filterable
                  remote
                  :remote-method="remoteMethod"
                  :loading="selects.loading"
                  @on-change="queryChange"
                  clearable>
            <Option v-for="(option, index) in selects.options"
                    :value="option.reportName"
                    :key="index">{{option.reportName}}
            </Option>
          </Select>
        </div>
      </form>
      <div style="height: 75%;overflow-y: auto;width:224px;">
        <Tree ref="leftTree"
              :data="leftTreeData"
              style="overflow-x:hidden"
              @on-select-change="clickTree"
              class="report-tree-content"></Tree>
      </div>
    </i-Col>
    <i-Col class="content"
           style="padding: 0 0 0 18px;">
      <p style="">报表预览
        <a href="report://"
           style="margin-left:10px">
          <i class="iconfont icon-xiugai1"
             style="font-size: 15px;"></i>编辑
        </a>
        <!-- <a href="dingding://" style="margin-left:20px">
                                  打开钉钉
                              </a> -->
      </p>
      <div style="height: 90%;overflow: hidden;">
        <iframe id="iframes"
                align=middle
                marginwidth=0
                vspace=-170
                hspace=0
                :src="show.reportUrl"
                style="min-height:600px;width:100%;height:100%;border: none;"></iframe>

      </div>
    </i-Col>
    <Modal v-model="showModal.action"
           width="500"
           :mask-closable="false"
           :closable="false">
      <div slot="footer">
        <Button type="text"
                size="large"
                @click="showModal.action = false">取消
        </Button>
        <Button type="primary"
                size="large"
                @click="addOrModify">确定
        </Button>
      </div>
      <Form ref="curTable"
            :model="curTable"
            :rules="ruleValidate"
            :label-width="80">
        <FormItem label="报表名称"
                  prop="reportName">
          <Input v-model="curTable.reportName"
                 style="width:388px"
                 placeholder="请填写报表名称" />
        </FormItem>
        <FormItem label="报表连接"
                  prop="reportUrl">
          <Input v-model="curTable.reportUrl"
                 style="width:388px"
                 placeholder="请填写报表连接" />
        </FormItem>
        <FormItem label="报表参数"
                  prop="reportParm">
          <Input v-model="curTable.reportParm"
                 style="width:388px"
                 placeholder="请填写报表参数" />
        </FormItem>
        <div class="clearfix">
          <FormItem class="fl"
                    label="拼  音  码"
                    prop="pyCode"
                    style="width:48%;">
            <Input v-model="curTable.pyCode"
                   style="width:144px"
                   placeholder="请填写拼音码" />
          </FormItem>
          <FormItem class="fr"
                    label="五  笔  码"
                    prop="wbCode"
                    style="width:48%;">
            <Input v-model="curTable.wbCode"
                   style="width:144px"
                   placeholder="请填写五笔码" />
          </FormItem>
        </div>
      </Form>
    </Modal>
    <!-- 删除确认 -->
    <confirmDeletion :show="showModal.showDel"
                     :msg="showModal.delMsg"
                     @ok="del"
                     @close="showModal.showDel=false" />
  </Row>
</template>

<script>
import drag from 'vue-power-drag';
import util from '../../../../libs/util.js'
import confirmDeletion from '../../../components/confirmDeletion.vue';

export default {
  name: 'report-management',
  components: {
    'power-drag': drag,
    confirmDeletion
  },
  data () {
    return {
      showModal: {
        action: false,
        showDel: false,
        delMsg: ''
      },
      curTable: {},
      clickParams: '',
      ruleValidate: {
        reportName: [
          { required: true, message: '请填写报表名称', trigger: 'blur' }
        ],
      },
      selects: {
        query: '',
        loading: false,
        options: [],
        reportTypeList: [],
        leftTreeList: []
      },
      show: {
        name: ''
      },
      leftTreeData: [
        {
          title: '全部',
          expand: true,
          children: []
        }
      ],
      myList: [
        {
          "id": 1,
          "x": 1,
          "y": 1,
          "sizex": 6,
          "sizey": 3
        }, {
          "id": 2,
          "x": 7,
          "y": 1,
          "sizex": 5,
          "sizey": 3
        }, {
          "id": 3,
          "x": 1,
          "y": 4,
          "sizex": 3,
          "sizey": 3
        }, {
          "id": 3,
          "x": 4,
          "y": 4,
          "sizex": 3,
          "sizey": 3
        }, {
          "id": 4,
          "x": 7,
          "y": 4,
          "sizex": 5,
          "sizey": 3
        }
      ],
      baseWidth: 0, //最小单元格宽度
      baseHeight: 0, //最小单元格高度
      baseMarginLeft: 0, //单元格左边距
      baseMarginTop: 0,  //单元格上边距
      draggable: false,  //是否允许拖动
      testList: [{}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}]
    }
  },
  mounted () {
    let w = $('.report-management').width() - 240
    $('.report-management .content').width(w)
  },
  created () {
    this.init()
    return
    //屏幕适配，使得当前布局能在所有分辨率下适用，此为1366*768分辨率下完成
    let screenWidth = window.innerWidth;
    let screenHeight = window.innerHeight;
    this.baseWidth = 90.8333 * (screenWidth / 1366);
    this.baseHeight = 100 * (screenHeight / 768);
    this.baseMarginLeft = 10 * (screenWidth / 1366);
    this.baseMarginTop = 10 * (screenHeight / 768);
  },
  watch: {
    clickParams (val) {
      console.log(val)
    },
  },
  methods: {
    remoteMethod (query) {
      if (query !== '') {
        this.selects.loading = true;
        setTimeout(() => {
          this.selects.loading = false;
          const list = this.selects.leftTreeList.map(item => {
            return {
              reportName: item.reportName,
              pyCodeLower: item.pyCode.toLowerCase(),
              pyCodeUpper: item.pyCode.toUpperCase(),
              wbCode: item.wbCode
            };
          });
          this.selects.options = util.findKeys(query, list, ['pyCodeLower', 'pyCodeUpper', 'reportName', 'wbCode'])
        }, 200);
      } else {
        this.selects.options = [];
      }
    },
    init () {
      console.log(':' == '：')
      // 报表类型
      this.$store.dispatch("getFDAttr", {
        flagdataCode: "FD000199",
        hospitalId: this.$store.state.userInfoObj.hospitalId
      }).then(res => {
        if (res.data.code !== 200) {
          util.showMsg(this, { diy: res.data.message })
        } else {
          this.selects.reportTypeList = res.data.data
          this.getReport()
          this.show = {}
          this.clickParams = []
        }
      })
    },
    getReport () {
      this.$store.dispatch('getCustomReportDicts', { hospitalId: this.$store.state.userInfoObj.hospitalId }).then(res => {
        if (res.data.code === 200) {
          util.id2Name(res.data.data.list, 'reportType', 'reportTypeName', this.selects.reportTypeList, 'flagdataValue', 'flagdataValueRemark')
          let resList = []   //禅道需求 273  查询时，不出"报表类型=打印"的
          res.data.data.list.map(item => {
            if (item.reportType != 2) {
              resList.push(item)
            }
          })
          this.leftTreeData = util.getTree(resList, 'customReportId', 'reportName', 'parentId', '全部', 0);
          this.selects.leftTreeList = resList
        } else {
          util.showMsg(this, { diy: res.data.message })
        }
      })
    },
    queryChange (val) {
      if (!val) {
        this.selects.options = []
        return false
      }
      let id = util.findOfObject(val, this.selects.leftTreeList, 'reportName', 'customReportId');
      let treeItem = util.treeMap({ children: this.leftTreeData }, id);
      if (!treeItem) {
        util.showMsg(this, { diy: `没有${val}报表` });
        return;
      }
      if (treeItem.nodeKey !== 0) {
        this.$refs['leftTree'].handleSelect(treeItem.nodeKey);
        this.$nextTick().then(() => {
          document.querySelector('.report-tree-content span.ivu-tree-title.ivu-tree-title-selected').scrollIntoView({
            behavior: "instant",
            block: "end",
            inline: "nearest"
          });
        })
      }
    },
    clickTree (val) {
      if (util.isEmpty(val)) return
      let item = val
      this.clickParams = item
      this.show = val[0].data
    },
    handleReset (name) {
      this.showModal.action = false
      // this.$refs[name].resetFields();
    },
    addReport (name) {
      this.curTable = {}
      this.$refs[name].resetFields();
      if (util.isEmpty(this.clickParams)) {
        util.showMsg(this, { warning: '请选择报表节点' })
        return
      }
      this.showModal.action = true
    },
    updateReport (name) {
      if (util.isEmpty(this.clickParams)) {
        util.showMsg(this, { warning: '请选择报表节点' })
        return
      } else if (util.isEmpty(this.clickParams[0].data.reportName)) {
        util.showMsg(this, { warning: '请选择正确的报表节点' })
        return
      }
      this.$refs[name].resetFields();
      this.showModal.action = true
      this.curTable = util.deepCopy(this.clickParams[0].data)
    },
    addOrModify () {
      this.$refs['curTable'].validate(valid => {
        if (valid) {
          if (util.isEmpty(this.curTable.customReportId)) {
            this.addAjax()
          } else {
            this.updateAjax()
          }
        }
      })
    },
    addAjax () {
      this.showModal.action = false
      let data = {
        "createrId": this.$store.state.userInfoObj.userId,
        "hospitalId": this.$store.state.userInfoObj.hospitalId,
        "parentId": this.clickParams[0].id,
        "pyCode": this.curTable.pyCode,
        "reportName": this.curTable.reportName,
        "reportParm": this.curTable.reportParm,
        // "reportType": this.curTable.reportType, //禅道需求 273  隐藏报表类型下拉框，默认成"查询"
        "reportType": 1,
        "reportUrl": this.curTable.reportUrl,
        "wbCode": this.curTable.wbCode
      }
      this.$store.dispatch('addCustomReportDict', data).then(res => {
        if (res.data.code === 200) {
          this.init()
        } else {
          util.showMsg(this, { diy: res.data.message })
        }
      })
    },
    updateAjax () {
      this.showModal.action = false
      let data = {
        "createrId": this.$store.state.userInfoObj.userId,
        "customReportId": this.clickParams[0].data.customReportId,
        "dataVersion": this.clickParams[0].data.dataVersion,
        "hospitalId": this.clickParams[0].data.hospitalId,
        "parentId": this.clickParams[0].data.parentId,
        "pyCode": this.curTable.pyCode,
        "reportName": this.curTable.reportName,
        "reportParm": this.curTable.reportParm,
        // "reportType": this.curTable.reportType,  //禅道需求 273  隐藏报表类型下拉框，默认成"查询"
        "reportType": 1,
        "reportUrl": this.curTable.reportUrl,
        "wbCode": this.curTable.wbCode
      }
      this.$store.dispatch('updateCustomReportDict', data).then(res => {
        util.showMsg(this, res.data)
        if (res.data.code === 200) {
          this.init()
        } else {
          util.showMsg(this, { diy: res.data.message })

        }
      })
    },
    // 确认删除
    delReport () {
      if (!util.isEmpty(this.clickParams[0].children)) {
        util.showMsg(this, { warning: '请先清除完子级才能删除' })
        return
      }
      this.showModal.delMsg = '确定要删除【' + this.clickParams[0].data.reportName + '】吗？'
      this.showModal.showDel = true
    },
    // 删除
    del () {
      let data = {
        "id": this.clickParams[0].data.customReportId
      }
      this.$store.dispatch('delCustomReportDict', data).then(res => {
        this.showModal.showDel = false
        if (res.data.code === 200) {
          this.init()
        } else {
          util.showMsg(this, { diy: res.data.message })
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
@import "../../../../styles/common.less";

.report-management button:last-child {
  margin: 0;
}

.report-management .content p {
  font-size: 14px;
  margin-bottom: 16px;
}

.report-management .control-label {
  width: 56px;
}
</style>
