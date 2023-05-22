<template>
  <div class="app-container">
    <div style="width: 80%;margin: 0 auto">
      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <span style="font-weight: bold">消息通知</span>
          <el-popconfirm
            style="float: right"
            placement="top-end"
            confirm-button-text="确定"
            cancel-button-text="取消"
            icon="el-icon-info"
            icon-color="red"
            title="确定清空所有消息吗？"
            @confirm="clear"
          >
            <el-button slot="reference" type="text" style="padding: 0">清空所有消息</el-button>
          </el-popconfirm>
        </div>
        <div v-for="item in listData" :key="item.id" class="msg-item">
          <div class="head clearfix">
            <div class="left">
              来自<span class="name"> {{ item.fromName }} </span>的消息
            </div>
            <div class="right">
              <span class="time">{{ item.createTime }}</span>
              <el-popconfirm
                style="float: right"
                placement="top-end"
                confirm-button-text="确定"
                cancel-button-text="取消"
                icon="el-icon-info"
                icon-color="red"
                title="确定删除本条消息吗？"
                @confirm="deleteIt(item.id)"
              >
                <el-link slot="reference" class="el-icon-delete" :underline="false" />
              </el-popconfirm>

            </div>
          </div>
          <div class="content">{{ item.content }}</div>
        </div>
        <div v-if="total>0" class="pagination">
          <el-pagination
            background
            layout="total, prev, pager, next, jumper"
            :total="total"
            :page-size.sync="pageParams.pageSize"
            :current-page.sync="pageParams.current"
            @size-change="getList"
            @current-change="getList"
          />
        </div>
      </el-card>
    </div>
  </div>
</template>

<script>
import { markAsRead, listMessages, deleteMessage, clearMessages } from '@/api/message'

export default {
  name: 'Message',
  data() {
    return {
      pageParams: {
        current: 1,
        pageSize: 10
      },
      total: 0,
      listData: {}
    }
  },
  created() {
    this.markAsRead()
    this.getList()
  },
  methods: {
    markAsRead() {
      markAsRead().then(() => {
        this.$store.dispatch('user/setMessageCount', 0)
      })
    },
    getList() {
      listMessages(this.pageParams).then(resp => {
        this.total = resp.data.total
        this.listData = resp.data.list
      })
    },
    clear() {
      clearMessages().then(resp => {
        this.$message.success(resp.message)
        this.getList()
      })
    },
    deleteIt(id) {
      deleteMessage(id).then(resp => {
        this.$message.success(resp.message)
        this.getList()
      })
    }
  }
}
</script>

<style scoped lang="scss">
.msg-item {
  .head {
    font-size: 14px;
    color: #9999aa;

    .left {
      float: left;

      .name {
        color: #333
      }
    }

    .right {
      float: right;

      .time {
        margin-right: 16px;
      }
    }
  }

  .content {
    margin-top: 10px;
    line-height: 24px;
  }

  padding: 20px 0;
  border-bottom: #dcdcdc solid 1px;
}
</style>
