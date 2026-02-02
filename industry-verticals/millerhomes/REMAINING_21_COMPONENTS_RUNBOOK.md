# Miller Homes – Remaining 21 Components Registration Runbook

Use the **Sitecore Marketer MCP** (`user-marketer`) and follow `industry-verticals/millerhomes/.cursor/rules/componentRegistration.mdc` for each component.

**Already registered (19/40):** StatCard, AnnouncementBannerSection, VirtualTourBannerSection, ImageCarouselSection, PlotCard, ContentCard, PopupSection, SearchSection, PageTitleSection, ChoiceCard, FeatureSection, InspirationSection, DevelopmentCard, AvailableHomesSection, ContactSection, ContentCarouselSection, DevelopmentGridSection, DevelopmentHeroSection, DevelopmentInfoSection.

**DevelopmentInfoSection:** Template and rendering were created in this session. Ensure the data template’s `__Standard values` points to its __Standard Values item (`55e0a973-dc25-4ab3-ad48-9656edae65f9`), the folder template’s `__Standard values` points to its __Standard Values (`d4fab150-7f41-4b8f-b6f0-4a9e24c5bf40`), and that a "Default DevelopmentInfoSection" item exists under `DevelopmentInfoSections`. Then add the DevelopmentInfoSection rendering ID (`915d411c-6889-4ee8-af54-de639d0fa193`) to the Available Renderings list if not already present.

**Reference IDs (use when building steps):**
- **Parent template folder:** `/sitecore/templates/Project/miller-homes` → get `itemId` (e.g. `e494ad7b-a0da-4414-9737-540b5b3a3683`)
- **Template folder template:** `0437fee2-44c9-46a6-abe9-28858d9fee8c`
- **Template (data/folder/rendering params):** `ab86861a-6030-46c5-b394-e8f99e8b87db`
- **Base templates:** Standard+PerSite `{1930BBEB-7805-471A-A3BE-4858AC7CF696}|{44A022DB-56D3-419A-B43B-E27E4D8E9C41}`, Folder `{A87A00B1-E6DB-45AB-8B54-636FEC3B5523}`, Rendering params `{4247AAD4-EBDE-4994-998F-E067A51B1FE4}|{5C74E985-E055-43FF-B28C-DB6C6A6450A2}|{3DB3EB10-F8D0-4CC9-BE26-18CE7B139EC8}`
- **Template section:** `e269fbb5-3750-427a-9149-7aa950b49301`
- **Template field:** `455a3e98-a627-4b40-8035-e683a0331ac7`
- **Data parent:** `/sitecore/content/industry-verticals/Miller Homes/Data` → `527e82cf-693d-4ffd-9d2d-dbed3b6874b7`
- **Renderings parent:** `/sitecore/layout/Renderings/Project/miller-homes` → `26e99375-d0f5-48eb-9876-288e88df947c`
- **Json Rendering template:** `04646a89-996f-4ee7-878a-ffdbf1f0ef0d`
- **Available Renderings item:** `c122e398-f58a-4577-a066-d18e62736a65`
- **Home item (for link defaults):** `6c5f4b85-bf87-4b75-bfa5-5734302b0e77`

**Field source rules:** Image → `query:$siteMedia`, Rich Text → `query:$xaRichTextProfile`, General Link → `query:$linkableHomes`.

**Steps per component (summary):**
1. Create template folder `{{ComponentName}}` under miller-homes templates.
2. Create data template `{{ComponentName}} Template` (base: Standard+PerSite), add section "Data", add all fields below, create __Standard Values, set __Standard values on template, set default field values and __Icon.
3. Create folder template `{{ComponentName}} Folder` (base: Folder), create __Standard Values, set __Standard values, set __Masters = data template + folder template, __Icon = folder icon.
4. Create rendering params template `{{ComponentName}} Rendering Parameters` (base: BaseRenderingParams+IDynamicPlaceholder+IRenderingId), add section "Rendering Parameters".
5. Append folder template to Data item __Masters (do not overwrite).
6. Create data folder `{{DataFolderName}}` under Data, create `Default {{ComponentName}}` under it.
7. Create JSON rendering `{{ComponentName}}` under Renderings with componentName, Parameters Template, Datasource Template, Datasource Location.
8. Append rendering ID to Available Renderings item `Renderings` field.

