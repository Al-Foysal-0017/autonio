import { getFormattedNumber } from "../../utils/formatters";
import Card from "../Card";
import Typography from "../Typography";
import UpIcon from "../../assets/img/icons/up.svg";
import styled from "styled-components";
import { LinkButton } from "../Buttons";
import { useUser } from "contexts/UserContext";
import { ContractAddress } from "../../assets/constants/addresses";
import StakingRewardsABI from "../../assets/constants/abi/StakingRewards.json";
import {
  defaultGasLimit,
  fetchStakingRewardsBalance,
  getGasPrice,
} from "../../utils/ethereum";
import { ethers } from "ethers";
import DropdownMenu from "../DropdownMenu";
import { useEffect, useState } from "react";
import { CARD_PERIODS } from "../../utils/constants";
import WalletModal from "../WalletModal";
import { useRouter } from "next/router";

const LabelWrapper = styled.div`
  background: ${({ theme }) => theme.color.greenBuy10};
  border-radius: 20px;
  padding: 3px 8px 3px 6px;
  color: ${({ theme, active }) =>
    active ? theme.color.greenMain : theme.color.monoWhite};
  font-size: 10px;
`;

export const StakingRewardsCard = ({ blockNumber }) => {
  const changedAmount = 4;
  const currencyName = "usd";
  const currencyAmount = 1279.83;
  const changedPercent = 3.14;
  //   const tokenAmount = 12500;
  const [tokenAmount, setTokenAmount] = useState(0);
  const { library, account } = useUser();
  const [selectedPeriod, setSelectedPeriod] = useState(1);
  const [openWalletModal, setOpenWalletModal] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchBalance = async () => {
      if (!library || !account) return;

      const signer = await library.getSigner(account);
      const amount = await fetchStakingRewardsBalance(account, signer);

      setTokenAmount(amount);
    };

    fetchBalance();
  }, [account, library, blockNumber]);

  return (
    <Card>
      <div className="d-flex justify-content-between">
        <Typography color="monoWhite" opacity={0.5} size={12}>
          Staking Rewards
        </Typography>
        <DropdownMenu
          menus={CARD_PERIODS}
          selected={selectedPeriod}
          setSelected={setSelectedPeriod}
        />
      </div>

      <div className="d-flex mt-2">
        <Typography
          transform="uppercase"
          color="monoWhite"
          size={24}
          weight={600}
        >
          {getFormattedNumber(tokenAmount)} NIOX
        </Typography>
        {/* {changedAmount && (
          <div className="ml-2">
            <Typography
              color={changedAmount > 0 ? "greenBuy" : "greenBuy"}
              size={10}
            >
              {(changedAmount > 0 ? "+" : "-") + changedAmount} NIOX
            </Typography>
            <Typography color="monoWhite" opacity={0.5} size={10}>
              24h change
            </Typography>
          </div>
        )} */}
      </div>
      {/* <div className="d-flex">
        <Typography color="textGrey" size={14}>
          {currencyName === "bitcoin" ? "₿" : "$"} {currencyAmount}
        </Typography>
        <LabelWrapper className="ml-2">
          <Typography size={10} color="greenBuy">
            <img src={UpIcon} /> {changedPercent} %
          </Typography>
        </LabelWrapper>
      </div> */}

      <div className="d-flex justify-content-between mt-4">
        {account ? (
          <>
            <LinkButton
              color="greenMain"
              size={11}
              weight={700}
              onClick={() => router.push("/staking")}
            >
              Staking Calculator →
            </LinkButton>
          </>
        ) : (
          <LinkButton
            color="greenMain"
            size={11}
            weight={700}
            onClick={() => setOpenWalletModal(true)}
          >
            Connect wallet →
          </LinkButton>
        )}
      </div>
      <WalletModal open={openWalletModal} setOpen={setOpenWalletModal} />
    </Card>
  );
};

export default StakingRewardsCard;
