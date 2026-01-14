import { func, number, string } from 'prop-types';
import classNames from 'classnames';
import { scrollToTarget } from '../../utils/functions';
import * as icons from '../../utils/icons';
import { useTranslatedTexts } from '../../utils/hooks';

const PageAdder = ({
  additionalClass = '',
  onPageAdd = () => {},
  pageCount = 1,
}) => {
  const onPageAddClick = () => {
    const newPageIndex = pageCount + 1;
    onPageAdd(newPageIndex);
    scrollToTarget(`pageActions-id-${newPageIndex}`, 350);
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
  onPageAdd: func,
  pageCount: number,
};

export default PageAdder;
