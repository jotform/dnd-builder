import React from 'react';
import Presentation from '../../../components/Presentation/Presentation';
import PresentationWrapper from '../../../components/Presentation/PresentationWrapper';
import ReportWrapper from '../../../components/ReportWrapper';
import PrintModal from '../../../components/Print/PrintModal';
import Providers from '../../../contexts/Providers';

describe('Presentation Component Tree', () => {
  const presentation = shallow(<Presentation />);
  it('Should Always Render Providers in Presentation', () => {
    expect(presentation.find(Providers)).toHaveLength(1);
  });

  it('Should Always Render ReportWrapper in Presentation', () => {
    expect(presentation.find(ReportWrapper)).toHaveLength(1);
  });

  it('Should Always Render PrintModal in Presentation', () => {
    expect(presentation.find(PrintModal)).toHaveLength(1);
  });

  it('ReportWrapper contains PresentationWrapper and PrintModal', () => {
    expect(presentation.find(PresentationWrapper).parent().is(ReportWrapper)).toEqual(true);
    expect(presentation.find(PrintModal).parent().is(ReportWrapper)).toEqual(true);
  });
});
