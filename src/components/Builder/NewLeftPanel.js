/* eslint-disable react/prop-types */
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
import IconShape from '../../assets/svg/freecanvas/shape.svg';
import IconAiStars from '../../assets/svg/freecanvas/ai-stars.svg';
import IconTemplates from '../../assets/svg/freecanvas/templates.svg';
import IconBgColor from '../../assets/svg/freecanvas/ai-bgColor.svg';
import IconText from '../../assets/svg/freecanvas/type.svg';
import IconImage from '../../assets/svg/freecanvas/image-filled.svg';
import IconForm from '../../assets/svg/freecanvas/form-filled.svg';
import IconStyle from '../../assets/svg/aiStyle.svg';
import IconLoading from '../../assets/svg/freecanvas/ai-generation-loading.svg';
import generateId from '../../utils/generateId';
import { useBuilderContext } from '../../utils/builderContext';
import IconTemplate1 from '../../assets/svg/freecanvas/template-1.svg';
import IconTemplate2 from '../../assets/svg/freecanvas/template-2.svg';
import IconTemplate3 from '../../assets/svg/freecanvas/template-3.svg';
import IconTemplate4 from '../../assets/svg/freecanvas/template-4.svg';
import IconTemplate5 from '../../assets/svg/freecanvas/template-5.svg';
import IconTemplate6 from '../../assets/svg/freecanvas/template-6.svg';
import IconTemplate7 from '../../assets/svg/freecanvas/template-7.svg';
import IconTemplate8 from '../../assets/svg/freecanvas/template-8.svg';
import Searchbox from './left-panel-elements/Searchbox';
import ShowMoreLabel from './left-panel-elements/ShowMoreLabel';
import IconTextBusiness1 from '../../assets/svg/freecanvas/textstyle1-business.svg';
import IconTextBusiness2 from '../../assets/svg/freecanvas/textstyle2-business.svg';
import IconTextPhoto1 from '../../assets/svg/freecanvas/textstyle1-photo.svg';
import IconTextPhoto2 from '../../assets/svg/freecanvas/textstyle2-photo.svg';
import IconTextPhoto3 from '../../assets/svg/freecanvas/textstyle3-photo.svg';
import IconTextPhoto4 from '../../assets/svg/freecanvas/textstyle4-photo.svg';
import IconShapeTemplate1 from '../../assets/svg/freecanvas/shapetemplatephoto-1.svg';
import IconShapeTemplate2 from '../../assets/svg/freecanvas/shapetemplatephoto-2.svg';
import IconShapeTemplate3 from '../../assets/svg/freecanvas/shapetemplatephoto-3.svg';
import IconShapeTemplate4 from '../../assets/svg/freecanvas/shapetemplatephoto-4.svg';
import IconShapeTemplate5 from '../../assets/svg/freecanvas/shapetemplatephoto-5.svg';
import IconShapeTemplate6 from '../../assets/svg/freecanvas/shapetemplatephoto-6.svg';
import ShapeCircle from '../../assets/svg/freecanvas/shapecircle.svg';
import ShapeTriangle from '../../assets/svg/freecanvas/shapetriangle.svg';
import ShapeStar from '../../assets/svg/freecanvas/shapestar.svg';
import ShapeRectangle from '../../assets/svg/freecanvas/shaperectangle.svg';
import FormField from './left-panel-elements/FormField';

