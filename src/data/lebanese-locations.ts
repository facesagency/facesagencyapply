export const governorates = [
  "Beirut",
  "Mount Lebanon",
  "North Lebanon",
  "South Lebanon",
  "Bekaa",
  "Nabatieh",
  "Akkar",
  "Baalbek-Hermel",
] as const;

export type Governorate = (typeof governorates)[number];

export const districtsByGovernorate: Record<Governorate, string[]> = {
  Beirut: ["Beirut"],
  "Mount Lebanon": ["Aley", "Baabda", "Byblos", "Chouf", "Keserwan", "Matn"],
  "North Lebanon": ["Batroun", "Bsharri", "Koura", "Miniyeh-Danniyeh", "Tripoli", "Zgharta"],
  "South Lebanon": ["Jezzine", "Sidon"],
  Bekaa: ["Rashaya", "Western Bekaa", "Zahle"],
  Nabatieh: ["Bint Jbeil", "Hasbaya", "Marjeyoun", "Nabatieh"],
  Akkar: ["Akkar"],
  "Baalbek-Hermel": ["Baalbek", "Hermel"],
};

export const areasByDistrict: Record<string, string[]> = {
  // Beirut
  "Beirut": [
    "Achrafieh", "Ain El Mreisseh", "Badaro", "Bachoura", "Basta", "Bourj Hammoud",
    "Clemenceau", "Corniche El Mazraa", "Dar El Mreisseh", "Downtown", "Furn El Chebbak",
    "Geitawi", "Gemmayzeh", "Hamra", "Horsh Beirut", "Karm El Zeitoun", "Karantina",
    "Khandak El Ghamik", "Koraytem", "Mar Elias", "Mar Mikhael", "Marfaa", "Mazraa",
    "Medawar", "Minet El Hosn", "Monot", "Moussaitbeh", "Msaytbeh", "Qantari",
    "Ras Beirut", "Ras El Nabeh", "Rmeil", "Saifi", "Sanayeh", "Sioufi", "Sodeco",
    "Spears", "Tallet El Khayat", "Tariq El Jdideh", "Verdun", "Zarif", "Zuqaq al-Blat"
  ],
  // Mount Lebanon - Aley
  "Aley": [
    "Aaley", "Abadieh", "Aramoun", "Bchamoun", "Bhamdoun", "Chouweifat", "Kahale",
    "Kfarmatta", "Souk El Gharb", "Wadi Chahrour"
  ],
  // Mount Lebanon - Baabda
  "Baabda": [
    "Baabda", "Baabdat", "Chiyah", "Furn El Chebbak", "Ghoubeyri", "Hadath",
    "Haret Hreik", "Hazmieh", "Yarze"
  ],
  // Mount Lebanon - Byblos (Jbeil)
  "Byblos": [
    "Amchit", "Byblos (Jbeil)", "Blat", "Fidar", "Hboub", "Kfar Mashoun", "Mastita"
  ],
  // Mount Lebanon - Chouf
  "Chouf": [
    "Damour", "Deir El Qamar", "Joun", "Kfar Nabrakh", "Moukhtara", "Naameh", "Roum"
  ],
  // Mount Lebanon - Keserwan
  "Keserwan": [
    "Adma", "Ajaltoun", "Ballouneh", "Faraya", "Feytroun", "Ghazir", "Ghosta",
    "Harissa", "Jeita", "Jounieh", "Kfardebian", "Mayrouba", "Rayfoun", "Sarba",
    "Tabarja", "Zouk Mikael", "Zouk Mosbeh"
  ],
  // Mount Lebanon - Matn
  "Matn": [
    "Ain Aar", "Ain Saadeh", "Antelias", "Beit Chabab", "Beit Mery", "Bhersaf",
    "Bikfaya", "Bkenaya", "Broummana", "Bsalim", "Cornet Chehwan", "Dbayeh",
    "Dekwaneh", "Dik El Mehdi", "Dora", "Fanar", "Jal El Dib", "Jdeideh",
    "Jisr El Bacha", "Mansourieh", "Mar Chaaya", "Mazraat Yachouh", "Mrouj",
    "Mtayleb", "Naccache", "New Rawda", "Rabiyeh", "Sad El Bouchrieh",
    "Sidn El Fil (Sin El Fil)", "Zalka"
  ],
  // North Lebanon - Batroun
  "Batroun": [
    "Anfeh", "Batroun", "Chekka", "Douma", "Kfour El Arabi", "Selaata", "Tannourine"
  ],
  // North Lebanon - Bsharri
  "Bsharri": [
    "Bcharreh", "Besharre", "El Arz", "Hadath El Jebbeh", "Hasroun", "Qadicha"
  ],
  // North Lebanon - Koura
  "Koura": [
    "Amioun", "Btouratij", "Kfarhazir", "Koura", "Kousba", "Ras Maska"
  ],
  // North Lebanon - Miniyeh-Danniyeh
  "Miniyeh-Danniyeh": [
    "Beddawi", "El Minieh", "Minnieh-Danniyeh", "Sir Ed Danniyeh"
  ],
  // North Lebanon - Tripoli
  "Tripoli": [
    "Mina (Port of Tripoli)", "Tripoli (Trablos)"
  ],
  // North Lebanon - Zgharta
  "Zgharta": [
    "Ehden", "Tourza", "Zgharta"
  ],
  // South Lebanon - Jezzine
  "Jezzine": [
    "Chhim", "Jezzine", "Kfar Houneh", "Roum"
  ],
  // South Lebanon - Sidon
  "Sidon": [
    "Abra", "Ain El Delb", "Bramieh", "Ghaziyeh", "Maghdouche", "Saida (Sidon)",
    "Sarafand", "Zahrani"
  ],
  // Bekaa - Rashaya
  "Rashaya": [
    "Rachaya", "Rachaya El Foukhar"
  ],
  // Bekaa - Western Bekaa
  "Western Bekaa": [
    "Joub Jannine", "Kamed El Loz", "Kefraya", "Khirbet Qanafar", "Machghara",
    "Mansoura", "Qaraoun", "Saghbine"
  ],
  // Bekaa - Zahle
  "Zahle": [
    "Aanjar", "Ablah", "Aitanit", "Bar Elias", "Chmistar", "Chtaura", "Ferzol",
    "Furzol", "Kab Elias", "Majdal Aanjar", "Rayak", "Saadnayel", "Sawfar",
    "Taanayel", "Taalabaya", "Terbol", "Zahle"
  ],
  // Nabatieh - Bint Jbeil
  "Bint Jbeil": [
    "Aytaroun", "Bint Jbeil", "Rmeish", "Tebnine"
  ],
  // Nabatieh - Hasbaya
  "Hasbaya": [
    "Hasbaya", "Shebaa"
  ],
  // Nabatieh - Marjeyoun
  "Marjeyoun": [
    "Deir Mimas", "Ebel El Saqi", "Ibl El Saqi", "Khiam", "Klayaa", "Marjayoun"
  ],
  // Nabatieh - Nabatieh
  "Nabatieh": [
    "Ansar", "Arab Salim", "Arnoun", "Harouf", "Jebchit", "Jwaya", "Kana",
    "Kfar Roummane", "Nabatieh City", "Tair Debba", "Yohmor"
  ],
  // Akkar
  "Akkar": [
    "Aandqet", "Akkar El Aatika", "Akroum", "Arqa", "Bebnine", "Beino", "Berqayel",
    "Bireh", "Bire Akkar", "Bqayaa", "Chadra", "Cheikh Ayash", "Cheikh Mohammad",
    "Cheikh Taba", "Deir Dalloum", "Fnaideq", "Halba", "Hissa", "Joumeh", "Kfartoun",
    "Kobayat", "Machha", "Machta Hassan", "Menjez", "Minyara", "Mqaybleh", "Rahbe",
    "Sammouniyeh", "Tal Abbas", "Tall Biri", "Wadi Khaled"
  ],
  // Baalbek-Hermel - Baalbek
  "Baalbek": [
    "Aarsal", "Baalbek City", "Bednayel", "Brital", "Chaat", "Chlifa", "Deir El Ahmar",
    "Douris", "El Ain", "El Fakiha", "El Labweh", "El Qaa", "Iaat", "Jenta",
    "Kfar Danis", "Labweh", "Nabi Chit", "Ras Baalbek", "Younine"
  ],
  // Baalbek-Hermel - Hermel
  "Hermel": [
    "Haour Taala", "Hermel City", "Maqneh", "Sarin", "Serghaya", "Taibe", "Taraya"
  ],
};

