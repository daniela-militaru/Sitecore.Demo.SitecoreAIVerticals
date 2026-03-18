# TestimonialCarouselSection – Sitecore registration (marketer MCP)

Use this with the **marketer MCP** to register **TestimonialCarouselSection** in Sitecore. Follow `componentRegistration.mdc` exactly. **Do not add this rendering to Available Renderings.**

**Component:** `TestimonialCarouselSection` (file: `src/components/adp/TestimonialCarouselSection.tsx`)  
**Data template name:** TestimonialCarouselSection Template  
**Data folder name:** TestimonialCarouselSections (plural)  
**TSX component name:** TestimonialCarouselSection

---

## Pre-check (run first)

If any of these exist, **STOP** and report; do not modify.

- `/sitecore/templates/Project/adp/TestimonialCarouselSection`
- `/sitecore/content/industry-verticals/adp/Data/TestimonialCarouselSections`
- `/sitecore/layout/Renderings/Project/adp/TestimonialCarouselSection`

---

## Constants (from runbook)

| Variable                           | Value                                                                                                                 |
| ---------------------------------- | --------------------------------------------------------------------------------------------------------------------- |
| ComponentTemplatesPath             | `/sitecore/templates/Project/adp/`                                                                                    |
| RootWebsitePath                    | `/sitecore/content/industry-verticals/adp`                                                                            |
| HomeWebsitePath                    | `/sitecore/content/industry-verticals/adp/home`                                                                       |
| ComponentsFolder                   | `/sitecore/layout/Renderings/Project/adp`                                                                             |
| StandardTemplate                   | `/sitecore/templates/System/Templates/Standard template`                                                              |
| PerSiteStandardValues              | `/sitecore/templates/Foundation/Experience Accelerator/StandardValues/_PerSiteStandardValues`                         |
| FolderBaseTemplate                 | `/sitecore/templates/Common/Folder`                                                                                   |
| BaseRenderingParametersTemplate    | `/sitecore/templates/Foundation/JSS Experience Accelerator/Presentation/Rendering Parameters/BaseRenderingParameters` |
| IDynamicPlaceholder                | `/sitecore/templates/Foundation/Experience Accelerator/Dynamic Placeholders/Rendering Parameters/IDynamicPlaceholder` |
| IRenderingId                       | `/sitecore/templates/Foundation/Experience Accelerator/Markup Decorator/Rendering Parameters/IRenderingId`            |
| RenderingTemplate (Json Rendering) | `/sitecore/templates/Foundation/JavaScript Services/Json Rendering`                                                   |
| TemplateSectionTemplate            | `/sitecore/templates/System/Templates/Template section`                                                               |
| TemplateFieldTemplate              | `/sitecore/templates/System/Templates/Template field`                                                                 |
| FolderTemplateIcon                 | `/sitecore/shell/themes/standard/Applications/32x32/folder.png`                                                       |
| DataTemplateIcon                   | _(empty)_                                                                                                             |

---

## Step 1 – Component template folder

1.1. Get item by path: `/sitecore/templates/Project/adp/` → **parentId**.  
1.2. Create a **template folder** named **TestimonialCarouselSection** under that parent.  
1.3. Get item by path: `/sitecore/templates/Project/adp/TestimonialCarouselSection` → store as **GeneratedComponentTemplatesRoot** (id + path).

---

## Step 2 – Data template

**Base templates:** Standard template, \_PerSiteStandardValues.

2.1. Create a **data template** named **TestimonialCarouselSection Template** under **GeneratedComponentTemplatesRoot**, inheriting from Standard template and \_PerSiteStandardValues. Store as **GeneratedDataTemplate**.

2.2. Under **GeneratedDataTemplate**, add a section **Data** (template section). Under **Data**, add these **template fields** (inherit from Template field):

| Field name   | Type             | Source                     |
| ------------ | ---------------- | -------------------------- |
| Label        | Single-Line Text | —                          |
| Quote1       | Rich Text        | `query:$xaRichTextProfile` |
| Quote1Author | Single-Line Text | —                          |
| Quote2       | Rich Text        | `query:$xaRichTextProfile` |
| Quote2Author | Single-Line Text | —                          |
| Quote3       | Rich Text        | `query:$xaRichTextProfile` |
| Quote3Author | Single-Line Text | —                          |
| CTA1Text     | Single-Line Text | —                          |
| CTA1Link     | General Link     | `query:$linkableHomes`     |
| CTA2Text     | Single-Line Text | —                          |
| CTA2Link     | General Link     | `query:$linkableHomes`     |

2.4. Under **GeneratedDataTemplate**, create **\_\_Standard Values** with template = **GeneratedDataTemplate**. Set the data template’s **\_\_Standard values** field to this \_\_Standard Values item. Store as **GeneratedDataTemplateStandardValuesItem**.

2.5. In **\_\_Standard Values**:

- Set **Icon** to empty (DataTemplateIcon).
- **Data** section: set values from defaultFields below. **General Link fields (CTA1Link, CTA2Link)** must point to **Home** (`/sitecore/content/industry-verticals/adp/home`).

**Standard Values – Data field values:** (from defaultFields in TSX; General Link fields point to Home)