const NewLeftPanel = ({
  isAiGenerationLoading,
  onAIGenerate,
  onItemAdd,
  onSettingChange,
}) => {
  const {
    setActiveElement,
  } = useBuilderContext();
  const [activeTab, setActiveTab] = useState('Background');
  const [isOpen, setIsOpen] = useState(false);
  const [backgroundSubTab, setBackgroundSubTab] = useState('Colors');
  const [aiGenerateDescription, setAiGenerateDescription] = useState('');

  const handleBackgroundColorChange = ({ type, ...rest }) => {
    onSettingChange({ id: '__layout__' }, {
      ...rest,
      reportBackgroundGradientEnabled: type === 'gradient' ? 'on' : 'off',
    });
  };

  const handleShapeClick = shape => {
    const itemID = generateId();
    onItemAdd({
      id: itemID,
      itemType: 'shapes',
      left: 0,
      pageID: '1',
      shapeType: shape,
      top: 0,
      height: shape === 'line' ? 30 : 200,
      width: 200,
    });
    setActiveElement(itemID);
  };

  const handleAddTextClick = () => {
    const itemID = generateId();
    onItemAdd({
      id: itemID,
      itemType: 'text',
      left: 0,
      pageID: '1',
      top: 0,
      height: 65,
      width: 350,
    });
    setActiveElement(itemID);
  };

  const handleAddImageClick = () => {
    const itemID = generateId();
    onItemAdd({
      id: itemID,
      itemType: 'image',
      left: 0,
      pageID: '1',
      top: 0,
      height: 400,
      width: 400,
      opacity: 1,
      roundedCorners: 0,
      url: '',
    });
    setActiveElement(itemID);
  };

  const handleAddFieldsClick = () => {
    const itemID = generateId();
    setActiveElement(itemID);
  };

  const tabs = [
    {
      content: () => (
        <div className="new-left-panel-content">
          <div className="new-left-panel-section">
            <div className="ai-input-section flex flex-col gap-2">
              <div className="h-40 flex border outline-2 outline-offset-0 hover:duration-300 focus:duration-300 duration-all-colors hover:shadow-xs color-white bg-gray-500 focus-within:border-blue-500 border-gray-500 outline-transparent hover:border-gray-300 focus-within:outline-blue-500 focus-within:outline-opacity-30 magnet-textarea-container flex-col resize-none radius">
                <textarea
                  className="appearance-none bg-transparent grow-1 outline-0 w-full focus-visible-none border-0 text-sm magnet-textarea resize-none p-3 radius"
                  onChange={e => setAiGenerateDescription(e.target.value)}
                  placeholder="Describe the design"
                  rows={6}
                  value={aiGenerateDescription}
                />
              </div>
              <button
                className="ai-generate-button"
                onClick={() => onAIGenerate(aiGenerateDescription)}
                type="button"
              >
                <span className={isAiGenerationLoading ? 'freeCanvas-aiButtonLoading' : ''}>
                  {isAiGenerationLoading ? <IconLoading /> : 'Generate'}
                </span>
              </button>
            </div>
            <div className="ai-suggestions">
              <h4>Suggestions</h4>
              <div className="suggestion-chips">
                <button
                  className="suggestion-chip"
                  type="button"
                >
                  Modern business card
                </button>
                <button
                  className="suggestion-chip"
                  type="button"
                >
                  Social media post
                </button>
                <button
                  className="suggestion-chip"
                  type="button"
                >
                  Event flyer
                </button>
                <button
                  className="suggestion-chip"
                  type="button"
                >
                  Logo design
                </button>
                <button
                  className="suggestion-chip"
                  type="button"
                >
                  Newsletter template
                </button>
                <button
                  className="suggestion-chip"
                  type="button"
                >
                  Presentation slide
                </button>
              </div>
            </div>
          </div>
        </div>
      ),
      icon: <IconAiStars className="w-6 h-6" />,
      id: 'AI',
      name: 'AI',
      label: 'Design with AI',
    },
    {
      content: () => (
        <div className="new-left-panel-content">
          <div className="new-left-panel-section">
            <Searchbox type="template" />
            <div className="flex flex-col gap-2">
              <div>
                <ShowMoreLabel title="Business" />
                <div className="template-grid">
                  <div className="template-item">
                    <div className="template-item-image">
                      <IconTemplate1 />
                    </div>
                  </div>
                  <div className="template-item">
                    <div className="template-item-image">
                      <IconTemplate2 />
                    </div>
                  </div>
                  <div className="template-item">
                    <div className="template-item-image">
                      <IconTemplate3 />
                    </div>
                  </div>
                  <div className="template-item">
                    <div className="template-item-image">
                      <IconTemplate4 />
                    </div>
                  </div>
                </div>
              </div>
              <div>
                <ShowMoreLabel title="Photo" />
                <div className="template-grid">
                  <div className="template-item">
                    <div className="template-item-image">
                      <IconTemplate5 />
                    </div>
                  </div>
                  <div className="template-item">
                    <div className="template-item-image">
                      <IconTemplate6 />
                    </div>
                  </div>
                  <div className="template-item">
                    <div className="template-item-image">
                      <IconTemplate7 />
                    </div>
                  </div>
                  <div className="template-item">
                    <div className="template-item-image">
                      <IconTemplate8 />
                    </div>
                  </div>
                </div>
              </div>
              <div>
                <ShowMoreLabel title="Summer" />
                <div className="template-grid">
                  <div className="template-item">
                    <div className="template-item-image">
                      <IconTemplate5 />
                    </div>
                  </div>
                  <div className="template-item">
                    <div className="template-item-image">
                      <IconTemplate6 />
                    </div>
                  </div>
                  <div className="template-item">
                    <div className="template-item-image">
                      <IconTemplate7 />
                    </div>
                  </div>
                  <div className="template-item">
                    <div className="template-item-image">
                      <IconTemplate8 />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ),
      icon: <IconTemplates className="w-6 h-6" />,
      id: 'Templates',
      name: 'Templates',
      label: 'Templates',
    },
    {
      content: () => (
        <div className="new-left-panel-content">
          <div className="new-left-panel-section">
            <Searchbox type="shape" />
            <ShowMoreLabel title="Shapes" />
            <div className="shapes-grid mb-2">
              <ShapeCircle
                className="shape-item circle"
                onClick={() => handleShapeClick('circle')}
              />
              <ShapeTriangle
                className="shape-item triangle"
                onClick={() => handleShapeClick('triangle')}
              />
              <ShapeStar
                className="shape-item star"
                onClick={() => handleShapeClick('star')}
              />
              <ShapeRectangle
                className="shape-item rectangle"
                onClick={() => handleShapeClick('rectangle')}
              />
              {/* <div
                className="shape-item line"
                onClick={() => handleShapeClick('line')}
              >
                <ShapeCircle />
              </div> */}
            </div>
            <ShowMoreLabel title="Photo" />
            <div className="template-grid mb-2">
              <div className="template-item">
                <div className="template-item-image">
                  <IconShapeTemplate1 />
                </div>
              </div>
              <div className="template-item">
                <div className="template-item-image">
                  <IconShapeTemplate2 />
                </div>
              </div>
              <div className="template-item">
                <div className="template-item-image">
                  <IconShapeTemplate3 />
                </div>
              </div>
              <div className="template-item">
                <div className="template-item-image">
                  <IconShapeTemplate4 />
                </div>
              </div>
            </div>
            <ShowMoreLabel title="Summer" />
            <div className="template-grid">
              <div className="template-item">
                <div className="template-item-image">
                  <IconShapeTemplate5 />
                </div>
              </div>
              <div className="template-item">
                <div className="template-item-image">
                  <IconShapeTemplate6 />
                </div>
              </div>
            </div>
          </div>
        </div>
      ),
      icon: <IconShape className="w-6 h-6" />,
      id: 'Shapes',
      name: 'Shapes',
      label: 'Shape Tools',
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
                    {/* <div className="color-slider" /> */}
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
                      onClick={() => handleBackgroundColorChange({ type: 'gradient', reportBackgroundGradientStartColor: '#4A90E2', reportBackgroundGradientEndColor: '#3E62C8' })}
                    />
                    <div
                      className="gradient-color gradient-purple"
                      onClick={() => handleBackgroundColorChange({ type: 'gradient', reportBackgroundGradientStartColor: '#BD10E0', reportBackgroundGradientEndColor: '#441664' })}
                    />
                    <div
                      className="gradient-color gradient-green"
                      onClick={() => handleBackgroundColorChange({ type: 'gradient', reportBackgroundGradientStartColor: '#7ED321', reportBackgroundGradientEndColor: '#365007' })}
                    />
                    <div
                      className="gradient-color gradient-orange"
                      onClick={() => handleBackgroundColorChange({ type: 'gradient', reportBackgroundGradientStartColor: '#F5A623', reportBackgroundGradientEndColor: '#993A00' })}
                    />
                    <div
                      className="gradient-color gradient-teal"
                      onClick={() => handleBackgroundColorChange({ type: 'gradient', reportBackgroundGradientStartColor: '#007862', reportBackgroundGradientEndColor: '#00DEB5' })}
                    />
                    <div
                      className="gradient-color gradient-blue-teal"
                      onClick={() => handleBackgroundColorChange({ type: 'gradient', reportBackgroundGradientStartColor: '#0075E3', reportBackgroundGradientEndColor: '#00407D' })}
                    />
                    <div
                      className="gradient-color gradient-red"
                      onClick={() => handleBackgroundColorChange({ type: 'gradient', reportBackgroundGradientStartColor: '#C90909', reportBackgroundGradientEndColor: '#630404' })}
                    />
                  </div>
                </div>
                <div className="style-section">
                  <h4>Style</h4>
                  <div className="style-grid">
                    <div
                      className="style-item linear-gradient"
                      onClick={() => handleBackgroundColorChange({ type: 'gradient', reportBackgroundGradientDirection: 'to right' })}
                    />
                    <div
                      className="style-item radial-gradient"
                      onClick={() => handleBackgroundColorChange({ type: 'gradient', reportBackgroundGradientDirection: 'radial' })}
                    />
                    <div
                      className="style-item conic-gradient"
                      onClick={() => handleBackgroundColorChange({ type: 'gradient', reportBackgroundGradientDirection: 'to top' })}
                    />
                    <div
                      className="style-item diamond-gradient"
                      onClick={() => handleBackgroundColorChange({ type: 'gradient', reportBackgroundGradientDirection: 'to bottom center' })}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      ),
      icon: <IconBgColor className="w-6 h-6" />,
      id: 'Background',
      name: 'Background',
      label: 'Background',
    },
    {
      content: () => (
        <div className="new-left-panel-content">
          <div className="flex flex-col gap-2">
            <div className="new-left-panel-section">
              <Searchbox type="font style" />
              <button
                className="ai-generate-button secondary inline-flex gap-2"
                onClick={() => handleAddTextClick()}
                type="button"
              >
                <svg
                  fill="none"
                  height="20"
                  viewBox="0 0 21 20"
                  width="21"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    clipRule="evenodd"
                    d="M11.3333 4.16683C11.3333 3.70659 10.9602 3.3335 10.4999 3.3335C10.0397 3.3335 9.66658 3.70659 9.66658 4.16683V9.16683H4.66659C4.20635 9.16683 3.83325 9.53993 3.83325 10.0002C3.83325 10.4604 4.20635 10.8335 4.66659 10.8335H9.66658V15.8335C9.66658 16.2937 10.0397 16.6668 10.4999 16.6668C10.9602 16.6668 11.3333 16.2937 11.3333 15.8335V10.8335H16.3333C16.7935 10.8335 17.1666 10.4604 17.1666 10.0002C17.1666 9.53993 16.7935 9.16683 16.3333 9.16683H11.3333V4.16683Z"
                    fill="#343C6A"
                    fillRule="evenodd"
                  />
                </svg>
                <span className="font-circular">
                  Add a New Text
                </span>
              </button>
            </div>
            <div className="flex flex-col gap-2">
              <div className="new-left-panel-section">
                <ShowMoreLabel title="Business" />
                <div className="template-grid">
                  <div className="template-item">
                    <div className="template-item-image">
                      <IconTextBusiness1 />
                    </div>
                  </div>
                  <div className="template-item">
                    <div className="template-item-image">
                      <IconTextBusiness2 />
                    </div>
                  </div>
                </div>
              </div>
              <div className="new-left-panel-section">
                <ShowMoreLabel title="Photo" />
                <div className="template-grid">
                  <div className="template-item">
                    <div className="template-item-image">
                      <IconTextPhoto1 />
                    </div>
                  </div>
                  <div className="template-item">
                    <div className="template-item-image">
                      <IconTextPhoto2 />
                    </div>
                  </div>
                  <div className="template-item">
                    <div className="template-item-image">
                      <IconTextPhoto3 />
                    </div>
                  </div>
                  <div className="template-item">
                    <div className="template-item-image">
                      <IconTextPhoto4 />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ),
      icon: <IconText className="w-6 h-6" />,
      id: 'Text',
      name: 'Text',
      label: 'Text',
    },
    {
      content: () => (
        <div className="new-left-panel-content">
          <div className="new-left-panel-section">
            <button
              className="ai-generate-button inline-flex gap-2"
              onClick={() => handleAddImageClick()}
              type="button"
            >
              <svg
                fill="currentColor"
                height="20"
                viewBox="0 0 21 20"
                width="21"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  clipRule="evenodd"
                  d="M11.3333 4.16683C11.3333 3.70659 10.9602 3.3335 10.4999 3.3335C10.0397 3.3335 9.66658 3.70659 9.66658 4.16683V9.16683H4.66659C4.20635 9.16683 3.83325 9.53993 3.83325 10.0002C3.83325 10.4604 4.20635 10.8335 4.66659 10.8335H9.66658V15.8335C9.66658 16.2937 10.0397 16.6668 10.4999 16.6668C10.9602 16.6668 11.3333 16.2937 11.3333 15.8335V10.8335H16.3333C16.7935 10.8335 17.1666 10.4604 17.1666 10.0002C17.1666 9.53993 16.7935 9.16683 16.3333 9.16683H11.3333V4.16683Z"
                  fill="#fff"
                  fillRule="evenodd"
                />
              </svg>
              <span className="font-circular">
                Add a New Image
              </span>
            </button>
          </div>
        </div>
      ),
      icon: <IconImage className="w-6 h-6" />,
      id: 'Image',
      name: 'Image',
      label: 'Image',
    },
    {
      content: () => (
        <div className="new-left-panel-content">
          <div className="new-left-panel-section">
            <Searchbox type="field" />
            <FormField />
          </div>
        </div>
      ),
      icon: <IconForm className="w-6 h-6" />,
      id: 'Fields',
      name: 'Fields',
      label: 'Fields',
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
      icon: <IconStyle className="w-6 h-6" />,
      id: 'Style',
      name: 'Style',
      label: 'Style',
    },
  ];

  const handleTabClick = tabId => {
    if (tabId === 'Style') return;

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
            <h2>{activeTabData.label}</h2>
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
  isAiGenerationLoading: PropTypes.bool,
  onAIGenerate: PropTypes.func,
  onItemAdd: PropTypes.func,
  onSettingChange: PropTypes.func,
};

NewLeftPanel.defaultProps = {
  isAiGenerationLoading: false,
  onAIGenerate: () => { },
  onItemAdd: () => { },
  onSettingChange: () => { },
};

export default memo(NewLeftPanel);
