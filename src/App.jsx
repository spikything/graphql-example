import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  useQuery,
  gql,
} from "@apollo/client";

const client = new ApolloClient({
  uri: "https://countries.trevorblades.com/",
  cache: new InMemoryCache(),
});

const GET_COUNTRIES = gql`
  query {
    countries {
      code
      name
    }
  }
`;

function Countries() {
  const { loading, error, data } = useQuery(GET_COUNTRIES);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error 😢</p>;

  return (
    <ul>
      {data.countries.slice(0, 10).map((country) => (
        <li key={country.code}>{country.name}</li>
      ))}
    </ul>
  );
}

function App() {
  return (
    <ApolloProvider client={client}>
      <h1>Countries</h1>
      <Countries />
    </ApolloProvider>
  );
}

export default App;
