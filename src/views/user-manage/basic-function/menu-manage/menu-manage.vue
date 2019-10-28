<template>
  <div class="item bg-white menu-manage"
       style="overflow-y:auto;height: 100%;">
    <div v-for="(item) in listObj.menuList"
         :key="item.id">
      <!-- 一级 -->
      <div class="tit">
        <!-- 一级标题 -->
        <h2>{{ item.title }}</h2>
        <!-- 右侧图标 -->
        <div class="operation"
             v-if="superAdminshow"
             style="padding-right:22px">
          <Tooltip content="新增"
                   placement="top"
                   theme="light"
                   transfer>
            <i class="iconfont icontianjia ry-color"
               style="margin-right:10px;font-size:19px"
               @click="addMenuClick(item,1)"></i>
          </Tooltip>
          <Tooltip content="修改"
                   placement="top"
                   theme="light"
                   transfer>
            <i class="iconfont iconxiugai1 ry-color"
               style="margin-right:10px;font-size:19px"
               @click="editMenuClick(item,1)"></i>
          </Tooltip>
          <Tooltip content="删除"
                   placement="top"
                   theme="light"
                   transfer>
            <i class="iconfont iconshanchu ry-color"
               style="font-size:19px"
               @click="delMenuClick(item,1)"></i>
          </Tooltip>
        </div>
      </div>
      <!-- 二级 -->
      <div v-for="(child) in item.children"
           :key="child.id">
        <Collapse v-if="child.children.length!=0"
                  class="asd"
                  style="margin-top:5px">
          <Panel name="1"
                 style="font-size:15px"
                 class="menu-item">
            <!-- 二级标题 -->
            <span>{{child.title}}</span>
            <!-- 右侧图标 -->
            <div class="operation posiTionsP"
                 v-if="superAdminshow"
                 style="">
              <Tooltip content="新增"
                       placement="top"
                       theme="light"
                       transfer>
                <i class="iconfont icontianjia ry-color"
                   style="margin-right:10px;color:#d6d6d6"
                   @click="addMenuClick(child,2)"></i>
              </Tooltip>
              <Tooltip content="修改"
                       placement="top"
                       theme="light"
                       transfer>
                <i class="iconfont iconxiugai1 ry-color"
                   style="margin-right:10px;color:#d6d6d6"
                   @click="editMenuClick(child,2)"></i>
              </Tooltip>
              <Tooltip content="删除"
                       placement="top"
                       theme="light"
                       transfer>
                <i class="iconfont iconshanchu ry-color"
                   style="color:#d6d6d6;font-size:19px"
                   type="android-delete"
                   @click="delMenuClick(child,2)"></i>
              </Tooltip>
            </div>
            <!-- 三级 -->
            <Row slot="content">
              <i-Col span="24"
                     v-for="(childSon,c) in child.children"
                     :key="c">
                <span style="width:400px;padding-left:40px;cursor: pointer;">{{childSon.title}}</span>
                <span style="width:400px;text-align: left">{{childSon.data.modelRemark}}</span>
                <div v-if="superAdminshow"
                     style="padding-right:25px">
                  <Tooltip content="修改"
                           v-show="c==0"
                           placement="top"
                           theme="light"
                           transfer>
                    <i class="iconfont iconxiugai1 ry-color"
                       style="margin-right:10px;"
                       @click="editMenuClick(childSon,3)"></i>
                  </Tooltip>
                  <Tooltip content="删除"
                           v-show="c==0"
                           placement="top"
                           theme="light"
                           transfer>
                    <i class="iconfont iconshanchu ry-color"
                       type="android-delete;font-size:19px"
                       @click="delMenuClick(childSon,3)"></i>
                  </Tooltip>
                  <Tooltip content="修改"
                           v-show="c!=0"
                           placement="top"
                           theme="light"
                           transfer>
                    <i class="iconfont iconxiugai1 ry-color"
                       style="margin-right:10px;"
                       @click="editMenuClick(childSon,3)"></i>
                  </Tooltip>
                  <Tooltip content="删除"
                           v-show="c!=0"
                           placement="top"
                           theme="light"
                           transfer>
                    <i class="iconfont iconshanchu ry-color"
                       type="android-delete;font-size:19px"
                       @click="delMenuClick(childSon,3)"></i>
                  </Tooltip>
                </div>
              </i-Col>
            </Row>
          </Panel>
        </Collapse>
        <!-- 另一种二级 -->
        <Row v-else>
          <div class="pureMenu">
            <span>{{child.title}}</span>
            <div v-if="superAdminshow"
                 class="TooltipPureMenu">
              <Tooltip content="新增"
                       theme="light"
                       placement="top">
                <i class="iconfont icontianjia ry-color"
                   style="margin-right:10px;"
                   @click="addMenuClick(child,2)"></i>
              </Tooltip>
              <Tooltip content="修改"
                       theme="light"
                       placement="top">
                <i class="iconfont iconxiugai1 ry-color"
                   style="margin-right:10px;"
                   @click="editMenuClick(child,2)"></i>
              </Tooltip>
              <Tooltip content="删除"
                       theme="light"
                       placement="top">
                <i class="iconfont iconshanchu ry-color"
                   type="android-delete;font-size:19px"
                   @click="delMenuClick(child,2)"></i>
              </Tooltip>
            </div>
          </div>
        </Row>
      </div>
    </div>
    <!-- 新增修改弹窗 -->
    <Modal v-model="showModal.addOrUpdModel"
           :closable="false"
           width="450px"
           :mask-closable="false">
      <div slot="footer">
        <Button type="text"
                size="large"
                @click="showModal.addOrUpdModel=false">取消</Button>
        <Button type="primary"
                size="large"
                @click="addOrUpdFc"
                :loading="loading">保存</Button>
      </div>
      <Form class="form-horizontal"
            ref="formObj"
            :model="formObj"
            :rules="ruleValidate">
        <div class="form-group"
             v-show="!showModal.isUpd">
          <label for="menuName"
                 class="control-label">类型</label>
          <RadioGroup v-model="menuStyle"
                      style="display:flex">
            <Radio label="0">同级菜单</Radio>
            <Radio label="1">子级菜单</Radio>
          </RadioGroup>
        </div>
        <div class="form-group">
          <label for="menuName"
                 class="control-label">菜单名称</label>
          <Input v-model.trim="formObj.menuName"
                 id="menuName"
                 style="width: 321px" />
        </div>
        <div class="form-group">
          <label for="menuSort"
                 prop="menuSort"
                 class="control-label">菜单排序号</label>
          <Input v-model="formObj.menuSort"
                 id="menuSort"
                 :maxlength="6"
                 @on-change="ceshi"
                 style="width: 321px" />
        </div>
        <div class="form-group">
          <label for="basicMenuFlag"
                 class="control-label">菜单类型</label>
          <Select v-model="formObj.basicMenuFlag"
                  style="width:321px"
                  id="basicMenuFlag">
            <Option v-for="item in listObj.typeList"
                    :value="item.flagdataValue"
                    :key="item.flagdataValue">{{ item.flagdataValueRemark }}</Option>
          </Select>
        </div>
        <div class="form-group"
             style="position:relative">
          <label for="menuIcon"
                 class="control-label">菜单图标路径</label>
          <Input v-model.trim="formObj.menuIcon"
                 id="menuIcon"
                 style="width: 321px;" />
        </div>
        <div class="form-group">
          <label for="routeName"
                 class="control-label">控制器名称</label>
          <Input v-model.trim="formObj.routeName"
                 id="routeName"
                 style="width: 321px" />
        </div>
        <div class="form-group">
          <label for="menuUrl"
                 class="control-label">插件路径</label>
          <Input v-model.trim="formObj.menuUrl"
                 id="menuUrl"
                 style="width: 321px" />
        </div>
        <div class="form-group">
          <label for="pyCode"
                 class="control-label">拼音码</label>
          <Input v-model.trim="formObj.pyCode"
                 id="pyCode"
                 style="width: 321px" />
        </div>
        <div class="form-group">
          <label for="wbCode"
                 class="control-label">五笔码</label>
          <Input v-model.trim="formObj.wbCode"
                 id="wbCode"
                 style="width: 321px" />
        </div>
        <div class="form-group">
          <label for="modelRemark"
                 class="control-label">备注</label>
          <Input v-model.trim="formObj.modelRemark"
                 id="modelRemark"
                 type="textarea"
                 :autosize="{minRows: 2,maxRows: 5}"
                 style="width: 321px" />
        </div>
      </Form>
    </Modal>
    <comfirmDeletion class="aBox"
                     :show="showModal.delModal"
                     :msg="showModal.delMsg"
                     title='警告'
                     :btntext='showModal.delBtnText'
                     @ok="delMenuAjax"
                     :loading="delLoading"
                     @close="showModal.delModal=false" />
  </div>