// Keep legacy export for backward compatibility
export const areasByGovernorate: Record<Governorate, string[]> = {
  Beirut: areasByDistrict["Beirut"],
  "Mount Lebanon": [
    ...areasByDistrict["Aley"],
    ...areasByDistrict["Baabda"],
    ...areasByDistrict["Byblos"],
    ...areasByDistrict["Chouf"],
    ...areasByDistrict["Keserwan"],
    ...areasByDistrict["Matn"],
  ],
  "North Lebanon": [
    ...areasByDistrict["Batroun"],
    ...areasByDistrict["Bsharri"],
    ...areasByDistrict["Koura"],
    ...areasByDistrict["Miniyeh-Danniyeh"],
    ...areasByDistrict["Tripoli"],
    ...areasByDistrict["Zgharta"],
  ],
  "South Lebanon": [
    ...areasByDistrict["Jezzine"],
    ...areasByDistrict["Sidon"],
  ],
  Bekaa: [
    ...areasByDistrict["Rashaya"],
    ...areasByDistrict["Western Bekaa"],
    ...areasByDistrict["Zahle"],
  ],
  Nabatieh: [
    ...areasByDistrict["Bint Jbeil"],
    ...areasByDistrict["Hasbaya"],
    ...areasByDistrict["Marjeyoun"],
    ...areasByDistrict["Nabatieh"],
  ],
  Akkar: areasByDistrict["Akkar"],
  "Baalbek-Hermel": [
    ...areasByDistrict["Baalbek"],
    ...areasByDistrict["Hermel"],
  ],
};

