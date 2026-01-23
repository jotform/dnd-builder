import { string } from 'prop-types';
import classNames from 'classnames';
import { scrollToTarget } from '../../utils/functions';
import { useTranslatedTexts } from '../../utils/hooks';
import { usePropStore } from '../../contexts/PropContext';
import { useIcons } from '../../hooks/useIcons';

const PageAdder = ({
  additionalClass = '',
}) => {
  const pageCount = usePropStore(state => state.pages.length);
  const onPageAdd = usePropStore(state => state.onPageAdd);
  const onPageAddClick = () => {
    const newPageIndex = pageCount + 1;
    onPageAdd(newPageIndex);
    scrollToTarget(`pageActions-id-${newPageIndex}`, 350);
  };

  const { ADD_NEW_PAGE } = useTranslatedTexts();
  const { plus: PlusIcon } = useIcons();
  return (
    <button
      className={classNames('pageAdder', additionalClass)}
      onClick={onPageAddClick}
      type="button"
    >
      <PlusIcon className="jfReportSVG icon-plus" />
      <span>{ADD_NEW_PAGE}</span>
    </button>
  );
};

PageAdder.propTypes = {
  additionalClass: string,
};

export default PageAdder;
