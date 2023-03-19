import vegaEmbed, { VisualizationSpec } from "vega-embed";

interface Cars {
  "Fuel Information": {
    "City mpg": number;
    "Fuel Type": string;
    "Highway mpg": number;
  };
  "Identification": {
    "Make": string,
    "Classification": string,
    "ID": string,
    "Year": number,}                 
"Engine Information": {
    "Hybrid": boolean,
    "Number of Forward Gears": number,
    "Driveline": string,
"Engine Statistics": {
  "Horsepower": number,
}
}
};

const dataString: string = await (await fetch('data/cars.json')).text();
const carData:  Cars[] = JSON.parse(dataString);


// Below is the shortened data set with only the information needed
interface shortCarData {
  MakeName: string,
  Classification: string,
  ID: string,
  Year: number,
  CityMPG: number,
  HighwayMPG: number,
  FuelType: string,
  Horsepower: number,
  Hybrid: boolean,
  ForwardGears: number,
  Driveline: string,
}

const newCarData: shortCarData[] = [];

for (const data of carData) {

newCarData.push({
  MakeName: data["Identification"]["Make"],
  Classification: data["Identification"]["Classification"],
  ID: data["Identification"]["ID"],
  Year: data["Identification"]["Year"],
  CityMPG: data["Fuel Information"]["City mpg"],
  HighwayMPG: data["Fuel Information"]["Highway mpg"],
  FuelType: data["Fuel Information"]["Fuel Type"],
  Horsepower: data["Engine Information"]["Engine Statistics"]["Horsepower"],
  Hybrid: data["Engine Information"]["Hybrid"],
  ForwardGears: data["Engine Information"]["Number of Forward Gears"],
  Driveline: data["Engine Information"]["Driveline"]
});
}

/*
console.log("The whole new data: ", newCarData);
const threeCars = newCarData.splice(0,3);
console.log("Viewing just the first four: ", threeCars);
*/


// -------------------------------
// Driveline type

interface DrivelinePie {
  Category: string,
  Amount: number
}

const drivelineData: DrivelinePie[] = [];

let totalAWD: number = 0;
let totalFWD: number = 0;
let totalRWD: number = 0;

for (const car of newCarData) {
  if(car["Driveline"] == "All-wheel drive") {
    totalAWD += 1;
  }
    if(car["Driveline"] == "Front-wheel drive") {
    totalFWD += 1;
  }
      if(car["Driveline"] == "Rear-wheel drive") {
    totalRWD += 1;
  }
  else {
     totalAWD += 0;
     totalFWD += 0;
     totalRWD += 0;
  }
};


drivelineData.push({
  Category: "All-Wheel Drive",
  Amount: totalAWD
});

drivelineData.push ({
  Category: "Front-Wheel Drive",
  Amount: totalFWD
});

drivelineData.push ({
  Category: "Rear-Wheel Drive",
  Amount: totalRWD
});

console.log("All-Wheel total: ", totalAWD);
console.log("Rear-Wheel total: ", totalRWD);
console.log("Front-Wheel total: ", totalFWD);

//Actual totals:
// AWD: 836
// RWD: 1751
// FWD: 1679

const drivelineDataPie: VisualizationSpec = {
  title: "Driveline of Hybrid Cars Pre-2015",
  data: {
    values: drivelineData,
  },
  mark: "arc",
  encoding: {
    theta: { field: "Amount", type: "quantitative"},
    color: { field: "Category", type: "nominal"}
  }
}

vegaEmbed('#drivelinePieChart', drivelineDataPie);

// -------------------------------
// Bar chart for car make with their average city mpg and average highway mpg

interface makesTotals {
  Make: string,
  CityAvg: number,
  HighwayAvg: number
}
/*
const makes: string[] = ["Audi", "Chevrolet", "Volvo", "BMW Motorrad", "Ford", "Toyota", "Mercedes", "Nissan", "Hyundai", "Volkswagen", "Honda", "Kia", "Subaru", "Jeep", "Cadillac", "Lexus", "Saab", "Porsche", "Bentley", "Maserati", "Chrysler", "Dodge", "Mazda", "Acura", "Mitsubishi", "GMC", "Lincoln", "Suzuki", "MINI", "Infiniti", "Mercedes-Benz", "AMG", "Aston Martin", "Rolls-Royce", "Buick", "Lamborghini", "Ferrari", "Jaguar"];
*/

const makes: string[] = ["AMG","Acura","Aston Martin","Audi","BMW Motorrad","Bentley","Buick","Cadillac","Chevrolet","Chrysler","Dodge","Ferrari","Ford","GMC","Honda","Hyundai","Infiniti","Jaguar","Jeep"]

const makesData: makesTotals[] = [];


for (const makeNames of makes) {
  
  let makeList: shortCarData[] = newCarData.filter(function (c) {
    return c['MakeName'] == makeNames});

  let makeCity: number = 0;
  let makeHighway: number = 0;

  let makeCityAvg: number = 0;
  let makeHighwayAvg: number = 0;

  
  if (makeList.length > 0) {
    
    makeCity = makeList.map(d => d['CityMPG'])
    .reduce((prev, next) => prev + next);
    
    makeHighway = makeList.map(d => d['HighwayMPG'])
    .reduce((prev, next) => prev + next);

    
  makeCityAvg = makeCity / makeList.length;
  makeHighwayAvg = makeHighway / makeList.length;
    
  }

  makesData.push({
  Make: makeNames,
  CityAvg: makeCityAvg,
  HighwayAvg: makeHighwayAvg
});
  
console.log("City mpg avg: ", makeCityAvg);
  
  }

