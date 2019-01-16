import { Component, OnInit } from '@angular/core';
import * as d3 from "d3"

@Component({
  selector: 'app-depression-gdp',
  templateUrl: './depression-gdp.component.html',
  styleUrls: ['./depression-gdp.component.css']
})
export class DepressionGdpComponent implements OnInit {

  constructor() { }

  ngOnInit() {
    var svg = d3
      .select("svg#depression-gdp-scatter")

    responsivefy(svg)
    function responsivefy(svg) {
    // get container + svg aspect ratio
    var container = d3.select(svg.node().parentNode)
    var height = 480 
    var width = 720 
    // height = parseInt(svg.style("height"))
    var aspect = 800 / 600;
    
    var ratio =  2 / (800 / width + 600 / height)

    resize()

    d3.select(window).on("resize.svggdp", resize);

    // get width of container and resize svg to fit it
    function resize() {
      var svg = d3
      .select("svg#depression-gdp-scatter")
      var targetWidth = parseInt(container.style("width")) * 0.8;
      if (targetWidth > 720) {
        width = 720
        height = Math.round(width / aspect)
        ratio = 1
      } else {
        width = targetWidth
        height = Math.round(targetWidth / aspect)
        ratio = targetWidth /  720
      }
        svg.attr("width", width);
        svg.attr("height", height);


    // size of svg
    var marginLeft = 80 * ratio;
    var marginRight = 80 * ratio;
    var marginTop = 30 * ratio;
    var marginBottom = 80 * ratio;
    // scales

    var scaleDepre = d3
      .scaleLinear()
      .domain([2, 6])
      .range([height, 0])
    var scaleGdp = d3
      .scaleLinear()
      .domain([1, 110000])
      .range([0, width])
    
    //color scale
    var blueHDIScale = a => a==0? "#888888" : d3.interpolateBlues((a - 0.3) * 10 /7)
    var circleRadius = Math.max(1, 3 * ratio)

    svg.select("g").remove()

    //svg
    svg = d3
      .select("svg#depression-gdp-scatter")
      .attr("width", width + marginLeft + marginRight)
      .attr("height", height + marginTop + marginBottom)
      .append("g")
      .attr("width", width)
      .attr("height", height)
      .attr("transform", "translate(" + marginLeft + ", " + marginTop + ")")

      //legend
    var hdi = [0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1]

    var legend = 
      svg.append("g")
        .attr("id", "legend")
        .attr("x", 10 * ratio)
        .attr("y", 20 * ratio)
        .attr("transform", "translate(" + scaleGdp(110000) + ", 0)")
    
    legend
      .append("text")
      .text("HDI")
      .attr("alignment-baseline", "hanging")
      .attr("font-weight", "bold")
      .attr("font-size", 13 * ratio)
    
    hdi.forEach(function (d, i) {
      var legendGroup = 
      legend
        .append("g")
        .attr("transform", "translate(0, " + (i + 1.1) * 20 * ratio + ")")
      legendGroup
        .append("circle")
        .attr("r", circleRadius)
        .attr("fill", blueHDIScale(d))
      legendGroup
        .append("text")
        .attr("x", 18 * ratio)
        .attr("alignment-baseline", "middle")
        .style("font-size", 12 * ratio)
        .text(d)
    })
    

    

      // axis and axis label
    var axisX = d3.axisBottom(scaleGdp).tickSize(6 * ratio)
    svg
      .append("g")
      .style("font-size", 12 * ratio)
      .attr("transform", "translate(0, " + height + ")" )
      .call(axisX)
    var axisY = d3.axisLeft(scaleDepre).tickSize(6 * ratio)
    svg
      .append("g")
      .style("font-size", 12 * ratio)
      .call(axisY)

    svg
      .append("text")
      .attr("x", width / 2)
      .attr("y", 30 * ratio + height)
      .attr("alignment-baseline", "hanging")
      .attr("text-anchor", "middle")
      .attr("font-size", 12 * ratio)
      .text("GDP per Capita (Nominal, US Dollar)")
    svg
      .append("text")
      .attr("alignment-baseline", "baseline")
      .attr("text-anchor", "middle")
      .attr("font-size", 12 * ratio)
      .attr("transform", "translate(" + -40 * ratio + ", " + height / 2 + ") rotate(270)")
      .text("Depression Rate (%)")


    // div

    var div = d3
      .select("div#depression-gdp-svg")
      .append("div")	
      .attr("class", "tooltip")				
      .style("opacity", 0);



      // data join
    d3
      .csv("assets/depression-sex-gdp.csv", function(d) {
        var dd = Object()
        dd["country"] = d["Country"]
        dd["pop"] = Number(d["Pop"])
        dd["gdp"] = Number(d["Gdp"])
        dd["all"] = Number(d["All"])
        dd["hdi"] = Number(d["Hdi"])
        // dd["male"] = Number(d["Male"])
        // dd["female"] = Number(d["Female"])
        return dd
      })
      .then(function (data) {
        data = data.sort(function(a, b) {return b["pop"] - a["pop"]})

        svg
          .selectAll("circle")
          .data(data)
          .enter()
          .append("circle")
          .attr("cx", function (d) {return scaleGdp(d["gdp"])})
          .attr("cy", function (d) {return scaleDepre(d["all"])})
          //.attr("r", function(d) {return Math.max(2, scaleHdi(d["hdi"]))})
          .attr("r", circleRadius)
          .attr("country", function(d) {return d["country"]})
          .attr("population", function(d) {return d["pop"]})
          .style("fill-opacity", "0.8")
          .style("fill", function(d) {return blueHDIScale(d["hdi"])})
          // .attr("stroke", "red")
          .on("mouseover", function(d) {
            var circle = d3
              .select(this)
              .attr("r", function(d) {return circleRadius + 1;})
            div.transition()
              .duration(100)
              .style("opacity", 0.99)
            var htmlStr = "Country: " + d["country"] + "</br>"
            htmlStr += "Population: " + d3.format(",")(d["pop"]) + "</br>"
            htmlStr += "Depression Rate: " + d3.format(".2%")(d["all"]/100) + "</br>"
            htmlStr += "Gdp per capita($): " + d3.format(".2f")(d["gdp"]) + "</br>"
            htmlStr += "Hdi: " + (d["hdi"]==0.0?"No Data":d3.format(".2f")(d["hdi"])) + "</br>"
            div.html(htmlStr)
              // style ref
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
              .attr("r", function(d) {return circleRadius})
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
