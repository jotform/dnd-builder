import { useState } from 'react';
import PropTypes from 'prop-types';
import ReportWrapper from '../ReportWrapper';
import StaticScene from '../Preview/StaticScene';
import { pageSize } from '../../utils/print';

const availableFormats = ['A4', 'A5'];

const PrintModeWithoutContext = ({
  additionalPageItems,
  hashCode,
  itemAccessor,
  mode,
  pages,
  settings,
}) => {
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
      <ReportWrapper
        mode="print"
      >
        <StaticScene
          additionalPageItems={additionalPageItems}
          hashCode={hashCode}
          hideZoom={true}
          itemAccessor={itemAccessor}
          mode={mode}
          pages={pages}
        />
      </ReportWrapper>
    </>
  );
};

PrintModeWithoutContext.propTypes = {
  additionalPageItems: PropTypes.arrayOf(PropTypes.node),
  hashCode: PropTypes.string,
  itemAccessor: PropTypes.func,
  mode: PropTypes.string,
  pages: PropTypes.arrayOf(
    PropTypes.shape({}),
  ),
  settings: PropTypes.shape({
    reportLayout: PropTypes.string,
    reportLayoutHeight: PropTypes.string,
    reportLayoutWidth: PropTypes.string,
  }),
};

PrintModeWithoutContext.defaultProps = {
  additionalPageItems: [],
  hashCode: '',
  itemAccessor: () => {},
  mode: 'print',
  pages: [],
  settings: {},
};

export default PrintModeWithoutContext;
