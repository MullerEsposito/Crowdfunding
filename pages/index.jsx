import React from "react";
import { CardGroup, Button } from "semantic-ui-react";

import factoryContract from "../ethereum/factoryContract";
import Layout from "../components/Layout";
import Link from "next/link";

function App({ crowdfundings }) {
  const renderCrowdfundings = () => {
    const items = crowdfundings.map(address => {
      return {
        header: address,
        description: (
          <Link href={`/crowdfundings/${address}`} key={address}>
            <a>View Crowdfunding</a>
          </Link>),
        fluid: true
      };
    });

    return <CardGroup items={items} />
  }

  return (
    <Layout>
      <h3>Open Crowdfundings</h3>
      <Link href="/crowdfundings/new">
        <Button
          content="Create Crowdfunding"
          icon="add circle"
          floated="right"
          primary
        />
      </Link>
      { renderCrowdfundings() }
    </Layout>
  );
}

export async function getServerSideProps(context) {
  const crowdfundings = await factoryContract.methods.getCrowdfundings().call();

  return { props: { crowdfundings }};
}

export default App;