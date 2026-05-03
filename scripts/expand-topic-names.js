'use strict';
/**
 * expand-topic-names.js
 * Adds tp3, tp4, tp5 topic title keys for every subject folder (school + uni).
 * Run: node scripts/expand-topic-names.js
 */
const fs   = require('fs');
const path = require('path');
const EN   = path.join(__dirname, '..', 'locales', 'en.json');
const en   = JSON.parse(fs.readFileSync(EN, 'utf8'));

const add = {};

// ─── helper ──────────────────────────────────────────────────────────────────
function set(key, val) { if (!en[key]) add[key] = val; }

// =============================================================================
//  SCHOOL
// =============================================================================

// ── Mathematics ──────────────────────────────────────────────────────────────
set('learnSch_mathematics_f0_tp3','Quadratic equations and the quadratic formula');
set('learnSch_mathematics_f0_tp4','Inequalities and number lines');
set('learnSch_mathematics_f0_tp5','Systems of linear equations');
set('learnSch_mathematics_f1_tp3','Circle theorems and properties');
set('learnSch_mathematics_f1_tp4','Area, perimeter, and surface area');
set('learnSch_mathematics_f1_tp5','Volume and 3D solid geometry');
set('learnSch_mathematics_f2_tp3','Measures of central tendency and spread');
set('learnSch_mathematics_f2_tp4','Scatter diagrams and correlation');
set('learnSch_mathematics_f2_tp5','Normal distribution and standardisation');
set('learnSch_mathematics_f3_tp3','Trigonometric identities');
set('learnSch_mathematics_f3_tp4','The sine rule and cosine rule');
set('learnSch_mathematics_f3_tp5','Solving trigonometric equations');
set('learnSch_mathematics_f4_tp3','Modular arithmetic and congruences');
set('learnSch_mathematics_f4_tp4','Rational, irrational, and real numbers');
set('learnSch_mathematics_f4_tp5','Number bases and binary arithmetic');
set('learnSch_mathematics_f5_tp3','Cross product and geometric area');
set('learnSch_mathematics_f5_tp4','Lines and planes in 3D');
set('learnSch_mathematics_f5_tp5','Vector projections and scalar resolutes');
set('learnSch_mathematics_f6_tp3','Sigma notation and telescoping sums');
set('learnSch_mathematics_f6_tp4','Fibonacci and recurrence relations');
set('learnSch_mathematics_f6_tp5','Convergence and sum to infinity');
set('learnSch_mathematics_f7_tp3','Chain rule and implicit differentiation');
set('learnSch_mathematics_f7_tp4','Second derivatives and concavity');
set('learnSch_mathematics_f7_tp5',"L'Hôpital's rule and related rates");
set('learnSch_mathematics_f8_tp3','Integration by substitution');
set('learnSch_mathematics_f8_tp4','Integration by parts');
set('learnSch_mathematics_f8_tp5','Volumes of revolution');

// ── Physics ───────────────────────────────────────────────────────────────────
set('learnSch_physics_f0_tp3','Momentum and impulse');
set('learnSch_physics_f0_tp4','Circular motion and centripetal force');
set('learnSch_physics_f0_tp5','Projectile motion');
set('learnSch_physics_f1_tp3','Ohm\'s law, resistance, and resistivity');
set('learnSch_physics_f1_tp4','Electromagnetic induction and Faraday\'s law');
set('learnSch_physics_f1_tp5','Capacitors and AC circuits');
set('learnSch_physics_f2_tp3','Wave properties: frequency, wavelength, amplitude');
set('learnSch_physics_f2_tp4','Diffraction, interference, and superposition');
set('learnSch_physics_f2_tp5','The electromagnetic spectrum');
set('learnSch_physics_f3_tp3','The gas laws: Boyle, Charles, Gay-Lussac');
set('learnSch_physics_f3_tp4','Specific heat capacity and latent heat');
set('learnSch_physics_f3_tp5','Thermal radiation and the Stefan-Boltzmann law');
set('learnSch_physics_f4_tp3','Mass defect and nuclear binding energy');
set('learnSch_physics_f4_tp4','Radiation dosimetry and safety');
set('learnSch_physics_f4_tp5','Medical and industrial applications of nuclear physics');
set('learnSch_physics_f5_tp3','The Schrödinger equation and probability clouds');
set('learnSch_physics_f5_tp4','Pauli exclusion principle and electron orbitals');
set('learnSch_physics_f5_tp5','Quantum tunnelling and the scanning tunnelling microscope');
set('learnSch_physics_f6_tp3','Spacetime diagrams and Minkowski space');
set('learnSch_physics_f6_tp4','Lorentz transformations');
set('learnSch_physics_f6_tp5','General relativity and gravitational waves');

// ── Chemistry ─────────────────────────────────────────────────────────────────
set('learnSch_chemistry_f0_tp3','Electron configuration and orbital notation');
set('learnSch_chemistry_f0_tp4','Ionic and covalent bonding in detail');
set('learnSch_chemistry_f0_tp5','Intermolecular forces: van der Waals and hydrogen bonding');
set('learnSch_chemistry_f1_tp3','Enthalpy changes and Hess\'s law');
set('learnSch_chemistry_f1_tp4','Types of chemical reactions');
set('learnSch_chemistry_f1_tp5','Catalysis and activation energy');
set('learnSch_chemistry_f2_tp3','Strong vs weak acids and Ka');
set('learnSch_chemistry_f2_tp4','Buffer solutions and Henderson-Hasselbalch equation');
set('learnSch_chemistry_f2_tp5','Solubility product Ksp');
set('learnSch_chemistry_f3_tp3','Isomerism: structural and stereoisomerism');
set('learnSch_chemistry_f3_tp4','Alcohols, ketones, and aldehydes');
set('learnSch_chemistry_f3_tp5','Carboxylic acids, esters, and amides');
set('learnSch_chemistry_f4_tp3','Standard electrode potentials and EMF');
set('learnSch_chemistry_f4_tp4','Electroplating and electrorefining');
set('learnSch_chemistry_f4_tp5','Fuel cells and the hydrogen economy');
set('learnSch_chemistry_f5_tp3','Reaction quotient Q and equilibrium direction');
set('learnSch_chemistry_f5_tp4','Solubility equilibria and the common ion effect');
set('learnSch_chemistry_f5_tp5','Acid-base equilibria and Ka/Kb');
set('learnSch_chemistry_f6_tp3','Plastics, microplastics, and polymer pollution');
set('learnSch_chemistry_f6_tp4','Green chemistry principles and atom economy');
set('learnSch_chemistry_f6_tp5','Atmospheric chemistry and ozone layer');

