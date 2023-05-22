<template>
  <div class="app-container">
    <div style="font-size: 24px;text-align: center;margin-bottom:36px; ">
      <div v-if="stepActive===1">更新课程信息</div>
      <div v-else-if="stepActive===2">更新章节与视频信息</div>
      <div v-else-if="stepActive===3">审核中</div>
    </div>
    <div class="step-container">
      <div v-if="stepActive===1">
        <v-create-info ref="CreateInfo" />
        <div class="step-ctrl">
          <el-button type="primary" style="margin-right: 24px" @click="submitCourseDialogVisible=true">
            提 交 审 核
          </el-button>
          <el-button class="btn" type="primary" @click="updateCVDialogVisible=true">
            继续更新章节与视频信息
          </el-button>
        </div>
      </div>
      <div v-else-if="stepActive===2" v-loading="loading">
        <v-create-subject-and-upload ref="createSubjectAndUpload" :course="courseData" />
        <div class="step-ctrl">
          <el-button class="btn" type="primary" @click="submitCourseDialogVisible=true">提 交 审 核</el-button>
        </div>
      </div>
      <div v-else-if="stepActive===3">
        <div style="font-size: 20px;margin: 16vh 0 10vh 0;text-align: center">
          课程《{{ courseData.title }}》已提交管理员审核
        </div>
        <router-link :to="{name:'CourseList'}" class="step-ctrl">
          <el-button class="btn" type="primary">返回课程列表</el-button>
        </router-link>
      </div>
    </div>
    <div>
      <el-dialog
        title="提示"
        :visible.sync="submitCourseDialogVisible"
        destroy-on-close
        width="30vw"
      >
        <div style="line-height: 24px">
          请确认章节与视频信息是否准确，提交后需要管理员审核后才能再次修改。
        </div>
        <span slot="footer">
          <el-button type="primary" size="small" @click="submit">确 认</el-button>
          <el-button size="small" @click="submitCourseDialogVisible = false">取 消</el-button>
        </span>
      </el-dialog>
      <el-dialog
        title="提示"
        :visible.sync="updateCVDialogVisible"
        destroy-on-close
        width="30vw"
      >
        <div style="line-height: 24px">
          是否继续更新课程章节与视频信息？继续修改不会影响到您已经发布课程，审核通过后才会更新。
        </div>
        <span slot="footer">
          <el-button type="primary" size="small" @click="updateCV">确 认</el-button>
          <el-button size="small" @click="updateCVDialogVisible = false">取 消</el-button>
        </span>
      </el-dialog>
      <el-dialog
        title="警告"
        :visible.sync="warningDialogVisible"
        destroy-on-close
        width="30vw"
        @closed="$router.push({name:'CourseList'})"
      >
        <div style="font-size: 16px;line-height: 32px">
          <div>课程《{{ courseData.title }}》正在<span style="color: #21BA45">审核中</span></div>
          <div style="color: #F44336">请不要尝试修改</div>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>

import { getInfo, updateIt, updateCV } from '@/api/course'

export default {
  name: 'EducourseUpdate',
  components: {
    'v-create-info': () => import('@/views/course_update/create_info'),
    'v-create-subject-and-upload': () => import('@/views/course_update/create_subject_and_upload')
  },
  data() {
    return {
      stepActive: 1,
      courseData: {},
      updateCourseData: {},
      loading: false,
      updateCVDialogVisible: false,
      submitCourseDialogVisible: false,
      warningDialogVisible: false // 课程处于审核状态，防止修改警告框
    }
  },
  watch: {
    $route(to, from) {
      this.getCourseInfo(this.$route.params.id)
    }
  },
  created() {
    this.getCourseInfo(this.$route.params.id)
  },
  methods: {
    // 获取该讲师在草稿箱的课程，如果有，直接进入第二步
    getCourseInfo(id) {
      getInfo(id).then(resp => {
        this.courseData = { ...resp.data }
        if (this.courseData.status.indexOf('AUDITING') !== -1) {
          this.warningDialogVisible = true
        }
        setTimeout(function() {
          this.$refs.CreateInfo.setData(this.courseData)
        }.bind(this), 100)
      })
    },
    submit() {
      if (this.$refs.CreateInfo) {
        this.updateCourseData = this.$refs.CreateInfo.getData()
      }
      updateIt(this.updateCourseData).then(resp => {
        this.submitCourseDialogVisible = false
        this.$message.success(resp.message)
        this.stepActive = 3
      })
    },
    updateCV() {
      this.loading = true
      this.updateCourseData = this.$refs.CreateInfo.getData()
      updateCV(this.courseData.id).then(resp => {
        this.updateCVDialogVisible = false
        this.$message.success('数据准备完成')
        this.stepActive = 2
        this.loading = false
      })
    }
  }
}
</script>

<style scoped lang="scss">
.step-container {
  margin-top: 30px;
  display: flex;
  justify-content: center;

  > div {
    width: 70%;
  }

  .step-ctrl {
    margin-top: 64px;
    text-align: center;
    display: block;

    .btn {
      width: 300px;
    }
  }
}

</style>

<style lang="scss">

</style>