export const nationalities = [
  "Afghan",
  "Albanian",
  "Algerian",
  "American",
  "Andorran",
  "Angolan",
  "Antiguan",
  "Argentine",
  "Armenian",
  "Australian",
  "Austrian",
  "Azerbaijani",
  "Bahamian",
  "Bahraini",
  "Bangladeshi",
  "Barbadian",
  "Belarusian",
  "Belgian",
  "Belizean",
  "Beninese",
  "Bhutanese",
  "Bolivian",
  "Bosnian",
  "Botswanan",
  "Brazilian",
  "British",
  "Bruneian",
  "Bulgarian",
  "Burkinabe",
  "Burmese",
  "Burundian",
  "Cambodian",
  "Cameroonian",
  "Canadian",
  "Cape Verdean",
  "Central African",
  "Chadian",
  "Chilean",
  "Chinese",
  "Colombian",
  "Comoran",
  "Congolese",
  "Costa Rican",
  "Croatian",
  "Cuban",
  "Cypriot",
  "Czech",
  "Danish",
  "Djiboutian",
  "Dominican",
  "Dutch",
  "East Timorese",
  "Ecuadorean",
  "Egyptian",
  "Emirian",
  "Equatorial Guinean",
  "Eritrean",
  "Estonian",
  "Ethiopian",
  "Fijian",
  "Filipino",
  "Finnish",
  "French",
  "Gabonese",
  "Gambian",
  "Georgian",
  "German",
  "Ghanaian",
  "Greek",
  "Grenadian",
  "Guatemalan",
  "Guinean",
  "Guyanese",
  "Haitian",
  "Honduran",
  "Hungarian",
  "Icelandic",
  "Indian",
  "Indonesian",
  "Iranian",
  "Iraqi",
  "Irish",
  "Italian",
  "Ivorian",
  "Jamaican",
  "Japanese",
  "Jordanian",
  "Kazakh",
  "Kenyan",
  "Kuwaiti",
  "Kyrgyz",
  "Laotian",
  "Latvian",
  "Lebanese",
  "Liberian",
  "Libyan",
  "Liechtensteiner",
  "Lithuanian",
  "Luxembourger",
  "Macedonian",
  "Malagasy",
  "Malawian",
  "Malaysian",
  "Maldivian",
  "Malian",
  "Maltese",
  "Marshallese",
  "Mauritanian",
  "Mauritian",
  "Mexican",
  "Micronesian",
  "Moldovan",
  "Monacan",
  "Mongolian",
  "Montenegrin",
  "Moroccan",
  "Mozambican",
  "Namibian",
  "Nauruan",
  "Nepalese",
  "New Zealander",
  "Nicaraguan",
  "Nigerian",
  "Nigerien",
  "North Korean",
  "Norwegian",
  "Omani",
  "Pakistani",
  "Palauan",
  "Palestinian",
  "Panamanian",
  "Papua New Guinean",
  "Paraguayan",
  "Peruvian",
  "Polish",
  "Portuguese",
  "Qatari",
  "Romanian",
  "Russian",
  "Rwandan",
  "Saint Lucian",
  "Salvadoran",
  "Samoan",
  "San Marinese",
  "Sao Tomean",
  "Saudi",
  "Scottish",
  "Senegalese",
  "Serbian",
  "Seychellois",
  "Sierra Leonean",
  "Singaporean",
  "Slovak",
  "Slovenian",
  "Solomon Islander",
  "Somali",
  "South African",
  "South Korean",
  "South Sudanese",
  "Spanish",
  "Sri Lankan",
  "Sudanese",
  "Surinamese",
  "Swazi",
  "Swedish",
  "Swiss",
  "Syrian",
  "Taiwanese",
  "Tajik",
  "Tanzanian",
  "Thai",
  "Togolese",
  "Tongan",
  "Trinidadian",
  "Tunisian",
  "Turkish",
  "Turkmen",
  "Tuvaluan",
  "Ugandan",
  "Ukrainian",
  "Uruguayan",
  "Uzbek",
  "Vanuatuan",
  "Venezuelan",
  "Vietnamese",
  "Welsh",
  "Yemeni",
  "Zambian",
  "Zimbabwean",
];

