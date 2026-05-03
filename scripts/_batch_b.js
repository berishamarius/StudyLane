// BATCH B – School: Biology f3-f6 + CS f3-f5 + Language Arts f3 + History f2-f4 + Geography f2-f3 + Economics f2-f3
const fs = require('fs');
const path = require('path');
const enPath = path.join(__dirname, '../locales/en.json');
const en = JSON.parse(fs.readFileSync(enPath, 'utf8'));

const keys = {

  // ════════════════════════════════════════════════════════════════
  // SCHOOL – BIOLOGY  (f3 – f6)
  // ════════════════════════════════════════════════════════════════

  // f3 – Genetics
  "learnSch_biology_f3_name": "Genetics",
  "learnSch_biology_f3_desc": "Genetics is the science of heredity — how traits are passed from parents to offspring through genes and chromosomes. It underpins medicine (genetic diseases, personalized treatment), agriculture (crop breeding), and forensic science (DNA profiling). Understanding genetics means understanding why individuals differ and how inherited diseases arise.",
  "learnSch_biology_f3_kp0": "Genes are segments of DNA that code for proteins. Each gene occupies a specific location (locus) on a chromosome.",
  "learnSch_biology_f3_kp1": "Humans have 23 pairs of chromosomes (46 total); one set from each parent. Sex chromosomes: XX = female, XY = male.",
  "learnSch_biology_f3_kp2": "Dominant allele (B) masks recessive allele (b) in a heterozygote (Bb). Recessive traits only appear when homozygous (bb).",
  "learnSch_biology_f3_kp3": "Punnett squares predict the probability of offspring genotypes. A monohybrid cross Bb × Bb gives 3:1 phenotype ratio.",
  "learnSch_biology_f3_kp4": "Sex-linked traits (e.g. colour blindness, haemophilia) are carried on the X chromosome; males (XY) are more often affected.",
  "learnSch_biology_f3_task": "Two brown-eyed parents (Bb × Bb) have children. Draw the Punnett square. What is the probability of a child having blue eyes (bb)? What are the genotype and phenotype ratios?",
  "learnSch_biology_f3_tp0": "Mendelian inheritance",
  "learnSch_biology_f3_tp1": "Punnett squares",
  "learnSch_biology_f3_tp2": "Sex-linked inheritance",

  // f4 – Evolution
  "learnSch_biology_f4_name": "Evolution",
  "learnSch_biology_f4_desc": "Evolution is the change in heritable characteristics of populations over generations. Darwin's natural selection is the main mechanism: individuals with advantageous traits survive and reproduce more. Evolution explains the enormous diversity of life on Earth and the shared features among different species.",
  "learnSch_biology_f4_kp0": "Natural selection: individuals with traits better suited to the environment survive and reproduce more, passing advantageous traits to offspring.",
  "learnSch_biology_f4_kp1": "Evidence for evolution: fossil record, comparative anatomy (homologous structures), DNA similarity, biogeography, observed speciation.",
  "learnSch_biology_f4_kp2": "Mutations in DNA are the ultimate source of new genetic variation. Most are neutral; some are harmful; a few provide an advantage.",
  "learnSch_biology_f4_kp3": "Speciation: when populations are isolated (geographic, reproductive) long enough, they evolve into separate species that can no longer interbreed.",
  "learnSch_biology_f4_kp4": "Antibiotic resistance is evolution in action: bacteria with resistance genes survive and reproduce, making resistant strains dominant.",
  "learnSch_biology_f4_task": "Explain in 4 steps how antibiotic resistance develops in a bacterial population using natural selection. Then describe two different types of evidence for evolution and explain what each shows.",
  "learnSch_biology_f4_tp0": "Natural selection",
  "learnSch_biology_f4_tp1": "Evidence for evolution",
  "learnSch_biology_f4_tp2": "Speciation",

  // f5 – Plant Biology
  "learnSch_biology_f5_name": "Plant Biology",
  "learnSch_biology_f5_desc": "Plants are the primary producers in almost all ecosystems — they capture solar energy and convert it into organic matter through photosynthesis. Understanding plant biology covers structure (roots, stems, leaves, flowers), photosynthesis, reproduction, and the vital role plants play in regulating Earth's atmosphere and feeding life.",
  "learnSch_biology_f5_kp0": "Photosynthesis: 6CO₂ + 6H₂O + light energy → C₆H₁₂O₆ + 6O₂. It occurs in chloroplasts containing chlorophyll.",
  "learnSch_biology_f5_kp1": "Leaves are adapted for photosynthesis: large surface area, thin, transparent epidermis, stomata for CO₂ entry, and a rich vascular network.",
  "learnSch_biology_f5_kp2": "Xylem transports water and minerals from roots to leaves. Phloem transports sugars from leaves to the rest of the plant.",
  "learnSch_biology_f5_kp3": "Transpiration: water evaporates through stomata, pulling water up through the xylem (transpiration stream).",
  "learnSch_biology_f5_kp4": "Plant reproduction: flowering plants use pollination (pollen transfer) and fertilisation to produce seeds; seeds disperse to new locations.",
  "learnSch_biology_f5_task": "Design an experiment to test whether light intensity affects the rate of photosynthesis in pondweed. State the independent, dependent, and controlled variables. Predict and explain the result.",
  "learnSch_biology_f5_tp0": "Photosynthesis",
  "learnSch_biology_f5_tp1": "Transport in plants",
  "learnSch_biology_f5_tp2": "Plant reproduction",

  // f6 – Microbiology
  "learnSch_biology_f6_name": "Microbiology",
  "learnSch_biology_f6_desc": "Microbiology is the study of microscopic organisms — bacteria, viruses, fungi, and protists. These tiny entities shape human health, agriculture, food production, and the global carbon cycle. Understanding microbes is essential for medicine (antibiotics, vaccines), biotechnology, and understanding disease.",
  "learnSch_biology_f6_kp0": "Bacteria are prokaryotes (no nucleus). Most are harmless or beneficial; some are pathogens causing infections like tuberculosis and cholera.",
  "learnSch_biology_f6_kp1": "Viruses are not cells — they are strands of DNA/RNA in a protein coat. They replicate only by hijacking a host cell's machinery.",
  "learnSch_biology_f6_kp2": "Antibiotics kill or inhibit bacteria but are useless against viruses (the common cold, flu). Overuse drives antibiotic resistance.",
  "learnSch_biology_f6_kp3": "The immune system: non-specific defences (skin, phagocytes) and specific defences (lymphocytes producing antibodies). Vaccines train the immune system without causing disease.",
  "learnSch_biology_f6_kp4": "Beneficial microbes: gut bacteria aid digestion; fungi produce antibiotics (penicillin from Penicillium); yeast ferments sugars for bread and beer.",
  "learnSch_biology_f6_task": "Compare the structure of a bacterium and a virus. Explain why antibiotics work on one but not the other. Then describe two ways the body defends itself against a bacterial infection.",
  "learnSch_biology_f6_tp0": "Bacteria and viruses",
  "learnSch_biology_f6_tp1": "Immune system and vaccines",
  "learnSch_biology_f6_tp2": "Beneficial microbes and antibiotics",

  // ════════════════════════════════════════════════════════════════
  // SCHOOL – COMPUTER SCIENCE  (f3 – f5)
  // ════════════════════════════════════════════════════════════════

  // f3 – Data Structures & Algorithms
  "learnSch_computer_science_f3_name": "Data Structures & Algorithms",
  "learnSch_computer_science_f3_desc": "Data structures are organised ways to store and access data; algorithms are step-by-step procedures to solve problems. Choosing the right data structure and algorithm determines whether a program runs in milliseconds or hours. This topic is the backbone of efficient software development.",
  "learnSch_computer_science_f3_kp0": "Arrays store elements in a fixed sequence; access by index is O(1). Lists allow dynamic size but may have slower access.",
  "learnSch_computer_science_f3_kp1": "Stacks (LIFO — last in, first out) and queues (FIFO — first in, first out) manage ordered collections for specific use cases.",
  "learnSch_computer_science_f3_kp2": "Linear search checks every element (O(n)); binary search requires sorted data and halves the search space each step (O(log n)).",
  "learnSch_computer_science_f3_kp3": "Bubble sort compares adjacent elements and swaps them (O(n²)). Merge sort splits and merges recursively (O(n log n)) — much faster for large data.",
  "learnSch_computer_science_f3_kp4": "Big-O notation describes algorithm efficiency: O(1) is constant, O(n) is linear, O(n²) is quadratic — the lower the better for large inputs.",
  "learnSch_computer_science_f3_task": "Trace bubble sort on the list [5, 3, 8, 1, 4]. Show each pass. Count the total comparisons and swaps. Then write pseudocode for binary search on a sorted list.",
  "learnSch_computer_science_f3_tp0": "Arrays and lists",
  "learnSch_computer_science_f3_tp1": "Searching algorithms",
  "learnSch_computer_science_f3_tp2": "Sorting algorithms",

  // f4 – Databases
  "learnSch_computer_science_f4_name": "Databases",
  "learnSch_computer_science_f4_desc": "A database is an organised collection of structured data. Relational databases store data in tables linked by keys. SQL allows you to create, query, update, and delete records. Databases power every major application from school management systems to social media platforms.",
  "learnSch_computer_science_f4_kp0": "A relational database stores data in tables (rows = records, columns = fields). Tables are linked by primary and foreign keys.",
  "learnSch_computer_science_f4_kp1": "Primary key: a unique identifier for each record in a table. Foreign key: links one table to the primary key of another.",
  "learnSch_computer_science_f4_kp2": "SQL SELECT query: SELECT column FROM table WHERE condition ORDER BY column. Example: SELECT name FROM students WHERE grade = 'A'.",
  "learnSch_computer_science_f4_kp3": "Normalisation reduces data duplication by splitting tables so each piece of data is stored only once.",
  "learnSch_computer_science_f4_kp4": "CRUD operations: Create (INSERT), Read (SELECT), Update (UPDATE), Delete (DELETE) — the four basic database actions.",
  "learnSch_computer_science_f4_task": "Design a simple database for a school library (books, students, loans). Define at least 3 tables, their fields, and relationships. Then write an SQL query to find all books currently on loan to student ID 42.",
  "learnSch_computer_science_f4_tp0": "Tables and keys",
  "learnSch_computer_science_f4_tp1": "SQL queries",
  "learnSch_computer_science_f4_tp2": "Normalisation",

  // f5 – Networks & Internet
  "learnSch_computer_science_f5_name": "Networks & the Internet",
  "learnSch_computer_science_f5_desc": "A network connects computers to share data and resources. The internet is the world's largest network — a network of networks. Understanding how data travels (protocols, IP addresses, DNS) and how it is protected (encryption, firewalls) is essential in the digital age.",
  "learnSch_computer_science_f5_kp0": "LAN (Local Area Network): connects devices in a small area. WAN (Wide Area Network): connects LANs over large distances — the internet is a WAN.",
  "learnSch_computer_science_f5_kp1": "IP address: a unique numerical label for each device on a network (e.g. 192.168.1.1 for IPv4). DNS translates domain names (google.com) to IP addresses.",
  "learnSch_computer_science_f5_kp2": "TCP/IP protocol suite: Transmission Control Protocol ensures data packets arrive correctly; Internet Protocol routes them.",
  "learnSch_computer_science_f5_kp3": "HTTP (HyperText Transfer Protocol) transfers web pages. HTTPS adds TLS encryption — the padlock icon shows your connection is encrypted.",
  "learnSch_computer_science_f5_kp4": "Packet switching: data is split into packets, each routed independently across the network, then reassembled at the destination.",
  "learnSch_computer_science_f5_task": "Trace what happens when you type 'www.example.com' into a browser and press Enter — from DNS lookup to receiving the webpage. Name every protocol and step involved.",
  "learnSch_computer_science_f5_tp0": "Network types and protocols",
  "learnSch_computer_science_f5_tp1": "IP addresses and DNS",
  "learnSch_computer_science_f5_tp2": "Security: HTTPS and encryption",

  // ════════════════════════════════════════════════════════════════
  // SCHOOL – LANGUAGE ARTS  (f3)
  // ════════════════════════════════════════════════════════════════

  // f3 – Rhetoric & Argumentation
  "learnSch_language_arts_f3_name": "Rhetoric & Argumentation",
  "learnSch_language_arts_f3_desc": "Rhetoric is the art of persuasive communication — using language effectively to inform, persuade, or motivate an audience. Argumentation teaches you to construct logical, evidence-based arguments and to identify and counter weak reasoning. These skills are essential for debates, essays, legal proceedings, and civic life.",
  "learnSch_language_arts_f3_kp0": "Aristotle's three modes of persuasion: Ethos (credibility of the speaker), Pathos (emotional appeal), Logos (logical argument and evidence).",
  "learnSch_language_arts_f3_kp1": "A strong argument has: a clear claim (thesis), supporting reasons, evidence, and a response to counterarguments.",
  "learnSch_language_arts_f3_kp2": "Logical fallacies undermine arguments: ad hominem (attacking the person), straw man (misrepresenting the opposing view), false dichotomy (only two options presented).",
  "learnSch_language_arts_f3_kp3": "Deductive reasoning moves from general principles to specific conclusions (all humans are mortal; Socrates is human; therefore Socrates is mortal).",
  "learnSch_language_arts_f3_kp4": "Inductive reasoning draws general conclusions from specific observations — powerful but can be wrong if examples are unrepresentative.",
  "learnSch_language_arts_f3_task": "Read a newspaper opinion piece. Identify the main claim, three pieces of supporting evidence, the intended audience, and one logical fallacy (if any). Then write a 200-word counter-argument using all three of Aristotle's modes.",
  "learnSch_language_arts_f3_tp0": "Ethos, pathos, logos",
  "learnSch_language_arts_f3_tp1": "Logical fallacies",
  "learnSch_language_arts_f3_tp2": "Essay argumentation",

  // ════════════════════════════════════════════════════════════════
  // SCHOOL – HISTORY  (f2 – f4)
  // ════════════════════════════════════════════════════════════════

  // f2 – Modern History (1500–1900)
  "learnSch_history_f2_name": "Modern History (1500–1900)",
  "learnSch_history_f2_desc": "The modern period transformed the world through exploration, revolution, and industrialisation. European expansion connected continents, the Enlightenment challenged tradition with reason, democratic revolutions reshaped governments, and the Industrial Revolution changed how people lived and worked — laying the foundations for the contemporary world.",
  "learnSch_history_f2_kp0": "Age of Exploration (1400s–1600s): European powers (Portugal, Spain, England, Netherlands) navigated to the Americas, Africa, and Asia, creating global trade networks and colonial empires.",
  "learnSch_history_f2_kp1": "Scientific Revolution and Enlightenment (1600s–1700s): thinkers like Galileo, Newton, Locke, and Voltaire used reason and observation to challenge church authority and traditional power.",
  "learnSch_history_f2_kp2": "American Revolution (1776) and French Revolution (1789): inspired by Enlightenment ideas, colonies and citizens overthrew monarchies to establish rights, constitutions, and popular sovereignty.",
  "learnSch_history_f2_kp3": "Industrial Revolution (1760s–1850s): began in Britain — coal, steam engines, factories, and railways transformed agriculture-based societies into industrial urban economies.",
  "learnSch_history_f2_kp4": "Colonialism: European nations colonised Africa, Asia, and the Americas — extracting resources, displacing populations, and leaving long-lasting political and cultural consequences.",
  "learnSch_history_f2_task": "Choose one event from 1500–1900 (e.g. the French Revolution). Explain: (a) three causes, (b) two key events, (c) two long-term consequences. Use specific dates and people.",
  "learnSch_history_f2_tp0": "Age of Exploration",
  "learnSch_history_f2_tp1": "Enlightenment and revolutions",
  "learnSch_history_f2_tp2": "Industrial Revolution",

  // f3 – 20th Century World History
  "learnSch_history_f3_name": "20th Century World History",
  "learnSch_history_f3_desc": "The 20th century brought world wars, totalitarianism, decolonisation, and the Cold War — reshaping every nation on Earth. It was also a century of astonishing progress: the defeat of fascism, the rise of human rights, moon landings, and the digital revolution. Understanding it is essential to understanding today's world.",
  "learnSch_history_f3_kp0": "World War I (1914–1918): triggered by the assassination of Archduke Franz Ferdinand; caused by nationalism, imperialism, militarism, and alliance systems. ~17 million dead.",
  "learnSch_history_f3_kp1": "World War II (1939–1945): Nazi Germany, Fascist Italy, and Imperial Japan against the Allies. The Holocaust murdered ~6 million Jewish people. Ended with atomic bombs on Hiroshima and Nagasaki.",
  "learnSch_history_f3_kp2": "Cold War (1947–1991): ideological and geopolitical rivalry between the USA (capitalism, democracy) and USSR (communism). Proxy wars, the Space Race, nuclear arms race, and Berlin Wall divided the world.",
  "learnSch_history_f3_kp3": "Decolonisation (1945–1975): independence movements in Africa, Asia, and the Middle East ended European colonial empires. Often accompanied by conflict and instability.",
  "learnSch_history_f3_kp4": "United Nations founded 1945 to maintain peace; Universal Declaration of Human Rights adopted 1948 — both direct responses to WWII atrocities.",
  "learnSch_history_f3_task": "Compare the causes and consequences of WWI and WWII. Create a table with: Main cause, Key turning point, Death toll, Major consequence. Then explain how WWII led directly to the Cold War.",
  "learnSch_history_f3_tp0": "World Wars",
  "learnSch_history_f3_tp1": "Cold War",
  "learnSch_history_f3_tp2": "Decolonisation and human rights",

  // f4 – Historical Methods
  "learnSch_history_f4_name": "Historical Methods & Source Analysis",
  "learnSch_history_f4_desc": "History is not just dates and events — it is the interpretation of evidence. Historians analyse primary sources (original documents, artefacts) and secondary sources (textbooks, biographies) to reconstruct the past. Learning how to evaluate sources critically makes you a better researcher, thinker, and citizen.",
  "learnSch_history_f4_kp0": "Primary source: created at the time of the event (diary, photograph, treaty, newspaper). Secondary source: created later, interpreting primary sources (biography, documentary, textbook).",
  "learnSch_history_f4_kp1": "SOAPS analysis: Source, Occasion, Audience, Purpose, Subject — a framework for understanding any historical document.",
  "learnSch_history_f4_kp2": "Reliability vs. usefulness: a biased source can still be useful as evidence of what the author believed or what propaganda existed at the time.",
  "learnSch_history_f4_kp3": "Causation vs. correlation: just because two events happen together does not mean one caused the other. Historians look for evidence of direct connection.",
  "learnSch_history_f4_kp4": "Historiography is the study of how history has been written and interpreted. The same event (e.g. the French Revolution) can be seen very differently by different historians.",
  "learnSch_history_f4_task": "Find a historical speech or letter from any period. Apply SOAPS analysis. Assess its reliability (consider the author's position and purpose) and its usefulness (what historical questions does it help answer?).",
  "learnSch_history_f4_tp0": "Primary and secondary sources",
  "learnSch_history_f4_tp1": "Source analysis (SOAPS)",
  "learnSch_history_f4_tp2": "Bias, reliability and usefulness",

  // ════════════════════════════════════════════════════════════════
  // SCHOOL – GEOGRAPHY  (f2 – f3)
  // ════════════════════════════════════════════════════════════════

  // f2 – Maps & Cartography
  "learnSch_geography_f2_name": "Maps & Cartography",
  "learnSch_geography_f2_desc": "Maps are powerful tools for representing spatial information. Cartography is the science and art of making maps. From ancient clay tablets to GPS satellite images, maps have guided exploration, shaped politics, and made sense of our world. Reading and creating maps is a fundamental geographic skill.",
  "learnSch_geography_f2_kp0": "Scale: the ratio between distance on a map and the real-world distance. A 1:50,000 scale map means 1 cm = 500 m.",
  "learnSch_geography_f2_kp1": "Grid references: lines of latitude (horizontal, measures north/south) and longitude (vertical, measures east/west) precisely locate any point on Earth.",
  "learnSch_geography_f2_kp2": "Contour lines connect points of equal elevation; closely spaced contours = steep slope; widely spaced = gentle slope.",
  "learnSch_geography_f2_kp3": "Map projections distort Earth's curved surface on a flat map. Mercator projection preserves shape but distorts size; Peters projection preserves area but distorts shape.",
  "learnSch_geography_f2_kp4": "GIS (Geographic Information System) layers multiple data sets (population, land use, climate) onto digital maps for analysis and decision-making.",
  "learnSch_geography_f2_task": "Using a topographic map (or drawing your own), identify: (a) a steep slope, (b) a valley, (c) a hill summit. Write the 6-figure grid reference for the summit. Calculate the real distance of a 4 cm route on a 1:50,000 map.",
  "learnSch_geography_f2_tp0": "Scale and grid references",
  "learnSch_geography_f2_tp1": "Contour lines and relief",
  "learnSch_geography_f2_tp2": "Map projections and GIS",

  // f3 – Climate & Weather Systems
  "learnSch_geography_f3_name": "Climate & Weather Systems",
  "learnSch_geography_f3_desc": "Weather is the short-term state of the atmosphere; climate is the long-term average. Earth's climate zones — from tropical to polar — are shaped by latitude, ocean currents, altitude, and prevailing winds. Understanding climate systems is critical for agriculture, disaster preparedness, and addressing climate change.",
  "learnSch_geography_f3_kp0": "Factors affecting climate: latitude (angle of sun), altitude (temperature drops ~6.5°C per 1000 m), distance from sea, ocean currents, prevailing winds.",
  "learnSch_geography_f3_kp1": "Tropical climate: hot and wet year-round, near the equator. Mediterranean: hot dry summers, mild wet winters. Polar: permanently cold, little precipitation.",
  "learnSch_geography_f3_kp2": "Frontal rainfall: warm and cold air masses meet; warm air rises over cold, cools, and condenses. Common in mid-latitudes (UK, Germany).",
  "learnSch_geography_f3_kp3": "The water cycle: evaporation → condensation (cloud formation) → precipitation → surface run-off / infiltration → back to evaporation.",
  "learnSch_geography_f3_kp4": "Climate change: rising CO₂ intensifies the greenhouse effect, causing global warming, more extreme weather events, rising sea levels, and shifting climate zones.",
  "learnSch_geography_f3_task": "Compare the climate of a tropical rainforest location with a desert location. For each: state mean annual temperature, annual rainfall, causes, and two adaptations of organisms living there.",
  "learnSch_geography_f3_tp0": "Factors affecting climate",
  "learnSch_geography_f3_tp1": "Climate zones",
  "learnSch_geography_f3_tp2": "Weather fronts and water cycle",

  // ════════════════════════════════════════════════════════════════
  // SCHOOL – ECONOMICS  (f2 – f3)
  // ════════════════════════════════════════════════════════════════

  // f2 – International Trade & Globalisation
  "learnSch_economics_f2_name": "International Trade & Globalisation",
  "learnSch_economics_f2_desc": "International trade allows countries to specialise in what they produce most efficiently and trade for everything else. Globalisation — the increasing interconnection of economies, cultures, and people — has lifted hundreds of millions out of poverty but has also created inequality and environmental challenges.",
  "learnSch_economics_f2_kp0": "Comparative advantage: a country should specialise in producing goods where its opportunity cost is lowest, then trade — even if it is absolutely better at everything.",
  "learnSch_economics_f2_kp1": "Exports: goods and services sold abroad (income for the country). Imports: goods and services bought from abroad (spending).",
  "learnSch_economics_f2_kp2": "Trade barriers: tariffs (taxes on imports), quotas (import limits), embargoes (total bans) — protect domestic industries but raise prices for consumers.",
  "learnSch_economics_f2_kp3": "Free trade agreements (e.g. EU Single Market, NAFTA) reduce barriers between member countries, boosting trade and economic growth.",
  "learnSch_economics_f2_kp4": "Balance of trade: exports − imports. A trade surplus means more is exported; a trade deficit means more is imported.",
  "learnSch_economics_f2_task": "Country A can produce 100 computers OR 200 tonnes of wheat per year. Country B can produce 60 computers OR 180 tonnes of wheat. Show which country has comparative advantage in each product and explain why both benefit from specialisation and trade.",
  "learnSch_economics_f2_tp0": "Comparative advantage",
  "learnSch_economics_f2_tp1": "Trade barriers and free trade",
  "learnSch_economics_f2_tp2": "Globalisation effects",

  // f3 – Personal Finance
  "learnSch_economics_f3_name": "Personal Finance",
  "learnSch_economics_f3_desc": "Personal finance covers the practical management of money: earning, saving, budgeting, borrowing, and investing. Financial literacy helps you avoid debt traps, build wealth, and make informed decisions throughout your life — from your first job to retirement. These skills are rarely taught but universally needed.",
  "learnSch_economics_f3_kp0": "A budget allocates your income across needs (rent, food), wants (entertainment), and savings. The 50/30/20 rule: 50% needs, 30% wants, 20% savings.",
  "learnSch_economics_f3_kp1": "Compound interest: interest is earned on both the principal and accumulated interest. €1,000 at 5% annual compound interest becomes €1,629 after 10 years.",
  "learnSch_economics_f3_kp2": "Good debt (mortgage, student loan) can build wealth or skills. Bad debt (high-interest credit card, payday loan) traps you in a cycle of payments.",
  "learnSch_economics_f3_kp3": "Inflation erodes purchasing power: if inflation is 3% and your savings earn 1%, your money loses real value every year.",
  "learnSch_economics_f3_kp4": "Diversification: spreading investments across different assets (stocks, bonds, property) reduces risk — 'don't put all your eggs in one basket'.",
  "learnSch_economics_f3_task": "Create a monthly budget for a student earning €800/month. Allocate amounts using the 50/30/20 rule. Then calculate how much €500 grows to in 5 years at 4% annual compound interest: A = P(1 + r)^n.",
  "learnSch_economics_f3_tp0": "Budgeting and saving",
  "learnSch_economics_f3_tp1": "Compound interest",
  "learnSch_economics_f3_tp2": "Debt, investment, and inflation"
};

const before = Object.keys(en).length;
Object.assign(en, keys);
const after = Object.keys(en).length;
fs.writeFileSync(enPath, JSON.stringify(en, null, 2), 'utf8');
console.log('Batch B done. Added', after - before, 'new keys. Total:', after);
