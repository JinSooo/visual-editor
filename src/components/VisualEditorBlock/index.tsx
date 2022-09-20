import { VisualEditorBlockData } from '@/types/index'
import { computed, defineComponent, PropType, ref, onMounted, render } from 'vue'
import visualEditorConfig from '@/config/VisualEditorComponent/config'
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
			}
		})

		return () => {
			const component = visualEditorConfig.componentMap[props.block!.componentKey]
			const renderBlock = component?.render()
			return (
				<div class="visual-editor-block" style={styles.value} ref={blockRef}>
					{renderBlock}
				</div>
			)
		}
	},
})
