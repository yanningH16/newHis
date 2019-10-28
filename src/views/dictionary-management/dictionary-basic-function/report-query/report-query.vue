<template>
  <div class="bg-white report-query">
    <div class="left">
      <Tree ref="leftTree"
            :data="leftTreeData"
            style="overflow-x:hidden"
            @on-select-change="clickTree"
            class="report-tree-content"></Tree>
    </div>
    <div class="right">
      <!-- 住院病人查询 -->
      <hospital-Patientsearch v-show="clickParams.id==0"></hospital-Patientsearch>
      <!-- 门诊病人查询 -->
      <outpatient-Patientsearch v-show="clickParams.id==1"></outpatient-Patientsearch>
      <!-- 处方查询 -->
      <prescription-Search v-show="clickParams.id==2"></prescription-Search>
      <!-- 出院病人费用查询 -->
      <outHospital-Costsearch v-show="clickParams.id==3"></outHospital-Costsearch>
      <!-- 住院预约查询 -->
      <hospital-Appointment v-show="clickParams.id==4"></hospital-Appointment>
      <!-- 科室材料消耗统计(医技) -->
      <material-Consumption v-show="clickParams.id==5"></material-Consumption>
      <!-- 科室药品消耗统计(医技) -->
      <drug-Consumption v-show="clickParams.id==6"></drug-Consumption>
      <!-- 门诊挂号记录查询 -->
      <registered-Records v-show="clickParams.id==7"></registered-Records>
      <!-- 门诊出诊查询 -->
      <outpatient-Visits v-show="clickParams.id==8"></outpatient-Visits>
      <!-- 门诊操作员工作量统计 -->
      <outpatient-Workload v-show="clickParams.id==9"></outpatient-Workload>
      <!-- 预约挂号查询 -->
      <apply-Register v-show="clickParams.id==10"></apply-Register>
      <!-- 病区床位查询 -->
      <wardBed v-show="clickParams.id==13"></wardBed>
      <!-- 手术安排查询 -->
      <operation-Search v-show="clickParams.id==14"></operation-Search>
      <!-- 病区领药查询 -->
      <apply-Drug v-show="clickParams.id==15"></apply-Drug>
      <!-- 病人用药清单 -->
      <patient-Drug v-show="clickParams.id==16"></patient-Drug>
      <!-- 住院护士工作量统计 -->
      <hospital-NurseWork v-show="clickParams.id==17"></hospital-NurseWork>
      <!-- 病区材料消耗统计      //c#端去掉-->
      <hospital-Material v-show="clickParams.id==18"></hospital-Material>
      <!-- 产婴登记信息 -->
      <baby-Info v-show="clickParams.id==19"></baby-Info>
    </div>
  </div>
</template>

<script>
import util from '../../../../libs/util.js'
import hospitalPatientsearch from './reportChildren/hospital-Patientsearch.vue'   //住院病人信息
import outpatientPatientsearch from './reportChildren/outpatient-Patientsearch'   //门诊病人信息
import prescriptionSearch from './reportChildren/prescription-Search'          //处方查询
import outHospitalCostsearch from './reportChildren/outHospital-costsearch'   //出院病人费用查询
import hospitalAppointment from './reportChildren/hospital-appointment'
import materialConsumption from './reportChildren/material-Consumption'
import drugConsumption from './reportChildren/drug-consumption'
import registeredRecords from './reportChildren/registered-Records'
import outpatientVisits from './reportChildren/outpatient-Visits'
import outpatientWorkload from './reportChildren/outpatient-Workload'
import applyRegister from './reportChildren/apply-register'
import wardBed from './reportChildren/ward-bed'
import operationSearch from './reportChildren/operation-search'
import applyDrug from './reportChildren/apply-drug'
import patientDrug from './reportChildren/patient-drug'
import hospitalNurseWork from './reportChildren/hospital-nurseWork'
import hospitalMaterial from './reportChildren/hospital-material'
import babyInfo from './reportChildren/baby-info'
export default {
  name: 'report-query',
  components: {
    hospitalPatientsearch,
    outpatientPatientsearch,
    prescriptionSearch,
    outHospitalCostsearch,
    hospitalAppointment,
    materialConsumption,
    drugConsumption,
    registeredRecords,
    outpatientVisits,
    outpatientWorkload,
    applyRegister,
    wardBed,
    operationSearch,
    applyDrug,
    patientDrug,
    hospitalNurseWork,
    hospitalMaterial,
    babyInfo
  },
  data () {
    return {
      clickParams: {},
      leftDataList: ['住院病人信息查询', '门诊病人信息查询', '处方查询', '出院病人费用查询', '住院预约查询', '科室材料消耗统计(医技)', '科室药品消耗统计(医技)', '门诊挂号记录查询', '门诊出诊查询', '门诊操作员工作量统计', '预约挂号查询', '门诊护士站工作量统计', '门诊护士站划价工作量统计', '病区床位查询', '手术安排查询', '病区领药查询', '病人用药清单', '住院护士工作量统计', '病区材料消耗统计', '产婴登记查询'],
      leftTreeData: [
        {
          title: '全部',
          expand: true,
          children: []
        }
      ],
    }
  },
  mounted () {
    this.leftDataList.forEach((element, i) => {
      this.leftTreeData[0].children.push({
        title: element,
        id: i
      });
    })
  },
  methods: {
    clickTree (val) {
      console.log(val, '看看这个的数据')
      if (util.isEmpty(val)) return
      this.clickParams = val[0]
    }
  }
}
</script>

<style lang="less" scoped>
@import "../../../../styles/common.less";
.report-query {
  display: flex;
  .left {
    height: 90%;
    overflow-y: auto;
    width: 20%;
    border-right: 2px solid #f3f3f3;
  }
  .right {
    margin-left: 10px;
    width: 80%;
  }
}
</style>
