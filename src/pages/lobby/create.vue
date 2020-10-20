<template>
  <div class="container px-md-4 py-4 create-page">
    <div class="row">
      <div class="col-12">
        <h4 class="mb-3 px-1 text-center" v-text="$content.list.create_button"/>
        <img class="position-absolute cursor-pointer back-btn mt-3 px-0" :src="backSVG"
             @click="$router.push('/' + $route.params.id)"/>
      </div>
    </div>
    <div class="row pt-3">
      <div class="col-12 mb-0 pt-3 px-3">
        <!--elements-->
        <div class="mb-4 pt-1 pb-2" v-for="(item, key) in elements">
          <label :for="key" class="text-primary" v-text="item.title"/>
          <input :type="item.type" :id="key" spellcheck="false" v-model="item.value" class="form-control w-100 p-0"
                 autocomplete="off"/>
        </div>

        <!--teams-->
        <div class="mb-4 pt-1 pb-2" v-for="item in length">
          <label :for="item + '_team'" class="text-primary" v-text="item + '. Takımın adı?'"/>
          <input type="text" :id="item + '_team'" spellcheck="false" v-model="teams[item - 1]"
                 class="form-control w-100 p-0"
                 autocomplete="off"/>
        </div>

        {{ $reload }}

        <button class="btn btn-primary w-100" v-if="validation" @click="fixing">Ligi Oluştur</button>

      </div>
    </div>
  </div>
</template>

<script>
  import backSVG from "../../assets/svg/back.svg";

  export default {
    name: "create",
    data() {
      return {
        backSVG: backSVG,
        teams: [],
        elements: {
          league: {
            title: "Ligin adı nedir?",
            type: "text",
            value: "Test"
          },
          length: {
            title: "Kaç takım var?",
            type: "number",
            value: "3"
          }
        }
      }
    },
    computed: {
      length() {
        this.teams = [];

        let len = this.elements.length.value;
        if (len > 0) return parseInt(len)
        else return "";
      },
      validation() {
        let len = this.length, lenName = this.elements.league.value.length, teams = this.teams, boolean = false;

        try {
          if (teams.length === len && !teams.includes(undefined) && !teams.includes("")) boolean = true;
        } catch(err) {}

        return len > 1 && lenName > 0 && boolean
      }
    },
    methods: {
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
      },
      suffle(a) {
        let j, x, i;
        for (i = a.length - 1; i > 0; i--) {
          j = Math.floor(Math.random() * (i + 1));
          x = a[i];
          a[i] = a[j];
          a[j] = x;
        }
        return a;
      },
      fixing() {
        let teams = this.teams, matches = [];

        for (let item in teams) {
          for (let item2 in teams) {
            if (item !== item2) {
              let nohave = 0;
              if (matches)
                for (let match in matches)
                  if ((matches[match][0] === item && matches[match][1] === item2) || (matches[match][0] === item2 && matches[match][1] === item)) nohave++;
              if (nohave === 0) matches.push(this.suffle([item, item2]));
            }
          }
        }

        matches = this.suffle(matches);

        let new_matches = [], match_arr = [];

        (function organize(matches) {
          let del_matches = [];

          for (let item in matches) {
            let match = matches[item], diff = true, tiim = [];

            for (let m in match) {
              if (match_arr.includes(match[m])) diff = false;
              tiim.push(match[m]);
            }

            if (teams.length - match_arr.length < 2) {
              if (!match_arr.includes(tiim[0]) || !match_arr.includes(tiim[1])) diff = true;

              match_arr = [];
            }

            if (diff) {
              new_matches.push(match);
              for (let tt in tiim) match_arr.push(tiim[tt]);
            } else del_matches.push(match);
          }

          if (del_matches.length) organize(del_matches);
        })(matches)

        this.save(new_matches);
      },
      save(match) {
        let time = new Date().getTime(), date = this.nowDate();

        this.$axios.put(this.$api + this.$route.params.id + "/" + time + ".json", {
          league: this.elements.league.value,
          teams: this.teams,
          name: time,
          scores: false,
          match: match,
          locked: this.$content.app.footer,
          updated_at: date,
          created_at: date
        }).then((obj) => {
          this.$router.push("/" + this.$route.params.id + "/" + obj.data.name);
          this.$emit("reload", Math.floor(Math.random() * 100000));
        });
      }
    }
  }
</script>
