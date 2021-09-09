import { useEffect, useState } from "react";
import { Col, Container, Row, FormGroup, InputGroup, Input } from "reactstrap";
import Admin from "layouts/Admin.js";
import Typography from "../components/Typography";
import { LinkButton, PrimaryButton } from "../components/Buttons";
import Card from "../components/Card";
import { getFormattedNumber } from "../utils/formatters";
import styled from "styled-components";
import {
  ACTIVE_CURRENCIES,
  CARD_PERIODS,
  stakingModels,
  stakingTabs,
} from "../utils/constants";
import { DefaultButton } from "../components/Buttons";
import UpIcon from "../assets/img/icons/up.svg";
import EyeIcon from "../assets/img/icons/eye.svg";
import ClaimRewards from "../components/ClaimRewards";
import AvailableCard from "../components/FunctionalCards/AvailableCard";
import LockedCard from "../components/FunctionalCards/LockedCard";
import StakingRewardsCard from "../components/FunctionalCards/StakingRewardsCard";
import DropdownMenu from "../components/DropdownMenu";
import TokenCard from "../components/FunctionalCards/TokenCard";
import { useEthereum } from "../contexts/EthereumContext";
import { useUser } from "../contexts/UserContext";
import Tabs from "../components/Tabs/DefaultTabs";
import { useRouter } from "next/router";
import {
  fetchRewardsDayDatas,
  fetchTotalLockedBalance,
  fetchTotalStakersCount,
  fetchTotalTokenHoldersCount,
  getAPY,
  getTokenPrice,
} from "../utils/ethereum";
import RecentTransactionsPanel from "../components/RecentTransactionsPanel";
import PriceChart from "../components/PriceChart";
import { useWeb3React } from "@web3-react/core";
import MobileNav from "../components/SidebarMobile/NavAndSidebar";

const modelDetails = [
  {
    name: "Maker",
    details: [
      {
        name: "Active users",
        value: "Soon",
      },

      {
        name: "Total sessions",
        value: "Soon",
      },
    ],
  },
  {
    name: "Smartdex",
    details: [
      {
        name: "Generated volume",
        value: "$201,345.78",
      },
      {
        name: "Total value locked",
        value: "$34.63",
      },
    ],
  },
  {
    name: "Swarm",
    details: [
      {
        name: "Rewards distributed",
        value: "$1,150,000",
      },
      {
        name: "Generated volume",
        value: "$5,543,345.56",
      },
    ],
  },
];

const LabelWrapper = styled.div`
  background: ${({ theme, active }) =>
    active ? theme.color.greenBuy10 : theme.color.monoGrey2};
  border-radius: 20px;
  padding: 4px 13px;
  color: ${({ theme, active }) =>
    active ? theme.color.greenMain : theme.color.monoWhite};
  font-size: 10px;
`;

const StatisticsLabelWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  border-bottom: ${({ theme }) => `1px solid ${theme.color.monoGrey2}`};
  padding-bottom: 10px;
  margin-bottom: 10px;
`;

const ChartWrapper = styled.div`
  height: 100%;
  padding-top: 40px;
`;

const OverviewTitleWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  min-height: 43px;
`;

const ModelCard = ({ model }) => {
  const [activeTab, setActiveTab] = useState(0);
  const [selectedPeriod, setSelectedPeriod] = useState(1);
  const router = useRouter();

  return (
    <Card>
      <div className="d-flex align-items-center justify-content-between mb-3">
        <Typography color="monoWhite" size={14} weight={600}>
          {model.name}
        </Typography>

        {/* <DropdownMenu
          menus={CARD_PERIODS}
          selected={selectedPeriod}
          setSelected={setSelectedPeriod}
        /> */}
      </div>
      {model.details.map((detail, index) => (
        <div className="d-flex justify-content-between">
          <Typography color="textGrey" size={12} weight={400}>
            {detail.name}
          </Typography>
          <Typography
            color={index === 0 ? "monoWhite" : "greenBuy"}
            size={12}
            weight={400}
          >
            {detail.value}
          </Typography>
        </div>
      ))}

      <LinkButton
        color="greenMain"
        size={11}
        weight={700}
        onClick={() => router.push("/staking")}
      >
        Visit App →
      </LinkButton>
    </Card>
  );
};

const StatisticsContainer = ({ title, value }) => (
  <StatisticsLabelWrapper>
    <div className="d-flex">
      <Typography color="monoWhite" size={12} weight={400}>
        {title}
      </Typography>
      {/* <img src={EyeIcon} className="ml-2" /> */}
    </div>
    <Typography color="monoWhite" size={12} weight={600}>
      {value}
    </Typography>
  </StatisticsLabelWrapper>
);

