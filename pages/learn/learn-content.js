(function () {

  // Helper to build a folder entry from key prefix and folder index
  function f(pre, fi, src) {
    return {
      name: pre + '_f' + fi + '_name',
      description: pre + '_f' + fi + '_desc',
      keyPoints: [0,1,2,3,4].map(function(i){ return pre+'_f'+fi+'_kp'+i; }),
      miniTask: pre + '_f' + fi + '_task',
      topics: [0,1,2,3,4,5].map(function(i){ return pre+'_f'+fi+'_tp'+i; }),
      sourceGroup: src
    };
  }

  window.LEARN_SOURCES = {

    // ─── Trusted source groups (shown as plain text, no external links) ──────
    core: {
      math:             ['Khan Academy','OpenStax Mathematics','GeoGebra',"Paul's Online Math Notes",'Brilliant.org'],
      physics:          ['OpenStax University Physics','PhET Simulations (U Colorado)','MIT OpenCourseWare Physics','HyperPhysics','Feynman Lectures Online'],
      chemistry:        ['Chemistry LibreTexts','Royal Society of Chemistry','OpenStax Chemistry 2e','ChemGuide','NIST WebBook'],
      biology:          ['OpenStax Biology 2e','HHMI BioInteractive','NCBI Bookshelf','Khan Academy Biology','CK-12 Biology'],
      cs:               ['CS50 Harvard','MIT OpenCourseWare CS','MDN Web Docs','freeCodeCamp','The Odin Project'],
      engineering:      ['MIT OpenCourseWare Engineering','NPTEL (IITs)','Engineering ToolBox','Open Textbook Library'],
      medicine:         ['MedlinePlus','WHO Learning Academy','PubMed','AMBOSS','Osmosis'],
      law:              ['Cornell Law LII','EUR-Lex','UN Treaty Collection','OYEZ','World Legal Information Institute'],
      economics:        ['CORE Econ','OpenStax Economics','World Bank Open Learning','IMF eLibrary','FRED Economic Data'],
      socialScience:    ['OECD Education','Our World in Data','UNESCO Statistics','JSTOR','Pew Research Center'],
      psychology:       ['APA PsycNET','Simply Psychology','OpenStax Psychology','Verywell Mind (Academic)'],
      writing:          ['Purdue OWL','Open Textbook Library','Saylor Academy'],
      earthScience:     ['NASA STEM','USGS Education','NOAA Education','ESA Education'],
      geography:        ['National Geographic Education','UN Data','World Bank Data','Esri ArcGIS Resources'],
      languageArts:     ['British Council Learn English','Cambridge Dictionary','Purdue OWL'],
      languageLearning: ['Institut français','Instituto Cervantes','Goethe-Institut','Confucius Institute','Arabic Language Centre'],
      arts:             ['The Met Museum Learning','Google Arts & Culture','Smarthistory','MoMA Learning'],
      health:           ['WHO','CDC','NHS Health A-Z','Harvard Health Publishing'],
      architecture:     ['MIT OpenCourseWare Architecture','RIBA','ArchDaily','Architecture Foundation'],
      philosophy:       ['Stanford Encyclopedia of Philosophy','Internet Encyclopedia of Philosophy','PhilPapers'],
      history:          ['Internet History Sourcebooks','JSTOR History','Europeana','Smithsonian Learning'],
      literature:       ['Project Gutenberg','Poetry Foundation','JSTOR Literature','The British Library'],
      linguistics:      ['Linguistic Society of America','SIL International','JSTOR Linguistics'],
      political:        ['Council on Foreign Relations','United Nations','Inter-Parliamentary Union','Freedom House'],
      environmental:    ['IPCC','UNEP','World Resources Institute','EarthWatch Institute'],
      pedagogy:         ['OECD Education','UNESCO Learning','Harvard Graduate School of Education','ERIC'],
      businessPolicy:   ['IMF','ILO','OECD Policy','Harvard Business Review'],
      cybersecurity:    ['NIST Cybersecurity','ENISA','CISA'],
    },

    // ═══════════════════════════════════════════════════════════════════════════
    //  SCHOOL  –  30 subjects, 3-9 folders each
    // ═══════════════════════════════════════════════════════════════════════════
    school: [

      // ── Mathematics ─ 9 folders ─────────────────────────────────────────────
      { id: 'mathematics', title: 'learnSch_mathematics_title', folders: [
        f('learnSch_mathematics',0,'math'),
        f('learnSch_mathematics',1,'math'),
        f('learnSch_mathematics',2,'math'),
        f('learnSch_mathematics',3,'math'),
        f('learnSch_mathematics',4,'math'),
        f('learnSch_mathematics',5,'math'),
        f('learnSch_mathematics',6,'math'),
        f('learnSch_mathematics',7,'math'),
        f('learnSch_mathematics',8,'math'),
      ]},

      // ── Physics ─ 7 folders ─────────────────────────────────────────────────
      { id: 'physics', title: 'learnSch_physics_title', folders: [
        f('learnSch_physics',0,'physics'),
        f('learnSch_physics',1,'physics'),
        f('learnSch_physics',2,'physics'),
        f('learnSch_physics',3,'physics'),
        f('learnSch_physics',4,'physics'),
        f('learnSch_physics',5,'physics'),
        f('learnSch_physics',6,'physics'),
      ]},

      // ── Chemistry ─ 7 folders ───────────────────────────────────────────────
      { id: 'chemistry', title: 'learnSch_chemistry_title', folders: [
        f('learnSch_chemistry',0,'chemistry'),
        f('learnSch_chemistry',1,'chemistry'),
        f('learnSch_chemistry',2,'chemistry'),
        f('learnSch_chemistry',3,'chemistry'),
        f('learnSch_chemistry',4,'chemistry'),
        f('learnSch_chemistry',5,'chemistry'),
        f('learnSch_chemistry',6,'chemistry'),
      ]},

      // ── Biology ─ 7 folders ─────────────────────────────────────────────────
      { id: 'biology', title: 'learnSch_biology_title', folders: [
        f('learnSch_biology',0,'biology'),
        f('learnSch_biology',1,'biology'),
        f('learnSch_biology',2,'biology'),
        f('learnSch_biology',3,'biology'),
        f('learnSch_biology',4,'biology'),
        f('learnSch_biology',5,'biology'),
        f('learnSch_biology',6,'biology'),
      ]},

      // ── Computer Science ─ 6 folders ────────────────────────────────────────
      { id: 'computer-science', title: 'learnSch_computer_science_title', folders: [
        f('learnSch_computer_science',0,'cs'),
        f('learnSch_computer_science',1,'cs'),
        f('learnSch_computer_science',2,'cs'),
        f('learnSch_computer_science',3,'cs'),
        f('learnSch_computer_science',4,'cs'),
        f('learnSch_computer_science',5,'cs'),
      ]},

      // ── Language Arts ─ 4 folders ───────────────────────────────────────────
      { id: 'language-arts', title: 'learnSch_language_arts_title', folders: [
        f('learnSch_language_arts',0,'languageArts'),
        f('learnSch_language_arts',1,'writing'),
        f('learnSch_language_arts',2,'languageArts'),
        f('learnSch_language_arts',3,'writing'),
      ]},

      // ── History ─ 5 folders ─────────────────────────────────────────────────
      { id: 'history', title: 'learnSch_history_title', folders: [
        f('learnSch_history',0,'history'),
        f('learnSch_history',1,'history'),
        f('learnSch_history',2,'history'),
        f('learnSch_history',3,'history'),
        f('learnSch_history',4,'history'),
      ]},

      // ── Geography ─ 4 folders ───────────────────────────────────────────────
      { id: 'geography', title: 'learnSch_geography_title', folders: [
        f('learnSch_geography',0,'geography'),
        f('learnSch_geography',1,'geography'),
        f('learnSch_geography',2,'geography'),
        f('learnSch_geography',3,'geography'),
      ]},

      // ── Economics ─ 4 folders ───────────────────────────────────────────────
      { id: 'economics', title: 'learnSch_economics_title', folders: [
        f('learnSch_economics',0,'economics'),
        f('learnSch_economics',1,'economics'),
        f('learnSch_economics',2,'economics'),
        f('learnSch_economics',3,'economics'),
      ]},

      // ── Earth Science ─ 4 folders ───────────────────────────────────────────
      { id: 'earth-science', title: 'learnSch_earth_science_title', folders: [
        f('learnSch_earth_science',0,'earthScience'),
        f('learnSch_earth_science',1,'earthScience'),
        f('learnSch_earth_science',2,'earthScience'),
        f('learnSch_earth_science',3,'earthScience'),
      ]},

      // ── Health Education ─ 3 folders ────────────────────────────────────────
      { id: 'health', title: 'learnSch_health_title', folders: [
        f('learnSch_health',0,'health'),
        f('learnSch_health',1,'health'),
        f('learnSch_health',2,'health'),
      ]},

      // ── Arts & Visual Art ─ 3 folders ───────────────────────────────────────
      { id: 'arts', title: 'learnSch_arts_title', folders: [
        f('learnSch_arts',0,'arts'),
        f('learnSch_arts',1,'arts'),
        f('learnSch_arts',2,'arts'),
      ]},

      // ── Music ─ 3 folders ───────────────────────────────────────────────────
      { id: 'music', title: 'learnSch_music_title', folders: [
        f('learnSch_music',0,'arts'),
        f('learnSch_music',1,'arts'),
        f('learnSch_music',2,'arts'),
      ]},

      // ── Physical Education ─ 3 folders ──────────────────────────────────────
      { id: 'physical-education', title: 'learnSch_physical_education_title', folders: [
        f('learnSch_physical_education',0,'health'),
        f('learnSch_physical_education',1,'health'),
        f('learnSch_physical_education',2,'health'),
      ]},

      // ── German Language ─ 3 folders ─────────────────────────────────────────
      { id: 'german-language', title: 'learnSch_german_language_title', folders: [
        f('learnSch_german_language',0,'languageLearning'),
        f('learnSch_german_language',1,'languageLearning'),
        f('learnSch_german_language',2,'languageLearning'),
      ]},

      // ── Religion & Ethics ─ 3 folders ───────────────────────────────────────
      { id: 'religion-ethics', title: 'learnSch_religion_ethics_title', folders: [
        f('learnSch_religion_ethics',0,'socialScience'),
        f('learnSch_religion_ethics',1,'socialScience'),
        f('learnSch_religion_ethics',2,'philosophy'),
      ]},

      // ── Social Studies ─ 3 folders ──────────────────────────────────────────
      { id: 'social-studies', title: 'learnSch_social_studies_title', folders: [
        f('learnSch_social_studies',0,'socialScience'),
        f('learnSch_social_studies',1,'socialScience'),
        f('learnSch_social_studies',2,'socialScience'),
      ]},

      // ── Philosophy ─ 3 folders ──────────────────────────────────────────────
      { id: 'philosophy', title: 'learnSch_philosophy_title', folders: [
        f('learnSch_philosophy',0,'philosophy'),
        f('learnSch_philosophy',1,'philosophy'),
        f('learnSch_philosophy',2,'philosophy'),
      ]},

      // ── Technology ─ 3 folders ──────────────────────────────────────────────
      { id: 'technology', title: 'learnSch_technology_title', folders: [
        f('learnSch_technology',0,'engineering'),
        f('learnSch_technology',1,'cs'),
        f('learnSch_technology',2,'cs'),
      ]},

      // ── Arabic Language ─ 3 folders ─────────────────────────────────────────
      { id: 'arabic-language', title: 'learnSch_arabic_language_title', folders: [
        f('learnSch_arabic_language',0,'languageLearning'),
        f('learnSch_arabic_language',1,'languageLearning'),
        f('learnSch_arabic_language',2,'languageLearning'),
      ]},

      // ── French Language ─ 3 folders ─────────────────────────────────────────
      { id: 'french-language', title: 'learnSch_french_language_title', folders: [
        f('learnSch_french_language',0,'languageLearning'),
        f('learnSch_french_language',1,'languageLearning'),
        f('learnSch_french_language',2,'languageLearning'),
      ]},

      // ── Spanish Language ─ 3 folders ────────────────────────────────────────
      { id: 'spanish-language', title: 'learnSch_spanish_language_title', folders: [
        f('learnSch_spanish_language',0,'languageLearning'),
        f('learnSch_spanish_language',1,'languageLearning'),
        f('learnSch_spanish_language',2,'languageLearning'),
      ]},

      // ── English as Foreign Language ─ 3 folders ─────────────────────────────
      { id: 'english-as-foreign-language', title: 'learnSch_english_as_foreign_language_title', folders: [
        f('learnSch_english_as_foreign_language',0,'languageArts'),
        f('learnSch_english_as_foreign_language',1,'languageArts'),
        f('learnSch_english_as_foreign_language',2,'languageArts'),
      ]},

      // ── Politics & Civics ─ 3 folders ─ [NEW] ───────────────────────────────
      { id: 'politics-civics', title: 'learnSch_politics_civics_title', folders: [
        f('learnSch_politics_civics',0,'political'),
        f('learnSch_politics_civics',1,'political'),
        f('learnSch_politics_civics',2,'political'),
      ]},

      // ── Psychology (School Level) ─ 3 folders ─ [NEW] ───────────────────────
      { id: 'psychology-school', title: 'learnSch_psychology_school_title', folders: [
        f('learnSch_psychology_school',0,'psychology'),
        f('learnSch_psychology_school',1,'psychology'),
        f('learnSch_psychology_school',2,'psychology'),
      ]},

      // ── Astronomy ─ 3 folders ─ [NEW] ───────────────────────────────────────
      { id: 'astronomy', title: 'learnSch_astronomy_title', folders: [
        f('learnSch_astronomy',0,'earthScience'),
        f('learnSch_astronomy',1,'earthScience'),
        f('learnSch_astronomy',2,'earthScience'),
      ]},

      // ── Latin Language ─ 3 folders ─ [NEW] ──────────────────────────────────
      { id: 'latin-language', title: 'learnSch_latin_language_title', folders: [
        f('learnSch_latin_language',0,'history'),
        f('learnSch_latin_language',1,'history'),
        f('learnSch_latin_language',2,'languageLearning'),
      ]},

      // ── Media Studies ─ 3 folders ─ [NEW] ───────────────────────────────────
      { id: 'media-studies', title: 'learnSch_media_studies_title', folders: [
        f('learnSch_media_studies',0,'writing'),
        f('learnSch_media_studies',1,'writing'),
        f('learnSch_media_studies',2,'cs'),
      ]},

      // ── Chinese Language ─ 3 folders ─ [NEW] ────────────────────────────────
      { id: 'chinese-language', title: 'learnSch_chinese_language_title', folders: [
        f('learnSch_chinese_language',0,'languageLearning'),
        f('learnSch_chinese_language',1,'languageLearning'),
        f('learnSch_chinese_language',2,'languageLearning'),
      ]},

      // ── Environmental Studies (School) ─ 3 folders ─ [NEW] ──────────────────
      { id: 'environmental-studies', title: 'learnSch_environmental_studies_title', folders: [
        f('learnSch_environmental_studies',0,'environmental'),
        f('learnSch_environmental_studies',1,'earthScience'),
        f('learnSch_environmental_studies',2,'environmental'),
      ]},

    ], // end school

    // ═══════════════════════════════════════════════════════════════════════════
    //  UNIVERSITY  –  24 subjects, 3-8 folders each
    // ═══════════════════════════════════════════════════════════════════════════
    university: [

      // ── Mathematics ─ 8 folders ─────────────────────────────────────────────
      { id: 'mathematics', title: 'learnUni_mathematics_title', folders: [
        f('learnUni_mathematics',0,'math'),
        f('learnUni_mathematics',1,'math'),
        f('learnUni_mathematics',2,'math'),
        f('learnUni_mathematics',3,'math'),
        f('learnUni_mathematics',4,'math'),
        f('learnUni_mathematics',5,'math'),
        f('learnUni_mathematics',6,'math'),
        f('learnUni_mathematics',7,'math'),
      ]},

      // ── Physics ─ 6 folders ─────────────────────────────────────────────────
      { id: 'physics', title: 'learnUni_physics_title', folders: [
        f('learnUni_physics',0,'physics'),
        f('learnUni_physics',1,'physics'),
        f('learnUni_physics',2,'physics'),
        f('learnUni_physics',3,'physics'),
        f('learnUni_physics',4,'physics'),
        f('learnUni_physics',5,'physics'),
      ]},

      // ── Chemistry ─ 5 folders ─ [NEW] ───────────────────────────────────────
      { id: 'chemistry', title: 'learnUni_chemistry_title', folders: [
        f('learnUni_chemistry',0,'chemistry'),
        f('learnUni_chemistry',1,'chemistry'),
        f('learnUni_chemistry',2,'chemistry'),
        f('learnUni_chemistry',3,'chemistry'),
        f('learnUni_chemistry',4,'chemistry'),
      ]},

      // ── Biology ─ 6 folders ─────────────────────────────────────────────────
      { id: 'biology', title: 'learnUni_biology_title', folders: [
        f('learnUni_biology',0,'biology'),
        f('learnUni_biology',1,'biology'),
        f('learnUni_biology',2,'biology'),
        f('learnUni_biology',3,'biology'),
        f('learnUni_biology',4,'biology'),
        f('learnUni_biology',5,'biology'),
      ]},

      // ── Computer Science ─ 6 folders ────────────────────────────────────────
      { id: 'computer-science', title: 'learnUni_computer_science_title', folders: [
        f('learnUni_computer_science',0,'cs'),
        f('learnUni_computer_science',1,'cs'),
        f('learnUni_computer_science',2,'cs'),
        f('learnUni_computer_science',3,'cs'),
        f('learnUni_computer_science',4,'cs'),
        f('learnUni_computer_science',5,'cs'),
      ]},

      // ── Economics ─ 5 folders ───────────────────────────────────────────────
      { id: 'economics', title: 'learnUni_economics_title', folders: [
        f('learnUni_economics',0,'economics'),
        f('learnUni_economics',1,'economics'),
        f('learnUni_economics',2,'economics'),
        f('learnUni_economics',3,'economics'),
        f('learnUni_economics',4,'economics'),
      ]},

      // ── Law ─ 5 folders ─ [NEW] ─────────────────────────────────────────────
      { id: 'law', title: 'learnUni_law_title', folders: [
        f('learnUni_law',0,'law'),
        f('learnUni_law',1,'law'),
        f('learnUni_law',2,'law'),
        f('learnUni_law',3,'law'),
        f('learnUni_law',4,'law'),
      ]},

      // ── Medicine & Pre-Med ─ 5 folders ─ [NEW] ──────────────────────────────
      { id: 'medicine', title: 'learnUni_medicine_title', folders: [
        f('learnUni_medicine',0,'medicine'),
        f('learnUni_medicine',1,'medicine'),
        f('learnUni_medicine',2,'medicine'),
        f('learnUni_medicine',3,'medicine'),
        f('learnUni_medicine',4,'medicine'),
      ]},

      // ── Psychology ─ 5 folders ─ [NEW] ──────────────────────────────────────
      { id: 'psychology', title: 'learnUni_psychology_title', folders: [
        f('learnUni_psychology',0,'psychology'),
        f('learnUni_psychology',1,'psychology'),
        f('learnUni_psychology',2,'psychology'),
        f('learnUni_psychology',3,'psychology'),
        f('learnUni_psychology',4,'psychology'),
      ]},

      // ── Sociology ─ 4 folders ─ [NEW] ───────────────────────────────────────
      { id: 'sociology', title: 'learnUni_sociology_title', folders: [
        f('learnUni_sociology',0,'socialScience'),
        f('learnUni_sociology',1,'socialScience'),
        f('learnUni_sociology',2,'socialScience'),
        f('learnUni_sociology',3,'socialScience'),
      ]},

      // ── History ─ 4 folders ─ [NEW] ─────────────────────────────────────────
      { id: 'history', title: 'learnUni_history_title', folders: [
        f('learnUni_history',0,'history'),
        f('learnUni_history',1,'history'),
        f('learnUni_history',2,'history'),
        f('learnUni_history',3,'history'),
      ]},

      // ── Philosophy ─ 5 folders ─ [NEW] ──────────────────────────────────────
      { id: 'philosophy', title: 'learnUni_philosophy_title', folders: [
        f('learnUni_philosophy',0,'philosophy'),
        f('learnUni_philosophy',1,'philosophy'),
        f('learnUni_philosophy',2,'philosophy'),
        f('learnUni_philosophy',3,'philosophy'),
        f('learnUni_philosophy',4,'philosophy'),
      ]},

      // ── Political Science ─ 4 folders ─ [NEW] ───────────────────────────────
      { id: 'political-science', title: 'learnUni_political_science_title', folders: [
        f('learnUni_political_science',0,'political'),
        f('learnUni_political_science',1,'political'),
        f('learnUni_political_science',2,'political'),
        f('learnUni_political_science',3,'political'),
      ]},

      // ── Architecture ─ 4 folders ─ [NEW] ────────────────────────────────────
      { id: 'architecture', title: 'learnUni_architecture_title', folders: [
        f('learnUni_architecture',0,'architecture'),
        f('learnUni_architecture',1,'architecture'),
        f('learnUni_architecture',2,'architecture'),
        f('learnUni_architecture',3,'architecture'),
      ]},

      // ── Engineering ─ 5 folders ─ [NEW] ─────────────────────────────────────
      { id: 'engineering', title: 'learnUni_engineering_title', folders: [
        f('learnUni_engineering',0,'engineering'),
        f('learnUni_engineering',1,'engineering'),
        f('learnUni_engineering',2,'engineering'),
        f('learnUni_engineering',3,'engineering'),
        f('learnUni_engineering',4,'engineering'),
      ]},

      // ── Business Administration ─ 5 folders ─ [NEW] ─────────────────────────
      { id: 'business-administration', title: 'learnUni_business_administration_title', folders: [
        f('learnUni_business_administration',0,'businessPolicy'),
        f('learnUni_business_administration',1,'businessPolicy'),
        f('learnUni_business_administration',2,'economics'),
        f('learnUni_business_administration',3,'businessPolicy'),
        f('learnUni_business_administration',4,'businessPolicy'),
      ]},

      // ── Linguistics ─ 4 folders ─ [NEW] ─────────────────────────────────────
      { id: 'linguistics', title: 'learnUni_linguistics_title', folders: [
        f('learnUni_linguistics',0,'linguistics'),
        f('learnUni_linguistics',1,'linguistics'),
        f('learnUni_linguistics',2,'linguistics'),
        f('learnUni_linguistics',3,'linguistics'),
      ]},

      // ── Literature ─ 4 folders ─ [NEW] ──────────────────────────────────────
      { id: 'literature', title: 'learnUni_literature_title', folders: [
        f('learnUni_literature',0,'literature'),
        f('learnUni_literature',1,'literature'),
        f('learnUni_literature',2,'literature'),
        f('learnUni_literature',3,'literature'),
      ]},

      // ── Environmental Science ─ 4 folders ─ [NEW] ───────────────────────────
      { id: 'environmental-science', title: 'learnUni_environmental_science_title', folders: [
        f('learnUni_environmental_science',0,'environmental'),
        f('learnUni_environmental_science',1,'biology'),
        f('learnUni_environmental_science',2,'earthScience'),
        f('learnUni_environmental_science',3,'environmental'),
      ]},

      // ── Education & Pedagogy ─ 4 folders ─ [NEW] ────────────────────────────
      { id: 'education-pedagogy', title: 'learnUni_education_pedagogy_title', folders: [
        f('learnUni_education_pedagogy',0,'pedagogy'),
        f('learnUni_education_pedagogy',1,'pedagogy'),
        f('learnUni_education_pedagogy',2,'pedagogy'),
        f('learnUni_education_pedagogy',3,'pedagogy'),
      ]},

      // ── Statistics & Data Science ─ 4 folders ─ [NEW] ───────────────────────
      { id: 'statistics-data-science', title: 'learnUni_statistics_data_science_title', folders: [
        f('learnUni_statistics_data_science',0,'math'),
        f('learnUni_statistics_data_science',1,'math'),
        f('learnUni_statistics_data_science',2,'cs'),
        f('learnUni_statistics_data_science',3,'math'),
      ]},

      // ── Cybersecurity ─ 4 folders ─ [NEW] ───────────────────────────────────
      { id: 'cybersecurity', title: 'learnUni_cybersecurity_title', folders: [
        f('learnUni_cybersecurity',0,'cybersecurity'),
        f('learnUni_cybersecurity',1,'cybersecurity'),
        f('learnUni_cybersecurity',2,'cybersecurity'),
        f('learnUni_cybersecurity',3,'cs'),
      ]},

      // ── Social Work ─ 3 folders ─ [NEW] ─────────────────────────────────────
      { id: 'social-work', title: 'learnUni_social_work_title', folders: [
        f('learnUni_social_work',0,'socialScience'),
        f('learnUni_social_work',1,'socialScience'),
        f('learnUni_social_work',2,'pedagogy'),
      ]},

      // ── Nutrition & Dietetics ─ 3 folders ─ [NEW] ───────────────────────────
      { id: 'nutrition-dietetics', title: 'learnUni_nutrition_dietetics_title', folders: [
        f('learnUni_nutrition_dietetics',0,'medicine'),
        f('learnUni_nutrition_dietetics',1,'biology'),
        f('learnUni_nutrition_dietetics',2,'health'),
      ]},

    ], // end university

  };

})();
