<template>
  <div class="app-container">
    <div style="margin-bottom: 24px">
      <span>{{ getTimeState }}！</span>
      <span>尊敬的讲师<strong>「{{ user.name || '' }}」</strong>！</span>
      <span>欢迎您使用在线家教平台！</span>
    </div>
    <el-row :gutter="20">
      <el-col :xs="12" :sm="6">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span class="cardName">已上架课程数量</span>
          </div>
          <div class="cardContent clearfix">
            <el-tooltip effect="dark" placement="top">
              <div slot="content">已上架的课程总数量为：{{ stat.courseCount }}</div>
              <span>{{ stat.courseCount }}</span>
            </el-tooltip>
          </div>
        </el-card>
      </el-col>
      <el-col :xs="12" :sm="6">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span class="cardName">课程视频数量</span>
          </div>
          <div class="cardContent clearfix">
            <el-tooltip effect="dark" placement="top">
              <div slot="content">已上架课程视频总数量为：{{ stat.videoCount }}</div>
              <span>{{ stat.videoCount }}</span>
            </el-tooltip>
          </div>
        </el-card>
      </el-col>
      <el-col :xs="12" :sm="6">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span class="cardName">评论数量</span>
          </div>
          <div class="cardContent clearfix">
            <el-tooltip effect="dark" placement="top">
              <div slot="content">评论总数量为：{{ stat.commentCount }}</div>
              <span>{{ stat.commentCount }}</span>
            </el-tooltip>
            <el-tooltip effect="dark" placement="top">
              <div slot="content">{{ stat.auditingCommentCount }} 条评论待审核</div>
              <span style="float: right;color: #21BA45">{{ stat.auditingCommentCount }}</span>
            </el-tooltip>
          </div>
        </el-card>
      </el-col>
      <el-col :xs="12" :sm="6">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span class="cardName">加入时间</span>
          </div>
          <div class="cardContent clearfix">
            <el-tooltip effect="dark" placement="top">
              <div slot="content">您于 {{ stat.joinDateTime }} 加入本平台</div>
              <span>{{ stat.joinDaysCount }} <span style="font-size: 15px">天</span></span>
            </el-tooltip>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>

import { mapGetters } from 'vuex'
import { getNotReadMessageCount } from '@/api/message'
import { getStat } from '@/api/stat'

export default {
  name: 'Dashboard',
  components: {},
  data() {
    return {
      stat: {
        auditingCommentCount: 0,
        commentCount: 0,
        courseCount: 0,
        joinDateTime: '',
        joinDaysCount: 0,
        videoCount: 0
      }
    }
  },
  computed: {
    ...mapGetters([
      'user',
      'messageCount'
    ]),
    getTimeState() {
      const hour = new Date().getHours()
      let text = ''
      if (hour < 6) {
        text = '凌晨好'
      } else if (hour < 9) {
        text = '早上好'
      } else if (hour < 12) {
        text = '上午好'
      } else if (hour < 14) {
        text = '中午好'
      } else if (hour < 17) {
        text = '下午好'
      } else if (hour < 19) {
        text = '傍晚好'
      } else if (hour < 22) {
        text = '晚上好'
      } else {
        text = '夜里好'
      }
      return text
    }
  },
  created() {
    this.getMessageCount()
    this.getStat()
  },
  methods: {
    // 获取消息数量
    getMessageCount() {
      getNotReadMessageCount().then(resp => {
        this.$store.dispatch('user/setMessageCount', resp.data)
      })
    },
    getStat() {
      getStat().then(resp => {
        this.stat = resp.data
      })
    }
  }
}
</script>

<style lang="scss">
.el-col {
  margin-bottom: 20px;

  &:last-child {
    margin-bottom: 0;
  }
}

.el-card {
  &__header, &__body {
    padding: 12px 16px;
    line-height: 16px;
  }
}
</style>

<style lang="scss" scoped>
.box-card {
  .cardName {
    color: #97a8be;
  }

  .cardLink {
    float: right;
    padding: 0;
  }

  .cardContent {
    font-size: 26px;
    padding: 12px 0;
  }
}
</style>
