import { Component, OnInit } from '@angular/core';
import * as d3 from 'd3';
import { zoom, sum } from 'd3';

@Component({
  selector: 'app-age-type',
  templateUrl: './age-type.component.html',
  styleUrls: ['./age-type.component.css']
})
export class AgeTypeComponent implements OnInit {

  constructor() { }

  ngOnInit() {
    //// Buttons ////
    var dataset0, maxHeight, mode;
    var root;
    /** ******* Bubble *******  **/
    var svg2 = d3.select("#bubble-income-type")
      .attr("text-anchor", "middle")
      .style("cursor", "pointer")

    var margin2 = 20, diameter = Number(svg2.attr("height")) * 0.9;
    var width = diameter;
    var g2 = svg2.append("g")
      .attr("transform", "translate(" + Number(svg2.attr("width")) / 2 + "," + diameter / 2 + ")");
    var keys = ["Other mental disorders", "Idiopathic developmental intellectual disability", "Conduct disorder", "Attention-deficit/hyperactivity disorder", "Autism spectrum disorders", "Eating disorders", "Anxiety disorders", "Bipolar disorder", "Depressive disorders", "Schizophrenia"];
    var color2 = d3.scaleOrdinal()
      .range(["#b1d4ed", "#ffffff"]);
    // INORDER :"#ecf8b0", "#c8e9b4", "#7ac679", "#41ae76", "#1e6838", '#7cccc4', '#3fb6c3', '#2b8dbe', '#1767ac', '#081d57'
    // No ORDER: "#ecf8b0", "#7ac679",  "#c8e9b4", "#1e6838","#41ae76",  '#3fb6c3', '#7cccc4','#1767ac',  '#2b8dbe','#081d57'
    var zColor = d3.scaleOrdinal()
      .range(["#ecf8b0", "#c8e9b4", "#7ac679", "#41ae76", "#1e6838", '#7cccc4', '#3fb6c3', '#2b8dbe', '#1767ac', '#0b376c']);
    zColor.domain(keys);
    var pack = d3.pack()
      .size([diameter - margin2, diameter - margin2])
      .padding(2);

    var limitTypeMap = new Map();
    var allTypeMap = new Map();
    var incomedata = d3.json("assets/income-type.json")
    incomedata.then(function (data) {
      root = d3.hierarchy(data)
        .sum(function (d) { return d['value']; })
        .sort(function (a, b) { return b.value - a.value; });
      bubble(root);
      data['children'].forEach(element => {
        var key = element.name;
        var hi = 0, lo = 100, hii = "", loo = "";
        var i;
        element.children.forEach(ele => {
          if (allTypeMap.has(ele.name)) {
            var cur = allTypeMap.get(ele.name)
            allTypeMap.set(ele.name, cur + Number(ele.value))
          } else {
            allTypeMap.set(ele.name, Number(ele.value));
          }
          if (Number(ele.value) > hi) {
            hi = ele.value;
            hii = ele.name;
          }
          if (ele.value < lo) {
            lo = ele.value;
            loo = ele.name;
          }
        });
        limitTypeMap.set(key, [hii, loo]);
      });
      var maxV = -1
      var maxK = ""
      var minV = 200
      var minK = ""
      allTypeMap.forEach(function (v, k, map) {
        if (v > maxV) {
          maxV = v
          maxK = k
        }
        if (v < minV) {
          minV = v
          minK = k
        }
      })
      limitTypeMap.set("Type", [maxK, minK])
      d3.select("#highest").html(limitTypeMap.get("Type")[0]);
      d3.select("#lowest").html(limitTypeMap.get("Type")[1]);
    });
    // var allTopType = "", allLowType = "", allTop = 0, allLow = 100, j;
    // for (j = 0; j < allTypeMap.keys.length; j++) {
    //   if (allTypeMap.get(allTypeMap.keys[j]) > allTop) {
    //     allTopType = allTypeMap.keys[j];
    //   } 
    //   if (allTypeMap.get(allTypeMap.keys[j]) < allLow) {
    //     allLowType = allTypeMap.keys[j];
    //   }
    // }
    // console.log(allLowType, allTopType);

    var bubble = function (root0) {
      const root = root0;
      var focus = root;
      var view
      var nodes = pack(root).descendants();
      var bubbles = g2.attr("class", "bubble");

      var circle = g2.selectAll("circle").data(nodes).enter()
        .append("circle")
        .attr("class", function (d) {
          return d.parent ? d.children ? "node" : "node.node--leaf" : "node node--root";
        })
        .style("fill", function (d) {
          var cc = zColor(d.data['name']);
          return d.children ? color2(d.depth.toString()).toString() : String(cc);
        })
        .style("cursor", "pointer")
        .on("click", function (d) {
          var level = "";
          if (focus !== d && d.children) {
            level = d.data['name'];
            zoomB(d), d3.event.stopPropagation()
          }
          else if (focus !== d && !d.children && focus != d.parent) {
            level = d.parent.data['name'];
            zoomB(d.parent), d3.event.stopPropagation()
          } else {
            level = "Type"
          }
          if (level == "Low") {
            mode = "lowincome";
            dataset0 = dataset2;
            maxHeight = maxHeight2;
            setMode(mode);
          } else if (level == "High") {
            mode = "highincome";
            dataset0 = dataset3;
            maxHeight = maxHeight3;
            setMode(mode);
          } else if (level == "Lower-Middle") {
            mode = "lowermiddleincome";
            dataset0 = dataset4;
            maxHeight = maxHeight4;
            setMode(mode);
          } else if (level == "Upper-Middle") {
            mode = "uppermiddleincome";
            dataset0 = dataset5;
            maxHeight = maxHeight5;
            setMode(mode);
          } else if (level == "Type") {
            mode = "global";
            dataset0 = dataset1;
            maxHeight = maxHeight1;
            setMode(mode);
          }
          d3.select("#region").html(level == "Type" ? "Global" : level + " Income");
          d3.select("#highest").html(limitTypeMap.get(level)[0]);
          d3.select("#lowest").html(limitTypeMap.get(level)[1]);
        })
        .on("mouseover", function (d: any) {
          if (!d.children && focus.parent) {
            d3.select(this).style("fill", "#eedd68");
            var level = d.parent.data['name'];
            var type = d.data['name']
            var value = Math.round((d.value) * 10000) / 100;
            div2.transition()
              .duration(100)
              .style("opacity", .8);
            div2.html("<text style='font-size:14px'><b>" + level + " Income</b></text><br/>" + type + "<br/><text><b>" + String(value) + "%</b></text> of " + "total prevalent cases" + "<br/>")
              .style("left", (d3.event.pageX) + "px")
              .style("top", (d3.event.pageY) + "px");
          } else if (d.children && focus.parent) {
            div2.transition()
              .duration(100)
              .style("opacity", .8);
            div2.html("<text style='font-size:10px'>" + "Click to Return" + "</text>")
              .style("width", "auto")
              .style("left", (d3.event.pageX) + "px")
              .style("top", (d3.event.pageY) + "px");
          } else if (!focus.parent) {
            div2.transition()
              .duration(100)
              .style("opacity", .8);
            div2.html("<text style='font-size:10px'>" + "Click Me!" + "</text>")
              .style("width", "auto")
              .style("left", (d3.event.pageX) + "px")
              .style("top", (d3.event.pageY) + "px");
          }
        })
        .on("mousemove", function (d: any) {
          return div2.style("top", (d3.event.pageY - 10) + "px").style("left", (d3.event.pageX + 10) + "px");
        })
        .on("mouseout", function (d, i) {
          if (!d.children) {
            var cc = zColor(d.data['name']);
            d3.select(this).style("fill", String(cc));
          }
          d3.select(this)
            .attr("fill", function () { return ""; })
          // .attr("stroke-width", "0px");
          div2.transition()
            .duration(300)
            .style("opacity", 0);
        });
      var div2 = d3.select("body")
        .select(".fig2")
        .append("div")
        .attr("class", "tooltip")
        .style("opacity", 0);

      g2.selectAll("text").data(nodes).enter()
        .append("text")
        .attr("class", function (d) { return d.parent ? d.children ? "label label--node" : "label" : "label"; })
        .style("fill-opacity", function (d) { return d.parent === root ? 1 : 0.09; })
        .style("display", function (d) {
          return d.parent === root ? "inline" : "inline-block"; //:"none"
        })
        .text(function (d) {
          var t = d.data['name'];
          if (t == "Idiopathic developmental intellectual disability") return "Idiopathic intellectual";
          else if (t == "Attention-deficit/hyperactivity disorder") return "Attention/hyperactivity";
          else if (t == "Autism spectrum disorders") return "Autism spectrum";
          else return t;
        });

      svg2.on("click", function () {
        zoomB(root);
        mode = "global";
        dataset0 = dataset1;
        maxHeight = maxHeight1;
        setMode(mode);
      });
      var node = g2.selectAll("circle,text");


      zoomTo([root['x'], root['y'], root['r'] * 2 + margin2]);

      function zoomB(d) {
        // var zoom = function (d) {
        focus = d;//update focus
        var transition = d3.transition()
          .duration(d3.event.altKey ? 7500 : 750)
          .tween("zoom", function (d) {
            var i = d3.interpolateZoom(view, [focus['x'], focus['y'], focus['r'] * 2 + margin2]);
            return function (t) { zoomTo(i(t)); };
          });
        transition.selectAll(".label")
          .filter(function (d) {
            return d['parent'] === focus || (this as HTMLElement).style.display === "inline";
          })
          .style("fill-opacity", function (d) { return d['parent'] === focus ? 1 : 0.09; })
          .on("start", function (d) { if (d['parent'] === focus) (this as HTMLElement).style.display = "inline"; })
          .on("end", function (d) {
            if (d['parent'] !== focus) (this as HTMLElement).style.display = "inline-block"; //:"none"
          });

        d3.select("#reset").on("click", function () {
          d3.select("#region").html("Global");
          mode = "global";
          // initial = true;
          isSelected = new Set();
          dataset0 = dataset1;
          maxHeight = maxHeight1;
          setMode(mode);
          zoomB(root)
        });

      }

      function zoomTo(v) {
        var k = diameter / v[2]; view = v;
        node.attr("transform", function (d) {
          return "translate(" + (d['x'] - v[0]) * k + "," + (d['y'] - v[1]) * k + ")";
        });
        circle.attr("r", function (d) { return d['r'] * k; });
      }
    }
    //Set Mode For BarChart 
    function setMode(mode) {
      if (mode == "global") {
        transitionBars();
        barChart(dataset0, maxHeight);
      } else if (mode == "lowincome") {
        transitionBars();
        barChart(dataset0, maxHeight);
      } else if (mode == "highincome") {
        transitionBars();
        barChart(dataset0, maxHeight);
      } else if (mode == "lowermiddleincome") {
        transitionBars();
        barChart(dataset0, maxHeight);
      } else if (mode == "uppermiddleincome") {
        transitionBars();
        barChart(dataset0, maxHeight);
      }
    }
    /** ******* Bar Chart *******  **/
    var margin = { top: 20, left: 40, bottom: 80, right: 20 };
    var w = 1090 - margin.left - margin.right;
    var h = 500 - margin.top - margin.bottom;

    var svg = d3
      .select("#barchart-age-type")
      .attr("width", w + margin.left + margin.right)
      .attr("height", h + margin.top + margin.bottom)
      .append("g")
      .attr("transform", `translate(${margin.left}, ${margin.top})`);

    var xAxis, yAxis;

    //Load Bar Datasets
    var maxHeight1 = [];
    var dataset1 = d3.csv('assets/age-type-global.csv', function (d, i, columns) {
      var t = 0;
      var line = {};
      line['Age'] = d[columns[0]];
      for (i = 1, t = 0; i < columns.length; ++i) {
        var key = columns[i];
        var val = +d[columns[i]];
        line[key] = val;
        t += val;
      }
      maxHeight1.push(t);
      return line;
    });

    var maxHeight2 = [];
    var dataset2 = d3.csv('assets/age-type-low-income.csv', function (d, i, columns) {
      var t = 0;
      var line = {};
      line['Age'] = d[columns[0]];
      for (i = 1, t = 0; i < columns.length; ++i) {
        var key = columns[i];
        var val = +d[columns[i]];
        line[key] = val;
        t += val;
      }
      maxHeight2.push(t);
      return line;
    });
    var maxHeight3 = [];
    var dataset3 = d3.csv('assets/age-type-high-income.csv', function (d, i, columns) {
      var t = 0;
      var line = {};
      line['Age'] = d[columns[0]];
      for (i = 1, t = 0; i < columns.length; ++i) {
        var key = columns[i];
        var val = +d[columns[i]];
        line[key] = val;
        t += val;
      }
      maxHeight3.push(t);
      return line;
    });
    var maxHeight4 = [];
    var dataset4 = d3.csv('assets/age-type-low-mid-income.csv', function (d, i, columns) {
      var t = 0;
      var line = {};
      line['Age'] = d[columns[0]];
      for (i = 1, t = 0; i < columns.length; ++i) {
        var key = columns[i];
        var val = +d[columns[i]];
        line[key] = val;
        t += val;
      }
      maxHeight4.push(t);
      return line;
    });
    var maxHeight5 = [];
    var dataset5 = d3.csv('assets/age-type-high-mid-income.csv', function (d, i, columns) {
      var t = 0;
      var line = {};
      line['Age'] = d[columns[0]];
      for (i = 1, t = 0; i < columns.length; ++i) {
        var key = columns[i];
        var val = +d[columns[i]];
        line[key] = val;
        t += val;
      }
      maxHeight5.push(t);
      return line;
    });

    var stacks = d3.stack();
    var xScale = d3.scaleBand()
      .rangeRound([10, w - 120])
      .paddingInner(0.015)
      .align(0.15);
    svg.append("g")
      .attr("class", "axis-x");
    var yScale = d3.scaleLinear()
      .rangeRound([h, 0]);
    svg.append("g")
      .attr("class", "axis-y");
    svg.append("text")
      .attr("class", "y-axis-text");

    var isSelected = new Set();
    var nameLastSelected = "";
    svg.append("g")
      .attr("font-family", "helvetica")
      .attr("font-size", 12)
      .attr("text-anchor", "start")
      .selectAll("g")
      .attr("class", "legend");

    var otherBarsOpacityHover = "0.3";
    var barOpacity = "0.9";
    var barOpacityHover = "1";
    var duration = 100;


    function transitionBars() {
      var transition = svg.transition()
        .duration(750);
      var delay = function (d, i) {
        return i * 50;
      };
      transition.selectAll(".bars").delay(delay);
    }

    var initial = true;
    barChart(dataset1, maxHeight1);

    function barChart(dataset, maxHei: any[]): void {
      dataset.then(function (data) {

        // keys = data.columns.slice(1);
        xScale.domain(data.map(d => d.Age))
        yScale.domain([0, d3.max(maxHei)]).nice();

        var bars = svg//.append("g")
          .selectAll(".bars")
          .data(stacks.keys(keys).order(d3.stackOrderNone)
            .offset(d3.stackOffsetNone)(data))
        var sumValue = svg.selectAll(".sumValue")
          .data(data)

        // Update
        bars.attr("fill", d => String(zColor(d.key)))
          .selectAll("rect")
          .data(d => d)
          .transition()
          .duration(750)
          .attr("class", "bar")
          .attr("x", d => xScale(String(d.data.Age)))
          .attr("y", d => yScale(d[1]))
          .attr("height", function (d) {
            return yScale(d[0]) - yScale(d[1]);
          })

        sumValue.transition()
          .duration(750)
          .text(function (d) {
            var sumH = 0
            for (var k in d) {
              if (k == "Age") { continue; }
              sumH += Number(d[k])
            }
            return Math.round((sumH) * 10000) / 100 + "%";
          })
          .attr("x", function (d, i) {
            return xScale(String(d['Age'])) + 20;
          })
          .attr("y", function (d) {
            var sumH = 0
            for (var k in d) {
              if (k == "Age") { continue; }
              sumH += Number(d[k])
            }
            return yScale(sumH) - 10;
          })

        // Entry
        sumValue.enter()
          .append("text")
          .attr("class", "sumValue")
          .text(function (d) {
            var sumH = 0
            for (var k in d) {
              if (k == "Age") { continue; }
              sumH += Number(d[k])
            }
            return Math.round((sumH) * 10000) / 100 + "%";
          })
          .attr("x", function (d, i) {
            return xScale(String(d['Age'])) + 20;
          })
          .attr("y", function (d) {
            var sumH = 0
            for (var k in d) {
              if (k == "Age") { continue; }
              sumH += Number(d[k])
            }
            return yScale(sumH) - 10;
          })
          .attr("font-family", "sans-serif")
          .attr("font-size", "8.5px")
          .attr("fill", "gray")
          .attr("text-anchor", "middle");

        bars.enter()
          .append("g")
          .attr("class", "bars")
          .attr("id", function (d: any) {
            var k = d.key.split(" ")[0];
            k = k.replace('/', '-');
            return String(k);
          })
          .attr("fill", d => String(zColor(d.key)))
          .selectAll("rect")
          .data(d => d)
          .enter()
          .append("rect")
          .attr("class", "bar")
          .attr("x", d => xScale(String(d.data.Age)))
          .attr("y", d => yScale(d[1]))
          .attr("height", function (d) {
            return yScale(d[0]) - yScale(d[1]);
          })
          .attr("width", xScale.bandwidth())
          .on("mouseover", function (d: any) {
            var co = d3.rgb(d3.select(this).style('fill'))
            var coS = "rgb(" + (co.r - 10) + "," + (co.g - 20) + "," + (co.b - 20) + ")"
            d3.select(this)
              .attr("fill", coS)
              .attr("stroke", coS)
              .attr("stroke-width", "4px");
            var v = d[1] - d[0]
            var value = Math.round((v) * 10000) / 100
            var type = ""
            keys.forEach(element => {
              var coK = d3.rgb(String(zColor(element)))
              if (coK.r == co.r && coK.b == co.b) { type = element; }
            });
            div.transition()
              .duration(100)
              .style("opacity", .8);
            div.html("<text style='font-size:14px'>" + type + "</text><br/><text style='font-size:14px'><b>" + value + "%</b></text> of " + d.data.Age + "<br/>")
              .style("left", (d3.event.pageX) + "px")
              .style("top", (d3.event.pageY) + "px");
          })
          .on("mousemove", function () {
            return div.style("top", (d3.event.pageY - 10) + "px").style("left", (d3.event.pageX + 10) + "px");
          })
          .on("mouseout", function (d, i) {
            d3.select(this)
              .attr("fill", function () { return ""; })
              .attr("stroke-width", "0px");
            div.transition()
              .duration(300)
              .style("opacity", 0);
          });

        //  EXIT
        bars.exit()
          .transition()
          .duration(750)
          .style("opacity", 0)
          .remove();


        var div = d3.select("body")
          .select(".fig1")
          .append("div")
          .attr("class", "tooltip")
          .style("opacity", 0);

        /*Axis*/
        xAxis = d3.axisBottom(xScale);
        svg.selectAll(".axis-x")
          .attr("transform", "translate(0," + (h + 3) + ")")
          .call(xAxis)
          .selectAll("text")
          .attr("text-anchor", "start")
          .attr("transform", "rotate(45)");
        yAxis = d3.axisLeft(yScale);
        svg.selectAll(".axis-y")
          .attr("transform", "translate(" + (8) + ",0)")
          .call(yAxis);
        svg.select(".y-axis-text")
          .attr("x", -20)
          .attr("y", yScale(yScale.ticks().pop()) + 0.5)
          .attr("dy", "0.32em")
          .attr("fill", "#000")
          .attr("text-anchor", "start")
          .text("Percentage of total prevenlance(%)")
          .attr("font-size", 12)
          .attr("text-anchor", "middle")
          .attr("transform", "rotate(-90)")
          .attr("x", 0 - (h / 2))
          .attr("y", 5 - margin.left);

        //Legend
        var divlegend = d3.select("body")
          .select(".fig1")
          .append("div")
          .attr("class", "tooltip")
          .style("opacity", 0);

        var legend = svg.selectAll(".legend")
          .data(keys.slice())
          .enter()
          .append("g")
          .attr("transform", function (d, i) { return "translate(0," + i * 26 + ")"; })
          .attr("class", d => "legend-" + String(d));
        legend.each(function (d, i) {
          var k = String(d);
          var g = d3.select(this);
          var key = k.split(" ")[0].replace('/', '-');//k.replace(' ', '-');
          if (initial == true) {
            g.append("rect")
              .attr("x", w - 115)
              .attr("width", 10)
              .attr("height", 10)
              .attr("fill", String(zColor(k)));
            g.append("text")
              .attr("x", w - 101)
              .attr("y", 9.5)
              .attr("fill", "gray")
              .attr("font-size", "9.5px")
              .text(function (d: any) {
                if (d == "Idiopathic developmental intellectual disability") {
                  return "Intellectual disability "
                }
                return d
              });
          }
          g.on("mouseover", function (d) {
            if (isSelected.size == 0) {
              d3.select(this)
                .style("cursor", "pointer")
                .selectAll("text")
                .attr("fill", "black")
                .attr("font-size", "11px")
              d3.selectAll('.bars')
                .transition()
                .duration(1 * duration)
                .style('opacity', otherBarsOpacityHover)
                ;
              d3.select(String("#" + key))
                .transition()
                .duration(2 * duration)
                .delay((d, i) => i * 10000)
                .style('opacity', barOpacityHover);
              divlegend.transition()
                .duration(100)
                .style("opacity", .8);
              divlegend.html("<text style='font-size:10px'>" + "Click Me!" + "</text>")
                .style("width", "auto")
                .style("left", (d3.event.pageX)+20 + "px")
                .style("top", (d3.event.pageY)+10 + "px");
            }
          })
            .on("click", function (d) {
              var nameThisSelected = String("#" + key);
              if (isSelected.size == 0) {
                d3.selectAll('.bars')
                  .transition()
                  .duration(1 * duration)
                  .style('opacity', otherBarsOpacityHover);
              }
              if (!isSelected.has(nameThisSelected)) {
                nameLastSelected = nameThisSelected;
                isSelected.add(nameThisSelected);
                d3.select(this)
                  .style("cursor", "pointer")
                  .selectAll("text")
                  .attr("fill", "black")
                  .attr("font-size", "11px");
                d3.select(String("#" + key))
                  .style("cursor", "pointer")
                  .transition()
                  .duration(2 * duration)
                  .delay((d, i) => i * 1000)
                  .style('opacity', barOpacityHover);
              } else if (isSelected.has(nameThisSelected)) {
                d3.select(this)
                  .style("cursor", "pointer")
                  .selectAll("text")
                  .attr("fill", "gray")
                  .attr("font-size", "9.5px");
                d3.select(String("#" + key))
                  .style("cursor", "pointer")
                  .transition()
                  .style('opacity', barOpacity)
                  .duration(2 * duration)
                  .delay((d, i) => i * 1000);
                d3.select(this)
                  .transition()
                  .style("cursor", "none")
                  .duration(10 * duration)
                  .delay((d, i) => i * 1000);
                isSelected.delete(nameThisSelected);
                nameLastSelected = "";
              }
              if (isSelected.size == 0) {
                d3.selectAll(".bars")
                  .transition()
                  .style('opacity', barOpacity)
                  .duration(3 * duration)
                  .delay((d, i) => i * 10);
                d3.select(".legend")
                  .selectAll("text")
                  .attr("fill", "gray")
                  .attr("font-size", "9.5px");
              }
            })
            .on("mouseout", function (d) {
              if (isSelected.size == 0) {
                d3.selectAll(".bars")
                  .transition()
                  .style('opacity', barOpacity)
                  .duration(3 * duration)
                  .delay((d, i) => i * 10);
                d3.select(this)
                  .selectAll("text")
                  .attr("fill", "gray")
                  .attr("font-size", "9.5px");
                d3.select(this)
                  .transition()
                  .style("cursor", "none")
                  .duration(10 * duration)
                  .delay((d, i) => i * 10000);
                divlegend.transition()
                  .duration(300)
                  .style("opacity", 0);
              }
            });
        });
        initial = false;

      });

      // this.canvas();
    }
  }//End: ngOnInit


}
