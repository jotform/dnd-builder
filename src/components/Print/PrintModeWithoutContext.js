import { useState } from 'react';
import ReportWrapper from '../ReportWrapper';
import StaticScene from '../Preview/StaticScene';
import { pageSize } from '../../utils/print';
import { usePropStore } from '../../contexts/PropContext';

const availableFormats = ['A4', 'A5', 'Custom', 'Web'];

const PrintModeWithoutContext = () => {
  const settings = usePropStore(state => state.settings);
  const theme = usePropStore(state => state.theme);
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
        theme={theme}
      >
        <StaticScene
          hideZoom={true}
          mode="print"
        />
      </ReportWrapper>
    </>
  );
};

export default PrintModeWithoutContext;
