<template>
  <div class="container px-md-4 py-4">
    <div class="row">
      <!--head start-->
      <div class="col-12 mb-4">
        <h4 class="mb-3 px-1 text-center" v-text="$content.list.title.replace('{id}', id)"/>
        <img class="position-absolute cursor-pointer back-btn mt-3 px-0" :src="backSVG" @click="$router.push('/')"/>
        <img class="position-absolute px-2 cursor-pointer lock-btn stats-icon" :src="statsSVG"
             @click="$router.push('/'+id+'/stats')"/>
      </div>
      <!--head end-->

      <div class="col-12 px-0">

        <!--list start-->
        <ul class="list-group league-list cursor-pointer">
          <li class="list-group-item new-l text-primary mb-2" @click="$router.push('/'+id+'/create')"
              v-text="$content.list.create_button"/>
        </ul>

        <ul class="list-group league-list cursor-pointer">
          <li v-for="(item, key) in list" @click="$router.push('/'+id+'/'+key)"
              class="list-group-item cursor-pointer mb-0">
            <b>{{item['league']}}</b>
            <span class="date">{{ item['created_at'] }}</span>
            <br/>{{ item['teams'].toString().replaceAll(",", ", ") }}
          </li>
        </ul>
        <!--list end-->

      </div>

    </div>
  </div>
</template>

<script>
  import backSVG from "../../assets/svg/back.svg";
  import statsSVG from "../../assets/svg/stats.svg";

  export default {
    name: "list",
    props: ["id", "resp"],
    data() {
      return {
        list: {},
        backSVG: backSVG,
        statsSVG: statsSVG
      }
    },
    mounted() {
      let object = this.resp, newObject = {}, keys = [];
      for (let key in object) keys.push(key);
      for (let i = keys.length - 1; i >= 0; i--) newObject[keys[i]] = object[keys[i]];
      this.list = newObject;
    }
  }
</script>

<style scoped>

</style>
