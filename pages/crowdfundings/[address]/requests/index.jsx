import Link from "next/link";
import { useRouter } from "next/router";
import { Button, Message, Table, TableBody, TableHeader, TableHeaderCell, TableRow } from "semantic-ui-react";

import Layout from "../../../../components/Layout";
import web3 from "../../../../ethereum/web3";
import getCrowdfunding from "../../../../ethereum/crowdfunding";
import RequestRow from "../../../../components/RequestRow";
import { useState } from "react";

function CrowdfundingRequests({ requests, numberOfApprovers }) {
  const [errorMessage, setErrorMessage] = useState("");
  const router = useRouter();
  const { address } = router.query;

  const renderRequestRows = () => {
    return requests.map((request, index) => (
      <RequestRow
        key={index}
        id={index}
        request={request}
        address={address}
        numberOfApprovers={numberOfApprovers}
        setErrorMessage={setErrorMessage}
      />
    ))
  }

  return (
    <Layout>
      <h3>Requests</h3>
      <Link href={`/crowdfundings/${address}/requests/new`}>
        <a>
          <Button primary floated="right" style={{ marginBottom: "10px" }}>New Request</Button>
        </a>
      </Link>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHeaderCell>ID</TableHeaderCell>
            <TableHeaderCell>Description</TableHeaderCell>
            <TableHeaderCell>Amount</TableHeaderCell>
            <TableHeaderCell>Recipient</TableHeaderCell>
            <TableHeaderCell>Approval</TableHeaderCell>
            <TableHeaderCell>Approve</TableHeaderCell>
            <TableHeaderCell>Finalize</TableHeaderCell>
          </TableRow>
        </TableHeader>
        <TableBody>
          { renderRequestRows() }
        </TableBody>
      </Table>
      <div>Found { requests.length } requests.</div>
      <Message error header="Oops!" hidden={!errorMessage} content={errorMessage} />
    </Layout>
  );
}

export async function getServerSideProps(context) {
  const { address } = context.query;
  const crowdfunding = getCrowdfunding(address);

  const requestsTotal = await crowdfunding.methods.getRequestsCount().call();
  const numberOfApprovers = await crowdfunding.methods.numberOfApprovers().call();

  let requests = await Promise.all(
    Array(parseInt(requestsTotal)).fill().map(async (element, index) => {
      const request = await crowdfunding.methods.requests(index).call();
      return {
        description: request.description,
        value: request.value.toString(),
        recipient: request.recipient,
        isComplete: request.isComplete,
        yesVotes: request.yesVotes.toString()
      };
    })
  );

  return { props: { requests, numberOfApprovers: numberOfApprovers.toString() } };
}

export default CrowdfundingRequests;