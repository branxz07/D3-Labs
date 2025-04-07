var svg = d3.select("#chart-area").append("svg")
	.attr("width", 400)
	.attr("height", 400);

var circle = svg.append("circle")
	.attr("cx", 130)
	.attr("cy", 180)
	.attr("r", 50)
	.attr("fill", "#00c3d9");

var circle2 = svg.append("circle")
	.attr("cx", 130)
	.attr("cy", 120)
	.attr("r", 10)
	.attr("fill", "#ffe700");

var rect = svg.append("rect")
	.attr("x", 80)
	.attr("y", 180)
	.attr("width", 100)
	.attr("height", 100)
	.attr("fill", "red");

var rect2 = svg.append("rect")
	.attr("x", 80)
	.attr("y", 180)
	.attr("width", 100)
	.attr("height", 4)
	.attr("fill", "#ffe700");

var rect3 = svg.append("rect")
	.attr("x", 80)
	.attr("y", 184)
	.attr("width", 100)
	.attr("height", 44)
	.attr("fill", "#ffdeb3");
var rect4 = svg.append("rect")
	.attr("x", 85)
	.attr("y", 280)
	.attr("width", 90)
	.attr("height", 10)
	.attr("fill", "#9d2f14");
var rect5 = svg.append("rect")
	.attr("x", 80)
	.attr("y", 285)
	.attr("width", 100)
	.attr("height", 5)
	.attr("fill", "black");

