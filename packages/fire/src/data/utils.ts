import type { County, State } from '@1pro/components';
import { states } from './states';

export const getStates = async (includeCounties = false, includeCities = false): State[] => {
  const s = states.map(async (state) => {
    if (includeCounties) {
      const counties = await getCounties(state);
      state.counties = counties;

      // TODO - add cities to counties
      // if (includeCities) {
      //   const cities = getCities(state);
      //   state.cities = cities;
      // }
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