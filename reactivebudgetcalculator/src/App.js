import React, { Component } from "react";
import moment from "moment";
import styled from "styled-components";
import Expenses from "./expenses";
import Income from "./income";
//d
const paddingContainer = 20;

const HeaderTitle = ({ className, children }) => (
  <h1 className={className}>{children}</h1>
);

const HeaderTtileStyle = styled(HeaderTitle)`
  font-size: 3rem;
  font-weight: bold;
  text-align: center;
`;

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-self: center;
  padding-right: ${paddingContainer}px;
  padding-left: ${paddingContainer}px;
  margin-top: 20px;
  @media (max-width: 720px) {
    padding-right: 10px;
    padding-left: 10px;
  }
`;

const Wrapper = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 10px;
  flex-wrap: nowrap;
  > div {
    display: flex;
    flex-wrap: nowrap;
  }
  @media (max-width: 720px) {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 20px;
    > div {
      justify-content: flex-end;
    }
  }
`;

const Separeator = ({ className }) => <span className={className}>|</span>;

const SepareatorStyle = styled(Separeator)`
  font-weight: bold;
  @media (max-width: 720px) {
    display: none;
  }
`;

const ResultLine = styled.div`
  display: flex;
  @media (max-width: 720px) {
    flex-direction: column;
    align-self: center;
  }
`;

const Result = styled.span`
  font-weight: bold;
  @media (max-width: 720px) {
    text-align: center;
  }
`;

const sizeBTN = 32;
const DateButton = styled.button`
  color: white;
  line-height: 1rem;
  border: 1px solid white;
  border-radius: 50%;
  background-color: transparent;
  width: ${sizeBTN}px;
  height: ${sizeBTN}px;
  @media (max-width: 720px) {
    width: 40px;
    height: 40px;
  }
  margin: 3px;
  cursor: pointer;
  text-align: center;
  position: relative;
  overflow: hidden;
  z-index: 200;
  transition: all 0.5s ease 0s;
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
    transition: all 0.3s ease 0s;
    z-index: -1;
  }
  &::before {
    transform: translate(0, 100%);
  }
  &::after {
    transform: translate(0, -100%);
  }
  &:hover {
    &::before,
    &::after {
      transform: translate(0, 0);
    }
    color: #000;
  }
`;

const Nav = styled.nav`
  display: flex;
  justify-content: space-between;
  gap: 20px;
`;

const Link = styled.span`
  position: relative;
  display: block;
  padding: 3px 15px;
  border-radius: 20px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.5s ease 0s;
  color: ${({ selected }) => (selected ? "#000" : "#fff")};
  &::before,
  &::after {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    z-index: -1;
    width: 100%;
    height: 100%;
    background-color: ${({ selected }) => (selected ? "#fff" : "#8888")};
    transition: all 0.3s ease 0s;
  }
  &::before {
    transform: ${({ selected }) =>
      selected ? "translate(0 , 0)" : "translate(105%, 0)"};
  }
  &::after {
    transform: ${({ selected }) =>
      selected ? "translate(0 , 0)" : "translate(-105%, 0)"};
  }
  &:hover {
    color: #000;
    &::before,
    &::after {
      transform: translate(0, 0);
    }
  }
`;

export const Label = ({ className, children }) => (
  <p className={className}>{children}:</p>
);

const DateLabel = styled(Label)`
  white-space: nowrap;
  @media (max-width: 720px) {
    font-size: 1rem;
  }
`;

const AppLabel = styled(Label)`
  margin-right: 20px;
  @media (max-width: 720px) {
    margin-right: 0px;
    font-size: 1rem;
  }
`;

const Table = styled.table`
  display: grid;
  grid-template-columns: 1fr 1fr auto;
  text-align: end;
  gap: 10px;
  @media (max-width: 720px) {
    gap: 5px;
  }
`;

class App extends Component {
  constructor(props) {
    super(props);

    let storageState = localStorage.getItem("state");
    let initState;

    if (storageState != null) {
      storageState = JSON.parse(storageState);
      initState = { ...storageState, date: moment(storageState.date) };
    } else {
      initState = {
        date: moment(),
        navSelected: "incomes",
        transactions: [],
      };
    }

    this.state = initState;
  }

