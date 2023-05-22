<template>
  <div class="navbar">
    <hamburger :is-active="sidebar.opened" class="hamburger-container" @toggleClick="toggleSideBar" />

    <breadcrumb class="breadcrumb-container" />

    <div class="right-menu">
      <router-link :to="{name:'Message'}" class="nav-item ">
        <el-tooltip effect="dark" content="消息" placement="right-end">
          <i class="el-icon-message-solid" />
        </el-tooltip>
      </router-link>
      <div v-if="messageCount>0" class="msg-dot" />
      <el-dropdown class="avatar-container" trigger="hover">
        <div class="avatar-wrapper">
          <el-avatar :size="32" :src="user.avatar" fit="contain" />
          <span class="name">{{ user.name || '' }}</span>
          <i class="el-icon-caret-bottom" />
        </div>
        <el-dropdown-menu slot="dropdown" class="user-dropdown">
          <router-link :to="{name: 'Profile'}">
            <el-dropdown-item icon="el-icon-user">
              个人中心
            </el-dropdown-item>
          </router-link>
          <el-dropdown-item divided icon="el-icon-switch-button" @click.native="logout">
            退出登录
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Breadcrumb from '@/components/Breadcrumb'
import Hamburger from '@/components/Hamburger'

export default {
  components: {
    Breadcrumb,
    Hamburger
  },
  computed: {
    ...mapGetters([
      'sidebar',
      'user',
      'messageCount'
    ])
  },
  methods: {
    toggleSideBar() {
      this.$store.dispatch('app/toggleSideBar')
    },
    async logout() {
      await this.$store.dispatch('user/logout')
      this.$router.push(`/login?redirect=${this.$route.fullPath}`)
    }
  }
}
</script>

<style lang="scss" scoped>
.navbar {
  height: 50px;
  overflow: hidden;
  position: relative;
  background: #fff;
  box-shadow: 0 1px 4px rgba(0, 21, 41, .08);

  .hamburger-container {
    line-height: 46px;
    height: 100%;
    float: left;
    cursor: pointer;
    transition: background .3s;
    -webkit-tap-highlight-color: transparent;

    &:hover {
      background: rgba(0, 0, 0, .025)
    }
  }

  .breadcrumb-container {
    float: left;
  }

  .msg-dot {
    position: relative;
    display: inline-block;
    width: 7px;
    height: 7px;
    border-radius: 50%;
    background-color: #f56c6c;
    top: -20px;
    right: 25px;
  }

  .right-menu {
    float: right;
    height: 100%;
    line-height: 50px;

    &:focus {
      outline: none;
    }

    .nav-item {
      position: relative;
      top: -8px;
      margin-right: 24px;
      font-size: 20px;
      transition: all .3s;
      color: #888;

      &:hover {
        color: #409EFF;
      }
    }

    .right-menu-item {
      display: inline-block;
      padding: 0 8px;
      height: 100%;
      font-size: 18px;
      color: #5a5e66;
      vertical-align: text-bottom;

      &.hover-effect {
        cursor: pointer;
        transition: background .3s;

        &:hover {
          background: rgba(0, 0, 0, .025)
        }
      }
    }

    .avatar-container {
      margin-right: 30px;

      .avatar-wrapper {
        height: 100%;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-items: center;

        &:hover {
          .el-icon-caret-bottom {
            transform: rotate(180deg);
          }
        }

        .name {
          margin: 0 5px 0 10px;
        }

        .el-icon-caret-bottom {
          transition: all .7s;
          font-size: 14px;
        }
      }
    }
  }
}
</style>
