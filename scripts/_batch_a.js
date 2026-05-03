// BATCH A – Subject titles + School Physics f3-f6 + School Chemistry f3-f6
const fs = require('fs');
const path = require('path');
const enPath = path.join(__dirname, '../locales/en.json');
const en = JSON.parse(fs.readFileSync(enPath, 'utf8'));

const keys = {

  // ── New school subject titles ───────────────────────────────────────────
  "learnSch_politics_civics_title": "Politics & Civics",
  "learnSch_psychology_school_title": "Psychology",
  "learnSch_astronomy_title": "Astronomy",
  "learnSch_latin_language_title": "Latin Language",
  "learnSch_media_studies_title": "Media Studies",
  "learnSch_chinese_language_title": "Chinese Language",
  "learnSch_environmental_studies_title": "Environmental Studies",

  // ── New university subject titles ───────────────────────────────────────
  "learnUni_chemistry_title": "Chemistry",
  "learnUni_law_title": "Law",
  "learnUni_medicine_title": "Medicine & Pre-Med",
  "learnUni_psychology_title": "Psychology",
  "learnUni_sociology_title": "Sociology",
  "learnUni_history_title": "History",
  "learnUni_philosophy_title": "Philosophy",
  "learnUni_political_science_title": "Political Science",
  "learnUni_architecture_title": "Architecture",
  "learnUni_engineering_title": "Engineering",
  "learnUni_business_administration_title": "Business Administration",
  "learnUni_linguistics_title": "Linguistics",
  "learnUni_literature_title": "Literature",
  "learnUni_environmental_science_title": "Environmental Science",
  "learnUni_education_pedagogy_title": "Education & Pedagogy",
  "learnUni_statistics_data_science_title": "Statistics & Data Science",
  "learnUni_cybersecurity_title": "Cybersecurity",
  "learnUni_social_work_title": "Social Work",
  "learnUni_nutrition_dietetics_title": "Nutrition & Dietetics",

  // ════════════════════════════════════════════════════════════════════════
  // SCHOOL – PHYSICS  (f3 – f6)
  // ════════════════════════════════════════════════════════════════════════

  // f3 – Thermodynamics
  "learnSch_physics_f3_name": "Thermodynamics",
  "learnSch_physics_f3_desc": "Thermodynamics studies heat, temperature, and the conversion of energy into work. The three main laws govern every heat engine, refrigerator, and chemical reaction on Earth. Understanding thermodynamics explains why engines cannot be 100 % efficient and why ice melts when touched.",
  "learnSch_physics_f3_kp0": "Temperature measures the average kinetic energy of particles; it is measured in Kelvin (K) or Celsius (°C).",
  "learnSch_physics_f3_kp1": "1st Law of Thermodynamics: energy is conserved — heat added to a system equals the change in internal energy plus work done (ΔU = Q − W).",
  "learnSch_physics_f3_kp2": "2nd Law: heat flows spontaneously from hot to cold, never the reverse. Entropy (disorder) always increases in an isolated system.",
  "learnSch_physics_f3_kp3": "Specific heat capacity (c): Q = mcΔT — the energy needed to raise 1 kg of a substance by 1 °C.",
  "learnSch_physics_f3_kp4": "Efficiency of a heat engine: η = W/Q_hot = 1 − T_cold/T_hot (Carnot efficiency — the theoretical maximum).",
  "learnSch_physics_f3_task": "A 200 g iron block (c = 0.45 J/g·°C) is heated from 20 °C to 100 °C. How much energy is needed? Then calculate the Carnot efficiency of an engine operating between 500 K and 300 K.",
  "learnSch_physics_f3_tp0": "Heat and temperature",
  "learnSch_physics_f3_tp1": "Laws of thermodynamics",
  "learnSch_physics_f3_tp2": "Heat engines and efficiency",

  // f4 – Nuclear Physics & Radioactivity
  "learnSch_physics_f4_name": "Nuclear Physics & Radioactivity",
  "learnSch_physics_f4_desc": "Nuclear physics explores the structure of atomic nuclei and the forces that hold them together. Unstable nuclei release energy as radiation to reach a more stable state. Nuclear reactions power the Sun, nuclear plants, and explain the origin of elements in stars.",
  "learnSch_physics_f4_kp0": "The nucleus contains protons (positive) and neutrons (neutral), held together by the strong nuclear force — far stronger than electrostatic repulsion.",
  "learnSch_physics_f4_kp1": "Alpha (α) decay emits a helium nucleus (2 protons + 2 neutrons). Beta (β) decay emits an electron or positron. Gamma (γ) decay emits high-energy electromagnetic radiation.",
  "learnSch_physics_f4_kp2": "Half-life: the time for half of a radioactive sample to decay. After n half-lives, the remaining fraction is (½)ⁿ.",
  "learnSch_physics_f4_kp3": "Mass–energy equivalence: E = mc² — a tiny mass converts to enormous energy (c = 3×10⁸ m/s).",
  "learnSch_physics_f4_kp4": "Fission splits a heavy nucleus (e.g. ²³⁵U) releasing energy; fusion joins light nuclei (e.g. ²H + ³H → ⁴He) releasing even more energy per unit mass.",
  "learnSch_physics_f4_task": "A radioactive isotope has a half-life of 5 years. If you start with 80 g, how much remains after 15 years? Write each step. Then use E = mc² to find the energy released if 1 g of mass is converted entirely to energy.",
  "learnSch_physics_f4_tp0": "Radioactive decay types",
  "learnSch_physics_f4_tp1": "Half-life calculations",
  "learnSch_physics_f4_tp2": "Fission and fusion",

  // f5 – Quantum Physics Basics
  "learnSch_physics_f5_name": "Quantum Physics Basics",
  "learnSch_physics_f5_desc": "Quantum physics describes the behaviour of matter and energy at the atomic and subatomic scale. At this level, particles behave like waves, energy comes in discrete packets (quanta), and the act of measurement affects what is observed. Quantum physics underlies lasers, semiconductors, and MRI scanners.",
  "learnSch_physics_f5_kp0": "Planck's relation: energy of a photon is E = hf, where h = 6.63×10⁻³⁴ J·s (Planck's constant) and f is frequency.",
  "learnSch_physics_f5_kp1": "Photoelectric effect: light ejects electrons from metal surfaces — proves light behaves as particles (photons). Einstein won the Nobel Prize for this explanation.",
  "learnSch_physics_f5_kp2": "Wave–particle duality: electrons (and all particles) behave as both waves and particles; de Broglie wavelength λ = h/(mv).",
  "learnSch_physics_f5_kp3": "Heisenberg uncertainty principle: Δx · Δp ≥ ℏ/2 — you cannot know both position and momentum of a particle precisely at the same time.",
  "learnSch_physics_f5_kp4": "Electrons occupy discrete energy levels in atoms; when an electron drops to a lower level, it emits a photon with energy equal to the difference.",
  "learnSch_physics_f5_task": "A photon has frequency 6.0×10¹⁴ Hz. Calculate its energy (h = 6.63×10⁻³⁴ J·s). Then find the wavelength of an electron moving at 2.0×10⁶ m/s (mass = 9.11×10⁻³¹ kg).",
  "learnSch_physics_f5_tp0": "Photons and photoelectric effect",
  "learnSch_physics_f5_tp1": "Wave–particle duality",
  "learnSch_physics_f5_tp2": "Atomic energy levels",

  // f6 – Special Relativity Basics
  "learnSch_physics_f6_name": "Special Relativity Basics",
  "learnSch_physics_f6_desc": "Einstein's special relativity (1905) revolutionised physics by showing that space and time are not absolute — they stretch and compress depending on relative velocity. At speeds close to the speed of light, time slows down, objects shorten, and mass increases. These effects, confirmed by GPS satellites and particle accelerators, change how we understand the universe.",
  "learnSch_physics_f6_kp0": "1st postulate: the laws of physics are identical in all inertial (non-accelerating) reference frames.",
  "learnSch_physics_f6_kp1": "2nd postulate: the speed of light c = 3×10⁸ m/s is constant for all observers, regardless of the motion of the source or observer.",
  "learnSch_physics_f6_kp2": "Time dilation: a moving clock runs slower. Δt' = Δt / √(1 − v²/c²). The faster you move, the slower time passes for you.",
  "learnSch_physics_f6_kp3": "Length contraction: a moving object is shorter in the direction of motion. L' = L₀ √(1 − v²/c²).",
  "learnSch_physics_f6_kp4": "Mass–energy equivalence E = mc²: rest mass is a stored form of energy. This is why nuclear reactions release so much energy.",
  "learnSch_physics_f6_task": "A rocket is 100 m long at rest and travels at 0.8c. What is its length as measured by an observer on Earth? Use L' = L₀√(1 − v²/c²). Also, by how many seconds does 1 minute on the rocket differ from 1 minute on Earth?",
  "learnSch_physics_f6_tp0": "Time dilation",
  "learnSch_physics_f6_tp1": "Length contraction",
  "learnSch_physics_f6_tp2": "E = mc² and mass–energy",

  // ════════════════════════════════════════════════════════════════════════
  // SCHOOL – CHEMISTRY  (f3 – f6)
  // ════════════════════════════════════════════════════════════════════════

  // f3 – Organic Chemistry
  "learnSch_chemistry_f3_name": "Organic Chemistry",
  "learnSch_chemistry_f3_desc": "Organic chemistry studies carbon-based compounds. Carbon's unique ability to form four covalent bonds creates an almost infinite variety of molecules — the building blocks of life, medicines, fuels, and plastics. Mastering functional groups and reaction types unlocks biochemistry, pharmacology, and materials science.",
  "learnSch_chemistry_f3_kp0": "All organic molecules contain carbon, typically bonded to hydrogen (C–H) and often also to O, N, S, or halogens.",
  "learnSch_chemistry_f3_kp1": "Hydrocarbons: alkanes (C–C single bonds, saturated), alkenes (C=C double bond, unsaturated), alkynes (C≡C triple bond).",
  "learnSch_chemistry_f3_kp2": "Functional groups determine chemical properties: –OH (alcohol), –COOH (carboxylic acid), –NH₂ (amine), –CHO (aldehyde), –C=O (ketone).",
  "learnSch_chemistry_f3_kp3": "Structural isomers have the same molecular formula but different connectivity; stereoisomers have the same connectivity but different spatial arrangement.",
  "learnSch_chemistry_f3_kp4": "Polymers are large molecules built from repeating monomer units: addition polymerisation (ethene → polyethene) and condensation polymerisation (amino acids → proteins).",
  "learnSch_chemistry_f3_task": "Draw the full structural formula of ethanoic acid (CH₃COOH). Identify the functional group. Write the equation for its reaction with sodium hydroxide (NaOH) and name the products.",
  "learnSch_chemistry_f3_tp0": "Carbon bonding and hydrocarbons",
  "learnSch_chemistry_f3_tp1": "Functional groups and reactions",
  "learnSch_chemistry_f3_tp2": "Polymers and biomolecules",

  // f4 – Electrochemistry
  "learnSch_chemistry_f4_name": "Electrochemistry",
  "learnSch_chemistry_f4_desc": "Electrochemistry explores the relationship between chemical reactions and electrical energy. Batteries convert chemical energy to electricity; electrolysis does the reverse. Redox reactions — electron transfers between species — are at the heart of every electrochemical process, from rusting iron to charging your phone.",
  "learnSch_chemistry_f4_kp0": "Oxidation = loss of electrons (OIL); Reduction = gain of electrons (RIG). Every redox reaction has both processes simultaneously.",
  "learnSch_chemistry_f4_kp1": "In a galvanic (voltaic) cell, a spontaneous redox reaction drives an electric current. The anode is negative (oxidation); the cathode is positive (reduction).",
  "learnSch_chemistry_f4_kp2": "Electrolysis uses external electrical energy to drive a non-spontaneous reaction — used to plate metals, produce aluminium, and split water into H₂ and O₂.",
  "learnSch_chemistry_f4_kp3": "Standard electrode potential (E°): higher E° means stronger oxidising agent. Cell voltage = E°cathode − E°anode.",
  "learnSch_chemistry_f4_kp4": "Faraday's laws: the mass of substance deposited in electrolysis is proportional to the charge passed (Q = It) and to the molar mass.",
  "learnSch_chemistry_f4_task": "In the electrolysis of dilute sulfuric acid, write the half-equations at each electrode. Identify the anode and cathode products. If a current of 2 A flows for 500 s, how many moles of electrons are transferred? (F = 96 500 C/mol)",
  "learnSch_chemistry_f4_tp0": "Redox reactions and oxidation states",
  "learnSch_chemistry_f4_tp1": "Galvanic cells and batteries",
  "learnSch_chemistry_f4_tp2": "Electrolysis applications",

  // f5 – Chemical Equilibrium
  "learnSch_chemistry_f5_name": "Chemical Equilibrium",
  "learnSch_chemistry_f5_desc": "Chemical equilibrium occurs in a closed system when the forward and reverse reactions proceed at equal rates, so the concentrations of reactants and products remain constant. Understanding equilibrium is essential for industrial chemistry (the Haber process) and biological systems (blood pH, enzyme activity).",
  "learnSch_chemistry_f5_kp0": "At equilibrium, the rate of the forward reaction equals the rate of the reverse reaction — concentrations are constant but not necessarily equal.",
  "learnSch_chemistry_f5_kp1": "Equilibrium constant K = [products]^n / [reactants]^m. K >> 1: products favoured. K << 1: reactants favoured.",
  "learnSch_chemistry_f5_kp2": "Le Chatelier's principle: if a system at equilibrium is disturbed, it shifts to counteract the change and restore equilibrium.",
  "learnSch_chemistry_f5_kp3": "Increasing concentration of a reactant shifts equilibrium towards products. Removing a product does the same.",
  "learnSch_chemistry_f5_kp4": "For gases: increasing pressure shifts equilibrium towards the side with fewer moles of gas. Temperature increase favours the endothermic direction.",
  "learnSch_chemistry_f5_task": "N₂(g) + 3H₂(g) ⇌ 2NH₃(g)  ΔH = −92 kJ/mol. Predict the shift in equilibrium when: (a) pressure is increased, (b) temperature is raised, (c) more N₂ is added. Explain each using Le Chatelier's principle.",
  "learnSch_chemistry_f5_tp0": "Le Chatelier's principle",
  "learnSch_chemistry_f5_tp1": "Equilibrium constants Kc and Kp",
  "learnSch_chemistry_f5_tp2": "Haber and Contact processes",

  // f6 – Environmental Chemistry
  "learnSch_chemistry_f6_name": "Environmental Chemistry",
  "learnSch_chemistry_f6_desc": "Environmental chemistry investigates how chemical substances interact with air, water, and soil — and how human activity alters these systems. It explains climate change, ozone depletion, water pollution, and the chemistry behind sustainable solutions like green chemistry and biodegradable materials.",
  "learnSch_chemistry_f6_kp0": "Greenhouse gases (CO₂, CH₄, N₂O, H₂O vapour) absorb and re-emit infrared radiation, warming Earth's surface — the greenhouse effect.",
  "learnSch_chemistry_f6_kp1": "Acid rain: SO₂ and NOₓ (from fossil fuel combustion) dissolve in rainwater forming H₂SO₃ and HNO₃, lowering pH and harming ecosystems.",
  "learnSch_chemistry_f6_kp2": "Ozone depletion: CFCs release Cl· radicals in the stratosphere, which catalytically destroy O₃: Cl· + O₃ → ClO· + O₂ (chain reaction).",
  "learnSch_chemistry_f6_kp3": "Eutrophication: nitrate and phosphate run-off from fertilisers cause algal blooms that deplete dissolved oxygen and kill aquatic life.",
  "learnSch_chemistry_f6_kp4": "Green chemistry principles: design reactions that minimise waste, use renewable feedstocks, avoid hazardous solvents, and maximise atom economy.",
  "learnSch_chemistry_f6_task": "Explain the complete chain reaction by which one CFC molecule can destroy thousands of ozone molecules. Write the two key steps. Then calculate the atom economy of the reaction 2H₂ + O₂ → 2H₂O.",
  "learnSch_chemistry_f6_tp0": "Greenhouse effect and climate",
  "learnSch_chemistry_f6_tp1": "Acid rain and ozone layer",
  "learnSch_chemistry_f6_tp2": "Water quality and green chemistry"
};

const before = Object.keys(en).length;
Object.assign(en, keys);
const after = Object.keys(en).length;
fs.writeFileSync(enPath, JSON.stringify(en, null, 2), 'utf8');
console.log('Batch A done. Added', after - before, 'new keys. Total:', after);