// ── Biology ───────────────────────────────────────────────────────────────────
set('learnSch_biology_f0_tp3','Cell membrane structure and selective permeability');
set('learnSch_biology_f0_tp4','Cellular respiration: glycolysis, Krebs cycle, ETC');
set('learnSch_biology_f0_tp5','Enzyme kinetics and inhibition');
set('learnSch_biology_f1_tp3','The nervous system and neural signalling');
set('learnSch_biology_f1_tp4','The endocrine system and hormones');
set('learnSch_biology_f1_tp5','Reproduction and human development');
set('learnSch_biology_f2_tp3','Nutrient cycles: carbon, nitrogen, and phosphorus');
set('learnSch_biology_f2_tp4','Population dynamics and carrying capacity');
set('learnSch_biology_f2_tp5','Biodiversity and conservation biology');
set('learnSch_biology_f3_tp3','Mutations and genetic disorders');
set('learnSch_biology_f3_tp4','DNA profiling, PCR, and gel electrophoresis');
set('learnSch_biology_f3_tp5','Genetic engineering and CRISPR');
set('learnSch_biology_f4_tp3','Darwin, Wallace, and the theory of natural selection');
set('learnSch_biology_f4_tp4','The fossil record and transitional fossils');
set('learnSch_biology_f4_tp5','Human evolution and phylogenetics');
set('learnSch_biology_f5_tp3','Plant hormones: auxin, gibberellin, abscisic acid');
set('learnSch_biology_f5_tp4','Leaf structure, stomata, and transpiration');
set('learnSch_biology_f5_tp5','Flowering, pollination, and seed dispersal');
set('learnSch_biology_f6_tp3','Pathogens and the chain of infection');
set('learnSch_biology_f6_tp4','Fungal biology and the human microbiome');
set('learnSch_biology_f6_tp5','Biotechnology: fermentation, bioreactors, and insulin');

// ── Computer Science ──────────────────────────────────────────────────────────
set('learnSch_computer_science_f0_tp3','Pattern recognition and generalisation');
set('learnSch_computer_science_f0_tp4','Flowcharts and pseudocode');
set('learnSch_computer_science_f0_tp5','Top-down and bottom-up design strategies');
set('learnSch_computer_science_f1_tp3','Conditionals and Boolean logic');
set('learnSch_computer_science_f1_tp4','Lists, arrays, and dictionaries');
set('learnSch_computer_science_f1_tp5','Object-oriented programming basics');
set('learnSch_computer_science_f2_tp3','Binary, hexadecimal, and data representation');
set('learnSch_computer_science_f2_tp4','Logic gates and Boolean algebra');
set('learnSch_computer_science_f2_tp5','CPU components and the fetch-decode-execute cycle');
set('learnSch_computer_science_f3_tp3','Stacks, queues, and linked lists');
set('learnSch_computer_science_f3_tp4','Trees and binary search trees');
set('learnSch_computer_science_f3_tp5','Recursion and divide-and-conquer');
set('learnSch_computer_science_f4_tp3','Entity-relationship diagrams');
set('learnSch_computer_science_f4_tp4','Transactions and ACID properties');
set('learnSch_computer_science_f4_tp5','NoSQL databases and distributed systems');
set('learnSch_computer_science_f5_tp3','TCP/IP model and the OSI model');
set('learnSch_computer_science_f5_tp4','Firewalls, proxies, and VPNs');
set('learnSch_computer_science_f5_tp5','Web technologies: HTTP, HTML, and REST APIs');

// ── Language Arts ─────────────────────────────────────────────────────────────
set('learnSch_language_arts_f0_tp3','Literary analysis: theme and characterisation');
set('learnSch_language_arts_f0_tp4','Media literacy and non-fiction texts');
set('learnSch_language_arts_f0_tp5','Poetry analysis: form, metre, and figurative language');
set('learnSch_language_arts_f1_tp3','Creative writing: narrative and descriptive');
set('learnSch_language_arts_f1_tp4','Research skills and citation standards');
set('learnSch_language_arts_f1_tp5','Oral communication and presentations');
set('learnSch_language_arts_f2_tp3','Punctuation and mechanics');
set('learnSch_language_arts_f2_tp4','Parts of speech and syntax');
set('learnSch_language_arts_f2_tp5','Style, register, and tone');
set('learnSch_language_arts_f3_tp3','Persuasive writing techniques');
set('learnSch_language_arts_f3_tp4','Debate and argumentation skills');
set('learnSch_language_arts_f3_tp5','Close reading and literary criticism');

// ── History ───────────────────────────────────────────────────────────────────
set('learnSch_history_f0_tp3','The Middle Ages and feudalism');
set('learnSch_history_f0_tp4','Rise of empires: Mongol, Ottoman, Mughal');
set('learnSch_history_f0_tp5','Social and cultural history');
set('learnSch_history_f1_tp3','Propaganda, censorship, and media as sources');
set('learnSch_history_f1_tp4','Oral histories and personal testimonies');
set('learnSch_history_f1_tp5','Archaeological evidence and material culture');
set('learnSch_history_f2_tp3','Colonialism and imperialism');
set('learnSch_history_f2_tp4','Nationalism and the unification of Germany and Italy');
set('learnSch_history_f2_tp5','Social reform movements of the 19th century');
set('learnSch_history_f3_tp3','Holocaust, genocide, and totalitarianism');
set('learnSch_history_f3_tp4','Space race and technological change in the Cold War');
set('learnSch_history_f3_tp5','Civil rights movements worldwide');
set('learnSch_history_f4_tp3','Historical causation, consequence, and significance');
set('learnSch_history_f4_tp4','Periodisation and chronology in historical writing');
set('learnSch_history_f4_tp5','Comparative and counterfactual history');

