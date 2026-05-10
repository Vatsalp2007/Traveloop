const activities = [
  // ==================== INDIA ====================

  // ----- MUMBAI -----
  { city: "Mumbai", name: "Gateway of India & Heritage Walk", type: "sightseeing", cost: 0, duration: 120, description: "Guided walk through the iconic Gateway of India, Taj Mahal Palace, and colonial-era architecture in the Fort district.", rating: 4.6 },
  { city: "Mumbai", name: "Marine Drive Sunset & Chowpatty Stroll", type: "sightseeing", cost: 0, duration: 90, description: "Walk along the Queen's Necklace at sunset and end at Girgaum Chowpatty beach.", rating: 4.5 },
  { city: "Mumbai", name: "Street Food Crawl in Dadar", type: "food", cost: 10, duration: 120, description: "Sample vada pav, pav bhaji, misal pav, and pani puri from legendary street stalls.", rating: 4.8 },
  { city: "Mumbai", name: "South Mumbai Fine Dining Experience", type: "food", cost: 25, duration: 90, description: "Multi-course meal at a rooftop restaurant overlooking the Arabian Sea.", rating: 4.4 },
  { city: "Mumbai", name: "Elephanta Caves Ferry & Trek", type: "adventure", cost: 15, duration: 240, description: "Ferry ride to Elephanta Island followed by a short trek to ancient rock-cut cave temples.", rating: 4.3 },
  { city: "Mumbai", name: "Sailing Session in Arabian Sea", type: "adventure", cost: 30, duration: 180, description: "Experience sailing along Mumbai's coastline with professional instructors.", rating: 4.2 },
  { city: "Mumbai", name: "Colaba Causeway Bargain Hunt", type: "shopping", cost: 25, duration: 120, description: "Explore the bustling street market for jewelry, antiques, and trendy accessories.", rating: 4.5 },
  { city: "Mumbai", name: "Crawford Market Spree", type: "shopping", cost: 30, duration: 90, description: "Shop for fresh produce, spices, and imported goods at this historic colonial market.", rating: 4.1 },

  // ----- DELHI -----
  { city: "Delhi", name: "Red Fort & Chandni Chowk Heritage Tour", type: "sightseeing", cost: 10, duration: 180, description: "Explore the majestic Red Fort and take a rickshaw ride through the bustling lanes of Old Delhi.", rating: 4.7 },
  { city: "Delhi", name: "Qutub Minar & Mehrauli Archaeological Park", type: "sightseeing", cost: 10, duration: 120, description: "Visit the towering Qutub Minar and wander through the ruins of ancient Delhi.", rating: 4.5 },
  { city: "Delhi", name: "Paranthe Wali Gali Food Walk", type: "food", cost: 8, duration: 60, description: "Feast on stuffed parathas at the legendary street in Chandni Chowk.", rating: 4.7 },
  { city: "Delhi", name: "Butter Chicken Trail at Dhabas", type: "food", cost: 15, duration: 90, description: "Visit iconic Punjabi dhabas serving rich buttery curries and naan bread.", rating: 4.6 },
  { city: "Delhi", name: "Yamuna River Kayaking", type: "adventure", cost: 20, duration: 120, description: "Guided kayaking session on the Yamuna with views of Delhi's historic ghats.", rating: 4.0 },
  { city: "Delhi", name: "Rock Climbing at DDA Climbing Wall", type: "adventure", cost: 15, duration: 90, description: "Indoor rock climbing experience suitable for beginners and intermediates.", rating: 4.1 },
  { city: "Delhi", name: "Sarojini Nagar Market Haul", type: "shopping", cost: 20, duration: 120, description: "Hunt for discounted branded clothing and accessories at this famous flea market.", rating: 4.4 },
  { city: "Delhi", name: "Dilli Haat Handicraft Shopping", type: "shopping", cost: 35, duration: 90, description: "Browse traditional Indian handicrafts, textiles, and regional artifacts from across the country.", rating: 4.3 },

  // ----- BANGALORE -----
  { city: "Bangalore", name: "Lalbagh Botanical Garden Tour", type: "sightseeing", cost: 5, duration: 120, description: "Stroll through the lush 240-acre garden featuring a glass house and ancient trees.", rating: 4.5 },
  { city: "Bangalore", name: "Bangalore Palace & Cubbon Park", type: "sightseeing", cost: 15, duration: 150, description: "Tour the Tudor-style palace then relax in the sprawling Cubbon Park.", rating: 4.3 },
  { city: "Bangalore", name: "Mavalli Tiffin Room Classic Meal", type: "food", cost: 10, duration: 60, description: "Authentic South Indian breakfast at the iconic MTR restaurant.", rating: 4.6 },
  { city: "Bangalore", name: "Craft Beer Trail in Indiranagar", type: "food", cost: 20, duration: 150, description: "Visit top microbreweries sampling hoppy IPAs and sour ales with small bites.", rating: 4.5 },
  { city: "Bangalore", name: "Skandagiri Hills Trek", type: "adventure", cost: 12, duration: 300, description: "Pre-dawn trek to Skandagiri fort peak with breathtaking sunrise views.", rating: 4.4 },
  { city: "Bangalore", name: "Cycling Tour of Nandi Hills", type: "adventure", cost: 18, duration: 240, description: "Guided cycling expedition through scenic countryside to Nandi Hills summit.", rating: 4.3 },
  { city: "Bangalore", name: "Commercial Street Shopping Spree", type: "shopping", cost: 30, duration: 120, description: "Vibrant street market for clothing, footwear, jewelry, and accessories.", rating: 4.2 },
  { city: "Bangalore", name: "Chickpet Silk & Saree Shopping", type: "shopping", cost: 50, duration: 90, description: "Traditional silk market offering Mysore silk sarees and ethnic wear.", rating: 4.0 },

  // ----- HYDERABAD -----
  { city: "Hyderabad", name: "Golconda Fort Light & Sound Show", type: "sightseeing", cost: 10, duration: 150, description: "Explore the massive fort complex and stay for the evening sound and light show.", rating: 4.6 },
  { city: "Hyderabad", name: "Charminar & Laad Bazaar Walk", type: "sightseeing", cost: 5, duration: 120, description: "Tour the iconic Charminar and browse the nearby bangle market.", rating: 4.5 },
  { city: "Hyderabad", name: "Paradise Biryani Feast", type: "food", cost: 15, duration: 60, description: "World-famous Hyderabadi biryani at the legendary Paradise restaurant.", rating: 4.8 },
  { city: "Hyderabad", name: "Irani Chai & Osmania Biscuit Trail", type: "food", cost: 5, duration: 60, description: "Visit old Irani cafes serving sweet chai and the iconic Osmania biscuits.", rating: 4.4 },
  { city: "Hyderabad", name: "Hussain Sagar Jet Skiing", type: "adventure", cost: 25, duration: 60, description: "Jet ski across the scenic Hussain Sagar lake with Buddha statue views.", rating: 4.2 },
  { city: "Hyderabad", name: "Trek to Bhongir Fort", type: "adventure", cost: 10, duration: 240, description: "Challenging rock climbing and trek to the unique egg-shaped Bhongir fort.", rating: 4.3 },
  { city: "Hyderabad", name: "Laad Bazaar Bangle Shopping", type: "shopping", cost: 20, duration: 90, description: "Shop for traditional lac bangles and pearl jewelry near Charminar.", rating: 4.4 },
  { city: "Hyderabad", name: "Forum Mall Premium Shopping", type: "shopping", cost: 60, duration: 120, description: "Modern shopping mall with international brands and luxury goods.", rating: 4.0 },

  // ----- CHENNAI -----
  { city: "Chennai", name: "Marina Beach Sunrise & Walk", type: "sightseeing", cost: 0, duration: 90, description: "Watch the sunrise at the world's second-longest urban beach.", rating: 4.4 },
  { city: "Chennai", name: "Kapaleeshwarar Temple & Mylapore Heritage", type: "sightseeing", cost: 0, duration: 120, description: "Visit the colorful Dravidian temple and explore the historic Mylapore neighborhood.", rating: 4.6 },
  { city: "Chennai", name: "Filter Coffee & Murukku at Mylapore", type: "food", cost: 5, duration: 45, description: "Traditional South Indian filter coffee paired with crispy murukku snacks.", rating: 4.5 },
  { city: "Chennai", name: "Chettinad Lunch at Annapoorna", type: "food", cost: 12, duration: 60, description: "Authentic Chettinad chicken curry, dosa, and sambar at a legendary eatery.", rating: 4.6 },
  { city: "Chennai", name: "Covelong Beach Surfing", type: "adventure", cost: 30, duration: 180, description: "Surfing lessons and wave riding at the popular Covelong beach.", rating: 4.3 },
  { city: "Chennai", name: "Guindy National Park Safari", type: "adventure", cost: 15, duration: 120, description: "Wildlife safari spotting deer, monkeys, and exotic birds within the city.", rating: 4.1 },
  { city: "Chennai", name: "T Nagar Ranganathan Street Shopping", type: "shopping", cost: 30, duration: 150, description: "Famous street market for silk sarees, gold jewelry, and textiles.", rating: 4.3 },
  { city: "Chennai", name: "Pondy Bazaar Bargain Shopping", type: "shopping", cost: 25, duration: 120, description: "Haggle for clothing, accessories, and home decor at this bustling market.", rating: 4.0 },

  // ----- KOLKATA -----
  { city: "Kolkata", name: "Victoria Memorial & Maidan Tour", type: "sightseeing", cost: 10, duration: 150, description: "Explore the stunning marble monument and sprawling green Maidan.", rating: 4.6 },
  { city: "Kolkata", name: "Howrah Bridge & Ganga River Cruise", type: "sightseeing", cost: 8, duration: 90, description: "Cruise under the iconic Howrah Bridge on the Hooghly River.", rating: 4.5 },
  { city: "Kolkata", name: "Kathi Roll Trail at Park Street", type: "food", cost: 8, duration: 60, description: "Sample Kolkata's famous kathi rolls from legendary street-side stalls.", rating: 4.7 },
  { city: "Kolkata", name: "Traditional Bengali Thali at Oh! Calcutta", type: "food", cost: 18, duration: 75, description: "Multi-course Bengali meal featuring fish curry, rasgulla, and mishti doi.", rating: 4.5 },
  { city: "Kolkata", name: "Sunderbans Mangrove Expedition", type: "adventure", cost: 40, duration: 480, description: "Full-day boat safari through the Sunderbans delta spotting Bengal tigers.", rating: 4.4 },
  { city: "Kolkata", name: "Eco Park Kayaking", type: "adventure", cost: 15, duration: 90, description: "Kayak through the waterways of Kolkata's largest urban park.", rating: 4.1 },
  { city: "Kolkata", name: "New Market Heritage Shopping", type: "shopping", cost: 25, duration: 120, description: "Historic colonial market for textiles, jewelry, and leather goods.", rating: 4.3 },
  { city: "Kolkata", name: "Gariahat Market Spree", type: "shopping", cost: 20, duration: 90, description: "Vibrant neighborhood market for Bengali sarees and handcrafted items.", rating: 4.2 },

  // ----- PUNE -----
  { city: "Pune", name: "Shaniwar Wada Fort & Heritage Walk", type: "sightseeing", cost: 5, duration: 120, description: "Tour the historic Maratha fort with intricate carvings and fountains.", rating: 4.5 },
  { city: "Pune", name: "Aga Khan Palace & Gandhi Memorial", type: "sightseeing", cost: 10, duration: 90, description: "Visit the beautiful palace where Mahatma Gandhi was imprisoned.", rating: 4.4 },
  { city: "Pune", name: "Bhakarwadi & Chitale Bandhu Snacks", type: "food", cost: 8, duration: 45, description: "Sample Pune's famous bhakarwadi and chivda at the iconic Chitale Bandhu.", rating: 4.6 },
  { city: "Pune", name: "Camp Area Street Food Walk", type: "food", cost: 10, duration: 90, description: "Explore Irani cafes and street stalls serving bun maska and kebabs.", rating: 4.4 },
  { city: "Pune", name: "Paragliding at Kamshet", type: "adventure", cost: 35, duration: 180, description: "Tandem paragliding over the scenic hills of Kamshet near Pune.", rating: 4.6 },
  { city: "Pune", name: "Sinhagad Fort Trek", type: "adventure", cost: 8, duration: 240, description: "Challenging trek to the historic hill fort with panoramic valley views.", rating: 4.5 },
  { city: "Pune", name: "FC Road Flea Market Shopping", type: "shopping", cost: 20, duration: 90, description: "Student-friendly market with trendy clothes, accessories, and street art.", rating: 4.1 },
  { city: "Pune", name: "Phoenix Marketcity Mall", type: "shopping", cost: 50, duration: 120, description: "Large premium mall with international brands and entertainment options.", rating: 4.0 },

  // ----- JAIPUR -----
  { city: "Jaipur", name: "Amber Fort & Elephant Ride", type: "sightseeing", cost: 20, duration: 180, description: "Majestic hilltop fort reached by elephant-back with ornate mirror-work palaces.", rating: 4.7 },
  { city: "Jaipur", name: "Hawa Mahal & City Palace Tour", type: "sightseeing", cost: 15, duration: 150, description: "Visit the iconic Palace of Winds and the royal City Palace complex.", rating: 4.6 },
  { city: "Jaipur", name: "Traditional Rajasthani Thali at Chokhi Dhani", type: "food", cost: 20, duration: 90, description: "Elaborate vegetarian thali with dal baati churma and gatte ki sabzi.", rating: 4.7 },
  { city: "Jaipur", name: "Lassiwala at MI Road", type: "food", cost: 5, duration: 30, description: "Famous thick malai lassi served in clay pots from a legendary shop.", rating: 4.5 },
  { city: "Jaipur", name: "Hot Air Balloon over Pink City", type: "adventure", cost: 50, duration: 120, description: "Soar above Jaipur's palaces and forts in a sunrise hot air balloon ride.", rating: 4.8 },
  { city: "Jaipur", name: "Tiger Fort Trekking", type: "adventure", cost: 10, duration: 180, description: "Trek to the Nahargarh Fort on the Aravalli hills for city skyline views.", rating: 4.3 },
  { city: "Jaipur", name: "Johari Bazaar Jewelry Shopping", type: "shopping", cost: 80, duration: 150, description: "Famous market for kundan jewelry, gemstones, and traditional Rajasthani ornaments.", rating: 4.6 },
  { city: "Jaipur", name: "Bapu Bazaar Textile Haul", type: "shopping", cost: 30, duration: 120, description: "Vibrant market for bandhani sarees, mojari shoes, and blue pottery.", rating: 4.5 },

  // ----- AHMEDABAD -----
  { city: "Ahmedabad", name: "Sabarmati Ashram & Riverfront", type: "sightseeing", cost: 0, duration: 120, description: "Visit Gandhi's former residence and walk along the scenic Sabarmati Riverfront.", rating: 4.6 },
  { city: "Ahmedabad", name: "Adalaj Stepwell & Heritage Walk", type: "sightseeing", cost: 5, duration: 90, description: "Explore the intricately carved five-story stepwell and historic old city lanes.", rating: 4.4 },
  { city: "Ahmedabad", name: "Manek Chowk Night Food Market", type: "food", cost: 10, duration: 90, description: "Famous street food hub serving pav bhaji, dosa, and sweet jalebis after dark.", rating: 4.7 },
  { city: "Ahmedabad", name: "Gujarati Thali at Gordhan Thal", type: "food", cost: 15, duration: 60, description: "All-you-can-eat traditional Gujarati thali with endless farsan and sweets.", rating: 4.5 },
  { city: "Ahmedabad", name: "Nalsarovar Bird Sanctuary Boat Ride", type: "adventure", cost: 12, duration: 180, description: "Boat safari through the wetland sanctuary spotting flamingos and migratory birds.", rating: 4.3 },
  { city: "Ahmedabad", name: "Kankaria Lake Activities", type: "adventure", cost: 10, duration: 120, description: "Enjoy zipline, toy train, and paddle boats at this revamped lakefront.", rating: 4.1 },
  { city: "Ahmedabad", name: "Law Garden Night Market", type: "shopping", cost: 25, duration: 120, description: "Night market for Gujarati handicrafts, bandhani textiles, and embroidered items.", rating: 4.4 },
  { city: "Ahmedabad", name: "CG Road Shopping Splurge", type: "shopping", cost: 45, duration: 90, description: "Modern shopping street with branded outlets and traditional Gujarati wear.", rating: 4.0 },

  // ----- LUCKNOW -----
  { city: "Lucknow", name: "Bara Imambara & Bhool Bhulaiya Tour", type: "sightseeing", cost: 10, duration: 150, description: "Explore the grand Nawabi architecture and the famous labyrinthine Bhool Bhulaiya.", rating: 4.6 },
  { city: "Lucknow", name: "Rumi Darwaza & British Residency", type: "sightseeing", cost: 5, duration: 90, description: "Visit the imposing Rumi Gate and the historic British Residency ruins.", rating: 4.3 },
  { city: "Lucknow", name: "Tunday Kababi Legendary Feast", type: "food", cost: 12, duration: 60, description: "Famous melt-in-mouth galouti kebabs at the legendary Tunday Kababi.", rating: 4.8 },
  { city: "Lucknow", name: "Basket Chaat & Street Food Walk", type: "food", cost: 8, duration: 90, description: "Sample Lucknow's unique basket chaat, malai makkhan, and tokri chaat.", rating: 4.6 },
  { city: "Lucknow", name: "Gomti River Kayaking", type: "adventure", cost: 15, duration: 120, description: "Guided kayaking along the Gomti River through the heart of the city.", rating: 4.0 },
  { city: "Lucknow", name: "Janeshwar Mishra Park Cycling", type: "adventure", cost: 8, duration: 90, description: "Cycle through Asia's second-largest urban park with dedicated bike trails.", rating: 4.2 },
  { city: "Lucknow", name: "Hazratganj Market Walk", type: "shopping", cost: 35, duration: 120, description: "Upscale shopping district with chikan embroidery boutiques and branded stores.", rating: 4.4 },
  { city: "Lucknow", name: "Chikankari Handicraft Market", type: "shopping", cost: 40, duration: 90, description: "Shop for authentic Lucknowi chikankari embroidery on kurtas and sarees.", rating: 4.5 },

  // ----- SURAT -----
  { city: "Surat", name: "Dumas Beach & Lighthouse", type: "sightseeing", cost: 0, duration: 90, description: "Visit the scenic Dumas Beach with its historic lighthouse overlooking the Arabian Sea.", rating: 4.1 },
  { city: "Surat", name: "Surat Castle & Heritage Walk", type: "sightseeing", cost: 5, duration: 120, description: "Tour the 16th-century Surat Castle and explore the old Portuguese Quarter.", rating: 4.2 },
  { city: "Surat", name: "Surat's Famous Locho & Sev Khamani", type: "food", cost: 5, duration: 45, description: "Try the city's signature locho and sev khamani from street vendors.", rating: 4.6 },
  { city: "Surat", name: "Surti Undhiyu & Rasa Wala", type: "food", cost: 10, duration: 60, description: "Traditional Surti thali with undhiyu, khandvi, and sweet jalebi.", rating: 4.5 },
  { city: "Surat", name: "Paragliding at Saputara", type: "adventure", cost: 30, duration: 180, description: "Tandem paragliding over the Saputara hill station near Surat.", rating: 4.3 },
  { city: "Surat", name: "Ziplining at Sarthana Nature Park", type: "adventure", cost: 15, duration: 60, description: "Zipline through the treetops at Surat's largest nature park.", rating: 4.0 },
  { city: "Surat", name: "Textile Market Shopping", type: "shopping", cost: 60, duration: 150, description: "World's largest textile market with endless varieties of fabrics and sarees.", rating: 4.4 },
  { city: "Surat", name: "VR Mall Surat Shopping", type: "shopping", cost: 45, duration: 120, description: "Modern shopping mall with international brands and entertainment zones.", rating: 4.1 },

  // ----- GOA -----
  { city: "Goa", name: "Basilica of Bom Jesus & Old Goa Tour", type: "sightseeing", cost: 5, duration: 150, description: "UNESCO World Heritage site with stunning Portuguese-era baroque architecture.", rating: 4.6 },
  { city: "Goa", name: "Fort Aguada & Sinquerim Beach", type: "sightseeing", cost: 5, duration: 120, description: "Explore the 17th-century Portuguese fort and adjacent sandy beach.", rating: 4.5 },
  { city: "Goa", name: "Beach Shack Seafood Lunch", type: "food", cost: 20, duration: 90, description: "Fresh kingfish, prawn balchao, and beer at a Calangute beach shack.", rating: 4.6 },
  { city: "Goa", name: "Portuguese Goan Thali Experience", type: "food", cost: 18, duration: 75, description: "Vindaloo, sorpotel, and fish curry rice at a traditional Goan restaurant.", rating: 4.5 },
  { city: "Goa", name: "Scuba Diving at Grande Island", type: "adventure", cost: 35, duration: 180, description: "Explore coral reefs and shipwrecks with guided scuba diving expedition.", rating: 4.7 },
  { city: "Goa", name: "White Water Rafting in Mandovi", type: "adventure", cost: 28, duration: 150, description: "Raft through rapids along the Mandovi River surrounded by lush greenery.", rating: 4.4 },
  { city: "Goa", name: "Anjuna Flea Market", type: "shopping", cost: 30, duration: 150, description: "Iconic Wednesday market with bohemian clothes, jewelry, and psychedelic art.", rating: 4.5 },
  { city: "Goa", name: "Panjim Market Portuguese Antiques", type: "shopping", cost: 40, duration: 90, description: "Shop for Portuguese-inspired antiques, azulejos tiles, and cashew nuts.", rating: 4.3 },

  // ----- UDAIPUR -----
  { city: "Udaipur", name: "City Palace & Lake Pichola Cruise", type: "sightseeing", cost: 20, duration: 180, description: "Tour the grand City Palace followed by a sunset boat ride on Lake Pichola.", rating: 4.8 },
  { city: "Udaipur", name: "Jag Mandir & Sahelion Ki Bari", type: "sightseeing", cost: 10, duration: 120, description: "Visit the island palace and the beautiful garden of the maidens.", rating: 4.4 },
  { city: "Udaipur", name: "Sunset Dinner at Ambrai Ghat", type: "food", cost: 25, duration: 90, description: "Rooftop dining with views of the illuminated City Palace and lake.", rating: 4.7 },
  { city: "Udaipur", name: "Rajasthani Dal Baati Churma Feast", type: "food", cost: 15, duration: 60, description: "Traditional Rajasthani meal at a heritage haveli restaurant.", rating: 4.5 },
  { city: "Udaipur", name: "Hill Trek to Sajjangarh Fort", type: "adventure", cost: 10, duration: 180, description: "Scenic trek up to the monsoon palace with panoramic lake views.", rating: 4.4 },
  { city: "Udaipur", name: "Quad Biking off Road Experience", type: "adventure", cost: 25, duration: 60, description: "ATV rides through rugged terrain near the Aravalli foothills.", rating: 4.2 },
  { city: "Udaipur", name: "Hathi Pol Bazaar & Handicrafts", type: "shopping", cost: 35, duration: 120, description: "Shop for miniature paintings, silver jewelry, and Rajasthani puppets.", rating: 4.5 },
  { city: "Udaipur", name: "Bada Bazaar Textile Shopping", type: "shopping", cost: 30, duration: 90, description: "Traditional market for bandhej sarees, quilts, and embroidered fabrics.", rating: 4.3 },

  // ----- VARANASI -----
  { city: "Varanasi", name: "Ganga Aarti at Dashashwamedh Ghat", type: "sightseeing", cost: 0, duration: 90, description: "Witness the spectacular evening fire ceremony on the holiest ghat.", rating: 4.9 },
  { city: "Varanasi", name: "Kashi Vishwanath Temple & Old City Walk", type: "sightseeing", cost: 0, duration: 120, description: "Visit the sacred Jyotirlinga temple and wander the narrow alleyways.", rating: 4.7 },
  { city: "Varanasi", name: "Street Food Tour of Kashi", type: "food", cost: 8, duration: 90, description: "Sample kachori sabzi, malaiyyo, thandai, and baati chokha from street stalls.", rating: 4.6 },
  { city: "Varanasi", name: "Banarasi Paan & Chai at Assi Ghat", type: "food", cost: 3, duration: 45, description: "Experience the legendary Banarasi paan and sweet chai by the river.", rating: 4.5 },
  { city: "Varanasi", name: "Sunrise Boat Ride on the Ganges", type: "adventure", cost: 10, duration: 120, description: "Rowboat journey along the Ganges at dawn past all the ghats.", rating: 4.8 },
  { city: "Varanasi", name: "Cycling to Sarnath", type: "adventure", cost: 8, duration: 180, description: "Bike ride to the Buddhist pilgrimage site where Buddha gave his first sermon.", rating: 4.3 },
  { city: "Varanasi", name: "Vishwanath Gali Silk Shopping", type: "shopping", cost: 60, duration: 90, description: "Shop for authentic Banarasi silk sarees and brocade fabrics.", rating: 4.5 },
  { city: "Varanasi", name: "Thatheri Bazaar Brass Shopping", type: "shopping", cost: 25, duration: 90, description: "Traditional market for handmade brass utensils and religious artifacts.", rating: 4.2 },

  // ----- AGRA -----
  { city: "Agra", name: "Taj Mahal Sunrise Tour", type: "sightseeing", cost: 20, duration: 150, description: "Witness the iconic marble mausoleum at sunrise with guided history tour.", rating: 4.9 },
  { city: "Agra", name: "Agra Fort & Mehtab Bagh", type: "sightseeing", cost: 15, duration: 180, description: "Explore the red sandstone fort and sunset views of Taj from across the Yamuna.", rating: 4.6 },
  { city: "Agra", name: "Mughlai Feast at Peshawri", type: "food", cost: 22, duration: 75, description: "North-west frontier cuisine including dal makhani and tandoori meats.", rating: 4.5 },
  { city: "Agra", name: "Street Food Walk in Sadar Bazaar", type: "food", cost: 8, duration: 60, description: "Famous petha sweets, bedai jalebi, and chaat from local vendors.", rating: 4.4 },
  { city: "Agra", name: "Yamuna River Rafting near Akbar's Tomb", type: "adventure", cost: 20, duration: 120, description: "Gentle rafting along the Yamuna with views of Mughal monuments.", rating: 4.1 },
  { city: "Agra", name: "Chambal Safari Jeep Tour", type: "adventure", cost: 25, duration: 180, description: "Wildlife safari in the Chambal river valley spotting gharials and Gangetic dolphins.", rating: 4.3 },
  { city: "Agra", name: "Kinari Bazaar Shopping", type: "shopping", cost: 30, duration: 120, description: "Vibrant wholesale market for marble inlay work, textiles, and handicrafts.", rating: 4.4 },
  { city: "Agra", name: "Sadar Bazaar Marble Inlay Shopping", type: "shopping", cost: 45, duration: 90, description: "Shop for exquisite marble inlay souvenirs and pietra dura crafts.", rating: 4.2 },

  // ==================== UNITED STATES ====================

  // ----- NEW YORK -----
  { city: "New York", name: "Statue of Liberty & Ellis Island Tour", type: "sightseeing", cost: 15, duration: 240, description: "Ferry to Lady Liberty and the immigration museum on Ellis Island.", rating: 4.7 },
  { city: "New York", name: "Central Park & Metropolitan Museum", type: "sightseeing", cost: 10, duration: 240, description: "Stroll through Central Park then explore world art at The Met.", rating: 4.6 },
  { city: "New York", name: "Dollar Pizza & Bagel Crawl", type: "food", cost: 10, duration: 60, description: "Famous NYC dollar pizza slices and authentic everything bagels with cream cheese.", rating: 4.5 },
  { city: "New York", name: "Katz's Deli Pastrami Sandwich", type: "food", cost: 20, duration: 45, description: "Iconic mile-high pastrami sandwich at the legendary Lower East Side deli.", rating: 4.7 },
  { city: "New York", name: "Helicopter Tour over Manhattan", type: "adventure", cost: 50, duration: 30, description: "Bird's-eye view of skyline, Statue of Liberty, and Central Park.", rating: 4.8 },
  { city: "New York", name: "Rock Climbing at The Cliffs LIC", type: "adventure", cost: 25, duration: 120, description: "Indoor bouldering and top-rope climbing with Manhattan skyline views.", rating: 4.2 },
  { city: "New York", name: "Fifth Avenue Luxury Shopping", type: "shopping", cost: 100, duration: 150, description: "Flagship stores of world's top luxury brands along iconic Fifth Avenue.", rating: 4.5 },
  { city: "New York", name: "SoHo Boutique & Vintage Shopping", type: "shopping", cost: 60, duration: 120, description: "Trendy boutiques and vintage stores in cobblestoned SoHo streets.", rating: 4.4 },

  // ----- LOS ANGELES -----
  { city: "Los Angeles", name: "Hollywood Walk of Fame & TCL Chinese Theatre", type: "sightseeing", cost: 0, duration: 90, description: "Walk among the stars and see celebrity handprints at the historic theatre.", rating: 4.3 },
  { city: "Los Angeles", name: "Santa Monica Pier & Venice Beach Boardwalk", type: "sightseeing", cost: 0, duration: 150, description: "Iconic pier with amusement park and vibrant Venice Beach boardwalk.", rating: 4.5 },
  { city: "Los Angeles", name: "Grand Central Market Food Crawl", type: "food", cost: 18, duration: 90, description: "Diverse food hall with tacos, ramen, and artisanal ice cream.", rating: 4.4 },
  { city: "Los Angeles", name: "Koreatown BBQ Experience", type: "food", cost: 25, duration: 90, description: "All-you-can-eat Korean BBQ with banchan and soju in K-Town.", rating: 4.6 },
  { city: "Los Angeles", name: "Surfing at Malibu Beach", type: "adventure", cost: 35, duration: 180, description: "Surf lessons on the legendary waves of Surfrider Beach, Malibu.", rating: 4.5 },
  { city: "Los Angeles", name: "Hiking Runyon Canyon", type: "adventure", cost: 0, duration: 120, description: "Popular hiking trail with stunning panoramic views of the Hollywood sign.", rating: 4.4 },
  { city: "Los Angeles", name: "Rodeo Drive Luxury Boutiques", type: "shopping", cost: 100, duration: 120, description: "World-famous luxury shopping street in Beverly Hills.", rating: 4.3 },
  { city: "Los Angeles", name: "The Grove & Farmers Market", type: "shopping", cost: 50, duration: 120, description: "Open-air shopping center with fountains and a historic farmers market.", rating: 4.4 },

  // ----- CHICAGO -----
  { city: "Chicago", name: "Art Institute of Chicago Tour", type: "sightseeing", cost: 15, duration: 180, description: "World-class museum housing iconic works from Monet to Hopper.", rating: 4.7 },
  { city: "Chicago", name: "Willis Tower Skydeck & Architecture Cruise", type: "sightseeing", cost: 20, duration: 150, description: "See the city from the glass ledge and cruise Chicago River's architecture.", rating: 4.6 },
  { city: "Chicago", name: "Deep Dish Pizza at Lou Malnati's", type: "food", cost: 18, duration: 60, description: "Iconic Chicago deep-dish pizza loaded with cheese and chunky tomato sauce.", rating: 4.7 },
  { city: "Chicago", name: "Chicago-style Hot Dog Tour", type: "food", cost: 8, duration: 60, description: "All-beef frank with neon relish, sport peppers, and celery salt.", rating: 4.3 },
  { city: "Chicago", name: "Lake Michigan Kayaking", type: "adventure", cost: 30, duration: 120, description: "Paddle along the Lake Michigan shoreline with skyline backdrop.", rating: 4.4 },
  { city: "Chicago", name: "Biking the Lakefront Trail", type: "adventure", cost: 15, duration: 180, description: "18-mile scenic bike trail along Lake Michigan from Lincoln Park to South Shore.", rating: 4.5 },
  { city: "Chicago", name: "Magnificent Mile Shopping", type: "shopping", cost: 80, duration: 150, description: "Premier shopping district with department stores and luxury boutiques.", rating: 4.5 },
  { city: "Chicago", name: "Wicker Park Vintage & Indie Shopping", type: "shopping", cost: 40, duration: 120, description: "Eclectic neighborhood with vintage stores, indie boutiques, and record shops.", rating: 4.2 },

  // ----- MIAMI -----
  { city: "Miami", name: "South Beach Art Deco Walk", type: "sightseeing", cost: 0, duration: 90, description: "Guided tour of pastel-colored Art Deco architecture along Ocean Drive.", rating: 4.5 },
  { city: "Miami", name: "Vizcaya Museum & Gardens", type: "sightseeing", cost: 15, duration: 120, description: "Italian Renaissance-style villa with stunning formal gardens on Biscayne Bay.", rating: 4.6 },
  { city: "Miami", name: "Cuban Coffee & Pastelitos in Little Havana", type: "food", cost: 8, duration: 60, description: "Cafecito and guava pastelitos at the iconic Versailles Bakery.", rating: 4.6 },
  { city: "Miami", name: "Stone Crab at Joe's Seafood", type: "food", cost: 30, duration: 75, description: "Legendary stone crab claws served with mustard sauce at Joe's.", rating: 4.5 },
  { city: "Miami", name: "Everglades Airboat Adventure", type: "adventure", cost: 40, duration: 180, description: "High-speed airboat ride through the Everglades spotting alligators and wildlife.", rating: 4.7 },
  { city: "Miami", name: "Jet Skiing in Biscayne Bay", type: "adventure", cost: 35, duration: 90, description: "Jet ski tour past Millionaire's Row and the Miami skyline.", rating: 4.5 },
  { city: "Miami", name: "Lincoln Road Mall Shopping", type: "shopping", cost: 55, duration: 120, description: "Pedestrian promenade with outdoor cafes and global brand stores.", rating: 4.3 },
  { city: "Miami", name: "Design District Luxury Shopping", type: "shopping", cost: 90, duration: 120, description: "High-end designer boutiques and contemporary art galleries.", rating: 4.4 },

  // ----- SAN FRANCISCO -----
  { city: "San Francisco", name: "Golden Gate Bridge Walk & Vista Points", type: "sightseeing", cost: 0, duration: 120, description: "Walk across the iconic bridge and capture photos from Battery Spencer.", rating: 4.7 },
  { city: "San Francisco", name: "Alcatraz Island Prison Tour", type: "sightseeing", cost: 25, duration: 180, description: "Ferry to the infamous island prison with audio tour of escape stories.", rating: 4.6 },
  { city: "San Francisco", name: "Dungeness Crab at Fisherman's Wharf", type: "food", cost: 22, duration: 60, description: "Fresh cracked Dungeness crab and clam chowder in sourdough bread bowls.", rating: 4.5 },
  { city: "San Francisco", name: "Mission District Burrito Crawl", type: "food", cost: 12, duration: 75, description: "Giant Mission-style burritos at legendary taquerias on Mission Street.", rating: 4.6 },
  { city: "San Francisco", name: "Alcatraz to Angel Island Kayaking", type: "adventure", cost: 40, duration: 180, description: "Guided sea kayaking tour around Alcatraz and Angel Island.", rating: 4.4 },
  { city: "San Francisco", name: "Biking across Golden Gate to Sausalito", type: "adventure", cost: 20, duration: 180, description: "Bike rental and ferry return ride across the bridge to charming Sausalito.", rating: 4.6 },
  { city: "San Francisco", name: "Union Square High-End Shopping", type: "shopping", cost: 90, duration: 120, description: "Flagship department stores and luxury brands around Union Square.", rating: 4.4 },
  { city: "San Francisco", name: "Haight-Ashbury Vintage Shopping", type: "shopping", cost: 30, duration: 120, description: "Bohemian vintage clothing shops and eclectic record stores.", rating: 4.3 },

  // ----- LAS VEGAS -----
  { city: "Las Vegas", name: "The Strip Walking Tour & Bellagio Fountains", type: "sightseeing", cost: 0, duration: 180, description: "Walk the neon-lit Strip and watch the spectacular fountain show.", rating: 4.6 },
  { city: "Las Vegas", name: "Grand Canyon Skywalk Day Trip", type: "sightseeing", cost: 30, duration: 480, description: "Full-day trip to the Grand Canyon's glass bridge over the abyss.", rating: 4.7 },
  { city: "Las Vegas", name: "Buffet Feast at The Wynn", type: "food", cost: 35, duration: 90, description: "World-famous luxury buffet with seafood, prime rib, and endless desserts.", rating: 4.6 },
  { city: "Las Vegas", name: "Gordon Ramsay Hell's Kitchen Dinner", type: "food", cost: 40, duration: 90, description: "Beef Wellington and sticky toffee pudding at the celebrity chef's restaurant.", rating: 4.5 },
  { city: "Las Vegas", name: "Grand Canyon Helicopter Tour", type: "adventure", cost: 50, duration: 180, description: "Helicopter flight over the Hoover Dam and into the Grand Canyon.", rating: 4.9 },
  { city: "Las Vegas", name: "SlotZilla Zipline on Fremont Street", type: "adventure", cost: 28, duration: 30, description: "Zipline from Fremont Street's huge slot machine canopy structure.", rating: 4.4 },
  { city: "Las Vegas", name: "The Forum Shops at Caesars", type: "shopping", cost: 90, duration: 150, description: "Roman-themed luxury mall with high-end brands and indoor sky shows.", rating: 4.5 },
  { city: "Las Vegas", name: "Fashion Show Mall Shopping", type: "shopping", cost: 65, duration: 120, description: "One of America's largest malls with over 250 stores on the Strip.", rating: 4.2 },

  // ----- BOSTON -----
  { city: "Boston", name: "Freedom Trail Historical Walk", type: "sightseeing", cost: 5, duration: 180, description: "2.5-mile red-brick trail through 16 significant American Revolution sites.", rating: 4.7 },
  { city: "Boston", name: "Fenway Park Baseball Tour", type: "sightseeing", cost: 15, duration: 90, description: "Guided tour of America's oldest baseball stadium in operation.", rating: 4.5 },
  { city: "Boston", name: "New England Clam Chowder at Union Oyster House", type: "food", cost: 18, duration: 60, description: "Creamy clam chowder in sourdough bowl at America's oldest restaurant.", rating: 4.5 },
  { city: "Boston", name: "Faneuil Hall Food Colonnade", type: "food", cost: 14, duration: 60, description: "Diverse food hall with local specialties from lobster rolls to cannoli.", rating: 4.3 },
  { city: "Boston", name: "Boston Harbor Sailing Adventure", type: "adventure", cost: 35, duration: 150, description: "Sail on the historic Boston Harbor with a professional skipper.", rating: 4.5 },
  { city: "Boston", name: "Charles River Kayaking", type: "adventure", cost: 22, duration: 120, description: "Paddle along the Charles with views of MIT and Harvard campuses.", rating: 4.3 },
  { city: "Boston", name: "Newbury Street Boutique Shopping", type: "shopping", cost: 70, duration: 120, description: "Elegant 19th-century brownstones housing designer boutiques and galleries.", rating: 4.4 },
  { city: "Boston", name: "Quincy Market Souvenir & Food Shopping", type: "shopping", cost: 30, duration: 90, description: "Historic market with pushcarts selling souvenirs, crafts, and local treats.", rating: 4.2 },

  // ----- SEATTLE -----
  { city: "Seattle", name: "Space Needle & Chihuly Garden", type: "sightseeing", cost: 25, duration: 120, description: "360-degree views from the iconic tower and stunning glass art exhibition.", rating: 4.5 },
  { city: "Seattle", name: "Pike Place Market Tour & Fish Throwing", type: "sightseeing", cost: 0, duration: 120, description: "Famous farmers market with flying fish, artisan crafts, and flower stalls.", rating: 4.7 },
  { city: "Seattle", name: "Pike Place Chowder Fresh Catch", type: "food", cost: 14, duration: 45, description: "Award-winning clam chowder served in a bread bowl at the market.", rating: 4.6 },
  { city: "Seattle", name: "Coffee Crawl in Capitol Hill", type: "food", cost: 12, duration: 90, description: "Visit original Starbucks Reserve Roastery and indie coffee shops.", rating: 4.5 },
  { city: "Seattle", name: "Mount Rainier Day Hike", type: "adventure", cost: 18, duration: 360, description: "Guided hiking through wildflower meadows to panoramic summit views.", rating: 4.7 },
  { city: "Seattle", name: "Puget Sound Whale Watching Tour", type: "adventure", cost: 45, duration: 240, description: "Boat tour to spot orcas, humpbacks, and seals in the Salish Sea.", rating: 4.6 },
  { city: "Seattle", name: "Nordstrom Flagship & Pacific Place", type: "shopping", cost: 75, duration: 120, description: "Original Nordstrom store and downtown luxury shopping center.", rating: 4.3 },
  { city: "Seattle", name: "Ballard Farmers Market & Antiques", type: "shopping", cost: 35, duration: 90, description: "Sunday market with local produce, artisan goods, and vintage finds.", rating: 4.2 },

  // ----- ORLANDO -----
  { city: "Orlando", name: "Magic Kingdom Park Tour", type: "sightseeing", cost: 50, duration: 480, description: "Full day at Disney's most iconic theme park with Cinderella Castle.", rating: 4.8 },
  { city: "Orlando", name: "Universal Studios Florida", type: "sightseeing", cost: 50, duration: 480, description: "Movie-themed rides and attractions including Harry Potter World.", rating: 4.7 },
  { city: "Orlando", name: "Disney Springs Dining & Entertainment", type: "food", cost: 25, duration: 120, description: "Themed restaurants and eateries at Disney's shopping district.", rating: 4.5 },
  { city: "Orlando", name: "Voice-Immersive Dinner Show", type: "food", cost: 35, duration: 150, description: "Medieval Times dinner with a four-course meal and jousting tournament.", rating: 4.3 },
  { city: "Orlando", name: "Wet 'n Wild Water Park Thrills", type: "adventure", cost: 30, duration: 240, description: "High-speed water slides and wave pools at the water park.", rating: 4.4 },
  { city: "Orlando", name: "Zipline at Gatorland", type: "adventure", cost: 22, duration: 60, description: "Zipline over alligator-infested waters at the alligator park.", rating: 4.3 },
  { city: "Orlando", name: "Orlando Premium Outlets", type: "shopping", cost: 80, duration: 180, description: "Designer outlet mall with discounts on luxury brands and apparel.", rating: 4.5 },
  { city: "Orlando", name: "International Drive Shopping & Entertainment", type: "shopping", cost: 50, duration: 120, description: "Tourist corridor with souvenir shops, malls, and entertainment complexes.", rating: 4.1 },

  // ----- DENVER -----
  { city: "Denver", name: "Denver Art Museum & Civic Center Park", type: "sightseeing", cost: 10, duration: 180, description: "World-class art collections in a striking architecture and adjacent park.", rating: 4.4 },
  { city: "Denver", name: "Red Rocks Amphitheatre Day Trip", type: "sightseeing", cost: 0, duration: 120, description: "Explore the natural rock amphitheater with stunning mountain views.", rating: 4.7 },
  { city: "Denver", name: "Craft Brewery Tour in RiNo", type: "food", cost: 20, duration: 150, description: "Visit top breweries sampling IPAs, stouts, and sours in River North.", rating: 4.6 },
  { city: "Denver", name: "Denver Biscuit Co. Southern Brunch", type: "food", cost: 15, duration: 60, description: "Massive fried chicken biscuits and cinnamon rolls at a local favorite.", rating: 4.5 },
  { city: "Denver", name: "Rocky Mountain National Park Hike", type: "adventure", cost: 25, duration: 360, description: "Full-day guided hike through alpine trails with elk and mountain goats.", rating: 4.8 },
  { city: "Denver", name: "Whitewater Rafting on Clear Creek", type: "adventure", cost: 40, duration: 180, description: "Thrilling rapids rafting through Clear Creek Canyon.", rating: 4.6 },
  { city: "Denver", name: "Cherry Creek Shopping Center", type: "shopping", cost: 75, duration: 120, description: "High-end mall with Neiman Marcus, Tiffany, and designer boutiques.", rating: 4.3 },
  { city: "Denver", name: "16th Street Mall Shopping", type: "shopping", cost: 40, duration: 120, description: "Pedestrian shopping mile with local stores and outdoor cafes.", rating: 4.1 },

  // ==================== UNITED KINGDOM ====================

  // ----- LONDON -----
  { city: "London", name: "Tower of London & Tower Bridge Tour", type: "sightseeing", cost: 25, duration: 180, description: "See the Crown Jewels and explore the 1,000-year-old fortress.", rating: 4.7 },
  { city: "London", name: "British Museum & Covent Garden", type: "sightseeing", cost: 0, duration: 240, description: "World history treasures at the museum followed by Covent Garden street performers.", rating: 4.6 },
  { city: "London", name: "Fish and Chips at a Traditional Pub", type: "food", cost: 15, duration: 60, description: "Classic battered cod and chunky chips with mushy peas at a London pub.", rating: 4.4 },
  { city: "London", name: "Afternoon Tea at The Ritz", type: "food", cost: 35, duration: 90, description: "Elegant three-tier afternoon tea with scones, clotted cream, and finger sandwiches.", rating: 4.7 },
  { city: "London", name: "Thames River Speedboat Ride", type: "adventure", cost: 30, duration: 60, description: "High-speed rib boat ride along the Thames past all major landmarks.", rating: 4.5 },
  { city: "London", name: "Richmond Park Deer Spotting & Cycling", type: "adventure", cost: 10, duration: 180, description: "Cycle through London's largest royal park spotting wild deer.", rating: 4.4 },
  { city: "London", name: "Oxford Street & Regent Street Shopping", type: "shopping", cost: 90, duration: 150, description: "Iconic shopping streets with Selfridges, Liberty, and flagship stores.", rating: 4.5 },
  { city: "London", name: "Camden Market Alternative Shopping", type: "shopping", cost: 40, duration: 120, description: "Eclectic markets for vintage clothing, handmade crafts, and street food.", rating: 4.4 },

  // ----- MANCHESTER -----
  { city: "Manchester", name: "Old Trafford Stadium Tour", type: "sightseeing", cost: 20, duration: 120, description: "Guided behind-the-scenes tour of Manchester United's legendary stadium.", rating: 4.6 },
  { city: "Manchester", name: "Science & Industry Museum", type: "sightseeing", cost: 0, duration: 150, description: "Interactive exhibits on Manchester's industrial revolution heritage.", rating: 4.4 },
  { city: "Manchester", name: "Curry Mile Food Crawl", type: "food", cost: 18, duration: 90, description: "Concentrated stretch of South Asian restaurants with legendary biryanis.", rating: 4.5 },
  { city: "Manchester", name: "Mancunian Pie & Mash at a Pub", type: "food", cost: 12, duration: 60, description: "Traditional meat pie with mash and gravy at a historic Manchester pub.", rating: 4.3 },
  { city: "Manchester", name: "Bouldering at The Depot Climbing", type: "adventure", cost: 15, duration: 90, description: "Indoor bouldering gym with routes for all skill levels.", rating: 4.2 },
  { city: "Manchester", name: "Canal Street Kayaking", type: "adventure", cost: 18, duration: 90, description: "Paddle through Manchester's historic canal network in the city center.", rating: 4.1 },
  { city: "Manchester", name: "Trafford Centre Mega Mall", type: "shopping", cost: 60, duration: 150, description: "One of UK's largest shopping centers with 200+ stores and dining.", rating: 4.3 },
  { city: "Manchester", name: "Northern Quarter Vintage Shopping", type: "shopping", cost: 30, duration: 120, description: "Independent boutiques, record stores, and vintage shops in creative district.", rating: 4.5 },

  // ----- EDINBURGH -----
  { city: "Edinburgh", name: "Edinburgh Castle & Royal Mile Walk", type: "sightseeing", cost: 20, duration: 240, description: "Explore the historic castle perched on an extinct volcano and walk the Royal Mile.", rating: 4.8 },
  { city: "Edinburgh", name: "Arthur's Seat Summit Hike", type: "sightseeing", cost: 0, duration: 120, description: "Climb the ancient volcano in Holyrood Park for panoramic city views.", rating: 4.7 },
  { city: "Edinburgh", name: "Haggis, Neeps & Tatties at a Pub", type: "food", cost: 14, duration: 60, description: "Traditional Scottish haggis with mashed turnips and potatoes.", rating: 4.4 },
  { city: "Edinburgh", name: "Scotch Whisky Tasting Session", type: "food", cost: 22, duration: 90, description: "Guided tasting of single malt Scotches from the Highlands and Islands.", rating: 4.6 },
  { city: "Edinburgh", name: "Holyrood Park Mountain Biking", type: "adventure", cost: 20, duration: 150, description: "Mountain bike trails through the rugged terrain of Holyrood Park.", rating: 4.3 },
  { city: "Edinburgh", name: "North Sea Coastal Kayaking", type: "adventure", cost: 30, duration: 180, description: "Sea kayaking along the Firth of Forth with views of Bass Rock.", rating: 4.4 },
  { city: "Edinburgh", name: "Princes Street & Jenners Shopping", type: "shopping", cost: 60, duration: 120, description: "Edinburgh's main shopping street with the historic Jenners department store.", rating: 4.3 },
  { city: "Edinburgh", name: "Grassmarket Vintage & Craft Shopping", type: "shopping", cost: 30, duration: 90, description: "Historic market square with vintage stores, Scottish crafts, and boutiques.", rating: 4.2 },

  // ----- BIRMINGHAM -----
  { city: "Birmingham", name: "Birmingham Museum & Art Gallery", type: "sightseeing", cost: 0, duration: 120, description: "Pre-Raphaelite art collection and artifacts from Birmingham's history.", rating: 4.3 },
  { city: "Birmingham", name: "The Bullring & St. Philip's Cathedral", type: "sightseeing", cost: 0, duration: 90, description: "Modern shopping hub next to the historic baroque cathedral.", rating: 4.2 },
  { city: "Birmingham", name: "Balti Triangle Culinary Tour", type: "food", cost: 16, duration: 90, description: "Birmingham's famous balti curry quarter with authentic Kashmiri dishes.", rating: 4.6 },
  { city: "Birmingham", name: "Pepper's Fish & Chips Local Favorite", type: "food", cost: 12, duration: 45, description: "Award-winning fish and chips from a legendary Birmingham chippy.", rating: 4.4 },
  { city: "Birmingham", name: "Climbing at The Climbing Hut", type: "adventure", cost: 15, duration: 90, description: "Indoor climbing and bouldering center suitable for all levels.", rating: 4.1 },
  { city: "Birmingham", name: "Canal Network Paddleboarding", type: "adventure", cost: 20, duration: 120, description: "Stand-up paddleboarding through Birmingham's extensive canal system.", rating: 4.2 },
  { city: "Birmingham", name: "Bullring & Grand Central Shopping", type: "shopping", cost: 55, duration: 150, description: "Iconic shopping center with Selfridges and 160+ brands.", rating: 4.4 },
  { city: "Birmingham", name: "Jewellery Quarter Antique Shopping", type: "shopping", cost: 70, duration: 120, description: "Historic jewelry district with artisan workshops and antique shops.", rating: 4.5 },

  // ----- LIVERPOOL -----
  { city: "Liverpool", name: "The Beatles Story Museum & Albert Dock", type: "sightseeing", cost: 15, duration: 180, description: "Immersive journey through the Beatles' story and visit the historic Albert Dock.", rating: 4.7 },
  { city: "Liverpool", name: "Liverpool Cathedral & Metropolitan Cathedral", type: "sightseeing", cost: 5, duration: 120, description: "Tour the UK's largest cathedral and the striking modern Catholic counterpart.", rating: 4.4 },
  { city: "Liverpool", name: "Scouse Stew at a Traditional Pub", type: "food", cost: 12, duration: 60, description: "Liverpool's signature lamb or beef stew with root vegetables at a local pub.", rating: 4.4 },
  { city: "Liverpool", name: "Bold Street Food Crawl", type: "food", cost: 18, duration: 90, description: "Eclectic street food from bao buns to Greek souvlaki on trendy Bold Street.", rating: 4.5 },
  { city: "Liverpool", name: "Mersey River Kayaking", type: "adventure", cost: 22, duration: 120, description: "Guided kayak tour on the River Mersey with waterfront skyline views.", rating: 4.3 },
  { city: "Liverpool", name: "Formby Beach Horseback Ride", type: "adventure", cost: 35, duration: 120, description: "Beach horseback riding at Formby with red squirrel reserve visits.", rating: 4.5 },
  { city: "Liverpool", name: "Liverpool ONE Shopping District", type: "shopping", cost: 55, duration: 150, description: "Open-air shopping complex with high-street brands and department stores.", rating: 4.3 },
  { city: "Liverpool", name: "Cavern Club Beatles Memorabilia Shopping", type: "shopping", cost: 25, duration: 60, description: "Official Beatles-themed merchandise and vinyl at the famous Cavern Quarter.", rating: 4.4 },

  // ==================== FRANCE ====================

  // ----- PARIS -----
  { city: "Paris", name: "Eiffel Tower Summit & Seine River Cruise", type: "sightseeing", cost: 25, duration: 240, description: "Ascend the iron lady and cruise the Seine past Notre Dame and Louvre.", rating: 4.8 },
  { city: "Paris", name: "Louvre Museum & Tuileries Garden", type: "sightseeing", cost: 15, duration: 240, description: "See the Mona Lisa and walk through the manicured Tuileries Garden.", rating: 4.7 },
  { city: "Paris", name: "Croissant & Café au Lait at a Patisserie", type: "food", cost: 8, duration: 45, description: "Flaky butter croissant and café au lait at a classic Parisian patisserie.", rating: 4.6 },
  { city: "Paris", name: "French Fine Dining at Le Jules Verne", type: "food", cost: 40, duration: 120, description: "Michelin-star dining inside the Eiffel Tower with panoramic Paris views.", rating: 4.7 },
  { city: "Paris", name: "Segway Tour of Montmartre", type: "adventure", cost: 25, duration: 120, description: "Segway ride through the bohemian Montmartre district to Sacre-Coeur.", rating: 4.4 },
  { city: "Paris", name: "Bike Tour through Paris", type: "adventure", cost: 18, duration: 180, description: "Guided cycling tour past all major Parisian landmarks and hidden courtyards.", rating: 4.5 },
  { city: "Paris", name: "Champs-Elysees & Avenue Montaigne Luxury Shopping", type: "shopping", cost: 100, duration: 150, description: "World's most beautiful avenue with luxury flagship stores and designer boutiques.", rating: 4.6 },
  { city: "Paris", name: "Le Marais Vintage & Concept Store Shopping", type: "shopping", cost: 50, duration: 120, description: "Trendy neighborhood with vintage boutiques, concept stores, and art galleries.", rating: 4.4 },

  // ----- MARSEILLE -----
  { city: "Marseille", name: "Old Port & Notre-Dame de la Garde", type: "sightseeing", cost: 0, duration: 150, description: "Explore the vibrant Vieux-Port and hike up to the hilltop basilica.", rating: 4.5 },
  { city: "Marseille", name: "Calanques National Park Boat Tour", type: "sightseeing", cost: 18, duration: 180, description: "Boat trip through the stunning limestone inlets along the Mediterranean.", rating: 4.7 },
  { city: "Marseille", name: "Bouillabaisse at a Old Port Restaurant", type: "food", cost: 25, duration: 90, description: "Marseille's iconic fish stew with rouille sauce at a waterfront restaurant.", rating: 4.6 },
  { city: "Marseille", name: "Panisse & Socca Street Snacks", type: "food", cost: 6, duration: 30, description: "Crispy chickpea pancakes and fries from a street vendor in Noailles.", rating: 4.3 },
  { city: "Marseille", name: "Calanques National Park Hiking", type: "adventure", cost: 0, duration: 240, description: "Trek through the dramatic limestone Calanques with turquoise water views.", rating: 4.7 },
  { city: "Marseille", name: "Mediterranean Scuba Diving", type: "adventure", cost: 35, duration: 180, description: "Guided scuba dive exploring underwater caves and marine life.", rating: 4.5 },
  { city: "Marseille", name: "La Canebiere & Cours Julien Shopping", type: "shopping", cost: 35, duration: 120, description: "Marseille's main thoroughfare and bohemian neighborhood for unique finds.", rating: 4.2 },
  { city: "Marseille", name: "Les Terrasses du Port Mall", type: "shopping", cost: 50, duration: 90, description: "Modern shopping center with sea views and international brands.", rating: 4.1 },

  // ----- LYON -----
  { city: "Lyon", name: "Vieux Lyon & Traboules Discovery", type: "sightseeing", cost: 0, duration: 120, description: "Wander Renaissance streets and hidden passageways in UNESCO old town.", rating: 4.6 },
  { city: "Lyon", name: "Basilica of Fourviere & Roman Theatres", type: "sightseeing", cost: 0, duration: 150, description: "Majestic basilica on the hill with ancient Roman amphitheater ruins.", rating: 4.5 },
  { city: "Lyon", name: "Traditional Lyonnaise Bouchon Dinner", type: "food", cost: 22, duration: 90, description: "Authentic quenelles, coq au vin, and cervelle de canut at a family bouchon.", rating: 4.6 },
  { city: "Lyon", name: "Les Halles de Lyon Food Market Tasting", type: "food", cost: 18, duration: 90, description: "Artisan food market with cheese, charcuterie, and fresh oysters.", rating: 4.7 },
  { city: "Lyon", name: "Parc de la Tete d'Or Kayaking", type: "adventure", cost: 12, duration: 60, description: "Paddle boat and kayak on the lake in Lyon's largest urban park.", rating: 4.2 },
  { city: "Lyon", name: "Monts d'Or Hiking Trail", type: "adventure", cost: 0, duration: 240, description: "Guided hike through the golden mountains overlooking the Rhone Valley.", rating: 4.4 },
  { city: "Lyon", name: "Rue de la Republique Shopping", type: "shopping", cost: 60, duration: 120, description: "Lyon's main shopping street with Galeries Lafayette and major brands.", rating: 4.3 },
  { city: "Lyon", name: "Crocusse-Rousse Silk Workshops Shopping", type: "shopping", cost: 40, duration: 90, description: "Historic silk-weaving district with artisan silk boutiques and ateliers.", rating: 4.2 },

  // ----- TOULOUSE -----
  { city: "Toulouse", name: "Capitole de Toulouse & City Center", type: "sightseeing", cost: 0, duration: 120, description: "Tour the grand Capitole building and explore vibrant Place du Capitole.", rating: 4.4 },
  { city: "Toulouse", name: "Cite de l'Espace Space Museum", type: "sightseeing", cost: 18, duration: 180, description: "Interactive space museum with full-size rocket replicas and planetarium.", rating: 4.5 },
  { city: "Toulouse", name: "Cassoulet Toulousain Feast", type: "food", cost: 18, duration: 75, description: "Rich white bean cassoulet with duck confit and Toulouse sausage.", rating: 4.6 },
  { city: "Toulouse", name: "Victor Hugo Market French Delicacies", type: "food", cost: 15, duration: 60, description: "Covered market with foie gras, cheeses, and local wines.", rating: 4.4 },
  { city: "Toulouse", name: "Canal du Midi Bike Ride", type: "adventure", cost: 12, duration: 180, description: "Scenic cycle along the tree-lined UNESCO-listed Canal du Midi.", rating: 4.5 },
  { city: "Toulouse", name: "Hot Air Balloon over Garonne Valley", type: "adventure", cost: 45, duration: 120, description: "Sunrise balloon ride over Toulouse and the Pyrenees backdrop.", rating: 4.7 },
  { city: "Toulouse", name: "Rue d'Alsace-Lorraine Shopping", type: "shopping", cost: 45, duration: 120, description: "Main shopping street with department stores and French fashion brands.", rating: 4.2 },
  { city: "Toulouse", name: "Saint-Cyprien Vintage Market", type: "shopping", cost: 25, duration: 90, description: "Weekend flea market with antiques, vintage clothes, and local crafts.", rating: 4.3 },

  // ----- NICE -----
  { city: "Nice", name: "Promenade des Anglais Walk & Old Town", type: "sightseeing", cost: 0, duration: 150, description: "Stroll the iconic seafront promenade then explore the colorful Old Town.", rating: 4.6 },
  { city: "Nice", name: "Marc Chagall National Museum", type: "sightseeing", cost: 10, duration: 90, description: "World's largest collection of Chagall's biblical message paintings.", rating: 4.5 },
  { city: "Nice", name: "Salade Nicoise & Socca at Cours Saleya", type: "food", cost: 14, duration: 60, description: "Classic Niçoise salad and chickpea socca at the flower market.", rating: 4.5 },
  { city: "Nice", name: "Fruits de Mer Platter at Port Lympia", type: "food", cost: 28, duration: 90, description: "Fresh oysters, sea urchins, and prawns at a harbor seafood restaurant.", rating: 4.6 },
  { city: "Nice", name: "Paragliding over the Bay of Angels", type: "adventure", cost: 40, duration: 120, description: "Tandem paragliding with stunning views of the Mediterranean coastline.", rating: 4.8 },
  { city: "Nice", name: "Scuba Diving at Cap de Nice", type: "adventure", cost: 32, duration: 150, description: "Explore underwater cliffs and marine reserves along the French Riviera.", rating: 4.4 },
  { city: "Nice", name: "Avenue Jean Medecin Shopping", type: "shopping", cost: 55, duration: 120, description: "Nice's main shopping avenue with department stores and boutiques.", rating: 4.3 },
  { city: "Nice", name: "Old Town Provencal Market Shopping", type: "shopping", cost: 30, duration: 90, description: "Daily market for lavender, olive oil, soaps, and Provencal textiles.", rating: 4.5 },

  // ==================== THAILAND ====================

  // ----- BANGKOK -----
  { city: "Bangkok", name: "Grand Palace & Wat Phra Kaew Tour", type: "sightseeing", cost: 15, duration: 180, description: "Visit the dazzling Grand Palace and the Temple of the Emerald Buddha.", rating: 4.7 },
  { city: "Bangkok", name: "Wat Arun & Chao Phraya River Cruise", type: "sightseeing", cost: 10, duration: 120, description: "Climb the Temple of Dawn and take a longtail boat along the river.", rating: 4.6 },
  { city: "Bangkok", name: "Pad Thai & Mango Sticky Rice Street Food", type: "food", cost: 6, duration: 60, description: "Legendary pad Thai from Thip Samai and mango sticky rice at Kor Panich.", rating: 4.8 },
  { city: "Bangkok", name: "Yaowarat Road Chinatown Food Crawl", type: "food", cost: 10, duration: 120, description: "Dim sum, roast duck, and seafood along Bangkok's bustling Chinatown.", rating: 4.7 },
  { city: "Bangkok", name: "Muay Thai Boxing Training Session", type: "adventure", cost: 20, duration: 120, description: "Learn basic Muay Thai techniques at a local gym from pro fighters.", rating: 4.5 },
  { city: "Bangkok", name: "Bangkok Jungle Zip Line Adventure", type: "adventure", cost: 28, duration: 180, description: "Zip line through the tropical canopy in the outskirts of Bangkok.", rating: 4.4 },
  { city: "Bangkok", name: "Chatuchak Weekend Market Mega Shopping", type: "shopping", cost: 35, duration: 180, description: "World's largest weekend market with 15,000 stalls of everything imaginable.", rating: 4.6 },
  { city: "Bangkok", name: "Siam Paragon Luxury Shopping", type: "shopping", cost: 80, duration: 120, description: "Ultra-luxury mall with designer brands and Southeast Asia's largest aquarium.", rating: 4.4 },

  // ----- PHUKET -----
  { city: "Phuket", name: "Big Buddha & Wat Chalong Temple", type: "sightseeing", cost: 0, duration: 120, description: "Visit the 45-meter marble Buddha and Phuket's most revered temple.", rating: 4.5 },
  { city: "Phuket", name: "Phang Nga Bay James Bond Island Tour", type: "sightseeing", cost: 20, duration: 240, description: "Longtail boat tour through limestone karsts to the famous James Bond Island.", rating: 4.7 },
  { city: "Phuket", name: "Fresh Seafood at Rawai Beach", type: "food", cost: 18, duration: 75, description: "Grilled lobster, prawns, and fish at the Rawai seafood market.", rating: 4.6 },
  { city: "Phuket", name: "Pad Thai & Tom Yum Goon Cooking Class", type: "food", cost: 14, duration: 180, description: "Learn to make authentic Thai dishes at a Phuket cooking school.", rating: 4.5 },
  { city: "Phuket", name: "Scuba Diving at Similan Islands", type: "adventure", cost: 45, duration: 480, description: "Full-day diving trip to Thailand's best dive sites with crystal clear water.", rating: 4.8 },
  { city: "Phuket", name: "ATV Jungle Adventure", type: "adventure", cost: 30, duration: 120, description: "Ride ATVs through rubber plantations and jungle trails.", rating: 4.4 },
  { city: "Phuket", name: "Patong Bangla Night Market Shopping", type: "shopping", cost: 25, duration: 120, description: "Vibrant night market with souvenirs, clothing, and local handicrafts.", rating: 4.3 },
  { city: "Phuket", name: "Jungceylon Shopping Mall", type: "shopping", cost: 50, duration: 120, description: "Large shopping complex in Patong with international and Thai brands.", rating: 4.1 },

  // ----- CHIANG MAI -----
  { city: "Chiang Mai", name: "Doi Suthep Temple & Mountain View", type: "sightseeing", cost: 5, duration: 180, description: "Sacred temple atop Doi Suthep mountain reached by 306-step naga staircase.", rating: 4.8 },
  { city: "Chiang Mai", name: "Old City Temples Walking Tour", type: "sightseeing", cost: 0, duration: 150, description: "Explore Wat Chedi Luang, Wat Phra Singh, and Wat Chiang Man.", rating: 4.6 },
  { city: "Chiang Mai", name: "Khao Soi at Famous Street Stall", type: "food", cost: 5, duration: 45, description: "Northern Thailand's signature coconut curry noodle soup from a local legend.", rating: 4.8 },
  { city: "Chiang Mai", name: "Night Bazaar Food Court Sampling", type: "food", cost: 8, duration: 90, description: "Sai oua sausages, grilled meats, and sticky rice at the bustling night bazaar.", rating: 4.5 },
  { city: "Chiang Mai", name: "Elephant Sanctuary Ethical Visit", type: "adventure", cost: 40, duration: 360, description: "Full-day ethical elephant encounter with feeding, bathing, and jungle walks.", rating: 4.9 },
  { city: "Chiang Mai", name: "Jungle Zipline & Waterfall Trek", type: "adventure", cost: 30, duration: 240, description: "Zipline through the rainforest canopy and hike to hidden waterfalls.", rating: 4.6 },
  { city: "Chiang Mai", name: "Chiang Mai Night Bazaar Shopping", type: "shopping", cost: 25, duration: 150, description: "Famous night market for handmade crafts, hill tribe textiles, and art.", rating: 4.5 },
  { city: "Chiang Mai", name: "Sunday Walking Street Market", type: "shopping", cost: 20, duration: 180, description: "Massive weekly market along Ratchadamnoen Road with local artisan products.", rating: 4.7 },

  // ----- PATTAYA -----
  { city: "Pattaya", name: "Sanctuary of Truth & Pattaya Beach", type: "sightseeing", cost: 15, duration: 150, description: "Enormous wooden temple with intricate carvings and a relaxing beach stroll.", rating: 4.4 },
  { city: "Pattaya", name: "Nong Nooch Tropical Garden", type: "sightseeing", cost: 12, duration: 180, description: "Exquisite botanical gardens with Thai cultural shows and elephant performances.", rating: 4.5 },
  { city: "Pattaya", name: "Seafood Buffet at The Sky Gallery", type: "food", cost: 22, duration: 90, description: "Cliffside seafood buffet with panoramic ocean views at sunset.", rating: 4.5 },
  { city: "Pattaya", name: "Walking Street Food & Drink Tour", type: "food", cost: 15, duration: 120, description: "Vibrant street food scene with grilled seafood, Thai BBQ, and tropical fruits.", rating: 4.3 },
  { city: "Pattaya", name: "Parasailing over Pattaya Bay", type: "adventure", cost: 25, duration: 30, description: "Soar above the bay harnessed to a speedboat parasail.", rating: 4.5 },
  { city: "Pattaya", name: "Jet Skiing to Koh Larn Island", type: "adventure", cost: 32, duration: 120, description: "Jet ski excursion across the bay to the pristine Koh Larn island.", rating: 4.4 },
  { city: "Pattaya", name: "Pattaya Floating Market Shopping", type: "shopping", cost: 20, duration: 120, description: "Traditional Thai floating market with boats selling souvenirs and snacks.", rating: 4.2 },
  { city: "Pattaya", name: "Central Festival Pattaya Beach Mall", type: "shopping", cost: 50, duration: 120, description: "Beachfront shopping mall with international brands and entertainment.", rating: 4.1 },

  // ----- KRABI -----
  { city: "Krabi", name: "Railay Beach & Phra Nang Cave", type: "sightseeing", cost: 8, duration: 180, description: "Visit the stunning beach accessible only by boat and the princess cave.", rating: 4.8 },
  { city: "Krabi", name: "Emerald Pool & Hot Springs Tour", type: "sightseeing", cost: 10, duration: 180, description: "Swim in emerald-green natural pools and relax in thermal hot springs.", rating: 4.6 },
  { city: "Krabi", name: "Seafood Dinner at Ao Nang Beachfront", type: "food", cost: 18, duration: 75, description: "Grilled fish and prawns at a beachfront restaurant with fire shows.", rating: 4.5 },
  { city: "Krabi", name: "Thai Massage & Mango Sticky Rice", type: "food", cost: 10, duration: 60, description: "Traditional Thai massage followed by fresh mango with sticky coconut rice.", rating: 4.6 },
  { city: "Krabi", name: "Rock Climbing at Railay Beach", type: "adventure", cost: 28, duration: 180, description: "World-class limestone cliff climbing over turquoise waters.", rating: 4.7 },
  { city: "Krabi", name: "Koh Phi Phi Island Hopping", type: "adventure", cost: 35, duration: 360, description: "Full-day speedboat trip to the legendary islands with snorkeling stops.", rating: 4.8 },
  { city: "Krabi", name: "Krabi Night Market Handicrafts", type: "shopping", cost: 18, duration: 90, description: "Evening market with local crafts, batik clothing, and pearl jewelry.", rating: 4.3 },
  { city: "Krabi", name: "Ao Nang Town Center Shopping", type: "shopping", cost: 25, duration: 90, description: "Beach town shopping with boutiques, dive shops, and souvenir stalls.", rating: 4.0 },

  // ==================== UNITED ARAB EMIRATES ====================

  // ----- DUBAI -----
  { city: "Dubai", name: "Burj Khalifa Observation Deck & Dubai Mall", type: "sightseeing", cost: 25, duration: 240, description: "World's tallest building observation deck and the massive Dubai Mall.", rating: 4.7 },
  { city: "Dubai", name: "Dubai Marina Walk & Palm Jumeirah", type: "sightseeing", cost: 0, duration: 150, description: "Stroll the glamorous Marina and visit the iconic Palm Jumeirah island.", rating: 4.5 },
  { city: "Dubai", name: "Gold Souk & Spice Souk Tour", type: "shopping", cost: 60, duration: 120, description: "Traditional souks with endless gold jewelry and exotic spices.", rating: 4.4 },
  { city: "Dubai", name: "Dubai Mall Luxury Shopping Spree", type: "shopping", cost: 100, duration: 180, description: "World's largest shopping mall with every luxury brand imaginable.", rating: 4.6 },
  { city: "Dubai", name: "Desert Safari Dune Bashing & BBQ Dinner", type: "adventure", cost: 35, duration: 240, description: "Thrilling 4x4 dune bashing, camel rides, and starlit BBQ in the desert.", rating: 4.7 },
  { city: "Dubai", name: "Skydive over Palm Jumeirah", type: "adventure", cost: 50, duration: 120, description: "Tandem skydive from 13,000 feet with views of the Palm and coastline.", rating: 4.9 },
  { city: "Dubai", name: "Al Dhaira Cafeteria Shawarma & Manousheh", type: "food", cost: 8, duration: 30, description: "Legendary shawarma wrapped with garlic sauce at Dubai's favorite cafeteria.", rating: 4.5 },
  { city: "Dubai", name: "Pierchic Fine Dining Overwater", type: "food", cost: 40, duration: 120, description: "Overwater seafood restaurant at the end of a pier with Burj Al Arab views.", rating: 4.7 },

  // ----- ABU DHABI -----
  { city: "Abu Dhabi", name: "Sheikh Zayed Grand Mosque Tour", type: "sightseeing", cost: 0, duration: 120, description: "One of the world's largest mosques with white marble and crystal chandeliers.", rating: 4.8 },
  { city: "Abu Dhabi", name: "Louvre Abu Dhabi & Saadiyat Island", type: "sightseeing", cost: 20, duration: 180, description: "Stunning dome museum with art from ancient to contemporary.", rating: 4.6 },
  { city: "Abu Dhabi", name: "Heritage Village Coffee & Dates", type: "food", cost: 6, duration: 30, description: "Arabic coffee with fresh dates at the reconstructed heritage village.", rating: 4.3 },
  { city: "Abu Dhabi", name: "Emirates Palace Afternoon Tea", type: "food", cost: 35, duration: 90, description: "Gold-flaked cappuccino and pastries at the world's most luxurious hotel.", rating: 4.7 },
  { city: "Abu Dhabi", name: "Ferrari World Roller Coaster Rides", type: "adventure", cost: 40, duration: 240, description: "World's fastest roller coaster and Formula Rossa at Ferrari theme park.", rating: 4.6 },
  { city: "Abu Dhabi", name: "Yas Marina Circuit Karting", type: "adventure", cost: 30, duration: 60, description: "Race go-karts on the F1 Yas Marina Circuit track.", rating: 4.4 },
  { city: "Abu Dhabi", name: "Marina Mall & The Galleria", type: "shopping", cost: 75, duration: 150, description: "Luxury shopping at waterfront mall with international designer brands.", rating: 4.3 },
  { city: "Abu Dhabi", name: "Souk Qaryat Al Beri Traditional Shopping", type: "shopping", cost: 35, duration: 90, description: "Modern souk with handicrafts, perfumes, and traditional Arabian goods.", rating: 4.2 },

  // ----- SHARJAH -----
  { city: "Sharjah", name: "Sharjah Art Museum & Heritage Area", type: "sightseeing", cost: 0, duration: 150, description: "Extensive contemporary Arab art collection and restored heritage district.", rating: 4.4 },
  { city: "Sharjah", name: "Al Noor Island & Butterfly House", type: "sightseeing", cost: 8, duration: 120, description: "Beautiful island park with butterfly atrium and light art installations.", rating: 4.3 },
  { city: "Sharjah", name: "Arabian Tea House Traditional Meal", type: "food", cost: 12, duration: 60, description: "Emirati regag bread, machboos, and karak chai at a heritage cafe.", rating: 4.5 },
  { city: "Sharjah", name: "Al Majaz Waterfront Dining", type: "food", cost: 20, duration: 75, description: "Waterfront dining with diverse cuisines and dancing fountain shows.", rating: 4.3 },
  { city: "Sharjah", name: "Al Qudra Desert Cycling", type: "adventure", cost: 15, duration: 180, description: "Mountain bike through the Al Qudra desert cycling track.", rating: 4.2 },
  { city: "Sharjah", name: "Khorfakkan Beach Kayaking", type: "adventure", cost: 18, duration: 90, description: "Sea kayaking along the east coast beach town of Khorfakkan.", rating: 4.3 },
  { city: "Sharjah", name: "Souk Al Arsah Antique Shopping", type: "shopping", cost: 40, duration: 120, description: "Oldest souk in UAE with antiques, perfumes, and traditional handicrafts.", rating: 4.4 },
  { city: "Sharjah", name: "Sahara Centre Mall Shopping", type: "shopping", cost: 45, duration: 120, description: "Family-friendly mall with retail brands, cinema, and indoor ice rink.", rating: 4.1 },

  // ----- RAS AL KHAIMAH -----
  { city: "Ras Al Khaimah", name: "Jebel Jais Mountain Viewpoint", type: "sightseeing", cost: 0, duration: 90, description: "Drive to the UAE's highest peak at 1,934 meters with panoramic views.", rating: 4.7 },
  { city: "Ras Al Khaimah", name: "Dhayah Fort & Heritage Village", type: "sightseeing", cost: 5, duration: 90, description: "Restored hilltop fort with 360-degree views of mountains and coast.", rating: 4.4 },
  { city: "Ras Al Khaimah", name: "Seafood Lunch at Al Hamra Marina", type: "food", cost: 18, duration: 60, description: "Fresh catch of hammour and prawns at the waterfront marina restaurant.", rating: 4.4 },
  { city: "Ras Al Khaimah", name: "Arabian Grill at the Ritz-Carlton", type: "food", cost: 30, duration: 90, description: "Lamb ouzi, grilled meats, and mezze with Arabian Gulf views.", rating: 4.6 },
  { city: "Ras Al Khaimah", name: "Jebel Jais Zipline Adventure", type: "adventure", cost: 35, duration: 60, description: "World's longest zipline at 2.83 km over the Hajar Mountains.", rating: 4.9 },
  { city: "Ras Al Khaimah", name: "Mangrove Forest Kayaking", type: "adventure", cost: 20, duration: 120, description: "Paddle through protected mangrove forests teeming with flamingos.", rating: 4.5 },
  { city: "Ras Al Khaimah", name: "Al Hamra Mall Shopping", type: "shopping", cost: 35, duration: 90, description: "Convenient mall with retail outlets and family entertainment options.", rating: 4.0 },
  { city: "Ras Al Khaimah", name: "RAK Souk Traditional Shopping", type: "shopping", cost: 25, duration: 90, description: "Local market for textiles, perfumes, dates, and Emirati crafts.", rating: 4.2 },

  // ----- FUJAIRAH -----
  { city: "Fujairah", name: "Al Bidyah Mosque & Fort", type: "sightseeing", cost: 5, duration: 90, description: "UAE's oldest mosque and restored fort with archaeological exhibits.", rating: 4.4 },
  { city: "Fujairah", name: "Fujairah Museum & Heritage Village", type: "sightseeing", cost: 3, duration: 90, description: "Artifacts spanning 4,000 years and a reconstructed traditional village.", rating: 4.2 },
  { city: "Fujairah", name: "Friday Market Fruit & Street Food", type: "food", cost: 8, duration: 45, description: "Famous roadside market with fresh fruits, vegetables, and local snacks.", rating: 4.3 },
  { city: "Fujairah", name: "Indian Ocean Seafood Grill", type: "food", cost: 20, duration: 75, description: "Grilled lobster and kingfish at a beachfront restaurant on the Indian Ocean.", rating: 4.5 },
  { city: "Fujairah", name: "Scuba Diving at Snoopy Island", type: "adventure", cost: 35, duration: 180, description: "Guided dive around the coral reef teeming with sea turtles and rays.", rating: 4.7 },
  { city: "Fujairah", name: "Hajar Mountain Hiking Adventure", type: "adventure", cost: 15, duration: 240, description: "Guided hike through the dramatic wadis and rock pools of Hajar Mountains.", rating: 4.5 },
  { city: "Fujairah", name: "Fujairah City Centre Mall", type: "shopping", cost: 35, duration: 90, description: "Modern shopping mall with international brands and hypermarket.", rating: 4.0 },
  { city: "Fujairah", name: "Friday Souq Bargain Shopping", type: "shopping", cost: 20, duration: 90, description: "Weekend market for carpets, pottery, antiques, and Bedouin crafts.", rating: 4.1 },
];

export default activities;
