// Below are built-in components that are available in the app, it's recommended to keep them as is

import { BYOCWrapper, NextjsContentSdkComponent, FEaaSWrapper } from '@sitecore-content-sdk/nextjs';
import { Form } from '@sitecore-content-sdk/nextjs';

// end of built-in components
import * as Title from 'src/components/title/Title';
import * as ThemeEditor from 'src/components/theme-editor/ThemeEditor';
import * as Subscribe from 'src/components/subscribe/Subscribe';
import * as SocialFollow from 'src/components/social-follow/SocialFollow';
import * as SocialFeed from 'src/components/social-feed/SocialFeed';
import * as SelectedProducts from 'src/components/selected-products/SelectedProducts';
import * as SelectedArticles from 'src/components/selected-articles/SelectedArticles';
import * as SectionWrapper from 'src/components/section-wrapper/SectionWrapper';
import * as SearchResults from 'src/components/search-results/SearchResults';
import * as RowSplitter from 'src/components/row-splitter/RowSplitter';
import * as RichText from 'src/components/rich-text/RichText';
import * as Reviews from 'src/components/reviews/Reviews';
import * as Promo from 'src/components/promo/Promo';
import * as ProductListing from 'src/components/product-listing/ProductListing';
import * as ProductDetails from 'src/components/product-details/ProductDetails';
import * as PartialDesignDynamicPlaceholder from 'src/components/partial-design-dynamic-placeholder/PartialDesignDynamicPlaceholder';
import * as PageContent from 'src/components/page-content/PageContent';
import * as Offers from 'src/components/offers/Offers';
import * as SuggestionBlock from 'src/components/non-sitecore/search/SuggestionBlock';
import * as Spinner from 'src/components/non-sitecore/search/Spinner';
import * as SortOrder from 'src/components/non-sitecore/search/SortOrder';
import * as SearchResultsComponent from 'src/components/non-sitecore/search/SearchResultsComponent';
import * as SearchPagination from 'src/components/non-sitecore/search/SearchPagination';
import * as SearchFacets from 'src/components/non-sitecore/search/SearchFacets';
import * as ResultsPerPage from 'src/components/non-sitecore/search/ResultsPerPage';
import * as QuestionsAnswers from 'src/components/non-sitecore/search/QuestionsAnswers';
import * as QueryResultsSummary from 'src/components/non-sitecore/search/QueryResultsSummary';
import * as PreviewSearch from 'src/components/non-sitecore/search/PreviewSearch';
import * as HomeHighlighted from 'src/components/non-sitecore/search/HomeHighlighted';
import * as CardViewSwitcher from 'src/components/non-sitecore/search/CardViewSwitcher';
import * as ArticleHorizontalCard from 'src/components/non-sitecore/search/ArticleHorizontalCard';
import * as ArticleCard from 'src/components/non-sitecore/search/ArticleCard';
import * as NavigationIcons from 'src/components/navigation-icons/NavigationIcons';
import * as Navigation from 'src/components/navigation/Navigation';
import * as LinkList from 'src/components/link-list/LinkList';
import * as LanguageSwitcher from 'src/components/language-switcher/LanguageSwitcher';
import * as Image from 'src/components/image/Image';
import * as HeroBanner from 'src/components/hero-banner/HeroBanner';
import * as Header from 'src/components/header/Header';
import * as Footer from 'src/components/footer/Footer';
import * as Features from 'src/components/features/Features';
import * as ContentBlock from 'src/components/content-block/ContentBlock';
import * as Container from 'src/components/container/Container';
import * as ContactForm from 'src/components/contact-form/ContactForm';
import * as ColumnSplitter from 'src/components/column-splitter/ColumnSplitter';
import * as Breadcrumb from 'src/components/breadcrumb/Breadcrumb';
import * as ArticleListing from 'src/components/article-listing/ArticleListing';
import * as ArticleDetails from 'src/components/article-details/ArticleDetails';
import * as AllProductsCarousel from 'src/components/all-products-carousel/AllProductsCarousel';
import * as TrustedLogosSection from 'src/components/adp/TrustedLogosSection';
import * as TrustedLogoCard from 'src/components/adp/TrustedLogoCard';
import * as TitleAndDescriptionCard from 'src/components/adp/TitleAndDescriptionCard';
import * as TestimonialCarouselSection from 'src/components/adp/TestimonialCarouselSection';
import * as TestimonialCard from 'src/components/adp/TestimonialCard';
import * as TabsSection from 'src/components/adp/TabsSection';
import * as TabCard from 'src/components/adp/TabCard';
import * as TabBenefitCard from 'src/components/adp/TabBenefitCard';
import * as ServicesSection from 'src/components/adp/ServicesSection';
import * as ServiceCard from 'src/components/adp/ServiceCard';
import * as SearchFilterSection from 'src/components/adp/SearchFilterSection';
import * as PromoCtaSection from 'src/components/adp/PromoCtaSection';
import * as Newsletter from 'src/components/adp/Newsletter';
import * as Logo from 'src/components/adp/Logo';
import * as LoginSection from 'src/components/adp/LoginSection';
import * as HeroSection from 'src/components/adp/HeroSection';
import * as HeaderSection from 'src/components/adp/HeaderSection';
import * as FooterSection from 'src/components/adp/FooterSection';
import * as FaqSection from 'src/components/adp/FaqSection';
import * as FaqCard from 'src/components/adp/FaqCard';
import * as DACBPreferencePortal from 'src/components/adp/DACBPreferencePortal';
import * as CtaSection from 'src/components/adp/CtaSection';
import * as CtaLinkCard from 'src/components/adp/CtaLinkCard';
import * as CtaBarSection from 'src/components/adp/CtaBarSection';
import * as ContentImageSection from 'src/components/adp/ContentImageSection';
import * as ContentBlockSection from 'src/components/adp/ContentBlockSection';
import * as ContactFormSection from 'src/components/adp/ContactFormSection';
import * as CaseStudySection from 'src/components/adp/CaseStudySection';
import * as BusinessSizeSection from 'src/components/adp/BusinessSizeSection';
import * as BusinessSizeCard from 'src/components/adp/BusinessSizeCard';
import * as BenefitsSection from 'src/components/adp/BenefitsSection';
import * as BenefitCard from 'src/components/adp/BenefitCard';
import * as AwardsSection from 'src/components/adp/AwardsSection';
import * as ArticlesCarouselSection from 'src/components/adp/ArticlesCarouselSection';
import * as AdpArticleCard from 'src/components/adp/AdpArticleCard';

