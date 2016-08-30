angular.module('personal').directive('barChart', () => {

  return {
    restrict: 'A',
    link: (scope, element, attrs) => {
        setTimeout(() => {

      let margin = {
        top: 20,
        right: 10,
        bottom: 100,
        left: 65
      },

      width = 420 - margin.right - margin.left,
      height = 450 - margin.top - margin.bottom;

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


      let data = scope.$root.report.graphNet;

    //   sort the gdp values
    //   data.sort(function(a, b) {
    //       return b.val - a.val;
    //   });

      xScale.domain(data.map(function(d) {
        return d.name;
      }));
      yScale.domain([0, d3.max(data, function(d) {
        return d.val;
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
          return yScale(d.val);
        },
        "width": xScale.rangeBand(),
        "height": function(d) {
          return height - yScale(d.val);
        }
      })
      .style("fill", function(d, i) {
          if (i === 0) {
              return '#62B6CB';
          }
          else if (i === 1) {
              return '#1B4965';
          }
          else {
              return '#5FA8D3';
          }
      });


      svg.selectAll('text')
      .data(data)
      .enter()
      .append('text')
      .text(function(d) {
          let splitStr = d.val.toString().split('');
          splitStr.splice(-3, 0, ",");
          splitStr.push(".00");
          let result = splitStr.join('');
          return "$" + result;
      })
      .attr({
        "x": function(d) {
          return xScale(d.name) + xScale.rangeBand() / 2;
        },
        "y": function(d) {
          return yScale(d.val) + 20;
        },
        "font-family": 'sans-serif',
        "font-size": '13px',
        "font-weight": 'bold',
        "fill": 'white',
        "text-anchor": 'middle'
      });

      // Draw xAxis and position the label
      svg.append("g")
      .data(data)
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis)
      .selectAll("text")
      .attr("dx", "-.8em")
      .attr("dy", ".75em")
      .style("text-anchor", "middle")
      .attr("font-size", "10px");


      // Draw yAxis and postion the label
      svg.append("g")
      .attr("class", "y axis")
      .call(yAxis)
      .append("text")
      .attr("transform", "rotate(-90)")
      .attr("class", "axislabel")
      .style("text-anchor", "middle")
      .attr("x", 0 - (height / 2))
      .attr("dy", "-4.5em")
      .text("Net in Dollars");

  }, 600);

    }


  };




});//End bar Chart Directive
