import { Component, OnInit } from '@angular/core';
import * as d3 from "d3"

@Component({
  selector: 'app-suicide-sex-scatter',
  templateUrl: './suicide-sex-scatter.component.html',
  styleUrls: ['./suicide-sex-scatter.component.css']
})
export class SuicideSexScatterComponent implements OnInit {

  constructor() { }

  ngOnInit() {

    var svg = d3
      .select("svg#depression-sex-scatter")

    responsivefy(svg)


    function responsivefy(svg) {
    // get container + svg aspect ratio
    var container = d3.select(svg.node().parentNode)
    var height = 600 
    var width = 800 
    // height = parseInt(svg.style("height"))
    var aspect = 800 / 600;
    
    var ratio =  2 / (800 / width + 600 / height)

    
    resize()

    d3.select(window).on("resize.svgscatter", resize);

    function resize() {
      svg = d3.select("svg#depression-sex-scatter")

      var targetWidth = parseInt(container.style("width")) * 0.8;
      if (targetWidth > 720) {
        width = 720 
        height = 480 
        ratio = 1
      } else {
        width = targetWidth
        height = Math.round(targetWidth / aspect)
        ratio = targetWidth / 720 
      }
        svg.attr("width", width);
        svg.attr("height", height);

    var marginLeft = 80 * ratio;
    var marginRight = 100 * ratio;
    var marginTop = 30 * ratio;
    var marginBottom = 80 * ratio;


    var scaleFemale = d3
      .scaleLinear()
      .domain([1, 9])
      .range([height, 0])
    var scaleMale = d3
      .scaleLinear()
      .domain([1, 6])
      .range([0, width])
    var scalePop = d3 
      .scaleLinear()
      // .scaleLog()
      .domain([1, 40000])
      .range([0, ratio * 30])
    
    var scaleColor = d3.schemeSet2
    var regionIndexMap = {
      "Asia":0,
      "Europe":2,
      "Africa" : 4,
      "Oceania" : 6, 
      "Americas" : 7
    }

    svg.select("g").remove()
    //svg
    svg = 
    svg
      .attr("width", width + marginLeft + marginRight)
      .attr("height", height + marginTop + marginBottom)
      .append("g")
      .attr("width", width)
      .attr("height", height)
      .attr("transform", "translate(" + marginLeft + ", " + marginTop + ")")
    



      //lengend
    var regions = Object.keys(regionIndexMap)
    var legend = 
      svg.append("g")
        .attr("id", "legend")
        .attr("x", 10 * ratio)
        .attr("y", 20 * ratio)
        .attr("transform", "translate(" + scaleMale(6.03) + ", 0)")
    legend
      .append("text")
      .text("Region")
      .attr("font-weight", "bold")
      .attr("alignment-baseline", "hanging")
      .attr("y", 5 * ratio)
      .attr("font-size", 13 * ratio)
    regions.forEach(function (d, i) {
      var legendGroup = 
      legend
        .append("g")
        .attr("transform", "translate(0, " + (i + 1.1) * 20 * ratio + ")")
      legendGroup
        .append("rect")
        .attr("height", 12 * ratio)
        .attr("width", 20 * ratio)
        .attr("fill", scaleColor[regionIndexMap[d]])
      legendGroup
        .append("text")
        .attr("x", 40 * ratio)
        .attr("alignment-baseline", "hanging")
        .style("font-size", 12 * ratio)
        .text(d)
    })
    legend
      .append("text")
      .text("Population")
      .attr("alignment-baseline", "hanging")
      .attr("y", 140 * ratio)
      .attr("font-weight", "bold")
      .attr("font-size", 13 * ratio)

    var pops = [1000000, 10000000, 100000000, 1000000000]
    pops.forEach( function(d, i) {
      var legendGroup = legend
        .append("g")
        .attr("transform", "translate(0, " + (i * 3 + 8.1)  * 20 *  ratio + ")")
      legendGroup
        .append("circle")
        .attr("r", Math.max(2, scalePop(Math.sqrt(d))))
        .attr("cx", 23 * ratio)
        .attr("fill", "#888888")
      legendGroup
        .append("text")
        .attr("alignment-baseline", "middle")
        .attr("x", 60 * ratio)
        .style("font-size", 12 * ratio)
        .text(d / 1000000 + "M")
    }) 


      // axis and  axis label
    var axisX = d3.axisBottom(scaleMale).tickSize(6 * ratio)

    svg
      .append("g")
      .style("font-size", 12 * ratio)
      .attr("transform", "translate(0, " + height + ")" )
      .attr("id", "axisX")
      .call(axisX)

    svg
      .append("text")
      .attr("x", width / 2)
      .attr("y", 30 * ratio + height)
      .attr("alignment-baseline", "hanging")
      .attr("text-anchor", "middle")
      .attr("font-size", 12 * ratio)
      .text("Male Depression Rate (%)")

    
    var axisY = d3.axisLeft(scaleFemale).tickSize(6 * ratio).tickFormat(d3.format(".2n"));

    svg
      .append("g")
      .style("font-size", 12 * ratio)
      .attr("id", "axisY")
      .call(axisY)

    svg
      .append("text")
      .attr("alignment-baseline", "baseline")
      .attr("text-anchor", "middle")
      .attr("font-size", 12 * ratio)
      .attr("transform", "translate(" + -40 * ratio + ", " + height / 2 + ") rotate(270)")
      .text("Female Depression Rate (%)")
    
    // division line x == y
    svg.append("g")
      .attr("id", "slopeline")
      .append("path")
      .attr("d", "M " + scaleMale(1) + " " + scaleFemale(1) + " L " + scaleMale(6) + " " + scaleFemale(6))
      .attr("stroke", "black")
      .attr("stroke-dasharray", "4 1")

    // text for divesion line
    svg.append("text")
      .attr("font-size", 12 * ratio)
      .attr("transform", "translate("  + (scaleMale(5.2) - 5 * ratio) + ", " + (scaleFemale(5.2) - 5 *ratio)+ ") rotate(" + (360 - Math.atan(scaleFemale(5)/scaleMale(5)) * 180 / Math.PI) + ")")
      .text("Male(%) = Female(%)")


    // div
    var div = d3
      .select("div#depression-sex-scatter-svg")
      .append("div")	
      .attr("class", "tooltip")				

      .style("opacity", 0);
      // data join
    d3
      .csv("assets/depression-sex-gdp.csv", function(d) {
        var dd = Object()
        dd["country"] = d["Country"]
        dd["pop"] = Number(d["Pop"])
        dd["male"] = Number(d["Male"])
        dd["female"] = Number(d["Female"])
        dd["region"] = d["Region"]
        return dd
      })
      .then(function (data) {
        data = data.sort(function(a, b) {return b["pop"] - a["pop"]})

        //svg.selectAll("circle").remove()

        svg
          .selectAll("circlenotexit")
          .data(data)
          .enter()
          .append("circle")
          .attr("cx", function (d) {return scaleMale(d["male"])})
          .attr("cy", function (d) {return scaleFemale(d["female"])})
          .attr("r", function(d) {return Math.max(2, scalePop(Math.sqrt(d["pop"])))})
          .attr("country", function(d) {return d["country"]})
          .attr("population", function(d) {return d["pop"]})
          .style("fill-opacity", "0.8")
          .style("fill", function(d) { return scaleColor[regionIndexMap[d["region"]]]})
          //.attr("stroke", "#dddddd")

          .on("mouseover", function(d) {
            var circle = d3
              .select(this)
              .attr("r", function(d) {return Math.max(Math.max(2, scalePop(Math.sqrt(d["pop"]))) * 1.1, Math.max(2, scalePop(Math.sqrt(d["pop"]))) + 1)})
            div.transition()
              .duration(100)
              .style("opacity", 0.8)
            var htmlStr = "Country: " + d["country"] + "</br>"
            htmlStr += "Population: " + d3.format(",")(d["pop"]) + "</br>"
            htmlStr += "Male: " + d3.format(".2%")(d["male"]/100) + "</br>"
            htmlStr += "Female: " + d3.format(".2%")(d["female"]/100) + "</br>"
            div.html(htmlStr)
              .style("border-radius", "10px")
              .style("padding", "3px 3px 3px 3px")
              .style("box-shadow", "5px 5px 3px #888888")
              .style("background-color", "#eeeeee")
              .style("opacity", 0.8)
              .style("left", (d3.event.pageX + 20) + "px")
              .style("top", (d3.event.pageY - 40 ) + "px")	
              .style("line-height", "90%")
              .style("pointer-events", "none")
          })
          .on("mouseout", function(d) {
            d3
              .select(this)
              .attr("r", function(d) {return Math.max(2, scalePop(Math.sqrt(d["pop"])))})
            div
              .transition()
              .duration(100)
              .style("opacity", 0)	
              .style("pointer-events", "none")

          })

     });
      }
    }

  }

}
