import React from 'react';
import DndWrapper from '../../../components/Builder/DndWrapper';
import Builder from '../../../components/Builder';
import LeftPanel from '../../../components/Panels/LeftPanel';
import Scene from '../../../components/Builder/Scene';
import RightPanel from '../../../components/Panels/RightPanel';
import SlidesPanel from '../../../components/Panels/SlidesPanel';
import SlidesNavigator from '../../../components/Panels/SlidesNavigator/SlidesNavigator';
import BuilderWrapper from '../../../components/Builder/BuilderWrapper';
import Providers from '../../../contexts/Providers';
import { mountWithProviders } from '../../../__test_helpers__/utils';

beforeAll(() => {
  window.IntersectionObserver = jest.fn(() => ({
    disconnect: jest.fn(),
    observe: jest.fn(),
    unobserve: jest.fn(),
  }));
});

describe('Builder Component Tree', () => {
  const builderWrapper = shallow(<Builder />);

  it('Should Always Render Providers in Builder', () => {
    expect(builderWrapper.find(Providers)).toHaveLength(1);
  });

  it('Should Always Render ReportWrapper in Builder', () => {
    expect(builderWrapper.find(BuilderWrapper)).toHaveLength(1);
  });

  it('Should Always Render DndProvider in Builder', () => {
    expect(builderWrapper.find(DndWrapper)).toHaveLength(1);
  });

  it('Should Always Render LeftPanel in Builder', () => {
    expect(builderWrapper.find(LeftPanel)).toHaveLength(1);
  });

  it('Should Always Render Scene in Builder', () => {
    expect(builderWrapper.find(Scene)).toHaveLength(1);
  });

  it('Should Always Render RightPanel in Builder', () => {
    expect(builderWrapper.find(RightPanel)).toHaveLength(1);
  });

  it('Should Always Render SlidesPanel in Builder', () => {
    expect(builderWrapper.find(SlidesPanel)).toHaveLength(1);
  });

  it('ReportWrapper contains DndProvider', () => {
    expect(builderWrapper.find(DndWrapper).parent().is(BuilderWrapper)).toEqual(true);
  });

  it('DndProvider contains Scene, RightPanel, LeftPanel, SlidesPanel', () => {
    expect(builderWrapper.find(Scene).parent().is(DndWrapper)).toEqual(true);
    expect(builderWrapper.find(RightPanel).parent().is(DndWrapper)).toEqual(false);
    expect(builderWrapper.find(LeftPanel).parent().is(DndWrapper)).toEqual(true);
    expect(builderWrapper.find(SlidesPanel).parent().is(DndWrapper)).toEqual(false);
  });

  it('Should Render SlidesNavigator in BuilderWrapper when slidesListType is NAVIGATOR', () => {
    const wrapper = mountWithProviders(
      <BuilderWrapper><div /></BuilderWrapper>,
      {
        builderProps: { slidesListType: 'NAVIGATOR' },
        propProps: { pages: [] },
      },
    );
    expect(wrapper.find(SlidesNavigator)).toHaveLength(1);
  });

  it('Should Not Render SlidesNavigator when slidesListType is PANEL', () => {
    const wrapper = mountWithProviders(
      <BuilderWrapper><div /></BuilderWrapper>,
      {
        builderProps: { slidesListType: 'PANEL' },
        propProps: { pages: [] },
      },
    );
    expect(wrapper.find(SlidesNavigator)).toHaveLength(0);
  });
});
