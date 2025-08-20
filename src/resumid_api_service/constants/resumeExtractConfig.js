// const { Type } = require("@google/genai");

// const resumeExtractConfig = {
//   systemInstruction: [
//     {
//       text: `
//       You are a CV parsing assistant. Your task is to extract each CV section with fully structured content in JSON.

//       Extract these sections if present:
//       - Summary
//       - Work Experience
//       - Education

//       For each section:

//       - Return the section title exactly as in the list above.
//       - If the section is missing, skip it (do not return empty).

//       - For simple sections like Summary:
//         - Return "content" as a string (single summary text, not array)

//       - For complex sections like Work Experience and Education:
//         - Return "content" as an array of objects with relevant fields.

//       - All date periods must be returned as an object:
//         {
//           "start": { "year": YYYY, "month": MM },
//           "end": { "year": YYYY, "month": MM } or null if ongoing
//         }

//       Example for Work Experience:
//       {
//         "company": "Taldio",
//         "location": "Tangerang, Indonesia",
//         "position": "Engineer Internship",
//         "employment_type": "Internship",
//         "period": { "start": { "year": 2023, "month": 11 }, "end": null },
//         "responsibilities": [
//           "Participated in the development of web-based applications using React.js, .NET Core Web API, Golang, Next.js, and Laravel",
//           "Implemented clean and maintainable code",
//           "Worked with microservices architecture and Azure DevOps pipelines"
//         ]
//       }

//       Example for Education:
//       {
//         "institution": "Gunadarma University",
//         "degree": "Bachelor of Informatics Engineering",
//         "study_period": { "start": { "year": 2020, "month": 9 }, "end": { "year": 2024, "month": 8 } },
//         "score": "3.84 / 4.00",
//         "description": "Bangkit Academy Cloud Computing Learning Path"
//       }
//       `
//     }
//   ],

//   model: "gemini-2.5-flash",

//   responseStruct: {
//     type: Type.ARRAY,
//     items: {
//       type: Type.OBJECT,
//       properties: {
//         title: { 
//           type: Type.STRING,
//           enum: ["Summary", "Work Experience", "Education"]
//         },
//         content: {
//           oneOf: [
//             // Summary → string
//             { type: Type.STRING },

//             // Work Experience → array of objects
//             {
//               type: Type.ARRAY,
//               items: {
//                 type: Type.OBJECT,
//                 properties: {
//                   company: { type: Type.STRING },
//                   location: { type: Type.STRING },
//                   position: { type: Type.STRING },
//                   employment_type: { type: Type.STRING, nullable: true },
//                   period: {
//                     type: Type.OBJECT,
//                     properties: {
//                       start: {
//                         type: Type.OBJECT,
//                         properties: {
//                           year: { type: Type.INTEGER },
//                           month: { type: Type.INTEGER }
//                         },
//                         required: ["year", "month"]
//                       },
//                       end: {
//                         type: Type.OBJECT,
//                         properties: {
//                           year: { type: Type.INTEGER },
//                           month: { type: Type.INTEGER }
//                         },
//                         required: ["year", "month"],
//                         nullable: true
//                       }
//                     },
//                     required: ["start", "end"]
//                   },
//                   responsibilities: {
//                     type: Type.ARRAY,
//                     items: { type: Type.STRING }
//                   }
//                 },
//                 required: ["company", "position", "period", "responsibilities"],
//               }
//             },

//             // Education → array of objects
//             {
//               type: Type.ARRAY,
//               items: {
//                 type: Type.OBJECT,
//                 properties: {
//                   institution: { type: Type.STRING },
//                   degree: { type: Type.STRING },
//                   study_period: {
//                     type: Type.OBJECT,
//                     properties: {
//                       start: {
//                         type: Type.OBJECT,
//                         properties: {
//                           year: { type: Type.INTEGER },
//                           month: { type: Type.INTEGER }
//                         },
//                         required: ["year", "month"]
//                       },
//                       end: {
//                         type: Type.OBJECT,
//                         properties: {
//                           year: { type: Type.INTEGER },
//                           month: { type: Type.INTEGER }
//                         },
//                         required: ["year", "month"],
//                         nullable: true
//                       }
//                     },
//                     required: ["start", "end"]
//                   },
//                   score: { type: Type.STRING },
//                   description: { type: Type.STRING }
//                 },
//                 required: ["institution", "degree", "study_period"],
//               }
//             }
//           ]
//         }
//       },
//       required: ["title", "content"]
//     }
//   },
//   responseMimetype: "application/json"
// };

