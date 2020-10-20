<template>
  <div>
    <!--router start-->
    <transition name="fade">
      <div v-if="resp">
        <router-view :id="$route.params.id" :resp="resp" @val="getData" @reload="reload($event)" :key="resp"></router-view>
        <made-by/>
      </div>
    </transition>
    <!--router end-->

    <!--loading start-->
    <transition name="fade">
      <div class="position-absolute w-100 h-100 top-0 left-0 d-flex align-items-center justify-content-center mt-2" v-if="!resp">
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
        resp: false
      }
    },
    methods: {
      getData() {
        this.$axios.get(this.$api + this.$route.params.id + ".json").then((response) => {
          this.resp = response.data;
        });
      },
      reload(val) {
        this.$emit("reload", val);
      }
    },
    computed: {
      path() {
        return this.$route.fullPath
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
