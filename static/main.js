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
    width = 700 - margin.left - margin.right,
    height = 420 - margin.top - margin.bottom;

  // append the svg object to the body of the page
  var bubble = d3.select("#my_dataviz")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform",
      "translate(" + margin.left + "," + margin.top + ")");


  //Read the data
  d3.csv('/bubblechart', function (raw_data) {
    return {
      workers: +raw_data.workers,
      sites: +raw_data.sites,
      population: +raw_data.population,
      province: raw_data.province
    };
  }).then(function (data) {

    xMax = d3.max(data, function (d) {
      return d.workers;
    });

    yMax = d3.max(data, function (d) {
      return d.sites;
    });

    xScale = d3.scaleLinear([-10, xMax], [padding, width - padding]);

    yScale = d3.scaleLinear([-50, yMax], [height - padding, padding]);


    // Add X axis
    var x = d3.scaleLinear()
      .domain([0, xMax])
      .range([0, width]);
    bubble.append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x));

    // Add Y axis
    var y = d3.scaleLinear()
      .domain([0, yMax])
      .range([height, 0]);
    bubble.append("g")
      .call(d3.axisLeft(y));

    zMax = d3.max(data, function (d) {
      return d.population;
    });
    zMin = d3.min(data, function (d) {
      return d.population;
    });
    // Add a scale for bubble size
    var z = d3.scaleLinear()
      .domain([zMin, zMax])
      .range([4, 40]);

    // Add a scale for bubble color
    var myColor = d3.scaleOrdinal()
      .domain(['BASILAN',
        'LANAO DEL SUR',
        'MAGUINDANAO',
        'SULU',
        'TAWI-TAWI',
        'ABRA',
        'APAYAO',
        'BENGUET',
        'IFUGAO',
        'KALINGA',
        'MOUNTAIN PROVINCE',
        'MARINDUQUE',
        'OCCIDENTAL MINDORO',
        'ORIENTAL MINDORO',
        'PALAWAN',
        'ROMBLON',
        'ILOCOS NORTE',
        'ILOCOS SUR',
        'LA UNION',
        'PANGASINAN',
        'BATANES',
        'CAGAYAN',
        'ISABELA',
        'NUEVA VIZCAYA',
        'QUIRINO',
        'AURORA',
        'BATAAN',
        'BULACAN',
        'NUEVA ECIJA',
        'PAMPANGA',
        'TARLAC',
        'ZAMBALES',
        'BATANGAS',
        'CAVITE',
        'LAGUNA',
        'QUEZON',
        'RIZAL',
        'CITY OF ISABELA',
        'ZAMBOANGA DEL NORTE',
        'ZAMBOANGA DEL SUR',
        'ZAMBOANGA SIBUGAY',
        'ALBAY',
        'CAMARINES NORTE',
        'CAMARINES SUR',
        'CATANDUANES',
        'MASBATE',
        'SORSOGON',
        'AKLAN',
        'ANTIQUE',
        'CAPIZ',
        'GUIMARAS',
        'ILOILO',
        'NEGROS OCCIDENTAL',
        'BOHOL',
        'CEBU',
        'NEGROS ORIENTAL',
        'SIQUIJOR',
        'BILIRAN',
        'EASTERN SAMAR',
        'LEYTE',
        'NORTHERN SAMAR',
        'SAMAR',
        'SOUTHERN LEYTE',
        'BUKIDNON',
        'CAMIGUIN',
        'LANAO DEL NORTE',
        'MISAMIS OCCIDENTAL',
        'MISAMIS ORIENTAL',
        'COMPOSTELA VALLEY',
        'DAVAO DEL NORTE',
        'DAVAO DEL SUR',
        'DAVAO OCCIDENTAL',
        'DAVAO ORIENTAL',
        'NORTH COTABATO',
        'COTABATO CITY',
        'SARANGANI',
        'SOUTH COTABATO',
        'SULTAN KUDARAT',
        'AGUSAN DEL NORTE',
        'AGUSAN DEL SUR',
        'DINAGAT ISLANDS',
        'SURIGAO DEL NORTE',
        'SURIGAO DEL SUR',
        'METROPOLITAN MANILA'
      ])
      .range(d3.schemeSet2);

    // -1- Create a tooltip div that is hidden by default:
    var tooltip = d3.select("#my_dataviz")
      .append("div")
      .style("opacity", 0)
      .attr("class", "tooltip")
      .style("background-color", "black")
      .style("border-radius", "5px")
      .style("padding", "10px")
      .style("color", "white")

    // -2- Create 3 functions to show / update (when mouse move but stay on same circle) / hide the tooltip
    var tooltip = d3.select("#my_dataviz")
      .append("div")
      .style("opacity", 0)
      .attr("class", "tooltip")
      .style("background-color", "black")
      .style("border-radius", "5px")
      .style("padding", "10px")
      .style("color", "white")

    // -2- Create 3 functions to show / update (when mouse move but stay on same circle) / hide the tooltip
    var showTooltip = function (event, d) {
      console.log(d.province);
      tooltip
        .transition()
        .duration(200)
      tooltip
        .style("opacity", 1)
        .html("Province: " + d.province +
          "<br>Health workers: " + d.workers +
          "<br>Health sites: " + d.sites +
          "<br>Population: " + d.population)
        .style("left", (event.pageX + 20) + "px")
        .style("top", (event.pageY - 90) + "px")
    }
    var moveTooltip = function (d) {
      tooltip
        .style("left", (event.pageX + 20) + "px")
        .style("top", (event.pageY - 90) + "px")
    }
    var hideTooltip = function (d) {
      tooltip
        .transition()
        .duration(200)
        .style("opacity", 0)
    }


    // Add dots
    bubble.append('g')
      .selectAll("dot")
      .data(data)
      .enter()
      .append("circle")
      .attr("class", "bubbles")
      .attr("cx", function (d) {
        // Total Health worker
        return x(d.workers);
      })
      .attr("cy", function (d) {
        // Total Ameneties
        return y(d.sites);
      })
      .attr("r", function (d) {
        return z(d.population);
      })
      .style("fill", function (d) {
        return myColor(d.province);
      })
      // -3- Trigger the functions
      .on("mouseover", showTooltip)
      .on("mousemove", moveTooltip)
      .on("mouseleave", hideTooltip)

  })

  /////////////////////////
  // FOR PIE CHART SITES //
  /////////////////////////

  // const pie_width = 800;
  // const pie_height = 600;


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