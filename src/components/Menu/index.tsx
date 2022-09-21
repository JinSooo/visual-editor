import visualEditorConfig from '@/config/VisualEditorComponent/config.jsx'
import './index.less'
import { VisualEditorComponent } from '@/types'
import Store from '@/store'

interface Props {
	containerRef: HTMLElement
}

// 容器的处理事件
interface ContainerHandler {
	dragenter: (e: DragEvent) => void
	dragover: (e: DragEvent) => void
	dragleave: (e: DragEvent) => void
	drop: (e: DragEvent) => void
}

// Block的处理事件
interface BlockHandler {
	dragstart: (e: DragEvent, component: VisualEditorComponent, container: HTMLElement) => void
	dragend: (e: DragEvent) => void
}

const list = visualEditorConfig.componentList

const menuDragger = (() => {
	const current = {
		container: null as null | HTMLElement,
		component: null as null | VisualEditorComponent,
	}

	const containerHandler: ContainerHandler = {
		dragenter: e => {
			// 进入容器后可放置
			e.dataTransfer!.dropEffect = 'move'
		},
		dragover: e => {
			e.preventDefault()
		},
		dragleave: e => {
			// 离开容器后不可放置
			e.dataTransfer!.dropEffect = 'none'
		},
		drop: e => {
			console.log('drop component: ', current.component)
			console.log('x', e.offsetX)
			console.log('y', e.offsetY)

			const store = Store()
			store.createNewBlock({
				top: e.offsetY,
				left: e.offsetX,
				componentKey: current.component?.key!,
			})
		},
	}

	const blockHandler: BlockHandler = {
		dragstart: (e, component, container) => {
			container.addEventListener('dragenter', containerHandler.dragenter)
			container.addEventListener('dragover', containerHandler.dragover)
			container.addEventListener('dragleave', containerHandler.dragleave)
			container.addEventListener('drop', containerHandler.drop)
			current.container = container
			current.component = component
		},
		dragend: e => {
			current.container!.removeEventListener('dragenter', containerHandler.dragenter)
			current.container!.removeEventListener('dragover', containerHandler.dragover)
			current.container!.removeEventListener('dragleave', containerHandler.dragleave)
			current.container!.removeEventListener('drop', containerHandler.drop)
			current.component = null
		},
	}

	return blockHandler
})()

const renderDom = (props: Props) => {
	return (
		<div class="menu">
			{list.map(component => (
				<div
					class="menu-item"
					draggable="true"
					onDragstart={e => menuDragger.dragstart(e, component, props.containerRef)}
					onDragend={menuDragger.dragend}
				>
					<span className="menu-item-label">{component.label}</span>
					{/* 组件渲染 */}
					{component.preview()}
				</div>
			))}
		</div>
	)
}

export default renderDom
