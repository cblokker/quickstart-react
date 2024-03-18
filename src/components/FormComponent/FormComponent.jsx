import React, { useState, useContext } from 'react';
import {
  Button,
  Flex,
  Dropdown,
  TextField,
  AlertBanner,
  AlertBannerText
} from "monday-ui-react-core";
import axios from 'axios';
import { useQuery } from 'react-query';
import mondaySdk from "monday-sdk-js";
// import { AppContext } from './src/context/AppContext';

const monday = mondaySdk();

const fetchFragrances = async () => {
  const { data } = await axios.get(`${process.env.REACT_APP_FRAGRANCE_API_BASE_URL}/api/v1/fragrances`);
  return data.map(({ id, name }) => ({ value: id, label: name }));
}

const fetchAppContext = async () => {
  const { data } = await monday.get("context");
  return data;
}

const FormComponent = () => {
  // const { a } = useContext(AppContext);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [fragranceSelections, setFragranceSelections] = useState([]);
  const [submissionStatus, setSubmissionStatus] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState([]);
  const { data: fragrances } = useQuery('fragrances', fetchFragrances);
  const { data: appContext } = useQuery('appContext', fetchAppContext);

  const handleSubmit = async (event) => {
    event.preventDefault();

    setLoading(true);
    let errorMessages = [];

    if (!firstName.trim()) {
      errorMessages.push('Please enter your first name.');
    }
  
    if (!lastName.trim()) {
      errorMessages.push('Please enter your last name.');
    }
  
    if (quantity < 1 || quantity > 9) {
      errorMessages.push('Quantity must be between 1 and 9.');
    }
  
    if (fragranceSelections.length !== 3) {
      errorMessages.push('Please select exactly 3 fragrances.');
    }
  
    if (errorMessages.length > 0) {
      setLoading(false);
      setSubmissionStatus('failure');
      setErrors(errorMessages); // Set error messages to be displayed
      return;
    }

    try {
      await axios.post(`${process.env.REACT_APP_FRAGRANCE_API_BASE_URL}/api/v1/orders`, {
        board_id: appContext.boardId,
        creator_id: appContext.user.id,
        first_name: firstName,
        last_name: lastName,
        quantity: quantity,
        fragrance_ids: fragranceSelections.map(selection => selection.value)
      });

      setFirstName('');
      setLastName('');
      setQuantity(1);
      setFragranceSelections([]);
      setLoading(false);
      setSubmissionStatus('success');
    } catch (error) {
      setLoading(false);
      setSubmissionStatus('failure'); // TODO: can capture error messages in setErrors
    }
  };

  return (
    <div>
      <Flex justify={Flex.justify.CENTER} gap={Flex.gaps.MEDIUM}>
        <form onSubmit={handleSubmit}>
          <div>
            <Flex justify={Flex.justify.CENTER} gap={Flex.gaps.MEDIUM}>
              <div>
                <TextField
                  title="First Name"
                  value={firstName}
                  size={TextField.sizes.MEDIUM}
                  requiredAsterisk={true}
                  onChange={setFirstName} />
              </div>
              <div>
                <TextField
                  title="Last Name"
                  value={lastName}
                  size={TextField.sizes.MEDIUM}
                  requiredAsterisk={true}
                  onChange={setLastName} />
              </div>
              <div>
                <TextField
                  title="Quantity"
                  value={quantity}
                  size={TextField.sizes.MEDIUM}
                  requiredAsterisk={true}
                  onChange={setQuantity} />
              </div>
            </Flex>
            <br />
            <div>
              <Dropdown
                placeholder="Single line multi state"
                options={fragrances}
                value={fragranceSelections}
                onChange={setFragranceSelections} multi className="dropdown-stories-styles_with-chips" />
            </div>
            <br />
            <Flex justify={Flex.justify.LEFT} gap={Flex.gaps.MEDIUM}>
              <Button type="submit" loading={loading}>Start Order</Button>
            </Flex>
          </div>
          <br />
          {submissionStatus === 'success' && (
            <AlertBanner backgroundColor={AlertBanner.backgroundColors.POSITIVE}>
              <AlertBannerText text="Form submitted successfully!" />
            </AlertBanner>
          )}
          {submissionStatus === 'failure' && (
            <AlertBanner backgroundColor={AlertBanner.backgroundColors.NEGATIVE}>
              <AlertBannerText text={errors.join('\r')} />
            </AlertBanner>
          )}
        </form>
      </Flex>
    </div>
  )
};

export default FormComponent;