---

## 1. EmailSignupCard

**Note:** `BulletPoints` is an array of items; register without it or as a single Rich Text field "BulletPointsContent" for simple content.

**Data section fields:**

| Name | Type | Source |
|------|------|--------|
| Heading | Single-Line Text | - |
| ButtonText | Single-Line Text | - |
| ButtonLink | General Link | query:$linkableHomes |
| BottomLinkText | Single-Line Text | - |
| BottomLink | General Link | query:$linkableHomes |
| PhoneImage | Image | query:$siteMedia |
| InputPlaceholder | Single-Line Text | - |
| EmailLabel | Single-Line Text | - |

**__Standard Values defaults:** Heading: "Stay up to date with your new home journey", ButtonText: "Register Now", BottomLinkText: "Already have an account? Sign in", InputPlaceholder: "Email address", EmailLabel: "Email address". Links: point to Home.

**Data folder name:** EmailSignupCards  
**Datasource Location:** `query:$site/*[@@name='Data']/*[@@name='EmailSignupCards']|query:$sharedSites/*[@@name='Data']/*[@@name='EmailSignupCards']`

---

## 2. FilterSection

**Data section fields (all Single-Line Text):** LocationLabel, PriceLabel, BedroomsLabel, CompletionLabel, GridViewText, ListViewText, MapViewText, SearchShowhomeText, PriceAnyText, PriceToText.

**__Standard Values:** LocationLabel: "Location", PriceLabel: "Price", BedroomsLabel: "Bedrooms", CompletionLabel: "Completion Date", GridViewText: "Grid View", ListViewText: "List View", MapViewText: "Map View", SearchShowhomeText: "Search for a showhome", PriceAnyText: "Any", PriceToText: "to".

**Data folder name:** FilterSections  
**Datasource Location:** `query:$site/*[@@name='Data']/*[@@name='FilterSections']|query:$sharedSites/*[@@name='Data']/*[@@name='FilterSections']`

---

## 3. FloorplanSection

**Data section fields:**

| Name | Type | Source |
|------|------|--------|
| Title | Single-Line Text | - |
| TitleSuffix | Single-Line Text | - |
| GroundFloorImage | Image | query:$siteMedia |
| FirstFloorImage | Image | query:$siteMedia |
| SecondFloorImage | Image | query:$siteMedia |
| DownloadLink | General Link | query:$linkableHomes |
| PlanStyleLabel | Single-Line Text | - |
| LinkOptionText | Single-Line Text | - |
| MainOptionText | Single-Line Text | - |
| FloorLabel | Single-Line Text | - |
| GroundFloorText | Single-Line Text | - |
| FirstFloorText | Single-Line Text | - |
| DimensionsText | Single-Line Text | - |
| RoomLabel | Single-Line Text | - |
| ImperialLabel | Single-Line Text | - |
| MetricLabel | Single-Line Text | - |
| DisclaimerText | Single-Line Text | - |
| ViewFullFloorplanText | Single-Line Text | - |
| ImagePlaceholderText | Single-Line Text | - |

**__Standard Values:** Title: "Floor plans", TitleSuffix: "& dimensions", PlanStyleLabel: "Plan Style:", LinkOptionText: "Link", MainOptionText: "Main", FloorLabel: "Floor:", GroundFloorText: "Ground Floor", FirstFloorText: "First Floor", DimensionsText: "Dimensions", RoomLabel: "Room", ImperialLabel: "Imperial", MetricLabel: "Metric", ViewFullFloorplanText: "View full floorplan", ImagePlaceholderText: "Floorplan image". DisclaimerText: "Floor plans are for illustration purposes only. They are not drawn to scale and are intended as a guide only. Plot specific details should be confirmed prior to reservation." DownloadLink: point to Home.

**Data folder name:** FloorplanSections  
**Datasource Location:** `query:$site/*[@@name='Data']/*[@@name='FloorplanSections']|query:$sharedSites/*[@@name='Data']/*[@@name='FloorplanSections']`

