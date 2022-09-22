<template>
	<div class="common-layout">
		<el-container>
			<!-- 左侧菜单 组件 -->
			<el-aside width="355px">
				<Menu :containerRef="containerRef"></Menu>
			</el-aside>
			<el-container>
				<!-- 头部区域 -->
				<el-header height="60px">
					<Header></Header>
				</el-header>
				<!-- 编辑器 -->
				<el-main>
					<div class="content">
						<div
							class="container"
							:style="containerStyles"
							ref="containerRef"
							@mousedown="focusHandler.containerHandler.onMousedown"
						>
							<!-- 渲染所有的块 -->
							<VisualEditorBlock
								v-for="(block, index) in blocks"
								:block="block"
								:key="index"
								@mousedown="e => focusHandler.blockHandler.onMousedown(e, block)"
							/>
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
import VisualEditorBlock from '@/components/VisualEditorBlock/index.js'
import Header from '@/components/Header/index.vue'
import Menu from '@/components/Menu/index.js'
import Store from '@/store'
import { computed, ref } from 'vue'
import { VisualEditorBlockData } from '@/types'
import { storeToRefs } from 'pinia'

const store = Store()

// 编辑器样式和块的渲染
const containerStyles = computed(() => ({
	width: `${store.$state.visualEditor.container.width}px`,
	height: `${store.$state.visualEditor.container.height}px`,
}))
// 块数组
const { blocks } = storeToRefs(store)
// 容器元素
const containerRef = ref({} as HTMLElement)

// 选择并进行拖拽的事件处理
const blockDraggerHandler = (() => {
	let dragState = {
		// 鼠标的X、Y轴的起始位置
		startX: 0,
		startY: 0,
		// 所有选择Block的起始位置
		startPos: [] as { left: number; top: number }[],
	}
	const { container } = store.$state.visualEditor
	// 防止丢失响应
	const { focusData } = storeToRefs(store)

	const onMouseMove = (e: MouseEvent) => {
		let moveX = e.clientX - dragState.startX
		let moveY = e.clientY - dragState.startY
		let moveTop, moveLeft

		focusData.value.focus.forEach((b, i) => {
			// 是否是水平、垂直拖拽
			if (e.shiftKey) {
				if (Math.abs(moveX) > Math.abs(moveY)) {
					moveY = 0
				} else {
					moveX = 0
				}
			}

			// 判断是否超出边界
			moveTop = dragState.startPos[i].top + moveY
			moveLeft = dragState.startPos[i].left + moveX
			if (moveTop < 2) moveTop = 3
			// TODO: 这里高度还需要减去自身的高度，现在没办法做，下面的宽度同理
			else if (moveTop > container.height) moveTop = container.height - 20
			if (moveLeft < 2) moveLeft = 3
			else if (moveLeft > container.width) moveLeft = container.width - 60

			b.top = moveTop
			b.left = moveLeft
		})
	}
	const onMouseup = (e: MouseEvent) => {
		document.removeEventListener('mousemove', onMouseMove)
		document.removeEventListener('mouseup', onMouseup)
	}

	const onMousedown = (e: MouseEvent) => {
		dragState = {
			startX: e.clientX,
			startY: e.clientY,
			startPos: focusData.value.focus.map(({ top, left }) => ({ top, left })),
		}

		document.addEventListener('mousemove', onMouseMove)
		document.addEventListener('mouseup', onMouseup)
	}

	return { onMousedown }
})()

// 选中事件的处理
const focusHandler = (() => {
	return {
		containerHandler: {
			onMousedown: (e: MouseEvent) => {
				e.stopPropagation()
				store.clearFocus()
			},
		},
		blockHandler: {
			onMousedown: (e: MouseEvent, block: VisualEditorBlockData) => {
				e.stopPropagation()
				// e.preventDefault()

				// 未选中的状态下才去处理
				if (!block.focus) {
					// 是否选择多个Block
					if (!e.ctrlKey) {
						block.focus = !block.focus
						store.clearFocus(block)
					} else {
						block.focus = true
					}
				}

				// 添加拖拽事件
				blockDraggerHandler.onMousedown(e)
			},
		},
	}
})()
</script>

<style scoped lang="less">
@import '../../assets/css/variable.less';
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
			border: 2px solid @ibl;
			// background-color: #eee;
			box-shadow: 0 0 12px rgb(27 39 208 / 10%);
		}
	}
}
</style>
