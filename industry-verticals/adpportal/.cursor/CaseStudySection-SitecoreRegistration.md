# CaseStudySection – Sitecore registration via Marketer MCP

Use this with the **Marketer MCP** to register **CaseStudySection** in Sitecore. Follow `componentRegistration.mdc`; do not add the rendering to Available Renderings.

**Variables:**
- **ComponentName:** CaseStudySection  
- **DataFolderName:** CaseStudySections  
- **No placeholders**

**Fields (from `CaseStudySection.tsx` interface):**

| Field         | Type           | Shared | Source              |
|---------------|----------------|--------|---------------------|
| Title         | Single-Line Text | no   | —                   |
| Subtitle      | Rich Text      | no     | query:$xaRichTextProfile |
| ClientLogo    | Image          | yes    | query:$siteMedia    |
| PhoneNumber   | Single-Line Text | no   | —                   |
| FreeQuoteText | Single-Line Text | no   | —                   |
| FreeQuoteLink | General Link   | yes    | query:$linkableHomes |
| Quote         | Rich Text      | no     | query:$xaRichTextProfile |
| QuoteAuthor   | Single-Line Text | no   | —                   |
| CTA1Text      | Single-Line Text | no   | —                   |
| CTA1Link      | General Link   | yes    | query:$linkableHomes |
| CTA2Text      | Single-Line Text | no   | —                   |
| CTA2Link      | General Link   | yes    | query:$linkableHomes |

**Standard values (from `defaultFields`):**
- Title: `Amazon overcame their payroll challenges with ADP`
- Subtitle: `<p>Learn how ADP is supporting Amazon on the payroll transformation journey</p>`
- ClientLogo: (empty)
- PhoneNumber: `0800 1707 677`
- FreeQuoteText: `Free Quote`
- FreeQuoteLink: → home (`/sitecore/content/industry-verticals/adp/home`)
- Quote: `"Our ADP team is knowledgeable..."`
- QuoteAuthor: `Greg Harmer, Global Head of Payroll, Amazon`
- CTA1Text: `Watch Video` | CTA1Link: → home
- CTA2Text: `See case study` | CTA2Link: → home

**Paths:**
- Template folder: `/sitecore/templates/Project/adp/CaseStudySection`
- Data template: `.../CaseStudySection Template` with section `Data`
- Folder template: `.../CaseStudySection Folder`
- Rendering params: `.../CaseStudySection Rendering Parameters`
- Data folder: `/sitecore/content/industry-verticals/ADP/Data/CaseStudySections`
- Default item: `.../Default CaseStudySection`
- Rendering: `/sitecore/layout/Renderings/Project/adp/CaseStudySection`

**Rendering fields:**
- Component Name: `CaseStudySection`
- Parameters Template: (ID of CaseStudySection Rendering Parameters)
- Datasource Template: `/sitecore/templates/Project/adp/CaseStudySection/CaseStudySection Template`
- Datasource Location / Data source:  
  `query:$site/*[@@name='Data']/*[@@templatename='CaseStudySection Folder']|query:$sharedSites/*[@@name='Data']/*[@@templatename='CaseStudySection Folder']`

**Frontend:** `component-map.ts` already has `CaseStudySection` with `componentType: 'client'`.
