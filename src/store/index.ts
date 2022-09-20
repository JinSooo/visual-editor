import { defineStore } from 'pinia'
import { VisualEditorModelValue, VisualEditorBlockData } from '@/types'

const useStore = defineStore('visualEditor', {
	state: () => ({
		// 编辑器结构和块元素
		visualEditor: {
			container: {
				height: 800,
				width: 500,
			},
			blocks: [
				{ top: 100, left: 100, componentKey: 'button', hasAdjustPosition: false },
				{ top: 200, left: 200, componentKey: 'input', hasAdjustPosition: false },
			],
		} as VisualEditorModelValue,
	}),
	getters: {},
	actions: {
		addBlock(block: VisualEditorBlockData) {
			this.$state.visualEditor.blocks.push(block)
		},
	},
})

export default useStore
