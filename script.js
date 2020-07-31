const router = new VueRouter({
  routes: [
    { path: "/", component: this },
    { path: "/:id", component: this },
    { path: "/:id/:league", component: this },
  ],
});

const api = "https://lig123.firebaseio.com/id/";

var app = new Vue({
  router,
  el: "#app",
  data: {
    list: {},
    name: "",
    league: "",
    teams: [],
    values: {},
    scores: [],
    t_sort: [],
    newleague: false,
    time1: false,
    load: false,
    updated_at: "",
    created_at: "",
    up: false,
    getid: false,
  },
  computed: {
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
  },
  methods: {
    go: function (link) {
      this.load = false;
      setTimeout(function () {
        window.location.href = link;
      }, 500);
    },
    goBack: function () {
      this.go(
        this.safe_url +
          "?" +
          this.$route.params.id +
          "#/" +
          this.$route.params.id
      );
    },
    goHome: function () {
      let url = window.location.href.split("#")[0];
      url = url.split("?")[0] + "?" + "#/";
      this.go(url);
    },
    join: function () {
      if (this.getid && this.getid.length > 5)
        this.go(this.safe_url + "?" + this.getid + "#/" + this.getid);
      else {
        alert("ID en az 6 karakter olmalı.");
        this.getId = false;
      }
    },
    del: function () {
      let ok = confirm(
        this.league[0].toUpperCase() +
          this.league.slice(1) +
          " ligi silinsin mi?"
      );
      if (ok == true) {
        axios
          .delete(api + this.$route.params.id + "/" + this.name + ".json")
          .then((obj) => {
            this.goBack();
          });
      }
    },
    to_string: function (item) {
      if (item) return item.toString().replace(/,/g, ", ");
      else return "";
    },
    getScores: function () {
      let scores = [],
        items = document.getElementsByClassName("match");
      for (let i = 0; i < items.length; i++)
        scores.push(
          items[i].getElementsByTagName("input")[0].value +
            "-" +
            items[i].getElementsByTagName("input")[1].value
        );
      this.scores = scores;
    },
    suffle: function (a) {
      let j, x, i;
      for (i = a.length - 1; i > 0; i--) {
        j = Math.floor(Math.random() * (i + 1));
        x = a[i];
        a[i] = a[j];
        a[j] = x;
      }
      return a;
    },
    sort: function () {
      let s = this,
        points = {},
        samePoints = {},
        same_index = [],
        mac = [],
        sort = [],
        inde = 0,
        ip = 0,
        i = 0,
        x = -1,
        rArr = {},
        ind = 0;

      for (let item in s.values.p) {
        let point = s.values.p[item];
        points[point] += "-" + item;
        points[point] = points[point].replace("undefined-", "");
      }

      for (let item in points)
        if (points[item].includes("-")) same_index.push(points[item]);

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
        let goal_i = parseInt(
            $("#" + mac[item])
              .find(".in")
              .val()
          ),
          goal_o = parseInt(
            $("#" + mac[item])
              .find(".out")
              .val()
          );

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

      let vals = [],
        looks = ["p", "vs_p", "vs_av", "vs_a", "av", "a"];

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
    },
    nowDate: function () {
      let date = new Date();
      let day = date.getDate();
      if (day < 10) day = "0" + day;
      let month = date.getMonth() + 1;
      if (month < 10) month = "0" + month;
      let hours = date.getHours();
      if (hours < 10) hours = "0" + hours;
      let minutes = date.getMinutes();
      if (minutes < 10) minutes = "0" + minutes;
      date =
        day +
        "." +
        month +
        "." +
        date.getFullYear() +
        " - " +
        hours +
        ":" +
        minutes;
      return date;
    },
    engine: function (s) {
      if (!s.$route.params.id && !s.$route.params.league) {
        if (!window.location.href.split("?")[1]) {
          this.goHome();
          return false;
        }
        s.load = true;
        return false;
      }

      let arr = [];
      if (s.$route.params.league) {
        axios
          .get(
            api + s.$route.params.id + "/" + s.$route.params.league + ".json"
          )
          .then((response) => {
            let data = response.data;
            if (s.scores.toString() !== data.scores.toString()) {
              s.league = data.league;
              s.teams = data.teams;
              s.created_at = data.created_at;
              s.updated_at = data.updated_at;
              s.time1 = data.match;
              for (let i = 1; i <= parseInt(data.teams.length); i++) {
                this.t_sort.push(i - 1);
                arr.push(0);
              }
              setTimeout(function () {
                for (let item in data.scores) {
                  if (data.scores[item].split("-").length > 1) {
                    document.getElementsByClassName("score-input")[
                      item * 2
                    ].value = data.scores[item].split("-")[0];
                    document.getElementsByClassName("score-input")[
                      item * 2 + 1
                    ].value = data.scores[item].split("-")[1];
                  }
                }
                s.scores = data.scores;
              }, 50);
              setTimeout(function () {
                s.load = true;
              }, 200);
              s.name = data.name;
              s.values.o = arr;
              s.values.a = arr;
              s.values.y = arr;
              s.values.p = arr;
              s.values.vs_p = arr;
              s.values.vs_av = arr;
              s.values.vs_a = arr;
              s.values.av = arr;
            }
          })
          .catch((error) => {
            s.league = prompt("Lig adı nedir? ... Ligi");

            if (s.league === null) {
              this.goBack();
              return;
            }

            let length = prompt("Kaç takım var? örn: 4");

            if (!(length > 0)) {
              this.goBack();
              return;
            }

            for (let i = 1; i <= parseInt(length); i++) {
              s.teams.push(prompt(i + ". Takımın adı nedir?"));
              s.t_sort.push(i - 1);
              arr.push(0);
            }
            let teams = s.teams,
              matches = [];

            for (let item in teams) {
              for (let item2 in teams) {
                if (item !== item2) {
                  let nohave = 0;
                  if (matches)
                    for (let match in matches)
                      if (
                        (matches[match][0] === item &&
                          matches[match][1] === item2) ||
                        (matches[match][0] === item2 &&
                          matches[match][1] === item)
                      )
                        nohave++;
                  if (nohave === 0) matches.push(this.suffle([item, item2]));
                }
              }
            }

            matches = s.suffle(matches);
            new_matches = [];
            match_arr = [];

            function organize(matches) {
              let del_matches = [];

              for (let item in matches) {
                let match = matches[item],
                  diff = true,
                  tiim = [];

                for (let m in match) {
                  if (match_arr.includes(match[m])) diff = false;
                  tiim.push(match[m]);
                }

                if (teams.length - match_arr.length < 2) {
                  if (
                    !match_arr.includes(tiim[0]) ||
                    !match_arr.includes(tiim[1])
                  ) {
                    diff = true;
                  }
                  match_arr = [];
                }

                if (diff) {
                  new_matches.push(match);
                  for (let tt in tiim) match_arr.push(tiim[tt]);
                } else {
                  del_matches.push(match);
                }
              }

              console.log(del_matches);

              if (del_matches.length) organize(del_matches);
            }

            organize(matches);

            matches = new_matches;

            console.log(matches);

            s.time1 = matches;
            s.load = true;
            s.created_at = s.nowDate();
            s.updated_at = s.created_at;
            let time = new Date().getTime(),
              scores = false;
            if (s.scores.length) scores = s.scores;

            axios
              .put(api + s.$route.params.id + "/" + time + ".json", {
                name: time,
                league: s.league,
                scores: scores,
                teams: s.teams,
                match: s.time1,
                updated_at: s.created_at,
                created_at: s.created_at,
              })
              .then((obj) => {
                s.name = obj.data.name;
                window.location.hash = "#/" + s.$route.params.id + "/" + s.name;
              });

            s.values.o = arr;
            s.values.a = arr;
            s.values.y = arr;
            s.values.p = arr;
            s.values.vs_p = arr;
            s.values.vs_av = arr;
            s.values.vs_a = arr;
            s.values.av = arr;
          });
      }

      if (s.$route.params.id && !s.$route.params.league) {
        axios.get(api + s.$route.params.id + ".json").then((response) => {
          let object = response.data,
            newObject = {},
            keys = [];
          for (let key in object) keys.push(key);
          for (let i = keys.length - 1; i >= 0; i--)
            newObject[keys[i]] = object[keys[i]];
          s.list = newObject;
          setTimeout(function () {
            s.load = true;
          }, 200);
        });
      }
    },
  },
  watch: {
    scores(val) {
      let matches = [],
        s = this,
        i = 0,
        arr = "[";
      for (let match in this.matches[0]) matches.push(this.matches[0][match]);
      for (let match in this.matches[1]) matches.push(this.matches[1][match]);

      for (let item in this.teams) arr += "0,";
      arr = arr.substr(0, arr.length - 1);
      arr += "]";

      this.values = {
        o: eval(arr),
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
          let oneTeam = this.teams[matches[match][0]],
            twoTeam = this.teams[matches[match][1]];
          let matchObj = document.getElementsByClassName("match")[i],
            ilk = matchObj.getElementsByTagName("input")[0].value,
            son = matchObj.getElementsByTagName("input")[1].value;

          if (ilk && son) {
            s.values.o[matches[match][0]]++;
            s.values.o[matches[match][1]]++;

            s.values.a[matches[match][0]] += parseInt(ilk);
            s.values.a[matches[match][1]] += parseInt(son);

            s.values.y[matches[match][0]] += parseInt(son);
            s.values.y[matches[match][1]] += parseInt(ilk);

            s.values.av[matches[match][0]] += parseInt(ilk) - parseInt(son);
            s.values.av[matches[match][1]] += parseInt(son) - parseInt(ilk);

            if (parseInt(ilk) > parseInt(son))
              s.values.p[matches[match][0]] += 3;
            if (parseInt(ilk) < parseInt(son))
              s.values.p[matches[match][1]] += 3;
            if (parseInt(ilk) === parseInt(son)) {
              s.values.p[matches[match][0]] += 1;
              s.values.p[matches[match][1]] += 1;
            }
          }
          i++;
        } catch (err) {}
      }

      setTimeout(this.sort, 100);

      axios
        .put(api + this.$route.params.id + "/" + s.name + ".json", {
          name: s.name,
          league: s.league,
          scores: s.scores,
          teams: s.teams,
          match: s.time1,
          updated_at: s.nowDate(),
          created_at: s.created_at,
        })
        .then((obj) => {
          s.updated_at = obj.data.updated_at;

          clearInterval(s.up);
          s.up = setInterval(function () {
            s.engine(s);
          }, 5000);
        });
    },
  },
  mounted() {
    this.engine(this);
  },
});
