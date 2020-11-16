<template>
  <div v-if="seekHistory">
    <NoRecord v-if="seekHistory['count'] === 0" height="short" />
    <div v-else class="flex flex-col">
      <InfoCard
        v-for="(sCase, index) in seekHistory.cases"
        v-bind:key="index"
        v-bind:cardData="{
          href: `/case?caseId=${sCase.caseId}`,
          title: sCase.title,
          text: sCase.text,
          pay: sCase.pay,
          details: {
            地區: { text: sCase.location },
          },
          textStyle: {
            truncate: true,
            textsm: true,
          },
          titleStyle: {
            bold: true,
            large: false,
            color: 'gray',
            truncate: true,
          },
          hashtagTruncate: true,
          hashtag: sCase.hashtag,
          status: sCase.status,
          isEmployeeAccepted: sCase.employee.accepted,
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
      seekHistory: null,
    };
  },
  watch: {
    async userProfile(newValue, oldValue) {
      if (newValue && newValue !== oldValue) {
        this.seekHistory = await fetch(process.env.baseUrl + "/api/get_history", {
          body: JSON.stringify({
            userIdToken: newValue.userId,
            type: "seek",
          }),
          method: "POST",
        }).then((res) => res.json());
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