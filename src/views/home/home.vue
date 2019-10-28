
<template>
  <div class="home-main bg-white"
       id="bgimg">
    <div style="position: relative;left: 30px;top: 20px;"
         v-show="1!=1">
      <Row>
        <i-Col span="3">
          <Card :bordered="false"
                v-show="1!=1">
            <p slot="title">关联C#应用</p>
            <a href="RuiyiHisReg://admin,abc,537">
              挂号
            </a><br>
            <!-- <a href="RuiyiHisReg://admin,abc,70">
                            挂号2
                        </a> -->
          </Card>
        </i-Col>
      </Row>
    </div>
    <Modal v-model="needGuideAction"
           width='100%'
           class-name='guide-action'
           :closable='false'
           :mask-closable='false'>

      <div class='position-container'
           style="top: 22%;left:22%;"
           v-if='CarouselValue===0'>
        <img :src="require('../../images/xiazaiGuideAction/下一步.png')"
             @click='CarouselValue=1'
             style="cursor:pointer" />
        <img :src="require('../../images/xiazaiGuideAction/关闭.png')"
             @click='closeGuideAction'
             style="cursor:pointer" />
        <img :src="require('../../images/xiazaiGuideAction/完成.png')"
             @click='noNeedGuideAction'
             style="cursor:pointer" />
      </div>
      <div class='position-container'
           style="top: 22%;left:30%;"
           v-if='CarouselValue===1'>
        <img :src="require('../../images/xiazaiGuideAction/上一步.png')"
             @click='CarouselValue=0'
             style="cursor:pointer" />
        <img :src="require('../../images/xiazaiGuideAction/关闭.png')"
             @click='closeGuideAction'
             style="cursor:pointer" />
        <img :src="require('../../images/xiazaiGuideAction/完成.png')"
             @click='noNeedGuideAction'
             style="cursor:pointer" />
      </div>
    </Modal>
  </div>
</template>

<script>
import util from '../../libs/util'

export default {
  name: 'home',
  data () {
    return {
      //存放省市区的数据
      vShow: {
        addressData: [],
      },
      needGuideAction: false, //是否需要指引
      showCarousel: false,
      CarouselValue: 0
    };
  },
  computed: {
    // 图标的
    // avatorPath () {
    //   return localStorage.avatorImgPath;
    // }
  },
  methods: {
    // 引导页的
    closeGuideAction () {
      this.showCarousel = false
      this.needGuideAction = false
    },
    // 引导页的
    noNeedGuideAction () {
      this.showCarousel = false
      this.needGuideAction = false
      const list = JSON.parse(localStorage.guidePageList)
      list['XZYD'] = 1
      util.ajax({
        method: 'post',
        url: util.BaseURL + 'api/sysUser/detail' + '?id=' + this.$store.state.userInfoObj.userId,
      }).then(res => {
        if (res.data.code !== 200) {
          util.showMsg(this, res.data);
        } else {
          const dataVersion = res.data.data.dataVersion
          let nowData = {
            guidePageList: JSON.stringify(list),
            userId: Number(this.$store.state.userInfoObj.userId),
            dataVersion: dataVersion,
            hospitalId: this.$store.state.userInfoObj.hospitalId,
            userName: this.$store.state.userInfoObj.userName
          }
          this.$store.dispatch('updateSysUser', nowData).then(res => {
            if (res.data.code === 200) {
              localStorage.guidePageList = JSON.stringify(list)
            } else {
              util.showMsg(this, { diy: res.data.message });
            }
          })
        }
      })

    }
  }
};
</script>
<style lang="less" scoped>
@import "./home.less";
@import "../../styles/common.less";
#iframes {
  position: absolute;
  // top: -38px;
  height: 85%;
  width: 95%;
  border: none;
}
#bgimg {
  width: 100%;
  height: 100%;
  background-image: url("../../images/500663747.jpg");
  background-size: 100% 100%;
}

.guide-action {
  height: 100%;
  width: 100%;
  position: absolute;
  z-index: 30;
  left: 0;
  top: 0;
}
// html{
//     height: 100%;
// }
</style>
<style lang="less">
.ivu-modal-wrap.guide-action {
  .ivu-modal {
    height: 100%;
    top: 0;
  }
  .ivu-modal-content {
    height: 100%;
    border-radius: 0 !important;
  }
  .ivu-modal-body {
    height: 100%;
    padding: 0;
  }
  .ivu-modal-footer {
    display: none;
  }
  .ivu-carousel,
  .ivu-carousel-item,
  .ivu-carousel-track,
  .ivu-carousel-list {
    height: 100% !important;
  }
  .carousel-img {
    height: 100%;
    width: 100%;
    background: #fff;
    background-size: contain;
    background-position: center;
    background-repeat: no-repeat;
  }
  .close-btn {
    height: 60px;
    width: 60px;
    background: url("../../images/requisitionGuideAction/组6.png");
    position: absolute;
    top: 10px;
    right: 50px;
    z-index: 1000;
    cursor: pointer;
  }
  .position-container {
    position: fixed;
    .no-need {
      cursor: pointer;
      margin-left: 10px;
      color: #fff;
      &:hover {
        text-decoration: underline;
      }
    }
  }
}
</style>
