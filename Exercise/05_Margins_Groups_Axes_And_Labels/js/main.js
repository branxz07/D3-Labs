// Buildings of the World Visualization
d3.json("data/buildings.json").then((data) => {
    // Convert height to number
    data.forEach((d) => {
        d.height = +d.height;
    });

    // Set up SVG
    var svg = d3.select("#chart-area").append("svg")
        .attr("width", 800)
        .attr("height", 600)
        .style("background", "#f8f9fa");

    // Add title
    svg.append("text")
        .attr("x", 400)
        .attr("y", 30)
        .attr("text-anchor", "middle")
        .style("font-size", "20px")
        .style("font-weight", "bold")
        .text("World's Tallest Buildings");

    // X scale - use index for staggered positioning
    var x = d3.scaleLinear()
        .domain([0, data.length - 1])
        .range([100, 700]);

    // Y scale
    var y = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.height)])
        .range([500, 100]);

    // Color scale
    var color = d3.scaleSequential(d3.interpolatePlasma)
        .domain([0, data.length - 1]);

    // Draw buildings
    svg.selectAll("rect")
        .data(data)
        .enter()
        .append("rect")
        .attr("x", (d, i) => x(i) - 25)
        .attr("y", d => y(d.height))
        .attr("width", 50)
        .attr("height", d => 500 - y(d.height))
        .attr("rx", 5) // rounded corners
        .attr("ry", 5) // rounded corners
        .attr("fill", (d, i) => color(i))
        .attr("stroke", "#333")
        .attr("stroke-width", 1);

    // Add building labels
    svg.selectAll(".building-label")
        .data(data)
        .enter()
        .append("text")
        .attr("class", "building-label")
        .attr("x", (d, i) => x(i))
        .attr("y", 550)
        .attr("text-anchor", "middle")
        .text(d => d.name)
        .style("font-size", "12px")
        .attr("transform", (d, i) => `rotate(-45, ${x(i)}, 550)`);

    // Add height labels
    svg.selectAll(".height-label")
        .data(data)
        .enter()
        .append("text")
        .attr("class", "height-label")
        .attr("x", (d, i) => x(i))
        .attr("y", d => y(d.height) - 10)
        .attr("text-anchor", "middle")
        .text(d => `${d.height}m`)
        .style("font-size", "11px")
        .style("font-weight", "bold");

    // Add y-axis
    svg.append("g")
        .attr("transform", "translate(80,0)")
        .call(d3.axisLeft(y).tickFormat(d => `${d}m`))
        .style("font-size", "12px");

    // Add x-axis label
    svg.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 20)
        .attr("x", -250)
        .attr("text-anchor", "middle")
        .text("Height (meters)");
});