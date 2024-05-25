import React from "react";
import { CardGroup, Button } from "semantic-ui-react";

import factoryContract from "../ethereum/factoryContract";
import Layout from "../components/Layout";

function App({ crowdfundings }) {
  const renderCrowdfundings = () => {
    const items = crowdfundings.map(address => {
      return {
        header: address,
        description: <a>View Crowdfunding</a>,
        fluid: true
      };
    });

    return <CardGroup items={items} />
  }

  return (
    <Layout>
      <h3>Open Crowdfundings</h3>
      <Button
        content="Create Crowdfunding"
        icon="add circle"
        floated="right"
        primary
      />
      { renderCrowdfundings() }
    </Layout>
  );
}

export async function getServerSideProps(context) {
  const crowdfundings = await factoryContract.methods.getCrowdfundings().call();

  return { props: { crowdfundings }};
}

export default App;