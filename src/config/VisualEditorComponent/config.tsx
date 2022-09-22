import { createVisualEditorConfig } from './index'

const visualEditorConfig = createVisualEditorConfig()

visualEditorConfig.registry('text', {
	label: '文本',
	preview: () => '预览文本',
	render: () => '渲染文本',
})

visualEditorConfig.registry('button', {
	label: '按钮',
	preview: () => <el-button>预览按钮</el-button>,
	render: ({ size }) => (
		<el-button style={{ width: `${size.width}px`, height: `${size.height}px` }}>渲染按钮</el-button>
	),
	resize: {
		width: true,
		height: true,
	},
})

visualEditorConfig.registry('input', {
	label: '输入框',
	preview: () => <el-input>渲染输入框</el-input>,
	render: ({ size }) => <el-input style={{ width: `${size.width}px` }}>渲染输入框</el-input>,
	resize: {
		width: true,
	},
})

export default visualEditorConfig
