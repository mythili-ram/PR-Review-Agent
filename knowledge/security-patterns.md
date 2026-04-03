# Security pattern hints (heuristic)

These are **signals**, not proof. Confirm with framework-specific best practices.

## A01:2021 – Broken Access Control (OWASP)

**CWE-639, CWE-284, CWE-22**

- Missing authorization checks on endpoints (no role/permission validation)
- Path traversal: `..`, `../`, file paths from user input without sanitization
- Insecure direct object references (IDOR): exposing IDs without ownership checks
- Bypassing client-side access controls
- CORS misconfig: `Access-Control-Allow-Origin: *` with credentials
- Force browsing to auth-required pages without middleware

**Patterns:**
```
fs.readFile(userInput)  // without path validation
WHERE id = ${req.params.id}  // without ownership check
app.get('/admin', handler)  // no auth middleware
```

## A02:2021 – Cryptographic Failures (OWASP)

**CWE-327, CWE-326, CWE-780**

- Transmitting sensitive data in cleartext (HTTP not HTTPS, unencrypted DB fields)
- Weak crypto algorithms: MD5, SHA1 for passwords, DES, RC4
- Hardcoded encryption keys or predictable IVs
- Missing encryption at rest for PII/secrets
- Weak random: `Math.random()` for security tokens

**Patterns:**
```
createHash('md5')  // weak for passwords
http://  // cleartext transmission
Math.random()  // predictable for tokens
const key = 'hardcoded123'  // static crypto key
```

## A03:2021 – Injection (OWASP)

**CWE-78, CWE-89, CWE-79, CWE-917**

### SQL Injection (CWE-89)
- String concatenation in SQL queries
- Template literals with user input: `` `SELECT * FROM users WHERE id = '${id}'` ``
- ORM misuse: raw queries without parameterization

**Safe alternatives:** Prepared statements, parameterized queries, ORM methods

### Command Injection (CWE-78)
- `exec()`, `spawn()` with `shell: true` and unsanitized input
- Backticks, `system()`, `popen()` with user data

### NoSQL Injection (CWE-943)
- MongoDB: `{ $where: userInput }`, object injection without schema validation

### LDAP/XPath Injection (CWE-90, CWE-643)
- Building LDAP filters or XPath queries from strings

**Patterns:**
```javascript
db.query(`SELECT * FROM users WHERE id = '${id}'`)  // SQL injection
exec(`ls ${userInput}`)  // command injection
eval(userCode)  // code injection
db.collection.find({ $where: userInput })  // NoSQL injection
```

## A04:2021 – Insecure Design (OWASP)

**CWE-311, CWE-807**

- Missing rate limiting on auth endpoints (brute force vulnerability)
- No input validation business logic (negative quantities, overflow)
- Trusting client-side validation alone
- Missing abuse case modeling (what could an attacker do?)

## A05:2021 – Security Misconfiguration (OWASP)

**CWE-16, CWE-2**

- Default credentials still enabled
- Unnecessary features enabled (directory listing, debug modes in production)
- Missing security headers: CSP, X-Frame-Options, HSTS
- Verbose error messages leaking stack traces
- Outdated/unpatched dependencies

**Patterns:**
```javascript
app.use(express.static('.', { dotfiles: 'allow' }))  // exposes .env
res.send(error.stack)  // stack trace in production
X-Powered-By: Express  // version disclosure
```

## A06:2021 – Vulnerable and Outdated Components (OWASP)

**CWE-1035**

- Using dependencies with known CVEs
- No dependency scanning in CI/CD
- Pinned old versions without security patches

**Check:** `npm audit`, Snyk, Dependabot alerts

## A07:2021 – Identification and Authentication Failures (OWASP)

**CWE-287, CWE-798, CWE-640**

- Weak password policies (no length/complexity requirements)
- Credential stuffing (no rate limiting, CAPTCHA)
- Session fixation vulnerabilities
- Exposing session IDs in URLs
- Missing multi-factor authentication on sensitive operations

**Patterns:**
```javascript
if (password === storedPassword)  // plaintext comparison
sessionId = Date.now()  // predictable session IDs
```

## A08:2021 – Software and Data Integrity Failures (OWASP)

**CWE-502, CWE-829**

- Insecure deserialization: `pickle.loads()`, `JSON.parse()` from untrusted sources
- Using CDN/third-party code without SRI (Subresource Integrity)
- Auto-updates without signature verification
- CI/CD pipelines without integrity checks

