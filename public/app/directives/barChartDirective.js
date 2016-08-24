angular.module('personal').directive('barChart', () => {

  return {
    restrict: 'A',
    link: (scope, element, attrs) => {

      let margin = {
        top: 20,
        right: 10,
        bottom: 100,
        left: 50
      },

      width = 450 - margin.right - margin.left,
      height = 500 - margin.top - margin.bottom;


      let svg = d3.select(".graph-container")
      .append("svg")
      .attr({
        "width": width + margin.right + margin.left,
        "height": height + margin.top + margin.bottom
      })
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.right + ")");



      // define x and y scales
      let xScale = d3.scale.ordinal()
      .rangeRoundBands([0, width], 0.2, 0.2);

      let yScale = d3.scale.linear()
      .range([height, 0]);

      // define x axis and y axis
      let xAxis = d3.svg.axis()
      .scale(xScale)
      .orient("bottom");

      let yAxis = d3.svg.axis()
      .scale(yScale)
      .orient("left");


      let data = myData;

      // sort the gdp values
      // data.sort(function(a, b) {
      //     return b.gdp - a.gdp;
      // });

      xScale.domain(data.map(function(d) {
        return d.name;
      }));
      yScale.domain([0, d3.max(data, function(d) {
        return d.age;
      })]);

      svg.selectAll('rect')
      .data(data)
      .enter()
      .append('rect')
      .attr("height", 0)
      .attr("y", height)
      .transition().duration(2000)
      .delay(function(d, i) {
        return i * 100;
      })
      // attributes can be also combined under one .attr
      .attr({
        "x": function(d) {
          return xScale(d.name);
        },
        "y": function(d) {
          return yScale(d.age);
        },
        "width": xScale.rangeBand(),
        "height": function(d) {
          return height - yScale(d.age);
        }
      })
      .style("fill", function(d, i) {
        return 'rgb(20, 10, ' + ((i * 40) + 150) + ')'
      });


      svg.selectAll('text')
      .data(data)
      .enter()
      .append('text')



      .text(function(d) {
        return d.age;
      })
      .attr({
        "x": function(d) {
          return xScale(d.name) + xScale.rangeBand() / 2;
        },
        "y": function(d) {
          return yScale(d.age) + 12;
        },
        "font-family": 'sans-serif',
        "font-size": '13px',
        "font-weight": 'bold',
        "fill": 'white',
        "text-anchor": 'middle'
      });

      // Draw xAxis and position the label
      svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis)
      .selectAll("text")
      .attr("dx", "-.8em")
      .attr("dy", ".25em")
      .attr("transform", "rotate(-60)")
      .style("text-anchor", "end")
      .attr("font-size", "10px");


      // Draw yAxis and postion the label
      svg.append("g")
      .attr("class", "y axis")
      .call(yAxis)
      .append("text")
      .attr("transform", "rotate(-90)")
      .attr("x", -height / 2)
      .attr("dy", "-3em")
      .style("text-anchor", "middle")
      .text("Age in Years");
    }


  };




});//End bar Chart Directive

var myData = [
    {
        name: "Aye",
        age: 27
    }, {
        name: "Jadyn",
        age: 7
    }, {
        name: "Craig",
        age: 29
    }, {
        name: "Christine",
        age: 13
    }, {
        name: "Nathan",
        age: 11
    }
];