  handleSubtractDay = () => {
    this.setState({ date: this.state.date.subtract(1, "day") });
  };

  handleAddDay = () => {
    this.setState({ date: this.state.date.add(1, "day") });
  };

  handleNavClick = (event) => {
    this.setState({ navSelected: event.target.getAttribute("name") });
  };

  handleSubmitTransaction = (sum, category) => {
    const { date: TodayDate, transactions } = this.state;

    const newTransaction = {
      date: TodayDate.format("DD.MM.YYYY"),
      category: category,
      sum: sum,
    };

    const newTransactions = [...transactions, newTransaction];

    newTransactions.sort((a, b) => {
      const aDate = moment(a.date, "DD.MM.YYYY");
      const bDate = moment(b.date, "DD.MM.YYYY");
      return aDate.isAfter(bDate);
    });

    this.setState({ transactions: newTransactions });
  };
  componentDidUpdate() {
    const { date } = this.state;
    localStorage.setItem(
      "state",
      JSON.stringify({ ...this.state, date: date.format() })
    );
  }
  onToday = () => {
    const { transactions, date } = this.state;

    const currentMonthTransactions = transactions.filter(
      ({ date: transactionDate }) =>
        moment(transactionDate, "DD.MM.YYYY").isSame(date, "month")
    );

    const dailyMoney =
      currentMonthTransactions.reduce(
        (acc, transaction) =>
          transaction.sum > 0 ? transaction.sum + acc : acc,
        0
      ) / moment(date).daysInMonth();

    const transactionsBeforeThisDayAndInThisDay =
      currentMonthTransactions.filter(
        ({ date: transactionDate }) =>
          moment(transactionDate, "DD.MM.YYYY").isBefore(date, "date") ||
          moment(transactionDate, "DD.MM.YYYY").isSame(date, "date")
      );

    const expanseBeforeToday = transactionsBeforeThisDayAndInThisDay.reduce(
      (acc, { sum }) => (sum < 0 ? acc + sum : acc),
      0
    );

    const incomeBeforeToday = date.date() * dailyMoney;

    console.log({ dailyMoney, expanseBeforeToday, incomeBeforeToday });

    return incomeBeforeToday + expanseBeforeToday;
  };

  render() {
    const { date, today, navSelected, transactions } = this.state;
    return (
      <section>
        <header>
          <Container>
            <HeaderTtileStyle>Реактивный бюджет</HeaderTtileStyle>
          </Container>
        </header>
        <main>
          <Container>
            <Wrapper>
              <DateLabel>Сегодня</DateLabel>
              <div>{moment().format("DD.MM.YYYY")}</div>
              <SepareatorStyle />
              <DateLabel>Выбранная дата</DateLabel>
              <div>{date.format("DD.MM.YYYY")}</div>
            </Wrapper>
          </Container>
          <Container>
            <ResultLine>
              <AppLabel>Сегодня можно потратить</AppLabel>
              <Result>{this.onToday()}₽</Result>
            </ResultLine>
          </Container>
          <Container>
            <DateButton onClick={this.handleSubtractDay}>-</DateButton>
            <DateButton onClick={this.handleAddDay}>+</DateButton>
          </Container>
          <Container>
            <Nav>
              <Link
                name="income"
                onClick={this.handleNavClick}
                selected={navSelected === "income"}
              >
                Доходы
              </Link>
              <Link
                name="expenses"
                onClick={this.handleNavClick}
                selected={navSelected === "expenses"}
              >
                Расходы
              </Link>
            </Nav>
          </Container>
          <Container>
            {navSelected === "expenses" ? (
              <Expenses onSubmit={this.handleSubmitTransaction} />
            ) : (
              <Income onSubmit={this.handleSubmitTransaction} />
            )}
          </Container>
          <Container>
            <Table>
              {transactions
                .filter(({ date: transactionDate }) =>
                  moment(transactionDate, "DD.MM.YYYY").isSame(date, "month")
                )
                .map(({ date, sum, category }, index) => (
                  <>
                    <span>{date}</span>
                    <span>{sum} ₽</span>
                    <span>{category}</span>
                  </>
                ))}
            </Table>
          </Container>
        </main>
      </section>
    );
  }
}

export default App;
