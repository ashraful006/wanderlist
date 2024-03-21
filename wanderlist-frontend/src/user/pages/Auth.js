import React, { useContext, useState } from "react";

import Card from "../../shared/components/UIElements/Card";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import { Input } from "../../shared/components/FormElements/Input";
import {
  VALIDATOR_EMAIL,
  VALIDATOR_MINLENGTH,
  VALIDATOR_REQUIRE,
} from "../../shared/util/validators";
import { useForm } from "../../shared/hooks/form-hook";
import Button from "../../shared/components/FormElements/Button";
import { AuthContext } from "../../shared/context/auth-context";
import { useHttpClient } from "../../shared/hooks/http-hook";
import "./Auth.css";
import ImageUpload from "../../shared/components/FormElements/ImageUpload";

const Auth = () => {
  const auth = useContext(AuthContext);
  const [formState, inputHandler, setFormData] = useForm(
    {
      email: {
        value: "",
        isValid: false,
      },
      password: {
        value: "",
        isValid: false,
      },
    },
    false
  );
  const [isLogin, setIsLogin] = useState(true);
  const {isLoading, error, sendRequest, clearError} = useHttpClient();

  const switchModHandler = (event) => {
    event.preventDefault();

    if (!isLogin) {
      setFormData(
        {
          ...formState.inputs,
          name: undefined,
          image: undefined
        },
        formState.inputs.email.isValid && formState.inputs.password.isValid
      );
    } else {
      setFormData(
        {
          ...formState.inputs,
          name: {
            value: "",
            isValid: false,
          },
          image: {
            value: null,
            isValid: false
          }
        },
        false
      );
    }
    setIsLogin((prevState) => !prevState);
  };
  const submitHandler = async (event) => {
    event.preventDefault();

    if (isLogin) {
      try {
        const responseData = await sendRequest(
          'http://localhost:5000/api/users/login',
          'POST',
          JSON.stringify({
            email: formState.inputs.email.value,
            password: formState.inputs.password.value
          }),
          {
            'Content-Type': 'application/json'
          }
        );
        
        auth.logIn(responseData.user.id);
      } catch (err) {

      }
    } else {
      try {
        const responseData = await sendRequest(
          'http://localhost:5000/api/users/signup',
          'POST',
          JSON.stringify({
            name: formState.inputs.name.value,
            email: formState.inputs.email.value,
            password: formState.inputs.password.value
          }),
          {
            "Content-type" : "application/json"
          }
        );

        auth.logIn(responseData.user.id);
      } catch (err) {

      }
    }
  };

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} ></ErrorModal>
      <Card className="authentication">
        {isLoading && <LoadingSpinner asOverlay />}
        <h2>Login</h2>
        <hr />
        <form onSubmit={submitHandler}>
          {!isLogin && (
            <Input
              element="input"
              id="name"
              type="text"
              placeholder="Enter Name"
              name="name"
              label="Name"
              validators={[VALIDATOR_REQUIRE()]}
              errorText="Name is required"
              onInput={inputHandler}
            />
          )}
          {!isLogin && (
            <ImageUpload center id="image" onInput={inputHandler}/>
          )}
          <Input
            element="input"
            id="email"
            type="email"
            placeholder="Enter Email"
            name="email"
            label="E-mail"
            validators={[VALIDATOR_EMAIL()]}
            errorText="Please enter a valid email"
            onInput={inputHandler}
          ></Input>
          <Input
            element="input"
            id="password"
            type="password"
            placeholder="Enter Pasword"
            label="Password"
            validators={[VALIDATOR_MINLENGTH(8)]}
            errorText="Please enter a valid password"
            onInput={inputHandler}
          ></Input>
          <Button type="submit" disabled={!formState.isValid}>
            {isLogin ? "LOGIN" : "Signup"}
          </Button>
          <Button inverse onClick={switchModHandler}>
            {isLogin ? "Signup" : "Login"}
          </Button>
        </form>
      </Card>
    </React.Fragment>
  );
};

export default Auth;
