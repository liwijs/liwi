import { createCheckPackageWithWorkspaces } from 'check-package-dependencies';

createCheckPackageWithWorkspaces(undefined, {
  tryToAutoFix: true,
}).checkRecommended({
  isLibrary: () => true,
});
