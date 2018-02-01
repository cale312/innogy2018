// shool projects api variable
const apiUrl = 'https://developer.nrel.gov/api/windexchange/schoolprojects?api_key=BpwET3I8qcPGHgBcgcECMNuYXfDVEz3zwKN00w1f';

let citiesData = null;

const autoCompleteData = {};

// Class for creating a new project instance with its details for displaying to the dom
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

// Function for getting all the data from the api using
// ajax call and returns results in promise form
function getData() {
  return $.getJSON(apiUrl);
}

// Funtion that takes in a city name or addres and iterates through the data returned
// by the api to find the match by either adress or city name,
// the data is returned in array form with objects
const getLocation = (searchCity) => {
  const theProjects = [];
  if (searchCity.trim().length > 0) {
    citiesData.forEach((item) => {
      if (item.city.toLowerCase() === searchCity.toLowerCase().trim()) {
        theProjects.push(item);
      }
    });
  }
  return theProjects;
};

function AppViewModel() {
  const self = this;
  self.allCities = ko.observable([]);
  self.locations = ko.observable([]);
  self.alert = ko.observable();
  self.loader = ko.observable();
  self.data = ko.observable(false);
  self.loading = ko.observable('<center><br><div class="progress ligth"><div class="indeterminate" style="width: 50%"></div></div></center>');

  // Fire the getdata functiion and store
  // the data for easy access in an empty variable already sorted.
  getData()
    .then((data) => {
      const locations = [];
      data.forEach((dataCity) => {
        locations.push(new Project(`<iframe width="150%" height="350" frameborder="0" scrolling="no" marginheight="0" marginwidth="0" src="https://www.openstreetmap.org/export/embed.html?bbox=${dataCity.Longitude}%2C${dataCity.Latitude}&amp;layer=mapnik&amp;marker=${dataCity.Latitude}%2C${dataCity.Longitude}"></iframe>`, dataCity.Address, dataCity.AdditionalResources, dataCity.Discussion, dataCity.ContactEmailAddress, dataCity.ContactName, dataCity.ContactPhone, dataCity.City, dataCity.CountryName, dataCity.PostalCode, dataCity.ProjectName, dataCity.ProjectType, dataCity.Province, dataCity.Status, dataCity.TechnologyDescription));
        if (autoCompleteData[dataCity.City] === undefined) {
          autoCompleteData[dataCity.City] = null;
        }
      });
      self.allCities(locations);
      self.data(true);
      self.loading('');
      $(() => {
        $('.autocomplete').autocomplete({
          data: autoCompleteData,
        });
      });
      citiesData = locations;
    })
    .catch(err => err);

  // function fired when the search button is pressed
  // it takes in the typed in text and passes it in as an arguement for the getLocation function
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

