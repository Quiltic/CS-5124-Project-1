class Histogram {

    /**
     * Class constructor with basic chart configuration
     * @param {Object}
     * @param {Array}
     */
    constructor(_config, _data, _title, _xlabel, _ylabel) {
      // Configuration object with defaults
      this.config = {
        parentElement: _config.parentElement,
        containerWidth: _config.containerWidth || 710,
        containerHeight: _config.containerHeight || 200,
        margin: _config.margin || {top: 30, right: 30, bottom: 60, left: 60},
        reverseOrder: _config.reverseOrder || false,
        tooltipPadding: _config.tooltipPadding || 15,
        yScaleLog:_config.yScaleLog || false,
        colors: _config.colors || NaN,
      }
      this.data = _data;
      this.title = _title;
      this.xlabel = _xlabel;
      this.ylabel = _ylabel;
      this.initVis();
    }
    
    /**
     * Initialize scales/axes and append static elements, such as axis titles
     */
    initVis() {
      let vis = this;
  
      // Calculate inner chart size. Margin specifies the space around the actual chart.
      vis.width = vis.config.containerWidth - vis.config.margin.left - vis.config.margin.right;
      vis.height = vis.config.containerHeight - vis.config.margin.top - vis.config.margin.bottom;

      
  
      // Initialize scales and axes
      // Important: we flip array elements in the y output range to position the rectangles correctly
      if (!vis.config.yScaleLog) {
        // console.log(vis.config.yScaleLog);
      vis.yScale = d3.scaleLinear()
          .range([vis.height, 0]) 
        } else {
            vis.yScale = d3.scaleLog()
          .range([vis.height, 0]) 
        }
  
      vis.xScale = d3.scaleLinear()
          .range([0, vis.width]);
        //   .paddingInner(0.2);
  
      vis.xAxis = d3.axisBottom(vis.xScale)
        .ticks(8);
        //   .tickSizeOuter(0);
  
      vis.yAxis = d3.axisLeft(vis.yScale)
        //   .ticks(10)
        //   .tickSizeOuter(0)
        //   .tickFormat(d3.formatPrefix('.0s', 1e6)); // Format y-axis ticks as millions
  
      // Define size of SVG drawing area
      vis.svg = d3.select(vis.config.parentElement)
          .attr('width', vis.config.containerWidth)
          .attr('height', vis.config.containerHeight);
  
      // SVG Group containing the actual chart; D3 margin convention
      vis.chart = vis.svg.append('g')
          .attr('transform', `translate(${vis.config.margin.left},${vis.config.margin.top})`);
  
      // Append empty x-axis group and move it to the bottom of the chart
      vis.xAxisG = vis.chart.append('g')
          .attr('class', 'axis x-axis')
          .attr('transform', `translate(0,${vis.height})`);
      
      // Append y-axis group 
      vis.yAxisG = vis.chart.append('g')
          .attr('class', 'axis y-axis');

        // // Append axis title
        // vis.svg.append('text')
        // .attr('class', 'axis-title')
        // .attr('x', 0)
        // .attr('y', 0)
        // .attr('dy', '.71em')
        // // .style('fill', 'white')
        // .text(vis.title);
    }
  
    /**
     * Prepare data and scales before we render it
     */
    updateVis() {
      let vis = this;
  
      // Reverse column order depending on user selection
      if (vis.config.reverseOrder) {
        vis.data.reverse();
      }
  
      // Specificy x- and y-accessor functions
      vis.xValue = d => d.distance;
      vis.yValue = d => d.name;
      vis.colorValue = d => d.distance;
  

      // Set the scale input domains
    //   vis.xScale.domain(vis.data.map(vis.xValue));
    vis.xScale.domain([d3.min(vis.data, vis.xValue), 5000]);//d3.max(vis.data, vis.xValue)]);
    // console.log(d3.max(vis.data, vis.xValue))
    //   vis.yScale.domain([0, d3.max(vis.data, vis.yValue)]);

    // vis.colors = d3.scaleLinear()
    //     .range(['#0abdc6','#ea00d9'])
    //     .domain([d3.min(vis.data, vis.xValue), 5000])


      vis.histogram = d3.histogram()
      .value(d=> d.distance)
      .domain(vis.xScale.domain())  // the the domain of the graphic
      .thresholds(vis.xScale.ticks(50)); // the the numbers of bins

      vis.bins = vis.histogram(vis.data);
    //   console.log(vis.bins)

      vis.yScale.domain([d3.min(vis.bins, d => d.length), d3.max(vis.bins, d => d.length)]);

      vis.colors = d3.scaleOrdinal()
        .range(['#0abdc6','#0F7EA1','#133e7c'])
        .domain([0, 500, 5000]);
  


    // console.log(this.colors(this.colorValue(0)))
      vis.renderVis();
    }
  
    /**
     * Bind data to visual elements
     */
    renderVis() {
      let vis = this;
    //   console.log(vis.yScale(d3.min(vis.data, vis.yValue)))
  
      // Add rectangles
      let bars = vis.chart.selectAll('.bar')
          .data(vis.bins, vis.xValue)
        .join('rect');

    //     svg.selectAll("rect")
    //   .data(bins)
    //   .enter()
    //   .append("rect")
    //     .attr("x", 1)
    //     .attr("transform", function(d) { return "translate(" + x(d.x0) + "," + y(d.length) + ")"; })
    //     .attr("width", function(d) { return x(d.x1) - x(d.x0) -1 ; })
    //     .attr("height", function(d) { return height - y(d.length); })
    //     .style("fill", "#69b3a2")
      
      bars.style('opacity', 0.5)
        .transition().duration(1000)
          .style('opacity', 1)
          .attr('class', 'bar')
          .attr('x', d => vis.xScale(vis.xValue(d)))
          .attr("transform", d => "translate(" + vis.xScale(d.x0) + "," + vis.yScale(d.length) + ")")
          .attr('width', d => vis.xScale(d.x1) - vis.xScale(d.x0))
          .attr('height', d => vis.height - vis.yScale(d.length))
          .attr('fill', d => vis.colors(vis.colorValue(d.x0)));
        //   .attr('y', d => vis.yScale(vis.yValue(d)))
      
      // Tooltip event listeners
      bars
          .on('mouseover', (event,d) => {
            d3.select('#tooltip')
              .style('opacity', 1)
              // Format number with million and thousand separator
              .html(`
              <div class="tooltip-title">${d.x0}-${d.x1} Parsecs</div>
                <p>${d.length} total</p>
                `);
          })
          .on('mousemove', (event) => {
            d3.select('#tooltip')
              .style('left', (event.pageX + vis.config.tooltipPadding) + 'px')   
              .style('top', (event.pageY + vis.config.tooltipPadding) + 'px')
          })
          .on('mouseleave', () => {
            d3.select('#tooltip').style('opacity', 0);
          });
  
      // Update axes
      vis.xAxisG.call(vis.xAxis);
        vis.chart.append('text')
        .attr('class', 'axis-title')
        .attr("y", vis.height + vis.config.margin.bottom-10)
        .attr("x",(vis.width / 2))
        .style("text-anchor", "middle")
        .text(vis.xlabel);
    
    vis.yAxisG.call(vis.yAxis);
        vis.chart.append('text')
        .attr('class', 'axis-title')
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - vis.config.margin.left)
        .attr("x",0 - (vis.height / 2))
        .attr("dy", "1em")
        .style("text-anchor", "middle")
        .text(vis.ylabel);
    }
  }
  
  