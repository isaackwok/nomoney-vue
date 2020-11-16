<template>
  <div class="flex flex-col">
    <NavBar />
    <div
      v-if="userProfile && (!userProfile.phone || !userProfile.lineId)"
      class="bg-red-300 text-red-700 p-2 text-sm"
    >
      請記得更新你的資料，才能夠配對得更準確，更容易應徵成功喔！
    </div>
    <div class="md:self-center md:w-3/5 lg:w-2/5">
      <Nuxt />
    </div>
    <Footer />
  </div>
</template>

<script>
const LIFF_ID = process.env.LIFF_ID;
export default {
  head: {
    title: process.env.prjname,
    script: [
      { src: "https://static.line-scdn.net/liff/edge/2/sdk.js", body: true },
      {
        src: "https://kit.fontawesome.com/d1105f8ef3.js",
        crossorigin: "anonymous",
      },
    ],
    meta: [
      { name: "viewport", content: "initial-scale=1.0, width=device-width" },
    ],
  },
  computed: {
    isWeb() {
      if (process.env.dev) return false;
      return this.$store.state.OS === "web";
    },
    userProfile() {
      return this.$store.state.userProfile;
    },
  },
  mounted() {
    this.$store.commit("setOS", liff);
    // initialize LIFF
    liff
      .init({
        liffId: LIFF_ID,
      })
      .then(async () => {
        // handle login
        if (process.env.dev) {
            this.$store.commit(
              "setUserProfile",
              await fetch(process.env.baseUrl + "/api/crud_profile", {
                method: "POST",
                body: JSON.stringify({
                  action: "create",
                  userIdToken: 'U04d1a0375336023979bce781d7da76b3',
                }),
              }).then((res) => res.json())
            );
          // this.$store.commit("setUserProfile", {
          //   noData: false,
          //   userId: "U04d1a0375336023979bce781d7da76b3",
          //   displayName: "Isaac Kwok",
          //   image:
          //     "https://profile.line-scdn.net/0h2jM2kFEJbUVwS0Qla_0SEkwOYygHZWsNCHggIQYeMyFeLi1DSn8rdFJCNCUIeipGG311JFVIY30P",
          //   intro:
          //     "\u6211\u559c\u6b61\u5beb\u7a0b\u5f0f\r\n\u7b2c\u4e00\u6b21\u53c3\u52a0\u9ed1\u5ba2\u677e\r\n\u5e0c\u671b\u80fd\u5e6b\u52a9\u5230\u5f88\u591a\u4eba",
          //   gender: "M",
          //   birthday: "1997-06-25",
          //   phone: "0987654321",
          //   county: "\u65b0\u7af9\u5e02/\u5317\u5340",
          //   rating: 5.0,
          //   lineId: "isaackwok0625",
          // });
        } else if (liff.isLoggedIn()) {
          this.$store.commit("setUserIdToken", await liff.getProfile());
          if (!this.$store.state.userProfile) {
            this.$store.commit(
              "setUserProfile",
              await fetch("/api/crud_profile", {
                method: "POST",
                body: JSON.stringify({
                  action: "create",
                  userIdToken: this.$store.state.userIdToken.userId,
                  displayName: this.$store.state.userIdToken.displayName,
                  image: this.$store.state.userIdToken.pictureUrl
                    ? this.$store.state.userIdToken.pictureUrl
                    : "",
                }),
              }).then((res) => res.json())
            );
          }
        } else {
          if (!this.$store.state.userProfile && !liff.isLoggedIn())
            liff.login();
        }
      })
      .catch((err) => {
        // do something when error is catched
      });
  },
};
</script>

<style>
body {
  background-color: #e9ecf0;
}
</style>