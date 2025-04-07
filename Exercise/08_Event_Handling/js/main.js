
d3.json("data/data.json").then(data => {
    const formattedData = data.map(year => ({
        year: year.year,
        countries: year.countries.filter(d => d.income && d.life_exp).map(d => ({
            ...d,
            income: +d.income,
            life_exp: +d.life_exp,
            population: +d.population
        }))
    }));

    const margin = { top: 50, right: 250, bottom: 100, left: 100 },
          width = 960 - margin.left - margin.right,
          height = 600 - margin.top - margin.bottom;

    const svg = d3.select("body").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    const x = d3.scaleLog().domain([142, 150000]).range([0, width]);
    const y = d3.scaleLinear().domain([0, 90]).range([height, 0]);
    const area = d3.scaleLinear().domain([2000, 1400000000]).range([25 * Math.PI, 1500 * Math.PI]);
    const continentColor = d3.scaleOrdinal(d3.schemeSet2);

    const xAxis = d3.axisBottom(x).tickValues([400, 4000, 40000]).tickFormat(d => `$${d}`);
    const yAxis = d3.axisLeft(y);

    svg.append("g").attr("transform", `translate(0,${height})`).call(xAxis);
    svg.append("g").call(yAxis);

    svg.append("text")
        .attr("x", width / 2)
        .attr("y", height + 40)
        .attr("text-anchor", "middle")
        .text("Income per Capita ($)");

    svg.append("text")
        .attr("transform", "rotate(-90)")
        .attr("x", -height / 2)
        .attr("y", -60)
        .attr("text-anchor", "middle")
        .text("Life Expectancy (Years)");

    const yearLabel = svg.append("text")
        .attr("x", width - 50)
        .attr("y", height - 10)
        .attr("font-size", "40px")
        .attr("fill", "gray")
        .attr("text-anchor", "end")
        .text("1800");

    const continents = [...new Set(data.flatMap(y => y.countries.map(d => d.continent)))];
    const tooltip = d3.select("body").append("div")
        .attr("class", "tooltip")
        .style("opacity", 0);

    const legend = svg.append("g").attr("transform", `translate(${width + 30}, 50)`);
    continents.forEach((continent, i) => {
        legend.append("rect")
            .attr("x", 0).attr("y", i * 25)
            .attr("width", 20).attr("height", 20)
            .attr("fill", continentColor(continent));

        legend.append("text")
            .attr("x", 30)
            .attr("y", i * 25 + 15)
            .text(continent)
            .attr("font-size", "14px")
            .attr("alignment-baseline", "middle");
    });

    function update(dataYear, continentFilter) {
        const filtered = dataYear.countries.filter(d =>
            (continentFilter === "All" || d.continent === continentFilter)
        );

        const t = d3.transition().duration(500);

        const circles = svg.selectAll("circle")
            .data(filtered, d => d.country);

        circles.exit().remove();

        circles.enter().append("circle")
            .attr("fill", d => continentColor(d.continent))
            .attr("cx", d => x(d.income))
            .attr("cy", d => y(d.life_exp))
            .attr("r", d => Math.sqrt(area(d.population) / Math.PI))
            .on("mouseover", function (event, d) {
                tooltip.transition().duration(200).style("opacity", .9);
                tooltip.html(`
                    <strong>${d.country}</strong><br>
                    Continent: ${d.continent}<br>
                    Income: $${d.income.toFixed(0)}<br>
                    Life Expectancy: ${d.life_exp}<br>
                    Population: ${d3.format(",")(d.population)}
                `)
                .style("left", (event.pageX + 10) + "px")
                .style("top", (event.pageY - 28) + "px");
            })
            .on("mouseout", () => tooltip.transition().duration(500).style("opacity", 0))
            .merge(circles)
            .transition(t)
            .attr("cx", d => x(d.income))
            .attr("cy", d => y(d.life_exp))
            .attr("r", d => Math.sqrt(area(d.population) / Math.PI));

        yearLabel.text(dataYear.year);
    }

    let yearIndex = 0;
    let playing = true;
    let interval = d3.interval(() => {
        if (playing) advance();
    }, 1000);

    function advance() {
        yearIndex = (yearIndex + 1) % formattedData.length;
        update(formattedData[yearIndex], d3.select("#continent-select").property("value"));
        d3.select("#year-slider").property("value", yearIndex);
        d3.select("#slider-label").text(`Year: ${formattedData[yearIndex].year}`);
    }

    // UI Elements
    d3.select("body").append("button")
        .attr("id", "play-button")
        .text("Pause")
        .on("click", function () {
            playing = !playing;
            d3.select(this).text(playing ? "Pause" : "Play");
        });

    d3.select("body").append("button")
        .attr("id", "reset-button")
        .text("Reset")
        .on("click", function () {
            yearIndex = 0;
            update(formattedData[yearIndex], d3.select("#continent-select").property("value"));
            d3.select("#year-slider").property("value", 0);
            d3.select("#slider-label").text(`Year: ${formattedData[0].year}`);
        });

    d3.select("body").append("label")
        .attr("id", "slider-label")
        .text(`Year: ${formattedData[0].year}`);

    d3.select("body").append("input")
        .attr("type", "range")
        .attr("min", 0)
        .attr("max", formattedData.length - 1)
        .attr("value", 0)
        .attr("id", "year-slider")
        .on("input", function () {
            yearIndex = +this.value;
            update(formattedData[yearIndex], d3.select("#continent-select").property("value"));
            d3.select("#slider-label").text(`Year: ${formattedData[yearIndex].year}`);
        });

    d3.select("body").append("select")
        .attr("id", "continent-select")
        .on("change", function () {
            update(formattedData[yearIndex], this.value);
        })
        .selectAll("option")
        .data(["All", ...continents])
        .enter().append("option")
        .text(d => d);

    update(formattedData[0], "All");
});