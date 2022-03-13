import { createCheckPackageWithWorkspaces } from 'check-package-dependencies';

createCheckPackageWithWorkspaces(undefined, {
  tryToAutoFix: true,
}).checkRecommended({
  isLibrary: () => true,
  onlyWarnsForInMonorepoPackagesDependencies: {
    '@todo-example/nextjs': {
      'eslint-config-next': {
        // we don't need eslint as it's present in monorepo
        missingPeerDependency: ['eslint'],
      },
    },
  },
});
