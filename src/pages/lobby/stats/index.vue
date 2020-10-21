<template>
  <div class="container px-md-4 py-4 stats-page">
    <div class="row">
      <div class="col-12">
        <h4 class="mb-3 px-1 text-center" v-text="$content.stats.title"/>
        <img class="position-absolute cursor-pointer back-btn mt-3 px-0" :src="backSVG"
             @click="$router.push('/' + $route.params.id)"/>
      </div>
    </div>
    <div class="row pt-3">
      <div class="col-12">
        <div v-for="(item, key) in stats" class="person d-block">
          <h5 class="team-title">{{ key.charAt(0).toUpperCase() + key.slice(1) }}</h5>
          <table>
            <tr v-for="name in keys">
              <td v-text="name + ' sayısı:'"></td>
              <td v-text="item[name]"></td>
            </tr>
          </table>
        </div>
      </div>

      <div class="col-12 px-0 mt-5">
        <detail v-for="item in resp" :niche="resp[item.name]"/>
      </div>
    </div>
  </div>
</template>

<script>
  import backSVG from "../../../assets/svg/back.svg";
  import detail from "../detail";

  export default {
    name: "stats",
    components: {detail},
    props: ["resp", "nowDate"],
    data() {
      return {
        backSVG: backSVG,
        stats: {},
        keys: ["Lig", "Maç", "Galibiyet", "Beraberlik", "Mağlubiyet", "Attığı gol", "Yediği gol", "Averaj", "Puan", "Şampiyonluk"]
      }
    },
    methods: {
      calc() {
        let s = this, stats = {};

        $(".detail-page").each(function () {
          $(this).find("table tbody tr").each(function (i) {
            let team_name = $(this).find("td:nth-child(1)").text().toLowerCase().trim();
            if (stats[team_name] === undefined) stats[team_name] = {"Lig": 0, "Sıra": {}, "Şampiyonluk": 0};
            stats[team_name]["Lig"]++;

            if (stats[team_name]["Sıra"][i + 1] > -1) stats[team_name]["Sıra"][i + 1]++;
            else stats[team_name]["Sıra"][i + 1] = 1;

            if (stats[team_name]["Sıra"][1]) {
              stats[team_name]["Şampiyonluk"] = stats[team_name]["Sıra"][1];
            }

            let values = ["Maç", "Galibiyet", "Beraberlik", "Mağlubiyet", "Attığı gol", "Yediği gol", "Averaj", "Puan"];

            let index = 1;
            for (let key in values) {
              let item = values[key];
              index++;

              if (stats[team_name][item] === undefined) stats[team_name][item] = 0;
              stats[team_name][item] += parseInt($(this).find("td:nth-child(" + index + ")").text().toLowerCase().trim());
            }
          })
        });

        this.stats = stats;
      }
    },
    mounted() {
      setTimeout(() => this.calc(), 500);
      setTimeout(() => this.calc(), 1000);
      setTimeout(() => this.calc(), 1500);
      setTimeout(() => this.calc(), 2000);
      setTimeout(() => this.calc(), 2500);
    }
  }
</script>
