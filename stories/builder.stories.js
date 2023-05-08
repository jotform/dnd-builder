/* eslint-disable */
import React, { useEffect, useState } from 'react';
import { actions } from '@storybook/addon-actions';
import { Builder, RichText, ReportIcons } from '../src/index';
import {
  acceptedItems, leftPanelConfig, defaultSettings, safeJSONParse
} from './config';
import { initialPages } from './config/pageReducer';
import { Template } from './templates/builder.template';

const events = actions('onItemAdd', 'onItemChange', 'onItemMove', 'onItemRemove',
'onItemResize', 'onPageAdd', 'onPageChange', 'onPageDuplicate',
'onPageOrdersChange', 'onPageRemove', 'onSettingChange');

export default {
  component: Builder,
  title: 'Examples/Builder',
};

const BasicTemplate = args => <Builder {...args} />;

export const BasicUncontrolled = BasicTemplate.bind({});
BasicUncontrolled.args = {
  acceptedItems,
  leftPanelConfig,
  pages: initialPages(),
  settings: defaultSettings,
  ...events
};

export const FullControlled = Template.bind({});
FullControlled.args = {
  acceptedItems,
  leftPanelConfig,
};

export const CustomComponent = Template.bind({});
const Logo = {
  Component: ({ item }) => {
    return (
      <img
        alt="Logo"
        {...item}
      />
    );
  },
  details: {
    height: 300,
    itemType: 'logo',
    src: 'https://miro.medium.com/max/2100/1*khbx3PQVp4qttqDdHcdFng.jpeg',
    width: 300,
  },
  itemType: 'logo',
  settings: [
    {
      key: 'src',
      label: 'Change Podo',
      options: [
        {
          icon: <img
            alt="Logo1"
            height="20"
            src="https://miro.medium.com/max/2100/1*khbx3PQVp4qttqDdHcdFng.jpeg"
            width="20"
          />,
          value: 'https://miro.medium.com/max/2100/1*khbx3PQVp4qttqDdHcdFng.jpeg',
        },
        {
          icon: <img
            alt="Logo1"
            height="20"
            src="https://www.jotform.com/resources/assets/podo/podo_4.png"
            width="20"
          />,
          value: 'https://www.jotform.com/resources/assets/podo/podo_4.png',
        },
        {
          icon: <img
            alt="Logo1"
            height="20"
            src="https://cdn.jotfor.ms/assets/img/support-forum/dnd-podo.png"
            width="20"
          />,
          value: 'https://cdn.jotfor.ms/assets/img/support-forum/dnd-podo.png',
        },
      ],
      optionsDisplay: ['icon'],
      section: 'GENERAL',
      type: 'segmentControl',
    },
  ],
};
CustomComponent.args = {
  acceptedItems: {
    [Logo.itemType]: Logo,
  },
  leftPanelConfig: [{
    elements: [
      {
        iconType: 'image',
        itemType: Logo.itemType,
        title: 'Podo Switcher',
      },
    ],
    title: 'Items',
  }]
};

export const ExtendComponent = Template.bind({});
const Github = {
  ...RichText,
  itemType: 'github',
  settings: [
    {
      key: 'username',
      label: 'Github Username',
      section: 'Integration',
      type: 'textbox',
    },
    ...RichText.settings,
  ],
  details: {
    ...RichText.details,
    itemType: 'github'
  },
  Component: ({
    item: {
      fontColor,
      fontFamily,
      fontSize,
      fontStyle,
      id,
      isLocked,
      opacity,
      textAlign,
      value,
      username
    }
  }) => {
    const _fontStyle = safeJSONParse(fontStyle, []);
    const textStyle = {
      color: fontColor,
      fontFamily,
      fontSize: parseInt(fontSize, 10),
      fontStyle: _fontStyle.includes('italic') ? 'italic' : 'normal',
      fontWeight: _fontStyle.includes('bold') ? 'bold' : 'normal',
      opacity,
      textAlign,
      textDecoration: _fontStyle.includes('underline') ? 'underline' : 'none',
    };
    const [stats, setStats] = useState({}); 

    const fetchStats = async () => {
      const response = await fetch(`https://api.github.com/users/${username}`);
      response
        .json()
        .then(res => {
          setStats(res);
        });
    }
    useEffect(() => {
      if (username) {
        fetchStats();
      }
    },[username])

    if(!username) {
      return  <div>Please setup your Github username.</div>
    }
    return (
     <div style={textStyle}>
       <img src={stats.avatar_url} />
       <h1>{username}</h1>
       <p>{stats.name}</p>
     </div>
    )
  }
};
ExtendComponent.args = {
  acceptedItems: {
    [RichText.itemType]: RichText,
    [Github.itemType]: Github
  },
  leftPanelConfig: [
    {
      elements: [
        {
          iconType: 'text',
          itemType: RichText.itemType,
          title: 'Text',
        },
        {
          iconType: 'text',
          itemType: Github.itemType,
          title: 'Github',
        },
      ],
      title: 'Items',
    },
  ]
};

