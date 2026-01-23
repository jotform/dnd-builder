// General //
import down from '../assets/svg/arrow_down.svg';
import drag from '../assets/svg/settings/drag.svg';
import trash from '../assets/svg/trash.svg';
import close from '../assets/svg/close.svg';
import rotate from '../assets/svg/rotate.svg';
import customize from '../assets/svg/customize.svg';
import slides from '../assets/svg/slides.svg';
import allSlides from '../assets/svg/all_slides.svg';
import settingsToggle from '../assets/svg/settings_toggle.svg';

// Elements //
import header from '../assets/svg/toolbox/header.svg';
import icon from '../assets/svg/toolbox/icon.svg';
import image from '../assets/svg/toolbox/image.svg';
import label from '../assets/svg/toolbox/label.svg';
import shapes from '../assets/svg/toolbox/shapes.svg';
import table from '../assets/svg/toolbox/table.svg';
import textElement from '../assets/svg/toolbox/text_element.svg';
import text from '../assets/svg/toolbox/text.svg';
import star from '../assets/svg/toolbox/star.svg';
import email from '../assets/svg/toolbox/email.svg';
import singleChoice from '../assets/svg/toolbox/single_choice.svg';
import multipleChoice from '../assets/svg/toolbox/multiple_choice.svg';
import lock from '../assets/svg/settings/lock.svg';
import unlock from '../assets/svg/settings/unlock.svg';

// Settings //
import bold from '../assets/svg/settings/font_bold.svg';
import italic from '../assets/svg/settings/font_italic.svg';
import underline from '../assets/svg/settings/font_underline.svg';
import alignLeft from '../assets/svg/settings/align_left.svg';
import alignCenter from '../assets/svg/settings/align_center.svg';
import alignRight from '../assets/svg/settings/align_right.svg';

// Chart Settings //
import pie from '../assets/svg/settings/chart_pie.svg';
import bar from '../assets/svg/settings/chart_bar.svg';
import line from '../assets/svg/settings/chart_line.svg';
import basic from '../assets/svg/settings/chart_basic.svg';
import donut from '../assets/svg/settings/chart_donut.svg';
import grid from '../assets/svg/settings/chart_grid.svg';
import textGrid from '../assets/svg/settings/chart_textGrid.svg';
import column from '../assets/svg/settings/chart_column.svg';
import layout from '../assets/svg/settings/layout.svg';
import starRating from '../assets/svg/star_rating.svg';
import heartRating from '../assets/svg/heart_rating.svg';

// Shape Settings //
import rectangleIcon from '../assets/svg/settings/rectangle.svg';
import ellipseIcon from '../assets/svg/settings/ellipse.svg';
import triangleIcon from '../assets/svg/settings/triangle.svg';
import starIcon from '../assets/svg/settings/star.svg';
import lineIcon from '../assets/svg/settings/line.svg';

// Element Menu //
import duplicate from '../assets/svg/duplicate.svg';
import settings from '../assets/svg/settings.svg';

// Page Menu //
import arrowUp from '../assets/svg/arrow_up.svg';
import arrowLeft from '../assets/svg/arrow_left.svg';
import arrowRight from '../assets/svg/arrow_right.svg';
import duplicateLine from '../assets/svg/page-actions/duplicate_line.svg';
import plus from '../assets/svg/plus.svg';
import minus from '../assets/svg/minus.svg';
import trashLine from '../assets/svg/page-actions/trash_line.svg';
import pageSettings from '../assets/svg/page_settings.svg';

// Context Menu //
import moveToFront from '../assets/svg/contextmenu/moveToFront.svg';
import moveToForward from '../assets/svg/contextmenu/moveToForward.svg';
import moveToBackward from '../assets/svg/contextmenu/moveToBackward.svg';
import moveToBack from '../assets/svg/contextmenu/moveToBack.svg';

// Presentation //
import print from '../assets/svg/presentation/print.svg';
import download from '../assets/svg/presentation/download.svg';
import play from '../assets/svg/presentation/play.svg';
import enterFullscreen from '../assets/svg/presentation/enter_fullscreen.svg';
import exitFullscreen from '../assets/svg/presentation/exit_fullscreen.svg';
import pause from '../assets/svg/presentation/pause.svg';
import share from '../assets/svg/presentation/share.svg';
import attachment from '../assets/svg/presentation/attachment.svg';
import pen from '../assets/svg/presentation/pen.svg';

// Password Modal //
import key from '../assets/svg/presentation/key.svg';
import eye from '../assets/svg/presentation/eye.svg';

// Placeholder //
import piePlaceholder from '../assets/svg/placeholder/pie.svg';
import barPlaceholder from '../assets/svg/placeholder/bar.svg';
import columnPlaceholder from '../assets/svg/placeholder/column.svg';
import basicPlaceholder from '../assets/svg/placeholder/basic.svg';
import donutPlaceholder from '../assets/svg/placeholder/donut.svg';
import textGridPlaceholder from '../assets/svg/placeholder/grid.svg';

// Zoom //
import fit from '../assets/svg/fit_screen.svg';

// Loading //
import loadingCircle from '../assets/svg/loading_circle.svg';

export const ICONS = {
  CHART_SETTINGS: {
    bar,
    basic,
    column,
    donut,
    grid,
    heartRating,
    layout,
    line,
    pie,
    starRating,
    textGrid,
  },
  CONTEXT_MENU: {
    moveToBack,
    moveToBackward,
    moveToForward,
    moveToFront,
  },
  ELEMENT_MENU: {
    duplicate,
    settings,
  },
  ELEMENTS: {
    email,
    header,
    icon,
    image,
    label,
    lock,
    multipleChoice,
    shapes,
    singleChoice,
    star,
    table,
    text,
    textElement,
    unlock,
  },
  GENERAL: {
    allSlides,
    close,
    customize,
    down,
    drag,
    rotate,
    settingsToggle,
    slides,
    trash,
  },
  LOADING: {
    loadingCircle,
  },
  PAGE_MENU: {
    arrowDown: down,
    arrowLeft,
    arrowRight,
    arrowUp,
    duplicateLine,
    minus,
    pageSettings,
    plus,
    trashLine,
  },
  PASSWORD_MODAL: {
    eye,
    key,
  },
  PLACEHOLDER: {
    barPlaceholder,
    basicPlaceholder,
    columnPlaceholder,
    donutPlaceholder,
    linePlaceholder: barPlaceholder,
    piePlaceholder,
    textGridPlaceholder,
  },
  PRESENTATION: {
    attachment,
    download,
    enterFullscreen,
    exitFullscreen,
    pause,
    pen,
    play,
    print,
    share,
  },
  SETTINGS: {
    alignCenter,
    alignLeft,
    alignRight,
    bold,
    italic,
    underline,
  },
  SHAPE_SETTINGS: {
    ellipseIcon,
    lineIcon,
    rectangleIcon,
    starIcon,
    triangleIcon,
  },
  ZOOM: {
    fit,
  },
};
