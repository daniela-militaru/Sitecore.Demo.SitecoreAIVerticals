# ServicesSection – Sitecore registration (marketer MCP)

Use this with the **marketer MCP** to register **ServicesSection** in Sitecore. Follow `componentRegistration.mdc` exactly.

**Component:** `ServicesSection` (file: `src/components/adp/ServicesSection.tsx`)  
**Data template name:** ServicesSection Template  
**Data folder name:** ServicesSections (plural)  
**TSX component name:** ServicesSection

---

## Pre-check (run first)

If any of these exist, **STOP** and report; do not modify.

- `/sitecore/templates/Project/adp/ServicesSection`
- `/sitecore/content/industry-verticals/adp/Data/ServicesSections`
- `/sitecore/layout/Renderings/Project/adp/ServicesSection`

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
1.2. Create a **template folder** named **ServicesSection** under that parent.  
1.3. Get item by path: `/sitecore/templates/Project/adp/ServicesSection` → store as **GeneratedComponentTemplatesRoot** (id + path).

---

## Step 2 – Data template

**Base templates:** Standard template, \_PerSiteStandardValues.

2.1. Create a **data template** named **ServicesSection Template** under **GeneratedComponentTemplatesRoot**, inheriting from Standard template and \_PerSiteStandardValues. Store as **GeneratedDataTemplate**.

2.2. Under **GeneratedDataTemplate**, add a section **Data** (template section). Under **Data**, add these **template fields** (inherit from Template field):

| Field name  | Type             | Source                     |
| ----------- | ---------------- | -------------------------- |
| Title       | Single-Line Text | —                          |
| Description | Rich Text        | `query:$xaRichTextProfile` |

2.4. Under **GeneratedDataTemplate**, create **\_\_Standard Values** with template = **GeneratedDataTemplate**. Set the data template’s **\_\_Standard values** field to this \_\_Standard Values item. Store as **GeneratedDataTemplateStandardValuesItem**.

2.5. In **\_\_Standard Values**:

- Set **Icon** to empty (DataTemplateIcon).
- **Data** section: set field values from defaultFields (below). No Image/General Link; only Title and Description.

**Standard Values – Data field values:**

- **Title:** `Payroll Services and HR solutions that meet your industry needs`
- **Description:**  
   `<p>Whether you need an HR services, payroll software or managed payroll services, ADP have been helping businesses like yours to automate all or part of their payroll processes for over 75 years. Our payroll outsourcing services combine both your payroll and human information systems (HRIS), with thousands of experts available to answer any questions.</p><p>Our human capital management (HCM) software unites HR, payroll, time, talent, tax and benefits in one elegant Human Resource Management (HRMS) solution to maximise the potential of your employees.</p>`

  2.7. Retrieve **GeneratedDataTemplate** and confirm: all sections + fields exist; Rich Text field **Description** has Source = `query:$xaRichTextProfile`.

---

## Step 3 – Data folder template

3.1. Under **GeneratedComponentTemplatesRoot**, create a **template** named **ServicesSection Folder** inheriting from **Folder** (FolderBaseTemplate). Store as **GeneratedDataFolderTemplate**.

3.2. Under **GeneratedDataFolderTemplate**, create **\_\_Standard Values** with template = **GeneratedDataFolderTemplate**. Set **GeneratedDataFolderTemplate**’s **\_\_Standard values** field to this \_\_Standard Values item (not to the template itself). Store as **GeneratedDataFolderTemplateStandardValuesItem**.

3.3. In **\_\_Standard Values**: set **Insert Options** (**Masters**) to allow **GeneratedDataTemplate** and **GeneratedDataFolderTemplate**.

3.4. In **\_\_Standard Values**: set **Icon** to folder icon (FolderTemplateIcon).

3.5. Retrieve **GeneratedDataFolderTemplate** and verify \_\_Standard Values and Insert options.

---

## Step 4 – Rendering parameters template

4.1. Under **GeneratedComponentTemplatesRoot**, create a **rendering parameters template** named **ServicesSection Rendering Parameters** inheriting from BaseRenderingParameters, IDynamicPlaceholder, IRenderingId. Store as **GeneratedRenderingTemplate**.

4.2. Add section **Rendering Parameters** with no fields.

4.4. Retrieve **GeneratedRenderingTemplate** and confirm.

---

## Step 5 – Data folder insert options

5.1. Get `/sitecore/content/industry-verticals/adp/Data` and read **Insert Options** (**Masters**).  
5.2. Append **GeneratedDataFolderTemplate** ID to **Masters** (do not overwrite).  
5.3. Get Data again and verify **Masters** includes **GeneratedDataFolderTemplate**.

---

## Step 6 – Data items

6.1. Under `/sitecore/content/industry-verticals/adp/Data`, create a folder based on **GeneratedDataFolderTemplate**, name **ServicesSections**. Store as **GeneratedDataFolderItem**.

6.2. Under **GeneratedDataFolderItem**, create an item based on **GeneratedDataTemplate**, name **Default ServicesSection**. Store as **GeneratedDataItem**. Set Data fields: Title and Description as in defaultFields above.

6.3. Retrieve **GeneratedDataFolderItem** and **GeneratedDataItem** and confirm templates.

---

## Step 7 – JSON rendering

7.1. Under **ComponentsFolder** `/sitecore/layout/Renderings/Project/adp`, create a **Json Rendering** item named **ServicesSection** with:

- **Component Name**: `ServicesSection`
- **Parameters Template**: **GeneratedRenderingTemplate** (template ID)
- **Datasource Template**: **GeneratedDataTemplate** (template ID)
- **Datasource Location**:  
  `query:$site/*[@@name='Data']/*[@@name='ServicesSections']|query:$sharedSites/_[@@name='Data']/_[@@name='ServicesSections']`

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

## Field reference (from ServicesSection.tsx)

```ts
interface Fields {
  Title: TextField;
  Description: RichTextField;
}

const defaultFields: Fields = {
  Title: { value: 'Payroll Services and HR solutions that meet your industry needs' },
  Description: {
    value:
      '<p>Whether you need an HR services, payroll software or managed payroll services, ADP have been helping businesses like yours to automate all or part of their payroll processes for over 75 years. Our payroll outsourcing services combine both your payroll and human information systems (HRIS), with thousands of experts available to answer any questions.</p><p>Our human capital management (HCM) software unites HR, payroll, time, talent, tax and benefits in one elegant Human Resource Management (HRMS) solution to maximise the potential of your employees.</p>',
  },
};
```

---

After each create, retrieve the item and verify; keep all generated IDs for later steps.