export const languages = [
  "Arabic",
  "English",
  "French",
  "Armenian",
  "Spanish",
  "German",
  "Italian",
  "Russian",
  "Portuguese",
  "Turkish",
  "Persian",
  "Other",
];

export const eyeColors = [
  "Brown",
  "Blue",
  "Green",
  "Hazel",
  "Gray",
  "Amber",
  "Black",
  "Other",
];

export const hairColors = [
  "Black",
  "Brown",
  "Blonde",
  "Red",
  "Auburn",
  "Gray",
  "White",
  "Other",
];

export const hairTypes = [
  "Straight",
  "Wavy",
  "Curly",
  "Coily",
  "Kinky",
];

export const hairLengths = [
  "Bald",
  "Buzz Cut",
  "Short",
  "Medium",
  "Long",
  "Very Long",
];

export const skinTones = [
  "Fair",
  "Light",
  "Medium",
  "Olive",
  "Tan",
  "Brown",
  "Dark",
];

export const modelingTypes = [
  "Fashion Modeling",
  "Runway/Catwalk Modeling",
  "Editorial Modeling",
  "Catalog Modeling",
  "Swimwear Modeling",
  "Fitness Modeling",
  "Plus-Size Modeling",
  "Petite Modeling",
  "Hand Modeling",
  "Foot Modeling",
  "Hair Modeling",
  "Promotional Modeling",
  "Glamour Modeling",
  "Mature Modeling",
  "Child Modeling",
  "Teen Modeling",
  "Bridal Modeling",
  "Other",
];

