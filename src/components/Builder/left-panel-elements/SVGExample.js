import React from 'react';
import PropTypes from 'prop-types';
import FormFieldItem from './FormFieldItem';
import FieldName from '../../../assets/svg/freecanvas/field-name.svg';

// Example 1: SVG as React Component Function
const UserIcon = ({ color = '#000', size = 24, ...props }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    {...props}
  >
    <path
      d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <circle
      cx="12"
      cy="7"
      r="4"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

// Example 2: SVG as React Component with default props
const EmailIcon = ({ className = '', ...props }) => (
  <svg
    className={`email-icon ${className}`}
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    {...props}
  >
    <path
      d="m4 4 16 0c1.1 0 2 .9 2 2l0 12c0 1.1-.9 2-2 2l-16 0c-1.1 0-2-.9-2-2l0-12c0-1.1.9-2 2-2z"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <polyline
      points="22,6 12,13 2,6"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

// Example 3: Higher-order component for SVG icons
const createSVGIcon = (pathData, defaultProps = {}) => {
  const SVGIcon = ({
    size = 24,
    color = 'currentColor',
    strokeWidth = 2,
    ...props
  }) => (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      {...props}
    >
      <path
        d={pathData}
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );

  SVGIcon.defaultProps = defaultProps;
  return SVGIcon;
};

// Create icons using the HOC
const PhoneIcon = createSVGIcon(
  "M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z",
  { color: '#10b981' }
);

const AddressIcon = createSVGIcon(
  "M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z M15 9a3 3 0 1 1-6 0 3 3 0 0 1 6 0z"
);

const SVGExample = () => {
  const handleFieldClick = ({ itemTitle, IconComponent }) => {
    console.log('Field clicked:', itemTitle, IconComponent);
  };

  return (
    <div className="p-6 space-y-4">
      <h2 className="text-2xl font-bold mb-4">SVG Props Examples</h2>

      <div className="space-y-4">
        {/* Method 1: Imported SVG file */}
        <FormFieldItem
          itemIcon={FieldName}
          itemTitle="Name (Imported SVG)"
          onClick={handleFieldClick}
        />

        {/* Method 2: Custom SVG component with props */}
        <FormFieldItem
          itemIcon={UserIcon}
          itemTitle="User (Custom Props)"
          iconProps={{ color: '#3b82f6', size: 28 }}
          onClick={handleFieldClick}
        />

        {/* Method 3: SVG component with CSS classes */}
        <FormFieldItem
          itemIcon={EmailIcon}
          itemTitle="Email (CSS Classes)"
          iconProps={{ className: 'text-green-600' }}
          onClick={handleFieldClick}
        />

        {/* Method 4: SVG created with HOC */}
        <FormFieldItem
          itemIcon={PhoneIcon}
          itemTitle="Phone (HOC Pattern)"
          iconProps={{ size: 26 }}
          onClick={handleFieldClick}
        />

        {/* Method 5: SVG with custom styling */}
        <FormFieldItem
          itemIcon={AddressIcon}
          itemTitle="Address (Custom Styling)"
          iconProps={{
            size: 24,
            color: '#f59e0b',
            strokeWidth: 2.5,
            style: { filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))' }
          }}
          onClick={handleFieldClick}
        />

        {/* Method 6: Inline SVG as JSX */}
        <FormFieldItem
          itemIcon={
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path
                d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          }
          itemTitle="Repository (Inline SVG)"
          onClick={handleFieldClick}
        />

        {/* Method 7: SVG from URL */}
        <FormFieldItem
          itemIcon="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTEyIDJMMTMuMDkgOC4yNkwyMCA5TDEzLjA5IDE1Ljc0TDEyIDIyTDEwLjkxIDE1Ljc0TDQgOUwxMC45MSA4LjI2TDEyIDJaIiBzdHJva2U9IiNmNTlmMGIiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIi8+Cjwvc3ZnPgo="
          itemTitle="Star (Base64 SVG)"
          onClick={handleFieldClick}
        />
      </div>

      <div className="mt-8 p-4 bg-gray-100 rounded-lg">
        <h3 className="font-semibold mb-2">Best Practices:</h3>
        <ul className="list-disc pl-5 space-y-1 text-sm">
          <li><strong>Method 1:</strong> Best for static SVGs - import as React component</li>
          <li><strong>Method 2:</strong> Best for dynamic SVGs - pass props for customization</li>
          <li><strong>Method 3:</strong> Good for theme-based styling with CSS classes</li>
          <li><strong>Method 4:</strong> Efficient for creating multiple similar icons</li>
          <li><strong>Method 5:</strong> Great for advanced styling and animations</li>
          <li><strong>Method 6:</strong> Use sparingly - can make code less maintainable</li>
          <li><strong>Method 7:</strong> Use for external SVGs or base64 encoded ones</li>
        </ul>
      </div>
    </div>
  );
};

// PropTypes for the example icons
UserIcon.propTypes = {
  color: PropTypes.string,
  size: PropTypes.number,
};

EmailIcon.propTypes = {
  className: PropTypes.string,
};

export default SVGExample; 