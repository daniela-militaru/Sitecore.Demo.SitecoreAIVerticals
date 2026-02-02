'use client';

import type { JSX } from 'react';
import {
  TextField,
  LinkField,
  Text,
  Link as SitecoreLink,
} from '@sitecore-content-sdk/nextjs';
import { ComponentProps } from '@/lib/component-props';
import { Compass, Calendar, MapPin } from 'lucide-react';

/**
 * PlotCard Component
 * Card for displaying an available plot
 * 
 * Features:
 * - Plot number
 * - Price
 * - Key details (orientation, completion date)
 * - Status badge
 * - CTA button
 */

interface Fields {
  /** Plot number */
  PlotNumber: TextField;
  /** Price */
  Price: TextField;
  /** House type name */
  HouseTypeName: TextField;
  /** Orientation (e.g., "South-facing garden") */
  Orientation: TextField;
  /** Completion date */
  CompletionDate: TextField;
  /** Status (Available, Reserved, Sold) */
  Status: TextField;
  /** Position on site */
  Position: TextField;
  /** CTA link */
  CTALink: LinkField;
}

export type PlotCardProps = ComponentProps & {
  fields: Fields;
};

export const Default = (props: PlotCardProps): JSX.Element => {
  const id = props.params.RenderingIdentifier;
  const { styles } = props.params;
  const { fields } = props;

  const status = (fields.Status?.value as string)?.toLowerCase() || 'available';
  const statusColors = {
    available: 'bg-green-100 text-green-800',
    reserved: 'bg-yellow-100 text-yellow-800',
    sold: 'bg-red-100 text-red-800',
  };
  const statusColor = statusColors[status as keyof typeof statusColors] || statusColors.available;

  return (
    <div
      className={`component plot-card bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg transition-shadow ${styles || ''}`}
      id={id}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-xl font-bold text-[#003057]">
            Plot {fields.PlotNumber ? <Text field={fields.PlotNumber} /> : '1'}
          </h3>
          {fields.HouseTypeName && (
            <p className="text-sm text-[#0072CE]">
              <Text field={fields.HouseTypeName} />
            </p>
          )}
        </div>
        {/* Status Badge */}
        <span className={`text-xs font-medium px-2 py-1 rounded ${statusColor}`}>
          {fields.Status ? <Text field={fields.Status} /> : 'Available'}
        </span>
      </div>

      {/* Price */}
      <div className="mb-4">
        <p className="text-2xl font-bold text-[#003057]">
          {fields.Price ? <Text field={fields.Price} /> : '£TBA'}
        </p>
      </div>

      {/* Details */}
      <div className="space-y-2 mb-6">
        {fields.Orientation && (
          <div className="flex items-center gap-2 text-sm text-[#4a4a4a]">
            <Compass className="w-4 h-4 text-[#0072CE]" />
            <Text field={fields.Orientation} />
          </div>
        )}
        {fields.CompletionDate && (
          <div className="flex items-center gap-2 text-sm text-[#4a4a4a]">
            <Calendar className="w-4 h-4 text-[#0072CE]" />
            <Text field={fields.CompletionDate} />
          </div>
        )}
        {fields.Position && (
          <div className="flex items-center gap-2 text-sm text-[#4a4a4a]">
            <MapPin className="w-4 h-4 text-[#0072CE]" />
            <Text field={fields.Position} />
          </div>
        )}
      </div>

      {/* CTA */}
      {fields.CTALink ? (
        <SitecoreLink
          field={fields.CTALink}
          className="block w-full bg-[#003057] hover:bg-[#002040] text-white text-center font-medium py-3 px-4 rounded transition-colors text-sm"
        />
      ) : (
        <button className="w-full bg-[#003057] hover:bg-[#002040] text-white font-medium py-3 px-4 rounded transition-colors text-sm">
          View plot details
        </button>
      )}
    </div>
  );
};
