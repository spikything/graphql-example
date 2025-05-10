import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  gql,
  useLazyQuery,
} from "@apollo/client";
import { useState } from "react";

const client = new ApolloClient({
  uri: "https://countries.trevorblades.com/",
  cache: new InMemoryCache(),
});

const GET_COUNTRIES_BY_CONTINENT = gql`
  query CountriesByContinent($code: ID!) {
    continent(code: $code) {
      name
      countries {
        code
        name
      }
    }
  }
`;

function Countries() {
  const [continentCode, setContinentCode] = useState("");
  const [fetchCountries, { loading, error, data }] = useLazyQuery(
    GET_COUNTRIES_BY_CONTINENT
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    if (continentCode) {
      fetchCountries({ variables: { code: continentCode.toUpperCase() } });
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <label>
          Enter a continent code (e.g. EU, AF)
          <br />
          <input
            value={continentCode}
            onChange={(e) => setContinentCode(e.target.value)}
            placeholder="EU"
          />
        </label>
        <button type="submit">Search</button>
      </form>

      {loading && <p>Loading...</p>}
      {error && <p>Error 😢</p>}

      {data && (
        <>
          <h3>{data.continent.name}</h3>
          <ul>
            {data.continent.countries.map((country) => (
              <li key={country.code}>{country.name}</li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}

function App() {
  return (
    <ApolloProvider client={client}>
      <h2>Find countries by continent</h2>
      <Countries />
    </ApolloProvider>
  );
}

export default App;
