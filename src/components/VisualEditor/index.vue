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
							<div
								v-show="blockDraggerHandler.markLine.x"
								class="mark-line-x"
								:style="{ left: `${blockDraggerHandler.markLine.x}px` }"
							></div>
							<div
								v-show="blockDraggerHandler.markLine.y"
								class="mark-line-y"
								:style="{ top: `${blockDraggerHandler.markLine.y}px` }"
							></div>
						</div>
					</div>
				</el-main>
			</el-container>
			<!-- 右侧 组件详情 区域 -->
			<!-- <el-aside width="275px">Edit</el-aside> -->
		</el-container>
	</div>
</template>

<script setup lang="ts">
import VisualEditorBlock from '@/components/VisualEditorBlock/index.js'
import Header from '@/components/Header/index.vue'
import Menu from '@/components/Menu/index.js'
import Store from '@/store'
import { computed, reactive, ref } from 'vue'
import { VisualEditorBlockData, VisualEditorMarkLine } from '@/types'
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
// 当前选择的Block
const state = reactive({
	selectBlock: null as null | VisualEditorBlockData,
})

// 选择并进行拖拽的事件处理
const blockDraggerHandler = (() => {
	let dragState = {
		// 鼠标的X、Y轴的起始位置
		startX: 0,
		startY: 0,
		// 所有选择Block的起始位置
		startPos: [] as { left: number; top: number }[],

		// 辅助线添加
		startLeft: 0,
		startTop: 0,
		markLines: {} as VisualEditorMarkLine,
	}

	// 用于展示的辅助线
	const markLine = reactive({
		x: null as null | number,
		y: null as null | number,
	})

	const { container } = store.$state.visualEditor
	// 防止丢失响应
	const { focusData } = storeToRefs(store)

	const onMouseMove = (e: MouseEvent) => {
		let { clientX: moveX, clientY: moveY } = e
		const { startX, startY } = dragState

		// 是否是水平、垂直拖拽
		if (e.shiftKey) {
			if (Math.abs(moveX - startX) > Math.abs(moveY - startY)) {
				moveY = startY
			} else {
				moveX = startX
			}
		}

		let currentTop = dragState.startTop + moveY - startY
		let currentLeft = dragState.startLeft + moveX - startX
		const currentMarkLine = {
			x: null as null | number,
			y: null as null | number,
		}

		const { x, y } = dragState.markLines
		for (let i = 0; i < y.length; i++) {
			const { top, showTop } = y[i]

			if (Math.abs(top - currentTop) < 5) {
				// 补充缺少的偏移量，让Block贴在辅助线上
				moveY = moveY + top - currentTop
				currentMarkLine.y = showTop
				break
			}
		}
		for (let i = 0; i < x.length; i++) {
			const { left, showLeft } = x[i]

			if (Math.abs(left - currentLeft) < 5) {
				// 补充缺少的偏移量，让Block贴在辅助线上
				moveX = moveX + left - currentLeft
				currentMarkLine.x = showLeft
				break
			}
		}

		const durX = moveX - startX
		const durY = moveY - startY

		focusData.value.focus.forEach((block, i) => {
			let finalX = dragState.startPos[i].left + durX
			let finalY = dragState.startPos[i].top + durY

			// 判断是否超出边界
			if (finalY < 5) finalY = 5
			// TODO: 这里高度还需要减去自身的高度，现在没办法做，下面的宽度同理
			else if (finalY > container.height - block.height! - 5) finalY = container.height - block.height! - 5
			if (finalX < 5) finalX = 5
			else if (finalX > container.width - block.width! - 5) finalX = container.width - block.width! - 5

			block.top = finalY
			block.left = finalX
		})

		markLine.x = currentMarkLine.x
		markLine.y = currentMarkLine.y
	}

	const onMouseup = (e: MouseEvent) => {
		markLine.x = null
		markLine.y = null

		document.removeEventListener('mousemove', onMouseMove)
		document.removeEventListener('mouseup', onMouseup)
	}

	const onMousedown = (e: MouseEvent) => {
		dragState = {
			startX: e.clientX,
			startY: e.clientY,
			startPos: focusData.value.focus.map(({ top, left }) => ({ top, left })),
			startLeft: state.selectBlock?.left!,
			startTop: state.selectBlock?.top!,
			markLines: (() => {
				const { unfocus } = focusData.value
				const { width, height } = state.selectBlock!
				let lines: VisualEditorMarkLine = { x: [], y: [] }

				// 给未选中的Block添加辅助线
				unfocus.forEach(b => {
					const { top: t, left: l, width: w, height: h } = b
					// y轴对齐方式
					// top和拖拽的Block的top一致时
					lines.y.push({ top: t, showTop: t }) // 顶对顶
					// top + h对应Block的底部
					lines.y.push({ top: t + h, showTop: t + h }) // 底对底
					// top + h / 2也就是高度一半的距离，中间距离
					lines.y.push({ top: t + h / 2, showTop: t + h / 2 }) // 中对中
					// 选中的Block贴在未选Block的上面
					lines.y.push({ top: t - height, showTop: t }) // 顶对底

					// x轴对齐方式
					lines.x.push({ left: l, showLeft: l }) // 顶对顶
					lines.x.push({ left: l + w, showLeft: l + w }) // 底对底
					lines.x.push({ left: l + w / 2, showLeft: l + w / 2 }) // 中对中
					lines.x.push({ left: l - width, showLeft: l }) // 顶对底
				})

				return lines
			})(),
		}

		document.addEventListener('mousemove', onMouseMove)
		document.addEventListener('mouseup', onMouseup)
	}

	return { onMousedown, markLine }
})()

// 选中事件的处理
const focusHandler = (() => {
	return {
		containerHandler: {
			onMousedown: (e: MouseEvent) => {
				e.stopPropagation()
				store.clearFocus()
				// 清空选择的Block
				state.selectBlock = null
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
				// 记录当前被选中的Block
				state.selectBlock = block
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
.mark-line-y {
	position: absolute;
	left: 0;
	right: 0;
	border-top: 1px dashed @primary;
}
.mark-line-x {
	position: absolute;
	top: 0;
	bottom: 0;
	border-left: 1px dashed @primary;
}
</style>
