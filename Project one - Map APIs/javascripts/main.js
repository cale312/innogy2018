const apiUrl = 'https://developer.nrel.gov/api/windexchange/schoolprojects?api_key=BpwET3I8qcPGHgBcgcECMNuYXfDVEz3zwKN00w1f';

/* function takes in a city name, using ajax, call the api and
loop through all the data and find the city name that mathces
the passed in city name, returns src for the coordinates from that city */

let citiesData = null;

function Project(
  sourcemap,
  AdditionalResources,
  city,
  countryName,
  postalCode,
  projectName,
  projectType,
  province,
  status,
  technologyDescription,
) {
  this.sourcemap = sourcemap;
  this.AdditionalResources = AdditionalResources;
  this.city = city;
  this.countryName = countryName;
  this.postalCode = postalCode;
  this.projectName = projectName;
  this.projectType = projectType;
  this.province = province;
  this.status = status;
  this.technologyDescription = technologyDescription;
}

$.getJSON(apiUrl)
  .then((data) => {
    const locations = [];
    data.forEach((dataCity) => {
      locations.push(new Project(`http://www.openstreetmap.org/export/embed.html?bbox=${dataCity.Longitude},${dataCity.Latitude}&amp;layer=mapnik`, dataCity.AdditionalResources, dataCity.City, dataCity.CountryName, dataCity.PostalCode, dataCity.ProjectName, dataCity.ProjectType, dataCity.Province, dataCity.Status, dataCity.TechnologyDescription));
    });
    console.log('DATA LOADED!', locations);
    citiesData = locations;
  })
  .catch((err) => {
    console.error(err);
  });

const getLocation = (searchCity) => {
  const theProjects = [];
  if (searchCity.trim().length > 0) {
    citiesData.forEach((item) => {
      if (item.city.toLowerCase().trim() === searchCity.toLowerCase().trim()) {
        theProjects.push(item);
      }
    });
  }
  return theProjects;
};

function AppViewModel() {
  const self = this;
  self.locations = ko.observable([]);
  self.alert = ko.observable();
  self.loader = ko.observable();

  // Search function
  self.search = () => {
    self.loader('<div class="preloader-wrapper big active"><div class="spinner-layer spinner-green-only"><div class="circle-clipper left"><div class="circle"></div></div><div class="gap-patch"><div class="circle"></div></div><div class="circle-clipper right"><div class="circle"></div></div></div></div>');
    self.locations('');
    self.alert('');
    const city = $('.city').val();
    const locations = getLocation(city);
    if (locations.length > 0) {
      self.alert('');
    } else {
      setTimeout(() => {
        self.alert('Not found!');
      }, 2000);
    }
    setTimeout(() => {
      self.loader('');
      self.locations(locations);
    }, 2000);
  };
}

ko.applyBindings(new AppViewModel());
