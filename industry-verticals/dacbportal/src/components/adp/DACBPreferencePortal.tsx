'use client';

import { JSX, useMemo, useState } from 'react';
import {
  Field,
  Text,
  RichText,
  RichTextField,
  LinkField,
  Link as SitecoreLink,
  useSitecore,
} from '@sitecore-content-sdk/nextjs';
import { Check, User, Bell, FileText, Calendar, Settings, Shield, ChevronDown } from 'lucide-react';
import { useUser } from '@auth0/nextjs-auth0/client';
import { ComponentProps } from '@/lib/component-props';
import {
  getEntitlementOperatorFromField,
  getRequiredAuth0KeysFromEntitlements,
  getRequiredRolesFromField,
  useComponentEntitlementDecision,
} from '@/lib/entitlements/componentEntitlements';
import type { EntitlementItem, RoleItem } from '@/lib/entitlements/componentEntitlements';

interface Fields {
  PortalTitle: Field<string>;
  WelcomePrefix: Field<string>;
  UserName: Field<string>;
  UserEmail: Field<string>;
  IntroText: RichTextField;
  SaveButtonText: Field<string>;
  CTAText: Field<string>;
  CTALink: LinkField;
  SaveSuccessMessage: Field<string>;
  ConsentLabel: Field<string>;
  ConsentDescription: Field<string>;
  Entitlements: EntitlementItem[];
  EntitlementOperator?: LinkField;
  Roles: RoleItem[];
  RolesOperator: LinkField;
}

const defaultFields: Fields = {
  PortalTitle: { value: 'My Preferences' },
  WelcomePrefix: { value: 'Welcome back,' },
  UserName: { value: 'Dervis' },
  UserEmail: { value: 'dervis@insurance-corp.com' },
  IntroText: {
    value:
      '<p>Manage your legal insight preferences and keep content aligned with your interests.</p>',
  },
  SaveButtonText: { value: 'Save Preferences' },
  CTAText: { value: 'Update My Profile' },
  CTALink: { value: { href: '/profile' } },
  SaveSuccessMessage: { value: 'Preferences saved successfully!' },
  ConsentLabel: { value: 'I consent to receive communications from DAC Beachcroft' },
  ConsentDescription: {
    value:
      'We will use your preferences to send you relevant legal insights, event invitations, and industry updates. You can withdraw consent at any time.',
  },
  Entitlements: [],
  EntitlementOperator: { value: { id: '{95926502-E249-4B28-90F7-CEBF2F744D53}', value: '' } },
  Roles: [],
  RolesOperator: { value: { id: '', value: '' } },
};

type PreferenceState = {
  industries: string[];
  topics: string[];
  eventTypes: string[];
  contentTypes: string[];
  communicationFrequency: string;
  gdprConsent: boolean;
};

type Option = { id: string; label: string; default?: boolean };

const INDUSTRIES: Option[] = [
  { id: 'insurance', label: 'Insurance', default: true },
  { id: 'healthcare', label: 'Healthcare' },
  { id: 'employment', label: 'Employment' },
  { id: 'regulatory', label: 'Regulatory' },
  { id: 'technology', label: 'Technology' },
];

const TOPICS: Option[] = [
  { id: 'claims-trends', label: 'Claims trends' },
  { id: 'risk-management', label: 'Risk management' },
  { id: 'insurance-litigation', label: 'Insurance litigation' },
  { id: 'fraud', label: 'Fraud' },
  { id: 'financial-lines', label: 'Financial lines' },
  { id: 'esg-compliance', label: 'ESG & compliance' },
];

const EVENT_TYPES: Option[] = [
  { id: 'in-person', label: 'In-person events' },
  { id: 'webinars', label: 'Webinars' },
  { id: 'roundtables', label: 'Roundtables' },
  { id: 'client-briefings', label: 'Client-only briefings' },
];

const CONTENT_TYPES: Option[] = [
  { id: 'newsletter', label: 'Monthly insights newsletter' },
  { id: 'legal-alerts', label: 'Legal alerts (by topic)' },
  { id: 'sector-deep-dives', label: 'Sector-specific deep dives' },
  { id: 'case-summaries', label: 'Case summaries' },
];

