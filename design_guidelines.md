# Admin Dashboard Design Guidelines

## Design Approach
**System:** Modern Admin Interface Pattern - Drawing from Linear, Vercel Dashboard, and Stripe's admin interfaces
**Rationale:** Data-heavy admin dashboard requiring clear information hierarchy, efficient workflows, and professional aesthetics for productivity

## Core Design Elements

### A. Color Palette

**Dark Mode (Primary):**
- Background Base: `222 47% 11%` (Deep charcoal)
- Surface: `222 47% 14%` (Elevated panels)
- Surface Hover: `222 47% 17%`
- Border: `222 43% 20%`
- Text Primary: `220 40% 98%`
- Text Secondary: `220 17% 65%`
- Text Muted: `220 9% 46%`

**Brand Colors:**
- Primary: `221 83% 53%` (Vibrant blue for CTAs, active states)
- Primary Hover: `221 83% 48%`
- Success: `142 76% 45%` (Order completed, stock available)
- Warning: `38 92% 50%` (Low stock alerts)
- Danger: `0 84% 60%` (Delete actions, critical alerts)

**Status Colors:**
- Pending: `38 92% 50%`
- Processing: `221 83% 53%`
- Completed: `142 76% 45%`
- Cancelled: `0 84% 60%`

### B. Typography
- **Font Family:** Inter from Google Fonts
- **Heading Scale:** text-2xl (24px) for page titles, text-lg (18px) for section headers, text-base (16px) for card titles
- **Body Text:** text-sm (14px) for table content and forms, text-xs (12px) for metadata and labels
- **Weights:** font-semibold (600) for headings, font-medium (500) for labels, font-normal (400) for body

### C. Layout System
**Spacing Units:** Consistently use units of 2, 4, 6, 8, and 16
- Component padding: `p-4` and `p-6`
- Section margins: `mb-6` and `mb-8`
- Card spacing: `space-y-4`
- Grid gaps: `gap-4` and `gap-6`

**Grid Structure:**
- Sidebar: Fixed width `w-64` on desktop, collapsible on mobile
- Main content: `flex-1` with `max-w-7xl` container
- Dashboard cards: `grid-cols-1 md:grid-cols-2 lg:grid-cols-4`
- Tables: Full width within container

### D. Component Library

**1. Navigation**
- Sidebar: Fixed left navigation with logo, user profile, and menu items
- Active state: Primary blue background with icon and text
- Hover state: Subtle surface-hover background
- Icons: Heroicons (outline style for inactive, solid for active)

**2. Login Page**
- Centered card layout: `max-w-md` with soft shadow
- Form fields: Dark background with border-bottom accent on focus
- Login button: Full width, primary color
- No hero image - clean, professional focus on authentication

**3. Dashboard Cards (Overview)**
- Four-column grid with stat cards
- Each card: Icon, large numeric value, label, trend indicator
- Subtle border, hover lift effect with shadow
- Background: surface color

**4. Data Tables**
- Sticky header with sort indicators
- Alternating row hover states
- Action buttons: Icon buttons in row (edit, delete)
- Pagination: Bottom right with page numbers and per-page selector
- Search: Top right with icon, bordered input

**5. Forms (Add/Edit)**
- Modal overlay: `backdrop-blur-sm` with centered content
- Form layout: Single column with proper label/input spacing
- Input fields: `bg-surface` with border, focus ring in primary color
- Buttons: Primary for submit, ghost/outline for cancel

**6. Status Badges**
- Rounded pills with colored background and text
- Small text size with medium weight
- Positioned in table cells for order/product status

**7. Charts (Overview)**
- Line chart for revenue trends
- Bar chart for monthly comparisons
- Use subtle grid lines, primary color for data
- Transparent background, border around chart area

### E. Interaction Patterns

**Tables:**
- Row hover: Subtle background change
- Click row: Navigate to detail view or trigger edit modal
- Checkbox column: Bulk selection for batch operations
- Sort: Click column header, show arrow indicator

**Modals:**
- Backdrop: `bg-black/50 backdrop-blur-sm`
- Content: Slide-in animation from center
- Close: X button top-right + ESC key + click outside

**Notifications:**
- Toast position: Top-right corner
- Success/Error states with appropriate colors
- Auto-dismiss after 3 seconds with progress bar

**Loading States:**
- Skeleton screens for table rows
- Spinner for form submissions
- Disable buttons during processing

### F. Page-Specific Layouts

**Login:** Centered card (400px width), simple form, logo at top

**Overview:** Four stat cards, two chart sections below, recent activity table at bottom

**Management Pages:** Search/filter bar + action button (top), data table (main), pagination (bottom)

**Detail/Edit Modals:** Form fields in single column, action buttons at bottom right

### G. Responsive Behavior
- Mobile: Hamburger menu, stacked cards, horizontal scroll tables
- Tablet: Sidebar collapsed to icons, two-column cards
- Desktop: Full sidebar, four-column grid, optimal table view

This design prioritizes data clarity, efficient navigation, and professional aesthetics suitable for daily administrative tasks.