export const CustomSettingComponent = Template.bind({});
const CustomSetting = ({
  config,
  item,
  itemAccessor,
  onItemChange,
  value,
}) => {
  const imageOptions = [
    'https://miro.medium.com/max/2100/1*khbx3PQVp4qttqDdHcdFng.jpeg',
    'https://www.jotform.com/resources/assets/podo/podo_4.png',
    'https://cdn.jotfor.ms/assets/img/support-forum/dnd-podo.png',
  ];
  return (
    imageOptions.map((image, key) => (
      <img
        key={key.toString()}
        alt={image}
        onClick={e => {
          onItemChange({
            id: item.id,
          }, {
            src: e.currentTarget.src,
          });
        }}
        onKeyUp={() => {}}
        src={image}
        style={{
          border: `1px solid ${image === value ? 'lightgreen' : 'red' }`,
          display: 'block',
          height: 100,
          marginBottom: 20,
          width: 100,
          pointerEvents: 'all'
        }}
      />
    ))
  );
};

const customLogo = {
  Component: ({ item }) => {
    return (
      <img
        alt="Logo"
        {...item}
      />
    );
  },
  details: {
    height: 300,
    itemType: 'logo',
    src: 'https://miro.medium.com/max/2100/1*khbx3PQVp4qttqDdHcdFng.jpeg',
    width: 300,
  },
  itemType: 'logo',
  settings: [
    {
      component: CustomSetting,
      key: 'src',
      label: 'Change Podo',
      section: 'GENERAL',
    },
  ],
};
CustomSettingComponent.args = {
  acceptedItems: {
    [Logo.itemType]: Logo,
  },
  leftPanelConfig: [
    {
      elements: [
        {
          iconType: 'image',
          itemType: customLogo.itemType,
          title: 'Podo Switcher',
        },
      ],
      title: 'Items',
    },
  ]
};

export const Watermark = Template.bind({});
const CustomWatermark = () => {
  return <div style={{
    fontSize: 100,
    position: 'absolute',
    zIndex: 9999,
    top: 'calc(50% - 57px)',
    left: 'calc(50% - 209px)',
    opacity: '0.1',
    pointerEvents: 'none',
    userSelect: 'none',
  }}>T U C A N</div>
}
Watermark.args = {
  ...FullControlled.args,
  additionalPageItems: [<CustomWatermark />],
};

export const AllSettings = Template.bind({});
const customAllSettings = {
  Component: () => {
    return (
      <div>Demo purpose only, please check settings.</div>
    );
  },
  details: {
    height: 100,
    itemType: 'allSettings',
    width: 500,
  },
  itemType: 'allSettings',
  settings: [
    {
      key: 'checkboxGroup',
      label: 'Checkbox Group',
      options: [
        'Option 1',
        'Option 2',
        'Option 3',
      ],
      section: 'GENERAL',
      type: 'checkboxGroup'
    },
    {
      key: 'colorPicker',
      label: 'Color Picker',
      section: 'GENERAL',
      type: 'colorPicker',
    },
    {
      key: 'dropdown',
      label: 'Dropdown',
      options: [
        { label: 'Thin', value: 'thin' },
        { label: 'Medium', value: 'medium' },
        { label: 'Thick', value: 'thick' },
      ],
      section: 'GENERAL',
      type: 'dropdown',
    },
    {
      key: 'url',
      label: 'Image URL',
      section: 'GENERAL',
      type: 'enterImageURL',
      useImageSizeUpdate: true,
    },
    {
      key: 'orientation',
      label: 'Orientation',
      multipleSelect: false,
      options: [
        { icon: <ReportIcons.layout className="jfReportSVG icon-layout" />, value: 'landscape' },
        { icon: <ReportIcons.layout className="jfReportSVG icon-layout" />, value: 'portrait' },
      ],
      optionsDisplay: ['icon'],
      section: 'GENERAL',
      type: 'orientation',
    },
    {
      key: 'segmentControl',
      label: 'Segment Control',
      multipleSelect: true,
      options: [
        { icon: <ReportIcons.bold className="jfReportSVG icon-bold" />, value: 'bold' },
        { icon: <ReportIcons.italic className="jfReportSVG icon-italic" />, value: 'italic' },
        { icon: <ReportIcons.underline className="jfReportSVG icon-underline" />, value: 'underline' },
      ],
      optionsDisplay: ['icon'],
      section: 'GENERAL',
      type: 'segmentControl',
    },
    {
      key: 'selectBox',
      label: 'Selectbox',
      section: 'GENERAL',
      type: 'selectBox',
      options: [
        {
          name: 'line',
          title: 'Line',
        },
        {
          name: 'shapes',
          title: 'Shapes',
        },
        {
          name: 'star',
          title: 'Star',
        },
      ],
    },
    {
      key: 'slider',
      label: 'Slider',
      range: [0, 100],
      section: 'GENERAL',
      type: 'slider',
    },
    {
      inputType: 'text',
      key: 'textbox',
      label: 'Textbox',
      section: 'GENERAL',
      type: 'textbox',
    },
    {
      key: 'toggle',
      label: 'Toggle',
      section: 'GENERAL',
      type: 'toggle',
    },
  ],
};
AllSettings.args = {
  acceptedItems: {
    [customAllSettings.itemType]: customAllSettings
  },
  leftPanelConfig: [
    {
      elements: [
        {
          iconType: 'gear',
          itemType: customAllSettings.itemType,
          title: 'All Settings',
        },
      ],
      title: 'Items',
    }
  ]
};
