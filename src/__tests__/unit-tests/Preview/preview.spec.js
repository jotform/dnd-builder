import React from 'react';
import Preview from '../../../components/Preview';
import { BuilderProvider } from '../../../utils/builderContext';
import { PropProvider } from '../../../utils/propContext';
import ReportWrapper from '../../../components/ReportWrapper';
import StaticScene from '../../../components/Preview/StaticScene';

describe('Preview Component Tree', () => {
  const preview = shallow(<Preview />);

  it('Should Always Render BuilderProvider in Preview', () => {
    expect(preview.find(BuilderProvider)).toHaveLength(1);
  });

  it('Should Always Render PropProvider in Preview', () => {
    expect(preview.find(PropProvider)).toHaveLength(1);
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
