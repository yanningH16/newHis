<template>
  <div class="bg-white ownspace_index clearfix">

    <div style="width: 650px;margin: 90px auto 0;display:flex;justify-content: space-between;"
         class="clearfix">
      <div class="avatar-container"
           style="position:relative;cursor:pointer">
        <Avatar :src="userImg"></Avatar>
        <div class="cover">更换头像</div>
        <div class="file-box">
          <input type="file"
                 @change="change"
                 class="file-btn"
                 accept="image/gif,image/jpeg,image/png,image/bmp" />
        </div>
        <cropper :option="cropperOption"
                 v-model="file"
                 @upload="sendAvatar">
        </cropper>
      </div>
      <Button type="primary"
              style="margin: 12px 0 12px 16px;"
              class="fr"
              @click="showEditPassword">
        <i class="iconfont icon-xiugai1"
           style="font-size: 15px;"></i>&#8194;修改密码
      </Button>
    </div>
    <!-- 修改密码 -->
    <Modal v-model="editPasswordModal"
           :closable="false"
           width="800px"
           :mask-closable="false">
      <div slot="footer">
        <Button type="text"
                size="large"
                @click="editPasswordModal = false">取消</Button>
        <Button type="primary"
                size="large">保存</Button>
      </div>

      <Row>
        <i-Col span="24">
          <label for="">原密码</label>
          <Input type="password"
                 placeholder="请输入现在使用的密码"
                 style="width:370px" />
        </i-Col>
      </Row>
      <Row>
        <i-Col span="24">
          <label for="">新密码</label>
          <Input type="password"
                 placeholder="请输入新密码，至少6位字符"
                 style="width:370px" />
        </i-Col>
      </Row>
      <Row>
        <i-Col span="24">
          <label for="">确认新密码</label>
          <Input type="password"
                 placeholder="请再次输入新密码"
                 style="width:370px" />
        </i-Col>
      </Row>

    </Modal>
  </div>
</template>

<script>
import util from '../../libs/util.js'
import confirmDeletion from '../components/confirmDeletion.vue'
import cropper from '../components/cropper'
import Cookies from 'js-cookie';
export default {
  name: 'ownspace_index',
  components: {
    confirmDeletion,
    cropper
  },
  inject: ['app'],
  data () {
    return {
      editPasswordModal: false,
      cropperOption: {
        viewMode: 1, // 将裁剪框限制为不超过画布的大小。
        dragMode: 'move', // 定义裁剪器的拖动模式(move: 移动画布)
        aspectRatio: 1 / 1, // 设置裁剪框的宽高比
        minContainerWidth: 200, // 容器的最小宽度,默认： 200
        minContainerHeight: 100, // 容器的最小高度,默认： 100
        minCanvasWidth: 200, // 画布的最小宽度（图像包装器）,默认： 0
        minCanvasHeight: 200, // 画布的最小高度（图像包装器）,默认： 0
        minCropBoxWidth: 100, // 裁剪框的最小宽度,默认： 0. 这个大小是相对于页面，而不是图像。
        minCropBoxHeight: 100, // 裁剪框的最小高度,默认： 0. 这个大小是相对于页面，而不是图像。
        preview: '.copper-img-preview' // 图片预览
      },
      file: null,
      datahavezyFB: []
    }
  },
  computed: {
    userImg () {
      return this.$store.state.sysMsg.userImg;
    },
    uploadUrl () {
      return util.BaseURL + '/api/sysUser/uploadPicture' + '?hospitalId=' + this.$store.state.userInfoObj.hospitalId
    },
    uploadHeaders () {
      return {
        'Authorization': Cookies.get('token')
      }
    }
  },
  watch: {
    'tables.resourcesColumns': function (val) {
      console.log(val)
    },
  },
  methods: {
    showEditPassword () {
      this.editPasswordModal = true
    },
    change (e) {
      this.file = e.target.files[0]
      e.target.value = ''
    },
    sendAvatar (file) {
      const formData = new FormData()
      formData.append('multipartFile', file)
      util.ajax({
        method: 'post',
        url: this.uploadUrl,
        data: formData,
      }).then(res => {
        const imgPath = res.data.data || ''
        this.$store.commit('setLocalStorageAvator', imgPath)
        this.$store.commit('setUserImg', imgPath)
        Cookies.set('avatar', imgPath)
      })
    },
  },
  mounted () {
    this.tableHightRt = ($("#rights").height() - 30);
  }
};
</script>

<style lang="less" scoped>
@import "../../styles/common.less";
.ownspace_index p {
  font-size: 18px;
  height: 32px;
  margin: 10px 0;
  line-height: 32px;
  cursor: pointer;
  border-right: 2px solid #fff;
}
.ownspace_index .iconfont {
  font-size: 20px;
  vertical-align: middle;
}
.ownspace_index .ry-border-bg {
  border-right: 2px solid;
}
.ownspace_index .right {
  height: 100%;
}
.ownspace_index .basic > div {
  width: 48%;
  height: 48px;
}
.ownspace_index .square {
  list-style: square;
}
</style>
<style lang='less'>
.ownspace_index {
  .ivu-avatar {
    width: 100px;
    height: 100px;
    line-height: 100px;
    border-radius: 50px;
    cursor: pointer;
    border: 1px solid #ccc;
    box-sizing: border-box;
  }
  .avatar-container {
    margin-top: 20px;
    height: 100px;
    .cover {
      display: none;
      position: absolute;
      top: 0;
      left: 0;
      height: 100px;
      width: 100px;
      line-height: 100px;
      border-radius: 50px;
    }
    &:hover {
      .cover {
        display: block;
        background: rgba(0, 0, 0, 0.2);
        color: #fff;
      }
    }
  }
  .ivu-upload-drag {
    background: transparent;
    box-sizing: border-box;
    border: 0;
  }
  .ivu-upload-list {
    display: none;
  }

  .file-box {
    display: inline-block;
    position: absolute;
    padding: 3px 5px;
    overflow: hidden;
    color: #fff;
    height: 100px;
    width: 100px;
    top: 0;
    left: 0;
    border-radius: 50px;
  }
  .file-btn {
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    outline: none;
    background-color: transparent;
    opacity: 0;
  }
}
.homePageCurTable .ivu-form-item-error-tip {
  left: 80px !important;
}
.formClasss .ivu-form-item {
  margin-bottom: 12px !important;
}
.formClasss .ivu-form-item-content {
  display: flex;
  justify-content: flex-start;
}
</style>


