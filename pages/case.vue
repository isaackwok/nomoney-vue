<template>
  <div v-if="caseData" class="relative flex flex-col px-5">
    <a
      v-on:click="shareCaseWithPicker(caseData)"
      class="absolute bg-green-500 cursor-pointer text-white text-sm rounded font-bold top-0 shadow right-0 px-1 mt-5 mx-5"
      ><i class="text-white fab fa-line mr-1 text-base cursor-pointer"></i
      >分享</a
    >

    <SectionDivider sectionName="工作內容" />
    <div
      class="flex flex-col rounded-r shadow bg-white px-3 border-l-4"
      v-bind:class="{
        'border-orange-400': caseData.status === 'O', // open
        'border-green-400': caseData.status === 'C', // close
        'border-gray-400': caseData.status === 'D', // delete
      }"
    >
      <!-- case basic info -->
      <div class="relative justify-start py-2">
        <div class="flex flex-1 mr-1 mt-2 justify-between">
          <p class="text-green-700 text-lg font-bold">{{ caseData.title }}</p>
          <p class="text-xs text-orange-400 font-bold whitespace-no-wrap">
            $ {{ caseData.pay }}
          </p>
        </div>
        <p
          v-html="caseData.text.replaceAll('\n', '<br />')"
          class="text-gray-700 leading-tight mt-1"
        ></p>
      </div>

      <!-- case detailed info -->
      <div class="text-gray-600 flex text-sm py-2">
        <table class="table-auto">
          <tbody>
            <tr>
              <td class="pr-2">地區:</td>
              <td class="pr-2">{{ caseData.location }}</td>
            </tr>
            <tr>
              <td class="pr-2">發案人:</td>
              <td class="pr-2">
                {{ caseData.employer.displayName }}
                {{
                  caseData.employer.gender === "M"
                    ? "先生"
                    : caseData.employer.gender === "F"
                    ? "小姐"
                    : "先生/小姐"
                }}
              </td>
            </tr>
            <tr v-if="isAcceptedOrOwner">
              <td class="pr-2">LINE ID:</td>
              <td class="pr-2">
                <a
                  v-bind:href="
                    'https://line.me/R/ti/p/~' + caseData.employer.lineId
                  "
                  >{{ caseData.employer.lineId }}
                  <i class="fas fa-user-plus text-green-400"></i
                ></a>
              </td>
            </tr>
            <tr v-if="isAcceptedOrOwner">
              <td class="pr-2">電話:</td>
              <td class="pr-2">
                <a
                  class="text-blue-700 underline"
                  v-bind:href="'tel:' + caseData.employer.phone"
                  >{{ caseData.employer.phone }}</a
                >
              </td>
            </tr>
            <tr>
              <td class="pr-2">發案人評價:</td>
              <td class="pr-2">
                {{
                  caseData.employer.rating
                    ? caseData.employer.rating + " / 5"
                    : "--"
                }}
              </td>
            </tr>
            <tr>
              <td class="pr-2">發案日期:</td>
              <td class="pr-2">
                {{ caseData.publishTime.replace("T", " ").split(".")[0] }}
              </td>
            </tr>
            <tr>
              <td class="pr-2">最後修改:</td>
              <td class="pr-2">
                {{ caseData.modifiedTime.replace("T", " ").split(".")[0] }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="my-1 flex">
        <a
          class="text-xs px-1 mr-1 border rounded-full border-blue-700 text-blue-700 cursor-pointer"
          v-for="(tag, index) in caseData.hashtag"
          v-on:click="onHashTagClick($event, tag)"
          v-bind:key="index"
          >#{{ tag }}</a
        >
      </div>
    </div>
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
    <div v-if="caseData.status === 'O'" class="self-center">
      <button
        v-if="!isAcceptedOrOwner && !isApplied"
        v-on:click="applyCase(false)"
        class="m-3 text-white bg-green-600 rounded shadow py-1 px2 w-64"
      >
        我要應徵
      </button>
      <button
        v-else-if="!caseData.isOwner && !isAcceptedOrOwner"
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
      <div
        v-for="(applicant, index) in applicants"
        v-bind:key="index"
        class="relative flex flex-col bg-white py-2 px-3 m-1 shadow rounded"
      >
        <a>
          <i
            v-bind:class="{
              'fa-check text-green-500': applicant.accepted === 'A',
              'fa-user-clock text-orange-500': applicant.accepted === 'T',
            }"
            class="fas absolute text-xs top-0 right-0 py-2 px-1"
            >{{ applicant.accepted === "A" ? "已接受" : "待邀約" }}</i
          >
        </a>
        <p class="text-gray-800 italic">{{ applicant.message }}</p>
        <div>
          <table class="table-auto text-sm text-gray-600">
            <tbody>
              <tr>
                <td class="pr-2">姓名:</td>
                <td class="pr-2">{{ applicant.displayName }}</td>
              </tr>
              <tr>
                <td class="pr-2">評分:</td>
                <td class="pr-2">
                  {{ applicant.rating ? applicant.rating + " / 5" : "--" }}
                </td>
              </tr>
              <tr v-if="caseData.isOwner && applicant.accepted === 'A'">
                <td class="pr-2">LINE ID:</td>
                <td class="pr-2">
                  <a
                    v-bind:href="'https://line.me/R/ti/p/~' + applicant.lineId"
                  >
                    {{ applicant.lineId }}
                    <i class="fas fa-user-plus text-green-400"></i
                  ></a>
                </td>
              </tr>
              <tr v-if="caseData.isOwner && applicant.accepted === 'A'">
                <td class="pr-2">電話:</td>
                <td class="pr-2">
                  <a
                    class="text-blue-700 underline"
                    v-bind:href="'tel:' + applicant.phone"
                    >{{ applicant.phone }}</a
                  >
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <a
          v-if="caseData.status === 'O'"
          class="absolute text-sm bottom-0 right-0 m-2"
        >
          <i
            class="fas rounded shadow py-1 px-2 text-white"
            v-on:click="changeApplicationAccepted(applicant)"
            v-bind:class="{
              'fa-backspace bg-red-600': applicant.accepted === 'A',
              'fa-user-check bg-green-600': applicant.accepted === 'T',
            }"
            >{{ applicant.accepted === "A" ? " 反悔" : " 接受" }}</i
          >
        </a>
      </div>
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