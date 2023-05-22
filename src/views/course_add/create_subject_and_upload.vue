<!-- 步骤2 ： 创建章节并上传视频 -->
<template>
  <div>
    <div style="margin-bottom: 20px">
      <el-button type="primary" size="small" @click="openAddChapterDialog">新建章节</el-button>
      <div style="float: right;height: 32px;line-height: 32px">
        <i class="el-icon-loading" />
        正在创建课程《{{ course.title }}》
      </div>
    </div>
    <el-collapse :accordion="true" @change="change">
      <el-collapse-item v-for="c of chapters" :key="c.id" :name="c.id" class="chapter-head">
        <template slot="title">
          <div class="sort">{{ c.sort }}</div>
          <div class="title">{{ c.title }}</div>
          <div class="ctrl">
            <el-button size="mini" type="primary" icon="el-icon-upload" @click.stop="openUploadVideoDialog(c)">视频
            </el-button>
            <el-button size="mini" type="success" @click.stop="openUpdateChapterDialog(c)">修改</el-button>
            <el-button size="mini" type="danger" @click.stop="openDeleteChapterDialog(c)">删除</el-button>
          </div>
        </template>
        <el-table
          :key="tableRefreshIndex"
          :data="chapterIdVideoMap[c.id]"
          tooltip-effect="dark"
          :header-cell-style="{fontWeight:'normal', color:'#666'}"
          style="font-size: 13px"
        >
          <el-table-column type="index" />
          <el-table-column prop="title" label="名称" show-tooltip-when-overflow />
          <el-table-column prop="duration" label="时长" width="100" />
          <el-table-column prop="size" label="大小" width="120">
            <template slot-scope="scope">{{ bytesToSize(scope.row.size) }}</template>
          </el-table-column>
          <el-table-column prop="sort" label="排序" width="80" align="center" />
          <el-table-column prop="sort" label="免费收看" width="100" align="center">
            <template slot-scope="scope">
              <span v-if="scope.row.free" style="color: #21BA45">是</span>
              <span v-else>否</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="150" align="center">
            <template slot-scope="scope">
              <el-button type="primary" size="mini" @click="openUpdateVideoDialogVisible(scope.row)">修改</el-button>
              <el-popconfirm
                style="margin-left: 10px"
                placement="top-end"
                confirm-button-text="确定"
                cancel-button-text="取消"
                icon="el-icon-info"
                icon-color="red"
                :title="`你要永久删除视频[${scope.row.title}]吗？`"
                @confirm="deleteVideo(scope.row)"
              >
                <el-button slot="reference" type="danger" size="mini">删除</el-button>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
      </el-collapse-item>
    </el-collapse>
    <!-- 新建章节 -->
    <el-dialog
      title="新建章节"
      :visible.sync="addChapterDialogVisible"
      destroy-on-close
      width="30vw"
      :close-on-click-modal="false"
    >
      <el-form :model="addOrUpdateChapter" size="small" label-width="100px">
        <el-form-item label="章节名称：">
          <el-input v-model="addOrUpdateChapter.title" />
        </el-form-item>
        <el-form-item label="排　　序：">
          <el-input-number v-model="addOrUpdateChapter.sort" style="width: 100%" />
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button type="primary" size="small" @click="createChapter">确 认</el-button>
        <el-button size="small" @click="addChapterDialogVisible = false">取 消</el-button>
      </span>
    </el-dialog>
    <!-- 修改章节信息 -->
    <el-dialog
      title="修改章节信息"
      :visible.sync="updateChapterDialogVisible"
      destroy-on-close
      width="30vw"
      :close-on-click-modal="false"
    >
      <el-form :model="addOrUpdateChapter" size="small" label-width="100px">
        <el-form-item label="章节名称：">
          <el-input v-model="addOrUpdateChapter.title" />
        </el-form-item>
        <el-form-item label="排序：">
          <el-input-number v-model="addOrUpdateChapter.sort" style="width: 100%" />
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button type="primary" size="small" @click="updateChapter">确 认</el-button>
        <el-button size="small" @click="updateChapterDialogVisible=false">取 消</el-button>
      </span>
    </el-dialog>
    <!-- 删除章节 -->
    <el-dialog
      title="删除章节"
      :visible.sync="deleteChapterDialogVisible"
      destroy-on-close
      width="30vw"
    >
      <div style="color: red">该操作将会连带删除章节下的所有视频</div>
      <span slot="footer">
        <el-button type="primary" size="small" @click="deleteChapter">确 认</el-button>
        <el-button size="small" @click="deleteChapterDialogVisible=false">取 消</el-button>
      </span>
    </el-dialog>
    <!-- 上传视频 -->
    <el-dialog
      :title.sync="uploadVideoDialogTitle"
      :visible.sync="uploadVideoDialogVisible"
      destroy-on-close
      width="30vw"
      :close-on-click-modal="false"
      :before-close="uploadDialogBeforeClose"
    >
      <v-upload-video ref="UploadVideo" />
    </el-dialog>
    <!-- 修改视频信息 -->
    <el-dialog
      title="修改视频信息"
      :visible.sync="updateVideoDialogVisible"
      destroy-on-close
      width="30vw"
      :close-on-click-modal="false"
    >
      <el-form :model="updateVideoData" size="small" label-width="100px">
        <el-form-item label="视频名称：">
          <el-input v-model="updateVideoData.title" />
        </el-form-item>
        <el-form-item label="排　　序：">
          <el-input-number v-model="updateVideoData.sort" style="width: 100%" />
        </el-form-item>
        <el-form-item label="免费观看：">
          <el-radio-group v-model="updateVideoData.free">
            <el-radio :label="true">是</el-radio>
            <el-radio :label="false">否</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button type="primary" size="small" @click="updateVideo">确 认</el-button>
        <el-button size="small" @click="updateVideoDialogVisible=false">取 消</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  list as listChapter,
  createIt as createChapter,
  updateIt as updateChapter,
  deleteIt as deleteChapter
} from '@/api/chapter'
import {
  list as listVideo,
  updateIt as updateVideo,
  deleteIt as deleteVideo
} from '@/api/video'
import { bytesToSize } from '@/utils'

