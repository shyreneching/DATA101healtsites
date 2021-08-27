$(document).ready(function(){
  var countryselect = $("#countryselect");

  d3.json('/countries').then(function(data) {
    data.forEach(function(elem, i) {
      countryselect.append('<option value="'+ elem.value + '">'
          + elem.label + '</option>');
    });
  });


  var width = 500;
  var height = 500;
  var padding = 60;
  
  var svg = d3.select("#chart").append("svg")
              .attr("width", width)
              .attr("height", height);

  var xMax, yMax, xScale, yScale, categories,colorScale;
  
  // var url = "https://raw.githubusercontent.com/rfordatascience/tidytuesday/master/data/2020/2020-02-18/food_consumption.csv";
  
  d3.json('/data').then(function (formatted_data) {
    categories = [...new Set(formatted_data.map(function(d) { return d.category; }))];
  
    colorScale = d3.scaleOrdinal(categories, d3.schemeSet3);
  
    xMax = d3.max(formatted_data, function(d) {return d.consumption; });
  
    yMax = d3.max(formatted_data, function(d) { return d.co2; });
  
    xScale = d3.scaleLinear([-10, xMax], [padding, width-padding]);
  
    yScale = d3.scaleLinear([-50, yMax], [height - padding, padding]);
  
    var xAxis = d3.axisBottom(xScale);
    var yAxis = d3.axisLeft(yScale);
  
    svg.append("g")
      .attr("className","xAxis")
      .attr("transform", "translate(0, "+ (height-padding) +")")
      .call(xAxis);
  
    svg.append("g")
      .attr("transform", "translate("+ padding +", 0)")
      .call(yAxis);
  
    svg.append("text")
      .attr("x", width/2)
      .attr("y", height-padding+40)
      .attr("text-anchor", "middle")
      .text("Food Consumption (kg/person/year)")
  
    svg.append("text")
      .attr("x", -height/2)
      .attr("y", padding-40)
      .attr("transform", "rotate(-90)")
      .attr("text-anchor", "middle")
      .text("CO2 Emissions (Kg CO2/person/year)")
  
    svg.selectAll("circle")
      .data(formatted_data)
      .join("circle")
      .attr("cx", d => xScale(d.consumption))
      .attr("cy", function(d) { return yScale(d.co2); })
      .attr("r", 5)
      .attr("opacity", 0.4)
      .style("fill", function(d) {return colorScale(d.category); });
  
    console.log(colorScale("Beef"))
  
  })

  $("#countryselect").on("change", function(event) {
    var selected_country = $("#countryselect").val();

    var t = svg.transition()
                  .duration(800);

    d3.json('/data/'+selected_country).then(function(data){

      xMax = d3.max(formatted_data, function(d) {return d.consumption; });
  
      yMax = d3.max(formatted_data, function(d) { return d.co2; });
    
      xScale = d3.scaleLinear([-10, xMax], [padding, width-padding]);
    
      yScale = d3.scaleLinear([-50, yMax], [height - padding, padding]);
    
      var xAxis = d3.axisBottom(xScale);
      var yAxis = d3.axisLeft(yScale);

      svg.select("xAxis")
        .call(function(update){
          update.transition(t)
            .call(xAxis);
        });

      svg.selectAll("circle")
        .data(data)
        .join(function(enter) {
          enter.append("circle")
            .attr("cx", d => xScale(d.consumption))
            .attr("cy", function(d) { return yScale(d.co2); })
            .attr("r", 5)
            .attr("opacity", 0.4)
            .style("fill", function(d) {return colorScale(d.category); });
        }, function(update) {
          update.call(function(update) {
            update.transition(t)
              .attr("cx", d => xScale(d.consumption))
              .attr("cy", function(d) { return yScale(d.co2); })
              .style("fill", function(d) {return colorScale(d.category); });
          })
        }, function(exit) {
          exit.attr("fill", "#cccccc")
            .call(function(exit) {
              exit.transition(t)
                .attr("cx", d => xScale(0))
                .attr("cy", d => yScale(0))
                .remove();
            })
        }
      )

    });
  });

});