---

## 4. FooterSection

**Note:** `Columns` (array of columns with `Links` array) and `AccreditationBadges` (array), `LegalLinks` (array). Register with simplified scalar fields only, or omit complex fields and add placeholder Rich Text / Multi-Line if needed.

**Data section fields (scalar only):**

| Name | Type | Source |
|------|------|--------|
| SignupTitle | Single-Line Text | - |
| SignupDescription | Single-Line Text | - |
| EmailPlaceholder | Single-Line Text | - |
| SignupButtonText | Single-Line Text | - |
| TwitterLink | General Link | query:$linkableHomes |
| FacebookLink | General Link | query:$linkableHomes |
| InstagramLink | General Link | query:$linkableHomes |
| YoutubeLink | General Link | query:$linkableHomes |
| LinkedinLink | General Link | query:$linkableHomes |
| SocialHeading | Single-Line Text | - |
| TrustpilotBadge | Image | query:$siteMedia |
| CopyrightText | Single-Line Text | - |

**__Standard Values:** SignupTitle: "Be first to know", SignupDescription: "Sign up for exclusive offers, news and updates from Miller Homes.", EmailPlaceholder: "Enter your email here", SignupButtonText: "Sign Up", SocialHeading: "Follow us", CopyrightText: "© Miller Homes". Links: point to Home.

**Data folder name:** FooterSections  
**Datasource Location:** `query:$site/*[@@name='Data']/*[@@name='FooterSections']|query:$sharedSites/*[@@name='Data']/*[@@name='FooterSections']`

---

## 5. HeaderSection

**Note:** `NavigationItems` is an array (NavItem with Title, Link, HasDropdown). Register without it or with a single Rich Text "NavigationContent" for simple use.

**Data section fields (scalar only):**

| Name | Type | Source |
|------|------|--------|
| Logo | Image | query:$siteMedia |
| LogoLink | General Link | query:$linkableHomes |
| CorporateLink | General Link | query:$linkableHomes |
| LoginLink | General Link | query:$linkableHomes |
| MyMillerHomeLink | General Link | query:$linkableHomes |
| FindHomeButtonText | Single-Line Text | - |
| FindHomeButtonLink | General Link | query:$linkableHomes |

**__Standard Values:** FindHomeButtonText: "Find My New Home". All links: point to Home.

**Data folder name:** HeaderSections  
**Datasource Location:** `query:$site/*[@@name='Data']/*[@@name='HeaderSections']|query:$sharedSites/*[@@name='Data']/*[@@name='HeaderSections']`

---

## 6. HeroCarouselSection

**Note:** `Slides` is an array of hero slides; `AutoplayInterval` is number. Register with scalar fields only: PreviousSlideLabel, NextSlideLabel. Optionally add a single Rich Text "SlidesContent" or leave slides to be managed elsewhere.

**Data section fields (scalar only):**

| Name | Type | Source |
|------|------|--------|
| PreviousSlideLabel | Single-Line Text | - |
| NextSlideLabel | Single-Line Text | - |

**__Standard Values:** PreviousSlideLabel: "Previous slide", NextSlideLabel: "Next slide".

**Data folder name:** HeroCarouselSections  
**Datasource Location:** `query:$site/*[@@name='Data']/*[@@name='HeroCarouselSections']|query:$sharedSites/*[@@name='Data']/*[@@name='HeroCarouselSections']`

---

## 7. HouseTypeCard

**Data section fields:**

| Name | Type | Source |
|------|------|--------|
| Image | Image | query:$siteMedia |
| Name | Single-Line Text | - |
| Status | Single-Line Text | - |
| Description | Single-Line Text | - |
| Bedrooms | Single-Line Text | - |
| HouseType | Single-Line Text | - |
| Garden | Single-Line Text | - |
| Parking | Single-Line Text | - |
| Price | Single-Line Text | - |
| CTALink | General Link | query:$linkableHomes |
| BedroomsLabel | Single-Line Text | - |
| ParkingLabel | Single-Line Text | - |
| PricesFromLabel | Single-Line Text | - |
| FindOutMoreText | Single-Line Text | - |
| SaveLabel | Single-Line Text | - |

