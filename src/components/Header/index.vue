<template>
	<div class="head">
		<div class="head-btn" v-for="(btn, index) in toolButtons" :key="index" @click="btn?.handler">
			<i :class="'iconfont ' + btn.icon"></i>
			<span>{{ btn.label }}</span>
		</div>
	</div>
</template>

<script setup lang="ts">
import Store from '@/store'

// 顶部工具栏按钮
interface ToolButton {
	label: string
	icon: string
	tip: string
	handler?: () => void
}

const store = Store()

const toolButtons: ToolButton[] = [
	{
		label: '撤销',
		icon: 'icon-back',
		tip: 'ctrl+z',
	},
	{
		label: '重做',
		icon: 'icon-forward',
		tip: 'ctrl+y, ctrl+shift+z',
	},
	{
		label: '删除',
		icon: 'icon-delete',
		tip: 'ctrl+d, backspace, delete',
		handler: () => {
			store.deleteFocus()
		},
	},
]
</script>

<style scoped lang="less">
@import '../../assets/iconfont/iconfont.css';

.head {
	display: flex;
	align-items: center;
	justify-content: center;
	z-index: 2;
	.head-btn {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		background-color: rgba(0, 0, 0, 0.25);
		color: white;
		height: 55px;
		width: 55px;
		margin-right: 1px;
		cursor: pointer;
		i {
			font-size: 20px;
		}
		span {
			font-size: 12px;
		}
		&:first-child {
			border-top-left-radius: 4px;
			border-bottom-left-radius: 4px;
		}
		&:last-child {
			border-top-right-radius: 4px;
			border-bottom-right-radius: 4px;
		}
		&:hover {
			background-color: gray;
		}
	}
}
</style>
