import { useState } from 'react';
import PropTypes from 'prop-types';
import { pageSize } from '../../utils/print';
import { usePropStore } from '../../contexts/PropContext';

const availableFormats = ['A4', 'A5', 'Custom', 'Web'];

const PrintWrapper = ({ children }) => {
  const settings = usePropStore(state => state.settings);
  const [manipulatePageSize, setManipulatePageSize] = useState(false);
  const reportLayout = settings.reportLayout ? settings.reportLayout : 'A4 Landscape';
  if (availableFormats.indexOf(reportLayout.split(' ')[0]) > -1 && !manipulatePageSize) {
    setManipulatePageSize(true);
  }

  return (
    <>
      {manipulatePageSize && (
        <style
          dangerouslySetInnerHTML={{
            __html: `
            @page {
              size: ${pageSize(settings)}; margin:0;
            }`,
          }}
        />
      )}
      {children}
    </>
  );
};

PrintWrapper.propTypes = {
  children: PropTypes.node.isRequired,
};

export default PrintWrapper;
