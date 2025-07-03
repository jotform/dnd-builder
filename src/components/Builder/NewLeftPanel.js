/* eslint-disable sort-keys */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable max-len */
/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable react/button-has-type */
/* eslint-disable no-unused-vars */
import { memo, useState } from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import Panel from './Panel';
import * as icons from '../../utils/icons';

const NewLeftPanel = ({
  onItemAdd,
  onSettingChange,
}) => {
  const [activeTab, setActiveTab] = useState('Background');
  const [isOpen, setIsOpen] = useState(false);
  const [backgroundSubTab, setBackgroundSubTab] = useState('Colors');

  const handleBackgroundColorChange = ({ type, ...rest }) => {
    onSettingChange({ id: '__layout__' }, {
      ...rest,
      reportBackgroundGradientEnabled: type === 'gradient' ? 'on' : 'off',
    });
  };

  const tabs = [
    {
      content: () => (
        <div className="new-left-panel-content">
          <div className="new-left-panel-section">
            <h3>AI Generation</h3>
            <button
              className="new-left-panel-button"
              type="button"
            >
              Generate Layout
            </button>
            <button
              className="new-left-panel-button"
              type="button"
            >
              Auto Design
            </button>
          </div>
        </div>
      ),
      icon: '🤖',
      id: 'AI',
      name: 'AI',
    },
    {
      content: () => (
        <div className="new-left-panel-content">
          <div className="new-left-panel-section">
            <h3>Templates</h3>
            <div className="template-grid">
              <div className="template-item">Basic</div>
              <div className="template-item">Modern</div>
              <div className="template-item">Classic</div>
              <div className="template-item">Minimal</div>
            </div>
          </div>
        </div>
      ),
      icon: '📋',
      id: 'Templates',
      name: 'Templates',
    },
    {
      content: () => (
        <div className="new-left-panel-content">
          <div className="new-left-panel-section">
            <h3>Basic Shapes</h3>
            <div className="shapes-grid">
              <div className="shape-item rectangle">Rectangle</div>
              <div className="shape-item circle">Circle</div>
              <div className="shape-item triangle">Triangle</div>
              <div className="shape-item star">Star</div>
            </div>
          </div>
        </div>
      ),
      icon: '🔺',
      id: 'Shapes',
      name: 'Shapes',
    },
    {
      content: () => (
        <div className="new-left-panel-content">
          <div className="new-left-panel-section">
            <div className="background-tabs">
              <button
                className={classNames('bg-tab', { active: backgroundSubTab === 'Photos' })}
                onClick={() => setBackgroundSubTab('Photos')}
                type="button"
              >
                Photos
              </button>
              <button
                className={classNames('bg-tab', { active: backgroundSubTab === 'Videos' })}
                onClick={() => setBackgroundSubTab('Videos')}
                type="button"
              >
                Videos
              </button>
              <button
                className={classNames('bg-tab', { active: backgroundSubTab === 'Colors' })}
                onClick={() => setBackgroundSubTab('Colors')}
                type="button"
              >
                Colors
              </button>
            </div>

            {backgroundSubTab === 'Photos' && (
              <div className="background-content">
                <div className="file-upload-section">
                  <div className="file-upload-area">
                    <div className="file-upload-icon">📷</div>
                    <h4>Upload Photos</h4>
                    <p>Drag and drop your images here, or click to browse</p>
                    <button
                      className="file-upload-button"
                      type="button"
                    >
                      Choose Files
                    </button>
                  </div>
                </div>
                <div className="recent-photos">
                  <h4>Recent Photos</h4>
                  <div className="photo-grid">
                    <div className="photo-item">
                      <div className="photo-placeholder">📸</div>
                    </div>
                    <div className="photo-item">
                      <div className="photo-placeholder">📸</div>
                    </div>
                    <div className="photo-item">
                      <div className="photo-placeholder">📸</div>
                    </div>
                    <div className="photo-item">
                      <div className="photo-placeholder">📸</div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {backgroundSubTab === 'Videos' && (
              <div className="background-content">
                <div className="file-upload-section">
                  <div className="file-upload-area">
                    <div className="file-upload-icon">🎥</div>
                    <h4>Upload Videos</h4>
                    <p>Drag and drop your videos here, or click to browse</p>
                    <button
                      className="file-upload-button"
                      type="button"
                    >
                      Choose Files
                    </button>
                  </div>
                </div>
                <div className="recent-videos">
                  <h4>Recent Videos</h4>
                  <div className="video-grid">
                    <div className="video-item">
                      <div className="video-placeholder">🎬</div>
                    </div>
                    <div className="video-item">
                      <div className="video-placeholder">🎬</div>
                    </div>
                    <div className="video-item">
                      <div className="video-placeholder">🎬</div>
                    </div>
                    <div className="video-item">
                      <div className="video-placeholder">🎬</div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {backgroundSubTab === 'Colors' && (
              <div className="background-content">
                <div className="color-picker-section">
                  <div className="color-picker-gradient">
                    <div className="color-gradient" />
                    <div className="color-slider" />
                  </div>
                  <div className="color-input-section">
                    <input
                      className="color-input"
                      type="text"
                      value="#FFFFFF"
                    />
                    <div className="color-preview" />
                  </div>
                </div>
                <div className="brand-colors">
                  <h4>Brand kit</h4>
                  <div className="brand-color-grid">
                    <div
                      className="brand-color orange"
                      onClick={() => handleBackgroundColorChange({ type: 'solid', reportBackgroundColor: '#F5A623' })}
                    />
                    <div
                      className="brand-color red"
                      onClick={() => handleBackgroundColorChange({ type: 'solid', reportBackgroundColor: '#D0021B' })}
                    />
                    <div
                      className="brand-color blue"
                      onClick={() => handleBackgroundColorChange({ type: 'solid', reportBackgroundColor: '#4A90E2' })}
                    />
                    <div
                      className="brand-color dark-blue"
                      onClick={() => handleBackgroundColorChange({ type: 'solid', reportBackgroundColor: '#000000' })}
                    />
                  </div>
                </div>
                <div className="solid-colors">
                  <h4>Solid colors</h4>
                  <div className="solid-color-grid">
                    <div
                      className="solid-color red"
                      onClick={() => handleBackgroundColorChange({ type: 'solid', reportBackgroundColor: '#D0021B' })}
                    />
                    <div
                      className="solid-color orange"
                      onClick={() => handleBackgroundColorChange({ type: 'solid', reportBackgroundColor: '#F5A623' })}
                    />
                    <div
                      className="solid-color yellow"
                      onClick={() => handleBackgroundColorChange({ type: 'solid', reportBackgroundColor: '#F8E71C' })}
                    />
                    <div
                      className="solid-color brown"
                      onClick={() => handleBackgroundColorChange({ type: 'solid', reportBackgroundColor: '#8B572A' })}
                    />
                    <div
                      className="solid-color green"
                      onClick={() => handleBackgroundColorChange({ type: 'solid', reportBackgroundColor: '#7ED321' })}
                    />
                    <div
                      className="solid-color dark-green"
                      onClick={() => handleBackgroundColorChange({ type: 'solid', reportBackgroundColor: '#417505' })}
                    />
                    <div
                      className="solid-color purple"
                      onClick={() => handleBackgroundColorChange({ type: 'solid', reportBackgroundColor: '#BD10E0' })}
                    />
                    <div
                      className="solid-color blue"
                      onClick={() => handleBackgroundColorChange({ type: 'solid', reportBackgroundColor: '#4A90E2' })}
                    />
                    <div
                      className="solid-color teal"
                      onClick={() => handleBackgroundColorChange({ type: 'solid', reportBackgroundColor: '#50E3C2' })}
                    />
                    <div
                      className="solid-color lime"
                      onClick={() => handleBackgroundColorChange({ type: 'solid', reportBackgroundColor: '#B8E986' })}
                    />
                    <div
                      className="solid-color black"
                      onClick={() => handleBackgroundColorChange({ type: 'solid', reportBackgroundColor: '#000000' })}
                    />
                    <div
                      className="solid-color gray"
                      onClick={() => handleBackgroundColorChange({ type: 'solid', reportBackgroundColor: '#4A4A4A' })}
                    />
                    <div
                      className="solid-color light-gray"
                      onClick={() => handleBackgroundColorChange({ type: 'solid', reportBackgroundColor: '#9B9B9B' })}
                    />
                    <div
                      className="solid-color white"
                      onClick={() => handleBackgroundColorChange({ type: 'solid', reportBackgroundColor: '#FFFFFF' })}
                    />
                  </div>
                </div>
                <div className="gradient-colors">
                  <h4>Gradient colors</h4>
                  <div className="gradient-color-grid">
                    <div
                      className="gradient-color gradient-blue"
                      onClick={() => handleBackgroundColorChange({ type: 'gradient', reportBackgroundGradientStartColor: '#4A90E2', reportBackgroundGradientEndColor: '#50E3C2' })}
                    />
                    <div
                      className="gradient-color gradient-purple"
                      onClick={() => handleBackgroundColorChange({ type: 'gradient', reportBackgroundGradientStartColor: '#BD10E0', reportBackgroundGradientEndColor: '#9013FE' })}
                    />
                    <div
                      className="gradient-color gradient-green"
                      onClick={() => handleBackgroundColorChange({ type: 'gradient', reportBackgroundGradientStartColor: '#7ED321', reportBackgroundGradientEndColor: '#417505' })}
                    />
                    <div
                      className="gradient-color gradient-orange"
                      onClick={() => handleBackgroundColorChange({ type: 'gradient', reportBackgroundGradientStartColor: '#F5A623', reportBackgroundGradientEndColor: '#8B572A' })}
                    />
                  </div>
                </div>
                <div className="style-section">
                  <h4>Style</h4>
                  <div className="style-grid">
                    <div
                      className="style-item"
                      onClick={() => handleBackgroundColorChange({ type: 'gradient', reportBackgroundGradientDirection: 'to right' })}
                    >
                      to right
                    </div>
                    <div
                      className="style-item"
                      onClick={() => handleBackgroundColorChange({ type: 'gradient', reportBackgroundGradientDirection: 'to bottom' })}
                    >
                      to bottom
                    </div>
                    <div
                      className="style-item"
                      onClick={() => handleBackgroundColorChange({ type: 'gradient', reportBackgroundGradientDirection: 'to top' })}
                    >
                      to top
                    </div>
                    <div
                      className="style-item"
                      onClick={() => handleBackgroundColorChange({ type: 'gradient', reportBackgroundGradientDirection: 'to bottom right' })}
                    >
                      to bottom right
                    </div>
                    <div
                      className="style-item"
                      onClick={() => handleBackgroundColorChange({ type: 'gradient', reportBackgroundGradientDirection: 'to bottom left' })}
                    >
                      to bottom left
                    </div>
                    <div
                      className="style-item"
                      onClick={() => handleBackgroundColorChange({ type: 'gradient', reportBackgroundGradientDirection: 'radial' })}
                    >
                      radial
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      ),
      icon: '🎨',
      id: 'Background',
      name: 'Background',
    },
    {
      content: () => (
        <div className="new-left-panel-content">
          <div className="new-left-panel-section">
            <h3>Text Elements</h3>
            <button
              className="new-left-panel-button"
              type="button"
            >
              Add Heading
            </button>
            <button
              className="new-left-panel-button"
              type="button"
            >
              Add Paragraph
            </button>
            <button
              className="new-left-panel-button"
              type="button"
            >
              Add List
            </button>
          </div>
        </div>
      ),
      icon: '📝',
      id: 'Text',
      name: 'Text',
    },
    {
      content: () => (
        <div className="new-left-panel-content">
          <div className="new-left-panel-section">
            <h3>Style Options</h3>
            <div className="style-options">
              <div className="style-option">
                <label htmlFor="font-family">Font Family</label>
                <select id="font-family">
                  <option>Arial</option>
                  <option>Helvetica</option>
                  <option>Times New Roman</option>
                </select>
              </div>
              <div className="style-option">
                <label htmlFor="font-size">Font Size</label>
                <input
                  id="font-size"
                  max="72"
                  min="8"
                  type="range"
                />
              </div>
            </div>
          </div>
        </div>
      ),
      icon: '🎭',
      id: 'Style',
      name: 'Style',
    },
  ];

  const handleTabClick = tabId => {
    console.log('tabId', tabId);
    if (activeTab === tabId && isOpen) {
      setIsOpen(false);
    } else {
      setActiveTab(tabId);
      setIsOpen(true);
    }
  };

  const panelAdditionalClassName = classNames(
    'new-left-panel',
    {
      'new-left-panel-closed': !isOpen,
      'new-left-panel-open': isOpen,
    },
  );

  const activeTabData = tabs.find(tab => tab.id === activeTab);

  return (
    <div className={panelAdditionalClassName}>
      {/* Tab Icons */}
      <div className="new-left-panel-tabs">
        {tabs.map(tab => (
          <button
            key={tab.id}
            className={classNames('new-left-panel-tab', {
              active: activeTab === tab.id && isOpen,
            })}
            onClick={() => handleTabClick(tab.id)}
            title={tab.name}
          >
            <span className="tab-icon">{tab.icon}</span>
            <span className="tab-name">{tab.name}</span>
          </button>
        ))}
      </div>

      {/* Panel Content */}
      {isOpen && activeTabData && (
        <Panel additionalClassName="new-left-panel-content-wrapper">
          <div className="new-left-panel-header">
            <h2>{activeTabData.name}</h2>
            <button
              className="new-left-panel-close"
              onClick={() => setIsOpen(false)}
            >
              <icons.close className="jfReportSVG" />
            </button>
          </div>
          {activeTabData.content()}
        </Panel>
      )}
    </div>
  );
};

NewLeftPanel.propTypes = {
  onItemAdd: PropTypes.func,
  onSettingChange: PropTypes.func,
};

NewLeftPanel.defaultProps = {
  onItemAdd: () => {},
  onSettingChange: () => {},
};

export default memo(NewLeftPanel);
