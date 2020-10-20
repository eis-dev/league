<template>
  <div class="container px-md-4 py-4">
    <form @submit="join()">
      <h4 class="mb-3 px-1 text-center home-h4" v-text="$content.home.title"/>
      <p class="text-center" v-html="$content.home.description"/>
      <label class="mt-4 ml-1 lbl" v-text="$content.home.input.label"/>
      <input type="number" class="form-control w-100 id-entry" v-model="id"/>
      <p class="mt-1 ml-1 req" v-text="$content.home.input.valid"></p>
      <input type="submit" class="btn btn-secondary w-100 mt-3" :value="$content.home.input.button"/>
    </form>

    <made-by/>
  </div>
</template>

<script>
  export default {
    name: "test",
    data() {
      return {
        id: false
      }
    },
    methods: {
      join() {
        if (this.id.length > 5) this.$router.push("/" + this.id);
        else alert(this.content.home.input.error);
      }
    }
  }
</script>
