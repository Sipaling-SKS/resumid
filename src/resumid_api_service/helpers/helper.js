
// function fillDefaults(resumeData) {
//   const currentDate = new Date();
//   const currentYear = currentDate.getFullYear();
//   const currentMonth = currentDate.getMonth() + 1;

//   const safeArray = (arr) => Array.isArray(arr) ? arr : null;

//   return {
//     summary: resumeData.summary
//       ? { content: resumeData.summary.content || "" }
//       : { content: "" },

//     workExperiences: safeArray(resumeData.workExperiences)?.map(exp => {
//       const start = exp.period?.start || { year: 1970, month: 1 };
//       const end = exp.period?.end || { year: currentYear, month: currentMonth };
//       return {
//         company: exp.company || "",
//         location: exp.location || "",
//         position: exp.position || "",
//         employment_type: exp.employment_type || "",
//         period: { start, end },
//         responsibilities: Array.isArray(exp.responsibilities) ? exp.responsibilities : []
//       };
//     }) || [
//       {
//         company: "",
//         location: "",
//         position: "",
//         employment_type: "",
//         period: { start: { year: 1970, month: 1 }, end: { year: currentYear, month: currentMonth } },
//         responsibilities: []
//       }
//     ],

//     educations: safeArray(resumeData.educations)?.map(edu => {
//       const start = edu.study_period?.start || { year: 1970, month: 1 };
//       const end = edu.study_period?.end || { year: currentYear, month: currentMonth };
//       return {
//         institution: edu.institution || "",
//         degree: edu.degree || "",
//         study_period: { start, end },
//         score: edu.score || "",
//         description: edu.description || ""
//       };
//     }) || [
//       {
//         institution: "",
//         degree: "",
//         study_period: { start: { year: 1970, month: 1 }, end: { year: currentYear, month: currentMonth } },
//         score: "",
//         description: ""
//       }
//     ]
//   };
// }

function fillDefaults(resumeData) {
  // Handle case where resumeData might be null or undefined
  if (!resumeData || typeof resumeData !== 'object') {
    return resumeData;
  }

  // Handle educations array
  if (resumeData.educations && Array.isArray(resumeData.educations)) {
    resumeData.educations = resumeData.educations.map(edu => {
      // Handle null study_period (your data uses 'period', not 'study_period')
      if (!edu.period || typeof edu.period !== "object") {
        edu.period = { start: "", end: "" };
      } else {
        edu.period.start = edu.period.start ?? "";
        edu.period.end = edu.period.end ?? "";
      }

      // Handle null properties
      edu.degree = edu.degree ?? "";
      edu.description = edu.description ?? "";
      edu.institution = edu.institution ?? "";
      
      return edu;
    });
  }

  // Handle workExperiences array
  if (resumeData.workExperiences && Array.isArray(resumeData.workExperiences)) {
    resumeData.workExperiences = resumeData.workExperiences.map(exp => {
      // Handle null period
      if (!exp.period || typeof exp.period !== "object") {
        exp.period = { start: "", end: "" };
      } else {
        exp.period.start = exp.period.start ?? "";
        exp.period.end = exp.period.end ?? "";
      }

      // Handle null properties
      exp.employment_type = exp.employment_type ?? "";
      exp.position = exp.position ?? "";
      exp.company = exp.company ?? "";
      exp.description = exp.description ?? "";
      exp.location = exp.location ?? "";
      
      return exp;
    });
  }

  // Handle skills array - ensure it's an array and has no null values
  if (resumeData.skills && Array.isArray(resumeData.skills)) {
    resumeData.skills = resumeData.skills.map(skill => skill ?? "");
  }

  // Handle summary object
  if (resumeData.summary && typeof resumeData.summary === 'object') {
    resumeData.summary.content = resumeData.summary.content ?? "";
  }

  return resumeData;
}

module.exports = { fillDefaults };
