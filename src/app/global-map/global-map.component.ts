import { Component, OnInit } from '@angular/core';
import * as d3 from 'd3';
import { core } from '@angular/compiler';
import { BaseType, line } from 'd3';
import { readPatchedData } from '@angular/core/src/render3/util';
//import * as d3_geo from 'type';
@Component({
  selector: 'app-global-map',
  templateUrl: './global-map.component.html',
  styleUrls: ['./global-map.component.css']
})
export class GlobalMapComponent implements OnInit {

  constructor() { }

  ngOnInit() {
    var inMap = true
    var playing = false;
    var curYear = 2016
    var selected_id = new Set();
    var COUNTRY_LIMIT = 10
    var readed_data = ""
    var readed_json = ""

    //tooltip
    var div = d3.select("body").append("div")
      .attr("class", "tooltip")
      .style("opacity", 0);

      d3.json("assets/world_110m.json").then(function (json: any) {
        readed_json = json
        d3.json("assets/map_1.json").then(function (data: any) {
          readed_data = data
          init_map_base(readed_json, readed_data)
          updateData(curYear, readed_data, readed_json)
        });
      });


    //choropleth map
    var svg = d3.select("#choropleth_map"),
      width = +svg.attr("width"),
      height = +svg.attr("height");

    //time slider
    var formatDate = d3.timeFormat("%Y");
    var margin = { right: 50, left: 50 },
      width = +svg.attr("width") - margin.left - margin.right,
      height = +svg.attr("height");

    // scale function
    var x = d3.scaleTime()
      .domain([new Date('1990'), new Date('2017')])
      .range([0, width])
      .clamp(true);

    // initial value
    //var startValue = x(new Date('1990'));
    //startingValue = new Date('1990');
    var currenYear = "1990";


    function color(num) {
      var index = Math.floor(num / 3)
      return colorRange[index > 6 ? 6 : index]
    }

    function init_map_base(json, data) {
        var projection = d3.geoMercator().fitSize([width, height], json);  //json.features[4] to fit California
        var path = d3.geoPath().projection(projection);
          svg.selectAll(".countries")
            .data(json.features)
            .enter()
            .append("path")
            .attr("d", path)
            .attr("class", "map-country-path")
            .attr("stroke", "white")
            .attr("id", function (d: any) { return "map-path-" + d.id})
            .on("mouseover", function (d: any) {
              var countries_data = d3.map()
                  for (var i = 0; i < data.length; i++) {
                    if (data[i].Year == Number(curYear)) {
                      countries_data.set(data[i].Code, data[i].DALYs);
                    }
                  }
              console.log(countries_data)
              console.log(d)
              d3.select(this).style('fill-opacity', ".5");
              //选中改变显示的透明度
              if (countries_data.get(d.id)) {
                div.transition()
                  .duration(200)
                  .style("opacity", .9);
                //显示悬浮窗
                div.html("Country:" + d.properties.name + "<br/>" + "Burden: "+ d3.format("0.3")(countries_data.get(d.id)) + "%")
                  .style("left", (d3.event.pageX) + "px")
                  .style("top", (d3.event.pageY) + "px");
              }
            })
            .on("mouseout", function (d: any) {
              d3.select(this).style('fill-opacity', '1');
              div.transition()
                .duration(500)
                .style("opacity", 0);
            })
            .on("click", function (d: any) {
              add_items_card(d.id,d.properties.name, selected_id)
            })
    }

    

    
    function updateData(curYear, data, json) {
      var countries_data = d3.map()
          for (var i = 0; i < data.length; i++) {
            if (data[i].Year == Number(curYear)) {
              countries_data.set(data[i].Code, data[i].DALYs);
            }
          }

        console.log(curYear);
        console.log(countries_data)
          //var origin_color = "";
            //.attr("fill", function(d:any){return color(countries_data.get(d.properties.name)) || color(0);})
          svg.selectAll("path.map-country-path")
            .attr("fill", function (d: any) { if (countries_data.get(d.id) > 0) { return color(countries_data.get(d.id)); } else { return "#E0E0E0"; } })

    }


    //slider input listener
    d3.select("input#slider").on("input", function () {
      curYear = this["value"]
      stop_playing()
      d3.select("span#selected-year-span").text(curYear)
      updateData(curYear, readed_data, readed_json);
    });

    //play pause listener
    var myTimer;
    d3.select("button#play-button").on("click", function() {
      if (!playing) {
        playing = true;
        d3.select(this).html("&#10074;&#10074;")
          clearInterval (myTimer);
    	    myTimer = setInterval (function() {
        	  var b= d3.select("input#slider");
            var t = (+b.property("value") + 1) % (+b.property("max") + 1);
            if (t == 0) { t = +b.property("min"); }
            b.property("value", t);
            curYear = t
            d3.select("span#selected-year-span").text(curYear)
            updateData(t, readed_data, readed_json);
        }, 500);
      } else {
        stop_playing()
      }
    });
    function stop_playing() {
      if (playing) {
        playing = false
        d3.select("button#play-button")
          .html("&#10148;")
        clearInterval(myTimer)
      }
    }



    // Define scale to sort data values into color buckets

    var colorDomain = [0, 3, 6, 9, 12, 15, 18]
    var colorRange = []
    var begin = false
    d3.schemeGreens[6].forEach(function (v, i, a) {
      if (begin) {
        begin = false
      } else {
        colorRange.push(v)
      }
    })


    var domainLength = 15
    var rangeLength = 120
    var legendDeltaDomain = 3
    var legendDeltaRange = legendDeltaDomain / domainLength * rangeLength
    var y = d3.scaleLinear()
      .domain([domainLength, 0])
      .range([0, rangeLength]);

    var yAxis = d3.axisRight(y)
      .tickValues(colorDomain);



    var g = svg
      .append("g")
      .attr("class", "key")
      .attr("transform", "translate(10, 250)")
      .call(yAxis);


    g.selectAll("rect")
      .data(colorRange.map(function (d, i) {
        return {
          y0: y(i * legendDeltaDomain),
          // y1: i < colorDomain.length ? y(colorDomain[i]) : y.range()[1],
          z: d,
          index:i
        };
      }))
      .enter()
      .append("rect")
      .attr("width", 8)
      .attr("y", function (d: any) { return d.y0 - legendDeltaRange; })
      .attr("height", function (d: any) { return legendDeltaRange })
      .style("fill", function (d: any) { return d.z; })
      .on("mouseover", function (d) {
        change_country_stroke("#555555", d.index * legendDeltaDomain, (d.index + 1) * legendDeltaDomain, readed_data)
      })
      .on("mouseout", function (d) {
        change_country_stroke("remove", d.index * legendDeltaDomain, (d.index + 1) * legendDeltaDomain, readed_data)
      })

      function change_country_stroke(color, lb, ub, data) {
        var mapGroup

        if (color != "remove") {
        mapGroup = svg
          .append("g")
          .attr("id", "legend-change-group")
        }
          for (var i = 0; i < data.length; i++) {
            if (data[i].Year == Number(curYear)) {
              if (data[i].DALYs >= lb && data[i].DALYs < ub) {
                if (color == "remove") {
                  svg.selectAll("g#legend-change-group").remove()
                } else {
                  var origin_path_selection = svg.select("path.map-country-path#map-path-" + data[i].Code)
                  if (!origin_path_selection || origin_path_selection.size() == 0) continue;
                  var d = origin_path_selection.attr("d")
                  var fill = origin_path_selection.attr("fill")
                  console.log(data[i].Code)
                  mapGroup
                    .append("path")
                    .attr("d", d)
                    .attr("stroke", color)
                    .attr("fill", fill)
                }
              }
            }
          }
      }


    svg.append("text")
      .attr("transform", "translate(10,390)")
      .text("Share of Mental Illness(%)")
      .attr("font-size", 12);

    g.select("path.domain").attr("opacity", "0")
    g.selectAll(".tick line").attr("opacity", "0");
    
    //realize deleting item 

    function remove_selected_country(d_id, selected_id) {
      d3.select("span.card-span#" + d_id).remove()
      if (!inMap) {
        d3.select("g.country-line-text#"+d_id).remove()
      }
      selected_id.delete(d_id)
      if (selected_id.size == 0) {
        remove_all_back_to_map()
      }
    }

    function remove_all_back_to_map() {
      d3.select("button#clear-selection-button").remove()
      d3.selectAll("span.card-span").remove()
      d3.select("button#switch-button").remove()
      if (!inMap) go_to_map()
      selected_id.clear()
    }
    function go_to_map() {
      inMap = true 
      // for console
      d3.select("h4#map-name").style("display", "inline")
      d3.select("h4#chart-name").style("display", "none")

      d3.select("div#map-control-div").style("display", "inline")

      d3.select("h6#chart-hover-tip").style("display", "none")

      d3.select("button#clear-selection-button").text("Clear Selection")

      d3.select(".key").attr("display", "initial");
      d3.select("#choropleth_map").attr("display", "initial");
      d3.select("#line_chart").attr("display", "none");
    }
    
    
    function add_items_card(d_id,country_name,selected_id){
        if(selected_id.size >= COUNTRY_LIMIT){
          alert("Maximum number of selected countries (" + COUNTRY_LIMIT + ") is reached. Please delete some countries before adding new ones.");
          return
        }
        console.log(selected_id.size)
        if (selected_id.size == 0) {
          d3
            .select("div#clear-button")
            .append("button")
            .attr("class","btn btn-light")
            .attr("id", "clear-selection-button")
            .text("Clear Selection")
            .on("click", function (d) {
              remove_all_back_to_map()
            })

           d3
            .select("div#switch-button-div") 
            .append("button")
            .attr("class", "btn btn-outline-dark")
            .attr("id", "switch-button")
            .text("Show Line Chart")
            .on("click", function (d) {
              if (inMap) {
                d3.select(this).text("Show Map")
                inMap = false

                //for consoles
                d3.select("h4#chart-name").style("display", "inline")
                d3.select("h4#map-name").style("display", "none")

                d3.select("div#map-control-div").style("display", "none")

                d3.select("h6#chart-hover-tip").style("display", "inline")

                d3.select("button#clear-selection-button").text("Clear Selection and Return to Map")

                // for chart and maps
                d3.select(".key").attr("display", "none");
                d3.select("#choropleth_map").attr("display", "none");
                d3.select("#line_chart").attr("display", "initial");
                draw_line_chart(selected_id);
              } else {
                d3.select(this).text("Show Line Chart")
                go_to_map()
              }
            })
            

        }
        //d3.select('#card-name').html(d_id);
        if(!selected_id.has(d_id))
        {
          selected_id.add(d_id)
          d3.select('.card-body')
            .select(".selected_item")
            .append("span")
            .attr("class","card-span")
            .style("display", "inline-block")
            .attr("id",d_id)
            .attr("background-color","grey")
            .text(country_name)
            .append("button")
            .attr("type","button")
            .attr("country", d_id)
            .attr("class","btn btn-xs btn-light close-country-button")
            .text("x")
            .on("click",function(d){
              var country_id = d3.select(this).attr("country")
              remove_selected_country(country_id, selected_id)
          })
            
            
        }
       
            
    }

    function draw_line_chart(selected_id) {
      d3.select("g#line-chart-group").remove()
      console.log(selected_id);
      //selected_id.add(data_id.id);
      d3.json("assets/map_1.json").then(function (data: any) {
        var selected_array = [];
        var selected_map = new Map();

        for (var i = 0; i < data.length; i++) {
          if (selected_id.has(data[i].Code)) {
            if (!selected_map.has(data[i].Code)) {
              console.log(selected_map.has(data[i].Code))
              console.log(data[i].Year + data[i].Code)
              selected_map.set(data[i].Code, [])
            }
            var arr = selected_map.get(data[i].Code)
            arr.push({ "Year": data[i].Year, "DALYs": data[i].DALYs , "Name": data[i].Entity});
            selected_map.set(data[i].Code, arr)
            console.log(data[i].Year + data[i].Code)
          }
        }
        var margin = { top: 30, right: 80, bottom: 30, left: 50 },
          width = 700 - margin.left - margin.right,
          height = 400 - margin.top - margin.bottom;
        var duration = 250;


        /* Scale */
        var xScale = d3.scaleLinear()
          .domain([1990, 2016])
          .range([0, width]);

        var yScale = d3.scaleLinear()
          .domain([0, 20])
          .range([height, 0]);

        var line_svg = d3.select("#line_chart")
          .attr("width", width + margin.left + margin.right)
          .attr("height", height + margin.top + margin.bottom)
          .append("g")
          .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
          .attr("id", "line-chart-group")

        draw_axis(line_svg, xScale, yScale)

        /* Add line into SVG */

        var line = d3.line()
          .x(function (d: any) { return xScale(d.Year); })
          .y(function (d: any) { return yScale(d.DALYs); });
        var lines = line_svg.append('g')
          .attr('class', 'lines');
        var color = d3.scaleOrdinal(d3.schemePaired);
        selected_map.forEach(function (v, k, map) {
          var country_line_text_group = lines
            .append("g")
            .attr("class", "country-line-text")
            .attr("id", k)
          

          
          country_line_text_group
            .append("path")
            .datum(selected_map.get(k))
            .attr("class", "line")
            .attr("d", function (d) { return line(d); })
            .attr('stroke-width', '13px')
            .attr("stroke", "#000000")
            .attr("opacity", 0)
            .attr("fill", "none")
            .on("mouseover", function (d) {
              var data_point_group = 
              country_line_text_group
                .append("g")
                .attr("class", "data-point-circles")
                .attr("id", "data-point-" + k)
               selected_map.get(k).forEach(function (d) {
                 console.log(d)
                 data_point_group
                   .append("circle")
                   .attr("class", "data-point-circle")
                   .attr("r", 3.5)
                   .attr("stroke", color(k))
                   .attr("fill", "#ffffff")
                   .attr("stroke-width", 1)
                   .attr("cx", xScale(d.Year))
                   .attr("cy", yScale(d.DALYs))
                   .on("mouseover", function () {
                      //选中改变显示的透明度
                        div.transition()
                          .duration(200)
                          .style("opacity", .9);
                        //显示悬浮窗
                        div.html("Country: " + d.Name + "<br/>Year: " + d.Year + "<br/>Share of Mental Illness in All Disease: " + d3.format("0.3")(d.DALYs) + "%")
                          .style("left", (d3.event.pageX) + "px")
                          .style("top", (d3.event.pageY) + "px");
                    })
                    .on("mouseout", function () {
                      d3.selectAll(".data-point-circles").remove()
                      //d3.select(this).style('fill-opacity', '1');
                      div.transition()
                        .duration(250)
                        .style("opacity", 0);
                    })
                   
               })
            })
            .on("mouseout", function (d) {
              if (d3.selectAll(document.elementsFromPoint(d3.event.x, d3.event.y)).filter("circle.data-point-circle").size() == 0) {
                 d3.selectAll(".data-point-circles").remove()
              }
            })


            var lines_group = 
              country_line_text_group
              .append("g")
              .attr("class", "lines-group")
              .attr("id", k)
            var arr = selected_map.get(k)
            arr.forEach(function (d, i) {
              if (i == 0) return
              lines_group
                .append("line")
                .attr("x1", xScale(arr[i-1].Year))
                .attr("y1", yScale(arr[i-1].DALYs))
                .attr("x2", xScale(arr[i].Year))
                .attr("y2", yScale(arr[i].DALYs))
                .attr("stroke", color(k))
                .attr("stroke-width", 2)
            })

          country_line_text_group
            .append("text")
            .attr("class", "line-name")
            .attr("font-size", "8px")
            .attr("alignment-baseline", "middle")
            .attr("x", xScale(selected_map.get(k)[26].Year) + 5)
            .attr("y", yScale(selected_map.get(k)[26].DALYs))
            .text(selected_map.get(k)[0].Name);

        })


        function draw_axis(line_svg, xScale, yScale) {


          /* Add Axis into SVG */
          var xAxis = d3.axisBottom(xScale);
          var yAxis = d3.axisLeft(yScale).ticks(5);

          line_svg.append("g")
            .attr("class", "x axis")
            .attr("transform", `translate(0, ${height})`)
            .call(xAxis)
            .append('text')
            .attr("y", 30)
            .attr("x", (width) / 2)
            .attr("class", "xaxis-text")
            .attr("fill", "#000")
            .text("Years");

          line_svg.append("g")
            .attr("class", "y axis")
            .call(yAxis)
            .append('text')
            .attr("y", -30)
            .attr("transform", "rotate(-90)")
            .attr("fill", "#000")
            .text("Share of Mental Illness in Total Disease Burden(%)");

        }









      });
    }
  }
}
