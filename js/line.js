class Line {

  constructor(_config, _data, _xlabel, _ylabel) {
    this.config = {
      parentElement: _config.parentElement,
      containerWidth: _config.containerWidth || 500,
      containerHeight: _config.containerHeight || 140,
      margin: { top: 10, bottom: 60, right: 60, left: 60 }
    }

    this.data = _data; 
    this.xlabel = _xlabel;
    this.ylabel = _ylabel;

    // Call a class function
    this.initVis();
  }

  initVis() {
    console.log("fuck?");
    
    let vis = this;

    vis.width = vis.config.containerWidth - vis.config.margin.left - vis.config.margin.right;
    vis.height = vis.config.containerHeight - vis.config.margin.top - vis.config.margin.bottom;

    vis.xScale = d3.scaleLinear()
        .range([0, vis.width]);

    vis.yScale = d3.scaleLinear()
        .range([vis.height, 0])
        .nice();

    // Initialize axes
    vis.xAxis = d3.axisBottom(vis.xScale)
        .ticks(6)
        .tickSizeOuter(0)
        .tickPadding(10)
        .tickFormat(d => d);

    vis.yAxis = d3.axisLeft(vis.yScale)
        .ticks(6)
        .tickSizeOuter(0)
        .tickPadding(10);

    // Define size of SVG drawing area
    vis.svg = d3.select(vis.config.parentElement)
        .attr('width', vis.config.containerWidth)
        .attr('height', vis.config.containerHeight);

    // Append group element that will contain our actual chart (see margin convention)
    vis.chart = vis.svg.append('g')
        .attr('transform', `translate(${vis.config.margin.left},${vis.config.margin.top})`);

    // Append empty x-axis group and move it to the bottom of the chart
    vis.xAxisG = vis.chart.append('g')
        .attr('class', 'axis x-axis')
        .attr('transform', `translate(0,${vis.height})`);
    
    // Append y-axis group
    vis.yAxisG = vis.chart.append('g')
        .attr('class', 'axis y-axis');



    //     // Construct a new ordinal scale with a range of ten categorical colours
    //   vis.colorPalette = d3.scaleOrdinal(d3.schemeTableau10);
    //   vis.colorPalette.domain( "tropical-cyclone", "drought-wildfire", "severe-storm", "flooding" );


    //     // Initialize axes
    //     vis.xAxis = d3.axisTop(vis.xScale);
    //     vis.yAxis = d3.axisLeft(vis.yScale);


    //     // Draw the axis
    //     vis.xAxisGroup = vis.chart.append('g')
    //       .attr('class', 'axis x-axis') 
    //       .call(vis.xAxis);

    //     vis.yAxisGroup = vis.chart.append('g')
    //       .attr('class', 'axis y-axis')
    //       .call(vis.yAxis);

    //     //Add circles for each event in the data
    //   vis.chart.selectAll('circle')
    //       .data(vis.data)
    //       .enter()
    //     .append('circle')
    //       .attr('fill', (d) => vis.colorPalette(d.category) )
    //       .attr('opacity', .8)
    //       .attr('stroke', "gray")
    //       .attr('stroke-width', 2)
    //       .attr('r', (d) => vis.rScale(d.cost) ) 
    //       .attr('cy', (d) => vis.yScale(d.year) ) 
    //       .attr('cx',(d) =>  vis.xScale(d.daysFromYrStart) );
    
    // Update stuff

    vis.xValue = d => d.year;
    vis.yValue = d => d.cost;

    // Initialize area generator
    vis.area = d3.area()
        .x(d => vis.xScale(vis.xValue(d)))
        .y1(d => vis.yScale(vis.yValue(d)))
        .y0(vis.height);

    vis.line = d3.line()
        .x(d => vis.xScale(vis.xValue(d)))
        .y(d => vis.yScale(vis.yValue(d)));

    // Set the scale input domains
    vis.xScale.domain(d3.extent(vis.data, vis.xValue));
    vis.yScale.domain(d3.extent(vis.data, vis.yValue));

    // Add area path
    // vis.chart.append('path')
    //     .data([vis.data])
    //     .attr('class', 'chart-area')
    //     .attr('d', vis.area);

    // Add line path
    vis.chart.append('path')
        .data([vis.data])
        .attr('class', 'chart-line')
        .attr('d', vis.line)
        // .attr('d', line(data))
        .attr('stroke', 'red')
        .attr('fill', 'none');
    
    // Update the axes
    vis.xAxisG.call(vis.xAxis);
    vis.yAxisG.call(vis.yAxis);

    console.log(vis.xlabel);
    vis.updateVis(); //leave this empty for now...
  }


  //leave this empty for now
 updateVis() { 
    console.log(this.xlabel);
   this.renderVis(); 

 }


 //leave this empty for now...
 renderVis() { 
    let vis = this;
    console.log(vis.xlabel);

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