import { useState } from "react";
import { Button, Form, FormField, Input, Message } from "semantic-ui-react";

import crowdfundingContract from "../ethereum/crowdfunding";
import web3 from "../ethereum/web3";
import { useRouter } from "next/router";

function ContributeForm({ address }) {
  const [contributionValue, setContributionValue] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async e => {
    e.preventDefault();

    const crowdfunding = crowdfundingContract(address);

    setIsLoading(true);
    setErrorMessage("");
    try {
      const accounts = await web3.eth.getAccounts();
      await crowdfunding.methods.contribute().send({
        from: accounts[0],
        value: web3.utils.toWei(contributionValue, "ether"),
      });
      router.replace(`/crowdfundings/${address}`);
    } catch (error) {
      setErrorMessage(error.message);
    }

    setIsLoading(false);
    setContributionValue("");
  }

  return (
    <Form onSubmit={handleSubmit} error={!!errorMessage}>
      <FormField>
        <label>Amount to Contribute</label>
        <Input 
          onChange={ e => setContributionValue(e.target.value)}
          value = {contributionValue}
          label="ether" 
          labelPosition="right" 
        />
      </FormField>
      <Message error header="Oops!" content={errorMessage} />
      <Button primary loading={isLoading}>Contribute</Button>
    </Form>
  );
}

export default ContributeForm;