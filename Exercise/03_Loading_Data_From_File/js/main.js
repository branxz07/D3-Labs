//CSV FILE
d3.csv("data/ages.csv").then((data)=> {
	console.log(data);
});

//TSV FILE
d3.tsv("data/ages.tsv").then((data)=> {
	console.log(data);
});

//JSON FILE
d3.json("data/ages.json").then((data)=> {
	console.log(data);
});

//String to Integer
d3.json("data/ages.json").then((data)=> {
	data.forEach((d)=>{
		d.age = +d.age;
	});
	console.log(data);

var svg = d3.select("#chart-area").append("svg")
	.attr("width", 400)
	.attr("height", 400);

var circle = svg.selectAll("circle")
    .data(data);

circle.enter()
    .append("circle")
    .attr("cx", function(d,i) {
            return 60 * i + 20;
    })
    .attr("cy", 100)
    .attr("r", function(d) {
            return d.age*2;
    })
    .attr("fill", function(d){
        return d.age > 10 ? "lightpink" : "lightgrey";
    });

});
