<template>
  <div>
    <el-upload
      ref="upload"
      drag
      :action="uploadVideoUrl"
      multiple
      :before-upload="beforeUpload"
      :headers="headers"
      :data="data"
      :auto-upload="true"
      :on-success="uploadSucceed"
      accept=".mp4, .flv"
      :limit="100"
    >
      <i class="el-icon-upload" />
      <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
      <div slot="tip" class="el-upload__tip">自动上传，仅接受.mp4和.flv格式视频，单个视频文件大小不能超过1GB</div>
    </el-upload>
  </div>
</template>

<script>

import { uploadVideoUrl } from '@/api/video'
import store from '@/store'

export default {
  name: 'Upload',
  data() {
    return {
      data: {
        courseId: null,
        chapterId: null
      },
      uploadVideoUrl: uploadVideoUrl,
      headers: { 'X-Token': store.getters.token || '' }
    }
  },
  methods: {
    setData(data) {
      this.data = { ...data }
    },
    beforeUpload(file) {
      const isLt10MB = file.size / 1024 / 1024 / 1024 < 1
      if (!isLt10MB) {
        this.$message.warning('上传的视频文件大小请不要超过1GB')
        this.removeFile(file, this.$refs.upload.uploadFiles)
        return false
      }
    },
    removeFile(file, fileList) {
      fileList.splice(fileList.indexOf(file), 1)
    },
    uploadSucceed(response, file, fileList) {
      if (response.status === 200) {
        this.$message.success(response.message)
      } else {
        this.$message.error(response.message)
      }
      this.removeFile(file, fileList)
    }
  }
}
</script>

<style lang="scss">
.el-upload, .el-upload-dragger {
  width: 100%;
}
</style>
