import React from 'react';
import DndWrapper from '../../../components/Builder/DndWrapper';
import Builder from '../../../components/Builder';
import LeftPanel from '../../../components/Panels/LeftPanel';
import Scene from '../../../components/Builder/Scene';
import RightPanel from '../../../components/Panels/RightPanel';
import SlidesPanel from '../../../components/Panels/SlidesPanel';
import AllSlidesPanel from '../../../components/Panels/AllSlidesPanel';
import BuilderWrapper from '../../../components/Builder/BuilderWrapper';
import Providers from '../../../contexts/Providers';

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

  it('Should Always Render AllSlidesPanel in Builder', () => {
    expect(builderWrapper.find(AllSlidesPanel)).toHaveLength(0);
  });

  it('ReportWrapper contains DndProvider', () => {
    expect(builderWrapper.find(DndWrapper).parent().is(BuilderWrapper)).toEqual(true);
  });

  it('DndProvider contains Scene, RightPanel, LeftPanel, SlidesPanel', () => {
    expect(builderWrapper.find(Scene).parent().is(DndWrapper)).toEqual(true);
    expect(builderWrapper.find(RightPanel).parent().is(DndWrapper)).toEqual(false);
    expect(builderWrapper.find(LeftPanel).parent().is(DndWrapper)).toEqual(true);
    expect(builderWrapper.find(SlidesPanel).parent().is(DndWrapper)).toEqual(false);
    builderWrapper.setProps({ useExperimentalFeatures: true });
    expect(builderWrapper.find(AllSlidesPanel).parent().is(DndWrapper)).toEqual(false);
  });
});
