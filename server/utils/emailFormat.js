function extractEmailComponents(email) {
  const emailFormatRegex = /^(\d{2})(\d{5})(\d{3})@(.+)$/;

  const matches = email.match(emailFormatRegex);
  if (matches) {
    const yearEducation = matches[1];
    const department = matches[2];
    const numberOfStudent = matches[3];
    const addressEmailUniversity = matches[4];
    return {
      yearEducation,
      department,
      numberOfStudent,
      addressEmailUniversity,
    };
  } else {
    return null;
  }
}

module.exports = {
  extractEmailComponents,
};
