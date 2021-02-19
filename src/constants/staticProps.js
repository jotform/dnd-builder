const commonHorizontalSideProps = {
  cursor: 'ew-resize',
  height: 'calc(100% - 12px)',
  top: 6,
  width: 7,
};

const commonVerticalSideProps = {
  cursor: 'ns-resize',
  height: 7,
  left: 6,
  width: 'calc(100% - 12px)',
};

const commonEdgeProps = {
  height: 11,
  width: 11,
};

export const resizeStaticProps = {
  handleClasses: {
    bottom: 'reportHandle forLine',
    bottomLeft: 'reportHandle',
    bottomRight: 'reportHandle ',
    left: 'reportHandle forLine isVertical',
    right: 'reportHandle forLine isVertical',
    top: 'reportHandle forLine',
    topLeft: 'reportHandle',
    topRight: 'reportHandle',
  },
  handleStyles: {
    bottom: {
      ...commonVerticalSideProps,
      bottom: -4,
    },
    bottomLeft: {
      bottom: -6,
      ...commonEdgeProps,
      cursor: 'nesw-resize',
      left: -6,
    },
    bottomRight: {
      ...commonEdgeProps,
      bottom: -6,
      cursor: 'nwse-resize',
      right: -6,
    },
    left: {
      ...commonHorizontalSideProps,
      left: -4,
    },
    right: {
      ...commonHorizontalSideProps,
      right: -4,
    },
    top: {
      ...commonVerticalSideProps,
      top: -4,
    },
    topLeft: {
      ...commonEdgeProps,
      cursor: 'nwse-resize',
      left: -6,
      top: -6,
    },
    topRight: {
      ...commonEdgeProps,
      cursor: 'nesw-resize',
      right: -6,
      top: -6,
    },
  },
};
