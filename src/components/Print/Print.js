import PropTypes from 'prop-types';
import Modal from 'react-modal';
import PrintModeWithoutContext from './PrintModeWithoutContext';

const Print = props => {
  return (
    <Modal
      appElement={document.getElementById('root')}
      closeTimeoutMS={300}
      contentLabel="modalA"
      id="printModal"
      isOpen={true}
      portalClassName="ReportPrintPortal"
      shouldCloseOnEsc={false}
      style={{
        content: {
          backgroundColor: '#fff',
          border: 'none',
          borderRadius: 'none',
          bottom: 0,
          left: 0,
          overflow: 'visible',
          padding: 0,
          position: 'absolute',
          right: 0,
          top: 0,
        },
        overlay: {
          border: 'none',
          height: 'auto',
          position: 'absolute',
          zIndex: '99999',
        },
      }}
    >
      <PrintModeWithoutContext
        {...props}
      />
    </Modal>
  );
};

Print.propTypes = {
  /** Items for to render in the report */
  acceptedItems: PropTypes.shape({}),
  /** Array of React components to render statically on each page (eg. watermark) */
  additionalPageItems: PropTypes.arrayOf(PropTypes.node),
  /** To pass in extra props to items selectively */
  itemAccessor: PropTypes.func,
  /** Array of pages with their settings and items */
  pages: PropTypes.arrayOf(
    PropTypes.shape({}),
  ),
  /** General report settings such as layout size and background color */
  settings: PropTypes.shape({}),
};

Print.defaultProps = {
  acceptedItems: {},
  additionalPageItems: [],
  itemAccessor: () => {},
  pages: [],
  settings: {},
};

export default Print;
