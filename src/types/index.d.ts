import { Components } from 'unplugin-vue-components/vite'
// 块
export interface VisualEditorBlockData {
	// 绝对位置的定位
	top: number
	left: number
	// 对应Block的key
	componentKey: string
	// 是否已经调整过位置
	hasAdjustPosition: boolean
	// 是否选中
	focus: boolean
	// Block的宽高
	width: number
	height: number
	// 是否调整过宽高
	hasResize: boolean
}

// 编辑器整体模型
export interface VisualEditorModelValue {
	// 编辑器
	container: {
		width: number
		height: number
	}
	// 块数组
	blocks: VisualEditorBlockData[]
}

// 块组件
export interface VisualEditorComponent {
	// 用于查询
	key: string
	// 使用组件的标签
	label: string
	// 在左侧菜单栏的显示样式
	preview: () => Components
	// 在编辑器上渲染出的样式
	render: (data: { size: { width?: number; height?: number } }) => Components
	// 调整大小
	resize?: {
		width?: boolean
		height?: boolean
	}
}

// 辅助线
export interface VisualEditorMarkLine {
	x: {
		left: number
		showLeft: number
	}[]
	y: {
		top: number
		showTop: number
	}[]
}
