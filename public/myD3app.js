//variable containing reference to data
var games;
var positions;


// Shot Location Regions
var shot_positions = ['rscatb', 'catb', 'lscatb', 'rsrc', 'lslc', 'rscmr'
, 'cmr', 'lscmr', 'rsmr', 'lsmr', 'rsitp', 'lsitp', 'citp', 'cra'];

var selected_attrs = {"player_name":null, "season":null, "team_name":null};

var selected_teams = [];
var selected_season = 2020;
var colorsa = ["rgba(255,0,0,0.1)","rgba(0,0,255,0.1)","rgba(0,255,85,0.1)",
              "rgba(205,255,0,0.1)","rgba(255,0,255,0.1)"];
var colors = ["rgb(255,0,0)","rgb(0,0,255)","rgb(0,255,85)",
              "rgb(205,255,0)","rgb(255,0,255)"];
var team_shortcuts = {
  "POR":{name:"Portland Trail Blazers",color:"red"},
  "GSW":{name:"Golden State Warriors",color:"red"},
  "SAC":{name:"Sacramento Kings",color:"red"},
  "LAC":{name:"Los Angeles Clippers",color:"red"},
  "LAL":{name:"Los Angeles Lakers",color:"red"},
  "UTH":{name:"Utah Jazz",color:"red"},
  "PHX":{name:"Phoenix Suns",color:"red"},
  "DEN":{name:"Denver Nuggets",color:"red"},
  "OKC":{name:"Oklahoma City Thunder",color:"red"},
  "DAL":{name:"Dallas Mavericks",color:"red"},
  "SAS":{name:"San Antonio Spurs",color:"red"},
  "HOU":{name:"Houston Rockets",color:"red"},
  "NOP":{name:"New Orleans Pelicans",color:"red"},
  "MEM":{name:"Memphis Grizzlies",color:"red"},
  "MIN":{name:"Minnesota Timberwolves",color:"red"},
  "MIL":{name:"Milwaukee Bucks",color:"blue"},
  "CHI":{name:"Chicago Bulls",color:"blue"},
  "DET":{name:"Detroit Pistons",color:"blue"},
  "IND":{name:"Indiana Pacers",color:"blue"},
  "CLE":{name:"Cleveland Cavaliers",color:"blue"},
  "TOR":{name:"Toronto Raptors",color:"blue"},
  "BOS":{name:"Boston Celtics",color:"blue"},
  "BKN":{name:"Brooklyn Nets",color:"blue"},
  "NYK":{name:"New York Knicks",color:"blue"},
  "PHI":{name:"Philadelphia 76ers",color:"blue"},
  "WAS":{name:"Washington Wizards",color:"blue"},
  "CHA":{name:"Charlotte Hornets",color:"blue"},
  "ATL":{name:"Atlanta Hawks",color:"blue"},
  "ORL":{name:"Orlando Magic",color:"blue"},
  "MIA":{name:"Miami Heat",color:"blue"}
};

var position_made={};
var position_attempted={};

//D3.js canvases
var title;
var map;
var canvas;
var court;
var menu;

//D3.js svg elements
// var selectedAreaText;
var player_text;
var team_text;
var season_text;
var info_text;

d3.queue()
.defer(d3.csv, "./public/team_details_final.csv")
.defer(d3.csv, "./public/positions_2010-2019.csv")
.await(function(error, file1, file2) {
    if (error) {
        console.error('Oh dear, something went wrong: ' + error);
    }
    else {
      games = file1;
      positions = file2;
      init();
      visualization();
    }
  });

/*----------------------
INITIALIZE VISUALIZATION
----------------------*/
function init() {

  let width = screen.width;
  let height = screen.height;

  // retrieve a SVG file via d3.request, 
  // the xhr.responseXML property is a document instance
  function responseCallback (xhr) {
    d3.select("#map_div").append(function () {
            return xhr.responseXML.querySelector('svg');
        }).attr("id", "map")
        .attr("width", 652)
        .attr("height", 403)
        .attr("x", 0)
        .attr("y", 0);
    };

  //You can select the root <svg> and append it directly
  d3.request("public/USmap.svg")
    .mimeType("image/svg+xml")
    .response(responseCallback)
    .get(function(n){
        let map = d3.select("body").select("#map");
        map.selectAll("g")
                .on("click", function(){
                  mapClick(this.id);});
    });

  
  function responseCallback2 (xhr) {
    d3.select("#court_div").append(function () {
            return xhr.responseXML.querySelector('svg');
        }).attr("id", "court")
        .attr("width", width/2 - 100)
        .attr("height", height / 2 - 100)
        .attr("x", width/2)
        .attr("y", height / 2);
    };
  d3.request("public/half_court.svg")
    .mimeType("image/svg+xml")
    .response(responseCallback2)
    .get(function(n){
        let court = d3.select("body").select("#court");
        court.selectAll("path").style("stroke", "1").on("click", function(){
          courtClick(this);});
    });

  //d3 canvases for svg elements

  menu = d3.select("#menu_div").append("svg")
    .attr("width",d3.select("#menu_div").node().clientWidth)
    .attr("height",d3.select("#menu_div").node().clientHeight);
  
  title = d3.select("#title_div").append("svg")
    .attr("width",d3.select("#title_div").node().clientWidth)
    .attr("height",d3.select("#title_div").node().clientHeight);
  //init selections
  for (let index = 0; index < shot_positions.length; index++) {
    position_made[shot_positions[index]] = 0;
    position_attempted[shot_positions[index]] = 0;
  }
  drawTitle();
}