// ── Geography ─────────────────────────────────────────────────────────────────
set('learnSch_geography_f0_tp3','Glaciation and glacial landforms');
set('learnSch_geography_f0_tp4','Rivers: erosion, transportation, and deposition');
set('learnSch_geography_f0_tp5','Coasts and coastal processes');
set('learnSch_geography_f1_tp3','Rural-urban migration and push-pull factors');
set('learnSch_geography_f1_tp4','Housing, urban inequality, and regeneration');
set('learnSch_geography_f1_tp5','Development indicators and global inequality');
set('learnSch_geography_f2_tp3','Remote sensing and satellite imagery');
set('learnSch_geography_f2_tp4','GPS and coordinate systems');
set('learnSch_geography_f2_tp5','GIS: planning and disaster response applications');
set('learnSch_geography_f3_tp3','Climate change: evidence and causes');
set('learnSch_geography_f3_tp4','Urban heat island and microclimate');
set('learnSch_geography_f3_tp5','Extreme weather events and adaptation strategies');

// ── Economics ─────────────────────────────────────────────────────────────────
set('learnSch_economics_f0_tp3','Price elasticity of demand and supply');
set('learnSch_economics_f0_tp4','Consumer surplus and producer surplus');
set('learnSch_economics_f0_tp5','Government intervention: taxes, subsidies, price controls');
set('learnSch_economics_f1_tp3','Compound interest and the time value of money');
set('learnSch_economics_f1_tp4','Insurance and risk management');
set('learnSch_economics_f1_tp5','Pensions, investment, and retirement planning');
set('learnSch_economics_f2_tp3','Balance of payments and exchange rates');
set('learnSch_economics_f2_tp4','Trade agreements and the WTO');
set('learnSch_economics_f2_tp5','Globalisation: winners and losers');
set('learnSch_economics_f3_tp3','Credit scores and debt management');
set('learnSch_economics_f3_tp4','Taxation: income tax, VAT, and national insurance');
set('learnSch_economics_f3_tp5','Financial planning and budgeting tools');

// ── Health ────────────────────────────────────────────────────────────────────
set('learnSch_health_f0_tp3','Hydration and substance awareness');
set('learnSch_health_f0_tp4','Screen time and digital wellness');
set('learnSch_health_f0_tp5','Puberty, growth, and body image');
set('learnSch_health_f1_tp3','Anxiety and depression: signs and coping strategies');
set('learnSch_health_f1_tp4','Building resilience and emotional regulation');
set('learnSch_health_f1_tp5','Healthy relationships and communication');
set('learnSch_health_f2_tp3','Fractures, shock, and wound care');
set('learnSch_health_f2_tp4','Anaphylaxis and common medical emergencies');
set('learnSch_health_f2_tp5','Water safety and accident prevention');

// ── Arts ──────────────────────────────────────────────────────────────────────
set('learnSch_arts_f0_tp3','Perspective and spatial illusion');
set('learnSch_arts_f0_tp4','Art history: cave paintings to contemporary');
set('learnSch_arts_f0_tp5','Digital art tools and photography');
set('learnSch_arts_f1_tp3','Collage, textiles, and mixed media');
set('learnSch_arts_f1_tp4','Typography and graphic design');
set('learnSch_arts_f1_tp5','Life drawing and anatomical proportion');
set('learnSch_arts_f2_tp3','Value, tint, shade, and tone');
set('learnSch_arts_f2_tp4','Simultaneous contrast and optical illusions');
set('learnSch_arts_f2_tp5','Colour in graphic design and digital media');

// ── Music ─────────────────────────────────────────────────────────────────────
set('learnSch_music_f0_tp3','Intervals, chords, and chord progressions');
set('learnSch_music_f0_tp4','Key signatures and modulation');
set('learnSch_music_f0_tp5','Counterpoint and voice leading');
set('learnSch_music_f1_tp3','World music traditions and instruments');
set('learnSch_music_f1_tp4','Electronic music and synthesis');
set('learnSch_music_f1_tp5','Physics of sound: pitch, timbre, and resonance');
set('learnSch_music_f2_tp3','American music: blues, jazz, rock, hip-hop');
set('learnSch_music_f2_tp4','Film music and music for media');
set('learnSch_music_f2_tp5','Global music: folk traditions and fusion');

// ── Physical Education ────────────────────────────────────────────────────────
set('learnSch_physical_education_f0_tp3','Flexibility and the science of stretching');
set('learnSch_physical_education_f0_tp4','Training principles: overload, progression, specificity');
set('learnSch_physical_education_f0_tp5','FITT principle and periodisation');
set('learnSch_physical_education_f1_tp3','Individual sports: athletics, swimming, tennis');
set('learnSch_physical_education_f1_tp4','Outdoor and adventurous activities');
set('learnSch_physical_education_f1_tp5','Sports psychology: motivation and peak performance');
set('learnSch_physical_education_f2_tp3','Injury prevention and the RICE method');
set('learnSch_physical_education_f2_tp4','Nutrition for sport: carbohydrates, protein, hydration');
set('learnSch_physical_education_f2_tp5','HIIT, yoga, and functional fitness');

// ── German Language ───────────────────────────────────────────────────────────
set('learnSch_german_language_f0_tp3','Verb tenses: Präteritum, Perfekt, Futur');
set('learnSch_german_language_f0_tp4','Modal verbs and their meanings');
set('learnSch_german_language_f0_tp5','Adjective endings and declension');
set('learnSch_german_language_f1_tp3','Poetry and prose: Goethe, Kafka, Brecht');
set('learnSch_german_language_f1_tp4','Media texts and newspaper articles in German');
set('learnSch_german_language_f1_tp5','Film analysis in German');
set('learnSch_german_language_f2_tp3','Formal letters and emails in German');
set('learnSch_german_language_f2_tp4','Erörterung and commentary writing');
set('learnSch_german_language_f2_tp5','Bewerbung and professional German');

// ── Religion & Ethics ─────────────────────────────────────────────────────────
set('learnSch_religion_ethics_f0_tp3','Hinduism and Buddhism: core beliefs and practices');
set('learnSch_religion_ethics_f0_tp4','Islam: the Five Pillars, Quran, and history');
set('learnSch_religion_ethics_f0_tp5','Indigenous and new religious movements');
set('learnSch_religion_ethics_f1_tp3','Divine command theory and religious ethics');
set('learnSch_religion_ethics_f1_tp4','Rights-based ethics and the social contract');
set('learnSch_religion_ethics_f1_tp5','Environmental ethics and animal rights');
set('learnSch_religion_ethics_f2_tp3','Moral psychology: guilt, empathy, and moral development');
set('learnSch_religion_ethics_f2_tp4','Business ethics and corporate responsibility');
set('learnSch_religion_ethics_f2_tp5','Medical ethics: euthanasia, consent, and cloning');

