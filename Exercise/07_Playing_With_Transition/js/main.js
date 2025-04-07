// GRAPHIC'S SIZE
var margin = { top: 50, right: 10, bottom: 100, left: 100 };
var width = 600 - margin.left - margin.right;
var height = 400 - margin.top - margin.bottom;

var flag = true;

var svg = d3.select("#chart-area")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom);

var g = svg.append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var x = d3.scaleBand().range([0, width]).padding(0.2);
var y = d3.scaleLinear().range([height, 0]);

var xAxisGroup = g.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + height + ")");

var yAxisGroup = g.append("g")
    .attr("class", "y axis");

var yLabel = g.append("text")
    .attr("class", "y axis-label")
    .attr("x", -(height / 2))
    .attr("y", -60)
    .attr("font-size", "20px")
    .attr("text-anchor", "middle")
    .attr("transform", "rotate(-90)")
    .text("Revenue");

d3.json("data/revenues.json").then((data) => {
    data.forEach((d) => {
        d.revenue = +d.revenue;
        d.profit = +d.profit;
    });

    d3.interval(() => {
        // Trim January from profit view
        var newData = flag ? data : data.slice(1);

        update(newData);
        flag = !flag;
    }, 1000);

    update(data);
}).catch((error) => {
    console.log(error);
});

function update(data) {
    var value = flag ? "revenue" : "profit";

    x.domain(data.map(d => d.month));
    y.domain([0, d3.max(data, d => d[value])]);

    var xAxisCall = d3.axisBottom(x);
    xAxisGroup.transition().duration(500).call(xAxisCall);

    var yAxisCall = d3.axisLeft(y)
        .ticks(10)
        .tickFormat(d => "$" + d);
    yAxisGroup.transition().duration(500).call(yAxisCall);

    // Use the second parameter as a key function: d.month
    var rects = g.selectAll("rect")
        .data(data, d => d.month);

    // EXIT
    rects.exit()
        .transition().duration(500)
        .attr("y", y(0))
        .attr("height", 0)
        .remove();

    // UPDATE
    rects.transition().duration(500)
        .attr("x", d => x(d.month))
        .attr("y", d => y(d[value]))
        .attr("width", x.bandwidth())
        .attr("height", d => height - y(d[value]))
        .attr("fill", "steelblue");

    // ENTER
    rects.enter().append("rect")
        .attr("x", d => x(d.month))
        .attr("width", x.bandwidth())
        .attr("y", y(0))
        .attr("height", 0)
        .attr("fill", "steelblue")
        .transition().duration(500)
            .attr("y", d => y(d[value]))
            .attr("height", d => height - y(d[value]));

    var label = flag ? "Revenue" : "Profit";
    yLabel.text(label);
}
