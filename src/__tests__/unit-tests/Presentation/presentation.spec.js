import React from 'react';
import Presentation from '../../../components/Presentation/Presentation';
import { BuilderProvider } from '../../../utils/builderContext';
import { PropProvider } from '../../../utils/propContext';
import { PresentationProvider } from '../../../utils/presentationContext';
import PresentationWrapper from '../../../components/Presentation/PresentationWrapper';
import ReportWrapper from '../../../components/ReportWrapper';
import Print from '../../../components/Print';

describe('Presentation Component Tree', () => {
  const presentation = shallow(<Presentation {...Presentation.defaultProps} />);
  it('Should Always Render PresentationProvider in Presentation', () => {
    expect(presentation.find(PresentationProvider)).toHaveLength(1);
  });

  it('Should Always Render PropProvider in Presentation', () => {
    expect(presentation.find(PropProvider)).toHaveLength(1);
  });

  it('Should Always Render BuilderProvider in Presentation', () => {
    expect(presentation.find(BuilderProvider)).toHaveLength(1);
  });
  it('Should Always Render ReportWrapper in Presentation', () => {
    expect(presentation.find(ReportWrapper)).toHaveLength(1);
  });

  it('Should Always Render PresentationWrapper in Presentation', () => {
    expect(presentation.find(PresentationWrapper)).toHaveLength(1);
  });

  it('Should Always Render Print in Presentation', () => {
    expect(presentation.find(Print)).toHaveLength(1);
  });

  it('ReportWrapper contains PresentationWrapper and Print', () => {
    expect(presentation.find(PresentationWrapper).parent().is(ReportWrapper)).toEqual(true);
    expect(presentation.find(Print).parent().is(ReportWrapper)).toEqual(true);
  });
});
