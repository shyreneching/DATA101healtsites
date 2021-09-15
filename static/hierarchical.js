// declare variables for the bar chart
let bar_width, 
    bar_height, 
    bar_margin,
    x, y,
    svg, base_data,
    barStep = 17, 
    barHeight = 20, 
    duration = 750,
    delay = 25;
let barPadding = 3 / barStep;
let color = d3.scaleOrdinal([true, false], ["#e17970", "#aaa"]);

// declare filter variables
let hierarchical_filters;
let amenity_list = ['pharmacy', 'clinic', 'hospital', 'dentist', 'doctors', 'laboratory', 'social-facility', 'healthcare'];

// declare tooltip variables
let barTooltip, showBarTooltip, moveBarTooltip, hideBarTooltip;

// declare bar chart navigation variables
let end, exit, enter, enterTransition, exitTransition;

// get data from a nested json to build the chart
d3.json('/hierarchicaldata').then(function (hierarchicaldata) {
    // set param to global variable base_data
    base_data = hierarchicaldata;

    // set up the elements for the chart
    bar_margin = {top: 10, right: 20, bottom: 20, left: 150},
    bar_width = 620 - bar_margin.left - bar_margin.right,
    bar_height = 360 - bar_margin.top - bar_margin.bottom;

    x = d3.scaleLinear().range([bar_margin.left, bar_width - bar_margin.right])

    svg = d3.select("#hierarchical").append("svg")
        .attr("width", bar_width + bar_margin.left + bar_margin.right)
        .attr("height", bar_height)
        .append("g")
        .attr("transform", "translate(" + bar_margin.left + "," + bar_margin.top + ")");

    svg.append("rect")
    .attr("class", "background")
    .attr("fill", "none")
    .attr("pointer-events", "all")
    .attr("width", bar_width)
    .attr("height", bar_height)
    .attr("cursor", "pointer")
    .on("click", (event, d) => up(svg, d));

    svg.append("g")
    .call(xAxis);

    svg.append("g")
    .call(yAxis);

    // -1- Create a barTooltip div that is hidden by default:
    barTooltip = d3.select("#hierarchical")
    .append("div")
    .style("display", "none")
    .style("opacity", 0)
    .attr("class", "tooltip tooltip-bar")
    .style("background-color", "black")
    .style("border-radius", "5px")
    .style("padding", "10px")
    .style("color", "white")

    // -2- Create 3 functions to show / update (when mouse move but stay on same circle) / hide the barTooltip
    showBarTooltip = function (event,d) {
        inFlag = true
        barTooltip
            .style("display", "")
            .style("opacity", 1)
            .html("<h6>" + d.data.name +
                "</h6>Total Facilities: " + numberWithCommas(d.value))
            .style("left", (event.pageX - 150) + "px")
            .style("top", (event.pageY - 230) + "px")
    }
    moveBarTooltip = function (event, d) {
        if(inFlag){
            barTooltip
                .style("left", (event.pageX - 150) + "px")
                .style("top", (event.pageY - 230) + "px")
        } else {
            showBarTooltip(event, d)
        }
    }
    hideBarTooltip = function (event, d) {
        inFlag = false
        barTooltip
            .style("opacity", 0)
            .style("display", "none")
    }

    // call to update the chart with the data
    resetHierarchicalChart();
});

// functions for setting the x and y axes
let xAxis = g => g
        .attr("class", "x-axis")
        .attr("transform", `translate(0,${bar_margin.top})`)
        .call(d3.axisTop(x).ticks(bar_width / 80, "s"))
        .call(g => (g.selection ? g.selection() : g).select(".domain").remove())

let yAxis = g => g
    .attr("class", "y-axis")
    .attr("transform", `translate(${bar_margin.left + 0.5},0)`)
    .call(g => g.append("line")
        .attr("stroke", "currentColor")
        .attr("y1", bar_margin.top)
        .attr("y2", bar_height - bar_margin.bottom))

// Creates a set of bars for the given data node, at the specified index.
function bar(svg, down, d, selector) {
    const g = svg.insert("g", selector)
        .attr("class", "enter")
        .attr("transform", `translate(0,${bar_margin.top + barStep * barPadding})`)
        .attr("text-anchor", "end")
        .style("font", "10px sans-serif");
  
    const bar = g.selectAll("g")
      .data(d.children)
      .join("g")
        .attr("cursor", d => !d.children ? null : "pointer")
        .on("click", (event, d) => down(svg, d))
        .on("mouseover", showBarTooltip)
        .on("mousemove", moveBarTooltip)
        .on("mouseleave", hideBarTooltip);
  
    bar.append("text")
        .attr("x", bar_margin.left - 6)
        .attr("y", barStep * (1 - barPadding) / 2)
        .attr("dy", ".35em")
        .text(d => {
            newname = d.data.name.replace(/ *\([^)]*\) */g, "");;
            return d.data.name;
        });
  
    bar.append("rect")
        .attr("x", x(0))
        .attr("width", d => x(d.value) - x(0))
        .attr("height", barStep * (1 - barPadding));
  
    return g;
  }

