<template>
	<div class="dashboard-editor-container">
		<div class=" clearfix">
			<pan-thumb style="float: left" :image="avatar"> Your roles:
				<span class="pan-info-roles" :key='item' v-for="item in roles">{{item}}</span>
			</pan-thumb>
			<div class="info-container">
				<span class="display_name">{{name}}</span>
				<span style="font-size:20px;padding-top:20px;display:inline-block;">editor : dashboard</span>
			</div>
		</div>
		<div>
			<img class="emptyGif" :src="emptyGif">
			<!-- <el-table :data="noticeData" style="width: 100%;height: 230px" empty-text="暂无公告">
				<el-table-column label="公告" style="width:60%">
					<template slot-scope="scope">
						<span class="link-type" @click="clickTitle(scope.row)">{{scope.row.title}}</span>
					</template>
				</el-table-column>
				<el-table-column label="发布时间" style="width:40%">
					<template slot-scope="scope">
						<span>{{scope.row.createTime}}
						</span>
					</template>
				</el-table-column>
			</el-table> -->
			<el-table :data="noticeData" style="width: 100%">
                <el-table-column type="expand">
                    <template slot-scope="props">
                        <el-form label-position="left" inline class="demo-table-expand">
							<el-form-item style="width:60%">
								<span>标题</span>		
							</el-form-item>
							<el-form-item style="width:30%">
								<span>发布时间</span>		
							</el-form-item>
                            <div v-for="item in props.row.notice">
                                <el-form-item  style="width:60%">
                                    <span style="cursor:pointer;color:#1d90e6;" @click="clickTitle(item)">{{ item.title }}</span>
                                </el-form-item>
                                <el-form-item  style="width:30%">
                                    <span>{{ item.createTime }}</span>
                                </el-form-item>
                            </div>
                        </el-form>
                    </template>
                </el-table-column>
                <el-table-column label="公告信息" prop="name"></el-table-column>
            </el-table>
		</div>
	</div>
</template>

<script>
	import { mapGetters } from 'vuex'
	import PanThumb from '@/components/PanThumb'
	import GithubCorner from '@/components/GithubCorner'
	import { personalNotice } from '@/api/notice'

	export default {
		name: 'dashboard-editor',
		components: { PanThumb, GithubCorner },
		data() {
			return {
				emptyGif: 'https://wpimg.wallstcn.com/0e03b7da-db9e-4819-ba10-9016ddfdaed3',
				noticeData: null,
			}
		},
		computed: {
    ...mapGetters([
      'name',
			'avatar',
			'roles'
    ])
		},
		created() {
			this.getPersonalNotice();

		},
		methods: {
			getPersonalNotice() {
				personalNotice([this.name]).then(response => {
					this.noticeData = response.data.responseData;
					for(var i=0;i<this.noticeData.length;i++){
						for(var j=0;j<this.noticeData[i].notice.length;j++){
							var date=new Date();
							date.setTime(this.noticeData[i].notice[j].createTime)
							this.noticeData[i].notice[j].createTime=date.toLocaleDateString();
						}
					}
				})
			},
			clickTitle(item) {
				this.$router.push({ name: 'noticeDetial', params: { 'noticeId': item.id ,'type':'staff','staffNo':this.name} });
			},
		}
	}

</script>

<style rel="stylesheet/scss" lang="scss" scoped>
	.emptyGif {
		display: block;
		width: 45%;
		margin: 0 auto;
	}
	
	.dashboard-editor-container {
		background-color: #e3e3e3;
		min-height: 100vh;
		margin-top: -50px;
		padding: 100px 60px 0px;
		.pan-info-roles {
			font-size: 12px;
			font-weight: 700;
			color: #333;
			display: block;
		}
		.info-container {
			position: relative;
			margin-left: 190px;
			height: 150px;
			line-height: 200px;
			.display_name {
				font-size: 48px;
				line-height: 48px;
				color: #212121;
				position: absolute;
				top: 25px;
			}
		}
	}
</style>