class Scatterplot {

  /**
   * Class constructor with basic chart configuration
   * @param {Object}
   * @param {Array}
   */
  constructor(_config, _data, _title, _xlabel, _ylabel) {
    this.config = {
      parentElement: _config.parentElement,
      containerWidth: _config.containerWidth || 800,
      containerHeight: _config.containerHeight || 240,
      margin: _config.margin || {top: 25, right: 30, bottom: 60, left: 70},
      tooltipPadding: 15
    }
    this.data = _data;
    this.xlabel = _xlabel;
    this.ylabel = _ylabel;
    this.initVis();
  }
  
  /**
   * We initialize scales/axes and append static elements, such as axis titles.
   */
  initVis() {
    let vis = this;
    // console.log(vis.data);


    vis.width = vis.config.containerWidth - vis.config.margin.left - vis.config.margin.right;
    vis.height = vis.config.containerHeight - vis.config.margin.top - vis.config.margin.bottom;

    vis.xScale = d3.scaleLog()
    // vis.xScale = d3.scaleLinear()
        .range([0, vis.width]);

    vis.yScale = d3.scaleLog()
    // vis.yScale = d3.scaleLinear()
        .range([vis.height, 0]);
        // .nice();

    // Initialize scales
    // vis.colorScale = d3.scaleLinear()
    //     .range(['#0abdc6','#ea00d9'])
    //     .domain([0, d3.max(vis.data, vis.data.distance)]);
    // vis.colorScale = d3.scaleOrdinal()
    //     .range(['#0abdc6','#0F7EA1','#133e7c'])
    //     .domain([0, d3.max(vis.data, vis.data.distance)]);
        

    // vis.xScale = d3.scaleLinear();
    // vis.yScale = d3.scaleLinear();

    // Initialize axes
    vis.xAxis = d3.axisBottom(vis.xScale)
        .ticks(6)
        .tickSize(0)
        // .tickPadding(10)
        // .tickFormat(d => d + ' km');

    vis.yAxis = d3.axisLeft(vis.yScale)
        .ticks(6)
        .tickSizeOuter(0)
        // .tickPadding(10);

     // Define size of SVG drawing area
     vis.svg = d3.select(vis.config.parentElement)
     .attr('width', vis.config.containerWidth)
     .attr('height', vis.config.containerHeight);

    // SVG Group containing the actual chart; D3 margin convention
    vis.chart = vis.svg.append('g')
     .attr('transform', `translate(${vis.config.margin.left},${vis.config.margin.top})`);

    // Append empty x-axis group and move it to the bottom of the chart
    vis.xAxisG = vis.chart.append('g')
        .attr('class', 'axis x-axis');
    
    // Append y-axis group
    vis.yAxisG = vis.chart.append('g')
        .attr('class', 'axis y-axis');

    // // Append both axis titles
    // vis.xAxisTitle = vis.chart.append('text')
    //     .attr('class', 'axis-title')
    //     .attr('dy', '1.1em')
    //     .style('text-anchor', 'middle')
    //     .text('Earth Radius');

    // vis.yAxisTitle = vis.svg.append('text')
    //     .attr('class', 'axis-title')
    //     .attr('x', 0)
    //     .attr('y', 0)
    //     .attr('dy', '.71em')
    //     .text('Earth Mass');

        // Append axis title
    // vis.svg.append('text')
    // .attr('class', 'axis-title')
    // .attr('x', 0)
    // .attr('y', 0)
    // .attr('dy', '.71em')
    // // .style('fill', 'white')
    // .text(vis.title);
  }

  /**
   * Set the size of the SVG container, and prepare the data and scales before we render it.
   */
  updateVis() {
    let vis = this;

    // Update all dimensions based on the current screen size
    vis.config.containerWidth = document.getElementById(vis.config.parentElement.substring(1)).clientWidth;

    // Calculate inner chart size. Margin specifies the space around the actual chart.
    vis.config.width = vis.config.containerWidth - vis.config.margin.left - vis.config.margin.right;
    vis.config.height = vis.config.containerHeight - vis.config.margin.top - vis.config.margin.bottom;
    
    vis.svg
        .attr('width', vis.config.containerWidth)
        .attr('height', vis.config.containerHeight);

    vis.xAxisG
        .attr('transform', `translate(0,${vis.config.height})`);

    // vis.xAxisTitle
    //     .attr('y', vis.config.height - 15)
    //     .attr('x', vis.config.width + 10);

    vis.xAxis
        .tickSize(-vis.config.height - 10);

    vis.yAxis
        .tickSize(-vis.config.width - 10);
    
    // Specificy accessor functions
    // vis.colorValue = d => d.distance;
    vis.xValue = d => d.rad;
    vis.yValue = d => d.mass;

    // Set the scale input domains
    vis.xScale.domain([d3.min(vis.data, vis.xValue), d3.max(vis.data, vis.xValue)]);
    vis.yScale.domain([d3.min(vis.data, vis.yValue), d3.max(vis.data, vis.yValue)]);

        // Set the scale input domains
    // vis.xScale.domain(d3.extent(vis.data, vis.xValue));
    // vis.yScale.domain(d3.extent(vis.data, vis.yValue));

    //     vis.xScale.domain(d3.extent(vis.data, function(d) { return d.rad; }))
    //     vis.yScale.domain(d3.extent(vis.data, function(d) { return d.mass; }))
    //     vis.xScale
    //     .range([0, vis.config.width])
    //     .domain([0, 109.46]);
    
    // vis.yScale
    //     .range([vis.config.height, 0])
    //     .domain([0, 10.94]);

    vis.renderVis();
  }

  /**
   * Bind data to visual elements.
   */
  renderVis() {
    let vis = this;

   

    // console.log(d3.min(vis.data, vis.xValue)) // vis.xScale(d3.max(vis.data, vis.xValue))

    // Add circles
    const circles = vis.chart.selectAll('.point')
        .data(vis.data, d => d.name)
      .join('circle')
        .attr('class', 'point')
        .attr('r', 4)
        .attr('cy', d => vis.yScale(vis.yValue(d)))
        .attr('cx', d => vis.xScale(vis.xValue(d)))
        .attr('fill', d => d.color);
        
    // Tooltip event listeners
    circles
        .on('mouseover', (event,d) => {
          d3.select('#tooltip')
            .style('opacity', 1)
            .style('display', 'block')
            .style('left', (event.pageX + vis.config.tooltipPadding) + 'px')   
            .style('top', (event.pageY + vis.config.tooltipPadding) + 'px')
            .html(`
              <div class="tooltip-title">${d.name}</div>
                <p>${d.distance} pc</p>
                <p>${d.rad} ER : ${d.mass} EM</p>
            `);
        })
        .on('mouseleave', () => {
          d3.select('#tooltip').style('opacity', 0);
        });

    vis.chart.selectAll('.text')
        .data(vis.data, d => d.name)
        .join('text')
        .attr('class',"scatter_text")
        .text(d => d.label)
        .attr('x', d => vis.xScale(vis.xValue(d)) + d.labelXOffset)
        .attr('y', d => vis.yScale(vis.yValue(d)) + d.labelYOffset)
        // .attr('fill','#ea00d9');
    
    // Update the axes/gridlines
    // We use the second .call() to remove the axis and just show gridlines
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


