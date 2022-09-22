import { defineStore } from 'pinia'
import { VisualEditorModelValue, VisualEditorBlockData, VisualEditorComponent } from '@/types'

const useStore = defineStore('visualEditor', {
	state: () => ({
		// 编辑器结构和块元素
		visualEditor: {
			container: {
				height: 800,
				width: 500,
			},
			blocks: [
				{ top: 100, left: 100, componentKey: 'button', hasAdjustPosition: false, focus: false },
				{ top: 200, left: 200, componentKey: 'input', hasAdjustPosition: false, focus: false },
			],
		} as VisualEditorModelValue,
	}),
	getters: {
		focusData: state => {
			const { blocks } = state.visualEditor
			// 所有选中的Block
			const focus: VisualEditorBlockData[] = blocks.filter(b => b.focus)
			// 所有未选中的Block
			const unfocus: VisualEditorBlockData[] = blocks.filter(b => !b.focus)
			return {
				focus,
				unfocus,
			}
		},
		blocks: state => state.visualEditor.blocks,
	},
	actions: {
		createNewBlock(block: { componentKey: string; top: number; left: number }) {
			const newBlock: VisualEditorBlockData = { ...block, hasAdjustPosition: false, focus: false }
			this.addNewBlock(newBlock)
		},
		addNewBlock(block: VisualEditorBlockData) {
			this.$state.visualEditor.blocks.push(block)
		},
		// 清空其他Block的选中状态
		clearFocus(block?: VisualEditorBlockData) {
			const { blocks } = this.$state.visualEditor
			if (blocks.length === 0) return

			let filterBlocks = blocks
			if (block) {
				filterBlocks = filterBlocks.filter(b => b !== block)
			}
			filterBlocks.forEach(b => (b.focus = false))
		},
		deleteFocus() {
			this.$state.visualEditor.blocks = this.focusData.unfocus
		},
	},
})

export default useStore
