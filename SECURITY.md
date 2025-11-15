# Security

Based on [https://supabase.com/.well-known/security.txt](https://supabase.com/.well-known/security.txt)

At W-W, we consider the security of our systems a top priority. But no
matter how much effort we put into system security, there can still be
vulnerabilities present.

If you discover a vulnerability, please report it to us immediately so we can address it as quickly as possible. Your responsible disclosure helps us protect our users and systems.

## Out of scope vulnerabilities

- Clickjacking on pages with no sensitive actions.
- Unauthenticated/logout/login CSRF.
- Attacks requiring MITM or physical access to a user's device.
- Any activity that could lead to the disruption of our service (DoS).
- Content spoofing and text injection issues without showing an attack
  vector/without being able to modify HTML/CSS.
- Email spoofing
- Missing DNSSEC, CAA, CSP headers
- Lack of Secure or HTTP only flag on non-sensitive cookies
- Deadlinks

## Responsible Disclosure Guidelines

- Do not run automated scanners on our infrastructure or dashboard. If you wish to do this, contact us and we will set up a sandbox for you.
- Do not exploit the vulnerability beyond what is necessary to demonstrate it (e.g., do not download excessive data, delete, or modify others' data).
- Do not share details of the vulnerability with others until it has been resolved.
- Do not use attacks involving physical security, social engineering, denial of service, spam, or third-party applications.
- Provide sufficient information to reproduce the problem (e.g., affected URL, IP address, and a clear description). Complex vulnerabilities may require further explanation.

Contact: [security@w-w.com](mailto:security@w-w.com)
