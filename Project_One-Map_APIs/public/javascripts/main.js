// shool projects api variable
const apiUrl = 'https://developer.nrel.gov/api/windexchange/schoolprojects?api_key=BpwET3I8qcPGHgBcgcECMNuYXfDVEz3zwKN00w1f';

let citiesData = null;

const autoCompleteData = {};

// Class for creating a new project instance with its details for displaying to the dom
function ProjectDetails(
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
const getLocations = (searchCity) => {
  const schoolProjects = [];
  if (searchCity.trim().length > 0) {
    citiesData.forEach((item) => {
      if (item.city.toLowerCase() === searchCity.toLowerCase().trim()) {
        schoolProjects.push(item);
      }
    });
  }
  return schoolProjects;
};

function AppViewModel() {
  const self = this;
  self.allProjects = ko.observable([]);
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
      data.forEach((schoolProjectData) => {
        locations.push(new ProjectDetails(`<iframe width="150%" height="350" frameborder="0" scrolling="no" marginheight="0" marginwidth="0" src="https://www.openstreetmap.org/export/embed.html?bbox=${schoolProjectData.Longitude}%2C${schoolProjectData.Latitude}&amp;layer=mapnik&amp;marker=${schoolProjectData.Latitude}%2C${schoolProjectData.Longitude}"></iframe>`, schoolProjectData.Address, schoolProjectData.AdditionalResources, schoolProjectData.Discussion, schoolProjectData.ContactEmailAddress, schoolProjectData.ContactName, schoolProjectData.ContactPhone, schoolProjectData.City, schoolProjectData.CountryName, schoolProjectData.PostalCode, schoolProjectData.ProjectName, schoolProjectData.ProjectType, schoolProjectData.Province, schoolProjectData.Status, schoolProjectData.TechnologyDescription));
        if (autoCompleteData[schoolProjectData.City] === undefined) {
          autoCompleteData[schoolProjectData.City] = null;
        }
      });
      self.allProjects(locations);
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
  // it takes in the typed in text and passes it in as an arguement for the getLocations function
  self.search = () => {
    self.loader('<div class="preloader-wrapper big active"><div class="spinner-layer spinner-green-only"><div class="circle-clipper left"><div class="circle"></div></div><div class="gap-patch"><div class="circle"></div></div><div class="circle-clipper right"><div class="circle"></div></div></div></div>');
    self.locations('');
    self.alert('');
    const city = $('.city').val();
    const locations = getLocations(city);
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
