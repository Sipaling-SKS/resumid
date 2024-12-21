import AnalysisDetail from "@/components/parts/AnalysisDetail";
import Summary from "@/components/parts/Summary";
import { Helmet } from "react-helmet";
import { useParams } from "react-router";
import useWindowSize from "@/hooks/useMediaQuery"
import HistoryThumbnail from "@/components/parts/HistoryThumbnail";
import { useState, useEffect } from "react";

export type ResultData = {
  id: string;
  filename: string;
  jobTitle: string;
  score: number;
  date: string;
  summary: string;
  suggestions: string[] | null;
  strengths: string[] | null;
  gaps: string[] | null;
  weakness: string[] | null;
};

export type DataKeys = "suggestions" | "strengths" | "gaps" | "weakness";

function Result() {
  const { id } = useParams();
  const { isTablet, isMobile } = useWindowSize();
  const [selected, setSelected] = useState<string | null>(null)

  const historyData: ResultData = {
    id: "history-1",
    score: 79,
    jobTitle: "Software Engineer",
    filename: "Muhammad Fadil Hisyam CV 2024.pdf",
    date: "2024-12-16T18:28:00.000Z",
    summary:
      "Results-driven Software Engineer with a Bachelor's degree in Informatics and a strong background in backend development (Java, .NET), frontend frameworks (React.js), and mobile app development (Kotlin). Demonstrates leadership through roles in organizational and cultural activities, alongside extensive experience in technical training and mentoring. Recognized for delivering impactful projects, including API development and Employee Self Service systems, with a focus on debugging, testing, and quality assurance. Holds a proven track record of achieving excellence through awards and scholarships. Actively seeking to leverage skills in cloud technologies, CI/CD, and DevOps practices to excel in senior engineering roles, with a commitment to fostering collaboration and innovation in team environments.",
    suggestions: [
      "Revise the resume to include specific examples of software development projects, highlighting the complexity and technologies used.",
      "Add a section detailing experience with software testing and debugging, including any relevant tools or methodologies.",
      "Include any experience with cloud technologies, even if it was part of a project or training, to align with job requirements.",
      "Emphasize collaborative experiences with cross-functional teams and provide examples of successful teamwork.",
      "Highlight any mentoring or leadership roles taken in previous positions to demonstrate readiness for a senior role.",
      "Improve the formatting of the resume for better readability and professionalism, ensuring consistent spacing and alignment throughout.",
      "Consider adding a summary statement at the top of the resume that encapsulates key skills and experiences relevant to the Senior Software Engineer role.",
    ],
    strengths: [
      "Educational background in Informatics, which is relevant to the field of software engineering.",
      "Experience as a Technical Consultant and Counselor, indicating a strong foundation in technical training and mentoring.",
      "Proficiency in backend technologies (Java, .NET) and frontend technologies (React Js), aligning with the job's programming language requirements.",
      "Experience in providing technical support and developing APIs, showcasing practical software development skills.",
      "Strong communication skills demonstrated through tutoring roles, which is essential for collaboration in a team environment.",
      "Involvement in various projects and internships, indicating a breadth of experience in different aspects of software development.",
    ],
    gaps: [
      "No clear evidence of experience in developing complex software applications, which is a primary requirement for the role.",
      "Absence of specific achievements or metrics that demonstrate the impact of previous work, such as performance improvements or successful project completions.",
      "Lack of information on familiarity with software development methodologies and tools, which is essential for the position.",
      "No mention of participation in process improvements or innovative solutions, which are emphasized in the job description.",
    ],
    weakness: [
      "Lack of specific experience in software testing and debugging techniques, which is a key requirement for the role.",
      "No mention of experience with cloud technologies (AWS or Azure), which is a preferred qualification for the position.",
      "Limited details on collaborative work with cross-functional teams, which is crucial for the role.",
      "The resume does not highlight any experience in conducting code reviews or mentoring junior engineers, which are important responsibilities for a Senior Software Engineer.",
      "The formatting of the resume is inconsistent, with spacing and alignment issues that may detract from professionalism.",
    ],
  };

  // DUMMY ARRAY DATAA
  const datas = [historyData, historyData, historyData];

  return (
    <>  
      <Helmet>
        <meta charSet="utf-8" />
        <title>Resume Summary 15/12/2024 - Resumid</title>
      </Helmet>
      <main className="bg-background-950 min-h-screen responsive-container py-6 md:py-8">
        <div className="flex flex-col md:flex-row gap-6">
          <section className="flex flex-col gap-4 md:gap-6 w-full max-w-md lg:w-1/3 xl:w-full xl:max-w-sm mx-auto">
            {datas.map((data) => (
              <HistoryThumbnail
                isSelected={selected === data.id}
                data={data}
                onSelect={(val) => setSelected(val)}
              />
            ))}
          </section>
          {!isTablet && !isMobile && (
            <section className="lg:w-2/3 xl:w-full">
              <AnalysisDetail data={historyData} />
            </section>
          )}
        </div>
      </main>
    </>
  )
}

export default Result;