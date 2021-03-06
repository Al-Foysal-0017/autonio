import { useEffect, useState } from "react";
import {
  Col,
  Container,
  Row,
  FormGroup,
  InputGroup,
  Input,
  Modal as ReactModal,
} from "reactstrap";
import Admin from "layouts/Admin.js";
import Typography from "../components/Typography";
import { LinkButton, PrimaryButton } from "../components/Buttons";
import Card from "../components/Card";
import {
  formatAddress,
  getFormattedNumber,
  getUnformattedNumber,
} from "../utils/formatters";
import styled from "styled-components";
import Tabs from "../components/Tabs/CheckTabs";
import {
  DEFAULT_LOCK_PERIOD,
  stakingPlanInfos,
  stakingPlans,
  stakingTabs,
} from "../utils/constants";
import StakingPlanCard from "../components/FunctionalCards/StakingPlanCard";
import { useUser } from "../contexts/UserContext";
import { ContractAddress } from "../assets/constants/addresses";
import StakingRewardsABI from "../assets/constants/abi/StakingRewards.json";
import UpArrowIcon from "../assets/img/icons/up-arrow.svg";
import CoinsIcon from "../assets/img/icons/coins.svg";
import PolygonBackground from "../assets/img/icons/bg-polygon.svg";

import {
  defaultGasLimit,
  fetchDailyRewardRate,
  fetchLockedBalance,
  fetchStakingRewardsBalance,
  fetchTotalLockedBalance,
  fetchTotalStakersCount,
  fetchUserLockPeriod,
  getApproximateStakingRewards,
  getAPY,
  getCurrentTier,
  getGasPrice,
} from "../utils/ethereum";
import ClaimRewards from "../components/ClaimRewards";
import { BigNumberComparision, fromFraction } from "../utils/balance";
import BigNumber from "bignumber.js";
import StakingModal from "../components/Modals/StakingModal";
import StakingPlanTable from "../components/Tables/StakingPlanTable";
import StakingSummary from "../components/StakingSummary";
import MobileNav from "../components/SidebarMobile/NavAndSidebar";

const TokenLabel = styled.div`
  position: absolute;
  right: 12px;
  top: 12px;
  z-index: 3;
  background-color: ${({ theme }) => theme.color.monoGrey1};
`;

const TokenInput = styled(Input)`
  background-color: transparent !important;
  border: 1px solid #2f3641 !important;
  color: ${({ theme }) => `${theme.color.monoWhite} !important`};
  font-weight: 600;

  &::-webkit-input-placeholder {
    color: ${({ theme }) => theme.color.textGrey};
    font-weight: 600;
    font-size: 14px;
  }
`;

const TokenInputGroup = styled(InputGroup)`
  box-shadow: none;
`;

const TokenFormGroup = styled(FormGroup)`
  max-width: 400px;
`;

const DetailCard = ({ name, tokenAmount, changedAmount, subDetail }) => (
  <Card>
    <Typography color="monoWhite" opacity={0.5} size={12} weight={600}>
      {name}
    </Typography>
    <div className="d-flex align-items-center">
      <Typography
        transform="uppercase"
        color="monoWhite"
        size={24}
        weight={600}
      >
        {getFormattedNumber(tokenAmount)} NIOX
      </Typography>
      {changedAmount && (
        <div className="ml-2">
          <Typography
            color={changedAmount > 0 ? "greenBuy" : "greenBuy"}
            size={10}
          >
            <UpArrowIcon />
            {(changedAmount > 0 ? "+" : "-") + changedAmount} NIOX
          </Typography>
        </div>
      )}
    </div>
    <Typography color="textGrey" size={14} className="d-inline-block">
      {subDetail ? subDetail : ""}
    </Typography>
    {/* <Typography color="greenMain" size={10} className="mt-4">
      Blockchain ???
    </Typography> */}
  </Card>
);

