import React, { useContext, useState } from "react";

import Card from "../../shared/components/UIElements/Card";
import { Input } from "../../shared/components/FormElements/Input";
import {
  VALIDATOR_EMAIL,
  VALIDATOR_MINLENGTH,
  VALIDATOR_REQUIRE,
} from "../../shared/util/validators";
import { useForm } from "../../shared/hooks/form-hook";
import Button from "../../shared/components/FormElements/Button";
import { AuthContext } from "../../shared/context/auth-context";
import "./Auth.css";

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

  const switchModHandler = (event) => {
    event.preventDefault();

    if (!isLogin) {
      setFormData(
        {
          ...formState.inputs,
          name: undefined,
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
        },
        false
      );
    }
    setIsLogin((prevState) => !prevState);
  };
  const submitHandler = (event) => {
    event.preventDefault();
    console.log(formState.inputs);
    auth.logIn();
  };
  return (
    <Card className="authentication">
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
          ></Input>
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
          errorText="Please enter a valid email"
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
  );
};

export default Auth;
