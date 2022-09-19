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
	render: () => <el-button>渲染按钮</el-button>,
})

visualEditorConfig.registry('input', {
	label: '输入框',
	preview: () => <el-input>渲染输入框</el-input>,
	render: () => <el-input>渲染输入框</el-input>,
})

export default visualEditorConfig