const COMMUNICATION_FREQUENCIES = [
  { id: 'weekly', label: 'Weekly' },
  { id: 'monthly', label: 'Monthly' },
  { id: 'relevant-only', label: 'Only when highly relevant' },
];

const PRIVACY_CONSENT_LABEL = 'I consent to receive communications from DAC Beachcroft';
const PRIVACY_CONSENT_DESCRIPTION =
  'We will use your preferences to send you relevant legal insights, event invitations, and industry updates. You can withdraw consent at any time.';

const SectionHeader = ({
  icon: Icon,
  title,
  description,
}: {
  icon: React.ElementType;
  title: string;
  description: string;
}) => (
  <div className="mb-4 flex items-start gap-3">
    <div className="bg-primary/10 text-primary rounded-lg p-2">
      <Icon className="h-5 w-5" />
    </div>
    <div>
      <h3 className="text-foreground font-semibold">{title}</h3>
      <p className="text-muted-foreground mt-0.5 text-sm">{description}</p>
    </div>
  </div>
);

const CheckboxGroup = ({
  options,
  selected,
  onChange,
  columns = 2,
}: {
  options: Option[];
  selected: string[];
  onChange: (next: string[]) => void;
  columns?: number;
}) => {
  const toggleOption = (id: string) => {
    if (selected.includes(id)) {
      onChange(selected.filter((s) => s !== id));
    } else {
      onChange([...selected, id]);
    }
  };

  return (
    <div
      className={`grid gap-2 ${columns === 3 ? 'grid-cols-1 sm:grid-cols-3' : 'grid-cols-1 sm:grid-cols-2'}`}
    >
      {options.map((option) => (
        <label
          key={option.id}
          className={`flex cursor-pointer items-center gap-3 rounded-lg border p-3 transition-all ${
            selected.includes(option.id)
              ? 'border-primary bg-primary/5'
              : 'border-border hover:border-primary/50 hover:bg-muted/50'
          }`}
        >
          <div
            className={`flex h-5 w-5 items-center justify-center rounded border-2 transition-colors ${
              selected.includes(option.id)
                ? 'border-primary bg-primary'
                : 'border-muted-foreground/30'
            }`}
          >
            {selected.includes(option.id) && <Check className="text-primary-foreground h-3 w-3" />}
          </div>
          <span className="text-foreground text-sm">{option.label}</span>
          {option.default && (
            <span className="bg-muted text-muted-foreground ml-auto rounded px-2 py-0.5 text-xs">
              Default
            </span>
          )}
          <input
            type="checkbox"
            checked={selected.includes(option.id)}
            onChange={() => toggleOption(option.id)}
            className="sr-only"
          />
        </label>
      ))}
    </div>
  );
};

