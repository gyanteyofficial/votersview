import { Component, signal, computed, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

export interface Constituency {
  name: string;
  partyShortName: string;
  partyColor: string;
  partyName: string;
  votes: number;
  margin: number;
  status: 'Won' | 'Leading';
}

const CONSTITUENCY_NAMES: Record<string, string[]> = {
  'ASSAM': [
    'Abhayapuri North','Abhayapuri South','Agomoni','Agyathuri','Algapur','Baitamari','Barkhetri','Barobazar',
    'Barpathar','Batadrava','Bey','Bhawanipur','Bilasipara East','Bilasipara West','Binnakandi','Bokajan',
    'Boko','Bongaigaon','Borkhola','Chaygaon','Chenga','Dakhin Salmara','Dhemaji','Digboi','Diphlu',
    'Dispur','Doboka','Doomdooma','Duliajan','Gauripur','Gohpur','Golaghat','Golokganj','Gossaigaon',
    'Guwahati East','Guwahati West','Haflong','Hailakandi','Hojai','Jagiroad','Jalukbari','Jaleswar',
    'Jorhat','Kaliabor','Kampur','Karimganj North','Karimganj South','Khumtai','Kokrajhar East',
    'Kokrajhar West','Laharighat','Lakhipur','Lakhimpur','Lanka','Lumding','Majuli','Mazbat',
    'Moran','Nagaon','Nalbari','Naoboicha','Nowgong','Palasbari','Patacharkuchi','Pub Nalbari',
    'Rangapara','Ratabari','Rupohihat','Sapatgram','Sarbhog','Sibsagar','Silchar','Sonai',
    'Sonari','Soraikela','Sorbhog','Tezpur','Tihu','Titabor','Udalguri','Udharbond',
    'Barpeta Road','Barpeta','Puthia','Senchowa','Naginimara','Nazira','Mahmora','Thowra',
    'Amguri','Sibsagar North','Naharkatia','Mekliganj','Pathsala','North Guwahati','South Guwahati',
    'Harisinga','Ghiladhari','Raha','Samaguri','Koliabor','Jamunamukh','Hojai North','Lumding North',
    'Sonai East','Jiribam','Churachandpur','Oinam','Thoubal','Sagolband','Keishamthong','Heingang',
    'Wangkhei','Singjamei','Yaiskul','Thongju','Khurai','Andro','Lamlai','Uripok',
  ],
  'KERALA': [
    'Manjeshwar','Kasaragod','Udma','Kanhangad','Trikaripur','Payyannur','Kalliasseri','Thalassery',
    'Kuthuparamba','Mattannur','Peravoor','Iritty','Kannur','Dharmadom','Thalipparamba','Irikkur',
    'Azhikode','Rajapur','Sreekandapuram','Payam','Vadakara','Kuttiadi','Nadapuram','Koyilandy',
    'Perambra','Elathur','Kozhikode North','Kozhikode South','Beypore','Kunnamangalam','Koduvally',
    'Thiruvambady','Kondotty','Eranad','Manjeri','Tirur','Tanur','Tirurangadi','Vengara',
    'Malappuram','Mankada','Perinthalmanna','Mannarkkad','Malampuzha','Palakkad','Tarur','Chittur',
    'Nemmara','Alathur','Chelakkara','Thrithala','Pattambi','Shornur','Ottapalam','Kongad',
    'Thrissur','Nattika','Kaipamangalam','Guruvayur','Manalur','Kunnamkulam','Wadakkanchery','Ollur',
    'Chalakudy','Irinjalakuda','Puthukkad','Mukundapuram','Vaikom','Ettumanoor','Kottayam','Puthuppally',
    'Kaduthuruthy','Vaikom East','Aruvikkara','Neyyattinkara','Kazhakootam','Vattiyoorkavu',
    'Thiruvananthapuram','Nemom','Attingal','Kilimanoor','Nedumangad','Vamanapuram','Aroor','Cherthala',
    'Alappuzha','Ambalappuzha','Chengannur','Mavelikkara','Kayamkulam','Haripad','Kuttanad','Mavelikara',
    'Karunagappally','Kollam','Eravipuram','Kunnathur','Punalur','Chadayamangalam','Kundara','Elampalloor',
    'Ernakulam','Thrippunithura','Aluva','Kalady','Perumbavoor','Angamaly','Paravur','Vypen',
    'Kothamangalam','Muvattupuzha','Kunnathunad','North Paravur','Piravom','Kovalam','Thiruvananthapuram East',
  ],
  'PUDUCHERRY': [
    'Ariyankuppam','Bahour','Indira Nagar','Kamaraj Nagar','Kattumannarkoil','Lawspet','Mangalam',
    'Mannadipet','Mahe','Mudaliarpet','Nellithope','Oulgaret','Raj Bhavan','Raj Nivas',
    'Rajiv Nagar','Thattanchavady','Thirubuvanai','Oupalam','Karikkal','Thirumalairajan Nagar',
    'Vazhudavur','Villianur','Muthialpet','Orleanpet','Rajiv Gandhi Nagar','Embalam','Nedungadu',
    'Maducarai','Yanam Nagar','Sedarapet',
  ],
  'TAMIL NADU': [
    'Gummidipoondi','Ponneri','Tiruttani','Sholingur','Arakkonam','Ranipet','Arcot','Vellore',
    'Anaikattu','Kilvaithinankuppam','Gudiyatham','Vaniyambadi','Ambur','Jolarpet','Tirupattur',
    'Uthangarai','Bargur','Krishnagiri','Veppanahalli','Hosur','Thalli','Palacodu','Pennagaram',
    'Dharmapuri','Pappireddipatti','Harur','Mettur','Edappadi','Rasipuram','Sankari','Omalur',
    'Mahal','Salem','Attur','Yercaud','Gangavalli','Kallakurichi','Kalvarayan Hills','Tirukoilur',
    'Ulundurpet','Rishivandiyam','Sankarapuram','Viluppuram','Vikravandi','Mailam','Tindivanam',
    'Vanur','Pondicherry','Cuddalore','Panruti','Kurinjipadi','Bhuvanagiri','Chidambaram','Kattumannarkoil',
    'Srimushnam','Vriddhachalam','Neyveli','Vridhachalam','Tittakudi','Lalgudi','Ariyalur','Senthurai',
    'Jayamkondam','Perambalur','Kunnam','Madurai North','Madurai East','Madurai South','Madurai West',
    'Madurai Central','Thiruparankundram','Thirumangalam','Usilampatti','Andipatti','Nilakottai',
    'Natham','Dindigul','Vedasandur','Aravakurichi','Karur','Krishnarayapuram','Kulithalai','Manapparai',
    'Srirangam','Tiruverumbur','Thiruvaiyaru','Papanasam','Thanjavur','Orathanadu','Pattukkottai',
    'Peravurani','Kumbakonam','Papanasam North','Thiruvidaimarudur','Nagapattinam','Kilvelur','Vedaranyam',
    'Mayiladuthurai','Sirkazhi','Chidambaram North','Vadalur','Virudhachalam','Gangaikondan','Tenkasi',
    'Sankarankovil','Radhapuram','Tiruchendur','Srivaikuntam','Ottapidaram','Kovilpatti','Vilathikulam',
    'Thoothukkudi','Tisayanvilai','Nanguneri','Cheranmahadevi','Ambasamudram','Palayamkottai','Tirunelveli',
    'Kalakad','Vikramasingapuram','Tirupur North','Tirupur South','Palladam','Avinashi','Tirupur Central',
    'Uthukuli','Udumalpet','Pollachi','Valparai','Sulur','Coimbatore North','Thondamuthur','Coimbatore South',
    'Singanallur','Kinathukadavu','Mettupalayam','Gudalur','Ooty','Coonoor','Mettuppalayam',
    'Erode East','Erode West','Bhavani','Perundurai','Gobichettipalayam','Anthiyur','Bhavanisagar',
    'Udhagamandalam','Gudalur North','Pandalur','Virudhunagar','Sivakasi','Sattur','Aruppukkottai',
    'Rajapalayam','Srivilliputhur','Watrap','Tiruchuli','Paramakudi','Ramanathapuram','Mudukulathur',
    'Kadaladi','Alagankulam','Tiruppattur TN','Natrampalli','Vaniyambadi North','Ambur South',
    'Salem North','Salem South','Namakkal','Tiruchengode','Rasipuram South','Gobichettipalayam East',
    'Thammampatti','Sendamangalam','Mohanur','Paramathi Velur','Rasipuram North','Mayavaram',
    'Poonamallee','Avadi','Ambattur','Maduravoyal','Virugambakkam','Saidapet','Guindy','Chepauk',
    'Chennai Central','Kolathur','Villivakkam','Thiru Vi Ka Nagar','Egmore','Royapuram',
    'Harbour','Chepauk Thiruvallikeni','Dr Radhakrishnan Nagar','Perambur','Kolathur North',
  ],
  'WEST BENGAL': [
    'Coochbehar Uttar','Coochbehar Dakshin','Sitalkuchi','Sitai','Dinhata','Natabari','Mathabhanga',
    'Mekhliganj','Tufanganj','Maynaguri','Dhupguri','Falakata','Malbazar','Nagrakata','Jalpaiguri',
    'Rajganj','Dabgram Phulbari','Matigara Naxalbari','Siliguri','Phansidewa','Chopra','Islampur',
    'Goalpokhar','Chakulia','Karandighi','Hemtabad','Kaliyaganj','Raiganj','Itahar','Kushmandi',
    'Kumarganj','Balurghat','Tapan','Gangarampur','Harirampur','Chanchal','Harishchandrapur',
    'Maldah','Mothabari','Sujapur','Manikchak','Kaliachak','Englishbazar','Baishnabnagar',
    'Farakka','Samserganj','Sagardighi','Lalgola','Raghunathganj','Suti','Jangipur',
    'Murshidabad','Nabagram','Khargram','Berhampore','Naoda','Domkal','Jalangi','Bhagabangola',
    'Rejinagar','Bharatpur','Kandi','Burwan','Katwa','Ausgram','Monteswar','Burdwan Uttar',
    'Burdwan Dakshin','Raina','Jamalpur','Memari','Purbasthali Uttar','Purbasthali Dakshin','Kalna',
    'Galsi','Bardhaman','Ketugram','Mangalkot','Dubrajpur','Suri','Sainthia','Mayureswar',
    'Rampurhat','Hansan','Nalhati','Murarai','Bolpur','Nanoor','Labhpur','Rajnagar',
    'Khoyrasole','Siuri','Onda','Chhatna','Bankura','Barjora','Indpur','Mejia',
    'Gangajalghati','Ranibandh','Raipur','Taldangra','Khatra','Saltora','Arambag','Goghat',
    'Khanakul','Pandua','Serampore','Chanditala','Jangipara','Haripal','Dhanekhali',
    'Tarakeswar','Pursurah','Balagarh','Singur','Chunchura','Bhadreswar','Champdani',
    'Sreerampur','Uttarpara','Salkia','Bally','Howrah Uttar','Howrah Madhya','Shibpur',
    'Howrah Dakshin','Sankrail','Panchla','Uluberia Uttar','Uluberia Dakshin','Shyampur',
    'Bagnan','Amta','Udaynarayanpur','Jagatballavpur','Domjur','Dum Dum Uttar','Dum Dum',
    'Rajarhat Newtown','Bidhannagar','Rajarhat Gopalpur','Madhyamgram','Barasat','Deganga',
    'Haroa','Minakhan','Sandeshkhali','Basirhat Uttar','Basirhat Dakshin','Hingalganj',
    'Gosaba','Patharpratima','Kultali','Mathurapur','Jaynagar','Baruipur Purba','Baruipur Paschim',
    'Sonarpur Uttar','Sonarpur Dakshin','Rajpur','Behala Purba','Behala Paschim','Maheshtala',
    'Budge Budge','Metiabruz','Kolkata Port','Bhabanipur','Rashbehari','Ballygunge','Kasba',
    'Jadavpur','Tollygunj','Regent Park','Chetla','Kalighat','Entally','Beliaghata','Jorasanko',
    'Shyampukur','Maniktala','Kashipur Belgachia','Cossipur Sinthi','Chitpore','Bankra',
    'Ghatal','Daspur','Khirpai','Chandrakona','Garbeta','Salbani','Medinipur','Narayangarh',
    'Sabang','Pingla','Kharagpur','Dantan','Debra','Egra','Contai Uttar','Contai Dakshin',
    'Ramnagar','Potashpur','Bhagabanpur','Panskura Purba','Panskura Paschim','Tamluk',
    'Nandigram','Mahishadal','Nandakumar','Chandipur','Haldia','Sutahata','Moyna',
    'Panskura','Bhimdoha','Contai','Rupnarayan','Ranaghat','Shantipur','Nadia','Kalyani',
    'Chakdah','Krishnanagar Uttar','Krishnanagar Dakshin','Nabadwip','Santipur North','Chapra',
    'Bongaon','Gaighata','Swarupnagar','Baduria','Habra','Amdanga','Barrackpur','Noapara',
    'Jagatdal','Naihati','Bhatpara','Garulia','Khardah','Panihati','Kamarhati','Baranagar','Dum Dum North',
  ],
};

export type LangCode = 'en' | 'hi' | 'ta' | 'ml';

export interface Language {
  code: LangCode;
  label: string;
  nativeLabel: string;
  flag: string;
}

export interface Translations {
  home: string;
  refresh: string;
  disclaimerLabel: string;
  disclaimerText: string;
  liveCounting: string;
  heroTitle: string;
  heroSubtitle: string;
  lastUpdated: string;
  generalTab: string;
  byeTab: string;
  searchPlaceholder: string;
  resultsFor: string;
  noResultsFor: string;
  result: string;
  results: string;
  noStatesFound: string;
  trySearching: string;
  clearSearch: string;
  seats: string;
  majority: string;
  crossesMajority: string;
  assemblyConstituencies: string;
  statusTopFive: string;
  parties: string;
  leading: string;
  won: string;
  total: string;
  totalCounted: string;
  countingInProgress: string;
  viewDetails: string;
  legend: string;
  wonDeclared: string;
  majorityMark: string;
  allRightsReserved: string;
  dataUpdated: string;
  states: { [key: string]: string };
}

const TRANSLATIONS: Record<LangCode, Translations> = {
  en: {
    home: 'Home', refresh: 'Refresh',
    disclaimerLabel: 'Disclaimer:',
    disclaimerText: 'ECI is displaying the information as being filled in the system by the Returning Officers from their respective Counting Centres. The final data for each AC/PC will be shared in Form-20.',
    liveCounting: 'LIVE COUNTING',
    heroTitle: 'General Election to Assembly Constituencies',
    heroSubtitle: 'Trends & Results — May 2026',
    lastUpdated: 'Last Updated at',
    generalTab: 'AC General Elections',
    byeTab: 'AC BYE Elections',
    searchPlaceholder: 'Search by state or party name…',
    resultsFor: 'result(s) for',
    noResultsFor: 'No results for',
    result: 'result', results: 'results',
    noStatesFound: 'No states or parties found',
    trySearching: 'Try searching for "Kerala", "DMK", "BJP" or any other state/party',
    clearSearch: 'Clear search',
    seats: 'Seats',
    majority: 'Majority',
    crossesMajority: 'crosses majority',
    assemblyConstituencies: 'Assembly Constituencies',
    statusTopFive: '* Status of Top Five Parties',
    parties: 'Parties', leading: 'Leading', won: 'Won', total: 'Total',
    totalCounted: 'Total Counted',
    countingInProgress: 'Counting in progress',
    viewDetails: 'View Details',
    legend: 'Legend:',
    wonDeclared: 'Won (Declared)',
    majorityMark: 'Majority Mark',
    allRightsReserved: '© 2026 VotersView. All rights reserved.',
    dataUpdated: 'Data is updated in real-time from Returning Officers at Counting Centres.',
    states: { ASSAM: 'ASSAM', KERALA: 'KERALA', PUDUCHERRY: 'PUDUCHERRY', 'TAMIL NADU': 'TAMIL NADU', 'WEST BENGAL': 'WEST BENGAL', MAHARASHTRA: 'MAHARASHTRA' }
  },
  hi: {
    home: 'होम', refresh: 'रिफ्रेश',
    disclaimerLabel: 'अस्वीकरण:',
    disclaimerText: 'ECI उस जानकारी को प्रदर्शित कर रहा है जो संबंधित गणना केंद्रों के रिटर्निंग अधिकारियों द्वारा सिस्टम में भरी जा रही है। प्रत्येक AC/PC का अंतिम डेटा फॉर्म-20 में साझा किया जाएगा।',
    liveCounting: 'लाइव मतगणना',
    heroTitle: 'विधानसभा क्षेत्रों के लिए आम चुनाव',
    heroSubtitle: 'रुझान और परिणाम — मई 2026',
    lastUpdated: 'अंतिम अपडेट',
    generalTab: 'AC आम चुनाव',
    byeTab: 'AC उपचुनाव',
    searchPlaceholder: 'राज्य या पार्टी नाम से खोजें…',
    resultsFor: 'परिणाम',
    noResultsFor: 'कोई परिणाम नहीं',
    result: 'परिणाम', results: 'परिणाम',
    noStatesFound: 'कोई राज्य या पार्टी नहीं मिली',
    trySearching: '"केरल", "DMK", "BJP" या किसी अन्य राज्य/पार्टी के लिए खोजें',
    clearSearch: 'खोज साफ़ करें',
    seats: 'सीटें',
    majority: 'बहुमत',
    crossesMajority: 'बहुमत पार किया',
    assemblyConstituencies: 'विधानसभा क्षेत्र',
    statusTopFive: '* शीर्ष पाँच पार्टियों की स्थिति',
    parties: 'पार्टियाँ', leading: 'आगे', won: 'जीता', total: 'कुल',
    totalCounted: 'कुल गणना',
    countingInProgress: 'मतगणना जारी है',
    viewDetails: 'विवरण देखें',
    legend: 'संकेत:',
    wonDeclared: 'जीता (घोषित)',
    majorityMark: 'बहुमत सीमा',
    allRightsReserved: '© 2026 VotersView. सर्वाधिकार सुरक्षित।',
    dataUpdated: 'डेटा गणना केंद्रों के रिटर्निंग अधिकारियों से वास्तविक समय में अपडेट किया जाता है।',
    states: { ASSAM: 'असम', KERALA: 'केरल', PUDUCHERRY: 'पुदुच्चेरी', 'TAMIL NADU': 'तमिलनाडु', 'WEST BENGAL': 'पश्चिम बंगाल', MAHARASHTRA: 'महाराष्ट्र' }
  },
  ta: {
    home: 'முகப்பு', refresh: 'புதுப்பி',
    disclaimerLabel: 'மறுப்பு:',
    disclaimerText: 'ECI அந்தந்த எண்ணிக்கை மையங்களில் உள்ள திரும்பும் அதிகாரிகளால் கணினியில் நிரப்பப்படும் தகவல்களை காண்பிக்கிறது. ஒவ்வொரு AC/PC க்கான இறுதி தரவு படிவம்-20 இல் பகிரப்படும்.',
    liveCounting: 'நேரடி வாக்கு எண்ணிக்கை',
    heroTitle: 'சட்டமன்றத் தொகுதிகளுக்கான பொதுத் தேர்தல்',
    heroSubtitle: 'போக்குகள் மற்றும் முடிவுகள் — மே 2026',
    lastUpdated: 'கடைசியாக புதுப்பிக்கப்பட்டது',
    generalTab: 'AC பொதுத் தேர்தல்',
    byeTab: 'AC இடைத்தேர்தல்',
    searchPlaceholder: 'மாநிலம் அல்லது கட்சி பெயரில் தேடுங்கள்…',
    resultsFor: 'முடிவுகள்',
    noResultsFor: 'முடிவுகள் இல்லை',
    result: 'முடிவு', results: 'முடிவுகள்',
    noStatesFound: 'எந்த மாநிலமும் அல்லது கட்சியும் கிடைக்கவில்லை',
    trySearching: '"கேரளா", "DMK", "BJP" அல்லது வேறு மாநில/கட்சி தேடுங்கள்',
    clearSearch: 'தேடலை அழி',
    seats: 'இடங்கள்',
    majority: 'பெரும்பான்மை',
    crossesMajority: 'பெரும்பான்மை கடந்தது',
    assemblyConstituencies: 'சட்டமன்றத் தொகுதிகள்',
    statusTopFive: '* முதல் ஐந்து கட்சிகளின் நிலை',
    parties: 'கட்சிகள்', leading: 'முன்னிலை', won: 'வெற்றி', total: 'மொத்தம்',
    totalCounted: 'மொத்த எண்ணிக்கை',
    countingInProgress: 'வாக்கு எண்ணிக்கை நடக்கிறது',
    viewDetails: 'விவரங்களைக் காண',
    legend: 'குறியீடு:',
    wonDeclared: 'வெற்றி (அறிவிக்கப்பட்டது)',
    majorityMark: 'பெரும்பான்மை எல்லை',
    allRightsReserved: '© 2026 VotersView. அனைத்து உரிமைகளும் பாதுகாக்கப்பட்டவை.',
    dataUpdated: 'தரவு எண்ணிக்கை மையங்களில் உள்ள திரும்பும் அதிகாரிகளிடமிருந்து நேரடியாக புதுப்பிக்கப்படுகிறது.',
    states: { ASSAM: 'அசாம்', KERALA: 'கேரளா', PUDUCHERRY: 'புதுச்சேரி', 'TAMIL NADU': 'தமிழ்நாடு', 'WEST BENGAL': 'மேற்கு வங்காளம்', MAHARASHTRA: 'மகாராஷ்டிரா' }
  },
  ml: {
    home: 'ഹോം', refresh: 'പുതുക്കുക',
    disclaimerLabel: 'നിരാകരണം:',
    disclaimerText: 'ബന്ധപ്പെട്ട എണ്ണൽ കേന്ദ്രങ്ങളിലെ റിട്ടേണിംഗ് ഓഫീസർമാർ സിസ്റ്റത്തിൽ നൽകുന്ന വിവരങ്ങൾ ECI പ്രദർശിപ്പിക്കുന്നു. ഓരോ AC/PC യുടെയും അന്തിമ ഡാറ്റ ഫോം-20 ൽ പങ്കിടും.',
    liveCounting: 'തത്സമയ വോട്ടെണ്ണൽ',
    heroTitle: 'നിയമസഭാ മണ്ഡലങ്ങളിലേക്കുള്ള പൊതുതിരഞ്ഞെടുപ്പ്',
    heroSubtitle: 'ട്രെൻഡുകളും ഫലങ്ങളും — മേയ് 2026',
    lastUpdated: 'അവസാനം അപ്ഡേറ്റ് ചെയ്തത്',
    generalTab: 'AC പൊതുതിരഞ്ഞെടുപ്പ്',
    byeTab: 'AC ഉപതിരഞ്ഞെടുപ്പ്',
    searchPlaceholder: 'സംസ്ഥാനം അല്ലെങ്കിൽ പാർട്ടി പേര് തിരയുക…',
    resultsFor: 'ഫലങ്ങൾ',
    noResultsFor: 'ഫലങ്ങൾ ഇല്ല',
    result: 'ഫലം', results: 'ഫലങ്ങൾ',
    noStatesFound: 'സംസ്ഥാനങ്ങളോ പാർട്ടികളോ കണ്ടെത്തിയില്ല',
    trySearching: '"കേരളം", "DMK", "BJP" അല്ലെങ്കിൽ മറ്റ് സംസ്ഥാനം/പാർട്ടി തിരയുക',
    clearSearch: 'തിരയൽ മായ്ക്കുക',
    seats: 'സീറ്റുകൾ',
    majority: 'ഭൂരിപക്ഷം',
    crossesMajority: 'ഭൂരിപക്ഷം കടന്നു',
    assemblyConstituencies: 'നിയമസഭാ മണ്ഡലങ്ങൾ',
    statusTopFive: '* ആദ്യ അഞ്ച് പാർട്ടികളുടെ സ്ഥിതി',
    parties: 'പാർട്ടികൾ', leading: 'മുന്നിൽ', won: 'ജയിച്ചു', total: 'ആകെ',
    totalCounted: 'ആകെ കണക്കാക്കി',
    countingInProgress: 'വോട്ടെണ്ണൽ നടക്കുന്നു',
    viewDetails: 'വിശദാംശങ്ങൾ കാണുക',
    legend: 'ഐതിഹ്യം:',
    wonDeclared: 'ജയിച്ചു (പ്രഖ്യാപിച്ചു)',
    majorityMark: 'ഭൂരിപക്ഷ അടയാളം',
    allRightsReserved: '© 2026 VotersView. എല്ലാ അവകാശങ്ങളും നിക്ഷിപ്തം.',
    dataUpdated: 'എണ്ണൽ കേന്ദ്രങ്ങളിലെ റിട്ടേണിംഗ് ഓഫീസർമാരിൽ നിന്ന് തത്സമയം ഡാറ്റ അപ്ഡേറ്റ് ചെയ്യുന്നു.',
    states: { ASSAM: 'അസം', KERALA: 'കേരളം', PUDUCHERRY: 'പോണ്ടിച്ചേരി', 'TAMIL NADU': 'തമിഴ്‌നാട്', 'WEST BENGAL': 'പശ്ചിമ ബംഗാൾ', MAHARASHTRA: 'മഹാരാഷ്ട്ര' }
  }
};

export interface PartyResult {
  name: string;
  shortName: string;
  color: string;
  leading: number;
  won: number;
}

export interface StateResult {
  state: string;
  totalSeats: number;
  parties: PartyResult[];
  headerColor: string;
  headerGradient: string;
  majorityMark: number;
}

@Component({
  selector: 'app-root',
  imports: [CommonModule, FormsModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit, OnDestroy {
  activeTab = signal<'general' | 'bye'>('general');
  lastUpdated = signal<string>('07:36 AM On 04/05/2026');
  currentTime = signal<string>('');
  showDisclaimer = signal<boolean>(true);
  searchQuery = signal<string>('');
  currentLang = signal<LangCode>('en');
  langDropdownOpen = signal<boolean>(false);
  selectedState = signal<StateResult | null>(null);
  selectedConstituencyName = signal<string>('');

  private timerInterval: ReturnType<typeof setInterval> | null = null;

  languages: Language[] = [
    { code: 'en', label: 'English',   nativeLabel: 'English',   flag: '🇬🇧' },
    { code: 'hi', label: 'Hindi',     nativeLabel: 'हिंदी',     flag: '🇮🇳' },
    { code: 'ta', label: 'Tamil',     nativeLabel: 'தமிழ்',     flag: '🇮🇳' },
    { code: 'ml', label: 'Malayalam', nativeLabel: 'മലയാളം',    flag: '🇮🇳' },
  ];

  t = computed(() => TRANSLATIONS[this.currentLang()]);

  currentLanguage = computed(() =>
    this.languages.find(l => l.code === this.currentLang())!
  );

  generalElections: StateResult[] = [
    {
      state: 'ASSAM', totalSeats: 126, majorityMark: 64,
      headerColor: '#b91c1c',
      headerGradient: 'linear-gradient(135deg, #b91c1c 0%, #ef4444 100%)',
      parties: [
        { name: 'BJP Alliance (NDA)', shortName: 'BJP+',  color: '#f97316', leading: 5, won: 62 },
        { name: 'AIUDF Alliance',     shortName: 'AIUDF', color: '#16a34a', leading: 3, won: 28 },
        { name: 'INC (Congress)',     shortName: 'INC',   color: '#2563eb', leading: 2, won: 15 },
        { name: 'AGP',               shortName: 'AGP',   color: '#7c3aed', leading: 1, won: 4  },
        { name: 'Others',            shortName: 'OTH',   color: '#6b7280', leading: 0, won: 2  },
      ]
    },
    {
      state: 'KERALA', totalSeats: 140, majorityMark: 71,
      headerColor: '#b45309',
      headerGradient: 'linear-gradient(135deg, #b45309 0%, #d97706 100%)',
      parties: [
        { name: 'LDF (Left Democratic Front)', shortName: 'LDF',  color: '#dc2626', leading: 12, won: 73 },
        { name: 'UDF (United Democratic Front)', shortName: 'UDF', color: '#2563eb', leading: 8,  won: 49 },
        { name: 'NDA (BJP+)',                    shortName: 'NDA', color: '#f97316', leading: 2,  won: 9  },
        { name: 'Others',                        shortName: 'OTH', color: '#6b7280', leading: 1,  won: 4  },
        { name: 'Independents',                  shortName: 'IND', color: '#8b5cf6', leading: 0,  won: 2  },
      ]
    },
    {
      state: 'PUDUCHERRY', totalSeats: 30, majorityMark: 16,
      headerColor: '#7c3aed',
      headerGradient: 'linear-gradient(135deg, #7c3aed 0%, #a855f7 100%)',
      parties: [
        { name: 'INC (Indian National Congress)', shortName: 'INC',   color: '#2563eb', leading: 2, won: 11 },
        { name: 'AINRC',                           shortName: 'AINRC', color: '#dc2626', leading: 1, won: 8  },
        { name: 'DMK',                             shortName: 'DMK',   color: '#1a1a1a', leading: 1, won: 5  },
        { name: 'BJP',                             shortName: 'BJP',   color: '#f97316', leading: 0, won: 2  },
        { name: 'Others',                          shortName: 'OTH',   color: '#6b7280', leading: 0, won: 2  },
      ]
    },
    {
      state: 'TAMIL NADU', totalSeats: 234, majorityMark: 118,
      headerColor: '#0f766e',
      headerGradient: 'linear-gradient(135deg, #0f766e 0%, #14b8a6 100%)',
      parties: [
        { name: 'DMK Alliance',   shortName: 'DMK+',  color: '#dc2626', leading: 18, won: 128 },
        { name: 'AIADMK Alliance',shortName: 'ADMK+', color: '#16a34a', leading: 7,  won: 62  },
        { name: 'BJP',            shortName: 'BJP',   color: '#f97316', leading: 3,  won: 10  },
        { name: 'DMDK',           shortName: 'DMDK',  color: '#7c3aed', leading: 1,  won: 3   },
        { name: 'Others',         shortName: 'OTH',   color: '#6b7280', leading: 1,  won: 4   },
      ]
    },
    {
      state: 'WEST BENGAL', totalSeats: 294, majorityMark: 148,
      headerColor: '#1d4ed8',
      headerGradient: 'linear-gradient(135deg, #1d4ed8 0%, #3b82f6 100%)',
      parties: [
        { name: 'AITC (Trinamool Congress)', shortName: 'AITC',  color: '#16a34a', leading: 10, won: 162 },
        { name: 'BJP',                       shortName: 'BJP',   color: '#f97316', leading: 5,  won: 80  },
        { name: 'Left Front',                shortName: 'LF',    color: '#dc2626', leading: 2,  won: 14  },
        { name: 'INC (Congress)',             shortName: 'INC',   color: '#2563eb', leading: 1,  won: 4   },
        { name: 'ISF / Others',              shortName: 'OTH',   color: '#6b7280', leading: 0,  won: 3   },
      ]
    }
  ];

  byeElections: StateResult[] = [
    {
      state: 'MAHARASHTRA', totalSeats: 5, majorityMark: 3,
      headerColor: '#0369a1',
      headerGradient: 'linear-gradient(135deg, #0369a1 0%, #0ea5e9 100%)',
      parties: [
        { name: 'Maha Vikas Aghadi', shortName: 'MVA', color: '#2563eb', leading: 1, won: 2 },
        { name: 'Mahayuti Alliance', shortName: 'MYT', color: '#f97316', leading: 0, won: 2 },
        { name: 'Others',            shortName: 'OTH', color: '#6b7280', leading: 0, won: 0 },
      ]
    }
  ];

  ngOnInit() {
    this.updateTime();
    this.timerInterval = setInterval(() => this.updateTime(), 30000);
  }

  ngOnDestroy() {
    if (this.timerInterval) clearInterval(this.timerInterval);
  }

  updateTime() {
    const now = new Date();
    this.currentTime.set(now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }));
  }

  setTab(tab: 'general' | 'bye') {
    this.activeTab.set(tab);
    this.searchQuery.set('');
  }

  dismissDisclaimer() {
    this.showDisclaimer.set(false);
  }

  onSearch(value: string) {
    this.searchQuery.set(value);
  }

  clearSearch() {
    this.searchQuery.set('');
  }

  selectLanguage(code: LangCode) {
    this.currentLang.set(code);
    this.langDropdownOpen.set(false);
  }

  toggleLangDropdown() {
    this.langDropdownOpen.update(v => !v);
  }

  closeLangDropdown() {
    this.langDropdownOpen.set(false);
  }

  getStateName(key: string): string {
    return this.t().states[key] ?? key;
  }

  getActiveElections(): StateResult[] {
    const all = this.activeTab() === 'general' ? this.generalElections : this.byeElections;
    const q = this.searchQuery().trim().toLowerCase();
    if (!q) return all;
    return all.filter(s =>
      s.state.toLowerCase().includes(q) ||
      (this.t().states[s.state] ?? '').toLowerCase().includes(q) ||
      s.parties.some(p => p.name.toLowerCase().includes(q) || p.shortName.toLowerCase().includes(q))
    );
  }

  hasNoResults(): boolean {
    return this.getActiveElections().length === 0 && this.searchQuery().trim().length > 0;
  }

  getTotalLeading(state: StateResult): number {
    return state.parties.reduce((acc, p) => acc + p.leading, 0);
  }

  getTotalWon(state: StateResult): number {
    return state.parties.reduce((acc, p) => acc + p.won, 0);
  }

  getLeadingParty(state: StateResult): PartyResult {
    return [...state.parties].sort((a, b) => (b.leading + b.won) - (a.leading + a.won))[0];
  }

  getBarWidth(party: PartyResult, total: number): number {
    const seats = party.leading + party.won;
    return total > 0 ? Math.round((seats / total) * 100) : 0;
  }

  hasMajority(state: StateResult): PartyResult | null {
    const leading = this.getLeadingParty(state);
    const total = leading.leading + leading.won;
    return total >= state.majorityMark ? leading : null;
  }

  getStatusColor(state: StateResult): string {
    return this.hasMajority(state) ? '#16a34a' : '#f97316';
  }

  getResultCountText(count: number): string {
    const tr = this.t();
    if (this.currentLang() === 'en') {
      return `${count} ${count === 1 ? tr.result : tr.results}`;
    }
    return `${count} ${tr.results}`;
  }

  openDetails(state: StateResult) {
    this.selectedState.set(state);
    this.selectedConstituencyName.set('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  closeDetails() {
    this.selectedState.set(null);
    this.selectedConstituencyName.set('');
  }

  getConstituencies(state: StateResult): Constituency[] {
    const names = CONSTITUENCY_NAMES[state.state] ?? [];
    const result: Constituency[] = [];
    let idx = 0;
    for (const party of state.parties) {
      for (let w = 0; w < party.won; w++) {
        if (idx >= names.length) break;
        result.push({
          name: names[idx++],
          partyShortName: party.shortName,
          partyColor: party.color,
          partyName: party.name,
          votes: 40000 + Math.floor(Math.random() * 60000),
          margin: 500 + Math.floor(Math.random() * 20000),
          status: 'Won',
        });
      }
    }
    for (const party of state.parties) {
      for (let l = 0; l < party.leading; l++) {
        if (idx >= names.length) break;
        result.push({
          name: names[idx++],
          partyShortName: party.shortName,
          partyColor: party.color,
          partyName: party.name,
          votes: 30000 + Math.floor(Math.random() * 40000),
          margin: 100 + Math.floor(Math.random() * 5000),
          status: 'Leading',
        });
      }
    }
    return result;
  }

  getSelectedConstituency(state: StateResult): Constituency | null {
    const name = this.selectedConstituencyName();
    if (!name) return null;
    return this.getConstituencies(state).find(c => c.name === name) ?? null;
  }

  detailConstituencies = computed(() => {
    const s = this.selectedState();
    return s ? this.getConstituencies(s) : [];
  });
}
