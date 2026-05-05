import { Component, signal, computed, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

export interface Constituency {
  name: string;
  candidateName: string;
  partyShortName: string;
  partyColor: string;
  partyName: string;
  votes: number;
  margin: number;
  status: 'Won' | 'Leading';
}

export interface PrevElecParty {
  name: string;
  shortName: string;
  color: string;
  won: number;
  voteShare: number;
}

export interface PrevElecRecord {
  state: string;
  year: number;
  totalSeats: number;
  majorityMark: number;
  headerColor: string;
  headerGradient: string;
  winner: string;
  parties: PrevElecParty[];
}

const CANDIDATE_POOL: Record<string, string[]> = {
  'ASSAM': [
    'Himanta Biswa Sarma','Atul Bora','Ranjit Kumar Dass','Pijush Hazarika','Ajanta Neog',
    'Pradyut Bordoloi','Rockybul Hussain','Debabrata Saikia','Gaurav Gogoi','Abdul Khaleque',
    'Wazed Ali Choudhury','Aminul Islam','Siraj Uddin Ajmal','Bhumidhar Burman','Ranoj Pegu',
    'Rihon Daimary','Phani Bhushan Choudhury','Rekibuddin Ahmed','Ripun Bora','Bijoy Chakravarty',
    'Rupjyoti Kurmi','Siddhartha Bhattacharya','Binanda Kumar Saikia','Mrinal Kumar Saikia',
    'Krishak Mukhya','Ghanashyam Das','Tapan Gogoi','Dilip Paul','Ramendra Narayan Kalita',
    'Subimal Bhattacharjee','Sibu Misra','Dilip Kumar Barua','Jagadish Bhuyan','Susanta Borgohain',
    'Probin Gogoi','Rajib Lochan Pegu','Robin Bordoloi','Bhola Nath Das','Raben Das','Mintu Das',
    'Paresh Chandra Baruah','Nripen Goswami','Pranab Gogoi','Bhaben Ray','Dhiren Das',
    'Saumen Phukan','Prashant Phukan','Jatin Bora','Habul Choudhury','Bhaben Choudhury',
    'Pradip Hazarika','Kaushik Rai','Binod Hazarika','Luhit Kumar Gogoi','Rajib Lochan Bora',
    'Hemanta Das','Rupak Sarmah','Subhash Das','Biswajit Das','Samiran Das',
    'Manoranjan Talukdar','Pradip Saikia','Rupak Gogoi','Rajib Saikia','Nripen Saikia',
    'Anup Rabha','Deben Deka','Ramen Deka','Biren Deka','Dilip Deka',
    'Subha Narayan Das','Ratna Das','Mita Das','Sita Das','Anita Das',
    'Krishna Barman','Ranjit Barman','Bijit Barman','Sanjit Barman','Manu Barman',
    'Priyaranjan Choudhury','Tapan Choudhury','Bipul Choudhury','Nripen Choudhury','Dilip Choudhury',
    'Raben Bora','Tapan Bora','Dilip Bora','Nripen Bora','Hemanta Bora',
    'Manoranjan Gogoi','Pradip Gogoi','Dilip Gogoi','Nripen Gogoi','Tapan Gogoi2',
    'Ghanashyam Barua','Manab Barua','Prafulla Barua','Deepak Barua','Rajib Barua',
    'Lakhinandan Bora','Kushal Deka','Tarun Gogoi Jr','Subhash Sarma','Biswajit Sarma',
    'Jitendra Basumatary','Urkhao Gwra Brahma','Pradip Brahma','Ranjit Brahma','Mohan Brahma',
  ],
  'KERALA': [
    'Pinarayi Vijayan','K N Balagopal','V Sivankutty','V S Achuthanandan','Thomas Isaac',
    'Oommen Chandy','Ramesh Chennithala','V D Satheesan','K Muraleedharan','Shashi Tharoor',
    'K Sudhakaran','P K Kunhalikutty','M A Baby','Kodiyeri Balakrishnan','G Sudhakaran',
    'E P Jayarajan','A C Moideen','K Raju','Kadannappally Ramachandran','P Rajeeve',
    'M Vijin','K Dasan','P Sarin','Mathew T Thomas','E T Mohammed Basheer',
    'Jose K Mani','K M Mani','P C George','Francis George','Ben George',
    'K B Ganesh Kumar','Adoor Prakash','Aryadan Shoukath','T Siddique','Anwar Sadath',
    'K Babu','S Sarma','N Krishnakumar','V T Balram','Sreejith Pillai',
    'K D Prasenan','Maniyam Manoj','K Ansalan','Nidheesh','Venugopal',
    'Chitharanjan','O R Kelu','A N Shamseer','P A Mohammed Riyas','Antony Raju',
    'R Bindhu','J Mercykutty Amma','Veena George','K K Shailaja','K Anivar',
    'T J Vinodh','P K Sasi','I C Balakrishnan','V K Ibrahim Kunju','P Ubaid',
    'M Noushad','K M Shajahan','K P Kader','P Aisha Potta','N Samsudheen',
    'Jaleel','Kodikunnil Suresh','K C Venugopal','Dean Kuriakose','Hibi Eden',
    'Eldhose Kunnappilly','Mathew Kuzhalnadan','Anoop Jacob','Roji M John','Boby George',
    'P C Vishnunadh','Biju Krishna','N Jayaraj','V Sasi','K Sivadasan',
    'Thiruvanchoor Radhakrishnan','Anoop Jacob 2','Raju Abraham','Sunny Joseph','K Babu 2',
    'Jose Tom Pulikkunnel','Saji Cheriyan','T N Prathapan','Suresh Kurup','Krishna Pillai',
  ],
  'PUDUCHERRY': [
    'N Rangasamy','V Narayanasamy','R Kamaraj','A Namassivayam','E Theeppainathan',
    'M Kandasamy','John Kumar','M Malladi Krishna Rao','R Siva','K Lakshminarayanan',
    'A John Kumar','P Mohan','Solairajan','R Soundararajan','T Thamimun Ansari',
    'M O H Farook','Chandira Priyanga','Ayyakannu','A M H Nazeem','Jayaganesh',
    'Ramalingam','Subramani','Murugesan','Anbalagan','Periyasamy',
    'Selvam','Krishnamoorthy','Vaithiyanathan','Thangavelu','Boominathan',
  ],
  'TAMIL NADU': [
    'M K Stalin','Edappadi K Palaniswami','O Panneerselvam','Duraimurugan','T R Baalu',
    'Udhayanidhi Stalin','Kanimozhi','S Vaikundarajan','R S Bharathi','I Periyasami',
    'Thangam Thennarasu','Ma Subramanian','K N Nehru','V Senthilbalaji','P T R Palanivel Thiagarajan',
    'E V Velu','S Rajenthra Bhalaji','S Muthusubramanian','Kaveri Selvaraj','Durai Murugan Jr',
    'P Moorthy','G Baskaran','K Pitchandi','R Rajendran','S Krishnan',
    'M Anbazhagan','K Selvaperunthagai','I Suresh','N Kayalvizhi','V Parthasarathy',
    'R Murugan','K Annamalai','L Murugan','Nainar Nagendran','Tamilisai Soundararajan',
    'A Bakulabharathi','H Raja','C Ve Shanmugam','O S Manian','P S Raamojee',
    'N Srinivasan','T Sundaram','T Velmurugan','K Palaniswami','A Venkatachalam',
    'R Kamaraj','Vanitha Krishnakumar','P Mariyammal','V Geetha','S Kavitha',
    'K Selvam','M Murugesan','P Annamalai','R Sivakumar','V Ramar',
    'T S Subramanian','K Suresh','V Saminathan','G Subramaniam','S Elangovan',
    'M Sekar','A Jeevanandham','P Marimuthu','R Rajan','K Rajendran',
    'N Chandrasekaran','R Periasamy','K Thirumavalavan','K Balakrishnan','S Arumugam',
    'R Sakkarapani','P Palaniappan','D Jayakumar','C Vijayabaskar','S Sellur Raju',
    'Vaigaichelvan','Natham Viswanathan','S Velumani','Jayagopal','Manikandan',
    'R Sathiyaprakash','S Ganesan','M Boominathan','Balasubramanian','Ravishankar',
    'Soundararajan','Krishnamoorthi','Muthusamy','Shanmugam','Veeramani',
    'Pandiyan','Rajasekaran','Anandraj','Eswaran','Murugesan',
    'Velusamy','Karuppusamy','Selvakumar','Chinnaraj','Ramasamy',
    'Kandasamy','Duraisamy','Arumugam','Ramamoorthy','Senthilkumar',
    'Kathiravan','Ganapathy','Subramaniam','Ponraj','Chellaiah',
    'Palaniyappan','Periasamy','Manoharan','Nallakannu','Venugopal',
    'Kumaresan','Sivasankaran','Tamilmani','Baskaran','Gopalan',
    'Vasanthi','Padmavathi','Meenakshi','Chitra','Malathi',
  ],
  'WEST BENGAL': [
    'Mamata Banerjee','Abhishek Banerjee','Suvendu Adhikari','Firhad Hakim','Madan Mitra',
    'Aroop Biswas','Subrata Mukherjee','Partha Chatterjee','Sujit Bose','Chandrima Bhattacharya',
    'Dilip Ghosh','Suvendu Adhikari Jr','Mukul Roy','Sisir Adhikari','Tapas Roy',
    'Rajib Banerjee','Jitendra Tiwari','Mihir Goswami','Sandip Ghosh','Raju Banerjee',
    'Biplab Kumar Mitra','Ashok Bhattacharya','Sujan Chakraborty','Tanmoy Bhattacharya','Rabin Deb',
    'Mohammad Salim','Biman Bose','Surjya Kanta Mishra','Kanti Ganguly','Nilotpal Basu',
    'Pradip Bhattacharya','Adhir Ranjan Chowdhury','Somen Mitra','Prashanta Kishori Roy','Abdur Rezzak Molla',
    'Idris Ali','Haji Nurul Islam','Abu Taher Khan','Manirul Islam','Siddiqullah Chowdhury',
    'Sobhandeb Chattopadhyay','Tapan Dasgupta','Debasish Kumar','Atindra Nath Ghosh','Pradip Majumdar',
    'Krishnendu Narayan Choudhury','Goutam Deb','Udayan Guha','Samir Chakrabarti','Kanai Lal Agarwal',
    'Prabir Ghoshal','Samir Ghosh','Sushil Mandal','Pradip Roy','Ashim Kumar Ghosh',
    'Narendranath Chakraborty','Uttam Kumar Ghosh','Bappaditya Ghosh','Dipak Kumar Sanyal','Swapan Debnath',
    'Chiranjib Bhattacharjee','Srikanta Mahato','Arunava Sinha','Palash Mandal','Rajesh Sarkar',
    'Debalina Hembram','Sona Ram Soren','Manoj Kumar Mandal','Biswanath Das','Parimal Suklabaidya',
    'Ajoy De','Provas Sarkar','Swapan Dasgupta','Locket Chatterjee','Babul Supriyo',
    'Saumitra Khan','Arjun Singh','Jyotirmoy Singh Mahato','Subhrangshu Roy','Dibyendu Adhikari',
    'Mriganka Mahato','Tushar Kanti Bhattacharya','Sabyasachi Dutta','Srikumar Mukherjee','Manas Ranjan Bhunia',
    'Jayanta Naskar','Shyamal Mandal','Arup Roy','Nirmal Ghosh','Sajal Ghosh',
    'Ratan Bose','Tapan Bose','Dulal Das','Kaushik Ghosh','Samit Dasgupta',
    'Gopal Dey','Subhas Naskar','Swapan Naskar','Tapan Naskar','Ranjit Naskar',
    'Samran Halder','Munjur Ahmed Lashkar','Jafar Ahmed','Rabiul Islam','Nurul Islam',
    'Humayun Kabir','Iqbal Ahmed','Zayed Ahmed','Rejaur Rahman','Sirajul Islam',
    'Goutam Chakraborty','Sujit Chakraborty','Tapan Chakraborty','Dulal Chakraborty','Raju Chakraborty',
    'Dulal Bar','Tapan Bar','Ranjit Bar','Kanai Bar','Sunil Bar',
    'Mohua Moitra','Aparupa Poddar','Satabdi Roy','Mimi Chakraborty','Nusrat Jahan',
    'Shashi Panja','Ratna De Nag','Kakoli Ghosh Dastidar','Arpita Ghosh','Locket Chatterjee2',
    'Biswajit Singha Roy','Swapan Singha Roy','Arjit Singha Roy','Kamal Singha Roy','Dilip Singha Roy',
    'Dulal Mukherjee','Tapan Mukherjee','Samit Mukherjee','Ranjit Mukherjee','Pradip Mukherjee',
  ],
};

const PREVIOUS_ELECTIONS: PrevElecRecord[] = [
  {
    state: 'ASSAM', year: 2021, totalSeats: 126, majorityMark: 64,
    headerColor: '#b91c1c', headerGradient: 'linear-gradient(135deg,#b91c1c,#ef4444)',
    winner: 'BJP Alliance (NDA)',
    parties: [
      { name: 'BJP Alliance (NDA)', shortName: 'BJP+',  color: '#f97316', won: 75, voteShare: 42.8 },
      { name: 'INC Alliance',       shortName: 'INC+',  color: '#2563eb', won: 50, voteShare: 39.6 },
      { name: 'AIUDF',              shortName: 'AIUDF', color: '#16a34a', won: 0,  voteShare: 7.8  },
      { name: 'Others',             shortName: 'OTH',   color: '#6b7280', won: 1,  voteShare: 9.8  },
    ]
  },
  {
    state: 'ASSAM', year: 2016, totalSeats: 126, majorityMark: 64,
    headerColor: '#b91c1c', headerGradient: 'linear-gradient(135deg,#b91c1c,#ef4444)',
    winner: 'BJP Alliance (NDA)',
    parties: [
      { name: 'BJP Alliance (NDA)', shortName: 'BJP+',  color: '#f97316', won: 86, voteShare: 41.9 },
      { name: 'INC',                shortName: 'INC',   color: '#2563eb', won: 26, voteShare: 31.0 },
      { name: 'AIUDF',              shortName: 'AIUDF', color: '#16a34a', won: 13, voteShare: 12.9 },
      { name: 'Others',             shortName: 'OTH',   color: '#6b7280', won: 1,  voteShare: 14.2 },
    ]
  },
  {
    state: 'ASSAM', year: 2011, totalSeats: 126, majorityMark: 64,
    headerColor: '#b91c1c', headerGradient: 'linear-gradient(135deg,#b91c1c,#ef4444)',
    winner: 'INC',
    parties: [
      { name: 'INC',                shortName: 'INC',   color: '#2563eb', won: 78, voteShare: 39.4 },
      { name: 'AIUDF',              shortName: 'AIUDF', color: '#16a34a', won: 18, voteShare: 17.3 },
      { name: 'AGP',                shortName: 'AGP',   color: '#7c3aed', won: 9,  voteShare: 16.2 },
      { name: 'BJP',                shortName: 'BJP',   color: '#f97316', won: 5,  voteShare: 11.5 },
      { name: 'Others',             shortName: 'OTH',   color: '#6b7280', won: 16, voteShare: 15.6 },
    ]
  },
  {
    state: 'KERALA', year: 2021, totalSeats: 140, majorityMark: 71,
    headerColor: '#b45309', headerGradient: 'linear-gradient(135deg,#b45309,#d97706)',
    winner: 'LDF (Left Democratic Front)',
    parties: [
      { name: 'LDF (Left Democratic Front)',   shortName: 'LDF', color: '#dc2626', won: 99, voteShare: 45.4 },
      { name: 'UDF (United Democratic Front)', shortName: 'UDF', color: '#2563eb', won: 41, voteShare: 40.2 },
      { name: 'NDA (BJP+)',                    shortName: 'NDA', color: '#f97316', won: 0,  voteShare: 12.4 },
      { name: 'Others',                        shortName: 'OTH', color: '#6b7280', won: 0,  voteShare: 2.0  },
    ]
  },
  {
    state: 'KERALA', year: 2016, totalSeats: 140, majorityMark: 71,
    headerColor: '#b45309', headerGradient: 'linear-gradient(135deg,#b45309,#d97706)',
    winner: 'LDF (Left Democratic Front)',
    parties: [
      { name: 'LDF (Left Democratic Front)',   shortName: 'LDF', color: '#dc2626', won: 91, voteShare: 43.5 },
      { name: 'UDF (United Democratic Front)', shortName: 'UDF', color: '#2563eb', won: 47, voteShare: 38.9 },
      { name: 'NDA (BJP+)',                    shortName: 'NDA', color: '#f97316', won: 1,  voteShare: 15.0 },
      { name: 'Others',                        shortName: 'OTH', color: '#6b7280', won: 1,  voteShare: 2.6  },
    ]
  },
  {
    state: 'KERALA', year: 2011, totalSeats: 140, majorityMark: 71,
    headerColor: '#b45309', headerGradient: 'linear-gradient(135deg,#b45309,#d97706)',
    winner: 'UDF (United Democratic Front)',
    parties: [
      { name: 'UDF (United Democratic Front)', shortName: 'UDF', color: '#2563eb', won: 72, voteShare: 45.8 },
      { name: 'LDF (Left Democratic Front)',   shortName: 'LDF', color: '#dc2626', won: 68, voteShare: 44.9 },
      { name: 'NDA (BJP+)',                    shortName: 'NDA', color: '#f97316', won: 0,  voteShare: 6.0  },
      { name: 'Others',                        shortName: 'OTH', color: '#6b7280', won: 0,  voteShare: 3.3  },
    ]
  },
  {
    state: 'PUDUCHERRY', year: 2021, totalSeats: 30, majorityMark: 16,
    headerColor: '#7c3aed', headerGradient: 'linear-gradient(135deg,#7c3aed,#a855f7)',
    winner: 'NDA (AINRC + BJP)',
    parties: [
      { name: 'AINRC',  shortName: 'AINRC', color: '#dc2626', won: 10, voteShare: 25.4 },
      { name: 'BJP',    shortName: 'BJP',   color: '#f97316', won: 6,  voteShare: 13.1 },
      { name: 'INC',    shortName: 'INC',   color: '#2563eb', won: 2,  voteShare: 15.8 },
      { name: 'DMK',    shortName: 'DMK',   color: '#1a1a1a', won: 6,  voteShare: 22.2 },
      { name: 'Others', shortName: 'OTH',   color: '#6b7280', won: 6,  voteShare: 23.5 },
    ]
  },
  {
    state: 'PUDUCHERRY', year: 2016, totalSeats: 30, majorityMark: 16,
    headerColor: '#7c3aed', headerGradient: 'linear-gradient(135deg,#7c3aed,#a855f7)',
    winner: 'INC Alliance',
    parties: [
      { name: 'INC',    shortName: 'INC',   color: '#2563eb', won: 15, voteShare: 35.5 },
      { name: 'AINRC',  shortName: 'AINRC', color: '#dc2626', won: 8,  voteShare: 22.3 },
      { name: 'AIADMK', shortName: 'ADMK',  color: '#16a34a', won: 4,  voteShare: 17.2 },
      { name: 'DMK',    shortName: 'DMK',   color: '#1a1a1a', won: 2,  voteShare: 11.5 },
      { name: 'Others', shortName: 'OTH',   color: '#6b7280', won: 1,  voteShare: 13.5 },
    ]
  },
  {
    state: 'PUDUCHERRY', year: 2011, totalSeats: 30, majorityMark: 16,
    headerColor: '#7c3aed', headerGradient: 'linear-gradient(135deg,#7c3aed,#a855f7)',
    winner: 'AINRC',
    parties: [
      { name: 'AINRC',  shortName: 'AINRC', color: '#dc2626', won: 15, voteShare: 30.1 },
      { name: 'INC',    shortName: 'INC',   color: '#2563eb', won: 7,  voteShare: 24.6 },
      { name: 'DMK',    shortName: 'DMK',   color: '#1a1a1a', won: 6,  voteShare: 19.9 },
      { name: 'Others', shortName: 'OTH',   color: '#6b7280', won: 2,  voteShare: 25.4 },
    ]
  },
  {
    state: 'TAMIL NADU', year: 2021, totalSeats: 234, majorityMark: 118,
    headerColor: '#0f766e', headerGradient: 'linear-gradient(135deg,#0f766e,#14b8a6)',
    winner: 'DMK Alliance',
    parties: [
      { name: 'DMK Alliance',    shortName: 'DMK+',  color: '#dc2626', won: 159, voteShare: 45.5 },
      { name: 'AIADMK Alliance', shortName: 'ADMK+', color: '#16a34a', won: 75,  voteShare: 38.0 },
      { name: 'BJP',             shortName: 'BJP',   color: '#f97316', won: 0,   voteShare: 2.6  },
      { name: 'Others',          shortName: 'OTH',   color: '#6b7280', won: 0,   voteShare: 13.9 },
    ]
  },
  {
    state: 'TAMIL NADU', year: 2016, totalSeats: 234, majorityMark: 118,
    headerColor: '#0f766e', headerGradient: 'linear-gradient(135deg,#0f766e,#14b8a6)',
    winner: 'AIADMK',
    parties: [
      { name: 'AIADMK',     shortName: 'ADMK', color: '#16a34a', won: 134, voteShare: 40.8 },
      { name: 'DMK+',       shortName: 'DMK+', color: '#dc2626', won: 98,  voteShare: 40.4 },
      { name: 'DMDK+',      shortName: 'DMDK', color: '#7c3aed', won: 1,   voteShare: 4.1  },
      { name: 'Others',     shortName: 'OTH',  color: '#6b7280', won: 1,   voteShare: 14.7 },
    ]
  },
  {
    state: 'TAMIL NADU', year: 2011, totalSeats: 234, majorityMark: 118,
    headerColor: '#0f766e', headerGradient: 'linear-gradient(135deg,#0f766e,#14b8a6)',
    winner: 'AIADMK Alliance',
    parties: [
      { name: 'AIADMK Alliance', shortName: 'ADMK+', color: '#16a34a', won: 203, voteShare: 38.4 },
      { name: 'DMK Alliance',    shortName: 'DMK+',  color: '#dc2626', won: 31,  voteShare: 39.5 },
      { name: 'Others',          shortName: 'OTH',   color: '#6b7280', won: 0,   voteShare: 22.1 },
    ]
  },
  {
    state: 'WEST BENGAL', year: 2021, totalSeats: 294, majorityMark: 148,
    headerColor: '#1d4ed8', headerGradient: 'linear-gradient(135deg,#1d4ed8,#3b82f6)',
    winner: 'AITC (Trinamool Congress)',
    parties: [
      { name: 'AITC (Trinamool Congress)', shortName: 'AITC', color: '#16a34a', won: 213, voteShare: 47.9 },
      { name: 'BJP',                       shortName: 'BJP',  color: '#f97316', won: 77,  voteShare: 38.1 },
      { name: 'ISF',                       shortName: 'ISF',  color: '#7c3aed', won: 1,   voteShare: 2.0  },
      { name: 'INC + Left',               shortName: 'INC+', color: '#2563eb', won: 0,   voteShare: 7.2  },
      { name: 'Others',                    shortName: 'OTH',  color: '#6b7280', won: 3,   voteShare: 4.8  },
    ]
  },
  {
    state: 'WEST BENGAL', year: 2016, totalSeats: 294, majorityMark: 148,
    headerColor: '#1d4ed8', headerGradient: 'linear-gradient(135deg,#1d4ed8,#3b82f6)',
    winner: 'AITC (Trinamool Congress)',
    parties: [
      { name: 'AITC (Trinamool Congress)', shortName: 'AITC', color: '#16a34a', won: 211, voteShare: 44.9 },
      { name: 'Left Front',               shortName: 'LF',   color: '#dc2626', won: 26,  voteShare: 25.7 },
      { name: 'INC',                      shortName: 'INC',  color: '#2563eb', won: 44,  voteShare: 12.3 },
      { name: 'BJP',                      shortName: 'BJP',  color: '#f97316', won: 3,   voteShare: 10.2 },
      { name: 'Others',                   shortName: 'OTH',  color: '#6b7280', won: 10,  voteShare: 6.9  },
    ]
  },
  {
    state: 'WEST BENGAL', year: 2011, totalSeats: 294, majorityMark: 148,
    headerColor: '#1d4ed8', headerGradient: 'linear-gradient(135deg,#1d4ed8,#3b82f6)',
    winner: 'AITC (Trinamool Congress)',
    parties: [
      { name: 'AITC + INC Alliance', shortName: 'AITC+', color: '#16a34a', won: 227, voteShare: 48.3 },
      { name: 'Left Front',          shortName: 'LF',    color: '#dc2626', won: 62,  voteShare: 41.1 },
      { name: 'BJP',                 shortName: 'BJP',   color: '#f97316', won: 0,   voteShare: 4.1  },
      { name: 'Others',              shortName: 'OTH',   color: '#6b7280', won: 5,   voteShare: 6.5  },
    ]
  },
];

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
  showPreviousElections = signal<boolean>(false);
  prevElecState = signal<string>('');
  prevElecYear = signal<string>('');

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
    const pool = CANDIDATE_POOL[state.state] ?? [];
    const result: Constituency[] = [];
    let idx = 0;
    for (const party of state.parties) {
      for (let w = 0; w < party.won; w++) {
        if (idx >= names.length) break;
        result.push({
          name: names[idx],
          candidateName: pool[idx % pool.length] ?? 'Candidate',
          partyShortName: party.shortName,
          partyColor: party.color,
          partyName: party.name,
          votes: 40000 + ((idx * 7919) % 60000),
          margin: 500 + ((idx * 3571) % 20000),
          status: 'Won',
        });
        idx++;
      }
    }
    for (const party of state.parties) {
      for (let l = 0; l < party.leading; l++) {
        if (idx >= names.length) break;
        result.push({
          name: names[idx],
          candidateName: pool[idx % pool.length] ?? 'Candidate',
          partyShortName: party.shortName,
          partyColor: party.color,
          partyName: party.name,
          votes: 30000 + ((idx * 6271) % 40000),
          margin: 100 + ((idx * 1327) % 5000),
          status: 'Leading',
        });
        idx++;
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

  openPreviousElections() {
    this.selectedState.set(null);
    this.showPreviousElections.set(true);
    this.prevElecState.set('');
    this.prevElecYear.set('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  closePreviousElections() {
    this.showPreviousElections.set(false);
    this.prevElecState.set('');
    this.prevElecYear.set('');
  }

  prevElecAvailableStates(): string[] {
    return [...new Set(PREVIOUS_ELECTIONS.map(r => r.state))].sort();
  }

  prevElecYearsForState(): number[] {
    const st = this.prevElecState();
    if (!st) return [];
    return PREVIOUS_ELECTIONS.filter(r => r.state === st).map(r => r.year).sort((a, b) => b - a);
  }

  prevElecRecord = computed((): PrevElecRecord | null => {
    const st = this.prevElecState();
    const yr = this.prevElecYear();
    if (!st || !yr) return null;
    return PREVIOUS_ELECTIONS.find(r => r.state === st && r.year === +yr) ?? null;
  });

  prevElecTotalWon(rec: PrevElecRecord): number {
    return rec.parties.reduce((s, p) => s + p.won, 0);
  }

  prevElecBarWidth(party: PrevElecParty, rec: PrevElecRecord): number {
    return rec.totalSeats > 0 ? Math.round((party.won / rec.totalSeats) * 100) : 0;
  }
}
