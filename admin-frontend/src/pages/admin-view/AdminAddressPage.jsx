import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { fetchAddressFormData, removeAddressFormData, sendAddressFormData, updateAddressFormElementIndex } from '@/store/common-slice';
import { useSettingsContext } from '@/Context/SettingsContext';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { RxHamburgerMenu } from "react-icons/rx";
const AdminAddressPage = () => {
	const { addressFormFields: AllAddressFields } = useSelector(state => state.common);
	const { checkAndCreateToast } = useSettingsContext();
	const dispatch = useDispatch();
	const [addressFormFields, setAddressFormFields] = useState([]);
	const [addressFormFieldsValue, setAddressFormFieldsValue] = useState('');

	const handelChangeNewField = (e) => {
		setAddressFormFieldsValue(e.target.value);
	};

	const handelAddNewField = async (e) => {
		if (!addressFormFieldsValue) {
			checkAndCreateToast('error', "Field Empty", 1000);
			return;
		}
		if (addressFormFields.includes(addressFormFieldsValue)) {
			checkAndCreateToast("error", "Field Exists", 800);
			return;
		}
		setAddressFormFields([...addressFormFields, addressFormFieldsValue]);
		await dispatch(sendAddressFormData({ addressFormFields: addressFormFieldsValue }));
		dispatch(fetchAddressFormData());
		setAddressFormFieldsValue('');
		checkAndCreateToast("success", "Field Added Successfully", 1000);
	};

	const handelRemoveNewField = async (f) => {
		setAddressFormFields(prev => prev.filter(field => field !== f));
		await dispatch(removeAddressFormData({ addressFormFields: f }));
		dispatch(fetchAddressFormData());
	};

	const handleDragEnd = async (result) => {
		const { source, destination } = result;
		if (!destination) return; // Dropped outside the list

		// Reorder the fields
		const items = Array.from(AllAddressFields);
		const [removed] = items.splice(source.index, 1);
		items.splice(destination.index, 0, removed);

		// Update state
		setAddressFormFields(items);
		// console.log("updated Items Location",items);
		await dispatch(updateAddressFormElementIndex({sourceIndex: source.index, destinationIndex:destination.index}));
		dispatch(fetchAddressFormData());
	};

	useEffect(() => {
		window.scrollTo(0, 0);
		dispatch(fetchAddressFormData());
	}, [dispatch]);
	console.log("Address Form Fields: ",AllAddressFields);
	return (
		<div className="p-6 space-y-4">
			<h2 className="text-xl font-semibold text-gray-800">Edit Customer Address Form</h2>
			<div className='space-y-4'>
				<Input
					placeHolder="Add New Address Field"
					value={addressFormFieldsValue}
					onChange={handelChangeNewField}
				/>
				<Button onClick={handelAddNewField}>Add New Field</Button>
			</div>
			<div className='space-y-4'>
				{AllAddressFields.length > 0 && (
					<DragDropContext onDragEnd={handleDragEnd}>
						<Droppable droppableId="address-fields">
							{(provided) => (
								<div
									className="space-y-4"
									ref={provided.innerRef}
									{...provided.droppableProps}
								>
									{AllAddressFields.map((field, index) => (
										<Draggable key={field} draggableId={field} index={index}>
											{(provided) => (
												<div
													className="space-y-4 justify-between items-center flex"
													ref={provided.innerRef}
													{...provided.draggableProps}
													{...provided.dragHandleProps}
												>
													<RxHamburgerMenu />
													<span className="text-lg font-semibold text-gray-800">
														{field}
													</span>
													<Button onClick={() => handelRemoveNewField(field)}>
														Delete Field
													</Button>
												</div>
											)}
										</Draggable>
									))}
									{provided.placeholder}
								</div>
							)}
						</Droppable>
					</DragDropContext>
				)}
			</div>
		</div>
	);
};

export default AdminAddressPage;
