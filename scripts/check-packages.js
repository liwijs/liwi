import { createCheckPackageWithWorkspaces } from 'check-package-dependencies';

await createCheckPackageWithWorkspaces({
  isLibrary: (pkg) => !pkg.name.startsWith('@todo-example'),
})
  .checkRecommended()
  .run();
