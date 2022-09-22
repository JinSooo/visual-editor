import { VisualEditorBlockData, VisualEditorComponent } from '@/types'
import { defineComponent, PropType } from 'vue'
import './index.less'

enum Direction {
	START = 'START',
	CENTER = 'CENTER',
	END = 'END',
}

export default defineComponent({
	props: {
		block: {
			type: Object as PropType<VisualEditorBlockData>,
			require: true,
		},
		component: {
			type: Object as PropType<VisualEditorComponent>,
			require: true,
		},
	},
	setup(props) {
		const { width, height } = props.component?.resize!

		const onMousedown = (() => {
			let data = {
				startX: 0,
				startY: 0,
				startWidth: 0,
				startHeight: 0,
				startLeft: 0,
				startTop: 0,
				direction: {} as { vertical: Direction; horizontal: Direction },
			}

			const mousemove = (e: MouseEvent) => {
				const { startX, startY, startWidth, startHeight, direction, startLeft, startTop } = data
				let { clientX: cX, clientY: cY } = e
				if (direction.vertical === Direction.CENTER) cY = startY
				if (direction.horizontal === Direction.CENTER) cX = startX

				const { block } = props
				let moveX = cX - startX
				let moveY = cY - startY
				if (direction.vertical === Direction.START) {
					moveY = -moveY
					block!.top = startTop - moveY
				}
				if (direction.horizontal === Direction.START) {
					moveX = -moveX
					block!.left = startLeft - moveX
				}
				console.log(startWidth + moveX, startHeight + moveY)
				block!.width = startWidth + moveX
				block!.height = startHeight + moveY
				block!.hasResize = true
			}
			const mouseup = (e: MouseEvent) => {
				document.removeEventListener('mousemove', mousemove)
				document.removeEventListener('mouseup', mouseup)
			}

			const mousedown = (e: MouseEvent, direction: { vertical: Direction; horizontal: Direction }) => {
				e.stopPropagation()
				document.addEventListener('mousemove', mousemove)
				document.addEventListener('mouseup', mouseup)

				const { block } = props
				data = {
					direction,
					startX: e.clientX,
					startY: e.clientY,
					startWidth: block?.width!,
					startHeight: block?.height!,
					startLeft: block?.left!,
					startTop: block?.top!,
				}
			}

			return mousedown
		})()

		return () => (
			<>
				{height && (
					<>
						<div
							className="block-resize block-resize-top"
							onMousedown={e =>
								onMousedown(e, {
									vertical: Direction.START,
									horizontal: Direction.CENTER,
								})
							}
						></div>
						<div
							className="block-resize block-resize-bottom"
							onMousedown={e =>
								onMousedown(e, {
									vertical: Direction.END,
									horizontal: Direction.CENTER,
								})
							}
						></div>
					</>
				)}
				{width && (
					<>
						<div
							className="block-resize block-resize-left"
							onMousedown={e =>
								onMousedown(e, {
									vertical: Direction.CENTER,
									horizontal: Direction.START,
								})
							}
						></div>
						<div
							className="block-resize block-resize-right"
							onMousedown={e =>
								onMousedown(e, {
									vertical: Direction.CENTER,
									horizontal: Direction.END,
								})
							}
						></div>
					</>
				)}
				{width && height && (
					<>
						<div
							class="block-resize block-resize-top-left"
							onMousedown={e =>
								onMousedown(e, {
									vertical: Direction.START,
									horizontal: Direction.START,
								})
							}
						></div>
						<div
							class="block-resize block-resize-top-right"
							onMousedown={e =>
								onMousedown(e, {
									vertical: Direction.START,
									horizontal: Direction.END,
								})
							}
						></div>

						<div
							class="block-resize block-resize-bottom-left"
							onMousedown={e =>
								onMousedown(e, {
									vertical: Direction.END,
									horizontal: Direction.START,
								})
							}
						></div>
						<div
							class="block-resize block-resize-bottom-right"
							onMousedown={e =>
								onMousedown(e, {
									vertical: Direction.END,
									horizontal: Direction.END,
								})
							}
						></div>
					</>
				)}
			</>
		)
	},
})
