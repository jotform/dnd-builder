import React from 'react';
import FormFieldItem from './FormFieldItem';
import FieldName from '../../../assets/svg/freecanvas/field-name.svg';
import FieldEmail from '../../../assets/svg/freecanvas/field-email.svg';
import FieldPhoneNumber from '../../../assets/svg/freecanvas/field-phone.svg';
import FieldProducts from '../../../assets/svg/freecanvas/field-products.svg';
import FieldAddress from '../../../assets/svg/freecanvas/field-address.svg';
import FieldDate from '../../../assets/svg/freecanvas/field-date.svg';
import FieldShortText from '../../../assets/svg/freecanvas/field-short-text.svg';
import FieldLongText from '../../../assets/svg/freecanvas/field-long-text.svg';
import FieldInputTable from '../../../assets/svg/freecanvas/field-input-table.svg';
import FieldStarRating from '../../../assets/svg/freecanvas/field-star-rating.svg';

const FormField = () => {
  return (
    <div>
      <FormFieldItem
        itemIcon={FieldName}
        itemTitle="Name"
      />
      <FormFieldItem
        itemIcon={FieldEmail}
        itemTitle="Email"
      />
      <FormFieldItem
        itemIcon={FieldPhoneNumber}
        itemTitle="Phone Number"
      />
      <FormFieldItem
        itemIcon={FieldProducts}
        itemTitle="Product List"
      />
      <FormFieldItem
        itemIcon={FieldAddress}
        itemTitle="Address"
      />
      <FormFieldItem
        itemIcon={FieldDate}
        itemTitle="Date"
      />
      <FormFieldItem
        itemIcon={FieldShortText}
        itemTitle="Short Text"
      />
      <FormFieldItem
        itemIcon={FieldLongText}
        itemTitle="Long Text"
      />
      <FormFieldItem
        itemIcon={FieldInputTable}
        itemTitle="Input Table"
      />
      <FormFieldItem
        itemIcon={FieldStarRating}
        itemTitle="Star Rating"
      />
    </div>
  );
};

export default FormField;
