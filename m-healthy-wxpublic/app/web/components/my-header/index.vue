<template>
  <div class="c-header" :class="{ isfixed: isfixed }" >
      <div class="left">
        <slot name="left"></slot>
      </div>
      <div class="center">
        <slot name="center"></slot>
      </div>
      <div class="right">
        <slot name="right"></slot>
      </div>
  </div>
</template>
<style lang="less">
@import './index.less';
</style>
<script lang="ts">
export default{
  props: {
    isfixed: {
      type: Boolean,
      required: false,
      default: false
    }
  }
};
</script>
