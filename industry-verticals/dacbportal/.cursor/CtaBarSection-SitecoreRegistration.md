# CtaBarSection – Sitecore registration (marketer MCP)

Use this with the **marketer MCP** to register **CtaBarSection** in Sitecore. Follow `componentRegistration.mdc` exactly.

**Component:** `CtaBarSection` (file: `src/components/adp/CtaBarSection.tsx`)  
**Data template name:** CtaBarSection Template  
**Data folder name:** CtaBarSections (plural)  
**TSX component name:** CtaBarSection

---

## Pre-check (run first)

If any of these exist, **STOP** and report; do not modify.

- `/sitecore/templates/Project/adp/CtaBarSection`
- `/sitecore/content/industry-verticals/adp/Data/CtaBarSections`
- `/sitecore/layout/Renderings/Project/adp/CtaBarSection`

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
1.2. Create a **template folder** (or folder item) named **CtaBarSection** under that parent.  
1.3. Get item by path: `/sitecore/templates/Project/adp/CtaBarSection` → store as **GeneratedComponentTemplatesRoot** (id + path).

---

## Step 2 – Data template

**Base templates:** Standard template, \_PerSiteStandardValues.

2.1. Create a **data template** named **CtaBarSection Template** under **GeneratedComponentTemplatesRoot**, inheriting from Standard template and \_PerSiteStandardValues. Store as **GeneratedDataTemplate**.

2.2. Under **GeneratedDataTemplate**, add a section **Data** (template section). Under **Data**, add these **template fields** (inherit from Template field):

| Field name    | Type             | Source (if applicable) |
| ------------- | ---------------- | ---------------------- |
| Logo          | Image            | `query:$siteMedia`     |
| PhoneNumber   | Single-Line Text | —                      |
| PhoneLink     | General Link     | `query:$linkableHomes` |
| FreeQuoteText | Single-Line Text | —                      |
| FreeQuoteLink | General Link     | `query:$linkableHomes` |

2.4. Under **GeneratedDataTemplate**, create **\_\_Standard Values** with template = **GeneratedDataTemplate**. Set the data template’s **\_\_Standard values** field to this \_\_Standard Values item. Store as **GeneratedDataTemplateStandardValuesItem**.

2.5. In **\_\_Standard Values**:

- Set **Icon** to empty (DataTemplateIcon).
- **Data** section: set only the following; leave **Logo** empty.
  - **PhoneNumber**: `0800 1707 677`
  - **PhoneLink**: link to `/sitecore/content/industry-verticals/adp/home`
  - **FreeQuoteText**: `Free Quote`
  - **FreeQuoteLink**: link to `/sitecore/content/industry-verticals/adp/home`

  2.7. Retrieve **GeneratedDataTemplate** and confirm: sections + fields exist; Image field Source = `query:$siteMedia`; no LongDetails in this component.

---

## Step 3 – Data folder template

3.1. Under **GeneratedComponentTemplatesRoot**, create a **template** named **CtaBarSection Folder** inheriting from **Folder** (FolderBaseTemplate). Store as **GeneratedDataFolderTemplate**.

3.2. Under **GeneratedDataFolderTemplate**, create **\_\_Standard Values** with template = **GeneratedDataFolderTemplate**. Set **GeneratedDataFolderTemplate**’s **\_\_Standard values** field to this \_\_Standard Values item. Store as **GeneratedDataFolderTemplateStandardValuesItem**.

3.3. In **\_\_Standard Values**: set **Insert Options** (**Masters**) to allow **GeneratedDataTemplate** and **GeneratedDataFolderTemplate**.

3.4. In **\_\_Standard Values**: set **Icon** to `.../folder.png` (FolderTemplateIcon).

3.5. Retrieve **GeneratedDataFolderTemplate** and verify \_\_Standard Values and Insert options.

---

## Step 4 – Rendering parameters template

4.1. Under **GeneratedComponentTemplatesRoot**, create a **rendering parameters template** named **CtaBarSection Rendering Parameters** inheriting from BaseRenderingParameters, IDynamicPlaceholder, IRenderingId. Store as **GeneratedRenderingTemplate** (this is the _parameters_ template, not the JSON rendering item).

4.2. Add section **Rendering Parameters** with no fields.

4.4. Retrieve **GeneratedRenderingTemplate** and confirm.

---

## Step 5 – Data folder insert options

5.1. Get `/sitecore/content/industry-verticals/adp/Data` and read **Insert Options** (**Masters**).  
5.2. Append **GeneratedDataFolderTemplate** ID to **Masters** (do not overwrite).  
5.3. Get Data again and verify **Masters** includes **GeneratedDataFolderTemplate**.

---

## Step 6 – Data items

6.1. Under `/sitecore/content/industry-verticals/adp/Data`, create a folder based on **GeneratedDataFolderTemplate**, name **CtaBarSections**. Store as **GeneratedDataFolderItem**.

6.2. Under **GeneratedDataFolderItem**, create an item based on **GeneratedDataTemplate**, name **Default CtaBarSection**. Store as **GeneratedDataItem**. Set Data fields per defaultFields (PhoneNumber, FreeQuoteText; links to home; Logo empty).

6.3. Retrieve **GeneratedDataFolderItem** and **GeneratedDataItem** and confirm templates.

---

## Step 7 – JSON rendering

7.1. Under **ComponentsFolder** `/sitecore/layout/Renderings/Project/adp`, create a **Json Rendering** item named **CtaBarSection** with:

- **Component Name**: `CtaBarSection`
- **Parameters Template**: **GeneratedRenderingTemplate** (template ID)
- **Datasource Template**: **GeneratedDataTemplate** (template ID)
- **Datasource Location**:  
  `query:$site/*[@@name='Data']/*[@@name='CtaBarSections']|query:$sharedSites/_[@@name='Data']/_[@@name='CtaBarSections']`

Store as **GeneratedRenderingItem**.

7.2. Retrieve **GeneratedRenderingItem** and confirm template and field values.

---

## Step 8 – Available Renderings (if applicable)

If your tenant uses an **Available Renderings** list:

- Get item: `/sitecore/content/industry-verticals/adp/Presentation/Available Renderings/adp`.
- Read **Renderings** field (pipe-separated rendering IDs).
- Append **GeneratedRenderingItem** ID.
- Update **Renderings** with the new list.

---

## Field reference (from CtaBarSection.tsx)

```ts
interface Fields {
  Logo: ImageField;
  PhoneNumber: TextField;
  PhoneLink: LinkField;
  FreeQuoteText: TextField;
  FreeQuoteLink: LinkField;
}

const defaultFields: Fields = {
  Logo: { value: { src: '/adp-logo.svg', alt: 'ADP' } }, // → leave empty in Sitecore
  PhoneNumber: { value: '0800 1707 677' },
  PhoneLink: { value: { href: 'tel:08001707677' } }, // → point to home in SV
  FreeQuoteText: { value: 'Free Quote' },
  FreeQuoteLink: { value: { href: '/quote' } }, // → point to home in SV
};
```

Runbook rule: Image = no value in standard values; General Link = home item.

---

After each create, retrieve the item and verify; keep all generated IDs for later steps.
