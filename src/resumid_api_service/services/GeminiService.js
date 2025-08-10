const { GoogleGenAI } = require("@google/genai");

const path = require("path");
const dotenv = require("dotenv").config({
  path: path.resolve(__dirname, "../../../.env"),
});
const axios = require("axios");
const { GeminiConfig } = require("../constants/geminiConfig");
const { resumeExtractConfig } = require("../constants/resumeExtractConfig");


const TrGptRequestLog = require("../models/TrGptRequestLog");

const { API_IDEMPOTENCY_KEY } = require("../constants/global");
const TrGeminiRequestLog = require("../models/TrGeminiRequestLog");
const ai = new GoogleGenAI({ apiKey: process.env.EXPRESS_GEMINI_API_KEY });

const AnalyzeResume = async (req) => {
  const cvContent = req.body.cvContent;
  const jobTitle = req.body.jobTitle;

  const promptBody = `Job Title: ${jobTitle}. CV Content: ${cvContent}`;

  const now = new Date();
  const expired_date = new Date(now.getTime() + 2 * 60 * 1000);

  try {
    const response = await ai.models.generateContent({
      model: GeminiConfig.model,
      contents: promptBody.replace('<ACK0007>', '\''),
      config: {
        systemInstruction: GeminiConfig.systemInstruction,
        responseMimeType: GeminiConfig.responseMimetype,
        responseSchema: GeminiConfig.responseStruct,
      },
    });

    const newData = new TrGeminiRequestLog({
      idempotency_key: req.headers[API_IDEMPOTENCY_KEY],
      gemini_request: JSON.stringify(req.body),
      gemini_response: JSON.stringify(response.text),
      expired_date: expired_date,
      created_at: now,
      updated_at: now,
    });

    await newData.save();
    console.log(JSON.parse(response.text)[0])
    return JSON.parse(response.text)[0];
  } catch (err) {
    console.log(err);
  }
};

