# Testing Guide

DevBrief AI follows a strict testing philosophy requiring a minimum of 70% coverage across lines, statements, branches, and functions.

## Test Suites

We enforce five mandatory test suite classifications:

1. **Unit Tests** (`src/tests/unit/`)
   - Tests pure functions, utilities, and isolated components.
2. **Security Tests** (`src/tests/security/`)
   - Verifies input sanitization (e.g., DOMPurify logic), auth guards, and rule validations.
3. **Integration Tests** (`src/tests/integration/`)
   - Tests interaction between components and mocked services.
4. **Accessibility Tests** (`src/tests/accessibility/`)
   - Validates WCAG AA compliance (e.g., `axe-core`).
5. **Edge Cases** (`src/tests/edge-cases/`)
   - Evaluates system behavior under extreme network latency, massive context inputs, or malformed data.

Additionally, E2E tests are located in `tests/e2e/`.

## Running Tests

```bash
# Run all vitest suites
npm run test

# Run tests with coverage report
npm run test:coverage

# Run specific suite
npm run test -- src/tests/unit
```
