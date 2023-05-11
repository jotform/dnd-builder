/* eslint-disable no-unused-vars */
/* eslint-disable sort-keys */
/* eslint-disable react/prop-types */
/* eslint-disable max-len */
import React, { useState, useReducer, useEffect } from 'react';
import { Report, RichText } from '../src/index';
import reportsAppTexts from '../src/constants/texts';
import {
  acceptedItems, leftPanelConfig, defaultSettings,
} from './config';
import { initialPages, pagesReducer } from './config/pageReducer';
import { safeJSONParse } from '../src/utils/functions';

export default {
  component: Report,
  title: 'Examples/All in One',
};

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
    itemType: 'github',
  },
  Component: ({
    item: {
      fontColor,
      fontFamily,
      fontSize,
      fontStyle,
      opacity,
      textAlign,
      username,
    },
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
    };

    useEffect(() => {
      if (username) {
        fetchStats();
      }
    }, [username]);
    if (!username) {
      return <div>Please setup your Github username.</div>;
    }
    return (
      <div style={textStyle}>
        <img
          alt="avatar"
          src={stats.avatar_url}
        />
        <h1>{username}</h1>
        <p>{stats.name}</p>
      </div>
    );
  },
};

const Watermark = () => {
  return (
    <div
      style={{
        fontSize: 100,
        position: 'absolute',
        zIndex: 9999,
        top: 'calc(50% - 57px)',
        left: 'calc(50% - 209px)',
        opacity: '0.1',
        userSelect: 'none',
        pointerEvents: 'none',
      }}
    >
      T U C A N
    </div>
  );
};

const Template = args => {
  const [pages, dispatch] = useReducer(pagesReducer, initialPages());
  const [settings, setSettings] = useState(defaultSettings);
  const [mode, setMode] = useState('customize');
  const actionButtons = ['Customize', 'Preview', 'Presentation', 'Print'];

  return (
    <>
      <div
        id="modeActions"
        style={{
          bottom: 20,
          position: 'absolute',
          right: 20,
          zIndex: 9999999999999999999,
        }}
      >
        {actionButtons.map((button, index) => (
          <button
            key={index.toString()}
            className={`actionButton${button.toLowerCase() === mode ? ' buttonActive' : ''}`}
            onClick={() => { setMode(button.toLowerCase()); }}
            type="button"
          >
            {button}
          </button>
        ))}

      </div>
      <Report
        {...args}
        acceptedItems={{
          ...acceptedItems,
          [Logo.itemType]: Logo,
          [Github.itemType]: Github,
        }}
        additionalPageItems={[
          <Watermark key="watermark" />,
        ]}
        leftPanelConfig={[
          ...leftPanelConfig,
          {
            elements: [
              {
                iconType: 'image',
                itemType: Logo.itemType,
                title: 'Podo Switcher',
              },
              {
                iconType: 'text',
                itemType: Github.itemType,
                title: 'Extended Text',
              },
            ],
            title: 'Custom Elements',
          },
        ]}
        mode={mode}
        onItemAdd={item => dispatch({ payload: item, type: 'onItemAdd' })}
        onItemChange={(item, data) => dispatch({ payload: { data, item }, type: 'onItemChange' })}
        onItemMove={item => dispatch({ payload: item, type: 'onItemMove' })}
        onItemRemove={item => dispatch({ payload: item, type: 'onItemRemove' })}
        onItemResize={(item, data) => dispatch({ payload: { data, item }, type: 'onItemResize' })}
        onPageAdd={order => dispatch({ payload: order, type: 'onPageAdd' })}
        onPageChange={(pageID, data) => dispatch({ payload: { data, pageID }, type: 'onPageChange' })}
        onPageDuplicate={pageID => dispatch({ payload: pageID, type: 'onPageDuplicate' })}
        onPageOrdersChange={page => dispatch({ payload: page, type: 'onPageOrdersChange' })}
        onPageRemove={pageID => dispatch({ payload: pageID, type: 'onPageRemove' })}
        onSettingChange={(id, data) => setSettings({ ...settings, ...data })}
        pages={pages.sort((a, b) => parseFloat(a.order) - parseFloat(b.order))}
        presentationBarActions={[
          {
            key: 'print',
          },
          {
            key: 'logger',
            className: 'isSuccess',
            handler: () => { console.log('Clicked console logger.'); },
            icon: 'pen',
            title: 'Console Logger',
          },
          {
            key: 'present',
          },
        ]}
        settings={settings}
      />
    </>
  );
};

export const FullControlled = Template.bind({});
FullControlled.args = {
  reportsAppTexts,
};
