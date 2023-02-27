console.log("Hello world");

d3.csv('data/exo-all.csv')
  .then(data => {
  	console.log('Data loading complete. Work with dataset.');
    // console.log(data);
    

    let totalp = {'O':0, 'B':0, 'A':0, 'F':0, 'G':0, 'K':0, 'M':0, 'Missing': 0};

    //process the data - this is a forEach function.  You could also do a regular for loop.... 
    data.forEach(d => { //ARROW function - for each object in the array, pass it as a parameter to this function


       

        d.indx = d.indx;

        d.PlanetName = d.pl_name
        d.HostName = d.hostname
        d.SystemName = d.sys_name
        d.StarsInSystem = parseInt(d.sy_snum);
        d.PlanetsInSystem = parseInt(d.sy_pnum);
        d.DiscoveryMethod = d.discoverymethod;
        d.DiscoveryYear = d.disc_year;
        d.OrbitalPeriod = d.pl_orbper; // days
        d.OrbitSemiMajorAxis = d.pl_orbsmax; // au
        d.PlanetRadius = d.pl_rade; // Earth radius
        d.PlanetMass = d.pl_bmasse; // Earth mass
        d.Eccentricity = d.pl_orbeccen;
        d.StarType = d.st_spectype;
        d.StellarRadius = d.st_rad; // solar rad
        d.StellarMass = d.st_mass; // solar mass
        d.Distance = d.sy_dist; // pc

  	});

    //   const starScale = d3.scaleOrdinal()
    //   .domain(['1', '2', '3', '4'])
    //   // https://www.color-hex.com/color-palette/29137
    //   .range(['#961890', '#00508c', '#750884', '#00576d']);
  
    // star_dat = getNumberOfThingInSystem(data,"StarsInSystem")
    // var star_dat = d3.rollups(data, g => g.length, d => d.StarsInSystem);
    // // console.log(star_dat);

    let starChart = new Barchart({
        'parentElement': '#starbar',
        'containerHeight': 300,
        'containerWidth': 400,
        // 'reverseOrder': true,
        // 'yScaleLog': false
        // 'colorScale' : starScale
        }, getNumberOfThings(data,"StarsInSystem"), "Stars?"); 
    starChart.updateVis();

    
    // console.log(planet_dat);

    // const planetColor = d3.scaleOrdinal()
	// .domain(['1', '2', '3', '4','5','6','7'])
	// // https://www.color-hex.com/color-palette/29137
	// .range(['#961890', '#00508c', '#750884', '#00576d','#961800','#101890','#501890']);

    let planetChart = new Barchart({
        'parentElement': '#planetbar',
        'containerHeight': 300,
        'containerWidth': 400,
        // 'colors' : planetColor,
        }, getNumberOfThings(data,"PlanetsInSystem"), "Planets?"); 
    planetChart.updateVis();


    let starTypesChart = new Barchart({
        'parentElement': '#startypebar',
        'containerHeight': 300,
        'containerWidth': 400,
        // 'colors' : planetColor,
        }, getStarType(data), "Star Type"); 
        starTypesChart.updateVis();


    let discoverChart = new Barchart({
        'parentElement': '#dicoverbar',
        'containerHeight': 300,
        'containerWidth': 400,
        // 'colors' : planetColor,
        }, getNumberOfThings(data,"DiscoveryMethod"), "Discovory Method?"); 
    discoverChart.updateVis();

    // let habbitableChart = new Barchart({
    //     'parentElement': '#habbitbar',
    //     'containerHeight': 300,
    //     'containerWidth': 400,
    //     // 'colors' : planetColor,
    //     }, getHabitable(data)[0], "Habitable"); 
    // habbitableChart.updateVis();

})
.catch(error => {
    console.error(`Error loading the data ${error}`);
});



function getNumberOfThings(data_base, indx) {
    data = d3.rollups(data_base, g => g.length, d => d[indx]);
    //   console.log(vis.data)
    data = data.sort((a,b) => {
        return a[0] - b[0];
      });

    return(data)
}


function dicToArr(totalp) {
    // this is lazy coding but i needed to do it quickly so
    let data = [];
    for (let tp in totalp){
        data.push([tp,totalp[tp]]);
    }
    return(data);
}


function getStarType(data_base) {
    let totalp = {'O':0, 'B':0, 'A':0, 'F':0, 'G':0, 'K':0, 'M':0, 'Missing': 0};

    //process the data - this is a forEach function.  You could also do a regular for loop.... 
    data_base.forEach(d => {
     // for star typing
        let found = false;
        for (let tp in totalp){
            if (tp != 'Missing') {
                if (d.st_spectype.includes(tp) || d.st_spectype.includes(tp.toLowerCase())) {
                    d.star_type = tp;
                    totalp[tp] += 1;
                    found = true;
                    break;
                }
            }
        }

        // most of the star types are missing
        if (found == false) {
            d.star_type = 'Missing';
            totalp['Missing'] += 1;
        }
    })
    
    // let data = dicToArr(totalp);
    let data = [];
    for (let tp in totalp){
        data.push([tp,totalp[tp]]);
    }

    // console.log(data)

    return(data);
}

function getHabitable(data_base) {

    totalp = {'A':{"inner": 8.5, "outer": 12.5}, 
              'F':{"inner": 1.5, "outer": 2.2}, 
              'G':{"inner": 0.95, "outer": 1.4},
              'K':{"inner": 0.38, "outer": 0.56},
              'M':{"inner": 0.08, "outer": 0.12}}

    habit = {'A':0, 'F':0, 'G':0, 'K':0, 'M':0}
    nohabit = {'A':0, 'F':0, 'G':0, 'K':0, 'M':0}

    data_base.forEach(d => {

        for (let tp in totalp){
            if (d.st_spectype.includes(tp) || d.st_spectype.includes(tp.toLowerCase())) {
                if (totalp[tp]["outer"] > d.StellarRadius > totalp[tp]["inner"]) {
                    habit[tp] += 1;
                } else {
                    nohabit[tp] += 1;
                }
                break
            }
        }
    })
                
    return([dicToArr(habit),dicToArr(nohabit)]);
}
