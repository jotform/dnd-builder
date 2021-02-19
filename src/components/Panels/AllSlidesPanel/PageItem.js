import React, { memo } from 'react';
import { SortableElement } from 'react-sortable-hoc';
import classNames from 'classnames';
import StaticPage from '../../Preview/StaticPage';
import PageThumbnailActions from './PageThumbnailActions';

const PageItem = SortableElement(({
  acceptedItems,
  additionalPageItems,
  hashCode,
  isSelected,
  itemAccessor,
  onAnEventTrigger,
  onPageAdd,
  onPageClick,
  onPageDuplicate,
  onPageRemove,
  order,
  page,
  style,
}) => {
  const onKeyDown = f => f;
  return (
    <div
      className={(
        classNames('thumbnailWrapper d-flex dir-col a-center j-center p-relative', { isSelected })
      )}
      data-id={page.id}
      data-order={order}
      onClick={onPageClick}
      onKeyDown={onKeyDown}
    >
      <div className="thumbnailOrder">{order}</div>
      <div className="thumbnailFrame o-hidden">
        <StaticPage
          acceptedItems={acceptedItems}
          additionalPageItems={additionalPageItems}
          hashCode={hashCode}
          itemAccessor={itemAccessor}
          items={page.items}
          style={style}
        />
      </div>
      <PageThumbnailActions
        onAnEventTrigger={onAnEventTrigger}
        onPageAdd={onPageAdd}
        onPageDuplicate={onPageDuplicate}
        onPageRemove={onPageRemove}
        order={order}
        page={page}
      />
    </div>
  );
});

export default memo(PageItem);
