import util from '../../libs/util';
import qs from 'qs';

const sysUser = {
    state: {
        sysUserListByParamNEW: 'api/sysUser/querySysUserList', //获取表格数据
        sysUserAdd: 'api/sysUser/add',
        sysUserUpdate: 'api/sysUser/update',
        sysUserResetPsw: 'api/sysUser/resetUserPsw',//重置密码接口
        
        getUserImg: 'getHeadPortraitURL',//获取头像接口


        //以下是资源权限的接口 10.26 yn
        getSysResourceGroup:'api/sysGroup/getSysResourceGroup',
        getGroupResource:'api/sysUserResource/getGroupResource',
        getAllUser:'api/sysUser/getAllUser',
        sysGroupMenuAdd:'api/sysGroupMenu/add',
        sysGroupMenuDeleteByUserId:'api/sysGroupMenu/deleteByUserId',
        sysUserResourceFztDelete:'api/sysUserResource/deleteGroupResource', //勾选删除 资源权限
        batchAddGroupUser:"api/sysGroupMenu/batchAddGroupUser",
        getbusinessPermissions:"api/sysUserResource/businessPermissions",
        batchAddftz:"api/sysUserResource/batchAdd",
        batchupdate:"api/sysUserResource/update",
        addGroups:"api/sysGroup/add",
        updateGroups:"api/sysGroup/update",
        deleteGroups:"api/sysGroup/deleteGroup",
        getUserGroups:'api/sysGroup/getUserGroup',
        getUserGroupResources:'api/sysUserResource/getUserGroupResource',
        getBusinessDicts:'api/sys/sysBusinessDict/getBusinessDict',
        getYwzRegistIndex:'api/sysUserResource/personalRegistIndex',
        personalReceptAndConsult:'api/sysUserResource/personalReceptAndConsult',
        deptAuthorization:'api/sysUserResource/deptAuthorization',
        personalPharm:'api/sysUserResource/personalPharm',
        personalPharmRepertory:'api/sysUserResource/personalPharmRepertory',
        authorizeInformation:'api/sysUserResource/authorizeInformation',
        customReportAuthorization:'api/sysUserResource/customReportAuthorization',
        menuAuthorization:'api/sysUserResource/menuAuthorization',
        reportAuthorization:'api/sysUserResource/reportAuthorization',


        // 以下为标识数据的接口  10.25 yn
        sysFlagDataListByParam: 'api/sysFlagData/getSysFlagDataList',//获取下下框里面的列表
        sysDirectoryListbyQueryParam: 'api/sysDirectory/getSysDirectoryList',//获取左侧列表
        sysFlagValListByParam: 'api/sysFlagDataValue/getSysFlagDataValueList',//点击树的数据来源
        sysDirectoryDelete: 'api/sysDirectory/delete',//左侧树的删除
        sysFlagDataDel: 'api/sysFlagData/delete',//左侧树子节点的删除
        sysFlagValDel: 'api/sysFlagDataValue/delete',//右侧表格的删除
        sysFlagValAdd: 'api/sysFlagDataValue/add',//标识数据的新增
        sysFlagValUpdate: 'api/sysFlagDataValue/update',//标识数据的修改
        sysFlagDataAdd: 'api/sysFlagData/add',//左侧树的新增
        sysDirectoryAdd: 'api/sysDirectory/add',//标识数据新增
        sysDirectoryupdate: '/api/sysDirectory/update',  //父节点更新接口
        sysFlagDataUpdate: 'api/sysFlagData/update',//子节点更新接口


        // 以下为报表管理接口
        getCustomReportDict :"/api/sys/customReportDict/findCustomReportDict",//报表查询
        customReportDictAdd: 'api/sys/customReportDict/add',//新增
        customReportDictUpdate: 'api/sys/customReportDict/update',//更新
        customReportDictDelete: 'api/sys/customReportDict/delete',//删除



        //以下为报表查询的接口
        findInpPatient:'findInpPatient', // 报表查询病人住院信息 2019/7/11 yn
        findOutPatient:'findOutPatient', // 报表查询病人门诊信息 2019/7/12 yn
        findPatientPresc: 'findPatientPresc', // 报表查询 处方查询 2019/7/12 yn
        findInpMaster: 'findInpMaster', // 报表查询 出院病人查询 2019/7/12 yn
        findInpApp: 'findInpApp', // 报表查询 住院预约查询 2019/7/12 yn
        findMaterialConsumeByDept: 'findMaterialConsumeByDept', // 报表查询 科室材料消耗统计(医技) 2019/7/12 yn
        findDrugConsumeByDept: 'findDrugConsumeByDept', // 报表查询 科室药品消耗统计(医技) 2019/7/12 yn
        findRegistRecord: 'findRegistRecord', // 报表查询 门诊挂号查询 2019/7/13 yn
        findOutpVisit: 'findOutpVisit', // 报表查询 门诊挂号查询 2019/7/13 yn
        findWorkloadStatistics: 'findWorkloadStatistics', // 报表查询 门诊操作员工作量统计 2019/7/13 yn
        findAppointRecord: 'findAppointRecord', // 报表查询 门诊操作员工作量统计 2019/7/13 yn
        findWardBedInfo: 'findWardBedInfo', // 报表查询 床位状态查询 2019/7/15 yn
        findOperationInfo: 'findOperationInfo', // 报表查询 手术安排查询 2019/7/15 yn
        findDrugByWardId: 'findDrugByWardId', // 报表查询 病区领药查询 2019/7/15 yn
        findPatientDrugOrders: 'findPatientDrugOrders', // 报表查询 病人用药查询 2019/7/15 yn
        findInpNurseWorkloadStatistics: 'findInpNurseWorkloadStatistics', // 报表查询 住院护士工作量统计 2019/7/15 yn
        findWardMaterialChargeNew: 'findWardMaterialChargeNew', // 报表查询 病区材料消耗统计（新） 2019/7/15 yn
        findInpBabyInfo: 'findInpBabyInfo', // 报表查询 产婴信息 2019/7/15 yn


        //以下为信用管理的接口
        creditRoleSetGet: '/api/hspmn/credit/creditRoleSet/getCreditRoleSetList', //获取信用记录
        creditRoleSetUpd: '/api/hspmn/credit/creditRoleSet/update',//修改信用记录
        creditRoleSetAdd: '/api/hspmn/credit/creditRoleSet/add', // 新增信用记录
        creditRoleSetDel: '/api/hspmn/credit/creditRoleSet/delete', // 删除信用记录

        
        userImg: ''
    },
    mutations: {
        setUserImg(state, params) {
            state.userImg = params
        },
    },
    actions: {
        delCreditRoleSet({ dispatch, commit, state }, params) {
            return util.ajax({
                method: 'post',
                url: util.BaseURL + state.creditRoleSetDel+ '?' + qs.stringify(params),
            })
        },     
        addCreditRoleSet({ dispatch, commit, state }, params) {
            return util.ajax({
                method: 'post',
                url: util.BaseURL + state.creditRoleSetAdd,
                data: params
            })
        },
        updCreditRoleSet({ dispatch, commit, state }, params) {
            return util.ajax({
                method: 'post',
                url: util.BaseURL + state.creditRoleSetUpd,
                data: params
            })
        },    
        getCreditRoleSet({ dispatch, commit, state }, params) {
            return util.ajax({
                method: 'post',
                url: util.BaseURL + state.creditRoleSetGet+ '?' + qs.stringify(params),
            })
        },
        findInpBabyInfo ({ dispatch, commit, state }, params) {
            var data;
            return data = util.ajax({
                method: 'post',
                url: util.BaseURL + state.findInpBabyInfo + '?' + qs.stringify(params)
            });
        },
        findWardMaterialChargeNew ({ dispatch, commit, state }, params) {
            var data;
            return data = util.ajax({
                method: 'post',
                url: util.BaseURL + state.findWardMaterialChargeNew + '?' + qs.stringify(params)
            });
        },
        findInpNurseWorkloadStatistics ({ dispatch, commit, state }, params) {
            var data;
            return data = util.ajax({
                method: 'post',
                url: util.BaseURL + state.findInpNurseWorkloadStatistics + '?' + qs.stringify(params)
            });
        },
        findPatientDrugOrders ({ dispatch, commit, state }, params) {
            var data;
            return data = util.ajax({
                method: 'post',
                url: util.BaseURL + state.findPatientDrugOrders + '?' + qs.stringify(params)
            });
        },
        findDrugByWardId ({ dispatch, commit, state }, params) {
            var data;
            return data = util.ajax({
                method: 'post',
                url: util.BaseURL + state.findDrugByWardId + '?' + qs.stringify(params)
            });
        },
        findOperationInfo ({ dispatch, commit, state }, params) {
            var data;
            return data = util.ajax({
                method: 'post',
                url: util.BaseURL + state.findOperationInfo + '?' + qs.stringify(params)
            });
        },
        findWardBedInfo ({ dispatch, commit, state }, params) {
            var data;
            return data = util.ajax({
                method: 'post',
                url: util.BaseURL + state.findWardBedInfo + '?' + qs.stringify(params)
            });
        },
        findAppointRecord ({ dispatch, commit, state }, params) {
            var data;
            return data = util.ajax({
                method: 'post',
                url: util.BaseURL + state.findAppointRecord + '?' + qs.stringify(params)
            });
        },
        findWorkloadStatistics ({ dispatch, commit, state }, params) {
            var data;
            return data = util.ajax({
                method: 'post',
                url: util.BaseURL + state.findWorkloadStatistics + '?' + qs.stringify(params)
            });
        },
        findOutpVisit ({ dispatch, commit, state }, params) {
            var data;
            return data = util.ajax({
                method: 'post',
                url: util.BaseURL + state.findOutpVisit + '?' + qs.stringify(params)
            });
        },
        findRegistRecord ({ dispatch, commit, state }, params) {
            var data;
            return data = util.ajax({
                method: 'post',
                url: util.BaseURL + state.findRegistRecord + '?' + qs.stringify(params)
            });
        },
        findDrugConsumeByDept ({ dispatch, commit, state }, params) {
            var data;
            return data = util.ajax({
                method: 'post',
                url: util.BaseURL + state.findDrugConsumeByDept + '?' + qs.stringify(params)
            });
        },
        findMaterialConsumeByDept ({ dispatch, commit, state }, params) {
            var data;
            return data = util.ajax({
                method: 'post',
                url: util.BaseURL + state.findMaterialConsumeByDept + '?' + qs.stringify(params)
            });
        },
        findInpApp ({ dispatch, commit, state }, params) {
            var data;
            return data = util.ajax({
                method: 'post',
                url: util.BaseURL + state.findInpApp + '?' + qs.stringify(params)
            });
        },
        findInpMaster ({ dispatch, commit, state }, params) {
            var data;
            return data = util.ajax({
                method: 'post',
                url: util.BaseURL + state.findInpMaster + '?' + qs.stringify(params)
            });
        },
        findPatientPresc ({ dispatch, commit, state }, params) {
            var data;
            return data = util.ajax({
                method: 'post',
                url: util.BaseURL + state.findPatientPresc + '?' + qs.stringify(params)
            });
        },
        findOutPatient ({ dispatch, commit, state }, params) {
            var data;
            return data = util.ajax({
                method: 'post',
                url: util.BaseURL + state.findOutPatient + '?' + qs.stringify(params)
            });
        },
        findInpPatient ({ dispatch, commit, state }, params) {
            var data;
            return data = util.ajax({
                method: 'post',
                url: util.BaseURL + state.findInpPatient + '?' + qs.stringify(params)
            });
        },


        //
        delCustomReportDict({ dispatch, commit, state }, params) {
            return util.ajax({
                method: 'post',
                url: util.BaseURL + state.customReportDictDelete + '?' + qs.stringify(params)
            })
        },
        updateCustomReportDict({ dispatch, commit, state }, params) {
            return util.ajax({
                method: 'post',
                url: util.BaseURL + state.customReportDictUpdate,
                data: params
            })
        },
        addCustomReportDict({ dispatch, commit, state }, params) {
            return util.ajax({
                method: 'post',
                url: util.BaseURL + state.customReportDictAdd,
                data: params
            })
        },
        getCustomReportDicts({ dispatch, commit, state }, params) {
            return util.ajax({
                method: 'post',
                url: util.BaseURL + state.getCustomReportDict + '?' + qs.stringify(params)
            })
        },
        getSysFlagData({ dispatch, commit, state }, params) {
            return util.ajax({
                method: 'post',
                url: util.BaseURL + state.sysFlagDataListByParam 
            })
        },
        addSysFlagData({ dispatch, commit, state }, params) {
            return util.ajax({
                method: 'post',
                url: util.BaseURL + state.sysFlagDataAdd,
                data: params
            })
        },
        updateSysFlagData({ dispatch, commit, state }, params) {
            return util.ajax({
                method: 'post',
                url: util.BaseURL + state.sysFlagDataUpdate,
                data: params
            })
        },
        sysDirectoryupdate({ dispatch, commit, state }, params) {//父节点的更新  新增的
            return util.ajax({
                method: 'post',
                url: util.BaseURL + state.sysDirectoryupdate,
                data: params
            })
        },
        delSysFlagData({ dispatch, commit, state }, params) {
            return util.ajax({
                method: 'post',
                url: util.BaseURL + state.sysFlagDataDel + '?' + qs.stringify(params)
            })
        },
        // 值
        getSysFlagVal({ dispatch, commit, state }, params) {
            return util.ajax({
                method: 'post',
                url: util.BaseURL + state.sysFlagValListByParam + '?' + qs.stringify(params)
            })
        },
        addSysFlagVal({ dispatch, commit, state }, params) {
            return util.ajax({
                method: 'post',
                url: util.BaseURL + state.sysFlagValAdd,
                data: params
            })
        },
        updateSysFlagVal({ dispatch, commit, state }, params) {
            return util.ajax({
                method: 'post',
                url: util.BaseURL + state.sysFlagValUpdate,
                data: params
            })
        },
        delSysFlagVal({ dispatch, commit, state }, params) {
            return util.ajax({
                method: 'post',
                url: util.BaseURL + state.sysFlagValDel,
                data: params
            })
        },
        getSysDirectory({ dispatch, commit, state }, params) {
            return util.ajax({
                method: 'post',
                url: util.BaseURL + state.sysDirectoryListbyQueryParam + '?' + qs.stringify(params),
            })
        },
        addSysDirectory({ dispatch, commit, state }, params) {
            return util.ajax({
                method: 'post',
                url: util.BaseURL + state.sysDirectoryAdd,
                data: params
            })
        },
        delSysDirectory({ dispatch, commit, state }, params) {
            return util.ajax({
                method: 'post',
                url: util.BaseURL + state.sysDirectoryDelete + '?' + qs.stringify(params)
            })
        },
        reportAuthorizations({ dispatch, commit, state }, params) {
            return util.ajax({
                method: 'post',
                url: util.BaseURL + state.reportAuthorization + '?' + qs.stringify(params),
            })
        },
        menuAuthorizations({ dispatch, commit, state }, params) {
            return util.ajax({
                method: 'post',
                url: util.BaseURL + state.menuAuthorization + '?' + qs.stringify(params),
            })
        },
        customReportAuthorizations({ dispatch, commit, state }, params) {
            return util.ajax({
                method: 'post',
                url: util.BaseURL + state.customReportAuthorization + '?' + qs.stringify(params),
            })
        },
        authorizeInformations({ dispatch, commit, state }, params) {
            return util.ajax({
                method: 'post',
                url: util.BaseURL + state.authorizeInformation + '?' + qs.stringify(params),
            })
        },
        personalPharmRepertorys({ dispatch, commit, state }, params) {
            return util.ajax({
                method: 'post',
                url: util.BaseURL + state.personalPharmRepertory + '?' + qs.stringify(params),
            })
        },
        personalPharms({ dispatch, commit, state }, params) {
            return util.ajax({
                method: 'post',
                url: util.BaseURL + state.personalPharm + '?' + qs.stringify(params)
            })
        },
        deptAuthorizations({ dispatch, commit, state }, params) {
            return util.ajax({
                method: 'post',
                url: util.BaseURL + state.deptAuthorization + '?' + qs.stringify(params)
            })
        },
        personalReceptAndConsults({ dispatch, commit, state }, params) {
            return util.ajax({
                method: 'post',
                url: util.BaseURL + state.personalReceptAndConsult + '?' + qs.stringify(params),
            })
        },
        getYwzRegistIndexS({ dispatch, commit, state }, params) {
            return util.ajax({
                method: 'post',
                url: util.BaseURL + state.getYwzRegistIndex + '?' + qs.stringify(params),
            })
        },
        batchupdates({ dispatch, commit, state }, params) {
            return util.ajax({
                method: 'post',
                url: util.BaseURL + state.batchupdate,
                data: params
            })
        },
        getBusinessDictSs({ dispatch, commit, state }, params) {
            return util.ajax({
                method: 'post',
                url: util.BaseURL + state.getBusinessDicts + '?' + qs.stringify(params)
            })
        },
        addGroupSs({ dispatch, commit, state }, params) {
            return util.ajax({
                method: 'post',
                url: util.BaseURL + state.addGroups,
                data: params
            })
        },
        updateGroupSs({ dispatch, commit, state }, params) {
            return util.ajax({
                method: 'post',
                url: util.BaseURL + state.updateGroups,
                data: params
            })
        },
        deleteGroupSs({ dispatch, commit, state }, params) {
            return util.ajax({
                method: 'post',
                url: util.BaseURL + state.deleteGroups + '?' + qs.stringify(params)
            })
        },
        getbusinessPermissionS({ dispatch, commit, state }, params) {
            return util.ajax({
                method: 'post',
                url: util.BaseURL + state.getbusinessPermissions + '?' + qs.stringify(params)
            })
        },
        batchAddGroupUsers({ dispatch, commit, state }, params) {
            return util.ajax({
                method: 'post',
                url: util.BaseURL + state.batchAddGroupUser,
                data: params
            })
        },
        batchAddftzs({ dispatch, commit, state }, params) {
            return util.ajax({
                method: 'post',
                url: util.BaseURL + state.batchAddftz,
                data: params[1]
            })
        },
        sysUserResourceFztDeletes({ dispatch, commit, state }, params) {
            return util.ajax({
                method: 'post',
                url: util.BaseURL + state.sysUserResourceFztDelete + '?' + qs.stringify(params),
            })
        },
        sysGroupMenuDeleteByUserIds({ dispatch, commit, state }, params) {
            return util.ajax({
                method: 'post',
                url: util.BaseURL + state.sysGroupMenuDeleteByUserId + '?' + qs.stringify(params)
            })
        },
        sysGroupMenuAdds({ dispatch, commit, state }, params) {
            return util.ajax({
                method: 'post',
                url: util.BaseURL + state.sysGroupMenuAdd,
                data: params
            })
        },
        getUserGroupss({ dispatch, commit, state }, params) {
            return util.ajax({
                method: 'post',
                url: util.BaseURL + state.getUserGroups + '?' + qs.stringify(params),
            })
        },
        getUserGroupResourcess({ dispatch, commit, state }, params) {
            return util.ajax({
                method: 'post',
                url: util.BaseURL + state.getUserGroupResources + '?' + qs.stringify(params),
            })
        },
        getAllUsers({ dispatch, commit, state }, params) {
            return util.ajax({
                method: 'post',
                url: util.BaseURL + state.getAllUser + '?' + qs.stringify(params),
            })
        },
        getGroupResources({ dispatch, commit, state }, params) {
            return util.ajax({
                method: 'post',
                url: util.BaseURL + state.getGroupResource + '?' + qs.stringify(params),
            })
        },
        getSysResourceGroups({ dispatch, commit, state }, params) {
            return util.ajax({
                method: 'post',
                url: util.BaseURL + state.getSysResourceGroup + '?' + qs.stringify(params),
            })
        },
        getSysUserNEW({ dispatch, commit, state }, params) {
            return util.ajax({
                method: 'post',
                url: util.BaseURL + state.sysUserListByParamNEW + '?' + qs.stringify(params)
            })
        },
  
      
     
   
        addSysUser({ dispatch, commit, state }, params) {
            return util.ajax({
                method: 'post',
                url: util.BaseURL + state.sysUserAdd,
                data: params
            })
        },
        getUserImg({ dispatch, commit, state }, params) {
            return util.ajax({
                method: 'post',
                url: util.BaseURL + state.getUserImg + '?' + qs.stringify(params),
            })
        },
        updateSysUser({ dispatch, commit, state }, params) {
            return util.ajax({
                method: 'post',
                url: util.BaseURL + state.sysUserUpdate,
                data: params
            })
        },
        //20180602写
        resetPswSysUser({ dispatch, commit, state }, params) {
            return util.ajax({
                method: 'post',
                url: util.BaseURL + state.sysUserResetPsw+ '?' + qs.stringify(params),
            })
        },
    }
}
export default sysUser