const StakingPage = () => {
  const [activeModel, setActiveModel] = useState(0);
  const [stakingBalance, setStakingBalance] = useState();
  const { account, library } = useUser();
  const [tier, setTier] = useState(0);
  const [expectedTier, setExpectedTier] = useState(0);

  const [remainNextTierAmount, setRemainNextTierAmount] = useState(0);
  const [info, setInfo] = useState({
    totalLockedBalance: 0,
    dailyRewardRate: 0,
    totalStakersCount: 0,
    currentAPY: 0,
  });
  const [lockPeriod, setLockPeriod] = useState(null);
  const [lockedBalance, setLockedBalance] = useState(0);

  const [approximateStakingRewards, setApproximateStakingRewards] = useState(0);
  const [currentStakingRewardBalance, setCurrentStakingRewardsBalance] =
    useState(0);

  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    if (!library) return;
    const fetchBasicInfo = async () => {
      const totalLockedBalance = await fetchTotalLockedBalance(library);
      const dailyRewardRate = await fetchDailyRewardRate(library);
      const totalStakersCount = await fetchTotalStakersCount();
      const currentAPY = await getAPY();

      setInfo({
        totalLockedBalance,
        dailyRewardRate,
        totalStakersCount,
        currentAPY,
      });
    };

    fetchBasicInfo();

    if (!account) return;

    const fetchUserInfo = async () => {
      const lockedBalance = await fetchLockedBalance(account, library);

      setLockedBalance(lockedBalance);

      const tier = await getCurrentTier(lockedBalance);

      if (tier < 3) {
        setRemainNextTierAmount(
          BigNumber(stakingPlans[tier + 1].unlockAmount).minus(
            BigNumber(lockedBalance.toString())
          )
        );
      }

      setTier(tier);
      setExpectedTier(tier);

      const lockPeriod = await fetchUserLockPeriod(account, library);

      const now = Date.now();
      if (lockPeriod && now < lockPeriod * 1000)
        setLockPeriod(lockPeriod * 1000);
      else setLockPeriod(Date.now() + DEFAULT_LOCK_PERIOD);

      const currentStakingRewardBalance = await fetchStakingRewardsBalance(
        account,
        library
      );

      setCurrentStakingRewardsBalance(currentStakingRewardBalance);
    };

    fetchUserInfo();
  }, [account, library]);

  useEffect(() => {
    if (!info.currentAPY) return;

    setApproximateStakingRewards(
      getApproximateStakingRewards(
        getUnformattedNumber(stakingBalance),
        info.currentAPY
      )
    );
  }, [stakingBalance, info.currentAPY]);

  const handleBalanceChange = async (e) => {
    const targetValue = e.target.value;
    const unFormattedNumber = getUnformattedNumber(targetValue);

    let formattedNumber =
      getFormattedNumber(unFormattedNumber) +
      (targetValue[targetValue.length - 1] == "." ? "." : "");

    if (!formattedNumber || formattedNumber == "NaN" || targetValue == "")
      formattedNumber = "";

    setStakingBalance(formattedNumber);

    const expectedTier = await getCurrentTier(
      parseFloat(lockedBalance) + parseFloat(unFormattedNumber)
    );
    setExpectedTier(expectedTier);
  };

  const handleStake = () => {
    if (getUnformattedNumber(stakingBalance) > 0) setIsDialogOpen(true);
  };

  return (
    <div>
      <MobileNav />
      <div className="d-flex justify-content-between">
        <Typography
          color="monoWhite"
          size={14}
          weight={600}
          transform="uppercase"
        >
          Staking
        </Typography>
        <ClaimRewards />
      </div>

      {/* <div className="py-2">
        <Row className="my-3">
          <Col lg={4}>
            <DetailCard
              name="Total staked"
              tokenAmount={info.totalLockedBalance}
              //   changedAmount={4}
              subDetail={
                "Stakers: " + getFormattedNumber(info.totalStakersCount)
              }
            />
          </Col>
          <Col lg={4}>
            <DetailCard
              name="Daily reward distribution"
              tokenAmount={info.dailyRewardRate}
              //   changedAmount={4}
              //   subDetail="All time: 656,544 NIOX"
            />
          </Col>
          <Col lg={4}>
            <DetailCard
              name="Tokens needed to reach next tier"
              tokenAmount={remainNextTierAmount}
              //   subDetail="$1,279.83"
            />
          </Col>
        </Row>
      </div> */}

      <Row className="mt-3">
        <Col lg={9}>
          <Card className="overflow-hidden position-relative">
            {account && lockedBalance ? (
              <StakingSummary
                currentTier={tier}
                currentAPY={info.currentAPY}
                lockPeriod={lockPeriod}
                currentStakedBalance={lockedBalance}
                currentStakingRewardBalance={currentStakingRewardBalance}
              />
            ) : (
              <div>
                <CoinsIcon className="mb-5p" />
                <Typography color="monoWhite" size={24} className="mt-4">
                  Start Staking NIOX!
                </Typography>
                <div className="d-flex justify-content-between mt-3">
                  <Typography color="monoWhite" size={14} weight={400}>
                    Enter the vast world of Autonios extended features
                  </Typography>
                  <LinkButton color="greenMain" size={14}>
                    How it works ???
                  </LinkButton>
                </div>
                <PolygonBackground className="bg-polygon" />
              </div>
            )}
          </Card>
        </Col>
        <Col lg={3}>
          <Card className="">
            <TokenFormGroup className="mb-0">
              <TokenInputGroup>
                <TokenInput
                  placeholder="Type in amount to see results"
                  type="text"
                  className="border rounded"
                  onChange={handleBalanceChange}
                  value={stakingBalance}
                />
                <TokenLabel>
                  <Typography color="monoWhite" size={14} weight={600}>
                    NIOX
                  </Typography>
                </TokenLabel>
              </TokenInputGroup>
              <div className="d-flex mt-2">
                <Typography color="textGrey" size={12} weight={600}>
                  Approximate APY:
                </Typography>
                <Typography
                  color="greenMain"
                  size={12}
                  weight={600}
                  className="ml-2"
                >
                  {getFormattedNumber(info.currentAPY)}%
                </Typography>
                <Typography
                  color="monoWhite"
                  size={12}
                  weight={600}
                  className="ml-1"
                >
                  (~{getFormattedNumber(approximateStakingRewards)} NIOX)
                </Typography>
              </div>
              <div className="d-flex">
                <Typography color="textGrey" size={12} weight={600}>
                  Tier:
                </Typography>
                <Typography
                  color="greenMain"
                  size={12}
                  weight={600}
                  className="ml-2"
                >
                  {stakingPlans[expectedTier]?.name}
                </Typography>
              </div>
              <PrimaryButton className="mt-3 w-100" onClick={handleStake}>
                Stake
              </PrimaryButton>
            </TokenFormGroup>
          </Card>
        </Col>
      </Row>
      <div className="mt-4">
        <StakingPlanTable
          currentTier={tier}
          currentAPY={info.currentAPY}
          lockPeriod={lockPeriod}
          currentStakedBalance={lockedBalance}
        />
      </div>
      <StakingModal
        isDialogOpen={isDialogOpen}
        setIsDialogOpen={setIsDialogOpen}
        stakingBalance={getUnformattedNumber(stakingBalance)}
        stakingPlans={stakingPlans}
        tier={tier}
        currentAPY={info.currentAPY}
        lockPeriod={lockPeriod}
      />
    </div>
  );
};

StakingPage.layout = Admin;

export default StakingPage;
