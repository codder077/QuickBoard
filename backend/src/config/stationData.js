const stations = [
  {
    name: "New Delhi Railway Station",
    code: "NDLS", 
    location: {
      coordinates: [77.219, 28.6425],
    },
    nearbyStations: [], // Will be populated with references
  },
  {
    name: "Hazrat Nizamuddin",
    code: "NZM",
    location: {
      coordinates: [77.2507, 28.5883],
    },
  },
  {
    name: "Anand Vihar Terminal",
    code: "ANVT",
    location: {
      coordinates: [77.3159, 28.6468],
    },
  },
  {
    name: "Lucknow Junction",
    code: "LKO",
    location: {
      coordinates: [80.9462, 26.8316],
    },
  },
  {
    name: "Shimla",
    code: "SML",
    location: {
      coordinates: [77.1734, 31.0989],
    },
  },
  {
    name: "Una Himachal",
    code: "UHL",
    location: {
      coordinates: [76.2673, 31.4685],
    },
  },
  {
    name: "Amb Andaura",
    code: "AADR",
    location: {
      coordinates: [76.3851, 31.6839],
    },
  },
  {
    name: "Nangal Dam",
    code: "NLDM",
    location: {
      coordinates: [76.3735, 31.3851],
    },
  },
  {
    name: "Anandpur Sahib",
    code: "ANSB",
    location: {
      coordinates: [76.5026, 31.2394],
    },
  },
  {
    name: "Rupnagar",
    code: "RPAR",
    location: {
      coordinates: [76.5338, 30.9684],
    },
  },
  {
    name: "Kiratpur Sahib",
    code: "KPSR",
    location: {
      coordinates: [76.5927, 31.1957],
    },
  },
  {
    name: "Bharwain",
    code: "BRWN",
    location: {
      coordinates: [76.3412, 31.5623],
    },
  },
  {
    name: "Daulatpur Chowk",
    code: "DLPC",
    location: {
      coordinates: [76.2456, 31.5214],
    },
  },
  {
    name: "Gagret",
    code: "GGRT",
    location: {
      coordinates: [76.0623, 31.6584],
    },
  },
  {
    name: "Mehatpur",
    code: "MHPR",
    location: {
      coordinates: [76.3012, 31.4023],
    },
  },
  {
    name: "Tahliwal",
    code: "THLW",
    location: {
      coordinates: [76.3891, 31.4562],
    },
  },
  {
    name: "Chururu Takrala",
    code: "CRTK",
    location: {
      coordinates: [76.2891, 31.4912],
    },
  },
  {
    name: "Santoshgarh",
    code: "STGH",
    location: {
      coordinates: [76.3156, 31.5234],
    },
  },
  {
    name: "Basoli",
    code: "BSLI",
    location: {
      coordinates: [76.1923, 31.4123],
    },
  },
  {
    name: "Bangana",
    code: "BNGA",
    location: {
      coordinates: [76.1834, 31.3956],
    },
  },
  {
    name: "Mubarikpur",
    code: "MBKP",
    location: {
      coordinates: [76.2156, 31.4589],
    },
  },
  {
    name: "Panjawar",
    code: "PJWR",
    location: {
      coordinates: [76.2945, 31.4823],
    },
  },
  {
    name: "Dhundla",
    code: "DNDL",
    location: {
      coordinates: [76.3234, 31.4234],
    },
  },
  {
    name: "Santokhgarh",
    code: "SKGH",
    location: {
      coordinates: [76.3412, 31.3912],
    },
  },
  {
    name: "Nangran",
    code: "NGRN",
    location: {
      coordinates: [76.2734, 31.4345],
    },
  },
  {
    name: "Kanpur Central",
    code: "CNB",
    location: {
      coordinates: [80.3467, 26.4499],
    },
  },
  {
    name: "Varanasi Junction",
    code: "BSB", 
    location: {
      coordinates: [82.9739, 25.3176],
    },
  },
  {
    name: "Prayagraj Junction",
    code: "PRYJ",
    location: {
      coordinates: [81.8463, 25.4358],
    },
  },
  {
    name: "Gorakhpur Junction",
    code: "GKP",
    location: {
      coordinates: [83.3732, 26.7605],
    },
  },
  {
    name: "Agra Cantt",
    code: "AGC",
    location: {
      coordinates: [78.0081, 27.1567],
    },
  },
  {
    name: "Mathura Junction",
    code: "MTJ",
    location: {
      coordinates: [77.6721, 27.4924],
    },
  },
  {
    name: "Bareilly Junction",
    code: "BE",
    location: {
      coordinates: [79.4304, 28.3670],
    },
  },
  {
    name: "Moradabad Junction",
    code: "MB",
    location: {
      coordinates: [78.7870, 28.8386],
    },
  },
  {
    name: "Aligarh Junction",
    code: "ALJN",
    location: {
      coordinates: [78.0880, 27.8974],
    },
  },
  {
    name: "Meerut City",
    code: "MTC",
    location: {
      coordinates: [77.7064, 28.9845],
    },
  },
  {
    name: "Ghaziabad Junction",
    code: "GZB",
    location: {
      coordinates: [77.4162, 28.6692],
    },
  },
  {
    name: "Ayodhya Junction",
    code: "AY",
    location: {
      coordinates: [82.0066, 26.7922],
    },
  },
  {
    name: "Faizabad Junction",
    code: "FD",
    location: {
      coordinates: [82.1441, 26.7733],
    },
  },
  {
    name: "Sultanpur Junction",
    code: "SLN",
    location: {
      coordinates: [82.0722, 26.2647],
    },
  },
  {
    name: "Rae Bareli Junction",
    code: "RBL",
    location: {
      coordinates: [81.2333, 26.2333],
    },
  },
  {
    name: "Unnao Junction",
    code: "ON",
    location: {
      coordinates: [80.4878, 26.5437],
    },
  },
  {
    name: "Hardoi Junction",
    code: "HRI",
    location: {
      coordinates: [80.1333, 27.4167],
    },
  },
  {
    name: "Sitapur Junction",
    code: "STP",
    location: {
      coordinates: [80.6833, 27.5667],
    },
  },
  {
    name: "Barabanki Junction",
    code: "BBK",
    location: {
      coordinates: [81.1960, 26.9320],
    },
  },
  {
    name: "Lakhimpur Junction",
    code: "LMP",
    location: {
      coordinates: [80.7829, 27.9463],
    },
  },
  {
    name: "Shahjahanpur Junction",
    code: "SPN",
    location: {
      coordinates: [79.9128, 27.8828],
    },
  },
  {
    name: "Etawah Junction",
    code: "ETW",
    location: {
      coordinates: [79.0200, 26.7771],
    },
  },
  {
    name: "Mainpuri Junction",
    code: "MNQ",
    location: {
      coordinates: [79.0252, 27.2343],
    },
  },
  {
    name: "Farrukhabad Junction",
    code: "FBD",
    location: {
      coordinates: [79.5667, 27.3833],
    },
  },
  {
    name: "Fatehgarh Junction",
    code: "FGR",
    location: {
      coordinates: [79.6333, 27.3667],
    },
  },
  {
    name: "Kannauj Junction",
    code: "KNJ",
    location: {
      coordinates: [79.9167, 27.0500],
    },
  },
  {
    name: "Auraiya Junction",
    code: "AYA",
    location: {
      coordinates: [79.5167, 26.4667],
    },
  },
  {
    name: "Phaphund Junction",
    code: "PHD",
    location: {
      coordinates: [79.4667, 26.6000],
    },
  },
  {
    name: "Bharthana Junction",
    code: "BNA",
    location: {
      coordinates: [79.2167, 26.7500],
    },
  },
  {
    name: "Dibiyapur Junction",
    code: "DBR",
    location: {
      coordinates: [79.5500, 26.5333],
    },
  },
  {
    name: "Jhinjhak Junction",
    code: "JJK",
    location: {
      coordinates: [79.7333, 26.5667],
    },
  }
];

module.exports = stations;
