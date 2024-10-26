import styles from "./CountryItem.module.css";

function CountryItem({country}) {
  console.log(country);
  return (
    <li className={styles.countryItem}>
      <span>{country.emoji}</span>
      <span>{country.country}</span>
      {/* {country} */}
    </li>
  );
}

export default CountryItem;