const SelectDropdown = ({
  options,
  selected,
  onChange,
}: {
  options: { id: string; label: string }[];
  selected: string;
  onChange: (value: string) => void;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const selectedOption = options.find((o) => o.id === selected);

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="border-border bg-background hover:border-primary/50 flex w-full items-center justify-between gap-2 rounded-lg border px-4 py-3 text-left transition-colors"
      >
        <span className={selectedOption ? 'text-foreground' : 'text-muted-foreground'}>
          {selectedOption?.label || 'Select frequency'}
        </span>
        <ChevronDown
          className={`text-muted-foreground h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>
      {isOpen && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)} />
          <div className="border-border bg-background absolute top-full right-0 left-0 z-20 mt-1 rounded-lg border py-1 shadow-lg">
            {options.map((option) => (
              <button
                key={option.id}
                type="button"
                onClick={() => {
                  onChange(option.id);
                  setIsOpen(false);
                }}
                className={`hover:bg-muted w-full px-4 py-2 text-left text-sm transition-colors ${
                  selected === option.id ? 'text-primary font-medium' : 'text-foreground'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

const Toggle = ({
  enabled,
  onChange,
  label,
  description,
}: {
  enabled: boolean;
  onChange: (enabled: boolean) => void;
  label: string;
  description: string;
}) => (
  <label className="border-border hover:bg-muted/50 flex cursor-pointer items-start justify-between gap-4 rounded-lg border p-4 transition-colors">
    <div className="flex-1">
      <span className="text-foreground text-sm font-medium">{label}</span>
      <p className="text-muted-foreground mt-0.5 text-sm">{description}</p>
    </div>
    <button
      type="button"
      role="switch"
      aria-checked={enabled}
      onClick={() => onChange(!enabled)}
      className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors ${
        enabled ? 'bg-[#AF3448]' : 'bg-[#D1D5DB]'
      }`}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition-transform ${
          enabled ? 'translate-x-6' : 'translate-x-1'
        }`}
      />
    </button>
  </label>
);

export type DACBPreferencePortalProps = ComponentProps & {
  fields: Fields;
};

export const Default = (props: DACBPreferencePortalProps): JSX.Element | null => {
  const id = props.params.RenderingIdentifier;
  const fields = props.fields || defaultFields;
  const { user } = useUser();
  const { page } = useSitecore();
  const isEditingOrPreview = page.mode.isEditing || page.mode.isPreview;
  const userDisplayName = user?.name || user?.nickname || fields.UserName?.value || '';
  const userDisplayEmail = user?.email || fields.UserEmail?.value || '';

  const requiredKeys = useMemo(
    () => getRequiredAuth0KeysFromEntitlements(fields?.Entitlements),
    [fields?.Entitlements]
  );
  const operator = useMemo(
    () => getEntitlementOperatorFromField(fields?.EntitlementOperator),
    [fields?.EntitlementOperator]
  );
  const requiredRoles = useMemo(() => getRequiredRolesFromField(fields?.Roles), [fields?.Roles]);
  const rolesOperator = useMemo(
    () => getEntitlementOperatorFromField(fields?.RolesOperator),
    [fields?.RolesOperator]
  );
  const { allowed, isLoading, isSecured } = useComponentEntitlementDecision(
    requiredKeys,
    operator,
    requiredRoles,
    rolesOperator
  );
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const [preferences, setPreferences] = useState<PreferenceState>({
    industries: ['insurance'],
    topics: ['claims-trends', 'risk-management'],
    eventTypes: ['webinars'],
    contentTypes: ['newsletter'],
    communicationFrequency: 'monthly',
    gdprConsent: true,
  });

  const handleSave = async () => {
    setIsSaving(true);
    await new Promise((resolve) => setTimeout(resolve, 800));
    setIsSaving(false);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 2500);
  };

  if (!isEditingOrPreview && isSecured) {
    if (isLoading) return null;
    if (!allowed) return null;
  }

  return (
    <section
      className={`component dacb-preference-portal bg-muted/30 min-h-screen ${props.params.styles || ''}`}
      id={id}
    >
      <div className="bg-[#AF3448] text-white">
        <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white/10">
              <User className="h-7 w-7" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">
                <Text field={fields.PortalTitle} />
              </h1>
              <h2 className="mt-1 text-base font-medium text-white/85">
                {fields.WelcomePrefix?.value || 'Welcome back,'} {userDisplayName}
                {userDisplayEmail ? (
                  <span className="ml-2 text-white/65">({userDisplayEmail})</span>
                ) : null}
              </h2>
            </div>
          </div>
          <div className="mt-4 text-sm text-white/90">
            <RichText field={fields.IntroText} />
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="space-y-6">
          <div className="border-border bg-background rounded-xl border p-6 shadow-sm">
            <SectionHeader
              icon={Settings}
              title="Industry Focus"
              description="Select the industries you're interested in"
            />
            <CheckboxGroup
              options={INDUSTRIES}
              selected={preferences.industries}
              onChange={(industries) => setPreferences({ ...preferences, industries })}
              columns={3}
            />
          </div>

          <div className="border-border bg-background rounded-xl border p-6 shadow-sm">
            <SectionHeader
              icon={FileText}
              title="Topics of Interest"
              description="Choose the legal topics you'd like to stay informed about"
            />
            <CheckboxGroup
              options={TOPICS}
              selected={preferences.topics}
              onChange={(topics) => setPreferences({ ...preferences, topics })}
              columns={3}
            />
          </div>

          <div className="border-border bg-background rounded-xl border p-6 shadow-sm">
            <SectionHeader
              icon={Calendar}
              title="Event Preferences"
              description="Select the types of events you'd like to attend"
            />
            <CheckboxGroup
              options={EVENT_TYPES}
              selected={preferences.eventTypes}
              onChange={(eventTypes) => setPreferences({ ...preferences, eventTypes })}
            />
          </div>

          <div className="border-border bg-background rounded-xl border p-6 shadow-sm">
            <SectionHeader
              icon={FileText}
              title="Content Preferences"
              description="Choose the types of content you'd like to receive"
            />
            <CheckboxGroup
              options={CONTENT_TYPES}
              selected={preferences.contentTypes}
              onChange={(contentTypes) => setPreferences({ ...preferences, contentTypes })}
            />
          </div>

          <div className="border-border bg-background rounded-xl border p-6 shadow-sm">
            <SectionHeader
              icon={Bell}
              title="Communication Frequency"
              description="How often would you like to hear from us?"
            />
            <SelectDropdown
              options={COMMUNICATION_FREQUENCIES}
              selected={preferences.communicationFrequency}
              onChange={(communicationFrequency) =>
                setPreferences({ ...preferences, communicationFrequency })
              }
            />
          </div>

          <div className="border-border bg-background rounded-xl border p-6 shadow-sm">
            <SectionHeader
              icon={Shield}
              title="Privacy & Consent"
              description="Manage your communication consent preferences"
            />
            <Toggle
              enabled={preferences.gdprConsent}
              onChange={(gdprConsent) => setPreferences({ ...preferences, gdprConsent })}
              label={fields.ConsentLabel?.value || PRIVACY_CONSENT_LABEL}
              description={fields.ConsentDescription?.value || PRIVACY_CONSENT_DESCRIPTION}
            />
          </div>

          <div className="flex flex-col items-center justify-between gap-4 pt-2 sm:flex-row">
            <p className="text-muted-foreground text-sm">
              Your preferences are saved securely and can be updated at any time.
            </p>
            <div className="flex items-center gap-3">
              <button
                type="button"
                className="border-border text-foreground hover:bg-muted rounded-full border px-6 py-2.5 font-medium transition-colors"
              >
                Update My Profile
              </button>
              {fields.CTALink?.value?.href ? (
                <SitecoreLink
                  field={fields.CTALink}
                  className="inline-flex items-center justify-center rounded-full bg-[#AF3448] px-6 py-2.5 font-medium text-white transition-colors hover:bg-[#972c3e]"
                >
                  <Text field={fields.CTAText} />
                </SitecoreLink>
              ) : (
                <button
                  type="button"
                  className="rounded-full bg-[#AF3448] px-6 py-2.5 font-medium text-white transition-colors hover:bg-[#972c3e]"
                >
                  <Text field={fields.CTAText} />
                </button>
              )}
              <button
                type="button"
                onClick={handleSave}
                disabled={isSaving}
                className={`bg-primary text-primary-foreground hover:bg-primary/90 flex items-center gap-2 rounded-full px-6 py-2.5 font-medium transition-all ${
                  isSaving ? 'cursor-not-allowed opacity-70' : ''
                }`}
              >
                {isSaving ? 'Saving...' : <Text field={fields.SaveButtonText} />}
              </button>
            </div>
          </div>

          {showSuccess && (
            <div className="animate-in slide-in-from-bottom-2 fixed right-6 bottom-6 flex items-center gap-2 rounded-lg bg-green-600 px-6 py-3 text-white shadow-lg">
              <Check className="h-5 w-5" />
              <Text field={fields.SaveSuccessMessage} />
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
