<template>
    <Row class="clearfix bg-white medical-institutions"
         style="height:97%">
        <i-Col span="8"
               class="ry-left-tree"
               style="margin-top: -13px;padding-top: 13px;">
            <!-- v-show = fasle  预留后用 -->
            <div class="btnmedical"
                 v-show="false">
                <Button type="primary"
                        @click="addHospitalName">
                    <i class="iconfont icon-tianjia"
                       style="font-size: 14px;"></i>
                    新增
                </Button>
                <Button type="primary"
                        @click="updateHospitalName">
                    <i class="iconfont icon-xiugai1"
                       style="font-size: 15px;"></i>
                    修改
                </Button>
                <Button type="primary"
                        @click="delHospitalName">
                    <i class="iconfont icon-shanchu"
                       style="font-size: 15px;"></i>
                    删除
                </Button>
            </div>
            <!-- v-show = fasle  预留后用 -->
            <form class="form-horizontal"
                  v-show="false">
                <div class="form-group">
                    <Select style="width: 224px"
                            v-model="selects.query"
                            placeholder="请输入医疗机构名称或拼音码"
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
            <!-- 左侧树 -->
            <div style="height: 75%;overflow-y: auto;width:224px;">
                <Tree ref="leftTree"
                      @on-select-change="leftTreeChange"
                      :load-data="loadData"
                      :data="leftTreeData"
                      style="overflow-x:hidden"></Tree>
            </div>
        </i-Col>
        <!-- 左侧form表单 -->
        <i-Col span="18"
               class=""
               style="width:77%;margin-left:10px">
            <div style="height:45px;margin-left:16px">
                <h3 class="fl">详细信息</h3>
                <div class="btnmedical fr">
                    <!-- <Button type="primary"
                            @click="cancelDetail">
                      <i class="iconfont icon-cuohao"></i>
                      取消</Button> -->
                    <Button type="primary"
                            @click="preservation"
                            :loading="loadingBtn"
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
                            <label for="organizationCode"
                                   class="control-label"><span>*</span>组织机构代码</label>
                            <i-Input v-model.trim="curTable.organizationCode"
                                     id="organizationCode"
                                     class="tow"></i-Input>
                        </div>
                    </i-Col>
                    <i-Col span="16">
                        <div class="form-group">
                            <label for="hospitalName"
                                   class="control-label"><span>*</span>医疗机构名称</label>
                            <i-Input v-model.trim="curTable.hospitalName"
                                     class="one"></i-Input>
                        </div>
                    </i-Col>
                </Row>
                <Row>
                    <i-Col span="8">
                        <div class="form-group">
                            <label for="countryId"
                                   class="control-label"><span>*</span>国籍</label>
                            <longrangesearchselectElse direction='bottom'
                                                       :vModel.sync='selectSerachParamgj'
                                                       value="datavalueId"
                                                       label='dataValueRemark'
                                                       :spinShow='spinShowgj'
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
                            <label for="sexId"
                                   class="control-label"><span>*</span>卫生机构类别</label>
                            <longrangesearchselectElse direction='bottom'
                                                       :vModel.sync='selectSerachParamtype'
                                                       value="datavalueId"
                                                       id="hospitalClassId"
                                                       label='dataValueRemark'
                                                       :spinShow='spinShowtype'
                                                       class="tow"
                                                       :selectOptionsPage.sync='selectOptionsPagetype'
                                                       :propOptions.sync='selectOptionsListtype'
                                                       @currObject='selectObjecttype'
                                                       @getSelectOptions='getSelectOptionsFuntype'>
                            </longrangesearchselectElse>
                        </div>
                    </i-Col>
                    <i-Col span="8">
                        <div class="form-group">
                            <label for="sexId"
                                   class="control-label"><span>*</span>医院等级</label>
                            <Select v-model="curTable.hospitalGradeId"
                                    filterable
                                    class="tow"
                                    id="hospitalGradeId">
                                <Option v-for="item in curTable.hospitalGradeList"
                                        :value="item.flagdataValue"
                                        :key="item.flagdataValue">{{ item.flagdataValueRemark }}
                                </Option>
                            </Select>
                        </div>
                    </i-Col>
                </Row>
                <Row>
                    <i-Col span="16">
                        <div class="form-group">
                            <label for="unvalidDate"
                                   class="control-label"><span>*</span>地址</label>
                            <Cascader id="address"
                                      :data="addressData"
                                      v-model="selects.addressVal"
                                      trigger="hover"
                                      @on-change="addressChange"
                                      class="one"
                                      style="display:inline-block"
                                      placeholder="请选择地址"></Cascader>
                        </div>
                    </i-Col>
                    <i-Col span="8">
                        <div class="form-group">
                            <label for="townshipAddr"
                                   class="control-label">乡(镇)</label>
                            <i-Input v-model.trim="curTable.townshipAddr"
                                     id="townshipAddr"
                                     class="tow"></i-Input>
                        </div>
                    </i-Col>
                </Row>
                <Row>
                    <i-Col span="8">
                        <div class="form-group">
                            <label for="villageAddr"
                                   class="control-label">村</label>
                            <i-Input v-model.trim="curTable.villageAddr"
                                     id="villageAddr"
                                     class="tow"></i-Input>
                        </div>
                    </i-Col>
                    <i-Col span="8">
                        <div class="form-group">
                            <label for="addrNumber"
                                   class="control-label">门牌号码</label>
                            <i-Input v-model.trim="curTable.addrNumber"
                                     id="addrNumber"
                                     class="tow"></i-Input>
                        </div>
                    </i-Col>
                    <i-Col span="8">
                        <div class="form-group">
                            <label for="telephone"
                                   class="control-label"><span>*</span>联系电话</label>
                            <i-Input v-model.trim="curTable.telephone"
                                     id="telephone"
                                     class="tow"></i-Input>
                        </div>
                    </i-Col>
                </Row>
                <Row>
                    <i-Col span="8">
                        <div class="form-group">
                            <label for="phoneNumber"
                                   class="control-label"><span>*</span>邮政编码</label>
                            <i-Input v-model.trim="curTable.phoneNumber"
                                     id="phoneNumber"
                                     class="tow"></i-Input>
                        </div>
                    </i-Col>
                    <i-Col span="8">
                        <div class="form-group">
                            <label for="email"
                                   class="control-label">单位电子邮箱</label>
                            <i-Input v-model.trim="curTable.email"
                                     id="email"
                                     class="tow"></i-Input>
                        </div>
                    </i-Col>
                    <i-Col span="8">
                        <div class="form-group">
                            <label for="chargeName"
                                   class="control-label"><span>*</span>负责人(法人)姓名</label>
                            <i-Input v-model.trim="curTable.chargeName"
                                     id="chargeName"
                                     class="tow"></i-Input>
                        </div>
                    </i-Col>
                </Row>

                <Row>
                    <i-Col span="16">
                        <div class="form-group">
                            <label for="affiliatedName"
                                   class="control-label">附属医院名称</label>
                            <i-Input v-model.trim="curTable.affiliatedName"
                                     id="affiliatedName"
                                     class="one"></i-Input>
                        </div>
                    </i-Col>
                    <i-Col span="8">
                        <div class="form-group">
                            <label for="chargeTelephone"
                                   class="control-label">法人电话</label>
                            <i-Input v-model.trim="curTable.chargeTelephone"
                                     id="chargeTelephone"
                                     class="tow"></i-Input>
                        </div>
                    </i-Col>
                </Row>
                <Row>
                    <i-Col span="16">
                        <div class="form-group">
                            <label for="secondName"
                                   class="control-label">医院第二名称</label>
                            <i-Input v-model.trim="curTable.secondName"
                                     id="secondName"
                                     class="one"></i-Input>
                        </div>
                    </i-Col>
                    <i-Col span="8">
                        <div class="form-group">
                            <label for="chargeMobileNumber"
                                   class="control-label">法人手机</label>
                            <i-Input v-model.trim="curTable.chargeMobileNumber"
                                     id="chargeMobileNumber"
                                     class="tow"></i-Input>
                        </div>
                    </i-Col>
                </Row>

                <Row>

                    <i-Col span="16">
                        <div class="form-group">
                            <label for="chargeRecordNumber"
                                   class="control-label">法人身份证号</label>
                            <i-Input v-model.trim="curTable.chargeRecordNumber"
                                     id="chargeRecordNumber"
                                     class="one"></i-Input>
                        </div>
                    </i-Col>
                    <i-Col span="8">
                        <div class="form-group">
                            <label for="setupDate"
                                   class="control-label">单位成立日期</label>
                            <DatePicker v-model="curTable.setupDate"
                                        transfer
                                        type="date"
                                        class="tow"
                                        placement="top-end"></DatePicker>
                        </div>
                    </i-Col>
                </Row>

                <Row>
                    <i-Col span="8">
                        <div class="form-group">
                            <label for="revokeDate"
                                   class="control-label">单位撤销日期</label>
                            <DatePicker v-model="curTable.revokeDate"
                                        transfer
                                        type="date"
                                        class="tow"
                                        placement="top-start"></DatePicker>
                        </div>
                    </i-Col>
                    <i-Col span="8">
                        <div class="form-group">
                            <label for="countryId"
                                   class="control-label">上级医疗机构</label>
                            <Select v-model="getTopHospital"
                                    filterable
                                    clearable
                                    placement="top"
                                    class="tow">
                                <Option v-for="item in getTopHospitalArr"
                                        :value="item.hospitalId"
                                        :key="item.hospitalId">{{ item.hospitalName }}
                                </Option>
                            </Select>

                        </div>
                    </i-Col>
                </Row>
            </form>
        </i-Col>
        <Modal v-model="showModal.hospitalNameModel"
               width="420px"
               :closable="false"
               :mask-closable="false">
            <Form ref="hospitalNameCont"
                  :model="hospitalNameCont"
                  :label-width="100">
                <FormItem label="医疗机构代码"
                          prop="hospitalCode"
                          style="display: flex;">
                    <i-Input v-model.trim="hospitalNameCont.hospitalCode"
                             placeholder=""
                             style="width:276px"></i-Input>
                </FormItem>
                <FormItem label="医疗机构名称"
                          prop="hospitalName"
                          style="display: flex;">
                    <i-Input v-model.trim="hospitalNameCont.hospitalName"
                             placeholder=""
                             style="width:276px"></i-Input>
                </FormItem>
                <div style="display:flex;justify-content: space-between;">
                    <FormItem label="拼音码"
                              prop="pyCode"
                              style="display:inline-block;width:48%">
                        <i-Input v-model.trim="hospitalNameCont.pyCode"
                                 placeholder=""
                                 style="width:76px"></i-Input>
                    </FormItem>
                    <FormItem label="五笔码"
                              prop="wbCode"
                              style="display:inline-block;width:48%">
                        <i-Input v-model.trim="hospitalNameCont.wbCode"
                                 placeholder=""
                                 style="width:76px"></i-Input>
                    </FormItem>
                </div>
            </Form>
            <div slot="footer">
                <Button type="text"
                        size="small"
                        @click="hospitalNameCancel('hospitalNameCont')">取消
                </Button>
                <Button type="primary"
                        size="small"
                        @click="hospitalNameOk('hospitalNameCont')">确定
                </Button>
            </div>
        </Modal>
        <comfirmDeletion :show="showModal.showDel"
                         @close="showModal.showDel=false"
                         :msg="showModal.delMsg"
                         @ok="del"/>
    </Row>
