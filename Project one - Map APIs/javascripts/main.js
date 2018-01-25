const apiUrl = 'https://developer.nrel.gov/api/windexchange/schoolprojects?api_key=BpwET3I8qcPGHgBcgcECMNuYXfDVEz3zwKN00w1f';

/* function takes in a city name, using ajax, call the api and
loop through all the data and find the city name that mathces
the passed in city name, returns src for the coordinates from that city */

let citiesData = null;

function Project(
  sourcemap,
  address,
  additionalResources,
  discussion,
  contactEmailAddress,
  contactName,
  contactPhone,
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
  this.address = $.trim(address);
  this.additionalResources = additionalResources;
  this.discussion = $.trim(discussion);
  this.contactEmailAddress = $.trim(contactEmailAddress);
  this.contactName = $.trim(contactName);
  this.contactPhone = $.trim(contactPhone);
  this.city = $.trim(city);
  this.countryName = $.trim(countryName);
  this.postalCode = postalCode;
  this.projectName = $.trim(projectName);
  this.projectType = $.trim(projectType);
  this.province = $.trim(province);
  this.status = $.trim(status);
  this.technologyDescription = $.trim(technologyDescription);
}

$.getJSON(apiUrl)
  .then((data) => {
    const locations = [];
    data.forEach((dataCity) => {
      locations.push(new Project(`<iframe width="425" height="350" frameborder="0" scrolling="no" marginheight="0" marginwidth="0" src="http://www.openstreetmap.org/export/embed.html?bbox=${dataCity.Longitude}%2C${dataCity.Latitude}&amp;layer=mapnik&amp;marker=${dataCity.Latitude}%2C${dataCity.Longitude}" style="border: 1px solid black"></iframe>`, dataCity.Address, dataCity.additionalResources, dataCity.Discussion, dataCity.ContactEmailAddress, dataCity.ContactName, dataCity.ContactPhone, dataCity.City, dataCity.CountryName, dataCity.PostalCode, dataCity.ProjectName, dataCity.ProjectType, dataCity.Province, dataCity.Status, dataCity.TechnologyDescription));
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
      if (item.city.toLowerCase() === searchCity.toLowerCase().trim()) {
        theProjects.push(item);
      }
    });
  }
  console.log(theProjects);
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
