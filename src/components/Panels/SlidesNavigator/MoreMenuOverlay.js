import { FloatingOverlay } from '@floating-ui/react';
import { useResizeListener } from '../../../utils/hooks';

const MoreMenuOverlay = () => {
  const viewportWidth = useResizeListener(true);
  const isMobile = viewportWidth > 0 && viewportWidth < 480;

  return (
    isMobile && (
      <FloatingOverlay
        className="jfSlidesMoreMenu-overlay"
        style={{
          backgroundColor: 'rgba(17, 24, 39, 0.6)',
          zIndex: 99998,
        }}
      />
    )
  );
};

export default MoreMenuOverlay;