// ── Social Studies ────────────────────────────────────────────────────────────
set('learnSch_social_studies_f0_tp3','Political parties and electoral systems');
set('learnSch_social_studies_f0_tp4','Civil liberties and the rule of law');
set('learnSch_social_studies_f0_tp5','Local government and community participation');
set('learnSch_social_studies_f1_tp3','Cultural identity and multiculturalism');
set('learnSch_social_studies_f1_tp4','Social media, technology, and society');
set('learnSch_social_studies_f1_tp5','Crime, justice, and rehabilitation');
set('learnSch_social_studies_f2_tp3','Humanitarian law and war crimes');
set('learnSch_social_studies_f2_tp4','Gender equality and women\'s rights');
set('learnSch_social_studies_f2_tp5','Climate justice and intergenerational equity');

// ── Philosophy (School) ───────────────────────────────────────────────────────
set('learnSch_philosophy_f0_tp3','Justified true belief and the Gettier problem');
set('learnSch_philosophy_f0_tp4','Scientific knowledge and Popper\'s falsifiability');
set('learnSch_philosophy_f0_tp5','Cultural and religious knowledge systems');
set('learnSch_philosophy_f1_tp3','The problem of other minds');
set('learnSch_philosophy_f1_tp4','Personal identity over time');
set('learnSch_philosophy_f1_tp5','AI and machine consciousness');
set('learnSch_philosophy_f2_tp3','The trolley problem and moral dilemmas');
set('learnSch_philosophy_f2_tp4','Bioethics and medical decision-making');
set('learnSch_philosophy_f2_tp5','Environmental ethics and deep ecology');

// ── Technology ────────────────────────────────────────────────────────────────
set('learnSch_technology_f0_tp3','Ergonomics and human-centred design');
set('learnSch_technology_f0_tp4','Sustainability in product design');
set('learnSch_technology_f0_tp5','Design thinking in social contexts');
set('learnSch_technology_f1_tp3','Data privacy and the GDPR');
set('learnSch_technology_f1_tp4','Cybersecurity: phishing, malware, two-factor auth');
set('learnSch_technology_f1_tp5','Ethical AI and algorithmic bias');
set('learnSch_technology_f2_tp3','Sensors, actuators, and microcontrollers (Arduino)');
set('learnSch_technology_f2_tp4','Programming robots: block-based to Python');
set('learnSch_technology_f2_tp5','Autonomous vehicles and drone technology');

// ── Arabic Language ───────────────────────────────────────────────────────────
set('learnSch_arabic_language_f0_tp3','Short vowels (harakat) and their effect on pronunciation');
set('learnSch_arabic_language_f0_tp4','Connected vs isolated letter forms');
set('learnSch_arabic_language_f0_tp5','Arabic calligraphy and writing traditions');
set('learnSch_arabic_language_f1_tp3','The broken plural and sound plural');
set('learnSch_arabic_language_f1_tp4','The dual (muthanna) and subject-verb agreement');
set('learnSch_arabic_language_f1_tp5','The possessive construction (idafa)');
set('learnSch_arabic_language_f2_tp3','Family, school, and daily life vocabulary');
set('learnSch_arabic_language_f2_tp4','Time expressions and dates in Arabic');
set('learnSch_arabic_language_f2_tp5','Formal vs colloquial Arabic: MSA vs dialects');

// ── French Language ───────────────────────────────────────────────────────────
set('learnSch_french_language_f0_tp3','The French R and guttural sounds');
set('learnSch_french_language_f0_tp4','Elision and mute H');
set('learnSch_french_language_f0_tp5','French intonation and sentence stress');
set('learnSch_french_language_f1_tp3','Reflexive verbs and pronominal construction');
set('learnSch_french_language_f1_tp4','Passé composé vs imparfait: the key distinction');
set('learnSch_french_language_f1_tp5','The subjunctive: when and how to use it');
set('learnSch_french_language_f2_tp3','Dissertation and literary analysis in French');
set('learnSch_french_language_f2_tp4','French connectives and discourse markers');
set('learnSch_french_language_f2_tp5','Register and vocabulary for high-level writing');

// ── Spanish Language ──────────────────────────────────────────────────────────
set('learnSch_spanish_language_f0_tp3','The rolled R and pronunciation challenges');
set('learnSch_spanish_language_f0_tp4','Punctuation: inverted question and exclamation marks');
set('learnSch_spanish_language_f0_tp5','Speed, rhythm, and connected speech in Spanish');
set('learnSch_spanish_language_f1_tp3','Preterite vs imperfect: the key distinction');
set('learnSch_spanish_language_f1_tp4','Reflexive verbs and gustar-type constructions');
set('learnSch_spanish_language_f1_tp5','The subjunctive mood in Spanish');
set('learnSch_spanish_language_f2_tp3','Formal and informal letters in Spanish');
set('learnSch_spanish_language_f2_tp4','Spanish connectors and cohesive devices');
set('learnSch_spanish_language_f2_tp5','Literary analysis in Spanish');

// ── EFL ───────────────────────────────────────────────────────────────────────
set('learnSch_english_as_foreign_language_f0_tp3','Conditionals: zero, first, second, and third');
set('learnSch_english_as_foreign_language_f0_tp4','Reported speech and indirect questions');
set('learnSch_english_as_foreign_language_f0_tp5','Relative clauses: defining and non-defining');
set('learnSch_english_as_foreign_language_f1_tp3','Vocabulary in context and guessing meaning');
set('learnSch_english_as_foreign_language_f1_tp4','Reading academic texts: abstracts and reports');
set('learnSch_english_as_foreign_language_f1_tp5','Literary texts and cultural context');
set('learnSch_english_as_foreign_language_f2_tp3','Cohesion: connectives, pronouns, and lexical chains');
set('learnSch_english_as_foreign_language_f2_tp4','Academic style: avoiding informal language');
set('learnSch_english_as_foreign_language_f2_tp5','Referencing and avoiding plagiarism');

