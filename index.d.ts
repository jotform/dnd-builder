import { ComponentType, ReactNode, FC, SVGProps } from 'react';

// ============================================================================
// Common Types
// ============================================================================

export type Theme = 'lightMode' | 'darkMode';
export type Mode = 'customize' | 'preview' | 'print' | 'presentation';

export interface Position {
  left: number;
  top: number;
}

export interface Dimensions {
  height: number;
  width: number;
}

export interface ItemBase extends Position, Dimensions {
  id: string;
  pageID: string;
  itemType: string;
  isLocked?: boolean;
  opacity?: number;
}

export interface PageItem extends ItemBase {
  [key: string]: unknown;
}

export interface Page {
  id: string;
  order: number;
  items: PageItem[];
  backgroundColor?: string;
  [key: string]: unknown;
}

export interface ReportSettings {
  reportLayoutWidth?: number;
  reportLayoutHeight?: number;
  reportBackgroundColor?: string;
  reportPageTransition?: 'noAnimation' | 'horizontalSlide' | 'verticalSlide' | 'scaleAndSlide' | 'scaleAndFade';
  [key: string]: unknown;
}

// ============================================================================
// Left Panel Config
// ============================================================================

export interface LeftPanelElement {
  itemType: string;
  title: string;
}

export interface LeftPanelSection {
  title: string;
  elements: LeftPanelElement[];
}

export type LeftPanelConfig = LeftPanelSection[];

// ============================================================================
// Accepted Items
// ============================================================================

export interface ElementSetting {
  key: string;
  label?: string;
  section: string;
  type: string;
  options?: unknown[];
  range?: [number, number];
  showWhen?: Record<string, unknown>;
  hideWhen?: Record<string, unknown>;
  [key: string]: unknown;
}

export interface ElementDetails {
  itemType: string;
  height: number;
  width: number;
  [key: string]: unknown;
}

export interface AcceptedItem<T = unknown> {
  Component: ComponentType<{ item: T; isSelected?: boolean; onItemChange?: ItemChangeHandler }>;
  itemType: string;
  settings: ElementSetting[];
  details: ElementDetails;
  defaultItem?: Partial<T>;
}

export type AcceptedItems = Record<string, AcceptedItem>;

// ============================================================================
// Event Handlers
// ============================================================================

export type ItemChangeHandler = (
  identifier: { id: string },
  changes: Partial<PageItem>
) => void;

export type ItemMoveHandler = (
  identifier: { id: string },
  position: Position & { pageID: string }
) => void;

export type ItemResizeHandler = (
  identifier: { id: string },
  dimensions: Position & Dimensions & { pageID: string }
) => void;

export type ItemAddHandler = (item: PageItem) => void;
export type ItemRemoveHandler = (item: PageItem) => void;
export type ItemsMoveHandler = (items: PageItem[]) => void;

export type PageAddHandler = () => void;
export type PageRemoveHandler = (pageID: string) => void;
export type PageChangeHandler = (pageID: string, changes: Partial<Page>) => void;
export type PageDuplicateHandler = (pageID: string) => void;
export type PageOrdersChangeHandler = (pageOrders: { id: string; order: number }[]) => void;

export type SettingChangeHandler = (changes: Partial<ReportSettings>) => void;
export type EventTriggerHandler = (eventName: string, itemType?: string) => void;
export type RightPanelsToggledHandler = (isOpen: boolean) => void;

export type ItemAccessor = (item: PageItem) => Record<string, unknown> | undefined;

// ============================================================================
// Presentation Bar Actions
// ============================================================================

export interface PresentationBarAction {
  icon?: ReactNode;
  label?: string;
  onClick?: () => void;
  [key: string]: unknown;
}

// ============================================================================
// Component Props
// ============================================================================

export interface CommonProps {
  /** Items for to render in the report */
  acceptedItems?: AcceptedItems;
  /** Array of React components to render statically on each page (eg. watermark) */
  additionalPageItems?: ReactNode[];
  /** To pass in extra props to items selectively */
  itemAccessor?: ItemAccessor;
  /** To track and log user actions */
  onAnEventTrigger?: EventTriggerHandler;
  /** Array of pages with their settings and items */
  pages?: Page[];
  /** General report settings such as layout size and background color */
  settings?: ReportSettings;
  /** Theme */
  theme?: Theme;
}

