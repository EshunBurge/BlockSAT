// Original short passages (not sourced from any copyrighted exam) with
// structured metadata used to generate genuine, gradable Reading questions
// across all six topics. Each passage is deliberately self-contained so
// every question can be answered from the text alone.

export interface ReadingPassage {
  id: string;
  genre: string;
  text: string;
  mainIdea: { correct: string; wrong: string[] };
  purpose: { correct: string; wrong: string[] };
  vocab: { word: string; correctMeaning: string; wrongMeanings: string[] };
  inference: { question: string; correct: string; wrong: string[] };
  evidence: { claim: string; correctQuote: string; wrongQuotes: string[] };
}

export const READING_PASSAGES: ReadingPassage[] = [
  {
    id: "coral-reefs",
    genre: "science",
    text: "Coral reefs occupy less than one percent of the ocean floor, yet they support roughly a quarter of all known marine species. This disproportionate richness arises because coral structures create countless nooks where algae, fish, and invertebrates can shelter and feed. When ocean temperatures rise even slightly, corals expel the algae living in their tissues, a process called bleaching. A bleached reef is not immediately dead, but it is severely weakened, and prolonged stress often leads to widespread coral death within a few years. Marine biologists now monitor reef temperatures constantly, hoping that early warnings will allow conservationists to intervene before bleaching becomes irreversible.",
    mainIdea: {
      correct: "Coral reefs support disproportionate marine biodiversity but are vulnerable to temperature-driven bleaching.",
      wrong: [
        "Coral reefs cover most of the ocean floor and are resistant to environmental change.",
        "Algae are more important to ocean ecosystems than coral reefs are.",
        "Marine biologists have found a permanent solution to coral bleaching.",
      ],
    },
    purpose: {
      correct: "to explain why coral reefs are ecologically significant and environmentally vulnerable",
      wrong: [
        "to persuade readers to stop eating seafood",
        "to entertain readers with a fictional story about the ocean",
        "to argue that coral reefs are no longer worth protecting",
      ],
    },
    vocab: {
      word: "disproportionate",
      correctMeaning: "out of proportion; unusually large relative to some other measure",
      wrongMeanings: ["evenly distributed", "temporary and short-lived", "scientifically unproven"],
    },
    inference: {
      question: "Based on the passage, what can be inferred about the purpose of constant reef temperature monitoring?",
      correct: "It is intended to give conservationists a chance to act before bleaching causes permanent damage.",
      wrong: [
        "It is intended to help fishermen locate the best fishing spots.",
        "It is required by international ocean shipping law.",
        "It has already eliminated coral bleaching entirely.",
      ],
    },
    evidence: {
      claim: "that bleaching does not necessarily mean a reef is already dead",
      correctQuote: "A bleached reef is not immediately dead, but it is severely weakened",
      wrongQuotes: [
        "Coral reefs occupy less than one percent of the ocean floor",
        "Marine biologists now monitor reef temperatures constantly",
        "This disproportionate richness arises because coral structures create countless nooks",
      ],
    },
  },
  {
    id: "printing-press",
    genre: "history",
    text: "When Johannes Gutenberg introduced the movable-type printing press in the 1400s, few people anticipated how thoroughly it would reshape European society. Before the press, books were copied by hand, a slow process that kept literacy the privilege of a small elite. Within decades, printed pamphlets, religious texts, and scientific treatises circulated at a pace no scribe could match. Ideas that once traveled from town to town over months now spread across a continent in a matter of years. Some historians argue that the printing press did not merely spread existing ideas faster; it fundamentally changed how people thought about knowledge itself, encouraging the belief that information should be shared widely rather than guarded closely.",
    mainIdea: {
      correct: "The printing press accelerated the spread of ideas and changed European attitudes toward knowledge.",
      wrong: [
        "Gutenberg was the first person in history to write a book.",
        "Handwritten books were more accurate than printed ones.",
        "The printing press had little effect on literacy rates.",
      ],
    },
    purpose: {
      correct: "to describe the historical impact of the printing press on the spread of knowledge",
      wrong: [
        "to criticize Gutenberg for his business practices",
        "to provide instructions for building a printing press",
        "to compare printing presses across different countries today",
      ],
    },
    vocab: {
      word: "elite",
      correctMeaning: "a select group considered superior in status or privilege",
      wrongMeanings: ["a common laborer", "a type of ancient manuscript", "a printing technique"],
    },
    inference: {
      question: "What does the passage suggest about the relationship between technology and social change?",
      correct: "A new technology can alter not just how information spreads but how people value that information.",
      wrong: [
        "Technology has never influenced how societies value information.",
        "Only religious texts benefited from the printing press.",
        "Literacy rates declined after the printing press was introduced.",
      ],
    },
    evidence: {
      claim: "that the printing press changed beliefs about knowledge, not just its speed of distribution",
      correctQuote: "it fundamentally changed how people thought about knowledge itself",
      wrongQuotes: [
        "Before the press, books were copied by hand",
        "printed pamphlets, religious texts, and scientific treatises circulated at a pace no scribe could match",
        "few people anticipated how thoroughly it would reshape European society",
      ],
    },
  },
  {
    id: "urban-parks",
    genre: "social science",
    text: "City planners have increasingly turned to urban parks not merely as recreational amenities but as tools for public health. Studies conducted across several metropolitan areas have found that residents living within a ten-minute walk of a park report lower stress levels and higher rates of physical activity than those without similar access. Parks also moderate local temperatures, since trees and grass absorb heat that pavement and concrete would otherwise radiate back into the air. Critics point out, however, that park placement has historically favored wealthier neighborhoods, leaving lower-income residents with less green space and, consequently, fewer of these health benefits.",
    mainIdea: {
      correct: "Urban parks provide measurable public health benefits, but access to them is unevenly distributed.",
      wrong: [
        "Urban parks are primarily used for large public events.",
        "Wealthy neighborhoods do not need public parks.",
        "Trees have no effect on urban temperatures.",
      ],
    },
    purpose: {
      correct: "to inform readers about the public health value and unequal distribution of urban parks",
      wrong: [
        "to persuade readers to move to a different city",
        "to entertain readers with a personal story about a park visit",
        "to argue that all city parks should be closed",
      ],
    },
    vocab: {
      word: "amenities",
      correctMeaning: "features that provide comfort or convenience",
      wrongMeanings: ["financial penalties", "construction materials", "government regulations"],
    },
    inference: {
      question: "What can be inferred about the experience of a lower-income resident living far from a park?",
      correct: "They likely receive fewer of the stress-reducing and activity-related benefits described in the passage.",
      wrong: [
        "They are guaranteed to have worse physical health than any park resident.",
        "They will automatically be relocated near a park by city planners.",
        "They experience the same average temperatures as park-adjacent residents.",
      ],
    },
    evidence: {
      claim: "that access to parks is not distributed equally across income levels",
      correctQuote: "park placement has historically favored wealthier neighborhoods",
      wrongQuotes: [
        "Parks also moderate local temperatures",
        "City planners have increasingly turned to urban parks",
        "residents living within a ten-minute walk of a park report lower stress levels",
      ],
    },
  },
  {
    id: "octopus-intelligence",
    genre: "science",
    text: "Octopuses possess a strikingly different kind of intelligence from that of mammals, distributed largely through their arms rather than concentrated solely in a central brain. More than half of an octopus's neurons reside outside its brain, embedded within its eight limbs, allowing each arm to process sensory information and even solve simple problems semi-independently. This decentralized arrangement lets an octopus explore a crevice with one arm while simultaneously fleeing a predator with the others. Researchers studying octopus behavior in laboratory settings have documented individuals opening jars, navigating mazes, and, in a few notable cases, appearing to recognize specific human caretakers.",
    mainIdea: {
      correct: "Octopus intelligence is unusually decentralized, with much of it distributed across their arms.",
      wrong: [
        "Octopuses have no ability to solve problems at all.",
        "Octopus arms function only for swimming.",
        "All mammals share the same decentralized nervous system as octopuses.",
      ],
    },
    purpose: {
      correct: "to describe the unusual, decentralized nature of octopus intelligence",
      wrong: [
        "to persuade readers to avoid studying octopuses",
        "to compare octopus cooking methods across cultures",
        "to criticize laboratory research on animals",
      ],
    },
    vocab: {
      word: "decentralized",
      correctMeaning: "spread out rather than controlled from a single central point",
      wrongMeanings: ["completely disorganized", "located only in the brain", "artificially created"],
    },
    inference: {
      question: "What can be inferred about why an octopus can perform two different tasks with different arms at once?",
      correct: "Each arm can process information somewhat independently, without waiting for instructions from the brain.",
      wrong: [
        "Octopus arms are not actually connected to the nervous system.",
        "The octopus brain sends identical instructions to every arm.",
        "Only one arm at a time can ever be active.",
      ],
    },
    evidence: {
      claim: "that an octopus's arms can operate somewhat independently of each other",
      correctQuote: "an octopus to explore a crevice with one arm while simultaneously fleeing a predator with the others",
      wrongQuotes: [
        "More than half of an octopus's neurons reside outside its brain",
        "Researchers studying octopus behavior in laboratory settings have documented individuals opening jars",
        "Octopuses possess a strikingly different kind of intelligence from that of mammals",
      ],
    },
  },
  {
    id: "silk-road",
    genre: "history",
    text: "The network of trade routes historians call the Silk Road was never a single road at all, but a shifting web of paths connecting East Asia to the Mediterranean over roughly two thousand years. Merchants carried silk westward and brought back glassware, spices, and precious metals, but the routes transmitted far more than goods. Buddhist monks, Islamic scholars, and Christian missionaries all traveled these paths, and with them came religious texts, medical knowledge, and artistic techniques that blended in unpredictable ways as they moved from oasis town to oasis town. Some scholars now prefer the term Silk Roads, plural, to emphasize that no single route dominated the exchange.",
    mainIdea: {
      correct: "The Silk Road was a complex network that spread not only goods but also ideas, religion, and knowledge.",
      wrong: [
        "The Silk Road was a single, permanent highway built by one empire.",
        "The Silk Road only carried silk and no other goods.",
        "Religious ideas never spread along Silk Road trade routes.",
      ],
    },
    purpose: {
      correct: "to explain the complexity and cultural significance of Silk Road trade networks",
      wrong: [
        "to argue that trade routes should be abolished",
        "to provide a step-by-step travel guide for modern tourists",
        "to entertain with a fictional tale of a silk merchant",
      ],
    },
    vocab: {
      word: "transmitted",
      correctMeaning: "passed along or communicated from one place or person to another",
      wrongMeanings: ["permanently destroyed", "kept completely secret", "physically weighed"],
    },
    inference: {
      question: "Why might some scholars prefer the term 'Silk Roads' over 'Silk Road'?",
      correct: "Because the trade network consisted of many different paths rather than one fixed route.",
      wrong: [
        "Because silk was not actually traded along these paths.",
        "Because the network existed for less than a decade.",
        "Because only one country controlled all the routes.",
      ],
    },
    evidence: {
      claim: "that the Silk Road carried culture and ideas in addition to physical goods",
      correctQuote: "came religious texts, medical knowledge, and artistic techniques that blended in unpredictable ways",
      wrongQuotes: [
        "Merchants carried silk westward and brought back glassware, spices, and precious metals",
        "connecting East Asia to the Mediterranean over roughly two thousand years",
        "no single route dominated the exchange",
      ],
    },
  },
  {
    id: "sleep-memory",
    genre: "science",
    text: "Sleep researchers have long suspected that sleep plays an active role in memory formation, and recent studies using brain imaging have begun to reveal how. During deep sleep, the brain appears to replay patterns of neural activity that occurred earlier during waking learning, effectively rehearsing the day's experiences at high speed. This replay seems to strengthen connections between neurons associated with important information while allowing less relevant details to fade. Sleep deprivation, by contrast, has been shown to impair this consolidation process, which may explain why students who study through the night often perform worse on exams than those who sleep normally beforehand.",
    mainIdea: {
      correct: "Sleep actively strengthens memories through neural replay, and losing sleep disrupts this process.",
      wrong: [
        "Sleep has no measurable effect on memory formation.",
        "Studying through the night is scientifically proven to improve exam performance.",
        "Neural replay only occurs while a person is awake.",
      ],
    },
    purpose: {
      correct: "to explain recent scientific findings about how sleep supports memory consolidation",
      wrong: [
        "to persuade readers to stop studying altogether",
        "to entertain readers with a dream narrative",
        "to criticize brain imaging technology",
      ],
    },
    vocab: {
      word: "consolidation",
      correctMeaning: "the process of making something more solid or stable",
      wrongMeanings: ["the process of forgetting information", "a type of brain injury", "a sleep disorder"],
    },
    inference: {
      question: "What does the passage suggest is a likely consequence of pulling an all-nighter before an exam?",
      correct: "Impaired memory consolidation could lead to weaker recall of studied material.",
      wrong: [
        "Memory will be permanently and irreversibly destroyed.",
        "Exam performance will definitely improve due to extra study time.",
        "The brain will stop replaying any neural activity forever.",
      ],
    },
    evidence: {
      claim: "that losing sleep interferes with how well memories are retained",
      correctQuote: "Sleep deprivation, by contrast, has been shown to impair this consolidation process",
      wrongQuotes: [
        "brain imaging have begun to reveal how",
        "effectively rehearsing the day's experiences at high speed",
        "Sleep researchers have long suspected that sleep plays an active role in memory formation",
      ],
    },
  },
  {
    id: "microloans",
    genre: "economics",
    text: "Microloan programs, which extend small amounts of credit to entrepreneurs who lack access to traditional banking, were once hailed as a near-universal solution to poverty. Early studies reported that recipients used loans to start small businesses, generating income that lifted their households above subsistence level. More recent, larger-scale research has complicated this picture, finding that while microloans do help some borrowers, the average effect on income and long-term poverty reduction is considerably smaller than early advocates claimed. Economists now generally view microloans as one useful tool among many, rather than a singular remedy for global poverty.",
    mainIdea: {
      correct: "Microloans provide modest, uneven benefits and are best viewed as one tool among many for reducing poverty.",
      wrong: [
        "Microloans have completely eliminated global poverty.",
        "Microloans have never helped any borrower start a business.",
        "Traditional banks always outperform microloan programs.",
      ],
    },
    purpose: {
      correct: "to present a more nuanced, updated view of microloan programs' effectiveness",
      wrong: [
        "to persuade readers to invest all their savings in microloans",
        "to entertain readers with a success story about one entrepreneur",
        "to argue that all economic research is unreliable",
      ],
    },
    vocab: {
      word: "subsistence",
      correctMeaning: "the minimum level of resources needed to survive",
      wrongMeanings: ["extreme wealth and luxury", "a form of government taxation", "a type of loan interest rate"],
    },
    inference: {
      question: "What does the passage imply about early claims regarding microloans?",
      correct: "They likely overstated how much microloans could reduce poverty on average.",
      wrong: [
        "They were later proven to be completely accurate by all subsequent research.",
        "They focused exclusively on large corporations rather than entrepreneurs.",
        "They predicted microloans would fail entirely.",
      ],
    },
    evidence: {
      claim: "that newer research shows a smaller effect than earlier studies suggested",
      correctQuote: "the average effect on income and long-term poverty reduction is considerably smaller than early advocates claimed",
      wrongQuotes: [
        "Early studies reported that recipients used loans to start small businesses",
        "extend small amounts of credit to entrepreneurs who lack access to traditional banking",
        "Economists now generally view microloans as one useful tool among many",
      ],
    },
  },
  {
    id: "migratory-birds",
    genre: "science",
    text: "Every autumn, millions of songbirds abandon their northern breeding grounds and travel thousands of miles to wintering territories, guided by a combination of senses scientists are only beginning to understand. Some species appear to detect the Earth's magnetic field through specialized proteins in their eyes, essentially allowing them to see magnetic orientation as a visual overlay. Others rely on the position of the setting sun or the pattern of stars to maintain a consistent heading across open ocean, where no landmarks exist. Remarkably, many young birds complete this journey correctly on their very first attempt, without ever having traveled the route before or following an experienced adult.",
    mainIdea: {
      correct: "Migratory birds rely on multiple, still not fully understood senses to navigate long journeys, even on their first attempt.",
      wrong: [
        "All migratory birds rely exclusively on following older birds.",
        "Birds migrate only during the spring season.",
        "Scientists fully understand every aspect of bird navigation.",
      ],
    },
    purpose: {
      correct: "to describe the remarkable and still-mysterious navigational abilities of migratory birds",
      wrong: [
        "to persuade readers to build birdhouses",
        "to argue that bird migration should be studied less",
        "to entertain with a fictional story about a lost bird",
      ],
    },
    vocab: {
      word: "overlay",
      correctMeaning: "an additional layer of information placed over an existing view",
      wrongMeanings: ["a type of bird feather", "a navigational error", "a seasonal migration pattern"],
    },
    inference: {
      question: "What does the fact that young birds migrate correctly on their first attempt suggest?",
      correct: "At least some migratory navigation ability may be innate rather than learned from experience.",
      wrong: [
        "Young birds always get lost during their first migration.",
        "Bird migration is entirely random and has no fixed destination.",
        "Only adult birds are capable of sensing magnetic fields.",
      ],
    },
    evidence: {
      claim: "that some young birds navigate successfully without prior experience or guidance",
      correctQuote: "many young birds complete this journey correctly on their very first attempt, without ever having traveled the route before",
      wrongQuotes: [
        "Some species appear to detect the Earth's magnetic field through specialized proteins in their eyes",
        "Others rely on the position of the setting sun",
        "millions of songbirds abandon their northern breeding grounds",
      ],
    },
  },
  {
    id: "public-libraries",
    genre: "social science",
    text: "Public libraries are often described narrowly as places to borrow books, but contemporary research on their social role suggests something broader. In many communities, libraries function as one of the few remaining indoor spaces that anyone can enter without being expected to purchase something. This makes them de facto community centers, particularly for older adults seeking social contact, students needing quiet study space, and job seekers who need free internet access to submit applications. Library staff increasingly report that their responsibilities extend well beyond cataloging books, including help navigating government forms and, in some cities, connecting patrons with social services.",
    mainIdea: {
      correct: "Public libraries have evolved into essential community spaces that serve social functions well beyond lending books.",
      wrong: [
        "Public libraries are used exclusively for borrowing books.",
        "Library staff refuse to help patrons with anything other than books.",
        "Libraries are declining in importance as community spaces.",
      ],
    },
    purpose: {
      correct: "to highlight the expanded social role that public libraries play in their communities",
      wrong: [
        "to persuade readers to donate books to libraries",
        "to criticize library staff for poor customer service",
        "to entertain readers with a story about a librarian",
      ],
    },
    vocab: {
      word: "de facto",
      correctMeaning: "existing in fact, even if not formally recognized as such",
      wrongMeanings: ["illegal or against regulations", "temporary and about to end", "extremely expensive"],
    },
    inference: {
      question: "What can be inferred about why libraries are important to job seekers specifically?",
      correct: "Free internet access at libraries may be one of the only ways some job seekers can submit applications.",
      wrong: [
        "Libraries provide direct cash payments to job seekers.",
        "Job seekers are legally required to visit libraries before applying to jobs.",
        "Libraries no longer offer any internet access.",
      ],
    },
    evidence: {
      claim: "that libraries serve people beyond those simply looking to borrow books",
      correctQuote: "particularly for older adults seeking social contact, students needing quiet study space, and job seekers who need free internet access",
      wrongQuotes: [
        "Public libraries are often described narrowly as places to borrow books",
        "Library staff increasingly report that their responsibilities extend well beyond cataloging books",
        "libraries function as one of the few remaining indoor spaces",
      ],
    },
  },
  {
    id: "volcanic-soil",
    genre: "science",
    text: "Farmers near active volcanoes face an obvious hazard, yet many choose to remain because volcanic soil is often exceptionally fertile. Ash deposited by eruptions is rich in minerals like potassium and phosphorus, nutrients that many crops depend on but that ordinary soil gradually depletes over repeated growing seasons. Over years, weathering breaks the ash down further, releasing these minerals slowly and steadily rather than all at once. This is why regions such as parts of Indonesia and Italy, despite significant volcanic risk, support some of the most productive farmland in their respective countries. The tradeoff between danger and fertility has shaped settlement patterns near volcanoes for centuries.",
    mainIdea: {
      correct: "Volcanic soil's exceptional fertility explains why many farmers accept the risks of living near active volcanoes.",
      wrong: [
        "Volcanic soil is generally less fertile than ordinary farmland.",
        "No farmers choose to live near active volcanoes.",
        "Volcanic ash contains no useful minerals for crops.",
      ],
    },
    purpose: {
      correct: "to explain why farmers accept volcanic risk in exchange for fertile soil",
      wrong: [
        "to persuade readers to relocate near volcanoes",
        "to argue that volcanic eruptions should be prevented entirely",
        "to entertain with a fictional account of a volcanic eruption",
      ],
    },
    vocab: {
      word: "depletes",
      correctMeaning: "gradually reduces or uses up a supply of something",
      wrongMeanings: ["rapidly increases", "chemically purifies", "physically hardens"],
    },
    inference: {
      question: "What can be inferred about ordinary, non-volcanic farmland over many growing seasons?",
      correct: "It tends to lose key nutrients over time unless they are replenished some other way.",
      wrong: [
        "It automatically becomes as fertile as volcanic soil.",
        "It gains potassium and phosphorus without any external source.",
        "It cannot be used for farming at all.",
      ],
    },
    evidence: {
      claim: "that volcanic ash releases its nutrients gradually rather than immediately",
      correctQuote: "weathering breaks the ash down further, releasing these minerals slowly and steadily rather than all at once",
      wrongQuotes: [
        "Farmers near active volcanoes face an obvious hazard",
        "regions such as parts of Indonesia and Italy... support some of the most productive farmland",
        "The tradeoff between danger and fertility has shaped settlement patterns",
      ],
    },
  },
  {
    id: "ancient-libraries",
    genre: "history",
    text: "The Library of Alexandria, founded in Egypt around the third century BCE, is often remembered as the greatest repository of knowledge in the ancient world, though much about it remains uncertain due to sparse surviving records. According to various ancient accounts, the library's scholars attempted to collect a copy of every book in existence, sometimes reportedly confiscating scrolls from ships docked in Alexandria's harbor to copy them before returning the originals. Its eventual decline was gradual rather than a single catastrophic event, likely caused by a combination of funding cuts, political instability, and small fires over centuries rather than the singular dramatic destruction often depicted in popular retellings.",
    mainIdea: {
      correct: "The Library of Alexandria's decline was a gradual process shaped by multiple factors, not a single dramatic event.",
      wrong: [
        "The Library of Alexandria was destroyed in a single fire in one afternoon.",
        "The Library of Alexandria never actually existed.",
        "Ancient records provide complete certainty about every detail of the library's history.",
      ],
    },
    purpose: {
      correct: "to correct a popular misconception about how the Library of Alexandria declined",
      wrong: [
        "to persuade readers to visit modern Alexandria",
        "to entertain readers with an invented myth",
        "to argue that libraries are no longer necessary today",
      ],
    },
    vocab: {
      word: "repository",
      correctMeaning: "a place where things are stored or kept",
      wrongMeanings: ["a type of ancient currency", "a military fortification", "a religious ceremony"],
    },
    inference: {
      question: "What does the passage suggest about popular stories describing the library's destruction?",
      correct: "They likely oversimplify a more gradual, complicated historical decline.",
      wrong: [
        "They are entirely and precisely accurate according to the passage.",
        "They were written by the library's original scholars.",
        "They describe events that happened after the library had already been rebuilt.",
      ],
    },
    evidence: {
      claim: "that the library's downfall happened over a long period rather than all at once",
      correctQuote: "likely caused by a combination of funding cuts, political instability, and small fires over centuries",
      wrongQuotes: [
        "founded in Egypt around the third century BCE",
        "scholars attempted to collect a copy of every book in existence",
        "reportedly confiscating scrolls from ships docked in Alexandria's harbor",
      ],
    },
  },
  {
    id: "placebo-effect",
    genre: "science",
    text: "The placebo effect, in which patients experience real symptom improvement after receiving an inactive treatment, has long puzzled medical researchers precisely because the improvement is not imaginary. Brain scans of patients given placebo painkillers show genuine reductions in activity within pain-processing regions, comparable in some cases to reductions seen with actual medication. Researchers now believe expectation itself can trigger the release of the body's own pain-relieving chemicals. This has complicated the design of clinical drug trials, since researchers must work harder to distinguish a medication's true effect from the effect of simply believing one is being treated.",
    mainIdea: {
      correct: "The placebo effect produces measurable physical changes, complicating how researchers test new medications.",
      wrong: [
        "The placebo effect is purely imaginary and produces no physical changes.",
        "Placebo painkillers work better than all real medications.",
        "Clinical drug trials no longer need to account for the placebo effect.",
      ],
    },
    purpose: {
      correct: "to explain how the placebo effect complicates medical research",
      wrong: [
        "to persuade readers to stop taking prescribed medication",
        "to entertain readers with an anecdote about a doctor",
        "to criticize all pharmaceutical companies",
      ],
    },
    vocab: {
      word: "comparable",
      correctMeaning: "similar enough to be reasonably compared",
      wrongMeanings: ["completely unrelated", "scientifically impossible", "financially expensive"],
    },
    inference: {
      question: "What does the passage suggest is a key challenge for clinical drug trial designers?",
      correct: "Separating the effects of an actual drug from the effects of a patient's expectations.",
      wrong: [
        "Finding patients willing to participate in any trial at all.",
        "Preventing patients from ever learning what medication they received.",
        "Eliminating the placebo effect entirely from human biology.",
      ],
    },
    evidence: {
      claim: "that placebo treatments cause real, measurable changes in the brain",
      correctQuote: "Brain scans of patients given placebo painkillers show genuine reductions in activity within pain-processing regions",
      wrongQuotes: [
        "has long puzzled medical researchers precisely because the improvement is not imaginary",
        "researchers must work harder to distinguish a medication's true effect",
        "Researchers now believe expectation itself can trigger the release",
      ],
    },
  },
  {
    id: "renewable-grid",
    genre: "science",
    text: "As solar and wind power supply a growing share of electricity grids worldwide, engineers face a challenge these sources share: their output fluctuates with weather and time of day in ways that traditional power plants do not. A cloudy afternoon or a still evening can cause generation to drop sharply just as demand remains steady or rises. Grid operators have responded with a mix of solutions, including large-scale batteries that store excess energy for use during lulls, and improved forecasting models that predict generation dips hours in advance. Some regions have also begun linking grids across wider geographic areas, on the theory that it is rarely windless or cloudy everywhere at once.",
    mainIdea: {
      correct: "Engineers are developing multiple strategies to manage the variability of renewable energy sources.",
      wrong: [
        "Renewable energy sources produce a perfectly constant supply of electricity.",
        "Grid operators have abandoned solar and wind power entirely.",
        "Batteries have completely solved the variability problem with no other solutions needed.",
      ],
    },
    purpose: {
      correct: "to describe the challenges and solutions related to renewable energy variability",
      wrong: [
        "to persuade readers to install solar panels immediately",
        "to argue that renewable energy should be abandoned",
        "to entertain with a story about a power outage",
      ],
    },
    vocab: {
      word: "lulls",
      correctMeaning: "periods of reduced activity or intensity",
      wrongMeanings: ["periods of extreme storm activity", "permanent shutdowns", "financial losses"],
    },
    inference: {
      question: "Why might linking grids across wider geographic areas help address renewable energy variability?",
      correct: "Because weather conditions that reduce generation in one area are unlikely to affect every connected area simultaneously.",
      wrong: [
        "Because it eliminates the need for any electricity storage.",
        "Because wider grids automatically produce more sunlight.",
        "Because it guarantees demand will decrease everywhere at once.",
      ],
    },
    evidence: {
      claim: "that connecting grids over larger areas can reduce the impact of local weather changes",
      correctQuote: "it is rarely windless or cloudy everywhere at once",
      wrongQuotes: [
        "A cloudy afternoon or a still evening can cause generation to drop sharply",
        "large-scale batteries that store excess energy for use during lulls",
        "improved forecasting models that predict generation dips hours in advance",
      ],
    },
  },
  {
    id: "child-language",
    genre: "psychology",
    text: "Children acquire the grammar of their native language with startling speed, often producing correct sentence structures well before they can explain any rule behind them. Linguists have long debated why this happens so consistently across unrelated languages and cultures. One influential view holds that children are born with an innate cognitive framework that predisposes them to detect grammatical patterns, requiring only limited exposure to activate it. Critics of this view argue instead that children learn grammar the same way they learn anything else: by noticing statistical patterns in the speech they hear repeated around them. Both camps agree, however, that the process is largely complete by early elementary school, long before formal grammar instruction typically begins.",
    mainIdea: {
      correct: "Researchers disagree about why children learn grammar so quickly, though all agree it happens early and without formal instruction.",
      wrong: [
        "Children learn grammar only after starting formal schooling.",
        "All linguists completely agree on why children acquire grammar quickly.",
        "Children cannot learn grammar without explicit rule instruction.",
      ],
    },
    purpose: {
      correct: "to explain competing theories about how children acquire grammar so quickly",
      wrong: [
        "to persuade parents to teach grammar rules to infants",
        "to entertain readers with a story about a specific child",
        "to argue that grammar instruction in schools should be eliminated",
      ],
    },
    vocab: {
      word: "predisposes",
      correctMeaning: "makes someone more likely to behave or develop in a particular way",
      wrongMeanings: ["completely prevents", "financially rewards", "permanently damages"],
    },
    inference: {
      question: "What do both theories described in the passage have in common?",
      correct: "They both attempt to explain why grammar acquisition happens quickly without necessarily requiring formal teaching.",
      wrong: [
        "They both claim grammar is learned only through formal classroom instruction.",
        "They both deny that children learn grammar at all.",
        "They both agree that grammar is entirely random and unpredictable.",
      ],
    },
    evidence: {
      claim: "that children develop grammatical ability before receiving formal instruction",
      correctQuote: "the process is largely complete by early elementary school, long before formal grammar instruction typically begins",
      wrongQuotes: [
        "children are born with an innate cognitive framework",
        "children learn grammar the same way they learn anything else",
        "Linguists have long debated why this happens so consistently",
      ],
    },
  },
  {
    id: "food-deserts",
    genre: "social science",
    text: "The term food desert describes a neighborhood where residents have limited access to affordable, nutritious food, often because the nearest full-service grocery store is miles away and reliable transportation is scarce. Convenience stores may fill the gap, but they typically stock processed, shelf-stable items rather than fresh produce. Public health researchers have connected living in a food desert with higher rates of diet-related illness, though they are careful to note that distance to a grocery store is only one factor among many, including income, food prices, and personal health knowledge. Some cities have experimented with subsidizing grocery stores willing to open in underserved neighborhoods, with mixed but occasionally promising results.",
    mainIdea: {
      correct: "Food deserts limit access to nutritious food and are linked to health problems, though the causes are complex.",
      wrong: [
        "Food deserts have no connection to public health outcomes.",
        "Convenience stores are an adequate substitute for full grocery stores.",
        "Every city has successfully eliminated its food deserts.",
      ],
    },
    purpose: {
      correct: "to explain the concept of food deserts and their complicated relationship to public health",
      wrong: [
        "to persuade readers to open their own grocery store",
        "to entertain readers with a fictional account of a shopping trip",
        "to argue that grocery stores should never receive subsidies",
      ],
    },
    vocab: {
      word: "underserved",
      correctMeaning: "not receiving adequate services or resources",
      wrongMeanings: ["overly wealthy", "densely populated only by choice", "legally restricted from services"],
    },
    inference: {
      question: "What does the passage suggest about the relationship between food deserts and diet-related illness?",
      correct: "The relationship is real but not the only factor; other elements like income also matter.",
      wrong: [
        "Food deserts are the sole cause of all diet-related illness.",
        "There is no connection at all between the two according to researchers.",
        "Diet-related illness only occurs in wealthy neighborhoods.",
      ],
    },
    evidence: {
      claim: "that distance from a grocery store is not the only cause of diet-related health problems",
      correctQuote: "distance to a grocery store is only one factor among many, including income, food prices, and personal health knowledge",
      wrongQuotes: [
        "Convenience stores may fill the gap",
        "Some cities have experimented with subsidizing grocery stores",
        "researchers have connected living in a food desert with higher rates of diet-related illness",
      ],
    },
  },
  {
    id: "invasive-species",
    genre: "science",
    text: "When a species is introduced to an ecosystem where it did not evolve, the results are notoriously difficult to predict. Some introduced species integrate harmlessly, while others become invasive, spreading rapidly because local predators, parasites, and diseases that would normally control their population are absent. The zebra mussel, accidentally introduced to North American waterways in the late 1980s via ship ballast water, is a frequently cited example: it now clogs water intake pipes and outcompetes native mussel species for food, costing municipalities millions of dollars annually in cleanup and prevention. Efforts to eradicate established invasive species are rarely successful; most management programs instead focus on slowing their spread to new areas.",
    mainIdea: {
      correct: "Invasive species can spread uncontrollably in new ecosystems, causing ecological and economic harm that is difficult to reverse.",
      wrong: [
        "All introduced species become harmful invasive species.",
        "Zebra mussels were intentionally introduced to help clean water.",
        "Invasive species management programs always succeed at complete eradication.",
      ],
    },
    purpose: {
      correct: "to explain why some introduced species become destructive and hard to control",
      wrong: [
        "to persuade readers to keep zebra mussels as pets",
        "to entertain readers with a story about ship travel",
        "to argue that all non-native species should be immediately imported",
      ],
    },
    vocab: {
      word: "eradicate",
      correctMeaning: "to eliminate completely",
      wrongMeanings: ["to introduce gradually", "to study scientifically", "to relocate temporarily"],
    },
    inference: {
      question: "What does the passage suggest about why zebra mussels spread so successfully?",
      correct: "The ecosystem they were introduced to lacked natural predators or controls to limit their population.",
      wrong: [
        "Zebra mussels are immune to all forms of water.",
        "Municipalities intentionally spread zebra mussels for profit.",
        "Zebra mussels cannot survive in North American waterways.",
      ],
    },
    evidence: {
      claim: "that fully eliminating an established invasive species is uncommon",
      correctQuote: "Efforts to eradicate established invasive species are rarely successful",
      wrongQuotes: [
        "costing municipalities millions of dollars annually in cleanup and prevention",
        "accidentally introduced to North American waterways in the late 1980s via ship ballast water",
        "outcompetes native mussel species for food",
      ],
    },
  },
  {
    id: "impressionist-painting",
    genre: "art",
    text: "When Impressionist painters first exhibited their work in Paris in 1874, critics dismissed the loose brushwork and unusual color choices as unfinished sketches rather than serious art. The painters, including Claude Monet and Berthe Morisot, had deliberately abandoned the smooth, precise finish favored by the era's official art academy, choosing instead to capture the fleeting quality of light as it changed throughout the day. This approach required painting quickly, often outdoors, rather than slowly composing a scene in a studio. What initially struck audiences as careless technique gradually came to be recognized as a deliberate and influential innovation, one that shaped the direction of Western painting for decades afterward.",
    mainIdea: {
      correct: "Impressionist painting was initially dismissed as unfinished but was later recognized as a deliberate, influential technique.",
      wrong: [
        "Impressionist painters were praised immediately upon their first exhibition.",
        "Impressionism had no lasting influence on Western art.",
        "Claude Monet and Berthe Morisot painted only in studios.",
      ],
    },
    purpose: {
      correct: "to describe how Impressionism's reception changed from criticism to recognition over time",
      wrong: [
        "to persuade readers to purchase Impressionist paintings",
        "to entertain readers with a fictional story about an artist",
        "to argue that all modern art is inferior to Impressionism",
      ],
    },
    vocab: {
      word: "fleeting",
      correctMeaning: "lasting only a brief time",
      wrongMeanings: ["permanent and unchanging", "extremely bright", "artificially created"],
    },
    inference: {
      question: "What does the passage suggest motivated Impressionist painters to work quickly and outdoors?",
      correct: "They wanted to capture how light changed in the moment, which required speed rather than careful studio composition.",
      wrong: [
        "They were required by the official art academy to paint outdoors.",
        "They had no access to indoor studio space at all.",
        "They believed slow, precise painting captured light better.",
      ],
    },
    evidence: {
      claim: "that critical opinion of Impressionism shifted significantly over time",
      correctQuote: "What initially struck audiences as careless technique gradually came to be recognized as a deliberate and influential innovation",
      wrongQuotes: [
        "critics dismissed the loose brushwork and unusual color choices as unfinished sketches",
        "choosing instead to capture the fleeting quality of light",
        "This approach required painting quickly, often outdoors",
      ],
    },
  },
  {
    id: "antibiotic-resistance",
    genre: "science",
    text: "Antibiotic resistance develops through a straightforward evolutionary process: whenever an antibiotic is used, it kills most of the targeted bacteria, but a small number carrying random mutations that confer resistance may survive and reproduce. Over repeated exposures, resistant bacteria come to dominate the population, rendering the original antibiotic ineffective. This dynamic accelerates whenever antibiotics are overprescribed for illnesses they cannot treat, such as viral infections, or when patients stop a course of antibiotics early, leaving behind precisely the hardier bacteria most likely to develop full resistance. Public health officials increasingly describe antibiotic resistance as a slow-moving crisis, since the pipeline of new antibiotics has not kept pace with the rate at which existing ones lose effectiveness.",
    mainIdea: {
      correct: "Antibiotic resistance arises through natural selection and is worsened by misuse, creating a growing public health concern.",
      wrong: [
        "Antibiotic resistance occurs randomly and has no connection to how antibiotics are used.",
        "New antibiotics are being developed faster than resistance can spread.",
        "Viral infections are effectively treated by antibiotics.",
      ],
    },
    purpose: {
      correct: "to explain the biological process behind antibiotic resistance and why it is a growing concern",
      wrong: [
        "to persuade readers to take antibiotics whenever they feel sick",
        "to entertain readers with a story about a hospital",
        "to argue that antibiotics should never be used",
      ],
    },
    vocab: {
      word: "confer",
      correctMeaning: "to grant or give a particular quality to someone or something",
      wrongMeanings: ["to permanently remove", "to financially charge", "to secretly hide"],
    },
    inference: {
      question: "What does the passage suggest happens when a patient stops taking antibiotics early?",
      correct: "The most resistant bacteria, which are hardest to kill, are more likely to survive and multiply.",
      wrong: [
        "All remaining bacteria are guaranteed to die immediately.",
        "The infection is guaranteed to be cured regardless.",
        "Antibiotic resistance becomes permanently impossible.",
      ],
    },
    evidence: {
      claim: "that incomplete courses of antibiotics can promote resistance",
      correctQuote: "when patients stop a course of antibiotics early, leaving behind precisely the hardier bacteria most likely to develop full resistance",
      wrongQuotes: [
        "it kills most of the targeted bacteria",
        "the pipeline of new antibiotics has not kept pace",
        "antibiotics are overprescribed for illnesses they cannot treat",
      ],
    },
  },
  {
    id: "remote-work",
    genre: "economics",
    text: "The rapid shift toward remote work prompted by the early 2020s pandemic has proven more durable than many economists initially expected. Surveys conducted years afterward continued to find that a substantial share of employees in office-based industries worked from home at least part of the week, a pattern some researchers now call hybrid work rather than a temporary anomaly. This shift has had uneven effects: commercial real estate in some downtown business districts has struggled as office demand fell, while suburban and small-town economies have seen modest gains as remote workers relocated away from expensive city centers. Economists remain divided on whether hybrid work ultimately increases or decreases overall worker productivity.",
    mainIdea: {
      correct: "Remote and hybrid work has persisted long-term, reshaping local economies in uneven ways.",
      wrong: [
        "Remote work disappeared entirely once the pandemic ended.",
        "All industries have been affected identically by remote work.",
        "Economists universally agree that remote work increases productivity.",
      ],
    },
    purpose: {
      correct: "to describe the lasting economic effects of the shift toward remote and hybrid work",
      wrong: [
        "to persuade readers to quit their office jobs",
        "to entertain readers with a story about working from home",
        "to argue that all workers should return to offices immediately",
      ],
    },
    vocab: {
      word: "anomaly",
      correctMeaning: "something that deviates from what is standard or expected",
      wrongMeanings: ["a permanent legal requirement", "a type of financial investment", "a scheduled holiday"],
    },
    inference: {
      question: "What can be inferred about downtown business districts mentioned in the passage?",
      correct: "They have likely experienced reduced demand for commercial office space due to fewer in-person workers.",
      wrong: [
        "They have seen no economic changes whatsoever.",
        "They have become the primary destination for all remote workers.",
        "They have banned remote work entirely.",
      ],
    },
    evidence: {
      claim: "that experts disagree about how hybrid work affects productivity",
      correctQuote: "Economists remain divided on whether hybrid work ultimately increases or decreases overall worker productivity",
      wrongQuotes: [
        "commercial real estate in some downtown business districts has struggled",
        "suburban and small-town economies have seen modest gains",
        "a pattern some researchers now call hybrid work rather than a temporary anomaly",
      ],
    },
  },
];
