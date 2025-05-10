import { useState } from "react";
import { useQuery, useLazyQuery, gql } from "@apollo/client";

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

export default function Countries() {
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
        Select continent
        <br />
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
          <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
            {data.continent.countries.map((country) => (
              <li key={country.code}>
                <img
                  width={48}
                  height={36}
                  src={`//flagcdn.com/48x36/${country.code.toLowerCase()}.png`}
                  alt={`${country.name} flag`}
                  style={{ marginRight: "0.5em", verticalAlign: "middle" }}
                  loading="lazy"
                />
                {country.name}
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}
