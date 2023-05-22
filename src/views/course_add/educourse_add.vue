<template>
  <div class="app-container">
    <el-steps :active="stepActive" align-center>
      <el-step title="创建课程基本信息" />
      <el-step title="新建章节并上传视频" />
      <el-step title="提交审核" />
    </el-steps>
    <div class="step-container">
      <div v-if="stepActive===1">
        <v-create-info ref="CreateInfo" />
        <div class="step-ctrl">
          <el-button class="btn" type="primary" @click="createCourseDialogVisible=true">下一步</el-button>
        </div>
      </div>
      <div v-else-if="stepActive===2">
        <v-create-subject-and-upload ref="createSubjectAndUpload" :course="courseData" />
        <div class="step-ctrl" style="margin-top: 100px">
          <el-button class="btn" type="primary" @click="submitCourseDialogVisible=true">提 交</el-button>
        </div>
      </div>
      <div v-else-if="stepActive===3">
        <div style="font-size: 20px;margin: 16vh 0 10vh 0;text-align: center">
          课程《{{ courseData.title }}》已提交管理员审核
        </div>
        <div class="step-ctrl">
          <router-link :to="{name:'CourseList'}" style="margin-right: 20px">
            <el-button type="primary" style="width: 160px">返回课程列表</el-button>
          </router-link>
          <el-button type="warning" style="width: 160px" @click="reEnter">继续发布课程</el-button>
        </div>
      </div>
    </div>
    <div>
      <el-dialog
        title="是否创建课程"
        :visible.sync="createCourseDialogVisible"
        destroy-on-close
        width="30vw"
      >
        <div>请确认课程信息是否准确，提交下一步后将无法返回</div>
        <span slot="footer">
          <el-button type="primary" size="small" @click="createCourse">确 认</el-button>
          <el-button size="small" @click="createCourseDialogVisible = false">取 消</el-button>
        </span>
      </el-dialog>
      <el-dialog
        title="是否提交课程"
        :visible.sync="submitCourseDialogVisible"
        destroy-on-close
        width="30vw"
      >
        <div>请确认章节与视频信息是否准确，提交后将无法返回</div>
        <span slot="footer">
          <el-button type="primary" size="small" @click="submit">确 认</el-button>
          <el-button size="small" @click="submitCourseDialogVisible = false">取 消</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>

<script>

import { createIt, getDraft, submitIt } from '@/api/course'

export default {
  name: 'EducourseAdd',
  components: {
    'v-create-info': () => import('@/views/course_add/create_info'),
    'v-create-subject-and-upload': () => import('@/views/course_add/create_subject_and_upload')
  },
  data() {
    return {
      stepActive: 1,
      courseData: {},
      createCourseDialogVisible: false,
      submitCourseDialogVisible: false
    }
  },
  created() {
    this.getDraft()
  },
  methods: {
    createCourse() {
      const course = this.$refs.CreateInfo.getData()
      createIt(course).then(resp => {
        this.createCourseDialogVisible = false
        this.courseData = resp.data
        this.stepActive = 2
      })
    },
    // 获取该讲师在草稿箱的课程，如果有，直接进入第二步
    getDraft() {
      getDraft().then(resp => {
        if (resp.data) {
          this.courseData = resp.data
          this.stepActive = 2
          // 通知
          this.$notify.closeAll()
          this.$notify.info({
            title: '提示',
            message: '检测到您草稿箱有未完成的课程信息，已自动为您复原',
            offset: 50
          })
        }
      })
    },
    submit() {
      submitIt(this.courseData.id).then(resp => {
        this.submitCourseDialogVisible = false
        this.$message.success(resp.message)
        this.stepActive = 3
      })
    },
    reEnter() {
      this.$router.replace({
        name: 'Refresh',
        query: {
          t: Date.now() + ''
        }
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

  >div{
    width: 70%;
  }

  .step-ctrl {
    margin-top: 36px;
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
