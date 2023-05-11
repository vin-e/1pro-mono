import type { City, County, State } from '@1pro/components';
import { states } from './states';

export const getStates = async (includeCounties = false, includeCities = false): Promise<State[]> => {
  const s = states.map(async (state) => {
    if (includeCounties) {
      const counties = await getCounties(state);
      state.counties = counties;

      if (includeCities) {
        state.counties.forEach(async (county) => {
          const cities = await getCities(state, county);
          county.cities = cities;
        });
      }
    }
    return state;
  });
  const [...allStates] = await Promise.all(s);
  return allStates;
}

export const getCounties = async (state: State): Promise<County[]> => {
  const { counties } = await import(`./${state.abbreviation.toLowerCase()}/counties.ts`);
  return counties;
}

export const getCities = async (state: State, county: County): Promise<City[]> => {
  const path = `./${state.abbreviation.toLowerCase()}/${county.name.toLowerCase().replaceAll(' ', '-')}-county`;
  const { cities } = await import(`${path}/cities.ts`);
  return cities;
}