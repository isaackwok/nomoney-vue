<template>
  <div class="bg-white flex p-3 justify-end shadow bg-green-500">
    <div class="flex">
      <a href="/provide" class="text-white mr-3 mt-1 ">
        <i class="text-lg fas fa-plus"></i>
      </a>
      <a
        class="text-white py-1 px-3 mr-1 text-sm shadow rounded-full border border-white md:hover:bg-white md:hover:text-green-500"
        href="/"
      >
        <i class="fas fa-search-dollar"></i> 外快
      </a>
      <a
        class="text-white py-1 px-3 mr-1 text-sm shadow rounded-full border border-white md:hover:bg-white md:hover:text-green-500"
        href="/qrcode"
      >
        <i class="fas fa-qrcode"></i> 加入LINE
      </a>
      <a
        href="/profile"
        class="text-white py-1 px-3 text-sm shadow rounded-full border border-white md:hover:bg-white md:hover:text-green-500"
      >
        <i class="fas fa-user"></i> {{ userProfile? userProfile.displayName: '個人檔案' }}
      </a>
    </div>
  </div>
</template>

<script>
export default {
  computed: {
    userProfile() {
      return this.$store.state.userProfile;
    }
  }
};
</script>