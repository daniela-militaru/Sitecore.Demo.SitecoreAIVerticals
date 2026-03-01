# CtaSmallBannerSection – Sitecore registration via Marketer MCP

Run these steps when the **Marketer MCP** is connected. Component has **no placeholders**.

**Variables:**

- **ComponentName:** CtaSmallBannerSection
- **DataFolderName:** CtaSmallBannerSections
- **Fields (from TSX):** Title (Rich Text), CTAText (Single-Line Text), CTALink (General Link), Image (Image)
- **Standard values (from defaultFields):** Title = `FREE PAYROLL MATURITY<br />BENCHMARK TOOL`, CTAText = `Calculate your score today`, CTALink → home, Image = empty

---

## 1. Check existing items (do not overwrite)

- `get_content_item_by_path`: `/sitecore/templates/Project/adp/CtaSmallBannerSection`
- `get_content_item_by_path`: `/sitecore/layout/Renderings/Project/adp/CtaSmallBannerSection`

If either exists, stop and report.

---

## 2. Get parent and template IDs

- **Templates root:** `get_content_item_by_path`: `/sitecore/templates/Project/adp` → use returned **itemId** as parent for step 3.
- **Data root:** `get_content_item_by_path`: `/sitecore/content/industry-verticals/adp/Data` → **itemId** for step 6.
- **Renderings folder:** `get_content_item_by_path`: `/sitecore/layout/Renderings/Project/adp` → **itemId** for step 7.

Obtain template IDs (by path or from an existing ADP component, e.g. CtaBarSection):

- Standard template
- PerSiteStandardValues
- Template section
- Template field
- Folder (Common)
- BaseRenderingParameters, IDynamicPlaceholder, IRenderingId
- Rendering Folder
- Json Rendering

---

## 3. Create template folder

- **create_content_item** (or create_child_item under adp templates folder):
  - parentId: [ID of `/sitecore/templates/Project/adp`]
  - templateId: [Rendering Folder or Template Folder – use same as other ADP components]
  - name: `CtaSmallBannerSection`
- Store **itemId** → **GeneratedComponentTemplatesRoot**.

---

## 4. Data template

- Create **CtaSmallBannerSection Template** under GeneratedComponentTemplatesRoot, inheriting Standard + PerSiteStandardValues.
- Add **Data** section (template section) under it.
- Under Data section, create template fields:
  - **Title** – Rich Text (Source: `query:$xaRichTextProfile`), inherit Template field.
  - **CTAText** – Single-Line Text.
  - **CTALink** – General Link (Shared), Source: `query:$linkableHomes`.
  - **Image** – Image (Shared), Source: `query:$siteMedia`.
- Create **\_\_Standard Values** under the data template; set its **\_\_Standard values** to point to this \_\_Standard Values item.
- In \_\_Standard Values set:
  - **Title:** `FREE PAYROLL MATURITY<br />BENCHMARK TOOL`
  - **CTAText:** `Calculate your score today`
  - **CTALink:** link to `/sitecore/content/industry-verticals/adp/home`
  - **Image:** leave empty
  - **Icon:** empty (per runbook).
- Store data template **itemId** → **GeneratedDataTemplate**.

---

## 5. Folder template

- Under GeneratedComponentTemplatesRoot create template **CtaSmallBannerSection Folder**, base **Folder**.
- Create **\_\_Standard Values** under it; set folder template’s **\_\_Standard values** to that item.
- In **Standard Values set \*\*Insert Options (**Masters)\*\* to allow: GeneratedDataTemplate, CtaSmallBannerSection Folder template.
- Set Icon to: `/sitecore/shell/themes/standard/Applications/32x32/folder.png`.
- Store **itemId** → **GeneratedDataFolderTemplate**.

---

## 6. Rendering parameters template

- Under GeneratedComponentTemplatesRoot create **CtaSmallBannerSection Rendering Parameters** inheriting BaseRenderingParameters, IDynamicPlaceholder, IRenderingId.
- Add section **Rendering Parameters** (no fields).
- Store **itemId** → **GeneratedRenderingTemplate**.

---

## 7. Data insert options

- Get **Data** item (`/sitecore/content/industry-verticals/adp/Data`), read **\_\_Masters**.
- Append **GeneratedDataFolderTemplate** (template ID) to \_\_Masters; update item.

---

## 8. Data items

- Under Data create folder **CtaSmallBannerSections** based on **GeneratedDataFolderTemplate**.
- Under **CtaSmallBannerSections** create item **Default CtaSmallBannerSection** based on **GeneratedDataTemplate**.

---

## 9. JSON rendering

- Under `/sitecore/layout/Renderings/Project/adp` create JSON rendering item **CtaSmallBannerSection** (template: Json Rendering).
- Set fields:
  - **Component Name:** `CtaSmallBannerSection`
  - **Parameters Template:** [GeneratedRenderingTemplate ID, e.g. `{...}`]
  - **Datasource Template:** `/sitecore/templates/Project/adp/CtaSmallBannerSection/CtaSmallBannerSection Template`
  - **Datasource Location** / **Data source:**  
    `query:$site/*[@@name='Data']/*[@@templatename='CtaSmallBannerSection Folder']|query:$sharedSites/*[@@name='Data']/*[@@templatename='CtaSmallBannerSection Folder']`

---

## 10. Placeholders

- None (component has no placeholders).

---

## Frontend

- **component-map.ts** already has `CtaSmallBannerSection` imported and mapped; `componentType: 'client'` added for consistency.
