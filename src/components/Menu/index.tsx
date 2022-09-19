import visualEditorConfig from '@/config/VisualEditorComponent/config.jsx'
import './index.less'

const list = visualEditorConfig.componentList

const renderDom = () => {
	return (
		<div class="menu">
			{list.map(component => (
				<div class="menu-item">
					<span className="menu-item-label">{component.label}</span>
					{/* 组件渲染 */}
					{component.preview()}
				</div>
			))}
		</div>
	)
}

export default renderDom
