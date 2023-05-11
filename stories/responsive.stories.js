import { useReducer, useState } from 'react';
import { Report } from '../src/index';
import {
  acceptedItems, defaultSettings, leftPanelConfig, responsiveSettings,
} from './config';
import { initialPages, pagesReducer } from './config/pageReducer';
import Responsive from '../src/components/Responsive';

export default {
  component: Responsive,
  parameters: {
    options: {
      showPanel: false,
    },
  },
  title: 'Examples/Responsive',
};

// Each story then reuses that template
export const ResponsivePreview = args => {
  const [pages, dispatch] = useReducer(pagesReducer, initialPages());
  const [mode, setMode] = useState('customize');
  const actionButtons = ['Customize', 'Preview', 'Responsive'];

  const [settings, setSettings] = useState(defaultSettings);

  const changeMode = modeType => {
    setMode(modeType);
    setSettings(modeType === 'responsive' ? responsiveSettings : defaultSettings);
  };

  const styles = {
    modeActions: {
      bottom: 20,
      position: 'absolute',
      right: 20,
      zIndex: 99999999999,
    },
  };

  return (
    <>
      <div
        id="modeActions"
        style={styles.modeActions}
      >
        {actionButtons.map((button, index) => (
          <button
            key={index.toString()}
            className={`actionButton${button.toLowerCase() === mode ? ' buttonActive' : ''}`}
            onClick={() => changeMode(button.toLowerCase())}
            type="button"
          >
            {button}
          </button>
        ))}
      </div>
      <Report
        {...args}
        mode={mode}
        onItemAdd={item => dispatch({ payload: item, type: 'onItemAdd' })}
        onItemChange={(item, data) => dispatch({ payload: { data, item }, type: 'onItemChange' })}
        onItemMove={item => dispatch({ payload: item, type: 'onItemMove' })}
        onItemRemove={item => dispatch({ payload: item, type: 'onItemRemove' })}
        onItemResize={(item, data) => dispatch({ payload: { data, item }, type: 'onItemResize' })}
        onPageAdd={order => dispatch({ payload: order, type: 'onPageAdd' })}
        onPageChange={(pageID, data) => dispatch({
          payload: { data, pageID }, type: 'onPageChange',
        })}
        onPageDuplicate={pageID => dispatch({ payload: pageID, type: 'onPageDuplicate' })}
        pages={pages.sort((a, b) => parseFloat(a.order) - parseFloat(b.order))}
        settings={settings}
      />
    </>
  );
};
ResponsivePreview.args = {
  acceptedItems,
  leftPanelConfig: leftPanelConfig,
};
