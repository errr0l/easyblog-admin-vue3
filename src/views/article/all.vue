<template>
    <div class="app-container my-app-container">
        <el-card class="x-el-card-table el-card__header-sty-2">
            <div slot="header" class="clearfix">
                <div style="margin-bottom: 20px;">
                    <el-badge v-for="(value) of statisticStates" :key="value" :value="statistic[value] || 0" style="margin-right: 15px;">
                        <el-tag size="small" style="cursor: pointer;" @click="searchByType(value)" :type="statisticType[value] || ''">{{ articleStateTexts[value] }}</el-tag>
                    </el-badge>
                    <span style="font-size: 12px; color: #ccc; float: right;">注意，当前统计数据取自缓存，因此可能出现不对板的情况，请以实际查询数据为主</span>
                </div>
                <el-form :inline="true" :model="query" size="mini" class="x-el-form">
                    <el-form-item label="标题">
                        <el-input v-model="query.title" placeholder="请输入" clearable></el-input>
                    </el-form-item>
                    <el-form-item label="分类">
                        <el-select v-model="query.categoryId" placeholder="请选择" clearable>
                            <el-option
                                v-for="item in categoryList"
                                :key="item.id"
                                :label="item.name"
                                :value="item.id">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="状态">
                        <el-select v-model="query.states" placeholder="请选择" clearable multiple collapse-tags>
                            <el-option
                                v-for="item in states"
                                :key="item.id"
                                :label="item.name"
                                :value="item.id">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="类型">
                        <el-select v-model="query.creationType" placeholder="请选择" clearable>
                            <el-option
                                v-for="item in types"
                                :key="item.id"
                                :label="item.name"
                                :value="item.id">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item>
                        <el-button size="mini" @click="search">查询</el-button>
                        <el-button type="primary" size="mini" @click="publishingDialogVisible = true">发布</el-button>
                    </el-form-item>
                </el-form>
            </div>
            <el-table :data="list" style="width: 100%;" border size="small" height="0px">
                <el-table-column align="center" label="序号" type="index" width="50" fixed="left"></el-table-column>
                <el-table-column align="center" label="ID" prop="id" width="80"></el-table-column>
                <el-table-column align="center" label="封面" width="120" prop="cover">
                    <template slot-scope="{ row }">
                        <el-image style="vertical-align: middle; height: 60px;"
                            :src="row.cover ? row.cover : getDefaultImage()" lazy
                            fit="cover"></el-image>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="标题" prop="title" width="220"></el-table-column>
                <el-table-column align="center" label="分类" prop="categoryName" width="120">
                    <template slot-scope="{ row }">
                        <span>{{ row.categoryName || '-' }}</span>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="作者" prop="authorId" width="120">
                    <template slot-scope="{ row }">
                        <span>{{ row.authorName }}</span>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="状态" prop="state" width="120">
                    <template slot-scope="{ row }">
                        <el-tag size="small" type="info">{{ articleStateTexts[row.state] || '-' }}</el-tag>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="类型" prop="creationType" width="120">
                    <template slot-scope="{ row }">
                        <span>{{ creationTypeTexts[row.creationType] || '-' }}</span>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="创建时间" width="180">
                    <template slot-scope="{ row }">
                        <span>{{ row.createdAt }}</span>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="最后更新于" width="180">
                    <template slot-scope="{ row }">
                        <span>{{ row.lastUpdatedAt }}</span>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="操作" fixed="right" width="180">
                    <template slot-scope="{ row }">
                        <el-button type="text" size="mini" v-if="row.state === WAITING_FOR_AUDITING" @click="edit(row)">编辑</el-button>
                        <el-button type="text" class="x-el-button-text" size="mini" @click="del(row)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>

            <div style="text-align: right; margin-top: 10px;">
                <el-pagination
                    @current-change="currentChange"
                    background
                    :page-size="query.size"
                    layout="total, prev, pager, next"
                    :total="total">
                </el-pagination>
            </div>
        </el-card>

        <el-dialog :visible.sync="progressDialogVisible" title="发布进度" width="30%" class="x-el-dialog styl-1" :show-close="false">
            <div class="t-c">
                <el-progress type="circle" :percentage="progress.percentage" :status="progress.status"></el-progress>
                <p v-if="progressException" style="color: #f56c6c;">{{ progress.message }}</p>
                <p v-if="progressFinished" style="color: #67c23a;">{{ progress.message }}</p>
            </div>
            <div class="t-r" style="margin-top: 20px;" v-if="progressFinished || progressException">
                <el-button type="primary" size="mini" @click="closeProgressDialog">确定</el-button>
            </div>
        </el-dialog>

        <el-dialog :visible.sync="publishingDialogVisible" title="发布文章" width="40%" class="x-el-dialog styl-1">
            <el-form :model="publishingFormData" label-width="auto" size="mini">
                <el-form-item label="上传至Github">
                    <el-radio v-model="publishingFormData.toGithub" :label="1">是</el-radio>
                    <el-radio v-model="publishingFormData.toGithub" :label="0">否</el-radio>
                </el-form-item>
            </el-form>
            <el-form :model="publishingFormData" label-width="auto" size="mini">
                <el-form-item label="创建html规则">
                    <el-radio v-model="publishingFormData.force" :label="0">自动</el-radio>
                    <el-radio v-model="publishingFormData.force" :label="1">强制</el-radio>
                </el-form-item>
            </el-form>
            <div style="text-align: right;">
                <el-button @click="publishingDialogVisible = false" size="mini">取消</el-button>
                <el-button type="primary" size="mini" @click="publish">确定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import { getPagination, del, publish, getPublishingProgress, getCategoryList, getStatistic } from "@/api/article";
