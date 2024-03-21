import React, {useRef, useState, useEffect} from "react";

import "./ImageUpload.css";
import Button from "./Button";

const ImageUpload = (props) => {
  const [file, setFile] = useState();
  const [previewUrl, setPreviewUrl] = useState();
  const [isValid, setIsValid] = useState(false);
	const fileClickRef = useRef();

	const  pickImageHandler = () => {
		fileClickRef.current.click();
	}

  useEffect(() => {
    if (!file) {
      return;
    }

    const fileReader = new FileReader();

    fileReader.readAsDataURL(file);

    fileReader.onload = () => {
      setPreviewUrl(fileReader.result);
    }
  }, [file]);
	const pickedHandler = (event) => {
    let pickedFile;
    let isFileValid;
    if (event.target.files && event.target.files.length === 1) {
      pickedFile = event.target.files[0];
      setFile(pickedFile);
      setIsValid(true);
      isFileValid = true;
    } else {
      setIsValid(false);
      isFileValid = false
    }

    props.onInput(props.id, pickedFile, isFileValid);
	}

  return (
    <div className="form-control">
      <input
        id={props.id}
				ref={fileClickRef}
        type="file"
        style={{ display: "none" }}
        accept=".jpg, .jpeg, .png"
				onChange={pickedHandler}
      />
      <div className={`image-upload ${props.center && "center"}`}>
        <div className="image-upload__preview">
          {previewUrl && <img src={previewUrl} alt="Preview" />}
          {!previewUrl && <span>Please select an image</span>}
        </div>
        <Button type="button" onClick={pickImageHandler}>
          PICK IMAGE
        </Button>
      </div>
      {!isValid && <p>{props.errorText}</p>}
    </div>
  );
};

export default ImageUpload;
