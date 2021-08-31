$(document).ready(function () {
    /////////////////////////
    // FOR PIE CHART SITES //
    /////////////////////////
  
    const pie_width = 800;
    const pie_height = 600;
  
  
    // Creates sources <svg> element
    const pie_sites = d3.select("#pie_sites")
      .append("svg")
      .attr("width", pie_width)
      .attr("height", pie_height);
  
    d3.csv('/pie', function (data) {
      const g = pie_sites.append("g")
        .attr("transform", `translate(${pie_width / 2}, ${pie_height / 2})`);
  
      const data = [1, 2, 0.5, 1, 1.5];
  
      const radius = Math.min(pie_width, pie_height) / 2;
  
      const color = d3.scaleOrdinal(d3.schemeCategory10);
  
      // -2- Create 3 functions to show / update (when mouse move but stay on same circle) / hide the tooltip
      var tooltip = d3.select("#pie_sites")
        .append("div")
        .style("opacity", 0)
        .attr("class", "tooltip")
        .style("background-color", "black")
        .style("border-radius", "5px")
        .style("padding", "10px")
        .style("color", "white")
  
      var pie = d3.pie()
        .sort(null)
        .value(function (d) {
          return d.population;
        });
  
      var path = d3.arc()
        .outerRadius(radius - 10)
        .innerRadius(0);
  
      var label = d3.arc()
        .outerRadius(radius - 40)
        .innerRadius(radius - 40);
  
      const arc = d3
        .arc()
        .outerRadius(radius - 10)
        .innerRadius(0);
  
      const pie = d3.pie();
  
      const pied_data = pie(data);
  
      const arcs = g
        .selectAll(".arc")
        .data(pied_data)
        .join((enter) => enter.append("path").attr("class", "arc").style("stroke", "white"));
  
      arcs.attr("d", arc).style("fill", (d, i) => color(i));
  
      g.on('mouseover', function (event, d) {
        tooltip
          .transition()
          .duration(200)
        tooltip
          .style("opacity", 1)
          .html("Val: " + d)
          .style("left", (event.pageX + 20) + "px")
          .style("top", (event.pageY - 90) + "px")
  
      });
  
      g.on('mousemove', function (event, d) {
        tooltip
          .style("left", (event.pageX + 20) + "px")
          .style("top", (event.pageY - 90) + "px")
      });
  
      g.on('mouseout', function () {
        tooltip
          .transition()
          .duration(200)
          .style("opacity", 0)
      });
    });
  
  
  });