<template>
  <div v-if="provideHistory">
    <p v-if="provideHistory.count === 0" class="text-gray-500 text-center pt-3">
      查無任何記錄
    </p>
    <div v-else class="flex flex-col">
      <a
        v-for="(pCase, index) in provideHistory.cases"
        v-bind:key="index"
        v-bind:href="'/case?caseId=' + pCase.caseId"
        class="block relative border-l-4 bg-white rounded-r shadow px-3 py-2 my-1"
        v-bind:class="{
          'border-orange-400': pCase.status === 'O', // open
          'border-green-400': pCase.status === 'C', // close
          'border-gray-400': pCase.status === 'D', // delete
        }"
      >
        <div class="flex flex-1 mr-1 justify-between">
          <p class="font-bold text-gray-700 mt-2 truncate pb-1">
            {{ pCase.title }}
          </p>
          <p
            class="text-xs text-orange-400 font-bold whitespace-no-wrap top-0 right-0 px-1 mt-1"
          >
            $ {{ pCase.pay }}
          </p>
        </div>
        <p class="text-xs text-gray-600 truncate">{{ pCase.text }}</p>
        <p class="text-xs text-gray-500">{{ pCase.location }}</p>
        <div class="my-1 flex">
          <a
            class="text-xs px-1 mr-1 border rounded-full border-blue-700 text-blue-700 cursor-pointer"
            v-for="(tag, index) in pCase.hashtag.slice(0, 3)"
            v-on:click="onHashTagClick($event, tag)"
            v-bind:key="index"
            >#{{ tag }}</a
          >
          <span v-if="pCase.hashtag.length > 3" class="text-xs px-1 text-blue-700">...</span>
        </div>
      </a>
    </div>
  </div>
</template>

<script>
export default {
  props: ["userProfile"],
  data() {
    return {
      provideHistory: null,
    };
  },
  watch: {
    async userProfile(newValue, oldValue) {
      if (newValue && newValue !== oldValue) {
        this.provideHistory = await fetch(
          "/api/get_history",
          {
            body: JSON.stringify({
              userIdToken: newValue.userId,
              type: "provide",
            }),
            method: "POST",
          }
        ).then((res) => res.json());
      }
    },
  },
  methods: {
    onHashTagClick(e, hashtag) {
      e.stopPropagation();
      e.preventDefault();
      window.location.replace(`/?keyword=${encodeURIComponent("#" + hashtag)}`);
    },
  },
};
</script>