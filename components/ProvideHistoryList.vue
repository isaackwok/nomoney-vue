<template>
  <div v-if="provideHistory">
    <NoRecord v-if="provideHistory.count === 0" />
    <div v-else class="flex flex-col">
      <InfoCard
        v-for="(pCase, index) in provideHistory.cases"
        v-bind:key="index"
        v-bind:cardData="{
          href: `/case?caseId=${pCase.caseId}`,
          title: pCase.title,
          text: pCase.text,
          pay: pCase.pay,
          details: {
            地區: { text: pCase.location },
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
          hashtag: pCase.hashtag,
          status: pCase.status
        }"
      />
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