// ── Politics & Civics ─────────────────────────────────────────────────────────
set('learnSch_politics_civics_f0_tp3','Referendums and direct democracy');
set('learnSch_politics_civics_f0_tp4','Constitutional monarchy vs republic');
set('learnSch_politics_civics_f0_tp5','Democratic backsliding and authoritarianism');
set('learnSch_politics_civics_f1_tp3','The European Convention on Human Rights');
set('learnSch_politics_civics_f1_tp4','Environmental rights and climate litigation');
set('learnSch_politics_civics_f1_tp5','Rights of the child and education as a human right');
set('learnSch_politics_civics_f2_tp3','Voting behaviour and turnout');
set('learnSch_politics_civics_f2_tp4','Campaign finance and media influence');
set('learnSch_politics_civics_f2_tp5','Youth political participation and civic education');

// ── Psychology (School) ───────────────────────────────────────────────────────
set('learnSch_psychology_school_f0_tp3','Classical and operant conditioning');
set('learnSch_psychology_school_f0_tp4','Freud and psychoanalytic theory');
set('learnSch_psychology_school_f0_tp5','Humanistic psychology: Maslow and Rogers');
set('learnSch_psychology_school_f1_tp3','Attention and perception');
set('learnSch_psychology_school_f1_tp4','Problem solving and decision making');
set('learnSch_psychology_school_f1_tp5','Language and thought: the Sapir-Whorf hypothesis');
set('learnSch_psychology_school_f2_tp3','Minority influence and Moscovici');
set('learnSch_psychology_school_f2_tp4','Prejudice, discrimination, and implicit bias');
set('learnSch_psychology_school_f2_tp5','Pro-social behaviour and altruism');

// ── Astronomy ─────────────────────────────────────────────────────────────────
set('learnSch_astronomy_f0_tp3','Formation of the solar system: nebular hypothesis');
set('learnSch_astronomy_f0_tp4','The Moon: tides, phases, and lunar geology');
set('learnSch_astronomy_f0_tp5','Space exploration: missions and future travel');
set('learnSch_astronomy_f1_tp3','Nuclear fusion in stars: the proton-proton chain');
set('learnSch_astronomy_f1_tp4','Neutron stars, pulsars, and magnetars');
set('learnSch_astronomy_f1_tp5','Exoplanets and the search for life');
set('learnSch_astronomy_f2_tp3','Cosmic microwave background radiation');
set('learnSch_astronomy_f2_tp4','The fate of the universe');
set('learnSch_astronomy_f2_tp5','Multiverse theories and the fine-tuned universe');

// ── Latin Language ────────────────────────────────────────────────────────────
set('learnSch_latin_language_f0_tp3','Participles and gerunds');
set('learnSch_latin_language_f0_tp4','Indirect speech (oratio obliqua)');
set('learnSch_latin_language_f0_tp5','Conditionals and the subjunctive in Latin');
set('learnSch_latin_language_f1_tp3','Virgil\'s Aeneid: epic conventions and themes');
set('learnSch_latin_language_f1_tp4','Ovid\'s Metamorphoses: myth and transformation');
set('learnSch_latin_language_f1_tp5','Livy and the art of historical narrative');
set('learnSch_latin_language_f2_tp3','Roman religion and mythology');
set('learnSch_latin_language_f2_tp4','Roman architecture, engineering, and legacy');
set('learnSch_latin_language_f2_tp5','The fall of Rome and Latin\'s legacy in modern languages');

// ── Media Studies ─────────────────────────────────────────────────────────────
set('learnSch_media_studies_f0_tp3','News values and agenda setting');
set('learnSch_media_studies_f0_tp4','Representation of race, gender, and class in media');
set('learnSch_media_studies_f0_tp5','Audience theories: uses and gratifications');
set('learnSch_media_studies_f1_tp3','Genre conventions and narrative structure in film');
set('learnSch_media_studies_f1_tp4','Documentary filmmaking and representation');
set('learnSch_media_studies_f1_tp5','Global cinema: Bollywood, Korean Wave, Italian neorealism');
set('learnSch_media_studies_f2_tp3','Content creation and influencer culture');
set('learnSch_media_studies_f2_tp4','Platform regulation and free speech online');
set('learnSch_media_studies_f2_tp5','The attention economy and dark patterns');

// ── Chinese Language ──────────────────────────────────────────────────────────
set('learnSch_chinese_language_f0_tp3','Common radicals and their meanings');
set('learnSch_chinese_language_f0_tp4','Measure words (量词) and their usage');
set('learnSch_chinese_language_f0_tp5','Tone sandhi and neutral tones');
set('learnSch_chinese_language_f1_tp3','The most common 500 characters (HSK 1-2 level)');
set('learnSch_chinese_language_f1_tp4','Character composition: phonetic and semantic components');
set('learnSch_chinese_language_f1_tp5','Handwriting practice and stroke order rules');
set('learnSch_chinese_language_f2_tp3','Time, dates, and scheduling in Chinese');
set('learnSch_chinese_language_f2_tp4','Transport, directions, and navigation in Chinese');
set('learnSch_chinese_language_f2_tp5','Chinese culture: festivals, customs, and idioms (成语)');

// ── Environmental Studies ─────────────────────────────────────────────────────
set('learnSch_environmental_studies_f0_tp3','Climate models and feedback loops');
set('learnSch_environmental_studies_f0_tp4','Adaptation vs mitigation strategies');
set('learnSch_environmental_studies_f0_tp5','Climate economics: carbon pricing and cap-and-trade');
set('learnSch_environmental_studies_f1_tp3','Invasive species and habitat fragmentation');
set('learnSch_environmental_studies_f1_tp4','Marine ecosystems: coral reefs and ocean acidification');
set('learnSch_environmental_studies_f1_tp5','Indigenous knowledge and conservation');
set('learnSch_environmental_studies_f2_tp3','Renewable energy: solar, wind, hydro, and geothermal');
set('learnSch_environmental_studies_f2_tp4','Water scarcity and water management');
set('learnSch_environmental_studies_f2_tp5','Urban sustainability: smart cities and green infrastructure');


// =============================================================================
//  UNIVERSITY
// =============================================================================

