import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  gql,
  useLazyQuery,
  useQuery,
} from "@apollo/client";
import { useState } from "react";

const client = new ApolloClient({
  uri: "https://countries.trevorblades.com/",
  cache: new InMemoryCache(),
});

const GET_CONTINENTS = gql`
  query {
    continents {
      code
      name
    }
  }
`;

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
  const {
    loading: continentsLoading,
    error: continentsError,
    data: continentsData,
  } = useQuery(GET_CONTINENTS);
  const [fetchCountries, { loading, error, data }] = useLazyQuery(
    GET_COUNTRIES_BY_CONTINENT
  );

  const [selectedCode, setSelectedCode] = useState("");

  const handleSelect = (e) => {
    const code = e.target.value;
    setSelectedCode(code);
    if (code) {
      fetchCountries({ variables: { code } });
    }
  };

  if (continentsLoading) return <p>Loading continents...</p>;
  if (continentsError) return <p>Error loading continents 😢</p>;

  return (
    <div>
      <label>
        Select continent<br />
        <select value={selectedCode} onChange={handleSelect}>
          <option value="">-- Select --</option>
          {continentsData.continents.map((continent) => (
            <option key={continent.code} value={continent.code}>
              {continent.name}
            </option>
          ))}
        </select>
      </label>

      {loading && <p>Loading countries...</p>}
      {error && <p>Error loading countries 😢</p>}

      {data && (
        <>
          <h2>{data.continent.name}</h2>
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
