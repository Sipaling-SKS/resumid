
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
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth() + 1;

  const safeArray = (arr) => Array.isArray(arr) ? arr : null;

  return {
    summary: resumeData.summary
      ? { content: resumeData.summary.content || "" }
      : { content: "" },

    workExperiences: safeArray(resumeData.workExperiences)?.map(exp => {
      const start = exp.period?.start || { year: 1970, month: 1 };
      const end = exp.period?.end || { year: currentYear, month: currentMonth };
      return {
        company: exp.company || "",
        location: exp.location || "",
        position: exp.position || "",
        employment_type: exp.employment_type || "",
        period: { start, end },
        description: exp.description || ""  // Changed from responsibilities to description
      };
    }) || [
      {
        company: "",
        location: "",
        position: "",
        employment_type: "",
        period: { start: { year: 1970, month: 1 }, end: { year: currentYear, month: currentMonth } },
        description: ""  // Changed from responsibilities to description
      }
    ],

    educations: safeArray(resumeData.educations)?.map(edu => {
      const start = edu.period?.start || { year: 1970, month: 1 };  // Changed from study_period to period
      const end = edu.period?.end || { year: currentYear, month: currentMonth };  // Changed from study_period to period
      return {
        institution: edu.institution || "",
        degree: edu.degree || "",
        period: { start, end },  // Changed from study_period to period
        description: edu.description || ""  // Removed score field
      };
    }) || [
      {
        institution: "",
        degree: "",
        period: { start: { year: 1970, month: 1 }, end: { year: currentYear, month: currentMonth } },  // Changed from study_period to period
        description: ""  // Removed score field
      }
    ],

    skills: safeArray(resumeData.skills)?.filter(skill => skill && typeof skill === 'string') || []  // Added skills array with validation
  };
}

module.exports = { fillDefaults };
