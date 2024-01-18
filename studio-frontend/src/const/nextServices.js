const services = [
  {
    name: "fake-service-date",
    serviceName: "fake-service-date",
    desc: {
      fr: {
        title: "Dates et heures",
        content:
          "Automatisez la détection des événements clés futurs ou passés et synchronisez-les avec votre calendrier",
      },
      en: {
        title: "Dates and times",
        content:
          "Automate the detection of future or past key moments and synchronize them with your calendar",
      },
      type: "date",
    },
    //icon: "/img/We10X-icon-theme/calendar.svg",
    disabled: true,
    scope: ["nlp", "api"],
    endpoints: [
      {
        endpoint: "/nlp-keyword-extraction",
        middlewares: ["logs"],
      },
    ],
    sub_services: {
      diarization: [],
      punctuation: [],
    },
  },
  {
    name: "fake-service-decision",
    serviceName: "fake-service-decision",
    desc: {
      fr: {
        title: "Relevé de décisions",
        content:
          "Gagnez du temps dans l'analyse des décisions : notre service d'extraction automatique simplifie la récupération des données clés.",
      },
      en: {
        title: "Decision making",
        content:
          "Save time in decision analysis: our automated extraction service simplifies the retrieval of key data.",
      },
      type: "decision",
    },
    disabled: true,
    scope: ["nlp", "api"],
    endpoints: [
      {
        endpoint: "/nlp-keyword-extraction",
        middlewares: ["logs"],
      },
    ],
    sub_services: {
      diarization: [],
      punctuation: [],
    },
  },
]

export default services
