
// Dilemma data voor de QuotesPage
export interface Dilemma {
  id: number;
  text: string;
  likeProfile: "Excel-ex" | "Dashboard Dater" | "BI-hunter";
  dislikeProfiles: Array<"Excel-ex" | "Dashboard Dater" | "BI-hunter">;
}

export interface ProfileData {
  id: "Excel-ex" | "Dashboard Dater" | "BI-hunter";
  title: string;
  description: string;
  tip: string;
}

export const dilemmas: Dilemma[] = [
  {
    id: 1,
    text: "Ik voel me het meest op m'n gemak in Excel.",
    likeProfile: "Excel-ex",
    dislikeProfiles: ["Dashboard Dater", "BI-hunter"]
  },
  {
    id: 2,
    text: "Geef mij maar één dashboard met alles erin, dan ben ik blij.",
    likeProfile: "Dashboard Dater",
    dislikeProfiles: ["Excel-ex", "BI-hunter"]
  },
  {
    id: 3,
    text: "Ik wil snappen hoe alle data precies met elkaar verbonden is.",
    likeProfile: "BI-hunter",
    dislikeProfiles: ["Dashboard Dater", "Excel-ex"]
  },
  {
    id: 4,
    text: "Liever zelf bouwen dan werken met een standaard template.",
    likeProfile: "BI-hunter",
    dislikeProfiles: ["Dashboard Dater", "Excel-ex"]
  },
  {
    id: 5,
    text: "Als ik snel inzicht nodig heb, dan vraag ik Finance om een rapportje.",
    likeProfile: "Excel-ex",
    dislikeProfiles: ["BI-hunter", "Dashboard Dater"]
  },
  {
    id: 6,
    text: "Als het rapport niet actueel is, gebruik ik het liever niet.",
    likeProfile: "Dashboard Dater",
    dislikeProfiles: ["Excel-ex"]
  },
  {
    id: 7,
    text: "Ik vind het leuk om te puzzelen met data, ook al kost het wat tijd.",
    likeProfile: "BI-hunter",
    dislikeProfiles: ["Dashboard Dater", "Excel-ex"]
  }
];

export const profiles: ProfileData[] = [
  {
    id: "Excel-ex",
    title: "Excel-ex",
    description: "Oei… jij hebt een knipperlichtrelatie met Excel. Je kent alle trucjes, maar diep vanbinnen weet je: dit is geen duurzame liefde. Rapportages kosten je elke maand weer tijd, frustratie en een halve lunchpauze. Het is tijd om verder te swipen. Je verdient beter. Denk: inzicht zonder gepruts.",
    tip: "Jij bent gemaakt voor VOXTUR analytics. Geef jezelf de rust die je verdient. Eén goed dashboard zegt meer dan duizend formules."
  },
  {
    id: "Dashboard Dater",
    title: "Dashboard Dater",
    description: "Jij weet wat je zoekt: overzicht, duidelijkheid en snelheid. Geen rapporten van 15 tabbladen, maar één dashboard waarmee je gelijk kunt schakelen. Je bent efficiënt, oplossingsgericht en wil niet eindeloos in data duiken – gewoon weten waar je staat.",
    tip: "Jij bent gemaakt voor VOXTUR Analytics. Alles wat je wil, niets wat je niet nodig hebt."
  },
  {
    id: "BI-hunter",
    title: "BI-hunter",
    description: "Data? Kom maar door. Jij houdt van sleutelen, combineren en diep duiken. Het moet kloppen tot achter de komma – liefst met een zelfgebouwde koppeling erbij. Jij bent de Sherlock Holmes van dashboards, maar vergeet soms: snelheid is óók inzicht.",
    tip: "Jij bent gemaakt voor VOXTUR Analytics. Laat de basis aan ons. Dan houd jij tijd over voor de echt spannende analyses."
  }
];
