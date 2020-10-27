<template>
  <div v-if="seekHistory">
    <p v-if="seekHistory['count'] === 0" class="text-gray-500 text-center pt-3">
      查無任何記錄
    </p>
    <div v-else class="flex flex-col">
      <a
        v-for="(sCase, index) in seekHistory.cases"
        v-bind:key="index"
        v-bind:href="'/case?caseId=' + sCase.caseId"
        class="block relative border-l-4 bg-white rounded-r shadow px-3 py-2 my-1"
        v-bind:class="{
          'border-orange-400': sCase.status === 'O', // open
          'border-green-400': sCase.status === 'C', // close
          'border-gray-400': sCase.status === 'D', // delete
        }"
      >
        <div class="flex flex-1 mr-1 justify-between">
          <p class="font-bold text-gray-700 mt-2 truncate pb-1">
            {{ sCase.title }}
          </p>
          <p
            class="text-xs text-orange-400 font-bold whitespace-no-wrap top-0 right-0 px-1 mt-1"
          >
            $ {{ sCase.pay }}
          </p>
        </div>
        <p class="text-xs text-gray-600 truncate">{{ sCase.text }}</p>
        <p class="text-xs text-gray-500">{{ sCase.location }}</p>
        <i
          class="absolute text-xs bottom-0 right-0 px-2 py-1 m-1 fas"
          v-bind:class="{
            'fa-user-check text-green-500': sCase.employee.accepted === 'A',
            'fa-user-alt-slash text-red-500': sCase.employee.accepted === 'R',
            'fa-user-clock text-orange-500': sCase.employee.accepted === 'T',
          }"
        >
        </i>
        <div class="my-1 flex">
          <a
            class="text-xs px-1 mr-1 border rounded-full border-blue-700 text-blue-700 cursor-pointer"
            v-for="(tag, index) in sCase.hashtag"
            v-on:click="onHashTagClick($event, tag)"
            v-bind:key="index"
            >#{{ tag }}</a
          >
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
      seekHistory: null,
    };
  },
  watch: {
    async userProfile(newValue, oldValue) {
      if (newValue && newValue !== oldValue) {
        this.seekHistory = await fetch(
          "/api/get_history",
          {
            body: JSON.stringify({
              userIdToken: newValue.userId,
              type: "seek",
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