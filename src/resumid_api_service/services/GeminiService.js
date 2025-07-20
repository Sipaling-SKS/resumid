const { GoogleGenAI } = require("@google/genai");

const path = require("path");
const dotenv = require("dotenv").config({
  path: path.resolve(__dirname, "../../../.env"),
});
const axios = require("axios");
const { GeminiConfig } = require("../constants/geminiConfig");

const TrGptRequestLog = require("../models/TrGptRequestLog");

const { API_IDEMPOTENCY_KEY } = require("../constants/global");
const ai = new GoogleGenAI({ apiKey: process.env.EXPRESS_GEMINI_API_KEY });

const AnalyzeResume = async (req) => {
  try {
    const response = await ai.models.generateContent({
      model: GeminiConfig.model,
      contents: GeminiConfig.mockupContent,
      config: {
        systemInstruction: GeminiConfig.systemInstruction,
        responseMimeType: GeminiConfig.responseMimetype,
        responseSchema: GeminiConfig.responseStruct,
      },
    });

    return JSON.parse(response.text);
  } catch (err) {
    console.log(err);
  }
};

const MockupAnalyzeResume = () => {
  const cvReview = [
    {
      conclusion: {
        career_recomendation: [
          "Junior Full-Stack Developer",
          "Backend Developer",
          "Cloud Developer",
          "Associate Software Engineer",
          "Web Developer",
        ],
        keyword_matching: [
          "Full-Stack Developer",
          "Backend Developer",
          "Software Engineer",
          "Cloud Engineer",
          "React.js",
          "Node.js",
          "Express.js",
          ".NET Core",
          "Golang",
          "Laravel",
          "JavaScript",
          "SQL",
          "MongoDB",
          "GCP",
          "Azure DevOps",
          "Microservices",
          "Agile",
          "Waterfall",
          "Clean Code",
          "Web Performance",
          "API Development",
        ],
        section_to_add: ["Awards", "Volunteering Experience (if tech-related)"],
        section_to_remove: [
          "Soft Skills (as a separate list, integrate into experience)",
        ],
      },
      content: [
        {
          title: "Header",
          value: {
            feedback: [
              "Use a professional email address that primarily features your name, such as 'calvin.danyalson@gmail.com' or a custom domain if available, to enhance professionalism.",
            ],
            pointer: ["Consider using a more professional email address."],
            score: 8,
            strength:
              "The header is concise and contains all essential contact information, including a professional LinkedIn profile link.",
            weaknesess:
              "The email address 'calvindany1102@gmail.com' is slightly informal; a more professional email address is always preferred for job applications.",
          },
        },
        {
          title: "Summary/Profile",
          value: {
            feedback: [
              "Highly motivated Informatics Engineer graduate with a strong GPA (3.84/4.00) and 2+ years of hands-on experience in Full-Stack web development. Proficient in React.js, Node.js, .NET Core, and cloud platforms like GCP and Azure DevOps, with a proven ability to deliver high-quality, scalable applications. Eager to contribute to innovative projects as a Junior Full-Stack Developer.",
            ],
            pointer: [
              "Incorporate specific technologies, key achievements, and a clear career focus.",
            ],
            score: 6,
            strength:
              "It quickly establishes the candidate's core expertise in website development and highlights adaptability with methodologies (waterfall, agile) and work styles (individual/team).",
            weaknesess:
              "The summary is too generic and lacks specific achievements, quantitative impact, or a clear career objective. It doesn't immediately 'hook' the reader or differentiate the candidate.",
          },
        },
        {
          title: "Work Experience",
          value: {
            feedback: [
              "Participated in supporting the development of web-based applications using React.js, .NET Core Web API, Golang, Next.js, and Laravel, contributing to improved application performance by X% and reducing bugs by Y% through clean code implementation.",
            ],
            pointer: [
              "Quantify achievements and reframe responsibilities into accomplishments with impact.",
            ],
            score: 7,
            strength:
              "Demonstrates involvement in diverse technologies (React.js, .NET Core, Golang, Next.js, Laravel) and important development practices like clean code, microservices, and agile methodologies. The 'Assistance Coach' role shows teaching and mentoring skills.",
            weaknesess:
              "Many bullet points describe responsibilities rather than quantifiable achievements. The 'Laboratory Assistance' role is less relevant to web development and could be condensed or rephrased to highlight transferable skills.",
          },
        },
        {
          title: "Education",
          value: {
            feedback: [
              "Relevant Coursework: Data Structures & Algorithms, Software Engineering, Database Systems, Web Programming (Add if space permits and relevant)",
            ],
            pointer: [
              "Consider adding relevant coursework if it aligns directly with target roles.",
            ],
            score: 9,
            strength:
              "The high GPA is a significant strength. The inclusion of Bangkit Academy adds substantial value, highlighting specialized learning in Cloud Computing and a significant certification (Associate Cloud Engineer).",
            weaknesess: "No major weaknesses; it's well-presented.",
          },
        },
        {
          title: "Skills",
          value: {
            feedback: [
              "Programming Languages: JavaScript, Golang, PHP\nFrameworks/Libraries: React.js, Next.js, Node.js (Express.js), .NET Framework, Laravel, CodeIgniter, Bootstrap, Tailwind CSS\nDatabases: SQL (MySQL, MariaDB, SQL Server), MongoDB, Firebase\nCloud Platforms: Google Cloud Platform (GCP), Azure DevOps\nTools/Other: Git, Internet Information Services (IIS), UML",
            ],
            pointer: [
              "Organize skills into categories for better clarity and scannability.",
            ],
            score: 8,
            strength:
              "A comprehensive list of relevant technical skills, covering front-end, back-end, databases, and cloud platforms. It shows versatility and a strong technical foundation.",
            weaknesess:
              "The list is long and could benefit from categorization (e.g., Programming Languages, Frameworks, Databases, Cloud, Tools) to improve readability and highlight expertise areas.",
          },
        },
        {
          title: "Projects",
          value: {
            feedback: [
              "For 'Batique - Web Developer': Developed interactive gallery and user profile pages with upload and like features using React, collaborating with a team of three. Designed and implemented a scalable database structure on Firebase services to manage user data and artwork posts.",
            ],
            pointer: [
              "Elaborate on the specific features developed, challenges overcome, and the impact of your contributions for each project.",
            ],
            score: 7,
            strength:
              "The candidate has a good number of projects, showcasing diverse technologies and full-stack capabilities (PHP, React, Node.js, various databases). They demonstrate understanding of SDLC phases (requirements analysis, design).",
            weaknesess:
              "Descriptions are somewhat generic. For example, 'Develop a web application' doesn't convey the complexity or impact. Specific achievements or features developed within each project are not always highlighted clearly, and the 'Job Desk on Project' for Batique and Rozaline could be integrated more smoothly.",
          },
        },
        {
          title: "Portfolios",
          value: {
            feedback: [
              "No specific revision needed for the CV, but ensure the linked portfolio is robust and showcases your best work.",
            ],
            pointer: [
              "Ensure the portfolio link is active and the content is well-presented.",
            ],
            score: 9,
            strength:
              "Providing a direct link to a portfolio website is excellent, allowing recruiters to quickly see live projects and code quality.",
            weaknesess:
              "No major weaknesses. Ensure the portfolio website is consistently updated and well-maintained.",
          },
        },
        {
          title: "Additional Informations",
          value: {
            feedback: [
              "Certifications: Associate Cloud Engineer (Google Cloud), Menjadi Cloud Engineer (Dicoding Indonesia), Belajar Dasar Pemrograman JavaScript (Dicoding Indonesia), Belajar Membuat Aplikasi Back-End untuk Pemula dengan Google Cloud (Dicoding Indonesia)\nAchievements: Chairman of Confucian Student Activity Unit at Gunadarma University",
            ],
            pointer: [
              "Differentiate certifications from other achievements and integrate soft skills into experience descriptions.",
            ],
            score: 7,
            strength:
              "Includes valuable soft skills, language proficiency, and relevant certifications/achievements. The 'Other activities' shows leadership potential.",
            weaknesess:
              "The achievements are listed as a single block; separating certifications from other achievements might improve clarity. 'Soft Skills' are general and could be evidenced by bullet points in Work Experience or Projects instead of just listed.",
          },
        },
      ],
      summary: {
        score: 7.5,
        value:
          "Calvin's CV demonstrates a solid technical foundation with a good range of skills and practical experience through internships and projects. The strongest sections are Education, Skills, and Portfolios, which clearly highlight academic success, technical capabilities, and a demonstrable body of work. The weakest section is the Summary/Profile, which lacks specificity and impact. The Work Experience and Projects sections, while strong in content, could be improved by focusing more on quantifiable achievements and the impact of the work, rather than just responsibilities.",
      },
    },
  ];

  return cvReview;
};

module.exports = {
  AnalyzeResume,
  MockupAnalyzeResume
};