console.log("makesData = ", makesData);

interface groupData {
  Make: string;
  Group: string;
  Value: number;
}
let makesGroupData: groupData[] = [];

for (const app of makesData) {

  makesGroupData.push ({
    Make: app['Make'],
    Group: "CityAvg",
    Value: app['CityAvg']
  });

    makesGroupData.push ({
    Make: app['Make'],
    Group: "HighwayAvg",
    Value: app['HighwayAvg']
  });
};

console.log("Group data: ", makesGroupData);


const makesCompareAvg: VisualizationSpec = {
  title: "Comparing City and Highway Average MPG for Each Make",
  data: {
    values: makesGroupData,
},
mark: {
  type: 'bar',
},
encoding: {
  x: {
    field: 'Make',
    type: 'nominal'
  },
  y: {
    field: 'Value', 
    type: 'quantitative'
  },
  xOffset: {
     field: 'Group',
     type: 'nominal'
  },
  color: {
    field: 'Group',
    type: 'nominal'
  }
}
} 
vegaEmbed('#makesCompareAvgMakesChart', makesCompareAvg);


// ------------------------------------
// Bar chart part 2 split

// -------------------------------
// Bar chart for car make with their average city mpg and average highway mpg

interface makesTotals2 {
  Make2: string,
  CityAvg2: number,
  HighwayAvg2: number
}

const makes2: string[] = ["Kia","Lamborghini","Lexus","Lincoln","MINI","Maserati","Mazda","Mercedes","Mercedes-Benz","Mitsubishi","Nissan","Porsche","Rolls-Royce","Saab","Subaru","Suzuki","Toyota","Volkswagen","Volvo"];


const makesData2: makesTotals2[] = [];


for (const makeNames2 of makes2) {
  
  let makeList2: shortCarData[] = newCarData.filter(function (c) {
    return c['MakeName'] == makeNames2});

  let makeCity2: number = 0;
  let makeHighway2: number = 0;

  let makeCityAvg2: number = 0;
  let makeHighwayAvg2: number = 0;

  
  if (makeList2.length > 0) {
    
    makeCity2 = makeList2.map(d => d['CityMPG'])
    .reduce((prev, next) => prev + next);
    
    makeHighway2 = makeList2.map(d => d['HighwayMPG'])
    .reduce((prev, next) => prev + next);

    
  makeCityAvg2 = makeCity2 / makeList2.length;
  makeHighwayAvg2 = makeHighway2 / makeList2.length;
    
  }

  makesData2.push({
  Make2: makeNames2,
  CityAvg2: makeCityAvg2,
  HighwayAvg2: makeHighwayAvg2
});
  
console.log("City mpg avg: ", makeCityAvg2);
  
  }

console.log("makesData2 = ", makesData2);

interface groupData2 {
  Make: string;
  Group: string;
  Value: number;
}
let makesGroupData2: groupData2[] = [];

for (const app of makesData2) {

  makesGroupData2.push ({
    Make: app['Make2'],
    Group: "CityAvg",
    Value: app['CityAvg2']
  });

    makesGroupData2.push ({
    Make: app['Make2'],
    Group: "HighwayAvg",
    Value: app['HighwayAvg2']
  });
};

console.log("Group data: ", makesGroupData2);


const makesCompareAvg2: VisualizationSpec = {
  title: "Comparing City and Highway Average MPG for Each Make",
  data: {
    values: makesGroupData2,
},
mark: {
  type: 'bar',
},
encoding: {
  x: {
    field: 'Make',
    type: 'nominal'
  },
  y: {
    field: 'Value', 
    type: 'quantitative'
  },
  xOffset: {
     field: 'Group',
     type: 'nominal'
  },
  color: {
    field: 'Group',
    type: 'nominal'
  }
}
} 
vegaEmbed('#makesCompareAvgMakesChart2', makesCompareAvg2);
// -------------------------------
// Colored scatter plot for fuel types

interface scatterPoints {
  FuelType: string,
  CityMPG: number,
  HighwayMPG: number
}

let scatterFuel: scatterPoints[] = [];

for (const app of newCarData) {

  scatterFuel.push ({
    FuelType: app["FuelType"],
    CityMPG:app["CityMPG"],
    HighwayMPG:app["HighwayMPG"],
  });

};
console.log("Fuel: ", scatterFuel);

const fuelMPG: VisualizationSpec = {
  title: "City and Highway MPG with Fuel Type Distinction",
  data: {
    values: scatterFuel,
},
mark: {
  type: 'point',
},
encoding: {
  /*
    x: {field: "CityMPG", type: "quantitative"},
    y: {field: "HighwayMPG", type: "quantitative"}
    */
  
  x: {
      field: "HighwayMPG",
      type: "quantitative",
      scale: {
        zero: false
      }
    },
    y: {
      field: "CityMPG",
      type: "quantitative",
      scale: {
        zero: false
      }
    },
    color: {
      field: "FuelType", 
      type: "nominal"
    },
    shape: {
      field: "FuelType", 
      type: "nominal"
    }
  }

};

vegaEmbed('#fuelScatterChart', fuelMPG);


