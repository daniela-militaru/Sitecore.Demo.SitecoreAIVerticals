# Miller Homes Component Registration Runbook

Register 3 components in SitecoreAI via Marketer MCP: **StatCard**, **AnnouncementBannerSection**, **VirtualTourBannerSection**.

**Prerequisite:** Connect and authenticate the **marketer MCP** (user-marketer) in Cursor Settings.

---

## Variable Reference (from componentRegistration.mdc)

| Variable | Value |
|----------|-------|
| {{ComponentTemplatesPath}} | /sitecore/templates/Project/miller-homes/ |
| {{RootWebsitePath}} | /sitecore/content/industry-verticals/Miller Homes |
| {{ComponentsFolder}} | /sitecore/layout/Renderings/Project/miller-homes |
| {{StandardTemplate}} | /sitecore/templates/System/Templates/Standard template |
| {{PerSiteStandardValues}} | /sitecore/templates/Foundation/Experience Accelerator/StandardValues/_PerSiteStandardValues |
| {{FolderBaseTemplate}} | /sitecore/templates/Common/Folder |
| {{BaseRenderingParametersTemplate}} | /sitecore/templates/Foundation/JSS Experience Accelerator/Presentation/Rendering Parameters/BaseRenderingParameters |
| {{IDynamicPlaceholder}} | /sitecore/templates/Foundation/Experience Accelerator/Dynamic Placeholders/Rendering Parameters/IDynamicPlaceholder |
| {{IRenderingId}} | /sitecore/templates/Foundation/Experience Accelerator/Markup Decorator/Rendering Parameters/IRenderingId |
| {{RenderingFolderTemplate}} | /sitecore/templates/Foundation/JSS Experience Accelerator/Multisite/Folders/Rendering Folder |
| {{RenderingTemplate}} | /sitecore/templates/Foundation/JavaScript Services/Json Rendering |
| {{FolderTemplateIcon}} | /sitecore/shell/themes/standard/Applications/32x32/folder.png |

---

## Pre-checks (Step 0) – RUN FIRST

**0.1** Retrieve and confirm these templates exist via `get_content_item_by_path`:
- `/sitecore/templates/System/Templates/Standard template`
- `/sitecore/templates/Foundation/Experience Accelerator/StandardValues/_PerSiteStandardValues`
- `/sitecore/templates/Common/Folder`
- `/sitecore/templates/Foundation/JSS Experience Accelerator/Presentation/Rendering Parameters/BaseRenderingParameters`
- `/sitecore/templates/Foundation/Experience Accelerator/Dynamic Placeholders/Rendering Parameters/IDynamicPlaceholder`
- `/sitecore/templates/Foundation/Experience Accelerator/Markup Decorator/Rendering Parameters/IRenderingId`
- `/sitecore/templates/Foundation/JSS Experience Accelerator/Multisite/Folders/Rendering Folder`
- `/sitecore/templates/Foundation/JavaScript Services/Json Rendering`

**0.2** Retrieve and confirm this item exists:
- `/sitecore/content/industry-verticals/Miller Homes/Data`

**IMPORTANT:** If any target item for a component already exists at its intended path, STOP and report. Do not modify existing items.

---

## Component 1: StatCard

**Values:**
- ComponentName = StatCard
- TemplateName = StatCard Template
- TemplateFolderName = StatCard
- RenderingFolderName = StatCard Renderings
- DataFolderName = StatCards (plural)
- TSXComponentName = StatCard

**Data template fields (section "Data"):**
- Value (Single-Line Text)
- Label (Single-Line Text)

### Steps 1–7 for StatCard

1. Create template folder `/sitecore/templates/Project/miller-homes/StatCard`
2. Create data template `StatCard Template` under it (inherits Standard template + PerSiteStandardValues)
3. Add section "Data" with fields: Value, Label
4. Create __Standard Values for StatCard Template (icon: search sitecoreicons.com for "stat" or "chart")
5. Create `StatCard Folder` template (inherits Folder)
6. Create `StatCard Rendering Parameters` template (inherits BaseRenderingParameters, IDynamicPlaceholder, IRenderingId)
7. Append StatCard Folder to Insert Options of `/sitecore/content/industry-verticals/Miller Homes/Data`
8. Create folder `StatCards` under Data, create item `Default StatCard` under it
9. Create folder `StatCard Renderings` under ComponentsFolder, create JSON rendering `StatCard` with:
   - Component Name: StatCard
   - Parameters Template: StatCard Rendering Parameters template ID
   - Datasource Template: StatCard Template template ID
   - Datasource Location: `query:$site/*[@@name='Data']/*[@@name='StatCards']|query:$sharedSites/*[@@name='Data']/*[@@name='StatCards']`

---

## Component 2: AnnouncementBannerSection

**Values:**
- ComponentName = AnnouncementBannerSection
- TemplateName = AnnouncementBannerSection Template
- DataFolderName = AnnouncementBannerSections

**Data template fields (section "Data"):**
- Heading (Single-Line Text)
- Description (Rich Text) – Source: query:$xaRichTextProfile
- ReadMoreLink (General Link) – Source: query:$linkableHomes

### Steps 1–7 for AnnouncementBannerSection

Same pattern as StatCard, substituting AnnouncementBannerSection values. Create AnnouncementBannerSection folder, template, folder template, rendering parameters, data folder "AnnouncementBannerSections", default item, rendering folder, and JSON rendering.

---

## Component 3: VirtualTourBannerSection

**Values:**
- ComponentName = VirtualTourBannerSection
- TemplateName = VirtualTourBannerSection Template
- DataFolderName = VirtualTourBannerSections

**Data template fields (section "Data"):**
- Text (Single-Line Text)
- CTALink (General Link) – Source: query:$linkableHomes
- CTAText (Single-Line Text)

### Steps 1–7 for VirtualTourBannerSection

Same pattern as StatCard, substituting VirtualTourBannerSection values.

---

## Field Source Rules

- **Image fields:** Source = `query:$siteMedia`
- **Rich Text fields:** Source = `query:$xaRichTextProfile`
- **General Link fields:** Source = `query:$linkableHomes`

---

## Verification After Each Component

After creating each item/template:
1. Retrieve it via `get_content_item_by_path` or `get_content_item_by_id`
2. Confirm it exists and has the correct template
3. Record the created item's ID and full path for later steps