// module.exports = {
//   resumeExtractConfig
// };

// const { Type } = require("@google/genai");

// const resumeExtractConfig = {
//   systemInstruction: [
//     {
//       text: `
//       You're a specialized CV parsing assistant designed to accurately extract and structure sections of a CV into a fully formed JSON format.

//       Extract these sections if present:
//        - Summary
//        - Work Experience
//        - Education

//       Your task is to read the provided CV information and generate a structured JSON output containing the following sections: summary (key: "summary"), work experiences (key: "workExperiences"), and educations (key: "educations"). 

//       Always include the "educations" key as an array, even if empty. Only extract education information from the text under headings like "Education", "Education & Training", or containing years and university/school names.

//       Example:
//       {
//         "summary": { "content": "Motivated software engineer with 3+ years experience." },
//         "workExperiences": [
//           {
//             "company": "OpenAI",
//             "location": "Remote",
//             "position": "Backend Developer",
//             "employment_type": "Full-time",
//             "period": { "start": { "year": 2022, "month": 5 }, "end": { "year": 2025, "month": 8 } },
//             "responsibilities": ["Develop backend APIs", "Optimize performance"]
//           }
//         ],
//         "educations": [
//           {
//             "institution": "MIT",
//             "degree": "BSc Computer Science",
//             "study_period": { "start": { "year": 2018, "month": 9 }, "end": { "year": 2022, "month": 6 } },
//             "score": "4.0 GPA",
//             "description": "Specialized in AI and Machine Learning"
//           }
//         ]
//       }
//       `
//     }
//   ],
//   model: "gemini-2.5-flash",

//   generationConfig: {
//     responseSchema: {
//       type: Type.OBJECT,
//       properties: {
//         summary: {
//           type: Type.OBJECT,
//           properties: {
//             content: { type: Type.STRING }
//           }
//         },
//         workExperiences: {
//           type: Type.ARRAY,
//           items: {
//             type: Type.OBJECT,
//             properties: {
//               company: { type: Type.STRING },
//               position: { type: Type.STRING },
//               location: { type: Type.STRING, nullable: true },
//               employment_type: { type: Type.STRING, nullable: true },
//               period: {
//                 type: Type.OBJECT,
//                 properties: {
//                   start: {
//                     type: Type.OBJECT,
//                     properties: {
//                       year: { type: Type.INTEGER },
//                       month: { type: Type.INTEGER }
//                     }
//                   },
//                   end: {
//                     type: Type.OBJECT,
//                     nullable: true,
//                     properties: {
//                       year: { type: Type.INTEGER },
//                       month: { type: Type.INTEGER }
//                     }
//                   }
//                 }
//               },
//               responsibilities: {
//                 type: Type.ARRAY,
//                 nullable: true,
//                 items: { type: Type.STRING }
//               }
//             }
//           }
//         },
//         educations: {
//           type: Type.ARRAY,
//           items: {
//             type: Type.OBJECT,
//             properties: {
//               institution: { type: Type.STRING },
//               degree: { type: Type.STRING },
//               study_period: {
//                 type: Type.OBJECT,
//                 properties: {
//                   start: {
//                     type: Type.OBJECT,
//                     properties: {
//                       year: { type: Type.INTEGER },
//                       month: { type: Type.INTEGER }
//                     }
//                   },
//                   end: {
//                     type: Type.OBJECT,
//                     nullable: true,
//                     properties: {
//                       year: { type: Type.INTEGER },
//                       month: { type: Type.INTEGER }
//                     }
//                   }
//                 }
//               },
//               score: { type: Type.STRING, nullable: true },
//               description: { type: Type.STRING, nullable: true }
//             }
//           }
//         }
//       }
//     },
//     responseMimeType: "application/json"
//   }
// };

