const { Type } = require("@google/genai");

const resumeExtractConfig = {
  systemInstruction: [
    {
      text: `
      You are a CV parsing assistant. Your task is to extract each CV section with fully structured content in JSON.

      Extract these sections if present:
      - Summary
      - Work Experience
      - Education

      For each section:

      - Return the section title exactly as in the list above.
      - If the section is missing, skip it (do not return empty).

      - For simple sections like Summary:
        - Return "content" as a string (single summary text, not array)

      - For complex sections like Work Experience and Education:
        - Return "content" as an array of objects with relevant fields.

      - All date periods must be returned as an object:
        {
          "start": { "year": YYYY, "month": MM },
          "end": { "year": YYYY, "month": MM } or null if ongoing
        }

      Example for Work Experience:
      {
        "company": "Taldio",
        "location": "Tangerang, Indonesia",
        "position": "Engineer Internship",
        "employment_type": "Internship",
        "period": { "start": { "year": 2023, "month": 11 }, "end": null },
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
        "study_period": { "start": { "year": 2020, "month": 9 }, "end": { "year": 2024, "month": 8 } },
        "score": "3.84 / 4.00",
        "description": "Bangkit Academy Cloud Computing Learning Path"
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
        title: { 
          type: Type.STRING,
          enum: ["Summary", "Work Experience", "Education"]
        },
        content: {
          oneOf: [
            // Summary → string
            { type: Type.STRING },

            // Work Experience → array of objects
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
                      start: {
                        type: Type.OBJECT,
                        properties: {
                          year: { type: Type.INTEGER },
                          month: { type: Type.INTEGER }
                        },
                        required: ["year", "month"]
                      },
                      end: {
                        type: Type.OBJECT,
                        properties: {
                          year: { type: Type.INTEGER },
                          month: { type: Type.INTEGER }
                        },
                        required: ["year", "month"],
                        nullable: true
                      }
                    },
                    required: ["start", "end"]
                  },
                  responsibilities: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING }
                  }
                },
                required: ["company", "position", "period", "responsibilities"],
                additionalProperties: false
              }
            },

            // Education → array of objects
            {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  institution: { type: Type.STRING },
                  degree: { type: Type.STRING },
                  study_period: {
                    type: Type.OBJECT,
                    properties: {
                      start: {
                        type: Type.OBJECT,
                        properties: {
                          year: { type: Type.INTEGER },
                          month: { type: Type.INTEGER }
                        },
                        required: ["year", "month"]
                      },
                      end: {
                        type: Type.OBJECT,
                        properties: {
                          year: { type: Type.INTEGER },
                          month: { type: Type.INTEGER }
                        },
                        required: ["year", "month"],
                        nullable: true
                      }
                    },
                    required: ["start", "end"]
                  },
                  score: { type: Type.STRING },
                  description: { type: Type.STRING }
                },
                required: ["institution", "degree", "study_period"],
                additionalProperties: false
              }
            }
          ]
        }
      },
      required: ["title", "content"]
    }
  },
  responseMimetype: "application/json"
};

module.exports = {
  resumeExtractConfig
};
