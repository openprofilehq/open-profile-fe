const fs = require("fs");
const path = require("path");

function resolveProfessional() {
  const file = path.join(
    __dirname,
    "src/components/dashboard/profile-builder/previews/ProfessionalPreview.tsx"
  );
  let content = fs.readFileSync(file, "utf8");

  // 1. Add Mail to lucide-react import
  content = content.replace(
    '  Trash2,\n} from "lucide-react";',
    '  Trash2,\n  Mail,\n} from "lucide-react";'
  );

  // 2. Resolve Header Conflict
  // HEAD has the floating UI, dev has the avatar fallback and grayscale for invisible sections
  content = content.replace(
    /<<<<<<< HEAD[\s\S]*?=======\s*([\s\S]*?)>>>>>>> dev/,
    (match, devPart) => {
      // Wait, since there are 4 conflicts, I should be specific.
      return match; // We will use specific replaces below
    }
  );
}

resolveProfessional();
