import React, { useState, useReducer } from 'react';
import { Builder } from '../../src/index';
import {
  defaultSettings,
} from '../config';
import { initialPages, pagesReducer } from '../config/pageReducer';

export const Template = args => {
  const [pages, dispatch] = useReducer(pagesReducer, initialPages());
  const [settings, setSettings] = useState(defaultSettings);

  return (
    <Builder
      {...args}
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
      settings={settings}
    />
  );
};

export const ItemAccessorExample1 = Template.bind(null);

export const Counter = {
  Component: function comp({ item, itemAccessor }) { // eslint-disable-line react/prop-types
    const counterValue = itemAccessor(item);
    return (
      <div>
        <div>{`Outside Value: ${counterValue}`}</div>
        { /* eslint-disable-next-line react/prop-types */}
        <div>{`Inside Value: ${item.inside}`}</div>
      </div>
    );
  },
  details: {
    height: 100,
    inside: 0,
    itemType: 'counter',
    width: 200,
  },
  itemType: 'counter',
  settings: [
    {
      key: 'inside',
      label: 'Inside Value',
      section: 'General',
      type: 'textbox',
    },
  ],
};
