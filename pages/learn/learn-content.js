(function () {
  window.LEARN_SOURCES = {
    core: {
      math: [
        { title: 'Khan Academy Mathematics', url: 'https://www.khanacademy.org/math' },
        { title: 'OpenStax Mathematics', url: 'https://openstax.org/subjects/math' },
        { title: 'GeoGebra', url: 'https://www.geogebra.org/' }
      ],
      physics: [
        { title: 'OpenStax University Physics', url: 'https://openstax.org/details/books/university-physics-volume-1' },
        { title: 'PhET Interactive Simulations (University of Colorado Boulder)', url: 'https://phet.colorado.edu/' },
        { title: 'MIT OpenCourseWare Physics', url: 'https://ocw.mit.edu/search/?d=Physics' }
      ],
      chemistry: [
        { title: 'Chemistry LibreTexts', url: 'https://chem.libretexts.org/' },
        { title: 'Royal Society of Chemistry Education', url: 'https://edu.rsc.org/' },
        { title: 'OpenStax Chemistry 2e', url: 'https://openstax.org/details/books/chemistry-2e' }
      ],
      biology: [
        { title: 'OpenStax Biology 2e', url: 'https://openstax.org/details/books/biology-2e' },
        { title: 'HHMI BioInteractive', url: 'https://www.biointeractive.org/' },
        { title: 'NCBI Bookshelf', url: 'https://www.ncbi.nlm.nih.gov/books/' }
      ],
      cs: [
        { title: 'CS50 (Harvard University)', url: 'https://cs50.harvard.edu/' },
        { title: 'MIT OpenCourseWare Electrical Engineering and Computer Science', url: 'https://ocw.mit.edu/search/?d=Electrical%20Engineering%20and%20Computer%20Science' },
        { title: 'MDN Web Docs', url: 'https://developer.mozilla.org/' }
      ],
      engineering: [
        { title: 'MIT OpenCourseWare Engineering', url: 'https://ocw.mit.edu/search/?d=Engineering' },
        { title: 'NPTEL (IITs and IISc)', url: 'https://nptel.ac.in/' },
        { title: 'Open Textbook Library Engineering', url: 'https://open.umn.edu/opentextbooks' }
      ],
      medicine: [
        { title: 'MedlinePlus', url: 'https://medlineplus.gov/' },
        { title: 'World Health Organization Learning', url: 'https://academy.who.int/' },
        { title: 'PubMed', url: 'https://pubmed.ncbi.nlm.nih.gov/' }
      ],
      law: [
        { title: 'Cornell Law School Legal Information Institute', url: 'https://www.law.cornell.edu/' },
        { title: 'EUR-Lex', url: 'https://eur-lex.europa.eu/' },
        { title: 'United Nations Treaty Collection', url: 'https://treaties.un.org/' }
      ],
      economics: [
        { title: 'CORE Econ', url: 'https://www.core-econ.org/' },
        { title: 'OpenStax Economics', url: 'https://openstax.org/subjects/social-sciences' },
        { title: 'World Bank Open Learning Campus', url: 'https://olc.worldbank.org/' }
      ],
      socialScience: [
        { title: 'OECD Education and Skills', url: 'https://www.oecd.org/education/' },
        { title: 'Our World in Data', url: 'https://ourworldindata.org/' },
        { title: 'UNESCO Institute for Statistics', url: 'https://uis.unesco.org/' }
      ],
      writing: [
        { title: 'Purdue Online Writing Lab', url: 'https://owl.purdue.edu/' },
        { title: 'Open Textbook Library', url: 'https://open.umn.edu/opentextbooks' },
        { title: 'Saylor Academy', url: 'https://www.saylor.org/' }
      ],
      earthScience: [
        { title: 'NASA STEM', url: 'https://www.nasa.gov/stem/' },
        { title: 'USGS Education', url: 'https://www.usgs.gov/education' },
        { title: 'NOAA Education', url: 'https://www.noaa.gov/education' }
      ],
      geography: [
        { title: 'National Geographic Education', url: 'https://education.nationalgeographic.org/' },
        { title: 'US Census Education', url: 'https://www.census.gov/schools/' },
        { title: 'United Nations Data', url: 'https://data.un.org/' }
      ],
      languageArts: [
        { title: 'British Council Learn English', url: 'https://learnenglish.britishcouncil.org/' },
        { title: 'Deutsche Welle Learn German', url: 'https://learngerman.dw.com/' },
        { title: 'Cambridge Dictionary', url: 'https://dictionary.cambridge.org/' }
      ],
      languageLearning: [
        { title: 'Institut francais', url: 'https://www.institutfrancais.com/' },
        { title: 'Instituto Cervantes', url: 'https://www.cervantes.es/' },
        { title: 'Goethe-Institut', url: 'https://www.goethe.de/' }
      ],
      arts: [
        { title: 'The Metropolitan Museum of Art Learning', url: 'https://www.metmuseum.org/learn' },
        { title: 'Google Arts and Culture', url: 'https://artsandculture.google.com/' },
        { title: 'Smarthistory', url: 'https://smarthistory.org/' }
      ],
      health: [
        { title: 'Centers for Disease Control and Prevention', url: 'https://www.cdc.gov/' },
        { title: 'World Health Organization', url: 'https://www.who.int/' },
        { title: 'NHS Health A-Z', url: 'https://www.nhs.uk/conditions/' }
      ],
      architecture: [
        { title: 'MIT OpenCourseWare Architecture', url: 'https://ocw.mit.edu/search/?d=Architecture' },
        { title: 'RIBA', url: 'https://www.architecture.com/' },
        { title: 'ArchDaily', url: 'https://www.archdaily.com/' }
      ],
      agriculture: [
        { title: 'FAO E-learning Academy', url: 'https://elearning.fao.org/' },
        { title: 'USDA Education', url: 'https://www.usda.gov/topics/education-and-outreach' },
        { title: 'CIMMYT Resources', url: 'https://www.cimmyt.org/' }
      ],
      cybersecurity: [
        { title: 'NIST Cybersecurity', url: 'https://www.nist.gov/cybersecurity' },
        { title: 'ENISA', url: 'https://www.enisa.europa.eu/' },
        { title: 'CISA', url: 'https://www.cisa.gov/' }
      ],
      businessPolicy: [
        { title: 'International Monetary Fund', url: 'https://www.imf.org/' },
        { title: 'International Labour Organization', url: 'https://www.ilo.org/' },
        { title: 'OECD Policy', url: 'https://www.oecd.org/' }
      ],
      energy: [
        { title: 'International Energy Agency', url: 'https://www.iea.org/' },
        { title: 'International Renewable Energy Agency', url: 'https://www.irena.org/' },
        { title: 'US Department of Energy Office of Science', url: 'https://science.osti.gov/' }
      ],
      ocean: [
        { title: 'NOAA Ocean and Coasts', url: 'https://www.noaa.gov/ocean-coasts' },
        { title: 'UNESCO Intergovernmental Oceanographic Commission', url: 'https://ioc.unesco.org/' },
        { title: 'Woods Hole Oceanographic Institution', url: 'https://www.whoi.edu/' }
      ]
    },
    school: [
      {
        id: 'mathematics',
        title: 'Mathematics',
        folders: [
          { name: 'Algebra', topics: ['Linear equations', 'Functions', 'Polynomials'], sourceGroup: 'math' },
          { name: 'Geometry', topics: ['Angles and triangles', 'Coordinate geometry', 'Transformations'], sourceGroup: 'math' },
          { name: 'Statistics and Probability', topics: ['Data visualization', 'Probability rules', 'Distributions'], sourceGroup: 'math' },
          { name: 'Trigonometry', topics: ['Sine cosine tangent', 'Right triangle problems', 'Unit circle basics'], sourceGroup: 'math' },
          { name: 'Number Theory Basics', topics: ['Prime numbers', 'Divisibility rules', 'Modular arithmetic intro'], sourceGroup: 'math' },
          { name: 'Precalculus and Calculus Intro', topics: ['Limits concept', 'Rate of change', 'Area under curves'], sourceGroup: 'math' }
        ]
      },
      {
        id: 'physics',
        title: 'Physics',
        folders: [
          { name: 'Mechanics', topics: ['Motion', 'Forces', 'Energy and work'], sourceGroup: 'physics' },
          { name: 'Electricity and Magnetism', topics: ['Circuits', 'Current and voltage', 'Magnetic fields'], sourceGroup: 'physics' },
          { name: 'Waves and Optics', topics: ['Sound', 'Light', 'Lenses and mirrors'], sourceGroup: 'physics' }
        ]
      },
      {
        id: 'chemistry',
        title: 'Chemistry',
        folders: [
          { name: 'Atomic Structure', topics: ['Atoms', 'Periodic table', 'Bonding'], sourceGroup: 'chemistry' },
          { name: 'Reactions', topics: ['Balancing equations', 'Reaction rates', 'Stoichiometry'], sourceGroup: 'chemistry' },
          { name: 'Acids and Bases', topics: ['pH scale', 'Neutralization', 'Titration basics'], sourceGroup: 'chemistry' }
        ]
      },
      {
        id: 'biology',
        title: 'Biology',
        folders: [
          { name: 'Cell Biology', topics: ['Cell structure', 'Mitosis and meiosis', 'DNA and RNA'], sourceGroup: 'biology' },
          { name: 'Human Biology', topics: ['Body systems', 'Nutrition', 'Homeostasis'], sourceGroup: 'biology' },
          { name: 'Ecology', topics: ['Ecosystems', 'Food webs', 'Climate impact'], sourceGroup: 'biology' }
        ]
      },
      {
        id: 'computer-science',
        title: 'Computer Science',
        folders: [
          { name: 'Computational Thinking', topics: ['Algorithms', 'Decomposition', 'Abstraction'], sourceGroup: 'cs' },
          { name: 'Programming', topics: ['Variables and loops', 'Functions', 'Debugging'], sourceGroup: 'cs' },
          { name: 'Digital Systems', topics: ['Networks', 'Cybersecurity basics', 'Data representation'], sourceGroup: 'cs' }
        ]
      },
      {
        id: 'language-arts',
        title: 'Language Arts',
        folders: [
          {
            name: 'Reading and Analysis',
            topics: ['Text structure', 'Argument analysis', 'Evidence use'],
            sourceGroup: 'languageArts',
            helps: ['Read one short text first, then summarize the main idea in two sentences.', 'Underline key evidence and link it to the question.', 'Compare two interpretations and justify your answer.']
          },
          {
            name: 'Writing',
            topics: ['Essays', 'Reports', 'Revision process'],
            sourceGroup: 'writing',
            helps: ['Draft with a simple outline: intro, body, conclusion.', 'Write one paragraph at a time and revise for clarity.', 'Use a checklist for grammar, structure, and evidence.']
          },
          {
            name: 'Grammar and Vocabulary',
            topics: ['Sentence structure', 'Word usage', 'Academic vocabulary'],
            sourceGroup: 'languageArts',
            helps: ['Practice 10 vocabulary words per session.', 'Transform sentences actively between tenses.', 'Use new vocabulary in short self-written examples.']
          }
        ]
      },
      {
        id: 'german-language',
        title: 'German Language',
        folders: [
          {
            name: 'Grammar Foundations',
            topics: ['Cases and articles', 'Verb position', 'Sentence structure'],
            sourceGroup: 'languageLearning',
            helps: ['Learn one grammar rule and apply it in five example sentences.', 'Use color coding for cases (Nominativ, Akkusativ, Dativ, Genitiv).', 'Read short dialogs and identify grammar patterns.']
          },
          {
            name: 'Reading and Writing',
            topics: ['Text comprehension', 'Summary writing', 'Argumentative writing'],
            sourceGroup: 'languageArts',
            helps: ['Read short articles first, then expand to longer texts.', 'Write one paragraph summary after each text.', 'Practice connectors to improve text flow.']
          },
          {
            name: 'Listening and Speaking',
            topics: ['Listening tasks', 'Pronunciation', 'Oral presentations'],
            sourceGroup: 'languageLearning',
            helps: ['Listen to short clips and note key words.', 'Shadow-read audio for pronunciation training.', 'Practice 2-minute speaking answers on common school topics.']
          }
        ]
      },
      {
        id: 'english-language',
        title: 'English Language',
        folders: [
          {
            name: 'Grammar and Usage',
            topics: ['Tenses', 'Conditionals', 'Passive voice'],
            sourceGroup: 'languageArts',
            helps: ['Master one tense at a time with mini-drills.', 'Rewrite active and passive sentence pairs.', 'Use short daily speaking prompts to apply grammar.']
          },
          {
            name: 'Reading and Literature',
            topics: ['Close reading', 'Poetry and prose', 'Character and theme analysis'],
            sourceGroup: 'languageArts',
            helps: ['Annotate key lines before answering questions.', 'Track themes with a simple table (quote, meaning, context).', 'Compare characters using evidence from the text.']
          },
          {
            name: 'Writing and Communication',
            topics: ['Essay writing', 'Email and formal writing', 'Presentation language'],
            sourceGroup: 'writing',
            helps: ['Use PEEL structure for body paragraphs.', 'Practice formal and informal register differences.', 'Record and review your spoken presentation once per week.']
          }
        ]
      },
      {
        id: 'french-language',
        title: 'French Language',
        folders: [
          {
            name: 'Core Grammar',
            topics: ['Verb conjugation', 'Gender and agreement', 'Pronouns'],
            sourceGroup: 'languageLearning',
            helps: ['Conjugate one verb family each day.', 'Practice adjective agreement with short sentence cards.', 'Use pronoun replacement drills to increase fluency.']
          },
          {
            name: 'Comprehension',
            topics: ['Listening comprehension', 'Reading comprehension', 'Context clues'],
            sourceGroup: 'languageLearning',
            helps: ['Listen once for gist and once for details.', 'Build a vocabulary list from each text.', 'Summarize the passage in simple French sentences.']
          },
          {
            name: 'Production',
            topics: ['Dialog practice', 'Essay structure', 'Exam speaking tasks'],
            sourceGroup: 'writing',
            helps: ['Use model dialogs and adapt them to new topics.', 'Write short structured responses before longer essays.', 'Practice oral exam answers with a timer.']
          }
        ]
      },
      {
        id: 'spanish-language',
        title: 'Spanish Language',
        folders: [
          {
            name: 'Grammar and Vocabulary',
            topics: ['Present, past, future', 'Subjunctive basics', 'Theme vocabulary'],
            sourceGroup: 'languageLearning',
            helps: ['Review high-frequency verbs with spaced repetition.', 'Practice tense changes in short daily exercises.', 'Group vocabulary by school themes to improve recall.']
          },
          {
            name: 'Reading and Listening',
            topics: ['Article comprehension', 'Audio comprehension', 'Inference skills'],
            sourceGroup: 'languageLearning',
            helps: ['Read headlines first to predict the topic.', 'Listen and capture key words before full sentences.', 'Check understanding with short true/false statements.']
          },
          {
            name: 'Writing and Speaking',
            topics: ['Guided writing', 'Conversation strategies', 'Exam tasks'],
            sourceGroup: 'writing',
            helps: ['Use sentence starters for smooth speaking.', 'Prepare reusable structures for common exam prompts.', 'Practice correction by rewriting one old text each week.']
          }
        ]
      },
      {
        id: 'history',
        title: 'History',
        folders: [
          { name: 'World History', topics: ['Ancient civilizations', 'Industrial era', 'Global conflicts'], sourceGroup: 'socialScience' },
          { name: 'Primary Sources', topics: ['Source evaluation', 'Bias detection', 'Context analysis'], sourceGroup: 'socialScience' },
          { name: 'Historical Writing', topics: ['Chronology', 'Cause and effect', 'Evidence-based arguments'], sourceGroup: 'writing' },
          { name: 'Ancient and Medieval History', topics: ['Empires and trade', 'Religion and society', 'Medieval institutions'], sourceGroup: 'socialScience' },
          { name: 'Modern and Contemporary History', topics: ['Nation states', 'World wars', 'Cold War and globalization'], sourceGroup: 'socialScience' },
          { name: 'Regional History Projects', topics: ['Local archives', 'Oral history basics', 'Timeline building'], sourceGroup: 'writing' }
        ]
      },
      {
        id: 'geography',
        title: 'Geography',
        folders: [
          { name: 'Physical Geography', topics: ['Landforms', 'Weather systems', 'Natural hazards'], sourceGroup: 'geography' },
          { name: 'Human Geography', topics: ['Population', 'Urbanization', 'Migration'], sourceGroup: 'geography' },
          { name: 'Map Skills', topics: ['Scale and coordinates', 'Thematic maps', 'GIS basics'], sourceGroup: 'geography' },
          { name: 'Climate and Environment', topics: ['Climate zones', 'Climate change impacts', 'Adaptation and resilience'], sourceGroup: 'earthScience' },
          { name: 'Economic Geography', topics: ['Resources and trade', 'Industry location', 'Global supply chains'], sourceGroup: 'geography' },
          { name: 'Regional Case Studies', topics: ['Europe', 'Asia', 'Africa and the Americas'], sourceGroup: 'geography' }
        ]
      },
      {
        id: 'civics',
        title: 'Civics and Government',
        folders: [
          { name: 'Institutions', topics: ['Constitutions', 'Branches of government', 'Elections'], sourceGroup: 'socialScience' },
          { name: 'Rights and Responsibilities', topics: ['Civil rights', 'Rule of law', 'Public participation'], sourceGroup: 'socialScience' },
          { name: 'Media Literacy', topics: ['Fact checking', 'Source reliability', 'Digital citizenship'], sourceGroup: 'socialScience' }
        ]
      },
      {
        id: 'economics',
        title: 'Economics',
        folders: [
          { name: 'Microeconomics', topics: ['Supply and demand', 'Market structures', 'Consumer behavior'], sourceGroup: 'economics' },
          { name: 'Macroeconomics', topics: ['Inflation', 'Unemployment', 'Fiscal policy'], sourceGroup: 'economics' },
          { name: 'Personal Finance', topics: ['Budgeting', 'Interest rates', 'Saving and credit'], sourceGroup: 'economics' }
        ]
      },
      {
        id: 'earth-science',
        title: 'Earth Science',
        folders: [
          { name: 'Geology', topics: ['Rock cycle', 'Plate tectonics', 'Earthquakes'], sourceGroup: 'earthScience' },
          { name: 'Meteorology', topics: ['Atmosphere', 'Weather maps', 'Climate systems'], sourceGroup: 'earthScience' },
          { name: 'Astronomy Basics', topics: ['Solar system', 'Stars and galaxies', 'Space exploration'], sourceGroup: 'earthScience' }
        ]
      },
      {
        id: 'arts',
        title: 'Arts and Design',
        folders: [
          { name: 'Visual Arts', topics: ['Drawing', 'Color theory', 'Composition'], sourceGroup: 'arts' },
          { name: 'Art History', topics: ['Major movements', 'Artists and works', 'Cultural context'], sourceGroup: 'arts' },
          { name: 'Digital Design', topics: ['Typography', 'Layout', 'Creative tools'], sourceGroup: 'arts' }
        ]
      },
      {
        id: 'health',
        title: 'Health Education',
        folders: [
          { name: 'Personal Health', topics: ['Nutrition', 'Sleep', 'Physical activity'], sourceGroup: 'health' },
          { name: 'Mental Health', topics: ['Stress management', 'Help resources', 'Healthy habits'], sourceGroup: 'health' },
          { name: 'Public Health Basics', topics: ['Prevention', 'Vaccination', 'Community health'], sourceGroup: 'health' }
        ]
      },
      {
        id: 'religion-and-ethics',
        title: 'Religion and Ethics',
        folders: [
          { name: 'World Religions', topics: ['Beliefs and traditions', 'Festivals', 'Historical contexts'], sourceGroup: 'socialScience' },
          { name: 'Ethics', topics: ['Moral dilemmas', 'Justice and fairness', 'Responsibility'], sourceGroup: 'socialScience' },
          { name: 'Applied Ethics', topics: ['Media ethics', 'Bioethics basics', 'Environmental ethics'], sourceGroup: 'socialScience' }
        ]
      },
      {
        id: 'music',
        title: 'Music',
        folders: [
          { name: 'Music Theory', topics: ['Rhythm and meter', 'Scales and harmony', 'Notation'], sourceGroup: 'arts' },
          { name: 'Music History', topics: ['Baroque to modern', 'Genres', 'Cultural influences'], sourceGroup: 'arts' },
          { name: 'Performance and Practice', topics: ['Technique drills', 'Ensemble skills', 'Stage confidence'], sourceGroup: 'arts' }
        ]
      },
      {
        id: 'physical-education',
        title: 'Physical Education',
        folders: [
          { name: 'Fitness Fundamentals', topics: ['Endurance', 'Strength', 'Mobility'], sourceGroup: 'health' },
          { name: 'Team Sports', topics: ['Game tactics', 'Cooperation', 'Fair play'], sourceGroup: 'health' },
          { name: 'Sports Science Basics', topics: ['Training principles', 'Recovery', 'Injury prevention'], sourceGroup: 'health' }
        ]
      },
      {
        id: 'technology-and-design',
        title: 'Technology and Design',
        folders: [
          { name: 'Design Process', topics: ['Problem definition', 'Prototyping', 'Testing and iteration'], sourceGroup: 'engineering' },
          { name: 'Materials and Manufacturing', topics: ['Wood metal plastic basics', 'Tools and safety', 'Sustainable material choices'], sourceGroup: 'engineering' },
          { name: 'Digital Fabrication', topics: ['CAD basics', '3D printing intro', 'Laser cutting workflows'], sourceGroup: 'engineering' }
        ]
      },
      {
        id: 'media-literacy',
        title: 'Media Literacy and Digital Citizenship',
        folders: [
          { name: 'Information Verification', topics: ['Fact checking', 'Source comparison', 'Misinformation patterns'], sourceGroup: 'socialScience' },
          { name: 'Digital Safety', topics: ['Privacy', 'Passwords and security', 'Online behavior'], sourceGroup: 'cs' },
          { name: 'Content Creation', topics: ['Responsible publishing', 'Copyright basics', 'Storytelling'], sourceGroup: 'writing' }
        ]
      },
      {
        id: 'career-guidance',
        title: 'Career Guidance',
        folders: [
          { name: 'Self Assessment', topics: ['Strengths and interests', 'Learning profile', 'Goal setting'], sourceGroup: 'socialScience' },
          { name: 'Study and Job Pathways', topics: ['Vocational routes', 'University routes', 'Application requirements'], sourceGroup: 'socialScience' },
          { name: 'Application Skills', topics: ['CV writing', 'Motivation letters', 'Interview basics'], sourceGroup: 'writing' }
        ]
      },
      {
        id: 'entrepreneurship',
        title: 'Entrepreneurship',
        folders: [
          { name: 'Business Basics', topics: ['Value proposition', 'Customer needs', 'Simple business models'], sourceGroup: 'businessPolicy' },
          { name: 'Finance for Starters', topics: ['Revenue and costs', 'Budget planning', 'Break-even basics'], sourceGroup: 'economics' },
          { name: 'Project and Pitch Skills', topics: ['Prototype testing', 'Pitch structure', 'Feedback cycles'], sourceGroup: 'writing' }
        ]
      },
      {
        id: 'robotics-and-electronics',
        title: 'Robotics and Electronics',
        folders: [
          { name: 'Electronics Fundamentals', topics: ['Sensors and actuators', 'Microcontrollers', 'Circuit safety'], sourceGroup: 'engineering' },
          { name: 'Programming Robots', topics: ['Control logic', 'Motion planning basics', 'Debugging hardware-software systems'], sourceGroup: 'cs' },
          { name: 'Applied Robotics Projects', topics: ['Line follower', 'Object detection intro', 'Automation challenge'], sourceGroup: 'engineering' }
        ]
      },
      {
        id: 'home-economics-and-life-skills',
        title: 'Home Economics and Life Skills',
        folders: [
          { name: 'Nutrition and Cooking', topics: ['Balanced meals', 'Food hygiene', 'Meal planning'], sourceGroup: 'health' },
          { name: 'Consumer Skills', topics: ['Contracts and subscriptions', 'Budgeting at home', 'Sustainable consumption'], sourceGroup: 'economics' },
          { name: 'Everyday Management', topics: ['Time planning', 'Household organization', 'Responsible decision-making'], sourceGroup: 'socialScience' }
        ]
      },
      {
        id: 'logic-and-critical-thinking',
        title: 'Logic and Critical Thinking',
        folders: [
          { name: 'Formal Logic Basics', topics: ['Statements and arguments', 'Validity and soundness', 'Common logical forms'], sourceGroup: 'math' },
          { name: 'Reasoning in Texts', topics: ['Detecting fallacies', 'Argument mapping', 'Evidence quality checks'], sourceGroup: 'writing' },
          { name: 'Decision and Problem Solving', topics: ['Structured decision models', 'Bias awareness', 'Scenario evaluation'], sourceGroup: 'socialScience' }
        ]
      }
    ],
    university: [
      {
        id: 'medicine',
        title: 'Medicine',
        folders: [
          { name: 'Preclinical Foundations', topics: ['Anatomy', 'Physiology', 'Biochemistry'], sourceGroup: 'medicine' },
          { name: 'Clinical Medicine', topics: ['Internal medicine', 'Surgery basics', 'Differential diagnosis'], sourceGroup: 'medicine' },
          { name: 'Evidence-Based Medicine', topics: ['Clinical trials', 'Guideline reading', 'Biostatistics'], sourceGroup: 'medicine' },
          { name: 'Cardiology and Pulmonology', topics: ['Cardiovascular diagnostics', 'ECG interpretation basics', 'Respiratory disorders'], sourceGroup: 'medicine' },
          { name: 'Neurology and Psychiatry', topics: ['Neurological examination', 'Common neuro disorders', 'Psychiatric assessment basics'], sourceGroup: 'medicine' },
          { name: 'Pediatrics and Neonatology', topics: ['Growth and development', 'Pediatric emergencies', 'Neonatal care principles'], sourceGroup: 'medicine' },
          { name: 'Obstetrics and Gynecology', topics: ['Prenatal care', 'Labor and delivery basics', 'Gynecologic disorders'], sourceGroup: 'medicine' },
          { name: 'Emergency and Critical Care', topics: ['Triage principles', 'ACLS and resuscitation flow', 'Shock and sepsis management'], sourceGroup: 'medicine' },
          { name: 'Radiology and Imaging', topics: ['X-ray reading basics', 'Ultrasound principles', 'CT and MRI indications'], sourceGroup: 'medicine' },
          { name: 'Pathology and Laboratory Medicine', topics: ['Histopathology fundamentals', 'Lab value interpretation', 'Diagnostic algorithms'], sourceGroup: 'medicine' },
          { name: 'Pharmacotherapy', topics: ['Drug mechanisms', 'Safe prescribing', 'Adverse drug reactions'], sourceGroup: 'medicine' },
          { name: 'Infectious Diseases', topics: ['Antimicrobial stewardship', 'Infection prevention', 'Outbreak response'], sourceGroup: 'medicine' },
          { name: 'Oncology', topics: ['Cancer biology basics', 'Staging and diagnostics', 'Therapy principles'], sourceGroup: 'medicine' },
          { name: 'Clinical Skills and OSCE Prep', topics: ['History taking', 'Physical examination', 'Communication with patients'], sourceGroup: 'medicine' },
          { name: 'Medical Ethics and Law', topics: ['Informed consent', 'Confidentiality', 'Professional responsibility'], sourceGroup: 'health' }
        ]
      },
      {
        id: 'nursing',
        title: 'Nursing',
        folders: [
          { name: 'Core Nursing Science', topics: ['Patient assessment', 'Care plans', 'Medication safety'], sourceGroup: 'medicine' },
          { name: 'Clinical Skills', topics: ['Infection control', 'Documentation', 'Communication'], sourceGroup: 'medicine' },
          { name: 'Community and Public Health', topics: ['Prevention', 'Health promotion', 'Epidemiology basics'], sourceGroup: 'health' }
        ]
      },
      {
        id: 'pharmacy',
        title: 'Pharmacy',
        folders: [
          { name: 'Pharmacology', topics: ['Drug classes', 'Mechanisms', 'Adverse effects'], sourceGroup: 'medicine' },
          { name: 'Pharmaceutical Chemistry', topics: ['Medicinal chemistry', 'Formulations', 'Quality control'], sourceGroup: 'chemistry' },
          { name: 'Clinical Pharmacy', topics: ['Medication review', 'Interactions', 'Patient counseling'], sourceGroup: 'medicine' }
        ]
      },
      {
        id: 'dentistry',
        title: 'Dentistry',
        folders: [
          { name: 'Oral Biology', topics: ['Tooth anatomy', 'Oral microbiology', 'Development'], sourceGroup: 'biology' },
          { name: 'Clinical Dentistry', topics: ['Diagnostics', 'Restorative basics', 'Preventive care'], sourceGroup: 'medicine' },
          { name: 'Patient Safety', topics: ['Infection prevention', 'Sterilization', 'Ethics'], sourceGroup: 'health' }
        ]
      },
      {
        id: 'law',
        title: 'Law',
        folders: [
          { name: 'Legal Foundations', topics: ['Constitutional law', 'Legal systems', 'Interpretation'], sourceGroup: 'law' },
          { name: 'Public and Private Law', topics: ['Criminal law', 'Civil law', 'Administrative law'], sourceGroup: 'law' },
          { name: 'Research and Writing', topics: ['Case analysis', 'Citation standards', 'Legal argumentation'], sourceGroup: 'writing' },
          { name: 'Constitutional and Human Rights Law', topics: ['Fundamental rights review', 'Constitutional complaints', 'Proportionality analysis'], sourceGroup: 'law' },
          { name: 'Criminal Law and Procedure', topics: ['Offense elements', 'Defenses and liability', 'Criminal procedure workflow'], sourceGroup: 'law' },
          { name: 'Civil Law and Civil Procedure', topics: ['Contract and tort', 'Property and obligations', 'Civil litigation stages'], sourceGroup: 'law' },
          { name: 'Commercial and Corporate Law', topics: ['Company forms', 'Corporate governance', 'Insolvency basics'], sourceGroup: 'law' },
          { name: 'Labor and Social Law', topics: ['Employment contracts', 'Collective labor law', 'Social protection frameworks'], sourceGroup: 'law' },
          { name: 'Tax Law', topics: ['Tax principles', 'Corporate taxation basics', 'Tax compliance and disputes'], sourceGroup: 'law' },
          { name: 'International and EU Law', topics: ['Treaty systems', 'EU institutions and legislation', 'Cross-border dispute issues'], sourceGroup: 'law' },
          { name: 'Intellectual Property and IT Law', topics: ['Copyright and trademarks', 'Patent basics', 'Data protection and platform law'], sourceGroup: 'law' },
          { name: 'Administrative and Regulatory Law', topics: ['Administrative acts', 'Licensing and supervision', 'Judicial review in administration'], sourceGroup: 'law' },
          { name: 'Environmental and Climate Law', topics: ['Environmental permits', 'Liability for environmental harm', 'Climate governance frameworks'], sourceGroup: 'law' },
          { name: 'Alternative Dispute Resolution', topics: ['Negotiation strategies', 'Mediation and arbitration', 'Settlement drafting'], sourceGroup: 'law' },
          { name: 'Legal Clinics and Practical Training', topics: ['Client interviewing', 'File and deadline management', 'Court submission drafting'], sourceGroup: 'writing' }
        ]
      },
      {
        id: 'business-administration',
        title: 'Business Administration',
        folders: [
          { name: 'Management', topics: ['Strategy', 'Operations', 'Organizational behavior'], sourceGroup: 'economics' },
          { name: 'Accounting and Finance', topics: ['Financial statements', 'Corporate finance', 'Cost accounting'], sourceGroup: 'economics' },
          { name: 'Marketing', topics: ['Market research', 'Consumer behavior', 'Digital marketing'], sourceGroup: 'economics' }
        ]
      },
      {
        id: 'economics',
        title: 'Economics',
        folders: [
          { name: 'Microeconomics', topics: ['Game theory', 'Market failure', 'Welfare analysis'], sourceGroup: 'economics' },
          { name: 'Macroeconomics', topics: ['Growth models', 'Monetary policy', 'Labor markets'], sourceGroup: 'economics' },
          { name: 'Econometrics', topics: ['Regression', 'Causal inference', 'Panel data'], sourceGroup: 'economics' }
        ]
      },
      {
        id: 'computer-science',
        title: 'Computer Science',
        folders: [
          { name: 'Algorithms and Data Structures', topics: ['Complexity analysis', 'Trees and graphs', 'Dynamic programming'], sourceGroup: 'cs' },
          { name: 'Systems', topics: ['Operating systems', 'Computer networks', 'Distributed systems'], sourceGroup: 'cs' },
          { name: 'Software Engineering', topics: ['Architecture', 'Testing', 'Version control and CI'], sourceGroup: 'cs' }
        ]
      },
      {
        id: 'data-science',
        title: 'Data Science',
        folders: [
          { name: 'Data Analysis', topics: ['Data cleaning', 'Exploratory analysis', 'Visualization'], sourceGroup: 'cs' },
          { name: 'Machine Learning', topics: ['Supervised learning', 'Model evaluation', 'Feature engineering'], sourceGroup: 'cs' },
          { name: 'Statistics for Data Science', topics: ['Inference', 'Hypothesis testing', 'Bayesian basics'], sourceGroup: 'math' }
        ]
      },
      {
        id: 'artificial-intelligence',
        title: 'Artificial Intelligence',
        folders: [
          { name: 'Foundations', topics: ['Search and optimization', 'Knowledge representation', 'Reasoning'], sourceGroup: 'cs' },
          { name: 'Deep Learning', topics: ['Neural networks', 'Computer vision', 'Natural language processing'], sourceGroup: 'cs' },
          { name: 'Responsible AI', topics: ['Bias and fairness', 'Model interpretability', 'Ethics and governance'], sourceGroup: 'socialScience' }
        ]
      },
      {
        id: 'electrical-engineering',
        title: 'Electrical Engineering',
        folders: [
          { name: 'Circuit Theory', topics: ['Circuit laws', 'AC/DC analysis', 'Signal basics'], sourceGroup: 'engineering' },
          { name: 'Electronics', topics: ['Semiconductors', 'Amplifiers', 'Digital electronics'], sourceGroup: 'engineering' },
          { name: 'Control and Communication', topics: ['Feedback systems', 'Communication systems', 'Embedded systems'], sourceGroup: 'engineering' }
        ]
      },
      {
        id: 'mechanical-engineering',
        title: 'Mechanical Engineering',
        folders: [
          { name: 'Mechanics and Materials', topics: ['Statics and dynamics', 'Strength of materials', 'Failure analysis'], sourceGroup: 'engineering' },
          { name: 'Thermal Sciences', topics: ['Thermodynamics', 'Heat transfer', 'Fluid mechanics'], sourceGroup: 'engineering' },
          { name: 'Design and Manufacturing', topics: ['CAD', 'Manufacturing processes', 'Quality engineering'], sourceGroup: 'engineering' }
        ]
      },
      {
        id: 'civil-engineering',
        title: 'Civil Engineering',
        folders: [
          { name: 'Structural Engineering', topics: ['Structural analysis', 'Concrete and steel design', 'Load cases'], sourceGroup: 'engineering' },
          { name: 'Geotechnical and Water', topics: ['Soil mechanics', 'Hydraulics', 'Water resources'], sourceGroup: 'engineering' },
          { name: 'Transportation and Construction', topics: ['Transportation systems', 'Project management', 'Construction methods'], sourceGroup: 'engineering' }
        ]
      },
      {
        id: 'chemical-engineering',
        title: 'Chemical Engineering',
        folders: [
          { name: 'Reaction Engineering', topics: ['Reaction kinetics', 'Reactor design', 'Catalysis'], sourceGroup: 'chemistry' },
          { name: 'Process Engineering', topics: ['Mass and energy balances', 'Separation processes', 'Process control'], sourceGroup: 'engineering' },
          { name: 'Safety and Sustainability', topics: ['Process safety', 'Risk analysis', 'Green chemistry'], sourceGroup: 'engineering' }
        ]
      },
      {
        id: 'aerospace-engineering',
        title: 'Aerospace Engineering',
        folders: [
          { name: 'Aerodynamics', topics: ['Fluid flow', 'Lift and drag', 'Boundary layers'], sourceGroup: 'engineering' },
          { name: 'Flight Mechanics', topics: ['Stability and control', 'Orbital basics', 'Mission profiles'], sourceGroup: 'engineering' },
          { name: 'Propulsion and Structures', topics: ['Jet and rocket propulsion', 'Composite materials', 'Structural loads'], sourceGroup: 'engineering' }
        ]
      },
      {
        id: 'architecture',
        title: 'Architecture',
        folders: [
          { name: 'Design Studio', topics: ['Spatial composition', 'Site analysis', 'Concept development'], sourceGroup: 'architecture' },
          { name: 'Building Technology', topics: ['Building envelopes', 'Construction systems', 'Building physics'], sourceGroup: 'architecture' },
          { name: 'Urban and Sustainable Design', topics: ['Urban planning basics', 'Climate-responsive design', 'Sustainable materials'], sourceGroup: 'architecture' }
        ]
      },
      {
        id: 'mathematics',
        title: 'Mathematics',
        folders: [
          { name: 'Pure Mathematics', topics: ['Real analysis', 'Abstract algebra', 'Topology'], sourceGroup: 'math' },
          { name: 'Applied Mathematics', topics: ['Differential equations', 'Numerical methods', 'Optimization'], sourceGroup: 'math' },
          { name: 'Probability and Statistics', topics: ['Stochastic processes', 'Statistical inference', 'Time series'], sourceGroup: 'math' },
          { name: 'Linear and Multilinear Algebra', topics: ['Vector spaces', 'Matrix decompositions', 'Tensor intro'], sourceGroup: 'math' },
          { name: 'Complex Analysis and Differential Geometry', topics: ['Complex functions', 'Contour integration', 'Manifolds intro'], sourceGroup: 'math' },
          { name: 'Mathematical Modeling', topics: ['Model formulation', 'Parameter estimation', 'Validation and sensitivity'], sourceGroup: 'math' }
        ]
      },
      {
        id: 'physics',
        title: 'Physics',
        folders: [
          { name: 'Classical Physics', topics: ['Analytical mechanics', 'Electrodynamics', 'Thermodynamics'], sourceGroup: 'physics' },
          { name: 'Modern Physics', topics: ['Quantum mechanics', 'Relativity', 'Particle physics'], sourceGroup: 'physics' },
          { name: 'Experimental Methods', topics: ['Measurement uncertainty', 'Data analysis', 'Lab methodology'], sourceGroup: 'physics' }
        ]
      },
      {
        id: 'chemistry',
        title: 'Chemistry',
        folders: [
          { name: 'Physical and Inorganic Chemistry', topics: ['Thermochemistry', 'Spectroscopy', 'Coordination chemistry'], sourceGroup: 'chemistry' },
          { name: 'Organic Chemistry', topics: ['Reaction mechanisms', 'Synthesis strategy', 'Structure elucidation'], sourceGroup: 'chemistry' },
          { name: 'Analytical Chemistry', topics: ['Chromatography', 'Mass spectrometry', 'Quality assurance'], sourceGroup: 'chemistry' }
        ]
      },
      {
        id: 'biology',
        title: 'Biology',
        folders: [
          { name: 'Molecular and Cell Biology', topics: ['Gene expression', 'Protein function', 'Cell signaling'], sourceGroup: 'biology' },
          { name: 'Genetics and Evolution', topics: ['Population genetics', 'Phylogenetics', 'Genomics'], sourceGroup: 'biology' },
          { name: 'Ecology and Conservation', topics: ['Biodiversity', 'Ecosystem services', 'Conservation biology'], sourceGroup: 'biology' }
        ]
      },
      {
        id: 'biotechnology',
        title: 'Biotechnology',
        folders: [
          { name: 'Bioprocess Engineering', topics: ['Fermentation', 'Bioreactors', 'Downstream processing'], sourceGroup: 'engineering' },
          { name: 'Molecular Biotechnology', topics: ['PCR and cloning', 'Genome editing basics', 'Protein engineering'], sourceGroup: 'biology' },
          { name: 'Bioethics and Regulation', topics: ['Ethical review', 'Safety standards', 'Regulatory frameworks'], sourceGroup: 'socialScience' }
        ]
      },
      {
        id: 'environmental-science',
        title: 'Environmental Science',
        folders: [
          { name: 'Climate and Atmosphere', topics: ['Climate systems', 'Carbon cycle', 'Mitigation pathways'], sourceGroup: 'earthScience' },
          { name: 'Water and Soil', topics: ['Water quality', 'Soil systems', 'Pollution control'], sourceGroup: 'earthScience' },
          { name: 'Environmental Policy', topics: ['Environmental law', 'Impact assessment', 'Sustainability metrics'], sourceGroup: 'socialScience' }
        ]
      },
      {
        id: 'geosciences',
        title: 'Geosciences',
        folders: [
          { name: 'Geology and Geophysics', topics: ['Earth structure', 'Seismology basics', 'Plate tectonics'], sourceGroup: 'earthScience' },
          { name: 'Remote Sensing and GIS', topics: ['Satellite data', 'Spatial analysis', 'Geospatial workflows'], sourceGroup: 'geography' },
          { name: 'Natural Hazards', topics: ['Volcanoes', 'Earthquakes', 'Risk mitigation'], sourceGroup: 'earthScience' },
          { name: 'Hydrology and Climate Systems', topics: ['Hydrological cycle', 'Watershed analysis', 'Climate data interpretation'], sourceGroup: 'earthScience' },
          { name: 'Advanced Cartography', topics: ['Map projections', 'Spatial statistics', 'Geodata ethics'], sourceGroup: 'geography' }
        ]
      },
      {
        id: 'psychology',
        title: 'Psychology',
        folders: [
          { name: 'Core Psychology', topics: ['Cognitive psychology', 'Developmental psychology', 'Social psychology'], sourceGroup: 'socialScience' },
          { name: 'Research Methods', topics: ['Experimental design', 'Survey methods', 'Statistical analysis'], sourceGroup: 'socialScience' },
          { name: 'Clinical and Health Contexts', topics: ['Psychopathology basics', 'Behavior change', 'Ethics'], sourceGroup: 'health' }
        ]
      },
      {
        id: 'sociology',
        title: 'Sociology',
        folders: [
          { name: 'Social Theory', topics: ['Classical theorists', 'Modern theory', 'Institutions'], sourceGroup: 'socialScience' },
          { name: 'Methods', topics: ['Qualitative methods', 'Quantitative methods', 'Mixed methods'], sourceGroup: 'socialScience' },
          { name: 'Applied Sociology', topics: ['Inequality', 'Urban sociology', 'Education and work'], sourceGroup: 'socialScience' }
        ]
      },
      {
        id: 'political-science',
        title: 'Political Science',
        folders: [
          { name: 'Political Theory', topics: ['Normative theory', 'Democracy', 'Governance models'], sourceGroup: 'socialScience' },
          { name: 'Comparative Politics', topics: ['Institutions', 'Elections', 'Public policy'], sourceGroup: 'socialScience' },
          { name: 'International Relations', topics: ['Global governance', 'Security studies', 'Political economy'], sourceGroup: 'socialScience' }
        ]
      },
      {
        id: 'education',
        title: 'Education',
        folders: [
          { name: 'Learning Sciences', topics: ['Learning theories', 'Instructional design', 'Assessment'], sourceGroup: 'socialScience' },
          { name: 'Pedagogy and Didactics', topics: ['Classroom management', 'Inclusive education', 'Curriculum planning'], sourceGroup: 'socialScience' },
          { name: 'Education Technology', topics: ['Digital learning tools', 'Learning analytics', 'Online pedagogy'], sourceGroup: 'cs' }
        ]
      },
      {
        id: 'linguistics',
        title: 'Linguistics',
        folders: [
          { name: 'Core Linguistics', topics: ['Phonetics and phonology', 'Morphology', 'Syntax'], sourceGroup: 'languageArts' },
          { name: 'Semantics and Pragmatics', topics: ['Meaning', 'Context', 'Discourse'], sourceGroup: 'languageArts' },
          { name: 'Applied Linguistics', topics: ['Language acquisition', 'Sociolinguistics', 'Corpus methods'], sourceGroup: 'languageArts' }
        ]
      },
      {
        id: 'modern-languages',
        title: 'Modern Languages',
        folders: [
          {
            name: 'Applied Language Skills',
            topics: ['Advanced grammar', 'Academic vocabulary', 'Register and style'],
            sourceGroup: 'languageLearning',
            helps: ['Build domain-specific vocabulary lists for your faculty.', 'Practice translation of short academic abstracts.', 'Review feedback loops: write, correct, rewrite.']
          },
          {
            name: 'Intercultural Communication',
            topics: ['Cultural framing', 'Discourse conventions', 'Pragmatics'],
            sourceGroup: 'socialScience',
            helps: ['Compare communication norms across two cultures.', 'Analyze authentic dialogue samples.', 'Use reflective notes after each speaking practice.']
          },
          {
            name: 'Professional Writing',
            topics: ['Reports', 'Research summaries', 'Presentation scripts'],
            sourceGroup: 'writing',
            helps: ['Use a template for report structure.', 'Cite sources consistently in every draft.', 'Peer-review one text before final submission.']
          }
        ]
      },
      {
        id: 'literature',
        title: 'Literature',
        folders: [
          { name: 'Literary Analysis', topics: ['Genres', 'Narrative structures', 'Interpretation'], sourceGroup: 'languageArts' },
          { name: 'World Literature', topics: ['Historical periods', 'Comparative literature', 'Cultural contexts'], sourceGroup: 'languageArts' },
          { name: 'Academic Writing', topics: ['Close reading essays', 'Citation standards', 'Research papers'], sourceGroup: 'writing' }
        ]
      },
      {
        id: 'history',
        title: 'History',
        folders: [
          { name: 'Historiography', topics: ['Methods and sources', 'Historical debates', 'Interpretive frameworks'], sourceGroup: 'socialScience' },
          { name: 'Regional and Global History', topics: ['State formation', 'Imperial systems', 'Globalization'], sourceGroup: 'socialScience' },
          { name: 'Research Seminar', topics: ['Archival work', 'Source criticism', 'Scholarly writing'], sourceGroup: 'writing' },
          { name: 'Ancient to Early Modern Worlds', topics: ['Classical antiquity', 'Medieval transformations', 'Early modern state systems'], sourceGroup: 'socialScience' },
          { name: '19th and 20th Century Transformations', topics: ['Industrialization', 'Nationalism and revolutions', 'War and decolonization'], sourceGroup: 'socialScience' },
          { name: 'Digital History and Public History', topics: ['Digital archives', 'Data-driven historical analysis', 'Museum and memory studies'], sourceGroup: 'writing' }
        ]
      },
      {
        id: 'philosophy',
        title: 'Philosophy',
        folders: [
          { name: 'Core Areas', topics: ['Ethics', 'Epistemology', 'Metaphysics'], sourceGroup: 'socialScience' },
          { name: 'Logic', topics: ['Propositional logic', 'Predicate logic', 'Argument validity'], sourceGroup: 'math' },
          { name: 'Contemporary Issues', topics: ['Philosophy of mind', 'Political philosophy', 'Applied ethics'], sourceGroup: 'socialScience' }
        ]
      },
      {
        id: 'art-and-design',
        title: 'Art and Design',
        folders: [
          { name: 'Studio Practice', topics: ['Drawing and composition', 'Digital media', 'Portfolio development'], sourceGroup: 'arts' },
          { name: 'Design Theory', topics: ['Visual communication', 'Design research', 'User-centered design'], sourceGroup: 'arts' },
          { name: 'Art History and Critique', topics: ['Art movements', 'Critical writing', 'Curatorial concepts'], sourceGroup: 'arts' }
        ]
      },
      {
        id: 'media-and-communication',
        title: 'Media and Communication',
        folders: [
          { name: 'Media Studies', topics: ['Media systems', 'Media effects', 'Audience analysis'], sourceGroup: 'socialScience' },
          { name: 'Journalism and Verification', topics: ['Reporting standards', 'Fact-checking workflows', 'Source verification'], sourceGroup: 'writing' },
          { name: 'Digital Communication', topics: ['Platform communication', 'Data storytelling', 'Ethics'], sourceGroup: 'socialScience' }
        ]
      },
      {
        id: 'agriculture-and-food-science',
        title: 'Agriculture and Food Science',
        folders: [
          { name: 'Crop and Soil Science', topics: ['Soil fertility', 'Plant nutrition', 'Crop management'], sourceGroup: 'agriculture' },
          { name: 'Food Systems', topics: ['Food safety', 'Supply chains', 'Nutrition systems'], sourceGroup: 'agriculture' },
          { name: 'Sustainable Agriculture', topics: ['Water-efficient farming', 'Agroecology', 'Climate adaptation'], sourceGroup: 'agriculture' }
        ]
      },
      {
        id: 'statistics',
        title: 'Statistics',
        folders: [
          { name: 'Statistical Foundations', topics: ['Probability models', 'Sampling', 'Estimation'], sourceGroup: 'math' },
          { name: 'Inference and Modeling', topics: ['Hypothesis testing', 'Regression', 'ANOVA basics'], sourceGroup: 'math' },
          { name: 'Applied Statistics', topics: ['Experimental design', 'Survey analysis', 'Reproducible workflows'], sourceGroup: 'math' }
        ]
      },
      {
        id: 'finance-and-accounting',
        title: 'Finance and Accounting',
        folders: [
          { name: 'Financial Accounting', topics: ['Balance sheet', 'Income statement', 'Cash flow'], sourceGroup: 'economics' },
          { name: 'Corporate Finance', topics: ['Time value of money', 'Capital budgeting', 'Risk and return'], sourceGroup: 'economics' },
          { name: 'Managerial Accounting', topics: ['Costing methods', 'Budgeting', 'Performance analysis'], sourceGroup: 'economics' }
        ]
      },
      {
        id: 'international-business',
        title: 'International Business',
        folders: [
          { name: 'Global Markets', topics: ['Trade structures', 'Market entry strategies', 'Global competition'], sourceGroup: 'economics' },
          { name: 'Operations and Supply Chains', topics: ['Sourcing', 'Logistics', 'Risk resilience'], sourceGroup: 'economics' },
          { name: 'Cross-Cultural Management', topics: ['Intercultural negotiation', 'Leadership styles', 'Global teams'], sourceGroup: 'socialScience' }
        ]
      },
      {
        id: 'public-health',
        title: 'Public Health',
        folders: [
          { name: 'Epidemiology', topics: ['Incidence and prevalence', 'Study designs', 'Outbreak investigation'], sourceGroup: 'health' },
          { name: 'Health Policy', topics: ['Health systems', 'Prevention policy', 'Equity in health'], sourceGroup: 'health' },
          { name: 'Biostatistics for Health', topics: ['Risk measures', 'Clinical data interpretation', 'Evidence appraisal'], sourceGroup: 'medicine' }
        ]
      },
      {
        id: 'veterinary-medicine',
        title: 'Veterinary Medicine',
        folders: [
          { name: 'Animal Anatomy and Physiology', topics: ['Species differences', 'Body systems', 'Clinical signs'], sourceGroup: 'medicine' },
          { name: 'Diagnostics and Treatment', topics: ['Clinical examination', 'Laboratory diagnostics', 'Therapeutic planning'], sourceGroup: 'medicine' },
          { name: 'Animal Welfare and Public Health', topics: ['Welfare standards', 'Zoonoses', 'Ethics and regulation'], sourceGroup: 'health' }
        ]
      },
      {
        id: 'sports-science',
        title: 'Sports Science',
        folders: [
          { name: 'Exercise Physiology', topics: ['Energy systems', 'Adaptation to training', 'Fatigue'], sourceGroup: 'health' },
          { name: 'Biomechanics', topics: ['Movement analysis', 'Force and motion', 'Performance optimization'], sourceGroup: 'engineering' },
          { name: 'Coaching and Performance', topics: ['Training periodization', 'Skill acquisition', 'Athlete monitoring'], sourceGroup: 'health' }
        ]
      },
      {
        id: 'theology-and-religious-studies',
        title: 'Theology and Religious Studies',
        folders: [
          { name: 'Sacred Texts and Interpretation', topics: ['Text traditions', 'Hermeneutics', 'Comparative readings'], sourceGroup: 'socialScience' },
          { name: 'History of Religions', topics: ['Religious movements', 'Institutions', 'Modern developments'], sourceGroup: 'socialScience' },
          { name: 'Religion in Society', topics: ['Ethics and public life', 'Interfaith dialogue', 'Religion and conflict'], sourceGroup: 'socialScience' }
        ]
      },
      {
        id: 'anthropology-and-archaeology',
        title: 'Anthropology and Archaeology',
        folders: [
          { name: 'Cultural Anthropology', topics: ['Fieldwork methods', 'Kinship and identity', 'Cultural change'], sourceGroup: 'socialScience' },
          { name: 'Biological Anthropology', topics: ['Human evolution', 'Population variation', 'Primate studies'], sourceGroup: 'biology' },
          { name: 'Archaeological Methods', topics: ['Excavation strategy', 'Dating techniques', 'Material culture analysis'], sourceGroup: 'socialScience' }
        ]
      },
      {
        id: 'library-and-information-science',
        title: 'Library and Information Science',
        folders: [
          { name: 'Knowledge Organization', topics: ['Classification systems', 'Metadata standards', 'Information retrieval'], sourceGroup: 'cs' },
          { name: 'Digital Libraries', topics: ['Archival workflows', 'Digital preservation', 'Open access ecosystems'], sourceGroup: 'cs' },
          { name: 'Information Literacy Education', topics: ['Search strategies', 'Source evaluation', 'Citation management'], sourceGroup: 'writing' }
        ]
      },
      {
        id: 'urban-and-regional-planning',
        title: 'Urban and Regional Planning',
        folders: [
          { name: 'Urban Systems', topics: ['Land use', 'Mobility systems', 'Infrastructure planning'], sourceGroup: 'geography' },
          { name: 'Regional Development', topics: ['Economic geography', 'Rural-urban dynamics', 'Spatial inequality'], sourceGroup: 'geography' },
          { name: 'Planning Methods', topics: ['Policy instruments', 'Participatory planning', 'Impact assessment'], sourceGroup: 'socialScience' }
        ]
      },
      {
        id: 'cybersecurity',
        title: 'Cybersecurity',
        folders: [
          { name: 'Security Foundations', topics: ['CIA triad', 'Threat modeling', 'Risk management'], sourceGroup: 'cybersecurity' },
          { name: 'Network and System Security', topics: ['Secure network design', 'Endpoint hardening', 'Identity and access management'], sourceGroup: 'cybersecurity' },
          { name: 'Security Operations', topics: ['Incident response', 'Vulnerability management', 'Security monitoring'], sourceGroup: 'cybersecurity' }
        ]
      },
      {
        id: 'information-systems',
        title: 'Information Systems',
        folders: [
          { name: 'Enterprise Systems', topics: ['ERP and CRM concepts', 'Business process mapping', 'Data governance'], sourceGroup: 'cs' },
          { name: 'Database and Analytics Platforms', topics: ['Relational modeling', 'Data warehousing', 'BI reporting'], sourceGroup: 'cs' },
          { name: 'IT Strategy and Governance', topics: ['IT service management', 'Digital transformation', 'Compliance and controls'], sourceGroup: 'businessPolicy' }
        ]
      },
      {
        id: 'operations-research',
        title: 'Operations Research',
        folders: [
          { name: 'Optimization Models', topics: ['Linear programming', 'Integer programming', 'Network optimization'], sourceGroup: 'math' },
          { name: 'Stochastic Models', topics: ['Queueing systems', 'Simulation', 'Decision under uncertainty'], sourceGroup: 'math' },
          { name: 'Applications', topics: ['Production planning', 'Routing and scheduling', 'Resource allocation'], sourceGroup: 'engineering' }
        ]
      },
      {
        id: 'supply-chain-and-logistics',
        title: 'Supply Chain and Logistics',
        folders: [
          { name: 'Supply Chain Design', topics: ['Procurement networks', 'Inventory policies', 'Demand planning'], sourceGroup: 'economics' },
          { name: 'Logistics Operations', topics: ['Warehousing systems', 'Transport optimization', 'Cold chain basics'], sourceGroup: 'economics' },
          { name: 'Resilience and Sustainability', topics: ['Disruption planning', 'Traceability', 'Low-carbon logistics'], sourceGroup: 'businessPolicy' }
        ]
      },
      {
        id: 'energy-systems',
        title: 'Energy Systems',
        folders: [
          { name: 'Power Systems Fundamentals', topics: ['Generation technologies', 'Grid structure', 'Load management'], sourceGroup: 'energy' },
          { name: 'Renewables and Storage', topics: ['Solar and wind systems', 'Battery storage', 'Hybrid energy systems'], sourceGroup: 'energy' },
          { name: 'Energy Policy and Markets', topics: ['Energy regulation', 'Electricity markets', 'Transition planning'], sourceGroup: 'businessPolicy' }
        ]
      },
      {
        id: 'materials-science',
        title: 'Materials Science',
        folders: [
          { name: 'Structure and Properties', topics: ['Crystal structures', 'Mechanical properties', 'Electrical and thermal behavior'], sourceGroup: 'engineering' },
          { name: 'Characterization Methods', topics: ['Microscopy', 'Spectroscopy', 'Failure analysis methods'], sourceGroup: 'chemistry' },
          { name: 'Advanced Materials', topics: ['Polymers and composites', 'Biomaterials', 'Nanomaterials'], sourceGroup: 'engineering' }
        ]
      },
      {
        id: 'marine-and-ocean-science',
        title: 'Marine and Ocean Science',
        folders: [
          { name: 'Ocean Systems', topics: ['Ocean circulation', 'Marine ecosystems', 'Biogeochemical cycles'], sourceGroup: 'ocean' },
          { name: 'Marine Data and Observation', topics: ['Field sampling', 'Remote sensing for oceans', 'Marine data analysis'], sourceGroup: 'ocean' },
          { name: 'Coastal and Marine Management', topics: ['Coastal risk assessment', 'Marine conservation', 'Fisheries governance'], sourceGroup: 'ocean' }
        ]
      },
      {
        id: 'neuroscience',
        title: 'Neuroscience',
        folders: [
          { name: 'Neurobiology Foundations', topics: ['Neurons and synapses', 'Neural circuits', 'Brain development'], sourceGroup: 'biology' },
          { name: 'Cognitive and Behavioral Neuroscience', topics: ['Memory and attention', 'Perception', 'Decision processes'], sourceGroup: 'medicine' },
          { name: 'Clinical and Translational Neuroscience', topics: ['Neurodegenerative disorders', 'Neuroimaging', 'Neurotherapeutics'], sourceGroup: 'medicine' }
        ]
      },
      {
        id: 'public-administration',
        title: 'Public Administration',
        folders: [
          { name: 'State and Public Institutions', topics: ['Administrative structures', 'Public service delivery', 'Institutional accountability'], sourceGroup: 'socialScience' },
          { name: 'Public Policy Analysis', topics: ['Policy cycle', 'Impact evaluation', 'Program implementation'], sourceGroup: 'businessPolicy' },
          { name: 'Governance and Ethics', topics: ['Transparency standards', 'Anti-corruption tools', 'Ethics in public office'], sourceGroup: 'law' }
        ]
      },
      {
        id: 'development-studies',
        title: 'Development Studies',
        folders: [
          { name: 'Development Theories', topics: ['Growth and inequality', 'Human development', 'Structural transformation'], sourceGroup: 'economics' },
          { name: 'Global Development Practice', topics: ['Education and health systems', 'Poverty reduction strategies', 'Aid effectiveness'], sourceGroup: 'businessPolicy' },
          { name: 'Sustainable Development Goals', topics: ['SDG metrics', 'Cross-sector policy design', 'Local implementation'], sourceGroup: 'socialScience' }
        ]
      },
      {
        id: 'hospitality-and-tourism',
        title: 'Hospitality and Tourism',
        folders: [
          { name: 'Hospitality Operations', topics: ['Service quality standards', 'Front office systems', 'Food and beverage operations'], sourceGroup: 'economics' },
          { name: 'Tourism Management', topics: ['Destination planning', 'Experience design', 'Tourism marketing'], sourceGroup: 'economics' },
          { name: 'Sustainable Tourism', topics: ['Community impact', 'Environmental footprint', 'Responsible tourism policy'], sourceGroup: 'socialScience' }
        ]
      },
      {
        id: 'translation-and-interpreting',
        title: 'Translation and Interpreting',
        folders: [
          { name: 'Translation Techniques', topics: ['Text analysis', 'Terminology management', 'Revision and quality assurance'], sourceGroup: 'languageLearning' },
          { name: 'Interpreting Practice', topics: ['Consecutive interpreting', 'Note-taking systems', 'Interpreting ethics'], sourceGroup: 'languageLearning' },
          { name: 'Specialized Language Services', topics: ['Legal translation', 'Medical translation', 'Technical localization'], sourceGroup: 'writing' }
        ]
      },
      {
        id: 'performing-arts',
        title: 'Performing Arts',
        folders: [
          { name: 'Performance Practice', topics: ['Voice and movement', 'Stage interpretation', 'Rehearsal process'], sourceGroup: 'arts' },
          { name: 'Theatre and Dance Studies', topics: ['Performance history', 'Dramaturgy basics', 'Choreographic structures'], sourceGroup: 'arts' },
          { name: 'Production and Management', topics: ['Production planning', 'Technical stage workflows', 'Audience development'], sourceGroup: 'arts' }
        ]
      }
    ]
  };
})();