export interface BuilderProps extends CommonProps {
  /** Array of strings representing item types that should have disabled interaction */
  disableInteraction?: string[];
  /** Last scroll position */
  lastScrollPosition?: number;
  /** Configuration for the left panel elements */
  leftPanelConfig?: LeftPanelConfig;
  /** Function called upon adding an item */
  onItemAdd?: ItemAddHandler;
  /** Function called upon editing an item */
  onItemChange?: ItemChangeHandler;
  /** Function called upon moving an item */
  onItemMove?: ItemMoveHandler;
  /** Function called upon removing an item */
  onItemRemove?: ItemRemoveHandler;
  /** Function called upon resizing an item */
  onItemResize?: ItemResizeHandler;
  /** Function called upon moving multiple items */
  onItemsMove?: ItemsMoveHandler;
  /** Function called upon adding a page */
  onPageAdd?: PageAddHandler;
  /** Function called upon editing a page */
  onPageChange?: PageChangeHandler;
  /** Function called upon duplicating a page */
  onPageDuplicate?: PageDuplicateHandler;
  /** Function called upon reordering pages */
  onPageOrdersChange?: PageOrdersChangeHandler;
  /** Function called upon removing a page */
  onPageRemove?: PageRemoveHandler;
  /** Function called when the slides or the right panel is toggled */
  onRightPanelsToggled?: RightPanelsToggledHandler;
  /** Function called upon editing a general report setting */
  onSettingChange?: SettingChangeHandler;
  /** Enable experimental features */
  useExperimentalFeatures?: boolean;
}

export interface PreviewProps extends CommonProps {}

export interface PrintProps extends CommonProps {}

export interface PresentationProps extends CommonProps {
  /** To pass in action definitions that will be rendered as buttons */
  presentationBarActions?: PresentationBarAction[];
  /** Flag for fixed action bar */
  useFixedPresentationBar?: boolean;
}

export interface ReportProps extends BuilderProps, PresentationProps {
  /** Conditionally rendering different modes */
  mode?: Mode;
  /** Texts used in the library - can be changed or translated */
  reportsAppTexts?: ReportsAppTexts;
}

// ============================================================================
// Element Item Types
// ============================================================================

export interface RichTextItem extends ItemBase {
  itemType: 'text';
  fontFamily?: string;
  value?: string;
}

export interface ImageItem extends ItemBase {
  itemType: 'image';
  url?: string;
  defaultURL?: string;
  roundedCorners?: number;
}

export interface ShapeItem extends ItemBase {
  itemType: 'shapes';
  shapeType?: 'rectangle' | 'ellipse' | 'line' | 'triangle' | 'star';
  shapeFillColor?: string;
  shapeFillShow?: 'on' | 'off';
  shapeBorderColor?: string;
  shapeBorderShow?: 'on' | 'off';
  shapeBorderWidth?: string;
  roundedCorners?: number;
  lineType?: 'solid' | 'dashed' | 'dotted';
  lineSize?: 'thin' | 'medium' | 'thick';
  lineDirection?: 'horizontal' | 'vertical';
}

export interface ChartItem extends ItemBase {
  itemType: 'graphic';
  chartType?: 'pie' | 'column';
}

export interface IconItem extends ItemBase {
  itemType: 'icon';
  iconType?: string;
  iconFillColor?: string;
}

// ============================================================================
// Element Components
// ============================================================================

export interface RichTextElementProps {
  item?: RichTextItem;
  isSelected?: boolean;
  onItemChange?: ItemChangeHandler;
}

export interface ImageElementProps {
  item?: ImageItem;
  itemAccessor?: ItemAccessor;
}

export interface ShapeElementProps {
  item?: ShapeItem;
}

export interface ChartElementProps {
  item?: ChartItem;
}

