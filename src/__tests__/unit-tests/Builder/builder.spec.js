import React from 'react';
import DndWrapper from '../../../components/Builder/DndWrapper';
import Builder from '../../../components/Builder';
import { BuilderProvider } from '../../../utils/builderContext';
import { PropProvider } from '../../../utils/propContext';
import ReportWrapper from '../../../components/ReportWrapper';
import LeftPanel from '../../../components/Panels/LeftPanel';
import Scene from '../../../components/Builder/Scene';
import RightPanel from '../../../components/Panels/RightPanel';
import SlidesPanel from '../../../components/Panels/SlidesPanel';
import AllSlidesPanel from '../../../components/Panels/AllSlidesPanel';

describe('Builder Component Tree', () => {
  const builderWrapper = shallow(<Builder {...Builder.defaultProps} />);

  it('Should Always Render BuilderProvider in Builder', () => {
    expect(builderWrapper.find(BuilderProvider)).toHaveLength(1);
  });

  it('Should Always Render PropProvider in Builder', () => {
    expect(builderWrapper.find(PropProvider)).toHaveLength(1);
  });

  it('Should Always Render ReportWrapper in Builder', () => {
    expect(builderWrapper.find(ReportWrapper)).toHaveLength(1);
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
    expect(builderWrapper.find(DndWrapper).parent().is(ReportWrapper)).toEqual(true);
  });

  it('DndProvider contains Scene, RightPanel, LeftPanel, SlidesPanel', () => {
    expect(builderWrapper.find(Scene).parent().is(DndWrapper)).toEqual(true);
    expect(builderWrapper.find(RightPanel).parent().is(DndWrapper)).toEqual(false);
    expect(builderWrapper.find(LeftPanel).parent().is(DndWrapper)).toEqual(true);
    expect(builderWrapper.find(SlidesPanel).parent().is(DndWrapper)).toEqual(false);
    builderWrapper.setProps({ ...Builder.defaultProps, useExperimentalFeatures: true });
    expect(builderWrapper.find(AllSlidesPanel).parent().is(DndWrapper)).toEqual(false);
  });
});
