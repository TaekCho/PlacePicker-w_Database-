import { useEffect, useState } from "react";

import Places from "./Places.jsx";

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
        const response = await fetch("http://localhost:3000/places");
        const resData = await response.json();

        // In a case of error as below, it will crash the application.
        if (!response.ok) {
          throw new Error("Failed to fetch places");
        }
        // This setState has to be within `try` so that when we make it to the end
        //  of this block, all the data will be there.
        setAvailablePlaces(resData.places);
      } catch (error) {}

      // placed as below so as to end the loading state regardless of a possible error.
      setIsFetching(false);
    }

    fetchPlaces();
  }, []);

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
