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
  name: "syncPk",
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
            title: "功能",
            key: "theKey"
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
                          console.log(params.row)
                            if(params.row.theKey=='同步主键'){
                               this.getTest()
                            }else{
                                this.getRedisTest()
                            }
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
        data1: [
            {
                theKey:'同步主键'
            },
            {
                theKey:'系统代码同步'
            }
        ]
      }
    };
  },
  mounted() {
    this.tableHeight =
      window.innerHeight - this.$refs.table.$el.offsetTop - 230;
  },
  methods: {
    getTest() {
      let newData = {
        key: 'primaryKeyInit'
      };
      this.$store.dispatch("syncPk", newData).then(res => {
        if ( res.data.code !== 200) {
          util.showMsg(this, res.data);
        } else{
          util.showMsg(this, {succ: "主键同步成功"});
        }
      });
    },
    getRedisTest() {
      let newData = {
        codeType: ""
      };
      this.$store.dispatch("updateRedisFromDb", newData).then(res => {
        this.loading.orderLoading = false;
        if ( res.data.code !== 200) {
          util.showMsg(this, res.data);
        } else {
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
