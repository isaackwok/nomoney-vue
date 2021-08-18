<template>
  <div
    class="relative flex flex-col shadow bg-white p-3 m-1"
    v-on:click="cardData.href ? jump(cardData.href) : undefined"
    v-bind:class="
      cardData.status
        ? {
            'border-l-4 rounded-r': true,
            'cursor-pointer': cardData.href,
            'border-orange-400': cardData.status === 'O', // open
            'border-green-400': cardData.status === 'C', // close
            'border-gray-400': cardData.status === 'D', // delete
          }
        : {
            rounded: true,
            'cursor-pointer': cardData.href,
          }
    "
  >
    <!-- Title and Pay -->
    <div class="relative justify-start">
      <div
        class="flex flex-1"
        v-bind:class="
          cardData.pay !== undefined ||
          (cardData.applicant && cardData.applicant.accepted)
            ? {
                'justify-between': true,
              }
            : {
                'justify-start': true,
              }
        "
      >
        <p
          v-bind:class="{
            'font-bold': cardData.titleStyle.bold,
            truncate: cardData.titleStyle.truncate,
            'text-lg': cardData.titleStyle.large,
            'text-green-700': cardData.titleStyle.color === 'green',
            'text-gray-700': cardData.titleStyle.color === 'gray',
          }"
        >
          {{ cardData.title }}
        </p>
        <p
          v-if="cardData.pay !== undefined"
          class="text-xs text-orange-400 font-bold whitespace-no-wrap"
        >
          $ {{ cardData.pay }}
        </p>
        <i
          v-if="cardData.applicant && cardData.applicant.accepted"
          v-bind:class="{
            'fa-check text-green-500':
              cardData.applicant && cardData.applicant.accepted === 'A',
            'fa-user-clock text-orange-500':
              cardData.applicant && cardData.applicant.accepted === 'T',
          }"
          class="fas text-xs"
          >{{
            cardData.applicant && cardData.applicant.accepted === "A"
              ? "已接受"
              : "待邀約"
          }}</i
        >
      </div>
      <p
        v-html="
          cardData.text.replaceAll(
            '\n',
            cardData.textStyle.truncate ? ' ' : '<br />'
          )
        "
        class="text-gray-700 leading-tight mt-1"
        v-bind:class="{
          truncate: cardData.textStyle.truncate,
          'text-sm': cardData.textStyle.textsm,
        }"
      ></p>
    </div>

    <!-- Detailed Information -->
    <div class="text-gray-600 flex text-sm mt-1">
      <table class="table-auto">
        <tbody>
          <tr
            v-for="(value, key, index) in cardData.details"
            v-bind:key="index"
          >
            <td v-if="value" class="pr-2 py-0">{{ key }}:</td>
            <td v-if="value && value.href">
              <a v-bind:href="value.href" class="text-blue-700 underline">{{
                value.text
              }}</a>
            </td>
            <td v-else-if="value">{{ value.text }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Hashtags -->
    <div v-if="cardData.hashtag" class="mt-1 flex">
      <a
        class="text-xs px-1 mr-1 border rounded-full border-blue-700 text-blue-700 cursor-pointer click:bg-blue-700 click:text-white md:hover:bg-blue-700 md:hover:text-white"
        v-for="(tag, index) in cardData.hashtagTruncate
          ? cardData.hashtag.slice(0, 3)
          : cardData.hashtag"
        v-on:click="onHashTagClick($event, tag)"
        v-bind:key="index"
        >#{{ tag }}</a
      >
      <span
        v-if="cardData.hashtagTruncate && cardData.hashtag.length > 3"
        class="text-xs px-1 text-blue-700"
        >...</span
      >
    </div>

    <!-- Accepted or Reject Button -->
    <a
      v-if="cardData.acceptButton"
      class="absolute text-sm bottom-0 right-0 m-2 cursor-pointer"
    >
      <i
        class="fas rounded shadow py-1 px-2 text-white"
        v-on:click="changeApplicationAccepted(cardData.applicant)"
        v-bind:class="{
          'fa-backspace bg-red-600': cardData.applicant.accepted === 'A',
          'fa-user-check bg-green-600': cardData.applicant.accepted === 'T',
        }"
        >{{ cardData.applicant.accepted === "A" ? " 反悔" : " 接受" }}</i
      >
    </a>

    <!-- Accepted icon in Seek History -->
    <i
      class="absolute text-xs bottom-0 right-0 m-2 fas"
      v-bind:class="{
        'fa-user-check text-green-500': cardData.isEmployeeAccepted === 'A',
        'fa-user-alt-slash text-red-500': cardData.isEmployeeAccepted === 'R',
        'fa-user-clock text-orange-500': cardData.isEmployeeAccepted === 'T',
      }"
    ></i>
  </div>
</template>

<script>
export default {
  props: ["cardData"],
  computed: {
    userProfile() {
      return this.$store.state.userProfile;
    },
  },
  methods: {
    jump(href) {
      window.location.replace(href);
    },
    onHashTagClick(e, hashtag) {
      e.stopPropagation();
      e.preventDefault();
      window.location.replace(`/?keyword=${encodeURIComponent("#" + hashtag)}`);
    },
    changeApplicationAccepted(applicant) {
      const query = this.$route.query;
      fetch(process.env.baseUrl + "/api/crud_app", {
        method: "POST",
        body: JSON.stringify({
          action: "update",
          caseId: applicant.caseId,
          appId: applicant.appId,
          userIdToken: this.userProfile.userId,
          employeeId: applicant.employeeId,
          accepted: applicant.accepted === "A" ? "T" : "A",
        }),
      })
        .then((res) => res.json())
        .then((json) => {
          alert("應徵者資訊已更新！");
          window.location.reload();
        });
    },
  },
};
</script>