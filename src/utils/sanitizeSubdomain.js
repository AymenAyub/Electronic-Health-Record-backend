
export function sanitizeSubdomain(input = "") {
    return String(input)
      .toLowerCase()          
      .replace(/\s+/g, "-")   
      .replace(/[^a-z0-9-]/g, ""); 
  }
  
  const RESERVED = new Set(["www", "api", "admin", "assets", "static"]);
  
  export function isValidSubdomain(s) {
    if (!s) return false;
    if (s.length < 3 || s.length > 50) return false;
    if (/^-|-$/.test(s)) return false;  // no leading/trailing hyphen
    if (/--/.test(s)) return false;     // no consecutive hyphens
    if (!/^[a-z0-9-]+$/.test(s)) return false;
    if (RESERVED.has(s)) return false;  // don’t allow reserved words
    return true;
  }
  