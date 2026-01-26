import Modal from 'react-modal';
import PrintWrapper from './PrintWrapper';
import ReportWrapper from '../ReportWrapper';
import StaticScene from '../Preview/StaticScene';

const PrintModal = () => {
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
      <PrintWrapper>
        <ReportWrapper mode="print">
          <StaticScene
            hideZoom={true}
            mode="print"
          />
        </ReportWrapper>
      </PrintWrapper>
    </Modal>
  );
};

export default PrintModal;