</template>
<script>
import qs from 'qs';
import util from '@/libs/util'
import comfirmDeletion from '../../../components/confirmDeletion.vue'
export default {
  name: 'menu-manage',
  data () {
    const validateAge = (rule, value, callback) => {
      if (!Number.isInteger(value * 1)) {
        callback(new Error('序号只能为整数字'));
      } else if (value * 1 <= 0 && !util.isEmpty(value)) {
        callback(new Error('序号必须大于0'));
      } else if (util.isEmpty(value)) {
        if (this.showModal.isUpd) {
          callback(new Error('序号不能为空'));
        } else {
          callback();
        }
      } else {
        callback();
      }
    };
    return {
      ruleValidate: { // 新增弹框规则
        menuSort: [{ validator: validateAge, trigger: 'blur' }],
      },
      loading: false,   //保存loading
      superAdminshow: false,  //判断下拉框是否显示
      delLoading: false, //删除loading
      showModal: {
        delModal: false, //是否显示删除框
        delBtnText: '删除',
        delMsg: '',    //删除框显示内容
        addOrUpdModel: false, //判断弹框是否显示
        isUpd: false     //判断弹框的类型是否显示
      },
      listObj: {
        menuList: [
          { title: '' }
        ],   //页面菜单列表
        typeList: [],  //弹框菜单类型列表
        nameList: [],    //菜单下拉框
      },
      currObj: {
        currItem: {},  //弹框数据
      },
      menuStyle: '0', //弹框的类型选择
      formObj: {
        menuSort: null, //菜单排序号
        basicMenuFlag: null,  //菜单类型
        menuName: '',    //菜单名称
        routeName: '',    //控制器名称
        menuUrl: '',    //插件路径
        modelRemark: '',   //备注
        menuIcon: '',   //菜单图标路径
        wbCode: '',   //五笔码
        pyCode: ''   //拼音码
      },
      flagStatus: 1,
      changeStatus: '',
      listshow: false
    }
  },
  mounted () {
    this.$store.state.userInfoObj.loginName === 'SUPERADMIN' ? this.superAdminshow = true : this.superAdminshow = false
    this.$store.state.userInfoObj.userTypes * 1 === 1 && !util.isEmpty(this.$store.state.userInfoObj.personId) && this.$store.state.userInfoObj.personId != 0 ? this.listshow = true : this.listshow = false
    this.init();
  },
  watch: {
    'formObj.basicMenuFlag': function (val) { //新增，修改的菜单下拉框
      this.listObj.nameList = []
      if (val === '1') {
        let data = {
          hospitalId: this.$store.state.userInfoObj.hospitalId
        }
        this.$store.dispatch('getCustomReportDict', data).then(res => {
          if (res.data.code === 200) {
            this.listObj.nameList = res.data.data.list
          } else {
            util.showMsg(this, { diy: res.data.message });
          }
        })
      }
    },
  },
  components: { comfirmDeletion },
  methods: {
    ceshi (val) {      //菜单排序号的修改
      if (util.isEmpty(this.formObj.menuSort)) {
        if (!this.showModal.isUpd) {
          $("#menuSort").removeClass("redBorder");
        }
      } else {
        $("#menuSort").removeClass("redBorder");
      }
    },
    init () {
      //获取菜单列表
      this.$store.dispatch('getAttr', [{ 'flagdataCode': 'FD000005' }]).then(res => {
        if (res.data.code === 200) {
          this.listObj.typeList = res.data.data[0].commFlagDataList.filter(item => item.flagdataValueRemark != '自定义报表')
        } else {
          util.showMsg(this, { diy: res.data.message });
        }
      });
      this.getMenuLis()
    },
    getMenuLis () { // 获取树形菜单列表
      this.$store.dispatch('queryMenuListNew', { sysType: 'APP002' }).then(res => {
        if (res.data.code === 200) {
          this.listObj.menuList = util.getTree(
            res.data.data,
            'menuId',
            'menuName',
            'parentMenuId',
            '全部菜单', 0)[0].children;
        } else {
          util.showMsg(this, { diy: res.data.message });
        }
      })
    },
    addOrUpdFc () { //弹窗确认
      if (this.formCheck()) {
        return
      } else {
        if (this.showModal.isUpd) { // 修改
          this.editMenuAjax()
        } else { // 新增
          this.addMenuAjax()
        }
        this.showModal.addOrUpdModel = false
      }
    },
    addMenuClick (item, flag) { // 新增菜单弹窗
      this.flagStatus = flag;
      this.addload = true;
      this.clearCheck()
      this.showModal.isUpd = false
      this.currObj.currItem = {}
      this.currObj.currItem = util.deepCopy(item)
      this.formObj = {}
      this.menuStyle = '0'
      this.formObj.menuSort = null
      this.showModal.addOrUpdModel = true
    },
    addMenuAjax () { //新增菜单ajax
      let nowData = {
        "actionType": "",
        "basicMenuFlag": this.formObj.basicMenuFlag,
        "displayFlag": 1,
        "hospitalId": this.$store.state.userInfoObj.hospitalId,
        "menuCode": "",
        "menuIcon": this.formObj.menuIcon,
        "menuName": this.formObj.menuName,
        "menuSort": this.formObj.menuSort,
        "menuUrl": this.formObj.menuUrl,
        "modelId": 0,
        "modelRemark": this.formObj.modelRemark,
        "parentMenuId": this.menuStyle == '0' ? this.currObj.currItem.data.parentMenuId : this.currObj.currItem.id,
        "pyCode": util.isEmpty(this.formObj.pyCode) ? '' : this.formObj.pyCode.toUpperCase(),
        "routeName": this.formObj.routeName,
        "sysType": "APP002",
        "wbCode": this.formObj.wbCode
      }
      this.loading = true
      this.$store.dispatch('mdAddSysMenuNEW', nowData).then(res => {
        this.loading = false
        if (res.data.code === 200) {
          if (this.flagStatus * 1 === 1 && this.menuStyle * 1 === 0) {
            util.showMsg(this, { succ: '新增成功，下次登录有效且有子菜单方可展示！' })
          } else {
            util.showMsg(this, { succ: '新增成功，下次登录有效！' })
          }
          this.getMenuLis()
        } else {
          util.showMsg(this, { diy: res.data.message });
        }
      })
    },
    editMenuClick (item, flag) { // 修改菜单弹窗
      this.flagStatus = flag;
      this.clearCheck()
      this.showModal.isUpd = true
      this.currObj.currItem = {}
      let nowData = JSON.parse(JSON.stringify(item));
      this.currObj.currItem = nowData
      this.formObj = this.currObj.currItem.data
      this.showModal.addOrUpdModel = true
      this.formObj.modelRemark === '' ? this.changeStatus = '' : this.changeStatus = '不为空';
    },
    editMenuAjax () { // 修改菜单ajax
      let mome = '';
      if (this.changeStatus != '') {
        this.formObj.modelRemark === '' ? mome = '传负值' : mome = '';
      }
      let nowData = {
        "actionType": "",
        "basicMenuFlag": this.formObj.basicMenuFlag,
        "dataVersion": this.formObj.dataVersion,
        "hospitalId": this.$store.state.userInfoObj.hospitalId,
        "menuCode": this.formObj.menuCode,
        "menuIcon": this.formObj.menuIcon,
        "menuId": this.formObj.menuId,
        "menuName": this.formObj.menuName,
        "menuSort": this.formObj.menuSort,
        "menuUrl": this.formObj.menuUrl,
        "modelId": this.formObj.modelId,
        "modelRemark": mome === '' ? this.formObj.modelRemark : util.globalVariable.isNullStr,
        "parentMenuId": this.currObj.currItem.data.parentMenuId,
        "pyCode": util.isEmpty(this.formObj.pyCode) ? util.globalVariable.isNullStr : this.formObj.pyCode.toUpperCase(),
        "routeName": this.formObj.routeName,
        "sysType": "APP002",
        "wbCode": this.formObj.wbCode == '' ? util.globalVariable.isNullStr : this.formObj.wbCode,
      }
      this.loading = true
      this.$store.dispatch('mdUpdateSysMenuNEW', nowData).then(res => {
        this.loading = false
        if (res.data.code === 200) {
          if (this.flagStatus * 1 === 1 && this.flagStatus * 1 === 1 && this.menuStyle * 1 === 0) {
            util.showMsg(this, { succ: '修改成功，下次登录有效且有子菜单方可展示！' })
          } else {
            util.showMsg(this, { succ: '修改成功，下次登录有效！' })
          }
          this.getMenuLis()
        } else {
          util.showMsg(this, { diy: res.data.message });
        }
      })
    },
    delMenuClick (item) {  // 删除菜单弹窗
      this.currObj.currItem = {}
      if (item.children.length == 0) {
        this.currObj.currItem = util.deepCopy(item)
        this.showModal.delMsg = '确定要删除菜单【' + item.title + '】吗？'
        this.showModal.delModal = true
      } else {
        util.showMsg(this, { warning: '请先清空菜单下子菜单后再删除！' })
      }
    },
    delMenuAjax () {  // 删除菜单ajax
      this.delLoading = true
      this.$store.dispatch('delSysMenu', this.currObj.currItem.id).then(res => {
        this.delLoading = false
        if (res.data.code === 200) {
          util.showMsg(this, { succ: '删除成功，下次登录有效！' })
          this.getMenuLis()
        } else {
          util.showMsg(this, { diy: res.data.message });
        }
      })
      this.showModal.delModal = false
    },
    formCheck () { // 表单校验
      let nowFlag = false
      if (this.formObj.menuName == '' || this.formObj.menuName == null) {
        $("#menuName").addClass("redBorder");
        nowFlag = true
      }
      if (!Number.isInteger(this.formObj.menuSort * 1) && !util.isEmpty(this.formObj.menuSort)) {
        $("#menuSort").addClass("redBorder");
        nowFlag = true
      } else if (this.formObj.menuSort * 1 <= 0 && !util.isEmpty(this.formObj.menuSort)) {
        $("#menuSort").addClass("redBorder");
        nowFlag = true
      } else if (util.isEmpty(this.formObj.menuSort)) {
        if (this.showModal.isUpd) {
          $("#menuSort").addClass("redBorder");
          nowFlag = true
        }
      }
      if (this.formObj.basicMenuFlag == '' || this.formObj.basicMenuFlag == null) {
        $("#basicMenuFlag").addClass("redBorder");
        nowFlag = true
      }
      if (this.formObj.routeName == '' || this.formObj.routeName == null) {
        $("#routeName").addClass("redBorder");
        nowFlag = true
      }
      if (this.formObj.menuUrl == '' || this.formObj.menuUrl == null) {
        $("#menuUrl").addClass("redBorder");
        nowFlag = true
      }
      if (nowFlag) {
        util.showMsg(this, { warning: '请完善菜单信息' })
      }
      return nowFlag
    },
    clearCheck () {    //清除表格内的信息
      $("#menuName").removeClass("redBorder");
      $("#menuSort").removeClass("redBorder");
      $("#basicMenuFlag").removeClass("redBorder");
      $("#routeName").removeClass("redBorder");
      $("#menuUrl").removeClass("redBorder");
    }
  }
};
</script>
<style>
.menu-item .ivu-collapse-content {
  overflow: hidden;
  color: #000000;
  padding: 0px 0px;
  background-color: #fff;
}
.menu-manage::-webkit-scrollbar {
  width: 6px !important;
}
.menu-manage::-webkit-scrollbar-track {
  background-color: #f5f7f9;
}
.menu-manage::-webkit-scrollbar-thumb {
  background-color: #ccc !important;
  border-radius: 3px !important;
}
</style>
<style lang="less" scoped>
@import "../../../../styles/common.less";
Tooltip {
  z-index: 9999999;
}
.pureMenu {
  margin-top: 5px;
  border: 1px solid #e9e9e9;
  width: 100%;
  height: 40px;
  line-height: 38px;
  color: #666;
  padding-left: 38px;
  cursor: pointer;
  font-size: 16px;
}
.TooltipPureMenu {
  // display: inline-block;
  float: right;
  margin-right: 26px;
}
.ivu-dropdown {
  width: 100%;
  height: 32px;
  font-size: 16px;
  line-height: 32px;
  border-radius: 4px;
  padding: 0 15px;
  background: #2d8cf0;
  margin: 4px 0;
}
.ivu-dropdown a {
  color: #fff;
}
.ivu-dropdown .ivu-select-dropdown {
  width: 98%;
  margin: 0 11px;
}
.item .ivu-col {
  min-height: 40px;
  line-height: 35px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 0.1px solid #ddd;
}
.control-label {
  width: 84px;
}
.menu-manage .ivu-col:hover {
  background: #eaeaea;
}
.menu-manage .ivu-col .title {
  margin: 2px 0;
  font-size: 20px;
  color: #337ab7;
  text-align: center;
}
.operationCursor {
  cursor: pointer;
  font-size: 14px;
  color: #d6d6d6;
}
.item .ivu-col .remarks {
  border-top: 1px dashed #dadada;
  margin-bottom: 8px;
  overflow: hidden;
  font-size: 14px;
  height: 48px;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  padding-top: 6px;
  text-align: left;
}
.tit {
  display: flex;
  justify-content: space-between;
  margin: 5px 0;
  height: 36px;
  line-height: 40px;
}
.posiTionsP {
  position: absolute;
  right: 22px;
}
.tit h2 {
  display: inline-block;
}
.addItem {
  font-size: 80px;
  margin: 2px 0;
  text-align: center;
}
.operation {
  display: inline;
  margin-left: 2px;
  font-size: 16px;
  cursor: pointer;
}
.operation .ivu-i {
  margin-right: 2px;
}
.menu-item:hover div .operation {
  display: inline;
}

.ivu-upload {
  display: inline-block;
  margin-left: -3px;
}
.ivu-upload .ivu-btn {
  border: none;
  padding: 5px 8px;
  margin-bottom: 6px;
}
.ivu-modal-footer {
  padding: 4px 18px;
}
.ivu-modal .ivu-modal-footer .ivu-btn {
  padding: 3px 7px;
}
label[data-v-45871ee6],
input[data-v-45871ee6],
button[data-v-45871ee6],
select[data-v-45871ee6],
textarea[data-v-45871ee6] {
  line-height: 24px;
}
</style>

