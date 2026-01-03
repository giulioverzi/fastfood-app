# Security Notes

This document outlines security considerations identified during the project restructuring.

## CodeQL Security Scan Results

### Pre-existing Issues (Not Introduced by Restructuring)

#### 1. Missing Rate Limiting (35 alerts)
- **Severity**: Medium
- **Status**: Pre-existing
- **Description**: API endpoints lack rate limiting protection
- **Impact**: Potential for DoS attacks and brute force attempts
- **Recommendation**: Implement rate limiting middleware using `express-rate-limit`
- **Affected Routes**: All API routes (auth, users, restaurants, dishes, orders)

#### 2. ReDoS Vulnerability in Email Validation (2 alerts)
- **Severity**: Medium
- **Status**: Pre-existing
- **Location**: `models/User.js:26`
- **Description**: Email validation regex can cause exponential backtracking
- **Current Regex**: `/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/`
- **Impact**: Potential DoS through specially crafted email inputs
- **Recommendation**: Use a simpler regex or leverage express-validator for email validation

### Security Features Maintained

✅ **JWT Authentication**: Properly implemented with Bearer tokens
✅ **Password Hashing**: bcryptjs with proper salt rounds
✅ **Input Validation**: express-validator on API endpoints
✅ **Authorization Checks**: Role-based access control (cliente/ristoratore)
✅ **Mongoose Security**: Using Mongoose ODM with schema validation

### Recommendations for Future Security Improvements

1. **Add Rate Limiting**
   ```javascript
   const rateLimit = require('express-rate-limit');
   
   const apiLimiter = rateLimit({
     windowMs: 15 * 60 * 1000, // 15 minutes
     max: 100 // limit each IP to 100 requests per windowMs
   });
   
   app.use('/api/', apiLimiter);
   ```

2. **Fix Email Validation Regex**
   - Replace with simpler pattern or use validator.isEmail()
   - Consider using express-validator's email() method which is already imported

3. **Add Helmet.js**
   - Add security headers to HTTP responses

4. **Implement CSRF Protection**
   - Add CSRF tokens for state-changing operations

5. **Add Request Logging**
   - Implement proper logging for security auditing

## Notes

These security issues were present in the original codebase before restructuring. The restructuring task focused on:
- Reorganizing file structure
- Moving backend/ to root-level directories
- Updating import paths
- Cleaning up obsolete files

No changes were made that would introduce new security vulnerabilities. All existing security measures (JWT, bcrypt, validation) remain functional and properly configured.
