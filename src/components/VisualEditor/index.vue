<template>
	<div class="common-layout">
		<el-container>
			<!-- 左侧菜单 组件 -->
			<el-aside width="355px">
				<Menu></Menu>
			</el-aside>
			<el-container>
				<!-- 头部区域 -->
				<el-header height="60px">Header</el-header>
				<!-- 编辑器 -->
				<el-main>
					<div class="content">
						<div class="container" :style="containerStyles">
							<!-- 渲染所有的块 -->
							<VisualEditorBlock v-for="(block, index) in blocks" :block="block" :key="index" />
						</div>
					</div>
				</el-main>
			</el-container>
			<!-- 右侧 组件详情 区域 -->
			<el-aside width="275px">Edit</el-aside>
		</el-container>
	</div>
</template>

<script setup lang="ts">
import VisualEditorBlock from '@/components/VisualEditorBlock/index.vue'
import Menu from '@/components/Menu/index.js'
import Store from '@/store'
import { computed } from 'vue'

const store = Store()

// 编辑器样式和块的渲染
const containerStyles = computed(() => ({
	width: `${store.$state.visualEditor.container.width}px`,
	height: `${store.$state.visualEditor.container.height}px`,
}))
const blocks = store.$state.visualEditor.blocks
</script>

<style scoped lang="less">
.common-layout {
	height: 100%;
	& /deep/ .el-container {
		height: 100%;
	}
	.content {
		display: flex;
		justify-content: center;
		overflow-y: auto;
		width: 100%;
		height: 100%;
		background-color: rgba(255, 255, 255, 0.5);
		.container {
			position: relative;
			flex-shrink: 0;
			flex-grow: 0;
			background-color: #eee;
		}
	}
}
</style>
