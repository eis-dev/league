<template>
  <div>
    <!--router start-->
    <transition name="fade">
      <div v-show="load">
        <router-view :id="$route.params.id" :resp="resp" :nowDate="nowDate" @val="getData" @reload="$emit('reload', $event)"
                     :key="resp" @load="load = $event"></router-view>
        <made-by/>
      </div>
    </transition>
    <!--router end-->

    <!--loading start-->
    <transition name="fade">
      <div class="position-fixed w-100 h-100 top-0 left-0 d-flex align-items-center justify-content-center mt-2" v-if="!load">
        <div class="lds-ring">
          <div></div>
          <div></div>
          <div></div>
          <div></div>
        </div>
      </div>
    </transition>
    <!--loading end-->
  </div>
</template>

<script>
  export default {
    name: "lobby",
    data() {
      return {
        resp: false,
        sort: {},
        load: false
      }
    },
    methods: {
      getData() {
        this.$axios.get(this.$api + this.$route.params.id + ".json").then((response) => {
          this.resp = response.data;
          this.load = true;
        });
      },
      look(event) {
        console.log(event);
      }
    },
    computed: {
      path() {
        return this.$route.fullPath
      },
      nowDate() {
        let date = new Date();
        let day = date.getDate();
        if (day < 10) day = "0" + day;
        let month = date.getMonth() + 1;
        if (month < 10) month = "0" + month;
        let hours = date.getHours();
        if (hours < 10) hours = "0" + hours;
        let minutes = date.getMinutes();
        if (minutes < 10) minutes = "0" + minutes;
        date = day + "." + month + "." + date.getFullYear() + " - " + hours + ":" + minutes;
        return date;
      }
    },
    mounted() {
      this.getData();
      window.scrollTo(0, 0);
    },
    watch: {
      path() {
        window.scrollTo(0, 0);
      }
    }
  }
</script>
