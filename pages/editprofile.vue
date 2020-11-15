<template>
  <form v-on:submit="handleSubmit">
    <div class="flex flex-col px-5">
      <!-- Display Name -->
      <label for="displayName" class="font-bold mt-2 text-green-500 text-sm"
        >顯示名稱</label
      >
      <input
        required
        id="displayName"
        class="px-2 py-1 text-gray-700 bg-transparent text-sm focus:bg-white border-b border-green-500"
        placeholder="Jason Chang"
        type="text"
        maxlength="200"
        v-model="formData.displayName"
      />

      <!-- Intro -->
      <label for="intro" class="font-bold mt-4 text-green-500 text-sm"
        >自我介紹</label
      >
      <textarea
        required
        id="intro"
        rows="5"
        class="px-2 py-1 text-gray-700 bg-transparent text-sm focus:bg-white border-b border-green-500 resize-none"
        v-bind:placeholder="introPlaceholder"
        v-model="formData.intro"
      />

      <!-- Location & Gender -->
      <div class="mt-4 flex justify-start content-end">
        <!-- Gender -->
        <div class="flex mr-4 flex-col border-b border-green-500">
          <label for="gender" class="font-bold mt-2 text-green-500 text-sm"
            >性別</label
          >
          <select
            required
            id="gender"
            class="px-2 py-1 text-gray-700 bg-transparent text-sm focus:bg-white"
            v-model="formData.gender"
          >
            <option value="M">男</option>
            <option value="F">女</option>
            <option value="O">其他</option>
          </select>
        </div>
        <!-- Location -->
        <div class="flex flex-col border-b border-green-500">
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
              <option
                v-for="(district, index) in districts[formData.locationCounty]"
                v-bind:key="index"
              >
                {{ district.name }}
              </option>
            </select>
          </div>
        </div>
      </div>

      <!-- Birthday -->
      <label for="birthday" class="font-bold mt-4 text-green-500 text-sm"
        >出生日期</label
      >
      <input
        required
        id="birthday"
        class="px-2 py-1 text-gray-700 bg-transparent text-sm focus:bg-white border-b border-green-500"
        type="date"
        v-model="formData.birthday"
      />

      <!-- Contact Info -->
      <div class="mt-4 flex flex-col justify-start content-end">
        <!-- LINE ID -->
        <label for="lineId" class="font-bold text-green-500 text-sm"
          >LINE ID</label
        >
        <input
          required
          id="lineId"
          class="px-2 py-1 text-gray-700 bg-transparent text-sm focus:bg-white border-b border-green-500"
          placeholder="jason123"
          type="text"
          maxlength="20"
          v-model="formData.lineId"
        />
        <!-- Phone -->
        <label for="phone" class="mt-4 font-bold text-green-500 text-sm"
          >手機號碼</label
        >
        <input
          required
          id="phone"
          class="px-2 py-1 text-gray-700 bg-transparent text-sm focus:bg-white border-b border-green-500"
          placeholder="0987123456"
          type="text"
          maxlength="20"
          v-model="formData.phone"
        />
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
      introPlaceholder:
        "來自香港，擅長寫程式\n" +
        "會講粵語，喜歡認識新朋友\n" +
        "目前就讀國立清華大學\n" +
        "住在新竹，常去桃園跟台北\n" +
        "希望能在這裡賺點外快！\n",
      districts: require("~/assets/districts"),
      formData: {
        displayName: "",
        intro: "",
        gender: "M",
        birthday: "",
        phone: "",
        lineId: "",
        locationCounty: "臺北市",
        locationDistrict: "中正區",
      },
    };
  },
  computed: {
    userProfile() {
      return this.$store.state.userProfile;
    },
  },
  methods: {
    onCountyChange() {
      if (this.districts[this.formData.locationCounty]) {
        this.formData.locationDistrict = this.districts[
          this.formData.locationCounty
        ][0].name;
      }
    },
    handleSubmit(e) {
      e.preventDefault();
      fetch("/api/crud_profile", {
        method: "POST",
        body: JSON.stringify({
          action: "update",
          userIdToken: this.$store.state.userProfile.userId,
          displayName: this.formData.displayName,
          intro: this.formData.intro,
          gender: this.formData.gender,
          birthday: this.formData.birthday,
          phone: this.formData.phone,
          lineId: this.formData.lineId,
          county:
            this.formData.locationCounty + "/" + this.formData.locationDistrict,
        }),
      }).then((res) => {
        alert(`個人檔案修改成功`);
        window.location.replace('/profile')
      });
    },
  },
  watch: {
    userProfile(newValue, oldValue) {
      if (newValue && newValue !== oldValue) {
        fetch("/api/crud_profile", {
          body: JSON.stringify({
            userIdToken: newValue.userId,
            action: "read",
          }),
          method: "POST",
        }).then((res) => res.json()).then(json => {
          this.formData.displayName = json.displayName;
          this.formData.intro = json.intro;
          this.formData.gender = json.gender;
          this.formData.birthday = json.birthday;
          this.formData.phone = json.phone;
          this.formData.lineId = json.lineId;
          this.formData.locationCounty = json.county.split('/')[0];
          this.formData.locationDistrict = json.county.split('/')[1];

        });
      }
    },
  },
};
</script>