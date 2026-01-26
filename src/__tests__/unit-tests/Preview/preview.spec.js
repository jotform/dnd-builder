import React from 'react';
import Preview from '../../../components/Preview';
import ReportWrapper from '../../../components/ReportWrapper';
import StaticScene from '../../../components/Preview/StaticScene';
import Providers from '../../../contexts/Providers';

describe('Preview Component Tree', () => {
  const preview = shallow(<Preview />);

  it('Should Always Render Providers in Preview', () => {
    expect(preview.find(Providers)).toHaveLength(1);
  });

  it('Should Always Render ReportWrapper in Preview', () => {
    expect(preview.find(ReportWrapper)).toHaveLength(1);
  });

  it('Should Always Render StaticScene in Preview', () => {
    expect(preview.find(StaticScene)).toHaveLength(1);
  });

  it('ReportWrapper contains StaticScene ', () => {
    expect(preview.find(StaticScene).parent().is(ReportWrapper)).toEqual(true);
  });
});
