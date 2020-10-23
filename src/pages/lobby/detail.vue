<template>
  <div :class="'container px-md-4 py-4 detail-page ' + divId">
    <div class="row">
      <div class="col-12">
        <h4 class="mb-3 px-1 text-center" :class="{'pt-0 pb-2': niche}" v-text="league"></h4>
        <img class="position-absolute cursor-pointer back-btn mt-3 px-0" :src="backSVG"
             @click="$router.push('/' + id)" v-show="!niche"/>
        <img class="position-absolute px-2 cursor-pointer lock-btn" :src="lockSVG" @click="lockFunc()"
             v-if="locked !== lockable.join('-')" v-show="!niche"/>
      </div>
    </div>
    <div class="row" :class="{'pt-3': !niche}">
      <div class="col-12 mb-0 px-0">

        <table class="table mb-0">
          <thead>
          <tr>
            <th></th>
            <th v-for="item in $content.detail.table">{{ item }}</th>
          </tr>
          </thead>
          <tbody>
          <tr
            v-for="i in t_sort"
            :id="'team_'+i"
            :t="teams[ parseInt(i) ]"
            :to="values.o[ parseInt(i) ]"
            :ta="values.a[ parseInt(i) ]"
            :ty="values.y[ parseInt(i) ]"
            :tav="values.a[ parseInt(i) ] - values.y[ parseInt(i) ]"
            :tp="values.p[ parseInt(i) ]"
          >
            <td v-text="teams[ parseInt(i) ]"></td>
            <td v-text="values.o[ parseInt(i) ]"></td>
            <td v-text="values.g[ parseInt(i) ]"></td>
            <td v-text="values.b[ parseInt(i) ]"></td>
            <td v-text="values.m[ parseInt(i) ]"></td>
            <td v-text="values.a[ parseInt(i) ]"></td>
            <td v-text="values.y[ parseInt(i) ]"></td>
            <td v-text="values.av[ parseInt(i) ]"></td>
            <td v-text="values.p[ parseInt(i) ]"></td>
          </tr>
          </tbody>
        </table>
      </div>

      <div v-show="!niche">
        <div class="col-12 matches p-0" :class="{'two':index, 'one':!index}" v-for="(time, index) in matches">
          <h3 class="p-2 mx-auto mt-5 mb-3 text-center font-weight-normal"
              v-text="index ? $content.detail.i_yari: $content.detail.i_yari"></h3>
          <div class="py-1 match flex-center" v-for="(item, i) in time">
                <span
                  class="my-auto team-col text-right"
                  v-text="teams[item[0]]"
                ></span>
            <div class="score flex-center" :id="item[0] + '_' + item[1]">
              <input
                type="number"
                class="form-control text-center in score-input"
                :readonly="lockCtrl(i+(time.length*index))"
                @keyup="getScores()"
                @focus="onfocus = true"
                @blur="onfocus = false"
              /><strong>:</strong><input
              type="number"
              class="form-control text-center out score-input"
              :readonly="lockCtrl(i+(time.length*index))"
              @keyup="getScores()"
              @focus="onfocus = true"
              @blur="onfocus = false"
            />
            </div>
            <span class="my-auto team-col" v-text="teams[item[1]]"></span>
          </div>
        </div>
        <div class="col-12 my-3 text-right timer pt-4 px-4 pb-0">
          {{ $content.detail.created + created_at }}<br/>{{ $content.detail.updated + updated_at }}
          <div
            class="text-danger text-left float-left position-absolute h-100 d-flex align-items-center cursor-pointer del pt-4">
            <img class="mx-2" :src="trashSVG" @click="del()" v-if="(matches[0].length * 2) > locked.split('-').length"/>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import backSVG from "../../assets/svg/back.svg";
  import lockSVG from "../../assets/svg/lock.svg";
  import trashSVG from "../../assets/svg/trash.svg";

  export default {
    name: "detail.vue",
    props: ["resp", "nowDate", "niche"],
    data() {
      return {
        backSVG: backSVG,
        lockSVG: lockSVG,
        trashSVG: trashSVG,
        name: "",
        league: "",
        teams: [],
        values: {},
        scores: [],
        t_sort: [],
        time1: false,
        updated_at: "",
        created_at: "",
        up: false,
        lockable: [],
        locked: "",
        onfocus: false,
        changed: false
      }
    },
    methods: {
      reData() {
        this.$emit("val", Math.floor(Math.random() * 100000))
      },
      sort: function () {
        let s = this, points = {}, samePoints = {}, same_index = [], mac = [], sort = [], inde = 0, ip = 0, i = 0,
          x = -1, rArr = {}, ind = 0;

        for (let item in s.values.p) {
          let point = s.values.p[item];
          points[point] += "-" + item;
          points[point] = points[point].replace("undefined-", "");
        }

        for (let item in points) if (points[item].includes("-")) same_index.push(points[item]);

        for (let item in same_index) {
          let ilks = [],
            ritem = same_index[item].split("-");
          for (let ilk in ritem) {
            for (let son in ritem) {
              if (ritem[ilk] !== ritem[son] && !ilks.includes(ritem[son])) {
                mac.push(ritem[ilk] + "_" + ritem[son]);
                mac.push(ritem[son] + "_" + ritem[ilk]);
              }
            }
            ilks.push(ritem[ilk]);
          }
        }

        let say = 0;

        for (let item in mac) {
          let goal_i = parseInt($(s.divIdClass + "#" + mac[item]).find(".in").val()),
            goal_o = parseInt($(s.divIdClass + "#" + mac[item]).find(".out").val());

          if (goal_i > -1 && goal_o > -1) {
            // GET ID
            let id_i = parseInt(mac[item].split("_")[0]),
              id_o = parseInt(mac[item].split("_")[1]);

            if (say === 0) {
              s.values.vs_p[id_i] = 0;
              s.values.vs_av[id_i] = 0;
              s.values.vs_a[id_i] = 0;

              s.values.vs_p[id_o] = 0;
              s.values.vs_av[id_o] = 0;
              s.values.vs_a[id_o] = 0;
            }

            if (goal_i > goal_o) s.values.vs_p[id_i] += 3;
            if (goal_i < goal_o) s.values.vs_p[id_o] += 3;
            if (goal_i === goal_o) {
              s.values.vs_p[id_i]++;
              s.values.vs_p[id_o]++;
            }

            s.values.vs_av[id_i] += goal_i - goal_o;
            s.values.vs_av[id_o] += goal_o - goal_i;

            s.values.vs_a[id_i] += goal_i;
            s.values.vs_a[id_o] += goal_o;

            say++;
          }
        }

        let vals = [], looks = ["p", "vs_p", "vs_av", "vs_a", "av", "a"];

        for (let item in s.teams) {
          let text = "";

          for (let look_val in looks) {
            let look = looks[look_val];
            let val = s.values[look][item] + 500;
            text += val;
          }
          text += "." + item;
          vals.push(text);
        }

        vals.sort().reverse();

        for (let v in vals) sort.push(vals[v].split(".")[1]);

        s.t_sort = sort;

        this.$emit("worked", s.name);
      },
      lockCtrl: function (i) {
        let ctrl = "-" + this.locked + "-";
        return ctrl.includes("-" + i + "-");
      },
      del: function () {
        let ok = confirm(this.league[0].toUpperCase() + this.league.slice(1) + " silinsin mi?");
        if (ok == true) {
          this.$emit("load", false);
          this.$axios.delete(this.$api + this.$route.params.id + "/" + this.name + ".json").then((obj) => {
            this.$router.push("/" + this.id);
            this.$emit("reload", Math.floor(Math.random() * 100000));
            this.$router.push("/" + this.id);
          });
        }
      },
      getScores: function () {
        this.changed = true;
        let scores = [], items = document.getElementsByClassName("match");
        for (let i = 0; i < items.length; i++) {
          scores.push(items[i].getElementsByTagName("input")[0].value + "-" + items[i].getElementsByTagName("input")[1].value);
        }
        this.scores = scores;
      },
      update: function (locker = false) {
        let isGoing = true, anyMissing = false;

        $(this.divIdClass + ".score").each(function () {
          let writed = 0;
          $(this).find("input").each(function () {
            if ($(this).val()) writed++;
          });
          if (writed === 1) anyMissing = true;
        });

        if (anyMissing || this.onfocus) isGoing = false;

        if (isGoing || locker) {
          if (this.changed || locker) {
            this.$axios.put(this.$api + this.id + "/" + this.name + ".json", {
              name: this.name,
              league: this.league,
              scores: this.scores,
              teams: this.teams,
              match: this.time1,
              locked: this.locked ? this.locked : "ajans123",
              updated_at: this.nowDate,
              created_at: this.created_at,
            }).then((obj) => {
              this.changed = false;
              this.updated_at = obj.data.updated_at;
              this.reData(this);
            });
          } else this.reData(this);
        }

      },
      lockFunc() {
        this.locked = this.lockable.join('-');
        this.update(true);
      },
      letScores(val) {
        let matches = [], i = 0, arr = "[";

        for (let match in this.matches[0]) matches.push(this.matches[0][match]);
        for (let match in this.matches[1]) matches.push(this.matches[1][match]);

        for (let item in this.teams) arr += "0,";
        arr = arr.substr(0, arr.length - 1);
        arr += "]";

        this.values = {
          o: eval(arr),
          g: eval(arr),
          b: eval(arr),
          m: eval(arr),
          a: eval(arr),
          y: eval(arr),
          p: eval(arr),
          vs_p: eval(arr),
          vs_av: eval(arr),
          vs_a: eval(arr),
          av: eval(arr),
        };

        for (let match in matches) {
          try {
            let oneTeam = this.teams[matches[match][0]], twoTeam = this.teams[matches[match][1]];
            let matchObj = document.getElementsByClassName("match")[i],
              ilk = matchObj.getElementsByTagName("input")[0].value,
              son = matchObj.getElementsByTagName("input")[1].value;

            if (ilk && son) {
              this.values.o[matches[match][0]]++;
              this.values.o[matches[match][1]]++;

              this.values.a[matches[match][0]] += parseInt(ilk);
              this.values.a[matches[match][1]] += parseInt(son);

              this.values.y[matches[match][0]] += parseInt(son);
              this.values.y[matches[match][1]] += parseInt(ilk);

              this.values.av[matches[match][0]] += parseInt(ilk) - parseInt(son);
              this.values.av[matches[match][1]] += parseInt(son) - parseInt(ilk);

              if (parseInt(ilk) > parseInt(son)) {
                this.values.p[matches[match][0]] += 3;
                this.values.g[matches[match][0]]++;
                this.values.m[matches[match][1]]++;
              }
              if (parseInt(ilk) < parseInt(son)) {
                this.values.p[matches[match][1]] += 3;
                this.values.g[matches[match][1]]++;
                this.values.m[matches[match][0]]++;
              }
              if (parseInt(ilk) === parseInt(son)) {
                this.values.p[matches[match][0]] += 1;
                this.values.p[matches[match][1]] += 1;
                this.values.b[matches[match][0]]++;
                this.values.b[matches[match][1]]++;
              }

            }
            i++;
          } catch (err) {
          }
        }

        let lockable = [];
        $(this.divIdClass + ".score").each(function (index) {
          let sIn = $(this).find(".in").val(), sOut = $(this).find(".out").val();

          if (sIn && sOut) lockable.push(index);
        });
        this.lockable = lockable;

        this.sort();
      }
    },
    computed: {
      id() {
        return this.$route.params.id
      },
      league_id() {
        return this.$route.params.detail
      },
      time2() {
        let matches = [];
        for (let match in this.time1)
          matches.push([this.time1[match][1], this.time1[match][0]]);
        return matches;
      },
      matches() {
        return [this.time1, this.time2];
      },
      safe_url() {
        let url = window.location.href.split("#")[0];
        url = url.split("?")[0];
        return url;
      },
      ifLockable() {
        return this.locked !== this.lockable.join("-");
      },
      divId() {
        return Math.floor(Math.random() * 9999999)
      },
      divIdClass() {
        return "." + this.divId + " ";
      }
    },
    mounted() {
      let detailId = this.$route.params.detail;

      let data = this.niche ? this.niche : this.resp[detailId], arr = [];

      if (this.scores.toString() !== data.scores.toString()) {
        this.league = data.league;
        this.teams = data.teams;
        this.created_at = data.created_at;
        this.updated_at = data.updated_at;
        this.locked = data.locked ? data.locked : "ajans123";
        this.time1 = data.match;
        for (let i = 1; i <= parseInt(data.teams.length); i++) {
          this.t_sort.push(i - 1);
          arr.push(0);
        }

        this.scores = data.scores;

        this.name = data.name;
        this.values.o = arr;
        this.values.g = arr;
        this.values.b = arr;
        this.values.m = arr;
        this.values.a = arr;
        this.values.y = arr;
        this.values.p = arr;
        this.values.vs_p = arr;
        this.values.vs_av = arr;
        this.values.vs_a = arr;
        this.values.av = arr;

        this.$nextTick(function () {
          for (let item in data.scores) {
            if (data.scores[item].split("-").length > 1) {
              document.getElementsByClassName("score-input")[item * 2].value = data.scores[item].split("-")[0];
              document.getElementsByClassName("score-input")[item * 2 + 1].value = data.scores[item].split("-")[1];
            }
          }
          this.letScores();
        })

      }

      this.up = setInterval(this.update, 5000);

    },
    watch: {
      scores(val) {
        this.letScores(val);
      }
    },
  }
</script>
