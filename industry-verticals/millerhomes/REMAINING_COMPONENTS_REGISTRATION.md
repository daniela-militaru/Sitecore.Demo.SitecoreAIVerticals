# Remaining Miller Homes Components Registration

## Status
**Completed: 17/40 components**
- StatCard, AnnouncementBannerSection, VirtualTourBannerSection, ImageCarouselSection
- PlotCard, ContentCard, PopupSection, SearchSection, PageTitleSection
- ChoiceCard, FeatureSection, InspirationSection
- DevelopmentCard, AvailableHomesSection, ContactSection, ContentCarouselSection
- DevelopmentGridSection

**In Progress: 1/40**
- DevelopmentHeroSection (partially created - folder structure done, needs fields + completion)

**Remaining: 22/40 components to register**
1. DevelopmentInfoSection
2. EmailSignupCard
3. FilterSection
4. FloorplanSection
5. FooterSection
6. HeaderSection
7. HeroCarouselSection
8. HouseTypeCard
9. HouseTypeHeroSection
10. HouseTypeInfoSection
11. HouseTypesSection
12. LocalAmenitiesSection
13. MortgageCalculatorSection
14. MyMillerHomeSection
15. NearbyDevelopmentsSection
16. PersonaliseSection
17. PlotAvailabilitySection
18. SearchAgainSection
19. SiteplanSection
20. SpecificationSection
21. StatsSection
22. TestimonialsSection

## Next Steps
Continue with MCP-based registration following the componentRegistration.mdc process for each component.

Each component requires:
1. Template folder
2. Data template (with __Base template, Data section with fields, __Standard Values)
3. Folder template (with __Base template, __Standard Values with __Masters and __Icon)
4. Rendering Parameters template
5. Data folder under /Data
6. Default data item
7. JSON rendering item
8. Update Available Renderings

## Component Field Summaries

### DevelopmentHeroSection (IN PROGRESS)
- Image (ImageField)
- VirtualTourHeading, VirtualTourSubheading, MapButtonText, PlayVideoText, PreviousSlideLabel, NextSlideLabel (TextField)
- VirtualTourLink (LinkField)

### DevelopmentInfoSection
- Name, Address, RegisterHeading, ReleaseHeading, OpeningHoursHeading, WeekdayHours, WeekendHours (TextField)
- Description (RichTextField)
- DirectionsLink, ReadMoreLink, CallLink, AppointmentLink, QuestionLink, WhatsAppLink, BrochureLink, PersonalisedBrochureLink (LinkField)

### Remaining components need field analysis from their .tsx files

## Recommendation
Continue systematic registration using the marketer MCP with the established pattern.
