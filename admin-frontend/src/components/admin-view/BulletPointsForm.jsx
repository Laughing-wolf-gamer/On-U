import React, { useState } from "react";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { XIcon } from "lucide-react";

const BulletPointsForm = ({ onChange }) => {
  const [bulletPoints, setBulletPoints] = useState([]);

  const handleInputChange = (index, field, value) => {
    const updatedPoints = [...bulletPoints];
    updatedPoints[index][field] = value;
    setBulletPoints(updatedPoints);
    const filletedData = bulletPoints.filter(b => b.header !== '' && b.body !== "");
    if (onChange) {
      onChange(filletedData);
    }
  };

  const addBulletPoint = () => {
    setBulletPoints([...bulletPoints, { header: "", body: "" }]);
    const filletedData = bulletPoints.filter(b => b.header !== '' && b.body !== "");
    if (onChange) {
      onChange(filletedData);
    }
  };

  const removeBulletPoint = (index) => {
    const updatedPoints = bulletPoints.filter((_, i) => i !== index);
    setBulletPoints(updatedPoints);
    const filletedData = bulletPoints.filter(b => b.header !== '' && b.body !== "");
    if (onChange) {
      onChange(filletedData);
    }
  };

  return (
    <form className="w-full h-auto justify-start items-center flex flex-col gap-y-9">
      {bulletPoints && bulletPoints.length > 0 && bulletPoints.map((point, index) => (
        <div key={index} style={{ marginBottom: "10px" }} className="justify-center items-center flex flex-col space-y-2">
          <div className="justify-center items-center max-w-full p-2 h-auto">
            <Label className="flex gap-5 flex-row justify-between items-center">
              <span className="text-center font-bold">Header:</span>
              <div className="flex items-center space-x-2">
                <Input
                  type="text"
                  value={point?.header}
                  onChange={(e) =>
                    handleInputChange(index, "header", e.target.value)
                  }
                  placeholder="Enter header"
                  required
                  className="border p-2 rounded-md"
                />
                {/* Star Icon */}
                {point?.header === "" && (
                  <span className="text-red-500 text-xl">*</span> // Display star if header is empty
                )}
              </div>
            </Label>
          </div>
          <div className="justify-center items-center max-w-full h-auto">
            <Label className="flex gap-5 flex-row justify-between items-center">
              <span className="text-center font-bold">Body:</span>
              <Textarea
                value={point?.body}
                onChange={(e) =>
                  handleInputChange(index, "body", e.target.value)
                }
                placeholder="Enter body"
                rows="1"
                required
                className="border p-2 rounded-md"
              />
            </Label>
          </div>
          <Button
            type="button"
            className="w-auto justify-center items-center flex-row flex h-auto"
            onClick={() => removeBulletPoint(index)}
          >
            Remove Point <XIcon className="w-full h-full" />
          </Button>
        </div>
      ))}
      <Button
        type="button"
        className="bg-slate-800 font-bold justify-center items-center w-full space-x-8 h-auto p-2"
        onClick={addBulletPoint}
      >
        Add Point
      </Button>
    </form>
  );
};


export default BulletPointsForm;