**__Standard Values:** Name: "Hampton", Status: "Coming Soon", Description: "A beautiful 3 bedroom detached home with spacious living areas and a private garden.", Bedrooms: "3", HouseType: "Detached", Garden: "Private Garden", Parking: "2", Price: "£TBA", BedroomsLabel: "Bedrooms", ParkingLabel: "Parking", PricesFromLabel: "Prices from", FindOutMoreText: "Find out more", SaveLabel: "Save". CTALink: point to Home.

**Data folder name:** HouseTypeCards  
**Datasource Location:** `query:$site/*[@@name='Data']/*[@@name='HouseTypeCards']|query:$sharedSites/*[@@name='Data']/*[@@name='HouseTypeCards']`

---

## 8. HouseTypeHeroSection

**Data section fields:**

| Name | Type | Source |
|------|------|--------|
| MainImage | Image | query:$siteMedia |
| VirtualTourUrl | Single-Line Text | - |
| ViewTourText | Single-Line Text | - |
| ViewPlanText | Single-Line Text | - |
| PreviousImageLabel | Single-Line Text | - |
| NextImageLabel | Single-Line Text | - |

**__Standard Values:** ViewTourText: "View Tour", ViewPlanText: "View Plan", PreviousImageLabel: "Previous image", NextImageLabel: "Next image".

**Data folder name:** HouseTypeHeroSections  
**Datasource Location:** `query:$site/*[@@name='Data']/*[@@name='HouseTypeHeroSections']|query:$sharedSites/*[@@name='Data']/*[@@name='HouseTypeHeroSections']`

---

## 9. HouseTypeInfoSection

**Data section fields:**

| Name | Type | Source |
|------|------|--------|
| Name | Single-Line Text | - |
| DevelopmentName | Single-Line Text | - |
| Address | Single-Line Text | - |
| Price | Single-Line Text | - |
| PricePrefix | Single-Line Text | - |
| Bedrooms | Single-Line Text | - |
| Bathrooms | Single-Line Text | - |
| ParkingSpaces | Single-Line Text | - |
| Garden | Single-Line Text | - |
| Description | Rich Text | query:$xaRichTextProfile |
| KeyFeatures | Rich Text | query:$xaRichTextProfile |
| DevelopmentLink | General Link | query:$linkableHomes |
| BedsLabel | Single-Line Text | - |
| BathsLabel | Single-Line Text | - |
| GetDirectionsText | Single-Line Text | - |
| KeyFeaturesHeading | Single-Line Text | - |
| RegisterUpdatesText | Single-Line Text | - |
| BookAppointmentText | Single-Line Text | - |
| AddFavouritesText | Single-Line Text | - |
| ViewVirtualTourText | Single-Line Text | - |

**__Standard Values:** Name: "Hampton", DevelopmentName: "at Bramcote Hills Rise", Address: "Coventry Lane, Bramcote, Nottingham, Nottinghamshire, NG9 3GJ", Price: "TBA", PricePrefix: "Prices range from", Bedrooms: "3", Bathrooms: "3", ParkingSpaces: "Parking Spaces", Garden: "Garden", BedsLabel: "Beds", BathsLabel: "Baths", GetDirectionsText: "Get Directions", KeyFeaturesHeading: "Key Features", RegisterUpdatesText: "Register for updates", BookAppointmentText: "Book an appointment", AddFavouritesText: "Add to favourites", ViewVirtualTourText: "View Virtual Tour". Description/KeyFeatures: use default HTML from TSX. DevelopmentLink: point to Home.

**Data folder name:** HouseTypeInfoSections  
**Datasource Location:** `query:$site/*[@@name='Data']/*[@@name='HouseTypeInfoSections']|query:$sharedSites/*[@@name='Data']/*[@@name='HouseTypeInfoSections']`

---

## 10. HouseTypesSection

**Data section fields (all Single-Line Text):** Title, Subtitle, ShowAvailabilityText, ShowFiltersText, HideFiltersText, ChooseHomeTypeText, NumBedroomsText, MinPriceLabel, MaxPriceLabel, MinPricePlaceholder, MaxPricePlaceholder, MovingSoonText, ReadyNowText, PartExchangeText, ViewFullSelectionText.