// ── Mathematics ──────────────────────────────────────────────────────────────
set('learnUni_mathematics_f0_tp3','Multivariable calculus and partial derivatives');
set('learnUni_mathematics_f0_tp4','Line integrals, surface integrals, and Stokes\' theorem');
set('learnUni_mathematics_f0_tp5','Taylor series and power series convergence');
set('learnUni_mathematics_f1_tp3','Determinants and matrix factorisation (LU, QR, Cholesky)');
set('learnUni_mathematics_f1_tp4','Inner product spaces and the Gram-Schmidt process');
set('learnUni_mathematics_f1_tp5','Spectral theorem and singular value decomposition (SVD)');
set('learnUni_mathematics_f2_tp3','Maximum likelihood estimation (MLE)');
set('learnUni_mathematics_f2_tp4','Hypothesis testing, p-values, and confidence intervals');
set('learnUni_mathematics_f2_tp5','Bayesian statistics and Bayes\' theorem applications');
set('learnUni_mathematics_f3_tp3','Laplace transforms and their applications');
set('learnUni_mathematics_f3_tp4','Systems of ODEs and phase portraits');
set('learnUni_mathematics_f3_tp5','Partial differential equations: heat and wave equation');
set('learnUni_mathematics_f4_tp3','Möbius transformations and conformal mappings');
set('learnUni_mathematics_f4_tp4','Laurent series and annular convergence');
set('learnUni_mathematics_f4_tp5','The argument principle and Rouché\'s theorem');
set('learnUni_mathematics_f5_tp3','Series convergence tests: ratio, root, comparison');
set('learnUni_mathematics_f5_tp4','The Riemann integral and Lebesgue measure');
set('learnUni_mathematics_f5_tp5','Metric spaces, completeness, and the Baire category theorem');
set('learnUni_mathematics_f6_tp3','Quotient groups and the homomorphism theorems');
set('learnUni_mathematics_f6_tp4','Polynomial rings, ideals, and the isomorphism theorems');
set('learnUni_mathematics_f6_tp5','Field extensions and the insolvability of the quintic');
set('learnUni_mathematics_f7_tp3','Conformal mappings and Riemann surfaces');
set('learnUni_mathematics_f7_tp4','The Riemann zeta function and prime number distribution');
set('learnUni_mathematics_f7_tp5','Picard\'s theorems and entire functions');

// ── Physics ───────────────────────────────────────────────────────────────────
set('learnUni_physics_f0_tp3','Lagrangian and Hamiltonian mechanics');
set('learnUni_physics_f0_tp4','Damped and driven oscillations');
set('learnUni_physics_f0_tp5','Gravitational field theory and tidal forces');
set('learnUni_physics_f1_tp3','Gauss\'s law and Faraday\'s law in integral form');
set('learnUni_physics_f1_tp4','Electromagnetic induction and self-inductance');
set('learnUni_physics_f1_tp5','Displacement current and the Ampère-Maxwell law');
set('learnUni_physics_f2_tp3','Retarded potentials and Jefimenko equations');
set('learnUni_physics_f2_tp4','Cherenkov radiation and synchrotron radiation');
set('learnUni_physics_f2_tp5','Covariant formulation of electrodynamics');
set('learnUni_physics_f3_tp3','Partition functions: canonical and grand canonical ensembles');
set('learnUni_physics_f3_tp4','Phase transitions and order parameters');
set('learnUni_physics_f3_tp5','The fluctuation-dissipation theorem');
set('learnUni_physics_f4_tp3','Angular momentum operators and spin');
set('learnUni_physics_f4_tp4','Perturbation theory and selection rules');
set('learnUni_physics_f4_tp5','Identical particles: bosons, fermions, and exchange symmetry');
set('learnUni_physics_f5_tp3','Fabry-Pérot interferometer and etalons');
set('learnUni_physics_f5_tp4','Non-linear optics and second harmonic generation');
set('learnUni_physics_f5_tp5','Quantum optics: photon statistics and Hong-Ou-Mandel effect');

// ── Chemistry ─────────────────────────────────────────────────────────────────
set('learnUni_chemistry_f0_tp3','Molecular quantum mechanics and spectroscopy');
set('learnUni_chemistry_f0_tp4','Statistical thermodynamics and partition functions');
set('learnUni_chemistry_f0_tp5','Electrochemical methods: cyclic voltammetry');
set('learnUni_chemistry_f1_tp3','Pericyclic reactions and Woodward-Hoffmann rules');
set('learnUni_chemistry_f1_tp4','Asymmetric synthesis and chiral catalysts');
set('learnUni_chemistry_f1_tp5','Total synthesis of complex natural products');
set('learnUni_chemistry_f2_tp3','Group theory, character tables, and molecular symmetry');
set('learnUni_chemistry_f2_tp4','f-block chemistry: lanthanides and actinides');
set('learnUni_chemistry_f2_tp5','Solid state chemistry and band theory');
set('learnUni_chemistry_f3_tp3','X-ray crystallography and structure determination');
set('learnUni_chemistry_f3_tp4','Atomic absorption spectroscopy and ICP-MS');
set('learnUni_chemistry_f3_tp5','Chemometrics and multivariate data analysis');
set('learnUni_chemistry_f4_tp3','Signal transduction and second messengers');
set('learnUni_chemistry_f4_tp4','Lipid bilayers and membrane protein function');
set('learnUni_chemistry_f4_tp5','Post-translational modifications and proteomics');

