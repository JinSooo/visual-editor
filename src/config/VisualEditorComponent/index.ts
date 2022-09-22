import { VisualEditorComponent } from '@/types/index'

export function createVisualEditorConfig() {
	// 存储组件Block
	const componentList: VisualEditorComponent[] = []
	// 键值对，id -> 组件Block
	const componentMap: Record<string, VisualEditorComponent> = {}

	return {
		componentList,
		componentMap,
		// 注册一个组件Block
		registry: (key: string, component: Omit<VisualEditorComponent, 'key'>) => {
			const comp: VisualEditorComponent = {
				...component,
				key,
				resize: {
					width: component.resize?.width ?? false,
					height: component.resize?.height ?? false,
				},
			}
			componentList.push(comp)
			componentMap[key] = comp
		},
	}
}

// 返回的配置类型
export type VisualEditorConfig = ReturnType<typeof createVisualEditorConfig>