import { paginationMixin } from "@/mixins/pagination";
import { getList as getUserList } from "@/api/user";
import { ARTICLE_STATE_TEXTS, CREATION_TYPE_TEXTS, ORIGINAL, REPRINT,
    WAITING_FOR_AUDITING, WAITING_FOR_CONFIRMATION, WAITING_FOR_PUBLICATION, PUBLISHED, REJECTED, DELETED, ADMIN } from "@/constants/general";
import { mixin } from "./mixin";

const EXCEPTION = "exception";
const SUCCESS = "success";

export default {
    mixins: [paginationMixin, mixin],
    data() {
        return {
            list: [], total: 0,
            query: {
                size: 10,
                current: 1,
                categoryId: "",
                states: [WAITING_FOR_AUDITING], // 一般情况下，管理员只要这俩即可
                creationType: "",
                title: "",
                excludedState: DELETED
            },
            WAITING_FOR_AUDITING, WAITING_FOR_PUBLICATION, DELETED,
            categoryList: [],
            states: [WAITING_FOR_AUDITING, WAITING_FOR_CONFIRMATION, WAITING_FOR_PUBLICATION, PUBLISHED, REJECTED, DELETED].map(item => ({ id: item, name: ARTICLE_STATE_TEXTS[item] })),
            types: [ORIGINAL, REPRINT].map(item => ({ id: item, name: CREATION_TYPE_TEXTS[item] })),
            creationTypeTexts: CREATION_TYPE_TEXTS, articleStateTexts: ARTICLE_STATE_TEXTS,
            statistic: {},
            statisticType: {
                [WAITING_FOR_AUDITING]: "",
                [WAITING_FOR_PUBLICATION]: "warning",
                [WAITING_FOR_CONFIRMATION]: "info",
                [PUBLISHED]: "success",
                [DELETED]: 'danger',
            },
            statisticStates: [WAITING_FOR_AUDITING, WAITING_FOR_PUBLICATION, WAITING_FOR_CONFIRMATION, PUBLISHED, DELETED],
            userList: [],
            userMap: null, publishingDialogVisible: false, publishingFormData: {
                toGithub: 1,
                force: 0
            },
            progressDialogVisible: false,
            progress: {
                status: null,
                percentage: 0,
                message: ""
            },
            timer: null
        };
    },
    created() {
        this.getCategoryList();
        this.getUserList();
    },
    activated() {
        this.getPagination();
        this.getStatistic();
    },
    computed: {
        progressException() {
            return this.progress.status === EXCEPTION;
        },
        progressFinished() {
            return this.progress.percentage === 100;
        }
    },
    methods: {
        async getPublishingProgress() {
            const resp = await getPublishingProgress();
            if (resp.code === 0) {
                // -1表示进行中
                const { code, percentage, message } = resp.data;
                this.progress.percentage = percentage;
                if (code === 0) {
                    this.progress.status = SUCCESS;
                    this.progress.message = message;
                    this.clearTimer();
                }
                else if (code === 1) {
                    this.progress.status = EXCEPTION;
                    this.progress.message = message;
                    this.clearTimer();
                }
            }
        },
        clearTimer() {
            if (this.timer != null) {
                clearInterval(this.timer);
            }
        },
        closeProgressDialog() {
            this.progressDialogVisible = false;
            this.progress.status = null;
            this.progress.message = "";
            this.progress.percentage = 0;
            this.getPagination();
        },
        // 将数组转为对象
        async getStatistic() {
            const resp = await getStatistic();
            if (resp.code === 0) {
                const statistic = resp.data;

                const _statistic = {};

                for (const item of statistic) {
                    _statistic[item.state] = item.count;
                }

                this.statistic = _statistic;
            }
        },
        searchByType(type) {
            this.query.states.length = 0;
            this.query.states.push(type);
            this.search();
        },
        async getUserList() {
            const resp = await getUserList();
            if (resp.code === 0) {
                this.userList = resp.data;
                const userMap = {};
                for (const item of resp.data) {
                    userMap[item.id] = item;
                }
                this.userMap = userMap;
            }
        },
        async getCategoryList() {
            const resp = await getCategoryList();
            if (resp.code === 0) {
                this.categoryList = resp.data;
            }
        },
        setAuthorName(list, retrying = 3) {
            if (!list.length) {
                return;
            }
            const userMapNull = this.userMap === null;
            if (userMapNull && retrying > 0) {
                const timer = setTimeout(() => {
                    this.setAuthorName(list, --retrying);
                    clearTimeout(timer);
                }, 1500);
            }
            for (const item of list) {
                if (userMapNull) {
                    if (!item['authorName']) {
                        item['authorName'] = "-";
                    }
                    continue;
                }
                const author = this.userMap[item.authorId];
                if (!author) {
                    item['authorName'] = "-";
                    continue;
                }
                item.authorName = author.username;
            }
        },
        async publish() {
            this.publishingDialogVisible = false;
            const resp = await publish(this.publishingFormData);
            if (resp.code === 0) {
                this.progressDialogVisible = true;
                this.getPublishingProgress();
                this.timer = setInterval(() => {
                    this.getPublishingProgress();
                }, 1000);
            }
        },
        search() {
            this.query.current = 1;
            this.getPagination();
        },
        async getPagination() {
            const query = { ...this.query };
            this.setStatesIfNecessary(query);
            const resp = await getPagination(query);
            if (resp.code === 0) {
                this.setAuthorName(resp.data.records);
                this.list = resp.data.records;
                this.total = resp.data.total;
            }
        },
        edit(row) {
            this.$router.push({
                path: '/article/editor',
                query: {
                    id: row.id,
                    type: ADMIN
                }
            });
        },
        // 如果处于删除状态，再点击删除时，将进行物理删除
        del(row) {
            this.$confirm("确认删除吗？", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
            }).then(async () => {
                let resp;
                let deleted = row.state === DELETED;
                if (row.state === DELETED) {
                    resp = await doDel({ id: row.id }).catch((error) => {
                        console.log(error);
                    });
                }
                else {
                    resp = await del({ id: row.id }).catch((error) => {
                        console.log(error);
                    });
                }
                if (resp.code === 0) {
                    this.$message.success("操作成功");
                    if (deleted) {
                        this.getPagination();
                    }
                    else {
                        row.state = DELETED;
                    }
                }
            });
        },
    },
};
</script>

<style lang="scss" scoped>
</style>
