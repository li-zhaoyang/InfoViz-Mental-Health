import { Component, OnInit } from '@angular/core';
import * as d3 from "d3"

@Component({
  selector: 'app-depression-sex-age',
  templateUrl: './depression-sex-age.component.html',
  styleUrls: ['./depression-sex-age.component.css']
})
export class DepressionSexAgeComponent implements OnInit {

  constructor() { }

  ngOnInit() {

        var svg = d3
      .select("svg#depression-sex-age-pie")

    responsivefy(svg)
    function responsivefy(svg) {
    // get container + svg aspect ratio
    var container = d3.select(svg.node().parentNode)
    var height = 300 
    var width = 800 
    // height = parseInt(svg.style("height"))
    var aspect = 800 / 300;
    
    var ratio =  2 / (800 / width + 300 / height)

    resize()

    d3.select(window).on("resize.svgpie", resize);

    function resize() {
      svg = d3
      .select("svg#depression-sex-age-pie")
      var targetWidth = parseInt(container.style("width")) * 0.8;
      if (targetWidth > 800) {
        width = 800
        height = 300 
        ratio = 1
      } else {
        width = targetWidth
        height = Math.round(targetWidth / aspect)
        ratio = targetWidth / 800 
      }
      svg.attr("width", width);
      svg.attr("height", height);

    // size of svg
    var marginLeft = 30 * ratio;
    var marginRight = 30 * ratio;
    var marginTop = 30 * ratio;
    var marginBottom = 30 * ratio;

    // scales and parameter for concentric circles
    var maxRadius = width / 4
    var centerX = width / 4 
    var centerY = maxRadius
    var aggloMaxNumber = 264455592.7366
    var totalNumberScale = 
      d3.scaleLinear()
        .domain([0, aggloMaxNumber])
        .range([0, maxRadius * 1.1])

    var ringAngleScale = d3
      .scaleLinear()
      .domain([0, 1])
      .range([0, Math.PI])


    var blueScale = d3.schemeBlues[9]
    var greenScale = d3.schemeGreens[9]

    var backColor = mix(blueScale[4], "#cccccc")
    var backColorG = mix(greenScale[4], "#cccccc")

    var arcWithoutStartEnd = 
      d3
        .arc()
        .innerRadius(maxRadius / 3)
        .outerRadius(maxRadius / 2)
    //svg
    svg.select("g").remove()

    var svg = d3
      .select("svg#depression-sex-age-pie")
      .attr("width", width + marginLeft + marginRight)
      .attr("height", height + marginTop + marginBottom)
      .append("g")
      .attr("width", width)
      .attr("height", height)
      .attr("transform", "translate(" + marginLeft + ", " + marginTop + ")")
    
    d3.csv("assets/depression-sex-age.csv", function(d) {
        var dd = Object()
        Object.keys(d).map(function(key, index) {
          dd[key] = Number(d[key]);
        });
        return dd
      }).then(function (data) {
        // data = data.sort(function(a, b) {return a["Age"] - b["Age"]})

        //number is prevalence number
        //total is world total population
        var bothNumberSum = 0
        var maleNumberSum = 0
        var femaleNumberSum = 0
        var bothTotalSum = 0
        var maleTotalSum = 0
        var femaleTotalSum = 0
        data.forEach(function (d, i) {
          data[i]["AggloNumber"] = (i == 0 ? d["BothNumber"] : data[i-1]["AggloNumber"] + d["BothNumber"])
          bothNumberSum += d["BothNumber"]
          maleNumberSum += d["MaleNumber"]
          femaleNumberSum += d["FemaleNumber"]
          bothTotalSum += d["BothTotal"]
          maleTotalSum += d["MaleTotal"]
          femaleTotalSum += d["FemaleTotal"]
        })

        var sumAll = Object()
        sumAll["FemaleTotal"] = femaleTotalSum
        sumAll["MaleTotal"] = maleTotalSum
        sumAll["FemaleNumber"] = femaleNumberSum
        sumAll["MaleNumber"] = maleNumberSum
        sumAll["MalePercent"] = maleNumberSum / maleTotalSum
        sumAll["FemalePercent"] = femaleNumberSum / femaleTotalSum
        data = data.sort(function(a, b) {return b["Age"] - a["Age"]})

        var ageCircle = 
          svg
            .append("g")

        var circleGroups = ageCircle.selectAll("circlewhatever")
          .data(data)
          .enter()
          .append("g")

        // each circle
        circleGroups
          .append("circle")
          .attr("r", function (d) {return totalNumberScale(d["AggloNumber"])})
          .attr("cx", centerX) 
          .attr("cy", centerY)
          .attr("fill", function (d, i) { return blueScale[8 - i]})
          .attr("stroke", "#ffffff")
          .attr("stroke-width", 2 * ratio)
          .on("mouseover", function (d, i) {changeRing(d, i,  svg)})
          .on("mouseout", function(d) {changeRing(sumAll, -1, svg)})

        // each line
        circleGroups
          .append("line")
          .attr("x1", centerX)
          .attr("y1", centerY)
          .attr("x2", function(d, i) { return centerX + totalNumberScale(d["AggloNumber"]) * Math.cos(ratioAngle(d["MaleNumber"], d["FemaleNumber"]))})
          .attr("y2", function(d, i) { return centerY - totalNumberScale(d["AggloNumber"]) * Math.sin(ratioAngle(d["MaleNumber"], d["FemaleNumber"]))})
          .attr("style", "stroke:rgb(255,255,255);stroke-width:" + 2 * ratio)

        //each right arc (female ratio in all depression prevalence)
        circleGroups
          .append("path")
          .style("fill", function (d, i) {return greenScale[8 - i]})
          .attr("d", function (d) { return generateArcInConcenter(d["AggloNumber"], 0, d["MaleNumber"], d["FemaleNumber"])(null);})
          .attr("transform", "translate(" + centerX + ", " + centerY + ")")
          .attr("stroke", "#ffffff")
          .attr("stroke-width", 2 * ratio)
          .on("mouseover", function (d, i) {changeRing(d, i, svg)})
          .on("mouseout", function(d) {changeRing(sumAll, -1, svg)})


        // dummy rectangle to make half circles
        ageCircle
          .append("rect")
          .attr("height", height - centerY + 1000)
          .attr("width", width * 2)
          .attr("x", -500)
          .attr("y", centerY) 
          .attr("fill", "#ffffff")

        var textGroups = ageCircle.selectAll("textwhatever")
          .data(data)
          .enter()
          .append("g")
          .attr("font-size", 12 * ratio)
        // age text
        textGroups
          .append("text")
          .attr("x", function(d) { return centerX + totalNumberScale(d["AggloNumber"])})
          .attr("y", function(d, i) {return 5 + (i % 2 == 0 ? centerY : centerY + 15 * ratio)})
          .attr("alignment-baseline", "hanging")
          .attr("text-anchor", "middle")
          .attr("font-weight", "bold")
          .attr("font-size", 12 * ratio)
          .text(function(d, i) {return (i == 0 || i == 8? "" : "" + (85 - i * 10) ) + (i == 1 ? "+" : "")})

        ageCircle
          .append("text")
          .attr("x", centerX - totalNumberScale(aggloMaxNumber))
          .attr("y", centerY + 40 * ratio)
          .attr("alignment-baseline", "hanging")
          .attr("text-anchor", "begin")
          .attr("font-size", 12 * ratio)
          .text("Prevalence Percentile")
        ageCircle
          .append("text")
          .attr("x", centerX)
          .attr("y", centerY + 5)
          .attr("alignment-baseline", "hanging")
          .attr("text-anchor", "middle")
          .attr("font-size", 12 * ratio)
          .attr("font-weight", "bold")
          .text("0")
        // percentile text
        textGroups
          .append("text")
          .attr("x", function(d) { return centerX - totalNumberScale(d["AggloNumber"])})
          .attr("y", function(d, i) {return 5 + (i % 2 == 0 ? centerY : centerY + 15 * ratio)})
          .attr("alignment-baseline", "hanging")
          .attr("text-anchor", "middle")
          .attr("font-weight", "bold")
          .attr("font-size", 12 * ratio)
          .text(function(d, i) {return i == 8 || i == 0? "" : d3.format(".1%")(d["AggloNumber"] / aggloMaxNumber)})

        ageCircle
          .append("text")
          .attr("x", centerX + totalNumberScale(aggloMaxNumber))
          .attr("y", centerY + 40 * ratio)
          .attr("alignment-baseline", "hanging")
          .attr("text-anchor", "end")
          .attr("font-size", 12 * ratio)
          .text("Age Groups (Years old)")
        
        ageCircle
          .append("text")
          .attr("x", centerX)
          .attr("y", centerY + 60 * ratio)
          .attr("alignment-baseline", "hanging")
          .attr("text-anchor", "middle")
          .attr("font-size", 18 * ratio)
          .text("Depression Sex Ratio and Percentile in Age Groups")
        
        ageCircle
          .append("text")
          .attr("x", centerX)
          .attr("y", centerY - 63 * ratio)
          .attr("font-size", 63 * ratio)
          .attr("font-weight", "bold")
          .attr("alignment-baseline", "unset")
          .attr("text-anchor", "middle")
          .style("pointer-events", "none")
          .attr("opacity", 0.4)
          .text("Male Female")

      


        var ring = 
          svg
            .append("g")
            .attr("transform", "translate("+ maxRadius * 2 +", 0)")
            .attr("id", "ring")
        // ring chart 
        ring
          .append("text")
          .attr("x", maxRadius)
          .attr("y", maxRadius +  60 * ratio)
          .attr("alignment-baseline", "hanging")
          .attr("text-anchor", "middle")
          .attr("font-size", 18 * ratio)
          .text("Referenced with Whole Population Sex Ratio")

        ring
          .append("path")
          .attr("class", "ring back female")
        ring
          .append("path")
          .attr("class", "ring back male")
        ring
          .append("path")
          .attr("class", "ring front female")
        ring
          .append("path")
          .attr("class", "ring male front")
        
        
        ring
          .selectAll("path.ring")
          .attr("transform", "translate(" + centerX + ", "+ maxRadius / 2+ ")")
          .attr("stroke-width", 2 * ratio)
          .attr("stroke", "#ffffff")
        ring
          .selectAll("path.front.male")
          .attr("fill", blueScale[4])
        ring
          .selectAll("path.front.female")
          .attr("fill", greenScale[4])
        ring
          .selectAll("path.back.male")
          .attr("fill", backColor)
        ring
          .selectAll("path.back.female")
          .attr("fill", backColorG)
 

        changeRing(sumAll, -1, svg)
      } )

      function mix(c1, c2) {
            var bigint = parseInt(c1.substring(1), 16);
            var r1 = (bigint >> 16) & 255;
            var g1 = (bigint >> 8) & 255;
            var b1 = bigint & 255;
            var bigint = parseInt(c2.substring(1), 16);
            var r2 = (bigint >> 16) & 255;
            var g2 = (bigint >> 8) & 255;
            var b2 = bigint & 255;
        return "#" + ((1 << 24) + (((r1+r2)/2) << 16) + (((g1+g2)/2) << 8) + Math.floor((b1+b2)/2)).toString(16).slice(1);

      }


    
      function changeRing(d, i, svg) {
        var ageGroupText = i < 0 ? "All" : (i == 0 ? "75+" : (i == 7 ? 0 : 75 - 10*i) + "-" + (85 - 10*i))
        if (i < 0) i = 4;
        var femaleRatio = d["FemaleTotal"] / (d["FemaleTotal"] + d["MaleTotal"])
        var femaleBackAngle = femaleRatio * 2 *Math.PI
        svg
          .select("g#ring path.back.female")
          .attr("d", arcWithoutStartEnd.startAngle(0).endAngle(femaleBackAngle)(null))
        svg
          .select("g#ring path.back.male")
          .attr("d", arcWithoutStartEnd.startAngle(femaleBackAngle - 2 * Math.PI).endAngle(0)(null))
        svg
          .select("g#ring path.front.female")
          .attr("d", arcWithoutStartEnd.startAngle(0).endAngle(ringAngleScale(d["FemaleNumber"] / d["FemaleTotal"]) * femaleRatio / 0.5))
          .attr("fill", greenScale[8 - i])
        svg
          .select("g#ring path.front.male")
          .attr("d", arcWithoutStartEnd.startAngle(-ringAngleScale(d["MaleNumber"] / d["MaleTotal"]) * (1-femaleRatio) / 0.5).endAngle(0))
          .attr("fill", blueScale[8 - i])
        

        svg.select("g#ring").selectAll("g").remove()

        //text in ring
        var textGroup =
          svg
            .select("g#ring")
            .append("g")
            .attr("id", "textinring")
            .attr("transform", "translate("  + (centerX)+ ", " + (maxRadius / 2 - 50 * ratio) + ")")

          var index = 0
          textGroup
            .append("text")
            .attr("id", index++)
            .attr("font-weight", "normal")
            .text("Age Group")
          textGroup
            .append("text")
            .attr("id", index++)
            .attr("font-weight", "bold")
            .text(ageGroupText)
          textGroup
            .append("text")
            .attr("id", index++)
            .attr("font-weight", "normal")
            .html("Sex Ratio of Whole")
          textGroup
            .append("text")
            .attr("id", index++)
            .attr("font-weight", "normal")
            .html("Population (Male:Female)")
          textGroup
            .append("text")
            .attr("id", index++)
            .attr("font-weight", "bold")
            .text(d3.format(".1f")((1-femaleRatio) / femaleRatio * 100) + ":100")
          textGroup
            .append("text")
            .attr("id", index++)
            .attr("font-weight", "normal")
            .text("Depression Prevalence")
          textGroup
            .append("text")
            .attr("id", index++)
            .attr("font-weight", "normal")
            .text("Male vs Female")
          textGroup
            .append("text")
            .attr("id", index++)
            .attr("font-weight", "bold")
            .text(d3.format(".1%")(d["MalePercent"]) + " vs " + d3.format(".1%")(d["FemalePercent"]))

          textGroup
            .selectAll("text")
            .attr("y", function(d) {return Number(this.id) * 13 * ratio})
            .attr("alignment-baseline", "hanging")
            .attr("text-anchor", "middle")
            .attr("font-size", 12 * ratio)
          //legend below ring
                 var legendBelowRingGroup = 
          svg
            .select("g#ring")
          .append("g")
          .attr("id", "legendbelowring")
          .attr("transform",  "translate(" + centerX + ", "+ maxRadius + ")")
        

        legendBelowRingGroup
          .append("rect")
          .attr("x", - maxRadius / 2)
          .attr("y", 20 * ratio)
          .attr("height", 12 * ratio)
          .attr("width", 12 * ratio)
          .attr("fill", blueScale[8 - i])

        legendBelowRingGroup
          .append("text")
          .attr("x", - maxRadius / 2 + 13 * ratio)
          .attr("y", 20 * ratio)
          .attr("font-size", 12 * ratio)
          .attr("alignment-baseline", "hanging")
          .attr("text-anchor", "start")
          .text("Male Prevalence")

        legendBelowRingGroup
          .append("rect")
          .attr("x", - maxRadius / 2)
          .attr("y", 40 * ratio)
          .attr("height", 12 * ratio)
          .attr("width", 12 * ratio)
          .attr("fill", backColor)
        
        legendBelowRingGroup
          .append("text")
          .attr("x", - maxRadius / 2 + 13 * ratio)
          .attr("y", 40 * ratio)
          .attr("font-size", 12 * ratio)
          .attr("alignment-baseline", "hanging")
          .attr("text-anchor", "start")
          .text("Male Poplution")

        legendBelowRingGroup
          .append("rect")
          .attr("x", 0)
          .attr("y", 20 * ratio)
          .attr("height", 12 * ratio)
          .attr("width", 12 * ratio)
          .attr("fill", greenScale[8-i])
        legendBelowRingGroup
          .append("text")
          .attr("x", 13 * ratio)
          .attr("y", 20 * ratio)
          .attr("font-size", 12 * ratio)
          .attr("alignment-baseline", "hanging")
          .attr("text-anchor", "start")
          .text("Female Prevalence")
        legendBelowRingGroup
          .append("rect")
          .attr("x", 0)
          .attr("y", 40 * ratio)
          .attr("height", 12 * ratio)
          .attr("width", 12 * ratio)
          .attr("fill", backColorG)

        legendBelowRingGroup
          .append("text")
          .attr("x", 13 * ratio)
          .attr("y", 40 * ratio)
          .attr("font-size", 12 * ratio)
          .attr("alignment-baseline", "hanging")
          .attr("text-anchor", "start")
          .text("Female Population")


      }
    
      function generateArcInConcenter(thisNum, innerNum, maleNum, femaleNum) {
        return d3
          .arc()
          .innerRadius(totalNumberScale(innerNum))
          .outerRadius(totalNumberScale(thisNum))
          .startAngle(Math.PI / 2 - ratioAngle(maleNum, femaleNum))
          .endAngle(Math.PI / 2 )

      }
      function ratioAngle(n1, n2) {
        var all = n1 + n2
        return n2 / all * Math.PI
      }
    }

  }
  }

}
