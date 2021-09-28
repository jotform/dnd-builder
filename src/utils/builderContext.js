/* eslint-disable react/no-unused-state */
import React, { createContext, useContext } from 'react';
import PropTypes from 'prop-types';

export const BuilderContext = createContext({
  activeElement: null,
  activeTab: { left: 0, right: 0 },
  contextMenuProps: false,
  editedElement: 'l_layout',
  isAllSlidesPanelOpen: false,
  isLeftPanelOpen: false,
  isRightPanelOpen: false,
  isSlidesPanelOpen: false,
  isTextEditorOpen: false,
  setActiveElement: () => {},
  setActiveTab: () => {},
  setContextMenuProps: () => {},
  setEditedElement: () => {},
  setIsAllSlidesPanelOpen: () => {},
  setIsLeftPanelOpen: () => {},
  setIsRightPanelOpen: () => {},
  setIsSlidesPanelOpen: () => {},
  setIsTextEditorOpen: () => {},
  setZoom: () => {},
  zoom: 1,
});

export const useBuilderContext = () => {
  const context = useContext(BuilderContext);
  if (!context) {
    throw new Error('BuilderContext must be used with BuilderProvider!');
  }
  return context;
};

export class BuilderProvider extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      activeElement: props.activeElement,
      activeTab: props.activeTab,
      contextMenuProps: props.contextMenuProps,
      editedElement: props.editedElement,
      isEnoughCanvasSize: props.isEnoughCanvasSize,
      isLeftPanelOpen: props.isLeftPanelOpen,
      isRightPanelOpen: props.isRightPanelOpen,
      isSlidesPanelOpen: props.isSlidesPanelOpen,
      setActiveElement: this.setActiveElement,
      setActiveTab: this.setActiveTab,
      setContextMenuProps: this.setContextMenuProps,
      setEditedElement: this.setEditedElement,
      setIsAllSlidesPanelOpen: this.setIsAllSlidesPanelOpen,
      setIsLeftPanelOpen: this.setIsLeftPanelOpen,
      setIsRightPanelOpen: this.setIsRightPanelOpen,
      setIsSlidesPanelOpen: this.setIsSlidesPanelOpen,
      setIsTextEditorOpen: this.setIsTextEditorOpen,
      setZoom: this.setZoom,
      zoom: 1,
    };
  }

  setActiveElement = (itemID, edit = true, multiple = false) => {
    if (!multiple) {
      const config = {
        activeElement: itemID === null ? null : [itemID],
      };
      if (edit) {
        const editedElement = !itemID ? 'l_layout' : `i_${itemID}`;
        config.editedElement = editedElement;
      }
      this.setState(config);
    } else {
      const { activeElement } = this.state;
      const config = {
        activeElement: activeElement === null ? [itemID] : [...activeElement, itemID],
      };
      this.setState(config);
    }
  };

  setEditedElement = id => {
    this.setState(prevState => {
      if (prevState.editedElement !== id) {
        return { editedElement: id };
      }
      return null;
    });
  }

  setActiveTab = (panel, tabIndex) => {
    const { activeTab } = this.state;
    this.setState({ activeTab: { ...activeTab, [panel]: tabIndex } });
  };

  setContextMenuProps = status => {
    this.setState({ contextMenuProps: status });
  }

  setIsRightPanelOpen = status => {
    const { isEnoughCanvasSize } = this.state;
    this.setState({
      isRightPanelOpen: status,
      ...status && !isEnoughCanvasSize && { isLeftPanelOpen: false },
      ...status && { isSlidesPanelOpen: false },
    });
  };

  setIsSlidesPanelOpen = status => {
    const { isEnoughCanvasSize } = this.state;
    this.setState({
      isSlidesPanelOpen: status,
      ...status && !isEnoughCanvasSize && { isLeftPanelOpen: false },
      ...status && { isRightPanelOpen: false },
    });
  };

  setIsAllSlidesPanelOpen = status => {
    this.setState({
      isAllSlidesPanelOpen: status,
    });
  };

  setIsLeftPanelOpen = status => {
    const { isEnoughCanvasSize } = this.state;
    this.setState({
      isLeftPanelOpen: status,
      ...status && !isEnoughCanvasSize && { isRightPanelOpen: false },
    });
  };

  setIsTextEditorOpen = status => {
    this.setState({ isTextEditorOpen: status });
  }

  setZoom = (zoom, isModeCustomize = false, layoutWidth, onLoad = false) => {
    this.setState({ zoom });
    if (isModeCustomize && !onLoad) {
      const { clientWidth: paneWidth } = document.querySelector('.jfReport-pane .toolItemWrapper');
      const sceneWidth = parseInt(layoutWidth, 10) * zoom;
      if (window.innerWidth - sceneWidth + 100 > (paneWidth * 2)) {
        this.setState({ isEnoughCanvasSize: true });
      } else {
        this.setState({
          isEnoughCanvasSize: false,
          isLeftPanelOpen: false,
        });
      }
    }
  }

  render() {
    const { children } = this.props;
    return (
      <BuilderContext.Provider value={this.state}>
        {children}
      </BuilderContext.Provider>
    );
  }
}

BuilderProvider.propTypes = {
  activeElement: PropTypes.string,
  activeTab: PropTypes.shape({}),
  children: PropTypes.any,
  contextMenuProps: PropTypes.shape({}),
  editedElement: PropTypes.string,
  isEnoughCanvasSize: PropTypes.bool,
  isLeftPanelOpen: PropTypes.bool,
  isRightPanelOpen: PropTypes.bool,
  isSlidesPanelOpen: PropTypes.bool,
};

BuilderProvider.defaultProps = {
  activeElement: null,
  activeTab: { left: 0, right: 0 },
  children: null,
  contextMenuProps: null,
  editedElement: 'l_layout',
  isEnoughCanvasSize: false,
  isLeftPanelOpen: false,
  isRightPanelOpen: false,
  isSlidesPanelOpen: false,
};

export const BuilderConsumer = BuilderContext.Consumer;
