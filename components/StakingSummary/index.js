import { DefaultButton } from "../Buttons";
import Typography from "../Typography";
import styled from "styled-components";
import { Col, Row } from "reactstrap";
import Card from "../Card";
import {
  getFormattedDateMonthAndYear,
  getFormattedNumber,
} from "../../utils/formatters";
import { stakingPlans } from "../../utils/constants";

const SummaryWrapper = styled.div`
  border: ${({ theme }) => `1px solid ${theme.color.monoGrey2}`};
  padding: 12px;
  border-radius: 4px;
`;

const StakingSummary = ({
  currentTier,
  currentAPY,
  lockPeriod,
  currentStakedBalance,
  currentStakingRewardBalance,
}) => {
  const handleUnStake = () => {};

  return (
    <>
      <div className="d-flex justify-content-between">
        <Typography color="monoWhite" size={20}>
          Staking Summary
        </Typography>
        <DefaultButton
          size={10}
          background="monoGrey2"
          color="monoWhite"
          onClick={handleUnStake}
        >
          Unstake
        </DefaultButton>
      </div>
      <Row className="mt-3">
        <Col lg={4}>
          <SummaryWrapper>
            <Typography size={12} color="textGrey">
              Currently in staking
            </Typography>
            <Typography size={20} color="monoWhite">
              {getFormattedNumber(currentStakedBalance)} NIOX
            </Typography>
            <Typography size={10} color="textGrey" weight={400}>
              In staking till {getFormattedDateMonthAndYear(lockPeriod)}
            </Typography>
          </SummaryWrapper>
        </Col>
        <Col lg={4}>
          <SummaryWrapper>
            <Typography size={12} color="textGrey">
              Current APY
            </Typography>
            <Typography size={20} color="monoWhite">
              {getFormattedNumber(currentAPY)}%
            </Typography>
            <Typography size={10} color="textGrey" weight={400}>
              Reward multiplier: {stakingPlans[currentTier].multiplier}x
            </Typography>
          </SummaryWrapper>
        </Col>
        <Col lg={4}>
          <SummaryWrapper>
            <Typography size={12} color="textGrey">
              Current Staking Reward
            </Typography>
            <Typography
              size={20}
              color="monoWhite"
              className="d-flex align-items-center"
            >
              {currentStakingRewardBalance ? (
                <Typography color="greenBuy" className="mr-1">
                  +
                </Typography>
              ) : (
                ""
              )}
              {getFormattedNumber(currentStakingRewardBalance)} NIOX
            </Typography>
            <Typography size={10} color="textGrey" weight={400}>
              Since 20.06.2021
            </Typography>
          </SummaryWrapper>
        </Col>
      </Row>
    </>
  );
};

export default StakingSummary;
