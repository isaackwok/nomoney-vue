<template>
  <div class="w-screen px-5">
    <!-- User Profile Section -->
    <SectionDivider sectionName="個人檔案" />

    <!-- User Profile Card -->
    <UserProfileCard v-bind:userProfile="userProfile" />

    <!-- History Section -->
    <SectionDivider sectionName="接案歷史" />
    <SeekHistoryList v-bind:userProfile="userProfile" />

    <!-- My Case Section -->
    <SectionDivider sectionName="發案歷史" />
    <ProvideHistoryList v-bind:userProfile="userProfile" />
  </div>
</template>

<script>
export default {
  computed: {
    getOS() {
      return this.$store.state.OS;
    },
    userProfile() {
      return this.$store.state.userProfile;
    },
  },
};
</script>