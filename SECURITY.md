# Security Policy

## Supported Versions
| Version | Supported          |
| ------- | ------------------ |
| main    | :white_check_mark: |

## Reporting a Vulnerability
Please report security vulnerabilities via GitHub Issues. Response within 72 hours.

## Security Considerations

### Client-Side Architecture
This is a purely client-side educational application with no backend services, databases, or server-side processing. All code executes in the browser.

### Local Storage
- Theme preference stored in `localStorage` (non-sensitive data only)
- No personally identifiable information or credentials stored

### External Dependencies
- Bootstrap 5.3.2 (CDN)
- Font Awesome 6.4.2 (CDN)
- Uses Subresource Integrity (SRI) should be added for production CDN links

### Potential Attack Vectors
- XSS: All user interactions are UI-only; no input fields accept arbitrary data
- CSP: Consider adding Content-Security-Policy header if deployed on custom domain
- No authentication/authorization mechanisms required

### Recommendations
- Add SRI attributes to external CDN script/style tags
- Implement CSP headers: `default-src 'self'; style-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net https://cdnjs.cloudflare.com; script-src 'self' https://cdn.jsdelivr.net`
- Enable HTTPS for all deployments
- Regular dependency audit on Bootstrap and Font Awesome versions