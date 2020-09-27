<template>
  <div id="app">
    <router-view />
  </div>
</template>
<script lang="ts">
import Vue from "vue";
import axios from "axios";
import registerSw from "../../public/service-worker/registerSw.js";
export default {
  mounted() {
    axios.get("/api/common/has-token").then(res => {
      if (res.status === 200 && res.data.data.token) {
        registerSw();
      }
    });
  }
};
</script>
