<template>
  <p
    class="text-green-500 border-b border-green-500 border-solid my-3 p-2 text-start"
  >
    {{ sectionName }}
  </p>
</template>

<script>
export default {
  props: ['sectionName']
}
</script>