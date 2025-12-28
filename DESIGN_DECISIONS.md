# Design Decisions & UX Rationale

## Coupon System Design

### Decision: Allow Manual Coupon Generation Even When Active Coupon Exists

**Date**: December 28, 2025

#### Context
The backend supports two methods of coupon generation:
1. **Automatic**: System generates coupons every Nth order (default: every 5th order)
2. **Manual**: Admin can force-generate coupons via `POST /api/admin/coupons/generate`

The backend explicitly supports replacing existing active coupons through manual generation.

#### Decision
**Enable** the "Generate New Coupon" button at all times, even when an active coupon exists.

#### Rationale

**Why Allow Override:**
1. **Backend Support**: The backend API explicitly allows admins to replace existing coupons
2. **Emergency Use Cases**: 
   - Active coupon has a typo or issue
   - Need to launch a time-sensitive promotion
   - Current coupon isn't being used and needs refresh
3. **Admin Control**: The UI text states "This manual generation is for admin override" - the feature is designed for this purpose
4. **Flexibility**: Admins should have full control over promotional campaigns

**Why Not Disable:**
1. Disabling contradicts the "admin override" purpose stated in the UI
2. Backend already supports the operation - UI shouldn't add artificial restrictions
3. Creates confusion: "Why can't I override if it says 'admin override'?"

#### Implementation Details

**User Safety Measures:**
1. **Visual Warning**: Display warning message when active coupon exists: 
   > "⚠️ Generating a new coupon will replace the existing active coupon."
2. **Confirmation Dialog**: Require explicit confirmation before replacing:
   > "Warning: This will replace the existing active coupon '{code}'. Are you sure you want to continue?"
3. **Clear Feedback**: Show success message with the new coupon code

**Code Changes:**
- Removed `[disabled]="!!activeCoupon"` from button
- Added conditional warning message in HTML
- Added confirmation dialog in TypeScript
- Added warning text styling in CSS

#### Alternative Considered

**Option 1: Keep Button Disabled**
- ❌ Contradicts backend capability
- ❌ Limits admin flexibility
- ❌ Contradicts "admin override" messaging

**Option 2: Current Implementation** ✅
- ✅ Aligns with backend functionality
- ✅ Provides safety through confirmation
- ✅ Matches stated purpose
- ✅ Gives admins full control

#### Business Impact

**Positive:**
- Admins can quickly respond to marketing needs
- Reduces dependency on developers for urgent changes
- Allows fixing problematic coupons without backend changes

**Risk Mitigation:**
- Confirmation dialog prevents accidental overrides
- Visual warning draws attention to the action
- Action is logged in backend for audit trail

#### Related Assumptions

**Single Active Coupon Model:**
- Only ONE system-wide coupon active at any time
- Not per-user coupons
- First-come-first-served usage model
- Old coupon expires when new one is generated (auto or manual)

**Coupon Lifecycle:**
- No time-based expiration
- Persists until used OR replaced by next coupon
- Users cannot generate their own coupons
- All users see the same active coupon

---

## Folder Structure Simplification

### Decision: Flatten Feature Component Folders

**Date**: December 28, 2025

#### Context
Original structure had redundant nesting:
```
features/
  cart/
    cart/           ← Redundant
      cart.ts
      cart.html
      cart.css
```

#### Decision
Flatten to single-level component folders:
```
features/
  cart/
    cart.ts
    cart.html
    cart.css
```

#### Rationale
1. **Removes Redundancy**: No need for `cart/cart/` or `checkout/checkout/`
2. **Simpler Navigation**: Fewer clicks to reach component files
3. **Cleaner Imports**: `../../services/` instead of `../../../services/`
4. **Standard Practice**: Matches common Angular project structures
5. **Maintainability**: Easier to understand and navigate codebase

#### Impact
- Updated import paths in all component files
- Updated routing configuration in `app.routes.ts`
- Build verified successfully after changes

---

*This document tracks significant design and UX decisions made during development. Update as new decisions are made.*
