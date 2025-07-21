const { Type } = require("@google/genai");

const GeminiConfig = {
  systemInstruction: [
    {
      text: `'Let’s play a very interesting game: from now on you will play the role [CV Analysis Expert & Career Coach], a new version of AI model able to [analyze CVs section by section and deliver advanced structural analysis, scoring, and career enhancement insights]. To do that, you will [review each section, extract context and insights, provide strengths, weaknesses, feedback points, and give actionable suggestions with sample revisions]. If human [career expert] has level 10 of knowledge, you will have level 280 of knowledge in this role. Be careful: you must have high-quality results because if you don’t I will be fired and I will be sad. So give your best and be proud of your ability. Your high skills set you apart and your commitment and reasoning skills lead you to the best performances.'`,
    },
    {
      text: `You, in [CV Analysis Expert & Career Coach], are an assistant to do [deep analysis of CVs section-by-section and guide career improvement]. You will have super results in [identifying weaknesses and opportunities] and you will [help users polish their resumes to fit job goals precisely]. Your main goal and objective are [to evaluate the user’s CV based on the job title, content quality, keyword relevance, and content structure]. Your task is [to evaluate each section, rate it, extract strengths, weaknesses, one key point of revision, an example fix for that revision, and a numeric score from 1–10]. To make this work as it should, you must [analyze the CV section by section: Header, Summary/Profile, Work Experience, Education, Skills, Certifications, Projects, etc.], and in the final part, include [a summary of the analysis + a conclusion with actionable advice, career recommendations, missing sections, redundant content, keyword insights like job titles, tech stacks, tools, or industry jargon].`,
    },
    {
      text: `🔎 Prompt Features
        Section-by-section evaluation (Header, Summary, Work Experience, etc.).

        Strengths identified clearly for each section.

        Weaknesses with brief context-based explanation.

        Point of revision for each section (only one main point to focus).

        Example fix showing how to revise it.

        Score from 1 to 10 for each section.

        Summary section combining insights from all the above.

        Conclusion section with:

        Career direction suggestions (only carreer name without explaination)

        Next steps to improve

        What section to add/remove/reduce (only section name without explaination)

        Relevant keyword match (job titles, tech stack, etc. without explanation)`,
    },
    {
      text: `🗣 Tone
        The tone should be professional yet supportive, like a mentor or experienced coach. It should be:

        Objective and data-driven for analysis

        Motivational and constructive for feedback

        Clear and jargon-aware for keyword suggestions
        `,
    },
    {
      text: `✅ Tips for Better Results
            Always keep the target role in mind when evaluating the CV.

            Use job-market language and terms from job listings when giving keyword advice.

            Be realistic and honest in your scoring, and justify it.

            In the conclusion, tailor career suggestions based on user experience level and goals.

            For the “one point of revision” per section, always choose the most impactful.

            Don’t repeat the same suggestion in multiple sections.`,
    },
    {
      text: `🧱 Structure of Response
        Your response MUST be structured in a special structure. You can't place things randomly. This structure is the way each of your messages should look like. You must follow this structure:

        [introduction]: - (Brief intro of the CV and its overall tone. Mention the target role and key focus.);
        [section_analysis]: - (For each section of the CV:
        - Section Name
        - Strengths
        - Weaknesses
        - Point of Revision
        - Feedback (Feedback Message & Revision Example)
        - Score (1-10));

        [summary]: - (Recap of all findings. List of strongest and weakest sections. Overall CV quality.);

        [conclusion]: - (Career recommendation based on CV, potential job fits, action steps to improve, sections to add/remove/minimize, keyword matches related to role/industry/tools/job titles.);\
        [final_note]: - (Encouraging message and reminder to keep evolving the CV as the career grows.);`,
    },
  ],
  model: "gemini-2.5-flash",
  responseStruct: {
    type: Type.ARRAY,
    items: {
      type: Type.OBJECT,
      properties: {
        summary: {
          type: Type.OBJECT,
          properties: {
            score: { type: Type.NUMBER },
            value: { type: Type.STRING },
          },
          required: ["score", "value"],
        },
        content: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              value: {
                type: Type.OBJECT,
                properties: {
                  score: { type: Type.NUMBER },
                  strength: { type: Type.STRING },
                  weaknesess: { type: Type.STRING },
                  pointer: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                  },
                  feedback: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        feedback_message: { type: Type.STRING },
                        revision_example: { type: Type.STRING },
                      },
                      required: ["feedback_message", "revision_example"],
                    },
                  },
                },
                required: [
                  "score",
                  "strength",
                  "weaknesess",
                  "pointer",
                  "feedback",
                ],
              },
            },
            required: ["title", "value"],
          },
        },
        conclusion: {
          type: Type.OBJECT,
          properties: {
            section_to_add: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
            section_to_remove: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
            keyword_matching: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
            career_recomendation: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
          },
          required: [
            "section_to_add",
            "section_to_remove",
            "keyword_matching",
            "career_recomendation",
          ],
        },
      },
      required: ["summary", "content", "conclusion"],
    },
  },
  responseMimetype: "application/json",
  mockupContent: `CALVIN DANYALSON
    08972920986 | calvindany1102@gmail.com | https://www.linkedin.com/in/calvin-danyalson-a87295234/
    Depok, Indonesia 16413
    Bachelor Degree of Informatics Engineering at Gunadarma University
    Experienced in website development with both the waterfall and agile methodologies, able to work individually
    or with a team, and actively learn new technologies, frameworks, and programming languages
    Working Experience
    Taldio- Tangerang, Indonesia
    Engineer Internship
    November 2023- Present
    ● Participating in supporting the development of web-based applications using React.js, .NET Core Web
    API, Golang, Next.js, and Laravel
    ● Implementing clean and maintainable code
    ● Experience in working with microservices architecture and Azure Devops pipelines
    ● Conductingresearch and implementation of various technologies such as Google Recaptcha, Google
    Indexing, Deployment on Internet Information Services, and improving web performance on React.JS
    ● Implementing agile methodology during the development process
    Coding.ID- Tangerang, Indonesia
    Assistance Coach Internship
    February 2023- January 2024
    ● Teachingbeginner-level bootcamp classes on JavaScript programming and programming logic
    ● Guidingadvanced Fullstack Engineer bootcamp participants in completing their given final project using
    ReactJS and .NET Core Web API under academic team guidance
    ● Deploying web-based applications on Windows Server
    Gunadarma University- Depok, Indonesia
    Laboratory Assistance
    ● Performing maintenance on laboratory computers at Gunadarma University
    ● Installing computer software
    March 2022- August 2024
    ● Conductingtech workshops such as HTML and JavaScripts as an instructor, meeting room host, or
    assistant
    Education
    Gunadarma University- Depok, Indonesia
    Strata 1 (S1) in Major in Informatics Engineer, 3.84 / 4.00
    Bangkit Academy Cloud Computing Learning Path- Online, Indonesia
    Student / Cohort
    ● LearningBack-End API development using JavaScript
    ● StudyingCloud Architecture with Google Cloud Platform
    September 2020- August 2024
    February 2023- July 2023
    ● Collaborating in a team to develop a vegetable freshness classification application utilizing Google
    cloud services
    ● ObtainedAssociate Cloud Engineer certification from Google Cloud
    Skills
    ● JavaScripts
    ● Node.js
    ● Express.js
    ● .NETFramework
    ● React.js &Next.js
    ● Golang
    ● SQL(including MySQL, MariaDB, SQL Server)
    ● MongoDB
    ● Git
    ● Laravel
    ● Internet Information Services (IIS)
    ● GoogleCloudPlatform (GCP)
    Projects
    Wedding Organizer- Web Developer
    Adummywebapplication that provides a service for organizing wedding events.
    ● Developawebapplication using PHP Native, Tailwind CSS, and Summernote library
    ● Conductananalysis of the application functional and non-functional requirements
    ● DesigntheSQLDatabase(MariaDB) structure for data management
    Batique- Web Developer
    Webapplication that provides posts about batik artworks in Indonesia
    ● Developawebapplication using React (JavaScripts) with a team of three people.
    ● Research, discuss and implement a database structure on firebase services
    June 2024- June 2024
    August 2023- August 2023
    ● JobDeskonProject: Create a gallery page and profile page for user and create an upload or like post
    features
    Stockedge App- Web Developer
    April 2023- May 2023
    E-Commerce web application that focussed on a small and medium-sized building materials called TB. Indo
    Maju located in Indonesia.
    ● Developawebapplication using Node.js and Express.js (JavaScripts) with a MVC pattern and Bootstrap
    CSS library
    ● Conductananalysis of the application functional and non-functional requirements and visualize them
    using several UML diagrams
    ● DesigntheNoSQLdatabase (MongoDB) structure for efficient data management
    Rozaline- Web Developer
    September 2022- December 2022
    Webapplication that provide information about all plants on Rozaline Park, located in Penajam Paser Utara,
    Kalimantan Timur
    ● Developawebapplication using CodeIgniter (PHP) MVC pattern and Bootstrap CSS library
    ● Teamupwith5peopleandperformthe stages of software development lifecycle using Waterfall
    method
    ● JobDeskonProject: Responsible for designing a user interface mockup for the user side and
    implementing design results to a fully functional website.
    Portfolios
    Websites: https://calvin-portfolio-five.vercel.app/
    Additional Informations
    Soft Skills: Speaking, Teamwork, Problem Solving
    Languages: Indonesia (Native), English (Intermediate)
    Achievements & Certifications: Associate Cloud Engineer from Google Cloud, Menjadi Cloud Engineer from
    Dicoding Indonesia, Belajar Dasar Pemrograman JavaScript from Dicoding Indonesia, Belajar Membuat
    Aplikasi Back-End untuk Pemula dengan Google Cloud from Dicoding Indonesia.
    Other activities: Chairman of Confucian Student Activity Unit at Gunadarma University`,
};

module.exports = {
  GeminiConfig,
};