// ── Biology ───────────────────────────────────────────────────────────────────
set('learnUni_biology_f0_tp3','CRISPR-Cas9 mechanism and genome editing');
set('learnUni_biology_f0_tp4','Epigenetics and chromatin remodelling');
set('learnUni_biology_f0_tp5','Single-cell sequencing and multi-omics');
set('learnUni_biology_f1_tp3','Hardy-Weinberg equilibrium and genetic drift');
set('learnUni_biology_f1_tp4','Phylogenetics and cladistics');
set('learnUni_biology_f1_tp5','Evo-devo: Hox genes and developmental evolution');
set('learnUni_biology_f2_tp3','Lotka-Volterra equations and ecological modelling');
set('learnUni_biology_f2_tp4','Metapopulation dynamics and the SLOSS debate');
set('learnUni_biology_f2_tp5','Community ecology: succession and keystone species');
set('learnUni_biology_f3_tp3','Autophagy and the ubiquitin-proteasome system');
set('learnUni_biology_f3_tp4','Cell-cell communication and gap junctions');
set('learnUni_biology_f3_tp5','Organoid technology and synthetic biology');
set('learnUni_biology_f4_tp3','Computational neuroscience: integrate-and-fire models');
set('learnUni_biology_f4_tp4','Synaptic plasticity: BDNF and structural remodelling');
set('learnUni_biology_f4_tp5','Neurological disorders: Parkinson\'s, Alzheimer\'s, ALS');
set('learnUni_biology_f5_tp3','Cytokines and the inflammatory cascade');
set('learnUni_biology_f5_tp4','MHC class I and II: antigen presentation');
set('learnUni_biology_f5_tp5','HIV immunopathology and vaccine strategies');

// ── Computer Science ──────────────────────────────────────────────────────────
set('learnUni_computer_science_f0_tp3','Hash tables, collision resolution, and amortised analysis');
set('learnUni_computer_science_f0_tp4','Heaps, priority queues, and Dijkstra\'s algorithm');
set('learnUni_computer_science_f0_tp5','Minimum spanning trees and network flow');
set('learnUni_computer_science_f1_tp3','ACID properties and transaction isolation levels');
set('learnUni_computer_science_f1_tp4','Indexing, B-trees, and query execution plans');
set('learnUni_computer_science_f1_tp5','Distributed databases and the CAP theorem');
set('learnUni_computer_science_f2_tp3','NP-completeness and reduction proofs');
set('learnUni_computer_science_f2_tp4','Approximation and randomised algorithms');
set('learnUni_computer_science_f2_tp5','Streaming algorithms and external memory models');
set('learnUni_computer_science_f3_tp3','Deadlocks: detection, prevention, and avoidance');
set('learnUni_computer_science_f3_tp4','Virtual memory, paging, TLBs, and page replacement');
set('learnUni_computer_science_f3_tp5','Kernel security: ASLR, capabilities, and SELinux');
set('learnUni_computer_science_f4_tp3','Clean code, SOLID principles, and refactoring');
set('learnUni_computer_science_f4_tp4','Containerisation with Docker and Kubernetes');
set('learnUni_computer_science_f4_tp5','Software security: OWASP Top 10 and threat modelling');
set('learnUni_computer_science_f5_tp3','Convolutional and recurrent neural networks');
set('learnUni_computer_science_f5_tp4','Generative models: VAEs and GANs');
set('learnUni_computer_science_f5_tp5','Reinforcement learning and large language models');

// ── Economics ─────────────────────────────────────────────────────────────────
set('learnUni_economics_f0_tp3','IS-LM model and aggregate demand');
set('learnUni_economics_f0_tp4','Open economy macroeconomics and the Mundell-Fleming model');
set('learnUni_economics_f0_tp5','Long-run growth: human capital and endogenous growth theory');
set('learnUni_economics_f1_tp3','Auctions, mechanism design, and the revelation principle');
set('learnUni_economics_f1_tp4','Asymmetric information: moral hazard and adverse selection');
set('learnUni_economics_f1_tp5','Public goods, common resources, and the tragedy of the commons');
set('learnUni_economics_f2_tp3','Panel data and fixed effects models');
set('learnUni_economics_f2_tp4','Difference-in-differences and the parallel trends assumption');
set('learnUni_economics_f2_tp5','Regression discontinuity and quasi-experimental methods');
set('learnUni_economics_f3_tp3','Mental accounting and the endowment effect');
set('learnUni_economics_f3_tp4','Social preferences: altruism, fairness, and reciprocity');
set('learnUni_economics_f3_tp5','Defaults, choice architecture, and real-world nudge experiments');
set('learnUni_economics_f4_tp3','Measuring poverty: the $2.15 line, MPI, and capabilities approach');
set('learnUni_economics_f4_tp4','Conditional cash transfers and their evidence base');
set('learnUni_economics_f4_tp5','State capacity, corruption, and extractive institutions');

// ── Law ───────────────────────────────────────────────────────────────────────
set('learnUni_law_f0_tp3','Separation of powers in comparative perspective');
set('learnUni_law_f0_tp4','Emergency powers and constitutional limits');
set('learnUni_law_f0_tp5','Comparative constitutionalism: US, Germany, India');
set('learnUni_law_f1_tp3','Offer, acceptance, and consideration: detailed rules');
set('learnUni_law_f1_tp4','Misrepresentation, duress, and undue influence');
set('learnUni_law_f1_tp5','Remoteness, mitigation, and equitable remedies');
set('learnUni_law_f2_tp3','Murder, manslaughter, and the doctrine of loss of control');
set('learnUni_law_f2_tp4','Property offences: theft, fraud, and robbery');
set('learnUni_law_f2_tp5','Inchoate offences: attempt, conspiracy, and incitement');
set('learnUni_law_f3_tp3','The Vienna Convention on the Law of Treaties (1969)');
set('learnUni_law_f3_tp4','Diplomatic immunity and state responsibility');
set('learnUni_law_f3_tp5','International humanitarian law and the laws of armed conflict');
set('learnUni_law_f4_tp3','The ratio decidendi and obiter dicta');
set('learnUni_law_f4_tp4','Purposive, literal, and golden rules of statutory interpretation');
set('learnUni_law_f4_tp5','Hart vs Dworkin: legal positivism vs law as integrity');

// ── Medicine ──────────────────────────────────────────────────────────────────
set('learnUni_medicine_f0_tp3','The nervous system: central, peripheral, and autonomic');
set('learnUni_medicine_f0_tp4','The lymphatic and immune system anatomy');
set('learnUni_medicine_f0_tp5','Embryology and developmental anatomy');
set('learnUni_medicine_f1_tp3','Neurophysiology: action potentials and synaptic transmission');
set('learnUni_medicine_f1_tp4','Gastrointestinal physiology: digestion and absorption');
set('learnUni_medicine_f1_tp5','Haematology: blood cell production and the coagulation cascade');
set('learnUni_medicine_f2_tp3','Genetic disorders: inheritance patterns and diagnosis');
set('learnUni_medicine_f2_tp4','Infectious disease pathology: bacteria, viruses, and fungi');
set('learnUni_medicine_f2_tp5','Tumour markers, staging, and histological grading');
set('learnUni_medicine_f3_tp3','Antimicrobial pharmacology and resistance mechanisms');
set('learnUni_medicine_f3_tp4','Cardiovascular pharmacology: antihypertensives, statins, anticoagulants');
set('learnUni_medicine_f3_tp5','CNS pharmacology: antidepressants, antipsychotics, anxiolytics');
set('learnUni_medicine_f4_tp3','Diagnostic reasoning and clinical decision-making');
set('learnUni_medicine_f4_tp4','Interprofessional practice and patient safety');
set('learnUni_medicine_f4_tp5','Epidemiology and global health');