</template>

<script>
    import util from '../../../../libs/util.js'
    import comfirmDeletion from '../../../components/confirmDeletion.vue'
    import longrangesearchselectElse from '../../../components/long-range-search-select-else'

    export default {
        name: "medical-institutions",
        //获取父组件  provide{app:[]}
        inject: ['app'],
        components: {
            comfirmDeletion,
            longrangesearchselectElse
        },
        data() {
            return {
                showModal: {
                    hospitalNameModel: false,
                    showDel: false,
                    delMsg: ''
                },
                disabled: true,
                leftTreeData: [],
                leftTreeList: [],
                selects: {
                    addressVal: [null],
                    query: '',
                    loading: false,
                    options: []
                },
                curTable: {
                    addressFlag: null,
                    hospitalName: null,
                    organizationCode: null,
                    hospitalCode: null,
                    countryId: null,
                    hospitalClassId: null,
                    hospitalGradeId: null,
                    townshipAddr: null,
                    villageAddr: null,
                    addrNumber: null,
                    telephone: null,
                    phoneNumber: null,
                    chargeName: null,
                    address: [],
                    countryList: [],
                    hospitalClassList: [],
                    hospitalGradeList: [],  //医院等级列表
                    provinceList: [],
                    cityList: [],
                    countyList: [],
                    email: '',
                    affiliatedName: '',
                    chargeTelephone: '',
                    secondName: '',
                    chargeMobileNumber: '',
                    chargeRecordNumber: '',
                    revokeDate: '',   //单位撤销日期
                    setupDate: ''
                },
                leftTreeParams: {},//点击之后用于存储的
                hospitalNameCont: {},
                type: true,
                addressData: [],
                loadingBtn: false,
                getValObj: [],//修改成功后的重新请求
                getDetail: {},//详情请求过来的数据
                getTopHospitalArr: [],//获取医院的数据
                getTopHospital: null,
                selectOptionsPagegj: 1,
                selectOptionsListgj: [],
                selectSerachParamgj: '',
                spinShowgj: false,
                selectOptionsPagetype: 1,
                selectOptionsListtype: [],
                selectSerachParamtype: '',
                spinShowtype: false,
                selcecTree: 1
            }
        },
        methods: {
            init() {
                this.leftData()
                // // 省
                this.addressData = this.app.vShow.addressData == undefined ? "":this.app.vShow.addressData
                console.log(this.addressData)
                //医院等级
                this.$store.dispatch("getFDAttr", {
                    flagdataCode: "FD000059",
                    hospitalId: this.$store.state.userInfoObj.hospitalId
                }).then(res => {
                    if (res.data.code !== 200) {
                        util.showMsg(this, {diy: res.data.message});
                    } else {
                        this.curTable.hospitalGradeList = res.data.data
                    }
                })
            },
            //地址下拉
            addressChange(val) {
                if (util.isEmpty(val)) {
                    this.selects.addressVal = ['']
                }
            },
            //远程搜索方法
            remoteMethod(query) {
                if (this.selects.loading) return
                if (query !== '') {
                    this.selects.loading = true;
                    setTimeout(() => {
                        this.selects.loading = false;
                        const list = this.leftTreeList.map(item => {
                            return {
                                value: item.hospitalName,
                                label: item.hospitalName,
                                pyCodeLower: item.pyCode.toLowerCase(),
                                pyCodeUpper: item.pyCode.toUpperCase(),
                                wbCode: item.wbCode,
                                id: item.hospitalId,
                                parentId: item.parentHospitalId
                            };
                        });
                        this.selects.options = util.findKeys(query, list, ['pyCodeLower', 'pyCodeUpper', 'label', 'wbCode'])
                    }, 10);
                } else {
                    this.selects.options = [];
                }
            },

            //远程搜素输入框change
            queryChange(val) {
                //查找符合输入内容的id
                let id = util.findOfObject(val, this.leftTreeList, 'hospitalName', 'hospitalId');
                //通过id返回tree中的某一节点   treeItem 对象
                let treeItem = util.treeMap({children: this.leftTreeData}, id);
                if (!treeItem) {
                    util.showMsg(this, {warning: `没有${val}医院`});
                    return;
                }
                if (treeItem.nodeKey !== 0) {
                    this.$refs['leftTree'].handleSelect(treeItem.nodeKey);
                    this.$nextTick().then(() => {
                        this.$refs.leftTree.scrollIntoView({behavior: "instant", block: "end", inline: "nearest"});
                    })
                }
            },
            //单位成立日期
            checkSetupDate(val) {
                if (!util.isEmpty(this.curTable.revokeDate)) {
                    if (val > this.curTable.revokeDate.format('yyyy-MM-dd')) {
                        util.showMsg(this, {warning: '单位成立日期不能晚于单位撤销日期！'});
                    }
                }
            },
            //单位撤销日期
            checkRevokeDate(val) {
                if (!util.isEmpty(this.curTable.setupDate)) {
                    if (val < this.curTable.setupDate.format('yyyy-MM-dd')) {
                        util.showMsg(this, {warning: '单位成立日期不能晚于单位撤销日期！'});
                    }
                }
            },

            //获取的树形结构
            leftData() {
                this.leftTreeData = []
                this.empty()
                let data = {
                    parentHospitalId: this.$store.state.userInfoObj.hospitalId,
                    hospitalId: this.$store.state.userInfoObj.hospitalId
                }
                this.$store.dispatch("getHospitallist", data).then(res => {
                    if (res.data.code === 200) {
                        res.data.data.forEach(element => {
                            if (this.leftTreeData.length == 0) {
                                this.leftTreeData.push(
                                    {
                                        title: element.hospitalName,
                                        hospitalId: element.hospitalId,
                                        getObj: element,
                                        organizationCode: element.organizationCode,
                                        hospitalCode: element.hospitalCode,
                                        parentHospitalId: element.parentHospitalId,
                                        hospitalName: element.hospitalName,
                                        selected: true,
                                        expand: true,
                                        children: element.childList == null ? '' : element.childList.map(list => {
                                            if ((list.isHasChild - 0) > 0) {
                                                return {
                                                    title: list.hospitalName,
                                                    hospitalId: list.hospitalId,
                                                    organizationCode: list.organizationCode,
                                                    hospitalCode: list.hospitalCode,
                                                    getObj: list,
                                                    parentHospitalId: list.parentHospitalId,
                                                    hospitalName: list.hospitalName,
                                                    loading: false,
                                                    children: []
                                                }
                                            } else {
                                                return {
                                                    title: list.hospitalName,
                                                    hospitalId: list.hospitalId,
                                                    getObj: list,
                                                    organizationCode: list.organizationCode,
                                                    hospitalCode: list.hospitalCode,
                                                    parentHospitalId: list.parentHospitalId,
                                                    hospitalName: list.hospitalName,
                                                }
                                            }
                                        })
                                    }
                                )
                            } else {
                                this.leftTreeData.push(
                                    {
                                        title: element.hospitalName,
                                        hospitalId: element.hospitalId,
                                        getObj: element,
                                        organizationCode: element.organizationCode,
                                        hospitalCode: element.hospitalCode,
                                        parentHospitalId: element.parentHospitalId,
                                        hospitalName: element.hospitalName,
                                        expand: true,
                                        children: element.childList == null ? '' : element.childList.map(list => {
                                            if ((list.isHasChild - 0) > 0) {
                                                return {
                                                    title: list.hospitalName,
                                                    hospitalId: list.hospitalId,
                                                    organizationCode: list.organizationCode,
                                                    hospitalCode: list.hospitalCode,
                                                    getObj: list,
                                                    parentHospitalId: list.parentHospitalId,
                                                    hospitalName: list.hospitalName,
                                                    loading: false,
                                                    children: []
                                                }
                                            } else {
                                                return {
                                                    title: list.hospitalName,
                                                    hospitalId: list.hospitalId,
                                                    getObj: list,
                                                    organizationCode: list.organizationCode,
                                                    hospitalCode: list.hospitalCode,
                                                    parentHospitalId: list.parentHospitalId,
                                                    hospitalName: list.hospitalName,
                                                }
                                            }
                                        })
                                    }
                                )
                            }
                        });
                        this.leftTreeChange(this.leftTreeData)

                    } else {
                        util.showMsg(this, {diy: res.data.message});
                    }
                })
            },
            //动态加载的树
            loadData(item, callback) {
                // console.log(item, 'aaa')
                let data1 = []
                setTimeout(() => {
                    let nowData = {
                        parentHospitalId: item.hospitalId,
                    }
                    this.$store.dispatch("getHospitallist", nowData).then(res => {
                        if (res.data.code !== 200) {
                            util.showMsg(this, {diy: res.data.message});
                        } else {
                            res.data.data.forEach(element => {
                                if ((element.isHasChild - 0) > 0) {
                                    data1.push({
                                        title: element.hospitalName,
                                        hospitalId: element.hospitalId,
                                        organizationCode: element.organizationCode,
                                        hospitalCode: element.hospitalCode,
                                        getObj: element,
                                        parentHospitalId: element.parentHospitalId,
                                        hospitalName: element.hospitalName,
                                        loading: false,
                                        children: []
                                    })
                                } else {
                                    data1.push({
                                        title: element.hospitalName,
                                        hospitalId: element.hospitalId,
                                        organizationCode: element.organizationCode,
                                        hospitalCode: element.hospitalCode,
                                        getObj: element,
                                        parentHospitalId: element.parentHospitalId,
                                        hospitalName: element.hospitalName
                                    })
                                }

                            });
                        }
                    })
                    setTimeout(() => {
                        callback(data1);
                    }, 1000)
                }, 500);
            },

            //卫生卫生机构类别
            getSelectOptionsFuntype() {
                this.spinShowtype = true;
                let nowData = {
                    'pdCode': 'PD0000000312',
                    'page': this.selectOptionsPagetype,
                    'size': 6,
                    'hospitalId': this.$store.state.userInfoObj.hospitalId,
                    "searchParam": this.selectSerachParamtype,
                }
                this.$store.dispatch('getPDOrHDAttrs', nowData).then(res => {
                    if (res.data.code === 200) {
                        let newDate = []
                        res.data.data.list.map(item => {
                            newDate.unshift(item)
                        })
                        this.selectOptionsListtype = this.selectOptionsListtype.concat(newDate)
                        this.spinShowtype = false
                    } else {
                        util.showMsg(this, {diy: res.data.message});
                    }
                })
            },
            //卫生卫生机构类别 组件传参
            selectObjecttype(val) {
                this.selectSerachParamtype = val.label
                this.curTable.hospitalClassId = val.datavalueId
            },
            //国籍
            getSelectOptionsFungj() {
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
                        util.showMsg(this, {diy: res.data.message});
                    }
                })
            },
            //获取国籍
            selectObjectgj(val) {
                this.selectSerachParamgj = val.label
                this.curTable.countryId = val.datavalueId
            },
            //获取左侧树数据详单
            leftTreeChange(val) {
                console.log(val)
                this.empty()
                if (util.isEmpty(val)) {
                    return
                }
                this.leftTreeParams = val[0].getObj
                this.getValObj = val
                this.disabled = false
                let data = {
                    id: val[0].hospitalId
                }
                //获取初始页面左侧树第一家医院详情
                this.$store.dispatch("getHospitalDetail", data).then(res => {
                    if (res.data.code !== 200) {
                        util.showMsg(this, {diy: res.data.message});
                    } else {
                        this.getDetail = JSON.parse(JSON.stringify(res.data.data))
                        this.getTopHospital = this.getDetail.parentHospitalId;
                        let provinceId, cityId, countyId, countryId;
                        provinceId = util.isEmpty(this.getDetail.provinceId) ? '' : this.getDetail.provinceId
                        cityId = util.isEmpty(this.getDetail.cityId) ? '' : this.getDetail.cityId
                        countyId = util.isEmpty(this.getDetail.countyId) ? '' : this.getDetail.countyId
                        this.selects.addressVal = util.isEmpty(this.getDetail.provinceId) ? [] : [provinceId, cityId, countyId]  //级联选择器 复现格式
                        countryId = util.isEmpty(this.getDetail.countryId) ? '' : this.getDetail.countryId
                        this.curTable.countryId = util.isEmpty(this.getDetail.countryId) ? null : this.getDetail.countryId
                        this.selectSerachParamgj = this.getDetail.countryName
                        this.curTable.hospitalClassId = util.isEmpty(this.getDetail.hospitalClassId) ? null : this.getDetail.hospitalClassId
                        this.curTable.hospitalGradeId = util.isEmpty(this.getDetail.hospitalGradeId) ? null : this.getDetail.hospitalGradeId
                        this.selectSerachParamtype = this.getDetail.hospitalClassName
                        this.curTable.townshipAddr = util.isEmpty(this.getDetail.townshipAddr) ? null : this.getDetail.townshipAddr
                        this.curTable.hospitalName = this.getDetail.hospitalName
                        this.curTable.organizationCode = util.isEmpty(this.getDetail.organizationCode) ? null : this.getDetail.organizationCode
                        this.curTable.provinceId = this.getDetail.provinceId
                        this.curTable.villageAddr = util.isEmpty(this.getDetail.villageAddr) ? null : this.getDetail.villageAddr
                        this.curTable.addrNumber = util.isEmpty(this.getDetail.addrNumber) ? null : this.getDetail.addrNumber
                        this.curTable.telephone = util.isEmpty(this.getDetail.telephone) ? null : this.getDetail.telephone
                        this.curTable.email = this.getDetail.email
                        this.curTable.setupDate = this.getDetail.setupDate
                        this.curTable.revokeDate = this.getDetail.revokeDate
                        this.curTable.phoneNumber = util.isEmpty(this.getDetail.phoneNumber) ? null : this.getDetail.phoneNumber
                        this.curTable.chargeName = util.isEmpty(this.getDetail.chargeName) ? null : this.getDetail.chargeName
                        this.curTable.affiliatedName = this.getDetail.affiliatedName
                        this.curTable.chargeTelephone = this.getDetail.chargeTelephone
                        this.curTable.secondName = this.getDetail.secondName
                        this.curTable.chargeMobileNumber = this.getDetail.chargeMobileNumber
                        this.curTable.chargeRecordNumber = this.getDetail.chargeRecordNumber
                    }
                })


            },
            //管理员操作 暂时未使用
            addHospitalName() {
                if (this.$store.state.userInfoObj.loginName != 'SUPERADMIN') {
                    util.showMsg(this, {warning: '只有超级管理员才能进行新增操作'})
                    return
                }

                if (JSON.stringify(this.leftTreeParams) == "{}") {
                    util.showMsg(this, {warning: '请选择医疗机构'})
                    return
                }
                this.type = true
                this.showModal.hospitalNameModel = true
            },
            //修改 暂时未使用
            updateHospitalName() {
                this.hospitalNameCont.hospitalName = ''
                this.hospitalNameCont.hospitalCode = ''
                this.hospitalNameCont.pyCode = ''
                this.hospitalNameCont.wbCode = ''
                if (this.$store.state.userInfoObj.loginName != 'SUPERADMIN' && this.$store.state.userInfoObj.loginName != 'admin') {
                    util.showMsg(this, {warning: '只有管理员/超级管理员才能进行修改操作'})
                    return
                }
                if (JSON.stringify(this.leftTreeParams) == "{}") {
                    util.showMsg(this, {warning: '请选择医疗机构'})
                    return
                } else {
                    this.showModal.hospitalNameModel = true;
                    this.type = false
                    this.hospitalNameCont.hospitalName = this.leftTreeParams.hospitalName
                    this.hospitalNameCont.hospitalCode = this.leftTreeParams.hospitalCode
                    this.hospitalNameCont.pyCode = this.leftTreeParams.pyCode
                    this.hospitalNameCont.wbCode = this.leftTreeParams.wbCode
                }
            },
            //弹框确认   暂时未使用
            hospitalNameOk(name) {
                let parentHospitalId = ''
                if (JSON.stringify(this.leftTreeParams) == "{}") {
                    parentHospitalId = 0
                } else if (this.leftTreeParams != '') {
                    parentHospitalId = this.leftTreeParams.hospitalId
                }
                if (util.isEmpty(this.hospitalNameCont.hospitalCode)) {
                    util.showMsg(this, {warning: '请填写医疗机构代码'})
                    return
                }
                if (util.isEmpty(this.hospitalNameCont.hospitalName)) {
                    util.showMsg(this, {warning: '请填写医疗机构名称'})
                    return
                }
                if (this.type) {
                    let data = {
                        // hospitalId: this.$store.state.userInfoObj.hospitalId,
                        hospitalName: this.hospitalNameCont.hospitalName,//医疗机构名称
                        hospitalCode: this.hospitalNameCont.hospitalCode,
                        // organizationCode: this.leftTreeParams.organizationCode,//组织机构代码 取上一级的组织机构代码
                        parentHospitalId: parentHospitalId,
                        pyCode: this.hospitalNameCont.pyCode,
                        wbCode: this.hospitalNameCont.wbCode
                    }
                    //新增的
                    this.$store.dispatch("addEhrInstitutionIndex", data).then(res => {
                        if (res.data.code === 200) {
                            this.leftData()
                            this.leftTreeParams = {}
                            this.showModal.hospitalNameModel = false
                            util.showMsg(this, {succ: '新增成功'})
                        } else {
                            util.showMsg(this, {diy: res.data.message});
                        }
                    })
                } else {
                    let data = {
                        "hospitalName": this.hospitalNameCont.hospitalName,
                        "hospitalCode": this.hospitalNameCont.hospitalCode,
                        "hospitalId": this.leftTreeParams.hospitalId,
                        "dataVersion": this.leftTreeParams.dataVersion,
                        "parentHospitalId": this.leftTreeParams.parentHospitalId,
                        "pyCode": this.hospitalNameCont.pyCode,
                        "wbCode": this.hospitalNameCont.wbCode
                    }
                    this.$store.dispatch("updateEhrInstitutionIndex", data).then(res => {
                        if (res.data.code === 200) {
                            this.leftData()
                            this.leftTreeParams = {}
                            util.showMsg(this, {succ: '修改成功'})
                            this.showModal.hospitalNameModel = false
                        } else {
                            util.showMsg(this, {diy: res.data.message});
                        }

                    })
                }


            },
            //新增取消  暂时未使用
            hospitalNameCancel(name) {
                this.$refs[name].resetFields();
                this.showModal.hospitalNameModel = false
            },
            //管理员修改  暂未使用
            delHospitalName() {
                if (this.$store.state.userInfoObj.loginName != 'SUPERADMIN') {
                    util.showMsg(this, {warning: '只有超级管理员才能进行删除操作'})
                    return
                }
                if (JSON.stringify(this.leftTreeParams) == "{}") {
                    util.showMsg(this, {warning: '请选择医疗机构！'})
                    return
                } else if ((this.leftTreeParams.isHasChild - 0) > 0) {
                    util.showMsg(this, {warning: '请先清空子级！'})
                    return
                } else if (this.leftTreeParams.parentHospitalId == '0') {
                    util.showMsg(this, {warning: '最父级医疗机构不允许删除！'})
                    return
                }
                this.showModal.delMsg = '确定要删除【' + this.leftTreeParams.hospitalName + '】吗？';
                this.showModal.showDel = true;
            },
            //管理员删除  暂未使用
            del() {
                let data = {
                    id: this.leftTreeParams.hospitalId
                }
                this.$store.dispatch("delEhrInstitutionIndex", data).then(res => {
                    if (res.data.code === 200) {
                        this.leftTreeParams = {}
                        this.leftData()
                        util.showMsg(this, {succ: '删除成功'})
                        this.showModal.showDel = false;
                        this.disabled = true
                    } else {
                        util.showMsg(this, {diy: res.data.message});
                    }
                })
            },
            // cancelDetail () {
            //   console.log(this.leftTreeParams)
            //   this.leftTreeChange(this.leftTreeParams)
            // },
            //清空所有项
            empty() {
                // this.curTable = {}
                this.curTable.addressFlag = null
                this.curTable.hospitalName = null
                this.curTable.organizationCode = null
                this.curTable.provinceId = ''
                this.curTable.provinceId = ''
                this.curTable.provinceId = ''
                this.curTable.townshipAddr = null
                this.curTable.villageAddr = null
                this.curTable.addrNumber = null
                this.curTable.hospitalGradeId = null
                this.leftTreeParams = {}
                this.curTable.telephone = null
                this.curTable.email = ''
                this.curTable.setupDate = ''
                this.curTable.revokeDate = ''
                this.curTable.phoneNumber = null
                this.curTable.chargeName = null
                this.curTable.affiliatedName = ''
                this.curTable.chargeTelephone = ''
                this.curTable.secondName = ''
                this.curTable.chargeMobileNumber = ''
                this.curTable.chargeRecordNumber = ''
                this.curTable.hospitalClassId = null
                this.selectSerachParamtype = ''
                this.curTable.countryId = null
                this.selectSerachParamgj = '';
                this.selects.addressVal = this.curTable.addressFlag = '' ? [null] : []
                this.getTopHospital = null
            },
            //保存
            preservation() {

                if (this.curTable.phoneNumber === '' || this.curTable.organizationCode === '' || this.curTable.hospitalName === '' || this.curTable.countryId === '' || this.curTable.hospitalClassId === '' || this.curTable.hospitalGradeId === '' || this.selects.addressVal === '' || this.curTable.telephone === '' || this.curTable.chargeName === '') {
                    util.showMsg(this, {warning: '红色*号标注项为必填项,请完善信息！'})
                } else {
                    let data = {
                        "addrNumber": util.isEmpty(this.curTable.addrNumber) ? util.globalVariable.isNullStr : this.curTable.addrNumber,//门牌号
                        "affiliatedName": util.isEmpty(this.curTable.affiliatedName) ? util.globalVariable.isNullStr : this.curTable.affiliatedName,//附属医院名称
                        "chargeMobileNumber": util.isEmpty(this.curTable.chargeMobileNumber) ? util.globalVariable.isNullNum : this.curTable.chargeMobileNumber,//法人手机号
                        "chargeName": this.curTable.chargeName, //负责人姓名
                        "chargeRecordNumber": util.isEmpty(this.curTable.chargeRecordNumber) ? util.globalVariable.isNullNum : this.curTable.chargeRecordNumber,//法人身份证号
                        "chargeTelephone": util.isEmpty(this.curTable.chargeTelephone) ? util.globalVariable.isNullNum : this.curTable.chargeTelephone,//法人电话
                        "provinceId": util.isEmpty(this.selects.addressVal.length) ? '' : this.selects.addressVal[0],
                        "cityId": util.isEmpty(this.selects.addressVal.length) ? '' : this.selects.addressVal[1],
                        "countyId": util.isEmpty(this.selects.addressVal.length) ? '' : this.selects.addressVal[2],
                        "countryId": this.curTable.countryId,
                        "dataVersion": this.getDetail.dataVersion,
                        "email": util.isEmpty(this.curTable.email) ? util.globalVariable.isNullStr : this.curTable.email,//电子邮箱
                        "revokeDate": util.isEmpty(this.curTable.revokeDate) ? '1900-01-01 00:00:59' : this.curTable.revokeDate,//单位撤销日期
                        "setupDate": util.isEmpty(this.curTable.setupDate) ? '1900-01-01 00:00:59' : this.curTable.setupDate,//单位成立日期
                        "phoneNumber": this.curTable.phoneNumber,//邮政编码
                        "hospitalClassId": this.curTable.hospitalClassId,//卫生机构类别
                        "organizationCode": this.curTable.organizationCode,//组织机构代码
                        "hospitalGradeId": this.curTable.hospitalGradeId,
                        "hospitalId": this.getDetail.hospitalId,
                        "hospitalName": this.curTable.hospitalName, //医疗机构名称
                        "parentHospitalId": this.getTopHospital + '' === '' || this.getTopHospital == null ? util.globalVariable.isNullNum : this.getTopHospital,//上级医疗机构的id
                        "secondName": util.isEmpty(this.curTable.secondName) ? util.globalVariable.isNullStr : this.curTable.secondName,
                        "telephone": this.curTable.telephone,//联系电话
                        "townshipAddr": util.isEmpty(this.curTable.townshipAddr) ? util.globalVariable.isNullStr : this.curTable.townshipAddr,//乡镇
                        "villageAddr": util.isEmpty(this.curTable.villageAddr) ? util.globalVariable.isNullStr : this.curTable.villageAddr,//村
                    }

                    console.log(this.curTable.revokeDate)
                    console.log(this.curTable.setupDate)
                    if (!util.isEmpty(this.curTable.revokeDate) && !util.isEmpty(this.curTable.setupDate)) {
                        if (this.curTable.setupDate.format('yyyy-MM-dd') > this.curTable.revokeDate.format('yyyy-MM-dd')) {
                            util.showMsg(this, {warning: '单位成立日期不能晚于单位撤销日期！'})
                            return false
                        }
                    }
                    this.loadingBtn = true;
                    this.$store.dispatch("updateEhrInstitutionIndex", data).then(res => {
                        if (res.data.code === 200) {
                            this.loadingBtn = false;
                            if (util.isEmpty(this.getTopHospital)) {
                                util.showMsg(this, {succ: '更新成功'})
                            } else {
                                util.showMsg(this, {succ: '新增上级医疗机构成功'})
                            }
                            this.leftTreeChange(this.getValObj)
                        } else {
                            util.showMsg(this, {diy: res.data.message});
                        }
                    })
                }
            },
            //获取上级医疗机构下拉
            topGetTheHospitalList() {
                let data = {
                    hospitalId: this.$store.state.userInfoObj.hospitalId
                }
                this.$store.dispatch("getTheHospitalList", data).then(res => {
                    if (res.data.code === 200) {
                        this.getTopHospitalArr = res.data.data
                        console.log(this.getTopHospitalArr)
                    } else {
                        util.showMsg(this, {diy: res.data.message});
                    }
                })
            }
        },
        mounted() {
            this.init()
            this.topGetTheHospitalList()
        }
    }
</script>

<style lang="less" scoped>
    @import "../../../../styles/common.less";
    @import "./medical-institutions.less";
</style>
