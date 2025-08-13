function normalizeDateField(dateValue, fillIfNull = false) {
  if (!dateValue) {
    if (fillIfNull) {
      const now = new Date();
      return { year: now.getFullYear(), month: now.getMonth() + 1 };
    }
    return null;
  }

  if (typeof dateValue === "string") {
    const [y, m] = dateValue.split("/").map(Number);
    return { year: y, month: m };
  }

  if (typeof dateValue === "object" && "year" in dateValue && "month" in dateValue) {
    return dateValue;
  }

  return null;
}

function cleanResumeResponse(parsed) {
  return parsed.map(section => {
    if (Array.isArray(section.content)) {
      section.content = section.content.map(item => {
        if (item && typeof item === "object") {
          if (item.period) {
            item.period.start = normalizeDateField(item.period.start);
            item.period.end = normalizeDateField(item.period.end, true); // fill if null
          }
          if (item.study_period) {
            item.study_period.start = normalizeDateField(item.study_period.start);
            item.study_period.end = normalizeDateField(item.study_period.end, true); // fill if null
          }
        }
        return item;
      });
    }
    return section;
  });
}

module.exports = {
  cleanResumeResponse,
};
