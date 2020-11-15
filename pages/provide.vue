<template>
  <form v-on:submit="handleSubmit">
    <div class="flex flex-col px-5">
      <!-- Title -->
      <label for="title" class="font-bold mt-2 text-green-500 text-sm"
        >標題</label
      >
      <input
        required
        id="title"
        class="px-2 py-1 text-gray-700 bg-transparent text-sm focus:bg-white border-b border-green-500"
        placeholder="[徵] 女宿發現大蟑螂，求英雄救美！"
        type="text"
        maxlength="30"
        v-model="formData.title"
      />

      <!-- Description -->
      <label for="description" class="font-bold mt-4 text-green-500 text-sm"
        >外快內容</label
      >
      <textarea
        required
        id="description"
        rows="9"
        class="px-2 py-1 text-gray-700 bg-transparent text-sm focus:bg-white border-b border-green-500 resize-none"
        v-bind:placeholder="descriptionPlaceholder"
        v-model="formData.description"
        maxlength="300"
      />

      <!-- Location & Pay -->
      <div class="mt-4 flex justify-around content-end">
        <!-- Location -->
        <div class="flex flex-col flex-1 mr-4 border-b border-green-500">
          <label for="location" class="font-bold mt-2 text-green-500 text-sm"
            >地點</label
          >
          <div class="flex">
            <!-- County -->
            <select
              v-on:change="onCountyChange"
              v-model="formData.locationCounty"
              id="location"
              class="rounded p-1 bg-transparent text-gray-700 text-sm mr-2"
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
              v-if="districts[formData.locationCounty]"
              v-model="formData.locationDistrict"
              class="rounded p-1 bg-transparent text-gray-700 text-sm"
            >
              <option>全部</option>
              <option
                v-for="(district, index) in districts[formData.locationCounty]"
                v-bind:key="index"
              >
                {{ district.name }}
              </option>
            </select>
          </div>
        </div>

        <!-- Pay -->
        <div class="flex flex-col border-b border-green-500">
          <label for="pay" class="font-bold mt-2 text-green-500 text-sm"
            >報酬</label
          >
          <input
            required
            id="pay"
            class="px-2 py-1 text-gray-700 bg-transparent text-sm focus:bg-white"
            type="number"
            v-model.number="formData.pay"
          />
        </div>
      </div>
      <!-- Submit button -->
      <button class="m-6 bg-green-500 rounded-full text-white py-1 px-2">
        送出
      </button>
    </div>
  </form>
</template>
<script>
export default {
  data() {
    return {
      descriptionPlaceholder:
        "剛剛回到宿舍\n" +
        "突然發現腳邊有一隻超大蟑螂！😨\n" +
        "來不及把它踩死就躲起來了\n\n" +
        "現在我們房間4個女生都超怕不敢亂動\n" +
        "誰趕快來幫我們把它弄死！\n" +
        "十萬火急！\n\n" +
        "請你喝星巴克！",
      districts: require("~/assets/districts"),
      formData: {
        title: "",
        description: "",
        locationCounty: "臺北市",
        locationDistrict: "中正區",
        pay: 0,
      },
    };
  },
  computed: {
    hasCaseIdAndUserProfile() {
      if (
        this.$route.query &&
        this.$route.query.caseId &&
        this.$store.state.userProfile
      )
        return true;
      return false;
    },
  },
  methods: {
    onCountyChange() {
      if (this.districts[this.formData.locationCounty]) {
        this.formData.locationDistrict = this.districts[
          this.formData.locationCounty
        ][0].name;
      } else {
        this.formData.locationDistrict = "全部";
      }
    },
    handleSubmit(e) {
      e.preventDefault();
      fetch("/api/crud_case", {
        method: "POST",
        body: JSON.stringify({
          action: this.hasCaseIdAndUserProfile ? "update" : "create",
          caseId: this.hasCaseIdAndUserProfile ? this.$route.query.caseId : "",
          employerId: this.$store.state.userProfile.userId,
          // case data
          title: this.formData.title,
          text: this.formData.description,
          location:
            this.formData.locationCounty + "/" + this.formData.locationDistrict,
          pay: this.formData.pay,
        }),
      })
        .then((res) => res.json())
        .then((json) => {
          alert(
            `「${this.formData.title}」\n${
              this.hasCaseIdAndUserProfile ? "修改" : "新增"
            }成功`
          );
          this.$route.push({ path: "case", query: { caseId: json.caseId } });
        });
    },
  },
  watch: {
    hasCaseIdAndUserProfile(newValue, oldValue) {
      if (newValue && newValue !== oldValue) {
        fetch("/api/get_case", {
          method: "POST",
          body: JSON.stringify({
            caseId: this.$route.query.caseId,
            userIdToken: this.$store.state.userProfile.userId,
          }),
        })
          .then((res) => res.json())
          .then((json) => {
            this.formData.title = json.title;
            this.formData.description = json.text;
            [
              this.formData.locationCounty,
              this.formData.locationDistrict,
            ] = json.location.split("/");
            this.formData.pay = json.pay;
          });
      }
    },
  },
};
</script>