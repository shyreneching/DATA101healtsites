function numberWithCommas(x) {
  return x.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");
}

$(document).ready(function () {
    /////////////////////////
    // FOR PIE CHART SITES //
    /////////////////////////
  
    const pie_width = 200;
    const pie_height = 200;
    const radius = Math.min(pie_width, pie_height) / 2;

    var colorScale, inFlag = false;
  
    // Creates sources <svg> element
    var pie_sites = d3.select("#pie_sites")
      .append("svg")
      .attr("width", pie_width)
      .attr("height", pie_height)
      .append("g")
      .attr("transform", `translate(${pie_width / 2}, ${pie_height / 2})`);
  
    d3.csv('/piesitesdata').then(function (data) {

      inFlag = false

      keys = [...new Set(data.map(function(d) { return d[""]; }))];  
      colorScale = d3.scaleOrdinal(keys, d3.schemeCategory10);
  
      var tooltip = d3.select("#pie_sites")
        .append("div")
        .style("display", "none")
        .style("opacity", 0)
        .attr("class", "tooltip tooltip-piesites")
        .style("background-color", "black")
        .style("border-radius", "5px")
        .style("padding", "10px")
        .style("color", "white")

      var showTooltip = function (event,d) {
          inFlag = true
          tooltip
              .style("display", "")
              .style("opacity", 1)
              .html("<h6>" + d.data[""].toUpperCase() + 
                  "</h6>Total Count: " + numberWithCommas(d.data["total"]))
              .style("right", (window.innerWidth - event.pageX - 100) + "px")
              .style("top", (event.pageY - 200) + "px")
      }
      var moveTooltip = function (event, d) {
          if(inFlag){
              tooltip
                  .style("right", (window.innerWidth - event.pageX - 100) + "px")
                  .style("top", (event.pageY - 200) + "px")
          } else {
              showTooltip(event, d)
          }
      }
      var hideTooltip = function (event, d) {
          inFlag = false
          tooltip
              .style("opacity", 0)
              .style("display", "none")
      }
  
      var pie = d3.pie()
        .value(function (d) {return d["total"];});

      pie_sites.selectAll("arc-piesites")
        .data(pie(data))
        .join("path")
        .attr("class", "arc-piesites")
        .attr('d', d3.arc()
          .innerRadius(50)
          .outerRadius(radius - 10)
        )
        .attr('fill', function(d){ return(colorScale(d.data[""])) })
        .attr("stroke", "white")
        .style("stroke-width", "2px")
        .style("opacity", 1)
        .on("mouseover", showTooltip)
        .on("mousemove", moveTooltip)
        .on("mouseleave", hideTooltip)

      var legendG = pie_sites.selectAll(".legend") // note appending it to mySvg and not svg to make positioning easier
        .data(pie(data))
        .enter().append("g")
        .attr("transform", function(d,i){
          return "translate(" + (-10) + "," + (i * 15 - 80) + ")"; // place each legend on the right and bump each one down 15 pixels
        })
        .attr("class", "legend");   
      
      legendG.append("rect") // make a matching color rect
        .attr("width", 10)
        .attr("height", 10)
        .attr("fill", function(d, i) {
          return colorScale(d.data[""]);
        });
      
      legendG.append("text") // add the text
        .text(function(d){
          return d.value + "  " + d.data[""];
        })
        .style("font-size", 12)
        .attr("y", 10)
        .attr("x", 11);
    });
  });