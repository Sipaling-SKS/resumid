const { Type } = require("@google/genai");

const resumeExtractConfig = {
  systemInstruction: [
    {
      text: `
      You are a CV parsing assistant. Your task is to extract each CV section with fully structured content in JSON.

      Extract these sections if present:
      - Header
      - Summary/Profile
      - Work Experience
      - Education

      For each section:

      - Return the section title exactly as in the list above.
      - If the section is missing, skip it (do not return empty).

      - For simple sections like Header and Summary/Profile:
        - Return "content" as an array of strings (each meaningful line or item).

      - For complex sections like Work Experience and Education:
        - Return "content" as an array of objects with relevant fields.

      - All date periods must be returned as an object:
        {
          "start": "YYYY/MM",
          "end": "YYYY/MM" or null if ongoing
        }

      Example for Work Experience:
      {
        "company": "Taldio",
        "location": "Tangerang, Indonesia",
        "position": "Engineer Internship",
        "employment_type": "Internship",
        "period": { "start": "2023/11", "end": null },
        "responsibilities": [
          "Participated in the development of web-based applications using React.js, .NET Core Web API, Golang, Next.js, and Laravel",
          "Implemented clean and maintainable code",
          "Worked with microservices architecture and Azure DevOps pipelines"
        ]
      }

      Example for Education:
      {
        "institution": "Gunadarma University",
        "degree": "Bachelor of Informatics Engineering",
        "study_period": { "start": "2020/09", "end": "2024/08" },
        "score": "3.84 / 4.00",
        "notes": [
          "Bangkit Academy Cloud Computing Learning Path"
        ]
      }
      `
    }
  ],

  model: "gemini-2.5-flash",
  
  responseStruct: {
    type: Type.ARRAY,
    items: {
      type: Type.OBJECT,
      properties: {
        title: { type: Type.STRING },
        content: {
          oneOf: [
            {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
            {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  company: { type: Type.STRING },
                  location: { type: Type.STRING },
                  position: { type: Type.STRING },
                  employment_type: { type: Type.STRING, nullable: true },
                  period: {
                    type: Type.OBJECT,
                    properties: {
                      start: { type: Type.STRING },
                      end: { type: Type.STRING, nullable: true },
                    },
                    required: ["start", "end"],
                  },
                  responsibilities: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                  },

                  institution: { type: Type.STRING },
                  degree: { type: Type.STRING },
                  study_period: {
                    type: Type.OBJECT,
                    properties: {
                      start: { type: Type.STRING },
                      end: { type: Type.STRING, nullable: true },
                    },
                    required: ["start", "end"],
                  },
                  score: { type: Type.STRING }, 
                  notes: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                  },
                },
                additionalProperties: false,
              },
            },
          ],
        },
      },
      required: ["title", "content"],
    },
  },
  responseMimetype: "application/json",
};

module.exports = {
  resumeExtractConfig,
};
