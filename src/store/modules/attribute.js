import util from '../../libs/util';
import qs from 'qs';

const attribute = {
    state: {
        attrListByParam: 'api/sysFlagData/getFlagDataPairLists',
        getSysGroupMenuList: 'api/sysGroupMenu/getSysGroupMenuList',//资源权限获取左下角回显的数据 7.31 yn

        checkLoginName: 'api/sysUser/checkLoginName',//校验登录名的接口 8.6 yn
        modifyStatusUser: 'api/sysUser/modifyStatus',//状态改变的接口 8.6 yn

        findRegion: 'api/sysPrimaryDataValue/findRegion',//获取地址的接口 省市区
        getFD: 'api/sysFlagData/getFlagDataPairList',
        getHospitalList: 'api/ehrInstitutionIndex/getHospitalList',
        getHospitalDetail: 'api/ehrInstitutionIndex/detail',//获取医院详情
        getTheHospitalList: 'api/ehrInstitutionIndex/getTheHospitalList',
        
        deptQuery: 'api/sysDeptDict/query', //最新获取科室病区通用接口
        

        // 以下为医疗卫生机构用到的接口  yn  10.25
        ehrInstitutionIndexAdd: 'api/ehrInstitutionIndex/add',//新增接口
        ehrInstitutionIndexDel: 'api/ehrInstitutionIndex/delete',//删除接口
        ehrInstitutionIndexUpdate: 'api/ehrInstitutionIndex/update',//更新接口

        // 以下给服务卫生人员用的接口  yn 10.25
        ehrServicePersonalListNew: 'api/ehrServicePersonal/queryEhrPersonalList',//获取卫生服务人员左侧列表  yn 10.25
        ehrServicePersonalUpdate: 'api/ehrServicePersonal/update',//修改接口
        ehrServicePersonalAdd: 'api/ehrServicePersonal/add',//新增的接口

        // 以下给科室字典用的接口 yn 10.25
        deptDelete: 'api/sysDeptDict/delete',//删除接口
        departTabList:"api/sysDeptDict/findDeptByParam" ,//获取右侧详情的
        deptUpdate: 'api/sysDeptDict/update',//更新接口
        deptAdd: 'api/sysDeptDict/add',//新增接口

        //以下给临床项目用的 yn 10.25
        clinicItemQuery: 'api/clinical/dict/clinicItemDict/query', // 优化版临床查询
        clinicItemCodeUpd: "api/clinical/dict/clinicItemDict/update", //更新
        clinicItemCodeAdd: "api/clinical/dict/clinicItemDict/add", //增  临床
        aliasDictSel: 'api/hspmn/dict/itemAliasDict/findByClinicIdAndItemType', //查 
        aliasDictAdd: 'api/hspmn/dict/itemAliasDict/add', //增 别名
        aliasDictUpd: 'api/hspmn/dict/itemAliasDict/update', //改 别名
        performeDeptSel: 'api/hspmn/dict/performeDeptDict/findPerformeDeptByClinicIdAndItemType', //查 执行科室         //2019.9.3 sss 更换通用接口
        ClinicItemVsPriceSel: 'api/clinical/dict/clinicVsPrice/findByClinicItemId ', //查  临床价表2019.9.3  sss更换通用接口
        ClinicItemVsPriceAdd: 'api/clinical/dict/clinicVsPrice/add', //新增临床收费对应
        ClinicItemVsPriceUpd: 'api/clinical/dict/clinicVsPrice/update', //修改临床价表对应 
        ClinicItemVsPriceDel: 'api/clinical/dict/clinicVsPrice/delete', //删  临床价表 
        aliasDictDel: 'api/hspmn/dict/itemAliasDict/delete', //删除别名
        priceDataSelU: 'api/hspmn/dict/priceItemDict/curPriceItemList', //查 价表（优化版查询）

        // 以下为疾病诊断的接口  yn 10.25
        getListByDateValue: 'api/sysPrimaryDataValue/getListByDateValue',//主数据管理弹框的数据
        sysParameterListByParamId: 'api/sysPrimaryDataValue/listByPrimaryDataId',//标准诊断的列表
        sysDiagDictDetailByQueryParam: 'api/sysDiagDict/detailByQueryParam',//右侧查询接口
        sysDiagDictAdd: 'api/sysDiagDict/add',//新增
        sysDiagDictUpdate: 'api/sysDiagDict/update',//修改

        // 以下为术语字典的 yn 10.25
        termDictInit: 'api/sys/hsp/basicData/termDictInit',//初始化数据 左侧树列表
        getTreeList:"api/sys/hsp/basicData/findHspBasicData",//术语字典做些树
        hospitalBasicAdd: 'api/sys/hsp/basicData/add',//左侧树的新增
        hospitalBasicUpdate: 'api/sys/hsp/basicData/update',//左侧树的修改
        hospitalBasicDel: 'api/sys/hsp/basicData/delete',//左侧树的删除
        basicDataValueAdd: 'api/sys/hsp/basicDataValue/add',
        basicDataValueByRemark: 'api/sys/hsp/basicDataValue/findByRemark',
        basicDataValueUpdate: 'api/sys/hsp/basicDataValue/update',//修改接口
        valueDicList: "api/sys/hsp/basicDataValue/valueDicList",//获取医疗付费中的
        pdOrHdAttrSel: "api/sys/hsp/basicDataValue/curHDDictQuery",//获取HD数据 
        hospitalBasicDel: 'api/sys/hsp/basicData/delete',
        newBasicDataValueCurHDDictQuery: 'api/sys/hsp/basicDataValue/getInpAdminstrationList',
        findAdminIdCurHDDictQuery: 'api/sys/hsp/basicDataValue/findAdminId',
        frequencyDictDetail: 'api/hspmn/dict/frequencyDict/detail',
        frequencyDictAdd: 'api/hspmn/dict/frequencyDict/add',
        frequencyDictUpdate: 'api/hspmn/dict/frequencyDict/update',
        administrationDictDetail: 'api/hspmn/dict/administrationDict/detail',
        administrationDictAdd: 'api/hspmn/dict/administrationDict/add',
        administrationDictUpdate: 'api/hspmn/dict/administrationDict/update',
        nursingDictAdd: 'api/hspmn/dict/nursingDict/add',
        nursingUpdate: 'api/hspmn/dict/nursingDict/update',
        nursingDictDetail: 'api/hspmn/dict/nursingDict/detail',

        // 以下为病人基本信息的的接口
        updatabasic: 'api/ehrResidentIndex/update', //更新病人的基本信息

        // 以下为主数据管理的接口
        querySysPrimaryList: 'api/sysPrimaryDataValue/querySysPrimaryList',//弹框里面列表的数据
        sysPrimaryDataQueryByCondition: 'api/sysPrimaryData/queryByCondition',
        getSysPrimaryDataValueList:'api/sysPrimaryDataValue/getSysPrimaryDataValueList',


        //以下为项目类别的接口
        queryByCode: "api/hspmn/clinicTypeMaintain/queryByCode", //查询左侧项目类别
        queryListByCode: "api/hspmn/clinicTypeMaintain/queryList", //查询右侧项目类别
        itemClassDel: "api/hspmn/clinicTypeMaintain/delete", //项目类别左侧删除
        itemClassAdd: "api/hspmn/clinicTypeMaintain/add", //项目类别右侧添加至左侧



             //获取菜单管理的接口
             sysMenuListByParam: 'api/sysMenu/findMenuByDisplayFlag',      //2019.9.12  sss 更换通用接口 
             queryMenuListNew: 'api/sysMenu/queryMenuListNew', // 查询菜单列表(新)
             sysMenuMdaddNEW: 'api/sysMenu/add',
             sysMenuMdupdateNEW: 'api/sysMenu/update',
             sysMenueDel: 'api/sysMenu/delete',
     
     
     
             getMaxDBAndRedisValue: 'api/sysDatacode/getMaxDBAndRedisValue',
             updateRedisFromDb: 'api/sysDatacode/updateRedisFromDb',
             syncPk: 'api/system/SyncPk',
             tableNoListByParam: 'api/hspmn/regist/registIndex/findRegistIndexByParam',
             sysGroupAdd: 'api/sysGroup/add',
             customReportDictList: 'api/sys/customReportDict/getCustomReportDict',
             commDictQuery: 'api/commDict/query',//获取科室的下拉加载更多接口 yn 10 15
             ehrServicePersonalDetail: 'api/ehrServicePersonal/detail',//获取卫生服务人员
     
             getQueryStoragePharmList: 'api/hspmn/pham/storagePhamDict/queryStoragePharmList',//获取药房的数据
             listbyQueryParamss: 'api/sysReportDict/findReportByHospitalId',    //已经更换掉通用接口   2019.9.12  sss
             nursesReceptionListbyQueryParam: 'api/hspmn/divi/receptAndConsultDict/findReceptByFlag',
             sysParameterUpd: 'api/sysParameter/update', // 系统参数修改
             listBySearchParams: 'api/sysParameter/listBySearchParam',  // 系统日志条件查询(新)
             sysLogsSelbyQP: 'api/sysLogs/findByOperRemark', // 系统日志条件查询     //通用接口已被更换掉    2019.9.12 sss
             customReportHpDictUpdate: 'api/sys/customReportHpDict/update',
             detailUser:'api/sysUser/detail', //查 用户
             getUserSYAndZSDept: "api/sysDeptDict/getUserSYAndZSDept", //按照用户类别和科室ID查找
             getRegistIndexList: 'api/hspmn/regist/registIndex/getRegistIndexList', //新 号表设置的查询
             findUserByWorkType: "api/sysUser/findUserByWorkType", //按照用户类别和科室ID查找
             queryPatientBasicInformation: '/api/ehrResidentIndex/queryPatientBasicInformation', //查询病人的基本信息

        hospitalBasicData: [],
        nationality: []
    },
    mutations: {
        setHospitalBasic(state, params) {
            state.hospitalBasicData = params
        },
        nationalityList(state, params) {
            state.nationality = params
        }
    },
    actions: {
        getSysMenu ({ dispatch, commit, state }, params) {
            return util.ajax({
                method: 'post',
                url: util.BaseURL + state.sysMenuListByParam + '?' + qs.stringify(params),
            })
        },
        mdAddSysMenuNEW ({ dispatch, commit, state }, params) {
            return util.ajax({
                method: 'post',
                url: util.BaseURL + state.sysMenuMdaddNEW,
                data: params
            })
        },
        mdUpdateSysMenuNEW ({ dispatch, commit, state }, params) {
            return util.ajax({
                method: 'post',
                url: util.BaseURL + state.sysMenuMdupdateNEW,
                data: params
            })
        },
        delSysMenu ({ dispatch, commit, state }, params) {
            return util.ajax({
                method: 'post',
                url: util.BaseURL + state.sysMenueDel + '?id=' + params
            })
        },
        queryMenuListNew ({ dispatch, commit, state }, params) {
            return util.ajax({
                method: 'post',
                url: util.BaseURL + state.queryMenuListNew + '?' + qs.stringify(params)
            })
        },
        
        queryPatientBasicInformation ({ dispatch, commit, state }, params) { //查询病人的基本信息
            return util.ajax({
                method: 'get',
                url: util.BaseURL + state.queryPatientBasicInformation + '?' + qs.stringify(params),
            })
        },
        //按照用户类别和科室ID查找
        findUserByWorkTypes({ dispatch, commit, state }, params) { //查询价表信息
            return util.ajax({
                method: 'post',
                url: util.BaseURL + state.findUserByWorkType + '?' + qs.stringify(params)
            })
        },
        getRegistIndexList ({ dispatch, commit, state }, params) {
            return util.ajax({
                method: 'post',
                url: util.BaseURL + state.getRegistIndexList + '?' + qs.stringify(params)
            })
        },
        //查科室
        getUserSYAndZSDept({ dispatch, commit, state }, params) { //查询价表信息
            return util.ajax({
                method: 'post',
                url: util.BaseURL + state.getUserSYAndZSDept + '?' + qs.stringify(params)
            })
        },
        detailUsers({ dispatch, commit, state }, params) { //获取用户数组
            return util.ajax({
                method: 'post',
                url: util.BaseURL + state.detailUser + '?' + qs.stringify(params)
            })
        },

        updateCustomReportHpDict({ dispatch, commit, state }, params) {
            return util.ajax({
                method: 'post',
                url: util.BaseURL + state.customReportHpDictUpdate,
                data: params
            })
        },
        getSysLogsByQP ({ dispatch, commit, state }, params) {
            return util.ajax({
                method: 'post',
                url: util.BaseURL + state.sysLogsSelbyQP + '?' + qs.stringify(params),
            })
        },
        getListBySearchParam ({ dispatch, commit, state }, params) {
            return util.ajax({
                method: 'post',
                url: util.BaseURL + state.listBySearchParams + '?' + qs.stringify(params),
            })
        },
        ajaxUpdParameter ({ dispatch, commit, state }, params) {
            return util.ajax({
                method: 'post',
                url: util.BaseURL + state.sysParameterUpd,
                data: params
            })
        },
        getNursesReceptionList({ dispatch, commit, state }, params) {
            return util.ajax({
                method: 'post',
                url: util.BaseURL + state.nursesReceptionListbyQueryParam + '?' + qs.stringify(params)
            })
        },
        listbyQueryParamsss ({ dispatch, commit, state }, params) {
            return util.ajax({
                method: 'post',
                url: util.BaseURL + state.listbyQueryParamss + '?' + qs.stringify(params),
            })
        },
        getStoragePhamDictTotle({ dispatch, commit, state }, params) {
            return util.ajax({
                method: 'post',
                url: util.BaseURL + state.getQueryStoragePharmList + '?' + qs.stringify(params),
            })
        },

        detailEhrServicePersonal({ dispatch, commit, state }, params) {
            return util.ajax({
                method: 'post',
                url: util.BaseURL + state.ehrServicePersonalDetail + '?' + qs.stringify(params)
            });
        },
        getCommDict({ dispatch, commit, state }, params) {
            return util.ajax({
                method: 'post',
                url: util.BaseURL + state.commDictQuery + '?' + qs.stringify(params)
            })
        },
           //获取自定义报表树接口
      customReportDictList({ dispatch, commit, state }, params) {
        return util.ajax({
            method: 'post',
            url: util.BaseURL + state.customReportDictList + '?' + qs.stringify(params),
        })
       },
        addSysGroup({ dispatch, commit, state }, params) {
            return util.ajax({
                method: 'post',
                url: util.BaseURL + state.sysGroupAdd,
                data: params
            })
        },
        tableNoListByParam ({ dispatch, commit, state }, params) {
            return util.ajax({
                method: 'post',
                url: util.BaseURL + state.tableNoListByParam + '?' + qs.stringify(params)
            })
        },
        syncPk({ dispatch, commit, state }, params) {
            return util.ajax({
                method: 'post',
                url: util.BaseURL + state.syncPk + '?' + qs.stringify(params),
            })
        },
        updateRedisFromDb({ dispatch, commit, state }, params) {
            return util.ajax({
                method: 'post',
                url: util.BaseURL + state.updateRedisFromDb + '?' + qs.stringify(params),
            })
        },
        getMaxDBAndRedisValue({ dispatch, commit, state }, params) {
            return util.ajax({
                method: 'post',
                url: util.BaseURL + state.getMaxDBAndRedisValue + '?' + qs.stringify(params),
            })
        },
        updatabasicData ({ dispatch, commit, state }, params) { //更新病人的基本信息
            return util.ajax({
                method: 'post',
                url: util.BaseURL + state.updatabasic,
                data: params
            })
        },
      

        newCurHDDictQueryBasicDataValue({ dispatch, commit, state }, params) {
            return util.ajax({
                method: 'post',
                url: util.BaseURL + state.newBasicDataValueCurHDDictQuery + '?' + qs.stringify(params)
            })
        },
        findAdminIdCurHDDictQuery({ dispatch, commit, state }, params) {
            return util.ajax({
                method: 'post',
                url: util.BaseURL + state.findAdminIdCurHDDictQuery + '?' + qs.stringify(params)
            })
        },
        // 频次字典
        getFrequency({ dispatch, commit, state }, params) {
            return util.ajax({
                method: 'post',
                url: util.BaseURL + state.frequencyDictDetail + '?' + qs.stringify(params)
            })
        },
        addFrequency({ dispatch, commit, state }, params) {
            return util.ajax({
                method: 'post',
                url: util.BaseURL + state.frequencyDictAdd,
                data: params
            })
        },
        updateFrequency({ dispatch, commit, state }, params) {
            return util.ajax({
                method: 'post',
                url: util.BaseURL + state.frequencyDictUpdate,
                data: params
            })
        },
        // 用法字典
        getAdministrationDict({ dispatch, commit, state }, params) {
            return util.ajax({
                method: 'post',
                url: util.BaseURL + state.administrationDictDetail + '?' + qs.stringify(params)
            })
        },
        addAdministrationDict({ dispatch, commit, state }, params) {
            return util.ajax({
                method: 'post',
                url: util.BaseURL + state.administrationDictAdd,
                data: params
            })
        },
        updateAdministrationDict({ dispatch, commit, state }, params) {
            return util.ajax({
                method: 'post',
                url: util.BaseURL + state.administrationDictUpdate,
                data: params
            })
        },
        // 护理等级
        nursingUpdate({ dispatch, commit, state }, params) {
            return util.ajax({
                method: 'post',
                url: util.BaseURL + state.nursingUpdate,
                data: params
            })
        },
        nursingDictAdd({ dispatch, commit, state }, params) {
            return util.ajax({
                method: 'post',
                url: util.BaseURL + state.nursingDictAdd,
                data: params
            })
        },
        nursingDictDetail({ dispatch, commit, state }, params) {
            return util.ajax({
                method: 'post',
                url: util.BaseURL + state.nursingDictDetail + '?' + qs.stringify(params)
            })
        },
        itemClassAddFn({ dispatch, commit, state }, params) { 
            return util.ajax({
                method: 'post',
                url: util.BaseURL + state.itemClassAdd,
                data:params
            })
        },
        itemClassDelFn({ dispatch, commit, state }, params) {
            return util.ajax({
                method: 'post',
                url: util.BaseURL + state.itemClassDel + '?' + qs.stringify(params)
            })
        },
        queryListByCodeR({ dispatch, commit, state }, params) { //查看病人的基本信息
            return util.ajax({
                method: 'post',
                url: util.BaseURL + state.queryListByCode + '?' + qs.stringify(params)
            })
        },
        queryByItemCode({ dispatch, commit, state }, params) {
            return util.ajax({
                method: 'post',
                url: util.BaseURL + state.queryByCode + '?' + qs.stringify(params)
            })
        },
        getSysPrimaryDataValueList({ dispatch, commit, state }, params) {
            return util.ajax({
                method: 'post',
                url: util.BaseURL + state.getSysPrimaryDataValueList + '?' + qs.stringify(params)
            });
        },
        getSysPrimaryDataQueryByCondition({ dispatch, commit, state }, params) {
            return util.ajax({
                method: 'post',
                url: util.BaseURL + state.sysPrimaryDataQueryByCondition + '?' + qs.stringify(params)
            });
        },
        querySysPrimaryList({ dispatch, commit, state }, params) {
            return util.ajax({
                method: 'post',
                url: util.BaseURL + state.querySysPrimaryList + '?' + qs.stringify(params)
            });
        },
        getPDOrHDAttrs({ dispatch, commit, state }, params) { //获取PD或者HD
            return util.ajax({
                method: 'post',
                url: util.BaseURL + state.pdOrHdAttrSel + '?' + qs.stringify(params),
            })
        },
        getValueDicLists({ dispatch, commit, state }, params) {
            return util.ajax({
                method: 'post',
                url: util.BaseURL + state.valueDicList + '?' + qs.stringify(params)
            })
        },
        updateBasicDataValue({ dispatch, commit, state }, params) {
            return util.ajax({
                method: 'post',
                url: util.BaseURL + state.basicDataValueUpdate,
                data: params
            })
        },
        basicDataValueByRemark({ dispatch, commit, state }, params) {
            return util.ajax({
                method: 'post',
                url: util.BaseURL + state.basicDataValueByRemark + "?" + qs.stringify(params)
            })
        },
        addBasicDataValue({ dispatch, commit, state }, params) {
            return util.ajax({
                method: 'post',
                url: util.BaseURL + state.basicDataValueAdd,
                data: params
            })
        },
        delHospitalBasic({ dispatch, commit, state }, params) {
            return util.ajax({
                method: 'post',
                url: util.BaseURL + state.hospitalBasicDel + "?" + qs.stringify(params)
            })
        },
        updateHospitalBasic({ dispatch, commit, state }, params) {
            return util.ajax({
                method: 'post',
                url: util.BaseURL + state.hospitalBasicUpdate,
                data: params
            })
        },
        addHospitalBasic({ dispatch, commit, state }, params) {
            return util.ajax({
                method: 'post',
                url: util.BaseURL + state.hospitalBasicAdd + "?" + qs.stringify(params)
            })
        },
        getTreeList({ dispatch, commit, state }, params) {
            return util.ajax({
                method: 'post',
                url: util.BaseURL + state.getTreeList + '?' + qs.stringify(params)
            })
        },
        termDictInit({ dispatch, commit, state }, params) {
            return util.ajax({
                method: 'post',
                url: util.BaseURL + state.termDictInit + '?' + qs.stringify(params)
            })
        },
        updateSysDiagDict({ dispatch, commit, state }, params) {
            return util.ajax({
                method: 'post',
                url: util.BaseURL + state.sysDiagDictUpdate,
                data: params
            });
        },
        addSysDiagDict({ dispatch, commit, state }, params) {
            return util.ajax({
                method: 'post',
                url: util.BaseURL + state.sysDiagDictAdd,
                data: params
            });
        },
        getSysParameterPageId({ dispatch, commit, state }, params) {
            return util.ajax({
                method: 'post',
                url: util.BaseURL + state.sysParameterListByParamId + '?' + qs.stringify(params)
            });
        },
        getListByDateValue({ dispatch, commit, state }, params) {
            return util.ajax({
                method: 'post',
                url: util.BaseURL + state.getListByDateValue + '?' + qs.stringify(params)
            });
        },
        delAliasDict({ dispatch, commit, state }, params) { //删除别名
            return util.ajax({
                method: 'post',
                url: util.BaseURL + state.aliasDictDel + '?' + qs.stringify(params)
            })
        },
        delClinicItemVsPrice({ dispatch, commit, state }, params) { //删除临床价表对应
            return util.ajax({
                method: 'post',
                url: util.BaseURL + state.ClinicItemVsPriceDel+ '?' + qs.stringify(params)
            })
        },
        updClinicItemVsPrice({ dispatch, commit, state }, params) { 
            return util.ajax({
                method: 'post',
                url: util.BaseURL + state.ClinicItemVsPriceUpd,
                data: params
            })
        },
        addClinicItemVsPrice({ dispatch, commit, state }, params) { 
            return util.ajax({
                method: 'post',
                url: util.BaseURL + state.ClinicItemVsPriceAdd,
                data: params
            })
        },
        getClinicItemVsPrice({ dispatch, commit, state }, params) { 
            return util.ajax({
                method: 'post',
                url: util.BaseURL + state.ClinicItemVsPriceSel,
                data: params
            })
        },
        getPerformeDept({ dispatch, commit, state }, params) { //获取执行科室
            return util.ajax({
                method: 'post',
                url: util.BaseURL + state.performeDeptSel,
                data: params
            })
        },
        updAliasDict({ dispatch, commit, state }, params) { 
            return util.ajax({
                method: 'post',
                url: util.BaseURL + state.aliasDictUpd,
                data: params
            })
        },
        addAliasDict({ dispatch, commit, state }, params) { 
            return util.ajax({
                method: 'post',
                url: util.BaseURL + state.aliasDictAdd,
                data: params
            })
        },
        getAliasDict({ dispatch, commit, state }, params) { 
            return util.ajax({
                method: 'post',
                url: util.BaseURL + state.aliasDictSel,
                data: params
            })
        },
        addClinicItem({ dispatch, commit, state }, params) {
            return util.ajax({
                method: 'post',
                url: util.BaseURL + state.clinicItemCodeAdd,
                data: params
            })
        },
        updClinicItem({ dispatch, commit, state }, params) { 
            return util.ajax({
                method: 'post',
                url: util.BaseURL + state.clinicItemCodeUpd,
                data: params
            })
        },
        getClinicItemQuery ({ dispatch, commit, state }, params) {
            return  util.ajax({
                method: 'post',
                url: util.BaseURL + state.clinicItemQuery + '?' + qs.stringify(params)
            });
        },
        getPriceU({ dispatch, commit, state }, params) { //获取价表数组(优化版)
            return util.ajax({
                method: 'post',
                url: util.BaseURL + state.priceDataSelU + '?' + qs.stringify(params),
            })
        },
        deptAdd({ dispatch, commit, state }, params) {
            return util.ajax({
                method: 'post',
                url: util.BaseURL + state.deptAdd,
                data: params
            });
        },
        deptUpdate({ dispatch, commit, state }, params) {
            return util.ajax({
                method: 'post',
                url: util.BaseURL + state.deptUpdate,
                data: params
            })
        },
        deptDelete({ dispatch, commit, state }, params) {
            return util.ajax({
                method: 'post',
                url: util.BaseURL + state.deptDelete + '?' + qs.stringify(params)
            })
        },
        addEhrServicePersonal({ dispatch, commit, state }, params) {
            return util.ajax({
                method: 'post',
                url: util.BaseURL + state.ehrServicePersonalAdd,
                data: params
            });
        },
        updateEhrServicePersonal({ dispatch, commit, state }, params) {
            return util.ajax({
                method: 'post',
                url: util.BaseURL + state.ehrServicePersonalUpdate,
                data: params
            });
        },
        updateEhrInstitutionIndex({ dispatch, commit, state }, params) {
            return util.ajax({
                method: 'post',
                url: util.BaseURL + state.ehrInstitutionIndexUpdate,
                data: params
            });
        },
        delEhrInstitutionIndex({ dispatch, commit, state }, params) {
            return util.ajax({
                method: 'post',
                url: util.BaseURL + state.ehrInstitutionIndexDel + '?' + qs.stringify(params)
            });
        },
        addEhrInstitutionIndex({ dispatch, commit, state }, params) {
            return util.ajax({
                method: 'post',
                url: util.BaseURL + state.ehrInstitutionIndexAdd,
                data: params
            });
        },
        departTabList({ dispatch, commit, state }, params) {
            return util.ajax({
                method: 'post',
                url: util.BaseURL + state.departTabList + '?' + qs.stringify(params),
            })
        },
        //最新获取科室接口
        getDeptDictOnly({ dispatch, commit, state }, params) {
            return util.ajax({
                method: 'post',
                url: util.BaseURL + state.deptQuery + '?' + qs.stringify(params),
            })
        },
            // 卫生人员
        getEhrServicePersonalNew({ dispatch, commit, state }, params) {
            return util.ajax({
                method: 'post',
                url: util.BaseURL + state.ehrServicePersonalListNew + '?' + qs.stringify(params),
            })
        },
        getTheHospitalList({ dispatch, commit, state }, params) {
            return util.ajax({
                method: 'post',
                url: util.BaseURL + state.getTheHospitalList + '?' + qs.stringify(params)
            });
        },
        getHospitalDetail({ dispatch, commit, state }, params) {
            return util.ajax({
                method: 'post',
                url: util.BaseURL + state.getHospitalDetail + '?' + qs.stringify(params)
            });
        },
        getHospitallist({ dispatch, commit, state }, params) {
            return util.ajax({
                method: 'post',
                url: util.BaseURL + state.getHospitalList + '?' + qs.stringify(params)
            });
        },
        getFDAttr ({ dispatch, commit, state }, params) {
            return util.ajax({
                method: 'post',
                url: util.BaseURL + state.getFD,
                data: params
            })
        },
        findRegion({ dispatch, commit, state }, params) { 
            return util.ajax({
                method: 'post',
                url: util.BaseURL + state.findRegion
            })
        },
        getBasicDataValueSel({ dispatch, commit, state }, params) {
            return util.ajax({
                method: 'post',
                url: util.BaseURL + state.sysDiagDictDetailByQueryParam + '?' + qs.stringify(params)
            });
        },
        modifyStatusUser ({ dispatch, commit, state }, params) {
            return util.ajax({
                method: 'post',
                url: util.BaseURL + state.modifyStatusUser + '?' + qs.stringify(params),
            })
        },
        checkLoginName ({ dispatch, commit, state }, params) {
            return util.ajax({
                method: 'post',
                url: util.BaseURL + state.checkLoginName + '?' + qs.stringify(params),
            })
        },
        getSysGroupMenuList ({ dispatch, commit, state }, params) {
            return util.ajax({
                method: 'post',
                url: util.BaseURL + state.getSysGroupMenuList + '?' + qs.stringify(params),
            })
        },
        getAttr ({ dispatch, commit, state }, params) {
            return  util.ajax({
                method: 'post',
                url: util.BaseURL + state.attrListByParam,
                data: params
            });
        },
    }
}

export default attribute;