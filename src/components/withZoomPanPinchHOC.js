import {
  string, func, any, oneOfType, shape,
} from 'prop-types';
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';
import { useBuilderContext } from '../contexts/BuilderContext';
import { usePresentationStore } from '../contexts/PresentationContext';

const withZoomPanPinchHOC = WrappedComponent => {
  const ZoomPanPinchHOC = props => {
    const { handleZoom, mode = '', refSetter } = props;

    const { zoom } = useBuilderContext();
    const fittedZoom = usePresentationStore(state => state.fittedZoom);

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
        wheel={{
          wheelDisabled: true,
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

  return ZoomPanPinchHOC;
};

export default withZoomPanPinchHOC;
