<template>
  <div class="app-container">
    <div class="search-box">
      <el-form ref="searchParamsForm" :inline="true" :model="searchParams" size="small">
        <el-form-item label="课程名称：" prop="title">
          <el-input v-model="searchParams.title" placeholder="输入课程名称搜索" />
        </el-form-item>
        <el-form-item label="课程分类：" prop="subjectId">
          <el-cascader
            v-model="searchParams.subjectId"
            :options="subjectOptions"
            :props="{ expandTrigger: 'hover', value: 'id', label: 'title' }"
            :clearable="true"
            :filterable="true"
            placeholder="请选择课程分类"
            @change="subjectOptionsChange"
          />
        </el-form-item>
        <el-form-item label="是否免费：" prop="free">
          <el-select v-model="searchParams.free" style="width: 130px">
            <el-option label="免费" :value="true" />
            <el-option label="收费" :value="false" />
          </el-select>
        </el-form-item>
        <el-form-item label="状态：" prop="status">
          <el-select v-model="searchParams.status" style="width: 130px">
            <el-option label="已发布" value="PUBLISH" />
            <el-option label="待审核" value="AUDITING" />
            <el-option label="驳回" value="TURN_DOWN" />
            <el-option label="草稿" value="DRAFT" />
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
        <el-table-column prop="title" label="封面" width="130">
          <template slot-scope="scope">
            <el-image style="width: 100px; height: 48px" :src="encodeOssFileUri(scope.row.cover)" fit="cover" />
          </template>
        </el-table-column>
        <el-table-column prop="title" label="名称" show-tooltip-when-overflow />
        <el-table-column prop="subjectId" label="分类" show-tooltip-when-overflow>
          <template slot-scope="scope">
            {{ getDetailsSubject(scope.row.subjectParent) }}
          </template>
        </el-table-column>
        <el-table-column prop="price" label="价格" width="100">
          <template slot-scope="scope">{{ scope.row.price === 0 ? '免费' : scope.row.price }}</template>
        </el-table-column>
        <el-table-column prop="lessonNum" label="总课时" width="100" />
        <el-table-column prop="status" label="审核状态" width="100" align="center">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.status.indexOf('AUDITING')!==-1" type="" size="small">待审核</el-tag>
            <el-tag v-else-if="scope.row.status==='DRAFT'" type="info" size="small">草稿</el-tag>
            <el-tag v-else-if="scope.row.status==='PUBLISH'" type="success" size="small">已发布</el-tag>
            <el-tag v-else-if="scope.row.status==='TURN_DOWN'" type="danger" size="small">不通过</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="210">
          <template slot-scope="scope">
            <router-link
              v-if="scope.row.status.indexOf('AUDITING')===-1"
              :to="scope.row.status==='PUBLISH'?
                {name:'CourseUpdate',params:{id:scope.row.id}}
                :{name:'CourseCreate'}"
            >
              <el-button type="primary" size="mini">修改</el-button>
            </router-link>
            <el-button
              v-if="scope.row.status.indexOf('AUDITING')!==-1"
              type="primary"
              size="mini"
              :disabled="scope.row.status.indexOf('AUDITING')!==-1"
            >修改</el-button>
            <el-popconfirm
              style="margin:0 10px"
              placement="top-end"
              confirm-button-text="确定"
              cancel-button-text="取消"
              icon="el-icon-info"
              icon-color="red"
              :title="`你要下架课程[${scope.row.title}]吗？`"
              @confirm="deleteUser(scope.row)"
            >
              <el-button slot="reference" type="danger" size="mini">下架</el-button>
            </el-popconfirm>
            <el-popover
              v-if="scope.row.status==='TURN_DOWN'"
              title="审核驳回原因"
              placement="left"
              width="360"
              trigger="click"
            >
              <span style="color: #F44336;line-height: 24px">{{ scope.row.remarks }}</span>
              <el-button slot="reference" type="info" size="mini">备注</el-button>
            </el-popover>
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
  </div>
</template>

<script>

import { list, deleteIt } from '@/api/course'

import { getSubject } from '@/api/subject'
import { encodeOssFileUri } from '@/utils'

export default {
  name: 'EduCourseist',
  data() {
    return {
      searchParams: {
        current: 1,
        pageSize: 10,
        teacherId: null,
        subjectId: null,
        title: '',
        free: null,
        status: null, // 显示通过审核的
        enable: null
      },
      total: 0,
      listData: [],
      tableDataLoading: false,
      currentOperationData: null,
      // 分类选项
      subjectOptions: []
    }
  },
  created() {
    this.getList()
    this.getSubject()
  },
  methods: {
    resetSearchParams(formName) {
      this.$refs[formName].resetFields()
      this.searchParams.current = 1
      this.getList()
    },
    encodeOssFileUri(ossUri) {
      return encodeOssFileUri(ossUri)
    },
    getDetailsSubject(subjectParent) {
      let subject = ''
      let parent = subjectParent
      while (parent) {
        subject = `${parent.title} > ${subject}`
        parent = parent.parent
      }
      return subject.substring(0, subject.length - 3)
    },
    getSubject() {
      getSubject().then(resp => {
        this.subjectOptions = resp.data
      })
    },
    subjectOptionsChange(val) {
      const arr = val
      if (!!arr || arr.length > 0) {
        this.searchParams.subjectId = arr[arr.length - 1]
      }
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
    // 删除用户
    deleteUser(curData) {
      this.currentOperationData = curData
      deleteIt(curData.id).then(resp => {
        this.$message.success(resp.message)
        this.getList()
      })
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
