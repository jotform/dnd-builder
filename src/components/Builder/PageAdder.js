import PropTypes from 'prop-types';
import { scrollToTarget } from '../../utils/functions';
import * as icons from '../../utils/icons';
import { useTranslatedTexts } from '../../utils/hooks';

const PageAdder = ({
  onPageAdd,
  pageCount,
}) => {
  const onPageAddClick = () => {
    const newPageIndex = pageCount + 1;
    onPageAdd(newPageIndex);
    scrollToTarget(`pageActions-id-${newPageIndex}`, 350);
  };

  const { ADD_NEW_PAGE } = useTranslatedTexts();
  return (
    <button
      className="pageAdder forOptions"
      onClick={onPageAddClick}
      type="button"
    >
      <icons.plus className="jfReportSVG icon-plus" />
      <span>{ADD_NEW_PAGE}</span>
    </button>
  );
};

PageAdder.propTypes = {
  onPageAdd: PropTypes.func,
  pageCount: PropTypes.number,
};

PageAdder.defaultProps = {
  onPageAdd: () => {},
  pageCount: 1,
};

export default PageAdder;
