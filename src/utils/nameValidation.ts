export function normalizeFullName(name: string) {
  return name.trim().replace(/\s+/g, " ");
}

export function validateFullName(name: string) {
  const normalizedName = normalizeFullName(name);

  if (!normalizedName) {
    return "Full name is required.";
  }

  if (!/^[\p{L}\s'-]+$/u.test(normalizedName)) {
    return "Full name can only include letters, spaces, hyphens, and apostrophes.";
  }

  const nameParts = normalizedName.split(" ").filter(Boolean);

  if (nameParts.length < 2) {
    return "Enter at least two names.";
  }

  return "";
}

export function isValidFullName(name: string) {
  return validateFullName(name) === "";
}