export const componentMap = new Map<string, NextjsContentSdkComponent>([
  ['BYOCWrapper', BYOCWrapper],
  ['FEaaSWrapper', FEaaSWrapper],
  ['Form', Form],
  ['Title', { ...Title }],
  ['ThemeEditor', { ...ThemeEditor }],
  ['Subscribe', { ...Subscribe }],
  ['SocialFollow', { ...SocialFollow }],
  ['SocialFeed', { ...SocialFeed }],
  ['SelectedProducts', { ...SelectedProducts }],
  ['SelectedArticles', { ...SelectedArticles, componentType: 'client' }],
  ['SectionWrapper', { ...SectionWrapper }],
  ['SearchResults', { ...SearchResults }],
  ['RowSplitter', { ...RowSplitter }],
  ['RichText', { ...RichText }],
  ['Reviews', { ...Reviews }],
  ['Promo', { ...Promo }],
  ['ProductListing', { ...ProductListing }],
  ['ProductDetails', { ...ProductDetails }],
  ['PartialDesignDynamicPlaceholder', { ...PartialDesignDynamicPlaceholder }],
  ['PageContent', { ...PageContent }],
  ['Offers', { ...Offers }],
  ['SuggestionBlock', { ...SuggestionBlock }],
  ['Spinner', { ...Spinner }],
  ['SortOrder', { ...SortOrder }],
  ['SearchResultsComponent', { ...SearchResultsComponent }],
  ['SearchPagination', { ...SearchPagination }],
  ['SearchFacets', { ...SearchFacets }],
  ['ResultsPerPage', { ...ResultsPerPage }],
  ['QuestionsAnswers', { ...QuestionsAnswers }],
  ['QueryResultsSummary', { ...QueryResultsSummary }],
  ['PreviewSearch', { ...PreviewSearch }],
  ['HomeHighlighted', { ...HomeHighlighted }],
  ['CardViewSwitcher', { ...CardViewSwitcher }],
  ['ArticleHorizontalCard', { ...ArticleHorizontalCard }],
  ['ArticleCard', { ...ArticleCard }],
  ['NavigationIcons', { ...NavigationIcons }],
  ['Navigation', { ...Navigation, componentType: 'client' }],
  ['LinkList', { ...LinkList }],
  ['LanguageSwitcher', { ...LanguageSwitcher, componentType: 'client' }],
  ['Image', { ...Image }],
  ['HeroBanner', { ...HeroBanner }],
  ['Header', { ...Header }],
  ['Footer', { ...Footer }],
  ['Features', { ...Features }],
  ['ContentBlock', { ...ContentBlock }],
  ['Container', { ...Container }],
  ['ContactForm', { ...ContactForm, componentType: 'client' }],
  ['ColumnSplitter', { ...ColumnSplitter }],
  ['Breadcrumb', { ...Breadcrumb }],
  ['ArticleListing', { ...ArticleListing }],
  ['ArticleDetails', { ...ArticleDetails }],
  ['AllProductsCarousel', { ...AllProductsCarousel }],
  ['TrustedLogosSection', { ...TrustedLogosSection, componentType: 'client' }],
  ['TrustedLogoCard', { ...TrustedLogoCard, componentType: 'client' }],
  ['TitleAndDescriptionCard', { ...TitleAndDescriptionCard, componentType: 'client' }],
  ['TestimonialCarouselSection', { ...TestimonialCarouselSection, componentType: 'client' }],
  ['TestimonialCard', { ...TestimonialCard, componentType: 'client' }],
  ['TabsSection', { ...TabsSection, componentType: 'client' }],
  ['TabCard', { ...TabCard, componentType: 'client' }],
  ['TabBenefitCard', { ...TabBenefitCard, componentType: 'client' }],
  ['ServicesSection', { ...ServicesSection, componentType: 'client' }],
  ['ServiceCard', { ...ServiceCard, componentType: 'client' }],
  ['SearchFilterSection', { ...SearchFilterSection, componentType: 'client' }],
  ['PromoCtaSection', { ...PromoCtaSection, componentType: 'client' }],
  ['Newsletter', { ...Newsletter }],
  ['Logo', { ...Logo }],
  ['LoginSection', { ...LoginSection, componentType: 'client' }],
  ['HeroSection', { ...HeroSection, componentType: 'client' }],
  ['HeaderSection', { ...HeaderSection, componentType: 'client' }],
  ['FooterSection', { ...FooterSection, componentType: 'client' }],
  ['FaqSection', { ...FaqSection, componentType: 'client' }],
  ['FaqCard', { ...FaqCard, componentType: 'client' }],
  ['DACBPreferencePortal', { ...DACBPreferencePortal, componentType: 'client' }],
  ['CtaSection', { ...CtaSection, componentType: 'client' }],
  ['CtaLinkCard', { ...CtaLinkCard, componentType: 'client' }],
  ['CtaBarSection', { ...CtaBarSection, componentType: 'client' }],
  ['ContentImageSection', { ...ContentImageSection, componentType: 'client' }],
  ['ContentBlockSection', { ...ContentBlockSection, componentType: 'client' }],
  ['ContactFormSection', { ...ContactFormSection, componentType: 'client' }],
  ['CaseStudySection', { ...CaseStudySection, componentType: 'client' }],
  ['BusinessSizeSection', { ...BusinessSizeSection, componentType: 'client' }],
  ['BusinessSizeCard', { ...BusinessSizeCard }],
  ['BenefitsSection', { ...BenefitsSection, componentType: 'client' }],
  ['BenefitCard', { ...BenefitCard, componentType: 'client' }],
  ['AwardsSection', { ...AwardsSection, componentType: 'client' }],
  ['ArticlesCarouselSection', { ...ArticlesCarouselSection, componentType: 'client' }],
  ['AdpArticleCard', { ...AdpArticleCard, componentType: 'client' }],
]);

export default componentMap;
