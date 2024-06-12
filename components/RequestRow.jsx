import { Button, TableCell, TableRow } from "semantic-ui-react";

import web3 from "../ethereum/web3";
import getCrowdfunding from "../ethereum/crowdfunding";
import { useState } from "react";
import { useRouter } from "next/router";

function RequestRow({ id, request, numberOfApprovers, address, setErrorMessage }) {
  const [isApproveLoading, setIsApproveLoading] = useState(false);
  const [isFinalizeLoading, setIsFinalizeLoading] = useState(false);
  const router = useRouter();
  const isReadyToFinalize = request.yesVotes > numberOfApprovers / 2;

  const handleClickApprove = async () => {
    const crowdfunding = getCrowdfunding(address);
    const accounts = await web3.eth.getAccounts();

    setIsApproveLoading(true);
    setErrorMessage("");
    try {
      await crowdfunding.methods.approveRequest(id).send({
        from: accounts[0]
      });
      router.replace(`/crowdfundings/${address}/requests`);
    } catch (e) {
      setErrorMessage(e.message);
    }
    setIsApproveLoading(false);
  };

  const handleClickFinalize = async () => {
    const crowdfunding = getCrowdfunding(address);
    const accounts = await web3.eth.getAccounts();

    setIsFinalizeLoading(true);
    setErrorMessage("");
    try {
      await crowdfunding.methods.finalizeRequest(id).send({
        from: accounts[0]
      });
      router.replace(`/crowdfundings/${address}/requests`);
    } catch (e) {
      setErrorMessage(e.message);
    }
    setIsFinalizeLoading(false);
  }

  return (
    <TableRow disabled={request.isComplete} positive={isReadyToFinalize && !request.isComplete}>
      <TableCell>{ id }</TableCell>
      <TableCell>{ request.description }</TableCell>
      <TableCell>{ web3.utils.fromWei(request.value, "ether") + " ether" }</TableCell>
      <TableCell>{ request.recipient }</TableCell>
      <TableCell>{ request.yesVotes + "/" + numberOfApprovers}</TableCell>
      { request.isComplete ? null : (<>
      <TableCell>
        <Button loading={isApproveLoading} color="green" basic onClick={handleClickApprove}>Approve</Button>
      </TableCell>
      <TableCell>
        <Button loading={isFinalizeLoading} color="red" basic onClick={handleClickFinalize}>Finalize</Button>
      </TableCell>
      </>)}
    </TableRow>
  );
}

export default RequestRow;