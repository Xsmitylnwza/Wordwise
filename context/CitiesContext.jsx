import {createContext, useContext, useEffect, useReducer} from "react";
import {supabase} from "../supabaseClient";

const CitiesContext = createContext();

const initialState = {
  cities: [],
  isLoading: false,
  currentCity: {},
  error: "",
};

function reducer(state, action) {
  switch (action.type) {
    case "loading":
      return {...state, isLoading: true};
    case "cities/loaded":
      return {...state, isLoading: false, cities: action.payload};
    case "city/loaded":
      return {...state, isLoading: false, currentCity: action.payload};
    case "city/created":
      console.log(action.payload);

      return {
        ...state,
        isLoading: false,
        cities: [...state.cities, action.payload],
      };
    case "city/deleted":
      return {
        ...state,
        isLoading: false,
        cities: state.cities.filter((city) => city.id !== action.payload),
      };
    case "rejected":
      return {
        ...state,
        isLoading: false,
        error: action.payload,
        currentCity: {},
      };
    default:
      throw new Error("Unknown action type");
  }
}

function CitiesProvider({children}) {
  const [{cities, isLoading, currentCity, error}, dispatch] = useReducer(
    reducer,
    initialState
  );

  useEffect(() => {
    async function fetchCities() {
      dispatch({type: "loading"});

      let {data, error} = await supabase.from("cities").select("*");

      if (error) {
        dispatch({type: "rejected", payload: "Error loading data"});
      } else {
        dispatch({type: "cities/loaded", payload: data});
      }
    }

    fetchCities();
  }, []);

  async function getCity(id) {
    if (Number(id) === currentCity.id) return;
    dispatch({type: "loading"});
    const {data, error} = await supabase
      .from("cities")
      .select("*")
      .eq("id", id)
      .single();
    if (error) {
      dispatch({type: "rejected", payload: "Error loading city"});
    } else {
      dispatch({type: "city/loaded", payload: data});
    }
  }

  async function createCity(newCity) {
    dispatch({type: "loading"});
    const {data, error} = await supabase
      .from("cities")
      .insert(newCity)
      .select()
      .single();

    if (error) {
      dispatch({type: "rejected", payload: "Error creating city"});
    } else {
      dispatch({type: "city/created", payload: data});
    }
  }

  async function deleteCity(id) {
    dispatch({type: "loading"});
    const {error} = await supabase.from("cities").delete().eq("id", id);
    if (error) {
      dispatch({type: "rejected", payload: "Error deleting city"});
    } else {
      dispatch({type: "city/deleted", payload: id});
    }
  }

  return (
    <CitiesContext.Provider
      value={{
        cities,
        isLoading,
        currentCity,
        error,
        getCity,
        createCity,
        deleteCity,
      }}
    >
      {children}
    </CitiesContext.Provider>
  );
}

function useCities() {
  const context = useContext(CitiesContext);
  if (context === undefined)
    throw new Error("useCities must be used within a CitiesProvider");
  return context;
}

export {CitiesProvider, useCities};
