var bubble_colour = '#bf5f6b';

function numberWithCommas(x) {
    return x.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");
}

$(document).ready(function(){
    var margin = {
        top: 10,
        right: 10,
        bottom: 50,
        left: 80
    },
    width = 750,
    height = 500,
    xMax, yMax, zMax, zMin, xScale, yScale, zScale, inFlag = false;

    // append the svg object to the body of the page
    var bubble = d3.select("#my_dataviz")
        .append("svg")
        .attr("width", width)
        .attr("height", height)

    var moveToProvince = function(event, d){
        d3.selectAll(".tooltip-bubble").remove();
        $("#regionname").text(d["region"])
        $("#bBack").css("display", "")

        var t = bubble.transition()
            .duration(500);

        d3.csv('/bubblechart/' + d["region"], function (raw_data) {
            return {
                workers: +raw_data.workers,
                sites: +raw_data.sites,
                population: +raw_data.population,
                region: raw_data.province
            };
        }).then(function (data) {

            inFlag = false;

            xMax = d3.max(data, function (d) {
                return d.workers;
            });

            yMax = d3.max(data, function (d) {
                return d.sites;
            });

            zMax = d3.max(data, function (d) {
                return d.population;
            });
            zMin = d3.min(data, function (d) {
                return d.population;
            });

            xScale = d3.scaleLinear([0, 1.25 * xMax], [margin.left, width - margin.right]);

            yScale = d3.scaleLinear([0, 1.25 * yMax], [height - margin.bottom, margin.top]);

            zScale = d3.scaleLinear([0.5 * zMin, 1.25 * zMax], [5, 50]);


            // Add X axis
            bubble.selectAll(".xAxis-bubble")
                .transition(t)
                .call(d3.axisBottom(xScale));

            // Add Y axis
            bubble.selectAll(".yAxis-bubble")
                .transition(t)
                .call(d3.axisLeft(yScale));

            // -1- Create a tooltip div that is hidden by default:
            var tooltip = d3.select("#my_dataviz")
                .append("div")
                .style("display", "none")
                .style("opacity", 0)
                .attr("class", "tooltip tooltip-bubble")
                .style("background-color", "black")
                .style("border-radius", "5px")
                .style("padding", "10px")
                .style("color", "white")

            // -2- Create 3 functions to show / update (when mouse move but stay on same circle) / hide the tooltip
            var showTooltip = function (event,d) {
                inFlag = true
                tooltip
                    .style("display", "")
                    .style("opacity", 1)
                    .html("<h6>" + d.region +
                        "</h6>Health workers: " + numberWithCommas(d.workers) +
                        "<br>Health sites: " + numberWithCommas(d.sites) +
                        "<br>Population: " + numberWithCommas(d.population))
                    .style("left", (event.pageX - 100) + "px")
                    .style("top", (event.pageY - 130) + "px")
            }
            var moveTooltip = function (event, d) {
                if(inFlag){
                    tooltip
                        .style("left", (event.pageX - 100) + "px")
                        .style("top", (event.pageY - 130) + "px")
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

            // Add dots
            bubble.selectAll(".bubbles")
                .data(data)
                .join(function(enter){
                    enter.append("circle")
                        .attr("class", "bubbles")
                        .attr("cx", function (d) {return xScale(d.workers);})
                        .attr("cy", function (d) {return yScale(d.sites);})
                        .attr("r", 0)
                        .style("fill", bubble_colour)
                        .style("opacity", 0.7)
                        // -3- Trigger the functions
                        // .attr('pointer-events', 'none')
                        .on("mouseover", showTooltip)
                        .on("mousemove", moveTooltip)
                        .on("mouseleave", hideTooltip)
                        .on('click', null)
                        .transition(t)
                        .attr("r", function (d) {return zScale(d.population);})
                }, function(update){
                    update.call(function(update) {
                        update.transition(t)
                            .attr("class", "bubbles")
                            .attr("cx", function (d) {return xScale(d.workers);})
                            .attr("cy", function (d) {return yScale(d.sites);})
                            .attr("r", function (d) {return zScale(d.population);})
                            .style("fill", bubble_colour)
                            .style("opacity", 0.7)
                            // -3- Trigger the functions
                            // .attr('pointer-events', 'none')
                        update.on("mouseover", showTooltip)
                            .on("mousemove", moveTooltip)
                            .on("mouseleave", hideTooltip)
                            .on('click', null)
                    })
                }, function(exit){
                    exit.attr("fill", "#cccccc")
                        .call(function(exit) {
                            exit.transition(t)
                                .attr("r", 0)
                                .remove();
                        })
                })
        })
    }

    $("#bBack").click(function(){
        d3.selectAll(".tooltip-bubble").remove();
        $("#regionname").text("")
        $("#bBack").css("display", "none")

        var t = bubble.transition()
            .duration(500);

        d3.csv('/bubblechart', function (raw_data) {
            return {
                workers: +raw_data.workers,
                sites: +raw_data.sites,
                population: +raw_data.population,
                region: raw_data.region
            };
        }).then(function (data) {

            inFlag = false;

            xMax = d3.max(data, function (d) {
                return d.workers;
            });

            yMax = d3.max(data, function (d) {
                return d.sites;
            });

            zMax = d3.max(data, function (d) {
                return d.population;
            });
            zMin = d3.min(data, function (d) {
                return d.population;
            });

            xScale = d3.scaleLinear([0, 1.25 * xMax], [margin.left, width - margin.right]);

            yScale = d3.scaleLinear([0, 1.25 * yMax], [height - margin.bottom, margin.top]);

            zScale = d3.scaleLinear([0.5 * zMin, 1.25 * zMax], [5, 50]);


            // Add X axis
            bubble.selectAll(".xAxis-bubble")
                .transition(t)
                .call(d3.axisBottom(xScale));

            // Add Y axis
            bubble.selectAll(".yAxis-bubble")
                .transition(t)
                .call(d3.axisLeft(yScale));

            // -1- Create a tooltip div that is hidden by default:
            var tooltip = d3.select("#my_dataviz")
                .append("div")
                .style("display", "none")
                .style("opacity", 0)
                .attr("class", "tooltip tooltip-bubble")
                .style("background-color", "black")
                .style("border-radius", "5px")
                .style("padding", "10px")
                .style("color", "white")

            // -2- Create 3 functions to show / update (when mouse move but stay on same circle) / hide the tooltip
            var showTooltip = function (event,d) {
                inFlag = true
                tooltip
                    .style("display", "")
                    .style("opacity", 1)
                    .html("<h6>" + d.region +
                        "</h6>Health workers: " + numberWithCommas(d.workers) +
                        "<br>Health sites: " + numberWithCommas(d.sites) +
                        "<br>Population: " + numberWithCommas(d.population))
                    .style("left", (event.pageX - 100) + "px")
                    .style("top", (event.pageY - 130) + "px")
            }
            var moveTooltip = function (event, d) {
                if(inFlag){
                    tooltip
                        .style("left", (event.pageX - 100) + "px")
                        .style("top", (event.pageY - 130) + "px")
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

            // Add dots
            bubble.selectAll(".bubbles")
                .data(data)
                .join(function(enter){
                    enter.append("circle")
                        .attr("class", "bubbles")
                        .attr("cx", function (d) {return xScale(d.workers);})
                        .attr("cy", function (d) {return yScale(d.sites);})
                        .attr("r", 0)
                        .style("fill", bubble_colour)
                        .style("opacity", 0.7)
                        // -3- Trigger the functions
                        // .attr('pointer-events', 'none')
                        .on("mouseover", showTooltip)
                        .on("mousemove", moveTooltip)
                        .on("mouseleave", hideTooltip)
                        .on("click", moveToProvince)
                        .transition(t)
                        .attr("r", function (d) {return zScale(d.population);})
                }, function(update){
                    update.call(function(update) {
                        update.transition(t)
                            .attr("class", "bubbles")
                            .attr("cx", function (d) {return xScale(d.workers);})
                            .attr("cy", function (d) {return yScale(d.sites);})
                            .attr("r", function (d) {return zScale(d.population);})
                            .style("fill", bubble_colour)
                            .style("opacity", 0.7)
                            // -3- Trigger the functions
                            // .attr('pointer-events', 'none')
                        update.on("mouseover", showTooltip)
                            .on("mousemove", moveTooltip)
                            .on("mouseleave", hideTooltip)
                            .on("click", moveToProvince)
                    })
                }, function(exit){
                    exit.attr("fill", "#cccccc")
                        .call(function(exit) {
                            exit.transition(t)
                                .attr("r", 0)
                                .remove();
                        })
                })
        })
    })

    //Read the data
    d3.csv('/bubblechart', function (raw_data) {
        return {
            workers: +raw_data.workers,
            sites: +raw_data.sites,
            population: +raw_data.population,
            region: raw_data.region
        };
    }).then(function (data) {

        inFlag = false;

        xMax = d3.max(data, function (d) {
            return d.workers;
        });

        yMax = d3.max(data, function (d) {
            return d.sites;
        });

        zMax = d3.max(data, function (d) {
            return d.population;
        });
        zMin = d3.min(data, function (d) {
            return d.population;
        });

        xScale = d3.scaleLinear([0, 1.25 * xMax], [margin.left, width - margin.right]);

        yScale = d3.scaleLinear([0, 1.25 * yMax], [height - margin.bottom, margin.top]);

        zScale = d3.scaleLinear([0.5 * zMin, 1.25 * zMax], [5, 50]);


        // Add X axis
        bubble.append("g")
            .attr("class", "xAxis-bubble")
            .attr("transform", "translate(0," + (height - margin.bottom) + ")")
            .call(d3.axisBottom(xScale));

        // Add Y axis
        bubble.append("g")
            .attr("class", "yAxis-bubble")
            .attr("transform", "translate(" + margin.left + ",0)")
            .call(d3.axisLeft(yScale));

        bubble.append("text")
            .attr("x", (width - margin.left)/2 + margin.left)
            .attr("y", height-margin.bottom+40)
            .attr("text-anchor", "middle")
            .text("Number of Health Workers")

        bubble.append("text")
            .attr("x", -(height - margin.bottom)/2)
            .attr("y", margin.left-50)
            .attr("transform", "rotate(-90)")
            .attr("text-anchor", "middle")
            .text("Number of Health Sites")

        // -1- Create a tooltip div that is hidden by default:
        var tooltip = d3.select("#my_dataviz")
            .append("div")
            .style("display", "none")
            .style("opacity", 0)
            .attr("class", "tooltip tooltip-bubble")
            .style("background-color", "black")
            .style("border-radius", "5px")
            .style("padding", "10px")
            .style("color", "white")

        // -2- Create 3 functions to show / update (when mouse move but stay on same circle) / hide the tooltip
        var showTooltip = function (event,d) {
            inFlag = true
            tooltip
                .style("display", "")
                .style("opacity", 1)
                .html("<h6>" + d.region +
                    "</h6>Health workers: " + numberWithCommas(d.workers) +
                    "<br>Health sites: " + numberWithCommas(d.sites) +
                    "<br>Population: " + numberWithCommas(d.population))
                .style("left", (event.pageX - 100) + "px")
                .style("top", (event.pageY - 130) + "px")
        }
        var moveTooltip = function (event, d) {
            if(inFlag){
                tooltip
                    .style("left", (event.pageX - 100) + "px")
                    .style("top", (event.pageY - 130) + "px")
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


        // Add dots
        bubble.selectAll(".bubbles")
            .data(data)
            .join("circle")
            .attr("class", "bubbles")
            .attr("cx", function (d) {
                // Total Health worker
                return xScale(d.workers);
            })
            .attr("cy", function (d) {
                // Total Ameneties
                return yScale(d.sites);
            })
            .attr("r", function (d) {
                return zScale(d.population);
            })
            .style("fill", bubble_colour)
            .style("opacity", 0.7)
            // -3- Trigger the functions
            .on("mouseover", showTooltip)
            .on("mousemove", moveTooltip)
            .on("mouseleave", hideTooltip)
            .on("click", moveToProvince)
    })
})
