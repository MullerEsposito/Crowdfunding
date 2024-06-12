import React, { useState } from "react";
import { Button, Form, FormField, Input, Message } from "semantic-ui-react";
import { useRouter } from "next/router";


import Layout from "../../components/Layout";
import factoryContract from "../../ethereum/factoryContract";
import web3 from "../../ethereum/web3";

function CrowdfundingNew() {
  const [minimumContribution, setMinimumContribution] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  
  const router = useRouter();

  const onSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage("");

    try {
      const accounts = await web3.eth.getAccounts();
      await factoryContract.methods.createCrowdfunding(minimumContribution).send({
        from: accounts[0]
      });
      router.push("/");
    } catch (error) {
      setErrorMessage(error.message);
    }

    setLoading(false);
  }

  return (
    <Layout>
      <h3>Create Crowdfunding</h3>

      <Form onSubmit={onSubmit} error={!!errorMessage}>
        <FormField>
          <label htmlFor="">Minimum Contribution</label>
          <Input 
            label="wei" 
            labelPosition="right" 
            value={minimumContribution}
            onChange={e => setMinimumContribution(e.target.value)}
          />
        </FormField>

        <Message 
          error
          header="Oops!"
          content={errorMessage}
        />
        <Button loading={loading} primary>Create</Button>
      </Form>
    </Layout>
  );
}

export default CrowdfundingNew;