export const talents = [
  // Acting Types
  "Film Acting",
  "TV Acting",
  "Theater Acting",
  "Voice Acting",
  "Commercial Acting",
  "Extra/Background Acting",
  "Stunt Acting",
  "Improv Acting",
  
  // Dancing Types
  "Ballet",
  "Contemporary Dance",
  "Hip Hop Dance",
  "Jazz Dance",
  "Salsa",
  "Bachata",
  "Tango",
  "Ballroom Dance",
  "Belly Dance",
  "Dabke (Lebanese Folk)",
  "Breakdancing",
  "Modern Dance",
  "Tap Dance",
  "Latin Dance",
  "Street Dance",
  "Pole Dance",
  "Aerial Dance",
  
  // Music & Singing
  "Singing (Pop)",
  "Singing (Classical/Opera)",
  "Singing (R&B/Soul)",
  "Singing (Arabic)",
  "Singing (Jazz)",
  "Singing (Rock)",
  "Rapping",
  "Beatboxing",
  "Piano",
  "Guitar",
  "Drums",
  "Violin",
  "Oud",
  "DJ",
  
  // Hosting & Presenting
  "TV Hosting",
  "Event Hosting/MC",
  "Radio Presenting",
  "Podcast Hosting",
  "Live Streaming",
  
  // Creative & Artistic
  "Photography",
  "Videography",
  "Painting",
  "Drawing/Illustration",
  "Graphic Design",
  "Fashion Design",
  "Makeup Artistry",
  "Hair Styling",
  "Nail Art",
  "Calligraphy",
  "Sculpture",
  
  // Performance & Entertainment
  "Stand-up Comedy",
  "Magic/Illusion",
  "Circus Arts",
  "Fire Performance",
  "Mime",
  "Puppetry",
  "Juggling",
  
  // Languages & Communication
  "Public Speaking",
  "Motivational Speaking",
  "Sign Language",
  "Foreign Language Fluency",
  
  // Other Skills
  "Cooking/Culinary Arts",
  "Bartending/Mixology",
  "Wine Sommelier",
  "Driving (Stunt/Precision)",
  "Motorcycling",
  
  "Other",
];

export const sports = [
  "Yoga",
  "Pilates",
  "CrossFit",
  "Bodybuilding",
  "Swimming",
  "Gymnastics",
  "Martial Arts",
  "Boxing",
  "Football/Soccer",
  "Basketball",
  "Tennis",
  "Running/Athletics",
  "Cycling",
  "Surfing",
  "Skiing/Snowboarding",
  "Rock Climbing",
  "Horseback Riding",
  "Skating (Ice/Roller)",
  "Skateboarding",
  "Other",
];

export const countryCodes = [
  { code: "+961", country: "Lebanon" },
  { code: "+1", country: "USA/Canada" },
  { code: "+44", country: "UK" },
  { code: "+33", country: "France" },
  { code: "+49", country: "Germany" },
  { code: "+971", country: "UAE" },
  { code: "+966", country: "Saudi Arabia" },
  { code: "+974", country: "Qatar" },
  { code: "+965", country: "Kuwait" },
  { code: "+973", country: "Bahrain" },
  { code: "+968", country: "Oman" },
  { code: "+962", country: "Jordan" },
  { code: "+20", country: "Egypt" },
  { code: "+90", country: "Turkey" },
  { code: "+61", country: "Australia" },
  { code: "+81", country: "Japan" },
  { code: "+86", country: "China" },
  { code: "+91", country: "India" },
  { code: "+55", country: "Brazil" },
  { code: "+52", country: "Mexico" },
  { code: "+34", country: "Spain" },
  { code: "+39", country: "Italy" },
  { code: "+31", country: "Netherlands" },
  { code: "+46", country: "Sweden" },
  { code: "+47", country: "Norway" },
  { code: "+41", country: "Switzerland" },
  { code: "+7", country: "Russia" },
  { code: "+27", country: "South Africa" },
  { code: "+234", country: "Nigeria" },
  { code: "+254", country: "Kenya" },
];
