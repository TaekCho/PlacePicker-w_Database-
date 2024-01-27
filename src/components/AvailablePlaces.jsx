import { useEffect, useState } from "react";

import Places from "./Places.jsx";
import Error from "./Error.jsx";
import { sortPlacesByDistance } from "../loc.js";
import { fetchAvailablePlaces } from "../http.js";

export default function AvailablePlaces({ onSelectPlace }) {
  // When fetching, it is normal to have three states as below: loading, error, and data being fetched.
  const [isFetching, setIsFetching] = useState(false); // loading state to sync naturally
  const [availablePlaces, setAvailablePlaces] = useState([]); // data state being fetched
  const [error, setError] = useState(); // error state to show potential errors

  // this will come in effect when the component is first mounted
  useEffect(() => {
    // CAN'T use async for FUNCTION COMPONENT, so placed here.
    async function fetchPlaces() {
      setIsFetching(true);

      try {
        // await is necessary when calling an async function
        const places = await fetchAvailablePlaces();

        navigator.geolocation.getCurrentPosition((position) => {
          const sortedPlaces = sortPlacesByDistance(
            places,
            position.coords.latitude,
            position.coords.longitude
          );
          setAvailablePlaces(resData.places);
          setIsFetching(false);
        });

        // This setState has to be within `try` so that when we make it to the end
        //  of this block, all the data will be there.
        setAvailablePlaces(resData.places);
      } catch (error) {
        setError({
          message:
            error.message || "Could not fetch places, please try again later!",
        });
      }
    }

    fetchPlaces();
  }, []);

  if (error) {
    return <Error title="An error occured!" message={error.message} />;
  }

  return (
    <Places
      title="Available Places"
      places={availablePlaces}
      isLoading={isFetching}
      fallbackText="No places available."
      loadingText="Fetching place data..."
      onSelectPlace={onSelectPlace}
    />
  );
}
