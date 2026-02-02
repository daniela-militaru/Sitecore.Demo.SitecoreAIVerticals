'use client';

import type { JSX } from 'react';
import { useState } from 'react';
import {
  TextField,
  ImageField,
  LinkField,
  Image as SitecoreImage,
  Link as SitecoreLink,
} from '@sitecore-content-sdk/nextjs';
import { ComponentProps } from '@/lib/component-props';
import { ChevronDown } from 'lucide-react';

/**
 * FloorplanSection Component
 * Interactive floorplan viewer for house type pages (Hampton style)
 * 
 * Features:
 * - Plan style selector (Link/Main)
 * - Floor selector tabs (Ground Floor, First Floor)
 * - Dimensions dropdown with expandable table
 * - Download button
 */

interface Fields {
  /** Section title */
  Title: TextField;
  /** Ground floor image */
  GroundFloorImage: ImageField;
  /** First floor image */
  FirstFloorImage: ImageField;
  /** Second floor image (if applicable) */
  SecondFloorImage: ImageField;
  /** Download link */
  DownloadLink: LinkField;
}

export type FloorplanSectionProps = ComponentProps & {
  fields: Fields;
};

export const Default = (props: FloorplanSectionProps): JSX.Element => {
  const id = props.params.RenderingIdentifier;
  const { styles } = props.params;
  const { fields } = props;
  const [planStyle, setPlanStyle] = useState<'link' | 'main'>('link');
  const [activeFloor, setActiveFloor] = useState<'ground' | 'first'>('ground');
  const [showDimensions, setShowDimensions] = useState(false);

  return (
    <div
      className={`component floorplan-section bg-white py-12 ${styles || ''}`}
      id={id}
    >
      <div className="container mx-auto px-4 md:px-6">
        {/* Title */}
        <h2 className="text-2xl md:text-3xl font-light text-center mb-8">
          <span className="text-[#003057]">Floor plans</span>
          <span className="text-[#0072CE]"> & </span>
          <span className="text-[#0072CE]">dimensions</span>
        </h2>

        {/* Plan Style Selector */}
        <div className="mb-6">
          <label className="block text-sm text-[#4a4a4a] mb-2">Plan Style:</label>
          <div className="flex gap-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="planStyle"
                checked={planStyle === 'link'}
                onChange={() => setPlanStyle('link')}
                className="w-4 h-4 text-[#0072CE] border-gray-300 focus:ring-[#0072CE]"
              />
              <span className="text-sm text-[#003057]">Link</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="planStyle"
                checked={planStyle === 'main'}
                onChange={() => setPlanStyle('main')}
                className="w-4 h-4 text-[#0072CE] border-gray-300 focus:ring-[#0072CE]"
              />
              <span className="text-sm text-[#003057]">Main</span>
            </label>
          </div>
        </div>

        {/* Floor Tabs */}
        <div className="mb-6">
          <label className="block text-sm text-[#4a4a4a] mb-2">Floor:</label>
          <div className="flex">
            <button
              onClick={() => setActiveFloor('ground')}
              className={`px-6 py-2.5 text-sm font-medium transition-colors rounded-l ${
                activeFloor === 'ground'
                  ? 'bg-[#003057] text-white'
                  : 'bg-gray-100 text-[#003057] hover:bg-gray-200'
              }`}
            >
              Ground Floor
            </button>
            <button
              onClick={() => setActiveFloor('first')}
              className={`px-6 py-2.5 text-sm font-medium transition-colors rounded-r ${
                activeFloor === 'first'
                  ? 'bg-[#003057] text-white'
                  : 'bg-gray-100 text-[#003057] hover:bg-gray-200'
              }`}
            >
              First Floor
            </button>
          </div>
        </div>

        {/* Dimensions Dropdown */}
        <div className="mb-6">
          <button
            onClick={() => setShowDimensions(!showDimensions)}
            className="flex items-center justify-between w-full md:w-auto md:min-w-[200px] px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-[#003057] text-sm font-medium rounded transition-colors"
          >
            <span>Dimensions</span>
            <ChevronDown className={`w-4 h-4 ml-2 transition-transform ${showDimensions ? 'rotate-180' : ''}`} />
          </button>

          {showDimensions && (
            <div className="mt-4 bg-gray-50 rounded-lg overflow-hidden max-w-md">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 text-[#003057] font-semibold">Room</th>
                    <th className="text-center py-3 px-4 text-[#003057] font-semibold">Imperial</th>
                    <th className="text-center py-3 px-4 text-[#003057] font-semibold">Metric</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  <tr>
                    <td className="py-3 px-4 text-[#4a4a4a]">Lounge</td>
                    <td className="py-3 px-4 text-center text-[#003057]">17&apos; x 11&apos;</td>
                    <td className="py-3 px-4 text-center text-[#003057]">5.2 x 3.4</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 text-[#4a4a4a]">Kitchen/Dining</td>
                    <td className="py-3 px-4 text-center text-[#003057]">16&apos; x 10&apos;</td>
                    <td className="py-3 px-4 text-center text-[#003057]">4.9 x 3.1</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 text-[#4a4a4a]">Principal Bedroom</td>
                    <td className="py-3 px-4 text-center text-[#003057]">13&apos; x 11&apos;</td>
                    <td className="py-3 px-4 text-center text-[#003057]">4.1 x 3.5</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 text-[#4a4a4a]">Bedroom 2</td>
                    <td className="py-3 px-4 text-center text-[#003057]">12&apos; x 10&apos;</td>
                    <td className="py-3 px-4 text-center text-[#003057]">3.7 x 3.1</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 text-[#4a4a4a]">Bedroom 3</td>
                    <td className="py-3 px-4 text-center text-[#003057]">10&apos; x 9&apos;</td>
                    <td className="py-3 px-4 text-center text-[#003057]">3.0 x 2.7</td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Floorplan Image */}
        <div className="relative bg-white border border-gray-200 rounded-lg overflow-hidden max-w-2xl mx-auto">
          {activeFloor === 'ground' && fields.GroundFloorImage ? (
            <SitecoreImage
              field={fields.GroundFloorImage}
              className="w-full h-auto object-contain"
            />
          ) : activeFloor === 'first' && fields.FirstFloorImage ? (
            <SitecoreImage
              field={fields.FirstFloorImage}
              className="w-full h-auto object-contain"
            />
          ) : (
            <div className="aspect-[4/3] flex items-center justify-center text-[#4a4a4a] bg-gray-50">
              <p>Floorplan image</p>
            </div>
          )}
        </div>

        {/* Disclaimer */}
        <p className="text-xs text-[#4a4a4a] text-center mt-4 max-w-2xl mx-auto">
          Floor plans are for illustration purposes only. They are not drawn to scale and are intended as a guide only. 
          Plot specific details should be confirmed prior to reservation.
        </p>

        {/* Download Button */}
        <div className="mt-6 text-center">
          {fields.DownloadLink ? (
            <SitecoreLink
              field={fields.DownloadLink}
              className="inline-flex items-center gap-2 bg-[#0072CE] hover:bg-[#005ba3] text-white font-medium py-3 px-6 rounded transition-colors text-sm"
            />
          ) : (
            <button className="inline-flex items-center gap-2 bg-[#0072CE] hover:bg-[#005ba3] text-white font-medium py-3 px-6 rounded transition-colors text-sm">
              View full floorplan
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