**Patterns:**
```javascript
eval(cookieData)  // deserializing untrusted data
<script src="https://cdn.example.com/lib.js"></script>  // no integrity hash
```

## A09:2021 – Security Logging and Monitoring Failures (OWASP)

**CWE-778**

- Not logging authentication failures
- Insufficient log detail for forensics
- Logs without tamper protection
- No alerting on suspicious patterns

## A10:2021 – Server-Side Request Forgery (SSRF) (OWASP)

**CWE-918**

- Fetching URLs from user input without validation
- Accessing cloud metadata endpoints (169.254.169.254)
- Bypassing allowlists with DNS rebinding

**Patterns:**
```javascript
fetch(req.query.url)  // SSRF vulnerability
axios.get(userProvidedUrl)  // no URL validation
```

## Framework-Specific Patterns

### React/Frontend (XSS - CWE-79)

- `dangerouslySetInnerHTML` with unsanitized data
- Direct DOM manipulation bypassing React: `innerHTML`, `outerHTML`
- Rendering user content without escaping
- `href="javascript:..."` from user input

**Safe:** Use text content APIs, DOMPurify for rich content

### Node.js/Express

- Missing helmet middleware (security headers)
- Using `res.send(userInput)` without escaping
- CORS misconfiguration
- No input validation middleware (express-validator)
- Prototype pollution: `Object.assign(target, req.body)` without safeguards

### Python/Django/Flask

- Using `exec()`, `eval()` with user input
- Pickle deserialization from untrusted sources
- Template injection: rendering user input directly in Jinja2
- Missing CSRF tokens on forms
- SQL: using `%s` string formatting instead of parameterized queries

### Java/Spring

- Mass assignment vulnerabilities (binding request params directly to entities)
- XXE (XML External Entity) in XML parsers without disabling external entities
- Deserialization gadgets (Jackson, Java native serialization)
- Spring Expression Language (SpEL) injection

## Additional High-Risk Patterns

### Timing Attacks (CWE-208)
```javascript
if (hash === providedHash)  // use constant-time comparison
```

### Race Conditions (CWE-362)
- TOCTOU (Time-of-check Time-of-use) in file operations
- Non-atomic read-modify-write on shared state

### Integer Overflow (CWE-190)
- Large numbers causing unexpected behavior in calculations

### Open Redirects (CWE-601)
```javascript
res.redirect(req.query.returnUrl)  // validate against allowlist
```

### Missing Input Validation
- No length limits (DoS via large inputs)
- No type checking (NaN, null, undefined causing errors)
- No format validation (regex for email, phone, etc.)

## Secrets Detection Patterns

- High-entropy strings (50+ chars, mixed case, numbers, symbols)
- `api_key`, `apikey`, `api-key`, `secret`, `password`, `token`, `credentials`
- AWS: `AKIA[0-9A-Z]{16}`, secret keys
- Slack: `xox[baprs]-[0-9a-zA-Z-]+`
- GitHub: `ghp_[0-9a-zA-Z]{36}`, `github_pat_[0-9a-zA-Z_]{82}`
- Private keys: `BEGIN RSA PRIVATE KEY`, `BEGIN OPENSSH PRIVATE KEY`
- GCP service account JSON: `"type": "service_account"`
- Azure connection strings: `AccountKey=`, `SharedAccessKey=`
- JWT tokens in code: `eyJ[a-zA-Z0-9_-]+\.eyJ[a-zA-Z0-9_-]+\.[a-zA-Z0-9_-]+`
- Database URLs: `postgres://user:pass@host`, `mongodb://`, `mysql://`

**Action:** Redact values, recommend secret manager, scan git history if committed

## Redaction Protocol

When secrets detected:
1. Never echo the full value in review output
2. Show partial: `sk-***` (first 3 chars + asterisks)
3. Recommend: Environment variables + secret manager (AWS Secrets Manager, Azure Key Vault, HashiCorp Vault)
4. Suggest: Rotate the exposed secret immediately
5. If in git history: Recommend BFG Repo-Cleaner or git-filter-repo

## Low-Severity Suggestions

- Missing JSDoc/type annotations
- Console.log statements (should use logger)
- Magic numbers (define as constants)
- Commented-out code (remove if not needed)
- Missing error messages (user-facing)
