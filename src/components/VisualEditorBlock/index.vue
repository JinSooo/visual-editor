<template>
	<div class="visual-editor-block" :style="styles">这是一条block</div>
</template>

<script setup lang="ts">
import { VisualEditorBlockData } from '@/types/index'
import { computed } from 'vue'

interface Props {
	block: VisualEditorBlockData
}

const props = defineProps<Props>()

const styles = computed(() => ({
	top: `${props.block.top}px`,
	left: `${props.block.left}px`,
}))
</script>

<style scoped>
.visual-editor-block {
	position: absolute;
}
</style>