// ── Psychology ────────────────────────────────────────────────────────────────
set('learnUni_psychology_f0_tp3','Neurological basis of behaviour and the brain');
set('learnUni_psychology_f0_tp4','Sensation, perception, and psychophysics');
set('learnUni_psychology_f0_tp5','Consciousness, sleep stages, and altered states');
set('learnUni_psychology_f1_tp3','Bowlby\'s attachment theory and the Strange Situation');
set('learnUni_psychology_f1_tp4','Erikson\'s eight psychosocial stages');
set('learnUni_psychology_f1_tp5','Moral development: Kohlberg and Gilligan');
set('learnUni_psychology_f2_tp3','Anxiety disorders and evidence-based treatments');
set('learnUni_psychology_f2_tp4','Personality disorders and neurological conditions');
set('learnUni_psychology_f2_tp5','Psychological assessment and intelligence testing');
set('learnUni_psychology_f3_tp3','Language acquisition and the Sapir-Whorf hypothesis');
set('learnUni_psychology_f3_tp4','Reasoning, judgement, and heuristics (Kahneman and Tversky)');
set('learnUni_psychology_f3_tp5','Executive function and working memory models');
set('learnUni_psychology_f4_tp3','Psychopharmacology: how drugs affect the brain');
set('learnUni_psychology_f4_tp4','Evolutionary psychology: mate selection, altruism, aggression');
set('learnUni_psychology_f4_tp5','Neuroimaging: fMRI, EEG, and lesion studies');

// ── Sociology ─────────────────────────────────────────────────────────────────
set('learnUni_sociology_f0_tp3','Symbolic interactionism: Mead and Goffman');
set('learnUni_sociology_f0_tp4','Critical theory: the Frankfurt School and Habermas');
set('learnUni_sociology_f0_tp5','Feminist theory: Beauvoir, Butler, and intersectionality');
set('learnUni_sociology_f1_tp3','Crime, deviance, and social control');
set('learnUni_sociology_f1_tp4','Healthcare, mental health, and medical sociology');
set('learnUni_sociology_f1_tp5','Migration, diaspora, and transnational identity');
set('learnUni_sociology_f2_tp3','Poverty: absolute vs relative and the poverty trap');
set('learnUni_sociology_f2_tp4','Disability, ageism, and marginalised identities');
set('learnUni_sociology_f2_tp5','Global inequality and the world-system theory');
set('learnUni_sociology_f3_tp3','Ethnography and participant observation');
set('learnUni_sociology_f3_tp4','Survey design, sampling methods, and bias');
set('learnUni_sociology_f3_tp5','Reliability, validity, and research ethics in sociology');

// ── History ───────────────────────────────────────────────────────────────────
set('learnUni_history_f0_tp3','Subaltern studies and postcolonial historiography');
set('learnUni_history_f0_tp4','Social history: the Annales School and history from below');
set('learnUni_history_f0_tp5','Digital history, big data, and computational approaches');
set('learnUni_history_f1_tp3','Alexander the Great and Hellenistic culture');
set('learnUni_history_f1_tp4','The Han Dynasty and the Silk Road');
set('learnUni_history_f1_tp5','The Maya, Aztec, and Inca civilisations');
set('learnUni_history_f2_tp3','The Atlantic slave trade and its legacies');
set('learnUni_history_f2_tp4','The American and French Revolutions compared');
set('learnUni_history_f2_tp5','The Haitian Revolution and the abolitionist movement');
set('learnUni_history_f3_tp3','The Holocaust: causes, mechanisms, and legacies');
set('learnUni_history_f3_tp4','Decolonisation in Africa and Asia (1945–1975)');
set('learnUni_history_f3_tp5','Globalisation, inequality, and climate as historical forces');

// ── Philosophy ────────────────────────────────────────────────────────────────
set('learnUni_philosophy_f0_tp3','Reliabilism and coherentism in epistemology');
set('learnUni_philosophy_f0_tp4','The Gettier problem and post-Gettier responses');
set('learnUni_philosophy_f0_tp5','Feminist epistemology and standpoint theory');
set('learnUni_philosophy_f1_tp3','Peter Singer and effective altruism');
set('learnUni_philosophy_f1_tp4','Feminist ethics of care: Noddings and Gilligan');
set('learnUni_philosophy_f1_tp5','Moral luck, collective responsibility, and supererogation');
set('learnUni_philosophy_f2_tp3','Functionalism and the computational theory of mind');
set('learnUni_philosophy_f2_tp4','Eliminative materialism and the folk psychology debate');
set('learnUni_philosophy_f2_tp5','Embodied cognition and the extended mind thesis');
set('learnUni_philosophy_f3_tp3','Global justice: Pogge and Singer on world poverty');
set('learnUni_philosophy_f3_tp4','Democratic legitimacy and deliberative democracy');
set('learnUni_philosophy_f3_tp5','Power, authority, and anarchism');
set('learnUni_philosophy_f4_tp3','Time: the A-theory and B-theory of time');
set('learnUni_philosophy_f4_tp4','Laws of nature and scientific explanation');
set('learnUni_philosophy_f4_tp5','Personal identity: psychological continuity and the Ship of Theseus');

// ─────────────────────────────────────────────────────────────────────────────
// Write to en.json
// ─────────────────────────────────────────────────────────────────────────────
const merged = Object.assign({}, en, add);
fs.writeFileSync(EN, JSON.stringify(merged, null, 2) + '\n', 'utf8');
console.log(`expand-topic-names.js: added ${Object.keys(add).length} new topic title keys to en.json`);
