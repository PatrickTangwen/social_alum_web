# Career Explorer Registration

A gated web form through which Yale SOM and YSE alumni add themselves to the Career Explorer. A visitor proves control of an email address on an allowed domain, then fills in one form. There are no accounts and no passwords.

## Language

### Eligibility

**Allowed Domain**:
An email domain whose addresses (including addresses on its subdomains) are eligible to register. Configured per deployment.
_Avoid_: whitelist, eligible domain, permitted domain

**Eligibility Check**:
The rule that an email address belongs to an Allowed Domain. It is a syntactic check on the address and involves no account.
_Avoid_: authentication, login, sign-in

### Verification

**Verification Code**:
A six-digit, single-use, short-lived code sent to an email address so its owner can prove control of it. Only one Verification Code is live per email address at a time.
_Avoid_: magic code, OTP, PIN, token

**Verified Email**:
An email address whose owner has entered a correct Verification Code. It is the identity of a Registrant.
_Avoid_: user email, account email

**Verified Session**:
The time-bounded state in which a browser is treated as acting on behalf of one Verified Email. It survives page reloads and ends by expiry or by a successful Registration.
_Avoid_: login session, auth session, logged in

### Registration

**Registrant**:
An alum identified by a Verified Email who fills in the form.
_Avoid_: user, member, account, applicant

**Registration**:
The single form submission made by a Registrant, describing where they sit in the Career Explorer. Each Verified Email has at most one Registration, and a Registration cannot be edited after it is made.
_Avoid_: submission, entry, response, form data, profile

### Career Explorer

**Career Explorer**:
The matrix of Yale SOM and YSE alumni working in social impact, arranged by Impact Theme and Job Function. Registrations are its source of new entries.
_Avoid_: matrix, wayfinder, directory

**Impact Theme**:
The area of social or environmental impact a Registrant works in, drawn from the IRIS+ taxonomy plus Religion & Spirituality. A row of the Career Explorer. A Registrant may have several.
_Avoid_: impact area, sector, category, cause

**Job Function**:
The kind of role a Registrant holds, describing how they achieve impact day to day. A column of the Career Explorer. A Registrant may have several.
_Avoid_: role type, career path, job type

**Organization Type**:
The kind of organization a Registrant works for: Nonprofit/NGO, Government, Foundation, University, Startup, or Corporation. Exactly one per Registration.
_Avoid_: org category, employer type, sector

### Embedding

**Host Page**:
The web page, owned by someone else, into which the registration form is placed. It owns
typography and page layout; the form inherits them.
_Avoid_: parent page, container page, site

**Registration Embed**:
The script and stylesheet that mount the registration form into a placeholder on a Host
Page. It carries component styles only.
_Avoid_: widget, iframe, plugin, standalone page