**__Standard Values:** Title: "Homes at Bramcote Hills Rise", Subtitle: "Explore our range of beautiful new homes", ShowAvailabilityText: "Show Availability", ShowFiltersText: "Show Filters", HideFiltersText: "Hide Filters", ChooseHomeTypeText: "Choose a home type", NumBedroomsText: "No. of bedrooms:", MinPriceLabel: "Min price:", MaxPriceLabel: "Max price:", MinPricePlaceholder: "Minimum price", MaxPricePlaceholder: "Maximum price", MovingSoonText: "Moving Soon", ReadyNowText: "Ready Now", PartExchangeText: "Part Exchange", ViewFullSelectionText: "View full selection".

**Data folder name:** HouseTypesSections  
**Datasource Location:** `query:$site/*[@@name='Data']/*[@@name='HouseTypesSections']|query:$sharedSites/*[@@name='Data']/*[@@name='HouseTypesSections']`

---

## 11. LocalAmenitiesSection

**Data section fields (all Single-Line Text):** Title, Subtitle, TitlePart1, TitlePart2, MapButtonText, SatelliteButtonText, ExplorePrefixText, InteractiveMapText, MapIntegrationText.

**__Standard Values:** Title: "Bramcote Hills Rise", Subtitle: "Discover the local amenities and services near the development.", TitlePart1: "Local", TitlePart2: "Amenities", MapButtonText: "Map", SatelliteButtonText: "Satellite", ExplorePrefixText: "Explore the local area around", InteractiveMapText: "Interactive Map", MapIntegrationText: "Map integration required".

**Data folder name:** LocalAmenitiesSections  
**Datasource Location:** `query:$site/*[@@name='Data']/*[@@name='LocalAmenitiesSections']|query:$sharedSites/*[@@name='Data']/*[@@name='LocalAmenitiesSections']`

---

## 12. MortgageCalculatorSection

**Data section fields:**

| Name | Type | Source |
|------|------|--------|
| Title | Single-Line Text | - |
| Description | Rich Text | query:$xaRichTextProfile |
| Disclaimer | Rich Text | query:$xaRichTextProfile |
| TitlePart1 | Single-Line Text | - |
| TitlePart2 | Single-Line Text | - |
| MortgageTabText | Single-Line Text | - |
| StampDutyTabText | Single-Line Text | - |
| AffordabilityTabText | Single-Line Text | - |
| PropertyPriceLabel | Single-Line Text | - |
| DepositLabel | Single-Line Text | - |
| TermLabel | Single-Line Text | - |
| InterestRateLabel | Single-Line Text | - |
| YearsText | Single-Line Text | - |
| MonthlyPaymentLabel | Single-Line Text | - |
| BasedOnMortgageText | Single-Line Text | - |
| PerWeekText | Single-Line Text | - |

**__Standard Values:** Title: "How much will it cost?", TitlePart1: "How much", TitlePart2: "will it cost?", MortgageTabText: "Mortgage Calculator", StampDutyTabText: "Stamp Duty Calculator", AffordabilityTabText: "Price a Mortgage", PropertyPriceLabel: "Property Price", DepositLabel: "Deposit", TermLabel: "Term:", InterestRateLabel: "Interest Rate", YearsText: "years", MonthlyPaymentLabel: "Your monthly mortgage payment", BasedOnMortgageText: "Based on a mortgage of", PerWeekText: "per week". Description/Disclaimer: use default HTML from TSX.

**Data folder name:** MortgageCalculatorSections  
**Datasource Location:** `query:$site/*[@@name='Data']/*[@@name='MortgageCalculatorSections']|query:$sharedSites/*[@@name='Data']/*[@@name='MortgageCalculatorSections']`

---

## 13. MyMillerHomeSection

**Data section fields:**