// move down to the children of the selected bar if they exist
function down(svg, d) {
    if (!d.children || this.__transition__) {
        return;
    }

    // Rebind the current node to the background.
    svg.select(".background").datum(d);

    // Define two sequenced transitions.
    const transition1 = svg.transition().duration(duration);
    const transition2 = transition1.transition();

    // Mark any currently-displayed bars as exiting.
    const exit = svg.selectAll(".enter")
        .attr("class", "exit");

    // Entering nodes immediately obscure the clicked-on bar, so hide it.
    exit.selectAll("rect")
        .attr("fill-opacity", p => p === d ? 0 : null);

    // Transition exiting bars to fade out.
    exit.transition(transition1)
        .attr("fill-opacity", 0)
        .remove();

    // Enter the new bars for the clicked-on data.
    // Per above, entering bars are immediately visible.
    const enter = bar(svg, down, d, ".y-axis")
        .attr("fill-opacity", 0);

    // Have the text fade-in, even though the bars are visible.
    enter.transition(transition1)
        .attr("fill-opacity", 1);

    // Transition entering bars to their new y-position.
    enter.selectAll("g")
        .attr("transform", stack(d.index))
        .transition(transition1)
        .attr("transform", stagger());

    // Update the x-scale domain.
    x.domain([0, d3.max(d.children, d => d.value)]);

    // Update the x-axis.
    svg.selectAll(".x-axis").transition(transition2)
        .call(xAxis);

    // Transition entering bars to the new x-scale.
    enter.selectAll("g").transition(transition2)
        .attr("transform", (d, i) => `translate(0,${barStep * i})`);

    // Color the bars as parents; they will fade to children if appropriate.
    enter.selectAll("rect")
        .attr("fill", color(true))
        .attr("fill-opacity", 1)
        .transition(transition2)
        .attr("fill", d => color(!!d.children))
        .attr("width", d => x(d.value) - x(0));
}

// move to the parent bar if it exists
function up(svg, d) {
    if (!d.parent || !svg.selectAll(".exit").empty()) return;
  
    // Rebind the current node to the background.
    svg.select(".background").datum(d.parent);
  
    // Define two sequenced transitions.
    const transition1 = svg.transition().duration(duration);
    const transition2 = transition1.transition();
  
    // Mark any currently-displayed bars as exiting.
    const exit = svg.selectAll(".enter")
        .attr("class", "exit");
  
    // Update the x-scale domain.
    x.domain([0, d3.max(d.parent.children, d => d.value)]);
  
    // Update the x-axis.
    svg.selectAll(".x-axis").transition(transition1)
        .call(xAxis);
  
    // Transition exiting bars to the new x-scale.
    exit.selectAll("g").transition(transition1)
        .attr("transform", stagger());
  
    // Transition exiting bars to the parent’s position.
    exit.selectAll("g").transition(transition2)
        .attr("transform", stack(d.index));
  
    // Transition exiting rects to the new scale and fade to parent color.
    exit.selectAll("rect").transition(transition1)
        .attr("width", d => x(d.value) - x(0))
        .attr("fill", color(true));
  
    // Transition exiting text to fade out.
    // Remove exiting nodes.
    exit.transition(transition2)
        .attr("fill-opacity", 0)
        .remove();
  
    // Enter the new bars for the clicked-on data's parent.
    const enter = bar(svg, down, d.parent, ".exit")
        .attr("fill-opacity", 0);
  
    enter.selectAll("g")
        .attr("transform", (d, i) => `translate(0,${barStep * i})`);
  
    // Transition entering bars to fade in over the full duration.
    enter.transition(transition2)
        .attr("fill-opacity", 1);
  
    // Color the bars as appropriate.
    // Exiting nodes will obscure the parent bar, so hide it.
    // Transition entering rects to the new x-scale.
    // When the entering parent rect is done, make it visible!
    enter.selectAll("rect")
        .attr("fill", d => color(!!d.children))
        .attr("fill-opacity", p => p === d ? 0 : null)
      .transition(transition2)
        .attr("width", d => x(d.value) - x(0))
        .on("end", function(p) { d3.select(this).attr("fill-opacity", 1); });
}

// A stateful closure for stacking bars horizontally.
function stack(i) {
    let value = 0;
    return d => {
      const t = `translate(${x(value) - x(0)},${barStep * i})`;
      value += d.value;
      return t;
    };
  }

function stagger() {
    let value = 0;
    return (d, i) => {
      const t = `translate(${x(value) - x(0)},${barStep * i})`;
      value += d.value;
      return t;
    };
}

// calculates and sets the value of root. This is needed for sorting and summation of values
function setRoot (d) {
    return d3.hierarchy(d)
    .sum(d => d.value)
    .sort((a, b) => b.value - a.value)
    .eachAfter(d => d.index = d.parent ? d.parent.index = d.parent.index + 1 || 0 : 0);
}

// Returns a filtered version of base_data (has to be accessed through new_data[0])
function filterAmenityData (hierarchicalTree) {
    const new_data = [];
    for (const parent of hierarchicalTree) {
        if (hierarchical_filters.includes(parent.name)) {
            continue;
        } else if (parent.children) {
            new_data.push({
                ...parent,
                children: filterAmenityData(parent.children)
            });
        } else {
            new_data.push(parent);
        }
    }
    return new_data;
}


function filterHierarchicalChart () {
    hierarchical_filters = [];

    for (i in amenity_list) {
        if (document.getElementById("cb-"+amenity_list[i]).checked === false) {
            hierarchical_filters.push(amenity_list[i]);
        }
    }

    root = setRoot(filterAmenityData([base_data])[0])
    x.domain([0, root.value]).nice();
    down(svg, root);
};

function resetHierarchicalChart () {
    root = setRoot(base_data);
    x.domain([0, root.value]).nice();
    down(svg, root);

    for (i in amenity_list) {
        document.getElementById("cb-"+amenity_list[i]).checked = true;
    }
}

// When the button is clicked, run the filterHierarchicalChart function
document.getElementById("btn-filter-hierarchical").onclick = filterHierarchicalChart;

// When the button is clicked, run the resetHierarchicalChart function
document.getElementById("btn-reset-hierarchical").onclick = resetHierarchicalChart;