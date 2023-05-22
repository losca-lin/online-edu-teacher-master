<template>
  <div class="app-container">
    <div class="search-box">
      <el-form ref="searchParamsForm" :inline="true" :model="searchParams" size="small">
        <el-form-item label="所属课程：" prop="courseId">
          <el-select v-model="searchParams.courseId" filterable placeholder="请选择课程">
            <el-option
              v-for="item in courseListData"
              :key="item.id"
              :label="item.title"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="状态：" prop="free">
          <el-select v-model="searchParams.status" style="width: 130px">
            <el-option label="正常" :value="true" />
            <el-option label="审核中" :value="false" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="getList">查 询</el-button>
          <el-button @click="resetSearchParams('searchParamsForm')">重 置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div>
      <el-table
        ref="listTable"
        v-loading="tableDataLoading"
        :data="listData"
        tooltip-effect="dark"
        :header-cell-style="{fontWeight:'normal', color:'#666'}"
      >
        <el-table-column type="index" />
        <el-table-column prop="courseName" label="课程名称" width="240" show-tooltip-when-overflow />
        <el-table-column prop="memberName" label="会员昵称" width="150" />
        <el-table-column prop="content" label="评论内容" show-tooltip-when-overflow />
        <el-table-column prop="mark" label="评分" width="200" align="center">
          <template slot-scope="scope">
            <el-rate
              :value="scope.row.mark"
              disabled
              show-score
              disabled-void-color="#dcdcdc"
              text-color="#ff9900"
            />
          </template>
        </el-table-column>
        <el-table-column prop="status" label="审核状态" width="100" align="center">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.status" type="success" size="small">正常</el-tag>
            <el-tag v-else type="" size="small">待审核</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="210">
          <template slot-scope="scope">
            <el-button type="primary" size="mini" @click="openUpdateProfileDialog(scope.row)">修改</el-button>
            <el-popconfirm
              style="margin:0 10px"
              placement="top-end"
              confirm-button-text="确定"
              cancel-button-text="取消"
              icon="el-icon-info"
              icon-color="red"
              title="你要永久删除该评论吗？"
              @confirm="deleteUser(scope.row)"
            >
              <el-button slot="reference" type="danger" size="mini">删除</el-button>
            </el-popconfirm>
            <el-button v-if="!scope.row.status" type="success" size="mini" @click="pass(scope.row)">通过</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="pagination">
      <el-pagination
        background
        :page-sizes="[10, 20, 30, 40,50]"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        :page-size.sync="searchParams.pageSize"
        :current-page.sync="searchParams.current"
        @size-change="getList"
        @current-change="getList"
      />
    </div>
    <div>
      <!-- 修改信息 -->
      <el-dialog
        title="修改评论"
        :visible.sync="updateProfileDialogVisible"
        destroy-on-close
        :close-on-click-modal="false"
        width="36vw"
      >
        <el-form :model="currentOperationData" size="small" label-width="60px">
          <el-form-item label="评分：">
            <el-rate
              v-model="currentOperationData.mark"
              style="height: 32px;display: flex;align-items: center"
              allow-half
              show-score
              text-color="#ff9900"
            />
          </el-form-item>
          <el-form-item label="状态：">
            <el-radio-group v-model="currentOperationData.status">
              <el-radio :label="true">正常</el-radio>
              <el-radio :label="false">审核中</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="内容：">
            <el-input
              v-model="currentOperationData.content"
              type="textarea"
              placeholder="请输入评论内容"
              maxlength="1023"
              :rows="5"
              show-word-limit
            /></el-form-item>
        </el-form>
        <span slot="footer">
          <el-button type="primary" size="small" @click="updateProfile">更 新</el-button>
          <el-button size="small" @click="updateProfileDialogVisible = false">取 消</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>

<script>

import { listAll } from '@/api/course'
import { list, updateIt, deleteIt } from '@/api/comment'

export default {
  name: 'EduCommentist',
  data() {
    return {
      searchParams: {
        current: 1,
        pageSize: 10,
        courseId: null,
        status: false // 显示通过审核的
      },
      total: 0,
      listData: [],
      courseListData: [], // 课程id与标题数据
      tableDataLoading: false,
      currentOperationData: { content: '', mark: 1, status: true },
      // 修改
      updateProfileDialogVisible: false
    }
  },
  created() {
    this.getList()
    this.getCourseList()
  },
  methods: {
    resetSearchParams(formName) {
      this.$refs[formName].resetFields()
      this.searchParams.current = 1
      this.getList()
    },
    openUpdateProfileDialog(curData) {
      this.updateProfileDialogVisible = true
      this.currentOperationData = { ...curData }
    },
    getCourseList() {
      listAll().then(resp => {
        this.courseListData = resp.data
      })
    },
    // 获取列表信息
    getList() {
      this.tableDataLoading = true
      list(this.searchParams).then(resp => {
        this.total = resp.data.total
        this.listData = resp.data.list
        this.tableDataLoading = false
      })
    },
    // 修改信息
    updateProfile() {
      const params = this.currentOperationData
      updateIt(params).then(resp => {
        this.$message.success(resp.message)
        this.updateProfileDialogVisible = false
        this.getList()
      })
    },
    // 删除用户
    deleteUser(curData) {
      this.currentOperationData = curData
      deleteIt(curData.id).then(resp => {
        this.$message.success(resp.message)
        this.getList()
      })
    },
    pass(curData) {
      const params = { id: curData.id, status: true, content: curData.content }
      updateIt(params).then(resp => {
        this.$message.success(resp.message)
        this.getList()
      })
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
