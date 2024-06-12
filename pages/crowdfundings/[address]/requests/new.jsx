import { Button, Form, FormField, Input, Message } from "semantic-ui-react";
import Layout from "../../../../components/Layout";
import { useState } from "react";
import getCrowdfunding from "../../../../ethereum/crowdfunding";
import { useRouter } from "next/router";
import web3 from "../../../../ethereum/web3";
import Link from "next/link";

function CrowdfundingRequestsNew() {
  const [newrequestDescription, setNewrequestDescription] = useState("");
  const [newrequestValue, setNewrequestValue] = useState("");
  const [newrequestRecipient, setNewrequestRecipient] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();
  const { address } = router.query;

  const handleSubmit = async e => {
    e.preventDefault();

    const crowdfunding = getCrowdfunding(address);

    setIsLoading(true);
    setErrorMessage("");
    try {
      const accounts = await web3.eth.getAccounts();
      await crowdfunding.methods
        .createRequest(newrequestDescription, web3.utils.toWei(newrequestValue, "ether"), newrequestRecipient)
        .send({ from: accounts[0] });
      
      router.push(`/crowdfundings/${address}/requests`);
    } catch (error) {
      setErrorMessage(error.message);
    }
    setIsLoading(false);
  }

  return (
    <Layout>
      <Link href={`/crowdfundings/${address}/requests`}>
        <a>
          <Button primary>Back</Button>
        </a>
      </Link>
      <h3>Create New Request</h3>
      <Form onSubmit={handleSubmit} error={!!errorMessage}>
        <FormField>
          <label htmlFor="newrequest-description">Description</label>
          <Input
            id="newrequest-description"
            onChange={ e => setNewrequestDescription(e.target.value)}
            value={newrequestDescription}
          />
        </FormField>
        <FormField>
          <label htmlFor="newrequest-value">Value in Ether</label>
          <Input
            id="newrequest-value"
            onChange={ e => setNewrequestValue(e.target.value)}
            value={newrequestValue}
          />
        </FormField>
        <FormField>
          <label htmlFor="newrequest-recipient">Recipient</label>
          <Input
            id="newrequest-recipient"
            onChange={ e => setNewrequestRecipient(e.target.value)}
            value={newrequestRecipient}
          />
        </FormField>

        <Message error header="Oops!" content={errorMessage}  />
        <Button loading={isLoading} primary>Create</Button>
      </Form>
    </Layout>
  );
}

export default CrowdfundingRequestsNew;