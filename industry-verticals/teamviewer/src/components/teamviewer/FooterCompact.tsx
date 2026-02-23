'use client';

import React, { type JSX } from 'react';
import {
  TextField,
  ImageField,
  LinkField,
  Placeholder,
  Text,
  Image as SitecoreImage,
  Link as SitecoreLink,
} from '@sitecore-content-sdk/nextjs';
import { ComponentProps } from '@/lib/component-props';

interface Fields {
  Logo: ImageField;
  RegionText: TextField;
  FacebookLink: LinkField;
  LinkedInLink: LinkField;
  TwitterLink: LinkField;
  YouTubeLink: LinkField;
  InstagramLink: LinkField;
}

type FooterCompactProps = ComponentProps & {
  fields: Fields;
};

const defaultFields: Fields = {
  Logo: { value: { src: '/teamviewer-logo-white.svg', alt: 'TeamViewer' } },
  RegionText: { value: 'Change Region' },
  FacebookLink: { value: { href: '#', text: 'Facebook' } },
  LinkedInLink: { value: { href: '#', text: 'LinkedIn' } },
  TwitterLink: { value: { href: '#', text: 'Twitter' } },
  YouTubeLink: { value: { href: '#', text: 'YouTube' } },
  InstagramLink: { value: { href: '#', text: 'Instagram' } },
};

export const Default = (props: FooterCompactProps): JSX.Element => {
  const fields = props.fields || defaultFields;
  const { rendering, params } = props;

  return (
    <footer
      style={{
        backgroundColor: '#001E50',
        color: '#ffffff',
        padding: '60px 20px 20px',
      }}
    >
      <div
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
        }}
      >
        {/* Top Section */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            marginBottom: '60px',
            flexWrap: 'wrap',
            gap: '40px',
          }}
        >
          {/* Logo and Region Selector */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '24px',
            }}
          >
            <SitecoreImage
              field={fields.Logo}
              style={{
                height: '32px',
                width: 'auto',
              }}
            />

            <button
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                backgroundColor: 'transparent',
                border: 'none',
                color: '#ffffff',
                fontSize: '14px',
                cursor: 'pointer',
                padding: '0',
              }}
            >
              <span style={{ fontSize: '20px' }}>🌐</span>
              <Text field={fields.RegionText} />
              <span style={{ fontSize: '12px' }}>▼</span>
            </button>
          </div>

          {/* Social Links */}
          <div
            style={{
              display: 'flex',
              gap: '16px',
              alignItems: 'center',
            }}
          >
            <SitecoreLink
              field={fields.FacebookLink}
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#ffffff',
                textDecoration: 'none',
                fontSize: '18px',
              }}
            >
              f
            </SitecoreLink>

            <SitecoreLink
              field={fields.LinkedInLink}
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#ffffff',
                textDecoration: 'none',
                fontSize: '18px',
              }}
            >
              in
            </SitecoreLink>

            <SitecoreLink
              field={fields.TwitterLink}
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#ffffff',
                textDecoration: 'none',
                fontSize: '18px',
              }}
            >
              𝕏
            </SitecoreLink>

            <SitecoreLink
              field={fields.YouTubeLink}
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#ffffff',
                textDecoration: 'none',
                fontSize: '18px',
              }}
            >
              ▶
            </SitecoreLink>

            <SitecoreLink
              field={fields.InstagramLink}
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#ffffff',
                textDecoration: 'none',
                fontSize: '18px',
              }}
            >
              📷
            </SitecoreLink>
          </div>
        </div>

        {/* Link Groups */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '40px',
            marginBottom: '40px',
          }}
        >
          <Placeholder
            name={`footer-links-${params?.DynamicPlaceholderId || '1'}`}
            rendering={rendering}
          />
        </div>

        {/* Bottom Links */}
        <div
          style={{
            borderTop: '1px solid rgba(255, 255, 255, 0.2)',
            paddingTop: '24px',
            display: 'flex',
            flexWrap: 'wrap',
            gap: '16px',
            fontSize: '13px',
          }}
        >
          <Placeholder
            name={`footer-bottom-links-${params?.DynamicPlaceholderId || '1'}`}
            rendering={rendering}
          />
        </div>
      </div>
    </footer>
  );
};
