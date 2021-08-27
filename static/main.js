$(document).ready(function () {
  var countryselect = $("#countryselect");

  d3.json('/countries').then(function (data) {
    data.forEach(function (elem, i) {
      countryselect.append('<option value="' + elem.value + '">' +
        elem.label + '</option>');
    });
  });


  var width = 500;
  var height = 500;
  var padding = 60;

  var svg = d3.select("#chart").append("svg")
    .attr("width", width)
    .attr("height", height);

  var xMax, yMax, xScale, yScale, categories, colorScale;

  // var url = "https://raw.githubusercontent.com/rfordatascience/tidytuesday/master/data/2020/2020-02-18/food_consumption.csv";

  d3.json('/data').then(function (formatted_data) {
    categories = [...new Set(formatted_data.map(function (d) {
      return d.category;
    }))];

    colorScale = d3.scaleOrdinal(categories, d3.schemeSet3);

    xMax = d3.max(formatted_data, function (d) {
      return d.consumption;
    });

    yMax = d3.max(formatted_data, function (d) {
      return d.co2;
    });

    xScale = d3.scaleLinear([-10, xMax], [padding, width - padding]);

    yScale = d3.scaleLinear([-50, yMax], [height - padding, padding]);

    var xAxis = d3.axisBottom(xScale);
    var yAxis = d3.axisLeft(yScale);

    svg.append("g")
      .attr("className", "xAxis")
      .attr("transform", "translate(0, " + (height - padding) + ")")
      .call(xAxis);

    svg.append("g")
      .attr("transform", "translate(" + padding + ", 0)")
      .call(yAxis);

    svg.append("text")
      .attr("x", width / 2)
      .attr("y", height - padding + 40)
      .attr("text-anchor", "middle")
      .text("Food Consumption (kg/person/year)")

    svg.append("text")
      .attr("x", -height / 2)
      .attr("y", padding - 40)
      .attr("transform", "rotate(-90)")
      .attr("text-anchor", "middle")
      .text("CO2 Emissions (Kg CO2/person/year)")

    svg.selectAll("circle")
      .data(formatted_data)
      .join("circle")
      .attr("cx", d => xScale(d.consumption))
      .attr("cy", function (d) {
        return yScale(d.co2);
      })
      .attr("r", 5)
      .attr("opacity", 0.4)
      .style("fill", function (d) {
        return colorScale(d.category);
      });

    console.log(colorScale("Beef"))

  })

  $("#countryselect").on("change", function (event) {
    var selected_country = $("#countryselect").val();

    var t = svg.transition()
      .duration(800);

    d3.json('/data/' + selected_country).then(function (data) {

      xMax = d3.max(formatted_data, function (d) {
        return d.consumption;
      });

      yMax = d3.max(formatted_data, function (d) {
        return d.co2;
      });

      xScale = d3.scaleLinear([-10, xMax], [padding, width - padding]);

      yScale = d3.scaleLinear([-50, yMax], [height - padding, padding]);

      var xAxis = d3.axisBottom(xScale);
      var yAxis = d3.axisLeft(yScale);

      svg.select("xAxis")
        .call(function (update) {
          update.transition(t)
            .call(xAxis);
        });

      svg.selectAll("circle")
        .data(data)
        .join(function (enter) {
          enter.append("circle")
            .attr("cx", d => xScale(d.consumption))
            .attr("cy", function (d) {
              return yScale(d.co2);
            })
            .attr("r", 5)
            .attr("opacity", 0.4)
            .style("fill", function (d) {
              return colorScale(d.category);
            });
        }, function (update) {
          update.call(function (update) {
            update.transition(t)
              .attr("cx", d => xScale(d.consumption))
              .attr("cy", function (d) {
                return yScale(d.co2);
              })
              .style("fill", function (d) {
                return colorScale(d.category);
              });
          })
        }, function (exit) {
          exit.attr("fill", "#cccccc")
            .call(function (exit) {
              exit.transition(t)
                .attr("cx", d => xScale(0))
                .attr("cy", d => yScale(0))
                .remove();
            })
        })

    });
  });

  //////////////////////
  // FOR BUBBLE CHART //
  //////////////////////

  // set the dimensions and margins of the graph
  var margin = {
      top: 10,
      right: 20,
      bottom: 30,
      left: 50
    },
    width = 500 - margin.left - margin.right,
    height = 420 - margin.top - margin.bottom;

  // append the svg object to the body of the page
  var svg = d3.select("#my_dataviz")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform",
      "translate(" + margin.left + "," + margin.top + ")");

  //Read the data
  d3.csv('/data', function (data) {

    // Add X axis
    var x = d3.scaleLinear()
      .domain([0, 10000])
      .range([0, width]);
    svg.append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x));

    // Add Y axis
    var y = d3.scaleLinear()
      .domain([35, 90])
      .range([height, 0]);
    svg.append("g")
      .call(d3.axisLeft(y));

    // Add a scale for bubble size
    var z = d3.scaleLinear()
      .domain([200000, 1310000000])
      .range([1, 40]);

    // Add dots
    svg.append('g')
      .selectAll("dot")
      .data(data)
      .enter()
      .append("circle")
      .attr("cx", function (d) {
        return x(d.healthsites);
      })
      .attr("cy", function (d) {
        return y(d.healthworkers);
      })
      .attr("r", function (d) {
        return z(d.population);
      })
      .style("fill", "#69b3a2")
      .style("opacity", "0.7")
      .attr("stroke", "black")

  })
});