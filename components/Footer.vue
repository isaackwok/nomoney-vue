<template>
  <div
    class="border-t border-gray-500 flex flex-col p-3 justify-start content-start text-gray-500 text-xs m-3"
  >
    <p class="p-1">Developed by:</p>
    <table class="table-auto">
      <tbody>
        <tr v-for="(member, index) in members" v-bind:key="index">
          <td class="p-1">{{ member.alias }}</td>
          <td class="p-1"><a v-bind:href="'mailto:' + member.email">{{ member.email }}</a></td>
        </tr>
      </tbody>
    </table>
    <a v-bind:href="github.frontend" class="p-1 mt-3">
      <i class="fab fa-github"></i> Front-end
    </a>
    <a v-bind:href="github.backend" class="p-1">
      <i class="fab fa-github"></i> Back-end
    </a>
    <p class="p-1 self-center">© 2020. All right reserved.</p>
  </div>
</template>

<script>
export default {
  data() {
    return {
      members: [
        { alias: "Isaac", email: "kch062522@gmail.com" },
        { alias: "cykuo", email: "tskuo90@gmail.com" },
        { alias: "yizzy", email: "chsh110768@gmail.com" },
      ],
      github: {
        frontend: "https://github.com/isaac0625/nomoney-vue",
        backend: "https://github.com/wohchowshy/nomoney-django",
      },
    };
  },
};
</script>