| Name | Type | Source |
|------|------|--------|
| Title | Single-Line Text | - |
| Description | Rich Text | query:$xaRichTextProfile |
| CTALink | General Link | query:$linkableHomes |
| CTAText | Single-Line Text | - |
| Image | Image | query:$siteMedia |
| WelcomeToText | Single-Line Text | - |
| LogoPrefix | Single-Line Text | - |
| LogoMiller | Single-Line Text | - |
| LogoHome | Single-Line Text | - |
| PhoneMockupText | Single-Line Text | - |

**__Standard Values:** Title: "My Miller Home", CTAText: "Find Out More", WelcomeToText: "Welcome To", LogoPrefix: "My", LogoMiller: "Miller", LogoHome: "Home", PhoneMockupText: "Phone mockup". Description: use default HTML from TSX. CTALink: point to Home.

**Data folder name:** MyMillerHomeSections  
**Datasource Location:** `query:$site/*[@@name='Data']/*[@@name='MyMillerHomeSections']|query:$sharedSites/*[@@name='Data']/*[@@name='MyMillerHomeSections']`

---

## 14. NearbyDevelopmentsSection

**Data section fields (all Single-Line Text):** TitlePart1, TitleHighlight, Subtitle, LocationText, ChangeLocationText.

**__Standard Values:** TitlePart1: "Other", TitleHighlight: "Developments", Subtitle: "You may also be interested in these nearby developments.", LocationText: "You", ChangeLocationText: "Change location".

**Data folder name:** NearbyDevelopmentsSections  
**Datasource Location:** `query:$site/*[@@name='Data']/*[@@name='NearbyDevelopmentsSections']|query:$sharedSites/*[@@name='Data']/*[@@name='NearbyDevelopmentsSections']`

---

## 15. PersonaliseSection

**Data section fields:**

| Name | Type | Source |
|------|------|--------|
| Title | Single-Line Text | - |
| Description | Rich Text | query:$xaRichTextProfile |
| PrimaryLink | General Link | query:$linkableHomes |
| SecondaryLink | General Link | query:$linkableHomes |
| Image | Image | query:$siteMedia |

**__Standard Values:** Title: "Personalise your brand new home". Description: optional rich text. PrimaryLink, SecondaryLink: point to Home.

**Data folder name:** PersonaliseSections  
**Datasource Location:** `query:$site/*[@@name='Data']/*[@@name='PersonaliseSections']|query:$sharedSites/*[@@name='Data']/*[@@name='PersonaliseSections']`

---

## 16. PlotAvailabilitySection

**Data section fields (all Single-Line Text):** Title, Subtitle, SortByLabel, PriceLowToHighText, PriceHighToLowText, PlotNumberText, AvailabilityText.

**__Standard Values:** Title: "Available Plots", Subtitle: "Browse our available plots and find your perfect home.", SortByLabel: "Sort by:", PriceLowToHighText: "Price (Low to High)", PriceHighToLowText: "Price (High to Low)", PlotNumberText: "Plot Number", AvailabilityText: "Availability".

**Data folder name:** PlotAvailabilitySections  
**Datasource Location:** `query:$site/*[@@name='Data']/*[@@name='PlotAvailabilitySections']|query:$sharedSites/*[@@name='Data']/*[@@name='PlotAvailabilitySections']`

---

## 17. SearchAgainSection

**Data section fields (all Single-Line Text):** Title, Placeholder, SearchButtonText, AdvancedSearchText.

**__Standard Values:** Title: "Not found what you were looking for? Search again", Placeholder: "Search using a postcode", SearchButtonText: "Search", AdvancedSearchText: "Advanced Search".

**Data folder name:** SearchAgainSections  
**Datasource Location:** `query:$site/*[@@name='Data']/*[@@name='SearchAgainSections']|query:$sharedSites/*[@@name='Data']/*[@@name='SearchAgainSections']`

---

## 18. SiteplanSection

**Data section fields:**

| Name | Type | Source |
|------|------|--------|
| Title | Single-Line Text | - |
| TitleSuffix | Single-Line Text | - |
| Description | Rich Text | query:$xaRichTextProfile |
| SiteplanImage | Image | query:$siteMedia |
| WalkthroughButtonText | Single-Line Text | - |
| MapPlaceholderText | Single-Line Text | - |
| MapIntegrationText | Single-Line Text | - |

