# Contributing to DevBrief AI

We welcome contributions! Please adhere to our architectural standards when contributing.

## Development Workflow

1. Fork the repository and create a feature branch (`git checkout -b feature/my-feature`).
2. Write code that follows strict TypeScript (`noImplicitAny`, no magic strings).
3. Ensure all async operations return our standard `ApiResponse<T>` wrapper.
4. Include tests covering your new logic in the appropriate `src/tests/*` folder.
5. Run `npm run test:coverage` to ensure coverage remains above 70%.
6. Commit your changes and open a Pull Request.

## Code Standards

- **Single Responsibility:** Components should do one thing well (e.g., `StreamingText` vs `QAEntryBubble`).
- **No Magic Strings:** Use `src/constants/index.ts`.
- **Accessibility:** All UI components must meet WCAG 2.1 AA standards. Ensure proper ARIA labels.
