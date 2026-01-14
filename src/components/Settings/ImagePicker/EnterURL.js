import { useState } from 'react';
import PropTypes from 'prop-types';
import Textbox from '../Textbox';
import { useTranslatedTexts } from '../../../utils/hooks';

const imageRegex = new RegExp('jpg|jpeg|png|gif', 'i');

const EnterURL = ({
  item = '',
  onItemChange = () => {},
}) => {
  const [url, setUrl] = useState('');
  const [isErrored, setIsErrored] = useState(false);
  const { ADD_LINK } = useTranslatedTexts();

  const onURLChange = (_, v) => {
    if (isErrored) {
      setIsErrored(false);
    }
    setUrl(v.url);
  };

  const onSubmitURL = () => {
    setIsErrored(false);
    const extension = url.split('.').pop();
    if (imageRegex.test(extension)) {
      setIsErrored(false);
      onItemChange(
        { id: item.id },
        { url },
      );
    } else {
      setIsErrored(true);
    }
  };

  return (
    <div className="fileUploader-url">
      <Textbox
        config={{ key: 'url' }}
        itemID={item.id}
        onItemChange={onURLChange}
        placeholder="https://"
        value={url}
      />
      <button
        className="jfReportButton isSuccess"
        disabled={!url}
        onClick={onSubmitURL}
        type="button"
      >
        {ADD_LINK}
      </button>
      {isErrored && (
        <div
          className="uploadInfo isError"
          style={{
            color: '#ff0000',
            marginTop: '10px',
            textAlign: 'center',
          }}
        >
          Only jpg, jpeg, png and gif images are supported
        </div>
      )}
    </div>
  );
};

EnterURL.propTypes = {
  item: PropTypes.shape({
    id: PropTypes.string,
  }),
  onItemChange: PropTypes.func,
};

export default EnterURL;