// module.exports = { resumeExtractConfig };


// const { Type } = require("@google/genai");

// const resumeExtractConfig = {
//   systemInstruction: [
//     {
//       text: `
// You are a specialized CV parsing assistant. Your task is to extract the following sections into structured JSON:
// - summary → key: "summary"
// - work experiences → key: "workExperiences"
// - education → key: "educations"

// Rules:
// - Always include the key "educations" as an array. If no education info is found, return an empty array.
// - Extract education info from headings like "Education", "Academic", "Pendidikan" or any lines that mention degree, institution, or study period.
// - Even if the education section does not have an explicit heading, extract any degrees, institutions, study periods, scores, and descriptions from lines that resemble education.

// - If the study period (year/month) is missing, return it as null.

// Example:
// {
//   "summary": { "content": "Motivated software engineer with 3+ years experience." },
//   "workExperiences": [
//     {
//       "company": "OpenAI",
//       "location": "Remote",
//       "position": "Backend Developer",
//       "employment_type": "Full-time",
//       "period": { "start": { "year": 2022, "month": 5 }, "end": { "year": 2025, "month": 8 } },
//       "responsibilities": ["Develop backend APIs", "Optimize performance"]
//     }
//   ],
//   "educations": [
//     {
//       "institution": "Gunadarma University",
//       "degree": "BSc Informatics",
//       "study_period": { "start": { "year": 2020, "month": 8 }, "end": { "year": 2024, "month": 6 } },
//       "score": "GPA 3.86",
//       "description": "Focus on software development, data analytics, and machine learning"
//     },
//     {
//       "institution": "Bangkit Academy 2023",
//       "degree": "Machine Learning Cohort",
//       "study_period": { "start": { "year": 2023, "month": 2 }, "end": { "year": 2023, "month": 7 } },
//       "score": "Final Score: 91/100",
//       "description": "Best Capstone Presenters - Company capstone"
//     }
//   ]
// }
//       `
//     }
//   ],
//   model: "gemini-2.5-flash",
//   generationConfig: {
//     responseSchema: {
//       type: Type.OBJECT,
//       properties: {
//         summary: {
//           type: Type.OBJECT,
//           properties: {
//             content: { type: Type.STRING }
//           },
//           required: ["content"],
//         },
//         workExperiences: {
//           type: Type.ARRAY,
//           items: {
//             type: Type.OBJECT,
//             properties: {
//               company: { type: Type.STRING },
//               position: { type: Type.STRING },
//               location: { type: Type.STRING, nullable: true },
//               employment_type: { type: Type.STRING, nullable: true },
//               period: {
//                 type: Type.OBJECT,
//                 properties: {
//                   start: {
//                     type: Type.OBJECT,
//                     properties: {
//                       year: { type: Type.INTEGER },
//                       month: { type: Type.INTEGER, nullable: true }
//                     }
//                   },
//                   end: {
//                     type: Type.OBJECT,
//                     nullable: true,
//                     properties: {
//                       year: { type: Type.INTEGER },
//                       month: { type: Type.INTEGER, nullable: true }
//                     }
//                   }
//                 }
//               },
//               responsibilities: {
//                 type: Type.ARRAY,
//                 nullable: true,
//                 items: { type: Type.STRING }
//               }
//             }
//           }
//         },
//         educations: {
//           type: Type.ARRAY,
//           items: {
//             type: Type.OBJECT,
//             properties: {
//               institution: { type: Type.STRING },
//               degree: { type: Type.STRING },
//               study_period: {
//                 type: Type.OBJECT,
//                 properties: {
//                   start: {
//                     type: Type.OBJECT,
//                     properties: {
//                       year: { type: Type.INTEGER },
//                       month: { type: Type.INTEGER, nullable: true }
//                     }
//                   },
//                   end: {
//                     type: Type.OBJECT,
//                     nullable: true,
//                     properties: {
//                       year: { type: Type.INTEGER },
//                       month: { type: Type.INTEGER, nullable: true }
//                     }
//                   }
//                 }
//               },
//               score: { type: Type.STRING, nullable: true },
//               description: { type: Type.STRING, nullable: true }
//             }
//           }
//         }
//       }
//     },
//     responseMimeType: "application/json"
//   }
// };

