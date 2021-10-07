import * as d3 from 'd3';
import './App.scss';
import { useState, useEffect } from "react";

function App() {
  const [data, setData] = useState([]);   

  useEffect(() => {
    async function fetchData(){
      const response = await fetch('https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json');
      const data = await response.json();
      setData(data.data)
      console.log(data.data)
    } 
    fetchData()
  }, [])

let yScale, xScale, yAxisScale, xAxisScale;

let width = 800;
let height = 600;
let padding = 60;

let svg = d3.select("svg")

const drawCanvas = () => {
  svg.attr("width", width)
     .attr("height", height)
};

const generateScales = () => {
  yScale = d3.scaleLinear()
             .domain([0, d3.max(data, (d) => d[1])])
             .range([0, height - (2 * padding)]);

  xScale = d3.scaleLinear()
             .domain([0, data.length -1])
             .range([padding, width - padding]);

  let datesArray = data.map(i => new Date(i[0]))

  console.log(datesArray)

  xAxisScale = d3.scaleTime()
                .domain([d3.min(datesArray), d3.max(datesArray)])
                .range([padding, width - padding]);

  yAxisScale = d3.scaleLinear()
                 .domain([0, d3.max(data, (d) => d[1])])
                 .range([height - padding, padding])
};

const drawBars = () => {

  let tooltip = d3.select("#tooltip")
                  .style("opacity", 0)

  svg.selectAll("rect")
     .data(data)
     .enter()
     .append("rect")
     .attr("class", "bar")
     .attr("width", (width - (2 * padding)) / data.length)
     .attr('data-date', (d) => d[0])
     .attr('data-gdp', (d) => d[1])
     .attr("height", (d) => yScale(d[1]))
     .attr("x", (d, i) => xScale(i))
     .attr("y", (d, i) => (height - padding) - yScale(d[1]))
     .on("mouseover", (d, i) => {
       tooltip.style("opacity", 0.7)
              .html(d[0].replace(/^(\d{4})(-)(\d{2})(-)(\d{2})$/, "$1$2$3") + '<br/>$' + d[1].toLocaleString("en-US"))
              .style("left",d3.event.pageX + 15 + "px")
              .style("top", d3.event.pageY + 15 + "px");

       document.querySelector("#tooltip").setAttribute("data-date", d[0])
     })
     .on("mouseout", (d) => {
       tooltip.style("opacity", 0)
     })
};

const generateAxes = () => {
  let xAxis = d3.axisBottom(xAxisScale);
  let yAxis = d3.axisLeft(yAxisScale);

  svg.append("g")
     .call(xAxis)
     .attr("id", "x-axis")
     .attr("transform", 'translate(0, ' + (height-padding) + ')');

  svg.append("g")
     .call(yAxis)
     .attr("id", "y-axis")
     .attr("transform", 'translate('+ padding +',0)' );
};

useEffect(() => {
  drawCanvas();
  generateScales();
  drawBars();
  generateAxes();
})

  return (
    <div className="App">
      <svg id="canvas">
        <text id="title" x="50%" y="7%" dominant-baseline="middle" text-anchor="middle">United States GDP</text>
        <text id="gdp" x="-280" y="85" transform="rotate(-90)">Gross Domestic Product</text>
      </svg>
      <div id="tooltip"></div>
      <br/>
      <br/>
      <span id="da3ker">by da3ker</span>
    </div>
  );
}

export default App;