export default {
  name: 'CreateSubjectAndUpload',
  components: {
    'v-upload-video': () => import('@/views/course_add/upload')
  },
  // eslint-disable-next-line vue/require-prop-types
  props: ['course'],
  data() {
    return {
      chapters: [],
      // 章节id与视频列表映射<chapterId,[...videos]>
      chapterIdVideoMap: {},
      addOrUpdateChapter: { title: '', sort: 0 },
      updateVideoData: { title: '', sort: 0, free: false },
      // 对话框
      addChapterDialogVisible: false,
      updateChapterDialogVisible: false,
      deleteChapterDialogVisible: false,
      tableRefreshIndex: 0,
      // 上传视频
      uploadVideoDialogVisible: false,
      uploadVideoDialogTitle: '',
      // 更新视频
      updateVideoDialogVisible: false
    }
  },
  created() {
    this.getChapterList()
  },
  methods: {
    // 字节转换
    bytesToSize(bytes) {
      return bytesToSize(bytes)
    },
    getChapterList() {
      listChapter(this.course.id).then(resp => {
        this.chapters = []
        this.chapters = resp.data
        // 初始化视频列表空数据
        for (const c of resp.data) {
          this.chapterIdVideoMap[c.id] = []
        }
      })
    },
    openAddChapterDialog() {
      this.addOrUpdateChapter = { title: '', sort: 0 }
      this.addChapterDialogVisible = true
    },
    openUpdateChapterDialog(curData) {
      this.addOrUpdateChapter = { ...curData }
      this.updateChapterDialogVisible = true
    },
    openDeleteChapterDialog(curData) {
      this.addOrUpdateChapter = curData
      this.deleteChapterDialogVisible = true
    },
    openUploadVideoDialog(curData) {
      this.uploadVideoDialogTitle = `上传视频至章节[${curData.title}]`
      this.uploadVideoDialogVisible = true
      const data = { courseId: this.course.id, chapterId: curData.id }
      setTimeout(function() {
        this.$refs.UploadVideo.setData(data)
      }.bind(this), 100)
    },
    openUpdateVideoDialogVisible(curData) {
      this.updateVideoDialogVisible = true
      this.updateVideoData = { ...curData }
    },
    // 新建章节
    createChapter() {
      this.addOrUpdateChapter.courseId = this.course.id
      createChapter(this.addOrUpdateChapter).then(resp => {
        this.$message.success(resp.message)
        this.getChapterList()
        this.addChapterDialogVisible = false
      })
    },
    // 修改章节
    updateChapter() {
      this.addOrUpdateChapter.courseId = this.course.id
      updateChapter(this.addOrUpdateChapter).then(resp => {
        this.$message.success(resp.message)
        this.getChapterList()
        this.updateChapterDialogVisible = false
      })
    },
    // 删除章节
    deleteChapter() {
      deleteChapter(this.addOrUpdateChapter.id).then(resp => {
        this.$message.success(resp.message)
        this.getChapterList()
        this.deleteChapterDialogVisible = false
      })
    },
    // 章节切换
    change(id) {
      // 获取章节视频信息
      if (id) {
        listVideo(id).then(resp => {
          this.chapterIdVideoMap[id] = resp.data
          ++this.tableRefreshIndex
        })
      }
    },
    // 上传对话框关闭时更新信息
    uploadDialogBeforeClose(done) {
      this.change(this.$refs.UploadVideo.data.chapterId)
      done()
    },
    // 删除视频
    deleteVideo(curData) {
      deleteVideo(curData.id).then(resp => {
        this.$message.success(resp.message)
        this.change(curData.chapterId)
      })
    },
    // 更新视频
    updateVideo() {
      updateVideo(this.updateVideoData).then(resp => {
        this.$message.success(resp.message)
        this.change(this.updateVideoData.chapterId)
        this.updateVideoDialogVisible = false
      })
    }
  }
}
</script>

<style scoped lang="scss">
.chapter-head {

  .sort{
    width: 7%;
    font-size: 15px;
  }

  .title {
    width: 50%;
    font-size: 15px;
  }

  .ctrl {
    width: 43%;
    text-align: right;

    .el-button:last-child {
      margin-right: 12px;
    }
  }
}
</style>
