(function () {
  window.LEARN_SOURCES = {
  "core": {
    "math": [
      "Khan Academy",
      "OpenStax Mathematics",
      "GeoGebra"
    ],
    "physics": [
      "OpenStax University Physics",
      "PhET Simulations (U Colorado)",
      "MIT OpenCourseWare Physics"
    ],
    "chemistry": [
      "Chemistry LibreTexts",
      "Royal Society of Chemistry",
      "OpenStax Chemistry 2e"
    ],
    "biology": [
      "OpenStax Biology 2e",
      "HHMI BioInteractive",
      "NCBI Bookshelf"
    ],
    "cs": [
      "CS50 Harvard",
      "MIT OpenCourseWare CS",
      "MDN Web Docs"
    ],
    "engineering": [
      "MIT OpenCourseWare Engineering",
      "NPTEL (IITs)",
      "Open Textbook Library"
    ],
    "medicine": [
      "MedlinePlus",
      "WHO Learning Academy",
      "PubMed"
    ],
    "law": [
      "Cornell Law LII",
      "EUR-Lex",
      "UN Treaty Collection"
    ],
    "economics": [
      "CORE Econ",
      "OpenStax Economics",
      "World Bank Open Learning"
    ],
    "socialScience": [
      "OECD Education",
      "Our World in Data",
      "UNESCO Institute for Statistics"
    ],
    "writing": [
      "Purdue OWL",
      "Open Textbook Library",
      "Saylor Academy"
    ],
    "earthScience": [
      "NASA STEM",
      "USGS Education",
      "NOAA Education"
    ],
    "geography": [
      "National Geographic Education",
      "UN Data",
      "World Bank Data"
    ],
    "languageArts": [
      "British Council Learn English",
      "Cambridge Dictionary",
      "Purdue OWL"
    ],
    "languageLearning": [
      "Institut francais",
      "Instituto Cervantes",
      "Goethe-Institut"
    ],
    "arts": [
      "The Met Museum Learning",
      "Google Arts & Culture",
      "Smarthistory"
    ],
    "health": [
      "WHO",
      "CDC",
      "NHS Health A-Z"
    ],
    "architecture": [
      "MIT OpenCourseWare Architecture",
      "RIBA",
      "ArchDaily"
    ],
    "agriculture": [
      "FAO e-Learning Academy",
      "USDA Education",
      "CIMMYT"
    ],
    "cybersecurity": [
      "NIST Cybersecurity",
      "ENISA",
      "CISA"
    ],
    "businessPolicy": [
      "IMF",
      "ILO",
      "OECD Policy"
    ],
    "energy": [
      "IEA",
      "IRENA",
      "US Dept of Energy"
    ],
    "ocean": [
      "NOAA Oceans",
      "UNESCO Oceanographic Commission",
      "WHOI"
    ]
  },
  "school": [
    {
      "id": "mathematics",
      "title": "Mathematics",
      "folders": [
        {
          "name": "Algebra",
          "description": "Algebra uses letters and symbols to represent numbers and describe relationships. It is the backbone of all advanced mathematics. You learn to solve equations, work with variables, and find unknown values through logical steps.",
          "keyPoints": [
            "A variable (like x or y) stands for an unknown number.",
            "An equation shows that two expressions are equal (e.g. 2x + 3 = 7).",
            "To solve an equation, do the same operation on both sides to isolate the variable.",
            "Functions map every input to exactly one output: f(x) = 2x means double the input.",
            "Polynomials are expressions with multiple terms: 3x² + 2x − 1."
          ],
          "miniTask": "Solve: 3x − 5 = 10. Write each step. Then check your answer by substituting x back.",
          "topics": [
            "Linear equations",
            "Functions",
            "Polynomials"
          ],
          "sourceGroup": "math"
        },
        {
          "name": "Geometry",
          "description": "Geometry studies shapes, angles, and spatial relationships. It teaches you to reason logically and prove statements using definitions and theorems. Geometry appears in architecture, art, engineering, and everyday life.",
          "keyPoints": [
            "A point has no size; a line extends infinitely in both directions.",
            "Angles are measured in degrees: a right angle = 90°, a straight angle = 180°.",
            "The sum of angles in any triangle is always 180°.",
            "Pythagorean theorem: in a right triangle, a² + b² = c² (c is the hypotenuse).",
            "Congruent shapes are identical in size and shape; similar shapes have the same angles but different sizes."
          ],
          "miniTask": "A right triangle has legs of 3 cm and 4 cm. Calculate the hypotenuse using a² + b² = c².",
          "topics": [
            "Angles and triangles",
            "Coordinate geometry",
            "Transformations"
          ],
          "sourceGroup": "math"
        },
        {
          "name": "Statistics and Probability",
          "description": "Statistics helps you collect, organize, and interpret data to draw conclusions. Probability measures how likely an event is. Together they are essential in science, economics, and everyday decision-making.",
          "keyPoints": [
            "Mean = sum of all values ÷ number of values.",
            "Median = the middle value when data is sorted.",
            "Probability of an event = (favorable outcomes) ÷ (total outcomes).",
            "A histogram shows the frequency distribution of data.",
            "Correlation shows whether two variables tend to move together — but not causation."
          ],
          "miniTask": "Roll a die: what is the probability of getting an even number? Show the calculation.",
          "topics": [
            "Data visualization",
            "Probability rules",
            "Distributions"
          ],
          "sourceGroup": "math"
        },
        {
          "name": "Trigonometry",
          "description": "Trigonometry studies relationships between angles and side lengths in triangles. It is used in physics, engineering, navigation, and music. The three main functions — sine, cosine, and tangent — connect angles to ratios of sides.",
          "keyPoints": [
            "In a right triangle: sin(θ) = opposite/hypotenuse, cos(θ) = adjacent/hypotenuse, tan(θ) = opposite/adjacent.",
            "Memorize with SOH-CAH-TOA.",
            "The unit circle extends trig to all angles beyond 90°.",
            "Sine and cosine are periodic: they repeat every 360° (2π radians).",
            "1 radian ≈ 57.3°; full circle = 2π radians = 360°."
          ],
          "miniTask": "A ladder 5 m long leans against a wall at 60°. How high does it reach? Use sin(60°) = √3/2.",
          "topics": [
            "Sine cosine tangent",
            "Right triangle problems",
            "Unit circle basics"
          ],
          "sourceGroup": "math"
        }
      ]
    },
    {
      "id": "physics",
      "title": "Physics",
      "folders": [
        {
          "name": "Mechanics",
          "description": "Mechanics is the study of motion and the forces that cause it. Newton’s three laws of motion are the foundation. Understanding mechanics helps explain everything from falling objects to rocket launches.",
          "keyPoints": [
            "Newton’s 1st law: an object at rest stays at rest unless acted on by a force.",
            "Newton’s 2nd law: Force = mass × acceleration (F = ma).",
            "Newton’s 3rd law: every action has an equal and opposite reaction.",
            "Kinetic energy = ½ × mass × velocity² (KE = ½mv²).",
            "Work = Force × distance in the direction of the force (W = Fd)."
          ],
          "miniTask": "A 2 kg ball accelerates at 3 m/s². What force acts on it? Use F = ma.",
          "topics": [
            "Motion",
            "Forces",
            "Energy and work"
          ],
          "sourceGroup": "physics"
        },
        {
          "name": "Electricity and Magnetism",
          "description": "Electricity is the flow of electric charge through conductors. Magnetism arises from moving charges and magnetic materials. Both are unified in electromagnetism, which powers modern technology.",
          "keyPoints": [
            "Ohm’s law: Voltage = Current × Resistance (V = IR).",
            "Series circuit: same current through all components; voltages add up.",
            "Parallel circuit: same voltage across all components; currents add up.",
            "Power = Voltage × Current (P = VI).",
            "Magnetic fields exert forces on moving charges: F = qvB."
          ],
          "miniTask": "A circuit has a 12 V battery and a 4 Ω resistor. What is the current? Use V = IR.",
          "topics": [
            "Circuits",
            "Current and voltage",
            "Magnetic fields"
          ],
          "sourceGroup": "physics"
        },
        {
          "name": "Waves and Optics",
          "description": "Waves transfer energy without transferring matter. Sound and light are both waves. Optics studies how light behaves — reflecting off mirrors, bending through lenses, and forming images.",
          "keyPoints": [
            "Wave speed = frequency × wavelength (v = fλ).",
            "Sound travels through matter; it cannot travel through a vacuum.",
            "Light travels at 300,000 km/s in a vacuum (c).",
            "Reflection: angle of incidence = angle of reflection.",
            "Refraction: light bends when passing between materials of different densities (Snell’s law)."
          ],
          "miniTask": "A sound wave has frequency 440 Hz and speed 340 m/s. What is its wavelength? Use v = fλ.",
          "topics": [
            "Sound",
            "Light",
            "Lenses and mirrors"
          ],
          "sourceGroup": "physics"
        }
      ]
    },
    {
      "id": "chemistry",
      "title": "Chemistry",
      "folders": [
        {
          "name": "Atomic Structure",
          "description": "Everything is made of atoms. Each atom has a nucleus (protons + neutrons) surrounded by electrons. The periodic table organizes elements by their atomic number and chemical properties.",
          "keyPoints": [
            "Atomic number = number of protons; determines which element it is.",
            "Mass number = protons + neutrons.",
            "Electrons occupy energy levels (shells); outermost electrons determine reactivity.",
            "Isotopes are atoms of the same element with different numbers of neutrons.",
            "Ionic bonds: electrons transfer. Covalent bonds: electrons are shared."
          ],
          "miniTask": "Carbon has atomic number 6. How many protons, electrons, and neutrons does ¹²C have?",
          "topics": [
            "Atoms",
            "Periodic table",
            "Bonding"
          ],
          "sourceGroup": "chemistry"
        },
        {
          "name": "Chemical Reactions",
          "description": "Chemical reactions rearrange atoms to form new substances. Reactants are transformed into products. Understanding reactions helps in medicine, materials science, cooking, and industry.",
          "keyPoints": [
            "Law of conservation of mass: atoms are neither created nor destroyed in a reaction.",
            "Balancing equations: the number of each atom must be equal on both sides.",
            "Reaction rate increases with higher temperature, concentration, or surface area.",
            "Catalysts speed up reactions without being consumed.",
            "Stoichiometry uses mole ratios to calculate quantities in reactions."
          ],
          "miniTask": "Balance this equation: H₂ + O₂ → H₂O. How many H₂ and O₂ molecules do you need?",
          "topics": [
            "Balancing equations",
            "Reaction rates",
            "Stoichiometry"
          ],
          "sourceGroup": "chemistry"
        },
        {
          "name": "Acids and Bases",
          "description": "Acids donate hydrogen ions (H⁺); bases accept them. The pH scale measures acidity from 0 (very acidic) to 14 (very basic), with 7 being neutral. Neutralization reactions combine acids and bases to form water and a salt.",
          "keyPoints": [
            "pH < 7 = acidic (e.g. vinegar pH ≈ 3). pH > 7 = basic (e.g. baking soda pH ≈ 9).",
            "Neutralization: acid + base → salt + water.",
            "Indicators (like litmus) change colour in acids and bases.",
            "Strong acids fully dissociate (HCl); weak acids partially dissociate (CH₃COOH).",
            "Titration determines unknown concentration by reacting with a known solution."
          ],
          "miniTask": "If you mix hydrochloric acid (HCl) with sodium hydroxide (NaOH), what products form? Write the equation.",
          "topics": [
            "pH scale",
            "Neutralization",
            "Titration basics"
          ],
          "sourceGroup": "chemistry"
        }
      ]
    },
    {
      "id": "biology",
      "title": "Biology",
      "folders": [
        {
          "name": "Cell Biology",
          "description": "The cell is the basic unit of all living things. Cells carry out all life functions: obtaining energy, responding to the environment, growing, and reproducing. Understanding cells is the foundation for all biology.",
          "keyPoints": [
            "Prokaryotes (bacteria) have no nucleus; eukaryotes (animals, plants, fungi) have a nucleus.",
            "The nucleus contains DNA, the genetic blueprint of the cell.",
            "Mitochondria produce energy through cellular respiration (ATP).",
            "Mitosis produces two identical daughter cells for growth and repair.",
            "Meiosis produces four sex cells (gametes) with half the chromosome number."
          ],
          "miniTask": "Name three differences between a plant cell and an animal cell with one function for each difference.",
          "topics": [
            "Cell structure",
            "Mitosis and meiosis",
            "DNA and RNA"
          ],
          "sourceGroup": "biology"
        },
        {
          "name": "Human Biology",
          "description": "The human body is a complex system of organ systems that work together to maintain life. Understanding how these systems function helps in health, medicine, and personal well-being.",
          "keyPoints": [
            "The circulatory system pumps blood through the body, delivering oxygen and nutrients.",
            "The digestive system breaks food into nutrients the body can absorb.",
            "The nervous system processes information and coordinates responses.",
            "Homeostasis keeps internal conditions stable (e.g. body temperature at 37°C).",
            "Nutrition: carbohydrates give energy; proteins build; fats store energy and protect organs."
          ],
          "miniTask": "Trace the path of a breath of oxygen from the nose to a muscle cell. Name each organ system involved.",
          "topics": [
            "Body systems",
            "Nutrition",
            "Homeostasis"
          ],
          "sourceGroup": "biology"
        },
        {
          "name": "Ecology",
          "description": "Ecology studies how living organisms interact with each other and their environment. Understanding ecosystems helps us protect biodiversity, manage resources, and address climate change.",
          "keyPoints": [
            "Producers (plants) make food via photosynthesis; consumers eat them.",
            "A food chain shows energy flow: Sun → plant → herbivore → carnivore.",
            "Only about 10% of energy transfers to the next trophic level.",
            "Biodiversity makes ecosystems more resilient to change.",
            "Climate change alters habitats, shifts species ranges, and disrupts food webs."
          ],
          "miniTask": "Draw a simple food web with 5 organisms. Label producers, primary consumers, and secondary consumers.",
          "topics": [
            "Ecosystems",
            "Food webs",
            "Climate impact"
          ],
          "sourceGroup": "biology"
        }
      ]
    },
    {
      "id": "computer-science",
      "title": "Computer Science",
      "folders": [
        {
          "name": "Computational Thinking",
          "description": "Computational thinking is a problem-solving approach used in programming and beyond. It breaks complex problems into manageable parts and finds step-by-step solutions that a computer (or human) can follow.",
          "keyPoints": [
            "Decomposition: break a big problem into smaller, solvable sub-problems.",
            "Pattern recognition: identify similarities and regularities in problems.",
            "Abstraction: focus on the important parts and ignore irrelevant details.",
            "Algorithm: a precise sequence of steps to solve a problem.",
            "Pseudocode helps plan an algorithm in plain language before coding."
          ],
          "miniTask": "Write a step-by-step algorithm (in plain language) for sorting a shuffled deck of 5 cards by number.",
          "topics": [
            "Algorithms",
            "Decomposition",
            "Abstraction"
          ],
          "sourceGroup": "cs"
        },
        {
          "name": "Programming",
          "description": "Programming translates logical ideas into instructions a computer can execute. Every program uses variables, conditions, loops, and functions. Debugging — finding and fixing errors — is an essential skill.",
          "keyPoints": [
            "A variable stores a value that can change: x = 5.",
            "A loop repeats code: for i in range(5) runs the body 5 times.",
            "An if-statement makes a decision: if x > 0: print(\"positive\").",
            "A function groups reusable code: def greet(name): return \"Hello \" + name.",
            "Common error types: syntax errors (wrong spelling), runtime errors (crash), logic errors (wrong result)."
          ],
          "miniTask": "Write pseudocode or real code that asks the user for a number and prints whether it is odd or even.",
          "topics": [
            "Variables and loops",
            "Functions",
            "Debugging"
          ],
          "sourceGroup": "cs"
        },
        {
          "name": "Digital Systems",
          "description": "Digital systems form the infrastructure of the internet and modern computing. Understanding networks, data representation, and cybersecurity is essential for anyone using or building technology.",
          "keyPoints": [
            "Data is stored in binary (0s and 1s): 8 bits = 1 byte.",
            "ASCII and Unicode map numbers to characters (e.g. A = 65 in ASCII).",
            "The internet is a global network of networks using TCP/IP protocols.",
            "HTTP is used for web pages; HTTPS adds encryption for security.",
            "Encryption scrambles data so only the intended recipient can read it."
          ],
          "miniTask": "Convert the decimal number 13 to binary. Show your working (divide by 2 repeatedly).",
          "topics": [
            "Networks",
            "Cybersecurity basics",
            "Data representation"
          ],
          "sourceGroup": "cs"
        }
      ]
    },
    {
      "id": "language-arts",
      "title": "Language Arts",
      "folders": [
        {
          "name": "Reading and Analysis",
          "description": "Reading and analysis teaches you to understand and evaluate texts critically. You learn to identify the author’s purpose, structure arguments, and evaluate the quality of evidence used.",
          "keyPoints": [
            "Text structure types: chronological, problem-solution, cause-effect, compare-contrast.",
            "The main argument is the central claim the author wants you to accept.",
            "Evidence supports claims: look for facts, statistics, expert quotes, and examples.",
            "Evaluate the source: is the author credible? Is the evidence recent and relevant?",
            "Bias occurs when a text only presents one side of an argument."
          ],
          "miniTask": "Read one paragraph from any article. Identify: (1) the main claim, (2) one piece of evidence, (3) one potential bias.",
          "topics": [
            "Text structure",
            "Argument analysis",
            "Evidence use"
          ],
          "sourceGroup": "languageArts"
        },
        {
          "name": "Writing",
          "description": "Good writing communicates ideas clearly and persuasively. The process involves planning, drafting, revising, and editing. Structure and evidence are as important as vocabulary.",
          "keyPoints": [
            "PEEL paragraph: Point → Evidence → Explain → Link back.",
            "An essay introduction states the argument; the conclusion restates it with insight.",
            "Formal writing avoids contractions, slang, and first-person unless specified.",
            "Active voice is clearer: \"The student solved the problem\" (not \"was solved by\").",
            "Always revise: check logic, evidence, grammar, and sentence variety."
          ],
          "miniTask": "Write one PEEL paragraph (5–7 sentences) arguing that homework is beneficial or harmful. Use one piece of evidence.",
          "topics": [
            "Essays",
            "Reports",
            "Revision process"
          ],
          "sourceGroup": "writing"
        },
        {
          "name": "Grammar and Vocabulary",
          "description": "Grammar rules govern how words combine into correct sentences. A strong vocabulary makes writing precise and persuasive. Both require active practice — not just passive reading.",
          "keyPoints": [
            "A sentence needs a subject and a verb: \"She runs.\"",
            "Tenses show time: simple present (runs), past (ran), future (will run), present perfect (has run).",
            "Clauses: a main clause stands alone; a subordinate clause needs a main clause.",
            "Punctuation guides the reader: comma = brief pause, semicolon = join related ideas.",
            "Context clues help decode unfamiliar words: look at surrounding words."
          ],
          "miniTask": "Rewrite this sentence in three different tenses: \"The team wins the match.\" (past, future, present perfect)",
          "topics": [
            "Sentence structure",
            "Word usage",
            "Academic vocabulary"
          ],
          "sourceGroup": "languageArts"
        }
      ]
    },
    {
      "id": "history",
      "title": "History",
      "folders": [
        {
          "name": "World History",
          "description": "World history traces how human societies developed over thousands of years, from ancient civilisations through empires, revolutions, and world wars to the modern global order. History helps us understand why the world is the way it is.",
          "keyPoints": [
            "Mesopotamia (Iraq) and Egypt are among the earliest known civilisations.",
            "The Industrial Revolution (18th–19th c.) transformed economies from farming to manufacturing.",
            "World War I (1914–1918) and World War II (1939–1945) reshaped the global order.",
            "The Cold War (1947–1991) divided the world between the US and Soviet Union.",
            "Globalisation from the 1990s created interconnected economies and cultures."
          ],
          "miniTask": "Choose one major historical event and explain: (1) its cause, (2) what happened, (3) its long-term effect.",
          "topics": [
            "Ancient civilizations",
            "Industrial era",
            "Global conflicts"
          ],
          "sourceGroup": "socialScience"
        },
        {
          "name": "Primary Sources",
          "description": "Primary sources are original documents or artefacts from the period being studied — letters, speeches, photos, laws, diaries. Historians use them to reconstruct the past as accurately as possible.",
          "keyPoints": [
            "Primary sources include diaries, laws, photographs, speeches, and treaties.",
            "Secondary sources interpret primary sources: textbooks, biographies, documentaries.",
            "Ask: Who wrote this? When? For what audience? What is their perspective?",
            "Bias does not make a source useless — it reveals the author’s worldview.",
            "Corroboration: check the source against other evidence to assess reliability."
          ],
          "miniTask": "Find a short historical quote (from a speech or letter). Identify the author, date, and one potential bias.",
          "topics": [
            "Source evaluation",
            "Bias detection",
            "Context analysis"
          ],
          "sourceGroup": "socialScience"
        }
      ]
    },
    {
      "id": "geography",
      "title": "Geography",
      "folders": [
        {
          "name": "Physical Geography",
          "description": "Physical geography studies Earth’s natural features — landforms, rivers, climate, and ecosystems. Understanding physical geography explains why cities, trade routes, and civilisations developed where they did.",
          "keyPoints": [
            "Plate tectonics: Earth’s crust is divided into plates that move, causing earthquakes and volcanoes.",
            "The water cycle: evaporation → condensation → precipitation → runoff → repeat.",
            "Climate zones: tropical, arid, temperate, continental, polar.",
            "A river system has a source (high land), tributaries, and a mouth (where it meets the sea).",
            "Natural hazards (earthquakes, floods, hurricanes) are shaped by geography."
          ],
          "miniTask": "Explain why earthquakes happen along the \"Ring of Fire\" using plate tectonics.",
          "topics": [
            "Landforms",
            "Weather systems",
            "Natural hazards"
          ],
          "sourceGroup": "geography"
        },
        {
          "name": "Human Geography",
          "description": "Human geography studies how people interact with their environment and how they organise space. Topics include where people live, why cities grow, and how economies differ around the world.",
          "keyPoints": [
            "Population density = people ÷ area. Dense in coastal and fertile regions; sparse in deserts and mountains.",
            "Urbanisation: people moving from rural to urban areas for jobs and services.",
            "Push factors drive people away (e.g. poverty, conflict); pull factors attract them (e.g. jobs, safety).",
            "Globalisation: goods, capital, people, and ideas move across borders more freely.",
            "Development can be measured by GDP per capita, life expectancy, and education (HDI)."
          ],
          "miniTask": "Compare two countries by their HDI. Identify two reasons one might rank higher than the other.",
          "topics": [
            "Population",
            "Urbanization",
            "Migration"
          ],
          "sourceGroup": "geography"
        }
      ]
    },
    {
      "id": "economics",
      "title": "Economics",
      "folders": [
        {
          "name": "Microeconomics",
          "description": "Microeconomics studies how individuals and firms make decisions about resources. It explains how prices are set, why markets sometimes fail, and how incentives shape behaviour.",
          "keyPoints": [
            "Demand: as price falls, quantity demanded rises (inverse relationship).",
            "Supply: as price rises, quantity supplied rises (direct relationship).",
            "Equilibrium: where supply meets demand — the market-clearing price.",
            "Elasticity measures how sensitive demand or supply is to price changes.",
            "Market failure: when markets produce too much (negative externalities) or too little (public goods)."
          ],
          "miniTask": "If the price of coffee rises, what happens to demand for tea? Explain using substitute goods.",
          "topics": [
            "Supply and demand",
            "Market structures",
            "Consumer behavior"
          ],
          "sourceGroup": "economics"
        },
        {
          "name": "Personal Finance",
          "description": "Personal finance helps you manage your money wisely. Understanding budgeting, saving, and credit means you can make informed decisions throughout your life.",
          "keyPoints": [
            "A budget tracks income and expenses. Spend less than you earn to save.",
            "Simple interest: I = P × r × t (Principal × rate × time).",
            "Compound interest grows savings exponentially — start early.",
            "Credit: borrowing now and repaying later with interest; use it carefully.",
            "An emergency fund should cover 3–6 months of expenses."
          ],
          "miniTask": "You earn €800/month. List 5 categories of expenses and allocate a budget for each that adds up to €800.",
          "topics": [
            "Budgeting",
            "Interest rates",
            "Saving and credit"
          ],
          "sourceGroup": "economics"
        }
      ]
    },
    {
      "id": "earth-science",
      "title": "Earth Science",
      "folders": [
        {
          "name": "Geology",
          "description": "Geology studies the Earth’s structure, the rocks it is made of, and how it changes over time. Earth is about 4.5 billion years old. Its layers — crust, mantle, outer core, inner core — have different properties.",
          "keyPoints": [
            "The rock cycle: igneous → sedimentary → metamorphic → back to magma.",
            "Igneous rocks form from cooled magma or lava (e.g. granite, basalt).",
            "Sedimentary rocks form from compressed layers of sediment (e.g. sandstone, limestone).",
            "Metamorphic rocks are changed by heat and pressure (e.g. marble, slate).",
            "Plate tectonics explains earthquakes, volcanoes, and mountain building."
          ],
          "miniTask": "A lava flow cools and hardens. What type of rock forms? What could turn it into metamorphic rock over time?",
          "topics": [
            "Rock cycle",
            "Plate tectonics",
            "Earthquakes"
          ],
          "sourceGroup": "earthScience"
        },
        {
          "name": "Astronomy Basics",
          "description": "Astronomy studies everything beyond Earth — planets, stars, galaxies, and the universe itself. Our solar system formed about 4.6 billion years ago. The universe is estimated to be 13.8 billion years old.",
          "keyPoints": [
            "Our solar system: 8 planets orbit the Sun. Order: Mercury, Venus, Earth, Mars, Jupiter, Saturn, Uranus, Neptune.",
            "Stars produce energy through nuclear fusion: hydrogen atoms fuse to form helium.",
            "A light-year is the distance light travels in one year (≈9.46 trillion km).",
            "The Milky Way is our galaxy; it contains over 200 billion stars.",
            "The Big Bang theory: the universe began as an extremely hot, dense point ∼13.8 billion years ago."
          ],
          "miniTask": "Calculate: light travels at 300,000 km/s. How far does light travel in 1 minute? In 1 hour?",
          "topics": [
            "Solar system",
            "Stars and galaxies",
            "Space exploration"
          ],
          "sourceGroup": "earthScience"
        }
      ]
    },
    {
      "id": "health",
      "title": "Health Education",
      "folders": [
        {
          "name": "Personal Health",
          "description": "Personal health covers the habits and choices that affect your physical and mental well-being. Small daily actions — sleep, nutrition, exercise — have long-term effects on health.",
          "keyPoints": [
            "Adults need 7–9 hours of sleep per night; teenagers need 8–10 hours.",
            "A balanced diet includes carbohydrates, proteins, healthy fats, vitamins, and minerals.",
            "Regular physical activity (150 min/week moderate intensity) reduces disease risk.",
            "Hydration: aim for ≈2 litres of water per day depending on activity and climate.",
            "Preventive healthcare: regular check-ups, vaccinations, and dental visits."
          ],
          "miniTask": "Plan a balanced meal with at least 4 food groups. Identify one nutrient and its function for each food.",
          "topics": [
            "Nutrition",
            "Sleep",
            "Physical activity"
          ],
          "sourceGroup": "health"
        },
        {
          "name": "Mental Health",
          "description": "Mental health is as important as physical health. It affects how we think, feel, and act. Understanding stress and emotions — and where to find help — is a life skill.",
          "keyPoints": [
            "Stress is a normal response to challenges; chronic stress harms health.",
            "Techniques: deep breathing, physical exercise, talking to someone, time management.",
            "Anxiety and depression are common — they are medical conditions, not weaknesses.",
            "Helping a friend: listen without judgment, encourage professional support.",
            "Sleep, exercise, and social connection improve mental health."
          ],
          "miniTask": "List 3 healthy ways you manage stress. Explain why each strategy works physiologically or psychologically.",
          "topics": [
            "Stress management",
            "Help resources",
            "Healthy habits"
          ],
          "sourceGroup": "health"
        }
      ]
    },
    {
      "id": "arts",
      "title": "Arts and Design",
      "folders": [
        {
          "name": "Visual Arts",
          "description": "Visual arts express ideas, emotions, and stories through images and objects. Drawing, painting, sculpture, and design all use the same foundational elements: line, shape, colour, texture, space, and form.",
          "keyPoints": [
            "The colour wheel: primary (red, yellow, blue) → secondary (orange, green, violet).",
            "Complementary colours sit opposite each other on the wheel (red–green, blue–orange).",
            "Composition: how elements are arranged. Rule of thirds divides the frame into 9 equal parts.",
            "Line: can suggest movement, emotion, direction.",
            "Negative space: the background around a subject — as important as the subject itself."
          ],
          "miniTask": "Sketch any object using only contour lines (outline only). Then shade one area to show depth.",
          "topics": [
            "Drawing",
            "Color theory",
            "Composition"
          ],
          "sourceGroup": "arts"
        }
      ]
    },
    {
      "id": "music",
      "title": "Music",
      "folders": [
        {
          "name": "Music Theory",
          "description": "Music theory is the language of music. It explains how sounds are organised into melodies, harmonies, and rhythms. Reading music notation is like reading a map of sound.",
          "keyPoints": [
            "Pitch: the highness or lowness of a sound. Measured in Hz.",
            "Notes on the staff: Treble clef lines (EGBDF), spaces (FACE).",
            "Beat = the steady pulse. Tempo = speed (BPM). Rhythm = patterns of long and short sounds.",
            "A scale is a sequence of notes in a specific pattern (e.g. major scale: whole-whole-half-whole-whole-whole-half).",
            "A chord is 3+ notes played together; major chords sound bright, minor chords sound darker."
          ],
          "miniTask": "Clap the rhythm of a song you know. Write it using long (—) and short (·) symbols. How many beats per bar?",
          "topics": [
            "Rhythm and meter",
            "Scales and harmony",
            "Notation"
          ],
          "sourceGroup": "arts"
        }
      ]
    },
    {
      "id": "physical-education",
      "title": "Physical Education",
      "folders": [
        {
          "name": "Fitness Fundamentals",
          "description": "Physical fitness has four main components: cardiovascular endurance, muscular strength, flexibility, and body composition. Training each area regularly improves health and performance.",
          "keyPoints": [
            "Aerobic exercise (running, swimming) strengthens the heart and lungs.",
            "Anaerobic exercise (weightlifting, sprinting) builds muscle strength.",
            "Progressive overload: gradually increase intensity to keep improving.",
            "Rest and recovery are when muscles actually grow stronger.",
            "FITT principle: Frequency, Intensity, Time, Type — the pillars of a training plan."
          ],
          "miniTask": "Design a 30-minute weekly workout plan using the FITT principle. Include at least 2 types of exercise.",
          "topics": [
            "Endurance",
            "Strength",
            "Mobility"
          ],
          "sourceGroup": "health"
        }
      ]
    }
  ],
  "university": [
    {
      "id": "mathematics",
      "title": "Mathematics",
      "folders": [
        {
          "name": "Calculus",
          "description": "Calculus is the mathematics of change. Differential calculus finds rates of change (derivatives); integral calculus finds accumulated quantities (integrals). It underpins physics, engineering, economics, and all quantitative sciences.",
          "keyPoints": [
            "A limit describes the value a function approaches as x approaches a point.",
            "Derivative: f′(x) = rate of change. For f(x) = xⁿ, f′(x) = nxⁿ⁻¹ (power rule).",
            "Chain rule: d/dx[f(g(x))] = f′(g(x)) · g′(x).",
            "Integral = area under a curve. ∫xⁿ dx = xⁿ⁺¹/(n+1) + C.",
            "Fundamental theorem of calculus: differentiation and integration are inverse operations."
          ],
          "miniTask": "Find the derivative of f(x) = 3x³ − 2x² + 5x − 7. Show each step using the power rule.",
          "topics": [
            "Limits and continuity",
            "Differentiation",
            "Integration"
          ],
          "sourceGroup": "math"
        },
        {
          "name": "Linear Algebra",
          "description": "Linear algebra is the mathematics of vectors, matrices, and linear transformations. It is essential in machine learning, computer graphics, engineering, and data science.",
          "keyPoints": [
            "A vector has magnitude and direction. Vectors can be added and scaled.",
            "A matrix represents a linear transformation or a system of equations.",
            "Matrix multiplication is not commutative: AB ≠ BA in general.",
            "Determinant: a scalar that tells whether a matrix is invertible. det(A) = 0 → not invertible.",
            "Eigenvalues and eigenvectors: Av = λv. Used in PCA, physics, and Google’s PageRank."
          ],
          "miniTask": "Multiply matrix A = [[1,2],[3,4]] by matrix B = [[5,6],[7,8]]. Show all calculations.",
          "topics": [
            "Vectors and matrices",
            "Linear transformations",
            "Eigenvalues"
          ],
          "sourceGroup": "math"
        },
        {
          "name": "Statistics and Probability",
          "description": "University statistics moves from descriptive to inferential — using sample data to draw conclusions about populations. Probability theory provides the rigorous foundation.",
          "keyPoints": [
            "Random variable: a variable whose value is determined by a random event.",
            "Normal distribution: bell curve, mean = median = mode; 68-95-99.7 rule.",
            "Hypothesis testing: H₀ (null) vs H₁ (alternative). p-value < 0.05 → reject H₀.",
            "Confidence interval: range in which the true parameter lies with stated probability.",
            "Correlation coefficient r: −1 = perfect negative, 0 = no linear relationship, +1 = perfect positive."
          ],
          "miniTask": "A sample of 30 students has mean height 170 cm, SD 8 cm. Calculate the 95% confidence interval.",
          "topics": [
            "Probability distributions",
            "Statistical inference",
            "Regression analysis"
          ],
          "sourceGroup": "math"
        }
      ]
    },
    {
      "id": "physics",
      "title": "Physics",
      "folders": [
        {
          "name": "Classical Mechanics",
          "description": "Classical mechanics describes the motion of macroscopic objects using Newton’s laws. Lagrangian and Hamiltonian mechanics are more powerful reformulations used in advanced physics.",
          "keyPoints": [
            "Newton’s 2nd law in vector form: ΣF = ma.",
            "Conservation of momentum: total momentum of a closed system is constant.",
            "Conservation of energy: in a closed system, total mechanical energy is constant.",
            "Angular momentum L = Iω (moment of inertia × angular velocity).",
            "Lagrangian mechanics: L = T − V (kinetic minus potential energy). Euler-Lagrange equations derive motion."
          ],
          "miniTask": "A 3 kg mass slides down a frictionless incline of 30°. Calculate its acceleration using Newton’s 2nd law.",
          "topics": [
            "Newtonian mechanics",
            "Conservation laws",
            "Rotational motion"
          ],
          "sourceGroup": "physics"
        },
        {
          "name": "Electromagnetism",
          "description": "Electromagnetism unifies electricity, magnetism, and light. Maxwell’s four equations completely describe electromagnetic phenomena and predict electromagnetic waves.",
          "keyPoints": [
            "Coulomb’s law: F = kq₁q₂/r² (force between charges).",
            "Gauss’s law: electric flux through a closed surface ∝ enclosed charge.",
            "Faraday’s law: changing magnetic flux induces an EMF.",
            "Maxwell’s equations predict that electromagnetic waves travel at the speed of light.",
            "Light is an electromagnetic wave: E and B fields oscillate perpendicular to each other and to the direction of travel."
          ],
          "miniTask": "State Faraday’s law and give one real-world application (e.g. electric generator or transformer).",
          "topics": [
            "Electric fields",
            "Magnetic fields",
            "Maxwell’s equations"
          ],
          "sourceGroup": "physics"
        }
      ]
    },
    {
      "id": "computer-science",
      "title": "Computer Science",
      "folders": [
        {
          "name": "Data Structures and Algorithms",
          "description": "Data structures organise data efficiently; algorithms process it. Choosing the right data structure and algorithm determines whether a program runs in milliseconds or hours on large datasets.",
          "keyPoints": [
            "Array: fixed-size, O(1) access. Linked list: dynamic size, O(n) access.",
            "Stack (LIFO) and Queue (FIFO): used in undo systems, BFS/DFS traversal.",
            "Hash table: O(1) average lookup using a hash function.",
            "Binary search: O(log n) — requires sorted data. Linear search: O(n).",
            "Big-O notation measures how runtime grows with input size: O(1) < O(log n) < O(n) < O(n²)."
          ],
          "miniTask": "Trace through binary search on the sorted array [2, 5, 8, 12, 16, 23] looking for 12. How many steps?",
          "topics": [
            "Arrays and lists",
            "Sorting algorithms",
            "Big-O complexity"
          ],
          "sourceGroup": "cs"
        },
        {
          "name": "Databases",
          "description": "Databases store and organise data for efficient retrieval and manipulation. Relational databases use tables and SQL; NoSQL databases handle unstructured or distributed data.",
          "keyPoints": [
            "A relational database stores data in tables (rows = records, columns = attributes).",
            "SQL SELECT query: SELECT column FROM table WHERE condition ORDER BY column.",
            "Primary key: unique identifier for each row. Foreign key: links rows across tables.",
            "JOIN combines rows from multiple tables: INNER JOIN returns matching rows.",
            "ACID properties: Atomicity, Consistency, Isolation, Durability — ensure reliable transactions."
          ],
          "miniTask": "Write a SQL query to find all students with a grade above 80 from a table called \"students\" with columns (id, name, grade).",
          "topics": [
            "SQL",
            "Relational data models",
            "Query optimisation"
          ],
          "sourceGroup": "cs"
        }
      ]
    },
    {
      "id": "economics",
      "title": "Economics",
      "folders": [
        {
          "name": "Macroeconomics",
          "description": "Macroeconomics studies the economy as a whole: GDP, inflation, unemployment, monetary and fiscal policy. Central banks and governments use these tools to promote stable growth.",
          "keyPoints": [
            "GDP = C + I + G + (X−M): consumption + investment + government spending + net exports.",
            "Inflation: general rise in prices. Deflation: fall in prices. Both can be harmful if extreme.",
            "Unemployment: frictional (between jobs), structural (skills mismatch), cyclical (recession).",
            "Central banks raise interest rates to fight inflation; lower them to stimulate growth.",
            "Keynesian economics: governments should increase spending during recessions."
          ],
          "miniTask": "If a central bank raises interest rates, what happens to borrowing, investment, and inflation? Explain the chain of effects.",
          "topics": [
            "GDP and growth",
            "Inflation and deflation",
            "Fiscal and monetary policy"
          ],
          "sourceGroup": "economics"
        }
      ]
    },
    {
      "id": "biology",
      "title": "Biology",
      "folders": [
        {
          "name": "Molecular Biology",
          "description": "Molecular biology studies the molecular mechanisms of life — DNA replication, transcription, translation, and gene regulation. It is the basis of biotechnology, medicine, and genetics.",
          "keyPoints": [
            "DNA → RNA → Protein: the central dogma of molecular biology.",
            "Transcription: DNA is copied into messenger RNA (mRNA) in the nucleus.",
            "Translation: ribosomes read mRNA and assemble amino acids into a protein.",
            "A codon is a 3-nucleotide sequence encoding one amino acid.",
            "CRISPR-Cas9: a gene-editing tool that can precisely cut and modify DNA sequences."
          ],
          "miniTask": "Given the DNA sequence ATG-GCC-TAA, what is the mRNA sequence? (Replace T with U, and A↔T, C↔G)",
          "topics": [
            "DNA replication",
            "Transcription and translation",
            "Gene regulation"
          ],
          "sourceGroup": "biology"
        },
        {
          "name": "Genetics and Evolution",
          "description": "Genetics explains how traits are inherited. Evolution explains how species change over time through natural selection and genetic variation. Together they explain the diversity of life.",
          "keyPoints": [
            "Mendel’s laws: law of segregation (alleles separate during gamete formation); law of independent assortment.",
            "Dominant alleles mask recessive alleles in a heterozygote (Aa).",
            "Hardy-Weinberg equilibrium: allele frequencies stay constant in the absence of evolution.",
            "Natural selection: individuals with traits better suited to the environment survive and reproduce more.",
            "Mutations are the ultimate source of genetic variation; most are neutral."
          ],
          "miniTask": "Use a Punnett square to show the cross Aa × Aa. What are the genotype and phenotype ratios?",
          "topics": [
            "Mendelian genetics",
            "Population genetics",
            "Natural selection"
          ],
          "sourceGroup": "biology"
        }
      ]
    }
  ]
};
})();