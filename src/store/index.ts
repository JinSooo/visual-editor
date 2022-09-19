import { defineStore } from 'pinia'
import { VisualEditorModelValue } from '@/types'

const useStore = defineStore('visualEditor', {
	state: () => ({
		// 编辑器结构和块元素
		visualEditor: {
			container: {
				height: 800,
				width: 500,
			},
			blocks: [
				{ top: 100, left: 100 },
				{ top: 200, left: 200 },
			],
		} as VisualEditorModelValue,
	}),
	getters: {},
	actions: {},
})

export default useStore
