$(document).ready(function () {
    const width = 450,
        height = 450,
        margin = 40;

    // The radius of the pieplot is half the width or half the height (smallest one). I subtract a bit of margin.
    const radius = Math.min(width, height) / 2 - margin;

    // append the svg object to the div called 'my_dataviz'
    const svg = d3.select("#bar")
        .append("svg")
        .attr("width", width)
        .attr("height", height)
        .append("g")
        .attr("transform", `translate(${width/2}, ${height/2})`);

    // create 2 data_set
    const data1 = {
        a: 9,
        b: 20,
        c: 30,
        d: 8,
        e: 12
    }
    const data2 = {
        a: 6,
        b: 16,
        c: 20,
        d: 14,
        e: 19,
        f: 12
    }

    // set the color scale
    const color = d3.scaleOrdinal()
        .domain(["a", "b", "c", "d", "e", "f"])
        .range(d3.schemeDark2);

    // A function that create / update the plot for a given variable:
    function update(data) {

        // Compute the position of each group on the pie:
        const pie = d3.pie()
            .value(function (d) {
                return d[1];
            })
            .sort(function (a, b) {
                return d3.ascending(a.key, b.key);
            }) // This make sure that group order remains the same in the pie chart

        
        const data_ready = pie(Object.entries(data))

        // map to data
        const u = svg.selectAll("path")
            .data(data_ready)

        // Build the pie chart: Basically, each part of the pie is a path that we build using the arc function.
        u
            .join('path')
            .transition()
            .duration(1000)
            .attr('d', d3.arc()
                .innerRadius(0)
                .outerRadius(radius)
            )
            .attr('fill', function (d) {
                return (color(d.data[0]))
            })
            .attr("stroke", "white")
            .style("stroke-width", "2px")
            .style("opacity", 1)




        var tooltip = d3.select("#bar")
            .append("div")
            .style("opacity", 0)
            .attr("class", "tooltip")
            .style("background-color", "black")
            .style("border-radius", "5px")
            .style("padding", "10px")
            .style("color", "white")


        tooltip.append('div') // NEW
            .attr('class', 'label'); // NEW

        tooltip.append('div') // NEW
            .attr('class', 'count'); // NEW

        tooltip.append('div') // NEW
            .attr('class', 'percent');

        var path = svg.selectAll('path')
            .data(pie(data_ready))
            .enter()
            .append('path')
            .attr('d', arc)
            .attr('fill', function (d, i) {
                return color(d.data.label);
            });

        path.on('mouseover', function (event, d) {
            console.log(d)
            tooltip
                .transition()
                .duration(200)
            tooltip
                .style("opacity", 1)
                .html("Val: " + d[1])
                .style("left", (event.pageX + 20) + "px")
                .style("top", (event.pageY - 90) + "px")

        });

        path.on('mousemove', function (event, d) {
            tooltip
                .style("left", (event.pageX + 20) + "px")
                .style("top", (event.pageY - 90) + "px")
        });

        path.on('mouseout', function () {
            tooltip
                .transition()
                .duration(200)
                .style("opacity", 0)
        });


    }



    // Initialize the plot with the first dataset
    update(data1)
})