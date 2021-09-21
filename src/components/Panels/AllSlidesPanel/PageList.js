import { memo, useRef } from 'react';
import { SortableContainer } from 'react-sortable-hoc';
import PageItem from './PageItem';
import { getScaleForPageThumbnailLarge } from '../../../utils/functions';
import PageAdder from '../../Builder/PageAdder';

const PageList = SortableContainer(({
  acceptedItems,
  additionalPageItems,
  hashCode,
  itemAccessor,
  layoutSettings,
  onAnEventTrigger,
  onPageAdd,
  onPageClick,
  onPageDuplicate,
  onPageRemove,
  pages,
  selectedPages,
}) => {
  const pageContainerStyles = useRef({});
  const {
    reportBackgroundColor,
    reportLayoutHeight = 794,
    reportLayoutWidth = 1123,
  } = layoutSettings;
  const width = parseInt(reportLayoutWidth, 10);
  const height = parseInt(reportLayoutHeight, 10);
  const scale = getScaleForPageThumbnailLarge(width, height);

  pageContainerStyles.current = {
    height: height,
    transform: `scale(${scale})`,
    transformOrigin: '0 0',
    width: width,
  };

  return (
    <ul className="jfReport-pageThumbnailList d-flex j-between f-wrap">
      {pages.map(page => {
        const { backgroundColor } = page;
        const style = {
          ...pageContainerStyles.current,
          backgroundColor: backgroundColor ? backgroundColor : reportBackgroundColor || '#fff',
        };
        return (
          <PageItem
            key={`item-${page.id}-${page.order}`}
            acceptedItems={acceptedItems}
            additionalPageItems={additionalPageItems}
            hashCode={hashCode}
            index={page.order - 1}
            isSelected={selectedPages.indexOf(page.id) > -1}
            itemAccessor={itemAccessor}
            onAnEventTrigger={onAnEventTrigger}
            onPageAdd={onPageAdd}
            onPageClick={onPageClick}
            onPageDuplicate={onPageDuplicate}
            onPageRemove={onPageRemove}
            order={page.order}
            page={page}
            style={style}
          />
        );
      })}
      <div className="thumbnailWrapper forPageAdder d-flex j-end dir-col">
        <PageAdder
          onPageAdd={onPageAdd}
          pageCount={pages.length}
        />
      </div>
      <div className="spacer" />
      <div className="spacer" />
      <div className="spacer" />
    </ul>
  );
});

export default memo(PageList);
