// @ts-check
import antfu from '@antfu/eslint-config'

export default antfu(
  {
    ignores: [
      '**/apps/doc/src/routes',
      '**/routeTree.gen.ts',
      '**/router.tsx',
      // ...globs
    ],
    type: 'lib',
    pnpm: true,
    jsx: true,
  },
)