const MockupAnalyzeResume = (req) => {
  const cvContent = req.body.cvContent;
  const jobTitle = req.body.jobTitle;
  console.log(cvContent);
  console.log(jobTitle);

  const cvReview = {
    conclusion: {
      career_recomendation: [
        "Junior Full-stack Developer",
        "Junior Back-end Developer",
        "Associate Cloud Engineer",
        "Software Engineer (Web)",
      ],
      keyword_matching: [
        "React.js",
        "Next.js",
        ".NET Core",
        "Golang",
        "Node.js",
        "Express.js",
        "Laravel",
        "JavaScript",
        "PHP",
        "SQL",
        "MongoDB",
        "Git",
        "Google Cloud Platform",
        "Azure DevOps",
        "Microservices",
        "Agile",
        "Waterfall",
        "Full-stack",
        "Back-end",
        "Web Development",
        "IIS",
      ],
      section_to_add: ["Certifications (as a standalone section)"],
      section_to_remove: ["Bachelor Degree line from Header"],
    },
    content: [
      {
        title: "Header",
        value: {
          feedback: [
            {
              feedback_message:
                "The educational information in the header clutters the contact details and should be moved to the dedicated Education section for clarity and conciseness.",
              revision_example:
                "CALVIN DANYALSON | 08972920986 | calvindany1102@gmail.com | https://www.linkedin.com/in/calvin-danyalson-a87295234/ | Depok, Indonesia 16413",
            },
          ],
          pointer: ["Remove educational information from the header."],
          score: 8,
          strength:
            "The header includes all essential contact information, a professional LinkedIn profile link, and location, making it easy for recruiters to reach out.",
          weaknesess:
            "Including the full degree title in the header unnecessarily duplicates information and clutters the top section, which should be reserved for primary contact details.",
        },
      },
      {
        title: "Summary/Profile",
        value: {
          feedback: [
            {
              feedback_message:
                "To maximize impact, integrate specific technologies, career focus, and a hint of quantifiable achievement to immediately convey your capabilities and career aspirations.",
              revision_example:
                "Proactive Informatics Engineering graduate with hands-on experience in full-stack web development using React.js, Next.js, .NET Core, and Golang. Proficient in Agile and Waterfall methodologies, with a proven ability to deliver clean code and contribute effectively to team environments. Eager to leverage strong technical skills and a passion for learning new technologies to contribute to innovative web application development.",
            },
          ],
          pointer: [
            "Make it more impactful by including key skills, a specific career focus, and demonstrating immediate value.",
          ],
          score: 6,
          strength:
            "The summary highlights key development methodologies (waterfall, agile) and a positive attitude towards learning new technologies and collaborative work.",
          weaknesess:
            "The current summary is too generic and lacks specific technical keywords, quantifiable achievements, and a clear career objective. 'Experienced' is vague for a recent graduate with internship experience.",
        },
      },
      {
        title: "Work Experience",
        value: {
          feedback: [
            {
              feedback_message:
                "Transform bullet points into accomplishment statements that detail the impact of your work, utilizing action verbs and quantifying results where possible. Focus on what you 'achieved' rather than just 'participated in'.",
              revision_example:
                "Contributed to the development of web-based applications using React.js, .NET Core Web API, Golang, Next.js, and Laravel, enhancing system functionality and user experience.Managed and optimized Azure DevOps pipelines for continuous integration and deployment, resulting in streamlined development workflows and improved release efficiency.",
            },
          ],
          pointer: [
            "Rephrase bullet points to focus on impact and quantify results where possible.",
          ],
          score: 8,
          strength:
            "Demonstrates diverse technical exposure across multiple programming languages and frameworks (React.js, .NET Core, Golang, Next.js, Laravel) and practical experience with advanced concepts like microservices and Azure DevOps. Includes valuable teaching and technical support experience.",
          weaknesess:
            "Many bullet points describe responsibilities rather than achievements. Phrases like 'Participating in supporting' or 'Implementing clean and maintainable code' are weak and could be strengthened with more specific, results-oriented language.",
        },
      },
      {
        title: "Education",
        value: {
          feedback: [
            {
              feedback_message:
                "Ensure all entries, especially those from university or structured programs, follow a consistent date format (e.g., Month YYYY – Month YYYY) to maintain a professional appearance.",
              revision_example:
                "Gunadarma University - Depok, Indonesia | Strata 1 (S1) in Major in Informatics Engineer | September 2020 – August 2024 | GPA: 3.84 / 4.00",
            },
          ],
          pointer: [
            "Ensure consistent date formatting for all educational entries.",
          ],
          score: 9,
          strength:
            "Clearly states the university, degree, GPA, and graduation period. The inclusion of Bangkit Academy and its specific learning path, including collaboration on a project and the Associate Cloud Engineer certification, significantly strengthens this section.",
          weaknesess:
            "No significant weaknesses; the section is well-structured and informative.",
        },
      },
      {
        title: "Skills",
        value: {
          feedback: [
            {
              feedback_message:
                "Categorize your skills (e.g., Programming Languages, Frameworks, Databases, Cloud Platforms) to improve readability and allow recruiters to quickly identify relevant expertise. Correct 'JavaScripts' to 'JavaScript' and consolidate '.NET Framework' with '.NET Core' if it's the more relevant skill.",
              revision_example:
                "Programming Languages: JavaScript, Go, PHP, C# | Front-End: React.js, Next.js, Tailwind CSS, Bootstrap | Back-End Frameworks: Node.js (Express.js), .NET Core, Laravel, CodeIgniter | Databases: MySQL, MariaDB, SQL Server, MongoDB, Firebase | Cloud & DevOps: Google Cloud Platform (GCP), Azure DevOps, Internet Information Services (IIS) | Tools & Version Control: Git, npm, yarn",
            },
          ],
          pointer: [
            "Categorize skills for better readability and ensure correct naming conventions for technologies.",
          ],
          score: 8,
          strength:
            "Provides a comprehensive list of relevant technical skills, covering front-end, back-end, databases, version control, and cloud platforms, demonstrating a wide range of capabilities.",
          weaknesess:
            "The skills are presented as a flat list, which can be less scannable. 'JavaScripts' is a common typo and should be 'JavaScript'. '.NET Framework' could be updated to '.NET Core' or be more specific if both are applicable.",
        },
      },
      {
        title: "Projects",
        value: {
          feedback: [
            {
              feedback_message:
                "Condense project descriptions to focus on the most impactful contributions and outcomes. Use strong action verbs and highlight specific technical challenges overcome or value delivered, rather than listing 'Job Desks'.",
              revision_example:
                "**Stockedge App** - E-Commerce Web Application (Node.js, Express.js, MongoDB) | April 2023 – May 2023 | Developed a full-stack e-commerce web application with Node.js and Express.js (MVC pattern), enhancing small business operations. Designed and implemented a NoSQL database (MongoDB) structure for efficient data management, optimizing data retrieval for product catalogs.",
            },
          ],
          pointer: [
            "Condense project descriptions to highlight key contributions and quantifiable results.",
          ],
          score: 8,
          strength:
            "Showcases practical application of diverse technologies (PHP, React, Node.js) and involvement in the full software development lifecycle, from requirements analysis to database design and implementation.",
          weaknesess:
            "Project descriptions are somewhat lengthy and could be more concise. The 'Job Desk on Project' phrasing could be rephrased to emphasize individual accomplishments. The short duration for some projects might imply academic exercises, which is fine, but focus on the learning and outcomes is key.",
        },
      },
      {
        title: "Portfolios",
        value: {
          feedback: [
            {
              feedback_message:
                "Ensure your portfolio link is active, well-maintained, and directly showcases your best work. Consider adding a brief, compelling description of what your portfolio contains.",
              revision_example:
                "Portfolio: https://calvin-portfolio-five.vercel.app/ (Showcasing responsive web applications, back-end API integrations, and cloud deployments.)",
            },
          ],
          pointer: [
            "Ensure the portfolio link is functional and consider adding a brief description of its content.",
          ],
          score: 9,
          strength:
            "Providing a direct link to a portfolio is highly effective, allowing recruiters to see live demonstrations of your work and coding style.",
          weaknesess:
            "While providing a link is strong, a brief description of what the portfolio showcases (e.g., 'collection of full-stack projects', 'responsive web designs') could add immediate value before clicking.",
        },
      },
      {
        title: "Additional Informations",
        value: {
          feedback: [
            {
              feedback_message:
                "Create a distinct 'Certifications' section to highlight your valuable credentials prominently. Soft skills are often best demonstrated through examples in your experience bullet points, but if kept, ensure they are relevant to your target roles. 'Other activities' could be a concise 'Interests' or 'Leadership' section.",
              revision_example:
                "Certifications: Associate Cloud Engineer - Google Cloud | Menjadi Cloud Engineer - Dicoding Indonesia | Belajar Dasar Pemrograman JavaScript - Dicoding Indonesia | Belajar Membuat Aplikasi Back-End untuk Pemula dengan Google Cloud - Dicoding Indonesia. | Languages: Indonesia (Native), English (Intermediate) | Interests: Leadership (Chairman of Confucian Student Activity Unit at Gunadarma University)",
            },
          ],
          pointer: [
            "Separate 'Certifications' into its own dedicated section for greater visibility and impact.",
          ],
          score: 7,
          strength:
            "Includes valuable information such as soft skills, language proficiency, and highly relevant certifications, especially the Google Cloud Associate Cloud Engineer. Also showcases leadership experience through extracurricular activities.",
          weaknesess:
            "This section serves as a catch-all. 'Achievements & Certifications' is strong enough to warrant its own distinct section. Soft skills are generally more impactful when demonstrated within experience bullet points rather than merely listed. 'Other activities' could be integrated or renamed.",
        },
      },
    ],
    summary: {
      score: 8,
      value:
        "Calvin Danyalson's CV presents a strong foundation for a junior web development role, effectively showcasing practical experience and a robust technical skill set. The strengths lie in the diverse project portfolio, valuable certifications (especially Google Cloud), and hands-on experience with modern frameworks and cloud tools. The strongest sections are Education and Portfolios due to their clarity and direct evidence of capability. The weakest sections are the Summary/Profile and Additional Information, which could be optimized for impact and better organization. Overall, the CV is of good quality, demonstrating potential and a solid technical background, but needs refinement in articulation and structure to maximize its appeal to recruiters.",
    },
  };

  return cvReview;
};

const ExtractResume = async (req) => {
  const cvContent = req.body.cvContent; 

  const now = new Date();
  const expired_date = new Date(now.getTime() + 2 * 60 * 1000);

  try {
    const response = await ai.models.generateContent({
      model: resumeExtractConfig.model,
      contents: cvContent, 
      config: {
        systemInstruction: resumeExtractConfig.systemInstruction,
        responseMimeType: resumeExtractConfig.responseMimetype,
        responseSchema: resumeExtractConfig.responseStruct,
      },
    });

    const newData = new TrGeminiRequestLog({
      idempotency_key: req.headers[API_IDEMPOTENCY_KEY],
      gemini_request: JSON.stringify(req.body),
      gemini_response: JSON.stringify(response.text),
      expired_date: expired_date,
      created_at: now,
      updated_at: now,
    });
    await newData.save();

    return JSON.parse(response.text);
  } catch (err) {
    console.log(err);
    throw err;
  }
};


module.exports = {
  AnalyzeResume,
  MockupAnalyzeResume,
  ExtractResume,
};
