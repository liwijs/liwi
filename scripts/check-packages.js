import { createCheckPackageWithWorkspaces } from 'check-package-dependencies';

await createCheckPackageWithWorkspaces()
  .checkRecommended({
    isLibrary: (name) => !name.startsWith('@todo-example'),
  })
  .run();