**__Standard Values:** Title: "Bramcote Hills Rise", TitleSuffix: "Siteplan", WalkthroughButtonText: "Open 3D walkthrough", MapPlaceholderText: "Interactive Siteplan", MapIntegrationText: "Map integration required". Description: use default HTML from TSX.

**Data folder name:** SiteplanSections  
**Datasource Location:** `query:$site/*[@@name='Data']/*[@@name='SiteplanSections']|query:$sharedSites/*[@@name='Data']/*[@@name='SiteplanSections']`

---

## 19. SpecificationSection

**Data section fields:**

| Name | Type | Source |
|------|------|--------|
| Title | Single-Line Text | - |
| Description | Rich Text | query:$xaRichTextProfile |
| DownloadLink | General Link | query:$linkableHomes |
| Image | Image | query:$siteMedia |
| DownloadButtonText | Single-Line Text | - |

**__Standard Values:** Title: "Specification", DownloadButtonText: "Download Specification". Description: use default HTML from TSX. DownloadLink: point to Home.

**Data folder name:** SpecificationSections  
**Datasource Location:** `query:$site/*[@@name='Data']/*[@@name='SpecificationSections']|query:$sharedSites/*[@@name='Data']/*[@@name='SpecificationSections']`

---

## 20. StatsSection

**Data section fields:**

| Name | Type | Source |
|------|------|--------|
| TitlePart1 | Single-Line Text | - |
| TitleHighlight | Single-Line Text | - |
| Description | Rich Text | query:$xaRichTextProfile |
| CTAText | Single-Line Text | - |
| CTALink | General Link | query:$linkableHomes |

**__Standard Values:** TitlePart1: "Every home is a", TitleHighlight: "new adventure", CTAText: "Take me there". Description: use default HTML from TSX. CTALink: point to Home.

**Data folder name:** StatsSections  
**Datasource Location:** `query:$site/*[@@name='Data']/*[@@name='StatsSections']|query:$sharedSites/*[@@name='Data']/*[@@name='StatsSections']`

---

## 21. TestimonialsSection

**Data section fields:**

| Name | Type | Source |
|------|------|--------|
| TrustpilotRating | Single-Line Text | - |
| TrustpilotText | Single-Line Text | - |
| TrustpilotLogo | Image | query:$siteMedia |
| ReviewsCountText | Single-Line Text | - |
| BasedOnText | Single-Line Text | - |
| StarReviewsText | Single-Line Text | - |
| PreviousReviewLabel | Single-Line Text | - |
| NextReviewLabel | Single-Line Text | - |
| TrustpilotLabel | Single-Line Text | - |

**__Standard Values:** TrustpilotRating: "4.8", TrustpilotText: "Excellent", ReviewsCountText: "1,200", BasedOnText: "Based on", StarReviewsText: "4 & 5 star reviews", PreviousReviewLabel: "Previous review", NextReviewLabel: "Next review", TrustpilotLabel: "Trustpilot".

**Data folder name:** TestimonialsSections  
**Datasource Location:** `query:$site/*[@@name='Data']/*[@@name='TestimonialsSections']|query:$sharedSites/*[@@name='Data']/*[@@name='TestimonialsSections']`

---

## Execution checklist

For each of the 21 components above:

- [ ] 1. Create component template folder under `/sitecore/templates/Project/miller-homes`.
- [ ] 2. Create data template with base templates, Data section, all fields, __Standard Values, default values.
- [ ] 3. Create folder template with __Standard Values (__Masters, __Icon).
- [ ] 4. Create rendering parameters template with "Rendering Parameters" section.
- [ ] 5. Append folder template to Data item __Masters.
- [ ] 6. Create data folder and "Default {{ComponentName}}" item.
- [ ] 7. Create JSON rendering with componentName, Parameters Template, Datasource Template, Datasource Location.
- [ ] 8. Append new rendering ID to Available Renderings `Renderings` field.

After each component, store the new **rendering item ID** and add it to the pipe-separated list in the Available Renderings item so all registered components remain available in the Experience Editor.
