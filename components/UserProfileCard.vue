<template>
  <div
    v-if="userProfile"
    class="relative flex items-center rounded shadow bg-white px-3"
  >
    <a href="/editprofile"
      ><i
        class="absolute text-gray-500 text-sm top-0 right-0 px-2 py-1 m-1 fas fa-pen"
    /></a>
    <!-- Left column -->
    <div class="flex flex-col p-1 text-center">
      <img
        v-bind:src="userProfile.image"
        class="rounded-full h-24 w-24 object-cover object-center"
      />
      <p class="text-gray-700 mt-1">{{ userProfile.displayName }}</p>
    </div>

    <!-- Right column -->
    <div class="flex flex-col flex-1 justify-center items-start py-4 pl-4">
      <table class="table-auto text-sm text-gray-700">
        <tbody>
          <tr>
            <td class="pr-2 text-right">性別:</td>
            <td class="text-left">
              {{
                userProfile.gender === "O"
                  ? "其他"
                  : userProfile.gender === "F"
                  ? "女"
                  : "男"
              }}
            </td>
          </tr>
          <tr>
            <td class="pr-2 text-right">LINE:</td>
            <td class="text-left">
              <a
                v-bind:href="
                  userProfile.lineId !== ''
                    ? `https://line.me/R/ti/p/~${userProfile.lineId}`
                    : undefined
                "
                v-bind:class="{
                  'text-blue-700 underline': userProfile.lineId !== '',
                }"
                >{{ userProfile.lineId }}</a
              >
            </td>
          </tr>
          <tr>
            <td class="pr-2 text-right">手機:</td>
            <td class="text-left">
              <a
                v-bind:class="{
                  'text-blue-700 underline': userProfile.phone !== '',
                }"
                v-bind:href="
                  userProfile.phone !== ''
                    ? 'tel:' + userProfile.phone
                    : undefined
                "
                >{{ userProfile.phone === "" ? "--" : userProfile.phone }}</a
              >
            </td>
          </tr>
          <tr>
            <td class="pr-2 text-right">生日:</td>
            <td class="text-left">{{ userProfile.birthday }}</td>
          </tr>
          <tr>
            <td class="pr-2 text-right">地區:</td>
            <td class="text-left">{{ userProfile.county }}</td>
          </tr>
          <tr>
            <td class="pr-2 text-right">評分:</td>
            <td class="text-left">
              {{ userProfile.rating ? userProfile.rating + " / 5" : "--" }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
export default {
  props: ["userProfile"],
  methods: {
  },
};
</script>