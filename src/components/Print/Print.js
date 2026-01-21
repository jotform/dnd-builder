import Modal from 'react-modal';
import PrintModeWithoutContext from './PrintModeWithoutContext';

const Print = () => {
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
      <PrintModeWithoutContext />
    </Modal>
  );
};

export default Print;
