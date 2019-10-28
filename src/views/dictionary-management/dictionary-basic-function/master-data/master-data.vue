<style lang="less" scoped>
@import "../../../../styles/common.less";
@import "./master-data.less";
</style>

<template>
  <div class="master-data"
       style="padding: 13px 17px 0;background: #fff;width:100%;height:100%">
    <div>
      <label class="control-label"
             for="lookup">查找条件</label>
      <div class="controls">
        <Input id="lookup"
               v-model="seachResult"
               @change="lookupResult"
               placeholder="请输入主数据名的首字母或汉字或区间编码"
               clearable
               style="width: 300px" />
      </div>
    </div>
    <div style="margin-top: 15px;height:76%">
      <Row style="height:100%">
        <i-Col span="24"
               style="height:100%">
          <Tab :result="seachResult"
               :page="page"
               v-on:getData="getCoverData"
               @valuetitle="valuetitle"
               @pages="pages"
               @loading="loading"
               :pageSize="pageSize"
               @modal="modal"
               @value="dataValue" />
          <!-- 弹框 -->
          <Modal :title="valueTitle"
                 v-model="showModal"
                 :mask-closable="false"
                 :closable="false">
            <Table highlight-row
                   disabled-hover
                   stripe
                   border
                   :columns="columns1"
                   :data="data1"
                   :loading="isloading"
                   height="500"></Table>
            <Page @Page="changPageCover"
                  style="margin-top:5px"
                  @pageNum="changPageNumM"
                  :tabpage="tabPageCover" />
            <div slot="footer">
              <Button type="primary"
                      @click="planSubmit">取消
              </Button>
            </div>
          </Modal>

        </i-Col>
      </Row>
      <div style="margin: 12px;float:right">
        <Page @Page="changPage"
              :tabpage="tabPage"
              @pageNum="changPageNum" />
      </div>
    </div>
  </div>
</template>

<script>
import Page from '../../../components/page1.vue';
import util from '../../../../libs/util.js';
import Tab from '../../../components/tab.vue'
export default {
  name: 'master-data',
  data () {
    return {
      showModal: false,
      isloading: true,
      page: 1,
      tabPage: 1,
      pageSize: 15,
      pageCover: 1,
      tabPageCover: 1,
      pageSizeCover: 15,
      valueTitle: '',
      seachResult: '',
      getVal: {},
      columns1: [
        {
          title: '主数据值',
          key: 'dataValue'
        },
        {
          title: '主数据说明',
          key: 'dataValueRemark'
        },
        {
          title: '排序号',
          key: 'serialNumber'
        }
      ],
      data1: []
    }
  },
  components: { Tab, Page },
  methods: {
    //弹窗里面的分页
    changPageCover (Page) {
      this.pageCover = Page
      this.getCoverData(this.getVal)
    },
    //主数据表格分页
    changPage (Page) {
      this.page = Page
    },
    //主数据切换每页多少条
    changPageNum (val) {
      this.tabPage = ""
      this.page = 1;
      this.pageSize = val;
    },
    //弹框切换每页多少条
    changPageNumM (val) {
      this.pageCover = 1;
      this.tabPageCover = ""
      this.pageSizeCover = val;
      this.getCoverData(this.getVal)
    },
    pages (Page) {
      this.tabPage = Page
    },
    valuetitle (title) {
      this.valueTitle = title
    },
    lookupResult (e) {
      this.seachResult = e.target.value.trim()
      e.target.value = ''
    },
    //弹框查询
    getCoverData (val) {
      console.log(val, '拿到的值')
      this.getVal = val
      let params = {
        page: this.pageCover,
        size: this.pageSizeCover,
        primarydataId: val.primarydataId
        // dataversionId: val.primarydataId
      }
      this.$store.dispatch('querySysPrimaryList', params).then(res => {
        if (res.data.code == 200) {
          this.data1 = res.data.data.list
          this.tabPageCover = res.data.data.pages
        } else {
          util.showMsg(this, { diy: res.data.message })
        }
      })
    },
    planSubmit () {
      this.pageCover = 1
      this.showModal = false
      this.tabPageCover = 1
    },
    //点击显示出来的
    modal (modal) {
      this.showModal = modal
      // console.log(this.dataValue, '酷酷酷')
    },
    dataValue (val) {
      //   this.data1 = val
    },
    loading (val) {
      this.isloading = val
    }
  }
};
</script>
