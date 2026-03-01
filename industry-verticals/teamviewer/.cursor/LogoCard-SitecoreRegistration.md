# LogoCard – Sitecore registration (marketer MCP)

Use this with the **marketer MCP** to register **LogoCard** in Sitecore. Follow `componentRegistration.mdc` exactly.

**Component:** `LogoCard` (file: `src/components/teamviewer/LogoCard.tsx`)  
**Data template name:** LogoCard Template  
**Data folder name:** LogoCards (plural)  
**TSX component name:** LogoCard

---

## Pre-check (run first)

If any of these exist, **STOP** and report; do not modify.

- `/sitecore/templates/Project/teamviewerhackathon/LogoCard`
- `/sitecore/content/teamviewerhackathon/teamviewerhackathon/Data/LogoCards`
- `/sitecore/layout/Renderings/Project/teamviewer/LogoCard Renderings/LogoCard` (or under `.../teamviewer/LogoCard`)

---

## Constants (from runbook)

| Variable                           | Value                                                                                                                 |
| ---------------------------------- | --------------------------------------------------------------------------------------------------------------------- |
| ComponentTemplatesPath             | `/sitecore/templates/Project/teamviewerhackathon/`                                                                    |
| RootWebsitePath                    | `/sitecore/content/teamviewerhackathon/teamviewerhackathon`                                                           |
| HomeWebsitePath                    | `/sitecore/content/teamviewerhackathon/teamviewerhackathon/home`                                                      |
| ComponentsFolder                  | `/sitecore/layout/Renderings/Project/teamviewer`                                                                      |
| MediaFolder                        | `/sitecore/media library/Project/teamviewerhackathon/teamviewerhackathon`                                             |
| StandardTemplate                   | `/sitecore/templates/System/Templates/Standard template`                                                              |
| PerSiteStandardValues              | `/sitecore/templates/Foundation/Experience Accelerator/StandardValues/_PerSiteStandardValues`                         |
| FolderBaseTemplate                 | `/sitecore/templates/Common/Folder`                                                                                   |
| BaseRenderingParametersTemplate    | `/sitecore/templates/Foundation/JSS Experience Accelerator/Presentation/Rendering Parameters/BaseRenderingParameters` |
| IDynamicPlaceholder                | `/sitecore/templates/Foundation/Experience Accelerator/Dynamic Placeholders/Rendering Parameters/IDynamicPlaceholder` |
| IRenderingId                       | `/sitecore/templates/Foundation/Experience Accelerator/Markup Decorator/Rendering Parameters/IRenderingId`            |
| RenderingTemplate (Json Rendering) | `/sitecore/templates/Foundation/JavaScript Services/Json Rendering`                                                   |
| RenderingFolderTemplate            | `/sitecore/templates/Foundation/JSS Experience Accelerator/Multisite/Folders/Rendering Folder`                       |
| TemplateSectionTemplate            | `/sitecore/templates/System/Templates/Template section`                                                               |
| TemplateFieldTemplate              | `/sitecore/templates/System/Templates/Template field`                                                                 |
| FolderTemplateIcon                 | `/sitecore/shell/themes/standard/Applications/32x32/folder.png`                                                       |
| DataTemplateIcon                   | _(empty)_                                                                                                             |

---

## Step 1 – Component template folder

1.1. Get item by path: `/sitecore/templates/Project/teamviewerhackathon/` → **parentId**.  
1.2. Create a **template folder** named **LogoCard** under that parent.  
1.3. Get item by path: `/sitecore/templates/Project/teamviewerhackathon/LogoCard` → store as **GeneratedComponentTemplatesRoot** (id + path).

---

## Step 2 – Data template

**Base templates:** Standard template, _PerSiteStandardValues.

2.1. Create a **data template** named **LogoCard Template** under **GeneratedComponentTemplatesRoot**, inheriting from Standard template and _PerSiteStandardValues. Store as **GeneratedDataTemplate**.

2.2. Under **GeneratedDataTemplate**, add a section **Data** (template section). Under **Data**, add these **template fields** (inherit from Template field):

| Field name | Type             | Source               | Shared |
| ---------- | ---------------- | -------------------- | ------ |
| Logo       | Image            | `query:$siteMedia`   | true   |
| Name       | Single-Line Text | —                    | false  |

2.3. Under **GeneratedDataTemplate**, create **__Standard Values** with template = **GeneratedDataTemplate**. Set the data template’s **__Standard values** field to this __Standard Values item. Store as **GeneratedDataTemplateStandardValuesItem**.

2.4. In **__Standard Values**:

