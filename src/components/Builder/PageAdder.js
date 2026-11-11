import { string } from 'prop-types';
import classNames from 'classnames';
import * as icons from '../../utils/icons';
import { useScrollToPage, useTranslatedTexts } from '../../utils/hooks';
import { usePropStore } from '../../contexts/PropContext';

const PageAdder = ({
  additionalClass = '',
}) => {
  const pageCount = usePropStore(state => state.pages.length);
  const onPageAdd = usePropStore(state => state.onPageAdd);
  const scrollToPage = useScrollToPage();
  const onPageAddClick = () => {
    const newPageIndex = pageCount + 1;
    onPageAdd(newPageIndex);
    scrollToPage(newPageIndex, 350);
  };

  const { ADD_NEW_PAGE } = useTranslatedTexts();
  return (
    <button
      className={classNames('pageAdder', additionalClass)}
      onClick={onPageAddClick}
      type="button"
    >
      <icons.plus className="jfReportSVG icon-plus" />
      <span>{ADD_NEW_PAGE}</span>
    </button>
  );
};

PageAdder.propTypes = {
  additionalClass: string,
};

export default PageAdder;
