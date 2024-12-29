import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAddress } from '../../../action/useraction';

const SavedAddresses = () => {
  const {allAddresses} = useSelector(state => state.getAllAddress)
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getAddress())
  },[])
  console.log("All Addresses: ",allAddresses)
  return (
    <div>
      <h2 className="font-semibold text-lg">Saved Addresses</h2>
      <p>No addresses saved.</p>
    </div>
  );
};

export default SavedAddresses;