- Set **Icon** to empty (DataTemplateIcon).
- **Data** section:
  - **Logo**: Search media item inside `{{MediaFolder}}` with name matching defaultFields (e.g. `partner-logo.svg`). Get its ID; set Image field to `<image mediaid="{{MediaItemID}}" />`. If not found, leave empty or use a placeholder media ID.
  - **Name**: `Partner Name`

2.5. Set **Insert Options** (__Masters) of **GeneratedDataTemplate** to reference **GeneratedDataTemplateStandardValuesItem** (per runbook 2.7).

2.6. Retrieve **GeneratedDataTemplate** and confirm: Data section + fields exist; Image field **Logo** has Source = `query:$siteMedia`, Shared = true.

---

## Step 3 – Data folder template

3.1. Under **GeneratedComponentTemplatesRoot**, create a **template** named **LogoCard Folder** inheriting from **Folder** (FolderBaseTemplate). Store as **GeneratedDataFolderTemplate**.

3.2. Under **GeneratedDataFolderTemplate**, create **__Standard Values** with template = **GeneratedDataFolderTemplate**. Set **GeneratedDataFolderTemplate**’s **__Standard values** field to this __Standard Values item. Store as **GeneratedDataFolderTemplateStandardValuesItem**.

3.3. In **__Standard Values**: set **Insert Options** (__Masters) to allow **GeneratedDataTemplate** and **GeneratedDataFolderTemplate**. Set **Icon** = FolderTemplateIcon.

3.4. Retrieve **GeneratedDataFolderTemplate** and verify __Standard Values and Insert options.

---

## Step 4 – Rendering parameters template

4.1. Under **GeneratedComponentTemplatesRoot**, create a **rendering parameters template** named **LogoCard Rendering Parameters** inheriting from BaseRenderingParameters, IDynamicPlaceholder, IRenderingId. Store as **GeneratedRenderingTemplate**.

4.2. Add section **Rendering Parameters** with no fields.

4.3. Under **GeneratedRenderingTemplate**, create **__Standard Values** (template = GeneratedRenderingTemplate). Set **GeneratedRenderingTemplate**’s **__Standard values** field to it.

4.4. Retrieve **GeneratedRenderingTemplate** and confirm.

---

## Step 5 – Data folder insert options

5.1. Get `{{RootWebsitePath}}/Data` → `/sitecore/content/teamviewerhackathon/teamviewerhackathon/Data` and read **Insert Options** (__Masters).  
5.2. Append **GeneratedDataFolderTemplate** ID to **Masters** (pipe-separated if not empty).  
5.3. Set **Insert Options** on Data item to the updated value.

---

## Step 6 – Data items

6.1. Under `{{RootWebsitePath}}/Data`, create a folder based on **GeneratedDataFolderTemplate**, name **LogoCards**. Store as **GeneratedDataFolderItem**.

6.2. Under **GeneratedDataFolderItem**, create an item based on **GeneratedDataTemplate**, name **Default LogoCard**. Store as **GeneratedDataItem**. Set Data fields from defaultFields (Logo, Name) as needed.

6.3. Retrieve **GeneratedDataFolderItem** and **GeneratedDataItem** and confirm templates.

---

## Step 7 – JSON rendering

7.1. Under **ComponentsFolder** `/sitecore/layout/Renderings/Project/teamviewer`, create a folder **LogoCard Renderings** using **RenderingFolderTemplate** (if required). Store as **GeneratedRenderingFolderItem**. Otherwise use ComponentsFolder as **GeneratedRenderingFolderItem**.

7.2. Under **GeneratedRenderingFolderItem**, create a **Json Rendering** item named **LogoCard** with:

- **Component Name**: `LogoCard`
- **Parameters Template**: **GeneratedRenderingTemplate** (template ID)
- **Datasource Template**: **GeneratedDataTemplate** (template path or ID as required by MCP)
- **Datasource Location**:  
  `query:$site/*[@@name='Data']/*[@@templatename='LogoCard Folder']|query:$sharedSites/_[@@name='Data']/_[@@templatename='LogoCard Folder']`
- **Data source**:  
  `query:$site/*[@@name='Data']/*[@@templatename='LogoCard Folder']|query:$sharedSites/_[@@name='Data']/_[@@templatename='LogoCard Folder']`

Store as **GeneratedRenderingItem**.

7.3. Retrieve **GeneratedRenderingItem** and confirm template and field values.

---

## Step 8 – Placeholder settings

**Not applicable** – LogoCard does not contain placeholders.

---

## Field reference (from LogoCard.tsx)

```ts
interface Fields {
  Logo: ImageField;
  Name: TextField;
}

const defaultFields: Fields = {
  Logo: { value: { src: '/partner-logo.svg', alt: 'Partner' } },
  Name: { value: 'Partner Name' },
};
```

---

After each create, retrieve the item and verify; keep all generated IDs for later steps.
