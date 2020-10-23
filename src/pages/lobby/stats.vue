<template>
  <div class="container px-md-4 py-4 stats-page">
    <div class="row">
      <div class="col-12">
        <h4 class="mb-3 px-1 text-center" v-text="$content.stats.title"/>
        <img class="position-absolute cursor-pointer back-btn mt-3 px-0" :src="backSVG"
             @click="$router.push('/' + $route.params.id)"/>
      </div>
    </div>
    <div class="row pt-2">
      <div class="col-12 px-0 mt-5 d-none">
        <detail v-for="item in resp" :niche="resp[item.name]" @worked="worked = worked.filter(x => x !== $event); worked.push($event)"/>
      </div>
      <div class="col-12">
        <div v-for="(item, key) in stats" class="person d-block">
          <h5 class="team-title">{{ key.charAt(0).toUpperCase() + key.slice(1) }}</h5>

          <div class="stars text-center">
            <img v-for="star in item['Yıldız']" class="star-img" :src="starSVG"/>
          </div>

          <div class="champs text-center">
            {{ item["Şampiyonluk"] }} Şampiyonluk
          </div>

          <table class="loaded">
            <tr v-for="name in keys">
              <td v-text="name"></td>
              <td v-text="item[name]"></td>
            </tr>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import backSVG from "../../assets/svg/back.svg";
  import starSVG from "../../assets/svg/star.svg";
  import detail from "./detail";

  export default {
    name: "stats",
    components: {detail},
    props: ["resp", "nowDate"],
    data() {
      return {
        backSVG: backSVG,
        starSVG: starSVG,
        stats: {},
        worked: [],
        keys: ["Lig", "Maç", "Galibiyet", "Beraberlik", "Mağlubiyet", "Attığı gol", "Yediği gol", "Averaj", "Puan", "Başarı"]
      }
    },
    methods: {
      calc() {
        let stats = {};

        // dom mapping
        $(".detail-page").each(function () {
          $(this).find("table tbody tr").each(function (i) {
            let team_name = $(this).find("td:nth-child(1)").text().toLowerCase().trim();
            if (stats[team_name] === undefined) stats[team_name] = {"Lig": 0, "Sıra": {}, "Şampiyonluk": 0, "Yıldız": 0};
            stats[team_name]["Lig"]++;

            if (stats[team_name]["Sıra"][i + 1] > -1) stats[team_name]["Sıra"][i + 1]++;
            else stats[team_name]["Sıra"][i + 1] = 1;

            if (stats[team_name]["Sıra"][1]) {
              stats[team_name]["Şampiyonluk"] = stats[team_name]["Sıra"][1];
              stats[team_name]["Yıldız"] = Math.floor(stats[team_name]["Şampiyonluk"] / 5);
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

        // stats mapping
        for (let key in stats) {
          let item = stats[key];
          item["Başarı"] = parseFloat(((item['Puan'] / (item['Maç'] * 3)) * 100).toFixed(1));
          item["Toplam"] = item["Şampiyonluk"] + (item["Başarı"] / 100);
        }

        // sort and publish
        this.stats = Object.fromEntries(Object.entries(stats).sort(([, a], [, b]) => b["Toplam"] - a["Toplam"]));

        this.$emit('load', true);
      }
    },
    watch: {
      worked(val) {
        if (Object.keys(this.resp).length === val.length) this.$nextTick(() => this.calc());
      }
    }
  }
</script>
