import { VisualEditorBlockData } from '@/types/index'
import { computed, defineComponent, PropType, ref, onMounted } from 'vue'
import visualEditorConfig from '@/config/VisualEditorComponent/config'
import BlockResizer from '@/components/BlockResizer'
import './index.less'

export default defineComponent({
	props: {
		block: {
			type: Object as PropType<VisualEditorBlockData>,
		},
	},
	setup(props) {
		const styles = computed(() => ({
			top: `${props.block?.top}px`,
			left: `${props.block?.left}px`,
		}))
		const blockRef = ref({} as HTMLDivElement)

		onMounted(() => {
			// 获取组件的宽高以此来让组件对准鼠标点显示
			const { block } = props
			// 是否已经调节过位置了
			if (!block?.hasAdjustPosition) {
				const { offsetWidth, offsetHeight } = blockRef.value
				block!.left -= offsetWidth / 2
				block!.top -= offsetHeight / 2
				block!.hasAdjustPosition = true
				block!.width = offsetWidth
				block!.height = offsetHeight
			}
		})

		return () => {
			const component = visualEditorConfig.componentMap[props.block!.componentKey]
			const { width, height } = component.resize!
			const renderBlock = component?.render({
				size: props.block?.hasResize ? { width: props.block?.width, height: props.block?.height } : {},
			})

			return (
				<div
					class={['visual-editor-block', props.block?.focus ? ' visual-editor-block-focus' : '']}
					style={styles.value}
					ref={blockRef}
				>
					{renderBlock}
					{props.block?.focus && (width || height) && (
						<BlockResizer block={props.block} component={component}></BlockResizer>
					)}
				</div>
			)
		}
	},
})