/*----------------------
BEGINNING OF VISUALIZATION
----------------------*/
function visualization() {

  drawMenu();

  drawSpiderChart();

  drawHalfCourt();

}

/*----------------------
TEXT INFORMATION
----------------------*/
function drawTitle(){
  d3.select("#title_div").select("svg").append("text")
         .attrs({dx: 15, dy: 40, class: "title", id:"title_text"})
         .text("NBA Team Stats and Player/Team/Season Shot Position Field Goal Percentage Vizualization");

}













function drawMenu(){

  menu.remove()
  var select = d3.select("#menu_div")
    .append('select')
      .attr('id','select_player')
      .on('change',onchange_player)

  var player_options = select
    .selectAll('option')
    .data(d3.map(positions, function(d){return d.player_name;}).keys().sort(d3.ascending)).enter()
    .append('option')
      .text(function (d) { return d; })
      .attr("value", function (d) { return d; });
 
  
  function onchange_player() {
    selectValue = d3.select('#select_player').property('value');
    selected_attrs["player_name"] = selectValue;
    drawHalfCourt();
    resetFilter();
    resetText();

  };

  var select = d3.select("#menu_div")
    .append('select')
      .attr('id','select_team')
      .on('change',onchange_team)

  var team_options = select
    .selectAll('option')
    .data(d3.map(positions, function(d){return d.team_name;}).keys().sort(d3.ascending)).enter()
    .append('option')
      .text(function (d) { return d; })
      .attr("value", function (d) { return d; });

  function onchange_team() {
    selectValue = d3.select('#select_team').property('value');
    selected_attrs["team_name"] = selectValue;
    drawHalfCourt();
    resetFilter();
    resetText();
  };

  var select = d3.select("#menu_div")
    .append('select')
      .attr('id','select_season')
      .on('change',onchange_season)

  var season_options = select
    .selectAll('option')
    .data(d3.map(positions, function(d){return d.season;}).keys().sort(d3.ascending)).enter()
    .append('option')
      .text(function (d) { return d; })
      .attr("value", function (d) { return d; });

  function onchange_season() {
    selectValue = d3.select('#select_season').property('value');
    selected_attrs["season"] = selectValue;
    drawHalfCourt();
    resetFilter();
    resetText();
  };


  d3.select("#menu_div").append("button").text("Reset Player")
                .attr("id", "player_reset").classed("Button", true)
                .on("click", function(){selected_attrs['player_name'] = null; drawHalfCourt();resetFilter();});
  d3.select("#menu_div").append("button").text("Reset Team")
                .attr("id", "team_reset").classed("Button", true)
                .on("click", function(){selected_attrs['team_name'] = null; drawHalfCourt();resetFilter();});
  d3.select("#menu_div").append("button").text("Reset Season")
                .attr("id", "season_reset").classed("Button", true)
                .on("click", function(){selected_attrs['season'] = null; drawHalfCourt();resetFilter();});

  


  player_text = d3.select("#menu_div").append("text")
         .attrs({dx: 100, dy: 50, class: "subline", id:"player_name_text"})
         .text(function (d) { return "Selected Player:" + selected_attrs["player_name"] });
  team_text = d3.select("#menu_div").append("text")
         .attrs({dx: 100, dy: 50, class: "subline", id:"team_name_text"})
         .text(function (d) { return "Selected Team:" + selected_attrs["team_name"] });
  season_text = d3.select("#menu_div").append("text")
         .attrs({dx: 100, dy: 50, class: "subline", id:"season_text"})
         .text(function (d) { return "Selected Season:" + selected_attrs["season"] });

  textt = getCourtText();
  
  info_text = d3.select("#menu_div").append("text")
         .attrs({dx: 100, dy: 50, class: "my_text", id:"court_info_text"})
         .text(textt);


  
}


