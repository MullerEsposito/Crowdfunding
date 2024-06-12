import { useRouter } from "next/router";
import { Button, CardGroup, Grid, GridColumn, GridRow } from "semantic-ui-react";

import Layout from "../../../components/Layout";
import ContributeForm from "../../../components/ContributeForm";
import crowdfundingContract from "../../../ethereum/crowdfunding";
import web3 from "../../../ethereum/web3";
import Link from "next/link";

function CrowdfundingShow({ managerAddress, minimumContribution, numberOfRequests, numberOfApprovers, balance }) {
  const router = useRouter();
  const { address } = router.query;


  const renderCards = () => {
    const items = [
      {
        header: managerAddress,
        meta: "Address of Manager",
        description: "The manager created this crowdfunding and can create requests to withdraw money",
        style: { overflowWrap: "break-word" }
      },
      {
        header: minimumContribution,
        meta: "Minimum Contribution (wei)",
        description: "You must contribute at least this much wei to become a approver"
      },
      {
        header: numberOfRequests,
        meta: "Number of Requests",
        description: "A request tries to withdraw money from the contract. Requests must be approved by approvers"
      },
      {
        header: numberOfApprovers,
        meta: "Number of Approvers",
        description: "Number of people who have already donated to this crowdfunding"
      },
      {
        header: web3.utils.fromWei(balance, "ether"),
        meta: "Crowdfunding Balance (ether)",
        description: "Balance is how much money this crowdfunding has left to spend"
      }
    ]

    return <CardGroup items={items} />
  }
  
  return (
    <Layout>
      <h3>Crowdfunding Address: { address } </h3>
      <Grid>
        <GridRow>
          <GridColumn width={10}>
            { renderCards() }
          </GridColumn>
          <GridColumn width={6}>
            <ContributeForm address={address} />
          </GridColumn>
        </GridRow>
        <GridRow>
          <GridColumn>
            <Link href={`/crowdfundings/${address}/requests`}>
              <a>
                <Button primary>Requests</Button>
              </a>
            </Link>
          </GridColumn>
        </GridRow>
      </Grid>
    </Layout>
  )
}

export async function getServerSideProps(context) {
  const { address } = context.query;
  const crowdfunding = crowdfundingContract(address);

  const summary = await crowdfunding.methods.getSummary().call();
  let { managerAddress, minimumContribution, numberOfApprovers, numberOfRequests, balance } = summary;
  minimumContribution = minimumContribution.toString();
  numberOfApprovers = numberOfApprovers.toString();
  numberOfRequests = numberOfRequests.toString();
  balance = balance.toString();
  
  return { props: { managerAddress, minimumContribution, numberOfApprovers, numberOfRequests, balance } };
}

export default CrowdfundingShow;