const OverviewPage = () => {
  const { blockNumber } = useEthereum();
  const [dailyRewardsDatas, setDailyRewardsDatas] = useState([]);
  const [activeCurrency, setActiveCurrency] = useState(0);
  const [info, setInfo] = useState({
    totalLockedBalance: 0,
    tokenPrice: 0,
    totalHoldersCount: 0,
    totalStakersCount: 0,
    currentAPY: 0,
  });
  useEffect(() => {
    fetchInfo();
  }, []);

  const fetchInfo = async () => {
    const dailyRewardsDatas = await fetchRewardsDayDatas();
    setDailyRewardsDatas(dailyRewardsDatas);

    const totalLockedBalance = await fetchTotalLockedBalance();
    const tokenPrice = await getTokenPrice();
    const totalHoldersCount = await fetchTotalTokenHoldersCount();
    const totalStakersCount = await fetchTotalStakersCount();
    const currentAPY = await getAPY();

    setInfo({
      totalLockedBalance,
      tokenPrice,
      totalHoldersCount,
      totalStakersCount,
      currentAPY,
    });
  };

  return (
    <div>
      <MobileNav />
      <OverviewTitleWrapper>
        <Typography
          color="monoWhite"
          size={14}
          weight={600}
          transform="uppercase"
        >
          Overview
        </Typography>
        <ClaimRewards />
      </OverviewTitleWrapper>

      <div className="py-4 ResponsiveScrollBar1">
        <Row>
          <Col lg={3}>
            <AvailableCard blockNumber={blockNumber} />
          </Col>
          <Col lg={3}>
            <LockedCard blockNumber={blockNumber} />
          </Col>
          <Col lg={3}>
            <StakingRewardsCard blockNumber={blockNumber} />
          </Col>
          <Col lg={3}>
            <TokenCard blockNumber={blockNumber} />
          </Col>
        </Row>
      </div>
      <div className="py-4 ResponsiveScrollBar2">
        <Row>
          <div style={{ display: "flex", width: "100%", overflowX: "scroll" }}>
            <Col lg={3} style={{ minWidth: "250px" }}>
              <AvailableCard blockNumber={blockNumber} />
            </Col>
            <Col lg={3} style={{ minWidth: "250px" }}>
              <LockedCard blockNumber={blockNumber} />
            </Col>
            <Col lg={3} style={{ minWidth: "250px" }}>
              <StakingRewardsCard blockNumber={blockNumber} />
            </Col>
            <Col lg={3} style={{ minWidth: "250px" }}>
              <TokenCard blockNumber={blockNumber} />
            </Col>
          </div>
        </Row>
      </div>
      <Row>
        <Col lg={8}>
          <Card className="mb-4 h-statistics">
            <Row>
              <Col lg={4}>
                <Typography
                  color="monoWhite"
                  weight={600}
                  size={20}
                  className="mb-4"
                >
                  Staking Statistics
                </Typography>
                {/* {account ? ( */}
                <div className="d-flex justify-content-between align-items-center">
                  <Typography size={12} color="monoWhite48" weight={600}>
                    Total Value Staked
                  </Typography>
                  <Tabs
                    setActiveTab={setActiveCurrency}
                    activeTab={activeCurrency}
                    tabs={ACTIVE_CURRENCIES}
                  />
                </div>
                <Typography
                  color="white"
                  size={20}
                  weight={600}
                  className="mt-2"
                >
                  {getFormattedNumber(
                    1 === activeCurrency
                      ? info.totalLockedBalance * info.tokenPrice
                      : info.totalLockedBalance,
                    activeCurrency
                  )}
                </Typography>
                <div className="mt-11">
                  <StatisticsContainer
                    title="Current APY"
                    value={getFormattedNumber(info.currentAPY) + "%"}
                  />
                  <StatisticsContainer
                    title="Stakers"
                    value={getFormattedNumber(info.totalStakersCount)}
                  />
                  <StatisticsContainer
                    title="NIOX addresses"
                    value={getFormattedNumber(info.totalHoldersCount)}
                  />
                </div>
              </Col>
              <Col lg={8}>
                {dailyRewardsDatas.length > 0 && (
                  <ChartWrapper>
                    <PriceChart snapshots={dailyRewardsDatas} />
                  </ChartWrapper>
                )}
              </Col>
            </Row>
          </Card>
          <Row>
            {modelDetails.map((model) => (
              <Col lg={4} key={model.name}>
                <ModelCard model={model} />
              </Col>
            ))}
          </Row>
        </Col>
        <Col lg={4} className="h-transactions">
          <RecentTransactionsPanel />
        </Col>
      </Row>
    </div>
  );
};

OverviewPage.layout = Admin;

export default OverviewPage;
