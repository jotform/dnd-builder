import {
  string, func, any, oneOfType, shape,
} from 'prop-types';
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';
import { useBuilderContext } from '../utils/builderContext';
import { usePresentationContext } from '../utils/presentationContext';

const withZoomPanPinchHOC = WrappedComponent => {
  const ZoomPanPinchHOC = props => {
    const { handleZoom, mode, refSetter } = props;

    const { zoom } = useBuilderContext();
    const { fittedZoom } = usePresentationContext();

    if (mode !== 'presentation') {
      return <WrappedComponent {...props} />;
    }

    return (
      <TransformWrapper
        ref={refSetter}
        centerOnInit={true}
        centerZoomedOut={true}
        disablePadding={true}
        doubleClick={{
          step: 0.2,
        }}
        initialScale={zoom}
        maxScale={2}
        minScale={0.5}
        onZoom={handleZoom}
        panning={{
          disabled: zoom <= fittedZoom,
        }}
        pinch={{
          step: 1,
        }}
      >
        <TransformComponent
          wrapperStyle={{ height: '100%', width: '100%' }}
        >
          <WrappedComponent {...props} />
        </TransformComponent>
      </TransformWrapper>
    );
  };

  ZoomPanPinchHOC.propTypes = {
    handleZoom: func.isRequired,
    mode: string,
    refSetter: oneOfType([
      func,
      shape({ current: any }),
    ]).isRequired,
  };

  ZoomPanPinchHOC.defaultProps = {
    mode: '',
  };

  return ZoomPanPinchHOC;
};

export default withZoomPanPinchHOC;
