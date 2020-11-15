<template>
  <div v-if="caseData" class="relative flex flex-col px-5">
    <a
      v-on:click="shareCaseWithPicker(caseData)"
      class="absolute bg-green-500 cursor-pointer text-white text-sm rounded font-bold top-0 shadow right-0 px-1 mt-5 mx-5"
      ><i class="text-white fab fa-line mr-1 text-base cursor-pointer"></i
      >分享</a
    >
    <SectionDivider sectionName="工作內容" />
    <InfoCard
      v-bind:cardData="{
        title: caseData.title,
        text: caseData.text,
        details: {
          地區: { text: caseData.location },
          發案人: {
            text: `${caseData.employer.displayName} ${
              caseData.employer.gender === 'M'
                ? '先生'
                : caseData.employer.gender === 'F'
                ? '小姐'
                : '先生/小姐'
            }`,
          },
          'LINE ID': caseData.employer.lineId !== undefined
            ? {
                text: caseData.employer.lineId === ''? '--': caseData.employer.lineId,
                href: caseData.employer.lineId === ''? undefined: `https://line.me/R/ti/p/~${caseData.employer.lineId}`,
              }
            : undefined,
          電話: caseData.employer.phone !== undefined
            ? {
                text: caseData.employer.phone === ''? '--': caseData.employer.phone,
                href: caseData.employer.phone === ''? undefined: `tel:${caseData.employer.phone}`,
              }
            : undefined,
          發案人評價: {
            text: caseData.employer.rating
              ? caseData.employer.rating + ' / 5'
              : '--',
          },
          發案日期: {
            text: caseData.publishTime.replace('T', ' ').split('.')[0],
          },
          最後修改: {
            text: caseData.modifiedTime.replace('T', ' ').split('.')[0],
          },
        },
        textStyle: {
          truncate: false,
          textsm: false,
        },
        titleStyle: {
          bold: true,
          large: true,
          color: 'green',
        },
        hashtagTruncate: false,
        pay: caseData.pay,
        hashtag: caseData.hashtag,
        status: caseData.status,
      }"
    />

    <!-- Case Actions -->
    <div
      v-if="caseData.status === 'O' && caseData.isOwner"
      class="flex self-end mt-3 mx-2"
    >
      <button
        v-on:click="caseAction('finish')"
        class="bg-green-600 text-white rounded shadow text-sm px-2 py-1 mx-1"
      >
        <i class="far fa-check-square"></i> 完成
      </button>
      <button
        v-on:click="caseAction('edit')"
        class="bg-gray-600 text-white rounded shadow text-sm px-2 py-1 mx-1"
      >
        <i class="fas fa-pen"></i> 編輯
      </button>
      <button
        v-on:click="caseAction('delete')"
        class="bg-red-600 text-white rounded shadow text-sm px-2 py-1 mx-1"
      >
        <i class="fas fa-trash-alt"></i> 刪除
      </button>
    </div>
    <div v-if="caseData.status === 'O' && !caseData.isOwner && caseData.cancelBtn !== undefined" class="self-center">
      <button
        v-if="!caseData.cancelBtn"
        v-on:click="applyCase(false)"
        class="m-3 text-white bg-green-600 rounded shadow py-1 px2 w-64"
      >
        我要應徵
      </button>
      <button
        v-else
        v-on:click="applyCase(true)"
        class="m-3 text-white bg-yellow-600 rounded shadow py-1 px2 w-64"
      >
        取消應徵
      </button>
    </div>

    <!-- Applicants -->
    <div
      v-if="caseData.isOwner && this.applicants.length > 0"
      class="flex flex-col justify-start"
    >
      <SectionDivider sectionName="應徵者" />
      <!-- Applicant info -->
      <InfoCard
        v-for="(applicant, index) in applicants"
        v-bind:key="index"
        v-bind:cardData="{
          title: applicant.displayName,
          text: applicant.message,
          accepted: applicant.accepted,
          details: {
            評價: {
              text: applicant.rating
                ? applicant.rating + ' / 5'
                : '--',
            },
            'LINE ID':
              caseData.isOwner && applicant.accepted === 'A'
                ? {
                    text: applicant.lineId === ''? '--': applicant.lineId,
                    href: applicant.lineId === ''?undefined: `https://line.me/R/ti/p/~${applicant.lineId}`,
                  }
                : undefined,
            電話:
              caseData.isOwner && applicant.accepted === 'A'
                ? {
                    text: applicant.phone === ''? '--': applicant.phone,
                    href: applicant.phone === ''? undefined: `tel:${applicant.phone}`,
                  }
                : undefined,
          },
          acceptButton: caseData.status === 'O',
          applicant: applicant,
          textStyle: {
            truncate: false,
            textsm: true,
          },
          titleStyle: {
            bold: false,
            large: false,
            color: 'gray',
          },
        }"
      />
    </div>
    <!-- Recommended job -->
    <div v-if="caseData.recommendations.length !== 0">
      <SectionDivider sectionName="相關外快" />
      <div
        class="flex flex-col justify-start content-start text-gray-500 text-sm mx-1"
      >
        <a
          v-for="(recommend, index) in caseData.recommendations"
          v-bind:href="'/case?caseId=' + recommend.caseId"
          v-bind:key="index"
          class="block flex flex-col m-1 px-2 border-l-2 border-gray-500 cursor-pointer"
        >
          <p class="relative truncate text-bold text-gray-600">
            {{ recommend.title
            }}<span class="absolute right-0 ml-2 text-xs place-self-center"
              >$ {{ recommend.pay }}</span
            >
          </p>
          <p class="text-xs">{{ recommend.location }}</p>
        </a>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      caseData: null,
    };
  },
  computed: {
    applicants() {
      return this.caseData.applications.filter(
        (applicant) => applicant.accepted !== "R"
      );
    },
    userProfile() {
      return this.$store.state.userProfile;
    },
    isAcceptedOrOwner() {
      if (this.caseData.isOwner) return true;
      for (let i = 0; i < this.applicants.length; i++) {
        const applicant = this.applicants[i];
        if (
          applicant.employeeId === this.userProfile.userId &&
          applicant.accepted === "A"
        ) {
          return true;
        }
      }
      return false;
    },
    isApplied() {
      for (let i = 0; i < this.applicants.length; i++) {
        const applicant = this.applicants[i];
        if (applicant.employeeId === this.userProfile.userId) {
          return true;
        }
      }
      return false;
    },
  },
  watch: {
    async userProfile(newValue, oldValue) {
      if (newValue && newValue !== oldValue) {
        const query = this.$route.query;
        this.caseData = await fetch("/api/get_case", {
          method: "POST",
          body: JSON.stringify({
            caseId: query.caseId,
            userIdToken: this.userProfile.userId,
          }),
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
    async shareCaseWithPicker(caseData) {
      const title = caseData.title;
      const color = "#48bb78";
      const description = caseData.text;
      const image = caseData.employer.image;
      const url =
        "https://liff.line.me/1655089903-YawqnnaN/case?caseId=" +
        caseData.caseId;
      const location = caseData.location;
      const pay = caseData.pay;
      let message = {
        type: "bubble",
        size: "kilo",
        hero: {
          type: "box",
          layout: "vertical",
          contents: [],
          backgroundColor: color,
          paddingAll: "md",
        },
        body: {
          type: "box",
          layout: "vertical",
          contents: [
            {
              type: "text",
              size: "lg",
              text: title,
              wrap: true,
            },
            {
              type: "separator",
            },
            {
              type: "box",
              layout: "vertical",
              contents: [
                {
                  type: "text",
                  text: description,
                  color: "#8C8C8C",
                  size: "md",
                  wrap: true,
                  maxLines: 3,
                  gravity: "center",
                },
              ],
              paddingAll: "sm",
            },
          ],
          spacing: "md",
          paddingAll: "xxl",
        },
        footer: {
          type: "box",
          layout: "vertical",
          contents: [
            {
              type: "box",
              layout: "vertical",
              contents: [
                {
                  type: "box",
                  layout: "baseline",
                  contents: [
                    {
                      type: "icon",
                      url: "https://imgur.com/3pRXEWY.png",
                      position: "absolute",
                    },
                    {
                      type: "text",
                      text: location,
                      offsetStart: "20px",
                      color: "#8C8C8C",
                      size: "xxs",
                    },
                  ],
                  margin: "none",
                  paddingTop: "none",
                },
              ],
            },
            {
              type: "box",
              layout: "vertical",
              contents: [
                {
                  type: "box",
                  layout: "baseline",
                  contents: [
                    {
                      type: "icon",
                      url: "https://imgur.com/8cV7aKc.png",
                      position: "absolute",
                    },
                    {
                      type: "text",
                      text: "$" + pay,
                      offsetStart: "20px",
                      color: "#8C8C8C",
                      size: "xxs",
                    },
                  ],
                  margin: "none",
                  paddingTop: "none",
                },
              ],
              margin: "sm",
            },
          ],
          paddingAll: "xxl",
        },
        action: {
          type: "uri",
          label: "action",
          uri: url,
        },
        styles: {
          footer: {
            separator: false,
          },
        },
      };
      if (liff.isApiAvailable("shareTargetPicker")) {
        try {
          const picker = await liff.shareTargetPicker([
            {
              type: "flex",
              altText: "「森上梅友前」- " + caseData.title,
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
    changeApplicationAccepted(applicant) {
      const query = this.$route.query;
      fetch("/api/crud_app", {
        method: "POST",
        body: JSON.stringify({
          action: "update",
          caseId: applicant.caseId,
          userIdToken: this.userProfile.userId,
          employeeId: applicant.employeeId,
          accepted: applicant.accepted === "A" ? "T" : "A",
        }),
      })
        .then((res) => res.json())
        .then((json) => {
          alert("應徵者資訊已更新！");
          this.caseData = json;
        });
    },
    caseAction(action) {
      switch (action) {
        case "delete":
          const confirmDelete = confirm("確定要刪除案件嗎？");
          if (confirmDelete) {
            fetch("/api/crud_case", {
              method: "POST",
              body: JSON.stringify({
                action: "delete",
                caseId: this.caseData.caseId,
                userIdToken: this.userProfile.userId,
              }),
            }).then((res) => {
              alert("刪除成功！");
              window.location.replace("/profile");
            });
          }
          break;
        case "finish":
          const confirmClose = confirm("確定要結束案件嗎？");
          if (confirmClose) {
            fetch("/api/crud_case", {
              method: "POST",
              body: JSON.stringify({
                action: "update",
                caseId: this.caseData.caseId,
                status: "C",
              }),
            }).then((res) => {
              alert("結案成功！");
              window.location.reload();
            });
          }
          break;
        case "edit":
          window.location.replace(`/provide?caseId=${this.caseData.caseId}`);
          break;
      }
    },
    applyCase(cancel) {
      const act = cancel ? "delete" : "create";
      let message = null;
      if (!cancel) {
        message = prompt("請輸入應徵留言");
        if (message === null) return;
        if (message === "") {
          alert("請勿留空應徵留言！");
          return;
        }
      }
      fetch("/api/crud_app", {
        method: "POST",
        body: JSON.stringify({
          action: act,
          caseId: this.caseData.caseId,
          employeeId: this.userProfile.userId,
          message: message ? message : "",
        }),
      })
        .then((res) => res.json())
        .then((json) => {
          alert(cancel ? "已取消應徵！" : "已送出要求，請靜候結果！");
          window.location.reload();
        });
    },
  },
};
</script>