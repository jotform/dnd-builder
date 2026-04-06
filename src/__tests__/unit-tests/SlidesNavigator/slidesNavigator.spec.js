import React from 'react';
import { flushSync } from 'react-dom';
import SlidesNavigator from '../../../components/Panels/SlidesNavigator/SlidesNavigator';
import SlideItemMoreMenu from '../../../components/Panels/SlidesNavigator/MoreMenu/SlideItemMoreMenu';
import { mountWithProviders } from '../../../__test_helpers__/utils';

const mockPages = [
  { id: 'page-1', order: 1, items: [] },
  { id: 'page-2', order: 2, items: [] },
  { id: 'page-3', order: 3, items: [] },
];

const mockEvent = {
  clientX: 100,
  clientY: 100,
  preventDefault: jest.fn(),
  target: { getBoundingClientRect: () => ({ left: 0, top: 0 }) },
};

beforeAll(() => {
  window.IntersectionObserver = jest.fn(() => ({
    disconnect: jest.fn(),
    observe: jest.fn(),
    unobserve: jest.fn(),
  }));
});

describe('SlidesNavigator', () => {
  it('Should render when isSlidesNavigatorOpen is true', () => {
    const wrapper = mountWithProviders(
      <SlidesNavigator />,
      {
        builderProps: { isSlidesNavigatorOpen: true, visiblePageOrder: 1 },
        propProps: { pages: mockPages },
      },
    );
    expect(wrapper.find('.slides-navigator').exists()).toBe(true);
  });

  it('Should not render when isSlidesNavigatorOpen is false', () => {
    const wrapper = mountWithProviders(
      <SlidesNavigator />,
      {
        builderProps: { isSlidesNavigatorOpen: false, visiblePageOrder: 1 },
        propProps: { pages: mockPages },
      },
    );
    expect(wrapper.find('.slides-navigator').exists()).toBe(false);
  });

  it('Should call onPageAdd with visiblePageOrder + 1 on add button click', () => {
    const onPageAdd = jest.fn();
    const wrapper = mountWithProviders(
      <SlidesNavigator />,
      {
        builderProps: { isSlidesNavigatorOpen: true },
        propProps: { pages: mockPages, onPageAdd },
      },
    );
    wrapper.find('.slides-navigator-add-item').simulate('click');
    expect(onPageAdd).toHaveBeenCalledWith(2);
  });
});

describe('SlideItemMoreMenu Actions', () => {
  const mountMenu = (overrides = {}) => {
    const onPageAdd = jest.fn();
    const onPageRemove = jest.fn();
    const onPageDuplicate = jest.fn();
    const onAnEventTrigger = jest.fn();
    const ref = React.createRef();

    const wrapper = mountWithProviders(
      <SlideItemMoreMenu
        ref={ref}
        order={2}
        page={mockPages[1]}
      />,
      {
        builderProps: { visiblePageOrder: 2 },
        propProps: {
          onAnEventTrigger,
          onPageAdd,
          onPageDuplicate,
          onPageRemove,
          pages: mockPages,
          ...overrides,
        },
      },
    );

    flushSync(() => {
      ref.current.handleOpenMenu(mockEvent);
    });
    wrapper.update();

    return {
      onAnEventTrigger, onPageAdd, onPageDuplicate, onPageRemove, wrapper,
    };
  };

  it('Should call onPageAdd with order + 1 on add new slide', () => {
    const { onPageAdd } = mountMenu();
    document.querySelector('#add_new_slide').click();
    expect(onPageAdd).toHaveBeenCalledWith(3);
  });

  it('Should call onPageDuplicate with page on duplicate slide', () => {
    const { onPageDuplicate } = mountMenu();
    document.querySelector('#duplicate_slide').click();
    expect(onPageDuplicate).toHaveBeenCalledWith(mockPages[1]);
  });

  it('Should call onPageRemove with page id on delete slide', () => {
    const { onPageRemove } = mountMenu();
    document.querySelector('#delete_slide').click();
    expect(onPageRemove).toHaveBeenCalledWith('page-2');
  });
});
