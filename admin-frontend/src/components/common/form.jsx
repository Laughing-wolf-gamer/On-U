import React from 'react';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Button } from '../ui/button';
import SizeSelector from '../admin-view/SizeSelector';
import BulletPointsForm from '../admin-view/BulletPointsForm';
import CustomSelect from '../admin-view/CustomSelect';
import TextInputArrayCustom from '../admin-view/TextInputArrayCustom';
import ColorPresetsCreator from '@/pages/admin-view/ColorPresetsCreator';

const CommonForm = ({ formControls, formData, setFormData, handleSubmit, buttonText, isBtnValid }) => {

    // Function to render form controls based on their type
    function renderInputControllersByType(controlItems) {
        const value = formData[controlItems.name] || '';
        switch (controlItems.componentType) {
        case 'text':
            return (
                <Input
				name={controlItems.name}
				placeholder={controlItems.placeholder}
				id={controlItems.name}
				type={controlItems.type}
				value={value}
				onChange={(e) => setFormData({ ...formData, [controlItems.name]: e.target.value })}
				className={`px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary w-full`}
            />
            
            );
        case 'select':
            return (
                <CustomSelect
                    controlItems={controlItems}
                    setChangeData={(e) => {
                    setFormData({ ...formData, [controlItems.name]: e });
                    }}
                />
            );
        case 'textarea':
            return (
            <Textarea
                value={value}
                name={controlItems?.name}
                placeholder={controlItems?.placeholder}
                id={controlItems?.name}
                onChange={(e) => setFormData({ ...formData, [controlItems.name]: e.target.value })}
                className="px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary w-full"
            />
            );
        case 'bulletPoints':
            return (
                <BulletPointsForm
                    onChange={(e) => {
                        setFormData({ ...formData, [controlItems.name]: e });
                    }}
                />
            );
		case "arrayTexts":
		return <TextInputArrayCustom
			onChange={(e)=>{
				console.log("changes: ",[controlItems.name],e)
				setFormData({...formData,[controlItems.name]:e})
			}}
		/>
		/* case 'colorSelect':
			<div className="mt-4 w-full">
				<ColorPresetsCreator
					sizeTag={"allSizes"}
					sizeTitle = {"allSize-new"}
					OnChange={(changedFiles)=>{
						console.log("Color Images Image Urls:  ",changedFiles);
						// setFormData({...formData, ['colorImages']: changedFiles});
					}}
				/>
			</div>
		break; */
        case 'sizeSelect':
            return (
                <SizeSelector
                    sizeType={controlItems?.name}
                    sizeOptions={controlItems.options}
                    OnChange={(e) => {
                        setFormData({ ...formData, ['size']: e });
                    }}
                />
            );
        default:
            return (
            <Input
                value={value}
                name={controlItems.name}
                placeholder={controlItems.placeholder}
                id={controlItems.name}
                type={controlItems.type}
                onChange={(e) => setFormData({ ...formData, [controlItems.name]: e.target.value })}
                className="px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary w-full"
            />
            );
        }
    }
    const validated = formControls.map(v => v.required && !formData[v.name])
    console.log("Bullet Points Data:  ",formData["bulletPoints"])
    return (
        <form onSubmit={(e) => handleSubmit(e)} className="space-y-6">
        <div className="flex flex-col gap-6">
            {formControls.map((controlItem) => (
                <div key={controlItem.name} className="grid w-full gap-2">
                    <Label>
                        {controlItem.label}
                        {
                            controlItem.required && !formData[controlItem.name] && <span className='text-red-500 text-[12px] font-light'>*</span>
                        }
                        {
                            controlItem.name === 'bulletPoints' && Array.isArray(formData[controlItem.name]) && formData["bulletPoints"].length <= 0 && <span className='text-red-500 text-[12px] font-light'>*</span>
                        }
                    </Label>
                    
                    {renderInputControllersByType(controlItem)}
                </div>
            ))}
        </div>
            <Button
                disabled={!isBtnValid}
                className="mt-4 w-full py-2 bg-primary text-white font-semibold rounded-md hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-50 disabled:bg-gray-400"
            >
                {buttonText || 'Submit'}
            </Button>
        </form>
    );
};

export default CommonForm;
