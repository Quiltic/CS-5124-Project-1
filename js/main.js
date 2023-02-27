console.log("Hello world");

let valFilter = [];
let typeFilter = [];

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
        d.StarsInSystem = +d.sy_snum;
        d.PlanetsInSystem = +d.sy_pnum;
        d.DiscoveryMethod = d.discoverymethod;
        d.DiscoveryYear = d.disc_year;
        d.OrbitalPeriod = d.pl_orbper; // days
        d.OrbitSemiMajorAxis = d.pl_orbsmax; // au
        d.PlanetRadius = d.pl_rade; // Earth radius
        d.PlanetMass = d.pl_bmasse; // Earth mass
        d.Eccentricity = d.pl_orbeccen;
        d.StarType = d.st_spectype;
        d.StellarRadius = +d.st_rad; // solar rad
        d.StellarMass = +d.st_mass; // solar mass
        d.Distance = +d.sy_dist; // pc

  	});


    colorPalet = ['#711c91','#ea00d9','#7A5FD0','#0abdc6','#0F7EA1','#133e7c','#091833','#000000']


      const starScale = d3.scaleOrdinal()
      .domain(['1', '2', '3', '4'])
      .range(colorPalet.slice(0,3));
  
    // star_dat = getNumberOfThingInSystem(data,"StarsInSystem")
    // var star_dat = d3.rollups(data, g => g.length, d => d.StarsInSystem);
    // // console.log(star_dat);
    let widthitem = window.innerWidth/4 - 15;
    let heightitem = window.innerHeight/3;
    // console.log(widthitem);

    starChart = new Barchart({
        'parentElement': '#starbar',
        'containerHeight': heightitem,
        'containerWidth': widthitem,
        // 'reverseOrder': true,
        // 'yScaleLog': false
        'colors' : starScale
        }, getNumberOfThings(data,"StarsInSystem"), "StarsInSystem", false,"Star Count","Number of Stars in System",data); 
    starChart.updateVis();

    
    // console.log(planet_dat);

    const planetColor = d3.scaleOrdinal()
	.domain(['1', '2', '3', '4','5','6','7','8'])
	// https://www.color-hex.com/color-palette/29137
	.range(colorPalet);

    planetChart = new Barchart({
        'parentElement': '#planetbar',
        'containerHeight': heightitem,
        'containerWidth': widthitem,
        'colors' : planetColor,
        }, getNumberOfThings(data,"PlanetsInSystem"), "PlanetsInSystem",false,"Planet Count","Number of Planets in System",data); 
    planetChart.updateVis();



    const starTypeScale = d3.scaleOrdinal()
      .domain(['O','B','A','F','G','K','M','Missing'])
      .range(colorPalet);

    starTypesChart = new Barchart({
        'parentElement': '#startypebar',
        'containerHeight': heightitem,
        'containerWidth': widthitem,
        'reverseOrder': true,
        'colors' : starTypeScale,
        }, getStarType(data), "getstartype",false,"Star Type","Number of Stars",data); 
        starTypesChart.updateVis();

    const discoverScale = d3.scaleOrdinal()
      .domain(['Radial Velocity', 'Transit', 'Imaging', 'Eclipse Timing Variation', 'Astometry', 'Microlensing', 'Pulsar Timing', 'Orbital Brightness Modulation', 'Disk Kinematics', 'Pulsation Timing Variations'])
      .range(colorPalet);

    discoverChart = new Barchart({
        'parentElement': '#dicoverbar',
        'containerHeight': heightitem,
        'containerWidth': widthitem,
        'colors' : discoverScale,
        }, getNumberOfThings(data,"DiscoveryMethod"), "DiscoveryMethod", true,"Discovery Method","Discovery Count",data); 
    discoverChart.updateVis();

    habbitableChart = new dual_barchart({
        'parentElement': '#habbitbar',
        'containerHeight': heightitem,
        'containerWidth': widthitem,
        // 'colors' : planetColor,
        }, getHabitable(data), "Habitable", 'Star Type','Planet Count'); 
    habbitableChart.updateVis();


    distChart = new Histogram({
        'parentElement': '#distancehist',
        'containerHeight': heightitem,
        'containerWidth': widthitem,
        // 'colors' : planetColor,
        }, getMassRad(data), "Distance from Earth", "Distance (Parsec)", "Planet Count"); 
        distChart.updateVis();
    

    lineChart = new LineChart({ 
        'parentElement': '#timeline',
        'containerHeight': heightitem/2,
        'containerWidth': widthitem*2,
    }, getNumberOfThings(data,"DiscoveryYear"),"", "Discovery Year", "Dis Count");
    lineChart.updateVis();

    scatterplot = new Scatterplot({ 
        'parentElement': '#scatterplot',
        'containerHeight': heightitem,
        'containerWidth': widthitem*2,
    }, getMassRad(data), '', "Planet Mass (Earth Mass)", "Planet Radius (Earth Radius)");
    scatterplot.updateVis();

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
                if (d.st_spectype.includes(tp)) { // || d.st_spectype.includes(tp.toLowerCase())
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
    
    let data = dicToArr(totalp);

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

    // console.log(habit)
                
    return(spliceDic(habit,nohabit));
}


