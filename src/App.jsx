import { ApolloClient, InMemoryCache, ApolloProvider } from "@apollo/client";
import Countries from "./components/Countries";

const client = new ApolloClient({
  uri: "https://countries.trevorblades.com/",
  cache: new InMemoryCache(),
});

function App() {
  return (
    <ApolloProvider client={client}>
      <h2>Find countries by continent</h2>
      <Countries />
    </ApolloProvider>
  );
}

export default App;
