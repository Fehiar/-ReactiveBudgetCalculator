import React, { Component } from "react";
import styled from "styled-components";
import { Label } from "./App";

const Title = styled.h3`
  display: block;
  text-align: center;
  margin-bottom: 15px;
  padding-top: 10px;
  border-top: 1px solid #fff;
`;

const InputLine = styled.dl`
  display: flex;
  justify-content: space-between;
  gap: 10px;
  margin-bottom: 20px;
`;

const InputinCover = ({ className, children, name, value, onChange }) => (
  <div className={className + " wrapper-input"}>
    <input
      placeholder={children}
      name={name}
      value={value}
      onChange={onChange}
    />
  </div>
);

const Input = styled(InputinCover)`
  position: relative;
  display: block;
  background-color: transparent;
  border-radius: 15px;
  overflow: hidden;
  padding: 0px 12px;
  border: 1px solid white;
  transition: all 0.3s ease 0s;
  border: 1px solid ${({ enterValues }) => (enterValues ? "#933" : "#999")};
  > input {
    border: none;
    background-color: transparent;
    transition: all 0.3s ease 0s;
    color: #fff;
    &::placeholder {
      color: ${({ enterValues }) => (enterValues ? "#933" : "#999")};
      transition: all 0.1s ease 0s;
    }
    &:focus,
    &:hover {
      outline: none;
      color: #000;
      &::placeholder {
        color: #444;
      }
    }
  }
  &:focus-within,
  &:hover {
    &::after {
      transform: translate(0, 0);
    }
    color: #000;
  }
  &::before,
  &::after {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    z-index: -1;
    display: block;
    width: 100%;
    height: 100%;
    background-color: #fff;
    border-radius: 15px;
    transition: all 0.4s ease-in-out 0s;
  }
  &::before {
    transform: translate(0, -105%);
  }
  &::after {
    transform: translate(-105%, 0);
  }
`;

const Button = styled.button`
  display: block;
  width: 100%;
  text-align: center;
  border-radius: 15px;
  padding: 5px;
  background-color: transparent;
  border: 1px solid #fff;
  color: #fff;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: all 0.5s ease 0s;
  &:focus {
    outline: none;
  }
  &::before,
  &::after {
    content: "";
    display: block;
    width: 100%;
    height: 100%;
    background-color: white;
    position: absolute;
    top: 0;
    left: 0;
    transition: all 0.5s ease 0s;
    z-index: -1;
  }
  &::before {
    transform: translate(100%, 0);
  }
  &::after {
    transform: translate(-100%, 0);
  }
  &:hover,
  &:focus {
    &::before,
    &::after {
      transform: translate(0, 0);
    }
    color: #000;
  }
`;

class Income extends Component {
  state = {
    transaction: null,
    category: null,
    enterValues: false,
  };

  handleChangeInput = (event) => {
    this.setState({ [event.target.name]: event.target.value });
    this.setState({ enterValues: false });
  };

  hendleEnter = () => {
    const { onSubmit } = this.props;
    const { transaction, category, enterValues } = this.state;
    if ((transaction != null) & (category != null)) {
      onSubmit(Math.abs(parseFloat(transaction)), category);
      this.setState({ transaction: null, category: null });
      this.setState({ enterValues: false });
    } else {
      this.setState({ enterValues: true });
    }
  };

  render() {
    const { transaction, category } = this.state;
    const { enterValues } = this.state;
    return (
      <div>
        <Title>Добавить доход</Title>
        <InputLine>
          <dt>
            <Label>Сумма</Label>
          </dt>
          <dd>
            <Input
              name="transaction"
              onChange={this.handleChangeInput}
              value={transaction || ""}
              enterValues={enterValues}
            >
              Введите сумму
            </Input>
          </dd>
        </InputLine>
        <InputLine>
          <dt>
            <Label>Категория</Label>
          </dt>
          <dd>
            <Input
              name="category"
              onChange={this.handleChangeInput}
              value={category || ""}
              enterValues={enterValues}
            >
              Введите категорию
            </Input>
          </dd>
        </InputLine>
        <Button onClick={this.hendleEnter}>Добавить</Button>
      </div>
    );
  }
}

export default Income;
