<script setup lang="ts">

interface Props {
  show: Boolean
}

defineProps<Props>()
const emits = defineEmits(["close"])

function close() {
  emits("close")
}

</script>
<template>
  <Teleport to="#modals">
    <div v-if="show" class="modal-backdrop" @click.self="close">
      <div class="modal-content">
        <slot />
      </div>
    </div>
  </Teleport>
</template>
<style lang="scss">
.modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  max-width: 500px;
  width: 100%;
}
</style>