- **Label:** `MEET OUR CLIENTS`
- **Quote1:** `<p>"99.9% of our employees are now paid on ADP, and our payroll problems are at an all-time low ... Our recent employee survey saw significant improvement."</p>`
- **Quote1Author:** `Traci Memmott Global Head of Payroll, PayPal`
- **Quote2:** `<p>"ADP is a great partner and we are impressed by the transformation of ADP's iHCM Payroll. We are confident that our processes continue to improve."</p>`
- **Quote2Author:** `Tom Morrison, Global Head of Payroll, Amazon`
- **Quote3:** `<p>"Our ADP team is knowledgeable and there to advise us and answer our questions. That, combined with ADP's robust and adaptable global technology, gives us confidence our employees are taken care of."</p>`
- **Quote3Author:** `Greg Harmer, Global Head of Payroll, Amazon`
- **CTA1Text:** `Talk to an Expert`
- **CTA1Link:** link to **Home** ({{HomeWebsitePath}})
- **CTA2Text:** `Request a demo`
- **CTA2Link:** link to **Home** ({{HomeWebsitePath}})

  2.7. Retrieve **GeneratedDataTemplate** and confirm: all sections + fields exist; Rich Text fields (Quote1, Quote2, Quote3) have Source = `query:$xaRichTextProfile`; General Link fields have Source = `query:$linkableHomes`.

---

## Step 3 – Data folder template

3.1. Under **GeneratedComponentTemplatesRoot**, create a **template** named **TestimonialCarouselSection Folder** inheriting from **Folder** (FolderBaseTemplate). Store as **GeneratedDataFolderTemplate**.

3.2. Under **GeneratedDataFolderTemplate**, create **\_\_Standard Values** with template = **GeneratedDataFolderTemplate**. Set **GeneratedDataFolderTemplate**’s **\_\_Standard values** field to this \_\_Standard Values item. Store as **GeneratedDataFolderTemplateStandardValuesItem**.

3.3. In **\_\_Standard Values**: set **Insert Options** (**Masters**) to allow **GeneratedDataTemplate** and **GeneratedDataFolderTemplate**.

3.4. In **\_\_Standard Values**: set **Icon** to folder icon (FolderTemplateIcon).

3.5. Retrieve **GeneratedDataFolderTemplate** and verify \_\_Standard Values and Insert options.

---

## Step 4 – Rendering parameters template

4.1. Under **GeneratedComponentTemplatesRoot**, create a **rendering parameters template** named **TestimonialCarouselSection Rendering Parameters** inheriting from BaseRenderingParameters, IDynamicPlaceholder, IRenderingId. Store as **GeneratedRenderingTemplate**.

4.2. Add section **Rendering Parameters** with no fields.

4.4. Retrieve **GeneratedRenderingTemplate** and confirm.

---

## Step 5 – Data folder insert options

5.1. Get `/sitecore/content/industry-verticals/adp/Data` and read **Insert Options** (**Masters**).  
5.2. Append **GeneratedDataFolderTemplate** ID to **Masters** (do not overwrite).  
5.3. Get Data again and verify **Masters** includes **GeneratedDataFolderTemplate**.

---

## Step 6 – Data items

6.1. Under `/sitecore/content/industry-verticals/adp/Data`, create a folder based on **GeneratedDataFolderTemplate**, name **TestimonialCarouselSections**. Store as **GeneratedDataFolderItem**.

6.2. Under **GeneratedDataFolderItem**, create an item based on **GeneratedDataTemplate**, name **Default TestimonialCarouselSection**. Store as **GeneratedDataItem**. Set Data fields from defaultFields; CTA1Link and CTA2Link point to home.

6.3. Retrieve **GeneratedDataFolderItem** and **GeneratedDataItem** and confirm templates.

---

## Step 7 – JSON rendering

7.1. Under **ComponentsFolder** `/sitecore/layout/Renderings/Project/adp`, create a **Json Rendering** item named **TestimonialCarouselSection** with:

- **Component Name**: `TestimonialCarouselSection`
- **Parameters Template**: **GeneratedRenderingTemplate** (template ID)
- **Datasource Template**: **GeneratedDataTemplate** (template ID)
- **Datasource Location**:  
  `query:$site/*[@@name='Data']/*[@@name='TestimonialCarouselSections']|query:$sharedSites/_[@@name='Data']/_[@@name='TestimonialCarouselSections']`

Store as **GeneratedRenderingItem**.

7.2. Retrieve **GeneratedRenderingItem** and confirm template and field values.

---

**Do not** add this rendering to the Available Renderings item.

---

## Field reference (from TestimonialCarouselSection.tsx)

```ts
interface Fields {
  Label: TextField;
  Quote1: RichTextField;
  Quote1Author: TextField;
  Quote2: RichTextField;
  Quote2Author: TextField;
  Quote3: RichTextField;
  Quote3Author: TextField;
  CTA1Text: TextField;
  CTA1Link: LinkField;
  CTA2Text: TextField;
  CTA2Link: LinkField;
}
```

Default values: see defaultFields in the TSX file; General Link fields in \_\_Standard Values must point to Home.

---

After each create, retrieve the item and verify; keep all generated IDs for later steps.
