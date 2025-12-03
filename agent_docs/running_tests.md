# Running Tests

## Current Testing Setup

The project currently uses a combination of TypeScript type checking and manual integration tests.

### Type Checking

To run TypeScript type checking across the project:

```bash
npm run check
```

This uses `tsc` to verify type safety.

### Integration Tests

Integration tests are located in the `__tests__/` directory.

To run the tests, we recommend adding a test runner like `vitest`.

**Recommended Command** (if configured):
```bash
npm test
```

If `npm test` is not yet configured, you can run specific test files using `tsx`:

```bash
npx tsx __tests__/irisIntegration.spec.ts
```

## Test Structure

-   `__tests__/`: Contains integration and unit tests.
-   `irisIntegration.spec.ts`: Tests for the IRIS risk quantification integration.
