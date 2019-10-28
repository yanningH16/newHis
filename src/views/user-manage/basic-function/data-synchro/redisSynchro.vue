<template>
  <div class="bg-white">
  <Table disabled-hover
             highlight-row
             :height="tableHeight"
             ref="table"
             stripe
             border
             :loading="loading.orderLoading"
             :columns="tables.columns1"
             :data="tables.data1">
    </Table>
  </div>
</template>
<script>
import util from '../../../../libs/util';
export default {
  name: "redisSynchro",
  data() {
    return {
      dataList: [],
      tableHeight: 0,
      loading: {
        orderLoading: false
      },
      tables: {
        columns1: [
          {
            title: "名称",
            key: "datacodeTypes",
          },
          {
            title: "数据库值",
            key: "dBDatacodeNo",
            align:'center'
          },
          {
            title: "Redis值",
            key: "redisDatacodeNo",
            align:'center'
          },
          {
            title: "是否一致",
            key: "state",
            align:'center'
          },
          {
            title: "操作",
            key: "action",
            width: 80,
            align: "center",
            render: (h, params) => {
              return h("div", [
                h(
                  "Poptip",
                  {
                    props: {
                      trigger: "hover",
                      placement: "top"
                    }
                  },
                  [
                    h("i", {
                      class: util.icon.handle,
                      on: {
                        click: () => {
                             this.modify(params.row)
                        }
                      }
                    }),
                    h(
                      "div",
                      {
                        slot: "content"
                      },
                      "同步"
                    )
                  ]
                )
              ]);
            }
          }
        ],
        data1: []
      }
    };
  },
  mounted() {
    this.getTest();
    this.tableHeight =
      window.innerHeight - this.$refs.table.$el.offsetTop - 230;
  },
  methods: {
    getTest() {
      let newData = {
        codeType: ""
      };
      this.$store.dispatch("getMaxDBAndRedisValue", newData).then(res => {
        this.loading.orderLoading = false;
        if ( res.data.code !== 200) {
          util.showMsg(this, res.data);
        } else {
          this.tables.data1 = res.data.data;
          this.tables.data1.forEach(element => {
            element.datacodeTypes=element.datacodeType
            element["state"] =
              element.RedisDatacodeNo == element.DBDatacodeNo
                ? "相等"
                : "不相等";
          });
        }
      });
    },
    modify(val) {
      let theNewData = {
        codeType: val.datacodeType
      }
      this.$store.dispatch("updateRedisFromDb", theNewData).then(res => {
        if ( res.data.code !== 200) {
          util.showMsg(this, res.data);
        }else{
           this.getTest()
           util.showMsg(this, {succ: "Redis同步成功"});
        }
      });
    }
  }
  
};
</script>
<style lang="less" scoped>
@import "../../../../styles/common.less";
.hospitalDiagnosis {
  margin-top: 20px;
}
</style>