// module.exports = { resumeExtractConfig };

const { Type } = require("@google/genai");

const resumeExtractConfig = {
  systemInstruction: [
    {
      text: `
      You are a specialized CV parsing assistant. Your task is to extract the following sections into structured JSON:
      - summary → key: "summary"
      - work experiences → key: "workExperiences"
      - education → key: "educations"
      - skills → key: "skills"

      Rules:
      - Always include the key "educations" as an array.
      - Always include the key "skills" as an array. If no skills are found, return an empty array.
      - Extract education info from headings like "Education", "Academic", "Pendidikan" or any lines that mention degree, institution, or study period.
      - Extract skills from headings like "Skills", "Technical Skills", "Core Competencies", "Technologies", "Tools", or any section listing programming languages, frameworks, tools, soft skills, etc.
      - Even if the education section does not have an explicit heading, extract any degrees, institutions, study periods, scores, and descriptions from lines that resemble education.
      - Even if the skills section does not have an explicit heading, extract any technical skills, programming languages, frameworks, tools, or competencies mentioned throughout the CV.

      - Period dates should be in YYYY-MM format (e.g., "2022-05", "2025-08", "2020-08", "2024-08").
      - Start date is always required and cannot be null.
      - End date can be null if the position/education is current/ongoing (not as string "null").
      - Skills should be extracted as individual strings in an array, covering technical skills, programming languages, frameworks, tools, soft skills, certifications, etc.

      Example:
      {
        "summary": { "content": "Motivated software engineer with 3+ years experience." },
        "workExperiences": [
          {
            "company": "OpenAI",
            "location": "Remote",
            "position": "Backend Developer",
            "employment_type": "Full-time",
            "period": { "start": "2022-05", "end": "2025-08" },
            "description": "Develop backend APIs and optimize performance for high-traffic applications"
          }
        ],
        "educations": [
          {
            "institution": "Gunadarma University",
            "degree": "BSc Informatics",
            "period": { "start": "2020-08", "end": "2024-08" },
            "description": "Focus on software development, data analytics, and machine learning"
          },
          {
            "institution": "Bangkit Academy 2023",
            "degree": "Machine Learning Cohort",
            "period": { "start": "2023-02", "end": "2023-07" },
            "description": "Best Capstone Presenters - Company capstone"
          }
        ],
        "skills": [
          "JavaScript",
          "Python",
          "React",
          "Node.js",
          "MongoDB",
          "Machine Learning",
          "Data Analysis",
          "Project Management",
          "Team Leadership",
          "Agile Methodology"
        ]
      }
      `
    }
  ],
  model: "gemini-2.5-flash",
  generationConfig: {
    responseSchema: {
      type: Type.OBJECT,
      properties: {
        summary: {
          type: Type.OBJECT,
          properties: {
            content: { type: Type.STRING }
          },
          required: ["content"],
        },
        workExperiences: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              company: { type: Type.STRING },
              position: { type: Type.STRING },
              location: { type: Type.STRING, nullable: true },
              employment_type: { type: Type.STRING, nullable: true },
              period: {
                type: Type.OBJECT,
                properties: {
                  start: { type: Type.STRING },
                  end: { type: Type.STRING, nullable: true }
                },
                required: ["start"]
              },
              description: {
                type: Type.STRING
              }
            },
            required: ["company", "position", "period", "description"]
          }
        },
        educations: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              institution: { type: Type.STRING },
              degree: { type: Type.STRING },
              period: {
                type: Type.OBJECT,
                properties: {
                  start: { type: Type.STRING },
                  end: { type: Type.STRING, nullable: true }
                },
                required: ["start"]
              },
              description: { type: Type.STRING }
            },
            required: ["institution", "degree", "period", "description"]
          }
        },
        skills: {
          type: Type.ARRAY,
          items: {
            type: Type.STRING
          }
        }
      },
      required: ["summary", "workExperiences", "educations", "skills"]
    },
    responseMimeType: "application/json"
  }
};


module.exports = { resumeExtractConfig };