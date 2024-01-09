<template>
  <div class="turn-actions flex col gap-small justify-center" v-if="canEdit">
    <button
      v-if="leftScreenId && rightScreenId"
      class="turn-action-btn"
      title="Merge screens"
      @click="() => $emit('merge', leftScreenId, rightScreenId)">
      <span class="icon icon-merge"></span>
    </button>
    <!-- <button -->
    <!--   class="turn-action-btn" -->
    <!--   data-info="Fusionner les tours" -->
    <!--   @click="() => $emit('add', leftScreenId, rightScreenId)"> -->
    <!--   <span class="icon icon-add"></span> -->
    <!-- </button> -->
  </div>
</template>
<script>
export default {
  props: {
    leftScreenId: {
      type: String,
      requires: true,
    },
    rightScreenId: {
      type: String,
      requires: true,
    },
    canEdit: {
      type: Boolean,
      required: true,
    },
  },
  emits: ["add", "merge"],
}
</script>