export interface IconElementProps {
  item?: IconItem;
}

// ============================================================================
// Texts
// ============================================================================

export interface ReportsAppTexts {
  ADD_ELEMENT?: string;
  ADD_LINK?: string;
  ADD_NEW_PAGE?: string;
  BACKGROUND_COLOR?: string;
  CHART_ELEMENT?: string;
  CHART_SETTINGS?: string;
  CLICK_TO_EDIT_HEADER?: string;
  CLICK_TO_EDIT_TEXT?: string;
  DATACARD_SETTINGS?: string;
  DELETE?: string;
  DELETE_ITEM?: string;
  DUPLICATE_ITEM?: string;
  DUPLICATE_PAGE?: string;
  ELEMENTS?: string;
  FIT_TO_PAGE?: string;
  FIT_TO_SCENE?: string;
  GENERAL?: string;
  GRID_SETTINGS?: string;
  HEADER_SETTINGS?: string;
  HEIGHT?: string;
  ICON_SETTINGS?: string;
  IMAGE_SETTINGS?: string;
  ITEM_SETTINGS?: string;
  LAYERS?: string;
  LAYOUT_SETTINGS?: string;
  LOCK_ITEM?: string;
  MOVE_BACKWARDS?: string;
  MOVE_FORWARDS?: string;
  MOVE_PAGE_DOWNWARDS?: string;
  MOVE_PAGE_UPWARDS?: string;
  MOVE_TO_BACK?: string;
  MOVE_TO_FRONT?: string;
  NO_ELEMENT_IN_PAGE?: string;
  NO_RESULT?: string;
  ORIGINAL_SIZE?: string;
  PAGE_ELEMENT?: string;
  PAGE_SETTINGS?: string;
  PAGE_STYLE?: string;
  RECTANGLE?: string;
  REMOVE_PAGE?: string;
  SEARCH?: string;
  SETTINGS?: string;
  SHOW_ALL?: string;
  SLIDES?: string;
  TEXT_SETTINGS?: string;
  TOGGLE_OFF?: string;
  TOGGLE_ON?: string;
  UNLOCK_ITEM?: string;
  WIDTH?: string;
  ZOOM_IN?: string;
  ZOOM_OUT?: string;
  [key: string]: string | undefined;
}

// ============================================================================
// Layout & Page Settings
// ============================================================================

export interface LayoutSettings {
  itemType: string;
  settings: ElementSetting[];
}

export interface PageSettings {
  itemType: string;
  settings: ElementSetting[];
}

// ============================================================================
// Report Icons
// ============================================================================

export interface ReportIconsType {
  [key: string]: FC<SVGProps<SVGSVGElement>>;
}

// ============================================================================
// Exported Components
// ============================================================================

declare const Builder: FC<BuilderProps>;
declare const Preview: FC<PreviewProps>;
declare const Print: FC<PrintProps>;
declare const Presentation: FC<PresentationProps>;
declare const Report: FC<ReportProps>;

// ============================================================================
// Exported Elements
// ============================================================================

declare const RichText: AcceptedItem<RichTextItem>;
declare const Image: AcceptedItem<ImageItem>;
declare const Shapes: AcceptedItem<ShapeItem>;
declare const Chart: AcceptedItem<ChartItem>;
declare const Icon: AcceptedItem<IconItem>;
declare const StaticRichText: AcceptedItem<RichTextItem>;

// ============================================================================
// Exported Utilities
// ============================================================================

declare function generateId(length?: number): string;

// ============================================================================
// Exported Constants
// ============================================================================

declare const Layout: LayoutSettings;
declare const Page: PageSettings;
declare const ReportIcons: ReportIconsType;
declare const reportsAppTexts: ReportsAppTexts;

// ============================================================================
// Exports
// ============================================================================

export {
  Builder,
  Preview,
  Print,
  Presentation,
  Report,
  RichText,
  Image,
  Shapes,
  Chart,
  Icon,
  StaticRichText,
  generateId,
  Layout,
  Page,
  ReportIcons,
  reportsAppTexts,
};

export default Report;
