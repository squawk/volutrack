# Security Notes

## Known Vulnerabilities

This project currently has 9 known vulnerabilities in its development dependencies (react-scripts@5.0.1):

- 6 high severity
- 3 moderate severity

### Context

All identified vulnerabilities are in **development dependencies** only:
- `nth-check` (used by svgo in build process)
- `postcss` (used by resolve-url-loader in build process)
- `webpack-dev-server` (development server only)

### Impact

**These vulnerabilities do NOT affect the production build:**
- The production bundle does not include development dependencies
- The vulnerabilities are in build tools and the dev server, not runtime code
- Running `npm run build` produces a clean production bundle without these dependencies

### Mitigation Status

**Why not run `npm audit fix --force`?**

Running `npm audit fix --force` would install `react-scripts@0.0.0`, which is a breaking change that would make the project non-functional.

**Current approach:**
1. These are acceptable risks for development environments
2. Never expose the development server to untrusted networks
3. Production builds are unaffected
4. Monitor for react-scripts updates that resolve these issues

### Recommendations

For development:
- Only run `npm start` on trusted, local networks
- Never expose webpack-dev-server to the internet
- Use production builds (`npm run build`) for deployment

### Future Actions

- Monitor for react-scripts updates beyond 5.0.1
- Consider migrating to Vite or other modern build tools in the future
- Regularly check for security updates

## Reporting Security Issues

If you discover a security vulnerability in this project's code (not dependencies), please email [security contact] with details.

Last Updated: 2025-11-20