function spliceDic(d1,d2) {
    // this is lazy coding but i needed to do it quickly so
    let data = [];
    for (let tp in d1){
        data.push({"group":tp,"Habitable":d1[tp],"Not habitable":d2[tp]});
    }
    return(data);
}

function getMassRad(data_base) {

    let colorScale = d3.scaleOrdinal()
        .range(['#0abdc6','#0F7EA1','#133e7c'])
        .domain([0, d3.max(data_base, data_base.Distance)]);

    let data = [];

    data_base.forEach(d => {
        if (d.StellarRadius != 0 && d.StellarMass != 0) {
            data.push({"name": d.PlanetName,'label':'', 'mass':d.StellarMass, 'rad':d.StellarRadius, 'color':colorScale(d.Distance), 'distance':d.Distance})
        }
    })

    // this puts our data on top of the exoplanet data (you can see earth now!)
    data.push({name: "Mercury",label: "Mercury",mass: .0553,rad: .192,distance: "Our Solar System",labelYOffset: 15,labelXOffset: -30, 'color':'#ea00d9'});
    data.push({name: "Venus",label: "Venus",mass: .815,rad: .475,distance: "Our Solar System",labelYOffset: -5,labelXOffset: -25, 'color':'#ea00d9'});
    data.push({name: "Earth",label: "Earth",mass: 1,rad: 1,distance: "Our Solar System",labelYOffset: -15,labelXOffset: -25, 'color':'#ea00d9'});
    data.push({name: "Mars",label: "Mars",mass: .107,rad: .267,distance: "Our Solar System",labelYOffset: -10,labelXOffset: -20, 'color':'#ea00d9'});
    data.push({name: "Jupiter",label: "Jupiter",mass: 317.8,rad: 5.61,distance: "Our Solar System",labelYOffset: 5,labelXOffset: 5, 'color':'#ea00d9'});
    data.push({name: "Saturn",label: "Saturn",mass: 95.2,rad: 4.73,distance: "Our Solar System",labelYOffset: 5,labelXOffset: 5, 'color':'#ea00d9'});
    data.push({name: "Uranus",label: "Uranus",mass: 14.5,rad: 2.01,distance: "Our Solar System",labelYOffset: 10,labelXOffset: 2, 'color':'#ea00d9'});
    data.push({name: "Neptune",label: "Neptune",mass: 17.1,rad: 1.94,distance: "Our Solar System",labelYOffset: -5,labelXOffset: -40, 'color':'#ea00d9'});

    return(data);
}


function filterData(data_base, dfilter) {
    if (valFilter.length == 0) {
      
    starChart.data = getNumberOfThings(data_base,"StarsInSystem");
    planetChart.data = getNumberOfThings(data_base,"PlanetsInSystem");
    starTypesChart.data = getStarType(data_base);
    discoverChart.data = getNumberOfThings(data_base,"DiscoveryMethod");
    habbitableChart.data = getHabitable(data_base);
    distChart.data = getMassRad(data_base);
    lineChart.data = getNumberOfThings(data_base,"DiscoveryYear");
    scatterplot.data = getMassRad(data_base);
  

    } else {
        // console.log(data_base)
        let filtered_data = data_base

        // loop through the filters and update based on loop
        for (let i = 0; i < valFilter.length; i++){
            console.log(typeFilter[i])
            filtered_data = filtered_data.filter(d => valFilter.includes(d[typeFilter[i]]));
        }
        



        starChart.data = getNumberOfThings(filtered_data,"StarsInSystem");
        planetChart.data = getNumberOfThings(filtered_data,"PlanetsInSystem");
        starTypesChart.data = getStarType(filtered_data);
        discoverChart.data = getNumberOfThings(filtered_data,"DiscoveryMethod");
        habbitableChart.data = getHabitable(filtered_data);
        distChart.data = getMassRad(filtered_data);
        lineChart.data = getNumberOfThings(filtered_data,"DiscoveryYear");
        scatterplot.data = getMassRad(filtered_data);
    }


    starChart.updateVis()
    planetChart.updateVis()
    starTypesChart.updateVis()
    discoverChart.updateVis()
    habbitableChart.updateVis()
    distChart.updateVis()
    lineChart.updateVis()
    scatterplot.updateVis();
  }
  /*
  starChart getNumberOfThings(data,"StarsInSystem")
  planetChart getNumberOfThings(data,"PlanetsInSystem")
  starTypesChart getStarType(data)
  discoverChart getNumberOfThings(data,"DiscoveryMethod")
  habbitableChart getHabitable(data)
  distChart getMassRad(data)
  lineChart getNumberOfThings(data,"DiscoveryYear")
  scatterplot getMassRad(data_base)
  */