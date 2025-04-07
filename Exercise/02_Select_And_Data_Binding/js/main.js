var data = [25, 20, 15, 10, 5];

var svg = d3.select("#chart-area").append("svg")
    .attr("width", 400)
    .attr("height", 400);

var rect_background = svg.append("rect") 
    .attr("class","background")
    .attr("x",0)
    .attr("y",0)
    .attr("width",400)
    .attr("height",400)
    .attr("fill", "rgba(154, 244, 20, 0.3)");

var rect = svg.selectAll("rect:not(.background)")
    .data(data);

rect.enter()
    .append("rect")
        .attr("x",function(d,i){
            return i * 45 + 20;
        })
        .attr("y",function(d){
            return 400 - d * 10 - 2;
        })
        .attr("width", 40)
        .attr("height", function(d){
            return d * 10;
        })
        .attr("fill", "lightblue");