/*----------------------
BAR CHART
----------------------*/
function drawSpiderChart(){

  d3.select("#spider_div").selectAll("canvas").remove();

  canvas = d3.select('#spider_div').append('canvas').attr('width', 500).attr('height', 450);
  var context = canvas.node().getContext('2d');

  let filtered_data = games.filter(function(d){
        if( d.season == selected_season && selected_teams.includes(d.team_name))
        { 
            return d;
        }
  });



  let my_datasets = [];
  for (let index = 0; index < selected_teams.length; index++) {
    let filtered_data = games.filter(function(d){
      if( d.season == selected_season && selected_teams[index] == d.team)
      { 
          return d;
      }
    });
    console.log(filtered_data);
    let this_team = {
      label: selected_teams[index],
      data:[filtered_data[0].AST,filtered_data[0].BLK,filtered_data[0].PTS,
            filtered_data[0].REB,filtered_data[0].STL,filtered_data[0].TOV,],
      fill: true,
      backgroundColor: colorsa[index],
      borderColor: colors[index],
    };
    my_datasets.push(this_team);
  }
  let radarChart = new Chart(context, {
    type: "radar",
    data: {
      datasets:my_datasets,
      labels:["Assistances", "Blocks", "Points", "Rebounds", "Steals", "Turnovers"]
    },
    options: {
        maintainAspectRatio: false,
    }
});
}

/*----------------------
HALF COURT
----------------------*/
function drawHalfCourt(){
    position_made = {};
    position_attempted = {};
    for (let index = 0; index < shot_positions.length; index++) {
      position_made[shot_positions[index]] = 0;
      position_attempted[shot_positions[index]] = 0;
    }

    let fl = selected_attrs["player_name"] == null 
          && selected_attrs["team_name"] == null 
          && selected_attrs["season"] == null;


    for (let index = 0; index < positions.length; index++) {
      let flag = true;
      if(selected_attrs["player_name"] != null){
        if(positions[index].player_name != selected_attrs["player_name"]) flag = false;
      }
      if(selected_attrs["season"] != null){
        if(positions[index].season != selected_attrs["season"]) flag = false;
      }
      if(selected_attrs["team_name"] != null){
        if(positions[index].team_name != selected_attrs["team_name"]) flag = false;
      } 

      if(flag && !fl){
        
        position_attempted[positions[index].position] += 1;
        if(positions[index].made_flag == "1"){
          position_made[positions[index].position] += 1;
        }  
      }
    }
    
    resetText();
    if(fl){
      for (let index = 0; index < shot_positions.length; index++) {
        let key = shot_positions[index];
        d3.select("#court_div").select("#" + key).style("fill", "none").style("stroke", "none").style("opacity", "none");
      }
    }
    else{
      for (let index = 0; index < shot_positions.length; index++) {
        let key = shot_positions[index];
        let perc = position_made[key] / position_attempted[key];
        let colors = ["#ff0000", '#ffe135', '#66ff00'];
        let i = 0;
        // if (opc > 0.38) i = 1
        // if (opc > 0.47) i = 2
        let opc = 0;
        if (perc <= 0.38){
          opc = 1.2 - perc;
        }
        if (perc > 0.38){
          i = 1;
          opc = 1.3 - perc;
        } 
        if (perc > 0.47){
          i = 2;
          opc = 1.4 - perc;
        }
        d3.select("body").select("#" + key).style('fill',colors[i]).style('stroke', '#000').style('opacity', opc)
      }

      // let key = shot_positions[index];
      //   let perc = position_made[key] / position_attempted[key];
      //   let colors = ["#ff0000", '#ffe135', '#66ff00'];
      //   let i = 0;
      //   let opc = 0;
      //   if (perc <= 0.38){
      //     opc = perc / 0.38;
      //   }
      //   if (opc > 0.38){
      //     i = 1;
      //     opc = (perc - 0.38) / 0.09;
      //   } 
      //   if (opc > 0.47){
      //     i = 2;
      //     opc = (perc - 0.43) / 0.40;
      //   }
    }
    
}


/*----------------------
INTERACTION
----------------------*/
function mapClick(id){
  
  if(selected_teams.includes(team_shortcuts[id].name)){
    selected_teams = selected_teams.filter(function(value, index, array){
      if(value != team_shortcuts[id].name){
        return value;
      }
    })
    // d3.select("body").select("#" + id).select("circle").style("fill", "green");
  }
  else{
    if(selected_teams.length == 5) return;
    selected_teams.push(team_shortcuts[id].name);
    // d3.select("body").select("#" + id).select("circle").style("fill", team_shortcuts[id].color);
  }
  drawSpiderChart();
}

function resetFilter(){
  
  player_text.text(function (d) { return "Selected Player:" + selected_attrs["player_name"] });
  team_text.text(function (d) { return "Selected Team:" + selected_attrs["team_name"] });
  season_text.text(function (d) { return "Selected Season:" + selected_attrs["season"] });
}

function resetText(){
  textt = getCourtText();
  info_text.text(textt);

}

function getCourtText(){
  var result = "";
  for (let index = 0; index < shot_positions.length; index++) {
    let made = position_made[shot_positions[index]];
    let attempted = position_attempted[shot_positions[index]];
    if(attempted == 0){
      result += (index + 1).toString() + ": 0/0, 0%";
    }
    else{
      result += (index + 1).toString() + ": " + made.toString() + "/" + 
                attempted.toString() + ", " + (Math.round((made/attempted * 100) * 100) / 100).toString() + "%";

    }
    if(index + 1 != shot_positions.length){
      result += "; "
    }
    
  }
  return result;
}


