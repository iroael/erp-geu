<script setup lang="ts">
import type { PropType } from 'vue';
import type { WorkflowConnection } from '~/stores/workflow';

const props = defineProps({
  show: {
    type: Boolean,
    default: false,
  },
  x: {
    type: Number,
    default: 0,
  },
  y: {
    type: Number,
    default: 0,
  },
  connectionToDelete: {
    type: Object as PropType<WorkflowConnection | null>,
    default: null,
  },
});

const emit = defineEmits(['delete-connection', 'hide-context-menu']);

const handleDelete = () => {
  if (props.connectionToDelete) {
    emit('delete-connection', props.connectionToDelete);
  }
  emit('hide-context-menu');
};
</script>

<template>
  <div
    v-if="show"
    class="connection-context-menu absolute bg-white shadow-lg rounded-md py-1 z-50"
    :style="{ left: `${x}px`, top: `${y}px` }"
    @click.stop
    @contextmenu.prevent
  >
    <button
      @click="handleDelete"
      class="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-100"
    >
      Delete Connection
    </button>
  </div>
</template>

<style scoped>
/* Tambahkan gaya khusus jika diperlukan */
</style>
