<template>
  <p class="text-gray-500 text-center"
  v-bind:class="{
      'py-64': height === 'tall',
      'py-32': height === 'compact',
      'py-16': height === 'short',
  }">
    查無任何記錄
  </p>
</template>
<script>
export default {
    props:['height']
}
</script>
