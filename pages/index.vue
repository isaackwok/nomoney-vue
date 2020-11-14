<template>
  <div class="flex flex-col px-5">
    <!-- Search Bar -->
    <form v-on:submit="search">
      <div class="flex mt-4">
        <input
          type="text"
          placeholder="搜尋關鍵字 ..."
          class="py-2 px-3 flex-1 rounded-l text-gray-700"
          v-model="keyword"
        />
        <button class="px-3 bg-green-500 text-white rounded-r">
          <i class="fas fa-search"></i>
        </button>
      </div>
    </form>
    <transition name="fade">
      <div
        class="flex flex-col text-sm text-gray-600 px-2 pt-2"
        v-if="filterToggled"
      >
        <label for="minpay" class="mb-1">報酬</label>
        <div class="flex">
          <input
            class="rounded px-2 py-1 mr-1 w-32"
            id="minpay"
            type="number"
            placeholder="最低"
            v-model="conditions.minpay"
          />
          <p class="text-lg">-</p>
          <input
            class="rounded px-2 py-1 ml-1 w-32"
            id="maxpay"
            type="number"
            placeholder="最高"
            v-model="conditions.maxpay"
          />
        </div>
        <label for="minpay" class="mt-2 mb-1">地點</label>
        <div class="flex">
          <!-- County -->
          <select
            v-on:change="onCountyChange"
            v-model="conditions.locationCounty"
            class="rounded p-1 bg-transparent mr-2"
          >
            <option>全部</option>
            <option
              v-for="(county, index) in Object.keys(districts)"
              v-bind:key="index"
            >
              {{ county }}
            </option>
          </select>

          <!-- District -->
          <select
            v-if="districts[conditions.locationCounty]"
            v-model="conditions.locationDistrict"
            class="rounded p-1 bg-transparent"
          >
            <option selected>全部</option>
            <option
              v-for="(district, index) in districts[conditions.locationCounty]"
              v-bind:key="index"
            >
              {{ district.name }}
            </option>
          </select>
        </div>
      </div>
    </transition>

    <!-- Result Section -->
    <p
      class="relative text-green-500 border-b border-green-500 border-solid my-3 p-2 text-start"
    >
      搜尋結果
      <a
        v-on:click="shareSearchWithPicker(keyword)"
        class="border border-green-500 cursor-pointer text-green-500 text-sm rounded font-bold top-0 right-0 px-1 mt-5 mx-1"
        ><i class="text-green-500 fab fa-line mr-1 text-base cursor-pointer"></i
        >分享</a
      >
      <i
        v-bind:class="{
          'text-green-700': filterToggled,
          'text-green-500': !filterToggled,
        }"
        v-on:click="toggleFilter"
        class="absolute right-0 bottom-0 mb-1 mr-1 text-lg text-green-500 px-2 py-2 right-0 fas fa-sliders-h cursor-pointer"
      ></i>
    </p>
    <NoRecord  v-if="searchResults.length === 0" />
    <div v-else class="flex flex-col">
      <InfoCard
        v-for="(result, index) in searchResults.cases"
        v-bind:key="index"
        v-bind:cardData="{
          href: `/case?caseId=${result.caseId}`,
          title: result.title,
          text: result.text,
          pay: result.pay,
          details: {
            地區: { text: result.location },
          },
          textStyle: {
            truncate: true,
            textsm: true,
          },
          titleStyle: {
            bold: true,
            large: false,
            color: 'gray',
            truncate: true
          },
          hashtagTruncate: true,
          hashtag: result.hashtag,
        }"
      />
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      districts: require("~/assets/districts"),
      searchResults: [],
      firstEntry: true,
      offset: 0,
      keyword: "",
      conditions: {
        minpay: "",
        maxpay: "",
        locationCounty: "全部",
        locationDistrict: "全部",
      },
      filterToggled: false,
    };
  },
  computed: {
    userProfile() {
      return this.$store.state.userProfile;
    },
  },
  methods: {
    async shareSearchWithPicker(keyword) {
      const title = `${this.$store.state.userProfile.displayName} 邀請你一起查看與「${keyword}」有關的外快資訊！`;
      console.log(keyword);
      const url =
        "https://liff.line.me/1655089903-YawqnnaN/?keyword=" +
        encodeURIComponent(keyword);
      let message = {
        type: "bubble",
        body: {
          type: "box",
          layout: "vertical",
          contents: [
            {
              type: "text",
              text: title,
              weight: "bold",
              size: "md",
              wrap: true,
            },
          ],
        },
        footer: {
          type: "box",
          layout: "vertical",
          spacing: "sm",
          contents: [
            {
              type: "button",
              style: "link",
              height: "sm",
              action: {
                type: "uri",
                label: "前往",
                uri: url,
              },
            },
            {
              type: "spacer",
              size: "sm",
            },
          ],
          flex: 0,
        },
      };
      if (liff.isApiAvailable("shareTargetPicker")) {
        try {
          const picker = await liff.shareTargetPicker([
            {
              type: "flex",
              altText: `${this.$store.state.userProfile.displayName} 邀請你一起查看與「${keyword}」有關的外快資訊！`,
              contents: message,
            },
          ]);
          if (picker) {
            // succeeded in sending a message through TargetPicker
            console.log(`[${picker.status}] Message sent!`);
          } else {
            const [majorVer, minorVer] = (liff.getLineVersion() || "").split(
              "."
            );
            if (parseInt(majorVer) == 10 && parseInt(minorVer) < 11) {
              console.log(
                "TargetPicker was opened at least. Whether succeeded to send message is unclear"
              );
            } else console.log("TargetPicker was closed!");
          }
        } catch (error) {
          // something went wrong before sending a message
          console.log(error);
          console.log("Flex Message got some error");
          liff.closeWindow();
        }
      } else console.log("Please login...");
    },

    clearFilter() {
      this.conditions = {
        minpay: "",
        maxpay: "",
        locationCounty: "全部",
        locationDistrict: "全部",
      };
    },
    onHashTagClick(e, hashtag) {
      e.stopPropagation();
      e.preventDefault();
      this.keyword = `#${hashtag}`;
      this.clearFilter();
      this.search();
    },
    onCountyChange() {
      this.conditions.locationDistrict = "全部";
    },
    async search(e) {
      if (e) e.preventDefault();
      const queryConditions = {
        location: `${this.conditions.locationCounty}/${this.conditions.locationDistrict}`,
      };
      if (this.conditions.minpay)
        queryConditions.minpay = parseInt(this.conditions.minpay);
      if (this.conditions.maxpay)
        queryConditions.maxpay = parseInt(this.conditions.maxpay);
      this.searchResults = await fetch("/api/search_case", {
        method: "POST",
        body: JSON.stringify({
          userIdToken: this.userProfile.userId,
          keyword: this.keyword,
          offset: 0,
          conditions: queryConditions,
        }),
      })
        .then((res) => res.json())
        .then((json) => {
          if (json.noData) return [];
          return json;
        });
    },
    toggleFilter() {
      this.filterToggled = !this.filterToggled;
    },
  },
  watch: {
    async userProfile(newValue, oldValue) {
      if (this.firstEntry && newValue && newValue !== oldValue) {
        if (this.$route.query && this.$route.query.keyword) {
          this.searchResults = await fetch("/api/search_case", {
            body: JSON.stringify({
              userIdToken: newValue.userId,
              keyword: this.$route.query.keyword,
              offset: 0,
            }),
            method: "POST",
          })
            .then((res) => res.json())
            .then((json) => {
              if (json.noData) return [];
              this.keyword = this.$route.query.keyword;
              return json;
            });
        } else {
          this.searchResults = await fetch("/api/search_case", {
            body: JSON.stringify({
              userIdToken: newValue.userId,
              keyword: "",
              offset: 0,
            }),
            method: "POST",
          })
            .then((res) => res.json())
            .then((json) => {
              if (json.noData) return [];
              return json;
            });
        }
        this.firstEntry = false;
      }
    },
  },
};
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
</style>